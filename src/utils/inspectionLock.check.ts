/**
 * Self-check for the one-property-at-a-time lock.
 *
 *   node --experimental-strip-types src/utils/inspectionLock.check.ts
 *
 * The client: one property is being inspected; a second one cannot be started
 * until the first is finished or put on hold. What they hit on the web was
 * worse than the rule -- with two part-inspected properties, each was refused
 * because of the other, so nothing could be inspected at all.
 *
 * The rule now lives in one file, inspire-web/lib/inspectionLock.ts, and the
 * app runs a copy of it (src/services/web/inspectionLock.ts; dataParity.check
 * keeps the copy honest). This check holds the rule to what the client asked,
 * and the screens to using it.
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
assert.strictEqual(blockingInspection('B', all, both), A, 'the other waits, and is told which property to finish or hold');
assert.deepStrictEqual(
  all.filter((p) => blockingInspection(p._id, all, both) === null),
  [A],
  'while a property is in progress there is always exactly one that can be inspected',
);
assert.strictEqual(findActiveInspection([C, B, A], [...both].reverse()), A, 'whatever order the server answers in');

// Hold hands the turn over.
const aHeld = [{ ...A, status: 'hold' }, B, C];
assert.strictEqual(findActiveInspection(aHeld, both)?._id, 'B');
assert.strictEqual(blockingInspection('B', aHeld, both), null, 'with the first on hold the second can be inspected');
const allHeld = [{ ...A, status: 'hold' }, { ...B, status: 'hold' }, C];
assert.strictEqual(blockingInspection('C', allHeld, both), null, 'everything on hold: a new property may start');

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
const asked = start.indexOf('await lookUpInspectionLock()');
const opened = start.indexOf("navigation.navigate('InspectionCategories'");
assert.ok(asked > 0 && opened > asked, 'Start Inspection asks the lock before it opens the building');
const resumed = start.indexOf('propertyService.hold(');
assert.ok(
  resumed > start.indexOf('if (blocker)') && resumed < opened,
  'a property on hold comes off hold once the lock has let it through, not before',
);

const lookup = building.match(/const lookUpInspectionLock = async \([\s\S]*?\n  \};\n/)?.[0];
assert.ok(lookup, 'BuildingInspectionScreen: lookUpInspectionLock not found');
assert.ok(lookup.includes('blockingInspection<any>('), 'the answer comes from the shared rule');
assert.ok(
  lookup.includes('propertyService.getProperties({ limit: 1000 })'),
  'the lock looks at every property: the server answers with ten unless asked for more',
);
// Field work must never wait on this, or be refused by its failing.
assert.ok(lookup.includes('networkService.hasNoConnection()'), 'offline, the lookup is not attempted');
assert.ok(lookup.includes('Promise.race([lookup, giveUp])'), 'a slow server is not waited for');
assert.ok(lookup.includes('.catch(() => nothing)'), 'a failed lookup locks nothing');

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

// --- Hold: the way out the messages name -------------------------------------
const dashboard = read(new URL('src/screens/DashboardScreen.tsx', root));
for (const [name, screen] of [['DashboardScreen', dashboard], ['MyInspectionsScreen', mine]] as const) {
  assert.ok(screen.includes('>Hold Inspection</Text>'), `${name}: the Action modal has no Hold Inspection`);
  assert.ok(screen.includes('propertyService.hold('), `${name}: Hold Inspection must reach the server`);
  assert.ok(screen.includes('On Hold'), `${name}: a property on hold must say so`);
  assert.ok(
    screen.includes("Alert.alert('Offline', 'Connect to the internet to put an inspection on hold.');"),
    `${name}: hold is not queued offline, so offline it has to say why nothing happened`,
  );
}

// --- the words are the web's, when it is checked out beside the app ----------
const webBase = new URL('../inspire-web/app/dashboard/', root);
if (existsSync(fileURLToPath(webBase))) {
  const refusal = ' is already in progress. Please put it on hold or complete it first.';
  const webPage = read(new URL('property-details/[id]/page.tsx', webBase));
  assert.ok(webPage.includes(`Cannot start inspection. Property "\${blocker.name}"${refusal}`), 'inspire-web: the refusal wording moved');
  assert.ok(
    start.includes("'Cannot start inspection'") && start.includes(`Property "\${blocker.name}"${refusal}`),
    'BuildingInspectionScreen: the refusal must read as the web\'s does',
  );

  const atTheDoor = ' is currently being inspected. Please put it on hold before starting a new inspection.';
  const webMine = read(new URL('my-inspection/page.tsx', webBase));
  assert.ok(webMine.includes(atTheDoor), 'inspire-web: the My Inspection wording moved');
  assert.ok(mine.includes(atTheDoor), 'MyInspectionsScreen: the wording must be the web\'s');
} else {
  console.log('inspectionLock.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

console.log('inspectionLock.check OK');
