/**
 * Self-check for the Other-portal display rules.
 *
 *   node --experimental-strip-types src/utils/otherPortal.check.ts
 */

import assert from 'node:assert';
import {
  getRoleDisplayName,
  getRoleColor,
  getInspectionStatusColor,
  formatJoinedDate,
} from './otherPortal.ts';

// --- role labels ----------------------------------------------------------
assert.strictEqual(getRoleDisplayName('property-manager'), 'Property Manager');
assert.strictEqual(getRoleDisplayName('asset-manager'), 'Asset Manager');
assert.strictEqual(getRoleDisplayName('management'), 'Management');
assert.strictEqual(getRoleDisplayName('supervisor'), 'Supervisor');
assert.strictEqual(getRoleDisplayName('other'), 'Other');
// an unknown role is shown verbatim, not collapsed into "Other"
assert.strictEqual(getRoleDisplayName('vendor'), 'vendor');
assert.strictEqual(getRoleDisplayName(undefined), 'User');
assert.strictEqual(getRoleDisplayName(''), 'User');
// casing from the API must not change the label
assert.strictEqual(getRoleDisplayName('Property-Manager'), 'Property Manager');

// --- colours are distinct per role ---------------------------------------
const roleColors = ['management', 'supervisor', 'property-manager', 'asset-manager'].map(getRoleColor);
assert.strictEqual(new Set(roleColors).size, 4, 'each known role gets its own colour');
assert.strictEqual(getRoleColor('other'), getRoleColor('anything-else'), 'unknown roles share the grey default');

// --- inspection status colours -------------------------------------------
assert.strictEqual(getInspectionStatusColor('In-Progress'), getInspectionStatusColor('in-progress'));
assert.notStrictEqual(getInspectionStatusColor('completed'), getInspectionStatusColor('failed'));
assert.strictEqual(getInspectionStatusColor(undefined), '#6B7280');

// --- joined date ----------------------------------------------------------
const created = new Date('2024-03-05T10:00:00Z');
assert.strictEqual(
  formatJoinedDate({ createdAt: created.toISOString(), lastLogin: '2025-01-01T00:00:00Z' }),
  created.toLocaleDateString(),
  'createdAt wins over lastLogin',
);
assert.strictEqual(
  formatJoinedDate({ lastLogin: created.toISOString() }),
  created.toLocaleDateString(),
  'lastLogin is the fallback',
);
assert.strictEqual(formatJoinedDate({}), 'N/A');
assert.strictEqual(formatJoinedDate({ createdAt: 'not-a-date' }), 'N/A', 'garbage dates do not render "Invalid Date"');

console.log('otherPortal: all checks passed');
