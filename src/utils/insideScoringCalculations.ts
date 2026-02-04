// Inside Inspection Module Scoring Calculations
// Specialized scoring logic for NSPIRE Inside inspection categories
// Handles category-based and deficiency-based severity/points lost mapping
// Organized by Category for clean mapping

export interface InsideSeverityConfig {
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  pointsLostFormula: number; // The numerator in the formula Pts Lost = X / n
  specialFormula?: 'divide_50n'; // Special formula type: 27.25/(50*n)
}

// ============================================================================
// CATEGORY-BASED DEFICIENCY PATTERNS
// Each category maps deficiency criteria to severity and formula exactly
// ============================================================================

// ----------------------------------------------------------------------------
// Category: Cabinet and Storage (Pantry, Laundry) - Low - 2.20/n
// ----------------------------------------------------------------------------
const CABINET_STORAGE_PATTERNS = [
  'stowed items, including food, sanitation, and household supplies',
  'stowed items',
  'food, sanitation, and household supplies',
];

// ----------------------------------------------------------------------------
// Category: Call-for-Aid System
// - Severe: 13.40/n (pull cord)
// - Life-Threatening: 27.25/(50*n) (annunciator)
// ----------------------------------------------------------------------------
const CALL_FOR_AID_SEVERE_PATTERNS = [
  'pull cord end is positioned more than 6 inches above the floor',
  'positioned more than 6 inches above the floor',
];

const CALL_FOR_AID_SPECIAL_FORMULA_PATTERNS = [
  'annunciator does not indicate the correct corresponding room',
  'does not indicate the correct corresponding room',
];

// ----------------------------------------------------------------------------
// Category: Carbon Monoxide Alarm - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CARBON_MONOXIDE_ALARM_PATTERNS = [
  'with or without a battery, including low-volume',
  'with or without a battery',
  'including low-volume',
  'unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust',
  'attached private garage that does not have natural ventilation',
  'does not have a ventilation system for vehicle exhaust',
  'carbon monoxide alarm is covered by a foreign object',
  'plastic bag, shower cap, zip tie, paint, tape, decorative stickers',
];

// ----------------------------------------------------------------------------
// Category: Ceiling - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const CEILING_PATTERNS = [
  'opens directly to the outside light regardless of the size',
  'ceiling has a damaged opening>2',
  'ceiling has a damaged opening',
  'unstable surfaces',
  'drywall, gypsum, or ceiling tiles are missing or detached',
  'presence of bubbling, deflection, loose joint tape, or loose panels',
];

// ----------------------------------------------------------------------------
// Category: Chimney - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CHIMNEY_PATTERNS = [
  'fireplace or fire burning appliance is not intentionally decommissioned',
  'not intentionally decommissioned',
];

// ----------------------------------------------------------------------------
// Category: Clothes Dryer Exhaust Ventilation - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const CLOTHES_DRYER_EXHAUST_PATTERNS = [
  'dryer is being used indoor',
  'dryer transition duct is not securely attached',
  'transition duct is not securely attached',
];

// ----------------------------------------------------------------------------
// Category: Door - Entry
// - Low: 2.20/n (hole/crack)
// - Moderate: 5.0/n (others)
// ----------------------------------------------------------------------------
const DOOR_ENTRY_LOW_PATTERNS = [
  'hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door',
  'hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom',
  'glass is missing within the door, side lights, or transom',
  'a hole ¼ inch or greater in diameter',
  'a split or crack ¼ inch or greater in width',
];

const DOOR_ENTRY_MODERATE_PATTERNS = [
  'observed evidence of prior installation, now missing',
  'seal, gasket, or stripping is damaged, inoperable, or missing',
  'gap of ¼ inch or more that allows light through',
  'evidence of water penetration such as damage or dry rot',
  'self-closing mechanism is damaged',
  'self-closing mechanism does not pull the door closed and engage the latch',
  'self-closing mechanism is missing',
  'delamination or separation of the door surface 2 inches wide or greater',
  'delamination or separation that affects the integrity of the door',
  'entry door does not open',
  'crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door',
  'crack, split, separation, or hole 1/4 inch or greater',
];

// ----------------------------------------------------------------------------
// Category: Door - Fire Labeled - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const DOOR_FIRE_LABELED_PATTERNS = [
  'evidence of prior installation, but now not present or is incomplete',
  'fire labeled door is missing',
  'fire door is not present',
];

// ----------------------------------------------------------------------------
// Category: Door - General
// - Low: 2.20/n (privacy/separation issues)
// - Moderate: 5.0/n (does not open)
// ----------------------------------------------------------------------------
const DOOR_GENERAL_LOW_PATTERNS = [
  'passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere',
  'cannot adequately provide privacy, room separation, or control the physical atmosphere',
  'non-access passage door is damaged, inoperable, or missing a component—affecting its intended function',
  'non-access passage door is damaged, inoperable, or missing a component',
  'affecting its intended function',
];

const DOOR_GENERAL_MODERATE_PATTERNS = [
  'passage door does not open such that it may limit access when needed',
];

// ----------------------------------------------------------------------------
// Category: Garage Door - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const GARAGE_DOOR_PATTERNS = [
  'door will not open and remain open, does not function adequately',
  'garage door has a hole of any size that penetrates through to the interior',
];

