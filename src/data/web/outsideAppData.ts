// // OUTSIDE NSPIRE Deficiency Mapping - EXACT EXCEL TABLE DATA
// // This file contains all 26 Outside inspection categories with exact wording

// export interface DeficiencyOption {
//   id: string;
//   name: string;
//   detail: string;
//   criteria: string;
//   severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
//   repairBy: string;
//   points: string;
//   code?: string;
// }

// export interface ItemDeficiencies {
//   itemName: string;
//   deficiencies: DeficiencyOption[];
// }

// // ==========================================
// // OUTSIDE CATEGORIES - EXACT NSPIRE TABLE MAPPING
// // ==========================================

// // 1. Address and Signage
// export const ADDRESS_SIGNAGE_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Address and Signage',
//   deficiencies: [
//     {
//       id: 'addr_out_1',
//       name: 'Address or building identification codes are broken, illegible, or not visible.',
//       detail: 'Damaged or vandalized or deteriorated, NOT readable from a reasonable distance.',
//       criteria: 'For example, 20 feet distance.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ADDR-OUT-01'
//     }
//   ]
// };

// // 2. Chimney
// export const CHIMNEY_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Chimney',
//   deficiencies: [
//     {
//       id: 'chim_out_1',
//       name: 'A vertical or near vertical passageway connected to a fireplace or wood-burning appliance.',
//       detail: 'A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete (i.e., evidence of a previously installed component that is now not present) such that it may not safely contain fire and convey smoke and combustion gases to the exterior. OR A visually accessible (i.e., can be reasonably accessed and observed) chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior',
//       criteria: 'A visually accessible, observed chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '49.60/n',
//       code: 'CHIM-OUT-01'
//     },
//     {
//       id: 'chim_out_2',
//       name: 'Chimney exhibits signs of structural failure.',
//       detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
//       criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '49.60/n',
//       code: 'CHIM-OUT-02'
//     }
//   ]
// };

// // 3. Clothes Dryer Exhaust Ventilation
// export const DRYER_VENT_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Clothes Dryer Exhaust Ventilation',
//   deficiencies: [
//     {
//       id: 'dryer_out_1',
//       name: 'Electrical dryer exhaust has restricted airflow.',
//       detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
//       criteria: 'Airflow is restricted.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '49.60/n',
//       code: 'DRYER-OUT-01'
//     },
//     {
//       id: 'dryer_out_2',
//       name: 'Exterior dryer vent cover, cap, or a component therof is missing.',
//       detail: 'Evidence of prior installation, but is now not present or is incomplete.',
//       criteria: 'Airflow component is damaged or incomplete',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '2.00/n',
//       code: 'DRYER-OUT-02'
//     },
//     {
//       id: 'dryer_out_3',
//       name: 'Gas dryer exhaust ventilation system has restricted airflow.',
//       detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
//       criteria: 'Airflow is restricted.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '49.60/n',
//       code: 'DRYER-OUT-03'
//     }
//   ]
// };

// // 4. Door
// export const DOOR_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Door',
//   deficiencies: [
//     // Door - General Standard
//     {
//       id: 'door_out_1',
//       name: 'Door - General Standard',
//       detail: 'An exterior door component is damaged, inoperable, or missing.',
//       criteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DOOR-OUT-01'
//     },
//     // Garage Door
//     {
//       id: 'door_out_2',
//       name: 'Garage Door',
//       detail: 'Garage door does not open, close, or remains closed.',
//       criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DOOR-OUT-02'
//     },
//     {
//       id: 'door_out_3',
//       name: 'Garage door has a hole.',
//       detail: 'Garage door has a hole.',
//       criteria: 'Door will not open and remain open.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DOOR-OUT-03'
//     }
//   ]
// };

// // 5. Drain
// export const DRAIN_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Drain',
//   deficiencies: [
//     // Drain
//     {
//       id: 'drain_out_1',
//       name: 'Drain',
//       detail: 'Drain is fully clogged.',
//       criteria: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DRAIN-OUT-01'
//     },
//     // Site Drainage
//     {
//       id: 'drain_out_2',
//       name: 'Site Drainage',
//       detail: 'Erosion is present.',
//       criteria: 'exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DRAIN-OUT-02'
//     },
//     {
//       id: 'drain_out_3',
//       name: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
//       detail: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
//       criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'DRAIN-OUT-03'
//     },
//     {
//       id: 'drain_out_4',
//       name: 'Water runoff is unable to flow through the site drainage system.',
//       detail: 'Water runoff is unable to flow through the site drainage system.',
//       criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '2.00/n',
//       code: 'DRAIN-OUT-04'
//     }
//   ]
// };

// // 6. Egress
// export const EGRESS_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Egress',
//   deficiencies: [
//     {
//       id: 'egress_out_1',
//       name: 'Obstructed means of egress.',
//       detail: 'The exit access or exit is obstructed.',
//       criteria: '1. Exit discharge path from an exit to public way.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'EGRESS-OUT-01'
//     }
//   ]
// };

// // 7. Electrical
// export const ELECTRICAL_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Electrical',
//   deficiencies: [
//     // Electrical - Conductor, Outlet, and Switch
//     {
//       id: 'elec_out_1',
//       name: 'Electrical - Conductor, Outlet, and Switch',
//       detail: 'Exposed electrical conductor.',
//       criteria: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there\'s an opening or gap larger than 1/2 inch.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'ELEC-OUT-01'
//     },
//     {
//       id: 'elec_out_2',
//       name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
//       detail: 'AFCI outlet or AFCI breaker does not have visible damage, and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//       criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'ELEC-OUT-02'
//     },
//     {
//       id: 'elec_out_3',
//       name: 'Unprotected outlet is present within six feet of a water source, including a water heater or a laundry area when not in use.',
//       detail: 'An unprotected outlet is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) that is located in the same room, and outlet is not GFCI protected.',
//       criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
//       severity: 'Moderate',
//       repairBy: '24 Hrs.',
//       points: '4.5/n',
//       code: 'ELEC-OUT-03'
//     },
//     {
//       id: 'elec_out_4',
//       name: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
//       detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//       criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'ELEC-OUT-04'
//     },
//     // Electrical Service Panel
//     {
//       id: 'elec_out_5',
//       name: 'Electrical Service Panel',
//       detail: 'Electrical service panel is not reasonably accessible.',
//       criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ELEC-OUT-05'
//     },
//     {
//       id: 'elec_out_6',
//       name: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
//       detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
//       criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'ELEC-OUT-06'
//     },
//     {
//       id: 'elec_out_7',
//       name: 'The overcurrent protection device is damaged.',
//       detail: 'The overcurrent protection device is damaged.',
//       criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'ELEC-OUT-07'
//     }
//   ]
// };

// // 8. Fencing/Gate
// export const FENCING_GATE_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Fencing/Gate',
//   deficiencies: [
//     {
//       id: 'fence_out_1',
//       name: 'Fence and Gate',
//       detail: 'Fence components are missing.',
//       criteria: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FENCE-OUT-01'
//     },
//     {
//       id: 'fence_out_2',
//       name: 'Fence demonstrates signs of collapse.',
//       detail: 'Fence demonstrates signs of collapse.',
//       criteria: 'Fence demonstrates signs of collapse.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FENCE-OUT-02'
//     },
//     {
//       id: 'fence_out_3',
//       name: 'The gate does not open, close, catch, or lock.',
//       detail: 'The gate does not open, close, catch, or lock.',
//       criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FENCE-OUT-03'
//     }
//   ]
// };

// // 9. Fire Safety
// export const FIRE_SAFETY_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Fire Safety',
//   deficiencies: [
//     // Exit Sign
//     {
//       id: 'fire_out_1',
//       name: 'Exit Sign',
//       detail: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated',
//       criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not properly illuminated.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-01'
//     },
//     // Fire Escape
//     {
//       id: 'fire_out_2',
//       name: 'Fire Escape',
//       detail: 'Fire escape component is damaged, or missing.',
//       criteria: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-02'
//     },
//     // Fire Extinguisher
//     {
//       id: 'fire_out_3',
//       name: 'Fire Extinguisher',
//       detail: 'A fire extinguisher is damaged or missing.',
//       criteria: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-03'
//     },
//     {
//       id: 'fire_out_4',
//       name: 'The fire extinguisher pressure gauge reads over or undercharged.',
//       detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
//       criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-04'
//     },
//     {
//       id: 'fire_out_5',
//       name: 'The fire extinguisher tag is missing or illegible or expired.',
//       detail: 'The fire extinguisher tag is missing or illegible or expired.',
//       criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-05'
//     },
//     // Flammable and Combustible Item
//     {
//       id: 'fire_out_6',
//       name: 'Flammable and Combustible Item',
//       detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
//       criteria: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-06'
//     },
//     // Sprinkler Assembly
//     {
//       id: 'fire_out_7',
//       name: 'Sprinkler Assembly',
//       detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
//       criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-07'
//     },
//     {
//       id: 'fire_out_8',
//       name: 'Sprinkler head assembly has evidence of corrossion.',
//       detail: 'Sprinkler head assembly has evidence of corrossion.',
//       criteria: 'Sprinkler head assembly has evidence of corrossion.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-08'
//     },
//     {
//       id: 'fire_out_9',
//       name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
//       detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
//       criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-09'
//     },
//     {
//       id: 'fire_out_10',
//       name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
//       detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
//       criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'FIRE-OUT-10'
//     }
//   ]
// };

// // 10. Foundation Standard
// export const FOUNDATION_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Foundation Standard',
//   deficiencies: [
//     {
//       id: 'found_out_1',
//       name: 'Foundation exposed rebar or Foundation is spalling, flaking, or chipping.',
//       detail: 'The structure has exposed rebar.OR The foundation is spalling, flaking, or chipping, and the affected area goes into the foundation at a depth of ¾ inch or greater. Evaluation by a qualified contractor is recommended.',
//       criteria: 'Foundation exhibits a sign of severe failure.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FOUND-OUT-01'
//     },
//     {
//       id: 'found_out_2',
//       name: 'Foundation is cracked.',
//       detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
//       criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FOUND-OUT-02'
//     },
//     {
//       id: 'found_out_3',
//       name: 'Foundation infiltrated by water.',
//       detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.',
//       criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FOUND-OUT-03'
//     },
//     {
//       id: 'found_out_4',
//       name: 'Foundation support post, column, or girder area is damaged.',
//       detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
//       criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'FOUND-OUT-04'
//     }
//   ]
// };

// // 11. Hazard
// export const HAZARD_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Hazard',
//   deficiencies: [
//     // Rat
//     {
//       id: 'haz_out_1',
//       name: 'Rat',
//       detail: 'Evidence of rats',
//       criteria: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'HAZ-OUT-01'
//     },
//     // Litter
//     {
//       id: 'haz_out_2',
//       name: 'Litter',
//       detail: 'Litter is accumulated in an undesignated area',
//       criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '2.00/n',
//       code: 'HAZ-OUT-02'
//     },
//     // Sharp edges
//     {
//       id: 'haz_out_3',
//       name: 'Sharp edges',
//       detail: 'A shrp edge that can result in a cut or puncture hazard is present.',
//       criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'HAZ-OUT-03'
//     },
//     // Trip hazard
//     {
//       id: 'haz_out_4',
//       name: 'Trip hazard',
//       detail: 'Trip hazard on walking surface.',
//       criteria: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'HAZ-OUT-04'
//     }
//   ]
// };

// // 12. HVAC
// export const HVAC_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)',
//   deficiencies: [
//     {
//       id: 'hvac_out_1',
//       name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, damaged or missing',
//       detail: 'Fuel burning heating system or device is present. AND exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. OR Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//       criteria: 'Metal tape is not a substitute for an improperly connected flue vent.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'HVAC-OUT-01'
//     }
//   ]
// };

// // 13. Leak – Gas or Oil
// export const LEAK_GAS_OIL_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Leak – Gas or Oil',
//   deficiencies: [
//     {
//       id: 'leak_gas_out_1',
//       name: 'Natural gas, propane, or oil leak.',
//       detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
//       criteria: 'Natural gas, propane, or oil leak.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'LEAK-GAS-OUT-01'
//     }
//   ]
// };

// // 14. Leak - sewage system
// export const LEAK_SEWAGE_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Leak - sewage system',
//   deficiencies: [
//     {
//       id: 'leak_sew_out_1',
//       name: 'Blocked sewage system.',
//       detail: 'Wastewater is unable to drain resulting in sewer backup.',
//       criteria: 'Blocked sewage system.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'LEAK-SEW-OUT-01'
//     },
//     {
//       id: 'leak_sew_out_2',
//       name: 'Cap to the cleanout or pump cover is detached or missing.',
//       detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//       criteria: 'Cap to the cleanout or pump cover is detached or missing.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'LEAK-SEW-OUT-02'
//     },
//     {
//       id: 'leak_sew_out_3',
//       name: 'Cleanout cap or riser is damaged.',
//       detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visably defective, impacts functionality).',
//       criteria: 'Cleanout cap or riser is damaged.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'LEAK-SEW-OUT-03'
//     },
//     {
//       id: 'leak_sew_out_4',
//       name: 'Leak in sewage system.',
//       detail: 'There is evidence of a sewer line or fitting leaking.',
//       criteria: 'Leak in sewage system.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'LEAK-SEW-OUT-04'
//     }
//   ]
// };

// // 15. Leak - water
// export const LEAK_WATER_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Leak - water',
//   deficiencies: [
//     {
//       id: 'leak_water_out_1',
//       name: 'Fluid is leaking from the sprinkler assembly.',
//       detail: 'Fluid is leaking from the sprinkler assembly.',
//       criteria: 'Fluid is leaking from the sprinkler assembly.',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '2.00/n',
//       code: 'LEAK-WATER-OUT-01'
//     },
//     {
//       id: 'leak_water_out_2',
//       name: 'Plumbing leak',
//       detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
//       criteria: 'Plumbing leak',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '2.00/n',
//       code: 'LEAK-WATER-OUT-02'
//     }
//   ]
// };

// // 16. Lighting
// export const LIGHTING_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Lighting',
//   deficiencies: [
//     // Lighting - Auxiliary
//     {
//       id: 'light_out_1',
//       name: 'Lighting - Auxiliary',
//       detail: 'Auxiliary lighting is damaged, missing or fail to iluminate when tested',
//       criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'LIGHT-OUT-01'
//     },
//     // Lighting - Exterior
//     {
//       id: 'light_out_2',
//       name: 'Lighting - Exterior',
//       detail: 'A permanently installed light fixture is damaged, inoperable, missing or not secure',
//       criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'LIGHT-OUT-02'
//     }
//   ]
// };

// // 17. Parking lots, Driveways, Roads
// export const PARKING_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Parking lots, Driveways, Roads',
//   deficiencies: [
//     // Parking Lot
//     {
//       id: 'park_out_1',
//       name: 'Parking Lot',
//       detail: 'The parking lot has any one pothole greater than 4 inches deep and 1 square foot or more significant.',
//       criteria: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'PARK-OUT-01'
//     },
//     {
//       id: 'park_out_2',
//       name: 'Parking lot has ponding.',
//       detail: 'Parking lot has ponding.',
//       criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'PARK-OUT-02'
//     },
//     // Private Roads and Driveways
//     {
//       id: 'park_out_3',
//       name: 'Private Roads and Drivways',
//       detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
//       criteria: 'Not including temporary obstruction.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'PARK-OUT-03'
//     },
//     {
//       id: 'park_out_4',
//       name: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
//       detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater.',
//       criteria: 'The driveway is not functionally adequate.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'PARK-OUT-04'
//     }
//   ]
// };

// // 18. Paint - Potential Lead-Based Paint Hazards
// export const PAINT_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
//   deficiencies: [
//     {
//       id: 'paint_out_1',
//       name: 'Less than 2 SF - Paint in a Unit or inside the target property is deteriorated, below the level required for lead-safe work practices by a lead-certified firm or for passing clearance.',
//       detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
//       criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'PAINT-OUT-01'
//     },
//     {
//       id: 'paint_out_2',
//       name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
//       detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
//       criteria: 'More than 2 square feet per roomdeteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'PAINT-OUT-02'
//     }
//   ]
// };

// // 19. Railings
// export const RAILINGS_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Railings',
//   deficiencies: [
//     // Guardrail
//     {
//       id: 'rail_out_1',
//       name: 'Guardrail',
//       detail: 'The guardrail is missing or not installed, limiting its safe use.',
//       criteria: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'RAIL-OUT-01'
//     },
//     {
//       id: 'rail_out_2',
//       name: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
//       detail: 'Guardrail component is missing or damaged. Does not limit the safe use. The guardrail is functionally adequate.',
//       criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'RAIL-OUT-02'
//     },
//     // Handrail
//     {
//       id: 'rail_out_3',
//       name: 'Handrail',
//       detail: 'Handrail is missing.',
//       criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RAIL-OUT-03'
//     },
//     {
//       id: 'rail_out_4',
//       name: 'Handrail is not functionally adequate.',
//       detail: 'Handrail is not functionally adequate.',
//       criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RAIL-OUT-04'
//     },
//     {
//       id: 'rail_out_5',
//       name: 'Handrail is not installed where required.',
//       detail: 'Handrail is not installed where required.',
//       criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'RAIL-OUT-05'
//     },
//     {
//       id: 'rail_out_6',
//       name: 'Handrail is not secured.',
//       detail: 'Handrail is not secured.',
//       criteria: 'There is movement in the anchors of the handrail.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RAIL-OUT-06'
//     }
//   ]
// };

