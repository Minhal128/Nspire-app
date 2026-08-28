/**
 * Stripe hosted checkout — the app side of web's lib/api.ts `paymentsAPI`.
 *
 * Web redirects the tab to the Checkout URL and reads ?payment=success&session_id=
 * when Stripe sends it back. A native screen has no tab to redirect, so the URL is
 * opened in an auth session and the backend is asked for the session status once
 * that browser closes. Same endpoints, same two-step verify.
 *
 * This is the only payment path in the app. Google Play Billing was removed,
 * so a Play-distributed build has to satisfy Google's Payments policy some
 * other way before shipping.
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { api } from '../services/api';
import { resolveStripeUnlock, type StripeUnlockDecision } from './stripeUnlock';

export interface StripeCheckoutSession {
    success: boolean;
    message?: string;
    checkoutUrl?: string;
    sessionId?: string;
    isReportUnlocked?: boolean;
    alreadyUnlocked?: boolean;
}

export interface StripeSessionStatus {
    success: boolean;
    paymentStatus: string;
    isReportUnlocked: boolean;
    sessionId: string;
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

    createCheckoutSession: (inspectionId: string) =>
        api.post<StripeCheckoutSession>('/payments/create-stripe-checkout-session', { inspectionId }),

    getSessionStatus: (sessionId: string) =>
        api.get<StripeSessionStatus>(`/payments/stripe-session-status/${encodeURIComponent(sessionId)}`),

    shareCheckoutLink: (inspectionId: string, email: string) =>
        api.post<StripeCheckoutSession>('/payments/share-stripe-link', { inspectionId, email }),

    /**
     * Open hosted checkout and report what happened.
     * Throws if the session cannot be created — the caller shows that message.
     */
    async unlockWithStripe(inspectionId: string): Promise<StripeUnlockDecision> {
        const session = await stripeService.createCheckoutSession(inspectionId);

        if (session?.isReportUnlocked || session?.alreadyUnlocked) {
            return { outcome: 'unlocked', message: 'Report is already unlocked.' };
        }
        if (!session?.checkoutUrl || !session?.sessionId) {
            throw new Error(session?.message || 'Stripe checkout URL is missing.');
        }

        const result = await WebBrowser.openAuthSessionAsync(
            session.checkoutUrl,
            Linking.createURL('stripe-return'),
        );

        // Stripe's success_url is the web app, not our scheme, so a `success`
        // redirect is not expected — the browser closing is the normal end of
        // the flow, and only the backend knows whether money moved first.
        let status: StripeSessionStatus | null = null;
        try {
            status = await stripeService.getSessionStatus(session.sessionId);
        } catch (err: any) {
            console.warn('Stripe: session status check failed', err?.message || err);
        }

        return resolveStripeUnlock(result.type !== 'success', status);
    },
};

export default stripeService;
