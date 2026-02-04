// Comprehensive NSPIRE Deficiency Mapping
// This file serves as the main entry point and imports from specialized mapping files

// Import OUTSIDE deficiencies from dedicated file with exact Excel data
import {
  getOutsideDeficienciesByCategory,
  ALL_OUTSIDE_DEFICIENCIES,
  OUTSIDE_CATEGORIES,
  ADDRESS_SIGNAGE_OUTSIDE,
  CHIMNEY_OUTSIDE,
  DRYER_VENT_OUTSIDE,
  DOOR_OUTSIDE,
  DRAIN_OUTSIDE,
  EGRESS_OUTSIDE,
  ELECTRICAL_OUTSIDE,
  FENCING_GATE_OUTSIDE,
  FIRE_SAFETY_OUTSIDE,
  FOUNDATION_OUTSIDE,
  HAZARD_OUTSIDE,
  HVAC_OUTSIDE,
  LEAK_GAS_OIL_OUTSIDE,
  LEAK_SEWAGE_OUTSIDE,
  LEAK_WATER_OUTSIDE,
  LIGHTING_OUTSIDE,
  PARKING_OUTSIDE,
  PAINT_OUTSIDE,
  RAILINGS_OUTSIDE,
  ROOF_OUTSIDE,
  SIDEWALK_OUTSIDE,
  STAIRS_OUTSIDE,
  STRUCTURAL_OUTSIDE,
  RETAINING_WALL_OUTSIDE,
  WATER_HEATER_OUTSIDE,
  GENERAL_COMMENT_OUTSIDE,
  ItemDeficiencies as OutsideItemDeficiencies,
  DeficiencyOption as OutsideDeficiencyOption,
} from './outsideDeficiencyMapping';

// Re-export Outside deficiencies for direct access
export {
  getOutsideDeficienciesByCategory,
  ALL_OUTSIDE_DEFICIENCIES,
  OUTSIDE_CATEGORIES,
  ADDRESS_SIGNAGE_OUTSIDE,
  CHIMNEY_OUTSIDE,
  DRYER_VENT_OUTSIDE,
  DOOR_OUTSIDE,
  DRAIN_OUTSIDE,
  EGRESS_OUTSIDE,
  ELECTRICAL_OUTSIDE,
  FENCING_GATE_OUTSIDE,
  FIRE_SAFETY_OUTSIDE,
  FOUNDATION_OUTSIDE,
  HAZARD_OUTSIDE,
  HVAC_OUTSIDE,
  LEAK_GAS_OIL_OUTSIDE,
  LEAK_SEWAGE_OUTSIDE,
  LEAK_WATER_OUTSIDE,
  LIGHTING_OUTSIDE,
  PARKING_OUTSIDE,
  PAINT_OUTSIDE,
  RAILINGS_OUTSIDE,
  ROOF_OUTSIDE,
  SIDEWALK_OUTSIDE,
  STAIRS_OUTSIDE,
  STRUCTURAL_OUTSIDE,
  RETAINING_WALL_OUTSIDE,
  WATER_HEATER_OUTSIDE,
  GENERAL_COMMENT_OUTSIDE,
};