// // 20. Roof Assembly
// export const ROOF_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Roof Assembly',
//   deficiencies: [
//     {
//       id: 'roof_out_1',
//       name: 'Gutter component is damaged or missing.',
//       detail: 'Gutter component is damaged (i.e., visibly defective; impacts functionality). OR Gutter component is missing (i.e., evidence of prior installation, but now not present or is incomplete). OR Gutter component is unfixed.',
//       criteria: 'Gutter or downspout missing or damaged components.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-01'
//     },
//     {
//       id: 'roof_out_2',
//       name: 'Restricted flow of water from a roof drain, gutter, or downspout.',
//       detail: 'Debris is limiting the ability of water to drain; water may not be present. Or an area of approximately 25 sq. ft. of ponding water is located above the drain.',
//       criteria: 'The condition is not caused by recent rain.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-02'
//     },
//     {
//       id: 'roof_out_3',
//       name: 'Roof assembly has a hole.',
//       detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
//       criteria: 'Not including the missing vent that had been installed and is now missing.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-03'
//     },
//     {
//       id: 'roof_out_4',
//       name: 'Roof assembly is damaged.',
//       detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
//       criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-04'
//     },
//     {
//       id: 'roof_out_5',
//       name: 'Roof surface has standing water.',
//       detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
//       criteria: 'Condtion is not caused by recent rain.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-05'
//     },
//     {
//       id: 'roof_out_6',
//       name: 'Substrate is exposed.',
//       detail: 'Any amount of substrate is exposed.',
//       criteria: 'Visually observed.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'ROOF-OUT-06'
//     }
//   ]
// };

// // 21. Sidewalk, walkway, and ramp
// export const SIDEWALK_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Sidewalk, walkway, and ramp',
//   deficiencies: [
//     {
//       id: 'side_out_1',
//       name: 'Sidewalk, walkway, or ramp is blocked or impassable.',
//       detail: 'Sidewalk, walkway, or ramp is blocked or impassable.',
//       criteria: 'The Sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'SIDE-OUT-01'
//     },
//     {
//       id: 'side_out_2',
//       name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
//       detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
//       criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'SIDE-OUT-02'
//     }
//   ]
// };

// // 22. Step and Stairs
// export const STAIRS_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Step and Stairs',
//   deficiencies: [
//     {
//       id: 'stair_out_1',
//       name: 'Step or stair is not functionally adequate.',
//       detail: 'Step or stair is not functionally adequate (i.e., may not allow for personal traffic from one level to the next).',
//       criteria: 'Damaged or deterioration, unintentional dimensional changes that may interrupt a person\'s walking pattern or movement, or unstable material.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'STAIR-OUT-01'
//     },
//     {
//       id: 'stair_out_2',
//       name: 'Stringer damaged.',
//       detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
//       criteria: 'Stringer is visible and deficiany is observed.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'STAIR-OUT-02'
//     },
//     {
//       id: 'stair_out_3',
//       name: 'Tread is missing or damaged.',
//       detail: 'Tread on a set of stairs is missing Or tread on a set of stairs is loose or unlevel. Or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
//       criteria: 'Accessory treads are present and verified to be functional.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'STAIR-OUT-03'
//     }
//   ]
// };

// // 23. Structural
// export const STRUCTURAL_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Structural',
//   deficiencies: [
//     {
//       id: 'struct_out_1',
//       name: 'Structural system exhibits signs of serious failure.',
//       detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety.',
//       criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'STRUCT-OUT-01'
//     }
//   ]
// };

// // 24. Retaining Wall and Wall - Exterior
// export const RETAINING_WALL_OUTSIDE: ItemDeficiencies = {
//   itemName: 'RETAINING WALL',
//   deficiencies: [
//     // Retaining wall
//     {
//       id: 'ret_out_1',
//       name: 'Retaining wall',
//       detail: 'Retaining wall is leaning away from the fill side.',
//       criteria: 'Retaining wall is leaning away from the fill side.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RET-OUT-01'
//     },
//     {
//       id: 'ret_out_2',
//       name: 'Retaining wall is partially or completely collapsed.',
//       detail: 'Retaining wall is partially or completely collapsed.',
//       criteria: 'The retaining wall is (sloped )partialy or completely collapsed.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RET-OUT-02'
//     },
//     // Wall - Exterior
//     {
//       id: 'ret_out_3',
//       name: 'Wall - Exterior',
//       detail: 'Exterior wall component(s) is not functionally adequate.',
//       criteria: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RET-OUT-03'
//     },
//     {
//       id: 'ret_out_4',
//       name: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
//       detail: 'Exterior wall covering has missing sections of at least 1 square foot per wall.',
//       criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RET-OUT-04'
//     },
//     {
//       id: 'ret_out_5',
//       name: 'Exterior wall has peeling paint of 10 square feet or more',
//       detail: 'Exterior wall has peeling paint of 10 square feet or more',
//       criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'RET-OUT-05'
//     }
//   ]
// };

// // 25. Water Heater
// export const WATER_HEATER_OUTSIDE: ItemDeficiencies = {
//   itemName: 'Water Heater',
//   deficiencies: [
//     {
//       id: 'wh_out_1',
//       name: 'Chimney or flue piping is blocked, misaligned, or missing.',
//       detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//       criteria: 'The vent is damaged, misaligned, or not connected properly.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'WH-OUT-01'
//     },
//     {
//       id: 'wh_out_2',
//       name: 'Gas shutoff valve is damaged, missing or not installed',
//       detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
//       criteria: 'Uable to shutoff gas in case of an emergency.',
//       severity: 'Life-Threatening',
//       repairBy: '24Hrs',
//       points: '24.8/n',
//       code: 'WH-OUT-02'
//     },
//     {
//       id: 'wh_out_3',
//       name: 'TPRV has an active leak. Or TPRV is obstructed such that the TPRV is unable to be fully actuated. OR Relief valve discharge piping is damaged d (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
//       detail: 'TPRV is obstructed such that the TPRV is unable to be fully actuated. OR, relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), is capped, has an upward slope, or is constructed of unsuitable material.',
//       criteria: 'The TPRV is not connected properly.',
//       severity: 'Severe',
//       repairBy: '24 Hrs.',
//       points: '12.20/n',
//       code: 'WH-OUT-03'
//     },
//     {
//       id: 'wh_out_4',
//       name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
//       detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
//       criteria: 'Not properly installed.',
//       severity: 'Moderate',
//       repairBy: '30 Day',
//       points: '4.5/n',
//       code: 'WH-OUT-04'
//     }
//   ]
// };

// // 26. General Comment
// export const GENERAL_COMMENT_OUTSIDE: ItemDeficiencies = {
//   itemName: 'General Comment',
//   deficiencies: [
//     {
//       id: 'gen_out_1',
//       name: 'General observation or comment',
//       detail: 'General observation or comment about the property condition.',
//       criteria: 'General comment - for informational purposes only.',
//       severity: 'Low',
//       repairBy: '60 Day',
//       points: '0.00/n',
//       code: 'GEN-OUT-01'
//     }
//   ]
// };

// // ==========================================
// // OUTSIDE CATEGORIES LIST - for UI navigation
// // ==========================================
// export const OUTSIDE_CATEGORIES = [
//   { id: 1, name: 'Address and Signage', itemName: 'Address and Signage' },
//   { id: 2, name: 'Chimney', itemName: 'Chimney' },
//   { id: 3, name: 'Clothes Dryer Exhaust Ventilation', itemName: 'Clothes Dryer Exhaust Ventilation' },
//   { id: 4, name: 'Door', itemName: 'Door' },
//   { id: 5, name: 'Drain', itemName: 'Drain' },
//   { id: 6, name: 'Egress', itemName: 'Egress' },
//   { id: 7, name: 'Electrical', itemName: 'Electrical' },
//   { id: 8, name: 'Fencing/Gate', itemName: 'Fencing/Gate' },
//   { id: 9, name: 'Fire Safety', itemName: 'Fire Safety' },
//   { id: 10, name: 'Foundation Standard', itemName: 'Foundation Standard' },
//   { id: 11, name: 'Hazard', itemName: 'Hazard' },
//   { id: 12, name: 'Heating, Ventilation, and Air Conditioning (HVAC)', itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)' },
//   { id: 13, name: 'Leak – Gas or Oil', itemName: 'Leak – Gas or Oil' },
//   { id: 14, name: 'Leak - sewage system', itemName: 'Leak - sewage system' },
//   { id: 15, name: 'Leak - water', itemName: 'Leak - water' },
//   { id: 16, name: 'Lighting', itemName: 'Lighting' },
//   { id: 17, name: 'Parking lots, Driveways, Roads', itemName: 'Parking lots, Driveways, Roads' },
//   { id: 18, name: 'Paint - Potential Lead-Based Paint Hazards', itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
//   { id: 19, name: 'Railings', itemName: 'Railings' },
//   { id: 20, name: 'Roof Assembly', itemName: 'Roof Assembly' },
//   { id: 21, name: 'Sidewalk, walkway, and ramp', itemName: 'Sidewalk, walkway, and ramp' },
//   { id: 22, name: 'Step and Stairs', itemName: 'Step and Stairs' },
//   { id: 23, name: 'Structural', itemName: 'Structural' },
//   { id: 24, name: 'RETAINING WALL', itemName: 'RETAINING WALL' },
//   { id: 25, name: 'Water Heater', itemName: 'Water Heater' },
//   { id: 26, name: 'General Comment', itemName: 'General Comment' },
// ];

// // ==========================================
// // HELPER FUNCTION - Get Outside Deficiencies by Category Name
// // ==========================================
// export function getOutsideDeficienciesByCategory(categoryName: string): ItemDeficiencies | null {
//   const normalizedName = categoryName.toLowerCase().trim();

//   // Address and Signage
//   if (normalizedName.includes('address') || normalizedName.includes('signage')) {
//     return ADDRESS_SIGNAGE_OUTSIDE;
//   }

//   // Chimney - use includes for flexible matching
//   if (normalizedName.includes('chimney')) {
//     return CHIMNEY_OUTSIDE;
//   }

//   // Clothes Dryer Exhaust Ventilation
//   if (normalizedName.includes('dryer') || normalizedName.includes('clothes dryer') || normalizedName.includes('exhaust ventilation')) {
//     return DRYER_VENT_OUTSIDE;
//   }

//   // Door
//   if (normalizedName.includes('door') || normalizedName.includes('garage door')) {
//     return DOOR_OUTSIDE;
//   }

//   // Drain
//   if (normalizedName.includes('drain') || normalizedName.includes('drainage') || normalizedName.includes('site drainage')) {
//     return DRAIN_OUTSIDE;
//   }

//   // Egress
//   if (normalizedName.includes('egress') || normalizedName.includes('obstructed means')) {
//     return EGRESS_OUTSIDE;
//   }

//   // Electrical
//   if (normalizedName.includes('electrical') || normalizedName.includes('conductor') || normalizedName.includes('gfci') || normalizedName.includes('afci') || normalizedName.includes('outlet') || normalizedName.includes('switch')) {
//     return ELECTRICAL_OUTSIDE;
//   }

//   // Fencing/Gate
//   if (normalizedName.includes('fenc') || normalizedName.includes('gate')) {
//     return FENCING_GATE_OUTSIDE;
//   }

//   // Fire Safety
//   if (normalizedName.includes('fire') || normalizedName.includes('exit sign') || normalizedName.includes('extinguisher') || normalizedName.includes('sprinkler')) {
//     return FIRE_SAFETY_OUTSIDE;
//   }

//   // Foundation
//   if (normalizedName.includes('foundation')) {
//     return FOUNDATION_OUTSIDE;
//   }

//   // Hazard
//   if (normalizedName.includes('hazard') || normalizedName.includes('rat') || normalizedName.includes('litter') || normalizedName.includes('sharp') || normalizedName.includes('trip')) {
//     return HAZARD_OUTSIDE;
//   }

//   // HVAC
//   if (normalizedName.includes('hvac') || normalizedName.includes('heating') || normalizedName.includes('ventilation') || normalizedName.includes('air conditioning')) {
//     return HVAC_OUTSIDE;
//   }

//   // Leak - Gas or Oil
//   if ((normalizedName.includes('leak') && (normalizedName.includes('gas') || normalizedName.includes('oil'))) || normalizedName.includes('propane')) {
//     return LEAK_GAS_OIL_OUTSIDE;
//   }

//   // Leak - sewage
//   if (normalizedName.includes('sewage') || normalizedName.includes('sewer')) {
//     return LEAK_SEWAGE_OUTSIDE;
//   }

//   // Leak - water
//   if (normalizedName.includes('leak') && normalizedName.includes('water')) {
//     return LEAK_WATER_OUTSIDE;
//   }

//   // Lighting
//   if (normalizedName.includes('lighting') || normalizedName.includes('light')) {
//     return LIGHTING_OUTSIDE;
//   }

//   // Parking lots, Driveways, Roads
//   if (normalizedName.includes('parking') || normalizedName.includes('driveway') || normalizedName.includes('road')) {
//     return PARKING_OUTSIDE;
//   }

//   // Paint
//   if (normalizedName.includes('paint') || normalizedName.includes('lead')) {
//     return PAINT_OUTSIDE;
//   }

//   // Railings
//   if (normalizedName.includes('railing') || normalizedName.includes('guardrail') || normalizedName.includes('handrail')) {
//     return RAILINGS_OUTSIDE;
//   }

//   // Roof Assembly
//   if (normalizedName.includes('roof') || normalizedName.includes('gutter')) {
//     return ROOF_OUTSIDE;
//   }

//   // Sidewalk, walkway, and ramp
//   if (normalizedName.includes('sidewalk') || normalizedName.includes('walkway') || normalizedName.includes('ramp')) {
//     return SIDEWALK_OUTSIDE;
//   }

//   // Step and Stairs
//   if (normalizedName.includes('step') || normalizedName.includes('stair') || normalizedName.includes('tread') || normalizedName.includes('stringer')) {
//     return STAIRS_OUTSIDE;
//   }

//   // Structural
//   if (normalizedName.includes('structural')) {
//     return STRUCTURAL_OUTSIDE;
//   }

//   // Retaining Wall
//   if (normalizedName.includes('retaining') || normalizedName.includes('wall') && normalizedName.includes('exterior')) {
//     return RETAINING_WALL_OUTSIDE;
//   }

//   // Water Heater
//   if (normalizedName.includes('water heater') || normalizedName.includes('tprv')) {
//     return WATER_HEATER_OUTSIDE;
//   }

//   // General Comment
//   if (normalizedName.includes('general') || normalizedName.includes('comment')) {
//     return GENERAL_COMMENT_OUTSIDE;
//   }

//   return null;
// }

