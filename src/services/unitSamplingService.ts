/**
 * Unit Sampling Service for NSPIRE Inspections
 * 
 * This service provides hardcoded unit sampling logic for properties with up to 32 units.
 * The sampling follows the official NSPIRE sampling requirements with predetermined
 * sample sizes for each unit count, ensuring consistency across inspectors.
 */

export interface UnitSample {
  totalUnits: number;
  unitsToInspect: number;
  selectedUnits: string[];
}

/**
 * Complete hardcoded NSPIRE sampling lookup table (1-32 units)
 * Based on official NSPIRE sampling requirements
 * This ensures consistent sampling across all inspectors for the same property
 */
const NSPIRE_SAMPLING_TABLE: Record<number, number> = {
  // Units 1-10: Simple n-1 logic (except 1 unit = 1 sample)
  1: 1,   // 1 unit = inspect 1 unit
  2: 1,   // 2 units = inspect 1 unit
  3: 2,   // 3 units = inspect 2 units
  4: 3,   // 4 units = inspect 3 units
  5: 4,   // 5 units = inspect 4 units
  6: 5,   // 6 units = inspect 5 units
  7: 6,   // 7 units = inspect 6 units
  8: 7,   // 8 units = inspect 7 units
  9: 8,   // 9 units = inspect 8 units
  10: 9,  // 10 units = inspect 9 units
  
  // Units 11-32: Based on NSPIRE sampling factors
  11: 9,  // 11-12 units = n=9
  12: 9,  // 11-12 units = n=9
  13: 10, // 13-14 units = n=10
  14: 10, // 13-14 units = n=10
  15: 11, // 15-16 units = n=11
  16: 11, // 15-16 units = n=11
  17: 12, // 17-18 units = n=12
  18: 12, // 17-18 units = n=12
  19: 13, // 19-21 units = n=13
  20: 13, // 19-21 units = n=13
  21: 13, // 19-21 units = n=13
  22: 14, // 22-24 units = n=14
  23: 14, // 22-24 units = n=14
  24: 14, // 22-24 units = n=14
  25: 15, // 25-27 units = n=15
  26: 15, // 25-27 units = n=15
  27: 15, // 25-27 units = n=15
  28: 16, // 28-30 units = n=16
  29: 16, // 28-30 units = n=16
  30: 16, // 28-30 units = n=16
  31: 17, // 31-35 units = n=17
  32: 17, // 31-35 units = n=17
};

/**
 * Generates a deterministic random sample of units based on property ID
 * This ensures the same property always gets the same unit selection
 */
