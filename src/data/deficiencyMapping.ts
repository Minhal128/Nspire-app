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
      detail: 'A visually accessible chimney, flue, or firebox is incomplete or damaged such that it may not safely contain fire and convey smoke.',
      criteria: 'A visually accessible, observed chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality).',
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

// 4. Door
export const DOOR_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    {
      id: 'door_1',
      name: 'Entry door cannot be secured.',
      detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Installed locks can not be engaged from both sides.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-01'
    },
    {
      id: 'door_2',
      name: 'Entry door component is damage inoperable or missing.',
      detail: 'Entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
      criteria: 'A hole 1/4 inch or greater in diameter or a split or crack 1/4 inch or greater in width that penetrates through the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-02'
    },
    {
      id: 'door_3',
      name: 'The entry door frame, threshold, or trim is damaged.',
      detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
      criteria: 'Observed evidence of prior installation, now missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-03'
    },
    {
      id: 'door_4',
      name: 'Entry door is missing',
      detail: 'Evidence of prior installation',
      criteria: 'Not present or is incomplete.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-04'
    }
  ]
};

// 4a. Door - Entry
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

// 5. Drain
export const DRAIN_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: [
    {
      id: 'drain_1',
      name: 'Drain is fully clogged.',
      detail: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      criteria: 'Blocked sewage system or standing water.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-01'
    },
    {
      id: 'drain_2',
      name: 'Site Drainage - Erosion',
      detail: 'Erosion is present.',
      criteria: 'Exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DRAIN-02'
    },
    {
      id: 'drain_3',
      name: 'Site Drainage - Grate',
      detail: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-03'
    },
    {
      id: 'drain_4',
      name: 'Site Drainage - Runoff',
      detail: 'Water runoff is unable to flow through the site drainage system.',
      criteria: 'Standing water is present at the entrance of the outflow pipe OR Drainage is blocked.',
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

// 8. Fencing/Gate
export const FENCE_GATE_DEFICIENCIES: ItemDeficiencies = {
  itemName: 'Fencing/Gate',
  deficiencies: [
    {
      id: 'fence_1',
      name: 'Fence components are missing.',
      detail: 'A fence is deficient if missing components create a hole covering 10% or more of a single section\'s area.',
      criteria: 'Hole covering 10% or more of a single section\'s area.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FENCE-01'
    },
    {
      id: 'fence_2',
      name: 'Fence demonstrates signs of collapse.',
      detail: 'Fence demonstrates signs of collapse.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FENCE-02'
    },
    {
      id: 'fence_3',
      name: 'The gate does not open, close, catch, or lock.',
      detail: 'Gate will not open OR Gate will open when locked/latched OR Gate will not close.',
      criteria: 'Gate failure (open/close/lock).',
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
      name: 'Foundation exposed rebar or Foundation is spalling/flaking.',
      detail: 'The structure has exposed rebar OR foundation is spalling/flaking (depth > 3/4 inch).',
      criteria: 'Foundation exhibits a sign of severe failure.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-01'
    },
    {
      id: 'found_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of 1/4 inch or greater and a length of 12 inches or greater.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-02'
    },
    {
      id: 'found_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation.',
      criteria: 'Excessive dampness, collected water, stains, or mineral deposits.',
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

// 12. HVAC
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
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-SEW-01'
    },
    {
      id: 'leak_sew_2',
      name: 'Cap to the cleanout or pump cover is detached or missing.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (evidence of prior installation).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-02'
    },
    {
      id: 'leak_sew_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is damaged (visibly defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-03'
    },
    {
      id: 'leak_sew_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
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
      name: 'Less than 2 SF Deteriorated Paint',
      detail: 'Paint is deteriorated (peeling, chipping, etc). < 2 sq ft per room or < 10% per component.',
      criteria: 'De minimis damage: Less than 2 sq ft per room deteriorated paint.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PAINT-01'
    },
    {
      id: 'paint_2',
      name: 'More than 2 SF Deteriorated Paint',
      detail: 'Paint is deteriorated (peeling, chipping, etc). > 2 sq ft per room or > 10% per component.',
      criteria: 'Significant damage: More than 2 sq ft per room deteriorated paint.',
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
      name: 'Gutters/Downspouts',
      detail: 'Gutter component is damaged, missing, or unfixed.',
      criteria: 'Gutter or downspout missing or damaged components.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-01'
    },
    {
      id: 'roof_2',
      name: 'Restricted flow of water',
      detail: 'Debris is limiting ability of water to drain OR 25 sq ft ponding above drain.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-02'
    },
    {
      id: 'roof_3',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size, or intentional holes not covered by vents/screens.',
      criteria: 'Hole present (not including missing vent).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-03'
    },
    {
      id: 'roof_4',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage causing instability.',
      criteria: 'Damage impacts functionality of roof sections.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ROOF-04'
    },
    {
      id: 'roof_5',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding approx 25 sq ft or greater on flat roof not near drain.',
      criteria: 'Condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ROOF-05'
    },
    {
      id: 'roof_6',
      name: 'Substrate is exposed.',
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
      name: 'Blocked or impassable',
      detail: 'Sidewalk, walkway, or ramp is blocked or impassable.',
      criteria: 'Does not provide clear path due to overgrown vegetation or obstructions.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SIDE-01'
    },
    {
      id: 'side_2',
      name: 'Not functionally adequate',
      detail: 'Does not provide a defined and safe path of exterior travel.',
      criteria: 'Damage or deterioration disrupts ability to walk safely.',
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
      detail: 'May not allow for personal traffic from one level to the next.',
      criteria: 'Damaged, deterioration, unstable material, or unintentional dimensional changes.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'STAIR-01'
    },
    {
      id: 'stair_2',
      name: 'Stringer damaged.',
      detail: 'Stringer is damaged (visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiency is observed.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STAIR-02'
    },
    {
      id: 'stair_3',
      name: 'Tread is missing or damaged.',
      detail: 'Tread missing, loose, unlevel, or nosing damaged >1 inch depth or 4 inches wide.',
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
      criteria: 'Structural elements include ceiling, chimney, floor, foundation, roof, walls.',
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
      detail: 'Chimney or flue piping is blocked, misaligned, or missing.',
      criteria: 'The vent is damaged, misaligned, or not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-01'
    },
    {
      id: 'wh_2',
      name: 'Gas shutoff valve is damaged, missing or not installed.',
      detail: 'Gas shutoff valve is damaged, missing, or not installed.',
      criteria: 'Unable to shutoff gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-02'
    },
    {
      id: 'wh_3',
      name: 'TPRV failure.',
      detail: 'TPRV has active leak, is obstructed, or discharge piping is damaged/capped/sloped upward/unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WH-03'
    },
    {
      id: 'wh_4',
      name: 'Relief valve discharge piping termination.',
      detail: 'Piping terminates >6 inches or <2 inches from waste receptor flood level.',
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
  if (normalizedName.includes('door - general') || normalizedName.includes('door general') || normalizedName.includes('door-general')) {
    return DOOR_GENERAL_DEFICIENCIES;
  }
  if (normalizedName.includes('garage door')) {
    return GARAGE_DOOR_DEFICIENCIES;
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
