/**
 * Stripe unlock helper check.
 *
 *   node --experimental-strip-types src/utils/stripeUnlock.check.ts
 *
 * The app has no card form: the only thing standing between a payer and their
 * report is this address, so a bad one silently mails the link nowhere.
 */

import assert from 'node:assert';
import { isValidEmail, resolveUnlockReference } from './stripeUnlock.ts';

assert.ok(isValidEmail('  inspector@example.com '));
for (const bad of ['', 'nope', 'a@b', 'a b@c.com', '@example.com']) {
    assert.ok(!isValidEmail(bad), `expected ${JSON.stringify(bad)} to be rejected`);
}

// A real inspection id wins, and nothing is allowed to dress up a local label
// as one: `${propertyId}_${buildingId}` matches no server record, so a session
// built on it charges the card and unlocks nothing.
const property = { _id: 'prop-id', propertyId: 'PROP-0001' };

assert.equal(resolveUnlockReference('insp-id', property), 'insp-id');
assert.equal(resolveUnlockReference(undefined, property), 'prop-id');
assert.equal(resolveUnlockReference('', property), 'prop-id');
assert.equal(resolveUnlockReference(null, { propertyId: 'PROP-0001' }), 'PROP-0001');

// No server id anywhere means no payment may be offered at all.
assert.equal(resolveUnlockReference(undefined, undefined), '');
assert.equal(resolveUnlockReference(null, {}), '');
assert.equal(resolveUnlockReference('   ', null), '');

console.log('stripeUnlock.check.ts OK');
