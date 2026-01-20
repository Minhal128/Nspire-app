/**
 * Network Service
 * Monitors connectivity status and triggers sync operations
 */

import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

export type ConnectionStatus = 'online' | 'offline' | 'checking';

export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: string;
}

type NetworkListener = (isConnected: boolean) => void;

class NetworkService {
  private listeners: Set<NetworkListener> = new Set();
  private subscription: NetInfoSubscription | null = null;
  private currentState: NetworkState = {
    isConnected: true,
    isInternetReachable: null,
    connectionType: 'unknown',
  };

  /**
   * Initialize network monitoring
   */
  async initialize(): Promise<void> {
    // Get initial state
    const state = await NetInfo.fetch();
    this.updateState(state);

    // Subscribe to network changes
    this.subscription = NetInfo.addEventListener((state) => {
      this.updateState(state);
    });
  }

  /**
   * Update internal state and notify listeners
   */
  private updateState(state: NetInfoState): void {
    const wasConnected = this.currentState.isConnected;
    
    this.currentState = {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      connectionType: state.type,
    };

    const isNowConnected = this.currentState.isConnected && 
      (this.currentState.isInternetReachable === true || this.currentState.isInternetReachable === null);

    // Notify listeners if connection status changed
    if (wasConnected !== isNowConnected) {
      this.notifyListeners(isNowConnected);
    }
  }

  /**
   * Check current connectivity status
   */
  async checkConnection(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      this.updateState(state);
      
      // Also do a real connectivity test
      const isReachable = await this.testInternetReachability();
      return isReachable;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  /**
   * Test actual internet reachability by making a request
   */
  async testInternetReachability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok || response.status === 204;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    if (this.currentState.isConnected && this.currentState.isInternetReachable !== false) {
      return 'online';
    }
    return 'offline';
  }

  /**
   * Check if currently online
   */
  isOnline(): boolean {
    return this.currentState.isConnected && this.currentState.isInternetReachable !== false;
  }

  /**
   * Add listener for connection changes
   */
  addListener(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of connection change
   */
  private notifyListeners(isConnected: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isConnected);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Cleanup subscriptions
   */
  cleanup(): void {
    if (this.subscription) {
      this.subscription();
      this.subscription = null;
    }
    this.listeners.clear();
  }
}

export const networkService = new NetworkService();
export default networkService;
