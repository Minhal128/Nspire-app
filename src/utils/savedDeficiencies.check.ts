/**
 * Self-check for finding a recorded deficiency again. A regression here makes
 * a reopened OD item look empty even though the image and the deficiency are
 * on the device, so the match is pinned down explicitly.
 *
 *   node --experimental-strip-types src/utils/savedDeficiencies.check.ts
 */

import assert from 'node:assert';
import {
  savedFindingScope,
  draftStorageKeys,
  findingsForItem,
} from './savedDeficiencies.ts';

const property = { _id: 'P1', name: 'ofjog' };

const outside = savedFindingScope({
  property, buildingId: 'B1', isOutside: true, isUnit: false, selectedUnits: [],
});
assert.deepStrictEqual(outside, {
  propertyId: 'P1', buildingLabel: 'B1', area: 'Outside', unit: 'B1',
}, 'Outside hangs off the building, not a unit');

const unit = savedFindingScope({
  property, buildingId: 'B1', isOutside: false, isUnit: true,
  currentUnit: 'Unit 001', selectedUnits: ['Unit 001'],
});
assert.strictEqual(unit.area, 'Unit');
assert.strictEqual(unit.unit, 'Unit 001');

// --- keys ------------------------------------------------------------------
assert.deepStrictEqual(draftStorageKeys(outside), [
  'saved_inspection_P1',
  'saved_inspection_P1_B1',
], 'a labelled building needs no default/Building fallback key');
assert.ok(
  draftStorageKeys({ ...outside, buildingLabel: '' }).includes('saved_inspection_P1_default'),
  'an unlabelled building still has to reach the _default snapshot',
);

// --- the entry DeficiencyDetailScreen writes -------------------------------
const chimney = {
  itemName: 'Chimney', _area: 'Outside', _unit: 'B1',
  imageUri: 'file:///chimney.jpg',
  deficiency: { name: 'Damaged chimney', severity: 'Moderate' },
  deficiencyQRId: 'QR-1',
};
const snapshot = JSON.stringify({ deficiencies: [chimney] });

assert.deepStrictEqual(
  findingsForItem([snapshot], outside, 'Chimney'),
  [chimney],
  'the recorded chimney deficiency must come back',
);
assert.deepStrictEqual(findingsForItem([snapshot], outside, 'Roof'), [], 'other items stay out');
assert.deepStrictEqual(
  findingsForItem([snapshot], { ...outside, area: 'Inside' }, 'Chimney'),
  [],
  'ids repeat across areas, so the area has to gate the match',
);

// --- InspectionSummaryScreen stamps the plural on un-stamped entries --------
const restamped = JSON.stringify({ deficiencies: [{ ...chimney, _area: 'Units', _unit: 'Unit 001' }] });
assert.strictEqual(
  findingsForItem([restamped], unit, 'Chimney').length, 1,
  "'Units' and 'Unit' are one bucket",
);

// --- older snapshots use `findings`, and the same entry can be in both keys -
const legacy = JSON.stringify({ findings: [chimney] });
assert.deepStrictEqual(findingsForItem([legacy], outside, 'Chimney'), [chimney], 'findings[] still reads');
assert.strictEqual(
  findingsForItem([snapshot, legacy], outside, 'Chimney').length, 1,
  'the same deficiency in two keys is listed once',
);

// --- junk on disk must not take the screen down ----------------------------
assert.deepStrictEqual(findingsForItem([null, undefined, '', 'not json', '{}'], outside, 'Chimney'), []);

console.log('savedDeficiencies.check OK');
