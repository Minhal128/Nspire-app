// Comprehensive NSPIRE Deficiency Mapping for All 26 Categories - OUTSIDE

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
      points: '2.40/n',
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
      points: '30/n',
      code: 'CHIM-01'
    },
    {
      id: 'chim_2',
      name: 'Chimney exhibits signs of structural failure.',
      detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
      criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
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
      points: '5.5/n',
      code: 'DRYER-01'
    },
    {
      id: 'dryer_2',
      name: 'Exterior dryer vent cover, cap, or a component thereof is missing.',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-02'
    },
    {
      id: 'dryer_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '5.5/n',
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
      points: '5.5/n',
      code: 'GARAGE-OUT-01'
    },
    {
      id: 'garage_out_2',
      name: 'Garage door has a hole.',
      detail: 'Hole is present in the garage door.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '5.5/n',
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
      points: '14.8/n',
      code: 'SITE-DRAIN-01'
    },
    {
      id: 'site_drain_2',
      name: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      detail: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SITE-DRAIN-02'
    },
    {
      id: 'site_drain_3',
      name: 'Water runoff is unable to flow through the site drainage system.',
      detail: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
      code: 'ELEC-COS-01'
    },
    {
      id: 'elec_cos_2',
      name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
      detail: 'AFCI test or reset button is inoperable.',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
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
      points: '24.80/n',
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
      points: '30/n',
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
      points: '30/n',
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
      points: '14.8/n',
      code: 'FIRE-EXT-01'
    },
    {
      id: 'fire_ext_2',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-EXT-02'
    },
    {
      id: 'fire_ext_3',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
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
      points: '30/n',
      code: 'SPRINK-01'
    },
    {
      id: 'sprink_2',
      name: 'Sprinkler head assembly has evidence of corrosion.',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SPRINK-02'
    },
    {
      id: 'sprink_3',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SPRINK-03'
    },
    {
      id: 'sprink_4',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
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
      points: '14.8/n',
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
      points: '2.40/n',
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
      points: '30/n',
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
      points: '30/n',
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
      points: '5.5/n',
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
      points: '5.5/n',
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
      points: '5.5/n',
      code: 'PARK-LOT-01'
    },
    {
      id: 'park_lot_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
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
      points: '14.8/n',
      code: 'PRIV-ROAD-01'
    },
    {
      id: 'priv_road_2',
      name: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      detail: 'The driveway is not functionally adequate.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
      code: 'GUARD-01'
    },
    {
      id: 'guard_2',
      name: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '14.8/n',
      code: 'HAND-01'
    },
    {
      id: 'hand_2',
      name: 'Handrail is not functionally adequate.',
      detail: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HAND-02'
    },
    {
      id: 'hand_3',
      name: 'Handrail is not installed where required.',
      detail: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAND-03'
    },
    {
      id: 'hand_4',
      name: 'Handrail is not secured.',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '14.8/n',
      code: 'RET-WALL-01'
    },
    {
      id: 'ret_wall_2',
      name: 'Retaining wall is partially or completely collapsed.',
      detail: 'The retaining wall is (sloped) partially or completely collapsed.',
      criteria: 'The retaining wall is (sloped) partially or completely collapsed.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '14.8/n',
      code: 'WALL-EXT-01'
    },
    {
      id: 'wall_ext_2',
      name: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      detail: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WALL-EXT-02'
    },
    {
      id: 'wall_ext_3',
      name: 'Exterior wall has peeling paint of 10 square feet or more',
      detail: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
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
      points: '5.5/n',
      code: 'DOOR-ENTRY-01'
    },
    {
      id: 'door_entry_2',
      name: 'Self-closing mechanism is damaged, inoperable or damaged.',
      detail: 'The self-closing mechanism is damaged, does not pull the door closed and engage the latch, or is missing.',
      criteria: 'Self-closing mechanism failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-02'
    },
    {
      id: 'door_entry_3',
      name: 'Entry door surface is delaminated or separated.',
      detail: 'There is delamination or separation of the door surface 2 inches wide or greater.',
      criteria: 'Delamination or separation that affects the integrity of the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-03'
    },
    {
      id: 'door_entry_4',
      name: 'Entry door will not close.',
      detail: 'Entry door does not close (i.e., door seats in frame).',
      criteria: 'Entry door will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-04'
    },
    {
      id: 'door_entry_5',
      name: 'Entry door will not open.',
      detail: 'Entry door does not open.',
      criteria: 'Entry door does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-ENTRY-05'
    },
    {
      id: 'door_entry_6',
      name: 'Hole, split, or crack that penetrates completely through the entry door.',
      detail: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
      criteria: 'Penetrates through the door or door sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
      code: 'DOOR-FIRE-01'
    },
    {
      id: 'door_fire_2',
      name: 'Fire-labeled door assembly has a hole of any size.',
      detail: 'Hole of any size OR damaged such that its integrity may be compromised.',
      criteria: 'Integrity compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-02'
    },
    {
      id: 'door_fire_3',
      name: 'Fire - labeled door cannot be secured.',
      detail: 'Fire-labeled door that serves as an entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Cannot be secured.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-03'
    },
    {
      id: 'door_fire_4',
      name: 'Fire - labeled door does not close and latch.',
      detail: 'Fire - labeled door does not close and latch OR self-closing hardware is damaged or missing.',
      criteria: 'Door does not self-close and latch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-04'
    },
    {
      id: 'door_fire_5',
      name: 'Fire-labeled door does not open.',
      detail: 'Fire-labeled door does not open, which may limit access between spaces.',
      criteria: 'Does not open.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-FIRE-05'
    },
    {
      id: 'door_fire_6',
      name: 'Fire-labeled door is missing.',
      detail: 'Evidence of prior installation, but now not present or is incomplete.',
      criteria: 'Door missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-06'
    },
    {
      id: 'door_fire_7',
      name: 'Fire - labeled door seal or gasket is damaged.',
      detail: 'Seal or gasket is damaged (impacts functionality) or missing.',
      criteria: 'Seal/gasket failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '5.5/n',
      code: 'DOOR-GEN-01'
    },
    {
      id: 'door_gen_2',
      name: 'A passage door (utility, storage, closet, laundry) does not open.',
      detail: 'A passage door does not open such that it may limit access when needed.',
      criteria: 'Does not open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-GEN-02'
    },
    {
      id: 'door_gen_3',
      name: 'A passage door (non-access) has a damaged component.',
      detail: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      criteria: 'Component damaged/missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
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
      points: '5.5/n',
      code: 'GARAGE-01'
    },
    {
      id: 'garage_2',
      name: 'The garage door has a hole (broken panel or window).',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Hole penetrating to interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
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
      points: '30/n',
      code: 'ELEC-01'
    },
    {
      id: 'elec_2',
      name: 'Electrical - AFCI',
      detail: 'The AFCI outlet or AFCI breaker does not reset.',
      criteria: 'AFCI outlet or AFCI breaker test or reset button is inoperable (if damaged, considered exposed conductor).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-02'
    },
    {
      id: 'elec_3',
      name: 'Electrical - Accessibility',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'Cannot be reached and opened without moving obstructions, dismantling, or destructive measures.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-03'
    },
    {
      id: 'elec_4',
      name: 'Electrical - Water Source Proximity',
      detail: 'Unprotected outlet is present within six feet of a water source.',
      criteria: 'Outlet not GFCI protected within six feet of a water source (sink, bathtub, shower, toilet).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-04'
    },
    {
      id: 'elec_5',
      name: 'Electrical - GFCI',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      criteria: 'Test or reset button is inoperable (system not meeting function).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-05'
    },
    {
      id: 'elec_6',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      criteria: 'Fuse or breaker is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEC-06'
    },
    {
      id: 'elec_7',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'Fuse or breaker is visibly defective/damaged; may not interrupt circuit.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '5.5/n',
      code: 'ESP-01'
    },
    {
      id: 'esp_2',
      name: 'The overcurrent protection device is contaminated.',
      detail: 'The overcurrent protection device (fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
      criteria: 'Contamination present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ESP-02'
    },
    {
      id: 'esp_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device is damaged such that it may not interrupt the circuit.',
      criteria: 'Visibly defective; impacts functionality.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '5.5/n',
      code: 'FENCE-01'
    },
    {
      id: 'fence_2',
      name: 'Fence demonstrates signs of collapse.',
      detail: 'Fence shows visible signs of structural failure.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FENCE-02'
    },
    {
      id: 'fence_3',
      name: 'The gate does not open, close, catch, or lock.',
      detail: 'Gate mechanical failure.',
      criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '30/n',
      code: 'FIRE-01'
    },
    {
      id: 'fire_2',
      name: 'Fire Escape',
      detail: 'Fire escape component is damaged, or missing.',
      criteria: 'Stair, ladder, platform, guardrail, or handrail is visibly damaged or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-02'
    },
    {
      id: 'fire_3',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing.',
      criteria: 'Visibly damaged or missing (includes cases where prior installation is evident).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-03'
    },
    {
      id: 'fire_4',
      name: 'Fire Extinguisher Pressure',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-04'
    },
    {
      id: 'fire_5',
      name: 'Fire Extinguisher Tag',
      detail: 'The fire extinguisher tag is missing, illegible, or expired.',
      criteria: 'Service tag > 1 year OR Tag missing/illegible OR Disposable unit > 12 years old.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-05'
    },
    {
      id: 'fire_6',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Improperly stored near ignition sources, thermal appliances, or improperly stored chemicals.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-06'
    },
    {
      id: 'fire_7',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-07'
    },
    {
      id: 'fire_8',
      name: 'Sprinkler Assembly Corrosion',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Sprinkler head assembly has evidence of corrosion.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-08'
    },
    {
      id: 'fire_9',
      name: 'Sprinkler Assembly Debris',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or glass bulb.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-09'
    },
    {
      id: 'fire_10',
      name: 'Sprinkler Assembly Obstruction',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
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
      points: '14.8/n',
      code: 'FOUND-01'
    },
    {
      id: 'found_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-02'
    },
    {
      id: 'found_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.',
      criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOUND-03'
    },
    {
      id: 'found_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
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
      points: '14.8/n',
      code: 'HAZ-01'
    },
    {
      id: 'hazard_2',
      name: 'Litter',
      detail: 'Litter is accumulated in an undesignated area.',
      criteria: '10 or more small items or any large discarded items in a 10x10 ft area.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'HAZ-02'
    },
    {
      id: 'hazard_3',
      name: 'Sharp edges',
      detail: 'A sharp edge that can result in a cut or puncture hazard is present.',
      criteria: 'Hazard likely to require emergency care (e.g., stitches).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZ-03'
    },
    {
      id: 'hazard_4',
      name: 'Trip hazard',
      detail: 'Trip hazard on walking surface.',
      criteria: 'Abrupt change in elevation of 3/4 inch or more, or horizontal gap of 2 inches or more.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '30/n',
      code: 'HVAC-OUT-01'
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
      code: 'HVAC-01'
    },
    {
      id: 'hvac_2',
      name: 'Combustion chamber cover or gas shutoff valve missing.',
      detail: 'Missing (evidence of prior installation) from combustion-fueled heating appliance.',
      criteria: 'Previously installed and now not present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-02'
    },
    {
      id: 'hvac_3',
      name: 'Fuel-burning exhaust vent misaligned/blocked/damaged/missing.',
      detail: 'Exhaust vent improperly connected, damaged, or missing.',
      criteria: 'Metal tape is not a substitute for improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-03'
    },
    {
      id: 'hvac_4',
      name: 'Heating system or device safety shield is damaged or missing.',
      detail: 'Safety shield is damaged or missing (evidence of prior installation).',
      criteria: 'Safety shield was previously installed and is now not present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-04'
    },
    {
      id: 'hvac_5',
      name: 'Heating source damaged/inoperable/missing (Apr 1 - Sep 30).',
      detail: 'Permanently installed heating source damaged, inoperable, missing, or not installed.',
      criteria: 'Outside temp below 68 F and heating source issue.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-05'
    },
    {
      id: 'hvac_6',
      name: 'Heating source not working (Oct 1 - Mar 31).',
      detail: 'Permanently installed heating source not working OR working but interior temp < 64 F.',
      criteria: 'Source not working to create heat.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-06'
    },
    {
      id: 'hvac_7',
      name: 'Unvented space heater is present.',
      detail: 'Unvented space heater that burns gas, oil, or kerosene is present.',
      criteria: 'Includes common areas.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-07'
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
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-GAS-01'
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
      code: 'LEAK-SEW-01'
    },
    {
      id: 'leak_sew_2',
      name: 'Cap to the cleanout or pump cover is detached or missing.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-02'
    },
    {
      id: 'leak_sew_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-03'
    },
    {
      id: 'leak_sew_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LEAK-SEW-04'
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
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-01'
    },
    {
      id: 'leak_water_2',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-02'
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
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-01'
    },
    {
      id: 'light_2',
      name: 'Interior lighting inoperable.',
      detail: 'A permanently installed light fixture is inoperable.',
      criteria: 'Not meeting function.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-02'
    },
    {
      id: 'light_3',
      name: 'Interior lighting not secure.',
      detail: 'A permanently installed light fixture is not secure.',
      criteria: 'Attachment not stable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-03'
    },
    {
      id: 'light_4',
      name: 'Interior lighting missing (Kitchen/Restroom).',
      detail: 'At least one permanently installed light fixture is not present in kitchen or restroom.',
      criteria: 'Missing or not functioning.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '5.5/n',
      code: 'PARK-01'
    },
    {
      id: 'park_2',
      name: 'Parking lot has ponding.',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'Significant ponding making area unusable.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'PARK-02'
    },
    {
      id: 'park_3',
      name: 'Private Roads and Driveways',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      criteria: 'Blocked access (not including temporary obstruction).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'PARK-03'
    },
    {
      id: 'park_4',
      name: 'Private Roads Potholes',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PARK-04'
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
      points: '5.5/n',
      code: 'PAINT-01'
    },
    {
      id: 'paint_2',
      name: 'More than 2 SF - Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
      criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'PAINT-02'
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
      repairBy: '24Hrs',
      points: '30/n',
      code: 'RAIL-01'
    },
    {
      id: 'rail_2',
      name: 'Guardrail Damaged',
      detail: 'Guardrail component is missing or damaged.',
      criteria: 'Missing critical components, visibly damaged, under 30 inches, or not securely attached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RAIL-02'
    },
    {
      id: 'rail_3',
      name: 'Handrail Missing',
      detail: 'Handrail is missing (evidence of prior installation).',
      criteria: 'Handrail is missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RAIL-03'
    },
    {
      id: 'rail_4',
      name: 'Handrail Not Functionally Adequate',
      detail: 'Handrail cannot reasonably be grasped, is not continuous, or is not between 28-42 inches high.',
      criteria: 'Handrail is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RAIL-04'
    },
    {
      id: 'rail_5',
      name: 'Handrail Not Installed Where Required',
      detail: '4 or more stair risers are present OR ramp has rise >6 inches/projection >72 inches.',
      criteria: 'Handrail not installed where required.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RAIL-05'
    },
    {
      id: 'rail_6',
      name: 'Handrail Not Secured',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'Handrail is not secured.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
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
      points: '5.5/n',
      code: 'ROOF-01'
    },
    {
      id: 'roof_2',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-02'
    },
    {
      id: 'roof_3',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-03'
    },
    {
      id: 'roof_4',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-04'
    },
    {
      id: 'roof_5',
      name: 'Substrate is exposed.',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Visually observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
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
      points: '5.5/n',
      code: 'SIDE-01'
    },
    {
      id: 'side_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SIDE-02'
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
      points: '5.5/n',
      code: 'STAIR-01'
    },
    {
      id: 'stair_2',
      name: 'Stringer damaged.',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiency is observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STAIR-02'
    },
    {
      id: 'stair_3',
      name: 'Tread is missing or damaged.',
      detail: 'Tread on a set of stairs is missing Or tread on a set of stairs is loose or unlevel. Or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
      criteria: 'Accessory treads are present and verified to be functional.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STAIR-03'
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
      repairBy: '24Hrs',
      points: '30/n',
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
      points: '14.8/n',
      code: 'RET-01'
    },
    {
      id: 'ret_2',
      name: 'Retaining wall collapsed.',
      detail: 'The retaining wall is partially or completely collapsed.',
      criteria: 'The retaining wall is partially or completely collapsed.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'RET-02'
    },
    {
      id: 'ret_3',
      name: 'Exterior wall not functionally adequate.',
      detail: 'Impacts integrity of wall assembly or building envelope.',
      criteria: 'Does not allow exterior wall to separate the accommodation inside from outside.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RET-03'
    },
    {
      id: 'ret_4',
      name: 'Exterior wall covering missing.',
      detail: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      criteria: 'Cumulatively 1 sq ft or more missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RET-04'
    },
    {
      id: 'ret_5',
      name: 'Exterior wall peeling paint.',
      detail: 'Exterior wall has peeling paint of 10 square feet or more.',
      criteria: 'Cumulatively 10 sq ft or more peeling paint (built after 1978).',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'RET-05'
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
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-01'
    },
    {
      id: 'wh_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
      criteria: 'Unable to shut off gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-02'
    },
    {
      id: 'wh_3',
      name: 'TPRV has an active leak. Or TPRV is obstructed such that the TPRV is unable to be fully actuated. OR Relief valve discharge piping is damaged d (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      detail: 'TPRV is obstructed such that the TPRV is unable to be fully actuated. OR, relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), is capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-03'
    },
    {
      id: 'wh_4',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WH-04'
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
      code: 'GEN-01'
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
      code: 'CFA-01'
    },
    {
      id: 'cfa_2',
      name: 'System blocked or pull cord too high',
      detail: 'System blocked OR pull cord end is higher than 6 inches off the floor.',
      criteria: 'Pull cord positioned more than 6 inches above floor.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CFA-02'
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
      code: 'CO-01'
    },
    {
      id: 'co_2',
      name: 'Alarm missing or improperly installed',
      detail: 'Fuel-burning appliance present and CO alarm missing.',
      criteria: 'Sleeping area within one story of attached garage without ventilation.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CO-02'
    },
    {
      id: 'co_3',
      name: 'Alarm obstructed',
      detail: 'Alarm is obstructed.',
      criteria: 'Covered by foreign objects such as plastic, tape, paint, or stickers.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CO-03'
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
      code: 'CHIM-IN-01'
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
      code: 'DRYER-IN-01'
    },
    {
      id: 'dryer_in_2',
      name: 'Restricted airflow',
      detail: 'Ventilation system blocked or damaged.',
      criteria: 'Airflow restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-02'
    },
    {
      id: 'dryer_in_3',
      name: 'Transition duct detached or missing',
      detail: 'Evidence of prior installation but now missing.',
      criteria: 'Duct not securely attached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-03'
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
      code: 'DOOR-IN-01'
    },
    {
      id: 'door_in_2',
      name: 'Entry door damaged or missing',
      detail: 'Door cannot provide privacy or protection.',
      criteria: 'Hole or crack ≥ 1/4 inch or missing glass.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-IN-02'
    },
    {
      id: 'door_in_3',
      name: 'Fire-labeled door defective',
      detail: 'Door cannot self-close or latch.',
      criteria: 'Fire integrity compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-IN-03'
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
      code: 'DRAIN-IN-01'
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
      code: 'EGRESS-IN-01'
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
      code: 'ELEC-IN-01'
    },
    {
      id: 'elec_in_2',
      name: 'Outlet not energized',
      detail: 'Accessible outlet does not provide power.',
      criteria: 'Testing indicates outlet is dead.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-IN-02'
    },
    {
      id: 'elec_in_3',
      name: 'Outlet or switch damaged',
      detail: 'Visible damage affecting functionality.',
      criteria: 'Cannot safely carry electrical current.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEC-IN-03'
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
      code: 'ELEV-01'
    },
    {
      id: 'elev_2',
      name: 'Door does not open or close',
      detail: 'Door fails to operate fully.',
      criteria: 'Elevator not in working condition.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEV-02'
    },
    {
      id: 'elev_3',
      name: 'Elevator inoperable',
      detail: 'System not meeting functional purpose.',
      criteria: 'Overall system failure.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEV-03'
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
      code: 'FIRE-IN-01'
    },
    {
      id: 'fire_in_2',
      name: 'Fire extinguisher missing or damaged',
      detail: 'Evidence of prior installation but missing.',
      criteria: 'Not available for use.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-IN-02'
    },
    {
      id: 'fire_in_3',
      name: 'Smoke alarm inoperable',
      detail: 'Does not emit alarm when tested.',
      criteria: 'Fails required alarm function.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-IN-03'
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
      code: 'FLOOR-01'
    },
    {
      id: 'floor_2',
      name: 'Floor substrate exposed',
      detail: '10% or more substrate exposed.',
      criteria: 'Repair required.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FLOOR-02'
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
      code: 'FOUND-IN-01'
    },
    {
      id: 'found_in_2',
      name: 'Water infiltration',
      detail: 'Evidence of water intrusion.',
      criteria: 'Dampness, stains, mineral deposits.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOUND-IN-02'
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
      code: 'GRAB-01'
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
      code: 'HAZ-IN-01'
    },
    {
      id: 'haz_in_2',
      name: 'Trip hazard',
      detail: 'Abrupt elevation change.',
      criteria: 'Vertical ≥ 3/4 inch or horizontal ≥ 2 inches.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZ-IN-02'
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
      code: 'BATH-01'
    },
    {
      id: 'bath_2',
      name: 'Bathtub or shower component is damaged, inoperable, or missing',
      detail: 'Component is inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts.',
      criteria: 'Component is damaged, inoperable or missing.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'BATH-02'
    },
    {
      id: 'bath_3',
      name: 'Only one bathtub or shower is present, and it is inoperable',
      detail: 'Only one bathtub or shower is present within the unit and it is inoperable.',
      criteria: 'Only one bathtub or shower is present, and it is inoperable.',
      severity: 'Severe',
      repairBy: '24Hrs',
      points: '14.8/n',
      code: 'BATH-03'
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
      code: 'TOILET-01'
    },
    {
      id: 'toilet_2',
      name: 'Only one toilet was installed, and it is damaged or inoperable',
      detail: 'Only one toilet is present, and it is either damaged or inoperable.',
      criteria: 'Only one toilet was installed, and it is damaged or inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'TOILET-02'
    },
    {
      id: 'toilet_3',
      name: 'Only one toilet was installed, and it is missing',
      detail: 'Only one toilet was installed, and it is now missing.',
      criteria: 'Only one toilet was installed, and it is missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'TOILET-03'
    },
    {
      id: 'toilet_4',
      name: 'Toilet is not secured at the base',
      detail: 'Toilet is not secured at the base.',
      criteria: 'Toilet is not secured at the base.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-04'
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
      code: 'SINK-01'
    },
    {
      id: 'sink_2',
      name: 'Sink component is damaged or missing, and sink is not functionally adequate',
      detail: 'Sink component is missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-02'
    },
    {
      id: 'sink_3',
      name: 'Sink is not draining',
      detail: 'Water is not draining from the basin of the sink.',
      criteria: 'Sink is not draining.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-03'
    },
    {
      id: 'sink_4',
      name: 'Water is directed outside of the basin',
      detail: 'Confirm that water is directed into the basin and not outside when in use.',
      criteria: 'Water is directed outside of the basin.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-04'
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
      code: 'MOLD-01'
    },
    {
      id: 'mold_2',
      name: 'Mold (> 9 SF).',
      detail: 'Presence of mold-like substance at extremely high levels.',
      criteria: 'Cumulative area > 9 sq ft.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'MOLD-02'
    },
    {
      id: 'mold_3',
      name: 'Mold (1-9 SF).',
      detail: 'Presence of mold-like substance at high levels.',
      criteria: 'Cumulative area 1 - 9 sq ft.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-03'
    },
    {
      id: 'mold_4',
      name: 'Mold (Moderate).',
      detail: 'Presence of mold-like substance at moderate level.',
      criteria: 'Cumulative area 4 sq in - 1 sq ft.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-04'
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
      code: 'WINDOW-01'
    },
    {
      id: 'window_2',
      name: 'Window is broken or missing',
      detail: 'Window glass is broken, cracked, or missing entirely.',
      criteria: 'Window is broken or missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'WINDOW-02'
    },
    {
      id: 'window_3',
      name: 'Window will not open or close properly',
      detail: 'Window cannot be opened or closed as designed.',
      criteria: 'Window will not open or close properly.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'WINDOW-03'
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
      code: 'FLOOR-01'
    },
    {
      id: 'floor_2',
      name: 'Floor is not level or has significant damage',
      detail: 'Floor has significant sagging, buckling, or structural damage.',
      criteria: 'Floor is not level or has significant damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FLOOR-02'
    },
    {
      id: 'floor_3',
      name: 'Trip hazard present',
      detail: 'Floor has raised edges, holes, or uneven surfaces creating trip hazard.',
      criteria: 'Trip hazard present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FLOOR-03'
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
      code: 'WALL-01'
    },
    {
      id: 'wall_2',
      name: 'Wall has significant structural damage',
      detail: 'Wall shows signs of structural failure or major deterioration.',
      criteria: 'Wall has significant structural damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'WALL-02'
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
      code: 'CEILING-01'
    },
    {
      id: 'ceiling_2',
      name: 'Ceiling is sagging or has structural damage',
      detail: 'Ceiling shows signs of sagging, buckling, or structural failure.',
      criteria: 'Ceiling is sagging or has structural damage.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CEILING-02'
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
      code: 'KITCHEN-01'
    },
    {
      id: 'kitchen_2',
      name: 'Cooking Appliance - Burner.',
      detail: 'A burner does not produce heat, but at least one other burner is present and works.',
      criteria: 'Partial burner failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-02'
    },
    {
      id: 'kitchen_3',
      name: 'Cooking Appliance - Unsafe.',
      detail: 'Component (including seal) damaged or missing, making device unsafe.',
      criteria: 'Device unsafe for use.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'KITCHEN-03'
    },
    {
      id: 'kitchen_4',
      name: 'Cooking Appliance - No Heat.',
      detail: 'No burner produces heat OR oven does not produce heat.',
      criteria: 'Total failure to produce heat.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-04'
    },
    {
      id: 'kitchen_5',
      name: 'Food preparation area damaged/inadequate.',
      detail: '10% or more of surface is exposed substrate or space does not support food prep.',
      criteria: 'Damaged or inadequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-05'
    },
    {
      id: 'kitchen_6',
      name: 'Food preparation area is not present.',
      detail: 'Countertop is missing (evidence of prior installation).',
      criteria: 'Countertop missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-06'
    },
    {
      id: 'kitchen_7',
      name: 'MOLD-LIKE SUBSTANCE (Peeling Paint).',
      detail: 'Elevated moisture level (peeling paint, warped/stained wall/ceiling).',
      criteria: 'Evidence of moisture.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-07'
    },
    {
      id: 'kitchen_8',
      name: 'MOLD-LIKE SUBSTANCE (> 9 SF).',
      detail: 'Presence of mold-like substance at extremely high levels.',
      criteria: 'Cumulative area > 9 sq ft.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'KITCHEN-08'
    },
    {
      id: 'kitchen_9',
      name: 'MOLD-LIKE SUBSTANCE (1-9 SF).',
      detail: 'Presence of mold-like substance at high levels.',
      criteria: 'Cumulative area 1 - 9 sq ft.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-09'
    },
    {
      id: 'kitchen_10',
      name: 'MOLD-LIKE SUBSTANCE (Moderate).',
      detail: 'Presence of mold-like substance at moderate level.',
      criteria: 'Cumulative area 4 sq in - 1 sq ft.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-10'
    },
    {
      id: 'kitchen_11',
      name: 'Refrigerator component damaged.',
      detail: 'Refrigerator component is damaged (visibly defective) such that it impacts functionality.',
      criteria: 'Impacts functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-11'
    },
    {
      id: 'kitchen_12',
      name: 'Refrigerator inoperable.',
      detail: 'Refrigerator is inoperable such that it may be unable to safely store food.',
      criteria: 'System not meeting function.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-12'
    },
    {
      id: 'kitchen_13',
      name: 'Sink - Faucet Control.',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: 'Cannot activate/deactivate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-13'
    },
    {
      id: 'kitchen_14',
      name: 'Sink - Component damaged (Not Adequate).',
      detail: 'Sink component is missing or damaged, and sink is not functionally adequate.',
      criteria: 'Not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-14'
    },
    {
      id: 'kitchen_15',
      name: 'Sink - Improper Installation.',
      detail: 'Sink improperly installed, pulling away from wall, leaning, gaps.',
      criteria: 'Separation at seams.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-15'
    },
    {
      id: 'kitchen_16',
      name: 'Sink - Drainage.',
      detail: 'The sink is not draining, not functioning adequately.',
      criteria: 'Water not draining; slow or clogged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-16'
    },
    {
      id: 'kitchen_17',
      name: 'Sink - Component damaged (Adequate).',
      detail: 'Sink component damaged/missing but sink IS functionally adequate.',
      criteria: 'Functionally adequate despite damage.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'KITCHEN-17'
    },
    {
      id: 'kitchen_18',
      name: 'Sink - Water pressure/direction.',
      detail: 'Water pressure, direction is not adequately functional.',
      criteria: 'Functional issue.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'KITCHEN-18'
    },
    {
      id: 'kitchen_19',
      name: 'Ventilation missing.',
      detail: 'The kitchen does not have ventilation (exhaust fan/window) present and operable.',
      criteria: 'Not present and operable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-19'
    },
    {
      id: 'kitchen_20',
      name: 'Exhaust system component damaged/missing.',
      detail: 'Exhaust system component damaged or missing.',
      criteria: 'Visibly defective or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-20'
    },
    {
      id: 'kitchen_21',
      name: 'Exhaust system control failure.',
      detail: 'Exhaust system does not respond to the control switch.',
      criteria: 'Inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-21'
    },
    {
      id: 'kitchen_22',
      name: 'Exhaust system restricted airflow.',
      detail: 'Exhaust system has restricted air flow.',
      criteria: 'Blocked.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-22'
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
      code: 'REST-01'
    },
    {
      id: 'rest_2',
      name: 'Restroom component is damaged or missing',
      detail: 'Restroom component is damaged, deteriorated, or missing.',
      criteria: 'Restroom component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'REST-02'
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
      code: 'VENT-01'
    },
    {
      id: 'vent_2',
      name: 'Ventilation component is damaged or missing',
      detail: 'Ventilation component is damaged, deteriorated, or missing.',
      criteria: 'Ventilation component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-02'
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
