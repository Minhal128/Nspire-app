/**
 * Unit Sampling Service for NSPIRE Inspections
 * 
 * This service provides unit sampling logic for properties following official NSPIRE
 * sampling requirements. Supports all property sizes from 1 unit to 921+ units.
 * The sampling ensures consistency across inspectors.
 */

export interface UnitSample {
  totalUnits: number;
  unitsToInspect: number;
  selectedUnits: string[];
}

/**
 * NSPIRE Scoring Factor (n) ranges based on official NSPIRE sampling requirements
 * Each entry: [minUnits, maxUnits, scoringFactor]
 * This covers all property sizes from 1 to unlimited units
 */
const NSPIRE_SAMPLING_RANGES: [number, number, number][] = [
  [1, 1, 1],       // 1 unit = n=1
  [2, 2, 1],       // 2 units = n=1
  [3, 3, 2],       // 3 units = n=2
  [4, 4, 3],       // 4 units = n=3
  [5, 5, 4],       // 5 units = n=4
  [6, 6, 5],       // 6 units = n=5
  [7, 7, 6],       // 7 units = n=6
  [8, 8, 7],       // 8 units = n=7
  [9, 9, 8],       // 9 units = n=8
  [10, 10, 9],     // 10 units = n=9
  [11, 12, 9],     // 11-12 units = n=9
  [13, 14, 10],    // 13-14 units = n=10
  [15, 16, 11],    // 15-16 units = n=11
  [17, 18, 12],    // 17-18 units = n=12
  [19, 21, 13],    // 19-21 units = n=13
  [22, 24, 14],    // 22-24 units = n=14
  [25, 27, 15],    // 25-27 units = n=15
  [28, 30, 16],    // 28-30 units = n=16
  [31, 35, 17],    // 31-35 units = n=17
  [36, 39, 18],    // 36-39 units = n=18
  [40, 45, 19],    // 40-45 units = n=19
  [46, 51, 20],    // 46-51 units = n=20
  [52, 59, 21],    // 52-59 units = n=21
  [60, 67, 22],    // 60-67 units = n=22
  [68, 78, 23],    // 68-78 units = n=23
  [79, 92, 24],    // 79-92 units = n=24
  [93, 110, 25],   // 93-110 units = n=25
  [111, 120, 26],  // 111-120 units = n=26
  [121, 166, 27],  // 121-166 units = n=27
  [167, 214, 28],  // 167-214 units = n=28
  [215, 295, 29],  // 215-295 units = n=29
  [296, 455, 30],  // 296-455 units = n=30
  [456, 920, 31],  // 456-920 units = n=31
  [921, Infinity, 32], // 921+ units = n=32
];

/**
 * Gets the scoring factor (n) for a given number of units
 * This is the number of units to inspect based on NSPIRE guidelines
 */
function getScoringFactor(totalUnits: number): number {
  if (totalUnits < 1) {
    throw new Error('Total units must be at least 1');
  }

  for (const [min, max, factor] of NSPIRE_SAMPLING_RANGES) {
    if (totalUnits >= min && totalUnits <= max) {
      return factor;
    }
  }

  // This should never happen as the last range goes to Infinity
  return 32;
}

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
 * Works for all property sizes based on NSPIRE scoring factors
 */