// ----------------------------------------------------------------------------
// Category: Drainage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const DRAINAGE_PATTERNS = [
  'there is a problem with the drainage',
  'problem with the drainage',
];

// ----------------------------------------------------------------------------
// Category: Egress - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const EGRESS_PATTERNS = [
  'double-key cylinder deadbolt locks or security features requiring a key, tool, or special effort',
  'not allowed on exit doors, exit access doors, or egress windows',
  'fixed or movable security bars must not block designated egress points',
  'no furniture or items may obstruct the means of egress',
  'security features requiring a key, tool, or special effort from the stress side',
];

// ----------------------------------------------------------------------------
// Category: Electrical - Conductor, Outlet, and Switch - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const ELECTRICAL_CONDUCTOR_PATTERNS = [
  'electrical conductors must be enclosed and insulated',
  'no exposed wiring, open ports, missing covers, or gaps over 1/2',
  'exposed wiring',
  'open ports',
  'missing covers',
  'gaps over 1/2',
  'any portion of a visually accessible',
  'outlet or switch is damaged',
  'may not safely carry or control electrical current',
  'water is currently in contact with an electrical conductor',
  'water infiltration from the ceiling or inside of the wall',
];

// ----------------------------------------------------------------------------
// Category: Electrical Service Panel
// - Life-Threatening: 27.25/n (overcurrent device damaged)
// - Moderate: 5.0/n (not accessible)
// ----------------------------------------------------------------------------
const ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS = [
  'overcurrent protection device (i.e., fuse or breaker) is damaged',
  'overcurrent protection device is damaged',
  'fuse or breaker is damaged',
  'may not interrupt the circuit during an over current condition',
  'paint, or other foreign materials',
];

const ELECTRICAL_PANEL_MODERATE_PATTERNS = [
  'electrical service panel is not reasonably accessible',
  'cannot be reached and opened without moving obstructions',
  'it is looked or in locked location, no key to access',
  'locked or in locked location',
];

// ----------------------------------------------------------------------------
// Category: Elevator - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const ELEVATOR_PATTERNS = [
  'more than 3/4 inch difference in level between the elevator cab and the building floor',
  'all elevators must be in working condition',
  'elevator system or component thereof not meeting function or purpose',
  'system or a component thereof is not meeting its function or purpose',
];

// ----------------------------------------------------------------------------
// Category: Fire Safety - Exit Sign - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const FIRE_EXIT_SIGN_PATTERNS = [
  'exit sign is deficient',
  'exit is not clearly visible',
  'exit isn\'t clearly visible',
  'not adequately illuminated',
  'exit sign is damaged',
  'exit sign is missing',
  'exit sign is obstructed',
];

// ----------------------------------------------------------------------------
// Category: Fire Safety - Fire Extinguisher - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const FIRE_EXTINGUISHER_PATTERNS = [
  'fire extinguisher is damaged or missing',
  'fire extinguisher is damaged',
  'fire extinguisher is missing',
  'pressure gauge indicates that the fire extinguisher is over or under charged',
  'over or under charged',
  'date on the service tag of any fire extinguisher has exceeded one year',
  'fire extinguisher tag is missing or illegible',
  'non-chargeable or disposable fire extinguisher is more than 12 years old',
];

// ----------------------------------------------------------------------------
// Category: Fire Safety - Flammable and Combustible Item - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const FLAMMABLE_COMBUSTIBLE_PATTERNS = [
  'excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the unit',
  'propane, gasoline, kerosene should never be stored',
  'flammable or combustible item',
];

// ----------------------------------------------------------------------------
// Category: Fire Safety - Smoke Alarm - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const SMOKE_ALARM_PATTERNS = [
  'required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing',
  'does not emit visual or audio alarm',
  'alarm does not cease after testing',
  'smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level',
  'not installed within a hallway in the vicinity of multiple units',
  'smoke alarm is covered by a foreign object',
  'unable to determine if a required smoke alarm meets the requirement of this standard',
  'consider the condition a deficiency',
];

// ----------------------------------------------------------------------------
// Category: Fire Safety - Sprinkler Assembly - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const SPRINKLER_ASSEMBLY_PATTERNS = [
  'sprinkler assembly component is damaged, inoperable or missing',
  'sprinkler head assembly has evidence of corrosion',
  'evidence of corrosion',
  'foreign material covers 50% or more of the sprinkler assembly',
  '50% or more of the glass bulb on the sprinkler assembly',
  '18 inches clearance is not due to feature within built',
];

// ----------------------------------------------------------------------------
// Category: Floor - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const FLOOR_PATTERNS = [
  'surface abnormalities may indicate the presence of deficiency',
  'lifting tiles',
  'hardwood cupping',
  'linoleum bubbling',
  'repair is needed',
];

// ----------------------------------------------------------------------------
// Category: Foundation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const FOUNDATION_PATTERNS = [
  'foundation exhibits a sign of failure, and it is not structural',
  'foundation cracks',
  'cracks in walls, no functioning doors, unlevel floors or windows',
  'excessive dampness, collected water, stains, or mineral deposits',
  'foundation damage',
  'rot on support posts, columns, or girders',
];

