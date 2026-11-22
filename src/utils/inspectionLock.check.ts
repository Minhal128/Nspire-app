/**
 * Self-check for the one-property-at-a-time lock.
 *
 *   node --experimental-strip-types src/utils/inspectionLock.check.ts
 *
 */

import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  blockingInspection,
  findActiveInspection,
  propertyActivity,
  totalAreas,
} from '../services/web/inspectionLock.ts';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (url: URL) => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');

// --- the rule ----------------------------------------------------------------
const prop = (id: string, over: any = {}) => ({
  _id: id, name: `Property ${id}`, status: 'active', buildings: 2, units: 4, ...over,
});
const rec = (propertyId: any, inspectionType: string, updatedAt: string, over: any = {}) => ({
  propertyId, buildingId: 'B1', unitId: 'B1', inspectionType, updatedAt, ...over,
});

const A = prop('A');
const B = prop('B');
const C = prop('C');
const all = [A, B, C];

// Outside and Inside per building, plus the units to inspect.
assert.strictEqual(totalAreas(prop('x', { buildings: 2, units: 4 })), 8);
assert.strictEqual(totalAreas(prop('x', { buildings: 2, units: 4, calculatedUnits: 3 })), 7);
assert.strictEqual(totalAreas(prop('x', { buildings: 3, units: 0 })), 6, 'a property with no units is its buildings alone');

// Nothing saved, nothing locked.
assert.strictEqual(findActiveInspection(all, []), null);
assert.strictEqual(blockingInspection('A', all, []), null);

// One property part-way: it is free, the others wait on it.
const onlyA = [rec('A', 'Outside', '2026-11-10T10:00:00.000Z')];
assert.strictEqual(blockingInspection('A', all, onlyA), null, 'the property in progress is never locked');
assert.strictEqual(blockingInspection('B', all, onlyA), A, 'a second property waits for the first');

// The dead end that was reported: two part-inspected properties.
const both = [
  rec('B', 'Inside', '2026-11-01T09:00:00.000Z'),
  rec('A', 'Outside', '2026-11-10T10:00:00.000Z'),
  rec('A', 'unit_B1_Unit 001', '2026-11-14T08:00:00.000Z', { unitId: 'Unit 001' }),
];
assert.strictEqual(findActiveInspection(all, both), A, 'the one worked on last is the one in progress');
assert.strictEqual(blockingInspection('A', all, both), null, 'and it can always be continued');
assert.strictEqual(blockingInspection('B', all, both), A, 'the other waits, and is told which property to finish');
assert.deepStrictEqual(
  all.filter((p) => blockingInspection(p._id, all, both) === null),
  [A],
  'while a property is in progress there is always exactly one that can be inspected',
);
assert.strictEqual(findActiveInspection([C, B, A], [...both].reverse()), A, 'whatever order the server answers in');

// A legacy hold cannot free the account to start a different property.
const aHeld = [{ ...A, status: 'hold' }, B, C];
assert.strictEqual(findActiveInspection(aHeld, both)?._id, 'A');
assert.strictEqual(blockingInspection('B', aHeld, both)?._id, 'A');
assert.strictEqual(blockingInspection('C', aHeld, both)?._id, 'A');

// Display rounding cannot release an unfinished property.
const large = prop('L', { buildings: 100, units: 0 });
const almostDone = Array.from({ length: 199 }, (_, index) =>
  rec('L', index % 2 ? 'Inside' : 'Outside', '', { buildingId: `B${Math.floor(index / 2)}` }),
);
assert.strictEqual(blockingInspection('C', [large, C], almostDone), large);

// Finished is finished, and a report draft is not an inspection.
const small = prop('S', { buildings: 1, units: 0 });
const smallDone = [rec('S', 'Outside', '2026-11-14T10:00:00.000Z'), rec('S', 'inside', '2026-11-14T11:00:00.000Z')];
assert.strictEqual(propertyActivity(small, smallDone).percent, 100);
assert.strictEqual(blockingInspection('C', [small, C], smallDone), null, 'a finished property holds nothing back');
const draft = rec('B', 'REPORT_DRAFT_PROPERTY', '2026-11-15T00:00:00.000Z', { unitId: 'ALL_UNITS' });
assert.strictEqual(findActiveInspection(all, [draft]), null);
assert.strictEqual(findActiveInspection(all, [...both, draft]), A, 'a newer draft elsewhere does not take the turn');

// --- the property screen asks before it opens a building ---------------------
const building = read(new URL('src/screens/BuildingInspectionScreen.tsx', root));
const start = building.match(/const handleStartInspectionForBuilding = async \([\s\S]*?\n  \};\n/)?.[0];
assert.ok(start, 'BuildingInspectionScreen: handleStartInspectionForBuilding not found');
const asked = start.indexOf('await propertyService.startInspection(');
const opened = start.indexOf("navigation.navigate('InspectionCategories'");
assert.ok(asked > 0 && opened > asked, 'Start Inspection asks the lock before it opens the building');
// --- My Inspections: the same answer at the door -----------------------------
const mine = read(new URL('src/screens/MyInspectionsScreen.tsx', root));
assert.ok(
  mine.includes('findActiveInspection<PropertyType>(lockProperties, progressRecords)'),
  'MyInspectionsScreen: the active property comes from the shared rule, over every property',
);
for (const handler of [
  'const handleEditPress = (property: PropertyType, hasInProgressInspection: boolean = false) => {',
  'const handleContinueInspection = (property: PropertyType) => {',
  'const handlePropertyCardPress = (property: PropertyType) => {',
]) {
  assert.ok(
    mine.includes(`${handler}\n    if (heldBackByActiveInspection(property)) return;`),
    `MyInspectionsScreen: ${handler.split(' = ')[0].replace('const ', '')} must stop for a property that is not the one in progress`,
  );
}

const dashboard = read(new URL('src/screens/DashboardScreen.tsx', root));
const addProperty = read(new URL('src/screens/AddPropertyScreen.tsx', root));
assert.ok(!dashboard.includes('Hold Inspection') && !mine.includes('Hold Inspection'));
assert.ok(!addProperty.includes('styles.countBadge'));

const webBase = new URL('../inspire-web/', root);
if (existsSync(fileURLToPath(webBase))) {
  const webDetails = read(new URL('app/dashboard/property-details/[id]/page.tsx', webBase));
  const webModals = read(new URL('components/PropertyModals.tsx', webBase));
  assert.ok(webDetails.includes('await propertiesAPI.startInspection(propertyId)'));
  assert.ok(!webModals.includes('Hold Inspection'));
  assert.ok(!webModals.includes("{properties.length} {properties.length === 1 ? 'Property' : 'Properties'}"));
}

console.log('inspectionLock.check OK');