export function getUnitsToInspect(totalUnits: number): number {
  if (totalUnits < 1) {
    throw new Error(`Property must have at least 1 unit. Property has ${totalUnits} units.`);
  }
  
  return getScoringFactor(totalUnits);
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
  if (totalUnits < 1) {
    throw new Error(`Property must have at least 1 unit. This property has ${totalUnits} units.`);
  }
  
  if (!propertyId || propertyId.trim() === '') {
    throw new Error('Property ID is required for consistent unit sampling.');
  }
  
  // Get the number of units to inspect from NSPIRE scoring factor table
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
 * Now supports all property sizes
 */
export function isRandomSelectionAvailable(totalUnits: number): boolean {
  return totalUnits >= 1;
}

/**
 * Gets a human-readable explanation of the sampling logic
 */
export function getSamplingExplanation(totalUnits: number): string {
  if (!isRandomSelectionAvailable(totalUnits)) {
    return `Random unit selection is not available for properties with ${totalUnits} units.`;
  }
  
  const unitsToInspect = getUnitsToInspect(totalUnits);
  
  if (totalUnits === 1) {
    return `This property has 1 unit. The single unit will be inspected.`;
  }
  
  return `This property has ${totalUnits} units. Based on NSPIRE sampling requirements, ${unitsToInspect} units will be randomly selected for inspection.`;
}

/**
 * Complete NSPIRE Sampling Reference Table (for documentation purposes)
 * The actual implementation above handles all property sizes with official NSPIRE scoring factors
 */
export const NSPIRE_SAMPLING_REFERENCE = {
  ranges: [
    { units: '1', sample: 1, description: '1 unit = inspect 1 unit (n=1)' },
    { units: '2', sample: 1, description: '2 units = inspect 1 unit (n=1)' },
    { units: '3', sample: 2, description: '3 units = inspect 2 units (n=2)' },
    { units: '4', sample: 3, description: '4 units = inspect 3 units (n=3)' },
    { units: '5', sample: 4, description: '5 units = inspect 4 units (n=4)' },
    { units: '6', sample: 5, description: '6 units = inspect 5 units (n=5)' },
    { units: '7', sample: 6, description: '7 units = inspect 6 units (n=6)' },
    { units: '8', sample: 7, description: '8 units = inspect 7 units (n=7)' },
    { units: '9', sample: 8, description: '9 units = inspect 8 units (n=8)' },
    { units: '10', sample: 9, description: '10 units = inspect 9 units (n=9)' },
    { units: '11-12', sample: 9, description: '11-12 units = inspect 9 units (n=9)' },
    { units: '13-14', sample: 10, description: '13-14 units = inspect 10 units (n=10)' },
    { units: '15-16', sample: 11, description: '15-16 units = inspect 11 units (n=11)' },
    { units: '17-18', sample: 12, description: '17-18 units = inspect 12 units (n=12)' },
    { units: '19-21', sample: 13, description: '19-21 units = inspect 13 units (n=13)' },
    { units: '22-24', sample: 14, description: '22-24 units = inspect 14 units (n=14)' },
    { units: '25-27', sample: 15, description: '25-27 units = inspect 15 units (n=15)' },
    { units: '28-30', sample: 16, description: '28-30 units = inspect 16 units (n=16)' },
    { units: '31-35', sample: 17, description: '31-35 units = inspect 17 units (n=17)' },
    { units: '36-39', sample: 18, description: '36-39 units = inspect 18 units (n=18)' },
    { units: '40-45', sample: 19, description: '40-45 units = inspect 19 units (n=19)' },
    { units: '46-51', sample: 20, description: '46-51 units = inspect 20 units (n=20)' },
    { units: '52-59', sample: 21, description: '52-59 units = inspect 21 units (n=21)' },
    { units: '60-67', sample: 22, description: '60-67 units = inspect 22 units (n=22)' },
    { units: '68-78', sample: 23, description: '68-78 units = inspect 23 units (n=23)' },
    { units: '79-92', sample: 24, description: '79-92 units = inspect 24 units (n=24)' },
    { units: '93-110', sample: 25, description: '93-110 units = inspect 25 units (n=25)' },
    { units: '111-120', sample: 26, description: '111-120 units = inspect 26 units (n=26)' },
    { units: '121-166', sample: 27, description: '121-166 units = inspect 27 units (n=27)' },
    { units: '167-214', sample: 28, description: '167-214 units = inspect 28 units (n=28)' },
    { units: '215-295', sample: 29, description: '215-295 units = inspect 29 units (n=29)' },
    { units: '296-455', sample: 30, description: '296-455 units = inspect 30 units (n=30)' },
    { units: '456-920', sample: 31, description: '456-920 units = inspect 31 units (n=31)' },
    { units: '921+', sample: 32, description: '921+ units = inspect 32 units (n=32)' },
  ],
  note: 'This implementation supports all property sizes using official NSPIRE scoring factors.',
};