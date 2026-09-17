/**
 * Self-check for the Add Property building-division step.
 *
 *   node --experimental-strip-types src/utils/buildingDivision.check.ts
 *
 * The bug this guards: the app used to create the property straight from Add
 * Property, so the unit total the user entered was never held to. Web splits it
 * across buildings and keeps the total fixed — editing one building moves units
 * out of the others rather than changing the total — and refuses to save until
 * the split adds back up. These are the rules that make that true.
 */

import assert from 'node:assert';
import {
  divideUnitsEvenly,
  redivideKeepingNames,
  redistributeUnits,
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

/* ---- editing one building keeps the total fixed ---- */

{
  const start = divideUnitsEvenly(10, 2); // [5, 5]
  const after = redistributeUnits(start, 0, 8);
  assert.deepStrictEqual(after.map((b) => b.units), [8, 2], 'the other building gives up units');
  assert.strictEqual(totalUnitsOf(after), 10, 'total is unchanged when raising one building');
}

{
  const start = divideUnitsEvenly(10, 2); // [5, 5]
  const after = redistributeUnits(start, 0, 2);
  assert.deepStrictEqual(after.map((b) => b.units), [2, 8], 'lowering one building feeds the other');
  assert.strictEqual(totalUnitsOf(after), 10, 'total is unchanged when lowering one building');
}

{
  const start = divideUnitsEvenly(30, 3); // [10, 10, 10]
  const after = redistributeUnits(start, 1, 25);
  assert.strictEqual(totalUnitsOf(after), 30, 'the shortfall is taken across several buildings');
  assert.strictEqual(after[1].units, 25, 'the edited building keeps the value typed');
}

{
  const start = divideUnitsEvenly(10, 2);
  const after = redistributeUnits(start, 0, 5);
  assert.deepStrictEqual(after.map((b) => b.units), [5, 5], 'a no-op edit changes nothing');
}

// Sweep: for any single edit that the others can absorb, the total holds.
for (const [total, n] of [[10, 2], [30, 3], [63, 4], [160, 5]] as [number, number][]) {
  const start = divideUnitsEvenly(total, n);
  for (let i = 0; i < n; i++) {
    for (const value of [0, 1, Math.floor(total / 2), total]) {
      const after = redistributeUnits(start, i, value);
      assert.strictEqual(
        after[i].units,
        value,
        `editing building ${i} to ${value} must keep that value`
      );
      assert.ok(
        after.every((b) => b.units >= 0),
        `no building may go negative (total=${total}, n=${n}, i=${i}, value=${value})`
      );
      // Units are only ever moved between buildings, never created.
      assert.ok(
        totalUnitsOf(after) <= total,
        `redistribute must never invent units (total=${total}, n=${n}, i=${i}, value=${value})`
      );
    }
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

console.log('buildingDivision.check.ts OK — even split, fixed total, names preserved');
