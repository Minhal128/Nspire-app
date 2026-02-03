// Units Inspection Module Scoring Calculations
// Specialized scoring logic for NSPIRE Units inspection categories
// Handles category-based and deficiency-based severity/points lost mapping
// Organized by Severity and Category for clean mapping

export interface UnitsSeverityConfig {
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  pointsLostFormula: number; // The numerator in the formula Pts Lost = X / n
  specialFormula?: 'divide_50n'; // Special formula type: X/(50*n)
}

// ============================================================================
// LIFE-THREATENING PATTERNS - 60/(50*n) - Special Formula
// ============================================================================
const LIFE_THREATENING_60_50N_PATTERNS = [
  'annunciator does not indicate the correct corresponding room',
  'does not indicate the correct corresponding room',
];

// ============================================================================
// LIFE-THREATENING PATTERNS - 60/n
// ============================================================================
const LIFE_THREATENING_60_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
  'dryer is being used indoor',
  'dryer is being used indoors',
  'the overcurrent protection device (i.e., fuse or breaker) is contaminated',
  'overcurrent protection device is contaminated',
  'fuse or breaker is contaminated',
  'water, rust, corrosion, infestation',
  'the overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an over current condition',
  'overcurrent protection device is damaged such that it may not interrupt',
  'fuse or breaker is damaged such that it may not interrupt',
  'may not interrupt the circuit during an over current condition',
  'fire extinguisher is damaged (i.e., visibly defective; impacts functionality)',
  'fire extinguisher is damaged',
  'fire extinguisher is missing',
  'the vent is damaged/misaligned/not connected properly',
  'vent is damaged/misaligned/not connected properly',
  'vent is damaged',
  'vent is misaligned',
  'vent is not connected properly',
  'unable to shutoff gas in case of an emergency',
  'unable to shut off gas in case of an emergency',
  'cannot shutoff gas',
  'shutoff gas in case of an emergency',
];

