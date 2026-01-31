// Comprehensive NSPIRE Deficiency Mapping for All 26 Categories

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
      name: 'Address or building identification codes are broken, illegible, or not visible',
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
      name: 'Chimney is damaged or incomplete',
      detail: 'A visually accessible chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
      criteria: 'Chimney, flue, or firebox is damaged and may not safely contain fire.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CHIM-01'
    },
    {
      id: 'chim_2',
      name: 'Chimney exhibits signs of structural failure',
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
      name: 'Electrical dryer exhaust has restricted airflow',
      detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-01'
    },
    {
      id: 'dryer_2',
      name: 'Exterior dryer vent cover, cap, or component is missing',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-02'
    },
    {
      id: 'dryer_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DRYER-03'
    }
  ]
};

// 4. Door
export const DOOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    {
      id: 'door_1',
      name: 'Entry door cannot be secured adequately',
      detail: 'Installed locks cannot be engaged from both sides.',
      criteria: 'Entry door cannot be secured adequately, missing, damaged hardware.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-01'
    },
    {
      id: 'door_2',
      name: 'Entry door component is damaged, missing, inoperable',
      detail: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door.',
      criteria: 'Entry door component is damaged, missing, inoperable.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'DOOR-02'
    },
    {
      id: 'door_3',
      name: 'Entry door is missing',
      detail: 'Not present or is incomplete.',
      criteria: 'Entry door is missing.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs.',
      points: '30/n',
      code: 'DOOR-03'
    },
    {
      id: 'door_4',
      name: 'Entry door will not close properly',
      detail: 'Entry door does not close (i.e., door seats in frame).',
      criteria: 'Entry door will not close properly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-04'
    },
    {
      id: 'door_5',
      name: 'Fire-labeled door is missing',
      detail: 'Evidence of prior installation, but now not present or is incomplete.',
      criteria: 'Fire-labeled door is missing.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '14.8/n',
      code: 'DOOR-05'
    },
    {
      id: 'door_6',
      name: 'Garage door does not open, close, or remains closed',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-06'
    }
  ]
};

// 5. Drain
export const DRAIN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drainage',
  deficiencies: [
    {
      id: 'drain_1',
      name: 'Drain is fully clogged',
      detail: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      criteria: 'Drain is fully clogged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-01'
    },
    {
      id: 'drain_2',
      name: 'Site drainage - Erosion is present',
      detail: 'Exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil.',
      criteria: 'Erosion is present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DRAIN-02'
    },
    {
      id: 'drain_3',
      name: 'Grate is not secure or does not cover site drainage system',
      detail: 'Grate is not secure or does not cover the site drainage system at the collection point.',
      criteria: 'Grate is not secure or does not cover collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-03'
    },
    {
      id: 'drain_4',
      name: 'Water runoff unable to flow through site drainage system',
      detail: 'Standing water is present at the entrance of the outflow pipe or drainage is blocked.',
      criteria: 'Water is unable to drain in the event of precipitation.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-04'
    }
  ]
};

// 6. Egress
export const EGRESS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_1',
      name: 'Obstructed means of egress',
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
      name: 'Exposed electrical conductor',
      detail: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there is an opening or gap larger than 1/2 inch.',
      criteria: 'The electrical conductor is not enclosed or properly insulated.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-01'
    },
    {
      id: 'elec_2',
      name: 'AFCI outlet or breaker does not reset',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      criteria: 'Overall system or component is not meeting function or purpose.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-02'
    },
    {
      id: 'elec_3',
      name: 'Electrical service panel is not reasonably accessible',
      detail: 'The electrical service panel cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk.',
      criteria: 'Electrical service panel is not reasonably accessible.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-03'
    },
    {
      id: 'elec_4',
      name: 'Unprotected outlet within six feet of water source',
      detail: 'An unprotected outlet is present within six feet of a water source (sink, bathtub, shower, water faucet, toilet) that is located in the same room, and outlet is not GFCI protected.',
      criteria: 'Outlet not GFCI-protected within six feet of water source.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-04'
    },
    {
      id: 'elec_5',
      name: 'GFCI outlet or breaker does not reset',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
      criteria: 'Overall system or component is not meeting function or purpose.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-05'
    },
    {
      id: 'elec_6',
      name: 'Overcurrent protection device is contaminated',
      detail: 'The overcurrent protection device (fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      criteria: 'Device is contaminated by infestation, paint, or other foreign materials.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEC-06'
    },
    {
      id: 'elec_7',
      name: 'Overcurrent protection device is damaged',
      detail: 'The overcurrent protection device (fuse or breaker) is damaged such that it may not interrupt the circuit during an overcurrent condition.',
      criteria: 'Device is visibly defective and impacts functionality.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-07'
    }
  ]
};

