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
 * Storage keys constants
 */
export const StorageKeys = {
  USER_TOKEN: '@inspire:user_token',
  USER_DATA: '@inspire:user_data',
  USER_TYPE: '@inspire:user_type',
  REMEMBER_ME: '@inspire:remember_me',
  THEME_PREFERENCE: '@inspire:theme',
};