// ============================================================================
// LIFE-THREATENING PATTERNS - 30/n
// ============================================================================
const LIFE_THREATENING_30_PATTERNS = [
  // Toilet - only one present and damaged/inoperable
  'only one toilet is present, and it\'s either damaged or inoperable',
  'only one toilet is present and it\'s damaged or inoperable',
  'only one toilet is present',
  // Fuel-burning appliance
  'contains a fuel-burning appliance or fuel-burning fireplace',
  'fuel-burning appliance',
  'fuel-burning fireplace',
  // Dryer transition duct
  'dryer transition duct is not securely attached',
  'the dryer transition duct is not securely attached',
  'transition duct is not securely attached',
  // Airflow restriction (30/n version)
  'airflow may be restricted',
  // Locks
  'installed locks can not be engaged from both sides',
  'installed locks cannot be engaged from both sides',
  'locks can not be engaged from both sides',
  // Missing/incomplete
  'not present or is incomplete',
  // Egress/security
  'double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort',
  'double-key cylinder deadbolts',
  'locks or security features requiring a key, tool, or special effort from the street side',
  'prohibited on exit doors, exit access doors, and egress windows',
  'exit paths—including doors, stairways, and egress windows—must remain clear and operable',
  'exit paths must remain clear and operable without keys, tools, or special effort',
  'if the egress door is the unit entry',
  'egress may be blocked by locks, bars, or obstructions',
  // Electrical
  'electrical conductors must be properly enclosed and insulated',
  'no exposed wiring, open ports, missing covers, or gaps over 1/2',
  'exposed wiring',
  'open ports',
  'missing covers',
  'gaps over 1/2',
  'an outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized',
  'outlet is not energized',
  'any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current',
  'outlet or switch is damaged',
  'may not safely carry or control electrical current',
  'water is currently in contact with an electrical conductor',
  'water infiltration from the ceiling or inside of the wall',
  'afci outlet or afci breaker does not have visible damage and the test or reset button is inoperable',
  'afci outlet',
  'afci breaker',
  'test or reset button is inoperable',
  'an outlet, not gfci-protected, is present within six feet of a water source',
  'outlet, not gfci-protected',
  'within six feet of a water source',
  'gfci outlet or gfci breaker does not have visible damage and the test or reset button is inoperable',
  'gfci outlet',
  'gfci breaker',
  // Fire extinguisher
  'pressure gauge indicates that the fire extinguisher is over or under charged',
  'over or under charged',
  'fire extinguisher is noncompliant if the service tag is over a year old',
  'service tag is over a year old',
  'service tag missing',
  'service tag illegible',
  'disposable unit is over 12 years old',
  // Flammable items
  'excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the unit',
  'propane, gasoline, kerosene should never be stored',
  'combustible item in its original container',
  // Sprinkler
  'sprinkler assembly component is damaged, inoperable, or missing',
  'sprinkler head assembly has evidence of corrosion',
  'evidence of corrosion',
  'foreign material covers 50% or more of the sprinkler assembly',
  '50% or more of the glass bulb on the sprinkler assembly',
  '18 inches of clearance is not due to features within the built',
  '18 inches clearance',
  // HVAC
  'combustion chamber cover or gas shutoff valve was previously installed but is now either not present or incomplete',
  'combustion chamber cover',
  'gas shutoff valve was previously installed',
  'not properly connected through to the ceiling or wall',
  'metal tape of any kind is not a substitute for improperly connected flue vent',
  'the permanently installed heating or heating source is not working',
  'permanently installed heating source is not working',
  'temperature is below 64 degrees fahrenheit',
  'inside, include any and all common areas',
  // Gas leak
  'natural gas, propane, or oil leak',
  'natural gas leak',
  'propane leak',
  'oil leak',
  'strong odor',
  // Guardrail
  'guardrail is missing or not installed',
  'guardrail is missing',
  'not installed along a walking surface that is more than 30 inches above the floor or grade below',
  'guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height',
  'guardrail is deficient',
  'missing critical components',
  'under 30 inches in height',
  'not securely attached to reasonably prevent fall hazards',
];

// ============================================================================
// SEVERE PATTERNS - 14.8/(50*n) - Special Formula
// ============================================================================
const SEVERE_14_8_50N_PATTERNS = [
  'pull cord end is positioned more than 6 inches above the floor',
  'positioned more than 6 inches above the floor',
];