// 8. Fencing/Gate
export const FENCE_GATE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fencing/Gate',
  deficiencies: [
    {
      id: 'fence_1',
      name: 'Fence components are missing',
      detail: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section area.',
      criteria: 'Missing components create hole covering 10% or more.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FENCE-01'
    },
    {
      id: 'fence_2',
      name: 'Fence demonstrates signs of collapse',
      detail: 'Fence demonstrates signs of collapse.',
      criteria: 'Fence shows structural failure.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FENCE-02'
    },
    {
      id: 'fence_3',
      name: 'Gate does not open, close, catch, or lock',
      detail: 'Gate will not open, or gate will open when locked or latched, or gate will not close.',
      criteria: 'Gate is not functional.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FENCE-03'
    }
  ]
};

// 9. Fire Safety
export const FIRE_SAFETY_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    {
      id: 'fire_1',
      name: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated',
      detail: 'An exit sign is deficient if it is damaged, missing, obstructed so "EXIT" is not clearly visible, or not properly illuminated.',
      criteria: 'Exit sign is not functional or visible.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-01'
    },
    {
      id: 'fire_2',
      name: 'Fire escape component is damaged or missing',
      detail: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety.',
      criteria: 'Fire escape component affects safety.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-02'
    },
    {
      id: 'fire_3',
      name: 'Fire extinguisher is damaged or missing',
      detail: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident.',
      criteria: 'Fire extinguisher is not present or functional.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-03'
    },
    {
      id: 'fire_4',
      name: 'Fire extinguisher pressure gauge reads over or undercharged',
      detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      criteria: 'Fire extinguisher is not properly charged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-04'
    },
    {
      id: 'fire_5',
      name: 'Fire extinguisher tag is missing, illegible, or expired',
      detail: 'The date on the service tag has exceeded one year, or the tag is missing or illegible, or a non-chargeable extinguisher is more than 12 years old.',
      criteria: 'Fire extinguisher service tag is not current.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-05'
    },
    {
      id: 'fire_6',
      name: 'Flammable or combustible material on or within 3 feet of ignition source',
      detail: 'Flammable or combustible materials are placed within 3 feet of thermal comfort appliances or fuel-burning water heaters.',
      criteria: 'Fire hazard present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-06'
    },
    {
      id: 'fire_7',
      name: 'Sprinkler assembly component is damaged, inoperable, or missing',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing and is detrimental to performance.',
      criteria: 'Sprinkler system is not functional.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-07'
    },
    {
      id: 'fire_8',
      name: 'Sprinkler head assembly has evidence of corrosion',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: 'Corrosion affects sprinkler functionality.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-08'
    },
    {
      id: 'fire_9',
      name: 'Sprinkler assembly has debris, paint, or foreign material',
      detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb.',
      criteria: 'Sprinkler performance is compromised.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-09'
    },
    {
      id: 'fire_10',
      name: 'Sprinkler head assembly is obstructed within 18 inches',
      detail: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Obstruction prevents proper sprinkler operation.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-10'
    }
  ]
};

// 10. Foundation
export const FOUNDATION_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Foundation',
  deficiencies: [
    {
      id: 'found_1',
      name: 'Foundation exposed rebar or spalling, flaking, or chipping',
      detail: 'The structure has exposed rebar or the foundation is spalling, flaking, or chipping, and the affected area goes into the foundation at a depth of ¾ inch or greater.',
      criteria: 'Evaluation by a qualified contractor is recommended.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-01'
    },
    {
      id: 'found_2',
      name: 'Foundation exhibits sign of severe failure',
      detail: 'Foundation exhibits a sign of severe failure.',
      criteria: 'Evaluation by a qualified contractor is recommended.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FOUND-02'
    },
    {
      id: 'found_3',
      name: 'Foundation is cracked',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-03'
    },
    {
      id: 'found_4',
      name: 'Foundation infiltrated by water',
      detail: 'Evidence of water infiltration through the foundation (e.g., excessive dampness, collected water, stains, or mineral deposits).',
      criteria: 'Evaluation by a qualified contractor is recommended.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOUND-04'
    },
    {
      id: 'found_5',
      name: 'Foundation support post, column, or girder area is damaged',
      detail: 'Any support post, column, or girder area is damaged (e.g., rot) on support posts, columns, or girders.',
      criteria: 'Foundation damage impacts structural integrity.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-05'
    }
  ]
};

