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

console.log('propertyLists.check OK');
