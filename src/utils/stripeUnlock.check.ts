/**
 * Stripe unlock decision check.
 *
 *   node --experimental-strip-types src/utils/stripeUnlock.check.ts
 *
 * Why this exists: this is the money path. The one way to get it badly wrong is
 * to read the browser dismissal before the session status — someone who pays and
 * then taps "Done" hands back both, and the wrong order tells a paying customer
 * their payment was cancelled.
 */

import assert from 'node:assert';
import { resolveStripeUnlock, isValidEmail } from './stripeUnlock.ts';

// Paid, then closed the browser by hand — the dismissal must not win.
assert.strictEqual(
    resolveStripeUnlock(true, { paymentStatus: 'paid', isReportUnlocked: true }).outcome,
    'unlocked',
);

// Paid, but the backend has not flipped the unlock yet — never "cancelled".
assert.strictEqual(
    resolveStripeUnlock(true, { paymentStatus: 'paid', isReportUnlocked: false }).outcome,
    'pending',
);

// Closed without paying.
assert.strictEqual(
    resolveStripeUnlock(true, { paymentStatus: 'unpaid', isReportUnlocked: false }).outcome,
    'cancelled',
);

// Status call failed — unknown, so never claim unlocked.
assert.strictEqual(resolveStripeUnlock(true, null).outcome, 'cancelled');
assert.strictEqual(resolveStripeUnlock(false, null).outcome, 'pending');

assert.ok(isValidEmail('  inspector@example.com '));
for (const bad of ['', 'nope', 'a@b', 'a b@c.com', '@example.com']) {
    assert.ok(!isValidEmail(bad), `expected ${JSON.stringify(bad)} to be rejected`);
}

console.log('stripeUnlock.check.ts OK');