export interface DeficiencyOption {
  id: string;
  name: string;
  detail: string;
  criteria: string;
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  repairBy: string;
  points: string;
  code?: string;
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
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'ADDR-01'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'CHIM-01'
    },
    {
      id: 'chim_2',
      name: 'Chimney exhibits signs of structural failure.',
      detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
      criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'CHIM-02'
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
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRYER-01'
    },
    {
      id: 'dryer_2',
      name: 'Exterior dryer vent cover, cap, or a component thereof is missing.',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRYER-02'
    },
    {
      id: 'dryer_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'DRYER-03'
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
      name: 'Installed Lock cannot be engaged from both sides.',
      detail: 'Lock cannot be engaged from interior or exterior.',
      criteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-GEN-STD-01'
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
      detail: 'Garage door mechanism is not functioning properly.',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GARAGE-OUT-01'
    },
    {
      id: 'garage_out_2',
      name: 'Garage door has a hole.',
      detail: 'Hole is present in the garage door.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GARAGE-OUT-02'
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
      code: 'DRAIN-01'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'SITE-DRAIN-01'
    },
    {
      id: 'site_drain_2',
      name: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      detail: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SITE-DRAIN-02'
    },
    {
      id: 'site_drain_3',
      name: 'Water runoff is unable to flow through the site drainage system.',
      detail: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SITE-DRAIN-03'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-COS-01'
    },
    {
      id: 'elec_cos_2',
      name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
      detail: 'AFCI test or reset button is inoperable.',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-COS-02'
    },
    {
      id: 'elec_cos_3',
      name: 'Electrical service panel is not reasonably accessible.',
      detail: 'Panel cannot be reached without moving obstructions.',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-COS-03'
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-AFCI-01'
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-UNPROT-01'
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-GFCI-01'
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
      code: 'ESP-OUT-01'
    },
    {
      id: 'esp_out_2',
      name: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ESP-OUT-02'
    },
    {
      id: 'esp_out_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ESP-OUT-03'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'EXIT-SIGN-01'
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
      detail: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety.',
      criteria: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-ESC-01'
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
      detail: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
      criteria: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FIRE-EXT-01'
    },
    {
      id: 'fire_ext_2',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FIRE-EXT-02'
    },
    {
      id: 'fire_ext_3',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FIRE-EXT-03'
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
      detail: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
      criteria: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FLAM-01'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'SPRINK-01'
    },
    {
      id: 'sprink_2',
      name: 'Sprinkler head assembly has evidence of corrosion.',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SPRINK-02'
    },
    {
      id: 'sprink_3',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'SPRINK-03'
    },
    {
      id: 'sprink_4',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'SPRINK-04'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RAT-01'
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
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'LITTER-01'
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'SHARP-01'
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'TRIP-01'
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
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LIGHT-AUX-01'
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
      code: 'LIGHT-EXT-01'
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
      code: 'PARK-LOT-01'
    },
    {
      id: 'park_lot_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'PARK-LOT-02'
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
      code: 'PRIV-ROAD-01'
    },
    {
      id: 'priv_road_2',
      name: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      detail: 'The driveway is not functionally adequate.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PRIV-ROAD-02'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'GUARD-01'
    },
    {
      id: 'guard_2',
      name: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GUARD-02'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAND-01'
    },
    {
      id: 'hand_2',
      name: 'Handrail is not functionally adequate.',
      detail: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAND-02'
    },
    {
      id: 'hand_3',
      name: 'Handrail is not installed where required.',
      detail: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAND-03'
    },
    {
      id: 'hand_4',
      name: 'Handrail is not secured.',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAND-04'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RET-WALL-01'
    },
    {
      id: 'ret_wall_2',
      name: 'Retaining wall is partially or completely collapsed.',
      detail: 'The retaining wall is (sloped) partially or completely collapsed.',
      criteria: 'The retaining wall is (sloped) partially or completely collapsed.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'RET-WALL-02'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'WALL-EXT-01'
    },
    {
      id: 'wall_ext_2',
      name: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      detail: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WALL-EXT-02'
    },
    {
      id: 'wall_ext_3',
      name: 'Exterior wall has peeling paint of 10 square feet or more',
      detail: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'WALL-EXT-03'
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
      points: '4.5/n',
      code: 'DOOR-ENTRY-01'
    },
    {
      id: 'door_entry_2',
      name: 'Self-closing mechanism is damaged, inoperable or damaged.',
      detail: 'The self-closing mechanism is damaged, does not pull the door closed and engage the latch, or is missing.',
      criteria: 'Self-closing mechanism failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-ENTRY-02'
    },
    {
      id: 'door_entry_3',
      name: 'Entry door surface is delaminated or separated.',
      detail: 'There is delamination or separation of the door surface 2 inches wide or greater.',
      criteria: 'Delamination or separation that affects the integrity of the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-ENTRY-03'
    },
    {
      id: 'door_entry_4',
      name: 'Entry door will not close.',
      detail: 'Entry door does not close (i.e., door seats in frame).',
      criteria: 'Entry door will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-ENTRY-04'
    },
    {
      id: 'door_entry_5',
      name: 'Entry door will not open.',
      detail: 'Entry door does not open.',
      criteria: 'Entry door does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'DOOR-ENTRY-05'
    },
    {
      id: 'door_entry_6',
      name: 'Hole, split, or crack that penetrates completely through the entry door.',
      detail: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
      criteria: 'Penetrates through the door or door sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-ENTRY-06'
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
      points: '24.8/n',
      code: 'DOOR-FIRE-01'
    },
    {
      id: 'door_fire_2',
      name: 'Fire-labeled door assembly has a hole of any size.',
      detail: 'Hole of any size OR damaged such that its integrity may be compromised.',
      criteria: 'Integrity compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'DOOR-FIRE-02'
    },
    {
      id: 'door_fire_3',
      name: 'Fire - labeled door cannot be secured.',
      detail: 'Fire-labeled door that serves as an entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Cannot be secured.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'DOOR-FIRE-03'
    },
    {
      id: 'door_fire_4',
      name: 'Fire - labeled door does not close and latch.',
      detail: 'Fire - labeled door does not close and latch OR self-closing hardware is damaged or missing.',
      criteria: 'Door does not self-close and latch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'DOOR-FIRE-04'
    },
    {
      id: 'door_fire_5',
      name: 'Fire-labeled door does not open.',
      detail: 'Fire-labeled door does not open, which may limit access between spaces.',
      criteria: 'Does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'DOOR-FIRE-05'
    },
    {
      id: 'door_fire_6',
      name: 'Fire-labeled door is missing.',
      detail: 'Evidence of prior installation, but now not present or is incomplete.',
      criteria: 'Door missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'DOOR-FIRE-06'
    },
    {
      id: 'door_fire_7',
      name: 'Fire - labeled door seal or gasket is damaged.',
      detail: 'Seal or gasket is damaged (impacts functionality) or missing.',
      criteria: 'Seal/gasket failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-FIRE-07'
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
      points: '4.5/n',
      code: 'DOOR-GEN-01'
    },
    {
      id: 'door_gen_2',
      name: 'A passage door (utility, storage, closet, laundry) does not open.',
      detail: 'A passage door does not open such that it may limit access when needed.',
      criteria: 'Does not open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-GEN-02'
    },
    {
      id: 'door_gen_3',
      name: 'A passage door (non-access) has a damaged component.',
      detail: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      criteria: 'Component damaged/missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'DOOR-GEN-03'
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
      points: '4.5/n',
      code: 'GARAGE-01'
    },
    {
      id: 'garage_2',
      name: 'The garage door has a hole (broken panel or window).',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Hole penetrating to interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'GARAGE-02'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'EGRESS-01'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-01'
    },
    {
      id: 'elec_2',
      name: 'Electrical - AFCI',
      detail: 'The AFCI outlet or AFCI breaker does not reset.',
      criteria: 'AFCI outlet or AFCI breaker test or reset button is inoperable (if damaged, considered exposed conductor).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-02'
    },
    {
      id: 'elec_3',
      name: 'Electrical - Accessibility',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'Cannot be reached and opened without moving obstructions, dismantling, or destructive measures.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-03'
    },
    {
      id: 'elec_4',
      name: 'Electrical - Water Source Proximity',
      detail: 'Unprotected outlet is present within six feet of a water source.',
      criteria: 'Outlet not GFCI protected within six feet of a water source (sink, bathtub, shower, toilet).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-04'
    },
    {
      id: 'elec_5',
      name: 'Electrical - GFCI',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      criteria: 'Test or reset button is inoperable (system not meeting function).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-05'
    },
    {
      id: 'elec_6',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      criteria: 'Fuse or breaker is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-06'
    },
    {
      id: 'elec_7',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'Fuse or breaker is visibly defective/damaged; may not interrupt circuit.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-07'
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
      code: 'ESP-01'
    },
    {
      id: 'esp_2',
      name: 'The overcurrent protection device is contaminated.',
      detail: 'The overcurrent protection device (fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
      criteria: 'Contamination present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ESP-02'
    },
    {
      id: 'esp_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device is damaged such that it may not interrupt the circuit.',
      criteria: 'Visibly defective; impacts functionality.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ESP-03'
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
      detail: 'Fence missing components like pickets, posts, or panels.',
      criteria: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-01'
    },
    {
      id: 'fence_2',
      name: 'Fence demonstrates signs of collapse.',
      detail: 'Fence shows visible signs of structural failure.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FENCE-02'
    },
    {
      id: 'fence_3',
      name: 'The gate does not open, close, catch, or lock.',
      detail: 'Gate mechanical failure.',
      criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-03'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-01'
    },
    {
      id: 'fire_2',
      name: 'Fire Escape',
      detail: 'Fire escape component is damaged, or missing.',
      criteria: 'Stair, ladder, platform, guardrail, or handrail is visibly damaged or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-02'
    },
    {
      id: 'fire_3',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing.',
      criteria: 'Visibly damaged or missing (includes cases where prior installation is evident).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FIRE-03'
    },
    {
      id: 'fire_4',
      name: 'Fire Extinguisher Pressure',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FIRE-04'
    },
    {
      id: 'fire_5',
      name: 'Fire Extinguisher Tag',
      detail: 'The fire extinguisher tag is missing, illegible, or expired.',
      criteria: 'Service tag > 1 year OR Tag missing/illegible OR Disposable unit > 12 years old.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FIRE-05'
    },
    {
      id: 'fire_6',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Improperly stored near ignition sources, thermal appliances, or improperly stored chemicals.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-06'
    },
    {
      id: 'fire_7',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-07'
    },
    {
      id: 'fire_8',
      name: 'Sprinkler Assembly Corrosion',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FIRE-08'
    },
    {
      id: 'fire_9',
      name: 'Sprinkler Assembly Debris',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or glass bulb.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FIRE-09'
    },
    {
      id: 'fire_10',
      name: 'Sprinkler Assembly Obstruction',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FIRE-10'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FOUND-01'
    },
    {
      id: 'found_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FOUND-02'
    },
    {
      id: 'found_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.',
      criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-03'
    },
    {
      id: 'found_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FOUND-04'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAZ-01'
    },
    {
      id: 'hazard_2',
      name: 'Litter',
      detail: 'Litter is accumulated in an undesignated area.',
      criteria: '10 or more small items or any large discarded items in a 10x10 ft area.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'HAZ-02'
    },
    {
      id: 'hazard_3',
      name: 'Sharp edges',
      detail: 'A sharp edge that can result in a cut or puncture hazard is present.',
      criteria: 'Hazard likely to require emergency care (e.g., stitches).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'HAZ-03'
    },
    {
      id: 'hazard_4',
      name: 'Trip hazard',
      detail: 'Trip hazard on walking surface.',
      criteria: 'Abrupt change in elevation of 3/4 inch or more, or horizontal gap of 2 inches or more.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'HAZ-04'
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
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'HVAC-OUT-01'
    }
  ]
};

// 12. HVAC - INSIDE (comprehensive deficiencies) - EXACT NSPIRE TABLE MAPPING
export const HVAC_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Heating, Ventilation, and Air Conditioning',
  deficiencies: [
    {
      id: 'hvac_1',
      name: 'Air conditioning system or device is not operational.',
      detail: 'The system or device does not turn on. OR System or device only produces hot or room temperature air.',
      criteria: '(e.g., a window unit or central air system)',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'HVAC-01'
    },
    {
      id: 'hvac_2',
      name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
      detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
      criteria: 'a combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'HVAC-02'
    },
    {
      id: 'hvac_3',
      name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
      detail: 'A fuel-burning heating system or device is present. And exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. Or Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'HVAC-03'
    },
    {
      id: 'hvac_4',
      name: 'Heating system or device safety shield is damaged or missing.',
      detail: 'Heating system or device safety shield is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Safety shield was previously installed and is now not present or is incomplete. Heating systems in tropical islands are excluded.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'HVAC-04'
    },
    {
      id: 'hvac_5',
      name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
      detail: 'A permanently installed heating source is damaged. OR a permanently installed heating source is inoperable, not meeting function or purpose, with or without visible damage. OR a permanently installed heating source is missing (i.e., evidence of prior installation but is now not present or is incomplete). OR A permanently installed heating source is not installed. And The outside temperature is below 68 degrees Fahrenheit',
      criteria: 'Permanently is affixed within the unit or building, safely connected to the unit or building electrical system, thermostatically controlled by the unit or building, and appropriate for the size of the unit or building. The energy source for a permanently heating system can be electric, gas, or oil (Boiler Chiller system). The heating systems in tropical islands are excluded.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '13.40/n',
      code: 'HVAC-05'
    },
    {
      id: 'hvac_6',
      name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
      detail: 'The inspection date is on or between October 1 and March 31. AND the permanently installed heating source is not working. OR the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
      criteria: 'The permanently installed heating source is not working to create heat. Heating systems in tropical islands are excluded.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'HVAC-06'
    },
    {
      id: 'hvac_7',
      name: 'Unvented space heater is present.',
      detail: 'Unvented space heater that burns gas, oil, or kerosene is present',
      criteria: 'Inside, include any and all common areas.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'HVAC-07'
    }
  ]
};

