/**
 * Self-check for the bulk select-all rules. A regression here silently wipes
 * inspection answers, so the behaviour is pinned down explicitly.
 *
 *   node --experimental-strip-types src/utils/selectAllResponses.check.ts
 */

import assert from 'node:assert';
import {
  getToggleableItemIds,
  isSelectAllChecked,
  computeSelectAllResponses,
  type ResponseMap,
} from './selectAllResponses.ts';

const items = ['a', 'b', 'c'];

// --- select all on a clean slate ------------------------------------------
assert.deepStrictEqual(
  computeSelectAllResponses(items, {}, 'No OD'),
  { a: 'No OD', b: 'No OD', c: 'No OD' },
  'empty state => all set',
);
assert.strictEqual(isSelectAllChecked(items, {}, 'No OD'), false, 'nothing set => unchecked');

// --- existing answers for other statuses survive --------------------------
const mixed: ResponseMap = { a: 'N/A' };
assert.deepStrictEqual(
  computeSelectAllResponses(items, mixed, 'No OD'),
  { a: 'N/A', b: 'No OD', c: 'No OD' },
  'an existing N/A is not overwritten by Select All No OD',
);
assert.deepStrictEqual(mixed, { a: 'N/A' }, 'input map is not mutated');

// --- OD-pinned items are excluded from other bulk actions -----------------
const withOD: ResponseMap = { a: 'OD' };
assert.deepStrictEqual(
  getToggleableItemIds(items, withOD, 'No OD'),
  ['b', 'c'],
  'OD item is not toggleable by No OD',
);
assert.deepStrictEqual(
  computeSelectAllResponses(items, withOD, 'N/A'),
  { a: 'OD', b: 'N/A', c: 'N/A' },
  'recorded deficiency stays OD',
);

// --- second tap clears only that group ------------------------------------
const allNoOD: ResponseMap = { a: 'No OD', b: 'No OD', c: 'No OD' };
assert.strictEqual(isSelectAllChecked(items, allNoOD, 'No OD'), true, 'all set => checked');
assert.deepStrictEqual(
  computeSelectAllResponses(items, allNoOD, 'No OD'),
  {},
  'toggling a full group clears it',
);

const partialOther: ResponseMap = { a: 'No OD', b: 'No OD', c: 'N/A' };
assert.deepStrictEqual(
  computeSelectAllResponses(items, partialOther, 'No OD'),
  { c: 'N/A' },
  'clearing No OD leaves the unrelated N/A answer intact',
);

// --- checked state ignores items it cannot touch --------------------------
assert.strictEqual(
  isSelectAllChecked(items, { a: 'OD', b: 'No OD', c: 'No OD' }, 'No OD'),
  true,
  'checked when every toggleable item is set, ignoring the pinned OD item',
);

// --- nothing toggleable => no change --------------------------------------
const allOD: ResponseMap = { a: 'OD', b: 'OD', c: 'OD' };
assert.deepStrictEqual(
  computeSelectAllResponses(items, allOD, 'No OD'),
  allOD,
  'no toggleable items => map returned unchanged',
);
assert.strictEqual(isSelectAllChecked(items, allOD, 'No OD'), false, 'nothing toggleable => unchecked');

// --- OD itself can still be bulk-toggled ----------------------------------
assert.deepStrictEqual(
  computeSelectAllResponses(items, {}, 'OD'),
  { a: 'OD', b: 'OD', c: 'OD' },
  'Select All OD sets every unanswered item',
);
assert.deepStrictEqual(
  computeSelectAllResponses(items, allOD, 'OD'),
  {},
  'Select All OD toggles a full OD group off',
);

console.log('selectAllResponses: all checks passed');