// ----------------------------------------------------------------------------
// Category: Grab Bar - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const GRAB_BAR_PATTERNS = [
  'damaged, loose, or missing',
  'grab bar is damaged',
  'grab bar is loose',
  'grab bar is missing',
];

// ----------------------------------------------------------------------------
// Category: Hazard - Infestation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const INFESTATION_PATTERNS = [
  'evidence of bedbugs is found',
  'live or dead bedbugs, feces, eggs, or blood trail',
  'evidence of cockroaches is found',
  'dead or live cockroaches, shed skins, droppings',
  'evidence of mice is found',
  'live or dead mouse or mice, droppings, chewed holes, or urine trails',
  'evidence is present of other pest infestations',
  'trail of ants, wasps/beehives, squirrels, birds, and bats',
  'evidence of rats is found',
  'live or dead rat or droppings, chewed holes',
  'sighting of at least one live bedbug in two or more units',
  'sighting of at least one live mouse in two or more, units',
  'live rat is seen in the unit',
];

// ----------------------------------------------------------------------------
// Category: Hazard - LITTER - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const LITTER_PATTERNS = [
  'litter is considered deficient if 10 or more small items',
  '10×10 ft area not designated for garbage',
  '10 or more small items',
  'any large discarded items',
];

// ----------------------------------------------------------------------------
// Category: Hazard - Trip hazard - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const TRIP_HAZARD_PATTERNS = [
  'abrupt change in vertical elevation or horizontal separation',
  'unintended ¾ inch or greater vertical difference',
  'unintended 2-inch horizontal separation perpendicular to the path of travel',
];

// ----------------------------------------------------------------------------
// Category: Heating, Ventilation, and Air Conditioning
// - Low: 2.20/n (window unit or central air system)
// - Life-Threatening: 27.25/n (others)
// ----------------------------------------------------------------------------
const HVAC_LOW_PATTERNS = [
  'a window unit or central air system',
  'window unit or central air system',
];

const HVAC_LIFE_THREATENING_PATTERNS = [
  'combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete',
  'combustion chamber cover',
  'gas shutoff valve was previously installed and is now not present',
  'not properly connected through to the ceiling or wall',
  'metal tape of any kind is not a substitute for improperly connected flue vent',
  'permanently installed heating source is not working to create heat',
  'inside, include any and all common areas',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Cabinet and Storage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const KITCHEN_CABINET_PATTERNS = [
  'kitchen cabinet doors, drawers, or shelves are missing',
  'evidence of prior installation, but now not present or incomplete',
  'visibly defective; impacts the functionality',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Cooking Appliance - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const KITCHEN_COOKING_APPLIANCE_PATTERNS = [
  'burner does not produce heat, but at least one other burner is present',
  'cooking range, cooktop, or oven component is missing',
  'device is unsafe for use',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Food preparation Area - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const KITCHEN_FOOD_PREP_PATTERNS = [
  'kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate',
  '10% or more of the surface is exposed substrate',
  'countertop is missing',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - MOLD-LIKE SUBSTANCE
// - Moderate: 5.0/n (elevated moisture, <1 sq ft patches)
// - Life-Threatening: 27.25/n (>9 sq ft patches)
// ----------------------------------------------------------------------------
const KITCHEN_MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than one square foot',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
];

const KITCHEN_MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Refrigerator - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const KITCHEN_REFRIGERATOR_PATTERNS = [
  'refrigerator component is damaged',
  'visibly defective',
  'impacts functionality',
  'refrigerator is inoperable',
  'unable to safely and adequately store food',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Sink
// - Moderate: 5.0/n (control knobs, missing component, separation, drain)
// - Low: 2.20/n (damaged but functionally adequate, water pressure)
// ----------------------------------------------------------------------------
const KITCHEN_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'sink component is missing',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'water is not draining from the basin of the sink',
  'slow or clogged drain',
];

const KITCHEN_SINK_LOW_PATTERNS = [
  'sink component is damaged and the sink is functionally adequate',
  'sink is functionally adequate',
  'water pressure, direction is not adequately functional',
  'direction is not adequately functional',
];

// ----------------------------------------------------------------------------
// Category: Kitchen - Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const KITCHEN_VENTILATION_PATTERNS = [
  'exhaust fan, window, or adequate means of ventilation is not present and operable',
  'exhaust system component is damaged',
  'exhaust system component is missing',
  'exhaust vent inoperable',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category: LEAK – Gas or Oil - Life-Threatening - 54.50/n
// ----------------------------------------------------------------------------
const GAS_OIL_LEAK_PATTERNS = [
  'natural gas, propane, or oil leak',
  'natural gas leak',
  'propane leak',
  'oil leak',
  'gas leak',
];

// ----------------------------------------------------------------------------
// Category: Leak-sewage system (Clogged drain)(Missing drain cap) - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const SEWAGE_LEAK_PATTERNS = [
  'cap to the cleanout or pump cover is detached or missing',
  'protective cap or riser is damaged',
];

// ----------------------------------------------------------------------------
// Category: Leak- water - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const WATER_LEAK_PATTERNS = [
  'environmental water intrusion',
  'fluid is leaking from the sprinkler assembly',
  'plumbing leak',
];

// ----------------------------------------------------------------------------
// Category: Lighting - Interior - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const LIGHTING_INTERIOR_PATTERNS = [
  'permanently installed light fixture is inoperable',
  'permanently installed light fixture is not secure to the designed attachment point',
  'attachment point is not stable',
  'permanent lighting fixtures are missing or not functioning',
];