// 13. Leak – Gas or Oil - EXACT NSPIRE TABLE MAPPING
export const LEAK_GAS_OIL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak – Gas or Oil',
  deficiencies: [
    {
      id: 'leak_gas_1',
      name: 'Natural gas, propane, or oil leak.',
      detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
      criteria: 'Inside, includes to any garage, common area, hallway, patio, or balcony.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '54.50/n',
      code: 'LEAK-GAS-01'
    }
  ]
};

// 14. Leak - sewage system (Clogged drain)(Missing drain cap) - EXACT NSPIRE TABLE MAPPING
export const LEAK_SEWAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak-sewage system (Clogged drain)(Missing drain cap)',
  deficiencies: [
    {
      id: 'leak_sew_1',
      name: 'Blocked sewage system.',
      detail: 'Wastewater is unable to drain resulting in sewer backup.',
      criteria: 'Blocked sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'LEAK-SEW-01'
    },
    {
      id: 'leak_sew_2',
      name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
      detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LEAK-SEW-02'
    },
    {
      id: 'leak_sew_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
      criteria: 'Protective cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LEAK-SEW-03'
    },
    {
      id: 'leak_sew_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'LEAK-SEW-04'
    }
  ]
};

// 15. Leak - water - EXACT NSPIRE TABLE MAPPING
export const LEAK_WATER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak- water',
  deficiencies: [
    {
      id: 'leak_water_1',
      name: 'Environmental water intrusion',
      detail: 'Water from the exterior environment is leaking into the interior.',
      criteria: 'Environmental water intrusion.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LEAK-WATER-01'
    },
    {
      id: 'leak_water_2',
      name: 'Fluid is leaking from the sprinkler assembly.',
      detail: 'Fluid is leaking from the sprinkler assembly.',
      criteria: 'Fluid is leaking from the sprinkler assembly.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LEAK-WATER-02'
    },
    {
      id: 'leak_water_3',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LEAK-WATER-03'
    }
  ]
};

// 16. Lighting - EXACT NSPIRE TABLE MAPPING
export const LIGHTING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: [
    {
      id: 'light_1',
      name: 'Lighting - Auxiliary',
      detail: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
      criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'LIGHT-01'
    },
    {
      id: 'light_2',
      name: 'Lighting - Interior',
      detail: 'A permanently installed light fixture is inoperable.',
      criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LIGHT-02'
    },
    {
      id: 'light_3',
      name: 'A permanently installed light fixture is not secure.',
      detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LIGHT-03'
    },
    {
      id: 'light_4',
      name: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
      detail: 'Permanent lighting fixtures are missing or not functioning.',
      criteria: 'Permanent lighting fixtures are missing or not functioning.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'LIGHT-04'
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
      code: 'PARK-01'
    },
    {
      id: 'park_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'Significant ponding making area unusable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-02'
    },
    {
      id: 'park_3',
      name: 'Private Roads and Driveways',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      criteria: 'Blocked access (not including temporary obstruction).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PARK-03'
    },
    {
      id: 'park_4',
      name: 'Private Roads Potholes',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-04'
    }
  ]
};

// 18. Paint - Lead-Based Paint
export const PAINT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Paint - Lead-Based',
  deficiencies: [
    {
      id: 'paint_1',
      name: 'Less than 2 SF - Paint in a Unit or inside the target property is deteriorated, below the level required for lead-safe work practices by a lead-certified firm or for passing clearance.',
      detail: 'Paint is deteriorated. (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis")',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces. Target housing 1978 or prior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'PAINT-01'
    },
    {
      id: 'paint_2',
      name: 'More than 2 SF - Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is deteriorated. (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant")',
      criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces. Target housing 1978 or prior.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'PAINT-02'
    }
  ]
};

// 19. Railings - EXACT NSPIRE TABLE MAPPING
export const RAILINGS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: [
    {
      id: 'rail_1',
      name: 'Guardrail - Missing or Not Installed',
      detail: 'Guardrail is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Guardrail is not installed; guardrail should be installed to prevent people from falling from a walking surface over 30 inches above the floor or the grade.',
      criteria: 'Guardrail missing along a walking surface over 30 inches above the floor or grade.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'RAIL-01'
    },
    {
      id: 'rail_2',
      name: 'Guardrail - Not Functionally Adequate',
      detail: 'Guardrail is missing critical components (the top rail that extends between supports); OR Guardrail structure is visibly damaged (i.e., visibly defective; impacts functionality); AND/OR Guardrail (top of rail) is under 30 inches high or guardrail is not securely attached.',
      criteria: 'Guardrail is not functionally adequate.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'RAIL-02'
    },
    {
      id: 'rail_3',
      name: 'Handrail - Missing',
      detail: 'Handrail is missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Handrail is missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '27.25/n',
      code: 'RAIL-03'
    },
    {
      id: 'rail_4',
      name: 'Handrail - Not Functionally Adequate',
      detail: 'Handrail cannot be reasonably grasped; OR handrail is not continuous (i.e., breaks, gaps); OR handrail is not between 28 and 42 inches high (measured from stair nosing).',
      criteria: 'Handrail is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'RAIL-04'
    },
    {
      id: 'rail_5',
      name: 'Handrail - Not Installed where Required',
      detail: '4 or more stair risers are present. OR Ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches.',
      criteria: 'Handrail not installed where required.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'RAIL-05'
    },
    {
      id: 'rail_6',
      name: 'Handrail - Not Secured',
      detail: 'There is movement in the anchors of the handrail (i.e., anchors are not flush with the wall; or anchors are not firmly affixed to the wall).',
      criteria: 'Handrail is not secured.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'RAIL-06'
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
      code: 'ROOF-01'
    },
    {
      id: 'roof_2',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ROOF-02'
    },
    {
      id: 'roof_3',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ROOF-03'
    },
    {
      id: 'roof_4',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-04'
    },
    {
      id: 'roof_5',
      name: 'Substrate is exposed.',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Visually observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ROOF-05'
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
      code: 'SIDE-01'
    },
    {
      id: 'side_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SIDE-02'
    }
  ]
};

// 22. Step and Stairs - EXACT NSPIRE TABLE MAPPING
export const STAIRS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Steps and Stairs',
  deficiencies: [
    {
      id: 'stair_1',
      name: 'Stringer is damaged.',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiency is observed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'STAIR-01'
    },
    {
      id: 'stair_2',
      name: 'Tread on a set of stairs damaged.',
      detail: 'Tread on a set of stairs is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Tread on a set of stairs is loose or unlevel. OR A portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
      criteria: 'Accessory treads (including stair tread nosing, an individual piece of material positioned on the tread surface of each step) are present and verified to be functional.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'STAIR-02'
    }
  ]
};

// 23. Structural - EXACT NSPIRE TABLE MAPPING
export const STRUCTURAL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Structural System',
  deficiencies: [
    {
      id: 'struct_1',
      name: 'Structural system exhibits signs of serious failure.',
      detail: 'Physical evidence that may threaten residents\' safety; a significant break or fracture in structural components or a significant deformity in structural framing from the normal structural design. A structural element\'s framing members are leaning (i.e., not plumb) or structural element\'s surface is in a bowed or sagging position (i.e., not level). Bulging or bowing is observed in a structural element.',
      criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior. Also applicable to an adjoining structure that threatens the integrity of this structure.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'STRUCT-01'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RET-01'
    },
    {
      id: 'ret_2',
      name: 'Retaining wall collapsed.',
      detail: 'The retaining wall is partially or completely collapsed.',
      criteria: 'The retaining wall is partially or completely collapsed.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'RET-02'
    },
    {
      id: 'ret_3',
      name: 'Exterior wall not functionally adequate.',
      detail: 'Impacts integrity of wall assembly or building envelope.',
      criteria: 'Does not allow exterior wall to separate the accommodation inside from outside.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RET-03'
    },
    {
      id: 'ret_4',
      name: 'Exterior wall covering missing.',
      detail: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      criteria: 'Cumulatively 1 sq ft or more missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-04'
    },
    {
      id: 'ret_5',
      name: 'Exterior wall peeling paint.',
      detail: 'Exterior wall has peeling paint of 10 square feet or more.',
      criteria: 'Cumulatively 10 sq ft or more peeling paint (built after 1978).',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'RET-05'
    }
  ]
};

