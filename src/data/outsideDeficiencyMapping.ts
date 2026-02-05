// OUTSIDE NSPIRE Deficiency Mapping - EXACT EXCEL TABLE DATA
// This file contains all 26 Outside inspection categories with exact wording

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

// ==========================================
// OUTSIDE CATEGORIES - EXACT NSPIRE TABLE MAPPING
// ==========================================

// 1. Address and Signage
export const ADDRESS_SIGNAGE_OUTSIDE: ItemDeficiencies = {
  itemName: 'Address and Signage',
  deficiencies: [
    {
      id: 'addr_out_1',
      name: 'Address or building identification codes are broken, illegible, or not visible.',
      detail: 'Damaged or vandalized or deteriorated, NOT readable from a reasonable distance.',
      criteria: 'For example, 20 feet distance.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ADDR-OUT-01'
    }
  ]
};

// 2. Chimney
export const CHIMNEY_OUTSIDE: ItemDeficiencies = {
  itemName: 'Chimney',
  deficiencies: [
    {
      id: 'chim_out_1',
      name: 'A vertical or near vertical passageway connected to a fireplace or wood-burning appliance.',
      detail: 'A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete (i.e., evidence of a previously installed component that is now not present) such that it may not safely contain fire and convey smoke and combustion gases to the exterior. OR A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior',
      criteria: 'A visually accessible, observed chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '49.60/n',
      code: 'CHIM-OUT-01'
    },
    {
      id: 'chim_out_2',
      name: 'Chimney exhibits signs of structural failure.',
      detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
      criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '49.60/n',
      code: 'CHIM-OUT-02'
    }
  ]
};

// 3. Clothes Dryer Exhaust Ventilation
export const DRYER_VENT_OUTSIDE: ItemDeficiencies = {
  itemName: 'Clothes Dryer Exhaust Ventilation',
  deficiencies: [
    {
      id: 'dryer_out_1',
      name: 'Electrical dryer exhaust has restricted airflow.',
      detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '49.60/n',
      code: 'DRYER-OUT-01'
    },
    {
      id: 'dryer_out_2',
      name: 'Exterior dryer vent cover, cap, or a component therof is missing.',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'DRYER-OUT-02'
    },
    {
      id: 'dryer_out_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '49.60/n',
      code: 'DRYER-OUT-03'
    }
  ]
};

// 4. Door
export const DOOR_OUTSIDE: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    // Door - General Standard
    {
      id: 'door_out_1',
      name: 'Door - General Standard',
      detail: 'An exterior door component is damaged, inoperable, or missing.',
      criteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-OUT-01'
    },
    // Garage Door
    {
      id: 'door_out_2',
      name: 'Garage Door',
      detail: 'Garage door does not open, close, or remains closed.',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-OUT-02'
    },
    {
      id: 'door_out_3',
      name: 'Garage door has a hole.',
      detail: 'Garage door has a hole.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DOOR-OUT-03'
    }
  ]
};

// 5. Drain
export const DRAIN_OUTSIDE: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: [
    // Drain
    {
      id: 'drain_out_1',
      name: 'Drain',
      detail: 'Drain is fully clogged.',
      criteria: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRAIN-OUT-01'
    },
    // Site Drainage
    {
      id: 'drain_out_2',
      name: 'Site Drainage',
      detail: 'Erosion is present.',
      criteria: 'exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRAIN-OUT-02'
    },
    {
      id: 'drain_out_3',
      name: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      detail: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'DRAIN-OUT-03'
    },
    {
      id: 'drain_out_4',
      name: 'Water runoff is unable to flow through the site drainage system.',
      detail: 'Water runoff is unable to flow through the site drainage system.',
      criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'DRAIN-OUT-04'
    }
  ]
};

// 6. Egress
export const EGRESS_OUTSIDE: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_out_1',
      name: 'Obstructed means of egress.',
      detail: 'The exit access or exit is obstructed.',
      criteria: '1. Exit discharge path from an exit to public way.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'EGRESS-OUT-01'
    }
  ]
};