// // ==========================================
// // MAPPING ALL OUTSIDE DEFICIENCIES
// // ==========================================
// export const ALL_OUTSIDE_DEFICIENCIES: Record<string, ItemDeficiencies> = {
//   'Address and Signage': ADDRESS_SIGNAGE_OUTSIDE,
//   'Chimney': CHIMNEY_OUTSIDE,
//   'Clothes Dryer Exhaust Ventilation': DRYER_VENT_OUTSIDE,
//   'Door': DOOR_OUTSIDE,
//   'Drain': DRAIN_OUTSIDE,
//   'Egress': EGRESS_OUTSIDE,
//   'Electrical': ELECTRICAL_OUTSIDE,
//   'Fencing/Gate': FENCING_GATE_OUTSIDE,
//   'Fire Safety': FIRE_SAFETY_OUTSIDE,
//   'Foundation Standard': FOUNDATION_OUTSIDE,
//   'Hazard': HAZARD_OUTSIDE,
//   'Heating, Ventilation, and Air Conditioning (HVAC)': HVAC_OUTSIDE,
//   'Leak – Gas or Oil': LEAK_GAS_OIL_OUTSIDE,
//   'Leak - sewage system': LEAK_SEWAGE_OUTSIDE,
//   'Leak - water': LEAK_WATER_OUTSIDE,
//   'Lighting': LIGHTING_OUTSIDE,
//   'Parking lots, Driveways, Roads': PARKING_OUTSIDE,
//   'Paint - Potential Lead-Based Paint Hazards – Visual Assessment': PAINT_OUTSIDE,
//   'Railings': RAILINGS_OUTSIDE,
//   'Roof Assembly': ROOF_OUTSIDE,
//   'Sidewalk, walkway, and ramp': SIDEWALK_OUTSIDE,
//   'Step and Stairs': STAIRS_OUTSIDE,
//   'Structural': STRUCTURAL_OUTSIDE,
//   'RETAINING WALL': RETAINING_WALL_OUTSIDE,
//   'Water Heater': WATER_HEATER_OUTSIDE,
//   'General Comment': GENERAL_COMMENT_OUTSIDE,
// };

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
  codeReference?: string;
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
      name: 'Address or building identification codes are broken, illegible, or not visible.(20\' distance)',
      detail: 'Damaged or vandalized or deteriorated, NOT readable from a reasonable distance.',
      criteria: 'For example, 20 feet distance.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ADDR-OUT-01',
      codeReference: `🔍 1. Identification & Applicability
• 	IBC [F] 502.1 – Address Identification
• 	Includes: Building number and street name, Unit identifiers (if applicable)
• 	Monument signs, wall-mounted signs, post-mounted signs
• 	This is the exact code section used by fire departments, building officials, and emergency responders.
🧱 2. Structural Integrity
Inspect for physical damage or missing components
🔧 3. Visibility & Legibility
• 	Private Road Access
If the building cannot be seen from a public way:
A monument, pole, or other approved sign must be installed to identify the structure.
• 	Obstruction check: Remove vegetation, debris, or objects blocking signage
• 	Font size: Minimum 4″ high numerals for emergency visibility 
🧼 4. Sanitation & Environmental Safety
• 	Inspect for mold, bird droppings, or pest nests on or around signage
• 	Check for graffiti, fading, or weather damage
🧠 5. Accessibility & Local Requirements
• 	Height & placement: Signage must be mounted at a visible height (typically 4–6 ft AFF)
• 	Lighting: Required if signage is not visible at night
• 	Multilingual or tactile signage: May be required in accessible buildings
• 	IBU Overlay: May require visual contrast, ADA-compliant font, or audible identifiers

`
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
      detail: 'A visually accessible chimney, flue, or firebox connected to a fireplace or wood‑burning appliance is deficient if it is incomplete or visibly damaged in a way that prevents it from safely containing fire or venting smoke and combustion gases to the exterior',
      criteria: 'A visually accessible, observed chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged (i.e., visibly defective; impacts functionality) such that it may not safely contain fire and convey smoke and combustion gases to the exterior.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '49.60/n',
      code: 'CHIM-OUT-01',
      codeReference: `🔍 Step 1: Identify Chimney Type and Applicability
• 	Locate all visually accessible chimneys connected to: 	Fireplaces
• 	Wood-burning appliances
• 	Fuel-burning heating systems (if vented via chimney)
• 	Fireplaces
🧱 Step 2: Assess Structural Integrity
Inspect for signs of damage, instability, or missing components:
IRC §R1003.9 requires chimneys to extend ≥2′ above any part of the building within 10′
🔧 Step 3: Evaluate Functional Adequacy
• 	Flue continuity: Check for visible gaps, misalignment, or obstructions
• 	Smoke path: Ensure the chimney is not blocked or collapsed
• 	Cap integrity: Must prevent rain, debris, and pests from entering
🧼 Step 4: Exterior Structural Stability (IBC 2113.5 & 2113.6)
Chimneys must be:
Anchored to the building at each floor, ceiling, and roof level.
Laterally supported to resist wind loads (IBC Chapter 16).
Free of cracks, bulges, or displacement in the exterior masonry.
Properly bonded (header courses or metal ties).
Any visible leaning, separation from the wall, or cracking is a structural deficiency. 
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Inspection access: Chimney must be observable from ground or safe vantage point
• 	Height compliance: Confirm chimney meets IRC and CBC elevation standards
• 	IBU Overlay: May require seismic anchorage, fire-rated clearances, or compliant signage if chimney serves shared amenities

`
    },
    {
      id: 'chim_out_2',
      name: 'Chimney exhibits signs of structural failure.',
      detail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
      criteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '49.60/n',
      code: 'CHIM-OUT-02',
      codeReference: `🔍 Step 1: Identify Chimney Type and Applicability
• 	Locate all visually accessible chimneys connected to: 	Fireplaces
• 	Wood-burning appliances
• 	Fuel-burning heating systems (if vented via chimney)
• 	Fireplaces
🧱 Step 2: Assess Structural Integrity
Inspect for signs of damage, instability, or missing components:
IRC §R1003.9 requires chimneys to extend ≥2′ above any part of the building within 10′
🔧 Step 3: Evaluate Functional Adequacy
• 	Flue continuity: Check for visible gaps, misalignment, or obstructions
• 	Smoke path: Ensure the chimney is not blocked or collapsed
• 	Cap integrity: Must prevent rain, debris, and pests from entering
🧼 Step 4: Exterior Structural Stability (IBC 2113.5 & 2113.6)
Chimneys must be:
Anchored to the building at each floor, ceiling, and roof level.
Laterally supported to resist wind loads (IBC Chapter 16).
Free of cracks, bulges, or displacement in the exterior masonry.
Properly bonded (header courses or metal ties).
Any visible leaning, separation from the wall, or cracking is a structural deficiency. 
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Inspection access: Chimney must be observable from ground or safe vantage point
• 	Height compliance: Confirm chimney meets IRC and CBC elevation standards
• 	IBU Overlay: May require seismic anchorage, fire-rated clearances, or compliant signage if chimney serves shared amenities

`
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
      repairBy: '24 Hrs',
      points: '49.60/n',
      code: 'DRYER-OUT-01',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• 	Find the dryer exhaust termination point on the building’s exterior wall
• 	Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• 	Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated
🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
	IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements
🔧 Step 3: Evaluate Functional Adequacy
• 	Airflow check: Run the dryer and feel for warm air discharge at the vent
• 	Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests around the vent opening
• 	Water intrusion or staining on the wall below the vent
• 	IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Height & reachability: Vent must be accessible for cleaning and inspection
• 	Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• 	IBU Overlay: May require -compliant access paths or signage in shared laundry areas

`
    },
    {
      id: 'dryer_out_2',
      name: 'Exterior dryer vent cover, cap, or a component therof is missing.',
      detail: 'Evidence of prior installation, but is now not present or is incomplete.',
      criteria: 'Airflow component is damaged or incomplete',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'DRYER-OUT-02',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• 	Find the dryer exhaust termination point on the building’s exterior wall
• 	Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• 	Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated
🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
	IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements
🔧 Step 3: Evaluate Functional Adequacy
• 	Airflow check: Run the dryer and feel for warm air discharge at the vent
• 	Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests around the vent opening
• 	Water intrusion or staining on the wall below the vent
• 	IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Height & reachability: Vent must be accessible for cleaning and inspection
• 	Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• 	IBU Overlay: May require -compliant access paths or signage in shared laundry areas

`
    },
    {
      id: 'dryer_out_3',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
      criteria: 'Airflow is restricted.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '49.60/n',
      code: 'DRYER-OUT-03',
      codeReference: `🔍 Step 1: Locate and Identify the Exterior Vent
• 	Find the dryer exhaust termination point on the building’s exterior wall
• 	Confirm it is connected to a mechanical dryer system, not a ductless or condensing unit (which are exempt)
• 	Note whether the vent is wall-mounted, soffit-mounted, or roof-terminated
🧱 Step 2: Assess Structural Integrity
Inspect for damage, missing components, or improper installation:
	IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors and meet termination requirements
🔧 Step 3: Evaluate Functional Adequacy
• 	Airflow check: Run the dryer and feel for warm air discharge at the vent
• 	Lint accumulation: Look for lint buildup around the vent—indicates restricted airflow
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests around the vent opening
• 	Water intrusion or staining on the wall below the vent
• 	IBU Overlay: May require pest-proof vent caps, corrosion-resistant materials, and sealed penetrations
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Height & reachability: Vent must be accessible for cleaning and inspection
• 	Clearance: Must terminate ≥3 ft from any window, door, or air intake (IRC §M1502.3)
• 	IBU Overlay: May require -compliant access paths or signage in shared laundry areas

`
    }
  ]
};

// 4. Door
export const DOOR_OUTSIDE: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    {
      id: 'door_out_1',
      name: 'Door - General Standard',
      detail: 'An exterior door component is damaged, inoperable, or missing in a way that affects its intended function',
      criteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DOOR-OUT-01',
      codeReference: `🚪 Exterior Door – General (Non-Egress) Visual Assessment
IBC Requirements for Exterior Non‑Egress Doors for a Multi‑Unit Building
• 	exterior (General), storage/utility doors can be narrow, short, or have non‑egress hardware. Must function adequately
🔍 Step 1: Identify Applicable Doors
• 	Locate exterior doors that:
• 	Do not serve as egress or  unit entries
• 	Are not fire-rated
• 	Provide access to storage closets, mechanical rooms, laundry enclosures, or utility spaces
🧱 Step 2: Accessibility Requirements (IBC 1105 + ICC A117.1)
Exterior non‑egress doors do NOT require accessibility unless:
Residents must access the room, or
The room is part of an accessible route
If staff‑only, accessibility does not apply.
🔧 Step 3: Evaluate Operability (IBC 1403 & 1503)
All exterior doors, (general doors) —must have:
Weather‑resistant exterior envelope
Sealed thresholds
Corrosion‑resistant hardware
No water intrusion
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest droppings around the door frame and threshold
• 	Water intrusion or staining on adjacent walls or flooring
• 	IBU Overlay: May require sealed thresholds, pest-proof sweeps, and moisture-resistant finishes
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Cross-reference: Note IRC §R311.2, NSPIRE deficiency ID, and IBU overlay
• 	IBU Overlay: May require sealed thresholds, pest-proof sweeps, and moisture-resistant finishes`
    },
    {
      id: 'door_out_2',
      name: 'Garage Door',
      detail: 'The garage door does not open, close, or remain ns closedhe garagee.The door will not open and remain open.',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DOOR-OUT-02',
      codeReference: `🔍 Step 1: Identify Garage Door Type and Applicability
• 	Locate all exterior garage doors used for:
• 	Resident or staff vehicle access
• 	Storage or maintenance enclosures
• 	Confirm door is mechanically operable, not sealed or decorative
• 	Note whether door is manual or automatic, and whether it serves shared or private use
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components: Door panel, Track & rollers, Spring and cables, Frame and mounting, and wind resistance label
IRC requires garage doors to meet wind load and structural performance standards (§R612.13)
🔧 Step 3: Evaluate Operability & Safety
• 	Open/close test: Door must operate smoothly without excessive force
• 	Auto-reverse test (if motorized): Door must reverse when obstructed
• 	Manual override: Confirm emergency release is accessible and functional
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest droppings around the door base and tracks
• 	Water intrusion or staining on adjacent walls or flooring
• 	IBU Overlay: May require sealed thresholds, pest-proof sweeps, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clearance: Door must provide unobstructed access for vehicles and mobility devices
• 	Control height: Wall-mounted openers must be ≤48″ AFF 
• 	Signage: Shared garage areas may require tactile or multilingual signage
• 	IBU Overlay: May require ADA-compliant access paths, visual contrast, or audible alerts
`
    },
    {
      id: 'door_out_3',
      name: 'Garage Door',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Door will not open and remain open.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DOOR-OUT-03',
      codeReference: `🔍 Step 1: Identify Garage Door Type and Applicability
• 	Locate all exterior garage doors used for:
• 	Resident or staff vehicle access
• 	Storage or maintenance enclosures
• 	Confirm door is mechanically operable, not sealed or decorative
• 	Note whether door is manual or automatic, and whether it serves shared or private use
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components: Door panel, Track & rollers, Spring and cables, Frame and mounting, and wind resistance label
IRC requires garage doors to meet wind load and structural performance standards (§R612.13)
🔧 Step 3: Evaluate Operability & Safety
• 	Open/close test: Door must operate smoothly without excessive force
• 	Auto-reverse test (if motorized): Door must reverse when obstructed
• 	Manual override: Confirm emergency release is accessible and functional
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest droppings around the door base and tracks
• 	Water intrusion or staining on adjacent walls or flooring
• 	IBU Overlay: May require sealed thresholds, pest-proof sweeps, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Clearance: Door must provide unobstructed access for vehicles and mobility devices
• 	Control height: Wall-mounted openers must be ≤48″ AFF 
• 	Signage: Shared garage areas may require tactile or multilingual signage
• 	IBU Overlay: May require ADA-compliant access paths, visual contrast, or audible alerts
`
    }
  ]
};