// ============================================================================
// SEVERE PATTERNS - 14.8/n
// ============================================================================
const SEVERE_14_8_PATTERNS = [
  // Bathtub/shower - only one present and inoperable
  'only one bathtub or shower is present within the unit and it is inoperable',
  'only one bathtub or shower is present',
  'standing water is present such that the inspector believes water is unable to drain',
  // Mold patches 1-9 sq ft
  'cumulative area of patches is more than 1 square foot and less than 9 square feet in a room',
  'cumulative area of patches is more than one square foot and less than 9 square feet',
  // Toilet - only one installed and missing
  'only one toilet was installed, and it is now missing',
  'only one toilet was installed and it is missing',
  'there is evidence of prior installation, but it is no longer present or is incomplete',
  // Ceiling
  'does not allow ceiling to enclose a room, protect shaft or circulation space',
  'does not allow ceiling to enclose a room',
  'create enclosure of and separation between spaces',
  'control the diffusion of light and sound around a room',
  // Entry door
  'entry door does not close',
  'door seats in frame',
  // Fire-labeled door issues
  'an object blocks the fire-labeled door from closing or self-closing and latching properly',
  'object blocks the fire-labeled door',
  'fire-labeled door assembly has a hole of any size',
  'assembly is damaged such that its integrity may be compromised',
  'fire labeled door that serves as entry door cannot be secured',
  'cannot be secured',
  'access controlled by at least one installed lock',
  'fire-labeled door fails to close and latch due to missing or damaged self-closing hardware',
  'fails to close and latch',
  'missing or damaged self-closing hardware',
  'fire labeled door does not open such that it may limit access between spaces',
  'fire labeled door does not open',
  'may limit access between spaces',
  'evidence of prior installation, but now not present or is incomplete',
  'fire-labeled door seal or gasket is damaged or missing, affecting proper function',
  'fire-labeled door seal or gasket is damaged or missing',
  'affecting proper function',
  // Electrical - three-pronged outlet
  'testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded',
  'three-pronged outlet',
  'not properly wired or grounded',
  // Infestation - severe
  'sighting of at least one live bedbug in two or more, units or two rooms of the same unit during the daytime surface visual assessment',
  'sighting of at least one live bedbug in two or more units',
  'at least one live bedbug',
  'sighting of one or more live cockroaches in two or more unit area observed simultaneously during visual assessment',
  'one or more live cockroaches in two or more unit area',
  'sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime',
  'at least one live mouse in two or more units',
  'live rat is seen in the unit',
  'a live rat is seen in the unit',
  // Sharp edge
  'sharp edge that can result in a cut or puncture hazard that is likely to require emergency care',
  'sharp edge',
  'cut or puncture hazard',
  'likely to require emergency care',
  // Safety shield
  'safety shield was previously installed and is now not present or is incomplete',
  'safety shield was previously installed',
  // Cooking appliance - microwave primary
  'microwave is the primary cooking appliance and it is damaged',
  'microwave is the primary cooking appliance',
  'no burner on the cooking range or cooktop produces heat',
  'no burner produces heat',
  'the oven does not produce heat temperature',
  'oven does not produce heat',
  'primary cooking appliance is missing',
  // Sewage
  'blocked sewage system',
  'leak in sewage system',
  // Paint - more than 2 sq ft
  'more than 2 square feet per room deteriorated paint',
  'damage to the surface such as holes that expose paint layers',
  'friction on painted surfaces',
  // Water heater
  'no hot water after several minutes',
  'the tprv valve is not functioning adequately',
  'tprv valve is not functioning',
  // Window lock
  'window lock does not keep the window closed',
];

