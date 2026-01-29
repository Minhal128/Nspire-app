/**
 * Offline Storage Service
 * Manages local storage of inspection images and data for offline mode
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { InspectionFinding } from './openaiService';

const STORAGE_KEYS = {
  PENDING_IMAGES: '@inspire:pending_images',
  INSPECTION_SESSIONS: '@inspire:inspection_sessions',
  SYNC_QUEUE: '@inspire:sync_queue',
  OPENAI_API_KEY: '@inspire:openai_api_key',
};

export interface PendingImage {
  id: string;
  localUri: string;
  propertyId: string;
  inspectionId: string;
  inspectionType: string;
  timestamp: string;
  notes?: string;
  tags?: string[];
  status: 'pending' | 'syncing' | 'analyzed' | 'failed';
  retryCount: number;
  findings?: InspectionFinding[];
  error?: string;
  room?: string;
  roomCategory?: 'inside' | 'outside';
}

export interface InspectionSession {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  inspectionType: string;
  startTime: string;
  endTime?: string;
  status: 'in-progress' | 'pending-sync' | 'syncing' | 'completed' | 'failed';
  images: PendingImage[];
  findings: InspectionFinding[];
  complianceScore?: number;
  overallCondition?: string;
  notes?: string;
  isOffline: boolean;
  inspectorName?: string;
  inspectorId?: string;
}

class OfflineStorageService {
  private imageDirectory: string;

  constructor() {
    this.imageDirectory = `${FileSystem.documentDirectory}inspection_images/`;
  }

  /**
   * Initialize storage directories
   */
  async initialize(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.imageDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.imageDirectory, { intermediates: true });
      }
    } catch (error) {
      console.error('Error initializing offline storage:', error);
    }
  }

  /**
   * Save OpenAI API key securely
   */
  async saveApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OPENAI_API_KEY, apiKey);
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  }

  /**
   * Get stored OpenAI API key
   */
  async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.OPENAI_API_KEY);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  /**
   * Save image locally for offline storage
   */
  async saveImageLocally(imageUri: string, inspectionId: string): Promise<string> {
    try {
      const filename = `${inspectionId}_${Date.now()}.jpg`;
      const localPath = `${this.imageDirectory}${filename}`;
      
      await FileSystem.copyAsync({
        from: imageUri,
        to: localPath,
      });

      return localPath;
    } catch (error) {
      console.error('Error saving image locally:', error);
      throw error;
    }
  }

  /**
   * Create a new inspection session
   */
  async createSession(
    propertyId: string,
    propertyName: string,
    propertyAddress: string,
    inspectionType: string,
    isOffline: boolean,
    inspectorName?: string,
    inspectorId?: string
  ): Promise<InspectionSession> {
    const session: InspectionSession = {
      id: `session-${Date.now()}`,
      propertyId,
      propertyName,
      propertyAddress,
      inspectionType,
      startTime: new Date().toISOString(),
      status: 'in-progress',
      images: [],
      findings: [],
      isOffline,
      inspectorName,
      inspectorId,
    };

    await this.saveSession(session);
    return session;
  }

  /**
   * Save/update inspection session
   */
  async saveSession(session: InspectionSession): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const index = sessions.findIndex(s => s.id === session.id);
      
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.INSPECTION_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Get all inspection sessions
   */
  async getAllSessions(): Promise<InspectionSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.INSPECTION_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  /**
   * Get a specific session by ID
   */
  async getSession(sessionId: string): Promise<InspectionSession | null> {
    const sessions = await this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  /**
   * Add image to session
   */
  async addImageToSession(
    sessionId: string,
    imageUri: string,
    notes?: string,
    tags?: string[],
    room?: string,
    roomCategory?: 'inside' | 'outside'
  ): Promise<PendingImage> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Save image locally
    const localUri = await this.saveImageLocally(imageUri, sessionId);

    const pendingImage: PendingImage = {
      id: `img-${Date.now()}`,
      localUri,
      propertyId: session.propertyId,
      inspectionId: sessionId,
      inspectionType: session.inspectionType,
      timestamp: new Date().toISOString(),
      notes,
      tags,
      status: 'pending',
      retryCount: 0,
      room,
      roomCategory,
    };

    session.images.push(pendingImage);
    await this.saveSession(session);

    return pendingImage;
  }

  /**
   * Update image status and findings
   */
  async updateImage(
    sessionId: string,
    imageId: string,
    updates: Partial<PendingImage>
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    const imageIndex = session.images.findIndex(img => img.id === imageId);
    if (imageIndex >= 0) {
      session.images[imageIndex] = { ...session.images[imageIndex], ...updates };
      
      // If findings were added, also add to session findings
      if (updates.findings) {
        session.findings.push(...updates.findings);
      }
      
      await this.saveSession(session);
    }
  }

  /**
   * Get all pending images that need sync
   */
  async getPendingImages(): Promise<PendingImage[]> {
    const sessions = await this.getAllSessions();
    const pendingImages: PendingImage[] = [];

    for (const session of sessions) {
      const pending = session.images.filter(
        img => img.status === 'pending' || img.status === 'failed'
      );
      pendingImages.push(...pending);
    }

    return pendingImages;
  }

  /**
   * Get sessions that need sync
   */
  async getSessionsNeedingSync(): Promise<InspectionSession[]> {
    const sessions = await this.getAllSessions();
    return sessions.filter(
      s => s.status === 'pending-sync' || s.status === 'in-progress'
    );
  }

  /**
   * Mark session as completed
   */
  async completeSession(
    sessionId: string,
    complianceScore: number,
    overallCondition: string
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    session.status = 'completed';
    session.endTime = new Date().toISOString();
    session.complianceScore = complianceScore;
    session.overallCondition = overallCondition;

    await this.saveSession(session);
  }

  /**
   * Delete image from session
   */
  async deleteImage(sessionId: string, imageId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    const image = session.images.find(img => img.id === imageId);
    if (image) {
      // Delete local file
      try {
        await FileSystem.deleteAsync(image.localUri, { idempotent: true });
      } catch (error) {
        console.error('Error deleting image file:', error);
      }

      // Remove from session
      session.images = session.images.filter(img => img.id !== imageId);
      await this.saveSession(session);
    }
  }

  /**
   * Delete session and all associated images
   */
  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Delete all image files
    for (const image of session.images) {
      try {
        await FileSystem.deleteAsync(image.localUri, { idempotent: true });
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    // Remove session from storage
    const sessions = await this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    await AsyncStorage.setItem(STORAGE_KEYS.INSPECTION_SESSIONS, JSON.stringify(filtered));
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalSessions: number;
    pendingImages: number;
    totalImages: number;
    storageUsed: number;
  }> {
    const sessions = await this.getAllSessions();
    let totalImages = 0;
    let pendingImages = 0;
    let storageUsed = 0;

    for (const session of sessions) {
      totalImages += session.images.length;
      pendingImages += session.images.filter(
        img => img.status === 'pending' || img.status === 'failed'
      ).length;

      // Calculate storage used
      for (const image of session.images) {
        try {
          const info = await FileSystem.getInfoAsync(image.localUri);
          if (info.exists && 'size' in info) {
            storageUsed += info.size || 0;
          }
        } catch (error) {
          // File might not exist
        }
      }
    }

    return {
      totalSessions: sessions.length,
      pendingImages,
      totalImages,
      storageUsed,
    };
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<void> {
    try {
      // Delete all image files
      const dirInfo = await FileSystem.getInfoAsync(this.imageDirectory);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.imageDirectory, { idempotent: true });
        await FileSystem.makeDirectoryAsync(this.imageDirectory, { intermediates: true });
      }

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PENDING_IMAGES,
        STORAGE_KEYS.INSPECTION_SESSIONS,
        STORAGE_KEYS.SYNC_QUEUE,
      ]);
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }
}

export const offlineStorageService = new OfflineStorageService();
export default offlineStorageService;
