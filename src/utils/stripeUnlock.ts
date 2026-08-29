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