// ============================================================================
// MODERATE PATTERNS - 5.5/n
// ============================================================================
const MODERATE_5_5_PATTERNS = [
  // Bathtub/shower
  'bathtub or shower is inoperable, or standing water is present',
  'water is unable to drain or drains very slowly',
  'drains very slowly',
  'bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene',
  'limiting the resident\'s ability to maintain personal hygiene',
  'nonfunctional fixtures',
  'absent components with signs of prior installation',
  'severe discoloration affecting over 50% of the surface',
  'resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space',
  'without being observed from an adjacent room',
  // Bathroom cabinet
  'bathroom cabinet doors, drawers, or shelves are missing',
  'evidence of prior installation, but now not present or incomplete',
  'visibly defective; impacts the functionality',
  'does not meet the functionality or serve the purpose',
  // Grab bar
  'any movement, whatsoever, is detected in the grab bar',
  'any movement whatever is detected in the grab bar',
  'movement is detected in the grab bar',
  // Mold - elevated moisture
  'elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  // Mold patches 4 sq in to 1 sq ft
  'cumulative area of patches is more than 4 square inches and less than 1 square foot in a room',
  'more than 4 square inches and less than 1 square foot',
  // Restroom sink
  'control knobs do not activate or deactivate hot and cold water',
  'sink component is missing',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'pulling away from the wall',
  'water is not draining from the basin of the sink',
  'slow or clogged drain',
  // Toilet - another functional exists
  'toilet is damaged or inoperable, but another functional toilet exists within the unit',
  'another functional toilet exists within the unit',
  'defect may be visible or affect overall usability',
  'toilet is missing and at least one toilet is installed elsewhere within the unit that is operational',
  'at least one toilet is installed elsewhere',
  // Privacy
  'hole in the door and damaged hardware, missing door',
  'resident should be able to use the bathtub or shower without being observed',
  // Toilet component
  'toilet component is damaged or inoperable, potentially limiting safe waste discharge',
  'potentially limiting safe waste discharge',
  'toilet is not secured at the base',
  // Ventilation
  'exhaust fan, window, or adequate means of ventilation is not present and operable',
  'adequate means of ventilation is not present',
  'exhaust system component is damaged or exhaust system component is missing',
  'exhaust system component is damaged',
  'exhaust system component is missing',
  'exhaust vent inoperable',
  'exhaust system is blocked such that airflow may be restricted',
  // Cabinet storage
  'storage for essential food items is damaged, inoperable, or missing',
  'affecting over 50% of cabinet doors, drawers, or shelves',
  '50% or more of cabinet doors',
  '50% or more of drawers',
  '50% or more of shelves are missing or damaged',
  // Ceiling
  'opens directly to the outside light regardless of the size',
  'ceiling has a damaged opening>2',
  'ceiling has a damaged opening',
  'unstable surfaces',
  'drywall, gypsum, or ceiling tiles are missing or detached',
  'presence of bubbling, deflection, loose joint tape, or loose panels',
  'water infiltration should be evaluated under the \'leak water\' category',
  // Entry door
  'evidence of prior installation, now missing',
  'entry door seal is damaged, missing, or nonfunctional',
  'causing a gap ≥¼ inch that lets in light',
  'shows signs of water damage or dry rot',
  'self-closing mechanism is damaged, missing, or fails to close and latch',
  'self-closing mechanism is damaged',
  'self-closing mechanism is missing',
  'fails to close and latch the door properly',
  'delamination or separation of the door surface 2 inches wide or greater',
  'delamination or separation that affects the integrity of the door',
  'entry door does not open',
  'crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door',
  'crack, split, separation, or hole 1/4 inch or greater',
  // Passage door
  'passage door does not open such that it may limit access when needed',
  'passage door not intended for room access has a component that is either damaged, inoperable, or missing',
  'affecting its function or indicating prior installation',
  // Garage door
  'door will not open and remain open, does not function adequately',
  'garage door has a hole of any size that penetrates through to the interior',
  // Drainage
  'there is a problem with the drainage',
  'problem with the drainage',
  // Electrical panel
  'electrical service panel is not reasonably accessible',
  'it is locked or in locked location, no key to access',
  'locked or in locked location',
  // Habitable rooms
  'habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking',
  // Floor
  'surface abnormalities may indicate the presence of deficiency',
  'lifting tiles',
  'hardwood cupping',
  'linoleum bubbling',
  'repair is needed',
  // Foundation
  'foundation exhibits a sign of serious failure',
  'foundation exhibits a sign of failure, and it is not structural',
  'foundation cracks',
  'cracks in walls, non-functioning doors, unlevel floors, or windows',
  'excessive dampness, collected water, stains, or mineral deposits',
  'foundation damage',
  'rot on support posts, columns, or girders',
  // Infestation - evidence
  'evidence of bedbugs is found',
  'live or dead bedbugs, feces, eggs, or blood trail',
  'evidence of cockroaches is found',
  'dead or live cockroaches, shed skins, droppings',
  'tiny black specks or smears',
  'egg cases',
  'evidence of mice is found',
  'live or dead mouse or mice, droppings, chewed holes, or urine trails',
  'evidence of interior pest infestations',
  'ants, wasps, squirrels, birds, or bats',
  'may pose health and safety risks to residents',
  'evidence of rats is found',
  'live or dead rat, droppings, or chewed holes',
  // Trip hazard
  'walking surfaces have an abrupt change',
  'vertical gap ≥¾ inch',
  'horizontal separation ≥2 inches across the path of travel',
  'abrupt change in vertical elevation or horizontal separation',
  // HVAC
  'a window unit or central air system',
  'window unit or central air system',
  'permanently installed heating source may include forced air heating, radiant heat, baseboard units',
  'forced air heating',
  'radiant heat',
  'baseboard units',
  // Kitchen cabinet
  'kitchen cabinet doors, drawers, or shelves are missing',
  // Kitchen cooking appliance
  'burner does not produce heat, but at least one other burner is present',
  'at least one other burner is present',
  'cooking range, cooktop, or oven component is missing',
  'device is unsafe for use',
  // Kitchen countertop
  'kitchen countertops must be fully surfaced and functional',
  'exposed substrate over 10%',
  'setups that hinder food prep are deficient',
  // Kitchen mold
  // (uses same elevated moisture and patches patterns)
  // Kitchen refrigerator
  'refrigerator component is damaged',
  'impacts functionality',
  'does not cool adequately for the safe storage of food',
  'does not cool adequately',
  'refrigerator is missing',
  // Kitchen sink
  // (uses same control knobs, sink component missing, separation patterns)
  'sink is missing',
  'not installed in the primary kitchen',
  // Kitchen ventilation
  // (uses same exhaust patterns)
  // Sewage leak
  'cap to the cleanout or pump cover is detached or missing',
  'protective cap or riser is damaged',
  // Water leak
  'environmental water intrusion',
  'fluid is leaking from the sprinkler assembly',
  'plumbing leak',
  // Lighting
  'permanently installed light fixture is inoperable',
  'overall system or component thereof is not meeting function or purpose',
  'permanently installed light fixture is not secure to the designed attachment point',
  'attachment point is not stable',
  'at least one (1) permanently installed light fixture is not present in the kitchen and bathroom',
  'at least one permanently installed light fixture is not present',
  'at least two (2) working outlets are absent within each habitable room',
  'at least one (1) working outlet and one (1) permanently installed light fixture not present',
  // Paint - less than 2 sq ft
  'less than 2 square feet per room deteriorated paint',
  // Handrail
  'handrail is deficient if it cannot be reasonably grasped for support',
  'cannot be reasonably grasped for support',
  'not continuous along the full stair flight',
  'outside the required height range of 28 to 42 inches',
  'handrail is not functionally adequate',
  'handrail is not continuous for the full length of each flight of stairs',
  'handrail is not between 28 inches and 42 inches in height',
  'movement in the anchors of the handrail',
  // Laundry sink
  // (uses same control knobs, sink component missing, separation patterns)
  'not present or incomplete',
  // Steps and stairs
  'instability is detected while walking on the stair',
  'secure accessory treads are not present',
  // Ventilation unit
  'effecting the unit',
  'exhaust fan, inoperable',
  // Wall
  'interior wall component(s) is not functionally adequate',
  'impacts the integrity of the interior wall',
  'does not allow interior wall to provide vertical separation between rooms or spaces',
  'wall is damaged, and repairs still need to be completed appropriately',
  'loose or detached surface coverings',
  'drywall, plaster, paneling',
  'not properly installed',
  // Window
  'only one lock is present, and it is damaged or inoperable',
  'only one lock present, and it is damaged, inoperable',
  'window is not functionally adequate',
  'will not stay open without the use of a tool or item',
];