function generateDeterministicSample(
  totalUnits: number, 
  unitsToInspect: number, 
  propertyId: string
): string[] {
  // Create a simple hash from property ID to ensure consistency
  let hash = 0;
  for (let i = 0; i < propertyId.length; i++) {
    const char = propertyId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash as a seed for deterministic selection
  const seed = Math.abs(hash);
  
  // Generate all possible unit numbers
  const allUnits = Array.from({ length: totalUnits }, (_, i) => 
    `Unit ${(i + 1).toString().padStart(3, '0')}`
  );
  
  // If we need to inspect all units, return all
  if (unitsToInspect >= totalUnits) {
    return allUnits;
  }
  
  // Create a deterministic shuffle based on the seed
  const shuffled = [...allUnits];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate a deterministic "random" index
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const j = currentSeed % (i + 1);
    
    // Swap elements
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first N units from the shuffled array
  return shuffled.slice(0, unitsToInspect);
}

/**
 * Gets the number of units to inspect based on total units
 * Works for properties with 1-32 units (complete NSPIRE sampling table)
 */
export function getUnitsToInspect(totalUnits: number): number {
  if (totalUnits < 1 || totalUnits > 32) {
    throw new Error(`Unit sampling is only supported for properties with 1-32 units. Property has ${totalUnits} units.`);
  }
  
  return NSPIRE_SAMPLING_TABLE[totalUnits];
}

/**
 * Generates a random unit sample for inspection
 * This is the main function to be used by the mobile app
 */
export function generateRandomUnitSample(
  totalUnits: number, 
  propertyId: string
): UnitSample {
  // Validate input
  if (totalUnits < 1 || totalUnits > 32) {
    throw new Error(`Random unit selection is only available for properties with 1-32 units. This property has ${totalUnits} units.`);
  }
  
  if (!propertyId || propertyId.trim() === '') {
    throw new Error('Property ID is required for consistent unit sampling.');
  }
  
  // Get the number of units to inspect from lookup table
  const unitsToInspect = getUnitsToInspect(totalUnits);
  
  // Generate deterministic sample
  const selectedUnits = generateDeterministicSample(totalUnits, unitsToInspect, propertyId);
  
  return {
    totalUnits,
    unitsToInspect,
    selectedUnits,
  };
}

/**
 * Validates if random unit selection is available for a property
 */
export function isRandomSelectionAvailable(totalUnits: number): boolean {
  return totalUnits >= 1 && totalUnits <= 32;
}

/**
 * Gets a human-readable explanation of the sampling logic
 */
export function getSamplingExplanation(totalUnits: number): string {
  if (!isRandomSelectionAvailable(totalUnits)) {
    return `Random unit selection is not available for properties with ${totalUnits} units. This feature is limited to properties with 1-32 units.`;
  }
  
  const unitsToInspect = getUnitsToInspect(totalUnits);
  
  if (totalUnits === 1) {
    return `This property has 1 unit. The single unit will be inspected.`;
  }
  
  return `This property has ${totalUnits} units. Based on NSPIRE sampling requirements, ${unitsToInspect} units will be randomly selected for inspection.`;
}

/**
 * Complete NSPIRE Sampling Reference Table (for documentation purposes)
 * The actual implementation above handles 1-32 units with official NSPIRE sampling factors
 */
export const NSPIRE_SAMPLING_REFERENCE = {
  ranges: [
    { units: '1', sample: 1, description: '1 unit = inspect 1 unit' },
    { units: '2', sample: 1, description: '2 units = inspect 1 unit' },
    { units: '3', sample: 2, description: '3 units = inspect 2 units' },
    { units: '4', sample: 3, description: '4 units = inspect 3 units' },
    { units: '5', sample: 4, description: '5 units = inspect 4 units' },
    { units: '6', sample: 5, description: '6 units = inspect 5 units' },
    { units: '7', sample: 6, description: '7 units = inspect 6 units' },
    { units: '8', sample: 7, description: '8 units = inspect 7 units' },
    { units: '9', sample: 8, description: '9 units = inspect 8 units' },
    { units: '10', sample: 9, description: '10 units = inspect 9 units' },
    { units: '11-12', sample: 9, description: '11-12 units = inspect 9 units (n=9)' },
    { units: '13-14', sample: 10, description: '13-14 units = inspect 10 units (n=10)' },
    { units: '15-16', sample: 11, description: '15-16 units = inspect 11 units (n=11)' },
    { units: '17-18', sample: 12, description: '17-18 units = inspect 12 units (n=12)' },
    { units: '19-21', sample: 13, description: '19-21 units = inspect 13 units (n=13)' },
    { units: '22-24', sample: 14, description: '22-24 units = inspect 14 units (n=14)' },
    { units: '25-27', sample: 15, description: '25-27 units = inspect 15 units (n=15)' },
    { units: '28-30', sample: 16, description: '28-30 units = inspect 16 units (n=16)' },
    { units: '31-32', sample: 17, description: '31-32 units = inspect 17 units (n=17)' },
  ],
  note: 'This implementation supports properties with 1-32 units using official NSPIRE sampling factors.',
  extendedRanges: [
    { units: '33-35', sample: 17, description: 'Extended: 33-35 units = n=17 (not implemented)' },
    { units: '36-39', sample: 18, description: 'Extended: 36-39 units = n=18 (not implemented)' },
    { units: '40-45', sample: 19, description: 'Extended: 40-45 units = n=19 (not implemented)' },
    // ... larger ranges would continue here
  ]
};