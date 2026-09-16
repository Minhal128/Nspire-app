/**
 * Stripe checkout — the app side of web's lib/api.ts `paymentsAPI`.
 *
 * The app never takes a card. It asks the backend to email a checkout link and
 * then polls `check-unlock` to find out when the payment landed, so the payer
 * can be someone else entirely, on any device.
 */

import { api } from '../services/api';

export interface StripeCheckoutSession {
    success: boolean;
    message?: string;
    checkoutUrl?: string;
    sessionId?: string;
    isReportUnlocked?: boolean;
    alreadyUnlocked?: boolean;
}

export const stripeService = {
    /**
     * Is this report already paid for? True when the inspection itself is
     * unlocked or the user holds a global unlock from an earlier payment.
     * Never throws — a failed check just means "show the pay button".
     */
    async checkUnlockStatus(inspectionId: string): Promise<boolean> {
        try {
            const res = await api.get<{
                success: boolean;
                isReportUnlocked: boolean;
                hasGlobalUnlock?: boolean;
            }>(`/payments/check-unlock/${encodeURIComponent(inspectionId)}`);
            return (res.isReportUnlocked ?? false) || (res.hasGlobalUnlock ?? false);
        } catch (err: any) {
            console.warn('Stripe: unlock check failed', err?.message || err);
            return false;
        }
    },

    shareCheckoutLink: (inspectionId: string, email: string) =>
        api.post<StripeCheckoutSession>('/payments/share-stripe-link', { inspectionId, email }),

};

export default stripeService;
