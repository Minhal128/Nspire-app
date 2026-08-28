/**
 * User Service
 * Handles user profile and settings API calls
 */

import api, { User } from './api';

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationSettings {
  inspectionReminder: {
    email: boolean;
    inApp: boolean;
  };
  reportAlerts: {
    email: boolean;
    inApp: boolean;
  };
  followUp: {
    email: boolean;
    inApp: boolean;
  };
  systemUpdates: {
    email: boolean;
    inApp: boolean;
  };
}

class UserService {
  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string; user: User }> {
    try {
      const response = await api.put<{ success: boolean; message: string; user: User }>('/users/profile', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put<{ success: boolean; message: string }>('/users/password', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to change password');
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: NotificationSettings): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put<{ success: boolean; message: string }>('/users/notifications', settings);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update notification settings');
    }
  }

  /**
   * Toggle two-factor authentication
   */
  async toggleTwoFactor(enable: boolean): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post<{ success: boolean; message: string }>('/users/2fa/toggle', { enable });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to toggle two-factor authentication');
    }
  }

  /**
   * Get all users (admin/management only)
   */
  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const response = await api.get<{ success: boolean; users: User[] }>('/users');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  /**
   * Get other users (accessible to all authenticated users)
   */
  async getOtherUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const response = await api.get<{ success: boolean; users: User[] }>('/users/others');
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  }

  /**
   * Permanently delete the signed-in account.
   * Same endpoint and password confirmation as web /dashboard/delete-account.
   */
  async deleteAccount(password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(
        '/auth/delete-account',
        { body: JSON.stringify({ password }) }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete account');
    }
  }
}

export const userService = new UserService();
export default userService;
