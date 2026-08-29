/**
 * Stripe unlock helper check.
 *
 *   node --experimental-strip-types src/utils/stripeUnlock.check.ts
 *
 * The app has no card form: the only thing standing between a payer and their
 * report is this address, so a bad one silently mails the link nowhere.
 */

import assert from 'node:assert';
import { isValidEmail } from './stripeUnlock.ts';

assert.ok(isValidEmail('  inspector@example.com '));
for (const bad of ['', 'nope', 'a@b', 'a b@c.com', '@example.com']) {
    assert.ok(!isValidEmail(bad), `expected ${JSON.stringify(bad)} to be rejected`);
}

console.log('stripeUnlock.check.ts OK');
