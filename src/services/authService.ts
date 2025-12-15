/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import api, { AuthResponse, User } from './api';
import { storeData, getData, removeData, StorageKeys } from '../utils/storage';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: string;
}

export interface SignupCredentials {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.token) {
        // Store token and user data
        await storeData(StorageKeys.USER_TOKEN, response.token);
        await storeData(StorageKeys.USER_DATA, response.user);
        await storeData(StorageKeys.USER_TYPE, response.user.role);
        
        if (credentials.rememberMe) {
          await storeData(StorageKeys.REMEMBER_ME, true);
        }
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  }

  /**
   * Register new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', credentials);
      
      if (response.success && response.token) {
        // Store token and user data
        await storeData(StorageKeys.USER_TOKEN, response.token);
        await storeData(StorageKeys.USER_DATA, response.user);
        await storeData(StorageKeys.USER_TYPE, response.user.role);
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - token-based auth doesn't require server-side logout)
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.log('Logout API call failed:', error);
    } finally {
      // Clear local storage
      await removeData(StorageKeys.USER_TOKEN);
      await removeData(StorageKeys.USER_DATA);
      await removeData(StorageKeys.USER_TYPE);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; user: User }>('/auth/me');
      
      if (response.success && response.user) {
        await storeData(StorageKeys.USER_DATA, response.user);
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.log('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await getData(StorageKeys.USER_TOKEN);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      return await getData(StorageKeys.USER_DATA);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored user type/role
   */
  async getUserType(): Promise<string | null> {
    try {
      return await getData(StorageKeys.USER_TYPE);
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify stored token
   */
  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.post<{ success: boolean }>('/auth/verify-token');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check and restore session
   */
  async checkSession(): Promise<AuthState> {
    try {
      const token = await getData(StorageKeys.USER_TOKEN);
      const user = await getData(StorageKeys.USER_DATA);
      
      if (!token) {
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        };
      }

      // Verify token is still valid
      const isValid = await this.verifyToken();
      
      if (!isValid) {
        await this.logout();
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        };
      }

      return {
        isAuthenticated: true,
        user,
        token,
        loading: false,
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      };
    }
  }

  /**
   * Get dashboard route based on user role
   */
  getDashboardRoute(role: string): string {
    switch (role) {
      case 'management':
      case 'supervisor':
        return 'ManagementDashboard';
      case 'asset-manager':
        return 'AssetsManagerDashboard';
      case 'other':
      case 'order':
        return 'OrderDashboard';
      case 'inspector':
      case 'property-manager':
      default:
        return 'Dashboard';
    }
  }
}

export const authService = new AuthService();
export default authService;
