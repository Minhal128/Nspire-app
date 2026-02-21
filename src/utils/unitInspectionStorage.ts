/**
 * Utility for tracking unit inspection completion status.
 * Uses AsyncStorage to persist which units have been inspected per property.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = 'unit_inspection_status_';

export interface UnitInspectionStatus {
  unitName: string;
  completed: boolean;
  completedAt?: string;
  inspectionData?: any;
}

export interface PropertyInspectionState {
  propertyId: string;
  buildingId: string;
  units: UnitInspectionStatus[];
  lastUpdated: string;
}

/**
 * Get the storage key for a property + building combination
 */
function getStorageKey(propertyId: string, buildingId: string): string {
  return `${STORAGE_KEY_PREFIX}${propertyId}_${buildingId}`;
}

/**
 * Get the inspection state for a property's building
 */
export async function getPropertyInspectionState(
  propertyId: string,
  buildingId: string
): Promise<PropertyInspectionState | null> {
  try {
    const key = getStorageKey(propertyId, buildingId);
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting property inspection state:', error);
    return null;
  }
}

/**
 * Initialize or update the inspection state for a property's building
 */
export async function initializePropertyInspectionState(
  propertyId: string,
  buildingId: string,
  unitNames: string[]
): Promise<PropertyInspectionState> {
  try {
    const existing = await getPropertyInspectionState(propertyId, buildingId);

    // Preserve existing completion status
    const existingMap = new Map<string, UnitInspectionStatus>();
    if (existing) {
      existing.units.forEach(u => existingMap.set(u.unitName, u));
    }

    const units: UnitInspectionStatus[] = unitNames.map(name => {
      const existingUnit = existingMap.get(name);
      return existingUnit || { unitName: name, completed: false };
    });

    const state: PropertyInspectionState = {
      propertyId,
      buildingId,
      units,
      lastUpdated: new Date().toISOString(),
    };

    const key = getStorageKey(propertyId, buildingId);
    await AsyncStorage.setItem(key, JSON.stringify(state));
    return state;
  } catch (error) {
    console.error('Error initializing property inspection state:', error);
    return {
      propertyId,
      buildingId,
      units: unitNames.map(name => ({ unitName: name, completed: false })),
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Mark a unit as completed
 */
export async function markUnitCompleted(
  propertyId: string,
  buildingId: string,
  unitName: string,
  inspectionData?: any
): Promise<void> {
  try {
    const state = await getPropertyInspectionState(propertyId, buildingId);
    if (!state) return;

    const updatedUnits = state.units.map(u => {
      if (u.unitName === unitName) {
        return {
          ...u,
          completed: true,
          completedAt: new Date().toISOString(),
          inspectionData,
        };
      }
      return u;
    });

    const updatedState: PropertyInspectionState = {
      ...state,
      units: updatedUnits,
      lastUpdated: new Date().toISOString(),
    };

    const key = getStorageKey(propertyId, buildingId);
    await AsyncStorage.setItem(key, JSON.stringify(updatedState));
  } catch (error) {
    console.error('Error marking unit completed:', error);
  }
}

/**
 * Get list of completed unit names
 */
export async function getCompletedUnits(
  propertyId: string,
  buildingId: string
): Promise<string[]> {
  try {
    const state = await getPropertyInspectionState(propertyId, buildingId);
    if (!state) return [];
    return state.units.filter(u => u.completed).map(u => u.unitName);
  } catch (error) {
    console.error('Error getting completed units:', error);
    return [];
  }
}

/**
 * Reset inspection state for a property's building
 */
export async function resetPropertyInspectionState(
  propertyId: string,
  buildingId: string
): Promise<void> {
  try {
    const key = getStorageKey(propertyId, buildingId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error resetting property inspection state:', error);
  }
}

/**
 * Check if all units in a building have been inspected
 */
export async function areAllUnitsCompleted(
  propertyId: string,
  buildingId: string
): Promise<boolean> {
  try {
    const state = await getPropertyInspectionState(propertyId, buildingId);
    if (!state || state.units.length === 0) return false;
    return state.units.every(u => u.completed);
  } catch (error) {
    console.error('Error checking all units completion:', error);
    return false;
  }
}

/**
 * Get all completed units with their inspection data
 */
export async function getAllCompletedUnitData(
  propertyId: string,
  buildingId: string
): Promise<UnitInspectionStatus[]> {
  try {
    const state = await getPropertyInspectionState(propertyId, buildingId);
    if (!state) return [];
    return state.units.filter(u => u.completed && u.inspectionData);
  } catch (error) {
    console.error('Error getting all completed unit data:', error);
    return [];
  }
}
