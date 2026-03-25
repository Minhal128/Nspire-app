/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary for persistent storage
 */

import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { API_CONFIG } from './api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Maximum image dimensions to prevent oversized uploads
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1200;
const IMAGE_QUALITY = 0.7; // 70% quality for good balance of size and quality

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  width?: number;
  height?: number;
  error?: string;
}

export interface CloudinaryMultiUploadResult {
  success: boolean;
  uploaded: Array<{ url: string; publicId: string }>;
  failed: number;
  total: number;
}

class CloudinaryService {
  private apiBaseUrl: string = API_BASE_URL;

  /**
   * Set custom API base URL
   */
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  /**
   * Compress and resize image to reduce file size
   */
  private async compressImage(imageUri: string): Promise<string> {
    try {
      console.log('Compressing image...');

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: MAX_IMAGE_WIDTH, height: MAX_IMAGE_HEIGHT } }],
        {
          compress: IMAGE_QUALITY,
          format: ImageManipulator.SaveFormat.JPEG
        }
      );

      console.log('Image compressed, new URI:', manipulatedImage.uri);
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original if compression fails
      return imageUri;
    }
  }

  /**
   * Convert local image URI to base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    try {
      // Handle different URI formats
      let uri = imageUri;

      // For iOS file:// URIs
      if (Platform.OS === 'ios' && uri.startsWith('file://')) {
        uri = uri.replace('file://', '');
      }

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Determine image type from URI
      const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpeg';
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Upload a single image to Cloudinary via backend
   */
  async uploadImage(
    imageUri: string,
    folder: string = 'nspire-inspections/deficiencies'
  ): Promise<CloudinaryUploadResult> {
    try {
      console.log('Starting image upload to Cloudinary...');
      console.log('API URL:', `${this.apiBaseUrl}/ai/upload-image`);

      // Compress image first to reduce size
      const compressedUri = await this.compressImage(imageUri);

      // Convert to base64
      const base64Image = await this.imageToBase64(compressedUri);
      console.log('Base64 image size:', Math.round(base64Image.length / 1024), 'KB');

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      // Send to backend
      const response = await fetch(`${this.apiBaseUrl}/ai/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          folder,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response error:', response.status, errorText);
        return {
          success: false,
          error: `Server error: ${response.status} - ${errorText}`,
        };
      }

      const result = await response.json();

      if (result.success) {
        console.log('Image uploaded successfully:', result.data.url);
        return {
          success: true,
          url: result.data.url,
          publicId: result.data.publicId,
          width: result.data.width,
          height: result.data.height,
        };
      } else {
        console.error('Upload failed:', result.message);
        return {
          success: false,
          error: result.message || 'Upload failed',
        };
      }
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Upload timed out. Please try again with a smaller image.',
        };
      }
      return {
        success: false,
        error: error.message || 'Network error during upload',
      };
    }
  }

  /**
   * Upload multiple images to Cloudinary via backend
   */
  async uploadMultipleImages(
    imageUris: string[],
    folder: string = 'nspire-inspections/deficiencies',
    onProgress?: (current: number, total: number) => void
  ): Promise<CloudinaryMultiUploadResult> {
    try {
      console.log(`Starting batch upload of ${imageUris.length} images...`);

      const uploaded: Array<{ url: string; publicId: string }> = [];
      let failed = 0;

      for (let i = 0; i < imageUris.length; i++) {
        const uri = imageUris[i];

        try {
          const result = await this.uploadImage(uri, folder);

          if (result.success && result.url && result.publicId) {
            uploaded.push({
              url: result.url,
              publicId: result.publicId,
            });
          } else {
            failed++;
          }
        } catch (error) {
          console.error(`Failed to upload image ${i + 1}:`, error);
          failed++;
        }

        // Progress callback
        if (onProgress) {
          onProgress(i + 1, imageUris.length);
        }
      }

      return {
        success: failed === 0,
        uploaded,
        failed,
        total: imageUris.length,
      };
    } catch (error: any) {
      console.error('Batch upload error:', error);
      return {
        success: false,
        uploaded: [],
        failed: imageUris.length,
        total: imageUris.length,
      };
    }
  }

  /**
   * Upload image with retry logic
   */
  async uploadImageWithRetry(
    imageUri: string,
    maxRetries: number = 3,
    folder: string = 'nspire-inspections/deficiencies'
  ): Promise<CloudinaryUploadResult> {
    let lastError: string = 'Unknown error';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries}...`);
        const result = await this.uploadImage(imageUri, folder);

        if (result.success) {
          return result;
        }

        lastError = result.error || 'Upload failed';

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (error: any) {
        lastError = error.message || 'Network error';

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    return {
      success: false,
      error: `Upload failed after ${maxRetries} attempts: ${lastError}`,
    };
  }

  /**
   * Check if a URL is a valid Cloudinary URL
   */
  isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  }

  /**
   * Get optimized URL with transformations
   */
  getOptimizedUrl(url: string, width: number = 800, quality: string = 'auto'): string {
    if (!this.isCloudinaryUrl(url)) {
      return url;
    }

    // Insert transformation parameters into Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/[transformations]/public_id
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`;
    }

    return url;
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(url: string, size: number = 150): string {
    if (!this.isCloudinaryUrl(url)) {
      return url;
    }

    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${size},h_${size},c_fill,q_auto,f_auto/${parts[1]}`;
    }

    return url;
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
