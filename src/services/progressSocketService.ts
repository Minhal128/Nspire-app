import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './api';
import { StorageKeys } from '../utils/storage';

export interface ProgressSocketUpdate {
  propertyId: string;
  buildingId: string;
  inspectionType: string;
  responses: Record<string, any>;
  updatedAt: string;
}

type ProgressUpdateListener = (update: ProgressSocketUpdate) => void;

class ProgressSocketService {
  private socket: WebSocket | null = null;
  private listeners = new Set<ProgressUpdateListener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private shouldReconnect = true;

  private buildSocketUrl(): string {
    const apiBase = String(API_CONFIG.BASE_URL || '').replace(/\/+$/, '');
    const baseWithoutApi = apiBase.replace(/\/api$/i, '');

    if (baseWithoutApi.startsWith('https://')) {
      return `${baseWithoutApi.replace('https://', 'wss://')}/ws/progress`;
    }

    if (baseWithoutApi.startsWith('http://')) {
      return `${baseWithoutApi.replace('http://', 'ws://')}/ws/progress`;
    }

    return `${baseWithoutApi}/ws/progress`;
  }

  private async getAuthToken(): Promise<string> {
    const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
    if (!storedToken) {
      return '';
    }

    try {
      const parsed = JSON.parse(storedToken);
      return typeof parsed === 'string' ? parsed : '';
    } catch {
      return storedToken;
    }
  }

  private emit(update: ProgressSocketUpdate): void {
    this.listeners.forEach((listener) => {
      try {
        listener(update);
      } catch (error) {
        console.error('Progress socket listener error:', error);
      }
    });
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private scheduleDeferredClose(): void {
    this.clearCloseTimer();

    this.closeTimer = setTimeout(() => {
      if (this.listeners.size > 0) {
        return;
      }

      this.shouldReconnect = false;
      this.clearReconnectTimer();

      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }, 1500);
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect || this.listeners.size === 0) {
      return;
    }

    this.clearReconnectTimer();

    const attempt = Math.min(this.reconnectAttempts + 1, 6);
    this.reconnectAttempts = attempt;
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);

    this.reconnectTimer = setTimeout(() => {
      this.connectIfNeeded().catch((error) => {
        console.error('Progress socket reconnect failed:', error);
      });
    }, delay);
  }

  private async connectIfNeeded(): Promise<void> {
    if (this.socket || this.isConnecting || this.listeners.size === 0) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await this.getAuthToken();
      if (!token) {
        this.isConnecting = false;
        return;
      }

      const socketUrl = `${this.buildSocketUrl()}?token=${encodeURIComponent(token)}`;
      console.log(`[ProgressSocket] Connecting to ${socketUrl}`);
      const socket = new WebSocket(socketUrl);

      this.socket = socket;

      socket.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.clearReconnectTimer();
        console.log('[ProgressSocket] Connected');
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(String(event?.data || '{}'));
          if (payload?.type === 'progress.connected') {
            console.log('[ProgressSocket] Connection acknowledged by server', payload?.data || {});
            return;
          }

          if (payload?.type !== 'progress.updated' || !payload?.data) {
            return;
          }

          const update: ProgressSocketUpdate = {
            propertyId: String(payload.data.propertyId || ''),
            buildingId: String(payload.data.buildingId || ''),
            inspectionType: String(payload.data.inspectionType || ''),
            responses: payload.data.responses && typeof payload.data.responses === 'object'
              ? payload.data.responses
              : {},
            updatedAt: String(payload.data.updatedAt || new Date().toISOString()),
          };

          this.emit(update);
        } catch (error) {
          console.error('Progress socket message parse error:', error);
        }
      };

      socket.onerror = () => {
        console.warn('[ProgressSocket] Socket error encountered');
        // onclose handles reconnection scheduling
      };

      socket.onclose = (event) => {
        this.socket = null;
        this.isConnecting = false;
        console.log(`[ProgressSocket] Disconnected (code: ${event?.code ?? 'unknown'}, reason: ${event?.reason || 'none'})`);
        this.scheduleReconnect();
      };
    } catch (error) {
      this.socket = null;
      this.isConnecting = false;
      this.scheduleReconnect();
      throw error;
    }
  }

  subscribe(listener: ProgressUpdateListener): () => void {
    this.clearCloseTimer();
    this.listeners.add(listener);
    this.shouldReconnect = true;

    this.connectIfNeeded().catch((error) => {
      console.error('Progress socket connect failed:', error);
    });

    return () => {
      this.listeners.delete(listener);

      if (this.listeners.size === 0) {
        this.scheduleDeferredClose();
      }
    };
  }
}

export const progressSocketService = new ProgressSocketService();
export default progressSocketService;
