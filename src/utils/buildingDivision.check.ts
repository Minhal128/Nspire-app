/**
 * Self-check for the Add Property building-division step.
 *
 *   node --experimental-strip-types src/utils/buildingDivision.check.ts
 *
 * The bug this guards: the app used to create the property straight from Add
 * Property, so the unit total the user entered was never held to. Web splits it
 * across buildings as a starting point and refuses to save until the split adds
 * back up. Editing one building must never move units in another. These are the
 * rules that make that true.
 */

import assert from 'node:assert';
import {
  divideUnitsEvenly,
  redivideKeepingNames,
  totalUnitsOf,
} from './buildingDivision.ts';

/* ---- even split ---- */

assert.deepStrictEqual(
  divideUnitsEvenly(10, 2).map((b) => b.units),
  [5, 5],
  'an exact split should be even'
);

assert.deepStrictEqual(
  divideUnitsEvenly(10, 3).map((b) => b.units),
  [4, 3, 3],
  'the remainder goes to the first buildings'
);

assert.deepStrictEqual(
  divideUnitsEvenly(7, 1).map((b) => b.units),
  [7],
  'a single building takes every unit'
);

assert.deepStrictEqual(
  divideUnitsEvenly(2, 5).map((b) => b.units),
  [1, 1, 0, 0, 0],
  'more buildings than units still produces one entry per building'
);

assert.deepStrictEqual(
  divideUnitsEvenly(12, 4).map((b) => b.name),
  ['B1', 'B2', 'B3', 'B4'],
  'buildings are named B1..Bn, matching the buildingId the API is sent'
);

// Whatever the split, it must account for every unit.
for (const total of [0, 1, 7, 10, 63, 160]) {
  for (const n of [1, 2, 3, 4, 7]) {
    assert.strictEqual(
      totalUnitsOf(divideUnitsEvenly(total, n)),
      total,
      `divideUnitsEvenly(${total}, ${n}) must not lose or invent units`
    );
  }
}

/* ---- re-splitting keeps the names the user typed ---- */

{
  const named = [
    { name: 'North Tower', units: 5 },
    { name: 'South Tower', units: 5 },
  ];
  const after = redivideKeepingNames(named, 11);
  assert.deepStrictEqual(
    after.map((b) => b.name),
    ['North Tower', 'South Tower'],
    'custom building names survive a re-split'
  );
  assert.strictEqual(totalUnitsOf(after), 11, 're-split accounts for the new total');
}

console.log('buildingDivision.check.ts OK — even split, names preserved');
