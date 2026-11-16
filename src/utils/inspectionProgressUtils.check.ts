/**
 * Self-check for the progress + deficiency helpers shared by the Dashboard and
 * Inspection Status screens. These two numbers must match the web portal exactly,
 * so they get one runnable check.
 *
 *   node --experimental-strip-types src/utils/inspectionProgressUtils.check.ts
 */

import assert from 'node:assert';
import {
  calculatePropertyProgressPercent,
  countUniqueDeficiencies,
} from './inspectionProgressUtils.ts';

// --- calculatePropertyProgressPercent -------------------------------------

// 2 buildings -> 4 inside/outside passes, + 3 allocated units = 7 tasks.
const property = { _id: 'p1', buildings: 2, units: 40, calculatedUnits: 3 };

assert.strictEqual(calculatePropertyProgressPercent(property, []), 0, 'no records => 0%');

assert.strictEqual(
  calculatePropertyProgressPercent(property, [
    { propertyId: 'p1', buildingId: 'B1', inspectionType: 'inside' },
    { propertyId: 'p1', buildingId: 'B1', inspectionType: 'outside' },
  ]),
  Math.round((2 / 7) * 100),
  '2 of 7 tasks',
);

// Duplicate records for the same pass must count once.
assert.strictEqual(
  calculatePropertyProgressPercent(property, [
    { propertyId: 'p1', buildingId: 'B1', inspectionType: 'inside' },
    { propertyId: 'p1', buildingId: 'B1', inspectionType: 'INSIDE' },
  ]),
  Math.round((1 / 7) * 100),
  'duplicate pass counts once',
);

// Records for other properties are ignored; populated propertyId objects still match.
assert.strictEqual(
  calculatePropertyProgressPercent(property, [
    { propertyId: 'other', buildingId: 'B1', inspectionType: 'inside' },
    { propertyId: { _id: 'p1' }, buildingId: 'B2', inspectionType: 'outside' },
  ]),
  Math.round((1 / 7) * 100),
  'foreign records ignored, populated ids match',
);

// Every task done => exactly 100, and it never exceeds 100.
const allDone = [
  { propertyId: 'p1', buildingId: 'B1', inspectionType: 'inside' },
  { propertyId: 'p1', buildingId: 'B1', inspectionType: 'outside' },
  { propertyId: 'p1', buildingId: 'B2', inspectionType: 'inside' },
  { propertyId: 'p1', buildingId: 'B2', inspectionType: 'outside' },
  { propertyId: 'p1', buildingId: 'B1', inspectionType: 'unit_1', unitId: 'U1' },
  { propertyId: 'p1', buildingId: 'B1', inspectionType: 'unit_2', unitId: 'U2' },
  { propertyId: 'p1', buildingId: 'B1', inspectionType: 'unit_3', unitId: 'U3' },
];
assert.strictEqual(calculatePropertyProgressPercent(property, allDone), 100, 'all tasks => 100%');
assert.strictEqual(
  calculatePropertyProgressPercent(property, [
    ...allDone,
    { propertyId: 'p1', buildingId: 'B1', inspectionType: 'unit_4', unitId: 'U4' },
  ]),
  100,
  'capped at 100%',
);

// buildingDetails wins over calculatedUnits: 1 building => 2 + 5 = 7 tasks.
assert.strictEqual(
  calculatePropertyProgressPercent(
    { _id: 'p2', buildings: 1, units: 99, calculatedUnits: 1, buildingDetails: [{ unitsForInspection: 5 }] },
    [{ propertyId: 'p2', buildingId: 'B1', inspectionType: 'inside' }],
  ),
  Math.round((1 / 7) * 100),
  'buildingDetails drives the unit total',
);

// A property with nothing to inspect must not divide by zero.
assert.strictEqual(
  calculatePropertyProgressPercent({ _id: 'p3', buildings: 0, units: 0 }, []),
  0,
  'zero tasks => 0%, no NaN',
);

// --- countUniqueDeficiencies ----------------------------------------------

assert.strictEqual(countUniqueDeficiencies(undefined), 0, 'undefined => 0');
assert.strictEqual(countUniqueDeficiencies([]), 0, 'empty => 0');

// Same defect reported twice with different casing collapses to one.
assert.strictEqual(
  countUniqueDeficiencies([
    { area: 'Kitchen', building: 'B1', unit: '101', title: 'Leak', description: 'Under sink' },
    { area: 'kitchen', building: 'b1', unit: '101', title: 'leak', description: 'under sink' },
  ]),
  1,
  'case-insensitive duplicate collapses',
);

// Different unit => different defect.
assert.strictEqual(
  countUniqueDeficiencies([
    { area: 'Kitchen', building: 'B1', unit: '101', title: 'Leak' },
    { area: 'Kitchen', building: 'B1', unit: '102', title: 'Leak' },
  ]),
  2,
  'different unit counts separately',
);

// Entries with neither a title nor a description are skipped entirely.
assert.strictEqual(
  countUniqueDeficiencies([{ area: 'Kitchen', building: 'B1', unit: '101' }]),
  0,
  'blank finding skipped',
);

// The alternate field names the API also uses must resolve to the same key.
assert.strictEqual(
  countUniqueDeficiencies([
    { subCategory: 'Bath', buildingName: 'B2', unitNumber: '5', deficiencyName: 'Mold', details: 'Ceiling' },
    { category: 'Bath', building: 'B2', unit: '5', name: 'Mold', deficiencyDetails: 'Ceiling' },
  ]),
  1,
  'alternate field names normalise to one defect',
);

// A finding saved by this app keeps its name and description inside
// `deficiency`, and its place as _area / _unit. Read only at the top it had
// neither, was skipped as a blank, and a property inspected on a phone showed
// no deficiencies in the list.
const fromApp = (name: string, area: string, unit: string, building = 'B1') => ({
  deficiency: { name, detail: `${name} (detail)`, severity: 'Moderate' },
  building,
  _area: area,
  _unit: unit,
});
assert.strictEqual(
  countUniqueDeficiencies([fromApp('Chimney is damaged', 'Outside', 'B1'), fromApp('Drain is blocked', 'Outside', 'B1')]),
  2,
  'findings saved by the app are counted',
);
assert.strictEqual(
  countUniqueDeficiencies([fromApp('Outlet is dead', 'Unit', 'Unit 003'), fromApp('Outlet is dead', 'Unit', 'Unit 004')]),
  2,
  'the same deficiency in two units, saved by the app, is two',
);
// The same deficiency recorded on the website and on a phone is one.
assert.strictEqual(
  countUniqueDeficiencies([
    { area: 'outside', building: 'B1', unit: '-', title: 'Chimney is damaged', description: 'Chimney is damaged (detail)' },
    fromApp('Chimney is damaged', 'Outside', 'B1'),
  ]),
  1,
  'one deficiency saved by both the web and the app is counted once',
);

console.log('inspectionProgressUtils: all checks passed');