// 7. Electrical
export const ELECTRICAL_OUTSIDE: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    // Electrical - Conductor, Outlet, and Switch
    {
      id: 'elec_out_1',
      name: 'Electrical - Conductor, Outlet, and Switch',
      detail: 'Exposed electrical conductor.',
      criteria: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there\'s an opening or gap larger than 1/2 inch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-01'
    },
    {
      id: 'elec_out_2',
      name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-OUT-02'
    },
    {
      id: 'elec_out_3',
      name: 'Unprotected outlet is present within six feet of a water source, including a water heater or a laundry area when not in use.',
      detail: 'An unprotected outlet is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) that is located in the same room, and outlet is not GFCI protected.',
      criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-OUT-03'
    },
    {
      id: 'elec_out_4',
      name: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-OUT-04'
    },
    // Electrical Service Panel
    {
      id: 'elec_out_5',
      name: 'Electrical Service Panel',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ELEC-OUT-05'
    },
    {
      id: 'elec_out_6',
      name: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'ELEC-OUT-06'
    },
    {
      id: 'elec_out_7',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-07'
    }
  ]
};

// 8. Fencing/Gate
export const FENCING_GATE_OUTSIDE: ItemDeficiencies = {
  itemName: 'Fencing/Gate',
  deficiencies: [
    {
      id: 'fence_out_1',
      name: 'Fence and Gate',
      detail: 'Fence components are missing.',
      criteria: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-OUT-01'
    },
    {
      id: 'fence_out_2',
      name: 'Fence demonstrates signs of collapse.',
      detail: 'Fence demonstrates signs of collapse.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-OUT-02'
    },
    {
      id: 'fence_out_3',
      name: 'The gate does not open, close, catch, or lock.',
      detail: 'The gate does not open, close, catch, or lock.',
      criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FENCE-OUT-03'
    }
  ]
};

// 9. Fire Safety
export const FIRE_SAFETY_OUTSIDE: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    // Exit Sign
    {
      id: 'fire_out_1',
      name: 'Exit Sign',
      detail: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated',
      criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not properly illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-01'
    },
    // Fire Escape
    {
      id: 'fire_out_2',
      name: 'Fire Escape',
      detail: 'Fire escape component is damaged, or missing.',
      criteria: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-02'
    },
    // Fire Extinguisher
    {
      id: 'fire_out_3',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing.',
      criteria: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-03'
    },
    {
      id: 'fire_out_4',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-04'
    },
    {
      id: 'fire_out_5',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The fire extinguisher tag is missing or illegible or expired.',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-05'
    },
    // Flammable and Combustible Item
    {
      id: 'fire_out_6',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-06'
    },
    // Sprinkler Assembly
    {
      id: 'fire_out_7',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-07'
    },
    {
      id: 'fire_out_8',
      name: 'Sprinkler head assembly has evidence of corrossion.',
      detail: 'Sprinkler head assembly has evidence of corrossion.',
      criteria: 'Sprinkler head assembly has evidence of corrossion.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-08'
    },
    {
      id: 'fire_out_9',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-09'
    },
    {
      id: 'fire_out_10',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-10'
    }
  ]
};

// 10. Foundation Standard
export const FOUNDATION_OUTSIDE: ItemDeficiencies = {
  itemName: 'Foundation Standard',
  deficiencies: [
    {
      id: 'found_out_1',
      name: 'Foundation exposed rebar or Foundation is spalling, flaking, or chipping.',
      detail: 'The structure has exposed rebar.OR The foundation is spalling, flaking, or chipping, and the affected area goes into the foundation at a depth of ¾ inch or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation exhibits a sign of severe failure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-OUT-01'
    },
    {
      id: 'found_out_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-OUT-02'
    },
    {
      id: 'found_out_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.',
      criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-OUT-03'
    },
    {
      id: 'found_out_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'FOUND-OUT-04'
    }
  ]
};