// ============================================================================
// LOW PATTERNS - 2.40/n
// ============================================================================
const LOW_2_4_PATTERNS = [
  // Sink component damaged but functional
  'component, inoperable or missing—whether due to system failure, incomplete installation',
  'absence of non-mechanical parts like a stopper',
  'discoloration affecting less than 50% of the surface',
  'sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality)',
  'stopper missing, damaged or inoperable',
  'sink component is damaged',
  // Water direction
  'confirm that water is directed into the basin and not outside when in use',
  'water is directed into the basin',
  'when in use, water is directed outside of the basin',
  'water is directed outside of the basin',
  // Toilet component
  'toilet component may be damaged, inoperable, or missing',
  'visibly defective, functionally impaired, or absent despite evidence of prior installation',
  // Door - hole/crack
  'hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door',
  'a hole ¼ inch or greater in diameter',
  'a split or crack ¼ inch or greater in width',
  'hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom',
  'glass is missing within the door, side lights, or transom',
  // Door - privacy/separation
  'whether visibly defective, nonfunctional, or incomplete— the door fails to provide adequate privacy',
  'fails to provide adequate privacy',
  'separation between rooms',
  'control over the physical atmosphere within a space',
  // Handrail not installed
  '4 or more stair risers are present, and a handrail is not installed',
  'ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches',
  'handrail is not installed on both sides',
  // Sink water pressure
  'sink\'s faucet water pressure and direction are not functional or adequate',
  'faucet water pressure',
  'direction are not functional or adequate',
];

