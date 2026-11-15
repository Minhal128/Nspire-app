/**
 * Self-check for a building that has no units to inspect.
 *
 *   node --experimental-strip-types src/utils/zeroUnitBuilding.check.ts
 *
 * Such a building still has an Outside and an Inside, and they have to be
 * inspectable; only its Units are empty. The property screen used to disable
 * Start Inspection for it and answer "No Units", so nothing of the building
 * could be inspected, while the web opens it like any other.
 */

import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (url: URL) => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');

// --- the property screen opens the building whatever its unit count ----------
const building = read(new URL('src/screens/BuildingInspectionScreen.tsx', root));
const start = building.match(/const handleStartInspectionForBuilding = \([\s\S]*?\n  \};\n/)?.[0];
assert.ok(start, 'BuildingInspectionScreen: handleStartInspectionForBuilding not found');
assert.ok(
  !/unitsForInspection\s*<=\s*0[\s\S]*?return;/.test(start),
  'BuildingInspectionScreen: a building with no units must still open, for its Outside and Inside',
);
assert.ok(
  start.includes("navigation.navigate('InspectionCategories'"),
  'BuildingInspectionScreen: Start Inspection opens the building categories',
);
assert.ok(
  !/disabled=\{building\.unitsForInspection\s*<=\s*0\}/.test(building),
  'BuildingInspectionScreen: Start Inspection must not be disabled for a building with no units',
);

// --- the categories screen has nothing to open under Units, and says so ------
const categories = read(new URL('src/screens/InspectionCategoriesScreen.tsx', root));
const units = categories.match(/const handleUnitsPress = \(\) => \{[\s\S]*?\n  \};\n/)?.[0];
assert.ok(units, 'InspectionCategoriesScreen: handleUnitsPress not found');
const guard = units.indexOf('selectedUnits.length === 0');
assert.ok(
  guard > 0 && guard < units.indexOf("navigation.navigate('PropertyInfo'"),
  'InspectionCategoriesScreen: with no units, Units must not open the unit list',
);
for (const handler of ['handleOutsidePress', 'handleInsidePress']) {
  const body = categories.match(new RegExp(`const ${handler} = \\(\\) => \\{[\\s\\S]*?\\n  \\};\\n`))?.[0];
  assert.ok(body, `InspectionCategoriesScreen: ${handler} not found`);
  assert.ok(
    !/selectedUnits\.length/.test(body),
    `InspectionCategoriesScreen: ${handler} must not depend on the building having units`,
  );
}

// --- the web says the same thing, when it is checked out beside the app ------
const webPage = new URL('../inspire-web/app/dashboard/inspection-category/[id]/page.tsx', root);
if (existsSync(fileURLToPath(webPage))) {
  const web = read(webPage);
  for (const line of ['No units allocated to this building.', 'This building has 0 allocated inspection units.']) {
    assert.ok(web.includes(line), `inspire-web no longer says "${line}" — the app copies its wording`);
    assert.ok(categories.includes(line), `InspectionCategoriesScreen: the wording must be the web's: "${line}"`);
  }
} else {
  console.log('zeroUnitBuilding.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

console.log('zeroUnitBuilding.check OK');