// 5. Drain
export const DRAIN_OUTSIDE: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: [
    {
      id: 'drain_out_1',
      name: 'Drain',
      detail: 'The drain is fully clogged. Standing water is present over the floor drain.',
      criteria: 'Standing water is present over the floor drain, or the floor drain is blocked such that the inspector believes water would be unable to drain.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DRAIN-OUT-01',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• 	Identify all surface and subsurface site drains near:
• 	Building foundations
• 	Walkways, patios, driveways, and parking areas
• 	Retention basins, culverts, French drains, or curbing systems
• 	Confirm drains are intended to redirect water away from structures and pedestrian paths
🧱 Step 2: Site Drainage Requirements (IBC 1804.4)
IBC requires that all exterior areas around a building must:
Drain away from the structure
Maintain a minimum slope of 5% for the first 10 feet
Prevent water accumulation against the building
Prevent erosion, ponding, or flooding
🔧 Step 3: Evaluate Functional Adequacy
• 	Water Aflow test (if safe): Pour water near the drain and observe the flow direction
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
• 	IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways
`
    },
    {
      id: 'drain_out_2',
      name: 'Site Drainage',
      detail: 'Erosion is present. Or exposed the footer, or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
      criteria: 'exposed the footer or, when more than 2 feet from the built environment, is deep enough to potentially undermine supporting soil as determined by the inspector.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DRAIN-OUT-02',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• 	Identify all surface and subsurface site drains near:
• 	Building foundations
• 	Walkways, patios, driveways, and parking areas
• 	Retention basins, culverts, French drains, or curbing systems
• 	Confirm drains are intended to redirect water away from structures and pedestrian paths
🧱 Step 2: Site Drainage Requirements (IBC 1804.4)
IBC requires that all exterior areas around a building must:
Drain away from the structure
Maintain a minimum slope of 5% for the first 10 feet
Prevent water accumulation against the building
Prevent erosion, ponding, or flooding
🔧 Step 3: Evaluate Functional Adequacy
• 	Water Aflow test (if safe): Pour water near the drain and observe the flow direction
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
• 	IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways
`
    },
    {
      id: 'drain_out_3',
      name: 'Site Drainage',
      detail: 'Grate is not secure or does not cover the site\'s drainage systems at the collection point.',
      criteria: 'Grate is not secure or does not cover the site drainage system\'s collection point.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'DRAIN-OUT-03',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• 	Identify all surface and subsurface site drains near:
• 	Building foundations
• 	Walkways, patios, driveways, and parking areas
• 	Retention basins, culverts, French drains, or curbing systems
• 	Confirm drains are intended to redirect water away from structures and pedestrian paths
🧱 Step 2: Site Drainage Requirements (IBC 1804.4)
IBC requires that all exterior areas around a building must:
Drain away from the structure
Maintain a minimum slope of 5% for the first 10 feet
Prevent water accumulation against the building
Prevent erosion, ponding, or flooding
🔧 Step 3: Evaluate Functional Adequacy
• 	Water Aflow test (if safe): Pour water near the drain and observe the flow direction
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
• 	IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways
`
    },
    {
      id: 'drain_out_4',
      name: 'Site Drainage',
      detail: 'Water runoff is unable to flow through the site drainage system.',
      criteria: 'Standing water is present at the entrance of the outflow pipe. OR Drainage is blocked such that the inspector believes water is unable to drain in the event of precipitation.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'DRAIN-OUT-04',
      codeReference: `🔍 Step 1: Locate and Identify Drainage Components
• 	Identify all surface and subsurface site drains near:
• 	Building foundations
• 	Walkways, patios, driveways, and parking areas
• 	Retention basins, culverts, French drains, or curbing systems
• 	Confirm drains are intended to redirect water away from structures and pedestrian paths
🧱 Step 2: Site Drainage Requirements (IBC 1804.4)
IBC requires that all exterior areas around a building must:
Drain away from the structure
Maintain a minimum slope of 5% for the first 10 feet
Prevent water accumulation against the building
Prevent erosion, ponding, or flooding
🔧 Step 3: Evaluate Functional Adequacy
• 	Water Aflow test (if safe): Pour water near the drain and observe the flow direction
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
• 	IBU Overlay: May require compliant slope transitions, tactile warnings, or visual contrast near accessible walkways
`
    }
  ]
};

// Site Drainage – subset of DRAIN_OUTSIDE (drain_out_2, 3, 4) with full codeReference
// Used by getDeficienciesForSubcategory so rich codeReference from this file is served
export const SITE_DRAINAGE_DATA: ItemDeficiencies = {
  itemName: 'Site Drainage',
  deficiencies: DRAIN_OUTSIDE.deficiencies.filter(d =>
    d.id === 'drain_out_2' || d.id === 'drain_out_3' || d.id === 'drain_out_4'
  )
};

// Drain – subset of DRAIN_OUTSIDE (drain_out_1 only)
export const DRAIN_DRAIN_DATA: ItemDeficiencies = {
  itemName: 'Drain',
  deficiencies: DRAIN_OUTSIDE.deficiencies.filter(d => d.id === 'drain_out_1')
};

// 6. Egress
export const EGRESS_OUTSIDE: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_out_1',
      name: 'Obstructed means of egress.',
      detail: 'The exit access or exit is obstructed. Exit discharge path from an exit to a public way.',
      criteria: '1. Exit discharge path from an exit to public way.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'EGRESS-OUT-01',
      codeReference: `🔍 Step 1:  Verify Accessibility & Local Compliance
• 	Slope & surface: Egress paths must be firm, stable, and slip-resistant 
• 	Door hardware: Must be operable without tight grasping or twisting
• 	Visual contrast: Required for stair edges and exit signage
• 	IBU Overlay: May require tactile signage, audible alerts, or extended landings for accessible units
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or obstruction:
Exit doors, Pathways, Stairwells/fire escapes, Handrails/guardrails
🔧 Step 3: Evaluate Operability & Clearance
• 	Door test: Ensure all exterior exit doors open easily without keys or tools
• 	Pathway check: Confirm minimum 36″ clear width for accessible egress routes
• 	Obstruction scan: Look for trash bins, furniture, vegetation, or resident items blocking exits
💡 Step 4: Inspect Lighting & Signage
• 	Exit signs: Must be visible and illuminated at night or in low-light conditions
• 	Emergency lighting: Should activate during a power failure
• 	NSPIRE Deficiency: Missing or nonfunctional signage/lighting = Moderate
🧼 Step 5: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Water pooling or erosion that may impede safe exit
• 	IBU Overlay: May require slip-resistant surfaces, sealed transitions, and pest-proof lighting fixtures
`
    }
  ]
};

// 7. Electrical
export const ELECTRICAL_OUTSIDE: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    {
      id: 'elec_out_1',
      name: 'Electrical - Conductor, Outlet, and Switch',
      detail: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there\'s an opening or gap larger than 1/2 inch.',
      criteria: 'Electrical systems are deficient if conductors lack proper insulation or enclosure—such as exposed wiring, open ports, or missing covers—or if there\'s an opening or gap larger than 1/2 inch.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-01',
      codeReference: `🔍 Step 1:Weatherproof Rating Required (NEC 406.9(B))
All exterior outlets and switches must have:
In-use covers as required
If the outlet is exposed to weather:
Must have a weatherproof “in‑use” cover
Cover must remain weatherproof with a cord plugged in
Missing in‑use covers = automatic code violation.
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
• 	IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors
`
    },
    {
      id: 'elec_out_1b',
      name: 'Electrical - Conductor, Outlet, and Switch',
      detail: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.(i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.(i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-01B',
      codeReference: `🔍 Step 1:Weatherproof Rating Required (NEC 406.9(B))
All exterior outlets and switches must have:
In-use covers as required
If the outlet is exposed to weather:
Must have a weatherproof “in‑use” cover
Cover must remain weatherproof with a cord plugged in
Missing in‑use covers = automatic code violation.
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
• 	IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors
`
    },
    {
      id: 'elec_out_1c',
      name: 'Electrical - Conductor, Outlet, and Switch',
      detail: 'Electrical service panel is not reasonably accessible.(i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      criteria: 'Electrical service panel is not reasonably accessible.(i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-01C',
      codeReference: `🔍 Step 1:Weatherproof Rating Required (NEC 406.9(B))
All exterior outlets and switches must have:
In-use covers as required
If the outlet is exposed to weather:
Must have a weatherproof “in‑use” cover
Cover must remain weatherproof with a cord plugged in
Missing in‑use covers = automatic code violation.
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
• 	IRC (2021) §E3901–E3903 – Electrical outlets, switches, and conductors
`
    },
    {
      id: 'elec_out_2',
      name: 'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered as exposed conductor.',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'ELEC-OUT-02',
      codeReference: `🔍 Step 1: GFCI Protection Required (NEC 210.8(B)(4))
All exterior receptacles must be:
GFCI‑protected
Tamper‑resistant (TR) for residential use
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
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas

`
    },
    {
      id: 'elec_out_3',
      name: 'Unprotected outlet is present within six feet of a water source, including a water heater or a laundry area when not in use.',
      detail: 'An unprotected outlet is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) that is located in the same room, and outlet is not GFCI protected.',
      criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'ELEC-OUT-03',
      codeReference: `🔍 Step 1: GFCI Protection Required (NEC 210.8(B)(4))
All exterior receptacles must be:
GFCI‑protected
Tamper‑resistant (TR) for residential use
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
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas
`
    },
    {
      id: 'elec_out_4',
      name: 'GFCI outlet or GFCI breaker does not have visible damage, and the test or reset button is inoperable.',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'ELEC-OUT-04',
      codeReference: `🔍 Step 1: GFCI Protection Required (NEC 210.8(B)(4))
All exterior receptacles must be:
GFCI‑protected
Tamper‑resistant (TR) for residential use
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
• 	IBU Overlay: May require tactile indicators, visual contrast, or lockable covers in shared-use areas
`
    },
    {
      id: 'elec_out_5',
      name: 'Electrical Service Panel',
      detail: 'Electrical service panel is not reasonably accessible.',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ELEC-OUT-05',
      codeReference: `🔥 1. Service Panel Must Be Listed for Exterior Use (NEC 312.2)
Exterior service equipment must be:
Weatherproof (NEMA 3R or better)
Rain‑tight
Corrosion‑resistant
Approved for wet locations
🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, exposure, or unsafe conditions:
Panel enclosure, Mounting, Locking mechanism and Live conductors
🔧 Step 3: Evaluate Functional Adequacy
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Main disconnect: Must be clearly labeled and accessible
• 	Grounding & bonding: Look for proper ground rod connection and neutral/EGC separation
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Corrosion, mold, or pest activity inside or around panel
• 	Water intrusion or staining on enclosure or adjacent wall
• 	IBU Overlay: May require sealed conduit, pest-proof enclosures, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Working clearance: Minimum 30″ wide × 36″ deep clear space in front of panel (CEC §110.26)
• 	Mounting height: Panel handles must be ≤6′7″ AFF
• 	Labeling: All breakers must be clearly marked for unit or system served
• 	IBU Overlay: May require tactile signage, lockable access, and ADA-compliant reach ranges in shared areas

`
    },
    {
      id: 'elec_out_6',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is contaminated by infestation, paint, or other foreign materials.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion).',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'ELEC-OUT-06',
      codeReference: `🔥 1. Service Panel Must Be Listed for Exterior Use (NEC 312.2)
Exterior service equipment must be:
Weatherproof (NEMA 3R or better)
Rain‑tight
Corrosion‑resistant
Approved for wet locations
🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, exposure, or unsafe conditions:
Panel enclosure, Mounting, Locking mechanism and Live conductors
🔧 Step 3: Evaluate Functional Adequacy
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Main disconnect: Must be clearly labeled and accessible
• 	Grounding & bonding: Look for proper ground rod connection and neutral/EGC separation
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Corrosion, mold, or pest activity inside or around panel
• 	Water intrusion or staining on enclosure or adjacent wall
• 	IBU Overlay: May require sealed conduit, pest-proof enclosures, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Working clearance: Minimum 30″ wide × 36″ deep clear space in front of panel (CEC §110.26)
• 	Mounting height: Panel handles must be ≤6′7″ AFF
• 	Labeling: All breakers must be clearly marked for unit or system served
• 	IBU Overlay: May require tactile signage, lockable access, and ADA-compliant reach ranges in shared areas

`
    },
    {
      id: 'elec_out_7',
      name: 'Electrical Service Panel',
      detail: 'The overcurrent protection device is damaged.',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an overcurrent condition.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'ELEC-OUT-07',
      codeReference: `🔥 1. Service Panel Must Be Listed for Exterior Use (NEC 312.2)
Exterior service equipment must be:
Weatherproof (NEMA 3R or better)
Rain‑tight
Corrosion‑resistant
Approved for wet locations
🧱 Step 2: Assess Structural Integrity
Inspect for physical damage, exposure, or unsafe conditions:
Panel enclosure, Mounting, Locking mechanism and Live conductors
🔧 Step 3: Evaluate Functional Adequacy
• 	Breaker test: Visually confirm breakers are seated and not tripped (do not reset tripped breakers)
• 	Main disconnect: Must be clearly labeled and accessible
• 	Grounding & bonding: Look for proper ground rod connection and neutral/EGC separation
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Corrosion, mold, or pest activity inside or around panel
• 	Water intrusion or staining on enclosure or adjacent wall
• 	IBU Overlay: May require sealed conduit, pest-proof enclosures, and corrosion-resistant hardware
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Working clearance: Minimum 30″ wide × 36″ deep clear space in front of panel (CEC §110.26)
• 	Mounting height: Panel handles must be ≤6′7″ AFF
• 	Labeling: All breakers must be clearly marked for unit or system served
• 	IBU Overlay: May require tactile signage, lockable access, and ADA-compliant reach ranges in shared areas

`
    }
  ]
};

// Electrical Service Panel – subset of ELECTRICAL_OUTSIDE (elec_out_5, 6, 7)
// Used by getDeficienciesForSubcategory so the rich codeReference from this file is served
export const ELECTRICAL_SERVICE_PANEL_DATA: ItemDeficiencies = {
  itemName: 'Electrical Service Panel',
  deficiencies: ELECTRICAL_OUTSIDE.deficiencies.filter(d =>
    d.id === 'elec_out_5' || d.id === 'elec_out_6' || d.id === 'elec_out_7'
  )
};

// 8. Fencing/Gate
export const FENCING_GATE_OUTSIDE: ItemDeficiencies = {
  itemName: 'Fencing/Gate',
  deficiencies: [
    {
      id: 'fence_out_1',
      name: 'Fencing/Gate',
      detail: 'Fence components are missing. such as pickets, posts, or panels—create a hole covering 10% or more of a single section’s area.',
      criteria: 'A fence is deficient if missing components—such as pickets, posts, or panels—create a hole covering 10% or more of a single section\'s area.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FENCE-OUT-01',
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
      id: 'fence_out_2',
      name: 'Fencing/Gate',
      detail: 'Fence demonstrates signs of collapse.',
      criteria: 'Fence demonstrates signs of collapse.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FENCE-OUT-02',
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
      id: 'fence_out_3',
      name: 'Fencing/Gate',
      detail: 'The gate does not open, close, latch, or lock.',
      criteria: 'Gate will not open. OR Gate will open when locked or latched. OR Gate will not close.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FENCE-OUT-03',
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

// 9. Fire Safety
export const FIRE_SAFETY_OUTSIDE: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    {
      id: 'fire_out_1',
      name: 'Exit Sign',
      detail: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated',
      criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not properly illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-01',
      codeReference: `✅ 1. When Exterior Exit Signs ARE Required (IBC 1013.1)
Exterior exit signs are required only if the exterior area is part of the means of egress and the direction of travel is not obvious.                                                                                                🔍 Step 2: Visual Condition Assessment
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
      id: 'fire_out_2',
      name: 'Fire Escape',
      detail: 'Fire escape component is damaged, or missing.',
      criteria: 'Fire escape  component is damaged, or missing',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-02',
      codeReference: `🧭 Step 1:  Exterior Fire Escape & Ladder Inspection Protocol
Applies to: Multifamily buildings >4 stories
Codes Referenced: IRC, IBC/IBU , NSPIRE 
Focus: Life safety, structural integrity, egress functionality
🔍 Step 2:  Structural Component Checklist
Inspect each element for damage, deterioration, or absence:
Stairs/Ladders, Platforms, Guardrails, Handrails, Anchors/Supports
🛠 NSPIRE defines any missing or damaged fire escape component as a life-threatening deficiency 
🧪 Step 3: Fire Escape Location & Access (IBC 1032.2.1)
Fire escapes must:
Be accessible from a door or window
Have an opening minimum 29" × 33."
Does not require climbing over obstructions
Not be located over hazardous areas (trash enclosures, gas meters, etc.)
📏 Step 4: Code Compliance Highlights
IRC / IBC Requirements:
• 	IBC 1009.3: Fire escapes permitted only for existing buildings.
• 	IBC 1011.5.2: Tread depth ≥ 11", riser height ≤ 7".
• 	IBC 1011.11: Handrails required on both sides if >4 risers.
• 	IBC 1015.2: Guardrails ≥ 42" height, openings <4".

🔍 For buildings over 4 stories, IBC/IBU takes precedence over IRC for fire escape design and retrofit standards.

⚒️ Step 5:  Material & Weathering Assessment
• 	Metal: Inspect for rust, flaking paint, metal fatigue.
• 	Wood (if present): Check for rot, splintering, termite damage.
• 	Fasteners: Look for missing bolts, loose welds, or compromised joints.
• 	Counterbalanced or drop ladders: Confirm smooth operation and locking mechanisms.
`
    },
    {
      id: 'fire_out_3',
      name: 'Fire Extinguisher',
      detail: 'A fire extinguisher is damaged or missing. A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing in a way that affects its functionality or intended safety',
      criteria: 'A fire extinguisher is deficient if it is visibly damaged or missing, including cases where prior installation is evident but the unit is no longer present or complete.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-03',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.
🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE’s life-threatening category.
🧪 Step 3: Functional & Compliance Checks
• 	Pressure Gauge Check: Confirm needle is in the green zone
• 	Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• 	Mounting Check: Ensure extinguisher is securely mounted in bracket or cabinet
• 	Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• 	Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.
📏 Step 4: Accessibility Compliance (IBU/ADA)
• 	Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs.; ≤42" if >40 lbs.
• 	Reachability: Must be reachable without tight grasping or bending
• 	Clear Floor Space: Minimum 30"x48" in front of extinguisher
• 	Label Visibility: Operating instructions must be readable
⚒️ Step 5: IBC Signage Requirements (IFC 906.6)
Exterior extinguishers must have:
Visible signage
Mounted above the extinguisher
Visible from 25–50 ft away
Marked with FIRE EXTINGUISHER or approved symbol
• 	IRC R315.2:
• 	Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility
`
    },
    {
      id: 'fire_out_4',
      name: 'Fire Extinguisher',
      detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
      criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-04',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.
🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE’s life-threatening category.
🧪 Step 3: Functional & Compliance Checks
• 	Pressure Gauge Check: Confirm needle is in the green zone
• 	Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• 	Mounting Check: Ensure extinguisher is securely mounted in bracket or cabinet
• 	Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• 	Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.
📏 Step 4: Accessibility Compliance (IBU/ADA)
• 	Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs.; ≤42" if >40 lbs.
• 	Reachability: Must be reachable without tight grasping or bending
• 	Clear Floor Space: Minimum 30"x48" in front of extinguisher
• 	Label Visibility: Operating instructions must be readable
⚒️ Step 5: IBC Signage Requirements (IFC 906.6)
Exterior extinguishers must have:
Visible signage
Mounted above the extinguisher
Visible from 25–50 ft away
Marked with FIRE EXTINGUISHER or approved symbol
• 	IRC R315.2:
• 	Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility
`
    },
    {
      id: 'fire_out_5',
      name: 'Fire Extinguisher',
      detail: 'The fire extinguisher tag is missing or illegible or expired.',
      criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-05',
      codeReference: `🧭 Step 1: Identify Fire Extinguisher Locations
Inspect all property-owned extinguishers.
🔍 Step 2: Visual Condition Assessment
All deficiencies must be corrected within 24 hours under NSPIRE’s life-threatening category.
🧪 Step 3: Functional & Compliance Checks
• 	Pressure Gauge Check: Confirm needle is in the green zone
• 	Inspection Tag Review: Verify tag is present, legible, and dated within the last 12 months
• 	Mounting Check: Ensure extinguisher is securely mounted in bracket or cabinet
• 	Physical Condition Scan: Look for rust, dents, broken hoses, or missing pins
• 	Accessibility Check: Confirm extinguisher is visible, reachable, and not blocked
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.
📏 Step 4: Accessibility Compliance (IBU/ADA)
• 	Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs.; ≤42" if >40 lbs.
• 	Reachability: Must be reachable without tight grasping or bending
• 	Clear Floor Space: Minimum 30"x48" in front of extinguisher
• 	Label Visibility: Operating instructions must be readable
⚒️ Step 5: IBC Signage Requirements (IFC 906.6)
Exterior extinguishers must have:
Visible signage
Mounted above the extinguisher
Visible from 25–50 ft away
Marked with FIRE EXTINGUISHER or approved symbol
• 	IRC R315.2:
• 	Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility
`
    },
    {
      id: 'fire_out_6',
      name: 'Flammable and Combustible Item',
      detail: 'The flammable or combustible material is on or within 3 feet of an ignition source.',
      criteria: 'Flammable or combustible materials are deficient if placed within 3 feet of thermal comfort appliances or fuel-burning water heaters, if improperly stored near ignition sources, or if chemicals are improperly stored in general.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-06',
      codeReference: `🧭 Step 1: Identify Inspectable Locations
Inspect all shared-use areas where flammable or combustible materials may be stored or used.
🔍 Step 2: Visual Condition Assessment
• 	Look for: Paints, solvents, gasoline, propane, kerosene, butane, nail polish remover, charcoal lighter fluid, oxygen tanks, cleaning chemicals
• 	Packaging: Must be original, sealed, and intact
🧪 Step 3: Inspection Technique
• 	Proximity Check: 	Measure or estimate distance between flammable items and ignition sources (must be ≥3 feet)
• 	Container Check: Confirm chemicals are in original, sealed containers and stored safely
• 	Label Review: Look for flammable or combustible warnings on spray cans, solvents, or fuels
• 	Ventilation & Access: Ensure storage areas are ventilated and not obstructing egress or equipment
📏 Step 4:  Accessibility & IBU Local Requirement
• 	Access height: Typically ≤5 feet AFF for unobstructed reach.
• 	Signage: Required in some jurisdictions—check for label or directional arrow.
• 	IBU Local Codes: May require annual servicing logs, seismic bracing, or multilingual signage
⚒️ Step 5: IRC Fire Safety Requirements
• • 	IRC (2021) §R302.1–R302.5 – Fire-resistant construction and ignition separation
• 	IBU overlays – Local fire code, hazardous materials storage, and emergency response protocols`
    },
    {
      id: 'fire_out_7',
      name: 'Sprinkler Assembly',
      detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-07',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed
🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering>75% of head or bulb, and evidence of corrosion on sprinkler components
🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.
📏 Step 4:  Accessibility & Visibility
- Height: Typically mounted ≥80" AFF for visibility and reach
- Labeling: If part of a monitored system, confirm zone ID and panel integration
- IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'fire_out_8',
      name: 'Sprinkler Assembly',
      detail: 'Sprinkler head assembly has evidence of corrossion.',
      criteria: 'Sprinkler head assembly has evidence of corrossion.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-08',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed
🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering>75% of head or bulb, and evidence of corrosion on sprinkler components
🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.
📏 Step 4:  Accessibility & Visibility
- Height: Typically mounted ≥80" AFF for visibility and reach
- Labeling: If part of a monitored system, confirm zone ID and panel integration
- IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'fire_out_9',
      name: 'Sprinkler Assembly',
      detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material that covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-09',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed
🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering>75% of head or bulb, and evidence of corrosion on sprinkler components
🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.
📏 Step 4:  Accessibility & Visibility
- Height: Typically mounted ≥80" AFF for visibility and reach
- Labeling: If part of a monitored system, confirm zone ID and panel integration
- IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
    },
    {
      id: 'fire_out_10',
      name: 'Sprinkler Assembly',
      detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      criteria: 'Sprinkler head assembly is obstructed by item, object, or encasement within 18 inches of the sprinkler head.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'FIRE-OUT-10',
      codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• 	Verify system presence: Sprinkler assemblies are only inspected if installed
🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering>75% of head or bulb, and evidence of corrosion on sprinkler components
🧪 Step 3: Inspection Technique
• 	Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• 	Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• 	Mounting Check: Confirm escutcheon rings are flush and intact
• 	Cover Plate Test: 	Ensure concealed plates are not glued, painted, or sealed
• 	Corrosion Check: 	Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.
📏 Step 4:  Accessibility & Visibility
- Height: Typically mounted ≥80" AFF for visibility and reach
- Labeling: If part of a monitored system, confirm zone ID and panel integration
- IBU Overlay: May require multilingual signage or maintenance records, Sprinkler heads must be visible and not disguised
⚒️ Step 5: IRC Fire Safety Requirements
• 	IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• 	IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• 	IBU overlays – Local fire, seismic, and life-safety code`
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
      detail: 'The structure has exposed rebar.OR The foundation is spalling, flaking, or chipping, and the affected area goes into the foundation at a depth of ¾ inch or greater.',
      criteria: 'Foundation exhibits a sign of severe failure.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FOUND-OUT-01',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions
🧱 Step 2: Protection of Foundation Walls (IBC 1805.3)
Exterior foundation walls must be:
Dampproofed (minimum)
Waterproofed if hydrostatic pressure is present
Protected from:
Soil moisture
Water intrusion
Deterioration
🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3)
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
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges
`
    },
    {
      id: 'found_out_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Evaluation by a qualified contractor is recommended.',
      criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FOUND-OUT-02',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions
🧱 Step 2: Protection of Foundation Walls (IBC 1805.3)
Exterior foundation walls must be:
Dampproofed (minimum)
Waterproofed if hydrostatic pressure is present
Protected from:
Soil moisture
Water intrusion
Deterioration
🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3)
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
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges
`
    },
    {
      id: 'found_out_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation. Evaluation by a qualified contractor is recommended.(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FOUND-OUT-03',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions
🧱 Step 2: Protection of Foundation Walls (IBC 1805.3)
Exterior foundation walls must be:
Dampproofed (minimum)
Waterproofed if hydrostatic pressure is present
Protected from:
Soil moisture
Water intrusion
Deterioration
🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3)
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
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges
`
    },
    {
      id: 'found_out_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'FOUND-OUT-04',
      codeReference: `🔍 Step 1: Identify Foundation Exposure Zones
• 	Locate all visible portions of the foundation adjacent to:
• 	Parking lots, driveways, walkways, and retaining walls
• 	Utility enclosures, trash areas, and mechanical pads
• 	Confirm visibility of:
• 	Footings, stem walls, slab edges, crawl space vents, and grade transitions
🧱 Step 2: Protection of Foundation Walls (IBC 1805.3)
Exterior foundation walls must be:
Dampproofed (minimum)
Waterproofed if hydrostatic pressure is present
Protected from:
Soil moisture
Water intrusion
Deterioration
🔧 Step 3: Evaluate Drainage & Surface Grading
• 	Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3)
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
• 	IBU Overlay: May require tactile warnings or visual contrast near grade changes and exposed edges
`
    }
  ]
};

