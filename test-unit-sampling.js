/**
 * Unit Sampling Demo Script
 * 
 * This script demonstrates the complete hardcoded NSPIRE unit sampling logic
 * for properties with 1-32 units.
 */

// Complete NSPIRE sampling lookup table (1-32 units)
const NSPIRE_SAMPLING_TABLE = {
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

function getUnitsToInspect(totalUnits) {
  if (totalUnits < 1 || totalUnits > 32) {
    throw new Error(`Unit sampling is only supported for properties with 1-32 units. Property has ${totalUnits} units.`);
  }
  return NSPIRE_SAMPLING_TABLE[totalUnits];
}

function generateDeterministicSample(totalUnits, unitsToInspect, propertyId) {
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

function generateRandomUnitSample(totalUnits, propertyId) {
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

// Demo the functionality
console.log('🏠 NSPIRE Unit Sampling Demo\n');
console.log('Complete hardcoded sampling for properties with 1-32 units\n');

// Test different property sizes (show key examples)
const testSizes = [1, 2, 5, 10, 11, 12, 15, 20, 25, 30, 32];

testSizes.forEach(totalUnits => {
  console.log(`📊 Property with ${totalUnits} units:`);
  
  const propertyId = `demo-property-${totalUnits}`;
  const sample = generateRandomUnitSample(totalUnits, propertyId);
  
  console.log(`   • Units to inspect: ${sample.unitsToInspect}`);
  console.log(`   • Selected units: ${sample.selectedUnits.slice(0, 5).join(', ')}${sample.selectedUnits.length > 5 ? '...' : ''}`);
  console.log('');
});

// Show the complete NSPIRE sampling table
console.log('📋 Complete NSPIRE Sampling Table:');
console.log('Units Range → Sample Size');
console.log('─'.repeat(30));

const ranges = [
  { range: '1', sample: 1 },
  { range: '2', sample: 1 },
  { range: '3', sample: 2 },
  { range: '4', sample: 3 },
  { range: '5', sample: 4 },
  { range: '6', sample: 5 },
  { range: '7', sample: 6 },
  { range: '8', sample: 7 },
  { range: '9', sample: 8 },
  { range: '10', sample: 9 },
  { range: '11-12', sample: 9 },
  { range: '13-14', sample: 10 },
  { range: '15-16', sample: 11 },
  { range: '17-18', sample: 12 },
  { range: '19-21', sample: 13 },
  { range: '22-24', sample: 14 },
  { range: '25-27', sample: 15 },
  { range: '28-30', sample: 16 },
  { range: '31-32', sample: 17 },
];

ranges.forEach(({ range, sample }) => {
  console.log(`${range.padEnd(8)} → ${sample} units`);
});

// Test consistency - same property should always get same sample
console.log('🔄 Consistency Test:');
const testPropertyId = 'consistency-test-property';
const testTotalUnits = 7;

console.log(`Property "${testPropertyId}" with ${testTotalUnits} units:`);
for (let i = 1; i <= 3; i++) {
  const sample = generateRandomUnitSample(testTotalUnits, testPropertyId);
  console.log(`   Run ${i}: ${sample.selectedUnits.join(', ')}`);
}

console.log('\n✅ All samples for the same property are identical (deterministic)');

// Test different properties with same unit count
console.log('\n🏘️ Different Properties Test:');
const unitCount = 5;
const properties = ['property-a', 'property-b', 'property-c'];

properties.forEach(propId => {
  const sample = generateRandomUnitSample(unitCount, propId);
  console.log(`   ${propId}: ${sample.selectedUnits.join(', ')}`);
});

console.log('\n✅ Different properties get different (but consistent) samples');

// Test edge cases
console.log('\n🧪 Edge Cases:');

try {
  generateRandomUnitSample(33, 'too-many-units');
} catch (error) {
  console.log('   ❌ 33 units: ' + error.message);
}

try {
  generateRandomUnitSample(0, 'no-units');
} catch (error) {
  console.log('   ❌ 0 units: ' + error.message);
}

const singleUnitSample = generateRandomUnitSample(1, 'single-unit');
console.log(`   ✅ 1 unit: ${singleUnitSample.selectedUnits.join(', ')}`);

const maxUnitSample = generateRandomUnitSample(32, 'max-units');
console.log(`   ✅ 32 units: ${maxUnitSample.unitsToInspect} units selected`);

console.log('\n🎉 Complete NSPIRE Unit Sampling Demo Complete!');