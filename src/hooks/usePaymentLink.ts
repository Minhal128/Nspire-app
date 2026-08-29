import { useEffect, useRef, useState } from 'react';
import { stripeService } from '../utils/stripeService';
import { isValidEmail } from '../utils/stripeUnlock';

/**
 * Email-only Stripe unlock.
 *
 * There is no in-app card entry: the backend mails a checkout link, the payer
 * opens it wherever they like, and the app finds out by asking the backend
 * whether the report has been unlocked yet.
 */
export const usePaymentLink = (
  inspectionId: string,
  onUnlocked: () => void,
  /** Only poll while the payment sheet is on screen — a closed sheet must not
   *  keep hitting the API. A missed unlock is picked up on the next mount. */
  active: boolean = true,
) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // onUnlocked is re-created every render; the poll must call the latest one.
  const unlockedRef = useRef(onUnlocked);
  unlockedRef.current = onUnlocked;

  /** Ask the backend once. Returns true when the report is now unlocked. */
  const checkNow = async (): Promise<boolean> => {
    setChecking(true);
    try {
      const unlocked = await stripeService.checkUnlockStatus(inspectionId);
      if (unlocked) {
        setSentTo(null);
        unlockedRef.current();
      }
      return unlocked;
    } finally {
      setChecking(false);
    }
  };

  /** Mail the checkout link. Returns false (with `error` set) if it failed. */
  const send = async (): Promise<boolean> => {
    const address = email.trim();
    if (!isValidEmail(address)) {
      setError('Enter a valid email address to send the payment link to.');
      return false;
    }

    setSending(true);
    setError(null);
    try {
      const data = await stripeService.shareCheckoutLink(inspectionId, address);

      if (data?.isReportUnlocked || data?.alreadyUnlocked) {
        unlockedRef.current();
        return true;
      }
      if (!data?.success) throw new Error(data?.message || 'Failed to send payment link.');

      setSentTo(address);
      return true;
    } catch (err: any) {
      setError(err?.message || 'An error occurred while sending the payment link.');
      return false;
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setSentTo(null);
    setError(null);
  };

  // Once the link is out, watch for the payment landing.
  // ponytail: fixed 5s poll while the payment sheet is open — swap for a
  // backend push/webhook signal if the extra requests ever matter.
  useEffect(() => {
    if (!sentTo || !active) return;
    const id = setInterval(() => { void checkNow(); }, 5000);
    return () => clearInterval(id);
  }, [sentTo, active, inspectionId]);

  return { email, setEmail, sending, checking, sentTo, error, send, checkNow, reset };
};
