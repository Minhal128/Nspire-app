import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage utility functions for data persistence
 */

/**
 * Store data in AsyncStorage
 */
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

/**
 * Retrieve data from AsyncStorage
 */
export const getData = async (key: string): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

/**
 * Remove data from AsyncStorage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from AsyncStorage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

/**
 * Auto-save a single deficiency to inspection storage
 * Called incrementally as user records each deficiency
 */
export const autoSaveInspectionDeficiency = async (
  propertyId: string,
  buildingId: string,
  deficiency: any
): Promise<void> => {
  const key = `saved_inspection_${propertyId}_${buildingId}`;

  try {
    const existingRaw = await AsyncStorage.getItem(key);
    let existingData: any = {
      property: { _id: propertyId },
      buildingId,
      deficiencies: [],
      savedAt: new Date().toISOString(),
    };

    if (existingRaw) {
      try {
        existingData = JSON.parse(existingRaw);
      } catch {
        existingData = { property: { _id: propertyId }, buildingId, deficiencies: [], savedAt: new Date().toISOString() };
      }
    }

    // Ensure deficiencies array exists
    if (!Array.isArray(existingData.deficiencies)) {
      existingData.deficiencies = [];
    }

    // Check for duplicate by deficiencyQRId
    const isDuplicate = existingData.deficiencies.some(
      (d: any) => d.deficiencyQRId && d.deficiencyQRId === deficiency.deficiencyQRId
    );

    if (!isDuplicate) {
      existingData.deficiencies.push(deficiency);
      existingData.savedAt = new Date().toISOString();
      existingData.updatedAt = new Date().toISOString();

      await AsyncStorage.setItem(key, JSON.stringify(existingData));
      console.log('Auto-saved deficiency for property', propertyId, '- Total deficiencies:', existingData.deficiencies.length);
    }
  } catch (error) {
    console.error('Error auto-saving inspection deficiency:', error);
  }
};

/**
 * Clear all inspection drafts for a property
 */
export const clearInspectionDraft = async (propertyId: string, buildingId?: string): Promise<void> => {
  try {
    if (buildingId) {
      await AsyncStorage.removeItem(`saved_inspection_${propertyId}_${buildingId}`);
    } else {
      // Clear all drafts for this property
      const keys = await AsyncStorage.getAllKeys();
      const draftsToRemove = keys.filter(k => k.startsWith(`saved_inspection_${propertyId}`));
      for (const key of draftsToRemove) {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing inspection draft:', error);
  }
};

/**
 * Storage keys constants
 */
export const StorageKeys = {
  USER_TOKEN: '@inspire:user_token',
  USER_DATA: '@inspire:user_data',
  USER_TYPE: '@inspire:user_type',
  REMEMBER_ME: '@inspire:remember_me',
  THEME_PREFERENCE: '@inspire:theme',
};
