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
const webJson = readFileSync(fileURLToPath(new URL('inspectionDeficiencies.json', webLib)), 'utf8');
const appJson = readFileSync(fileURLToPath(new URL('src/data/inspectionDeficiencies.json', root)), 'utf8');
assert.strictEqual(appJson, webJson, 'inspectionDeficiencies.json has drifted from the web copy');
checked++;

console.log(`dataParity.check.ts OK — ${checked} data files match the web build`);
