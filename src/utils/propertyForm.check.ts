/**
 * Self-check for the Add-Property form rules.
 *
 *   node --experimental-strip-types src/utils/propertyForm.check.ts
 */

import assert from 'node:assert';
import type { PropertyFormValues } from './propertyForm.ts';
import { validatePropertyForm, buildPropertyPayload } from './propertyForm.ts';

const base = (over: Partial<PropertyFormValues> = {}): PropertyFormValues => ({
  propertyId: '',
  propertyName: '',
  address: '',
  countryText: '',
  stateText: '',
  cityText: '',
  postalCode: '',
  numberOfBuildings: '',
  numberOfUnits: '',
  resolvedCountryCode: '',
  resolvedStateCode: '',
  resolvedCityName: '',
  ...over,
});

// --- the exact form from the bug report ----------------------------------
// Every field the screen renders is filled; Country has no input at all.
const reported = base({
  propertyName: 'Test Property',
  address: 'Main Street',
  cityText: 'Kara Hi',
  stateText: 'Sindh',
  numberOfUnits: '25',
  numberOfBuildings: '1',
  postalCode: '76373',
});
assert.strictEqual(
  validatePropertyForm(reported, 0),
  null,
  'a form with no Country must submit — the screen has no Country field',
);

// --- the fields that ARE on screen stay required --------------------------
assert.strictEqual(validatePropertyForm(base(), 0), 'Property 1: Property Name is required');
assert.strictEqual(
  validatePropertyForm({ ...reported, address: '   ' }, 1),
  'Property 2: Address is required',
  'index is 1-based in the message',
);
assert.strictEqual(validatePropertyForm({ ...reported, stateText: '' }, 0), 'Property 1: State is required');
assert.strictEqual(validatePropertyForm({ ...reported, cityText: '' }, 0), 'Property 1: City is required');
assert.strictEqual(validatePropertyForm({ ...reported, postalCode: '' }, 0), 'Property 1: Postal Code is required');

// --- payload with no country ---------------------------------------------
const payload = buildPropertyPayload(reported, 0, 1700000000000);
assert.strictEqual('country' in payload, false, 'country key is omitted, never sent empty');
assert.strictEqual('countryName' in payload, false);
assert.deepStrictEqual(payload, {
  propertyId: 'PROP-1700000000000-0',
  name: 'Test Property',
  address: 'Main Street',
  city: 'Kara Hi',
  state: 'Sindh',
  stateName: 'Sindh',
  zipCode: '76373',
  buildings: 1,
  units: 25,
});

// --- payload when a file import did resolve a country ---------------------
const imported = buildPropertyPayload(
  base({
    propertyId: 'P-9',
    propertyName: 'Imported',
    address: 'Road 1',
    countryText: 'Pakistan',
    resolvedCountryCode: 'PK',
    stateText: 'Sindh',
    resolvedStateCode: 'SD',
    cityText: 'Karachi',
    resolvedCityName: 'Karachi',
    postalCode: '75000',
    numberOfBuildings: '3',
    numberOfUnits: '40',
  }),
  1,
);
assert.strictEqual(imported.propertyId, 'P-9', 'a typed Property ID is kept');
assert.strictEqual((imported as any).country, 'PK');
assert.strictEqual((imported as any).countryName, 'Pakistan');
assert.strictEqual(imported.state, 'SD');
assert.strictEqual(imported.stateName, 'Sindh');
assert.strictEqual(imported.city, 'Karachi');
assert.strictEqual(imported.buildings, 3);
assert.strictEqual(imported.units, 40);

// --- counts fall back to 1, never NaN ------------------------------------
const blankCounts = buildPropertyPayload(reported, 0, 1);
assert.strictEqual(buildPropertyPayload({ ...reported, numberOfUnits: 'abc' }, 0, 1).units, 1);
assert.strictEqual(blankCounts.buildings, 1);

console.log('propertyForm.check.ts OK');