// ============================================================================
// AGGREGATED PATTERN ARRAYS FOR MATCHING
// ============================================================================

// Special formula patterns - 60/(50*n) for annunciator
const SPECIAL_FORMULA_60_50N_PATTERNS = [...LIFE_THREATENING_60_50N_PATTERNS];

// Special formula patterns - 14.8/(50*n) for pull cord
const SPECIAL_FORMULA_14_8_50N_PATTERNS = [...SEVERE_14_8_50N_PATTERNS];

// Life-Threatening with 60/n
const LIFE_THREATENING_60_FORMULA_PATTERNS = [...LIFE_THREATENING_60_PATTERNS];

// Life-Threatening with 30/n
const LIFE_THREATENING_30_FORMULA_PATTERNS = [...LIFE_THREATENING_30_PATTERNS];

// Severe with 14.8/n
const SEVERE_FORMULA_PATTERNS = [...SEVERE_14_8_PATTERNS];

// Moderate with 5.5/n
const MODERATE_FORMULA_PATTERNS = [...MODERATE_5_5_PATTERNS];

// Low with 2.40/n
const LOW_FORMULA_PATTERNS = [...LOW_2_4_PATTERNS];

const POSSIBLE_SCORE = 25;

/**
 * Get default severity configuration for Units inspection
 * @param categoryNumber The NSPIRE Units category number
 * @returns Default severity configuration - defaults to Moderate 5.5/n
 */
export function getDefaultUnitsSeverityConfig(categoryNumber: number): UnitsSeverityConfig {
  return { severity: 'Moderate', pointsLostFormula: 5.5 };
}

/**
 * Check if deficiency matches Life-Threatening 60/(50*n) patterns (annunciator)
 */
function matchesLifeThreatening60_50nPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SPECIAL_FORMULA_60_50N_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Severe 14.8/(50*n) patterns (pull cord)
 */
function matchesSevere14_8_50nPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SPECIAL_FORMULA_14_8_50N_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Life-Threatening 60/n patterns
 */
function matchesLifeThreatening60Pattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LIFE_THREATENING_60_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Life-Threatening 30/n patterns
 */
function matchesLifeThreatening30Pattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LIFE_THREATENING_30_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Severe 14.8/n patterns
 */
function matchesSeverePattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SEVERE_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Moderate 5.5/n patterns
 */
function matchesModeratePattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return MODERATE_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Low 2.40/n patterns
 */
function matchesLowPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LOW_FORMULA_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Get severity configuration with deficiency-based override for Units inspection
 * Deficiency-based rules take precedence over category-based rules
 * 
 * @param categoryNumber The NSPIRE Units category number
 * @param deficiencyDescription Optional deficiency description for override checking
 * @param selectedSeverity Optional severity from deficiency selection
 * @returns Severity configuration with severity level and points lost formula
 */