// 11. Hazard
export const HAZARD_OUTSIDE: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    {
      id: 'haz_out_1',
      name: 'Rat',
      detail: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
      criteria: 'Evidence of rats is found. (i.e., a live or dead rat or droppings, chewed holes).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'HAZ-OUT-01',
      codeReference: `🔍 Step 1: Identify High-Risk Zones
Focus inspection on exterior areas where rats are likely to nest or travel:
• 	Trash enclosures and dumpsters
• 	Utility closets, crawl space vents, and foundation gaps
• 	Dense vegetation, fence lines, and retaining walls
• 	Parking lot perimeters and storm drains
🧱 Step 2: Assess Structural Entry Points
Inspect for physical vulnerabilities that allow rat access:
Foundation gaps, Door sweeps, Wall penetrations, Vent covers
🧼 Step 3: Inspect for Sanitation Hazards
• 	Droppings: Shiny, black, ½–¾″ long; often near trash, walls, or corners
• 	Grease trails: Dark smears along walls or pipes from repeated rat movement
• 	Urine odor: Strong ammonia-like smell in enclosed or shaded areas
• 	Chewed materials: Plastic bags, insulation, cardboard, or food containers
🧠 Step 4: Verify Accessibility & Resident Safety
• 	Pathway clearance: Ensure rat traps or bait stations do not obstruct accessible routesa
• 	Signage: If pest control is active, ensure warning signs are 
• 	IBU Overlay: May require tactile signage, visual contrast, and safe placement of pest control devices near accessible paths
🔧 Step 5: Evaluate Mitigation Measures
• 	Traps & bait stations: Must be professionally placed, secured, and labeled
• 	Trash containment: Lids must close fully; bins must be clean and rodent-proof
• 	Vegetation control: Trim overgrowth and remove debris piles near building edges
• 	NSPIRE Deficiency: Presence of rats or rat droppings = Severe (30-day correction)

`
    },
    {
      id: 'haz_out_2',
      name: 'Litter',
      detail: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage disposal.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'HAZ-OUT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on high-traffic and high-risk exterior areas:
• 	Building perimeters and walkways
• 	Parking lots and drive aisles
• 	Trash enclosures and recycling stations
• 	Landscaping beds, fence lines, and utility pads
• 	Common gathering areas (e.g., benches, mailboxes)
🧱 Step 2: Assess Structural Impact
While litter is primarily a sanitation issue, inspect for signs of structural or environmental degradation:
Drainage grates, Foundation edges, Fence lines, Walkways
🧼 Step 3: Quantify Litter Presence:
• 	IRC §R306.1 – Sanitary drainage and site cleanliness
Use NSPIRE thresholds for citation:
• 	Small items: 10 or more discarded items (e.g., wrappers, cigarette butts, paper) in a 100 ft² area = Low severity
• 	Large items: 1 improperly discarded bulky item (e.g., mattress, appliance, furniture) = Low severity
🧠 Step 4: Evaluate Accessibility & Resident Impact
• 	Pathway clearance: Litter must not obstruct accessible routes or egress paths
• 	Visual contrast: Trash near tactile signage or ADA paths may reduce visibility
• 	IBU Overlay: May require enhanced maintenance protocols in accessible zones and signage for proper disposal

🔧 Step 5: Review Mitigation Measures
• 	Trash bins: Must be present, covered, and not overflowing
• 	Collection schedule: Confirm regular pickup and designated bulk item zones
• 	Resident education: Look for posted disposal instructions or signage


`
    },
    {
      id: 'haz_out_3',
      name: 'Sharp edges',
      detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment',
      criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'HAZ-OUT-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on normal paths of travel and resident-accessible exterior areas:
• 	Walkways, ramps, and stairwells
• 	Parking areas and curbs
• 	Fences, gates, and railing systems
• 	Playground equipment, benches, and utility enclosures
• 	Trash enclosures and mechanical pads
🧱 Step 2: Assess Structural Integrity
Inspect for physical damage or protrusions that pose a cutting hazard:
Metal edges, Broken fixture, Exposed fasteners, Damaged fencing
🔧 Step 3: Evaluate Risk & Accessibility
• 	Touch test: Without applying force, gently assess whether the edge could cut or puncture skin
• 	Height check: Sharp edges within 24″–72″ AFF pose the greatest risk to adults and children
• 	Path proximity: Edges within 36″ of walkways or ramps are considered high-risk
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Blood stains, pest nests, or mold near damaged surfaces
• 	Trash or debris concealing sharp objects
• 	IBU Overlay: May require sealed surfaces, pest-proof enclosures, and immediate removal of hazardous debris
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Accessible routes: Sharp edges must not obstruct or endanger disability-compliant paths
• 	IRC §R301.1 requires exterior components to be safe for occupants and resistant to injury hazards
• 	Play areas & benches: Must meet local safety standards for public use
• 	IBU Overlay: May require tactile warnings, visual contrast, or protective guards in accessible zones
`
    },
    {
      id: 'haz_out_4',
      name: 'Trip hazard',
      detail: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      criteria: 'A walking surface is deficient if it has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more perpendicular to the normal path of travel.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'HAZ-OUT-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on normal paths of travel and resident-accessible exterior areas:
• 	Walkways, ramps, and sidewalks
• 	Parking lot transitions and curb cuts
• 	Entry paths to units, mailboxes, laundry, and trash enclosures
• 	Common areas like patios, benches, and play zones
🧱 Step 2: Assess Surface Conditions
Inspect for physical irregularities that meet NSPIRE thresholds:
Concrete/asphalt, Pavers/tiles, Transitions, Utility covers
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Debris, vegetation, or litter concealing trip hazards
• 	Water pooling or erosion that undermines walking surfaces
• 	IBU Overlay: May require sealed joints, slip-resistant surfaces, and pest-resistant landscaping near walkways
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Slope & surface: Must be firm, stable, and slip-resistant 
• 	Cross-slope: ≤2% for accessible routes
• 	Edge protection: Required at elevated surfaces ≥4″ without guardrails
• 	IBU Overlay: May require tactile warnings, visual contrast
📏 Step 5: Measure and Confirm Deficiency
• 	Use a ruler or measuring tool to confirm:
• 	Vertical displacement ≥¾″
• 	Horizontal separation ≥2″
• 	Document whether the hazard is unintended (not part of engineered design)
• 	Cross-reference: Note IRC §R311.3, NSPIRE Trip Hazard Standard, and IBU overlays`
    }
  ]
};

// 12. Heating, Ventilation, and Air Conditioning (HVAC)
export const HVAC_OUTSIDE: ItemDeficiencies = {
  itemName: 'Heating, Ventilation, and Air Conditioning (HVAC)',
  deficiencies: [
    {
      id: 'hvac_out_1',
      name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, damaged or missing',
      detail: 'A fuel‑burning heating system or device is present, and the exhaust vent is misaligned, blocked, disconnected, improperly routed, damaged, or missing, creating a potential health or safety hazard due to improper venting of combustion gases.',
      criteria: 'Metal tape is not a substitute for an improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
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
🧠 Step 5: Venting & Flue Requirements (IMC 801–804 + NFPA 54)
Exterior fuel‑burning HVAC equipment must have:
Properly sized vent or flue
Listed venting system (Type B, direct‑vent, etc.)
Minimum clearances to openings:
4 ft below, 4 ft horizontally, 1 ft above any door, window, or air intake
Termination above roofline if required
No vent termination under balconies or decks
Improper venting = major life‑safety violation.
`
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
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'LEAK-GAS-OUT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where gas or oil systems are present:
• 	Gas meters and regulators
• 	Fuel piping and appliance connectors
• 	Oil tanks or fuel storage containers
• 	Combustion appliance exhaust vents
• 	Mechanical pads and utility enclosures
🧱 Step 2: Assess Structural Integrity of Fuel System Components
Inspect for physical damage, corrosion, or improper installation:
• 	Gas meters and regulators, • 	Fuel piping and appliance connectors, • 	Oil tanks or fuel storage containers, • 	Combustion appliance exhaust vents, 
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
• 	IBU Overlay: May require ADA-compliant access paths, tactile signage, and safe service access in shared-use zones

📸 Step 6: Document & Report`
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
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'LEAK-SEW-OUT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where sewage infrastructure is exposed or vulnerable:
• 	Sewer cleanouts and lateral connections
• 	Manholes and inspection ports
• 	Drainage lines near parking lots, trash enclosures, and utility pads
• 	Crawl space vents and foundation edges
• 	Retention basins or sump pump discharge zones
🧱 Step 2: Assess Structural Integrity of System Components
Inspect for damage, displacement, or improper installation:
Sewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations
🧼 Step 3: Detect Signs of Active or Residual Leakage
Use visual and sensory cues to identify hazards:
• 	Wet soil or pooling near sewer lines or cleanouts
• 	Toilet paper, sludge, or effluent visible on ground surface
• 	Strong sewage odor in localized areas
• 	Grease or biofilm on walls or pavement near discharge points
• 	Pest activity (flies, rodents) concentrated around suspected leak zones
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Cleanout access: Must be unobstructed and reachable for service
• 	Surface transitions: No trip hazards or obstructions near sewer infrastructure
• 	Signage: If active repair or mitigation is underway, warning signs must be posted
• 	IBU Overlay: May require disability-compliant access paths, sealed penetrations, and pest-resistant enclosures
🔧 Step 5: Evaluate Mitigation Measures
• 	Containment: Check for temporary barriers, sandbags, or spill trays
• 	Repair status: Look for exposed tools, open trenches, or active work zones
• 	Documentation: Confirm presence of work orders or service tags if repairs are in progress
IRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity
`
    },
    {
      id: 'leak_sew_out_2',
      name: 'Cap to the cleanout or pump cover is detached or missing.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'LEAK-SEW-OUT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where sewage infrastructure is exposed or vulnerable:
• 	Sewer cleanouts and lateral connections
• 	Manholes and inspection ports
• 	Drainage lines near parking lots, trash enclosures, and utility pads
• 	Crawl space vents and foundation edges
• 	Retention basins or sump pump discharge zones
🧱 Step 2: Assess Structural Integrity of System Components
Inspect for damage, displacement, or improper installation:
Sewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations
🧼 Step 3: Detect Signs of Active or Residual Leakage
Use visual and sensory cues to identify hazards:
• 	Wet soil or pooling near sewer lines or cleanouts
• 	Toilet paper, sludge, or effluent visible on ground surface
• 	Strong sewage odor in localized areas
• 	Grease or biofilm on walls or pavement near discharge points
• 	Pest activity (flies, rodents) concentrated around suspected leak zones
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Cleanout access: Must be unobstructed and reachable for service
• 	Surface transitions: No trip hazards or obstructions near sewer infrastructure
• 	Signage: If active repair or mitigation is underway, warning signs must be posted
• 	IBU Overlay: May require disability-compliant access paths, sealed penetrations, and pest-resistant enclosures
🔧 Step 5: Evaluate Mitigation Measures
• 	Containment: Check for temporary barriers, sandbags, or spill trays
• 	Repair status: Look for exposed tools, open trenches, or active work zones
• 	Documentation: Confirm presence of work orders or service tags if repairs are in progress
IRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity
`
    },
    {
      id: 'leak_sew_out_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visably defective, impacts functionality).',
      criteria: 'Cleanout cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'LEAK-SEW-OUT-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where sewage infrastructure is exposed or vulnerable:
• 	Sewer cleanouts and lateral connections
• 	Manholes and inspection ports
• 	Drainage lines near parking lots, trash enclosures, and utility pads
• 	Crawl space vents and foundation edges
• 	Retention basins or sump pump discharge zones
🧱 Step 2: Assess Structural Integrity of System Components
Inspect for damage, displacement, or improper installation:
Sewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations
🧼 Step 3: Detect Signs of Active or Residual Leakage
Use visual and sensory cues to identify hazards:
• 	Wet soil or pooling near sewer lines or cleanouts
• 	Toilet paper, sludge, or effluent visible on ground surface
• 	Strong sewage odor in localized areas
• 	Grease or biofilm on walls or pavement near discharge points
• 	Pest activity (flies, rodents) concentrated around suspected leak zones
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Cleanout access: Must be unobstructed and reachable for service
• 	Surface transitions: No trip hazards or obstructions near sewer infrastructure
• 	Signage: If active repair or mitigation is underway, warning signs must be posted
• 	IBU Overlay: May require disability-compliant access paths, sealed penetrations, and pest-resistant enclosures
🔧 Step 5: Evaluate Mitigation Measures
• 	Containment: Check for temporary barriers, sandbags, or spill trays
• 	Repair status: Look for exposed tools, open trenches, or active work zones
• 	Documentation: Confirm presence of work orders or service tags if repairs are in progress
IRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity
`
    },
    {
      id: 'leak_sew_out_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'LEAK-SEW-OUT-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on exterior areas where sewage infrastructure is exposed or vulnerable:
• 	Sewer cleanouts and lateral connections
• 	Manholes and inspection ports
• 	Drainage lines near parking lots, trash enclosures, and utility pads
• 	Crawl space vents and foundation edges
• 	Retention basins or sump pump discharge zones
🧱 Step 2: Assess Structural Integrity of System Components
Inspect for damage, displacement, or improper installation:
Sewer cleanout caps, Pipe joints & fitting, Manhole covers, Foundation penetrations
🧼 Step 3: Detect Signs of Active or Residual Leakage
Use visual and sensory cues to identify hazards:
• 	Wet soil or pooling near sewer lines or cleanouts
• 	Toilet paper, sludge, or effluent visible on ground surface
• 	Strong sewage odor in localized areas
• 	Grease or biofilm on walls or pavement near discharge points
• 	Pest activity (flies, rodents) concentrated around suspected leak zones
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Cleanout access: Must be unobstructed and reachable for service
• 	Surface transitions: No trip hazards or obstructions near sewer infrastructure
• 	Signage: If active repair or mitigation is underway, warning signs must be posted
• 	IBU Overlay: May require disability-compliant access paths, sealed penetrations, and pest-resistant enclosures
🔧 Step 5: Evaluate Mitigation Measures
• 	Containment: Check for temporary barriers, sandbags, or spill trays
• 	Repair status: Look for exposed tools, open trenches, or active work zones
• 	Documentation: Confirm presence of work orders or service tags if repairs are in progress
IRC §P2603.2.1 requires protection of piping from physical damage; §P3005.2 mandates proper slope and joint integrity
`
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
      code: 'LEAK-WATER-OUT-01',
      codeReference: `🔍 Step 1: Identify High-Risk Zones
Focus on exterior areas where water intrusion or plumbing leaks are most likely:
• 	Hose bibs, irrigation lines, and exposed plumbing
• 	Exterior walls, windows, and door thresholds
• 	Roof edges, gutters, and downspouts
• 	Utility enclosures, water heaters, and sprinkler assemblies
• 	Crawl space vents and foundation edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage or deterioration caused by water exposure:
Wall cladding, Foundation, Pipe fitting, Sprinkler assembly
🔧 Step 3: Detect Active or Residual Leaks
Use visual and sensory cues to identify water-related hazards:
• 	Active leaks: Dripping, spraying, or flowing water from any component
• 	Residual signs: Water stains, efflorescence, rust streaks, or algae growth
• 	Odor check: Musty or damp smells near walls or utility enclosures
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Standing water near walkways, foundations, or trash areas
• 	Mold, mildew, or pest activity around leak zones
• 	Slip hazards from wet surfaces or algae buildup
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Accessible routes: Water must not obstruct disability-compliant paths 
• 	Thresholds and ramps: Must remain dry, firm, and slip-resistant
• 	Signage: If leak mitigation is active, warning signs must be posted
• 	IBU Overlay: May require tactile warnings, visual contrast, and safe detours around leak zones
IRC §R703.1 requires exterior walls to resist water penetration and protect structural framing
`
    },
    {
      id: 'leak_water_out_2',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.00/n',
      code: 'LEAK-WATER-OUT-02',
      codeReference: `🔍 Step 1: Identify High-Risk Zones
Focus on exterior areas where water intrusion or plumbing leaks are most likely:
• 	Hose bibs, irrigation lines, and exposed plumbing
• 	Exterior walls, windows, and door thresholds
• 	Roof edges, gutters, and downspouts
• 	Utility enclosures, water heaters, and sprinkler assemblies
• 	Crawl space vents and foundation edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage or deterioration caused by water exposure:
Wall cladding, Foundation, Pipe fitting, Sprinkler assembly
🔧 Step 3: Detect Active or Residual Leaks
Use visual and sensory cues to identify water-related hazards:
• 	Active leaks: Dripping, spraying, or flowing water from any component
• 	Residual signs: Water stains, efflorescence, rust streaks, or algae growth
• 	Odor check: Musty or damp smells near walls or utility enclosures
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Standing water near walkways, foundations, or trash areas
• 	Mold, mildew, or pest activity around leak zones
• 	Slip hazards from wet surfaces or algae buildup
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Accessible routes: Water must not obstruct disability-compliant paths 
• 	Thresholds and ramps: Must remain dry, firm, and slip-resistant
• 	Signage: If leak mitigation is active, warning signs must be posted
• 	IBU Overlay: May require tactile warnings, visual contrast, and safe detours around leak zones
IRC §R703.1 requires exterior walls to resist water penetration and protect structural framing
`
    }
  ]
};

// 16. Lighting
export const LIGHTING_OUTSIDE: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: [
    {
      id: 'light_out_1',
      name: 'Lighting - Auxiliary',
      detail: 'Auxiliary lighting is damaged, missing or fail to iluminate when tested',
      criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'LIGHT-OUT-01',
      codeReference: `🔍 Step 1: Identify Lighting Zones
Inspect all permanently installed lighting fixtures in:
• 	Entryways and exit doors
• 	Walkways, ramps, and stairs
• 	Parking lots and drive aisles
• 	Trash enclosures and mailboxes
• 	Common areas and recreational zones
🧱 Step 2: Assess Structural Integrity of Fixtures
Inspect for physical damage, improper installation, or missing components:
Fixture housing, Mounting hardware, Lens or cover, Wiring/conduit
🔧 Step 3: Test Functionality & Illumination
• 	Power test: Confirm fixture turns on via switch, timer, or sensor
• 	Brightness check: Ensure adequate illumination for safe navigation
• 	Coverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Pest nests, mold, or water intrusion inside fixtures
• 	Debris or vegetation obstructing light output
• 	IBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware
🧠 Step 5: Exterior Egress Lighting Required (IBC 1008.2)
IBC requires illumination for the means of egress, including exterior portions.
Exterior areas requiring lighting:
Exterior exit discharge
Exterior stairs
Exterior ramps
Exterior landings
Exterior exit passageways
Exterior exit balconies
Exterior accessible routes`
    },
    {
      id: 'light_out_2',
      name: 'Lighting - Exterior',
      detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'LIGHT-OUT-02',
      codeReference: `🔍 Step 1: Identify Lighting Zones
Inspect all permanently installed lighting fixtures in:
• 	Entryways and exit doors
• 	Walkways, ramps, and stairs
• 	Parking lots and drive aisles
• 	Trash enclosures and mailboxes
• 	Common areas and recreational zones
🧱 Step 2: Assess Structural Integrity of Fixtures
Inspect for physical damage, improper installation, or missing components:
Fixture housing, Mounting hardware, Lens or cover, Wiring/conduit
🔧 Step 3: Test Functionality & Illumination
• 	Power test: Confirm fixture turns on via switch, timer, or sensor
• 	Brightness check: Ensure adequate illumination for safe navigation
• 	Coverage: Verify lighting reaches all critical areas (e.g., stairs, ramps, curb cuts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Pest nests, mold, or water intrusion inside fixtures
• 	Debris or vegetation obstructing light output
• 	IBU Overlay: May require sealed housings, pest-resistant materials, and corrosion-proof hardware
🧠 Step 5: Exterior Egress Lighting Required (IBC 1008.2)
IBC requires illumination for the means of egress, including exterior portions.
Exterior areas requiring lighting:
Exterior exit discharge
Exterior stairs
Exterior ramps
Exterior landings
Exterior exit passageways
Exterior exit balconies
Exterior accessible routes`
    }
  ]
};

// 17. Parking lots, Driveways, Roads
export const PARKING_OUTSIDE: ItemDeficiencies = {
  itemName: 'Parking lots, Driveways, Roads',
  deficiencies: [
    {
      id: 'park_out_1',
      name: 'Parking Lot',
      detail: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      criteria: 'A parking lot is deficient if it has a single pothole over 4 inches deep and 1 square foot in size, or multiple potholes that together exceed 4 inches in depth and 144 square inches in area.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'PARK-OUT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all vehicle-accessible and pedestrian-adjacent surfaces:
• 	Parking lots (resident, visitor, accessible spaces)
• 	Driveways (private access lanes, shared approaches)
• 	Private roads (internal circulation routes)
• 	Curbing, gutters, and expansion joints
• 	Utility access covers and drainage grates
🧱 Step 2: Site Grading & Drainage (IBC 1804.4)
Parking lots and driveways must:
Slope away from the building
Maintain 2% minimum slope for paved surfaces
Prevent ponding or water accumulation
Drain to an approved storm drainage system
Not drain toward foundations or egress paths
Standing water = IBC violation.
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Oil stains, litter, or standing water
• 	Mold, algae, or pest activity near drainage zones
• 	Trash overflow or illegal dumping in parking areas
• 	IBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Accessible parking: Must include van-accessible spaces with proper signage and striping 
• 	Pathway transitions: Curb ramps must be flush and slip-resistant
• 	Driveway slope: Must not exceed 1:12 for accessible routes
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage
🔧 Step 5: Evaluate Lighting, Signage & Wayfinding
• 	Lighting: Confirm fixtures are operational and provide adequate coverage
• 	Signage: Verify directional, speed limit, and accessible parking signs are present and legible
• 	Gate access: Ensure automatic or manual gates are functional and safe for pedestrian use
`
    },
    {
      id: 'park_out_2',
      name: 'Parking Lot',
      detail: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      criteria: 'More than 3 inches of water have accumulated in the parking lot, and 5% or more of the area is unusable.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'PARK-OUT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all vehicle-accessible and pedestrian-adjacent surfaces:
• 	Parking lots (resident, visitor, accessible spaces)
• 	Driveways (private access lanes, shared approaches)
• 	Private roads (internal circulation routes)
• 	Curbing, gutters, and expansion joints
• 	Utility access covers and drainage grates
🧱 Step 2: Site Grading & Drainage (IBC 1804.4)
Parking lots and driveways must:
Slope away from the building
Maintain 2% minimum slope for paved surfaces
Prevent ponding or water accumulation
Drain to an approved storm drainage system
Not drain toward foundations or egress paths
Standing water = IBC violation.
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Oil stains, litter, or standing water
• 	Mold, algae, or pest activity near drainage zones
• 	Trash overflow or illegal dumping in parking areas
• 	IBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Accessible parking: Must include van-accessible spaces with proper signage and striping 
• 	Pathway transitions: Curb ramps must be flush and slip-resistant
• 	Driveway slope: Must not exceed 1:12 for accessible routes
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage
🔧 Step 5: Evaluate Lighting, Signage & Wayfinding
• 	Lighting: Confirm fixtures are operational and provide adequate coverage
• 	Signage: Verify directional, speed limit, and accessible parking signs are present and legible
• 	Gate access: Ensure automatic or manual gates are functional and safe for pedestrian use
`
    },
    {
      id: 'park_out_3',
      name: 'Private Roads and Drivways',
      detail: 'Road or driveway access to the property is blocked or impassable for vehicles.',
      criteria: 'Not including temporary obstruction.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'PARK-OUT-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all vehicle-accessible and pedestrian-adjacent surfaces:
• 	Parking lots (resident, visitor, accessible spaces)
• 	Driveways (private access lanes, shared approaches)
• 	Private roads (internal circulation routes)
• 	Curbing, gutters, and expansion joints
• 	Utility access covers and drainage grates
🧱 Step 2: Site Grading & Drainage (IBC 1804.4)
Parking lots and driveways must:
Slope away from the building
Maintain 2% minimum slope for paved surfaces
Prevent ponding or water accumulation
Drain to an approved storm drainage system
Not drain toward foundations or egress paths
Standing water = IBC violation.
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Oil stains, litter, or standing water
• 	Mold, algae, or pest activity near drainage zones
• 	Trash overflow or illegal dumping in parking areas
• 	IBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Accessible parking: Must include van-accessible spaces with proper signage and striping 
• 	Pathway transitions: Curb ramps must be flush and slip-resistant
• 	Driveway slope: Must not exceed 1:12 for accessible routes
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage
🔧 Step 5: Evaluate Lighting, Signage & Wayfinding
• 	Lighting: Confirm fixtures are operational and provide adequate coverage
• 	Signage: Verify directional, speed limit, and accessible parking signs are present and legible
• 	Gate access: Ensure automatic or manual gates are functional and safe for pedestrian use
`
    },
    {
      id: 'park_out_4',
      name: 'Private Roads and Drivways',
      detail: 'Any one pothole is at least 4 inches deep and covers an area of 1 square foot or greater. The driveway is not functionally adequate.',
      criteria: 'The driveway is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'PARK-OUT-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all vehicle-accessible and pedestrian-adjacent surfaces:
• 	Parking lots (resident, visitor, accessible spaces)
• 	Driveways (private access lanes, shared approaches)
• 	Private roads (internal circulation routes)
• 	Curbing, gutters, and expansion joints
• 	Utility access covers and drainage grates
🧱 Step 2: Site Grading & Drainage (IBC 1804.4)
Parking lots and driveways must:
Slope away from the building
Maintain 2% minimum slope for paved surfaces
Prevent ponding or water accumulation
Drain to an approved storm drainage system
Not drain toward foundations or egress paths
Standing water = IBC violation.
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Oil stains, litter, or standing water
• 	Mold, algae, or pest activity near drainage zones
• 	Trash overflow or illegal dumping in parking areas
• 	IBU Overlay: May require sealed surfaces, pest-resistant enclosures, and proper drainage grading
🧠 Step 4: Verify Accessibility & Local Compliance
• 	Accessible parking: Must include van-accessible spaces with proper signage and striping 
• 	Pathway transitions: Curb ramps must be flush and slip-resistant
• 	Driveway slope: Must not exceed 1:12 for accessible routes
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant signage
🔧 Step 5: Evaluate Lighting, Signage & Wayfinding
• 	Lighting: Confirm fixtures are operational and provide adequate coverage
• 	Signage: Verify directional, speed limit, and accessible parking signs are present and legible
• 	Gate access: Ensure automatic or manual gates are functional and safe for pedestrian use
`
    }
  ]
};

// 18. Paint - Potential Lead-Based Paint Hazards – Visual Assessment
export const PAINT_OUTSIDE: ItemDeficiencies = {
  itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  deficiencies: [
    {
      id: 'paint_out_1',
      name: 'Less than 2 SF - Paint in a Unit or inside the target property is deteriorated, below the level required for lead-safe work practices by a lead-certified firm or for passing clearance.',
      detail: 'Paint is deteriorated when it is peeling, chipping, chalking, cracking, or separating from the substrate. In a Unit, the de minimis threshold is ≤2 sq ft per room for large surfaces or ≤10% of any small component.',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'PAINT-OUT-01',
      codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	If paint is peeling, bubbling, or flaking → the finish is no longer compliant with IBC 803.IBC 803.11 – Adhesives & Trim
Decorative materials must meet flame‑spread and smoke‑developed limits.
Peeling paint, damaged finishes, or combustible coverings violate Chapter 8.
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBC Chapter 29
Proper plumbing
Mold caused by plumbing leaks is cited under sanitation failures (Plumbing), not mold
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion
`
    },
    {
      id: 'paint_out_2',
      name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is considered deteriorated when it is peeling, chipping, chalking, cracking, or separating from the substrate. In a Unit, it becomes significant when it exceeds 2 sq ft per room on large surfaces or more than 10% of any small component.',
      criteria: 'More than 2 square feet per roomdeteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'PAINT-OUT-02',
      codeReference: `🧭 Step 1: Identification & Applicability
• 	Applies to: All interior surfaces—walls, ceilings, floors, cabinetry, HVAC registers, closets, and behind appliances
🔍 Step 2: Visual & Area-Based Assessment
• 	If paint is peeling, bubbling, or flaking → the finish is no longer compliant with IBC 803.IBC 803.11 – Adhesives & Trim
Decorative materials must meet flame‑spread and smoke‑developed limits.
Peeling paint, damaged finishes, or combustible coverings violate Chapter 8.
🧪 Step 3: Inspection Technique
• 	Estimate Surface Area: Measure or approximate the total affected area per room
• 	Moisture Source Check: Look for leaks, condensation, or poor ventilation
• 	Resident Confirmation: If possible, ask if the mold-like substance has been cleaned recently or if leaks have occurred
📏 Step 4: Accessibility & Local Requirements
• 	Inspection access: Must be visual and reachable without disassembly
• 	Surface contrast: Mold must be distinguishable from the background color
• 	IBC Chapter 29
Proper plumbing
Mold caused by plumbing leaks is cited under sanitation failures (Plumbing), not mold
⚒️ Step 5: IRC Moisture & Sanitation Requirements
• 	IRC R306 & R322: Units must be free from unsanitary conditions and moisture intrusion
• 	IRC R703.1: Exterior walls must prevent water intrusion
`
    }
  ]
};

