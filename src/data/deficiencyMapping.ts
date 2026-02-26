// Comprehensive NSPIRE Deficiency Mapping for All 26 Categories - OUTSIDE

// Import Unit deficiencies for Unit inspections (used for Inside section - 35 categories)
import {
  getUnitDeficienciesByCategory,
  getUnitItemsForCategory,
  ALL_UNIT_DEFICIENCIES,
  UNIT_CATEGORIES,
  UnitItemDeficiencies,
  UnitDeficiencyOption,
  hasInsideSubcategories,
  getInsideCategorySubcategories,
  getInsideSubcategoryDeficiencies as getUnitSubcategoryDeficiencies,
  getInsideSubcategoryDeficienciesByParent,
} from './unitDeficiencyMapping';

// Import Outside deficiencies for Outside inspections (correct NSPIRE values)
import {
  getOutsideDeficienciesByCategory,
  ALL_OUTSIDE_DEFICIENCIES,
  ELECTRICAL_SERVICE_PANEL_DATA,
  SITE_DRAINAGE_DATA,
  DRAIN_DRAIN_DATA,
} from './outsideDeficiencyMapping';

// Import Inside deficiencies for Inside inspections (Unit locations use this - 32 categories)
import {
  getInsideDeficienciesForItem,
  getAllInsideDeficienciesForItem,
  getInsideSubcategories,
  getInsideSubcategoryDeficiencies,
  ALL_INSIDE_CATEGORIES,
} from './insideDeficiencyMapping';

// Re-export Unit functions and types
export {
  getUnitDeficienciesByCategory,
  getUnitItemsForCategory,
  ALL_UNIT_DEFICIENCIES,
  UNIT_CATEGORIES,
};
export type { UnitItemDeficiencies, UnitDeficiencyOption };

// ==========================================
// UNIT LOCATION DETECTION
// Unit locations are specific rooms within a dwelling unit
// ==========================================
const UNIT_LOCATION_NAMES = [
  'unit',
  'attic/loft',
  'basement',
  'bathroom1',
  'bathroom2',
  'bathroom3',
  'bedroom 1',
  'bedroom 2',
  'bedroom 3',
  'bedroom 4',
  'bedroom 5',
  'closet',
  'dinning area',
  'entryway(front/rear',
  'garage',
  'hallway/stairs',
  'home office/study',
  'kitchen',
  'laundry room',
  'living room',
  'location',
  'mechanical room',
  'office',
  'other',
  'patio/porch/balcony',
  'storage room',
];

/**
 * Check if a location is a unit location (specific room like Basement, Bedroom, etc.)
 * NOT "Outside" and NOT "Inside" - these are specific room locations
 */
export function isUnitLocation(location: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase().trim();

  // Outside and Inside are NOT unit locations
  if (loc === 'outside' || loc === 'inside') {
    return false;
  }

  // Check if it matches any unit location name
  return UNIT_LOCATION_NAMES.some(unitLoc =>
    loc === unitLoc ||
    loc.includes(unitLoc) ||
    unitLoc.includes(loc)
  );
}

export interface DeficiencyOption {
  id: string;
  name: string;
  detail: string;
  criteria: string;
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  repairBy: string;
  points: string;
  code?: string;
  codeReference?: string;
}

export interface ItemDeficiencies {
  itemName: string;
  deficiencies: DeficiencyOption[];
}

// 1. Address and Signage
export const ADDRESS_SIGNAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Address and Signage',
  deficiencies: [
    {
      id: 'addr_1',
      name: 'Address or building identification codes are broken, illegible, or not visible.',
      detail: 'Damaged or vandalized or deteriorated, NOT readable from a reasonable distance.',
      criteria: 'For example, 20 feet distance.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ADDR-01',
      codeReference: `🔍 1. Identification & Applicability
• IRC §R319.1 – Address identification for emergency response
• Includes: Building number and street name, Unit identifiers (if applicable)
• Monument signs, wall-mounted signs, post-mounted signs
• NSPIRE Scope: Evaluates visibility, legibility, physical condition, and mounting of signage

🧱 2. Structural Integrity
Inspect for physical damage or missing components:
• Cracks, holes, rust, fading, graffiti, missing letters/numbers, loose mounting

🔧 3. Visibility & Legibility
• Distance check: Confirm address is readable from street or fire lane
• Contrast check: Ensure text contrasts with background (e.g., black on white)
• Obstruction check: Remove vegetation, debris, or objects blocking signage
• Font size: Minimum 4″ high numerals for emergency visibility

🧼 4. Sanitation & Environmental Safety
• Inspect for: mold, bird droppings, or pest nests on or around signage
• Check for graffiti, fading, or weather damage
• IBU Overlay: May require washable surfaces, sealed enclosures, or pest-resistant materials

🧠 5. Accessibility & Local Requirements
• Height & placement: Signage must be mounted at a visible height (typically 4–6 ft AFF)
• Lighting: Required if signage is not visible at night
• Multilingual or tactile signage: May be required in accessible buildings
• IBU Overlay: May require visual contrast, ADA-compliant font, or audible identifiers`
    }
  ]
};

// 2. Chimney
export const CHIMNEY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Chimney',
  deficiencies: [
    {
      id: 'chim_1',
      name: 'A vertical or near vertical passageway connected to a fireplace or wood-burning appliance.',
      detail: 'A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete (i.e., evidence of a previously installed component that is now not present) such that it may not safely contain fire and convey smoke and combustion gases to the exterior. OR A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
      criteria: 'A visually accessible, observed chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '49.60/n',
      code: 'CHIM-01',
      codeReference: `🔍 Step 1: Identify Chimney Type and Applicability
• Locate all visually accessible chimneys connected to: Fireplaces, Wood-burning appliances, Fuel-burning heating systems (if vented via chimney)

🧱 Step 2: Assess Structural Integrity
Inspect for signs of damage, instability, or missing components:
• Cracks, spalling, leaning, loose bricks, missing caps, deteriorated flashing
• IRC §R1003.9 requires chimneys to extend ≥2′ above any part of the building within 10′

🔧 Step 3: Evaluate Functional Adequacy
• Flue continuity: Check for visible gaps, misalignment, or obstructions
• Smoke path: Ensure the chimney is not blocked or collapsed
• Cap integrity: Must prevent rain, debris, and pests from entering

🧼 Step 4: Check Sanitation & Environmental Safety
• Look for:
• Creosote stains, soot, or bird nests at the flue opening
• Water damage, mold, or pest activity around the chimney base or flashing
• IBU Overlay: May require pest-proof caps, sealed masonry, or corrosion-resistant flashing

🧠 Step 5: Verify Accessibility & Local Compliance
• Inspection access: Chimney must be observable from ground or safe vantage point
• Height compliance: Confirm chimney meets IRC and CBC elevation standards
• IBU Overlay: May require seismic anchorage, fire-rated clearances, or compliant signage if chimney serves shared amenities`
    },
    {
      id: 'chim_2',
      name: 'Chimney exhibits signs of structural failure.',
      detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
      criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '49.60/n',
      code: 'CHIM-02',
      codeReference: `🔍 Step 1: Identify Chimney Type and Applicability
• Locate all visually accessible chimneys connected to: Fireplaces, Wood-burning appliances, Fuel-burning heating systems (if vented via chimney)

🧱 Step 2: Assess Structural Integrity
Inspect for signs of damage, instability, or missing components:
• Cracks, spalling, leaning, loose bricks, missing caps, deteriorated flashing
• IRC §R1003.9 requires chimneys to extend ≥2′ above any part of the building within 10′

🔧 Step 3: Evaluate Functional Adequacy
• Flue continuity: Check for visible gaps, misalignment, or obstructions
• Smoke path: Ensure the chimney is not blocked or collapsed
• Cap integrity: Must prevent rain, debris, and pests from entering

🧼 Step 4: Check Sanitation & Environmental Safety
• Look for:
• Creosote stains, soot, or bird nests at the flue opening
• Water damage, mold, or pest activity around the chimney base or flashing
• IBU Overlay: May require pest-proof caps, sealed masonry, or corrosion-resistant flashing

🧠 Step 5: Verify Accessibility & Local Compliance
• Inspection access: Chimney must be observable from ground or safe vantage point
• Height compliance: Confirm chimney meets IRC and CBC elevation standards
• IBU Overlay: May require seismic anchorage, fire-rated clearances, or compliant signage if chimney serves shared amenities`
    }
  ]
};

// 3. Clothes Dryer Exhaust Ventilation
export const DRYER_VENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Clothes Dryer Exhaust Ventilation',
  deficiencies: [
    {
      id: 'dryer_1',
      name: 'Electrical dryer exhaust has restricted airflow.',
      detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '49.60/n',
      code: 'DRYER-01',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• Find the dryer exhaust termination point on the building's exterior wall
• Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated

🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
• Damaged louvers, crushed duct, disconnected sections, missing caps
• IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements

🔧 Step 3: Evaluate Functional Adequacy
• Airflow check: Run the dryer and feel for warm air discharge at the vent
• Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest nests around the vent opening
• Water intrusion or staining on the wall below the vent
• IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations

🧠 Step 5: Verify Accessibility & Local Compliance
• Height & reachability: Vent must be accessible for cleaning and inspection
• Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• IBU Overlay: May require compliant access paths or signage in shared laundry areas`
    },
    {
      id: 'dryer_2',
      name: 'Exterior dryer vent cover, cap, or a component thereof is missing.',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'DRYER-02',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• Find the dryer exhaust termination point on the building's exterior wall
• Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated

🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
• Damaged louvers, crushed duct, disconnected sections, missing caps
• IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements

🔧 Step 3: Evaluate Functional Adequacy
• Airflow check: Run the dryer and feel for warm air discharge at the vent
• Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest nests around the vent opening
• Water intrusion or staining on the wall below the vent
• IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations

🧠 Step 5: Verify Accessibility & Local Compliance
• Height & reachability: Vent must be accessible for cleaning and inspection
• Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• IBU Overlay: May require compliant access paths or signage in shared laundry areas`
    },
    {
      id: 'dryer_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '49.60/n',
      code: 'DRYER-03',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• Find the dryer exhaust termination point on the building's exterior wall
• Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated

🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
• Damaged louvers, crushed duct, disconnected sections, missing caps
• IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements

🔧 Step 3: Evaluate Functional Adequacy
• Airflow check: Run the dryer and feel for warm air discharge at the vent
• Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest nests around the vent opening
• Water intrusion or staining on the wall below the vent
• IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations

🧠 Step 5: Verify Accessibility & Local Compliance
• Height & reachability: Vent must be accessible for cleaning and inspection
• Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• IBU Overlay: May require compliant access paths or signage in shared laundry areas`
    }
  ]
};

// 4. Door (Parent Category for Outside)
export const DOOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: []  // Empty - use subcategories instead
};

// 4a. Door - General Standard (OUTSIDE subcategory)
export const DOOR_GENERAL_STANDARD_OUTSIDE: ItemDeficiencies = {
  itemName: 'Door - General Standard',
  deficiencies: [
    {
      id: 'door_gen_std_1',
      name: 'An exterior door component is damaged, inoperable, or missing.',
      detail: 'An exterior door component is damaged, inoperable, or missing.',
      criteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-GEN-STD-01',
      codeReference: `🚪 Exterior Door – General (Non-Entry) Visual Assessment
Codes Referenced:
• IRC (2021) §R311.2 – Means of egress and door operability
• NSPIRE Standard v2.1 – Door: General HUD Standard
• IBU overlays – CBC Chapters 10, 11B, and 12; Ventura County Habitability Ordinance

🔍 Step 1: Identify Applicable Doors
• Locate exterior doors that:
• Do not serve as primary unit entries
• Are not fire-rated
• Provide access to storage closets, mechanical rooms, laundry enclosures, or utility spaces

🧱 Step 2: Assess Structural Integrity
Inspect for physical damage or missing components:
• Door panel, frame, hinges, threshold, hardware

🔧 Step 3: Evaluate Operability & Security
• Open/close test: Door must open and close smoothly without obstruction
• Latch test: Door must latch securely and remain closed when shut
• Lock test: Confirm locking mechanism functions properly (if applicable)

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest droppings around the door frame and threshold
• Water intrusion or staining on adjacent walls or flooring
• IBU Overlay: May require sealed thresholds, pest-proof sweeps, and moisture-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Cross-reference: Note IRC §R311.2, NSPIRE deficiency ID, and IBU overlay`
    }
  ]
};

// 4b. Garage Door (OUTSIDE subcategory)
export const GARAGE_DOOR_OUTSIDE: ItemDeficiencies = {
  itemName: 'Garage Door',
  deficiencies: [
    {
      id: 'garage_out_1',
      name: 'Garage door does not open, close, or remains closed.',
      detail: 'Garage door does not open, close, or remains closed.',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GARAGE-OUT-01',
      codeReference: `🔍 Step 1: Identify Garage Door Type and Applicability
• Locate all exterior garage doors used for:
• Resident or staff vehicle access
• Storage or maintenance enclosures
• Confirm door is mechanically operable, not sealed or decorative
• Note whether door is manual or automatic, and whether it serves shared or private use

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
• Door panel, Track & rollers, Spring and cables, Frame and mounting, wind resistance label
• IRC requires garage doors to meet wind load and structural performance standards (§R612.13)

🔧 Step 3: Evaluate Operability & Safety
• Open/close test: Door must operate smoothly without excessive force
• Auto-reverse test (if motorized): Door must reverse when obstructed
• Manual override: Confirm emergency release is accessible and functional

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest droppings around the door base and tracks
• Water intrusion or staining on adjacent walls or flooring
• IBU Overlay: May require sealed thresholds, pest-proof sweeps, and corrosion-resistant hardware

🧠 Step 5: Verify Accessibility & Local Compliance
• Clearance: Door must provide unobstructed access for vehicles and mobility devices
• Control height: Wall-mounted openers must be ≤48″ AFF
• Signage: Shared garage areas may require tactile or multilingual signage
• IBU Overlay: May require ADA-compliant access paths, visual contrast, or audible alerts`
    },
    {
      id: 'garage_out_2',
      name: 'Garage door has a hole.',
      detail: 'Garage door has a hole.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GARAGE-OUT-02',
      codeReference: `🔍 Step 1: Identify Garage Door Type and Applicability
• Locate all exterior garage doors used for:
• Resident or staff vehicle access
• Storage or maintenance enclosures
• Confirm door is mechanically operable, not sealed or decorative
• Note whether door is manual or automatic, and whether it serves shared or private use

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
• Door panel, Track & rollers, Spring and cables, Frame and mounting, wind resistance label
• IRC requires garage doors to meet wind load and structural performance standards (§R612.13)

🔧 Step 3: Evaluate Operability & Safety
• Open/close test: Door must operate smoothly without excessive force
• Auto-reverse test (if motorized): Door must reverse when obstructed
• Manual override: Confirm emergency release is accessible and functional

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest droppings around the door base and tracks
• Water intrusion or staining on adjacent walls or flooring
• IBU Overlay: May require sealed thresholds, pest-proof sweeps, and corrosion-resistant hardware

🧠 Step 5: Verify Accessibility & Local Compliance
• Clearance: Door must provide unobstructed access for vehicles and mobility devices
• Control height: Wall-mounted openers must be ≤48″ AFF
• Signage: Shared garage areas may require tactile or multilingual signage
• IBU Overlay: May require ADA-compliant access paths, visual contrast, or audible alerts`
    }
  ]
};

// Door Subcategories for Outside
export const DOOR_SUBCATEGORIES_OUTSIDE = [
  { id: 'door_gen_std', name: 'Door - General Standard' },
  { id: 'garage_door', name: 'Garage Door' }
];

// ==========================================
// 5. DRAIN - with Subcategories
// ==========================================
export const DRAIN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: []  // Empty - use subcategories
};

// 5a. Drain subcategory
export const DRAIN_DRAIN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: [
    {
      id: 'drain_1',
      name: 'Drain is fully clogged.',
      detail: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      criteria: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRAIN-01',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• Identify all surface and subsurface site drains near:
• Building foundations
• Walkways, patios, driveways, and parking areas
• Retention basins, culverts, French drains, or curbing systems
• Confirm drains are intended to redirect water away from structures and pedestrian paths

🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, missing components, or unsafe conditions:
• Drain cover/grate, Drain body, Surrounding surface, Foundation exposure

🔧 Step 3: Evaluate Functional Adequacy
• Water flow test (if safe): Pour water near the drain and observe the flow direction
• Standing water check: Look for pooling above or near the drain inlet
• Obstruction check: Confirm drain is free of debris, sediment, or vegetation

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, algae, or pest nests in or around the drain
• Odors or signs of sewage backup
• IBU Overlay: May require pest-proof grates, sealed joints, and stormwater separation from sanitary systems

🧠 Step 5: Verify Accessibility & Local Compliance
• Cover security: Grates must be flush and secured to prevent trip hazards
• Pathway clearance: Drains must not obstruct accessible routes or egress paths
• IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways`
    }
  ]
};