// ----------------------------------------------------------------------------
// Category: Mold - Like Substance
// - Moderate: 5.0/n (elevated moisture, <1 sq ft patches)
// - Life-Threatening: 27.25/n (>9 sq ft patches)
// ----------------------------------------------------------------------------
const MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
];

const MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
];

// ----------------------------------------------------------------------------
// Category: Paint - Potential Lead-Based Paint Hazards - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const PAINT_HAZARD_PATTERNS = [
  'less than 2 square feet per room deteriorated paint',
  'damage to the surface such as holes that expose paint layers',
  'friction on painted surfaces',
];

// ----------------------------------------------------------------------------
// Category: Railings - Guardrail - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const GUARDRAIL_PATTERNS = [
  'guardrail is missing',
  'evidence of prior installation but is now not present or is incomplete',
  'not installed along a walking surface that is more than 30 inches above the floor or grade below',
  'guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height',
  'not securely attached to effectively prevent fall hazards',
];

// ----------------------------------------------------------------------------
// Category: Railings - Handrail
// - Moderate: 27.25/n (missing) - Note: Table shows 27.25/n for "missing"
// - Moderate: 5.0/n (can't be grasped, not continuous, height, movement)
// ----------------------------------------------------------------------------
const HANDRAIL_27_25_PATTERNS = [
  'handrail is missing',
];

