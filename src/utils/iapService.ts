/**
 * In-App Purchase Service
 * Handles Google Play Billing integration for report unlocking.
 *
 * Uses react-native-iap to interface with the native Google Play
 * Billing library.  After a successful purchase the token is sent
 * to our backend for server-side verification.
 */

import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type ProductPurchase,
  type PurchaseError,
  type Product,
} from 'react-native-iap';
import { api } from '../services/api';

// ── Configuration ──────────────────────────────────────────────────
export const IAP_PRODUCT_ID = 'com.inspire.report.unlock';
const IAP_SKUS = [IAP_PRODUCT_ID];

// ── Types ──────────────────────────────────────────────────────────
export interface IAPVerifyResult {
  success: boolean;
  message: string;
  isReportUnlocked: boolean;
}

// ── Service class ──────────────────────────────────────────────────
class IAPService {
  private connected = false;
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;

  /**
   * Initialise the IAP connection.
   * Call this once when the relevant screen mounts.
   * Wrapped in try-catch to prevent crashes if Google Play is unavailable.
   */
  async init(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('IAP: Web platform – skipping init');
      return false;
    }

    try {
      const result = await initConnection();
      this.connected = true;
      console.log('IAP: Connection established', result);
      return true;
    } catch (err: any) {
      console.warn('IAP: Connection failed (Google Play may not be available)', err?.message || err);
      this.connected = false;
      return false;
    }
  }

  /**
   * Fetch the available products (should return the $99 report SKU).
   * Gracefully handles errors without crashing.
   */
  async getReportProduct(): Promise<Product | null> {
    if (!this.connected) {
      console.warn('IAP: Not connected – skipping product fetch');
      return null;
    }

    try {
      const products = await fetchProducts({ skus: IAP_SKUS });
      console.log('IAP: Products fetched', products);
      return products && products.length > 0 ? products[0] : null;
    } catch (err: any) {
      console.warn('IAP: Failed to fetch products (Play Store may not be available)', err?.message || err);
      return null;
    }
  }

  /**
   * Purchase the report unlock product.
   * Returns the purchase object on success, null on failure/cancel.
   * Handles various error codes gracefully.
   */
  async purchaseReportUnlock(): Promise<ProductPurchase | null> {
    if (!this.connected) {
      console.warn('IAP: Not connected – trying to reconnect');
      const initialized = await this.init();
      if (!initialized) {
        throw new Error('Google Play Store is not available. Please ensure you have a working internet connection and Google Play Services.');
      }
    }

    try {
      console.log('IAP: Requesting purchase for SKU:', IAP_PRODUCT_ID);

      // For react-native-iap v15+ (Nitro API)
      const purchaseResult = await requestPurchase({
        type: 'in-app',
        request: {
          google: {
            skus: [IAP_PRODUCT_ID],
          },
          apple: {
            sku: IAP_PRODUCT_ID,
            andDangerouslyFinishTransactionAutomatically: false,
          },
        },
      });

      console.log('IAP: Purchase response received:', JSON.stringify(purchaseResult));

      if (!purchaseResult || purchaseResult.type === 'null') {
        console.log('IAP: Purchase result is null (user cancelled or product not found)');
        return null;
      }

      if (purchaseResult.type === 'multiple') {
        return purchaseResult.purchases.length > 0 ? (purchaseResult.purchases[0] as any) : null;
      }

      return (purchaseResult.purchase as any) || null;
    } catch (err: any) {
      const errorCode = err?.code || err?.message;
      console.warn('IAP: Purchase error details:', err);

      if (errorCode === 'E_USER_CANCELLED' || errorCode === 'RESULT_USER_CANCELED') {
        console.log('IAP: User cancelled purchase');
        return null;
      }

      throw new Error(`Purchase failed: ${err?.message || 'Unknown error'}`);
    }
  }

  /**
   * After a successful purchase, send the token to our backend
   * for verification and database unlock.
   */
  async verifyAndUnlock(
    inspectionId: string,
    purchaseToken: string,
    productId: string = IAP_PRODUCT_ID,
  ): Promise<IAPVerifyResult> {
    try {
      const response = await api.post<IAPVerifyResult>(
        '/payments/verify-iap',
        {
          inspectionId,
          purchaseToken,
          productId,
          packageName: 'com.minhal.inspire',
        },
      );

      return {
        success: response.success ?? false,
        message: response.message ?? 'Verification complete',
        isReportUnlocked: response.isReportUnlocked ?? false,
      };
    } catch (err: any) {
      console.error('IAP: Backend verification failed', err);
      return {
        success: false,
        message: err.message || 'Verification failed',
        isReportUnlocked: false,
      };
    }
  }

  /**
   * Finish (acknowledge) a transaction so Google Play doesn't
   * automatically refund it after 3 days.
   */
  async acknowledge(purchase: ProductPurchase): Promise<void> {
    try {
      await finishTransaction({ purchase, isConsumable: true });
      console.log('IAP: Transaction finished');
    } catch (err: any) {
      console.warn('IAP: Failed to finish transaction (non-critical)', err?.message || err);
    }
  }

  /**
   * Check if a report is already unlocked via the backend.
   * Returns false on any error to allow normal purchase flow.
   */
  async checkUnlockStatus(inspectionId: string): Promise<boolean> {
    try {
      const response = await api.get<{ success: boolean; isReportUnlocked: boolean }>(
        `/payments/check-unlock/${inspectionId}`,
      );
      return response.isReportUnlocked ?? false;
    } catch (err: any) {
      // Silently fail - user can still proceed with purchase
      console.warn('IAP: Backend unlock check failed (allowing normal flow)', err?.message || err);
      return false;
    }
  }

  /**
   * Register listeners for purchase events.
   * Returns a cleanup function to call on unmount.
   */
  registerListeners(
    onPurchase: (purchase: ProductPurchase) => void,
    onError: (error: PurchaseError) => void,
  ): () => void {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(onPurchase);
    this.purchaseErrorSubscription = purchaseErrorListener(onError);

    return () => {
      this.purchaseUpdateSubscription?.remove();
      this.purchaseErrorSubscription?.remove();
    };
  }

  /**
   * Tear down the IAP connection.
   * Call this when the screen unmounts.
   */
  async destroy(): Promise<void> {
    this.purchaseUpdateSubscription?.remove();
    this.purchaseErrorSubscription?.remove();

    if (this.connected) {
      try {
        await endConnection();
      } catch (_) {
        /* ignore */
      }
      this.connected = false;
    }
  }
}

// Export a singleton
export const iapService = new IAPService();
export default iapService;
