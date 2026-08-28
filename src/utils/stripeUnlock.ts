/**
 * Pure decision helpers for the Stripe checkout unlock.
 *
 * Split out from stripeService so it can be exercised by
 * stripeUnlock.check.ts without pulling in expo-web-browser / AsyncStorage.
 */

export type StripeCheckoutOutcome = 'unlocked' | 'pending' | 'cancelled';

export interface StripeUnlockDecision {
    outcome: StripeCheckoutOutcome;
    message: string;
}

/**
 * Decide what to tell the user once the Stripe checkout browser closes.
 *
 * Order matters: someone who pays and then taps "Done" hands back
 * browserDismissed=true AND a paid session. Reading the dismissal first
 * would report a completed payment as a cancellation.
 */
export const resolveStripeUnlock = (
    browserDismissed: boolean,
    status: { paymentStatus?: string; isReportUnlocked?: boolean } | null,
): StripeUnlockDecision => {
    if (status?.isReportUnlocked) {
        return { outcome: 'unlocked', message: 'Payment confirmed. Report unlocked!' };
    }
    if (status?.paymentStatus === 'paid') {
        return {
            outcome: 'pending',
            message: 'Payment received. The unlock is still processing — reopen this report in a moment.',
        };
    }
    if (browserDismissed) {
        return { outcome: 'cancelled', message: 'Payment was cancelled. Report remains locked.' };
    }
    return { outcome: 'pending', message: 'Payment is not completed yet. Please try again in a moment.' };
};

/**
 * Web gets this free from <input type="email" required>; React Native has no
 * equivalent, so the same guard has to live in code before we ask the backend
 * to mail a payment link.
 */
export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