// 11. Hazard
export const HAZARD_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    {
      id: 'hazard_1',
      name: 'Evidence of rats',
      detail: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
      criteria: 'Rat infestation present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZ-01'
    },
    {
      id: 'hazard_2',
      name: 'Litter is accumulated in an undesignated area',
      detail: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      criteria: 'Excessive litter present.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'HAZ-02'
    },
    {
      id: 'hazard_3',
      name: 'Sharp edge that can result in cut or puncture hazard',
      detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment.',
      criteria: 'Sharp edge poses immediate danger.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZ-03'
    },
    {
      id: 'hazard_4',
      name: 'Trip hazard on walking surface',
      detail: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      criteria: 'Trip hazard present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZ-04'
    }
  ]
};

// 12. HVAC
export const HVAC_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)',
  deficiencies: [
    {
      id: 'hvac_1',
      name: 'Fuel-burning heating system exhaust vent is misaligned, blocked, disconnected, damaged or missing',
      detail: 'Fuel burning heating system or device is present and exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall, or exhaust vent is damaged or missing.',
      criteria: 'Metal tape is not a substitute for an improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-01'
    }
  ]
};

// 13. Leak – Gas or Oil
export const LEAK_GAS_OIL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'LEAK – Gas or Oil',
  deficiencies: [
    {
      id: 'leak_gas_1',
      name: 'Natural gas, propane, or oil leak',
      detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
      criteria: 'Gas or oil leak present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-GAS-01'
    }
  ]
};

// 14. Leak - sewage system
export const LEAK_SEWAGE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak-sewage system (Clogged drain)(Missing drain cap)',
  deficiencies: [
    {
      id: 'leak_sew_1',
      name: 'Blocked sewage system',
      detail: 'Wastewater is unable to drain resulting in sewer backup.',
      criteria: 'Sewage system is blocked.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-SEW-01'
    },
    {
      id: 'leak_sew_2',
      name: 'Cap to cleanout or pump cover is detached or missing',
      detail: 'Cap to the cleanout or pump cover is detached or missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap is missing or detached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-02'
    },
    {
      id: 'leak_sew_3',
      name: 'Cleanout cap or riser is damaged',
      detail: 'Cap to the cleanout or pump cover is damaged (visibly defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-03'
    },
    {
      id: 'leak_sew_4',
      name: 'Leak in sewage system',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Sewage leak present.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-SEW-04'
    }
  ]
};

// 15. Leak - water
export const LEAK_WATER_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Leak- water',
  deficiencies: [
    {
      id: 'leak_water_1',
      name: 'Fluid is leaking from the sprinkler assembly',
      detail: 'Fluid is leaking from the sprinkler assembly.',
      criteria: 'Sprinkler leak present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-01'
    },
    {
      id: 'leak_water_2',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak present.',
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
      name: 'Auxiliary lighting is damaged, missing or fails to illuminate when tested',
      detail: 'Auxiliary lighting is not present or not installed, missing or fails to illuminate when tested.',
      criteria: 'Auxiliary lighting is not functional.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-01'
    },
    {
      id: 'light_2',
      name: 'Permanently installed light fixture is damaged, inoperable, missing or not secure',
      detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      criteria: 'Light fixture is not functional or secure.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-02'
    }
  ]
};

// 17. Parking lots, Driveways, Roads
export const PARKING_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Parking lots, Driveways, Roads',
  deficiencies: [
    {
      id: 'park_1',
      name: 'Parking lot has pothole greater than 4 inches deep and 1 square foot',
      detail: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      criteria: 'Significant pothole present.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PARK-01'
    },
    {
      id: 'park_2',
      name: 'Parking lot has ponding',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'Ponding affects parking lot usability.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'PARK-02'
    },
    {
      id: 'park_3',
      name: 'Road or driveway access to property is blocked or impassable',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles (not including temporary obstruction).',
      criteria: 'Access is blocked.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'PARK-03'
    },
    {
      id: 'park_4',
      name: 'Driveway pothole at least 4 inches deep and 1 square foot',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PARK-04'
    }
  ]
};