// 5b. Site Drainage subcategory
export const SITE_DRAINAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Site Drainage',
  deficiencies: [
    {
      id: 'site_drain_1',
      name: 'Erosion is present.',
      detail: 'Exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
      criteria: 'Exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SITE-DRAIN-01',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• 	Identify all surface and subsurface site drains near:
• 	Building foundations
• 	Walkways, patios, driveways, and parking areas
• 	Retention basins, culverts, French drains, or curbing systems
• 	Confirm drains are intended to redirect water away from structures and pedestrian paths
🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, missing components, or unsafe conditions:
Drain cover/grate, Drain body, Surrounding surface, and Foundation exposure
🔧 Step 3: Evaluate Functional Adequacy
• 	Water flow test (if safe): Pour water near the drain and observe the flow direction
• 	Standing water check: Look for pooling above or near the drain inlet
• 	Obstruction check: Confirm drain is free of debris, sediment, or vegetation
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests in or around the drain
• 	Odors or signs of sewage backup
• 	IBU Overlay: May require pest-proof grates, sealed joints, and stormwater separation from sanitary systems
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Cover security: Grates must be flush and secured to prevent trip hazards
• 	Pathway clearance: Drains must not obstruct accessible routes or egress paths
• 	IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways`
    },
    {
      id: 'site_drain_2',
      name: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      detail: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SITE-DRAIN-02',
      codeReference: `🔍 Same inspection protocol as DRAIN-OUT-01 with focus on:
• Missing or loose grates
• Trip hazards from raised or damaged grates
• Safety concerns at collection points`
    },
    {
      id: 'site_drain_3',
      name: 'Water runoff is unable to flow through the site drainage system.',
      detail: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'SITE-DRAIN-03',
      codeReference: `🔍 Same inspection protocol as DRAIN-OUT-01 with focus on:
• Blocked outflow pipes
• Standing water at drainage entrance points
• Evidence of poor drainage during rain events`
    }
  ]
};

export const DRAIN_SUBCATEGORIES_OUTSIDE = [
  { id: 'drain', name: 'Drain' },
  { id: 'site_drainage', name: 'Site Drainage' }
];

// ==========================================
// 7. ELECTRICAL - with Subcategories
// ==========================================
export const ELECTRICAL_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: []  // Empty - use subcategories
};

// 7a. Electrical - Conductor, Outlet, and Switch (3 deficiency details)
export const ELECTRICAL_CONDUCTOR_OUTLET_SWITCH: ItemDeficiencies = {
  itemName: 'Electrical - Conductor, Outlet, and Switch',
  deficiencies: [
    {
      id: 'elec_cos_1',
      name: 'Exposed electrical conductor.',
      detail: 'Exposed wiring, open ports, or missing covers present.',
      criteria: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there\'s an opening or gap larger than 1/2 inch.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'ELEC-COS-01',
      codeReference: `🔍 Step 1: Identify Exterior Electrical Components
• Locate all electrical outlets, switches, and exposed conductors on:
• Exterior walls, patios, balconies, garages, and utility enclosures
• Exterior Common areas such as laundry rooms, storage closets, and maintenance zones
• Confirm components are permanently installed and accessible for inspection

🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or improper installation:
• Outlet/switch cover, Electrical box, Conductors/wiring, GFCI protection

🔧 Step 3: Test Operability & Safety
• Outlet test: Use a UL-listed outlet tester to verify:
• Proper wiring and grounding
• Switch test: Toggle each switch to confirm it controls connected lighting or equipment

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, corrosion, or pest activity around boxes and conduit
• Water intrusion or staining near electrical components
• IBU Overlay: May require weatherproof covers, sealed conduit, and pest-resistant enclosures

🧠 Step 5: Verify Accessibility & Local Compliance
• Mounting height: Switches and outlets must be reachable (≤48″ AFF for ADA compliance)
• Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• Labeling: Disconnects and breakers must be clearly marked
• IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas
• IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors`
    },
    {
      id: 'elec_cos_2',
      name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-COS-02',
      codeReference: `🔍 Step 1: Identify Exterior Electrical Components
• 	Locate all electrical outlets, switches, and exposed conductors on:
• 	Exterior walls, patios, balconies, garages, and utility enclosures
• 	Exterior Common areas such as laundry rooms, storage closets, and maintenance zones
• 	Confirm components are permanently installed and accessible for inspection
🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or improper installation:
Outlet/switch cover, Electrical box, Conductors/wiring, GFCI protection
🔧 Step 3: Test Operability & Safety
• 	Outlet test: Use a UL-listed outlet tester to verify:
• 	Proper wiring and grounding
• 	Switch test: Toggle each switch to confirm it controls connected lighting or equipment
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, corrosion, or pest activity around boxes and conduit
• 	Water intrusion or staining near electrical components
• 	IBU Overlay: May require weatherproof covers, sealed conduit, and pest-resistant enclosures
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Mounting height: Switches and outlets must be reachable (≤48″ AFF for ADA compliance)
• 	Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• 	Labeling: Disconnects and breakers must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas
• 	IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors`
    },
    {
      id: 'elec_cos_3',
      name: 'Electrical service panel is not reasonably accessible.',
      detail: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-COS-03',
      codeReference: `🔍 Step 1: Identify Exterior Electrical Components
• 	Locate all electrical outlets, switches, and exposed conductors on:
• 	Exterior walls, patios, balconies, garages, and utility enclosures
• 	Exterior Common areas such as laundry rooms, storage closets, and maintenance zones
• 	Confirm components are permanently installed and accessible for inspection
🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or improper installation:
Outlet/switch cover, Electrical box, Conductors/wiring, GFCI protection
🔧 Step 3: Test Operability & Safety
• 	Outlet test: Use a UL-listed outlet tester to verify:
• 	Proper wiring and grounding
• 	Switch test: Toggle each switch to confirm it controls connected lighting or equipment
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, corrosion, or pest activity around boxes and conduit
• 	Water intrusion or staining near electrical components
• 	IBU Overlay: May require weatherproof covers, sealed conduit, and pest-resistant enclosures
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Mounting height: Switches and outlets must be reachable (≤48″ AFF for ADA compliance)
• 	Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• 	Labeling: Disconnects and breakers must be clearly marked
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas
• 	IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors`
    }
  ]
};

// 7b. The AFCI outlet or AFCI breaker does not reset (1 deficiency detail)
export const ELECTRICAL_AFCI_OUTLET: ItemDeficiencies = {
  itemName: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered an exposed conductor.',
  deficiencies: [
    {
      id: 'elec_afci_1',
      name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-AFCI-01',
      codeReference: `🔍 Step 1: Identify Applicable Devices
• Locate all exterior electrical outlets and breakers that:
• Are installed in damp or wet locations (e.g., patios, garages, balconies, utility enclosures)
• Are within 6 feet of a water source
• Are part of lighting, HVAC, or appliance circuits requiring AFCI or GFCI protection
• Confirm whether protection is provided via:
• GFCI outlet or GFCI breaker
• AFCI outlet or AFCI breaker

🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or missing components:
• Outlet/breaker faceplate, Test/reset buttons, Wiring/conductors, Weatherproof cover

🔧 Step 3: Perform Functional Testing
• Test GFCI outlet or breaker: Press TEST button → confirm power interruption
• Press RESET button → confirm restoration
• Test AFCI outlet or breaker: Press TEST button → confirm arc fault trip
• Reset manually or via panel
• Use a UL-listed circuit tester if buttons are inaccessible or unclear

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Corrosion, mold, or pest activity around outlet or panel
• Water intrusion or staining near electrical enclosures
• IBU Overlay: May require sealed conduit, pest-proof boxes, and corrosion-resistant hardware

🧠 Step 5: Verify Accessibility & Local Compliance
• Mounting height: ≤48″ AFF for accessibility compliance
• Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• Labeling: Breakers must be clearly marked for AFCI/GFCI protection
• IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas`
    }
  ]
};

// 7c. Unprotected outlet within six feet of water source (1 deficiency detail)
export const ELECTRICAL_UNPROTECTED_OUTLET: ItemDeficiencies = {
  itemName: 'Unprotected outlet is present within six feet of a water source, including a water heater or a laundry area when not in use.',
  deficiencies: [
    {
      id: 'elec_unprotected_1',
      name: 'An unprotected outlet is present within six feet of a water source.',
      detail: 'An unprotected outlet is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) that is located in the same room, and outlet is not GFCI protected.',
      criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet designed for major appliances, when in use, is not evaluated under this category.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-UNPROT-01',
      codeReference: `🔍 Step 1: Identify Applicable Devices
• 	Locate all exterior electrical outlets and breakers that:
• 	Are installed in damp or wet locations (e.g., patios, garages, balconies, utility enclosures)
• 	Are within 6 feet of a water source
• 	Are part of lighting, HVAC, or appliance circuits requiring AFCI or GFCI protection
• 	Confirm whether protection is provided via:
• 	GFCI outlet or GFCI breaker
• 	AFCI outlet or AFCI breaker
🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or missing components:
Outlet/breaker faceplate, Test/reset buttons, Wiring/conductors, Weatherproof cover
🔧 Step 3: Perform Functional Testing
• 	Test GFCI outlet or breaker: Press TEST button → confirm power interruption
• 	Press RESET button → confirm restoration
• 	Test AFCI outlet or breaker: Press TEST button → confirm arc fault trip
• 	Reset manually or via panel
• 	Use a UL-listed circuit tester if buttons are inaccessible or unclear
• 	NSPIRE Deficiency 3: Missing GFCI protection within 6 ft of water source = Severe
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Corrosion, mold, or pest activity around outlet or panel
• 	Water intrusion or staining near electrical enclosures
• 	IBU Overlay: May require sealed conduit, pest-proof boxes, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Mounting height: ≤48″ AFF for accessibility compliance
• 	Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• 	Labeling: Breakers must be clearly marked for AFCI/GFCI protection
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas`
    }
  ]
};

// 7d. GFCI outlet or GFCI breaker inoperable (1 deficiency detail)
export const ELECTRICAL_GFCI_OUTLET: ItemDeficiencies = {
  itemName: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
  deficiencies: [
    {
      id: 'elec_gfci_1',
      name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-GFCI-01',
      codeReference: `🔍 Step 1: Identify Applicable Devices
• 	Locate all exterior electrical outlets and breakers that:
• 	Are installed in damp or wet locations (e.g., patios, garages, balconies, utility enclosures)
• 	Are within 6 feet of a water source
• 	Are part of lighting, HVAC, or appliance circuits requiring AFCI or GFCI protection
• 	Confirm whether protection is provided via:
• 	GFCI outlet or GFCI breaker
• 	AFCI outlet or AFCI breaker
🧱 Step 2: Assess Structural Integrity
Inspect for damage, exposure, or missing components:
Outlet/breaker faceplate, Test/reset buttons, Wiring/conductors, Weatherproof cover
🔧 Step 3: Perform Functional Testing
• 	Test GFCI outlet or breaker: Press TEST button → confirm power interruption
• 	Press RESET button → confirm restoration
• 	Test AFCI outlet or breaker: Press TEST button → confirm arc fault trip
• 	Reset manually or via panel
• 	Use a UL-listed circuit tester if buttons are inaccessible or unclear
• 	NSPIRE Deficiency 3: Missing GFCI protection within 6 ft of water source = Severe
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Corrosion, mold, or pest activity around outlet or panel
• 	Water intrusion or staining near electrical enclosures
• 	IBU Overlay: May require sealed conduit, pest-proof boxes, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Mounting height: ≤48″ AFF for accessibility compliance
• 	Weatherproofing: Exterior outlets must have in-use covers rated for wet locations
• 	Labeling: Breakers must be clearly marked for AFCI/GFCI protection
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas`
    }
  ]
};

// 7e. Electrical Service Panel (3 deficiency details)
export const ELECTRICAL_SERVICE_PANEL_OUTSIDE: ItemDeficiencies = {
  itemName: 'Electrical Service Panel',
  deficiencies: [
    {
      id: 'esp_out_1',
      name: 'Electrical service panel is not reasonably accessible.',
      detail: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ESP-OUT-01',
      codeReference: `🔍 Step 1: Locate and Identify Panel Type
• Identify main service panels typically grouped near:
• Exterior meter banks
• Utility closets or mechanical enclosures
• Confirm panel serves multiple units and is accessible for inspection
• Note presence of subpanels inside units (if applicable) and ensure proper feeder separation

🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, exposure, or unsafe conditions:
• Panel enclosure, Mounting, Locking mechanism, Live conductors

🔧 Step 3: Evaluate Functional Adequacy
• Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• Main disconnect: Must be clearly labeled and accessible
• Grounding & bonding: Look for proper ground rod connection and neutral/EGC separation

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Corrosion, mold, or pest activity inside or around panel
• Water intrusion or staining on enclosure or adjacent wall
• IBU Overlay: May require sealed conduit, pest-proof enclosures, and corrosion-resistant hardware

🧠 Step 5: Verify Accessibility & Local Compliance
• Working clearance: Minimum 30″ wide × 36″ deep clear space in front of panel (CEC §110.26)
• Mounting height: Panel handles must be ≤6′7″ AFF
• Labeling: All breakers must be clearly marked for unit or system served
• IBU Overlay: May require tactile signage, lockable access, and ADA-compliant reach ranges in shared areas`
    },
    {
      id: 'esp_out_2',
      name: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ESP-OUT-02',
      codeReference: `🔍 Same inspection protocol as ELEC-OUT-05 with focus on:
• Contamination of protection devices
• Signs of infestation, paint, or rust
• Integrity of breakers and fuses`
    },
    {
      id: 'esp_out_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'ESP-OUT-03',
      codeReference: `🔍 Same inspection protocol as ELEC-OUT-05 with focus on:
• Visible damage to protection devices
• Risk of failure to interrupt circuit
• Critical safety inspection of fuses and breakers`
    }
  ]
};

export const ELECTRICAL_SUBCATEGORIES_OUTSIDE = [
  { id: 'elec_conductor', name: 'Electrical - Conductor, Outlet, and Switch' },
  { id: 'elec_afci', name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered an exposed conductor.' },
  { id: 'elec_unprotected', name: 'Unprotected outlet is present within six feet of a water source, including a water heater or a laundry area when not in use.' },
  { id: 'elec_gfci', name: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.' },
  { id: 'elec_service_panel', name: 'Electrical Service Panel' }
];

// ==========================================
// 9. FIRE SAFETY - with Subcategories
// ==========================================
export const FIRE_SAFETY_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: []  // Empty - use subcategories
};

// 9a. Exit Sign
export const EXIT_SIGN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Exit Sign',
  deficiencies: [
    {
      id: 'exit_sign_1',
      name: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated',
      detail: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not properly illuminated.',
      criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not properly illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'EXIT-SIGN-01',
      codeReference: `🧭 Step 1: Identify Exit Sign Locations
Inspect all permanently installed exit signs that mark emergency egress routes.
NSPIRE does not require exit signs in every building, but if one is present or evidence of prior installation exists, it must be inspected.

🔍 Step 2: Visual Condition Assessment
• Legibility: The word "EXIT" must be clearly visible from all approach angles.
• Obstruction: Ensure no furniture, signage, or decorations block the sign.
• Contrast: Letters must contrast with the background (typically red or green on white).

🧪 Step 3: Functional Testing
• Visibility Check: Confirm the sign is clearly visible from all approach angles
• Illumination Test: If the sign is powered, press the test button (if present) to verify battery backup
• If no button, confirm the sign is lit via AC power or photoluminescence
• Mounting Check: Ensure the sign is securely affixed to the wall or ceiling
• Obstruction Scan: Look for any objects blocking the sign or its visibility
• Combination units (exit sign + emergency light) must be inspected as two separate items.

📏 Step 4: Accessibility /Code Compliance & IBU Overlay
• Height & Placement: Signs must be mounted high enough to be visible but not obstructive
• Visual Clarity: Letters must be ≥6″ high with a stroke width ≥¾″
• Contrast & Illumination: Must be readable by residents with low vision
• Directional Arrows: Required if the exit path is not straight ahead

⚒️ Step 5: IRC Fire Safety Requirements
• IRC (2021) §R311.4, §R315 – Means of egress and emergency escape
• Fire separation walls must not block exit signage or access`
    }
  ]
};

// 9b. Fire Escape
export const FIRE_ESCAPE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Escape',
  deficiencies: [
    {
      id: 'fire_esc_1',
      name: 'Fire escape component is damaged, or missing.',
      detail: 'Fire escape  component is damaged, or missing',
      criteria: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-ESC-01',
      codeReference: `🧭 Step 1: Exterior Fire Escape & Ladder Inspection Protocol
Applies to: Multifamily buildings >4 stories
Codes Referenced: IRC, IBC/IBU, NSPIRE
Focus: Life safety, structural integrity, egress functionality

🔍 Step 2: Structural Component Checklist
Inspect each element for damage, deterioration, or absence:
• Stairs/Ladders, Platforms, Guardrails, Handrails, Anchors/Supports
• NSPIRE defines any missing or damaged fire escape component as a life-threatening deficiency

🧪 Step 3: Egress & Access Evaluation
• Verify clear access from windows or doors to the fire escape.
• Check for obstructions: AC units, furniture, debris.
• Confirm operability of windows/doors leading to escape.
• If blocked, refer to NSPIRE's Egress Standard.

📏 Step 4: Code Compliance Highlights
IRC / IBC Requirements:
• IBC 1009.3: Fire escapes permitted only for existing buildings.
• IBC 1011.5.2: Tread depth ≥ 11″, riser height ≤ 7″.
• IBC 1011.11: Handrails required on both sides if >4 risers.
• IBC 1015.2: Guardrails ≥ 42″ height, openings <4″.
• IRC R311.7: Exterior stairs must be structurally sound and weather-resistant.
• For buildings over 4 stories, IBC/IBU takes precedence over IRC for fire escape design and retrofit standards.

⚒️ Step 5: Material & Weathering Assessment
• Metal: Inspect for rust, flaking paint, metal fatigue.
• Wood (if present): Check for rot, splintering, termite damage.
• Fasteners: Look for missing bolts, loose welds, or compromised joints.
• Counterbalanced or drop ladders: Confirm smooth operation and locking mechanisms.`
    }
  ]
};

// 9c. Fire Extinguisher
export const FIRE_EXTINGUISHER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Extinguisher',
  deficiencies: [
    {
      id: 'fire_ext_1',
      name: 'A fire extinguisher is damaged or missing.',
      detail: 'A fire extinguisher is damaged or missing. A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety',
      criteria: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-EXT-01',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.

🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE's life-threatening category.

🧪 Step 3: Functional & Compliance Checks
• Pressure Gauge Check: Confirm needle is in the green zone
• Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• Mounting Check: Ensure extinguisher is securely mounted in bracket or cabinet
• Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
• Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• Mounting Height: Top of extinguisher ≤48″ AFF if <40 lbs; ≤42″ if >40 lbs
• Reachability: Must be reachable without tight grasping or bending
• Clear Floor Space: Minimum 30″x48″ in front of extinguisher
• Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• IRC Section R313.1: Fire extinguishers must be accessible and maintained in working order
• NFPA 10 Reference: Extinguishers must be inspected monthly and serviced annually
• IRC R315.2: Extinguishers must not obstruct egress or emergency equipment
• IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
    },
    {
      id: 'fire_ext_2',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-EXT-02',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.

🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE's life-threatening category.

🧪 Step 3: Functional & Compliance Checks
• 	Pressure Gauge Check: Confirm needle is in the green zone
• 	Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• 	Mounting Check: 	Ensure extinguisher is securely mounted in bracket or cabinet
• 	Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• 	Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• 	Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs; ≤42" if >40 lbs
• 	Reachability: Must be reachable without tight grasping or bending
• 	Clear Floor Space: Minimum 30"x48" in front of extinguisher
• 	Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section R313.1:
• 	Fire extinguishers must be accessible and maintained in working order
• 	NFPA 10 Reference:
• 	Extinguishers must be inspected monthly and serviced annually
• 	IRC R315.2:
• 	Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
    },
    {
      id: 'fire_ext_3',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The fire extinguisher tag is missing or illegible or expired.',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-EXT-03',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.

🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE's life-threatening category.

🧪 Step 3: Functional & Compliance Checks
• 	Pressure Gauge Check: Confirm needle is in the green zone
• 	Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• 	Mounting Check: 	Ensure extinguisher is securely mounted in bracket or cabinet
• 	Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• 	Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• 	Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs; ≤42" if >40 lbs
• 	Reachability: Must be reachable without tight grasping or bending
• 	Clear Floor Space: Minimum 30"x48" in front of extinguisher
• 	Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC Section R313.1:
• 	Fire extinguishers must be accessible and maintained in working order
• 	NFPA 10 Reference:
• 	Extinguishers must be inspected monthly and serviced annually
• 	IRC R315.2:
• 	Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
    }
  ]
};

// 9d. Flammable and Combustible Item
export const FLAMMABLE_COMBUSTIBLE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Flammable and Combustible Item',
  deficiencies: [
    {
      id: 'flam_1',
      name: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FLAM-01',
      codeReference: `🧭 Step 1: Identify Inspectable Locations
Inspect all shared-use areas where flammable or combustible materials may be stored or used.

🔍 Step 2: Visual Condition Assessment
• Look for: Paints, solvents, gasoline, propane, kerosene, butane, nail polish remover, charcoal lighter fluid, oxygen tanks, cleaning chemicals
• Packaging: Must be original, sealed, and intact

🧪 Step 3: Inspection Technique
• Proximity Check: Measure or estimate distance between flammable items and ignition sources (must be ≥3 feet)
• Container Check: Confirm chemicals are in original, sealed containers and stored safely
• Label Review: Look for flammable or combustible warnings on spray cans, solvents, or fuels
• Ventilation & Access: Ensure storage areas are ventilated and not obstructing egress or equipment

📏 Step 4: Accessibility & IBU Local Requirement
• Access height: Typically ≤5 feet AFF for unobstructed reach.
• Signage: Required in some jurisdictions—check for label or directional arrow.
• IBU Local Codes: May require annual servicing logs, seismic bracing, or multilingual signage

⚒️ Step 5: IRC Fire Safety Requirements
• IRC (2021) §R302.1–R302.5 – Fire-resistant construction and ignition separation
• IBU overlays – Local fire code, hazardous materials storage, and emergency response protocols`
    }
  ]
};

// 9e. Sprinkler Assembly
export const SPRINKLER_ASSEMBLY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sprinkler Assembly',
  deficiencies: [
    {
      id: 'sprink_1',
      name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'SPRINK-01',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
• Obstruction within 18″ of sprinkler head
• Sprinkler head encased or covered
• Missing or damaged escutcheon ring
• Concealed cover plate glued or sealed
• Foreign material covering >75% of head or bulb
• Evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• Mounting Check: Confirm escutcheon rings are flush and intact
• Cover Plate Test: Ensure concealed plates are not glued, painted, or sealed
• Corrosion Check: Inspect for rust on functional components (not just trim)
• Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80″ AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records
• Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'sprink_2',
      name: 'Sprinkler head assembly has evidence of corrosion.',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'SPRINK-02',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'sprink_3',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'SPRINK-03',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'sprink_4',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'SPRINK-04',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    }
  ]
};

export const FIRE_SAFETY_SUBCATEGORIES_OUTSIDE = [
  { id: 'exit_sign', name: 'Exit Sign' },
  { id: 'fire_escape', name: 'Fire Escape' },
  { id: 'fire_extinguisher', name: 'Fire Extinguisher' },
  { id: 'flammable_combustible', name: 'Flammable and Combustible Item' },
  { id: 'sprinkler_assembly', name: 'Sprinkler Assembly' }
];

// ==========================================
// 11. HAZARD - with Subcategories
// ==========================================
export const HAZARD_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: []  // Empty - use subcategories
};

// 11a. Rat
export const RAT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Rat',
  deficiencies: [
    {
      id: 'rat_1',
      name: 'Evidence of rats',
      detail: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
      criteria: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAT-01',
      codeReference: `🔍 Step 1: Identify High-Risk Zones
Focus inspection on exterior areas where rats are likely to nest or travel:
• Trash enclosures and dumpsters
• Utility closets, crawl space vents, and foundation gaps
• Dense vegetation, fence lines, and retaining walls
• Parking lot perimeters and storm drains

🧱 Step 2: Assess Structural Entry Points
Inspect for physical vulnerabilities that allow rat access:
• Foundation gaps, Door sweeps, Wall penetrations, Vent covers

🧼 Step 3: Inspect for Sanitation Hazards
• Droppings: Shiny, black, ½–¾″ long; often near trash, walls, or corners
• Grease trails: Dark smears along walls or pipes from repeated rat movement
• Urine odor: Strong ammonia-like smell in enclosed or shaded areas
• Chewed materials: Plastic bags, insulation, cardboard, or food containers

🧠 Step 4: Verify Accessibility & Resident Safety
• Pathway clearance: Ensure rat traps or bait stations do not obstruct accessible routes
• Signage: If pest control is active, ensure warning signs are posted
• IBU Overlay: May require tactile signage, visual contrast, and safe placement of pest control devices near accessible paths

🔧 Step 5: Evaluate Mitigation Measures
• Traps & bait stations: Must be professionally placed, secured, and labeled
• Trash containment: Lids must close fully; bins must be clean and rodent-proof
• Vegetation control: Trim overgrowth and remove debris piles near building edges
• NSPIRE Deficiency: Presence of rats or rat droppings = Severe (30-day correction)`
    }
  ]
};

// 11b. Litter
export const LITTER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Litter',
  deficiencies: [
    {
      id: 'litter_1',
      name: 'Litter is accumulated in an undesignated area',
      detail: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'LITTER-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on high-traffic and high-risk exterior areas:
• Building perimeters and walkways
• Parking lots and drive aisles
• Trash enclosures and recycling stations
• Landscaping beds, fence lines, and utility pads
• Common gathering areas (e.g., benches, mailboxes)

🧱 Step 2: Assess Structural Impact
While litter is primarily a sanitation issue, inspect for signs of structural or environmental degradation:
• Drainage grates, Foundation edges, Fence lines, Walkways

🧼 Step 3: Quantify Litter Presence
• IRC §R306.1 – Sanitary drainage and site cleanliness
Use NSPIRE thresholds for citation:
• Small items: 10 or more discarded items (e.g., wrappers, cigarette butts, paper) in a 100 ft² area = Low severity
• Large items: 1 improperly discarded bulky item (e.g., mattress, appliance, furniture) = Low severity

🧠 Step 4: Evaluate Accessibility & Resident Impact
• Pathway clearance: Litter must not obstruct accessible routes or egress paths
• Visual contrast: Trash near tactile signage or ADA paths may reduce visibility
• IBU Overlay: May require enhanced maintenance protocols in accessible zones and signage for proper disposal

🔧 Step 5: Review Mitigation Measures
• Trash bins: Must be present, covered, and not overflowing
• Collection schedule: Confirm regular pickup and designated bulk item zones
• Resident education: Look for posted disposal instructions or signage`
    }
  ]
};