export function getUnitsSeverityConfig(
  categoryNumber: number,
  deficiencyDescription?: string,
  selectedSeverity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
): UnitsSeverityConfig {
  // Check deficiency-based overrides first (they take precedence)
  if (deficiencyDescription) {
    // Check for Life-Threatening 60/(50*n) patterns - annunciator (highest priority special formula)
    if (matchesLifeThreatening60_50nPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 60.0, specialFormula: 'divide_50n' };
    }
    
    // Check for Severe 14.8/(50*n) patterns - pull cord (special formula)
    if (matchesSevere14_8_50nPattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 14.8, specialFormula: 'divide_50n' };
    }
    
    // Check for Life-Threatening 60/n patterns
    if (matchesLifeThreatening60Pattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 60.0 };
    }
    
    // Check for Life-Threatening 30/n patterns
    if (matchesLifeThreatening30Pattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 30.0 };
    }
    
    // Check for Severe 14.8/n patterns
    if (matchesSeverePattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 14.8 };
    }
    
    // Check for Low 2.40/n patterns (check before moderate for specificity)
    if (matchesLowPattern(deficiencyDescription)) {
      return { severity: 'Low', pointsLostFormula: 2.40 };
    }
    
    // Check for Moderate 5.5/n patterns
    if (matchesModeratePattern(deficiencyDescription)) {
      return { severity: 'Moderate', pointsLostFormula: 5.5 };
    }
  }
  
  // If no pattern matched but we have a selected severity, use it with appropriate formula
  if (selectedSeverity) {
    switch (selectedSeverity) {
      case 'Life-Threatening':
        return { severity: 'Life-Threatening', pointsLostFormula: 30.0 };
      case 'Severe':
        return { severity: 'Severe', pointsLostFormula: 14.8 };
      case 'Low':
        return { severity: 'Low', pointsLostFormula: 2.40 };
      case 'Moderate':
      default:
        return { severity: 'Moderate', pointsLostFormula: 5.5 };
    }
  }
  
  // Fall back to default configuration
  return getDefaultUnitsSeverityConfig(categoryNumber);
}

export interface UnitsScoringInput {
  categoryNumber: number;       // NSPIRE Units category number
  totalSamples: number;         // n - number of sample units
  deficiencyDescription?: string; // Optional deficiency description for override checking
  deficiencyCount?: number;     // Number of deficiencies (default: 1)
  severity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'; // Optional severity from deficiency selection
}

export interface UnitsScoringResult {
  categoryNumber: number;       // Category number
  totalSamples: number;         // n - total sample units
  severity: string;             // Resolved severity level
  pointsLostRaw: number;        // Pts Lost (Raw) = base formula numerator
  pointsLost: number;           // Pts Lost = numerator / n (or special formula)
  deficiencyCount: number;      // Number of deficiencies
  possibleScore: number;        // Fixed at 25
  maxPtsLost: number;           // Max Pts Lost = Pts Lost / n
  score: number;                // Score = 25 - maxPtsLost
  formulaNumerator: number;     // The numerator used in the formula
  isDeficiencyOverride: boolean; // Whether deficiency-based override was applied
  specialFormula?: string;      // Special formula type if applicable
  // Aliases for backward compatibility
  allSample: number;
  ptsLostRaw: number;
  ptsLost: number;
}

/**
 * Calculate scoring for Units inspection
 * 
 * Formulas:
 *   Points Lost (Raw) = formulaNumerator (base value)
 *   Points Lost = formulaNumerator / n (or special formula like X/(50*n))
 *   Max Points Lost = Points Lost / n
 *   Score = Possible Score (25) − Max Points Lost
 * 
 * @param input Scoring input with category number, samples, and optional deficiency description
 * @returns Complete scoring result
 */
