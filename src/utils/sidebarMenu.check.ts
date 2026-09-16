/**
 * Self-check for the sidebar menu.
 *
 *   node --experimental-strip-types src/utils/sidebarMenu.check.ts
 *
 * The important assertion is the last one: every menu id must be a screen
 * registered in App.tsx. A menu entry pointing at a missing route renders a
 * button that silently does nothing.
 */

import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { menuItemsFor, userTypeForRole } from './sidebarMenu.ts';

const ids = (userType: string) => menuItemsFor(userType).map((i) => i.id);

// --- role -> portal, matching authService.getDashboardRoute ---------------
assert.strictEqual(userTypeForRole('other'), 'Other');
assert.strictEqual(userTypeForRole('order'), 'Other');
assert.strictEqual(userTypeForRole('management'), 'Management');
assert.strictEqual(userTypeForRole('supervisor'), 'Management');
assert.strictEqual(userTypeForRole('property-manager'), 'Management');
assert.strictEqual(userTypeForRole('asset-manager'), 'AssetsManager');
assert.strictEqual(userTypeForRole('inspector'), 'Inspector');
assert.strictEqual(userTypeForRole('admin'), 'Inspector', 'admin keeps the inspector menu');
assert.strictEqual(userTypeForRole(undefined), 'Inspector');

// --- each portal gets its own menu ---------------------------------------
assert.deepStrictEqual(ids('AssetsManager'), ['Dashboard'], 'assets manager has no other pages');
// Inspector, Management and Other all render the one shared menu.
for (const userType of ['Inspector', 'Management', 'Other']) {
  assert.deepStrictEqual(ids(userType), [
    'Dashboard',
    'MyInspections',
    'InspectionStatus',
    'Settings',
  ]);
}

// Reports was dropped from the sidebar; no portal may still offer it.
assert.ok(!ids('Inspector').includes('Reports'));
assert.ok(!ids('Management').includes('ManagementReports'));

// --- every id is a real route --------------------------------------------
const app = readFileSync(new URL('../../App.tsx', import.meta.url), 'utf8');
const registered = new Set(
  [...app.replace(/\s+/g, ' ').matchAll(/<Stack\.Screen name="([A-Za-z]+)"/g)].map((m) => m[1])
);
assert.ok(registered.size > 20, `expected the full navigator, parsed ${registered.size} screens`);

for (const userType of ['Inspector', 'Management', 'Other', 'AssetsManager']) {
  for (const id of ids(userType)) {
    assert.ok(registered.has(id), `${userType} menu -> "${id}" is not a screen in App.tsx`);
  }
}

console.log('sidebarMenu.check.ts OK');