// 11c. Sharp edges
export const SHARP_EDGES_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sharp edges',
  deficiencies: [
    {
      id: 'sharp_1',
      name: 'A sharp edge that can result in a cut or puncture hazard is present.',
      detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'SHARP-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on normal paths of travel and resident-accessible exterior areas:
• Walkways, ramps, and stairwells
• Parking areas and curbs
• Fences, gates, and railing systems
• Playground equipment, benches, and utility enclosures
• Trash enclosures and mechanical pads

🧱 Step 2: Assess Structural Integrity
Inspect for physical damage or protrusions that pose a cutting hazard:
• Metal edges, Broken fixture, Exposed fasteners, Damaged fencing

🔧 Step 3: Evaluate Risk & Accessibility
• Touch test: Without applying force, gently assess whether the edge could cut or puncture skin
• Height check: Sharp edges within 24″–72″ AFF pose the greatest risk to adults and children
• Path proximity: Edges within 36″ of walkways or ramps are considered high-risk

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Blood stains, pest nests, or mold near damaged surfaces
• Trash or debris concealing sharp objects
• IBU Overlay: May require sealed surfaces, pest-proof enclosures, and immediate removal of hazardous debris

🧠 Step 5: Verify Accessibility & Local Compliance
• Accessible routes: Sharp edges must not obstruct or endanger disability-compliant paths
• IRC §R301.1 requires exterior components to be safe for occupants and resistant to injury hazards
• Play areas & benches: Must meet local safety standards for public use
• IBU Overlay: May require tactile warnings, visual contrast, or protective guards in accessible zones`
    }
  ]
};

// 11d. Trip hazard
export const TRIP_HAZARD_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Trip hazard',
  deficiencies: [
    {
      id: 'trip_1',
      name: 'Trip hazard on walking surface.',
      detail: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      criteria: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'TRIP-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on normal paths of travel and resident-accessible exterior areas:
• Walkways, ramps, and sidewalks
• Parking lot transitions and curb cuts
• Entry paths to units, mailboxes, laundry, and trash enclosures
• Common areas like patios, benches, and play zones

🧱 Step 2: Assess Surface Conditions
Inspect for physical irregularities that meet NSPIRE thresholds:
• Concrete/asphalt, Pavers/tiles, Transitions, Utility covers

🧼 Step 3: Check Sanitation & Environmental Safety
• Inspect for:
• Debris, vegetation, or litter concealing trip hazards
• Water pooling or erosion that undermines walking surfaces
• IBU Overlay: May require sealed joints, slip-resistant surfaces, and pest-resistant landscaping near walkways

🧠 Step 4: Verify Accessibility & Local Compliance
• Slope & surface: Must be firm, stable, and slip-resistant
• Cross-slope: ≤2% for accessible routes
• Edge protection: Required at elevated surfaces ≥4″ without guardrails
• IBU Overlay: May require tactile warnings, visual contrast

📏 Step 5: Measure and Confirm Deficiency
• Use a ruler or measuring tool to confirm:
• Vertical displacement ≥¾″
• Horizontal separation ≥2″
• Document whether the hazard is unintended (not part of engineered design)
• Cross-reference: Note IRC §R311.3, NSPIRE Trip Hazard Standard, and IBU overlays`
    }
  ]
};

export const HAZARD_SUBCATEGORIES_OUTSIDE = [
  { id: 'rat', name: 'Rat' },
  { id: 'litter', name: 'Litter' },
  { id: 'sharp_edges', name: 'Sharp edges' },
  { id: 'trip_hazard', name: 'Trip hazard' }
];

// ==========================================
// 16. LIGHTING - with Subcategories
// ==========================================
export const LIGHTING_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: []  // Empty - use subcategories
};

// 16a. Lighting - Auxiliary
export const LIGHTING_AUXILIARY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Lighting - Auxiliary',
  deficiencies: [
    {
      id: 'light_aux_1',
      name: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested',
      detail: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LIGHT-AUX-01',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    }
  ]
};

// 16b. Lighting - Exterior
export const LIGHTING_EXTERIOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Lighting - Exterior',
  deficiencies: [
    {
      id: 'light_ext_1',
      name: 'A permanently installed light fixture is damaged, inoperable, missing or not secure',
      detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LIGHT-EXT-01',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    }
  ]
};

export const LIGHTING_SUBCATEGORIES_OUTSIDE = [
  { id: 'lighting_auxiliary', name: 'Lighting - Auxiliary' },
  { id: 'lighting_exterior', name: 'Lighting - Exterior' }
];

// ==========================================
// 17. PARKING - with Subcategories
// ==========================================
export const PARKING_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Parking Lots, Driveways, Roads',
  deficiencies: []  // Empty - use subcategories
};

// 17a. Parking Lot
export const PARKING_LOT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Parking Lot',
  deficiencies: [
    {
      id: 'park_lot_1',
      name: 'The parking lot has any one pothole greater than 4 inches deep and 1 square foot or more significant.',
      detail: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      criteria: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-LOT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    },
    {
      id: 'park_lot_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-LOT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    }
  ]
};

// 17b. Private Roads and Driveways
export const PRIVATE_ROADS_DRIVEWAYS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Private Roads and Driveways',
  deficiencies: [
    {
      id: 'priv_road_1',
      name: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      detail: 'Not including temporary obstruction.',
      criteria: 'Not including temporary obstruction.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PRIV-ROAD-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    },
    {
      id: 'priv_road_2',
      name: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      detail: 'The driveway is not functionally adequate.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PRIV-ROAD-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    }
  ]
};

export const PARKING_SUBCATEGORIES_OUTSIDE = [
  { id: 'parking_lot', name: 'Parking Lot' },
  { id: 'private_roads', name: 'Private Roads and Driveways' }
];

// ==========================================
// 19. RAILINGS - with Subcategories
// ==========================================
export const RAILINGS_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: []  // Empty - use subcategories
};

// 19a. Guardrail
export const GUARDRAIL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Guardrail',
  deficiencies: [
    {
      id: 'guard_1',
      name: 'The guardrail is missing or not installed, limiting its safe use.',
      detail: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents.',
      criteria: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'GUARD-01',
      codeReference: `🔍 Step 1: Identify Guardrail Locations\nInspect all elevated walking surfaces accessible to residents or staff:\n• \tBalconies, decks, porches\n• \tExterior stair landings and ramps\n• \tRetaining walls with adjacent walkways\n• \tRooftop terraces or utility platforms\n• \tAccessible paths with drop-offs >30″\n🧱 Step 2: Assess Structural Integrity\nInspect for missing, damaged, or unstable components:\nGuardrail missing, Top/mid rail, Posts & anchors, Balusters/pickets, Height compliance\n• \tCross-reference: Note IRC §R312.1, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Stability & Safety Tests\n• \tPush/pull test: Apply moderate force to top rail and posts to check for movement\n• \tGap check: Measure spacing between vertical elements (must be ≤4″)\n• \tHeight check: Use tape measure to confirm rail height from walking surface\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around guardrail components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail integration: If guardrail doubles as handrail, must meet local disability Act\n• \tVisual contrast: Guardrails must be distinguishable from surroundings for low-vision users\n• \tEdge protection: Required at accessible ramps and elevated paths without curbs\n• \tIBU Overlay: May require tactile warnings, ADA-compliant grip surfaces, and extended landings`
    },
    {
      id: 'guard_2',
      name: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'GUARD-02',
      codeReference: `🔍 Step 1: Identify Guardrail Locations\nInspect all elevated walking surfaces accessible to residents or staff:\n• \tBalconies, decks, porches\n• \tExterior stair landings and ramps\n• \tRetaining walls with adjacent walkways\n• \tRooftop terraces or utility platforms\n• \tAccessible paths with drop-offs >30″\n🧱 Step 2: Assess Structural Integrity\nInspect for missing, damaged, or unstable components:\nGuardrail missing, Top/mid rail, Posts & anchors, Balusters/pickets, Height compliance\n• \tCross-reference: Note IRC §R312.1, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Stability & Safety Tests\n• \tPush/pull test: Apply moderate force to top rail and posts to check for movement\n• \tGap check: Measure spacing between vertical elements (must be ≤4″)\n• \tHeight check: Use tape measure to confirm rail height from walking surface\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around guardrail components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail integration: If guardrail doubles as handrail, must meet local disability Act\n• \tVisual contrast: Guardrails must be distinguishable from surroundings for low-vision users\n• \tEdge protection: Required at accessible ramps and elevated paths without curbs\n• \tIBU Overlay: May require tactile warnings, ADA-compliant grip surfaces, and extended landings`
    }
  ]
};

// 19b. Handrail
export const HANDRAIL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Handrail',
  deficiencies: [
    {
      id: 'hand_1',
      name: 'Handrail is missing.',
      detail: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAND-01',
      codeReference: `🔍 Step 1: Identify Railing Locations\nInspect all exterior railings that serve:\n• \tStairs, ramps, and elevated walkways\n• \tBalconies, porches, and decks\n• \tAccessible paths with elevation changes\n• \tRetaining walls or drop-offs adjacent to pedestrian routes\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nRailing structure, Mounting hardware, Top rail, Vertical supports, Height compliance\n• \tCross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Safety & Functionality Checks\n• \tStability test: Apply moderate force to top rail and posts—should not wobble or shift\n• \tHeight check: Measure from walking surface to top of rail\n• \tSpacing check: Ensure vertical elements are ≤4″ apart to prevent entrapment\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around railing components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail grip: Must be graspable and continuous\n• \tEdge protection: Required at ramps and elevated surfaces without curbs\n• \tVisual contrast: Railings must be distinguishable for low-vision users\n• \tIBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings`
    },
    {
      id: 'hand_2',
      name: 'Handrail is not functionally adequate.',
      detail: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAND-02',
      codeReference: `🔍 Step 1: Identify Railing Locations\nInspect all exterior railings that serve:\n• \tStairs, ramps, and elevated walkways\n• \tBalconies, porches, and decks\n• \tAccessible paths with elevation changes\n• \tRetaining walls or drop-offs adjacent to pedestrian routes\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nRailing structure, Mounting hardware, Top rail, Vertical supports, Height compliance\n• \tCross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Safety & Functionality Checks\n• \tStability test: Apply moderate force to top rail and posts—should not wobble or shift\n• \tHeight check: Measure from walking surface to top of rail\n• \tSpacing check: Ensure vertical elements are ≤4″ apart to prevent entrapment\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around railing components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail grip: Must be graspable and continuous\n• \tEdge protection: Required at ramps and elevated surfaces without curbs\n• \tVisual contrast: Railings must be distinguishable for low-vision users\n• \tIBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings`
    },
    {
      id: 'hand_3',
      name: 'Handrail is not installed where required.',
      detail: 'Handrail is not installed where required.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAND-03',
      codeReference: `🔍 Step 1: Identify Railing Locations\nInspect all exterior railings that serve:\n• \tStairs, ramps, and elevated walkways\n• \tBalconies, porches, and decks\n• \tAccessible paths with elevation changes\n• \tRetaining walls or drop-offs adjacent to pedestrian routes\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nRailing structure, Mounting hardware, Top rail, Vertical supports, Height compliance\n• \tCross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Safety & Functionality Checks\n• \tStability test: Apply moderate force to top rail and posts—should not wobble or shift\n• \tHeight check: Measure from walking surface to top of rail\n• \tSpacing check: Ensure vertical elements are ≤4″ apart to prevent entrapment\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around railing components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail grip: Must be graspable and continuous\n• \tEdge protection: Required at ramps and elevated surfaces without curbs\n• \tVisual contrast: Railings must be distinguishable for low-vision users\n• \tIBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings`
    },
    {
      id: 'hand_4',
      name: 'Handrail is not secured.',
      detail: 'Handrail is not secured. There is movement in the anchors of the handrail.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAND-04',
      codeReference: `🔍 Step 1: Identify Railing Locations\nInspect all exterior railings that serve:\n• \tStairs, ramps, and elevated walkways\n• \tBalconies, porches, and decks\n• \tAccessible paths with elevation changes\n• \tRetaining walls or drop-offs adjacent to pedestrian routes\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nRailing structure, Mounting hardware, Top rail, Vertical supports, Height compliance\n• \tCross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays\n🔧 Step 3: Perform Safety & Functionality Checks\n• \tStability test: Apply moderate force to top rail and posts—should not wobble or shift\n• \tHeight check: Measure from walking surface to top of rail\n• \tSpacing check: Ensure vertical elements are ≤4″ apart to prevent entrapment\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tRust, mold, or pest nests on or around railing components\n• \tWater damage or algae on adjacent walking surfaces\n• \tIBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tHandrail grip: Must be graspable and continuous\n• \tEdge protection: Required at ramps and elevated surfaces without curbs\n• \tVisual contrast: Railings must be distinguishable for low-vision users\n• \tIBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings`
    }
  ]
};

export const RAILINGS_SUBCATEGORIES_OUTSIDE = [
  { id: 'guardrail', name: 'Guardrail' },
  { id: 'handrail', name: 'Handrail' }
];

// ==========================================
// 24. RETAINING WALL - with Subcategories
// ==========================================
export const RETAINING_WALL_PARENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'RETAINING WALL',
  deficiencies: []  // Empty - use subcategories
};

// 24a. Retaining wall
export const RETAINING_WALL_SUBCATEGORY: ItemDeficiencies = {
  itemName: 'Retaining wall',
  deficiencies: [
    {
      id: 'ret_wall_1',
      name: 'Retaining wall is leaning away from the fill side.',
      detail: 'Retaining wall is leaning away from the fill side.',
      criteria: 'Retaining wall is leaning away from the fill side.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-WALL-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'ret_wall_2',
      name: 'Retaining wall is partially or completely collapsed.',
      detail: 'The retaining wall is (sloped) partially or completely collapsed.',
      criteria: 'The retaining wall is (sloped) partially or completely collapsed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-WALL-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    }
  ]
};

// 24b. Wall - Exterior
export const WALL_EXTERIOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Wall - Exterior',
  deficiencies: [
    {
      id: 'wall_ext_1',
      name: 'Exterior wall component(s) is not functionally adequate.',
      detail: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      criteria: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WALL-EXT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'wall_ext_2',
      name: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      detail: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WALL-EXT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'wall_ext_3',
      name: 'Exterior wall has peeling paint of 10 square feet or more',
      detail: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WALL-EXT-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    }
  ]
};

export const RETAINING_WALL_SUBCATEGORIES_OUTSIDE = [
  { id: 'retaining_wall', name: 'Retaining wall' },
  { id: 'wall_exterior', name: 'Wall - Exterior' }
];

// 4c. Door - Entry (for Inside)
export const DOOR_ENTRY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door - Entry',
  deficiencies: [
    {
      id: 'door_entry_1',
      name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
      detail: 'Seal, gasket, or stripping is damaged, inoperable, or missing.',
      criteria: 'Gap of 1/4 inch or more that allows light through or evidence of water penetration.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-01',
      codeReference: "hello"
    },
    {
      id: 'door_entry_2',
      name: 'Self-closing mechanism is damaged, inoperable or damaged.',
      detail: 'The self-closing mechanism is damaged, does not pull the door closed and engage the latch, or is missing.',
      criteria: 'Self-closing mechanism failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-02',
      codeReference: "hello"
    },
    {
      id: 'door_entry_3',
      name: 'Entry door surface is delaminated or separated.',
      detail: 'There is delamination or separation of the door surface 2 inches wide or greater.',
      criteria: 'Delamination or separation that affects the integrity of the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-03',
      codeReference: "hello"
    },
    {
      id: 'door_entry_4',
      name: 'Entry door will not close.',
      detail: 'Entry door does not close (i.e., door seats in frame).',
      criteria: 'Entry door will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-04',
      codeReference: "hello"
    },
    {
      id: 'door_entry_5',
      name: 'Entry door will not open.',
      detail: 'Entry door does not open.',
      criteria: 'Entry door does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-ENTRY-05',
      codeReference: "hello"
    },
    {
      id: 'door_entry_6',
      name: 'Hole, split, or crack that penetrates completely through the entry door.',
      detail: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
      criteria: 'Penetrates through the door or door sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-06',
      codeReference: "hello"
    }
  ]
};

// 4b. Door – Fire Labeled
export const DOOR_FIRE_LABELED_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door – Fire Labeled',
  deficiencies: [
    {
      id: 'door_fire_1',
      name: 'An object is present that may prevent the fire-labeled door from closing/latching.',
      detail: 'Object prevents door from closing/latching OR self-closing/latching.',
      criteria: 'Object present preventing operation.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-01',
      codeReference: "hello"
    },
    {
      id: 'door_fire_2',
      name: 'Fire-labeled door assembly has a hole of any size.',
      detail: 'Hole of any size OR damaged such that its integrity may be compromised.',
      criteria: 'Integrity compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-02',
      codeReference: "hello"
    },
    {
      id: 'door_fire_3',
      name: 'Fire - labeled door cannot be secured.',
      detail: 'Fire-labeled door that serves as an entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Cannot be secured.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-03',
      codeReference: "hello"
    },
    {
      id: 'door_fire_4',
      name: 'Fire - labeled door does not close and latch.',
      detail: 'Fire - labeled door does not close and latch OR self-closing hardware is damaged or missing.',
      criteria: 'Door does not self-close and latch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-04',
      codeReference: "hello"
    },
    {
      id: 'door_fire_5',
      name: 'Fire-labeled door does not open.',
      detail: 'Fire-labeled door does not open, which may limit access between spaces.',
      criteria: 'Does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-FIRE-05',
      codeReference: "hello"
    },
    {
      id: 'door_fire_6',
      name: 'Fire-labeled door is missing.',
      detail: 'Evidence of prior installation, but now not present or is incomplete.',
      criteria: 'Door missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-06',
      codeReference: "hello"
    },
    {
      id: 'door_fire_7',
      name: 'Fire - labeled door seal or gasket is damaged.',
      detail: 'Seal or gasket is damaged (impacts functionality) or missing.',
      criteria: 'Seal/gasket failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-FIRE-07',
      codeReference: "hello"
    }
  ]
};

// 4c. Door - General
export const DOOR_GENERAL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door - General',
  deficiencies: [
    {
      id: 'door_gen_1',
      name: 'Passage door component is damaged, inoperable, or missing.',
      detail: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
      criteria: 'Door not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-GEN-01',
      codeReference: "hello"
    },
    {
      id: 'door_gen_2',
      name: 'A passage door (utility, storage, closet, laundry) does not open.',
      detail: 'A passage door does not open such that it may limit access when needed.',
      criteria: 'Does not open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-GEN-02',
      codeReference: "hello"
    },
    {
      id: 'door_gen_3',
      name: 'A passage door (non-access) has a damaged component.',
      detail: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      criteria: 'Component damaged/missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'DOOR-GEN-03',
      codeReference: "hello"
    }
  ]
};

// 4d. Garage Door
export const GARAGE_DOOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Garage Door',
  deficiencies: [
    {
      id: 'garage_1',
      name: 'Garage door does not open, close, or remains closed.',
      detail: 'Door will not open and remain open, does not function adequately.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GARAGE-01',
      codeReference: "hello"
    },
    {
      id: 'garage_2',
      name: 'The garage door has a hole (broken panel or window).',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Hole penetrating to interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GARAGE-02',
      codeReference: "hello"
    }
  ]
};