// 25. Water Heater - EXACT NSPIRE TABLE MAPPING
export const WATER_HEATER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Water Heater',
  deficiencies: [
    {
      id: 'wh_1',
      name: 'Chimney or flue piping is blocked, misaligned, or missing',
      detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'The vent is damaged/misaligned /not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'WH-01'
    },
    {
      id: 'wh_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
      criteria: 'A gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'WH-02'
    },
    {
      id: 'wh_3',
      name: 'No hot water',
      detail: 'Hot water does not dispense after handle is engaged.',
      criteria: 'No hot water after several minutes.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'WH-03'
    },
    {
      id: 'wh_4',
      name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
      detail: 'TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The Tprv valve is not functioning adequately.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'WH-04'
    },
    {
      id: 'wh_5',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WH-05'
    }
  ]
};

// Trash Chute - EXACT NSPIRE TABLE MAPPING
export const TRASH_CHUTE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Trash Chute',
  deficiencies: [
    {
      id: 'trash_1',
      name: 'The chute door does not open, self-close, or latch.',
      detail: 'The chute door does not open or self-close and latch.',
      criteria: 'Chute door is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'TRASH-01'
    },
    {
      id: 'trash_2',
      name: 'Chute is clogged',
      detail: 'Trash is overflowing or backed up inside chute.',
      criteria: 'The garbage is backing up into the chute.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'TRASH-02'
    }
  ]
};

// 26. General Comment - EXACT NSPIRE TABLE MAPPING
export const GENERAL_COMMENT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'General Comment',
  deficiencies: [
    {
      id: 'gen_1',
      name: 'General observation or comment',
      detail: 'General observation or comment about the property condition.',
      criteria: 'General comment - for informational purposes only.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '0.00/n',
      code: 'GEN-01'
    }
  ]
};

// ==========================================
// INSIDE CATEGORIES - EXACT NSPIRE TABLE MAPPING
// ==========================================

// Inside 1. Cabinet and Storage (Pantry, Laundry) - EXACT NSPIRE TABLE MAPPING
export const CABINET_STORAGE_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Cabinet and Storage (Pantry, Laundry)',
  deficiencies: [
    {
      id: 'cab_in_1',
      name: 'Pantry, Food storage space is not present.',
      detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
      criteria: 'Stowed items, including food, sanitation, and household supplies.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'CAB-IN-01'
    }
  ]
};

// Inside 2. Call-for-Aid System - EXACT NSPIRE TABLE MAPPING
export const CALL_FOR_AID_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Call-for-Aid System',
  deficiencies: [
    {
      id: 'cfa_1',
      name: 'System does not function properly.',
      detail: 'A call-for-Aid system does not emit sound or light or send signal to annunciator.',
      criteria: 'The annunciator does not indicate the correct corresponding room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/50xn',
      code: 'CFA-01'
    },
    {
      id: 'cfa_2',
      name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
      detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
      criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/50xn',
      code: 'CFA-02'
    }
  ]
};

// Inside 3. Carbon Monoxide Alarm - EXACT NSPIRE TABLE MAPPING
export const CARBON_MONOXIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Carbon Monoxide Alarm',
  deficiencies: [
    {
      id: 'co_1',
      name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
      detail: 'Carbon monoxide alarm, inoperable.',
      criteria: 'With or without a battery, including low-volume.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'CO-01'
    },
    {
      id: 'co_2',
      name: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
      detail: 'The building contains a fuel-burning appliance or fuel-burning system, carbon monoxide alarm is missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'CO-02'
    },
    {
      id: 'co_3',
      name: 'Carbon monoxide alarm is obstructed.',
      detail: 'Carbon monoxide alarm is obstructed.',
      criteria: 'The carbon monoxide alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'CO-03'
    }
  ]
};

// Inside 4. Ceiling

// Inside 5. Chimney (Inside) - EXACT NSPIRE TABLE MAPPING
export const CHIMNEY_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Chimney',
  deficiencies: [
    {
      id: 'chim_in_1',
      name: 'Visually accessible and observed.',
      detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
      criteria: 'Fireplace or fire burning appliance is not intentionally decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'CHIM-IN-01'
    }
  ]
};

// Inside 6. Clothes Dryer Exhaust Ventilation (Inside) - EXACT NSPIRE TABLE MAPPING
export const DRYER_VENT_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Clothes Dryer Exhaust Ventilation',
  deficiencies: [
    {
      id: 'dryer_in_1',
      name: 'Dryer transition duct is constructed of unsuitable material.',
      detail: 'Dryer transition duct is not constructed of metal or an approved material.',
      criteria: 'Dryer is being used indoor.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DRYER-IN-01'
    },
    {
      id: 'dryer_in_2',
      name: 'Electrical dryer exhaust ventilation has restricted airflow.',
      detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow may be restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DRYER-IN-02'
    },
    {
      id: 'dryer_in_3',
      name: 'Electric dryer transition duct is detached or missing.',
      detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Dryer transition duct is not securely attached.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DRYER-IN-03'
    },
    {
      id: 'dryer_in_4',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow may be restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DRYER-IN-04'
    },
    {
      id: 'dryer_in_5',
      name: 'Gas dryer transition duct is detached or missing',
      detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Dryer transition duct is not securely attached.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DRYER-IN-05'
    }
  ]
};

// Inside 7. Door (Inside) - EXACT NSPIRE TABLE MAPPING - ALL DOOR TYPES
export const DOOR_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    // Door - Entry
    {
      id: 'door_in_1',
      name: 'Entry door cannot be secured.',
      detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Installed locks can not be engaged from both sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '13.40/n',
      code: 'DOOR-IN-01'
    },
    {
      id: 'door_in_2',
      name: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
      detail: 'Entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
      criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'DOOR-IN-02'
    },
    {
      id: 'door_in_3',
      name: 'The entry door frame, threshold, or trim is damaged.',
      detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
      criteria: 'Observed evidence of prior installation, now missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-03'
    },
    {
      id: 'door_in_4',
      name: 'Entry door is missing',
      detail: 'Evidence of prior installation',
      criteria: 'Not present or is incomplete.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-IN-04'
    },
    {
      id: 'door_in_5',
      name: 'Door - Entry',
      detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
      criteria: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-05'
    },
    {
      id: 'door_in_6',
      name: 'Self-closing mechanism is damaged, inoperable or damaged.',
      detail: 'Self-closing mechanism is damaged, inoperable or damaged.',
      criteria: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-06'
    },
    {
      id: 'door_in_7',
      name: 'Entry door surface is delaminated or separated.',
      detail: 'Entry door surface is delaminated or separated.',
      criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-07'
    },
    {
      id: 'door_in_8',
      name: 'Entry door will not close.',
      detail: 'Entry door will not close.',
      criteria: 'Entry door does not close (i.e., door seats in frame).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-IN-08'
    },
    {
      id: 'door_in_9',
      name: 'Entry door will not open.',
      detail: 'Entry door will not open.',
      criteria: 'Entry door does not open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-09'
    },
    {
      id: 'door_in_10',
      name: 'Hole, split, or crack that penetrates completely through the entry door.',
      detail: 'Hole, split, or crack that penetrates completely through the entry door.',
      criteria: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-IN-10'
    },
    // Door – Fire Labeled
    {
      id: 'door_fire_in_1',
      name: 'Door – Fire Labeled',
      detail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
      criteria: 'An object is present that may prevent the fire-labeled door from closing and latching. Or An object is present that may prevent the fire-labeled door from self-closing and latching.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-01'
    },
    {
      id: 'door_fire_in_2',
      name: 'Fire-labeled door assembly has a hole of any size.',
      detail: 'Fire-labeled door assembly has a hole of any size.',
      criteria: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-02'
    },
    {
      id: 'door_fire_in_3',
      name: 'Fire - labeled door cannot be secured.',
      detail: 'Fire - labeled door cannot be secured.',
      criteria: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-03'
    },
    {
      id: 'door_fire_in_4',
      name: 'Fire - labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
      detail: 'Fire - labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
      criteria: 'Fire - labeled door does not close and latch. OR fire - labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-04'
    },
    {
      id: 'door_fire_in_5',
      name: 'Fire-labeled door does not open.',
      detail: 'Fire-labeled door does not open.',
      criteria: 'Fire-labeled door does not open, which that it may limit access between spaces.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-05'
    },
    {
      id: 'door_fire_in_6',
      name: 'Fire-labeled door is missing.',
      detail: 'Fire-labeled door is missing.',
      criteria: '(i.e., Evidence of prior installation, but now not present or is incomplete).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'DOOR-FIRE-IN-06'
    },
    {
      id: 'door_fire_in_7',
      name: 'Fire-labeled door seal or gasket is damaged.',
      detail: 'Fire-labeled door seal or gasket is damaged.',
      criteria: 'Fire - labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'DOOR-FIRE-IN-07'
    },
    // Door-General (Passage Door)
    {
      id: 'door_gen_in_1',
      name: 'Door-General',
      detail: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
      criteria: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'DOOR-GEN-IN-01'
    },
    {
      id: 'door_gen_in_2',
      name: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
      detail: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
      criteria: 'A passage door does not open such that it may limit access when needed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DOOR-GEN-IN-02'
    },
    {
      id: 'door_gen_in_3',
      name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
      detail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
      criteria: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'DOOR-GEN-IN-03'
    },
    // Garage Door
    {
      id: 'garage_in_1',
      name: 'Garage Door',
      detail: 'Garage door does not open, close, or remains closed.',
      criteria: 'Door will not open and remain open, does not function adequately.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'GARAGE-IN-01'
    },
    {
      id: 'garage_in_2',
      name: 'The garage door has a hole (broken panel or window).',
      detail: 'The garage door has a hole (broken panel or window).',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'GARAGE-IN-02'
    }
  ]
};

