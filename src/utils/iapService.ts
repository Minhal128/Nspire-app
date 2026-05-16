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
    } catch (err) {
      console.error('IAP: Connection failed', err);
      this.connected = false;
      return false;
    }
  }

  /**
   * Fetch the available products (should return the $99 report SKU).
   */
  async getReportProduct(): Promise<Product | null> {
    if (!this.connected) {
      console.warn('IAP: Not connected – call init() first');
      return null;
    }

    try {
      const products = await fetchProducts({ skus: IAP_SKUS });
      console.log('IAP: Products fetched', products);
      return products && products.length > 0 ? products[0] : null;
    } catch (err) {
      console.error('IAP: Failed to fetch products', err);
      return null;
    }
  }

  /**
   * Purchase the report unlock product.
   * Returns the purchase object on success, null on failure/cancel.
   */
  async purchaseReportUnlock(): Promise<ProductPurchase | null> {
    if (!this.connected) {
      console.warn('IAP: Not connected – call init() first');
      return null;
    }

    try {
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

      // In version 15+, requestPurchase returns a NitroPurchaseResult
      if (!purchaseResult || purchaseResult.type === 'null') {
        return null;
      }

      if (purchaseResult.type === 'multiple') {
        return purchaseResult.purchases.length > 0 ? (purchaseResult.purchases[0] as any) : null;
      }

      return (purchaseResult.purchase as any) || null;
    } catch (err: any) {
      if (err?.code === 'E_USER_CANCELLED') {
        console.log('IAP: User cancelled purchase');
        return null;
      }
      console.error('IAP: Purchase error', err);
      throw err;
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
          packageName: 'com.inspire.minhal',
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
    } catch (err) {
      console.error('IAP: Failed to finish transaction', err);
    }
  }

  /**
   * Check if a report is already unlocked via the backend.
   */
  async checkUnlockStatus(inspectionId: string): Promise<boolean> {
    try {
      const response = await api.get<{ success: boolean; isReportUnlocked: boolean }>(
        `/payments/check-unlock/${inspectionId}`,
      );
      return response.isReportUnlocked ?? false;
    } catch (err) {
      console.error('IAP: Failed to check unlock status', err);
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