// 6. Egress
export const EGRESS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_1',
      name: 'Obstructed means of egress.',
      detail: 'The exit access or exit is obstructed.',
      criteria: 'Exit discharge path from an exit to public way is obstructed.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'EGRESS-OUT-01',
      codeReference: `🔍 Step 1: Verify Accessibility & Local Compliance
• Slope & surface: Egress paths must be firm, stable, and slip-resistant
• Door hardware: Must be operable without tight grasping or twisting
• Visual contrast: Required for stair edges and exit signage
• IBU Overlay: May require tactile signage, audible alerts, or extended landings for accessible units

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or obstruction:
• Exit doors, Pathways, Stairwells/fire escapes, Handrails/guardrails

🔧 Step 3: Evaluate Operability & Clearance
• Door test: Ensure all exterior exit doors open easily without keys or tools
• Pathway check: Confirm minimum 36″ clear width for accessible egress routes
• Obstruction scan: Look for trash bins, furniture, vegetation, or resident items blocking exits

💡 Step 4: Inspect Lighting & Signage
• Exit signs: Must be visible and illuminated at night or in low-light conditions
• Emergency lighting: Should activate during a power failure
• NSPIRE Deficiency: Missing or nonfunctional signage/lighting = Moderate

🧼 Step 5: Check Sanitation & Environmental Safety
• Inspect for:
• Water pooling or erosion that may impede safe exit
• IBU Overlay: May require slip-resistant surfaces, sealed transitions, and pest-proof lighting fixtures`
    }
  ]
};

// 7. Electrical
export const ELECTRICAL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    {
      id: 'elec_1',
      name: 'Electrical - Conductor, Outlet, and Switch',
      detail: 'Exposed electrical conductor.',
      criteria: 'Conductors lack proper insulation or enclosure (exposed wiring, open ports, missing covers, or gap > 1/2 inch).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'ELEC-01',
      codeReference: "hello"
    },
    {
      id: 'elec_2',
      name: 'Electrical - AFCI',
      detail: 'The AFCI outlet or AFCI breaker does not reset.',
      criteria: 'AFCI outlet or AFCI breaker test or reset button is inoperable (if damaged, considered exposed conductor).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-02',
      codeReference: "hello"
    },
    {
      id: 'elec_3',
      name: 'Electrical - Accessibility',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'Cannot be reached and opened without moving obstructions, dismantling, or destructive measures.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-03',
      codeReference: "hello"
    },
    {
      id: 'elec_4',
      name: 'Electrical - Water Source Proximity',
      detail: 'Unprotected outlet is present within six feet of a water source.',
      criteria: 'Outlet not GFCI protected within six feet of a water source (sink, bathtub, shower, toilet).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'ELEC-04',
      codeReference: "hello"
    },
    {
      id: 'elec_5',
      name: 'Electrical - GFCI',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      criteria: 'Test or reset button is inoperable (system not meeting function).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'ELEC-05',
      codeReference: "hello"
    },
    {
      id: 'elec_6',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      criteria: 'Fuse or breaker is contaminated (e.g., water, rust, corrosion).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-06',
      codeReference: "hello"
    },
    {
      id: 'elec_7',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'Fuse or breaker is visibly defective/damaged; may not interrupt circuit.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-07',
      codeReference: "hello"
    }
  ]
};

// 7b. Electrical Service Panel
export const ELECTRICAL_SERVICE_PANEL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Electrical Service Panel',
  deficiencies: [
    {
      id: 'esp_1',
      name: 'Electrical service panel is not reasonably accessible.',
      detail: 'Cannot be reached and opened without moving obstructions, dismantling, destructive measures. Or is locked with no key.',
      criteria: 'Not accessible.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ESP-01',
      codeReference: "hello"
    },
    {
      id: 'esp_2',
      name: 'The overcurrent protection device is contaminated.',
      detail: 'The overcurrent protection device (fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
      criteria: 'Contamination present.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ESP-02',
      codeReference: "hello"
    },
    {
      id: 'esp_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device is damaged such that it may not interrupt the circuit.',
      criteria: 'Visibly defective; impacts functionality.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ESP-03',
      codeReference: "hello"
    }
  ]
};

// 8. Fencing/Gate - Parent category with subcategories for OUTSIDE
export const FENCE_GATE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fencing/Gate',
  deficiencies: []  // Uses subcategories
};

// 8a. Fence and Gate subcategory
export const FENCE_AND_GATE_OUTSIDE: ItemDeficiencies = {
  itemName: 'Fence and Gate',
  deficiencies: [
    {
      id: 'fence_1',
      name: 'Fence components are missing.',
      detail: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
      criteria: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-01',
      codeReference: `🔍 Step 1: Identify Fence/Gate Type and Applicability
• 	Required: Applies to fences and gates that:
• 	Form a security perimeter around parking areas or utility zones
• 	Prevent access to hazardous areas (e.g., drop-offs, retention basins, equipment yards)
• 	Excluded: Decorative or landscape fencing not intended for security or access control

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Fence panels/posts, Gate frame/hardware, Latch/lock mechanism, Foundation/footings
🔧 Step 3: Evaluate Operability & Safety
• 	Gate test:
• 	Open gate fully and confirm smooth movement
• 	Close gate and verify latch/lock engages securely
• 	Attempt to open gate without engaging latch—should remain closed
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Trash, pest nests, or mold around posts and base
• 	Water pooling or erosion near fence footings
• 	IBU Overlay: May require pest-resistant materials, sealed joints, and corrosion-proof hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clear width: Gates used by pedestrians must provide ≥32″ clear opening (CBC §11B-404.2.3)
• 	Handle height: ≤48″ AFF 
• 	Surface transitions: Pathways leading to gates must be firm, stable, and slip-resistant
• 	IBU Overlay: May require tactile signage, visual contrast, or automatic closers in accessible zones
`
    },
    {
      id: 'fence_2',
      name: 'Fence demonstrates signs of collapse.',
      detail: 'Fence demonstrates signs of collapse.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-02',
      codeReference: `🔍 Step 1: Identify Fence/Gate Type and Applicability
• 	Required: Applies to fences and gates that:
• 	Form a security perimeter around parking areas or utility zones
• 	Prevent access to hazardous areas (e.g., drop-offs, retention basins, equipment yards)
• 	Excluded: Decorative or landscape fencing not intended for security or access control

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Fence panels/posts, Gate frame/hardware, Latch/lock mechanism, Foundation/footings
🔧 Step 3: Evaluate Operability & Safety
• 	Gate test:
• 	Open gate fully and confirm smooth movement
• 	Close gate and verify latch/lock engages securely
• 	Attempt to open gate without engaging latch—should remain closed
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Trash, pest nests, or mold around posts and base
• 	Water pooling or erosion near fence footings
• 	IBU Overlay: May require pest-resistant materials, sealed joints, and corrosion-proof hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clear width: Gates used by pedestrians must provide ≥32″ clear opening (CBC §11B-404.2.3)
• 	Handle height: ≤48″ AFF 
• 	Surface transitions: Pathways leading to gates must be firm, stable, and slip-resistant
• 	IBU Overlay: May require tactile signage, visual contrast, or automatic closers in accessible zones
`
    },
    {
      id: 'fence_3',
      name: 'The gate does not open, close, catch, or lock.',
      detail: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-03',
      codeReference: `🔍 Step 1: Identify Fence/Gate Type and Applicability
• 	Required: Applies to fences and gates that:
• 	Form a security perimeter around parking areas or utility zones
• 	Prevent access to hazardous areas (e.g., drop-offs, retention basins, equipment yards)
• 	Excluded: Decorative or landscape fencing not intended for security or access control

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Fence panels/posts, Gate frame/hardware, Latch/lock mechanism, Foundation/footings
🔧 Step 3: Evaluate Operability & Safety
• 	Gate test:
• 	Open gate fully and confirm smooth movement
• 	Close gate and verify latch/lock engages securely
• 	Attempt to open gate without engaging latch—should remain closed
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Trash, pest nests, or mold around posts and base
• 	Water pooling or erosion near fence footings
• 	IBU Overlay: May require pest-resistant materials, sealed joints, and corrosion-proof hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clear width: Gates used by pedestrians must provide ≥32″ clear opening (CBC §11B-404.2.3)
• 	Handle height: ≤48″ AFF 
• 	Surface transitions: Pathways leading to gates must be firm, stable, and slip-resistant
• 	IBU Overlay: May require tactile signage, visual contrast, or automatic closers in accessible zones
`
    }
  ]
};

// Fencing/Gate Subcategories for Outside
export const FENCING_SUBCATEGORIES_OUTSIDE = [
  { id: 'fence_and_gate', name: 'Fence and Gate' }
];

// 9. Fire Safety
export const FIRE_SAFETY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    {
      id: 'fire_1',
      name: 'Exit Sign',
      detail: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated.',
      criteria: 'Damaged, missing, obstructed so \'EXIT\' isn\'t clearly visible, or not properly illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-01',
      codeReference: `🧭 Step 1: Identify Exit Sign Locations
Inspect all permanently installed exit signs that mark emergency egress routes.
NSPIRE does not require exit signs in every building, but if one is present or evidence of prior installation exists, it must be inspected.
🔍 Step 2: Visual Condition Assessment
• 	Legibility: The word “EXIT” must be clearly visible from all approach angles.
• 	Obstruction: Ensure no furniture, signage, or decorations block the sign.
• 	Contrast: Letters must contrast with the background (typically red or green on white).
🧪 Step 3: Functional Testing
• 	Visibility Check: Confirm the sign is clearly visible from all approach angles
• 	Illumination Test: If the sign is powered, press the test button (if present) to verify battery backup
• 	If no button, confirm the sign is lit via AC power or photoluminescence
• 	Mounting Check:
• 	Ensure the sign is securely affixed to the wall or ceiling
• 	Obstruction Scan: Look for any objects blocking the sign or its visibility
Combination units (exit sign + emergency light) must be inspected as two separate items.
📏 Step 4: Accessibility /Code Compliance & IBU Overlay
• 	Height & Placement: Signs must be mounted high enough to be visible but not obstructive
• 	Visual Clarity: Letters must be ≥6" high with a stroke width ≥¾"
• 	Contrast & Illumination: Must be readable by residents with low vision
• 	Directional Arrows: Required if the exit path is not straight ahead
⚒️ Step 5: IRC Fire Safety Requirements
• 	• 	IRC (2021) §R311.4, §R315 – Means of egress and emergency escape
• 	Fire separation walls must not block exit signage or access`
    },
    {
      id: 'fire_2',
      name: 'Fire Escape',
      detail: 'Fire escape component is damaged, or missing.',
      criteria: 'Stair, ladder, platform, guardrail, or handrail is visibly damaged or missing.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-02',
      codeReference: `🧭 Step 1:  Exterior Fire Escape & Ladder Inspection Protocol
Applies to: Multifamily buildings >4 stories
Codes Referenced: IRC, IBC/IBU , NSPIRE 
Focus: Life safety, structural integrity, egress functionality
🔍 Step 2:  Structural Component Checklist
Inspect each element for damage, deterioration, or absence:
Stairs/Ladders, Platforms, Guardrails, Handrails, Anchors/Supports
🛠 NSPIRE defines any missing or damaged fire escape component as a life-threatening deficiency 
🧪 Step 3: Egress & Access Evaluation
• 	Verify clear access from windows or doors to the fire escape.
• 	Check for obstructions: AC units, furniture, debris.
• 	Confirm operability of windows/doors leading to escape.
• 	If blocked, refer to NSPIRE’s Egress Standard.
📏 Step 4: Code Compliance Highlights
IRC / IBC Requirements:
• 	IBC 1009.3: Fire escapes permitted only for existing buildings.
• 	IBC 1011.5.2: Tread depth ≥ 11", riser height ≤ 7".
• 	IBC 1011.11: Handrails required on both sides if >4 risers.
• 	IBC 1015.2: Guardrails ≥ 42" height, openings <4".
• 	IRC R311.7: Exterior stairs must be structurally sound and weather-resistant.
🔍 For buildings over 4 stories, IBC/IBU takes precedence over IRC for fire escape design and retrofit standards.

⚒️ Step 5:  Material & Weathering Assessment
• 	Metal: Inspect for rust, flaking paint, metal fatigue.
• 	Wood (if present): Check for rot, splintering, termite damage.
• 	Fasteners: Look for missing bolts, loose welds, or compromised joints.
• 	Counterbalanced or drop ladders: Confirm smooth operation and locking mechanisms.
`
    },
    {
      id: 'fire_3',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing.',
      criteria: 'Visibly damaged or missing (includes cases where prior installation is evident).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-03',
      codeReference: "hello"
    },
    {
      id: 'fire_4',
      name: 'Fire Extinguisher Pressure',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-04',
      codeReference: "hello"
    },
    {
      id: 'fire_5',
      name: 'Fire Extinguisher Tag',
      detail: 'The fire extinguisher tag is missing, illegible, or expired.',
      criteria: 'Service tag > 1 year OR Tag missing/illegible OR Disposable unit > 12 years old.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-05',
      codeReference: "hello"
    },
    {
      id: 'fire_6',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Improperly stored near ignition sources, thermal appliances, or improperly stored chemicals.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-06',
      codeReference: "hello"
    },
    {
      id: 'fire_7',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-07',
      codeReference: "hello"
    },
    {
      id: 'fire_8',
      name: 'Sprinkler Assembly Corrosion',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-08',
      codeReference: "hello"
    },
    {
      id: 'fire_9',
      name: 'Sprinkler Assembly Debris',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or glass bulb.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-09',
      codeReference: "hello"
    },
    {
      id: 'fire_10',
      name: 'Sprinkler Assembly Obstruction',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'FIRE-10',
      codeReference: "hello"
    }
  ]
};

// 10. Foundation Standard
export const FOUNDATION_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Foundation Standard',
  deficiencies: [
    {
      id: 'found_1',
      name: 'Foundation exposed rebar or Foundation is spalling, flaking, or chipping.',
      detail: 'The structure has exposed rebar. OR The foundation is spalling, flaking, or chipping, and the affected area goes into the foundation at a depth of ¾ inch or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation exhibits a sign of severe failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-01',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Foundation wall, Stem wall or footing, Slab edge, Retaining wall

🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6" fall within first 10′ from foundation (IRC §R401.3)
• 	Drainage path: Ensure water flows away from foundation and does not pond
• 	NSPIRE Deficiency: Standing water or erosion exposing footings = Moderate to Severe

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity near foundation vents or slab edges
• 	Efflorescence or rust stains indicating moisture intrusion
• 	IBU Overlay: May require sealed penetrations, pest-proof vent covers, and moisture-resistant coatings

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Pathway transitions: Ensure accessible routes adjacent to foundation are stable and slip-resistant
• 	Foundation vents: Must be secure and not obstruct accessible paths
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges`
    },
    {
      id: 'found_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-02',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Foundation wall, Stem wall or footing, Slab edge, Retaining wall

🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6" fall within first 10′ from foundation (IRC §R401.3)
• 	Drainage path: Ensure water flows away from foundation and does not pond
• 	NSPIRE Deficiency: Standing water or erosion exposing footings = Moderate to Severe

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity near foundation vents or slab edges
• 	Efflorescence or rust stains indicating moisture intrusion
• 	IBU Overlay: May require sealed penetrations, pest-proof vent covers, and moisture-resistant coatings

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Pathway transitions: Ensure accessible routes adjacent to foundation are stable and slip-resistant
• 	Foundation vents: Must be secure and not obstruct accessible paths
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges`
    },
    {
      id: 'found_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.',
      criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-03',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Foundation wall, Stem wall or footing, Slab edge, Retaining wall

🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6" fall within first 10′ from foundation (IRC §R401.3)
• 	Drainage path: Ensure water flows away from foundation and does not pond
• 	NSPIRE Deficiency: Standing water or erosion exposing footings = Moderate to Severe

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity near foundation vents or slab edges
• 	Efflorescence or rust stains indicating moisture intrusion
• 	IBU Overlay: May require sealed penetrations, pest-proof vent covers, and moisture-resistant coatings

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Pathway transitions: Ensure accessible routes adjacent to foundation are stable and slip-resistant
• 	Foundation vents: Must be secure and not obstruct accessible paths
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges`
    },
    {
      id: 'found_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-04',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Foundation wall, Stem wall or footing, Slab edge, Retaining wall

🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6" fall within first 10′ from foundation (IRC §R401.3)
• 	Drainage path: Ensure water flows away from foundation and does not pond
• 	NSPIRE Deficiency: Standing water or erosion exposing footings = Moderate to Severe

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity near foundation vents or slab edges
• 	Efflorescence or rust stains indicating moisture intrusion
• 	IBU Overlay: May require sealed penetrations, pest-proof vent covers, and moisture-resistant coatings

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Pathway transitions: Ensure accessible routes adjacent to foundation are stable and slip-resistant
• 	Foundation vents: Must be secure and not obstruct accessible paths
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges`
    }
  ]
};

// 11. Hazard
export const HAZARD_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    {
      id: 'hazard_1',
      name: 'Rat',
      detail: 'Evidence of rats.',
      criteria: 'Evidence of rats is found (live/dead rat, droppings, chewed holes).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAZ-01',
      codeReference: "hello"
    },
    {
      id: 'hazard_2',
      name: 'Litter',
      detail: 'Litter is accumulated in an undesignated area.',
      criteria: '10 or more small items or any large discarded items in a 10x10 ft area.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'HAZ-02',
      codeReference: "hello"
    },
    {
      id: 'hazard_3',
      name: 'Sharp edges',
      detail: 'A sharp edge that can result in a cut or puncture hazard is present.',
      criteria: 'Hazard likely to require emergency care (e.g., stitches).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAZ-03',
      codeReference: "hello"
    },
    {
      id: 'hazard_4',
      name: 'Trip hazard',
      detail: 'Trip hazard on walking surface.',
      criteria: 'Abrupt change in elevation of 3/4 inch or more, or horizontal gap of 2 inches or more.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAZ-04',
      codeReference: "hello"
    }
  ]
};

// 12. HVAC - OUTSIDE (single deficiency per user data)
export const HVAC_OUTSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'HVAC',
  deficiencies: [
    {
      id: 'hvac_out_1',
      name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, damaged or missing',
      detail: 'Fuel burning heating system or device is present. AND exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. OR Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Metal tape is not a substitute for an improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'HVAC-OUT-01',
      codeReference: `🔍 Step 1: Identify Exterior HVAC Units
Locate all permanently installed heating and cooling equipment outside the building:
• 	Central air conditioning condensers
• 	Heat pumps and mini-split outdoor units
• 	Combustion-based heating units (e.g., rooftop furnaces)
• 	Utility enclosures or mechanical pads

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Unit housing, Mounting base, Refrigerant lines, Electrical conduit, Exhaust vents

🔧 Step 3: Evaluate Functional Adequacy
• 	Cooling test: Place hand near condenser fan—confirm airflow and vibration
• 	Heating test (if applicable): Confirm exhaust vent is warm and unobstructed
• 	Thermostat linkage: Verify visible control wiring is intact and protected
• 	Exposed live wiring = Life-Threatening (24-hour correction)

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Pest nests, mold, or debris inside or around units
• 	Water pooling or vegetation obstructing airflow
• 	IBU Overlay: May require pest-proof grilles, sealed penetrations, and corrosion-resistant materials

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clearance: Maintain minimum 30" working space around units (CMC §304.3)
• 	Elevation: Units must be above grade to prevent water damage
• 	Labeling: Equipment must be clearly marked with model, fuel type, and disconnect location
• 	IBU Overlay: May require disability-compliant access paths, tactile signage, and safe service access in shared-use zones`
    }
  ]
};

// 12. HVAC - INSIDE (comprehensive deficiencies)
export const HVAC_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'HVAC',
  deficiencies: [
    {
      id: 'hvac_1',
      name: 'Air conditioning system or device is not operational.',
      detail: 'The system or device does not turn on. OR System or device only produces hot or room temperature air.',
      criteria: 'System failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-01',
      codeReference: "hello"
    },
    {
      id: 'hvac_2',
      name: 'Combustion chamber cover or gas shutoff valve missing.',
      detail: 'Missing (evidence of prior installation) from combustion-fueled heating appliance.',
      criteria: 'Previously installed and now not present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-02',
      codeReference: "hello"
    },
    {
      id: 'hvac_3',
      name: 'Fuel-burning exhaust vent misaligned/blocked/damaged/missing.',
      detail: 'Exhaust vent improperly connected, damaged, or missing.',
      criteria: 'Metal tape is not a substitute for improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-03',
      codeReference: "hello"
    },
    {
      id: 'hvac_4',
      name: 'Heating system or device safety shield is damaged or missing.',
      detail: 'Safety shield is damaged or missing (evidence of prior installation).',
      criteria: 'Safety shield was previously installed and is now not present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-04',
      codeReference: "hello"
    },
    {
      id: 'hvac_5',
      name: 'Heating source damaged/inoperable/missing (Apr 1 - Sep 30).',
      detail: 'Permanently installed heating source damaged, inoperable, missing, or not installed.',
      criteria: 'Outside temp below 68 F and heating source issue.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-05',
      codeReference: "hello"
    },
    {
      id: 'hvac_6',
      name: 'Heating source not working (Oct 1 - Mar 31).',
      detail: 'Permanently installed heating source not working OR working but interior temp < 64 F.',
      criteria: 'Source not working to create heat.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-06',
      codeReference: "hello"
    },
    {
      id: 'hvac_7',
      name: 'Unvented space heater is present.',
      detail: 'Unvented space heater that burns gas, oil, or kerosene is present.',
      criteria: 'Includes common areas.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-07',
      codeReference: "hello"
    }
  ]
};