// Inside 8. Drainage (Inside) - EXACT NSPIRE TABLE MAPPING
export const DRAINAGE_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drainage',
  deficiencies: [
    {
      id: 'drain_in_1',
      name: 'Drain/Floor drain',
      detail: 'The drain is fully blocked.',
      criteria: 'There is a problem with the drainage.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'DRAIN-IN-01'
    }
  ]
};

// Inside 9. Egress (Inside) - EXACT NSPIRE TABLE MAPPING
export const EGRESS_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_in_1',
      name: 'Obstructed means of egress',
      detail: 'The exit access or exit is obstructed. 1. Exit access - path from any interior location to an exit. 2. Exit doors to the outside and enclosed exit stairways.',
      criteria: 'Double-key Cylinder deadbolt locks or security features requiring a key, tool, or special effort from the stress side are not allowed on exit doors, exit access doors, or egress windows. Fixed or movable security bars must not block designated egress points, and no furniture or items may obstruct the means of egress.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'EGRESS-IN-01'
    }
  ]
};

// Inside 10. Electrical (Inside) - EXACT NSPIRE TABLE MAPPING
export const ELECTRICAL_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    // Conductor-Outlet, and Switch
    {
      id: 'elec_in_1',
      name: 'Conductor-Outlet, and Switch',
      detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
      criteria: 'Electrical conductors must be enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2"; missing light bulbs are evaluated under interior or exterior lighting.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'ELEC-IN-01'
    },
    {
      id: 'elec_in_2',
      name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
      detail: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
      criteria: 'An outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) does not have visible damage and testing indicates that it is not energized.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-02'
    },
    {
      id: 'elec_in_3',
      name: 'The outlet or switch is damaged.',
      detail: 'The outlet or switch is damaged.',
      criteria: 'Any portion of a visually accessible (i.e., can be reasonably accessed and observed) outlet or switch is damaged (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'ELEC-IN-03'
    },
    {
      id: 'elec_in_4',
      name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
      detail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
      criteria: 'Testing of a three-pronged outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) indicates that it is not properly wired or grounded.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-04'
    },
    {
      id: 'elec_in_5',
      name: 'Water is currently in contact with an electrical conductor.',
      detail: 'Water is currently in contact with an electrical conductor.',
      criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'ELEC-IN-05'
    },
    // Electrical-(GFCI) Or (AFCI)-Outlet or Breaker
    {
      id: 'elec_in_6',
      name: 'Electrical-(GFCI) Or (AFCI)-Outlet or Breaker',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-06'
    },
    {
      id: 'elec_in_7',
      name: 'Unprotected outlet is present within six feet of a water source.',
      detail: 'Unprotected outlet is present within six feet of a water source.',
      criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-07'
    },
    {
      id: 'elec_in_8',
      name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
      criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-08'
    },
    // Electrical Service Panel
    {
      id: 'elec_in_9',
      name: 'Electrical Service Panel',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property). Or it is looked or in locked location, no key to access.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'ELEC-IN-09'
    },
    {
      id: 'elec_in_10',
      name: 'The overcurrent protection device is contaminated.',
      detail: 'The overcurrent protection device is contaminated.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'ELEC-IN-10'
    },
    {
      id: 'elec_in_11',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an over current condition (i.e., paint, or other foreign materials).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'ELEC-IN-11'
    }
  ]
};

// Inside 11. Elevator - EXACT NSPIRE TABLE MAPPING
export const ELEVATOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Elevator',
  deficiencies: [
    {
      id: 'elev_1',
      name: 'Elevator Cab is not level with the floor.',
      detail: 'Poses tripping hazards.',
      criteria: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'ELEV-01'
    },
    {
      id: 'elev_2',
      name: 'The elevator door does not fully open or close.',
      detail: 'The elevator door does not fully open (at least 36 inches) and does not close.',
      criteria: 'All elevators must be in working condition.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'ELEV-02'
    },
    {
      id: 'elev_3',
      name: 'Elevator is inoperable.',
      detail: 'Elevator is inoperable (i.e. overall system or component thereof not meeting function or purpose; with or without visible damage).',
      criteria: 'Elevator system or component thereof not meeting function or purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'ELEV-03'
    },
    {
      id: 'elev_4',
      name: 'Safety edge device has malfunctioned or is inoperable.',
      detail: 'The safety edge device hasd has malfunctioned or is not functionally adequate.',
      criteria: 'Overall, the system or a component thereof is not meeting its function or purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'ELEV-04'
    }
  ]
};

// Inside 12. Fire Safety (Inside) - EXACT NSPIRE TABLE MAPPING
export const FIRE_SAFETY_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    // Exit Sign
    {
      id: 'fire_in_1',
      name: 'Exit Sign',
      detail: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
      criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-01'
    },
    // Fire Extinguisher
    {
      id: 'fire_in_2',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing.',
      criteria: 'A fire extinguisher is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-02'
    },
    {
      id: 'fire_in_3',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-03'
    },
    {
      id: 'fire_in_4',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The fire extinguisher tag is missing or illegible or expired.',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-04'
    },
    // Flammable and Combustible Item
    {
      id: 'fire_in_5',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
      criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place (e.g. under a kitchen sink cabinet, in a hall closet,etc.) is not a deficiency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-05'
    },
    // Smoke Alarm
    {
      id: 'fire_in_6',
      name: 'Smoke Alarm',
      detail: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
      criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'FIRE-IN-06'
    },
    {
      id: 'fire_in_7',
      name: 'Smoke alarm not installed where required.',
      detail: 'Smoke alarm not installed where required.',
      criteria: 'Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'FIRE-IN-07'
    },
    {
      id: 'fire_in_8',
      name: 'Smoke alarm is obstructed',
      detail: 'Smoke alarm is obstructed',
      criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'FIRE-IN-08'
    },
    {
      id: 'fire_in_9',
      name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
      detail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
      criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '0.000',
      code: 'FIRE-IN-09'
    },
    // Sprinkler Assembly
    {
      id: 'fire_in_10',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-10'
    },
    {
      id: 'fire_in_11',
      name: 'Sprinkler head assembly has evidence of corrosion.',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-11'
    },
    {
      id: 'fire_in_12',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-12'
    },
    {
      id: 'fire_in_13',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: '18 inches clearance is not due to feature within built (e.g. closet, utility closet).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'FIRE-IN-13'
    }
  ]
};

