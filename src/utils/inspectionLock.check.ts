/** Check that inspections open independently without restoring the Hold action. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../..', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), 'utf8');
const buildings = read('src/screens/BuildingInspectionScreen.tsx');
const myInspections = read('src/screens/MyInspectionsScreen.tsx');
const categories = read('src/screens/InspectionCategoriesScreen.tsx');
assert.doesNotMatch(buildings, /propertyService\.startInspection|inspectionStartError/);
assert.doesNotMatch(myInspections, /heldBackByActiveInspection|findActiveInspection|Hold Inspection/);
assert.match(buildings, /navigation\.navigate\('InspectionCategories'/);
assert.match(categories, /unitsNextLabel\}>NEXT</);
assert.match(categories, /onPress: handleUnitsPress/);

const webRoot = new URL('../inspire-web/', root);
if (existsSync(webRoot)) {
  for (const portal of ['dashboard', 'admin', 'management/dashboard', 'asset-manager/dashboard', 'other/dashboard']) {
    const load = (path: string) => readFileSync(new URL(`app/${portal}/${path}`, webRoot), 'utf8');
    assert.doesNotMatch(load('my-inspection/page.tsx'), /findActiveInspection|inspectionStartError/);
    assert.doesNotMatch(load('property-details/[id]/page.tsx'), /propertiesAPI\.startInspection/);
    assert.match(load('inspection-category/[id]/page.tsx'), /onClick=\{\(\) => setUnitSelectionPopupOpen\(true\)\}[\s\S]{0,400}Next: select a unit/);
  }
}
console.log('Independent inspection navigation and Units Next checks passed');