// 13. Leak – Gas or Oil
export const LEAK_GAS_OIL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak – Gas or Oil',
  deficiencies: [
    {
      id: 'leak_gas_1',
      name: 'Natural gas, propane, or oil leak.',
      detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
      criteria: 'Natural gas, propane, or oil leak.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'LEAK-GAS-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where gas or oil systems are present:
• 	Gas meters and regulators
• 	Fuel piping and appliance connectors
• 	Oil tanks or fuel storage containers
• 	Combustion appliance exhaust vents
• 	Mechanical pads and utility enclosures

🧱 Step 2: Assess Structural Integrity of Fuel System Components
Inspect for physical damage, corrosion, or improper installation:
• 	Gas meters and regulators
• 	Fuel piping and appliance connectors
• 	Oil tanks or fuel storage containers
• 	Combustion appliance exhaust vents
• 	Mechanical pads and utility enclosures

🔧 Step 3: Detect Signs of Active or Potential Leaks
Use visual and sensory cues to identify hazards:
• 	Gas leaks:
• 	Smell of sulfur or “rotten eggs” (mercaptan additive)
• 	Dead vegetation near buried lines
• 	Hissing sounds from fittings or valves
• 	Oil leaks:
• 	Visible pooling or staining on concrete or soil
• 	Strong petroleum odor
• 	Discoloration or sheen on nearby surfaces

🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Oil-soaked soil or vegetation
• 	Gas line corrosion near irrigation systems or drainage paths
• 	Improper disposal or containment of fuel residues
• 	IBU Overlay: May require spill containment, corrosion-resistant materials, and sealed penetrations

🧠 Step 5: Verify Accessibility & Local Compliance
• 	Shutoff valves: Must be accessible and clearly marked (IRC §G2420.1.3)
• 	Labeling: Fuel systems must be labeled with type, source, and emergency contact
• 	Clearance: Maintain minimum working space around fuel systems (CMC §304.3)
• 	IBU Overlay: May require ADA-compliant access paths, tactile signage, and safe service access in shared-use zones`
    }
  ]
};

// 14. Leak - sewage system
export const LEAK_SEWAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak - sewage system',
  deficiencies: [
    {
      id: 'leak_sew_1',
      name: 'Blocked sewage system.',
      detail: 'Wastewater is unable to drain resulting in sewer backup.',
      criteria: 'Blocked sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LEAK-SEW-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on exterior areas where sewage infrastructure is exposed or vulnerable:\n• \tSewer cleanouts and lateral connections\n• \tManholes and inspection ports\n• \tDrainage lines near parking lots, trash enclosures, and utility pads\n• \tCrawl space vents and foundation edges\n• \tRetention basins or sump pump discharge zones\n🧱 Step 2: Assess Structural Integrity of System Components\nInspect for damage, displacement, or improper installation:\nSewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations\n🧼 Step 3: Detect Signs of Active or Residual Leakage\nUse visual and sensory cues to identify hazards:\n• \tWet soil or pooling near sewer lines or cleanouts\n• \tToilet paper, sludge, or effluent visible on ground surface\n• \tStrong sewage odor in localized areas\n• \tGrease or biofilm on walls or pavement near discharge points\n• \tPest activity (flies, rodents) concentrated around suspected leak zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tCleanout access: Must be unobstructed and reachable for service\n• \tSurface transitions: No trip hazards or obstructions near sewer infrastructure\n• \tSignage: If active repair or mitigation is underway, warning signs must be posted\n• \tIBU Overlay: May require diability-compliant access paths, sealed penetrations, and pest-resistant enclosures\n🔧 Step 5: Evaluate Mitigation Measures\n• \tContainment: Check for temporary barriers, sandbags, or spill trays\n• \tRepair status: Look for exposed tools, open trenches, or active work zones\n• \tDocumentation: Confirm presence of work orders or service tags if repairs are in progress\nIRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity`
    },
    {
      id: 'leak_sew_2',
      name: 'Cap to the cleanout or pump cover is detached or missing.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on exterior areas where sewage infrastructure is exposed or vulnerable:\n• \tSewer cleanouts and lateral connections\n• \tManholes and inspection ports\n• \tDrainage lines near parking lots, trash enclosures, and utility pads\n• \tCrawl space vents and foundation edges\n• \tRetention basins or sump pump discharge zones\n🧱 Step 2: Assess Structural Integrity of System Components\nInspect for damage, displacement, or improper installation:\nSewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations\n🧼 Step 3: Detect Signs of Active or Residual Leakage\nUse visual and sensory cues to identify hazards:\n• \tWet soil or pooling near sewer lines or cleanouts\n• \tToilet paper, sludge, or effluent visible on ground surface\n• \tStrong sewage odor in localized areas\n• \tGrease or biofilm on walls or pavement near discharge points\n• \tPest activity (flies, rodents) concentrated around suspected leak zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tCleanout access: Must be unobstructed and reachable for service\n• \tSurface transitions: No trip hazards or obstructions near sewer infrastructure\n• \tSignage: If active repair or mitigation is underway, warning signs must be posted\n• \tIBU Overlay: May require diability-compliant access paths, sealed penetrations, and pest-resistant enclosures\n🔧 Step 5: Evaluate Mitigation Measures\n• \tContainment: Check for temporary barriers, sandbags, or spill trays\n• \tRepair status: Look for exposed tools, open trenches, or active work zones\n• \tDocumentation: Confirm presence of work orders or service tags if repairs are in progress\nIRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity`
    },
    {
      id: 'leak_sew_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on exterior areas where sewage infrastructure is exposed or vulnerable:\n• \tSewer cleanouts and lateral connections\n• \tManholes and inspection ports\n• \tDrainage lines near parking lots, trash enclosures, and utility pads\n• \tCrawl space vents and foundation edges\n• \tRetention basins or sump pump discharge zones\n🧱 Step 2: Assess Structural Integrity of System Components\nInspect for damage, displacement, or improper installation:\nSewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations\n🧼 Step 3: Detect Signs of Active or Residual Leakage\nUse visual and sensory cues to identify hazards:\n• \tWet soil or pooling near sewer lines or cleanouts\n• \tToilet paper, sludge, or effluent visible on ground surface\n• \tStrong sewage odor in localized areas\n• \tGrease or biofilm on walls or pavement near discharge points\n• \tPest activity (flies, rodents) concentrated around suspected leak zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tCleanout access: Must be unobstructed and reachable for service\n• \tSurface transitions: No trip hazards or obstructions near sewer infrastructure\n• \tSignage: If active repair or mitigation is underway, warning signs must be posted\n• \tIBU Overlay: May require diability-compliant access paths, sealed penetrations, and pest-resistant enclosures\n🔧 Step 5: Evaluate Mitigation Measures\n• \tContainment: Check for temporary barriers, sandbags, or spill trays\n• \tRepair status: Look for exposed tools, open trenches, or active work zones\n• \tDocumentation: Confirm presence of work orders or service tags if repairs are in progress\nIRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity`
    },
    {
      id: 'leak_sew_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LEAK-SEW-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on exterior areas where sewage infrastructure is exposed or vulnerable:\n• \tSewer cleanouts and lateral connections\n• \tManholes and inspection ports\n• \tDrainage lines near parking lots, trash enclosures, and utility pads\n• \tCrawl space vents and foundation edges\n• \tRetention basins or sump pump discharge zones\n🧱 Step 2: Assess Structural Integrity of System Components\nInspect for damage, displacement, or improper installation:\nSewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations\n🧼 Step 3: Detect Signs of Active or Residual Leakage\nUse visual and sensory cues to identify hazards:\n• \tWet soil or pooling near sewer lines or cleanouts\n• \tToilet paper, sludge, or effluent visible on ground surface\n• \tStrong sewage odor in localized areas\n• \tGrease or biofilm on walls or pavement near discharge points\n• \tPest activity (flies, rodents) concentrated around suspected leak zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tCleanout access: Must be unobstructed and reachable for service\n• \tSurface transitions: No trip hazards or obstructions near sewer infrastructure\n• \tSignage: If active repair or mitigation is underway, warning signs must be posted\n• \tIBU Overlay: May require diability-compliant access paths, sealed penetrations, and pest-resistant enclosures\n🔧 Step 5: Evaluate Mitigation Measures\n• \tContainment: Check for temporary barriers, sandbags, or spill trays\n• \tRepair status: Look for exposed tools, open trenches, or active work zones\n• \tDocumentation: Confirm presence of work orders or service tags if repairs are in progress\nIRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity`
    }
  ]
};

// 15. Leak - water
export const LEAK_WATER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak - water',
  deficiencies: [
    {
      id: 'leak_water_1',
      name: 'Fluid is leaking from the sprinkler assembly.',
      detail: 'Fluid is leaking from the sprinkler assembly.',
      criteria: 'Fluid is leaking from the sprinkler assembly.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'LEAK-WATER-01',
      codeReference: `🔍 Step 1: Identify High-Risk Zones\nFocus on exterior areas where water intrusion or plumbing leaks are most likely:\n• \tHose bibs, irrigation lines, and exposed plumbing\n• \tExterior walls, windows, and door thresholds\n• \tRoof edges, gutters, and downspouts\n• \tUtility enclosures, water heaters, and sprinkler assemblies\n• \tCrawl space vents and foundation edges\n🧱 Step 2: Assess Structural Integrity\nInspect for damage or deterioration caused by water exposure:\nWall cladding, Foundation, Pipe fitting, Sprinkler assembly\n🔧 Step 3: Detect Active or Residual Leaks\nUse visual and sensory cues to identify water-related hazards:\n• \tActive leaks: Dripping, spraying, or flowing water from any component\n• \tResidual signs: Water stains, efflorescence, rust streaks, or algae growth\n• \tOdor check: Musty or damp smells near walls or utility enclosures\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tStanding water near walkways, foundations, or trash areas\n• \tMold, mildew, or pest activity around leak zones\n• \tSlip hazards from wet surfaces or algae buildup\n• \tIBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Water must not obstruct diability-compliant paths\n• \tThresholds and ramps: Must remain dry, firm, and slip-resistant\n• \tSignage: If leak mitigation is active, warning signs must be posted\n• \tIBU Overlay: May require tactile warnings, visual contrast, and safe detours around leak zones\nIRC §R703.1 requires exterior walls to resist water penetration and protect structural framing`
    },
    {
      id: 'leak_water_2',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak.',
      severity: 'Low',
      repairBy: '30 Day',
      points: '2.00/n',
      code: 'LEAK-WATER-02',
      codeReference: `🔍 Step 1: Identify High-Risk Zones\nFocus on exterior areas where water intrusion or plumbing leaks are most likely:\n• \tHose bibs, irrigation lines, and exposed plumbing\n• \tExterior walls, windows, and door thresholds\n• \tRoof edges, gutters, and downspouts\n• \tUtility enclosures, water heaters, and sprinkler assemblies\n• \tCrawl space vents and foundation edges\n🧱 Step 2: Assess Structural Integrity\nInspect for damage or deterioration caused by water exposure:\nWall cladding, Foundation, Pipe fitting, Sprinkler assembly\n🔧 Step 3: Detect Active or Residual Leaks\nUse visual and sensory cues to identify water-related hazards:\n• \tActive leaks: Dripping, spraying, or flowing water from any component\n• \tResidual signs: Water stains, efflorescence, rust streaks, or algae growth\n• \tOdor check: Musty or damp smells near walls or utility enclosures\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tStanding water near walkways, foundations, or trash areas\n• \tMold, mildew, or pest activity around leak zones\n• \tSlip hazards from wet surfaces or algae buildup\n• \tIBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Water must not obstruct diability-compliant paths\n• \tThresholds and ramps: Must remain dry, firm, and slip-resistant\n• \tSignage: If leak mitigation is active, warning signs must be posted\n• \tIBU Overlay: May require tactile warnings, visual contrast, and safe detours around leak zones\nIRC §R703.1 requires exterior walls to resist water penetration and protect structural framing`
    }
  ]
};

// 16. Lighting
export const LIGHTING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: [
    {
      id: 'light_1',
      name: 'Auxiliary lighting damaged/missing.',
      detail: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
      criteria: 'Not present or inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LIGHT-01',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    },
    {
      id: 'light_2',
      name: 'Interior lighting inoperable.',
      detail: 'A permanently installed light fixture is inoperable.',
      criteria: 'Not meeting function.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-02',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    },
    {
      id: 'light_3',
      name: 'Interior lighting not secure.',
      detail: 'A permanently installed light fixture is not secure.',
      criteria: 'Attachment not stable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-03',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    },
    {
      id: 'light_4',
      name: 'Interior lighting missing (Kitchen/Restroom).',
      detail: 'At least one permanently installed light fixture is not present in kitchen or restroom.',
      criteria: 'Missing or not functioning.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-04',
      codeReference: `🔍 Step 1: Identify Lighting Zones\nInspect all permanently installed lighting fixtures in:\n• \tEntryways and exit doors\n• \tWalkways, ramps, and stairs\n• \tParking lots and drive aisles\n• \tTrash enclosures and mailboxes\n• \tCommon areas and recreational zones\n🧱 Step 2: Assess Structural Integrity of Fixtures\nInspect for physical damage, improper installation, or missing components:\nFixture housing, Mounting hardware, Lens or cover, Wiring/conduit\n🔧 Step 3: Test Functionality & Illumination\n• \tPower test: Confirm fixture turns on via switch, timer, or sensor\n• \tBrightness check: Ensure adequate illumination for safe navigation\n• \tCoverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tPest nests, mold, or water intrusion inside fixtures\n• \tDebris or vegetation obstructing light output\n• \tIBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tMounting height: Fixtures must not obstruct accessible routes or signage\n• \tControl access: Switches must be reachable (≤48″ AFF) and labeled\n• \tVisual contrast: Lighting must support visibility for tactile and directional signage\n• \tIBU Overlay: May require disabilty-compliant illumination levels and emergency backup lighting in shared-use zones\nIRC §R303.8 requires illumination at exterior egress doors for safety and accessibility\n📸 Step 6: Document & Report`
    }
  ]
};