// 19. Railings
export const RAILINGS_OUTSIDE: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: [
    {
      id: 'rail_out_1',
      name: 'Guardrail',
      detail: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents. Limiting its safe use',
      criteria: 'A guardrail is deficient if it\'s missing or not installed along a walking surface over 30 inches above the floor or grade in areas accessible to residents',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'RAIL-OUT-01',
      codeReference: `🔍 Step 1: Where Exterior Guardrails Are Required (IBC 1015.2)
A guardrail is required on any open‑sided walking surface located:
More than 30 inches above grade at any point
Including:
Exterior balconies
Exterior corridors/walkways
Exterior stairs (landings)
Exterior ramps
Exterior decks
Exterior roof areas used for access or occupancy
Retaining walls with accessible walking surfaces above                                                                   🧱 Step 2: Assess Structural Integrity
Inspect for missing, damaged, or unstable components:
Guardrail missing, Top/mid rail, Posts & anchors, Balusters/pickets, Height compliance
• 	Cross-reference: Note IRC §R312.1, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Perform Stability & Safety Tests
• 	Push/pull test: Apply moderate force to top rail and posts to check for movement
• 	Gap check: Measure spacing between vertical elements (must be ≤4″)
• 	Height check: Use a tape measure to confirm rail height from the walking surface
• 	NSPIRE Deficiency Examples:
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Rust, mold, or pest nests on or around guardrail components
• 	Water damage or algae on adjacent walking surfaces
• 	IBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes
🧠 Step 5: Exterior Ramp Guard Requirements (IBC 1015 + 1012)
Exterior ramps require guards when:
The drop exceeds 30 inches
Guard height = 42 inches
Handrails are required on both sides if the rise > 6 inches
• 	Handrail integration: If guardrail doubles as handrail, must meet local disability Act
• 	Visual contrast: Guardrails must be distinguishable from surroundings for low-vision users
• 	Edge protection: Required at accessible ramps and elevated paths without curbs
• 	IBU Overlay: May require tactile warnings, ADA-compliant grip surfaces, and extended `
    },
    {
      id: 'rail_out_2',
      name: 'Guardrail',
      detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards. The guardrail is functionally adequate.',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached enough to prevent fall hazards.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'RAIL-OUT-02',
      codeReference: `🔍 Step 1: Where Exterior Guardrails Are Required (IBC 1015.2)
A guardrail is required on any open‑sided walking surface located:
More than 30 inches above grade at any point
Including:
Exterior balconies
Exterior corridors/walkways
Exterior stairs (landings)
Exterior ramps
Exterior decks
Exterior roof areas used for access or occupancy
Retaining walls with accessible walking surfaces above                                                                   🧱 Step 2: Assess Structural Integrity
Inspect for missing, damaged, or unstable components:
Guardrail missing, Top/mid rail, Posts & anchors, Balusters/pickets, Height compliance
• 	Cross-reference: Note IRC §R312.1, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Perform Stability & Safety Tests
• 	Push/pull test: Apply moderate force to top rail and posts to check for movement
• 	Gap check: Measure spacing between vertical elements (must be ≤4″)
• 	Height check: Use a tape measure to confirm rail height from the walking surface
• 	NSPIRE Deficiency Examples:
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Rust, mold, or pest nests on or around guardrail components
• 	Water damage or algae on adjacent walking surfaces
• 	IBU Overlay: May require sealed joints, pest-resistant materials, and corrosion-proof finishes
🧠 Step 5: Exterior Ramp Guard Requirements (IBC 1015 + 1012)
Exterior ramps require guards when:
The drop exceeds 30 inches
Guard height = 42 inches
Handrails are required on both sides if the rise > 6 inches
• 	Handrail integration: If guardrail doubles as handrail, must meet local disability Act
• 	Visual contrast: Guardrails must be distinguishable from surroundings for low-vision users
• 	Edge protection: Required at accessible ramps and elevated paths without curbs
• 	IBU Overlay: May require tactile warnings, ADA-compliant grip surfaces, and extended `
    },
    {
      id: 'rail_out_3',
      name: 'Handrail',
      detail: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RAIL-OUT-03',
      codeReference: `🔍 Step 1: Identify Railing Locations
Inspect all exterior railings that serve:
• 	Stairs, ramps, and elevated walkways
• 	Balconies, porches, and decks
• 	Accessible paths with elevation changes
• 	Retaining walls or drop-offs adjacent to pedestrian routes
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Railing structure, Mounting hardware, Top rail, Vertical supports, Height compliance
• 	Cross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Handrails on Exterior Ramps (IBC 1012)
Exterior ramps require handrails:
On both sides
When the rise exceeds 6 inches
Height: 34–38 inches
Must include a graspable profile
Must include extensions at the top and bottom
🧼 Step 4:Exterior Material & Durability Requirements (IBC 1403 + 1014)
• 	Exterior handrails must be:
Weather‑resistant
Corrosion‑resistant
Properly anchored
Free of:
Rust
Rot
Splinters
Loose fasteners
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Handrail grip: Must be graspable and continuous 
• 	Edge protection: Required at ramps and elevated surfaces without curbs
• 	Visual contrast: Railings must be distinguishable for low-vision users
• 	IBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings

`
    },
    {
      id: 'rail_out_4',
      name: 'Handrail',
      detail: 'Handrail is not functionally adequate. The handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full flight of stairs, or is installed at a height outside the 28-42 inch range.',
      criteria: 'Handrail is not functionally adequate (i.e., it cannot reasonably be grasped by hand to provide stability or support when ascending or descending stairways). OR Handrail is not continuous for the full length of each flight of stairs. OR Handrail is not between 28 inches and 42 inches in height.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RAIL-OUT-04',
      codeReference: `🔍 Step 1: Identify Railing Locations
Inspect all exterior railings that serve:
• 	Stairs, ramps, and elevated walkways
• 	Balconies, porches, and decks
• 	Accessible paths with elevation changes
• 	Retaining walls or drop-offs adjacent to pedestrian routes
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Railing structure, Mounting hardware, Top rail, Vertical supports, Height compliance
• 	Cross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Handrails on Exterior Ramps (IBC 1012)
Exterior ramps require handrails:
On both sides
When the rise exceeds 6 inches
Height: 34–38 inches
Must include a graspable profile
Must include extensions at the top and bottom
🧼 Step 4:Exterior Material & Durability Requirements (IBC 1403 + 1014)
• 	Exterior handrails must be:
Weather‑resistant
Corrosion‑resistant
Properly anchored
Free of:
Rust
Rot
Splinters
Loose fasteners
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Handrail grip: Must be graspable and continuous 
• 	Edge protection: Required at ramps and elevated surfaces without curbs
• 	Visual contrast: Railings must be distinguishable for low-vision users
• 	IBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings

`
    },
    {
      id: 'rail_out_5',
      name: 'Handrail',
      detail: 'Handrail is not installed where required.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'RAIL-OUT-05',
      codeReference: `🔍 Step 1: Identify Railing Locations
Inspect all exterior railings that serve:
• 	Stairs, ramps, and elevated walkways
• 	Balconies, porches, and decks
• 	Accessible paths with elevation changes
• 	Retaining walls or drop-offs adjacent to pedestrian routes
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Railing structure, Mounting hardware, Top rail, Vertical supports, Height compliance
• 	Cross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Handrails on Exterior Ramps (IBC 1012)
Exterior ramps require handrails:
On both sides
When the rise exceeds 6 inches
Height: 34–38 inches
Must include a graspable profile
Must include extensions at the top and bottom
🧼 Step 4:Exterior Material & Durability Requirements (IBC 1403 + 1014)
• 	Exterior handrails must be:
Weather‑resistant
Corrosion‑resistant
Properly anchored
Free of:
Rust
Rot
Splinters
Loose fasteners
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Handrail grip: Must be graspable and continuous 
• 	Edge protection: Required at ramps and elevated surfaces without curbs
• 	Visual contrast: Railings must be distinguishable for low-vision users
• 	IBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings

`
    },
    {
      id: 'rail_out_6',
      name: 'Handrail',
      detail: 'Handrail is not secured. There is movement in the anchors of the handrail.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RAIL-OUT-06',
      codeReference: `🔍 Step 1: Identify Railing Locations
Inspect all exterior railings that serve:
• 	Stairs, ramps, and elevated walkways
• 	Balconies, porches, and decks
• 	Accessible paths with elevation changes
• 	Retaining walls or drop-offs adjacent to pedestrian routes
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Railing structure, Mounting hardware, Top rail, Vertical supports, Height compliance
• 	Cross-reference: Note IRC §R311.7.8, NSPIRE Guardrail Standard, and IBU overlays
🔧 Step 3: Handrails on Exterior Ramps (IBC 1012)
Exterior ramps require handrails:
On both sides
When the rise exceeds 6 inches
Height: 34–38 inches
Must include a graspable profile
Must include extensions at the top and bottom
🧼 Step 4:Exterior Material & Durability Requirements (IBC 1403 + 1014)
• 	Exterior handrails must be:
Weather‑resistant
Corrosion‑resistant
Properly anchored
Free of:
Rust
Rot
Splinters
Loose fasteners
🧠 Step 5: Verify Accessibility & Local Compliance
• 	Handrail grip: Must be graspable and continuous 
• 	Edge protection: Required at ramps and elevated surfaces without curbs
• 	Visual contrast: Railings must be distinguishable for low-vision users
• 	IBU Overlay: May require tactile warnings, disability-compliant grip surfaces, and extended landings

`
    }
  ]
};