// Inside 13. Floor - EXACT NSPIRE TABLE MAPPING
export const FLOOR_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Floor',
  deficiencies: [
    {
      id: 'floor_1',
      name: 'Floor component(s) is not functionally adequate.',
      detail: 'Floor component(s) is not functionally adequate (i.e., does not allow floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping,defelection).',
      criteria: 'Surface abnormalities may indicate the presence of deficiency t(i.e. lifting iles,tilers, hardwood cupping, linoleum bubbling, etc.).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FLOOR-01'
    },
    {
      id: 'floor_2',
      name: 'Floor substrate is exposed',
      detail: '10% or more of the floor substrate area is exposed in any room.',
      criteria: 'Repair is needed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FLOOR-02'
    }
  ]
};

// Inside 14. Foundation (Inside) - EXACT NSPIRE TABLE MAPPING
export const FOUNDATION_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Foundation',
  deficiencies: [
    {
      id: 'found_in_1',
      name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
      detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
      criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FOUND-IN-01'
    },
    {
      id: 'found_in_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
      criteria: 'Foundation cracks (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FOUND-IN-02'
    },
    {
      id: 'found_in_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation through visual evaluation.',
      criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FOUND-IN-03'
    },
    {
      id: 'found_in_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'FOUND-IN-04'
    }
  ]
};

// Inside 15. Grab Bar - EXACT NSPIRE TABLE MAPPING
export const GRAB_BAR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Grab Bar',
  deficiencies: [
    {
      id: 'grab_1',
      name: 'The grab bar is not secured.',
      detail: 'Any movement whatsoever is detected in the grab bar.',
      criteria: 'Damaged, loose, or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'GRAB-01'
    }
  ]
};

// Inside 16. Hazard (Inside) - EXACT NSPIRE TABLE MAPPING
export const HAZARD_INSIDE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    // Infestation
    {
      id: 'haz_in_1',
      name: 'Infestation',
      detail: 'Evidence of bedbugs.',
      criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-01'
    },
    {
      id: 'haz_in_2',
      name: 'Evidence of cockroaches(dead).',
      detail: 'Evidence of cockroaches(dead).',
      criteria: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-02'
    },
    {
      id: 'haz_in_3',
      name: 'Evidence of mice.',
      detail: 'Evidence of mice.',
      criteria: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-03'
    },
    {
      id: 'haz_in_4',
      name: 'Evidence of other pests.',
      detail: 'Evidence of other pests.',
      criteria: 'Evidence is present of other pest infestations, including but not limited to a trail of ants, wasps/beehives, squirrels, birds, and bats in an interior area. Pests are animals with potential impacts on residents health and safety.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-04'
    },
    {
      id: 'haz_in_5',
      name: 'Evidence of rats.',
      detail: 'Evidence of rats.',
      criteria: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-05'
    },
    {
      id: 'haz_in_6',
      name: 'Extensive bedbugs infestation.',
      detail: 'Extensive bedbugs infestation.',
      criteria: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime through visual assessment.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-06'
    },
    {
      id: 'haz_in_7',
      name: 'Extensive cockroach infestation (live).',
      detail: 'Extensive cockroach infestation (live).',
      criteria: 'Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'HAZ-IN-07'
    },
    {
      id: 'haz_in_8',
      name: 'Extensive mouse infestation.',
      detail: 'Extensive mouse infestation.',
      criteria: 'Sighting of at least one live mouse in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-08'
    },
    {
      id: 'haz_in_9',
      name: 'Extensive rat infestation.',
      detail: 'Extensive rat infestation.',
      criteria: 'A live rat is seen in the unit.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-09'
    },
    // LITTER
    {
      id: 'haz_in_10',
      name: 'LITTER',
      detail: 'Litter is accumulated in an unassigned area.',
      criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-10'
    },
    // Sharp edges
    {
      id: 'haz_in_11',
      name: 'Sharp edges',
      detail: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
      criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'HAZ-IN-11'
    },
    // Trip hazard
    {
      id: 'haz_in_12',
      name: 'Trip hazard',
      detail: 'Trip hazard on walking surface.',
      criteria: 'There is an abrupt change in vertical elevation or horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: - An unintended ¾ inch or greater vertical difference',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-12'
    },
    {
      id: 'haz_in_13',
      name: 'Trip hazard - horizontal separation',
      detail: 'Trip hazard on walking surface.',
      criteria: 'horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: -An unintended 2-inch horizontal separation perpendicular to the path of travel.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'HAZ-IN-13'
    }
  ]
};

// Additional deficiencies for common items
export const BATHROOM_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Restroom',
  deficiencies: [
    // Bathtub/Shower
    {
      id: 'bath_1',
      name: 'Bathtub/shower - A bathtub or shower is inoperable or does not drain.',
      detail: 'A bathtub or shower is inoperable (i.e., not meeting function or purpose, water does not come out of shower or faucet). (At least one bathtub or shower is present elsewhere in the Unit that is operational.) OR A bathtub or shower does not drain and standing water is present (At least one bathtub or shower is present elsewhere in the Unit that is operational).',
      criteria: 'A bathtub or shower is inoperable, or standing water is present.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-01'
    },
    {
      id: 'bath_2',
      name: 'Bathtub/shower - Bathtub or shower component is damaged, inoperable, or missing.',
      detail: 'Bathtub or shower component is damaged (i.e., visibly defective): but may continue to function as intended. OR Bathtub or shower component is inoperable, not meeting function or purpose, with or without visible damage. OR Bathtub or shower component is missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Component is damaged, inoperable or missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'BATH-02'
    },
    {
      id: 'bath_3',
      name: 'Bathtub/shower - Only one bathtub or one shower is present within the Unit, and it is inoperable.',
      detail: 'Only one bathtub or one shower is present within the Unit, and it is inoperable, not meeting function or purpose, with or without visible damage.',
      criteria: 'Only one bathtub or shower is present, and it is inoperable.',
      severity: 'Severe',
      repairBy: '24Hrs',
      points: '13.40/n',
      code: 'BATH-03'
    },
    // Cabinet and Storage
    {
      id: 'bath_4',
      name: 'Cabinet and Storage - Cabinet and storage component(s) is damaged or missing.',
      detail: 'Some cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Some cabinet doors, drawers, or shelves are damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Impacts functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-04'
    },
    // Grab Bar
    {
      id: 'bath_5',
      name: 'Grab bar - Grab bar is damaged, inoperable, or missing.',
      detail: 'A grab bar is damaged (i.e., visibly defective; impacts functionality). OR A grab bar is inoperable, not meeting function or purpose, with or without visible damage. OR A grab bar is missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'An accessible grab bar is damaged, inoperable, or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-05'
    },
    // Mold (Restroom)
    {
      id: 'bath_6',
      name: 'MOLD - Elevated moisture or peeling and cracking paint.',
      detail: 'Elevated moisture level is visibly present (e.g., peeling paint, warped surfaces, water-stained surfaces).',
      criteria: 'Evidence of moisture.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-06'
    },
    {
      id: 'bath_7',
      name: 'MOLD - Mold-like substance is present (cumulative area = or > 9 square feet).',
      detail: 'A mold-like substance is present at extremely high levels. (Cumulative area equal to or greater than 9 square feet).',
      criteria: 'Cumulative area = or > 9 sq ft.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'BATH-07'
    },
    {
      id: 'bath_8',
      name: 'MOLD - Mold-like substance is present (cumulative area > 1 square foot and < 9 square feet).',
      detail: 'A mold-like substance is present at high levels. (Cumulative area greater than 1 square foot AND less than 9 square feet).',
      criteria: 'Cumulative area > 1 sq ft and < 9 sq ft.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'BATH-08'
    },
    {
      id: 'bath_9',
      name: 'MOLD - Mold-like substance is present (cumulative area = or > 4 square inches and = or <1 square foot).',
      detail: 'A mold-like substance is present at moderate levels. (Cumulative area equal to or greater than 4 square inches AND equal to or less than 1 square foot).',
      criteria: 'Cumulative area = or > 4 sq in and = or < 1 sq ft.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-09'
    },
    // Ventilation (Restroom)
    {
      id: 'bath_10',
      name: 'Ventilation - Restroom does not have ventilation present and operable.',
      detail: 'Restroom does not have some form of ventilation (exhaust fan or window that opens) present and operable.',
      criteria: 'Not present and operable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-10'
    },
    {
      id: 'bath_11',
      name: 'Ventilation - Exhaust system component is damaged or missing.',
      detail: 'Exhaust system component is damaged (i.e., visibly defective) or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Visibly defective or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-11'
    },
    {
      id: 'bath_12',
      name: 'Ventilation - Exhaust system does not respond to the control switch.',
      detail: 'Exhaust system does not respond to the control switch.',
      criteria: 'Inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'BATH-12'
    }
  ]
};