// 17. Parking lots, Driveways, Roads
export const PARKING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Parking lots, Driveways, Roads',
  deficiencies: [
    {
      id: 'park_1',
      name: 'Parking Lot Potholes',
      detail: 'The parking lot has any one pothole greater than 4 inches deep and 1 square foot or more.',
      criteria: 'Single pothole over 4 inches deep/1 sq ft OR multiple potholes exceeding limits.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    },
    {
      id: 'park_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'Significant ponding making area unusable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    },
    {
      id: 'park_3',
      name: 'Private Roads and Driveways',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      criteria: 'Blocked access (not including temporary obstruction).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PARK-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    },
    {
      id: 'park_4',
      name: 'Private Roads Potholes',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all vehicle-accessible and pedestrian-adjacent surfaces:\n• \tParking lots (resident, visitor, accessible spaces)\n• \tDriveways (private access lanes, shared approaches)\n• \tPrivate roads (internal circulation routes)\n• \tCurbing, gutters, and expansion joints\n• \tUtility access covers and drainage grates\n🧱 Step 2: Assess Structural Integrity\nInspect for surface damage, instability, or obstruction:\nSurface condition, Cracks or heaving, Obstructions, Curbing & joints\n• \tIRC §R309.1–R309.2 – Driveway and garage access requirements\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tOil stains, litter, or standing water\n• \tMold, algae, or pest activity near drainage zones\n• \tTrash overflow or illegal dumping in parking areas\n• \tIBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible parking: Must include van-accessible spaces with proper signage and striping\n• \tPathway transitions: Curb ramps must be flush and slip-resistant\n• \tDriveway slope: Must not exceed 1:12 for accessible routes\n• \tIBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage\n🔧 Step 5: Evaluate Lighting, Signage & Wayfinding\n• \tLighting: Confirm fixtures are operational and provide adequate coverage\n• \tSignage: Verify directional, speed limit, and accessible parking signs are present and legible\n• \tGate access: Ensure automatic or manual gates are functional and safe for pedestrian use`
    }
  ]
};

// 18. Paint - Lead-Based Paint
export const PAINT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Paint - Lead-Based Paint',
  deficiencies: [
    {
      id: 'paint_1',
      name: 'Less than 2 SF - Paint in a Unit or inside the target property is deteriorated, below the level required for lead-safe work practices by a lead-certified firm or for passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PAINT-01',
      codeReference: `🔍 Step 1: Determine Applicability\n• \tConfirm year of construction:\n• \tIf pre-1978, presume all painted exterior surfaces may contain lead unless certified testing proves otherwise\n• \tIdentify painted exterior components:\n• \tSiding, trim, fascia, soffits, railings, fencing, doors, windows, decks, and staircases\n🧱 Step 2: Assess Paint Condition\nInspect for deterioration, friction, or impact damage:\nLarge surfaces, Small components, Friction surfaces,\nCross-reference: Note IRC §R703.1, NSPIRE lead paint standard, inspection protocol, and IBU overlays\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tLook for:\n• \tPaint chips or dust on soil, walkways, or window wells\n• \tWater damage or mold accelerating paint deterioration\n• \tPest activity around damaged painted surfaces\n• \tIBU Overlay: May require containment, soil testing, and pest-proofing near deteriorated paint zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible routes: Deteriorated paint must not obstruct or contaminate diability paths\n• \tVisual contrast: Paint loss must not impair visibility of signage or tactile indicators\n• \tIBU Overlay: May require protective barriers, signage, and safe detours during remediation\n🧪 Step 5: Confirm Testing or Presumption\n• \tIf available, review:\n• \tXRF testing reports or paint chip analysis from certified inspectors\n• \tRisk assessments or abatement records\n• \tIf no documentation exists, presume lead-based paint`
    },
    {
      id: 'paint_2',
      name: 'More than 2 SF - Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
      criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PAINT-02',
      codeReference: `🔍 Step 1: Determine Applicability\n• \tConfirm year of construction:\n• \tIf pre-1978, presume all painted exterior surfaces may contain lead unless certified testing proves otherwise\n• \tIdentify painted exterior components:\n• \tSiding, trim, fascia, soffits, railings, fencing, doors, windows, decks, and staircases\n🧱 Step 2: Assess Paint Condition\nInspect for deterioration, friction, or impact damage:\nLarge surfaces, Small components, Friction surfaces,\nCross-reference: Note IRC §R703.1, NSPIRE lead paint standard, inspection protocol, and IBU overlays\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tLook for:\n• \tPaint chips or dust on soil, walkways, or window wells\n• \tWater damage or mold accelerating paint deterioration\n• \tPest activity around damaged painted surfaces\n• \tIBU Overlay: May require containment, soil testing, and pest-proofing near deteriorated paint zones\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tAccessible routes: Deteriorated paint must not obstruct or contaminate diability paths\n• \tVisual contrast: Paint loss must not impair visibility of signage or tactile indicators\n• \tIBU Overlay: May require protective barriers, signage, and safe detours during remediation\n🧪 Step 5: Confirm Testing or Presumption\n• \tIf available, review:\n• \tXRF testing reports or paint chip analysis from certified inspectors\n• \tRisk assessments or abatement records\n• \tIf no documentation exists, presume lead-based paint`
    }
  ]
};

// 19. Railings
export const RAILINGS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: [
    {
      id: 'rail_1',
      name: 'Guardrail Missing',
      detail: 'The guardrail is missing or not installed, limiting its safe use.',
      criteria: 'Missing along a walking surface over 30 inches above the floor or grade.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'RAIL-01',
      codeReference: "hello"
    },
    {
      id: 'rail_2',
      name: 'Guardrail Damaged',
      detail: 'Guardrail component is missing or damaged.',
      criteria: 'Missing critical components, visibly damaged, under 30 inches, or not securely attached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-02',
      codeReference: "hello"
    },
    {
      id: 'rail_3',
      name: 'Handrail Missing',
      detail: 'Handrail is missing (evidence of prior installation).',
      criteria: 'Handrail is missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-03',
      codeReference: "hello"
    },
    {
      id: 'rail_4',
      name: 'Handrail Not Functionally Adequate',
      detail: 'Handrail cannot reasonably be grasped, is not continuous, or is not between 28-42 inches high.',
      criteria: 'Handrail is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-04',
      codeReference: "hello"
    },
    {
      id: 'rail_5',
      name: 'Handrail Not Installed Where Required',
      detail: '4 or more stair risers are present OR ramp has rise >6 inches/projection >72 inches.',
      criteria: 'Handrail not installed where required.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RAIL-05',
      codeReference: "hello"
    },
    {
      id: 'rail_6',
      name: 'Handrail Not Secured',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'Handrail is not secured.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-06',
      codeReference: "hello"
    }
  ]
};

// 20. Roof Assembly
export const ROOF_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Roof Assembly',
  deficiencies: [
    {
      id: 'roof_1',
      name: 'Restricted flow of water from a roof drain, gutter, or downspout.',
      detail: 'Debris is limiting the ability of water to drain; water may not be present. Or an area of approximately 25 sq. ft. of ponding water is located above the drain. OR Gutter component is damaged (i.e., visibly defective; impacts functionality). OR Gutter component is missing (i.e., evidence of prior installation, but now not present or is incomplete). OR Gutter component is unfixed.',
      criteria: 'The condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-01',
      codeReference: `🔍 Step 1: Identify Roofing & Drainage Components
• Locate all exterior roof surfaces, gutter systems, and drainage elements:
• Primary roof covering, Gutters, downspouts, and extensions, Roof drains, scuppers, and overflows, Fascia and soffit areas
• Confirm components are intended to redirect water away from structures and pedestrian paths

🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
• Roofing material, Gutter/downspout assembly, Drainage inlets/outlets, Fasteners and flashing

🔧 Step 3: Evaluate Functional Adequacy
• Water flow test (if safe): Pour water into gutters/drains and observe flow and discharge
• Standing water check: Look for pooling on roof surfaces or in gutters indicative of blockage
• Obstruction scan: Confirm systems are free of debris, leaves, sediment, or vegetation

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, algae, or pest nests in gutters or around drain inlets
• Water stains or erosion on adjacent walls or foundations
• IBU Overlay: May require pest-proof grates, sealed joints, and overflow protection

🧠 Step 5: Verify Accessibility & Local Compliance
• Discharge placement: Downspouts must not discharge onto accessible routes or egress paths
• Component security: Gutters and fascia must be securely affixed to prevent overhead hazards
• IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near roof-level walkways`
    },
    {
      id: 'roof_2',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-02',
      codeReference: `🔍 Same inspection protocol as ROOF-OUT-01 with focus on:
• Identify unintentional holes of any size
• Check intentional holes for proper venting or screens
• Document location and size of penetrations`
    },
    {
      id: 'roof_3',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-03',
      codeReference: `🔍 Same inspection protocol as ROOF-OUT-01 with focus on:
• Structural damage to roof components
• Component instability
• Potential for cascading failures`
    },
    {
      id: 'roof_4',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-04',
      codeReference: `🔍 Same inspection protocol as ROOF-OUT-01 with focus on:
• Measure ponding area (≥25 sq ft)
• Location not near drain/scupper
• Document drainage issues`
    },
    {
      id: 'roof_5',
      name: 'Substrate is exposed.',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Visually observed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-05',
      codeReference: `🔍 Same inspection protocol as ROOF-OUT-01 with focus on:
• Exposed substrate under roofing material
• Document location and extent
• Potential for water infiltration`
    }
  ]
};

// 21. Sidewalk, walkway, and ramp
export const SIDEWALK_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sidewalk, walkway, and ramp',
  deficiencies: [
    {
      id: 'side_1',
      name: 'Sidewalk, walkway, or ramp is blocked or impassable.',
      detail: 'Sidewalk, walkway, or ramp is blocked or impassable.',
      criteria: 'The Sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SIDE-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all pedestrian-accessible exterior surfaces:
• Sidewalks and paved walkways
• Ramps and landings
• Curb transitions and flared sides
• Paths leading to unit entries, mailboxes, trash enclosures, and parking areas

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or unsafe dimensional changes:
• Surface cracks, Heaving/settlement, Loose materials, Ramp slope, Missing guardrails
• IRC §R311.7–R311.8 – Stairways, ramps, and walking surfaces

🧼 Step 3: Check Sanitation & Environmental Safety
• Inspect for:
• Trash, debris, or vegetation obstructing the path
• Standing water, mold, or algae creating slip hazards
• Pest activity near shaded or overgrown areas
• IBU Overlay: May require sealed joints, pest-resistant landscaping, and proper drainage grading

🧠 Step 4: Verify Accessibility & Local Compliance
• Clear width: Minimum 36″ unobstructed
• Vertical clearance: ≥80″ from walking surface (UFAS standard)
• Surface finish: Firm, stable, and slip-resistant
• Edge protection: Required at ramps and elevated walkways without curbs
• IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant transitions

🔧 Step 5: Evaluate Functional Adequacy
• Obstruction check: Look for fixed objects, vehicles, or overgrowth blocking path
• Ramp landing: Confirm level landings at top and bottom of ramps
• Handrails: Required on ramps with rise >6″; must be continuous and graspable`
    },
    {
      id: 'side_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SIDE-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all pedestrian-accessible exterior surfaces:\n• \tSidewalks and paved walkways\n• \tRamps and landings\n• \tCurb transitions and flared sides\n• \tPaths leading to unit entries, mailboxes, trash enclosures, and parking areas\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or unsafe dimensional changes:\nSurface cracks, Heaving/settlement, Loose materials, Ramp slope, Missing guardrails\n• \tIRC §R311.7–R311.8 – Stairways, ramps, and walking surfaces\n🧼 Step 3: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tTrash, debris, or vegetation obstructing the path\n• \tStanding water, mold, or algae creating slip hazards\n• \tPest activity near shaded or overgrown areas\n• \tIBU Overlay: May require sealed joints, pest-resistant landscaping, and proper drainage grading\n🧠 Step 4: Verify Accessibility & Local Compliance\n• \tClear width: Minimum 36″ unobstructed\n• \tVertical clearance: ≥80″ from walking surface (UFAS standard)\n• \tSurface finish: Firm, stable, and slip-resistant\n• \tEdge protection: Required at ramps and elevated walkways without curbs\n• \tIBU Overlay: May require tactile warnings, visual contrast, and diability-compliant transitions\n🔧 Step 5: Evaluate Functional Adequacy\n• \tObstruction check: Look for fixed objects, vehicles, or overgrowth blocking path\n• \tRamp landing: Confirm level landings at top and bottom of ramps\n• \tHandrails: Required on ramps with rise >6″; must be continuous and graspable`
    }
  ]
};

// 22. Step and Stairs
export const STAIRS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Step and Stairs',
  deficiencies: [
    {
      id: 'stair_1',
      name: 'Step or stair is not functionally adequate.',
      detail: 'Step or stair is not functionally adequate (i.e., may not allow for personal traffic from one level to the next).',
      criteria: 'Damaged or deterioration, unintentional dimensional changes that may interrupt a person\'s walking pattern or movement, or unstable material.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior stairways and steps that:
• Serve unit entries, common areas, or accessible paths
• Connect walkways, parking lots, patios, or elevated landings
• Include stair flights, landings, and transitions to ramps or sidewalks

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
• Treads & risers, Stringers, Landings, Guardrails, Handrails

🔧 Step 3: Evaluate Safety & Functionality
• Stability test: Apply moderate pressure to treads, risers, and railings
• Height check: Measure riser and tread dimensions for consistency
• Handrail check: Confirm graspable profile, continuous length, and proper mounting
• IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅜″ variation across the flight height (34–38″ AFF)
• IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, algae, or pest nests on or under steps
• Trash, debris, or vegetation obstructing stairways
• Water pooling or erosion at stair base or landings
• IBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Clear width: Minimum 36″ unobstructed
• Edge protection: Required at open sides of stairways and landings
• Visual contrast: Required for nosings and landings for low-vision users
• IBU Overlay: May require tactile warnings, disability compliant handrails, and extended landings`
    },
    {
      id: 'stair_2',
      name: 'Stringer damaged.',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiency is observed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior stairways and steps that:\n• \tServe unit entries, common areas, or accessible paths\n• \tConnect walkways, parking lots, patios, or elevated landings\n• \tInclude stair flights, landings, and transitions to ramps or sidewalks\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nTreads & risers, Stringers, Landings, Guardrails, Handrails\n🔧 Step 3: Evaluate Safety & Functionality\n• \tStability test: Apply moderate pressure to treads, risers, and railings\n• \tHeight check: Measure riser and tread dimensions for consistency\n• \tHandrail check: Confirm graspable profile, continuous length, and proper mounting IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅞″ variation across the flight height (34–38″ AFF), IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, algae, or pest nests on or under steps\n• \tTrash, debris, or vegetation obstructing stairways\n• \tWater pooling or erosion at stair base or landings\n• \tIBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tClear width: Minimum 36″ unobstructed\n• \tEdge protection: Required at open sides of stairways and landings\n• \tVisual contrast: Required for nosings and landings for low-vision users\n• \tIBU Overlay: May require tactile warnings, disabilty compliant handrails, and extended landings`
    },
    {
      id: 'stair_3',
      name: 'Tread is missing or damaged.',
      detail: 'Tread on a set of stairs is missing Or tread on a set of stairs is loose or unlevel. Or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
      criteria: 'Accessory treads are present and verified to be functional.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior stairways and steps that:\n• \tServe unit entries, common areas, or accessible paths\n• \tConnect walkways, parking lots, patios, or elevated landings\n• \tInclude stair flights, landings, and transitions to ramps or sidewalks\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nTreads & risers, Stringers, Landings, Guardrails, Handrails\n🔧 Step 3: Evaluate Safety & Functionality\n• \tStability test: Apply moderate pressure to treads, risers, and railings\n• \tHeight check: Measure riser and tread dimensions for consistency\n• \tHandrail check: Confirm graspable profile, continuous length, and proper mounting IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅞″ variation across the flight height (34–38″ AFF), IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, algae, or pest nests on or under steps\n• \tTrash, debris, or vegetation obstructing stairways\n• \tWater pooling or erosion at stair base or landings\n• \tIBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tClear width: Minimum 36″ unobstructed\n• \tEdge protection: Required at open sides of stairways and landings\n• \tVisual contrast: Required for nosings and landings for low-vision users\n• \tIBU Overlay: May require tactile warnings, disabilty compliant handrails, and extended landings`
    }
  ]
};

// 23. Structural
export const STRUCTURAL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Structural',
  deficiencies: [
    {
      id: 'struct_1',
      name: 'Structural system exhibits signs of serious failure.',
      detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety.',
      criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'STRUCT-01',
      codeReference: `🔍 Step 1: Identify Structural Elements for Inspection
Focus on all exterior-facing structural components:
• Load-bearing walls and framing
• Foundation walls and footings
• Exterior cladding (stucco, siding, masonry)
• Structural columns, beams, and supports
• Parapets, balconies, and cantilevered elements
• Roof-to-wall connections and overhangs

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
• Wall surfaces, Foundation, Columns & beams, Cladding, Structural joints
• IRC §R301.1 requires buildings to safely support loads and resist environmental forces

🔧 Step 3: Evaluate Functional Stability
• Plumb check: Use visual reference or level to assess vertical alignment of walls and columns
• Crack mapping: Document location, length, and width of structural cracks
• Load path review: Confirm visible supports are continuous and not compromised

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest nests in wall cavities or under cladding
• Water stains, efflorescence, or algae indicating moisture intrusion
• Trash or vegetation accumulating near structural elements
• IBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Accessible routes: Structural elements must not obstruct any paths or egress zones
• Visual contrast: Required for structural edges near walkways or ramps
• Edge protection: Required at elevated platforms and balconies
• IBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to structural service zones`
    }
  ]
};

// 24. RETAINING WALL
export const RETAINING_WALL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'RETAINING WALL',
  deficiencies: [
    {
      id: 'ret_1',
      name: 'Retaining wall is leaning.',
      detail: 'Retaining wall is leaning away from the fill side.',
      criteria: 'Retaining wall is leaning away from the fill side.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior-facing vertical structures:
• Retaining walls supporting soil or grade transitions
• Exterior walls enclosing habitable spaces
• Freestanding walls adjacent to walkways, parking, or landscaping
• Walls with penetrations (windows, doors, vents, utility lines)

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
• Wall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes
• IRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced
• Mandates engineered design for retaining walls >4′

🔧 Step 3: Evaluate Functional Stability
• Plumb check: Use visual reference or level to assess vertical alignment
• Crack mapping: Document location, length, and width of structural cracks
• Drainage check: Confirm retaining walls have functional weep holes or drainage paths

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest nests in wall cavities or behind cladding
• Water stains, efflorescence, or algae indicating moisture intrusion
• Trash or vegetation accumulating near wall bases or joints
• IBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Accessible routes: Walls must not obstruct ADA paths or egress zones
• Visual contrast: Required for wall edges near walkways or ramps
• Edge protection: Required at retaining walls adjacent to pedestrian routes
• IBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'ret_2',
      name: 'Retaining wall collapsed.',
      detail: 'The retaining wall is partially or completely collapsed.',
      criteria: 'The retaining wall is partially or completely collapsed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'ret_3',
      name: 'Exterior wall not functionally adequate.',
      detail: 'Impacts integrity of wall assembly or building envelope.',
      criteria: 'Does not allow exterior wall to separate the accommodation inside from outside.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'ret_4',
      name: 'Exterior wall covering missing.',
      detail: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      criteria: 'Cumulatively 1 sq ft or more missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    },
    {
      id: 'ret_5',
      name: 'Exterior wall peeling paint.',
      detail: 'Exterior wall has peeling paint of 10 square feet or more.',
      criteria: 'Cumulatively 10 sq ft or more peeling paint (built after 1978).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-05',
      codeReference: `🔍 Step 1: Identify Inspection Zones\nFocus on all exterior-facing vertical structures:\n• \tRetaining walls supporting soil or grade transitions\n• \tExterior walls enclosing habitable spaces\n• \tFreestanding walls adjacent to walkways, parking, or landscaping\n• \tWalls with penetrations (windows, doors, vents, utility lines)\n🧱 Step 2: Assess Structural Integrity\nInspect for signs of failure, movement, or deterioration:\nWall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes\nIRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced, Mandates engineered design for retaining walls >4′\n🔧 Step 3: Evaluate Functional Stability\n• \tPlumb check: Use visual reference or level to assess vertical alignment\n• \tCrack mapping: Document location, length, and width of structural cracks\n• \tDrainage check: Confirm retaining walls have functional weep holes or drainage paths\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, mildew, or pest nests in wall cavities or behind cladding\n• \tWater stains, efflorescence, or algae indicating moisture intrusion\n• \tTrash or vegetation accumulating near wall bases or joints\n• \tIBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tAccessible routes: Walls must not obstruct ADA paths or egress zones\n• \tVisual contrast: Required for wall edges near walkways or ramps\n• \tEdge protection: Required at retaining walls adjacent to pedestrian routes\n• \tIBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to wall-mounted features`
    }
  ]
};

// 25. Water Heater
export const WATER_HEATER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Water Heater',
  deficiencies: [
    {
      id: 'wh_1',
      name: 'Chimney or flue piping is blocked, misaligned, or missing.',
      detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'The vent is damaged, misaligned, or not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'WH-01',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location
• Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• Located in:
• Exterior closets or enclosures
• Utility alcoves or mechanical pads
• Rooftop or ground-mounted service areas
• Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4

🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
• Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
• IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection

🔧 Step 3: Evaluate Functional Safety
• Leak check: Look for active dripping from fittings, tank seams, or relief valve
• T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade
• Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)

🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, algae, or pest activity around enclosure or base
• Water stains or corrosion on adjacent walls or slab
• Trash or vegetation obstructing access or airflow
• IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Service access: Minimum 30″ clear working space
• Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• Labeling: Unit must be marked with fuel type, capacity, and emergency shutoff location
• IBU Overlay: May require tactile signage, lockable access doors, and disability-compliant paths to shared-use equipment`
    },
    {
      id: 'wh_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
      criteria: 'Unable to shut off gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '24.8/n',
      code: 'WH-02',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location\n• \tConfirm unit is a permanently installed water heater (gas, electric, or heat pump)\n• \tLocated in:\n• \tExterior closets or enclosures\n• \tUtility alcoves or mechanical pads\n• \tRooftop or ground-mounted service areas\n• \tVerify accessibility for inspection, servicing, and replacement per IRC §P2801.4\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nTank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank\nIRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection\n🔧 Step 3: Evaluate Functional Safety\n• \tLeak check: Look for active dripping from fittings, tank seams, or relief valve\n• \tT&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade\n• \tDrain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, algae, or pest activity around enclosure or base\n• \tWater stains or corrosion on adjacent walls or slab\n• \tTrash or vegetation obstructing access or airflow\n• \tIBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tService access: Minimum 30″ clear working space\n• \tHeight & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)\n• \tLabeling: Unit must be marked with fuel type, capacity, and emergency shutoff location\n• \tIBU Overlay: May require tactile signage, lockable access doors, and disability-compliant paths to shared-use equipment`
    },
    {
      id: 'wh_3',
      name: 'TPRV has an active leak. Or TPRV is obstructed such that the TPRV is unable to be fully actuated. OR Relief valve discharge piping is damaged d (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      detail: 'TPRV is obstructed such that the TPRV is unable to be fully actuated. OR, relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), is capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'WH-03',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location\n• \tConfirm unit is a permanently installed water heater (gas, electric, or heat pump)\n• \tLocated in:\n• \tExterior closets or enclosures\n• \tUtility alcoves or mechanical pads\n• \tRooftop or ground-mounted service areas\n• \tVerify accessibility for inspection, servicing, and replacement per IRC §P2801.4\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nTank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank\nIRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection\n🔧 Step 3: Evaluate Functional Safety\n• \tLeak check: Look for active dripping from fittings, tank seams, or relief valve\n• \tT&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade\n• \tDrain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, algae, or pest activity around enclosure or base\n• \tWater stains or corrosion on adjacent walls or slab\n• \tTrash or vegetation obstructing access or airflow\n• \tIBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tService access: Minimum 30″ clear working space\n• \tHeight & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)\n• \tLabeling: Unit must be marked with fuel type, capacity, and emergency shutoff location\n• \tIBU Overlay: May require tactile signage, lockable access doors, and disability-compliant paths to shared-use equipment`
    },
    {
      id: 'wh_4',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WH-04',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location\n• \tConfirm unit is a permanently installed water heater (gas, electric, or heat pump)\n• \tLocated in:\n• \tExterior closets or enclosures\n• \tUtility alcoves or mechanical pads\n• \tRooftop or ground-mounted service areas\n• \tVerify accessibility for inspection, servicing, and replacement per IRC §P2801.4\n🧱 Step 2: Assess Structural Integrity\nInspect for damage, instability, or missing components:\nTank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank\nIRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection\n🔧 Step 3: Evaluate Functional Safety\n• \tLeak check: Look for active dripping from fittings, tank seams, or relief valve\n• \tT&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade\n• \tDrain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)\n🧼 Step 4: Check Sanitation & Environmental Safety\n• \tInspect for:\n• \tMold, algae, or pest activity around enclosure or base\n• \tWater stains or corrosion on adjacent walls or slab\n• \tTrash or vegetation obstructing access or airflow\n• \tIBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes\n🧠 Step 5: Verify Accessibility & Local Compliance\n• \tService access: Minimum 30″ clear working space\n• \tHeight & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)\n• \tLabeling: Unit must be marked with fuel type, capacity, and emergency shutoff location\n• \tIBU Overlay: May require tactile signage, lockable access doors, and disability-compliant paths to shared-use equipment`
    }
  ]
};

// 26. General Comment
export const GENERAL_COMMENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'General Comment',
  deficiencies: [
    {
      id: 'gen_1',
      name: 'General observation or comment',
      detail: 'General observation or comment about the property condition.',
      criteria: 'General comment.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'GEN-01',
      codeReference: 'General observation or comment about property condition - for informational purposes only. No specific code reference required.'
    }
  ]
};

// ==========================================
// INSIDE CATEGORIES
// ==========================================

// Inside 1. Cabinet and Storage (Pantry, Laundry)

// Inside 2. Call-for-Aid System
export const CALL_FOR_AID_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Call-for-Aid System',
  deficiencies: [
    {
      id: 'cfa_1',
      name: 'System does not function properly',
      detail: 'Call-for-aid system does not emit sound, light, or send signal to annunciator.',
      criteria: 'Annunciator does not indicate the correct corresponding room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CFA-01',
      codeReference: "hello"
    },
    {
      id: 'cfa_2',
      name: 'System blocked or pull cord too high',
      detail: 'System blocked OR pull cord end is higher than 6 inches off the floor.',
      criteria: 'Pull cord positioned more than 6 inches above floor.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CFA-02',
      codeReference: "hello"
    }
  ]
};

// Inside 3. Carbon Monoxide Alarm
export const CARBON_MONOXIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Carbon Monoxide Alarm',
  deficiencies: [
    {
      id: 'co_1',
      name: 'Alarm inoperable',
      detail: 'Does not produce audio or visual alarm when tested.',
      criteria: 'With or without battery, including low volume.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CO-01',
      codeReference: "hello"
    },
    {
      id: 'co_2',
      name: 'Alarm missing or improperly installed',
      detail: 'Fuel-burning appliance present and CO alarm missing.',
      criteria: 'Sleeping area within one story of attached garage without ventilation.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CO-02',
      codeReference: "hello"
    },
    {
      id: 'co_3',
      name: 'Alarm obstructed',
      detail: 'Alarm is obstructed.',
      criteria: 'Covered by foreign objects such as plastic, tape, paint, or stickers.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CO-03',
      codeReference: "hello"
    }
  ]
};

// Inside 4. Ceiling

// Inside 5. Chimney (Inside)
export const CHIMNEY_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Chimney',
  deficiencies: [
    {
      id: 'chim_in_1',
      name: 'Chimney incomplete or damaged',
      detail: 'Chimney or flue cannot safely vent combustion gases.',
      criteria: 'Fireplace or appliance is not decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CHIM-IN-01',
      codeReference: "hello"
    }
  ]
};