// 11. Hazard
export const HAZARD_OUTSIDE: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    // Rat
    {
      id: 'haz_out_1',
      name: 'Rat',
      detail: 'Evidence of rats',
      criteria: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAZ-OUT-01'
    },
    // Litter
    {
      id: 'haz_out_2',
      name: 'Litter',
      detail: 'Litter is accumulated in an undesignated area',
      criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'HAZ-OUT-02'
    },
    // Sharp edges
    {
      id: 'haz_out_3',
      name: 'Sharp edges',
      detail: 'A shrp edge that can result in a cut or puncture hazard is present.',
      criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'HAZ-OUT-03'
    },
    // Trip hazard
    {
      id: 'haz_out_4',
      name: 'Trip hazard',
      detail: 'Trip hazard on walking surface.',
      criteria: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'HAZ-OUT-04'
    }
  ]
};

// 12. HVAC
export const HVAC_OUTSIDE: ItemDeficiencies = {
  itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)',
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

// 13. Leak – Gas or Oil
export const LEAK_GAS_OIL_OUTSIDE: ItemDeficiencies = {
  itemName: 'Leak – Gas or Oil',
  deficiencies: [
    {
      id: 'leak_gas_out_1',
      name: 'Natural gas, propane, or oil leak.',
      detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
      criteria: 'Natural gas, propane, or oil leak.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'LEAK-GAS-OUT-01'
    }
  ]
};

// 14. Leak - sewage system
export const LEAK_SEWAGE_OUTSIDE: ItemDeficiencies = {
  itemName: 'Leak - sewage system',
  deficiencies: [
    {
      id: 'leak_sew_out_1',
      name: 'Blocked sewage system.',
      detail: 'Wastewater is unable to drain resulting in sewer backup.',
      criteria: 'Blocked sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LEAK-SEW-OUT-01'
    },
    {
      id: 'leak_sew_out_2',
      name: 'Cap to the cleanout or pump cover is detached or missing.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-OUT-02'
    },
    {
      id: 'leak_sew_out_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visably defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LEAK-SEW-OUT-03'
    },
    {
      id: 'leak_sew_out_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LEAK-SEW-OUT-04'
    }
  ]
};

// 15. Leak - water
export const LEAK_WATER_OUTSIDE: ItemDeficiencies = {
  itemName: 'Leak - water',
  deficiencies: [
    {
      id: 'leak_water_out_1',
      name: 'Fluid is leaking from the sprinkler assembly.',
      detail: 'Fluid is leaking from the sprinkler assembly.',
      criteria: 'Fluid is leaking from the sprinkler assembly.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'LEAK-WATER-OUT-01'
    },
    {
      id: 'leak_water_out_2',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'LEAK-WATER-OUT-02'
    }
  ]
};

// 16. Lighting
export const LIGHTING_OUTSIDE: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: [
    // Lighting - Auxiliary
    {
      id: 'light_out_1',
      name: 'Lighting - Auxiliary',
      detail: 'Auxiliary lighting is damaged, missing or fail to iluminate when tested',
      criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'LIGHT-OUT-01'
    },
    // Lighting - Exterior
    {
      id: 'light_out_2',
      name: 'Lighting - Exterior',
      detail: 'A permanently installed light fixture is damaged, inoperable, missing or not secure',
      criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'LIGHT-OUT-02'
    }
  ]
};

// 17. Parking lots, Driveways, Roads
export const PARKING_OUTSIDE: ItemDeficiencies = {
  itemName: 'Parking lots, Driveways, Roads',
  deficiencies: [
    // Parking Lot
    {
      id: 'park_out_1',
      name: 'Parking Lot',
      detail: 'The parking lot has any one pothole greater than 4 inches deep and 1 square foot or more significant.',
      criteria: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-OUT-01'
    },
    {
      id: 'park_out_2',
      name: 'Parking lot has ponding.',
      detail: 'Parking lot has ponding.',
      criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-OUT-02'
    },
    // Private Roads and Driveways
    {
      id: 'park_out_3',
      name: 'Private Roads and Drivways',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      criteria: 'Not including temporary obstruction.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PARK-OUT-03'
    },
    {
      id: 'park_out_4',
      name: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PARK-OUT-04'
    }
  ]
};

// 18. Paint - Potential Lead-Based Paint Hazards
export const PAINT_OUTSIDE: ItemDeficiencies = {
  itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  deficiencies: [
    {
      id: 'paint_out_1',
      name: 'Less than 2 SF - Paint in a Unit or inside the target property is deteriorated, below the level required for lead-safe work practices by a lead-certified firm or for passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'PAINT-OUT-01'
    },
    {
      id: 'paint_out_2',
      name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
      criteria: 'More than 2 square feet per roomdeteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'PAINT-OUT-02'
    }
  ]
};

