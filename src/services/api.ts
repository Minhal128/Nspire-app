/**
 * API Service Configuration
 * Central configuration and utility functions for API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../utils/storage';

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

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Get token from storage - it's stored with JSON.stringify, so we need to parse it
  const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
  let token = null;

  if (storedToken) {
    try {
      token = JSON.parse(storedToken);
    } catch (e) {
      // Token might not be JSON wrapped
      token = storedToken;
    }
  }

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
