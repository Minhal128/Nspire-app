/**
 * Self-check that property lists ask for every property.
 *
 *   node --experimental-strip-types src/utils/propertyLists.check.ts
 *
 * GET /properties answers with the newest ten unless a limit is sent. A list
 * that sent none showed ten properties and no sign that there were more: the
 * eleventh could only be reached by searching for it. The dashboard sent 50,
 * which only moved the cliff.
 */

import assert from 'node:assert';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (url: URL) => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');

/** Every call to `fn(` in `source`, with what follows it. */
const callsTo = (source: string, fn: string): string[] => {
  const calls: string[] = [];
  let at = source.indexOf(fn);
  while (at >= 0) {
    calls.push(source.slice(at, at + 320));
    at = source.indexOf(fn, at + fn.length);
  }
  return calls;
};

// --- the app's screens ---------------------------------------------------------
const screens = new URL('src/screens/', root);
let appCalls = 0;
for (const name of readdirSync(fileURLToPath(screens))) {
  if (!name.endsWith('.tsx')) continue;
  const source = read(new URL(name, screens));
  for (const call of callsTo(source, 'propertyService.getProperties(')) {
    appCalls++;
    assert.ok(
      !/^propertyService\.getProperties\(\s*\)/.test(call),
      `${name}: getProperties() with no limit gets the newest ten properties, not all of them`,
    );
  }
}
assert.ok(appCalls >= 6, `expected the property lists to be found in the screens, found ${appCalls} call(s)`);

const dashboard = read(new URL('DashboardScreen.tsx', screens));
assert.ok(
  dashboard.includes('const propertyFilters: any = { limit: 1000 };'),
  'DashboardScreen: the dashboard must ask for every property',
);

// --- the web's pages, when it is checked out beside the app ---------------------
const webApp = new URL('../inspire-web/app/', root);
if (existsSync(fileURLToPath(webApp))) {
  const portals = ['dashboard', 'management/dashboard', 'asset-manager/dashboard', 'other/dashboard', 'admin'];
  let webCalls = 0;
  for (const portal of portals) {
    for (const page of ['page.tsx', 'my-inspection/page.tsx', 'inspection-status/page.tsx']) {
      const source = read(new URL(`${portal}/${page}`, webApp));
      for (const call of callsTo(source, 'propertiesAPI.getAll(')) {
        webCalls++;
        assert.ok(
          call.slice(0, call.indexOf('\n      })') > 0 ? call.indexOf('\n      })') : 80).includes('limit: 1000'),
          `inspire-web ${portal}/${page}: a property list must ask for every property`,
        );
      }
    }
  }
  assert.ok(webCalls >= 15, `expected the web property lists to be found, found ${webCalls} call(s)`);
} else {
  console.log('propertyLists.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

// --- inspections: the same cliff, one layer down --------------------------------
// GET /inspections answers with ten as well. A list placed those ten against
// its properties, so the eleventh inspected property showed no report. The
// lists ask for the server's list view -- every inspection, without pictures
// and long texts -- and a report fetches the whole inspection it is made from.
const status = read(new URL('InspectionStatusScreen.tsx', screens));
const mine = read(new URL('MyInspectionsScreen.tsx', screens));
for (const [name, source] of [['InspectionStatusScreen', status], ['MyInspectionsScreen', mine]] as const) {
  assert.ok(
    source.includes("inspectionService.getInspections({ view: 'list' })"),
    `${name}: the list must ask for every inspection, in the list view`,
  );
  assert.ok(
    !/inspectionService\.getInspections\(\s*\)/.test(source),
    `${name}: getInspections() asked plainly gets the ten newest inspections`,
  );
}
const service = read(new URL('src/services/inspectionService.ts', root));
assert.ok(
  service.includes("if (filters.view) params.append('view', filters.view);"),
  'inspectionService.getInspections must pass the view on to the server',
);

// The list view has no pictures and no long texts, so nothing may build a
// report straight from a row.
for (const handler of ['handleDownloadPDF', 'handlePrintExcel', 'handleDownloadExcel', 'handleViewReport']) {
  const from = status.indexOf(`const ${handler} = async (property: PropertyWithInspection) => {`);
  assert.ok(from > 0, `InspectionStatusScreen: ${handler} not found`);
  const body = status.slice(from, status.indexOf('\n  };\n', from));
  assert.ok(
    body.includes('await withWholeInspection(property)') && body.includes('buildReport(whole)'),
    `InspectionStatusScreen: ${handler} must build its report from the whole inspection, not the list's copy`,
  );
  assert.ok(!body.includes('buildReport(property)'), `InspectionStatusScreen: ${handler} still reads the list's copy`);
}

if (existsSync(fileURLToPath(webApp))) {
  for (const portal of ['dashboard', 'management/dashboard', 'asset-manager/dashboard', 'other/dashboard', 'admin']) {
    for (const page of ['my-inspection/page.tsx', 'inspection-status/page.tsx']) {
      const source = read(new URL(`${portal}/${page}`, webApp));
      assert.ok(
        source.includes('/api/inspections?view=list`') && !source.includes('/api/inspections`'),
        `inspire-web ${portal}/${page}: the list must ask for every inspection, in the list view`,
      );
    }
  }
}

// The server has to know the view, when it is checked out beside the app.
const backend = new URL('../inspire-backend/controllers/inspectionController.js', root);
if (existsSync(fileURLToPath(backend))) {
  assert.ok(
    read(backend).includes("const listView = view === 'list';"),
    'inspire-backend: GET /inspections no longer answers view=list',
  );
}

console.log('propertyLists.check OK');