// 19. Railings
export const RAILINGS_OUTSIDE: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: [
    // Guardrail
    {
      id: 'rail_out_1',
      name: 'Guardrail',
      detail: 'The guardrail is missing or not installed, limiting its safe use.',
      criteria: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'RAIL-OUT-01'
    },
    {
      id: 'rail_out_2',
      name: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      detail: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'RAIL-OUT-02'
    },
    // Handrail
    {
      id: 'rail_out_3',
      name: 'Handrail',
      detail: 'Handrail is missing.',
      criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-OUT-03'
    },
    {
      id: 'rail_out_4',
      name: 'Handrail is not functionally adequate.',
      detail: 'Handrail is not functionally adequate.',
      criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-OUT-04'
    },
    {
      id: 'rail_out_5',
      name: 'Handrail is not installed where required.',
      detail: 'Handrail is not installed where required.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'RAIL-OUT-05'
    },
    {
      id: 'rail_out_6',
      name: 'Handrail is not secured.',
      detail: 'Handrail is not secured.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RAIL-OUT-06'
    }
  ]
};

// 20. Roof Assembly
export const ROOF_OUTSIDE: ItemDeficiencies = {
  itemName: 'Roof Assembly',
  deficiencies: [
    {
      id: 'roof_out_1',
      name: 'Gutter component is damaged or missing.',
      detail: 'Gutter component is damaged (i.e., visibly defective; impacts functionality). OR Gutter component is missing (i.e., evidence of prior installation, but now not present or is incomplete). OR Gutter component is unfixed.',
      criteria: 'Gutter or downspout missing or damaged components.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-01'
    },
    {
      id: 'roof_out_2',
      name: 'Restricted flow of water from a roof drain, gutter, or downspout.',
      detail: 'Debris is limiting the ability of water to drain; water may not be present. Or an area of approximately 25 sq. ft. of ponding water is located above the drain.',
      criteria: 'The condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-02'
    },
    {
      id: 'roof_out_3',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-03'
    },
    {
      id: 'roof_out_4',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-04'
    },
    {
      id: 'roof_out_5',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condtion is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-05'
    },
    {
      id: 'roof_out_6',
      name: 'Substrate is exposed.',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Vsually observed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'ROOF-OUT-06'
    }
  ]
};

// 21. Sidewalk, walkway, and ramp
export const SIDEWALK_OUTSIDE: ItemDeficiencies = {
  itemName: 'Sidewalk, walkway, and ramp',
  deficiencies: [
    {
      id: 'side_out_1',
      name: 'Sidewalk, walkway, or ramp is blocked or impassable.',
      detail: 'Sidewalk, walkway, or ramp is blocked or impassable.',
      criteria: 'The Sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SIDE-OUT-01'
    },
    {
      id: 'side_out_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'SIDE-OUT-02'
    }
  ]
};

// 22. Step and Stairs
export const STAIRS_OUTSIDE: ItemDeficiencies = {
  itemName: 'Step and Stairs',
  deficiencies: [
    {
      id: 'stair_out_1',
      name: 'Step or stair is not functionally adequate.',
      detail: 'Step or stair is not functionally adequate (i.e., may not allow for personal traffic from one level to the next).',
      criteria: 'Damaged or deterioration, unintentional dimensional changes that may interrupt a person\'s walking pattern or movement, or unstable material.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-OUT-01'
    },
    {
      id: 'stair_out_2',
      name: 'Stringer damaged.',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiany is observed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-OUT-02'
    },
    {
      id: 'stair_out_3',
      name: 'Tread is missing or damaged.',
      detail: 'Tread on a set of stairs is missing Or tread on a set of stairs is loose or unlevel. Or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
      criteria: 'Accessory treads are present and verified to be functional.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'STAIR-OUT-03'
    }
  ]
};

