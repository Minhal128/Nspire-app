/**
 * Self-check for the coverage -> unit allocation shared by the three portals.
 *
 *   node --experimental-strip-types src/utils/coverageUnits.check.ts
 */

import assert from 'node:assert';
import { resolveCoverageUnits, buildUnitList } from './coverageUnits.ts';

// --- labels ---------------------------------------------------------------
assert.deepStrictEqual(buildUnitList(3), ['Unit 001', 'Unit 002', 'Unit 003']);
assert.deepStrictEqual(buildUnitList(0), []);
assert.deepStrictEqual(buildUnitList(-5), [], 'a negative count must not throw');
assert.strictEqual(buildUnitList(12)[11], 'Unit 012', 'padding stays 3 digits');

// --- 100% coverage --------------------------------------------------------
const all = resolveCoverageUnits('100', 24, 'p1');
assert.strictEqual(all.calculatedUnits, 24);
assert.strictEqual(all.selectedUnits.length, 24);

// --- 50% coverage rounds up (13 units -> 7, never 6) ----------------------
const half = resolveCoverageUnits('50', 13, 'p1');
assert.strictEqual(half.calculatedUnits, 7);
assert.strictEqual(half.selectedUnits.length, 7);

// --- random uses the NSPIRE sample and is deterministic per property ------
const r1 = resolveCoverageUnits('random', 100, 'prop-abc');
const r2 = resolveCoverageUnits('random', 100, 'prop-abc');
assert.deepStrictEqual(r1, r2, 'same property must yield the same sample');
assert.ok(r1.calculatedUnits > 0 && r1.calculatedUnits <= 100);
assert.strictEqual(r1.selectedUnits.length, r1.calculatedUnits);

// --- count/list never disagree, whatever the coverage --------------------
for (const coverage of ['100', '50', 'random']) {
  for (const total of [1, 2, 7, 50, 921]) {
    const { calculatedUnits, selectedUnits } = resolveCoverageUnits(coverage, total, 'p');
    assert.strictEqual(
      selectedUnits.length,
      calculatedUnits,
      `${coverage} @ ${total}: list length must match the count sent to BuildingInspection`
    );
    assert.ok(calculatedUnits <= total, `${coverage} @ ${total}: cannot inspect more than exists`);
  }
}

// --- 0 units is clamped to 1 rather than producing an empty inspection ----
assert.strictEqual(resolveCoverageUnits('100', 0, 'p').calculatedUnits, 1);

console.log('coverageUnits.check.ts OK');