// 20. Roof Assembly
export const ROOF_OUTSIDE: ItemDeficiencies = {
  itemName: 'Roof Assembly',
  deficiencies: [
    {
      id: 'roof_out_1',
      name: 'Gutter component is damaged. OR Gutter component is missing or unfixed.',
      detail: 'Gutter component is damaged. OD OR Gutter component is missing or gutter component is unfixed.',
      criteria: 'Gutter or downspout missing or damaged components.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-01',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
    },
    {
      id: 'roof_out_2',
      name: 'Restricted flow of water from a roof drain, gutter, or downspout.',
      detail: 'Debris is limiting the ability of water to drain; water may not be present. Or an area of approximately 25 sq. ft. of ponding water is located above the drain.',
      criteria: 'The condition is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-02',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
    },
    {
      id: 'roof_out_3',
      name: 'Roof assembly has a hole.',
      detail: 'Unintentional holes of any size are found. Or, intentional holes of any size are found and are not covered by vents or screens.',
      criteria: 'Not including the missing vent that had been installed and is now missing.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-03',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
    },
    {
      id: 'roof_out_4',
      name: 'Roof assembly is damaged.',
      detail: 'Roof assembly has damage (i.e., visibly defective; impacts functionality) present that causes one or more components to become unstable.',
      criteria: 'Any part of the roof assembly that is damaged may impact the functionality of other sections of roof.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-04',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
    },
    {
      id: 'roof_out_5',
      name: 'Roof surface has standing water.',
      detail: 'Water ponding in area approximately 25 sq. ft. or greater on a flat roof surface not near drain or scupper.',
      criteria: 'Condtion is not caused by recent rain.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-05',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
    },
    {
      id: 'roof_out_6',
      name: 'Substrate is exposed.',
      detail: 'Any amount of substrate is exposed.',
      criteria: 'Visually observed.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'ROOF-OUT-06',
      codeReference: `🔍 Step 1: Identify Roof Assembly Components
Focus on all visible and accessible roof-related elements:
• 	Roof covering (shingles, membrane, tile, metal)
• 	Flashing, fascia, soffits, and drip edges
• 	Gutters, downspouts, scuppers, and roof drains
• 	Roof-mounted equipment (vents, HVAC units, exhausts)
• 	Parapets, eaves, and structural edges
🧱 Step 2: Assess Structural Integrity
Inspect for damage, deterioration, or missing components:
Roof surface, Drainage system, Flashing & joints, Fascia/soffit, Standing water
• 	IRC – Roof Assemblies (§R901–R908)
🔧 Step 3: Evaluate Functional Performance
• 	Water flow test (if safe): Observe drainage during or after rain
• 	Ventilation check: Confirm roof vents are unobstructed and intact
• 	Seal integrity: Look for gaps around penetrations (e.g., exhaust pipes, HVAC mounts)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on roof edges or under eaves
• 	Debris buildup in gutters or scuppers
• 	Water stains or efflorescence on walls below roofline
• 	IBU Overlay: May require pest-proof flashing, sealed joints, and moisture-resistant finishes
🧠 Step 5:Flashing Required at All Penetrations (IBC 1503.2)
• 	Flashing must be installed at:
Roof edges
Chimneys
Skylights
Vents
HVAC penetrations
Walls and parapets
`
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
      detail: 'The Sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
      criteria: 'The Sidewalk, walkway, or ramp does not provide a clear path for travel due to overgrown vegetation or other obstructions.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'SIDE-OUT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all pedestrian-accessible exterior surfaces:
• 	Sidewalks and paved walkways
• 	Ramps and landings
• 	Curb transitions and flared sides
• 	Paths leading to unit entries, mailboxes, trash enclosures, and parking areas
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or unsafe dimensional changes:
Surface cracks, Heaving/settlement, Loose materials, Ramp slope, Missing guardrails
• 	IRC §R311.7–R311.8 – Stairways, ramps, and walking surfaces
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Trash, debris, or vegetation obstructing the path
• 	Standing water, mold, or algae creating slip hazards
• 	Pest activity near shaded or overgrown areas
• 	IBU Overlay: May require sealed joints, pest-resistant landscaping, and proper drainage grading

🧠 Step 4: Verify Accessibility & Local Compliance
• 	Clear width: Minimum 36″ unobstructed  
• 	Vertical clearance: ≥80″ from walking surface (UFAS standard)
• 	Surface finish: Firm, stable, and slip-resistant 
• 	Edge protection: Required at ramps and elevated walkways without curbs
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant transitions
🔧 Step 5: Exterior Egress Path Requirements (IBC 1003 & 1028)
Exterior sidewalks and walkways that form part of the exit discharge must:
Be continuous and unobstructed
Lead directly to the public way
Have no abrupt level changes
Have slip-resistant surfaces
Be illuminated to 1 foot‑candle minimum`
    },
    {
      id: 'side_out_2',
      name: 'Sidewalk, walkway, or ramp is not functionally adequate.',
      detail: 'Sidewalk, walkway, or ramp is not functionally adequate (i.e., does not provide a defined and safe path of exterior travel for pedestrians).',
      criteria: 'Functionally adequate is described as damage or deterioration to the extent that it disrupts a person\'s ability to walk safely.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'SIDE-OUT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all pedestrian-accessible exterior surfaces:
• 	Sidewalks and paved walkways
• 	Ramps and landings
• 	Curb transitions and flared sides
• 	Paths leading to unit entries, mailboxes, trash enclosures, and parking areas
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or unsafe dimensional changes:
Surface cracks, Heaving/settlement, Loose materials, Ramp slope, Missing guardrails
• 	IRC §R311.7–R311.8 – Stairways, ramps, and walking surfaces
🧼 Step 3: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Trash, debris, or vegetation obstructing the path
• 	Standing water, mold, or algae creating slip hazards
• 	Pest activity near shaded or overgrown areas
• 	IBU Overlay: May require sealed joints, pest-resistant landscaping, and proper drainage grading

🧠 Step 4: Verify Accessibility & Local Compliance
• 	Clear width: Minimum 36″ unobstructed  
• 	Vertical clearance: ≥80″ from walking surface (UFAS standard)
• 	Surface finish: Firm, stable, and slip-resistant 
• 	Edge protection: Required at ramps and elevated walkways without curbs
• 	IBU Overlay: May require tactile warnings, visual contrast, and disability-compliant transitions
🔧 Step 5: Exterior Egress Path Requirements (IBC 1003 & 1028)
Exterior sidewalks and walkways that form part of the exit discharge must:
Be continuous and unobstructed
Lead directly to the public way
Have no abrupt level changes
Have slip-resistant surfaces
Be illuminated to 1 foot‑candle minimum`
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
      detail: 'Step or stair is not functionally adequate, damaged or deteriorated, or has unintentional dimensional changes that may interrupt a person\'s walking pattern or movement, or is unstable.',
      criteria: 'Damaged or deterioration, unintentional dimensional changes that may interrupt a person\'s walking pattern or movement, or unstable material.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'STAIR-OUT-01',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior stairways and steps that:
• 	Serve unit entries, common areas, or accessible paths
• 	Connect walkways, parking lots, patios, or elevated landings
• 	Include stair flights, landings, and transitions to ramps or sidewalks
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Treads & risers, Stringers, Landings, Guardrails, Handrails                                                                 
🔧 Step 3: Evaluate Safety & Functionality
• 	Stability test: Apply moderate pressure to treads, risers, and railings
• 	Height check: Measure riser and tread dimensions for consistency
• 	Handrail check: Confirm graspable profile, continuous length, and proper mounting IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅜″ variation across the flight height       (34–38″ AFF),  IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on or under steps
• 	Trash, debris, or vegetation obstructing stairways
• 	Water pooling or erosion at stair base or landings
• 	IBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes

🧠 Step 5: Riser & Tread Dimensions (IBC 1011.5.2)
Exterior stair geometry must comply with:
Risers
4 inches minimum, 7 inches maximum
Treads
11 inches minimum
Uniformity
Variation between the largest and smallest riser/tread in a flight:≤ 3/8 inch

Uneven risers/treads = major code violation.`
    },
    {
      id: 'stair_out_2',
      name: 'Stringer damaged.',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Stringer is visible and deficiany is observed.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'STAIR-OUT-02',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior stairways and steps that:
• 	Serve unit entries, common areas, or accessible paths
• 	Connect walkways, parking lots, patios, or elevated landings
• 	Include stair flights, landings, and transitions to ramps or sidewalks
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Treads & risers, Stringers, Landings, Guardrails, Handrails                                                                 
🔧 Step 3: Evaluate Safety & Functionality
• 	Stability test: Apply moderate pressure to treads, risers, and railings
• 	Height check: Measure riser and tread dimensions for consistency
• 	Handrail check: Confirm graspable profile, continuous length, and proper mounting IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅜″ variation across the flight height       (34–38″ AFF),  IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on or under steps
• 	Trash, debris, or vegetation obstructing stairways
• 	Water pooling or erosion at stair base or landings
• 	IBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes

🧠 Step 5: Riser & Tread Dimensions (IBC 1011.5.2)
Exterior stair geometry must comply with:
Risers
4 inches minimum, 7 inches maximum
Treads
11 inches minimum
Uniformity
Variation between the largest and smallest riser/tread in a flight:≤ 3/8 inch

Uneven risers/treads = major code violation.`
    },
    {
      id: 'stair_out_3',
      name: 'Tread is missing or damaged.',
      detail: 'Stair tread is deficient if it is missing, loose, unlevel, or has a damaged nosing exceeding 1 inch in depth or 4 inches in width.',
      criteria: 'Accessory treads are present and verified to be functional.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'STAIR-OUT-03',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior stairways and steps that:
• 	Serve unit entries, common areas, or accessible paths
• 	Connect walkways, parking lots, patios, or elevated landings
• 	Include stair flights, landings, and transitions to ramps or sidewalks
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Treads & risers, Stringers, Landings, Guardrails, Handrails                                                                 
🔧 Step 3: Evaluate Safety & Functionality
• 	Stability test: Apply moderate pressure to treads, risers, and railings
• 	Height check: Measure riser and tread dimensions for consistency
• 	Handrail check: Confirm graspable profile, continuous length, and proper mounting IRC §R311.7.5 requires risers ≤7¾″ and treads ≥10″ with ≤⅜″ variation across the flight height       (34–38″ AFF),  IRC requires stairways serving buildings to meet dimensional and safety standards unless exempted for non-habitable areas
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, algae, or pest nests on or under steps
• 	Trash, debris, or vegetation obstructing stairways
• 	Water pooling or erosion at stair base or landings
• 	IBU Overlay: May require sealed surfaces, pest-resistant materials, and slip-resistant finishes

🧠 Step 5: Riser & Tread Dimensions (IBC 1011.5.2)
Exterior stair geometry must comply with:
Risers
4 inches minimum, 7 inches maximum
Treads
11 inches minimum
Uniformity
Variation between the largest and smallest riser/tread in a flight:≤ 3/8 inch

Uneven risers/treads = major code violation.`
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
      detail: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
      criteria: 'Structural elements include the ceiling, chimney, floor, foundation, roof assembly, wall exterior, and wall interior.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'STRUCT-OUT-01',
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
Wall surfaces, Foundation, Columns & beams, Cladding, Structural joints
IRC §R301.1 requires buildings to safely support loads and resist environmental forces
🔧 Step 3: Evaluate Functional Stability
• Plumb check: Use visual reference or level to assess vertical alignment of walls and columns
• Crack mapping: Document location, length, and width of structural cracks
• Load path review: Confirm visible supports are continuous and not compromised
• NSPIRE Deficiency Examples:
• Structural failure or collapse risk = Severe (24-hour correction)
• Missing or damaged cladding = Moderate (30-day correction)
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
• IBU Overlay: May require tactile warnings, disability-compliant transitions, and safe access to structural service zones
IRC §R301.1 requires buildings to safely support loads and resist environmental forces`
    }
  ]
};