// Inside 6. Clothes Dryer Exhaust Ventilation (Inside)
export const DRYER_VENT_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Clothes Dryer Exhaust Ventilation',
  deficiencies: [
    {
      id: 'dryer_in_1',
      name: 'Unsuitable transition duct',
      detail: 'Duct not constructed of approved metal material.',
      criteria: 'Dryer used indoors.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-01',
      codeReference: "hello"
    },
    {
      id: 'dryer_in_2',
      name: 'Restricted airflow',
      detail: 'Ventilation system blocked or damaged.',
      criteria: 'Airflow restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-02',
      codeReference: "hello"
    },
    {
      id: 'dryer_in_3',
      name: 'Transition duct detached or missing',
      detail: 'Evidence of prior installation but now missing.',
      criteria: 'Duct not securely attached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-03',
      codeReference: "hello"
    }
  ]
};

// Inside 7. Door (Inside)
export const DOOR_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    {
      id: 'door_in_1',
      name: 'Entry door cannot be secured',
      detail: 'Lock cannot be engaged from both sides.',
      criteria: 'Access not controlled.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-IN-01',
      codeReference: "hello"
    },
    {
      id: 'door_in_2',
      name: 'Entry door damaged or missing',
      detail: 'Door cannot provide privacy or protection.',
      criteria: 'Hole or crack ≥ 1/4 inch or missing glass.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-IN-02',
      codeReference: "hello"
    },
    {
      id: 'door_in_3',
      name: 'Fire-labeled door defective',
      detail: 'Door cannot self-close or latch.',
      criteria: 'Fire integrity compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-IN-03',
      codeReference: "hello"
    }
  ]
};

// Inside 8. Drainage (Inside)
export const DRAINAGE_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drainage',
  deficiencies: [
    {
      id: 'drain_in_1',
      name: 'Drain fully blocked',
      detail: 'Drainage problem present.',
      criteria: 'Water unable to drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-IN-01',
      codeReference: "hello"
    }
  ]
};

// Inside 9. Egress (Inside)
export const EGRESS_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_in_1',
      name: 'Obstructed means of egress',
      detail: 'Exit access or exit obstructed.',
      criteria: 'Furniture, bars, or locks block escape route.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'EGRESS-IN-01',
      codeReference: "hello"
    }
  ]
};

// Inside 10. Electrical (Inside)
export const ELECTRICAL_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    {
      id: 'elec_in_1',
      name: 'Exposed or unprotected conductors',
      detail: 'Wiring not enclosed or insulated.',
      criteria: 'Open ports, missing covers, gaps over 1/2 inch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-IN-01',
      codeReference: "hello"
    },
    {
      id: 'elec_in_2',
      name: 'Outlet not energized',
      detail: 'Accessible outlet does not provide power.',
      criteria: 'Testing indicates outlet is dead.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-IN-02',
      codeReference: "hello"
    },
    {
      id: 'elec_in_3',
      name: 'Outlet or switch damaged',
      detail: 'Visible damage affecting functionality.',
      criteria: 'Cannot safely carry electrical current.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEC-IN-03',
      codeReference: "hello"
    }
  ]
};

// Inside 11. Elevator
export const ELEVATOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Elevator',
  deficiencies: [
    {
      id: 'elev_1',
      name: 'Cab not level',
      detail: 'Difference greater than 3/4 inch.',
      criteria: 'Trip hazard present.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEV-01',
      codeReference: "hello"
    },
    {
      id: 'elev_2',
      name: 'Door does not open or close',
      detail: 'Door fails to operate fully.',
      criteria: 'Elevator not in working condition.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEV-02',
      codeReference: "hello"
    },
    {
      id: 'elev_3',
      name: 'Elevator inoperable',
      detail: 'System not meeting functional purpose.',
      criteria: 'Overall system failure.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEV-03',
      codeReference: "hello"
    }
  ]
};

// Inside 12. Fire Safety (Inside)
export const FIRE_SAFETY_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    {
      id: 'fire_in_1',
      name: 'Exit sign damaged or missing',
      detail: 'Exit sign not illuminated or obstructed.',
      criteria: 'EXIT not clearly visible.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-IN-01',
      codeReference: "hello"
    },
    {
      id: 'fire_in_2',
      name: 'Fire extinguisher missing or damaged',
      detail: 'Evidence of prior installation but missing.',
      criteria: 'Not available for use.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-IN-02',
      codeReference: "hello"
    },
    {
      id: 'fire_in_3',
      name: 'Smoke alarm inoperable',
      detail: 'Does not emit alarm when tested.',
      criteria: 'Fails required alarm function.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-IN-03',
      codeReference: "hello"
    }
  ]
};

// Inside 13. Floor
export const FLOOR_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Floor',
  deficiencies: [
    {
      id: 'floor_1',
      name: 'Floor not functionally adequate',
      detail: 'Cannot safely support walking.',
      criteria: 'Sloping, deflection, or rot present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FLOOR-01',
      codeReference: "hello"
    },
    {
      id: 'floor_2',
      name: 'Floor substrate exposed',
      detail: '10% or more substrate exposed.',
      criteria: 'Repair required.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FLOOR-02',
      codeReference: "hello"
    }
  ]
};

// Inside 14. Foundation (Inside)
export const FOUNDATION_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Foundation',
  deficiencies: [
    {
      id: 'found_in_1',
      name: 'Foundation cracked',
      detail: 'Crack ≥ 1/4 inch wide and 12 inches long.',
      criteria: 'Signs of foundation failure.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-IN-01',
      codeReference: "hello"
    },
    {
      id: 'found_in_2',
      name: 'Water infiltration',
      detail: 'Evidence of water intrusion.',
      criteria: 'Dampness, stains, mineral deposits.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOUND-IN-02',
      codeReference: "hello"
    }
  ]
};

// Inside 15. Grab Bar
export const GRAB_BAR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Grab Bar',
  deficiencies: [
    {
      id: 'grab_1',
      name: 'Grab bar not secured',
      detail: 'Any movement detected.',
      criteria: 'Loose or missing grab bar.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GRAB-01',
      codeReference: "hello"
    }
  ]
};

// Inside 16. Hazard (Inside)
export const HAZARD_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    {
      id: 'haz_in_1',
      name: 'Infestation',
      detail: 'Evidence of pests.',
      criteria: 'Bedbugs, cockroaches, rats, mice.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZ-IN-01',
      codeReference: "hello"
    },
    {
      id: 'haz_in_2',
      name: 'Trip hazard',
      detail: 'Abrupt elevation change.',
      criteria: 'Vertical ≥ 3/4 inch or horizontal ≥ 2 inches.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZ-IN-02',
      codeReference: "hello"
    }
  ]
};

// Additional deficiencies for common items
export const BATHROOM_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Bathroom',
  deficiencies: [
    {
      id: 'bath_1',
      name: 'Bathtub or shower is inoperable or does not drain',
      detail: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
      criteria: 'A bathtub or shower is inoperable, or standing water is present.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'BATH-01',
      codeReference: "hello"
    },
    {
      id: 'bath_2',
      name: 'Bathtub or shower component is damaged, inoperable, or missing',
      detail: 'Component is inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts.',
      criteria: 'Component is damaged, inoperable or missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'BATH-02',
      codeReference: "hello"
    },
    {
      id: 'bath_3',
      name: 'Only one bathtub or shower is present, and it is inoperable',
      detail: 'Only one bathtub or shower is present within the unit and it is inoperable.',
      criteria: 'Only one bathtub or shower is present, and it is inoperable.',
      severity: 'Severe',
      repairBy: '24Hrs',
      points: '14.8/n',
      code: 'BATH-03',
      codeReference: "hello"
    }
  ]
};

export const TOILET_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Toilet',
  deficiencies: [
    {
      id: 'toilet_1',
      name: 'A toilet is damaged or inoperable, and at least one operational toilet is elsewhere',
      detail: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit.',
      criteria: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-01',
      codeReference: "hello"
    },
    {
      id: 'toilet_2',
      name: 'Only one toilet was installed, and it is damaged or inoperable',
      detail: 'Only one toilet is present, and it is either damaged or inoperable.',
      criteria: 'Only one toilet was installed, and it is damaged or inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'TOILET-02',
      codeReference: "hello"
    },
    {
      id: 'toilet_3',
      name: 'Only one toilet was installed, and it is missing',
      detail: 'Only one toilet was installed, and it is now missing.',
      criteria: 'Only one toilet was installed, and it is missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'TOILET-03',
      codeReference: "hello"
    },
    {
      id: 'toilet_4',
      name: 'Toilet is not secured at the base',
      detail: 'Toilet is not secured at the base.',
      criteria: 'Toilet is not secured at the base.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-04',
      codeReference: "hello"
    }
  ]
};

export const SINK_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sink (Laundry, Garage, or patio)',
  deficiencies: [
    {
      id: 'sink_1',
      name: 'Hot and cold water cannot be activated or deactivated',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: 'Hot and cold water cannot be activated or deactivated.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-01',
      codeReference: "hello"
    },
    {
      id: 'sink_2',
      name: 'Sink component is damaged or missing, and sink is not functionally adequate',
      detail: 'Sink component is missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-02',
      codeReference: "hello"
    },
    {
      id: 'sink_3',
      name: 'Sink is not draining',
      detail: 'Water is not draining from the basin of the sink.',
      criteria: 'Sink is not draining.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-03',
      codeReference: "hello"
    },
    {
      id: 'sink_4',
      name: 'Water is directed outside of the basin',
      detail: 'Confirm that water is directed into the basin and not outside when in use.',
      criteria: 'Water is directed outside of the basin.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-04',
      codeReference: "hello"
    }
  ]
};

export const MOLD_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Mold',
  deficiencies: [
    {
      id: 'mold_1',
      name: 'Peeling paint/Elevated moisture.',
      detail: 'Elevated moisture level (peeling paint, warped/stained surfaces).',
      criteria: 'Evidence of moisture.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-01',
      codeReference: "hello"
    },
    {
      id: 'mold_2',
      name: 'Mold (> 9 SF).',
      detail: 'Presence of mold-like substance at extremely high levels.',
      criteria: 'Cumulative area > 9 sq ft.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'MOLD-02',
      codeReference: "hello"
    },
    {
      id: 'mold_3',
      name: 'Mold (1-9 SF).',
      detail: 'Presence of mold-like substance at high levels.',
      criteria: 'Cumulative area 1 - 9 sq ft.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-03',
      codeReference: "hello"
    },
    {
      id: 'mold_4',
      name: 'Mold (Moderate).',
      detail: 'Presence of mold-like substance at moderate level.',
      criteria: 'Cumulative area 4 sq in - 1 sq ft.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-04',
      codeReference: "hello"
    }
  ]
};

export const WINDOW_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Window',
  deficiencies: [
    {
      id: 'window_1',
      name: 'Window component is damaged, inoperable, or missing',
      detail: 'Window component is damaged, inoperable, or missing and affects functionality.',
      criteria: 'Window component is damaged, inoperable, or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WINDOW-01',
      codeReference: "hello"
    },
    {
      id: 'window_2',
      name: 'Window is broken or missing',
      detail: 'Window glass is broken, cracked, or missing entirely.',
      criteria: 'Window is broken or missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'WINDOW-02',
      codeReference: "hello"
    },
    {
      id: 'window_3',
      name: 'Window will not open or close properly',
      detail: 'Window cannot be opened or closed as designed.',
      criteria: 'Window will not open or close properly.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'WINDOW-03',
      codeReference: "hello"
    }
  ]
};

export const FLOOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Floor',
  deficiencies: [
    {
      id: 'floor_1',
      name: 'Floor component is damaged or missing',
      detail: 'Floor component is damaged, deteriorated, or missing.',
      criteria: 'Floor component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FLOOR-01',
      codeReference: "hello"
    },
    {
      id: 'floor_2',
      name: 'Floor is not level or has significant damage',
      detail: 'Floor has significant sagging, buckling, or structural damage.',
      criteria: 'Floor is not level or has significant damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FLOOR-02',
      codeReference: "hello"
    },
    {
      id: 'floor_3',
      name: 'Trip hazard present',
      detail: 'Floor has raised edges, holes, or uneven surfaces creating trip hazard.',
      criteria: 'Trip hazard present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FLOOR-03',
      codeReference: "hello"
    }
  ]
};

export const WALL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Wall',
  deficiencies: [
    {
      id: 'wall_1',
      name: 'Wall component is damaged or missing',
      detail: 'Wall has holes, cracks, or missing sections.',
      criteria: 'Wall component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WALL-01',
      codeReference: "hello"
    },
    {
      id: 'wall_2',
      name: 'Wall has significant structural damage',
      detail: 'Wall shows signs of structural failure or major deterioration.',
      criteria: 'Wall has significant structural damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'WALL-02',
      codeReference: "hello"
    }
  ]
};

export const CEILING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Ceiling',
  deficiencies: [
    {
      id: 'ceiling_1',
      name: 'Ceiling component is damaged or missing',
      detail: 'Ceiling has holes, cracks, water stains, or missing sections.',
      criteria: 'Ceiling component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CEILING-01',
      codeReference: "hello"
    },
    {
      id: 'ceiling_2',
      name: 'Ceiling is sagging or has structural damage',
      detail: 'Ceiling shows signs of sagging, buckling, or structural failure.',
      criteria: 'Ceiling is sagging or has structural damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CEILING-02',
      codeReference: "hello"
    }
  ]
};

export const KITCHEN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Kitchen',
  deficiencies: [
    {
      id: 'kitchen_1',
      name: 'Cabinet and Storage damaged/missing.',
      detail: 'Some cabinet doors, drawers, or shelves missing or visibly defective.',
      criteria: 'Impacts functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-01',
      codeReference: "hello"
    },
    {
      id: 'kitchen_2',
      name: 'Cooking Appliance - Burner.',
      detail: 'A burner does not produce heat, but at least one other burner is present and works.',
      criteria: 'Partial burner failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-02',
      codeReference: "hello"
    },
    {
      id: 'kitchen_3',
      name: 'Cooking Appliance - Unsafe.',
      detail: 'Component (including seal) damaged or missing, making device unsafe.',
      criteria: 'Device unsafe for use.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'KITCHEN-03',
      codeReference: "hello"
    },
    {
      id: 'kitchen_4',
      name: 'Cooking Appliance - No Heat.',
      detail: 'No burner produces heat OR oven does not produce heat.',
      criteria: 'Total failure to produce heat.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-04',
      codeReference: "hello"
    },
    {
      id: 'kitchen_5',
      name: 'Food preparation area damaged/inadequate.',
      detail: '10% or more of surface is exposed substrate or space does not support food prep.',
      criteria: 'Damaged or inadequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-05',
      codeReference: "hello"
    },
    {
      id: 'kitchen_6',
      name: 'Food preparation area is not present.',
      detail: 'Countertop is missing (evidence of prior installation).',
      criteria: 'Countertop missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-06',
      codeReference: "hello"
    },
    {
      id: 'kitchen_7',
      name: 'MOLD-LIKE SUBSTANCE (Peeling Paint).',
      detail: 'Elevated moisture level (peeling paint, warped/stained wall/ceiling).',
      criteria: 'Evidence of moisture.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-07',
      codeReference: "hello"
    },
    {
      id: 'kitchen_8',
      name: 'MOLD-LIKE SUBSTANCE (> 9 SF).',
      detail: 'Presence of mold-like substance at extremely high levels.',
      criteria: 'Cumulative area > 9 sq ft.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'KITCHEN-08',
      codeReference: "hello"
    },
    {
      id: 'kitchen_9',
      name: 'MOLD-LIKE SUBSTANCE (1-9 SF).',
      detail: 'Presence of mold-like substance at high levels.',
      criteria: 'Cumulative area 1 - 9 sq ft.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-09',
      codeReference: "hello"
    },
    {
      id: 'kitchen_10',
      name: 'MOLD-LIKE SUBSTANCE (Moderate).',
      detail: 'Presence of mold-like substance at moderate level.',
      criteria: 'Cumulative area 4 sq in - 1 sq ft.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-10',
      codeReference: "hello"
    },
    {
      id: 'kitchen_11',
      name: 'Refrigerator component damaged.',
      detail: 'Refrigerator component is damaged (visibly defective) such that it impacts functionality.',
      criteria: 'Impacts functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-11',
      codeReference: "hello"
    },
    {
      id: 'kitchen_12',
      name: 'Refrigerator inoperable.',
      detail: 'Refrigerator is inoperable such that it may be unable to safely store food.',
      criteria: 'System not meeting function.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-12',
      codeReference: "hello"
    },
    {
      id: 'kitchen_13',
      name: 'Sink - Faucet Control.',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: 'Cannot activate/deactivate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-13',
      codeReference: "hello"
    },
    {
      id: 'kitchen_14',
      name: 'Sink - Component damaged (Not Adequate).',
      detail: 'Sink component is missing or damaged, and sink is not functionally adequate.',
      criteria: 'Not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-14',
      codeReference: "hello"
    },
    {
      id: 'kitchen_15',
      name: 'Sink - Improper Installation.',
      detail: 'Sink improperly installed, pulling away from wall, leaning, gaps.',
      criteria: 'Separation at seams.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-15',
      codeReference: "hello"
    },
    {
      id: 'kitchen_16',
      name: 'Sink - Drainage.',
      detail: 'The sink is not draining, not functioning adequately.',
      criteria: 'Water not draining; slow or clogged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-16',
      codeReference: "hello"
    },
    {
      id: 'kitchen_17',
      name: 'Sink - Component damaged (Adequate).',
      detail: 'Sink component damaged/missing but sink IS functionally adequate.',
      criteria: 'Functionally adequate despite damage.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'KITCHEN-17',
      codeReference: "hello"
    },
    {
      id: 'kitchen_18',
      name: 'Sink - Water pressure/direction.',
      detail: 'Water pressure, direction is not adequately functional.',
      criteria: 'Functional issue.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'KITCHEN-18',
      codeReference: "hello"
    },
    {
      id: 'kitchen_19',
      name: 'Ventilation missing.',
      detail: 'The kitchen does not have ventilation (exhaust fan/window) present and operable.',
      criteria: 'Not present and operable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-19',
      codeReference: "hello"
    },
    {
      id: 'kitchen_20',
      name: 'Exhaust system component damaged/missing.',
      detail: 'Exhaust system component damaged or missing.',
      criteria: 'Visibly defective or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-20',
      codeReference: "hello"
    },
    {
      id: 'kitchen_21',
      name: 'Exhaust system control failure.',
      detail: 'Exhaust system does not respond to the control switch.',
      criteria: 'Inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-21',
      codeReference: "hello"
    },
    {
      id: 'kitchen_22',
      name: 'Exhaust system restricted airflow.',
      detail: 'Exhaust system has restricted air flow.',
      criteria: 'Blocked.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-22',
      codeReference: "hello"
    }
  ]
};

export const RESTROOM_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Restroom',
  deficiencies: [
    {
      id: 'rest_1',
      name: 'Restroom fixture is inoperable',
      detail: 'Toilet, sink, or other restroom fixture does not function properly.',
      criteria: 'Restroom fixture is inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'REST-01',
      codeReference: "hello"
    },
    {
      id: 'rest_2',
      name: 'Restroom component is damaged or missing',
      detail: 'Restroom component is damaged, deteriorated, or missing.',
      criteria: 'Restroom component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'REST-02',
      codeReference: "hello"
    }
  ]
};

export const VENTILATION_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Ventilation',
  deficiencies: [
    {
      id: 'vent_1',
      name: 'Ventilation system is inoperable',
      detail: 'Ventilation system does not function properly.',
      criteria: 'Ventilation system is inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-01',
      codeReference: "hello"
    },
    {
      id: 'vent_2',
      name: 'Ventilation component is damaged or missing',
      detail: 'Ventilation component is damaged, deteriorated, or missing.',
      criteria: 'Ventilation component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-02',
      codeReference: "hello"
    }
  ]
};

export const CABINET_STORAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Cabinet and Storage (Pantry, Laundry)',
  deficiencies: [
    {
      id: 'cab_1',
      name: 'Cabinet or storage component is damaged or missing',
      detail: 'Cabinet or storage component is damaged, deteriorated, or missing.',
      criteria: 'Cabinet or storage is not functional.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'CAB-01',
      codeReference: "hello"
    }
  ]
};

export const CODE_COMPLIANCE = 'Uniform Physical Condition Standards (UPCS)';

