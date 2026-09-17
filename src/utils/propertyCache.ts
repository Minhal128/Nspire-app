/**
 * Last known property list, kept on the device.
 *
 * The property list is the gate into every inspection: without it an inspector
 * with no signal sees an empty dashboard and cannot start work at all, which
 * would leave the offline write queue with nothing to carry. It is refreshed on
 * every successful fetch and read back whenever the request fails.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROPERTY_CACHE_KEY = 'cached_properties_v1';

export const cacheProperties = async (properties: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROPERTY_CACHE_KEY, JSON.stringify(properties));
  } catch (error) {
    console.warn('propertyCache: could not write', error);
  }
};

export const readCachedProperties = async (): Promise<any[]> => {
  try {
    const raw = await AsyncStorage.getItem(PROPERTY_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('propertyCache: could not read', error);
    return [];
  }
};

/**
 * Add (or replace) one property — used when a property is created offline, so it
 * shows on the dashboard immediately instead of after the next successful fetch.
 */
export const addPropertyToCache = async (property: any): Promise<void> => {
  const id = property?._id ?? property?.id;
  const existing = await readCachedProperties();
  const next = [...existing.filter((p) => (p?._id ?? p?.id) !== id), property];
  await cacheProperties(next);
};