// 23. Structural
export const STRUCTURAL_OUTSIDE: ItemDeficiencies = {
  itemName: 'Structural',
  deficiencies: [
    {
      id: 'struct_out_1',
      name: 'Structural system exhibits signs of serious failure.',
      detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety.',
      criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'STRUCT-OUT-01'
    }
  ]
};

// 24. Retaining Wall and Wall - Exterior
export const RETAINING_WALL_OUTSIDE: ItemDeficiencies = {
  itemName: 'RETAINING WALL',
  deficiencies: [
    // Retaining wall
    {
      id: 'ret_out_1',
      name: 'Retaining wall',
      detail: 'Retaining wall is leaning away from the fill side.',
      criteria: 'Retaining wall is leaning away from the fill side.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-OUT-01'
    },
    {
      id: 'ret_out_2',
      name: 'Retaining wall is partially or completely collapsed.',
      detail: 'Retaining wall is partially or completely collapsed.',
      criteria: 'The retaining wall is (sloped )partialy or completely collapsed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-OUT-02'
    },
    // Wall - Exterior
    {
      id: 'ret_out_3',
      name: 'Wall - Exterior',
      detail: 'Exterior wall component(s) is not functionally adequate.',
      criteria: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-OUT-03'
    },
    {
      id: 'ret_out_4',
      name: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      detail: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
      criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-OUT-04'
    },
    {
      id: 'ret_out_5',
      name: 'Exterior wall has peeling paint of 10 square feet or more',
      detail: 'Exterior wall has peeling paint of 10 square feet or more',
      criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'RET-OUT-05'
    }
  ]
};

// 25. Water Heater
export const WATER_HEATER_OUTSIDE: ItemDeficiencies = {
  itemName: 'Water Heater',
  deficiencies: [
    {
      id: 'wh_out_1',
      name: 'Chimney or flue piping is blocked, misaligned, or missing.',
      detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'The vent is damaged, misaligned, or not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'WH-OUT-01'
    },
    {
      id: 'wh_out_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
      criteria: 'Uable to shutoff gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '24.8/n',
      code: 'WH-OUT-02'
    },
    {
      id: 'wh_out_3',
      name: 'TPRV has an active leak. Or TPRV is obstructed such that the TPRV is unable to be fully actuated. OR Relief valve discharge piping is damaged d (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      detail: 'TPRV is obstructed such that the TPRV is unable to be fully actuated. OR, relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), is capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '12.20/n',
      code: 'WH-OUT-03'
    },
    {
      id: 'wh_out_4',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '4.5/n',
      code: 'WH-OUT-04'
    }
  ]
};

// 26. General Comment
export const GENERAL_COMMENT_OUTSIDE: ItemDeficiencies = {
  itemName: 'General Comment',
  deficiencies: [
    {
      id: 'gen_out_1',
      name: 'General observation or comment',
      detail: 'General observation or comment about the property condition.',
      criteria: 'General comment - for informational purposes only.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '0.00/n',
      code: 'GEN-OUT-01'
    }
  ]
};