// 18. Paint - Potential Lead-Based Paint Hazards
export const PAINT_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  deficiencies: [
    {
      id: 'paint_1',
      name: 'Less than 2 SF - Paint deteriorated below level for lead-safe work practices',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component.',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PAINT-01'
    },
    {
      id: 'paint_2',
      name: 'More than 2 SF - Paint deteriorated above level for lead-safe work practices',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component.',
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
      name: 'Guardrail is missing or not installed',
      detail: 'A guardrail is deficient if it is missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents.',
      criteria: 'Guardrail missing limits safe use.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'RAIL-01'
    },
    {
      id: 'rail_2',
      name: 'Guardrail component is missing or damaged',
      detail: 'A guardrail is deficient if it is missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      criteria: 'Does not limit safe use but guardrail is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RAIL-02'
    },
    {
      id: 'rail_3',
      name: 'Handrail is missing',
      detail: 'Handrail is missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Handrail is missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RAIL-03'
    },
    {
      id: 'rail_4',
      name: 'Handrail is not functionally adequate',
      detail: 'Handrail is not functionally adequate (cannot reasonably be grasped by hand to provide stability or support), or handrail is not continuous for the full length of each flight of stairs, or handrail is not between 28 inches and 42 inches in height.',
      criteria: 'Handrail does not meet functional requirements.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RAIL-04'
    },
    {
      id: 'rail_5',
      name: 'Handrail is not installed where required',
      detail: '4 or more stair risers are present, and a handrail is not installed, or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      criteria: 'Handrail required but not installed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RAIL-05'
    },
    {
      id: 'rail_6',
      name: 'Handrail is not secured',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'Handrail is not secure.',
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
      name: 'Gutter component is damaged, missing, or unfixed',
      detail: 'Gutter component is damaged (visibly defective; impacts functionality), or gutter component is missing (evidence of prior installation, but now not present or is incomplete), or gutter component is unfixed.',
      criteria: 'Gutter or downspout missing or damaged components.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-01'
    },
    {
      id: 'roof_2',
      name: 'Restricted flow of water from roof drain, gutter, or downspout',
      detail: 'Debris is limiting the ability of water to drain; water may not be present, or an area of approximately 25 sq. ft. of ponding water is located above the drain.',
      criteria: 'The condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-02'
    },
    {
      id: 'roof_3',
      name: 'Roof assembly has a hole',
      detail: 'Unintentional holes of any size are found, or intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-03'
    },
    {
      id: 'roof_4',
      name: 'Roof assembly is damaged',
      detail: 'Roof assembly has damage (visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-04'
    },
    {
      id: 'roof_5',
      name: 'Roof surface has standing water',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-05'
    },
    {
      id: 'roof_6',
      name: 'Substrate is exposed',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Visually observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-06'
    }
  ]
};

// 21. Sidewalk, walkway, and ramp
export const SIDEWALK_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Sidewalk, walkway, and ramp',
  deficiencies: [
    {
      id: 'side_1',
      name: 'Sidewalk, walkway, or ramp is blocked or impassable',
      detail: 'The sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
      criteria: 'Path is blocked or impassable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SIDE-01'
    },
    {
      id: 'side_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SIDE-02'
    }
  ]
};

// 22. Steps and Stairs
export const STAIRS_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Steps and Stairs',
  deficiencies: [
    {
      id: 'stair_1',
      name: 'Step or stair is not functionally adequate',
      detail: 'Step or stair is not functionally adequate (may not allow for personal traffic from one level to the next).',
      criteria: 'Damaged or deterioration, unintentional dimensional changes that may interrupt a person walking pattern or movement, or unstable material.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'STAIR-01'
    },
    {
      id: 'stair_2',
      name: 'Stringer damaged',
      detail: 'Stringer is damaged (visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiency is observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STAIR-02'
    },
    {
      id: 'stair_3',
      name: 'Tread is missing or damaged',
      detail: 'Tread on a set of stairs is missing, or tread on a set of stairs is loose or unlevel, or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
      criteria: 'Accessory treads are present and verified to be functional.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STAIR-03'
    }
  ]
};

// 23. Structural System
export const STRUCTURAL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Structural System',
  deficiencies: [
    {
      id: 'struct_1',
      name: 'Structural system exhibits signs of serious failure',
      detail: 'Structural system exhibits signs of serious failure and may threaten the resident safety.',
      criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'STRUCT-01'
    }
  ]
};