const HANDRAIL_MODERATE_PATTERNS = [
  'handrail is deficient if it can\'t be reasonably grasped for support',
  'isn\'t continuous along the full stair flight',
  'falls outside the required height range of 28 to 42 inches',
  'movement in the anchors of the handrail',
  'there is movement in the anchors of the handrail',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Bathtub and Shower
// - Low: 2.20/n (common area inoperable, water fixture, personal hygiene)
// - Moderate: 5.0/n (privacy - hole in door)
// ----------------------------------------------------------------------------
const RESTROOM_BATHTUB_LOW_PATTERNS = [
  'common area bathtub or shower is present, and it is inoperable',
  'not meeting function or purpose, with or without visible damage',
  'standing water is present such that water is unable to drain',
  'common area bathtub or shower water fixture is damaged or inoperable',
  'may not limit the resident\'s ability to maintain personal hygiene',
  'bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene',
  'limits the resident\'s ability to maintain personal hygiene',
];

const RESTROOM_BATHTUB_MODERATE_PATTERNS = [
  'hole in the door and damaged hardware, missing door',
  'resident should be able to use the bathtub or shower without being observed',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Cabinet and Storage - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const RESTROOM_CABINET_PATTERNS = [
  'restroom cabinet doors, drawers, or shelves are missing',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Grab Bar - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const RESTROOM_GRAB_BAR_PATTERNS = [
  'any movement whatever is detected in the grab bar',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Mold - Like Substance
// - Moderate: 5.0/n (elevated moisture, <1 sq ft)
// - Life-Threatening: 27.25/n (>9 sq ft)
// ----------------------------------------------------------------------------
const RESTROOM_MOLD_MODERATE_PATTERNS = [
  'elevated moisture level',
  'peeling paint or wallpaper, a wall that is warped or stained',
  'buckled, cracked, or water-stained ceiling, carpet, or wooden floor',
  'cumulative area of patches is more than 4 square inches and less than 1 square foot',
];

const RESTROOM_MOLD_LIFE_THREATENING_PATTERNS = [
  'cumulative area of patches is more than 9 square foot in a room',
  'cumulative area of patches is more than 9 square feet in a room',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Sink
// - Moderate: 5.0/n (control knobs, missing, separation, drain, damaged)
// - Low: 2.20/n (water directed outside basin)
// ----------------------------------------------------------------------------
const RESTROOM_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'sink component is missing',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'water is not draining from the basin of the sink',
  'slow or clogged drain',
];

const RESTROOM_SINK_LOW_PATTERNS = [
  'when in use, water is directed outside of the basin',
  'water is directed outside of the basin',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Toilet - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const RESTROOM_TOILET_PATTERNS = [
  'toilet is deficient if it\'s damaged or inoperable',
  'toilet is missing',
  'single installed toilet is deficient if it\'s damaged or inoperable',
  'only 1 toilet was installed, and it is missing',
  'hole in the door and damaged hardware, missing door',
  'toilet is deficient if any component is damaged, inoperable, or missing',
  'limits the resident\'s ability to discharge human waste safely',
  'toilet component is deficient if it\'s damaged, inoperable, or missing',
  'toilet is not secured at the base',
];

// ----------------------------------------------------------------------------
// Category: Restroom - Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const RESTROOM_VENTILATION_PATTERNS = [
  'effecting the restroom',
  'exhaust system component is damaged or missing',
  'exhaust fan, inoperable',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category: Sink (Laundry, Garage, or patio)
// - Moderate: 5.0/n (control knobs, missing, separation, drain)
// - Low: 2.20/n (stopper missing/damaged)
// ----------------------------------------------------------------------------
const LAUNDRY_SINK_MODERATE_PATTERNS = [
  'control knobs do not activate or deactivate hot and cold water',
  'sink component is missing',
  'signs of separation at the seams of a sink or vanity is pulling away from the wall',
  'not present or incomplete',
  'water is not draining from the basin of the sink',
];

const LAUNDRY_SINK_LOW_PATTERNS = [
  'sink component is damaged (i.e., stopper missing, damaged or inoperable)',
  'stopper missing, damaged or inoperable',
];

// ----------------------------------------------------------------------------
// Category: Steps and Stairs - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const STEPS_STAIRS_PATTERNS = [
  'instability is detected while walking on the stair',
  'secure accessory treads are not present',
];

// ----------------------------------------------------------------------------
// Category: Structural System - Life-Threatening - 27.25/n
// ----------------------------------------------------------------------------
const STRUCTURAL_SYSTEM_PATTERNS = [
  'significant structural damage that affects occupants\' safety',
];

// ----------------------------------------------------------------------------
// Category: Trash Chute - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const TRASH_CHUTE_PATTERNS = [
  'chute door is damaged',
  'garbage is backing up into the chute',
];

// ----------------------------------------------------------------------------
// Category: Ventilation - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const VENTILATION_PATTERNS = [
  'effecting the room',
  'exhaust system component is damaged',
  'exhaust system component is missing',
  'exhaust fan, inoperable',
  'exhaust system is blocked such that airflow may be restricted',
];

// ----------------------------------------------------------------------------
// Category: Wall - Interior - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const WALL_INTERIOR_PATTERNS = [
  'interior wall component(s) is not functionally adequate',
  'impacts the integrity of the interior wall',
  'does not allow interior wall to provide vertical separation',
  'wall is damaged, and repairs still need to be completed appropriately',
  'loose or detached surface coverings',
  'drywall, plaster, paneling',
];

// ----------------------------------------------------------------------------
// Category: Water Heater
// - Life-Threatening: 27.25/n (vent, gas shutoff valve)
// - Moderate: 5.0/n (not properly installed)
// ----------------------------------------------------------------------------
const WATER_HEATER_LIFE_THREATENING_PATTERNS = [
  'vent is damaged/misaligned/not connected properly',
  'vent is damaged',
  'vent is misaligned',
  'vent is not connected properly',
  'gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required',
  'gas shutoff valve is damaged',
  'gas shutoff valve is missing',
];

const WATER_HEATER_MODERATE_PATTERNS = [
  'not properly installed',
];

// ----------------------------------------------------------------------------
// Category: Window - Moderate - 5.0/n
// ----------------------------------------------------------------------------
const WINDOW_PATTERNS = [
  'only one lock present, and it is damaged, inoperable',
  'window is not functionally adequate',
  'will not stay open without the use of a tool or item',
];

// ============================================================================
// AGGREGATED PATTERN ARRAYS FOR MATCHING
// ============================================================================

// Low severity patterns - 2.20/n
const LOW_DEFICIENCY_PATTERNS = [
  ...CABINET_STORAGE_PATTERNS,
  ...DOOR_ENTRY_LOW_PATTERNS,
  ...DOOR_GENERAL_LOW_PATTERNS,
  ...HVAC_LOW_PATTERNS,
  ...KITCHEN_SINK_LOW_PATTERNS,
  ...RESTROOM_BATHTUB_LOW_PATTERNS,
  ...RESTROOM_SINK_LOW_PATTERNS,
  ...LAUNDRY_SINK_LOW_PATTERNS,
];

// Severe patterns - 13.40/n
const SEVERE_DEFICIENCY_PATTERNS = [
  ...CALL_FOR_AID_SEVERE_PATTERNS,
];

// Special formula patterns - 27.25/(50*n)
const SPECIAL_FORMULA_DEFICIENCY_PATTERNS = [
  ...CALL_FOR_AID_SPECIAL_FORMULA_PATTERNS,
];

// Gas/Oil Leak patterns - 54.50/n
const GAS_LEAK_PATTERNS = [
  ...GAS_OIL_LEAK_PATTERNS,
];

// Life-Threatening patterns - 27.25/n
const LIFE_THREATENING_DEFICIENCY_PATTERNS = [
  ...CARBON_MONOXIDE_ALARM_PATTERNS,
  ...CHIMNEY_PATTERNS,
  ...CLOTHES_DRYER_EXHAUST_PATTERNS,
  ...DOOR_FIRE_LABELED_PATTERNS,
  ...EGRESS_PATTERNS,
  ...ELECTRICAL_CONDUCTOR_PATTERNS,
  ...ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS,
  ...FIRE_EXIT_SIGN_PATTERNS,
  ...FIRE_EXTINGUISHER_PATTERNS,
  ...FLAMMABLE_COMBUSTIBLE_PATTERNS,
  ...SMOKE_ALARM_PATTERNS,
  ...SPRINKLER_ASSEMBLY_PATTERNS,
  ...HVAC_LIFE_THREATENING_PATTERNS,
  ...KITCHEN_MOLD_LIFE_THREATENING_PATTERNS,
  ...MOLD_LIFE_THREATENING_PATTERNS,
  ...GUARDRAIL_PATTERNS,
  ...HANDRAIL_27_25_PATTERNS,
  ...RESTROOM_MOLD_LIFE_THREATENING_PATTERNS,
  ...STRUCTURAL_SYSTEM_PATTERNS,
  ...WATER_HEATER_LIFE_THREATENING_PATTERNS,
];

// Moderate patterns - 5.0/n
const MODERATE_DEFICIENCY_PATTERNS = [
  ...CEILING_PATTERNS,
  ...DOOR_ENTRY_MODERATE_PATTERNS,
  ...DOOR_GENERAL_MODERATE_PATTERNS,
  ...GARAGE_DOOR_PATTERNS,
  ...DRAINAGE_PATTERNS,
  ...ELECTRICAL_PANEL_MODERATE_PATTERNS,
  ...ELEVATOR_PATTERNS,
  ...FLOOR_PATTERNS,
  ...FOUNDATION_PATTERNS,
  ...GRAB_BAR_PATTERNS,
  ...INFESTATION_PATTERNS,
  ...LITTER_PATTERNS,
  ...TRIP_HAZARD_PATTERNS,
  ...KITCHEN_CABINET_PATTERNS,
  ...KITCHEN_COOKING_APPLIANCE_PATTERNS,
  ...KITCHEN_FOOD_PREP_PATTERNS,
  ...KITCHEN_MOLD_MODERATE_PATTERNS,
  ...KITCHEN_REFRIGERATOR_PATTERNS,
  ...KITCHEN_SINK_MODERATE_PATTERNS,
  ...KITCHEN_VENTILATION_PATTERNS,
  ...SEWAGE_LEAK_PATTERNS,
  ...WATER_LEAK_PATTERNS,
  ...LIGHTING_INTERIOR_PATTERNS,
  ...MOLD_MODERATE_PATTERNS,
  ...PAINT_HAZARD_PATTERNS,
  ...HANDRAIL_MODERATE_PATTERNS,
  ...RESTROOM_BATHTUB_MODERATE_PATTERNS,
  ...RESTROOM_CABINET_PATTERNS,
  ...RESTROOM_GRAB_BAR_PATTERNS,
  ...RESTROOM_MOLD_MODERATE_PATTERNS,
  ...RESTROOM_SINK_MODERATE_PATTERNS,
  ...RESTROOM_TOILET_PATTERNS,
  ...RESTROOM_VENTILATION_PATTERNS,
  ...LAUNDRY_SINK_MODERATE_PATTERNS,
  ...STEPS_STAIRS_PATTERNS,
  ...TRASH_CHUTE_PATTERNS,
  ...VENTILATION_PATTERNS,
  ...WALL_INTERIOR_PATTERNS,
  ...WATER_HEATER_MODERATE_PATTERNS,
  ...WINDOW_PATTERNS,
];

const POSSIBLE_SCORE = 25;

/**
 * Get default severity configuration for Inside inspection
 * @param categoryNumber The NSPIRE Inside category number (not used for default, patterns determine severity)
 * @returns Default severity configuration
 */
export function getDefaultInsideSeverityConfig(categoryNumber: number): InsideSeverityConfig {
  // Default to Moderate with formula 5.0/n
  return { severity: 'Moderate', pointsLostFormula: 5.0 };
}

/**
 * Check if deficiency matches Severe patterns (Call-for-Aid pull cord) - 13.40/n
 */
function matchesSevereDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SEVERE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Low severity patterns - 2.20/n
 */
function matchesLowDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LOW_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Life-Threatening patterns - 27.25/n
 */
function matchesLifeThreateningDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return LIFE_THREATENING_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches gas leak patterns - Life-Threatening with 54.50/n
 */
function matchesGasLeakPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return GAS_LEAK_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches Moderate severity patterns - 5.0/n
 */
function matchesModerateDeficiencyPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return MODERATE_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

/**
 * Check if deficiency matches special formula patterns (Call-for-Aid annunciator) - 27.25/(50*n)
 */
function matchesSpecialFormulaPattern(deficiencyDescription: string): boolean {
  const normalizedDesc = deficiencyDescription.toLowerCase();
  return SPECIAL_FORMULA_DEFICIENCY_PATTERNS.some(pattern => normalizedDesc.includes(pattern.toLowerCase()));
}

export function getInsideSeverityConfig(
  categoryNumber: number,
  deficiencyDescription?: string,
  selectedSeverity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
): InsideSeverityConfig {
  // Check deficiency-based overrides first (they take precedence)
  // All patterns apply to ALL items regardless of category number
  if (deficiencyDescription) {
    // Check for gas leak patterns - Life-Threatening with 54.50/n (highest priority)
    if (matchesGasLeakPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 54.50 };
    }

    // Check for special formula patterns (Call-for-Aid annunciator) - Life-Threatening with 27.25/(50*n)
    if (matchesSpecialFormulaPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 27.25, specialFormula: 'divide_50n' };
    }

    // Check for Severe deficiency patterns (Call-for-Aid pull cord) - 13.40/n
    if (matchesSevereDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Severe', pointsLostFormula: 13.40 };
    }

    // Check for Life-Threatening patterns - 27.25/n
    if (matchesLifeThreateningDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Life-Threatening', pointsLostFormula: 27.25 };
    }

    // Check for Moderate patterns - 5.0/n
    if (matchesModerateDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Moderate', pointsLostFormula: 5.0 };
    }

    // Check for Low severity patterns - 2.20/n
    if (matchesLowDeficiencyPattern(deficiencyDescription)) {
      return { severity: 'Low', pointsLostFormula: 2.20 };
    }
  }

  // If no pattern matched but we have a selected severity, use it with appropriate formula
  if (selectedSeverity) {
    switch (selectedSeverity) {
      case 'Life-Threatening':
        return { severity: 'Life-Threatening', pointsLostFormula: 27.25 };
      case 'Severe':
        return { severity: 'Severe', pointsLostFormula: 13.40 };
      case 'Low':
        return { severity: 'Low', pointsLostFormula: 2.20 };
      case 'Moderate':
      default:
        return { severity: 'Moderate', pointsLostFormula: 5.0 };
    }
  }

  // Fall back to default configuration
  return getDefaultInsideSeverityConfig(categoryNumber);
}