// 24. Retaining Wall and Wall - Exterior
export const RETAINING_WALL_OUTSIDE: ItemDeficiencies = {
  itemName: 'RETAINING WALL',
  deficiencies: [
    {
      id: 'ret_out_1',
      name: 'Retaining wall',
      detail: 'Retaining wall is leaning away from the fill side.',
      criteria: 'Retaining wall is leaning away from the fill side.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RET-OUT-01',
      codeReference: `🔍 Step 1: Identify Structural Elements for Inspection
Focus on all exterior-facing structural components:
• 	Load-bearing walls and framing
• 	Foundation walls and footings
• 	Exterior cladding (stucco, siding, masonry)
• 	Structural columns, beams, and supports
• 	Parapets, balconies, and cantilevered elements
• 	Roof-to-wall connections and overhangs
🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Wall surfaces, Foundation, Columns & beams, Cladding, Structural joints
IRC §R301.1 requires buildings to safely support loads and resist environmental forces
🔧 Step 3: Evaluate Functional Stability
• 	Plumb check: Use visual reference or level to assess vertical alignment of walls and columns
• 	Crack mapping: Document location, length, and width of structural cracks
• 	Load path review: Confirm visible supports are continuous and not compromised
• 	NSPIRE Deficiency Examples:
• 	Structural failure or collapse risk = Severe (24-hour correction)
• 	Missing or damaged cladding = Moderate (30-day correction)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests in wall cavities or under cladding
• 	Water stains, efflorescence, or algae indicating moisture intrusion
• 	Trash or vegetation accumulating near structural elements
• 	IBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes
🧠 Step 5: IBC Definition of “Structural System Damage” (Exterior)
IBC defines the structural system as all components that support vertical and lateral loads, including:
Exterior load‑bearing walls
Shear walls
Columns & posts
Beams & headers
Floor/roof framing
Exterior balconies & decks
Exterior stair structures
Foundation & footings
Exterior retaining walls supporting structures
Connections, anchors, fasteners, welds
Damage is any condition that reduces the load‑carrying capacity or stability of these elements.`
    },
    {
      id: 'ret_out_2',
      name: 'Retaining wall',
      detail: 'Retaining wall is partially or completely collapsed.',
      criteria: 'The retaining wall is (sloped )partialy or completely collapsed.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RET-OUT-02',
      codeReference: `🔍 Step 1: Identify Structural Elements for Inspection
Focus on all exterior-facing structural components:
• 	Load-bearing walls and framing
• 	Foundation walls and footings
• 	Exterior cladding (stucco, siding, masonry)
• 	Structural columns, beams, and supports
• 	Parapets, balconies, and cantilevered elements
• 	Roof-to-wall connections and overhangs
🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Wall surfaces, Foundation, Columns & beams, Cladding, Structural joints
IRC §R301.1 requires buildings to safely support loads and resist environmental forces
🔧 Step 3: Evaluate Functional Stability
• 	Plumb check: Use visual reference or level to assess vertical alignment of walls and columns
• 	Crack mapping: Document location, length, and width of structural cracks
• 	Load path review: Confirm visible supports are continuous and not compromised
• 	NSPIRE Deficiency Examples:
• 	Structural failure or collapse risk = Severe (24-hour correction)
• 	Missing or damaged cladding = Moderate (30-day correction)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests in wall cavities or under cladding
• 	Water stains, efflorescence, or algae indicating moisture intrusion
• 	Trash or vegetation accumulating near structural elements
• 	IBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes
🧠 Step 5: IBC Definition of “Structural System Damage” (Exterior)
IBC defines the structural system as all components that support vertical and lateral loads, including:
Exterior load‑bearing walls
Shear walls
Columns & posts
Beams & headers
Floor/roof framing
Exterior balconies & decks
Exterior stair structures
Foundation & footings
Exterior retaining walls supporting structures
Connections, anchors, fasteners, welds
Damage is any condition that reduces the load‑carrying capacity or stability of these elements.`
    },
    {
      id: 'ret_out_3',
      name: 'Wall - Exterior',
      detail: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      criteria: 'Exterior wall component(s) is not functionally adequate (i.e., impacts the integrity of the wall assembly or building envelope, or does not allow exterior wall to separate the accommodation inside from that outside).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RET-OUT-03',
      codeReference: `🔍 Step 1: Identify Structural Elements for Inspection
Focus on all exterior-facing structural components:
• 	Load-bearing walls and framing
• 	Foundation walls and footings
• 	Exterior cladding (stucco, siding, masonry)
• 	Structural columns, beams, and supports
• 	Parapets, balconies, and cantilevered elements
• 	Roof-to-wall connections and overhangs
🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Wall surfaces, Foundation, Columns & beams, Cladding, Structural joints
IRC §R301.1 requires buildings to safely support loads and resist environmental forces
🔧 Step 3: Evaluate Functional Stability
• 	Plumb check: Use visual reference or level to assess vertical alignment of walls and columns
• 	Crack mapping: Document location, length, and width of structural cracks
• 	Load path review: Confirm visible supports are continuous and not compromised
• 	NSPIRE Deficiency Examples:
• 	Structural failure or collapse risk = Severe (24-hour correction)
• 	Missing or damaged cladding = Moderate (30-day correction)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest nests in wall cavities or under cladding
• 	Water stains, efflorescence, or algae indicating moisture intrusion
• 	Trash or vegetation accumulating near structural elements
• 	IBU Overlay: May require sealed penetrations, pest-proof barriers, and moisture-resistant finishes
🧠 Step 5: IBC Definition of “Structural System Damage” (Exterior)
IBC defines the structural system as all components that support vertical and lateral loads, including:
Exterior load‑bearing walls
Shear walls
Columns & posts
Beams & headers
Floor/roof framing
Exterior balconies & decks
Exterior stair structures
Foundation & footings
Exterior retaining walls supporting structures
Connections, anchors, fasteners, welds
Damage is any condition that reduces the load‑carrying capacity or stability of these elements.`
    },
    {
      id: 'ret_out_4',
      name: 'Wall - Exterior',
      detail: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cumulatively, 1 square foot or more of an exterior wall covering is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RET-OUT-04',
      codeReference: `🔍 Step 1: Identify Inspection Zones
Focus on all exterior-facing vertical structures:
• Retaining walls supporting soil or grade transitions
• Exterior walls enclosing habitable spaces
• Freestanding walls adjacent to walkways, parking, or landscaping
• Walls with penetrations (windows, doors, vents, utility lines)

🧱 Step 2: Assess Structural Integrity
Inspect for signs of failure, movement, or deterioration:
Wall surface, Retaining wall, Mortar joints, Wall cladding, Drainage weep holes
IRC §R606.1.1 requires masonry walls to be structurally sound and properly reinforced. Mandates engineered design for retaining walls >4'

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
      id: 'ret_out_5',
      name: 'Wall - Exterior',
      detail: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall',
      criteria: 'Cumulatively, there is 10 square feet or more of peeling paint on an exterior wall built after 1978.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'RET-OUT-05',
      codeReference: `✅ How to Inspect Exterior Wall Damage (IBC + IRC Method)
IBC 2024 (multi‑unit buildings)
IRC 2021 (1–2 family, but many principles apply to exterior wall performance). The IBC/IRC Exterior Wall Inspection Workflow: Check structural stability
Identify structural cracking
Verify weather‑resistant envelope
Confirm fire‑resistance integrity
Check moisture management & drainage
Inspect seismic anchorage & connections
Evaluate material‑specific damage
Document severity & location
When to Require a Licensed Engineer (IBC 116 – Unsafe Structures)
Immediate engineering evaluation is required when:
Wall leans more than 1 inch per 8 feet
Cracks > 1/8 inch with displacement
Spalling exposes rebar
Wall separates from roof/floor framing
Water intrusion affects structural members
Fire‑rated wall is breached
Structural movement is visible
IBC 116 classifies these as unsafe conditions.                                                                                       `
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
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'WH-OUT-01',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location
• 	Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• 	Located in:
• 	Exterior closets or enclosures
• 	Utility alcoves or mechanical pads
• 	Rooftop or ground-mounted service areas
• 	Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection
🔧 Step 3: Evaluate Functional Safety
• 	Leak check: Look for active dripping from fittings, tank seams, or relief valve
• 	T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade (no receptor)
• 	Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity around the enclosure or base
• 	Water stains or corrosion on adjacent walls or slab
• 	Trash or vegetation obstructing access or airflow.
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Temperature & Pressure Relief Valve (T&P) (IRC P2804 / CPC 608.5)
• 	Service access: Minimum 30″ clear working space
• 	Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• 	T&P valve must be:
Installed
Not capped
Not plugged
In good condition
Free of corrosion
Discharge pipe must:
Terminate 6–24 inches above grade(outside) ,( no receptor) within 6" per NSPIRE
Point downward
Be of approved material
Not reduce in size
Not be threaded at the end
Not discharge onto walkways

`
    },
    {
      id: 'wh_out_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'The gas shutoff valve is deficient if it is damaged, missing (with evidence of prior installation), or not installed where required.',
      criteria: 'Uable to shutoff gas in case of an emergency.',
      severity: 'Life-Threatening',
      repairBy: '24 Hrs',
      points: '24.8/n',
      code: 'WH-OUT-02',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location
• 	Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• 	Located in:
• 	Exterior closets or enclosures
• 	Utility alcoves or mechanical pads
• 	Rooftop or ground-mounted service areas
• 	Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection
🔧 Step 3: Evaluate Functional Safety
• 	Leak check: Look for active dripping from fittings, tank seams, or relief valve
• 	T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade (no receptor)
• 	Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity around the enclosure or base
• 	Water stains or corrosion on adjacent walls or slab
• 	Trash or vegetation obstructing access or airflow.
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Temperature & Pressure Relief Valve (T&P) (IRC P2804 / CPC 608.5)
• 	Service access: Minimum 30″ clear working space
• 	Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• 	T&P valve must be:
Installed
Not capped
Not plugged
In good condition
Free of corrosion
Discharge pipe must:
Terminate 6–24 inches above grade(outside) ,( no receptor) within 6" per NSPIRE
Point downward
Be of approved material
Not reduce in size
Not be threaded at the end
Not discharge onto walkways

`
    },
    {
      id: 'wh_out_3',
      name: 'The TPRV is deficient if it has an active leak, is obstructed and cannot fully actuate, or if the relief valve discharge piping is damaged, capped, sloped upward, or made of unsuitable material.',
      detail: 'The temperature and pressure relief valve (TPRV) is deficient if it is obstructed and cannot fully actuate, or if its discharge piping is damaged, capped, sloped upward, or made of unsuitable material.',
      criteria: 'The TPRV is not connected properly.',
      severity: 'Severe',
      repairBy: '24 Hrs',
      points: '12.20/n',
      code: 'WH-OUT-03',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location
• 	Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• 	Located in:
• 	Exterior closets or enclosures
• 	Utility alcoves or mechanical pads
• 	Rooftop or ground-mounted service areas
• 	Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection
🔧 Step 3: Evaluate Functional Safety
• 	Leak check: Look for active dripping from fittings, tank seams, or relief valve
• 	T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade (no receptor)
• 	Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity around the enclosure or base
• 	Water stains or corrosion on adjacent walls or slab
• 	Trash or vegetation obstructing access or airflow.
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Temperature & Pressure Relief Valve (T&P) (IRC P2804 / CPC 608.5)
• 	Service access: Minimum 30″ clear working space
• 	Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• 	T&P valve must be:
Installed
Not capped
Not plugged
In good condition
Free of corrosion
Discharge pipe must:
Terminate 6–24 inches above grade(outside) ,( no receptor) within 6" per NSPIRE
Point downward
Be of approved material
Not reduce in size
Not be threaded at the end
Not discharge onto walkways

`
    },
    {
      id: 'wh_out_4',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'Relief valve discharge piping is deficient if it is missing (with evidence of prior installation) or terminates more than 6 inches or less than 2 inches from the waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 days',
      points: '4.5/n',
      code: 'WH-OUT-04',
      codeReference: `🔍 Step 1: Identify Water Heater Type & Location
• Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• Located in:
• Exterior closets or enclosures
• Utility alcoves or mechanical pads
• Rooftop or ground-mounted service areas
• Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection
🔧 Step 3: Evaluate Functional Safety
• Leak check: Look for active dripping from fittings, tank seams, or relief valve
• T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade
• Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)
🧼 Step 4: Check Sanitation & Environmental Safety
• Inspect for:
• Mold, mildew, or pest activity around enclosure or base
• Water stains or corrosion on adjacent walls or slab
• Trash or vegetation obstructing access or airflow
• IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Verify Accessibility & Local Compliance
• Service access: Minimum 30″ clear working space
• Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• Labeling: Unit must be marked with fuel type, capacity, and emergency shutoff location
• IBU Overlay: May require tactile signage, lockable access doors, and disability-compliant paths to shared-use equipmen🔍 Step 1: Identify Water Heater Type & Location
• 	Confirm unit is a permanently installed water heater (gas, electric, or heat pump)
• 	Located in:
• 	Exterior closets or enclosures
• 	Utility alcoves or mechanical pads
• 	Rooftop or ground-mounted service areas
• 	Verify accessibility for inspection, servicing, and replacement per IRC §P2801.4
🧱 Step 2: Assess Structural Integrity
Inspect for damage, instability, or missing components:
Tank or housing, Mounting base, Pipe connections, T&P relief valve, Expansion tank
IRC §P2801.3 requires installation per manufacturer specs and §P2804 mandates pressure relief protection
🔧 Step 3: Evaluate Functional Safety
• 	Leak check: Look for active dripping from fittings, tank seams, or relief valve
• 	T&P valve test: Confirm discharge pipe is present, directed downward, and terminates within 6″ of grade (no receptor)
• 	Drain pan: Required if leakage could cause damage; must be properly sized and drained (IRC §P2801.6)
🧼 Step 4: Check Sanitation & Environmental Safety
• 	Inspect for:
• 	Mold, mildew, or pest activity around the enclosure or base
• 	Water stains or corrosion on adjacent walls or slab
• 	Trash or vegetation obstructing access or airflow.
• 	IBU Overlay: May require sealed penetrations, pest-proof enclosures, and moisture-resistant finishes

🧠 Step 5: Temperature & Pressure Relief Valve (T&P) (IRC P2804 / CPC 608.5)
• 	Service access: Minimum 30″ clear working space
• 	Height & reach: Controls and shutoffs must be reachable (≤48″ AFF for ADA compliance)
• 	T&P valve must be:
Installed
Not capped
Not plugged
In good condition
Free of corrosion
Discharge pipe must:
Terminate 6–24 inches above grade(outside) ,( no receptor) within 6" per NSPIRE
Point downward
Be of approved material
Not reduce in size
Not be threaded at the end
Not discharge onto walkways

`
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
  { id: 18, name: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment', itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
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