// Toilet - EXACT NSPIRE TABLE MAPPING
export const TOILET_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Toilet',
  deficiencies: [
    {
      id: 'toilet_1',
      name: 'A toilet is damaged or inoperable and at least one operational toilet is installed elsewhere in the Unit.',
      detail: 'A toilet is damaged (i.e., visibly defective; impacts functionality). OR A toilet is inoperable, not meeting function or purpose, with or without visible damage. AND At least one operational toilet is installed elsewhere in the Unit.',
      criteria: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'TOILET-01'
    },
    {
      id: 'toilet_2',
      name: 'Only one toilet was installed in the Unit, and it is damaged or inoperable.',
      detail: 'Only one toilet was installed in the Unit, and it is damaged (i.e., visibly defective; impacts functionality). OR Only one toilet was installed in the Unit, and it is inoperable, not meeting function or purpose, with or without visible damage.',
      criteria: 'Only one toilet was installed, and it is damaged or inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'TOILET-02'
    },
    {
      id: 'toilet_3',
      name: 'Only one toilet was installed in the Unit, and it is missing.',
      detail: 'Only one toilet was installed in the Unit, and it is missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Only one toilet was installed, and it is missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'TOILET-03'
    },
    {
      id: 'toilet_4',
      name: 'Toilet is not secured at the base.',
      detail: 'Toilet is not secured at the base.',
      criteria: 'Toilet is not secured at the base.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'TOILET-04'
    }
  ]
};

// Sink (Laundry, Garage, or patio) - EXACT NSPIRE TABLE MAPPING
export const SINK_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sink (Laundry, Garage, or patio)',
  deficiencies: [
    {
      id: 'sink_1',
      name: 'Control Knobs.',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: 'Control knobs do not activate or deactivate hot and cold water.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'SINK-01'
    },
    {
      id: 'sink_2',
      name: 'Component is missing',
      detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'SINK-02'
    },
    {
      id: 'sink_3',
      name: 'Improperly installed.',
      detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'SINK-03'
    },
    {
      id: 'sink_4',
      name: 'Sink is missing.',
      detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
      criteria: 'not present or incomplete.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'SINK-04'
    },
    {
      id: 'sink_5',
      name: 'Sink not draining',
      detail: 'Water is not draining from the basin of the sink.',
      criteria: 'Water is not draining from the basin of the sink.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'SINK-05'
    },
    {
      id: 'sink_6',
      name: 'Component is damaged',
      detail: 'The sink component is missing, damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'SINK-06'
    }
  ]
};

export const MOLD_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Mold',
  deficiencies: [
    {
      id: 'mold_1',
      name: 'Mold - Like Substance',
      detail: 'Peeling paint, elevated moisture level.',
      criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'MOLD-01'
    },
    {
      id: 'mold_2',
      name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'MOLD-02'
    },
    {
      id: 'mold_3',
      name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'MOLD-03'
    },
    {
      id: 'mold_4',
      name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
      detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'MOLD-04'
    }
  ]
};

// Window - EXACT NSPIRE TABLE MAPPING
export const WINDOW_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Window',
  deficiencies: [
    {
      id: 'window_1',
      name: 'Window cannot be secured.',
      detail: 'Window cannot be secured (i.e., access controlled) by at least 1 installed lock.',
      criteria: 'Only one lock present, and it is damaged, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WINDOW-01'
    },
    {
      id: 'window_2',
      name: 'Window component is damaged or missing, and the window is not functionally adequate',
      detail: 'The window component is missing (i.e., evidence of prior installation, but is now not present or is incomplete) or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater(i.e., can not protect from bugs, or debris).',
      criteria: 'Window is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WINDOW-02'
    },
    {
      id: 'window_3',
      name: 'Window will not close.',
      detail: 'The window does not close completely. OR At least one window lock is not present. OR The window can be opened once the lock is engaged.',
      criteria: 'Window lock does not keep the window closed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'WINDOW-03'
    },
    {
      id: 'window_4',
      name: 'Window will not open or stay open.',
      detail: 'Window will not open. Once opened, the window will not stay open without the use of a tool or item.',
      criteria: 'Will not stay open without the use of a tool or item.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WINDOW-04'
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
      points: '4.5/n',
      code: 'FLOOR-01'
    },
    {
      id: 'floor_2',
      name: 'Floor is not level or has significant damage',
      detail: 'Floor has significant sagging, buckling, or structural damage.',
      criteria: 'Floor is not level or has significant damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'FLOOR-02'
    },
    {
      id: 'floor_3',
      name: 'Trip hazard present',
      detail: 'Floor has raised edges, holes, or uneven surfaces creating trip hazard.',
      criteria: 'Trip hazard present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FLOOR-03'
    }
  ]
};

export const WALL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Wall-Interior',
  deficiencies: [
    {
      id: 'wall_1',
      name: 'Wall-Interior',
      detail: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
      criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WALL-01'
    },
    {
      id: 'wall_2',
      name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
      detail: 'The wall is damaged, and repairs still need to be completed appropriately.',
      criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WALL-02'
    },
    {
      id: 'wall_3',
      name: 'Interior wall has a loose or detached surface covering.',
      detail: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
      criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'WALL-03'
    }
  ]
};

// Ceiling - EXACT NSPIRE TABLE MAPPING
export const CEILING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Ceiling',
  deficiencies: [
    {
      id: 'ceiling_1',
      name: 'The ceiling component(s) is not functionally adequate.',
      detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under Structural deficiency.',
      criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'CEILING-01'
    },
    {
      id: 'ceiling_2',
      name: 'Ceiling has a hole.',
      detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
      criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'CEILING-02'
    },
    {
      id: 'ceiling_3',
      name: 'The ceiling has an unstable surface (bulging, buckling).',
      detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
      criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category deficiency.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'CEILING-03'
    }
  ]
};

export const KITCHEN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Kitchen',
  deficiencies: [
    // Cabinet and Storage
    {
      id: 'kitchen_1',
      name: 'Cabinet and Storage',
      detail: 'Storage component is damaged, inoperable, or missing.',
      criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-01'
    },
    // Cooking Appliance
    {
      id: 'kitchen_2',
      name: 'Cooking Appliance.',
      detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
      criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-02'
    },
    {
      id: 'kitchen_3',
      name: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
      detail: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
      criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-03'
    },
    {
      id: 'kitchen_4',
      name: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
      detail: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
      criteria: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'KITCHEN-04'
    },
    // Food preparation Area
    {
      id: 'kitchen_5',
      name: 'Food preparation area is damaged or is not functionally adequate.',
      detail: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
      criteria: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-05'
    },
    {
      id: 'kitchen_6',
      name: 'Food preparation area is not present.',
      detail: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
      criteria: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-06'
    },
    // MOLD-LIKE SUBSTANCE
    {
      id: 'kitchen_7',
      name: 'MOLD-LIKE SUBSTANCE',
      detail: 'Peeling Paint-Elevated moisture level.',
      criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-07'
    },
    {
      id: 'kitchen_8',
      name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'KITCHEN-08'
    },
    {
      id: 'kitchen_9',
      name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'KITCHEN-09'
    },
    {
      id: 'kitchen_10',
      name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
      detail: 'Cumulative area of patches is more than 4 square inches and less than one square foot in a room.',
      criteria: 'Cumulative area of patches is more than 4 square inches and less than one square foot in a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-10'
    },
    // Refrigerator
    {
      id: 'kitchen_11',
      name: 'Refrigerator',
      detail: 'Refrigerator component is damaged such that it impacts functionality.',
      criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-11'
    },
    {
      id: 'kitchen_12',
      name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
      detail: 'Refrigerator is inoperable (i.e., overall system is not meeting function or purpose; with or without visible damage) such that it may be unable to safely and adequately store food',
      criteria: 'Refrigerator is inoperable (i.e., overall system is not meeting function or purpose; with or without visible damage) such that it may be unable to safely and adequately store food',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-12'
    },
    // Sink
    {
      id: 'kitchen_13',
      name: 'Sink',
      detail: 'Cannot activate or deactivate hot and cold water.',
      criteria: 'Control knobs do not activate or deactivate hot and cold water.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-13'
    },
    {
      id: 'kitchen_14',
      name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
      detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-14'
    },
    {
      id: 'kitchen_15',
      name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-15'
    },
    {
      id: 'kitchen_16',
      name: 'The sink is not draining, not functioning adequately.',
      detail: 'Water is not draining from the basin of the sink. slow or clogged drain.',
      criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-16'
    },
    {
      id: 'kitchen_17',
      name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
      detail: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
      criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'KITCHEN-17'
    },
    {
      id: 'kitchen_18',
      name: 'Water pressure, direction.',
      detail: 'Water pressure, direction is not adequately functional.',
      criteria: 'Water pressure, direction is not adequately functional.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'KITCHEN-18'
    },
    // Ventilation
    {
      id: 'kitchen_19',
      name: 'Ventilation',
      detail: 'The kitchen does not have ventilation, not present and operable.',
      criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-19'
    },
    {
      id: 'kitchen_20',
      name: 'Exhaust system component is damaged or missing.',
      detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-20'
    },
    {
      id: 'kitchen_21',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust vent inoperable.',
      criteria: 'Exhaust vent inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-21'
    },
    {
      id: 'kitchen_22',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'KITCHEN-22'
    }
  ]
};

