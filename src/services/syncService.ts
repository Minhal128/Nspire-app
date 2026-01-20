/**
 * Sync Service
 * Handles automatic synchronization of offline data when connectivity is restored
 */

import { networkService } from './networkService';
import { geminiService, AnalysisResult, InspectionFinding } from './openaiService';
import { offlineStorageService, PendingImage, InspectionSession } from './offlineStorageService';

export interface SyncProgress {
  totalImages: number;
  processedImages: number;
  currentImage: string;
  status: 'idle' | 'syncing' | 'completed' | 'failed';
  errors: string[];
}

export type SyncProgressListener = (progress: SyncProgress) => void;

class SyncService {
  private isSyncing: boolean = false;
  private listeners: Set<SyncProgressListener> = new Set();
  private progress: SyncProgress = {
    totalImages: 0,
    processedImages: 0,
    currentImage: '',
    status: 'idle',
    errors: [],
  };
  private networkUnsubscribe: (() => void) | null = null;

  /**
   * Initialize sync service and start monitoring connectivity
   */
  async initialize(): Promise<void> {
    // Listen for connectivity changes
    this.networkUnsubscribe = networkService.addListener(async (isConnected) => {
      if (isConnected && !this.isSyncing) {
        // Connectivity restored - start sync
        await this.startSync();
      }
    });

    // Check if there's pending data to sync
    const pendingImages = await offlineStorageService.getPendingImages();
    if (pendingImages.length > 0 && networkService.isOnline()) {
      await this.startSync();
    }
  }

  /**
   * Add listener for sync progress updates
   */
  addProgressListener(listener: SyncProgressListener): () => void {
    this.listeners.add(listener);
    // Immediately send current progress
    listener(this.progress);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of progress update
   */
  private notifyProgress(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.progress);
      } catch (error) {
        console.error('Error in sync progress listener:', error);
      }
    });
  }

  /**
   * Update progress and notify listeners
   */
  private updateProgress(updates: Partial<SyncProgress>): void {
    this.progress = { ...this.progress, ...updates };
    this.notifyProgress();
  }

  /**
   * Start synchronization of pending images
   */
  async startSync(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!networkService.isOnline()) {
      console.log('Cannot sync - offline');
      return;
    }

    if (!geminiService.isConfigured()) {
      console.log('Cannot sync - Gemini API key not configured');
      return;
    }

    this.isSyncing = true;
    const pendingImages = await offlineStorageService.getPendingImages();

    if (pendingImages.length === 0) {
      this.updateProgress({
        status: 'completed',
        totalImages: 0,
        processedImages: 0,
      });
      this.isSyncing = false;
      return;
    }

    this.updateProgress({
      status: 'syncing',
      totalImages: pendingImages.length,
      processedImages: 0,
      errors: [],
    });

    const errors: string[] = [];

    for (let i = 0; i < pendingImages.length; i++) {
      const image = pendingImages[i];

      // Check connectivity before each image
      if (!networkService.isOnline()) {
        this.updateProgress({
          status: 'failed',
          errors: [...errors, 'Connection lost during sync'],
        });
        this.isSyncing = false;
        return;
      }

      this.updateProgress({
        currentImage: image.id,
        processedImages: i,
      });

      try {
        // Update image status to syncing
        await offlineStorageService.updateImage(image.inspectionId, image.id, {
          status: 'syncing',
        });

        // Analyze image with Gemini
        const result = await geminiService.analyzeImage(
          image.localUri,
          image.inspectionType
        );

        if (result.success) {
          // Update image with findings
          await offlineStorageService.updateImage(image.inspectionId, image.id, {
            status: 'analyzed',
            findings: result.findings,
          });
        } else {
          // Handle failure
          const retryCount = image.retryCount + 1;
          if (retryCount < 3) {
            await offlineStorageService.updateImage(image.inspectionId, image.id, {
              status: 'failed',
              retryCount,
              error: result.error,
            });
          } else {
            await offlineStorageService.updateImage(image.inspectionId, image.id, {
              status: 'failed',
              retryCount,
              error: `Failed after ${retryCount} attempts: ${result.error}`,
            });
            errors.push(`Image ${image.id}: ${result.error}`);
          }
        }
      } catch (error: any) {
        console.error('Error syncing image:', error);
        errors.push(`Image ${image.id}: ${error.message}`);
        
        await offlineStorageService.updateImage(image.inspectionId, image.id, {
          status: 'failed',
          retryCount: image.retryCount + 1,
          error: error.message,
        });
      }
    }

    // Update sessions that are now fully synced
    await this.updateSessionStatuses();

    this.updateProgress({
      status: errors.length > 0 ? 'failed' : 'completed',
      processedImages: pendingImages.length,
      currentImage: '',
      errors,
    });

    this.isSyncing = false;
  }

  /**
   * Update session statuses after sync
   */
  private async updateSessionStatuses(): Promise<void> {
    const sessions = await offlineStorageService.getSessionsNeedingSync();

    for (const session of sessions) {
      const allAnalyzed = session.images.every(img => img.status === 'analyzed');
      const anyFailed = session.images.some(img => img.status === 'failed');

      if (allAnalyzed && session.images.length > 0) {
        // Calculate compliance score from all findings
        const allFindings = session.images.flatMap(img => img.findings || []);
        const complianceScore = this.calculateComplianceScore(allFindings);
        const overallCondition = this.determineOverallCondition(allFindings);

        await offlineStorageService.completeSession(
          session.id,
          complianceScore,
          overallCondition
        );
      } else if (anyFailed) {
        // Mark session as needing attention
        session.status = 'pending-sync';
        await offlineStorageService.saveSession(session);
      }
    }
  }

  /**
   * Calculate compliance score from findings
   */
  private calculateComplianceScore(findings: InspectionFinding[]): number {
    if (findings.length === 0) return 100;

    let deductions = 0;
    for (const finding of findings) {
      switch (finding.severity) {
        case 'critical':
          deductions += 25;
          break;
        case 'major':
          deductions += 15;
          break;
        case 'minor':
          deductions += 5;
          break;
        case 'observation':
          deductions += 2;
          break;
      }
    }

    return Math.max(0, 100 - deductions);
  }

  /**
   * Determine overall condition from findings
   */
  private determineOverallCondition(findings: InspectionFinding[]): string {
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const majorCount = findings.filter(f => f.severity === 'major').length;

    if (criticalCount > 0) return 'Critical';
    if (majorCount > 2) return 'Poor';
    if (majorCount > 0 || findings.length > 5) return 'Fair';
    if (findings.length === 0) return 'Excellent';
    return 'Good';
  }

  /**
   * Get current sync status
   */
  getProgress(): SyncProgress {
    return this.progress;
  }

  /**
   * Check if sync is in progress
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Force retry failed images
   */
  async retryFailed(): Promise<void> {
    const sessions = await offlineStorageService.getAllSessions();
    
    for (const session of sessions) {
      for (const image of session.images) {
        if (image.status === 'failed' && image.retryCount < 3) {
          await offlineStorageService.updateImage(session.id, image.id, {
            status: 'pending',
          });
        }
      }
    }

    // Start sync if online
    if (networkService.isOnline()) {
      await this.startSync();
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.networkUnsubscribe) {
      this.networkUnsubscribe();
      this.networkUnsubscribe = null;
    }
    this.listeners.clear();
  }
}

export const syncService = new SyncService();
export default syncService;