export function calculateUnitsScore(input: UnitsScoringInput): UnitsScoringResult {
  const { 
    categoryNumber, 
    totalSamples, 
    deficiencyDescription,
    deficiencyCount = 1,
    severity: selectedSeverity
  } = input;

  // Ensure we don't divide by zero - minimum 1 sample
  const n = Math.max(totalSamples, 1);
  const count = Math.max(deficiencyCount, 0);

  // Get severity config (with deficiency override if applicable, or use selected severity)
  const severityConfig = getUnitsSeverityConfig(categoryNumber, deficiencyDescription, selectedSeverity);
  
  // Check if deficiency override was applied
  const categoryOnlyConfig = getDefaultUnitsSeverityConfig(categoryNumber);
  const isDeficiencyOverride = deficiencyDescription !== undefined && 
    (severityConfig.severity !== categoryOnlyConfig.severity || 
     severityConfig.pointsLostFormula !== categoryOnlyConfig.pointsLostFormula);

  // Pts Lost (Raw) = the base formula numerator
  const pointsLostRaw = severityConfig.pointsLostFormula;

  // Calculate Pts Lost based on formula type
  let pointsLost: number;
  if (severityConfig.specialFormula === 'divide_50n') {
    // Special formula: X / (50 * n)
    pointsLost = severityConfig.pointsLostFormula / (50 * n);
  } else {
    // Standard formula: numerator / n
    pointsLost = severityConfig.pointsLostFormula / n;
  }

  // Calculate Max Points Lost = Points Lost / n
  const maxPtsLost = pointsLost / n;

  // Calculate Score = Possible Score (25) - Max Points Lost
  const score = POSSIBLE_SCORE - maxPtsLost;

  return {
    categoryNumber,
    totalSamples: n,
    allSample: n,
    severity: severityConfig.severity,
    pointsLostRaw: parseFloat(pointsLostRaw.toFixed(4)),
    ptsLostRaw: parseFloat(pointsLostRaw.toFixed(4)),
    pointsLost: parseFloat(pointsLost.toFixed(4)),
    ptsLost: parseFloat(pointsLost.toFixed(4)),
    deficiencyCount: count,
    possibleScore: POSSIBLE_SCORE,
    maxPtsLost: parseFloat(maxPtsLost.toFixed(4)),
    score: parseFloat(score.toFixed(2)),
    formulaNumerator: severityConfig.pointsLostFormula,
    isDeficiencyOverride,
    specialFormula: severityConfig.specialFormula,
  };
}

/**
 * Extract category number from item ID or name
 * @param itemId The item ID (e.g., "1", "2", etc.)
 * @param itemName Optional item name to extract number from prefix
 * @returns The category number
 */
export function extractUnitsCategoryNumber(itemId?: string, itemName?: string): number {
  // Try to get from itemId first
  if (itemId) {
    const num = parseInt(itemId, 10);
    if (!isNaN(num) && num >= 1) {
      return num;
    }
  }
  
  // Try to extract from item name (e.g., "1. Bathroom")
  if (itemName) {
    const match = itemName.match(/^(\d+)\./);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num >= 1) {
        return num;
      }
    }
  }
  
  // Default to category 1 if not found
  return 1;
}

// Export deficiency pattern constants for external use
export const UNITS_DEFICIENCY_PATTERNS = {
  // Special formulas
  LIFE_THREATENING_60_50N: LIFE_THREATENING_60_50N_PATTERNS,
  SEVERE_14_8_50N: SEVERE_14_8_50N_PATTERNS,
  // Standard formulas
  LIFE_THREATENING_60: LIFE_THREATENING_60_PATTERNS,
  LIFE_THREATENING_30: LIFE_THREATENING_30_PATTERNS,
  SEVERE_14_8: SEVERE_14_8_PATTERNS,
  MODERATE_5_5: MODERATE_5_5_PATTERNS,
  LOW_2_4: LOW_2_4_PATTERNS,
};

// Export formula constants for reference
export const UNITS_FORMULA_VALUES = {
  LIFE_THREATENING_60_50N: { numerator: 60, divisor: '50*n', severity: 'Life-Threatening' },
  LIFE_THREATENING_60: { numerator: 60, divisor: 'n', severity: 'Life-Threatening' },
  LIFE_THREATENING_30: { numerator: 30, divisor: 'n', severity: 'Life-Threatening' },
  SEVERE_14_8_50N: { numerator: 14.8, divisor: '50*n', severity: 'Severe' },
  SEVERE_14_8: { numerator: 14.8, divisor: 'n', severity: 'Severe' },
  MODERATE_5_5: { numerator: 5.5, divisor: 'n', severity: 'Moderate' },
  LOW_2_4: { numerator: 2.4, divisor: 'n', severity: 'Low' },
};