export const RESTROOM_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Restroom',
  deficiencies: [
    // Bathtub and Shower
    {
      id: 'rest_1',
      name: 'Bathtub and Shower',
      detail: 'Common area, the bathtub or shower is inoperable or does not drain.',
      criteria: 'Common area bathtub or shower is present, and it is inoperable ( not meeting function or purpose, with or without visible damage), or standing water is present such that water is unable to drain.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'REST-01'
    },
    {
      id: 'rest_2',
      name: 'Common area bathtub or shower hardware and water fixtures.',
      detail: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident\'s ability to maintain personal hygiene.',
      criteria: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident\'s ability to maintain personal hygiene.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'REST-02'
    },
    {
      id: 'rest_3',
      name: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
      detail: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene.',
      criteria: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'REST-03'
    },
    {
      id: 'rest_4',
      name: 'Bathtub or shower cannot be used in private.',
      detail: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-04'
    },
    // Cabinet and Storage
    {
      id: 'rest_5',
      name: 'Cabinet and Storage',
      detail: 'Storage component is damaged, inoperable, or missing.',
      criteria: 'Some of the restroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-05'
    },
    // Grab Bar
    {
      id: 'rest_6',
      name: 'Grab Bar',
      detail: 'Grab bar is not secure.',
      criteria: 'Any movement whatever is detected in the grab bar.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-06'
    },
    // Mold -Like Substance
    {
      id: 'rest_7',
      name: 'Mold -Like Substance',
      detail: 'Peeling paint-elevated moisture level.',
      criteria: 'elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-07'
    },
    {
      id: 'rest_8',
      name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '27.25/n',
      code: 'REST-08'
    },
    {
      id: 'rest_9',
      name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      detail: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
      criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '13.40/n',
      code: 'REST-09'
    },
    {
      id: 'rest_10',
      name: '4" or less Presence of a mold-like substance at a moderate level observed visually.',
      detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-10'
    },
    // Sink
    {
      id: 'rest_11',
      name: 'Sink',
      detail: 'Cannot activate or deactivate hot and cold water.',
      criteria: 'Control knobs do not activate or deactivate hot and cold water.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-11'
    },
    {
      id: 'rest_12',
      name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
      detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-12'
    },
    {
      id: 'rest_13',
      name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-13'
    },
    {
      id: 'rest_14',
      name: 'The sink is not draining, not functioning adequately.',
      detail: 'Water is not draining from the basin of the sink, slow or clogged drain.',
      criteria: 'Water is not draining from the basin of the sink, slow or clogged drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-14'
    },
    {
      id: 'rest_15',
      name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
      detail: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
      criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-15'
    },
    {
      id: 'rest_16',
      name: 'Water is directed outside of the basin.',
      detail: 'When in use, water is directed outside of the basin.',
      criteria: 'When in use, water is directed outside of the basin.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'REST-16'
    },
    // Toilet
    {
      id: 'rest_17',
      name: 'Toilet',
      detail: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
      criteria: 'A toilet is deficient if it\'s damaged or inoperable, as long as another operational toilet exists elsewhere in the building.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-17'
    },
    {
      id: 'rest_18',
      name: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
      detail: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
      criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-18'
    },
    {
      id: 'rest_19',
      name: 'Only 1 toilet was installed, and it is damaged or inoperable.',
      detail: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
      criteria: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-19'
    },
    {
      id: 'rest_20',
      name: 'Only 1 toilet was installed, and it is missing.',
      detail: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-20'
    },
    {
      id: 'rest_21',
      name: 'Toilet can not be used in private.',
      detail: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      criteria: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-21'
    },
    {
      id: 'rest_22',
      name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
      detail: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
      criteria: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-22'
    },
    {
      id: 'rest_23',
      name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
      detail: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
      criteria: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-23'
    },
    {
      id: 'rest_24',
      name: 'Toilet is not secured at the base.',
      detail: 'Toilet is not secured at the base.',
      criteria: 'Toilet is not secured at the base.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-24'
    },
    // Ventilation
    {
      id: 'rest_25',
      name: 'Ventilation',
      detail: 'The restroom does not have ventilation, not present and operable.',
      criteria: 'Effecting the restroom.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-25'
    },
    {
      id: 'rest_26',
      name: 'The exhaust system component is missing or damaged, affecting the function adequately.',
      detail: 'Exhaust system component is damaged or missing (i.e., visibly defective; impacts functionality).',
      criteria: 'Exhaust system component is damaged or missing (i.e., visibly defective; impacts functionality).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-26'
    },
    {
      id: 'rest_27',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust fan, inoperable.',
      criteria: 'Exhaust fan, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-27'
    },
    {
      id: 'rest_28',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'REST-28'
    }
  ]
};

export const VENTILATION_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Ventilation',
  deficiencies: [
    {
      id: 'vent_1',
      name: 'Ventilation (with or without a fan)',
      detail: 'It is not functioning adequately.',
      criteria: 'Effecting the room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'VENT-01'
    },
    {
      id: 'vent_2',
      name: 'Exhaust system component is damaged or missing.',
      detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'VENT-02'
    },
    {
      id: 'vent_3',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust fan, inoperable.',
      criteria: 'Exhaust fan, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'VENT-03'
    },
    {
      id: 'vent_4',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.0/n',
      code: 'VENT-04'
    }
  ]
};

export const CABINET_STORAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Cabinet and Storage (Pantry, Laundry)',
  deficiencies: [
    {
      id: 'cab_1',
      name: 'Pantry, Food storage space is not present',
      detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
      criteria: 'Stowed items, including food, sanitation, and household supplies.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.20/n',
      code: 'CAB-01'
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
  
  // ==========================================
  // OUTSIDE INSPECTIONS - Use new Outside mapping with exact Excel data
  // ==========================================
  if (isOutside) {
    // Try to get from the new Outside mapping first
    const outsideResult = getOutsideDeficienciesByCategory(cleanedName);
    if (outsideResult) {
      return outsideResult;
    }
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
  if (normalizedName.includes('trash chute') || normalizedName.includes('trash') || normalizedName.includes('chute')) {
    return TRASH_CHUTE_DEFICIENCIES;
  }
  if (normalizedName.includes('bathroom') || normalizedName.includes('bathtub') || normalizedName.includes('shower') || normalizedName.includes('restroom')) {
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
export const getDeficienciesForSubcategory = (subcategoryName: string): ItemDeficiencies => {
  const normalizedName = subcategoryName.toLowerCase();
  
  // Door subcategories
  if (normalizedName.includes('door - general standard') || normalizedName === 'door - general standard') {
    return DOOR_GENERAL_STANDARD_OUTSIDE;
  }
  if (normalizedName === 'garage door' || normalizedName.includes('garage door')) {
    return GARAGE_DOOR_OUTSIDE;
  }
  
  // Drain subcategories
  if (normalizedName === 'drain') {
    return DRAIN_DRAIN_DEFICIENCIES;
  }
  if (normalizedName === 'site drainage' || normalizedName.includes('site drainage')) {
    return SITE_DRAINAGE_DEFICIENCIES;
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
    return ELECTRICAL_SERVICE_PANEL_OUTSIDE;
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
  
  return {
    itemName: subcategoryName,
    deficiencies: []
  };
};