// 24. Retaining Wall
export const RETAINING_WALL_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'RETAINING WALL',
  deficiencies: [
    {
      id: 'ret_1',
      name: 'Retaining wall is leaning away from the fill side',
      detail: 'Retaining wall is leaning away from the fill side.',
      criteria: 'Wall is leaning.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RET-01'
    },
    {
      id: 'ret_2',
      name: 'Retaining wall is partially or completely collapsed',
      detail: 'The retaining wall is (sloped) partially or completely collapsed.',
      criteria: 'Wall has collapsed.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'RET-02'
    },
    {
      id: 'ret_3',
      name: 'Exterior wall component is not functionally adequate',
      detail: 'Exterior wall component(s) is not functionally adequate (impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      criteria: 'Wall is not functional.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RET-03'
    },
    {
      id: 'ret_4',
      name: 'Exterior wall covering has missing sections of at least 1 square foot',
      detail: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Wall covering is missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RET-04'
    },
    {
      id: 'ret_5',
      name: 'Exterior wall has peeling paint of 10 square feet or more',
      detail: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      criteria: 'Peeling paint present.',
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
      name: 'Chimney or flue piping is blocked, misaligned, or missing',
      detail: 'Chimney or flue piping is blocked, misaligned, or missing (evidence of prior installation, but now not present or is incomplete).',
      criteria: 'The vent is damaged, misaligned, or not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-01'
    },
    {
      id: 'wh_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (visibly defective; impacts functionality), or gas shutoff valve is missing (evidence of prior installation, but is now not present or is incomplete), or gas shutoff valve is not installed (never installed, but should have been).',
      criteria: 'Unable to shutoff gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-02'
    },
    {
      id: 'wh_3',
      name: 'TPRV has active leak or is obstructed',
      detail: 'TPRV has an active leak, or TPRV is obstructed such that the TPRV is unable to be fully actuated, or relief valve discharge piping is damaged (visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-03'
    },
    {
      id: 'wh_4',
      name: 'Relief valve discharge piping terminates improperly',
      detail: 'The relief valve discharge piping is missing (evidence of prior installation, but is now not present or is incomplete), or the relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
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
  itemName: 'General comment:',
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
      name: 'More than 9 SF - Presence of mold-like substance at extremely high levels',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: 'More than 9 SF- Presence of mold-like substance at extremely high levels is observed visually.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '60/n',
      code: 'MOLD-01'
    },
    {
      id: 'mold_2',
      name: '1 to 9 SF - Presence of mold-like substance at high levels',
      detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      criteria: '1 to 9 SF-Presence of mold-like substance at high levels is observed visually.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-02'
    },
    {
      id: 'mold_3',
      name: '4 inches or less - Presence of mold-like substance at moderate level',
      detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      criteria: '4 inches or less-- Presence of mold-like substance at moderate level observed visually.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-03'
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
      name: 'Kitchen appliance is inoperable',
      detail: 'Stove, oven, refrigerator, or other required appliance does not function.',
      criteria: 'Kitchen appliance is inoperable.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'KITCHEN-01'
    },
    {
      id: 'kitchen_2',
      name: 'Kitchen component is damaged or missing',
      detail: 'Cabinet, countertop, or other kitchen component is damaged or missing.',
      criteria: 'Kitchen component is damaged or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-02'
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
export const getDeficienciesForItem = (itemName: string): ItemDeficiencies => {
  const normalizedName = itemName.toLowerCase();
  
  // Exact matches first
  if (normalizedName.includes('address') || normalizedName.includes('signage')) {
    return ADDRESS_SIGNAGE_DEFICIENCIES;
  }
  if (normalizedName.includes('chimney')) {
    return CHIMNEY_DEFICIENCIES;
  }
  if (normalizedName.includes('dryer') || normalizedName.includes('clothes dryer')) {
    return DRYER_VENT_DEFICIENCIES;
  }
  if (normalizedName.includes('door')) {
    return DOOR_DEFICIENCIES;
  }
  if (normalizedName.includes('drain')) {
    return DRAIN_DEFICIENCIES;
  }
  if (normalizedName.includes('egress')) {
    return EGRESS_DEFICIENCIES;
  }
  if (normalizedName.includes('electrical') || normalizedName.includes('outlet') || normalizedName.includes('switch')) {
    return ELECTRICAL_DEFICIENCIES;
  }
  if (normalizedName.includes('fence') || normalizedName.includes('gate')) {
    return FENCE_GATE_DEFICIENCIES;
  }
  if (normalizedName.includes('fire')) {
    return FIRE_SAFETY_DEFICIENCIES;
  }
  if (normalizedName.includes('foundation')) {
    return FOUNDATION_DEFICIENCIES;
  }
  if (normalizedName.includes('hazard')) {
    return HAZARD_DEFICIENCIES;
  }
  if (normalizedName.includes('hvac') || normalizedName.includes('heating') || normalizedName.includes('ventilation') || normalizedName.includes('air conditioning')) {
    return HVAC_DEFICIENCIES;
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
  if (normalizedName.includes('retaining wall')) {
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
    return FLOOR_DEFICIENCIES;
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
  if (normalizedName.includes('cabinet') || normalizedName.includes('storage') || normalizedName.includes('pantry')) {
    return CABINET_STORAGE_DEFICIENCIES;
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
