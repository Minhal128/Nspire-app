/**
 * Keeping a captured photo alive long enough to be uploaded.
 *
 * expo-image-picker hands back a URI inside the app's cache directory. The OS
 * clears that directory whenever it wants storage back, and offline it is the
 * only copy of the photo — the upload is still sitting on the queue. When the
 * cache went first, the queue was left retrying a file that no longer existed
 * and the deficiency kept its description but lost its picture for good.
 *
 * Copying into the document directory, which is not cache, closes that window.
 */

import { offlineStorageService } from '../services/offlineStorageService';

/**
 * A permanent path for a freshly captured image.
 *
 * Falls back to the original URI if the copy fails: a photo in the cache is
 * worth more than no photo, and failing here must never cost the inspector the
 * deficiency they just recorded.
 */
export const persistCapturedImage = async (
  imageUri: string,
  ownerId: string,
): Promise<string> => {
  if (!imageUri || !imageUri.startsWith('file:')) return imageUri;

  try {
    return await offlineStorageService.saveImageLocally(imageUri, ownerId || 'inspection');
  } catch (error) {
    console.warn('Could not copy captured image to permanent storage:', error);
    return imageUri;
  }
};

export default persistCapturedImage;
