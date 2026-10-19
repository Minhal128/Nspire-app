/**
 * API Service Configuration
 * Central configuration and utility functions for API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../utils/storage';
import networkService from './networkService';

// API Base URL - use deployed DigitalOcean backend only
const API_BASE_URL = 'https://sea-lion-app-2u676.ondigitalocean.app/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
};

// Type definitions for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface User {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin?: string;
  createdAt?: string;
  phone?: string;
  profileImage?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Property {
  _id: string;
  propertyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  buildings: number;
  units: number;
  unitList?: string[];  // Optional list of specific unit names/numbers
  inspectionCoverage?: string;
  calculatedUnits?: number;
  buildingDetails?: { buildingId: string; totalUnits: number; unitsForInspection: number }[];
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  _id: string;
  inspectionId: string;
  property: Property | string;
  building?: string;
  unit?: string;
  inspectionType: string;
  inspectionLevel: string;
  inspector: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  complianceScore?: number;
  findings?: any[];
  notes?: string;
  createdAt: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: any[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  orderDate: string;
  deliveryDate?: string;
}

export interface Asset {
  _id: string;
  assetId: string;
  name: string;
  category: string;
  description?: string;
  location: string;
  value: number;
  status: string;
  condition: string;
  purchaseDate?: string;
  lastUpdated: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Thrown instead of waiting out the timeout when the device has no connection.
 *
 * Callers must be able to tell "the server said no" from "we never reached the
 * server" — see isUnreachableError below.
 */
export class OfflineError extends Error {
  constructor() {
    super('No internet connection. Your work is saved on this device and syncs when you reconnect.');
    this.name = 'OfflineError';
  }
}

/**
 * True when a request failed without the server ever answering.
 *
 * A caller that ends a session or discards local work on failure must only do
 * so on a real answer from the server; this separates the two.
 */
export const isUnreachableError = (error: any): boolean => {
  const name = String(error?.name || '');
  const message = String(error?.message || '').toLowerCase();
  return (
    name === 'OfflineError' ||
    name === 'AbortError' ||
    message.includes('network request failed') ||
    message.includes('request timeout')
  );
};

/** The stored token, unwrapped. Saved with JSON.stringify, but not always. */
const readAuthToken = async (): Promise<string | null> => {
  const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
  if (!storedToken) return null;
  try {
    return JSON.parse(storedToken);
  } catch (e) {
    // Token might not be JSON wrapped
    return storedToken;
  }
};

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Encode bytes without assuming a btoa or Buffer polyfill is loaded — React
 * Native ships neither reliably, and expo-file-system writes base64.
 */
export const bytesToBase64 = (bytes: Uint8Array): string => {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : undefined;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : undefined;
    out += BASE64_ALPHABET[b0 >> 2];
    out += BASE64_ALPHABET[((b0 & 3) << 4) | ((b1 ?? 0) >> 4)];
    out += b1 === undefined ? '=' : BASE64_ALPHABET[((b1 & 15) << 2) | ((b2 ?? 0) >> 6)];
    out += b2 === undefined ? '=' : BASE64_ALPHABET[b2 & 63];
  }
  return out;
};

/**
 * apiRequest for an endpoint that answers with a file instead of JSON, returned
 * base64-encoded. Same auth, offline guard and timeout; an error response is
 * still JSON, so its message is unwrapped the same way.
 */
export const apiRequestBase64 = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<string> => {
  if (networkService.hasNoConnection()) {
    throw new OfflineError();
  }

  const token = await readAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.headers) Object.assign(headers, options.headers as Record<string, string>);
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      try {
        const body = await response.json();
        if (body?.message) message = body.message;
      } catch (e) {
        // Body was not JSON; the status line is all we have.
      }
      throw new Error(message);
    }

    const buffer = await response.arrayBuffer();
    return bytesToBase64(new Uint8Array(buffer));
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
};

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // With no network interface the request can only burn its full 30s timeout,
  // and screens that gate their whole UI on it render a spinner with nothing
  // touchable for that entire window. Fail now so they can fall back to the
  // local copy immediately.
  if (networkService.hasNoConnection()) {
    throw new OfflineError();
  }

  const token = await readAuthToken();

  console.log('API Request to:', endpoint, 'Token present:', !!token);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge any custom headers
  if (options.headers) {
    const customHeaders = options.headers as Record<string, string>;
    Object.assign(headers, customHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Get response as text first to handle non-JSON errors (like Vercel HTML errors)
    const responseText = await response.text();
    let data: any;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      // If it's not JSON, it's likely an HTML error page or plain text error
      if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${responseText.substring(0, 100)}...`);
      }
      // If it was supposed to be a success but failed to parse JSON
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 50)}...`);
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please check your connection.');
    }

    throw error;
  }
};

// API Methods object for easy importing
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : null,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : null,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : null,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
