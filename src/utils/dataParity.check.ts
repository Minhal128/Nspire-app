/**
 * Self-check that the deficiency data is still the web build's.
 *
 *   node --experimental-strip-types src/utils/dataParity.check.ts
 *
 * src/data/web/* are verbatim copies of inspire-web/lib/*. The app reads its
 * deficiency options only through those files, so if a copy drifts from the web
 * original the two products start scoring the same inspection differently — which
 * is exactly what this guards. Skips itself when the web repo is not checked out
 * beside the app.
 */

import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const webLib = new URL('../inspire-web/lib/', root);

if (!existsSync(fileURLToPath(webLib))) {
  console.log('dataParity.check.ts SKIPPED — inspire-web is not checked out beside the app');
  process.exit(0);
}

/** Copies that must match their web original byte for byte. */
const VERBATIM = ['outsideAppData.ts', 'insideAppData.ts', 'unitAppData.ts'];

/** Copies that differ from the original only by import paths we had to rewrite. */
const PATCHED: Record<string, [from: string, to: string][]> = {
  'webDeficiencyMapping.ts': [],
  'webUnitDeficiencyMapping.ts': [
    [
      "import { DeficiencyDetail } from './deficiencyMapping';",
      "import type { DeficiencyDetail } from './webDeficiencyMapping';",
    ],
  ],
};

const read = (url: URL) => readFileSync(fileURLToPath(url), 'utf8').replace(/\r\n/g, '\n');

let checked = 0;

for (const name of VERBATIM) {
  const web = read(new URL(name, webLib));
  const app = read(new URL(`src/data/web/${name}`, root));
  assert.strictEqual(
    app,
    web,
    `src/data/web/${name} has drifted from inspire-web/lib/${name} — re-copy it`
  );
  checked++;
}

for (const [name, patches] of Object.entries(PATCHED)) {
  const webName =
    name === 'webDeficiencyMapping.ts' ? 'deficiencyMapping.ts'
      : name === 'webUnitDeficiencyMapping.ts' ? 'unitDeficiencyMapping.ts'
        : name;
  let web = read(new URL(webName, webLib));
  for (const [from, to] of patches) {
    assert.ok(web.includes(from), `expected ${webName} to contain:\n  ${from}`);
    web = web.replace(from, to);
  }
  const app = read(new URL(`src/data/web/${name}`, root));
  assert.strictEqual(
    app,
    web,
    `src/data/web/${name} has drifted from inspire-web/lib/${webName} — re-copy and re-apply its import patch`
  );
  checked++;
}

/** The app must read deficiency options only from those copies. */
const mapping = read(new URL('src/data/deficiencyMapping.ts', root));
for (const forbidden of ['./outsideDeficiencyMapping', './insideDeficiencyMapping', './unitDeficiencyMapping']) {
  assert.ok(
    !mapping.includes(`from '${forbidden}'`),
    `deficiencyMapping.ts imports ${forbidden} — the pre-parity data files must not feed the screens`
  );
}
for (const required of ['./web/webDeficiencyMapping', './web/webUnitDeficiencyMapping']) {
  assert.ok(mapping.includes(required), `deficiencyMapping.ts should source its options from ${required}`);
}

/** Web has no subcategory step, so neither should the app. */
assert.ok(
  /hasSubcategories\s*=\s*\([^)]*\)\s*:\s*boolean\s*=>\s*false/.test(mapping),
  'hasSubcategories must stay false — web shows one flat deficiency list per item'
);

/** Standard / Inspection Protocol come from the shared JSON, not from the option fields. */
const json = JSON.parse(readFileSync(fileURLToPath(new URL('src/data/inspectionDeficiencies.json', root)), 'utf8'));
for (const section of ['outside', 'inside', 'unit']) {
  assert.ok(Array.isArray(json[section]) && json[section].length > 0, `inspectionDeficiencies.json is missing ${section}`);
  const first = json[section][0];
  for (const field of ['category', 'deficiencySelected', 'standard', 'inspectionProtocol']) {
    assert.ok(field in first, `inspectionDeficiencies.json ${section}[0] is missing ${field}`);
  }
}
// Compared through read(), which strips \r: git's autocrlf decides the line
// endings on checkout, so a byte comparison here fails on content that matches.
const webJson = read(new URL('inspectionDeficiencies.json', webLib));
const appJson = read(new URL('src/data/inspectionDeficiencies.json', root));
assert.strictEqual(appJson, webJson, 'inspectionDeficiencies.json has drifted from the web copy');
checked++;

/* ---- the report generator is the web build's too ---- */

{
  // src/services/web/* back the PDF/preview report, so the app and web produce
  // the same document. Verified once by rendering both on the same input and
  // comparing the HTML byte for byte; this keeps the copies honest.
  assert.strictEqual(
    read(new URL('src/services/web/nspireReport.ts', root)),
    read(new URL('nspireReport.ts', webLib)),
    'src/services/web/nspireReport.ts has drifted from inspire-web/lib/nspireReport.ts'
  );
  checked++;

  // The one deviation from the original: RN has no window, so the logo is injected.
  const LOGO_FROM = [
    `} from './nspireReport';
`,
    `  let logoSrc = '/logo.png';
  if (typeof window !== 'undefined') {
    logoSrc = window.location.origin + '/logo.png';
  }
`,
  ];
  const LOGO_TO = [
    `} from './nspireReport';

/** Set by the app so the report header can embed the logo without a network fetch. */
let injectedLogo = '';
export function setReportLogo(dataUri: string): void {
  injectedLogo = dataUri || '';
}
`,
    `  // Only deviation from the web original: React Native has no window and cannot
  // resolve /logo.png, so the app injects a base64 logo through setReportLogo().
  let logoSrc = injectedLogo || '/logo.png';
  if (!injectedLogo && typeof window !== 'undefined') {
    logoSrc = window.location.origin + '/logo.png';
  }
`,
  ];

  let expected = read(new URL('enhancedNspirePDFService.ts', webLib));
  LOGO_FROM.forEach((from, i) => {
    assert.ok(
      expected.includes(from),
      'inspire-web/lib/enhancedNspirePDFService.ts no longer contains the patched region ' + i
    );
    expected = expected.replace(from, LOGO_TO[i]);
  });
  assert.strictEqual(
    read(new URL('src/services/web/enhancedNspirePDFService.ts', root)),
    expected,
    'src/services/web/enhancedNspirePDFService.ts has drifted from the web original — re-copy it and re-apply the logo patch'
  );
  checked++;

  // And the app must render the report through that copy, not its own template.
  const svc = read(new URL('src/services/enhancedNspirePDFService.ts', root));
  assert.ok(
    svc.includes("from './web/enhancedNspirePDFService'"),
    'the app report service should generate its HTML through src/services/web/'
  );
  assert.ok(svc.includes('getWebReportHTML('), 'the finished report must come from the web generator');
}

console.log(`dataParity.check.ts OK — ${checked} data files match the web build`);