// Comprehensive mapping function for all NSPIRE categories
export const getDeficienciesForItem = (itemName: string, locationType?: string): ItemDeficiencies => {
  // Remove number prefix if present (e.g., "1. Address and Signage" -> "Address and Signage")
  const cleanedName = itemName.replace(/^\d+\.\s*/, '');
  const normalizedName = cleanedName.toLowerCase();
  const isInside = locationType?.toLowerCase() === 'inside';
  const isOutside = locationType?.toLowerCase() === 'outside';

  // Check if this is a Unit location (Basement, Bathroom2, Bedroom 1, etc.)
  // Unit locations use completely separate deficiency data from Inside/Outside
  const isUnit = isUnitLocation(locationType || '');

  // ==========================================
  // UNIT INSPECTIONS - Use insideDeficiencyMapping.ts ONLY (32 categories for dwelling rooms)
  // ==========================================
  if (isUnit) {
    const insideResult = getAllInsideDeficienciesForItem(cleanedName);
    if (insideResult) {
      let allDeficiencies: DeficiencyOption[] = [];
      if (insideResult.subcategories) {
        allDeficiencies = insideResult.subcategories.flatMap(sub =>
          sub.deficiencies.map(d => ({
            id: d.id,
            name: d.name,
            detail: d.detail,
            criteria: d.criteria,
            severity: d.severity,
            repairBy: d.repairBy,
            points: d.points,
            code: d.code || '',
            codeReference: (d as any).codeReference,
          }))
        );
      } else if (insideResult.deficiencies) {
        allDeficiencies = insideResult.deficiencies.map(d => ({
          id: d.id,
          name: d.name,
          detail: d.detail,
          criteria: d.criteria,
          severity: d.severity,
          repairBy: d.repairBy,
          points: d.points,
          code: d.code || '',
          codeReference: (d as any).codeReference,
        }));
      }
      return {
        itemName: insideResult.itemName,
        deficiencies: allDeficiencies
      };
    }
    // Never fall through to outside data for unit rooms
    return { itemName: itemName, deficiencies: GENERAL_COMMENT_DEFICIENCIES.deficiencies };
  }

  // ==========================================
  // OUTSIDE INSPECTIONS - Use outsideDeficiencyMapping.ts ONLY
  // ==========================================
  if (isOutside) {
    const outsideResult = getOutsideDeficienciesByCategory(cleanedName);
    if (outsideResult) {
      return outsideResult;
    }
  }

  // ==========================================
  // INSIDE INSPECTIONS - Use unitDeficiencyMapping.ts ONLY (35 categories)
  // ==========================================
  if (isInside) {
    const unitResult = getUnitDeficienciesByCategory(cleanedName);
    if (unitResult) {
      return {
        itemName: unitResult.itemName,
        deficiencies: unitResult.deficiencies.map(d => ({
          id: d.id,
          name: d.name,
          detail: d.detail,
          criteria: d.criteria,
          severity: d.severity,
          repairBy: d.repairBy,
          points: d.points,
          code: d.code || '',
          codeReference: d.codeReference,
        }))
      };
    }
    // Try subcategory lookup as fallback before giving up
    const subResult = getUnitSubcategoryDeficiencies(cleanedName);
    if (subResult) {
      return {
        itemName: subResult.itemName,
        deficiencies: subResult.deficiencies.map(d => ({
          id: d.id,
          name: d.name,
          detail: d.detail,
          criteria: d.criteria,
          severity: d.severity,
          repairBy: d.repairBy,
          points: d.points,
          code: d.code || '',
          codeReference: (d as any).codeReference || undefined,
        }))
      };
    }
    // Never fall through to outside data for inside rooms
    return { itemName: itemName, deficiencies: GENERAL_COMMENT_DEFICIENCIES.deficiencies };
  }

  // ==========================================
  // DEFAULT FALLBACK: Use outsideDeficiencyMapping.ts as single source of truth
  // This ensures any updates made in outsideDeficiencyMapping.ts are reflected here automatically
  // ==========================================
  const outsideFallback = getOutsideDeficienciesByCategory(cleanedName);
  if (outsideFallback) {
    return outsideFallback;
  }

  // Exact matches first - specific door types before generic door
  if (normalizedName.includes('door - entry') || normalizedName.includes('door entry')) {
    return DOOR_ENTRY_DEFICIENCIES;
  }
  if (normalizedName.includes('door – fire') || normalizedName.includes('door fire') || normalizedName.includes('fire labeled') || normalizedName.includes('fire-labeled')) {
    return DOOR_FIRE_LABELED_DEFICIENCIES;
  }
  if (normalizedName.includes('door - general standard') || normalizedName === 'door - general standard') {
    return DOOR_GENERAL_STANDARD_OUTSIDE;
  }
  if (normalizedName.includes('garage door')) {
    return isInside ? GARAGE_DOOR_DEFICIENCIES : GARAGE_DOOR_OUTSIDE;
  }
  if (normalizedName.includes('door - general') || normalizedName.includes('door general') || normalizedName.includes('door-general')) {
    return DOOR_GENERAL_DEFICIENCIES;
  }
  // Electrical Service Panel before generic Electrical
  if (normalizedName.includes('electrical service panel') || normalizedName.includes('service panel')) {
    return ELECTRICAL_SERVICE_PANEL_DEFICIENCIES;
  }

  // Standard matches
  if (normalizedName.includes('address') || normalizedName.includes('signage')) {
    return ADDRESS_SIGNAGE_DEFICIENCIES;
  }
  if (normalizedName.includes('chimney')) {
    return isInside ? CHIMNEY_INSIDE_DEFICIENCIES : CHIMNEY_DEFICIENCIES;
  }
  if (normalizedName.includes('dryer') || normalizedName.includes('clothes dryer')) {
    return isInside ? DRYER_VENT_INSIDE_DEFICIENCIES : DRYER_VENT_DEFICIENCIES;
  }
  if (normalizedName.includes('door')) {
    return isInside ? DOOR_INSIDE_DEFICIENCIES : DOOR_DEFICIENCIES;
  }
  if (normalizedName.includes('drain')) {
    return isInside ? DRAINAGE_INSIDE_DEFICIENCIES : DRAIN_DEFICIENCIES;
  }
  if (normalizedName.includes('egress')) {
    return isInside ? EGRESS_INSIDE_DEFICIENCIES : EGRESS_DEFICIENCIES;
  }
  if (normalizedName.includes('electrical') || normalizedName.includes('outlet') || normalizedName.includes('switch')) {
    return isInside ? ELECTRICAL_INSIDE_DEFICIENCIES : ELECTRICAL_DEFICIENCIES;
  }
  if (normalizedName.includes('fence') || normalizedName.includes('gate')) {
    return FENCE_GATE_DEFICIENCIES;
  }
  if (normalizedName.includes('fire')) {
    return isInside ? FIRE_SAFETY_INSIDE_DEFICIENCIES : FIRE_SAFETY_DEFICIENCIES;
  }
  if (normalizedName.includes('foundation')) {
    return isInside ? FOUNDATION_INSIDE_DEFICIENCIES : FOUNDATION_DEFICIENCIES;
  }
  if (normalizedName.includes('hazard')) {
    return isInside ? HAZARD_INSIDE_DEFICIENCIES : HAZARD_DEFICIENCIES;
  }
  if (normalizedName.includes('hvac') || normalizedName.includes('heating') || normalizedName.includes('air conditioning')) {
    return isInside ? HVAC_DEFICIENCIES : HVAC_OUTSIDE_DEFICIENCIES;
  }
  if (normalizedName.includes('leak') && (normalizedName.includes('gas') || normalizedName.includes('oil'))) {
    return LEAK_GAS_OIL_DEFICIENCIES;
  }
  if (normalizedName.includes('leak') && normalizedName.includes('sewage')) {
    return LEAK_SEWAGE_DEFICIENCIES;
  }
  if (normalizedName.includes('leak') && normalizedName.includes('water')) {
    return LEAK_WATER_DEFICIENCIES;
  }
  if (normalizedName.includes('lighting') || normalizedName.includes('light')) {
    return LIGHTING_DEFICIENCIES;
  }
  if (normalizedName.includes('parking') || normalizedName.includes('driveway') || normalizedName.includes('road')) {
    return PARKING_DEFICIENCIES;
  }
  if (normalizedName.includes('paint') || normalizedName.includes('lead')) {
    return PAINT_DEFICIENCIES;
  }
  if (normalizedName.includes('railing') || normalizedName.includes('guardrail') || normalizedName.includes('handrail')) {
    return RAILINGS_DEFICIENCIES;
  }
  if (normalizedName.includes('roof')) {
    return ROOF_DEFICIENCIES;
  }
  if (normalizedName.includes('sidewalk') || normalizedName.includes('walkway') || normalizedName.includes('ramp')) {
    return SIDEWALK_DEFICIENCIES;
  }
  if (normalizedName.includes('step') || normalizedName.includes('stair')) {
    return STAIRS_DEFICIENCIES;
  }
  if (normalizedName.includes('structural')) {
    return STRUCTURAL_DEFICIENCIES;
  }
  if (normalizedName.includes('retaining wall') || normalizedName.includes('retaining')) {
    return RETAINING_WALL_DEFICIENCIES;
  }
  if (normalizedName.includes('water heater')) {
    return WATER_HEATER_DEFICIENCIES;
  }
  if (normalizedName.includes('bathroom') || normalizedName.includes('bathtub') || normalizedName.includes('shower')) {
    return BATHROOM_DEFICIENCIES;
  }
  if (normalizedName.includes('toilet')) {
    return TOILET_DEFICIENCIES;
  }
  if (normalizedName.includes('sink')) {
    return SINK_DEFICIENCIES;
  }
  if (normalizedName.includes('mold')) {
    return MOLD_DEFICIENCIES;
  }
  if (normalizedName.includes('window')) {
    return WINDOW_DEFICIENCIES;
  }
  if (normalizedName.includes('floor')) {
    return isInside ? FLOOR_INSIDE_DEFICIENCIES : FLOOR_DEFICIENCIES;
  }
  if (normalizedName.includes('wall')) {
    return WALL_DEFICIENCIES;
  }
  if (normalizedName.includes('ceiling')) {
    return CEILING_DEFICIENCIES;
  }
  if (normalizedName.includes('kitchen')) {
    return KITCHEN_DEFICIENCIES;
  }
  if (normalizedName.includes('restroom')) {
    return RESTROOM_DEFICIENCIES;
  }
  if (normalizedName.includes('ventilation')) {
    return VENTILATION_DEFICIENCIES;
  }
  if (normalizedName.includes('cabinet') || normalizedName.includes('storage') || normalizedName.includes('pantry') || normalizedName.includes('laundry')) {
    return CABINET_STORAGE_DEFICIENCIES;
  }
  // Inside-specific categories
  if (normalizedName.includes('call-for-aid') || normalizedName.includes('call for aid')) {
    return CALL_FOR_AID_DEFICIENCIES;
  }
  if (normalizedName.includes('carbon monoxide') || normalizedName.includes('co alarm')) {
    return CARBON_MONOXIDE_DEFICIENCIES;
  }
  if (normalizedName.includes('elevator')) {
    return ELEVATOR_DEFICIENCIES;
  }
  if (normalizedName.includes('grab bar')) {
    return GRAB_BAR_DEFICIENCIES;
  }
  if (normalizedName.includes('general')) {
    return GENERAL_COMMENT_DEFICIENCIES;
  }

  // Return generic deficiencies for unmapped items
  return {
    itemName: itemName,
    deficiencies: GENERAL_COMMENT_DEFICIENCIES.deficiencies
  };
};

// Helper function to check if an item has subcategories
export const hasSubcategories = (itemName: string, locationType?: string): boolean => {
  const cleanedName = itemName.replace(/^\d+\.\s*/, '');
  const normalizedName = cleanedName.toLowerCase();
  const isOutside = locationType?.toLowerCase() === 'outside';
  const isUnit = isUnitLocation(locationType || '');
  const isInside = locationType?.toLowerCase() === 'inside';

  // Unit locations - check if the item has subcategories in insideDeficiencyMapping
  if (isUnit) {
    const subcats = getInsideSubcategories(cleanedName);
    return subcats.length > 0;
  }

  // Inside locations - check if the item has subcategories in unitDeficiencyMapping
  if (isInside) {
    return hasInsideSubcategories(cleanedName);
  }

  if (isOutside) {
    // Outside categories with subcategories
    if (normalizedName === 'door') return true;
    if (normalizedName === 'drain') return true;
    if (normalizedName === 'electrical') return true;
    if (normalizedName.includes('fencing') || normalizedName.includes('gate')) return true;
    if (normalizedName === 'fire safety') return true;
    if (normalizedName === 'hazard') return true;
    if (normalizedName === 'lighting') return true;
    if (normalizedName.includes('parking') || normalizedName.includes('driveway') || normalizedName.includes('road')) return true;
    if (normalizedName === 'railings') return true;
    if (normalizedName.includes('retaining wall') || normalizedName === 'retaining wall') return true;
  }
  return false;
};

// Helper function to get subcategories for an item
export const getSubcategoriesForItem = (itemName: string, locationType?: string): { id: string; name: string }[] => {
  const cleanedName = itemName.replace(/^\d+\.\s*/, '');
  const normalizedName = cleanedName.toLowerCase();
  const isOutside = locationType?.toLowerCase() === 'outside';
  const isUnit = isUnitLocation(locationType || '');
  const isInside = locationType?.toLowerCase() === 'inside';

  // Unit locations - get subcategories from insideDeficiencyMapping
  if (isUnit) {
    const subcats = getInsideSubcategories(cleanedName);
    return subcats.map((name, index) => ({ id: `unit_subcat_${index + 1}`, name }));
  }

  // Inside locations - get subcategories from unitDeficiencyMapping
  if (isInside) {
    const subcats = getInsideCategorySubcategories(cleanedName);
    return subcats.map((name, index) => ({ id: `inside_subcat_${index + 1}`, name }));
  }

  if (isOutside) {
    if (normalizedName === 'door') return DOOR_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'drain') return DRAIN_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'electrical') return ELECTRICAL_SUBCATEGORIES_OUTSIDE;
    if (normalizedName.includes('fencing') || normalizedName.includes('gate')) return FENCING_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'fire safety') return FIRE_SAFETY_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'hazard') return HAZARD_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'lighting') return LIGHTING_SUBCATEGORIES_OUTSIDE;
    if (normalizedName.includes('parking') || normalizedName.includes('driveway') || normalizedName.includes('road')) return PARKING_SUBCATEGORIES_OUTSIDE;
    if (normalizedName === 'railings') return RAILINGS_SUBCATEGORIES_OUTSIDE;
    if (normalizedName.includes('retaining wall') || normalizedName === 'retaining wall') return RETAINING_WALL_SUBCATEGORIES_OUTSIDE;
  }
  return [];
};

// Helper function to get deficiencies for a subcategory
export const getDeficienciesForSubcategory = (subcategoryName: string, locationType?: string, parentCategory?: string): ItemDeficiencies => {
  const normalizedName = subcategoryName.toLowerCase();
  const isOutside = locationType?.toLowerCase() === 'outside';
  const isUnit = isUnitLocation(locationType || '');
  const isInside = locationType?.toLowerCase() === 'inside';

  // ==========================================
  // UNIT LOCATIONS — Always use insideDeficiencyMapping subcategories
  // Must run BEFORE all other checks so unit rooms (Bedroom, Bathroom, etc.)
  // never accidentally fall through to Outside or Inside-building subcategory data.
  // ==========================================
  if (isUnit) {
    // If parentCategory is provided, search within that category first (precise match)
    if (parentCategory) {
      const cleanedParent = parentCategory.replace(/^\d+\.\s*/, '');
      const parentCat = ALL_INSIDE_CATEGORIES.find(
        cat => cat.itemName.toLowerCase() === cleanedParent.toLowerCase()
      );
      if (parentCat?.subcategories) {
        const matchingSubcat = parentCat.subcategories.find(
          sub => sub.name.toLowerCase() === normalizedName
        );
        if (matchingSubcat) {
          return {
            itemName: matchingSubcat.name,
            deficiencies: matchingSubcat.deficiencies.map(d => ({
              id: d.id,
              name: d.name,
              detail: d.detail,
              criteria: d.criteria,
              severity: d.severity,
              repairBy: d.repairBy,
              points: d.points,
              code: d.code || '',
              codeReference: d.codeReference,
            }))
          };
        }
      }
    }
    // Fallback: search all categories
    for (const category of ALL_INSIDE_CATEGORIES) {
      if (category.subcategories) {
        const matchingSubcat = category.subcategories.find(
          sub => sub.name.toLowerCase() === normalizedName
        );
        if (matchingSubcat) {
          return {
            itemName: matchingSubcat.name,
            deficiencies: matchingSubcat.deficiencies.map(d => ({
              id: d.id,
              name: d.name,
              detail: d.detail,
              criteria: d.criteria,
              severity: d.severity,
              repairBy: d.repairBy,
              points: d.points,
              code: d.code || '',
              codeReference: d.codeReference,
            }))
          };
        }
      }
    }
  }

  // ==========================================
  // INSIDE LOCATIONS — Always use unitDeficiencyMapping subcategories
  // Must run BEFORE all hardcoded Outside checks so Inside building locations
  // (Halls/Corridors, Laundry Room, etc.) never use Outside data.
  // ==========================================
  if (isInside) {
    // Prefer parent-aware lookup to avoid false positives from same-named items in different categories
    const preciseResult = parentCategory ? getInsideSubcategoryDeficienciesByParent(parentCategory, subcategoryName) : null;
    const insideResult = preciseResult ?? getUnitSubcategoryDeficiencies(subcategoryName);
    if (insideResult) {
      return {
        itemName: insideResult.itemName,
        deficiencies: insideResult.deficiencies.map(d => ({
          id: d.id,
          name: d.name,
          detail: d.detail,
          criteria: d.criteria,
          severity: d.severity,
          repairBy: d.repairBy,
          points: d.points,
          code: d.code || '',
          codeReference: (d as any).codeReference || undefined,
        }))
      };
    }
  }

  // ==========================================
  // OUTSIDE LOCATIONS — Use outsideDeficiencyMapping hardcoded subcategory data
  // ==========================================
  if (isOutside) {
    // Door subcategories
    if (normalizedName.includes('door - general standard') || normalizedName === 'door - general standard') {
      return DOOR_GENERAL_STANDARD_OUTSIDE;
    }
    if (normalizedName === 'garage door' || normalizedName.includes('garage door')) {
      return GARAGE_DOOR_OUTSIDE;
    }

    // Drain subcategories
    if (normalizedName === 'drain') {
      return DRAIN_DRAIN_DATA;
    }
    if (normalizedName === 'site drainage' || normalizedName.includes('site drainage')) {
      return SITE_DRAINAGE_DATA;
    }

    // Electrical subcategories
    if (normalizedName === 'electrical - conductor, outlet, and switch' || normalizedName.includes('electrical - conductor')) {
      return ELECTRICAL_CONDUCTOR_OUTLET_SWITCH;
    }
    if (normalizedName.includes('afci outlet') || normalizedName.includes('afci breaker')) {
      return ELECTRICAL_AFCI_OUTLET;
    }
    if (normalizedName.includes('unprotected outlet')) {
      return ELECTRICAL_UNPROTECTED_OUTLET;
    }
    if (normalizedName.includes('gfci outlet') || normalizedName.includes('gfci breaker')) {
      return ELECTRICAL_GFCI_OUTLET;
    }
    if (normalizedName === 'electrical service panel' || normalizedName.includes('service panel')) {
      return ELECTRICAL_SERVICE_PANEL_DATA;
    }

    // Fire Safety subcategories
    if (normalizedName === 'exit sign' || normalizedName.includes('exit sign')) {
      return EXIT_SIGN_DEFICIENCIES;
    }
    if (normalizedName === 'fire escape' || normalizedName.includes('fire escape')) {
      return FIRE_ESCAPE_DEFICIENCIES;
    }
    if (normalizedName === 'fire extinguisher' || normalizedName.includes('fire extinguisher')) {
      return FIRE_EXTINGUISHER_DEFICIENCIES;
    }
    if (normalizedName.includes('flammable') || normalizedName.includes('combustible')) {
      return FLAMMABLE_COMBUSTIBLE_DEFICIENCIES;
    }
    if (normalizedName.includes('sprinkler')) {
      return SPRINKLER_ASSEMBLY_DEFICIENCIES;
    }

    // Fencing/Gate subcategories
    if (normalizedName === 'fence and gate' || normalizedName.includes('fence')) {
      return FENCE_AND_GATE_OUTSIDE;
    }

    // Hazard subcategories
    if (normalizedName === 'rat') {
      return RAT_DEFICIENCIES;
    }
    if (normalizedName === 'litter') {
      return LITTER_DEFICIENCIES;
    }
    if (normalizedName === 'sharp edges' || normalizedName.includes('sharp')) {
      return SHARP_EDGES_DEFICIENCIES;
    }
    if (normalizedName === 'trip hazard' || normalizedName.includes('trip')) {
      return TRIP_HAZARD_DEFICIENCIES;
    }

    // Lighting subcategories
    if (normalizedName.includes('auxiliary')) {
      return LIGHTING_AUXILIARY_DEFICIENCIES;
    }
    if (normalizedName === 'lighting - exterior' || normalizedName.includes('lighting - exterior')) {
      return LIGHTING_EXTERIOR_DEFICIENCIES;
    }

    // Parking subcategories
    if (normalizedName === 'parking lot' || normalizedName.includes('parking lot')) {
      return PARKING_LOT_DEFICIENCIES;
    }
    if (normalizedName.includes('private roads') || normalizedName.includes('driveways')) {
      return PRIVATE_ROADS_DRIVEWAYS_DEFICIENCIES;
    }

    // Railings subcategories
    if (normalizedName === 'guardrail' || normalizedName.includes('guardrail')) {
      return GUARDRAIL_DEFICIENCIES;
    }
    if (normalizedName === 'handrail' || normalizedName.includes('handrail')) {
      return HANDRAIL_DEFICIENCIES;
    }

    // Retaining Wall subcategories
    if (normalizedName === 'retaining wall') {
      return RETAINING_WALL_SUBCATEGORY;
    }
    if (normalizedName === 'wall - exterior' || normalizedName.includes('wall - exterior')) {
      return WALL_EXTERIOR_DEFICIENCIES;
    }
  }

  return {
    itemName: subcategoryName,
    deficiencies: []
  };
};
