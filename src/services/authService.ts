/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import api, { AuthResponse, User } from "./api";
import { storeData, getData, removeData, StorageKeys } from "../utils/storage";

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
      const response = await api.post<AuthResponse>("/auth/login", credentials);

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
      throw new Error(error.message || "Login failed. Please try again.");
    }
  }

  /**
   * Register new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/signup",
        credentials,
      );

      if (response.success && response.token) {
        // Store token and user data
        await storeData(StorageKeys.USER_TOKEN, response.token);
        await storeData(StorageKeys.USER_DATA, response.user);
        await storeData(StorageKeys.USER_TYPE, response.user.role);
      }

      return response;
    } catch (error: any) {
      throw new Error(
        error.message || "Registration failed. Please try again.",
      );
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (optional - token-based auth doesn't require server-side logout)
      await api.post("/auth/logout");
    } catch (error) {
      // Ignore errors on logout
      console.log("Logout API call failed:", error);
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
      const response = await api.get<{ success: boolean; user: User }>(
        "/auth/me",
      );

      if (response.success && response.user) {
        await storeData(StorageKeys.USER_DATA, response.user);
        return response.user;
      }

      return null;
    } catch (error) {
      console.log("Failed to get current user:", error);
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
      const response = await api.post<{ success: boolean }>(
        "/auth/verify-token",
      );
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Social login (Google/Facebook) with portal validation
   */
  async socialLogin(data: {
    email: string;
    fullName?: string;
    portal: string;
    provider: string
  }): Promise<AuthResponse> {
    try {
      // Map portal names to role values
      const portalRoleMap: { [key: string]: string } = {
        'Inspector': 'inspector',
        'Management': 'management',
        'Other': 'other'
      };

      const role = portalRoleMap[data.portal] || 'inspector';

      const response = await api.post<AuthResponse>("/auth/social-login", {
        ...data,
        role
      });

      if (response.success && response.token) {
        // Store token and user data
        await storeData(StorageKeys.USER_TOKEN, response.token);
        await storeData(StorageKeys.USER_DATA, response.user);
        await storeData(StorageKeys.USER_TYPE, response.user.role);
      }

      return response;
    } catch (error: any) {
      throw new Error(
        error.message || "Social login failed. Please try again.",
      );
    }
  }

  /**
   * Check and restore session
   */
  async checkSession(): Promise<AuthState> {
    try {
      const token = await getData(StorageKeys.USER_TOKEN);
      const user = await getData(StorageKeys.USER_DATA);

      if (!token || !user) {
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
        };
      }

      // Try to verify token, but don't block if offline
      try {
        const isValid = await Promise.race([
          this.verifyToken(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1500)) // 1.5s timeout, assume valid if offline
        ]);

        if (!isValid) {
          await this.logout();
          return {
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
          };
        }
      } catch (verifyError) {
        // If verification fails (e.g., offline), still allow access with cached data
        console.log("Token verification failed, using cached session:", verifyError);
      }

      return {
        isAuthenticated: true,
        user,
        token,
        loading: false,
      };
    } catch (error) {
      console.log("Session check error:", error);
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
      case "management":
      case "supervisor":
      case "property-manager":
        return "ManagementDashboard";
      case "other":
      case "order":
        return "OrderDashboard";
      case "inspector":
      default:
        return "Dashboard";
    }
  }

  /**
   * Get captcha image for registration
   */
  async getCaptcha(): Promise<{ success: boolean; captchaId: string; captchaImage: string }> {
    try {
      const response = await api.get<{ success: boolean; captchaId: string; captchaImage: string }>(
        "/captcha/generate"
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to load captcha");
    }
  }

  /**
   * Register new user with captcha verification
   */
  async signupWithCaptcha(credentials: SignupCredentials & { captchaId: string; captchaCode: string }): Promise<AuthResponse & { requiresVerification?: boolean }> {
    try {
      const response = await api.post<AuthResponse & { requiresVerification?: boolean }>(
        "/auth/signup",
        credentials,
      );

      // Don't store token - user needs to verify email first
      return response;
    } catch (error: any) {
      throw new Error(
        error.message || "Registration failed. Please try again.",
      );
    }
  }
}

export const authService = new AuthService();
export default authService;
