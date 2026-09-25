/**
 * Self-check for the Add Property building-division step.
 *
 *   node --experimental-strip-types src/utils/buildingDivision.check.ts
 *
 * The bug this guards: the app used to create the property straight from Add
 * Property, so the unit total the user entered was never held to. Web splits it
 * across buildings as a starting point and refuses to save until the split adds
 * back up. Editing one building may only move the buildings BELOW it. These are
 * the rules that make that true.
 */

import assert from 'node:assert';
import {
  divideUnitsEvenly,
  redivideKeepingNames,
  setUnitsRebalancingAfter,
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

/* ---- editing a building only moves the ones after it ---- */

{
  // The user's case: 16 units over 4 buildings, B2 edited down to 3.
  const start = divideUnitsEvenly(16, 4); // [4, 4, 4, 4]
  const b1Up = setUnitsRebalancingAfter(start, 0, 5, 16);
  assert.deepStrictEqual(
    b1Up.map((b) => b.units),
    [5, 4, 4, 3],
    'raising B1 takes the difference out of the buildings after it'
  );

  const b2Down = setUnitsRebalancingAfter(b1Up, 1, 3, 16);
  assert.deepStrictEqual(
    b2Down.map((b) => b.units),
    [5, 3, 4, 4],
    'editing B2 leaves B1 alone and re-spreads the rest over B3/B4'
  );
}

{
  // Nine buildings, B8 edited: B1..B7 frozen, only B9 absorbs it.
  const nine = divideUnitsEvenly(27, 9); // three each
  const after = setUnitsRebalancingAfter(nine, 7, 1, 27);
  assert.deepStrictEqual(
    after.map((b) => b.units),
    [3, 3, 3, 3, 3, 3, 3, 1, 5],
    'only the buildings after the edited one absorb the difference'
  );
  assert.strictEqual(totalUnitsOf(after), 27, 'the property total still adds up');
}

{
  // The last building has nothing after it to absorb the change, so the total
  // goes off and the screen's mismatch warning is what stops the save.
  const last = setUnitsRebalancingAfter(divideUnitsEvenly(12, 3), 2, 9, 12);
  assert.deepStrictEqual(last.map((b) => b.units), [4, 4, 9], 'the last row edits freely');
  assert.strictEqual(totalUnitsOf(last), 17, 'and the running total shows the mismatch');
}

{
  // Over-allocating: the tail cannot go negative, it bottoms out at zero.
  const over = setUnitsRebalancingAfter(divideUnitsEvenly(12, 3), 0, 20, 12);
  assert.deepStrictEqual(over.map((b) => b.units), [20, 0, 0], 'the tail never goes negative');
}

console.log('buildingDivision.check.ts OK — even split, names preserved, edits only move later buildings');