// ==========================================
// OUTSIDE CATEGORIES LIST - for UI navigation
// ==========================================
export const OUTSIDE_CATEGORIES = [
  { id: 1, name: 'Address and Signage', itemName: 'Address and Signage' },
  { id: 2, name: 'Chimney', itemName: 'Chimney' },
  { id: 3, name: 'Clothes Dryer Exhaust Ventilation', itemName: 'Clothes Dryer Exhaust Ventilation' },
  { id: 4, name: 'Door', itemName: 'Door' },
  { id: 5, name: 'Drain', itemName: 'Drain' },
  { id: 6, name: 'Egress', itemName: 'Egress' },
  { id: 7, name: 'Electrical', itemName: 'Electrical' },
  { id: 8, name: 'Fencing/Gate', itemName: 'Fencing/Gate' },
  { id: 9, name: 'Fire Safety', itemName: 'Fire Safety' },
  { id: 10, name: 'Foundation Standard', itemName: 'Foundation Standard' },
  { id: 11, name: 'Hazard', itemName: 'Hazard' },
  { id: 12, name: 'Heating, Ventilation, and Air Conditioning (HVAC)', itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)' },
  { id: 13, name: 'Leak – Gas or Oil', itemName: 'Leak – Gas or Oil' },
  { id: 14, name: 'Leak - sewage system', itemName: 'Leak - sewage system' },
  { id: 15, name: 'Leak - water', itemName: 'Leak - water' },
  { id: 16, name: 'Lighting', itemName: 'Lighting' },
  { id: 17, name: 'Parking lots, Driveways, Roads', itemName: 'Parking lots, Driveways, Roads' },
  { id: 18, name: 'Paint - Potential Lead-Based Paint Hazards', itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
  { id: 19, name: 'Railings', itemName: 'Railings' },
  { id: 20, name: 'Roof Assembly', itemName: 'Roof Assembly' },
  { id: 21, name: 'Sidewalk, walkway, and ramp', itemName: 'Sidewalk, walkway, and ramp' },
  { id: 22, name: 'Step and Stairs', itemName: 'Step and Stairs' },
  { id: 23, name: 'Structural', itemName: 'Structural' },
  { id: 24, name: 'RETAINING WALL', itemName: 'RETAINING WALL' },
  { id: 25, name: 'Water Heater', itemName: 'Water Heater' },
  { id: 26, name: 'General Comment', itemName: 'General Comment' },
];

// ==========================================
// HELPER FUNCTION - Get Outside Deficiencies by Category Name
// ==========================================
export function getOutsideDeficienciesByCategory(categoryName: string): ItemDeficiencies | null {
  const normalizedName = categoryName.toLowerCase().trim();

  // Address and Signage
  if (normalizedName.includes('address') || normalizedName.includes('signage')) {
    return ADDRESS_SIGNAGE_OUTSIDE;
  }

  // Chimney - use includes for flexible matching
  if (normalizedName.includes('chimney')) {
    return CHIMNEY_OUTSIDE;
  }

  // Clothes Dryer Exhaust Ventilation
  if (normalizedName.includes('dryer') || normalizedName.includes('clothes dryer') || normalizedName.includes('exhaust ventilation')) {
    return DRYER_VENT_OUTSIDE;
  }

  // Door
  if (normalizedName.includes('door') || normalizedName.includes('garage door')) {
    return DOOR_OUTSIDE;
  }

  // Drain
  if (normalizedName.includes('drain') || normalizedName.includes('drainage') || normalizedName.includes('site drainage')) {
    return DRAIN_OUTSIDE;
  }

  // Egress
  if (normalizedName.includes('egress') || normalizedName.includes('obstructed means')) {
    return EGRESS_OUTSIDE;
  }

  // Electrical
  if (normalizedName.includes('electrical') || normalizedName.includes('conductor') || normalizedName.includes('gfci') || normalizedName.includes('afci') || normalizedName.includes('outlet') || normalizedName.includes('switch')) {
    return ELECTRICAL_OUTSIDE;
  }

  // Fencing/Gate
  if (normalizedName.includes('fenc') || normalizedName.includes('gate')) {
    return FENCING_GATE_OUTSIDE;
  }

  // Fire Safety
  if (normalizedName.includes('fire') || normalizedName.includes('exit sign') || normalizedName.includes('extinguisher') || normalizedName.includes('sprinkler')) {
    return FIRE_SAFETY_OUTSIDE;
  }

  // Foundation
  if (normalizedName.includes('foundation')) {
    return FOUNDATION_OUTSIDE;
  }

  // Hazard
  if (normalizedName.includes('hazard') || normalizedName.includes('rat') || normalizedName.includes('litter') || normalizedName.includes('sharp') || normalizedName.includes('trip')) {
    return HAZARD_OUTSIDE;
  }

  // HVAC
  if (normalizedName.includes('hvac') || normalizedName.includes('heating') || normalizedName.includes('ventilation') || normalizedName.includes('air conditioning')) {
    return HVAC_OUTSIDE;
  }

  // Leak - Gas or Oil
  if ((normalizedName.includes('leak') && (normalizedName.includes('gas') || normalizedName.includes('oil'))) || normalizedName.includes('propane')) {
    return LEAK_GAS_OIL_OUTSIDE;
  }

  // Leak - sewage
  if (normalizedName.includes('sewage') || normalizedName.includes('sewer')) {
    return LEAK_SEWAGE_OUTSIDE;
  }

  // Leak - water
  if (normalizedName.includes('leak') && normalizedName.includes('water')) {
    return LEAK_WATER_OUTSIDE;
  }

  // Lighting
  if (normalizedName.includes('lighting') || normalizedName.includes('light')) {
    return LIGHTING_OUTSIDE;
  }

  // Parking lots, Driveways, Roads
  if (normalizedName.includes('parking') || normalizedName.includes('driveway') || normalizedName.includes('road')) {
    return PARKING_OUTSIDE;
  }

  // Paint
  if (normalizedName.includes('paint') || normalizedName.includes('lead')) {
    return PAINT_OUTSIDE;
  }

  // Railings
  if (normalizedName.includes('railing') || normalizedName.includes('guardrail') || normalizedName.includes('handrail')) {
    return RAILINGS_OUTSIDE;
  }

  // Roof Assembly
  if (normalizedName.includes('roof') || normalizedName.includes('gutter')) {
    return ROOF_OUTSIDE;
  }

  // Sidewalk, walkway, and ramp
  if (normalizedName.includes('sidewalk') || normalizedName.includes('walkway') || normalizedName.includes('ramp')) {
    return SIDEWALK_OUTSIDE;
  }

  // Step and Stairs
  if (normalizedName.includes('step') || normalizedName.includes('stair') || normalizedName.includes('tread') || normalizedName.includes('stringer')) {
    return STAIRS_OUTSIDE;
  }

  // Structural
  if (normalizedName.includes('structural')) {
    return STRUCTURAL_OUTSIDE;
  }

  // Retaining Wall
  if (normalizedName.includes('retaining') || normalizedName.includes('wall') && normalizedName.includes('exterior')) {
    return RETAINING_WALL_OUTSIDE;
  }

  // Water Heater
  if (normalizedName.includes('water heater') || normalizedName.includes('tprv')) {
    return WATER_HEATER_OUTSIDE;
  }

  // General Comment
  if (normalizedName.includes('general') || normalizedName.includes('comment')) {
    return GENERAL_COMMENT_OUTSIDE;
  }

  return null;
}

// ==========================================
// MAPPING ALL OUTSIDE DEFICIENCIES
// ==========================================
export const ALL_OUTSIDE_DEFICIENCIES: Record<string, ItemDeficiencies> = {
  'Address and Signage': ADDRESS_SIGNAGE_OUTSIDE,
  'Chimney': CHIMNEY_OUTSIDE,
  'Clothes Dryer Exhaust Ventilation': DRYER_VENT_OUTSIDE,
  'Door': DOOR_OUTSIDE,
  'Drain': DRAIN_OUTSIDE,
  'Egress': EGRESS_OUTSIDE,
  'Electrical': ELECTRICAL_OUTSIDE,
  'Fencing/Gate': FENCING_GATE_OUTSIDE,
  'Fire Safety': FIRE_SAFETY_OUTSIDE,
  'Foundation Standard': FOUNDATION_OUTSIDE,
  'Hazard': HAZARD_OUTSIDE,
  'Heating, Ventilation, and Air Conditioning (HVAC)': HVAC_OUTSIDE,
  'Leak – Gas or Oil': LEAK_GAS_OIL_OUTSIDE,
  'Leak - sewage system': LEAK_SEWAGE_OUTSIDE,
  'Leak - water': LEAK_WATER_OUTSIDE,
  'Lighting': LIGHTING_OUTSIDE,
  'Parking lots, Driveways, Roads': PARKING_OUTSIDE,
  'Paint - Potential Lead-Based Paint Hazards – Visual Assessment': PAINT_OUTSIDE,
  'Railings': RAILINGS_OUTSIDE,
  'Roof Assembly': ROOF_OUTSIDE,
  'Sidewalk, walkway, and ramp': SIDEWALK_OUTSIDE,
  'Step and Stairs': STAIRS_OUTSIDE,
  'Structural': STRUCTURAL_OUTSIDE,
  'RETAINING WALL': RETAINING_WALL_OUTSIDE,
  'Water Heater': WATER_HEATER_OUTSIDE,
  'General Comment': GENERAL_COMMENT_OUTSIDE,
};