export interface InsideScoringInput {
  categoryNumber: number;       // NSPIRE Inside category number
  totalSamples: number;         // n - number of sample units
  deficiencyDescription?: string; // Optional deficiency description for override checking
  deficiencyCount?: number;     // Number of deficiencies (default: 1)
  severity?: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'; // Optional severity from deficiency selection
}

export interface InsideScoringResult {
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
 * Calculate scoring for Inside inspection
 * 
 * Formulas:
 *   Points Lost (Raw) = formulaNumerator (base value)
 *   Points Lost = formulaNumerator / n (or special formula like 27.25/(50*n))
 *   Max Points Lost = Points Lost / n
 *   Score = Possible Score (25) − Max Points Lost
 * 
 * @param input Scoring input with category number, samples, and optional deficiency description
 * @returns Complete scoring result
 */
export function calculateInsideScore(input: InsideScoringInput): InsideScoringResult {
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
  const severityConfig = getInsideSeverityConfig(categoryNumber, deficiencyDescription, selectedSeverity);

  // Check if deficiency override was applied
  const categoryOnlyConfig = getDefaultInsideSeverityConfig(categoryNumber);
  const isDeficiencyOverride = deficiencyDescription !== undefined &&
    (severityConfig.severity !== categoryOnlyConfig.severity ||
      severityConfig.pointsLostFormula !== categoryOnlyConfig.pointsLostFormula);

  // Pts Lost (Raw) = the base formula numerator
  const pointsLostRaw = severityConfig.pointsLostFormula;

  // Calculate Max Points Lost = formula / n
  const maxPtsLost = severityConfig.pointsLostFormula / n;

  // Pts Lost = Max Pts Lost (they are the same)
  const pointsLost = maxPtsLost;

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
export function extractInsideCategoryNumber(itemId?: string, itemName?: string): number {
  // Try to get from itemId first
  if (itemId) {
    const num = parseInt(itemId, 10);
    if (!isNaN(num) && num >= 1) {
      return num;
    }
  }

  // Try to extract from item name (e.g., "1. Call for Aid")
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
export const INSIDE_DEFICIENCY_PATTERNS = {
  SEVERE: SEVERE_DEFICIENCY_PATTERNS,
  LOW: LOW_DEFICIENCY_PATTERNS,
  LIFE_THREATENING: LIFE_THREATENING_DEFICIENCY_PATTERNS,
  MODERATE: MODERATE_DEFICIENCY_PATTERNS,
  GAS_LEAK: GAS_LEAK_PATTERNS,
  SPECIAL_FORMULA: SPECIAL_FORMULA_DEFICIENCY_PATTERNS,
  // Category-specific patterns for detailed access
  CABINET_STORAGE: CABINET_STORAGE_PATTERNS,
  CALL_FOR_AID_SEVERE: CALL_FOR_AID_SEVERE_PATTERNS,
  CALL_FOR_AID_SPECIAL: CALL_FOR_AID_SPECIAL_FORMULA_PATTERNS,
  CARBON_MONOXIDE_ALARM: CARBON_MONOXIDE_ALARM_PATTERNS,
  CEILING: CEILING_PATTERNS,
  CHIMNEY: CHIMNEY_PATTERNS,
  CLOTHES_DRYER_EXHAUST: CLOTHES_DRYER_EXHAUST_PATTERNS,
  DOOR_ENTRY_LOW: DOOR_ENTRY_LOW_PATTERNS,
  DOOR_ENTRY_MODERATE: DOOR_ENTRY_MODERATE_PATTERNS,
  DOOR_FIRE_LABELED: DOOR_FIRE_LABELED_PATTERNS,
  DOOR_GENERAL_LOW: DOOR_GENERAL_LOW_PATTERNS,
  DOOR_GENERAL_MODERATE: DOOR_GENERAL_MODERATE_PATTERNS,
  GARAGE_DOOR: GARAGE_DOOR_PATTERNS,
  DRAINAGE: DRAINAGE_PATTERNS,
  EGRESS: EGRESS_PATTERNS,
  ELECTRICAL_CONDUCTOR: ELECTRICAL_CONDUCTOR_PATTERNS,
  ELECTRICAL_PANEL_LIFE_THREATENING: ELECTRICAL_PANEL_LIFE_THREATENING_PATTERNS,
  ELECTRICAL_PANEL_MODERATE: ELECTRICAL_PANEL_MODERATE_PATTERNS,
  ELEVATOR: ELEVATOR_PATTERNS,
  FIRE_EXIT_SIGN: FIRE_EXIT_SIGN_PATTERNS,
  FIRE_EXTINGUISHER: FIRE_EXTINGUISHER_PATTERNS,
  FLAMMABLE_COMBUSTIBLE: FLAMMABLE_COMBUSTIBLE_PATTERNS,
  SMOKE_ALARM: SMOKE_ALARM_PATTERNS,
  SPRINKLER_ASSEMBLY: SPRINKLER_ASSEMBLY_PATTERNS,
  FLOOR: FLOOR_PATTERNS,
  FOUNDATION: FOUNDATION_PATTERNS,
  GRAB_BAR: GRAB_BAR_PATTERNS,
  INFESTATION: INFESTATION_PATTERNS,
  LITTER: LITTER_PATTERNS,
  TRIP_HAZARD: TRIP_HAZARD_PATTERNS,
  HVAC_LOW: HVAC_LOW_PATTERNS,
  HVAC_LIFE_THREATENING: HVAC_LIFE_THREATENING_PATTERNS,
  KITCHEN_CABINET: KITCHEN_CABINET_PATTERNS,
  KITCHEN_COOKING_APPLIANCE: KITCHEN_COOKING_APPLIANCE_PATTERNS,
  KITCHEN_FOOD_PREP: KITCHEN_FOOD_PREP_PATTERNS,
  KITCHEN_MOLD_MODERATE: KITCHEN_MOLD_MODERATE_PATTERNS,
  KITCHEN_MOLD_LIFE_THREATENING: KITCHEN_MOLD_LIFE_THREATENING_PATTERNS,
  KITCHEN_REFRIGERATOR: KITCHEN_REFRIGERATOR_PATTERNS,
  KITCHEN_SINK_MODERATE: KITCHEN_SINK_MODERATE_PATTERNS,
  KITCHEN_SINK_LOW: KITCHEN_SINK_LOW_PATTERNS,
  KITCHEN_VENTILATION: KITCHEN_VENTILATION_PATTERNS,
  GAS_OIL_LEAK: GAS_OIL_LEAK_PATTERNS,
  SEWAGE_LEAK: SEWAGE_LEAK_PATTERNS,
  WATER_LEAK: WATER_LEAK_PATTERNS,
  LIGHTING_INTERIOR: LIGHTING_INTERIOR_PATTERNS,
  MOLD_MODERATE: MOLD_MODERATE_PATTERNS,
  MOLD_LIFE_THREATENING: MOLD_LIFE_THREATENING_PATTERNS,
  PAINT_HAZARD: PAINT_HAZARD_PATTERNS,
  GUARDRAIL: GUARDRAIL_PATTERNS,
  HANDRAIL_27_25: HANDRAIL_27_25_PATTERNS,
  HANDRAIL_MODERATE: HANDRAIL_MODERATE_PATTERNS,
  RESTROOM_BATHTUB_LOW: RESTROOM_BATHTUB_LOW_PATTERNS,
  RESTROOM_BATHTUB_MODERATE: RESTROOM_BATHTUB_MODERATE_PATTERNS,
  RESTROOM_CABINET: RESTROOM_CABINET_PATTERNS,
  RESTROOM_GRAB_BAR: RESTROOM_GRAB_BAR_PATTERNS,
  RESTROOM_MOLD_MODERATE: RESTROOM_MOLD_MODERATE_PATTERNS,
  RESTROOM_MOLD_LIFE_THREATENING: RESTROOM_MOLD_LIFE_THREATENING_PATTERNS,
  RESTROOM_SINK_MODERATE: RESTROOM_SINK_MODERATE_PATTERNS,
  RESTROOM_SINK_LOW: RESTROOM_SINK_LOW_PATTERNS,
  RESTROOM_TOILET: RESTROOM_TOILET_PATTERNS,
  RESTROOM_VENTILATION: RESTROOM_VENTILATION_PATTERNS,
  LAUNDRY_SINK_MODERATE: LAUNDRY_SINK_MODERATE_PATTERNS,
  LAUNDRY_SINK_LOW: LAUNDRY_SINK_LOW_PATTERNS,
  STEPS_STAIRS: STEPS_STAIRS_PATTERNS,
  STRUCTURAL_SYSTEM: STRUCTURAL_SYSTEM_PATTERNS,
  TRASH_CHUTE: TRASH_CHUTE_PATTERNS,
  VENTILATION: VENTILATION_PATTERNS,
  WALL_INTERIOR: WALL_INTERIOR_PATTERNS,
  WATER_HEATER_LIFE_THREATENING: WATER_HEATER_LIFE_THREATENING_PATTERNS,
  WATER_HEATER_MODERATE: WATER_HEATER_MODERATE_PATTERNS,
  WINDOW: WINDOW_PATTERNS,
};
