/**
 * Pure helpers for the Stripe unlock flow.
 */

/**
 * Web gets this free from <input type="email" required>; React Native has no
 * equivalent, so the same guard has to live in code before we ask the backend
 * to mail a payment link.
 */
export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/**
 * Which id the payment flow is allowed to use.
 *
 * The summary screen labels a report `${propertyId}_${buildingId}`, which
 * exists nowhere on the server. Paying against that label produced a checkout
 * session the backend could never match back to a report: the card was
 * charged, the unlock was never written, and the poll below waited forever.
 *
 * So payment goes by a real server id only — the inspection's when the screen
 * was handed one, otherwise the property's, which is what web's summary page
 * pays with. Returns '' when there is no server id at all, and a caller that
 * gets '' must not offer payment.
 */
export const resolveUnlockReference = (
    inspectionId?: string | null,
    property?: { _id?: string; id?: string; propertyId?: string } | null,
): string =>
    String(inspectionId || property?._id || property?.id || property?.propertyId || '').trim();
