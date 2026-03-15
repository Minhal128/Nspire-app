// // Unit Deficiency Mapping - NSPIRE Standards
// // This file contains all deficiency mappings for UNIT inspections only
// // EXACT mapping from NSPIRE Excel data - 35 Categories

// export interface UnitDeficiencyOption {
//     id: string;
//     name: string;
//     detail: string;
//     criteria: string;
//     severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
//     repairBy: string;
//     points: string;DOO
//     code?: string;
// }

// export interface UnitItemDeficiencies {
//     itemName: string;
//     deficiencies: UnitDeficiencyOption[];
// }

// // ==========================================
// // 1. CABINET AND STORAGE (PANTRY, LAUNDRY)
// // ==========================================

// export const CABINET_STORAGE_PANTRY: UnitItemDeficiencies = {
//     itemName: 'Pantry, Food storage space is not present.',
//     deficiencies: [
//         {
//             id: 'cab_storage_1',
//             name: 'Pantry, Food storage space is not present.',
//             detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
//             criteria: 'Stowed items, including food, sanitation, and household supplies.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'CAB-STORAGE-01'
//         }
//     ]
// };

// export const CABINET_STORAGE_DEFICIENCIES = {
//     category: '1. Cabinet and Storage (Pantry, Laundry)',
//     items: [CABINET_STORAGE_PANTRY]
// };

// // ==========================================
// // 2. CALL-FOR-AID SYSTEM
// // ==========================================

// export const CALL_FOR_AID_NOT_FUNCTION: UnitItemDeficiencies = {
//     itemName: 'System does not function properly.',
//     deficiencies: [
//         {
//             id: 'call_aid_1',
//             name: 'System does not function properly.',
//             detail: 'A call-for-Aid system does not emit sound or light or send signal to annunciator.',
//             criteria: 'The annunciator does not indicate the correct corresponding room.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/50xn',
//             code: 'CALL-AID-01'
//         }
//     ]
// };

// export const CALL_FOR_AID_BLOCKED: UnitItemDeficiencies = {
//     itemName: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
//     deficiencies: [
//         {
//             id: 'call_aid_2',
//             name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
//             detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
//             criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
//             severity: 'Severe',
//             repairBy: '24Hrs',
//             points: '13.40/50xn',
//             code: 'CALL-AID-02'
//         }
//     ]
// };

// export const CALL_FOR_AID_DEFICIENCIES = {
//     category: '2. Call-for-Aid System',
//     items: [CALL_FOR_AID_NOT_FUNCTION, CALL_FOR_AID_BLOCKED]
// };

// // ==========================================
// // 3. CARBON MONOXIDE ALARM
// // ==========================================

// export const CO_ALARM_NO_ALARM: UnitItemDeficiencies = {
//     itemName: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
//     deficiencies: [
//         {
//             id: 'co_alarm_1',
//             name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
//             detail: 'Carbon monoxide alarm, inoperable.',
//             criteria: 'With or without a battery, including low-volume.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'CO-ALARM-01'
//         }
//     ]
// };

// export const CO_ALARM_MISSING: UnitItemDeficiencies = {
//     itemName: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
//     deficiencies: [
//         {
//             id: 'co_alarm_2',
//             name: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
//             detail: 'The building contains a fuel-burning appliance or fuel-burning system, carbon monoxide alarm is missing (i.e., evidence of prior installation but is now not present or is incomplete).',
//             criteria: 'Unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'CO-ALARM-02'
//         }
//     ]
// };

// export const CO_ALARM_OBSTRUCTED: UnitItemDeficiencies = {
//     itemName: 'Carbon monoxide alarm is obstructed.',
//     deficiencies: [
//         {
//             id: 'co_alarm_3',
//             name: 'Carbon monoxide alarm is obstructed.',
//             detail: 'Carbon monoxide alarm is obstructed.',
//             criteria: 'The carbon monoxide alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'CO-ALARM-03'
//         }
//     ]
// };

// export const CARBON_MONOXIDE_DEFICIENCIES = {
//     category: '3. Carbon Monoxide Alarm',
//     items: [CO_ALARM_NO_ALARM, CO_ALARM_MISSING, CO_ALARM_OBSTRUCTED]
// };

// // ==========================================
// // 4. CEILING
// // ==========================================

// export const CEILING_NOT_ADEQUATE: UnitItemDeficiencies = {
//     itemName: 'The ceiling component(s) is not functionally adequate.',
//     deficiencies: [
//         {
//             id: 'ceiling_1',
//             name: 'The ceiling component(s) is not functionally adequate.',
//             detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under Structural deficiency.',
//             criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'CEILING-01'
//         }
//     ]
// };

// export const CEILING_HOLE: UnitItemDeficiencies = {
//     itemName: 'Ceiling has a hole.',
//     deficiencies: [
//         {
//             id: 'ceiling_2',
//             name: 'Ceiling has a hole.',
//             detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
//             criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'CEILING-02'
//         }
//     ]
// };

// export const CEILING_UNSTABLE: UnitItemDeficiencies = {
//     itemName: 'The ceiling has an unstable surface (bulging, buckling).',
//     deficiencies: [
//         {
//             id: 'ceiling_3',
//             name: 'The ceiling has an unstable surface (bulging, buckling).',
//             detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
//             criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category deficiency.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'CEILING-03'
//         }
//     ]
// };

// export const CEILING_DEFICIENCIES = {
//     category: '4. Ceiling',
//     items: [CEILING_NOT_ADEQUATE, CEILING_HOLE, CEILING_UNSTABLE]
// };

// // ==========================================
// // 5. CHIMNEY
// // ==========================================

// export const CHIMNEY_UNIT: UnitItemDeficiencies = {
//     itemName: 'Chimney',
//     deficiencies: [
//         {
//             id: 'chimney_1',
//             name: 'Visually accessible and observed.',
//             detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
//             criteria: 'Fireplace or fire burning appliance is not intentionally decommissioned.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'CHIMNEY-01'
//         }
//     ]
// };

// export const CHIMNEY_DEFICIENCIES = {
//     category: '5. Chimney',
//     items: [CHIMNEY_UNIT]
// };

// // ==========================================
// // 6. CLOTHES DRYER EXHAUST VENTILATION
// // ==========================================

// export const DRYER_UNSUITABLE_MATERIAL: UnitItemDeficiencies = {
//     itemName: 'Dryer transition duct is constructed of unsuitable material.',
//     deficiencies: [
//         {
//             id: 'dryer_1',
//             name: 'Dryer transition duct is constructed of unsuitable material.',
//             detail: 'Dryer transition duct is not constructed of metal or an approved material.',
//             criteria: 'Dryer is being used indoor.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DRYER-01'
//         }
//     ]
// };

// export const DRYER_ELECTRIC_RESTRICTED: UnitItemDeficiencies = {
//     itemName: 'Electrical dryer exhaust ventilation has restricted airflow.',
//     deficiencies: [
//         {
//             id: 'dryer_2',
//             name: 'Electrical dryer exhaust ventilation has restricted airflow.',
//             detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
//             criteria: 'Airflow may be restricted.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DRYER-02'
//         }
//     ]
// };

// export const DRYER_ELECTRIC_DETACHED: UnitItemDeficiencies = {
//     itemName: 'Electric dryer transition duct is detached or missing.',
//     deficiencies: [
//         {
//             id: 'dryer_3',
//             name: 'Electric dryer transition duct is detached or missing.',
//             detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
//             criteria: 'Dryer transition duct is not securely attached.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DRYER-03'
//         }
//     ]
// };

// export const DRYER_GAS_RESTRICTED: UnitItemDeficiencies = {
//     itemName: 'Gas dryer exhaust ventilation system has restricted airflow.',
//     deficiencies: [
//         {
//             id: 'dryer_4',
//             name: 'Gas dryer exhaust ventilation system has restricted airflow.',
//             detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
//             criteria: 'Airflow may be restricted.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DRYER-04'
//         }
//     ]
// };

// export const DRYER_GAS_DETACHED: UnitItemDeficiencies = {
//     itemName: 'Gas dryer transition duct is detached or missing',
//     deficiencies: [
//         {
//             id: 'dryer_5',
//             name: 'Gas dryer transition duct is detached or missing',
//             detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
//             criteria: 'Dryer transition duct is not securely attached.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DRYER-05'
//         }
//     ]
// };

// export const CLOTHES_DRYER_DEFICIENCIES = {
//     category: '6. Clothes Dryer Exhaust Ventilation',
//     items: [DRYER_UNSUITABLE_MATERIAL, DRYER_ELECTRIC_RESTRICTED, DRYER_ELECTRIC_DETACHED, DRYER_GAS_RESTRICTED, DRYER_GAS_DETACHED]
// };

// // ==========================================
// // 7. DOOR
// // ==========================================

// export const DOOR_CANNOT_BE_SECURED: UnitItemDeficiencies = {
//     itemName: 'Entry door cannot be secured.',
//     deficiencies: [
//         {
//             id: 'door_entry_1',
//             name: 'Entry door cannot be secured.',
//             detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
//             criteria: 'Installed locks can not be engaged from both sides.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '13.40/n',
//             code: 'DOOR-ENTRY-01'
//         }
//     ]
// };

// export const DOOR_COMPONENT_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
//     deficiencies: [
//         {
//             id: 'door_entry_2',
//             name: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
//             detail: 'Entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
//             criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'DOOR-ENTRY-02'
//         }
//     ]
// };

// export const DOOR_FRAME_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'The entry door frame, threshold, or trim is damaged.',
//     deficiencies: [
//         {
//             id: 'door_entry_3',
//             name: 'The entry door frame, threshold, or trim is damaged.',
//             detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
//             criteria: 'Observed evidence of prior installation, now missing.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-03'
//         }
//     ]
// };

// export const DOOR_ENTRY_MISSING: UnitItemDeficiencies = {
//     itemName: 'Entry door is missing',
//     deficiencies: [
//         {
//             id: 'door_entry_4',
//             name: 'Entry door is missing',
//             detail: 'Evidence of prior installation',
//             criteria: 'Not present or is incomplete.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-ENTRY-04'
//         }
//     ]
// };

// export const DOOR_ENTRY: UnitItemDeficiencies = {
//     itemName: 'Door - Entry',
//     deficiencies: [
//         {
//             id: 'door_entry_5',
//             name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
//             detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
//             criteria: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-05'
//         },
//         {
//             id: 'door_entry_6',
//             name: 'Self-closing mechanism is damaged, inoperable or damaged.',
//             detail: 'Self-closing mechanism is damaged, inoperable or damaged.',
//             criteria: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-06'
//         },
//         {
//             id: 'door_entry_7',
//             name: 'Entry door surface is delaminated or separated.',
//             detail: 'Entry door surface is delaminated or separated.',
//             criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-07'
//         },
//         {
//             id: 'door_entry_8',
//             name: 'Entry door will not close.',
//             detail: 'Entry door will not close.',
//             criteria: 'Entry door does not close (i.e., door seats in frame).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-ENTRY-08'
//         },
//         {
//             id: 'door_entry_9',
//             name: 'Entry door will not open.',
//             detail: 'Entry door will not open.',
//             criteria: 'Entry door does not open.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-09'
//         },
//         {
//             id: 'door_entry_10',
//             name: 'Hole, split, or crack that penetrates completely through the entry door.',
//             detail: 'Hole, split, or crack that penetrates completely through the entry door.',
//             criteria: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-ENTRY-10'
//         }
//     ]
// };

// export const DOOR_FIRE_LABELED: UnitItemDeficiencies = {
//     itemName: 'Door – Fire Labeled',
//     deficiencies: [
//         {
//             id: 'door_fire_1',
//             name: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
//             detail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
//             criteria: 'An object is present that may prevent the fire-labeled door from closing and latching. Or An object is present that may prevent the fire-labeled door from self-closing and latching.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-01'
//         },
//         {
//             id: 'door_fire_2',
//             name: 'Fire-labeled door assembly has a hole of any size.',
//             detail: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
//             criteria: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-02'
//         },
//         {
//             id: 'door_fire_3',
//             name: 'Fire-labeled door cannot be secured.',
//             detail: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
//             criteria: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-03'
//         },
//         {
//             id: 'door_fire_4',
//             name: 'Fire-labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
//             detail: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
//             criteria: 'Fire-labeled door does not close and latch. OR fire-labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-04'
//         },
//         {
//             id: 'door_fire_5',
//             name: 'Fire-labeled door does not open.',
//             detail: 'Fire labeled door does not open such that it may limit access between spaces.',
//             criteria: 'Fire-labeled door does not open such that it may limit access between spaces.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-05'
//         },
//         {
//             id: 'door_fire_6',
//             name: 'Fire-labeled door is missing.',
//             detail: '(i.e., evidence of prior installation, but now not present or is incomplete).',
//             criteria: 'Fire-labeled door is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'DOOR-FIRE-06'
//         },
//         {
//             id: 'door_fire_7',
//             name: 'Fire-labeled door seal or gasket is damaged.',
//             detail: 'Fire-labeled door seal or gasket is damaged.',
//             criteria: 'Fire-labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'DOOR-FIRE-07'
//         }
//     ]
// };

// export const DOOR_GENERAL: UnitItemDeficiencies = {
//     itemName: 'Door-General',
//     deficiencies: [
//         {
//             id: 'door_general_1',
//             name: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
//             detail: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
//             criteria: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'DOOR-GEN-01'
//         },
//         {
//             id: 'door_general_2',
//             name: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
//             detail: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
//             criteria: 'A passage door does not open such that it may limit access when needed.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-GEN-02'
//         },
//         {
//             id: 'door_general_3',
//             name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
//             detail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
//             criteria: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'DOOR-GEN-03'
//         }
//     ]
// };

// export const DOOR_GARAGE: UnitItemDeficiencies = {
//     itemName: 'Garage Door',
//     deficiencies: [
//         {
//             id: 'door_garage_1',
//             name: 'Garage door does not open, close, or remains closed.',
//             detail: 'Garage door does not open, close, or remains closed.',
//             criteria: 'Door will not open and remain open, does not function adequately.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-GARAGE-01'
//         },
//         {
//             id: 'door_garage_2',
//             name: 'The garage door has a hole (broken panel or window).',
//             detail: 'The garage door has a hole (broken panel or window).',
//             criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DOOR-GARAGE-02'
//         }
//     ]
// };

// export const DOOR_DEFICIENCIES = {
//     category: '7. Door',
//     items: [DOOR_CANNOT_BE_SECURED, DOOR_COMPONENT_DAMAGED, DOOR_FRAME_DAMAGED, DOOR_ENTRY_MISSING, DOOR_ENTRY, DOOR_FIRE_LABELED, DOOR_GENERAL, DOOR_GARAGE]
// };

// // ==========================================
// // 8. DRAINAGE
// // ==========================================

// export const DRAINAGE_UNIT: UnitItemDeficiencies = {
//     itemName: 'Drain/Floor drain',
//     deficiencies: [
//         {
//             id: 'drainage_1',
//             name: 'The drain is fully blocked.',
//             detail: 'Drain/Floor drain',
//             criteria: 'There is a problem with the drainage.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'DRAINAGE-01'
//         }
//     ]
// };

// export const DRAINAGE_DEFICIENCIES = {
//     category: '8. Drainage',
//     items: [DRAINAGE_UNIT]
// };

// // ==========================================
// // 9. EGRESS
// // ==========================================

// export const EGRESS_UNIT: UnitItemDeficiencies = {
//     itemName: 'Obstructed means of egress',
//     deficiencies: [
//         {
//             id: 'egress_1',
//             name: 'Obstructed means of egress',
//             detail: 'The exit access or exit is obstructed. 1. Exit access - path from any interior location to an exit. 2. Exit doors to the outside and enclosed exit stairways.',
//             criteria: 'Double-key Cylinder deadbolt locks or security features requiring a key, tool, or special effort from the stress side are not allowed on exit doors, exit access doors, or egress windows. Fixed or movable security bars must not block designated egress points, and no furniture or items may obstruct the means of egress.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'EGRESS-01'
//         }
//     ]
// };

// export const EGRESS_DEFICIENCIES = {
//     category: '9. Egress',
//     items: [EGRESS_UNIT]
// };

// // ==========================================
// // 10. ELECTRICAL
// // ==========================================

// export const ELECTRICAL_CONDUCTOR_OUTLET_SWITCH: UnitItemDeficiencies = {
//     itemName: 'Conductor-Outlet, and Switch',
//     deficiencies: [
//         {
//             id: 'elec_conductor_1',
//             name: 'The electrical conductor is not enclosed or properly insulated.',
//             detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
//             criteria: 'Electrical conductors must be enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2"; missing light bulbs are evaluated under interior or exterior lighting.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'ELEC-COND-01'
//         },
//         {
//             id: 'elec_conductor_2',
//             name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
//             detail: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
//             criteria: 'An outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) does not have visible damage and testing indicates that it is not energized.',
//             severity: 'Severe',
//             repairBy: '24Hrs',
//             points: '13.40/n',
//             code: 'ELEC-COND-02'
//         },
//         {
//             id: 'elec_conductor_3',
//             name: 'The outlet or switch is damaged.',
//             detail: 'The outlet or switch is damaged.',
//             criteria: 'Any portion of a visually accessible (i.e., can be reasonably accessed and observed) outlet or switch is damaged (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'ELEC-COND-03'
//         },
//         {
//             id: 'elec_conductor_4',
//             name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
//             detail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
//             criteria: 'Testing of a three-pronged outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) indicates that it is not properly wired or grounded.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'ELEC-COND-04'
//         },
//         {
//             id: 'elec_conductor_5',
//             name: 'Water is currently in contact with an electrical conductor.',
//             detail: 'Water is currently in contact with an electrical conductor.',
//             criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'ELEC-COND-05'
//         }
//     ]
// };

// export const ELECTRICAL_GFCI_AFCI: UnitItemDeficiencies = {
//     itemName: 'Electrical-(GFCI) Or (AFCI)-Outlet or Breaker',
//     deficiencies: [
//         {
//             id: 'elec_gfci_1',
//             name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
//             detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
//             criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'ELEC-GFCI-01'
//         },
//         {
//             id: 'elec_gfci_2',
//             name: 'Unprotected outlet is present within six feet of a water source.',
//             detail: 'Unprotected outlet is present within six feet of a water source.',
//             criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'ELEC-GFCI-02'
//         },
//         {
//             id: 'elec_gfci_3',
//             name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
//             detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
//             criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'ELEC-GFCI-03'
//         }
//     ]
// };

// export const ELECTRICAL_SERVICE_PANEL: UnitItemDeficiencies = {
//     itemName: 'Electrical Service Panel',
//     deficiencies: [
//         {
//             id: 'elec_panel_1',
//             name: 'Electrical service panel is not reasonably accessible.',
//             detail: 'Electrical service panel is not reasonably accessible.',
//             criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property). Or it is looked or in locked location, no key to access.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'ELEC-PANEL-01'
//         },
//         {
//             id: 'elec_panel_2',
//             name: 'The overcurrent protection device is contaminated.',
//             detail: 'The overcurrent protection device is contaminated.',
//             criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
//             severity: 'Severe',
//             repairBy: '24Hrs',
//             points: '13.40/n',
//             code: 'ELEC-PANEL-02'
//         },
//         {
//             id: 'elec_panel_3',
//             name: 'The overcurrent protection device is damaged.',
//             detail: 'The overcurrent protection device is damaged.',
//             criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an over current condition (i.e., paint, or other foreign materials).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'ELEC-PANEL-03'
//         }
//     ]
// };

// export const ELECTRICAL_DEFICIENCIES = {
//     category: '10. Electrical',
//     items: [ELECTRICAL_CONDUCTOR_OUTLET_SWITCH, ELECTRICAL_GFCI_AFCI, ELECTRICAL_SERVICE_PANEL]
// };

// // ==========================================
// // 11. ELEVATOR
// // ==========================================

// export const ELEVATOR_NOT_LEVEL: UnitItemDeficiencies = {
//     itemName: 'Elevator Cab is not level with the floor.',
//     deficiencies: [
//         {
//             id: 'elevator_1',
//             name: 'Elevator Cab is not level with the floor.',
//             detail: 'Poses tripping hazards.',
//             criteria: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'ELEVATOR-01'
//         }
//     ]
// };

// export const ELEVATOR_DOOR: UnitItemDeficiencies = {
//     itemName: 'The elevator door does not fully open or close.',
//     deficiencies: [
//         {
//             id: 'elevator_2',
//             name: 'The elevator door does not fully open or close.',
//             detail: 'The elevator door does not fully open (at least 36 inches) and does not close.',
//             criteria: 'All elevators must be in working condition.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'ELEVATOR-02'
//         }
//     ]
// };

// export const ELEVATOR_INOPERABLE: UnitItemDeficiencies = {
//     itemName: 'Elevator is inoperable.',
//     deficiencies: [
//         {
//             id: 'elevator_3',
//             name: 'Elevator is inoperable.',
//             detail: 'Elevator is inoperable (i.e. overall system or component thereof not meeting function or purpose; with or without visible damage).',
//             criteria: 'Elevator system or component thereof not meeting function or purpose.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'ELEVATOR-03'
//         }
//     ]
// };

// export const ELEVATOR_SAFETY_DEVICE: UnitItemDeficiencies = {
//     itemName: 'Safety edge device has malfunctioned or is inoperable.',
//     deficiencies: [
//         {
//             id: 'elevator_4',
//             name: 'Safety edge device has malfunctioned or is inoperable.',
//             detail: 'The safety edge device hasd has malfunctioned or is not functionally adequate.',
//             criteria: 'Overall, the system or a component thereof is not meeting its function or purpose.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'ELEVATOR-04'
//         }
//     ]
// };

// export const ELEVATOR_DEFICIENCIES = {
//     category: '11. Elevator',
//     items: [ELEVATOR_NOT_LEVEL, ELEVATOR_DOOR, ELEVATOR_INOPERABLE, ELEVATOR_SAFETY_DEVICE]
// };

// // ==========================================
// // 12. FIRE SAFETY
// // ==========================================

// export const FIRE_SAFETY_EXIT_SIGN: UnitItemDeficiencies = {
//     itemName: 'Exit Sign',
//     deficiencies: [
//         {
//             id: 'fire_exit_1',
//             name: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
//             detail: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
//             criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-EXIT-01'
//         }
//     ]
// };

// export const FIRE_SAFETY_EXTINGUISHER: UnitItemDeficiencies = {
//     itemName: 'Fire Extinguisher',
//     deficiencies: [
//         {
//             id: 'fire_ext_1',
//             name: 'A fire extinguisher is damaged or missing.',
//             detail: 'A fire extinguisher is damaged or missing.',
//             criteria: 'A fire extinguisher is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-EXT-01'
//         },
//         {
//             id: 'fire_ext_2',
//             name: 'The fire extinguisher pressure gauge reads over or undercharged.',
//             detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
//             criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-EXT-02'
//         },
//         {
//             id: 'fire_ext_3',
//             name: 'The fire extinguisher tag is missing or illegible or expired.',
//             detail: 'The fire extinguisher tag is missing or illegible or expired.',
//             criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-EXT-03'
//         }
//     ]
// };

// export const FIRE_SAFETY_FLAMMABLE: UnitItemDeficiencies = {
//     itemName: 'Flammable and Combustible Item',
//     deficiencies: [
//         {
//             id: 'fire_flam_1',
//             name: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
//             detail: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
//             criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place (e.g. under a kitchen sink cabinet, in a hall closet,etc.) is not a deficiency.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-FLAM-01'
//         }
//     ]
// };

// export const FIRE_SAFETY_SMOKE_ALARM: UnitItemDeficiencies = {
//     itemName: 'Smoke Alarm',
//     deficiencies: [
//         {
//             id: 'fire_smoke_1',
//             name: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
//             detail: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
//             criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'FIRE-SMOKE-01'
//         },
//         {
//             id: 'fire_smoke_2',
//             name: 'Smoke alarm not installed where required.',
//             detail: 'Smoke alarm not installed where required.',
//             criteria: 'Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'FIRE-SMOKE-02'
//         },
//         {
//             id: 'fire_smoke_3',
//             name: 'Smoke alarm is obstructed',
//             detail: 'Smoke alarm is obstructed',
//             criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'FIRE-SMOKE-03'
//         },
//         {
//             id: 'fire_smoke_4',
//             name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
//             detail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
//             criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '0.000',
//             code: 'FIRE-SMOKE-04'
//         }
//     ]
// };

// export const FIRE_SAFETY_SPRINKLER: UnitItemDeficiencies = {
//     itemName: 'Sprinkler Assembly',
//     deficiencies: [
//         {
//             id: 'fire_sprinkler_1',
//             name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
//             detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
//             criteria: 'The sprinkler assembly component is damaged,, inoperable or missing.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-SPRINKLER-01'
//         },
//         {
//             id: 'fire_sprinkler_2',
//             name: 'Sprinkler head assembly has evidence of corrosion.',
//             detail: 'Sprinkler head assembly has evidence of corrosion.',
//             criteria: 'Sprinkler head assembly has evidence of corrosion.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-SPRINKLER-02'
//         },
//         {
//             id: 'fire_sprinkler_3',
//             name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
//             detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
//             criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-SPRINKLER-03'
//         },
//         {
//             id: 'fire_sprinkler_4',
//             name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
//             detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
//             criteria: '18 inches clearance is not due to feature within built (e.g. closet, utility closet).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'FIRE-SPRINKLER-04'
//         }
//     ]
// };

// export const FIRE_SAFETY_DEFICIENCIES = {
//     category: '12. Fire Safety',
//     items: [FIRE_SAFETY_EXIT_SIGN, FIRE_SAFETY_EXTINGUISHER, FIRE_SAFETY_FLAMMABLE, FIRE_SAFETY_SMOKE_ALARM, FIRE_SAFETY_SPRINKLER]
// };

// // ==========================================
// // 13. FLOOR
// // ==========================================

// export const FLOOR_NOT_ADEQUATE: UnitItemDeficiencies = {
//     itemName: 'Floor component(s) is not functionally adequate.',
//     deficiencies: [
//         {
//             id: 'floor_1',
//             name: 'Floor component(s) is not functionally adequate.',
//             detail: 'Floor component(s) is not functionally adequate (i.e., does not allow floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping,defelection).',
//             criteria: 'Surface abnormalities may indicate the presence of deficiency t(i.e. lifting iles,tilers, hardwood cupping, linoleum bubbling, etc.).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FLOOR-01'
//         }
//     ]
// };

// export const FLOOR_SUBSTRATE_EXPOSED: UnitItemDeficiencies = {
//     itemName: 'Floor substrate is exposed',
//     deficiencies: [
//         {
//             id: 'floor_2',
//             name: 'Floor substrate is exposed',
//             detail: '10% or more of the floor substrate area is exposed in any room.',
//             criteria: 'Repair is needed.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FLOOR-02'
//         }
//     ]
// };

// export const FLOOR_DEFICIENCIES = {
//     category: '13. Floor',
//     items: [FLOOR_NOT_ADEQUATE, FLOOR_SUBSTRATE_EXPOSED]
// };

// // ==========================================
// // 14. FOUNDATION
// // ==========================================

// export const FOUNDATION_REBAR_SPALLING: UnitItemDeficiencies = {
//     itemName: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
//     deficiencies: [
//         {
//             id: 'foundation_1',
//             name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
//             detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
//             criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FOUNDATION-01'
//         }
//     ]
// };

// export const FOUNDATION_CRACKED: UnitItemDeficiencies = {
//     itemName: 'Foundation is cracked.',
//     deficiencies: [
//         {
//             id: 'foundation_2',
//             name: 'Foundation is cracked.',
//             detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
//             criteria: 'Foundation cracks (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FOUNDATION-02'
//         }
//     ]
// };

// export const FOUNDATION_WATER: UnitItemDeficiencies = {
//     itemName: 'Foundation infiltrated by water.',
//     deficiencies: [
//         {
//             id: 'foundation_3',
//             name: 'Foundation infiltrated by water.',
//             detail: 'Evidence of water infiltration through the foundation through visual evaluation.',
//             criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FOUNDATION-03'
//         }
//     ]
// };

// export const FOUNDATION_SUPPORT_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Foundation support post, column, or girder area is damaged.',
//     deficiencies: [
//         {
//             id: 'foundation_4',
//             name: 'Foundation support post, column, or girder area is damaged.',
//             detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
//             criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'FOUNDATION-04'
//         }
//     ]
// };

// export const FOUNDATION_DEFICIENCIES = {
//     category: '14. Foundation',
//     items: [FOUNDATION_REBAR_SPALLING, FOUNDATION_CRACKED, FOUNDATION_WATER, FOUNDATION_SUPPORT_DAMAGED]
// };

// // ==========================================
// // 15. GRAB BAR
// // ==========================================

// export const GRAB_BAR_UNIT: UnitItemDeficiencies = {
//     itemName: 'Grab Bar',
//     deficiencies: [
//         {
//             id: 'grab_bar_1',
//             name: 'The grab bar is not secured.',
//             detail: 'The grab bar is not secured.',
//             criteria: 'Any movement whatsoever is detected in the grab bar.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'GRAB-BAR-01'
//         }
//     ]
// };

// export const GRAB_BAR_DEFICIENCIES = {
//     category: '15. Grab Bar',
//     items: [GRAB_BAR_UNIT]
// };

// // ==========================================
// // 16. HAZARD
// // ==========================================

// export const HAZARD_INFESTATION: UnitItemDeficiencies = {
//     itemName: 'Infestation',
//     deficiencies: [
//         {
//             id: 'hazard_infest_1',
//             name: 'Evidence of bedbugs.',
//             detail: 'Evidence of bedbugs.',
//             criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-01'
//         },
//         {
//             id: 'hazard_infest_2',
//             name: 'Evidence of cockroaches(dead).',
//             detail: 'Evidence of cockroaches(dead).',
//             criteria: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-02'
//         },
//         {
//             id: 'hazard_infest_3',
//             name: 'Evidence of mice.',
//             detail: 'Evidence of mice.',
//             criteria: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-03'
//         },
//         {
//             id: 'hazard_infest_4',
//             name: 'Evidence of other pests.',
//             detail: 'Evidence of other pests.',
//             criteria: 'Evidence is present of other pest infestations, including but not limited to a trail of ants, wasps/beehives, squirrels, birds, and bats in an interior area. Pests are animals with potential impacts on residents health and safety.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-04'
//         },
//         {
//             id: 'hazard_infest_5',
//             name: 'Evidence of rats.',
//             detail: 'Evidence of rats.',
//             criteria: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-05'
//         },
//         {
//             id: 'hazard_infest_6',
//             name: 'Extensive bedbugs infestation.',
//             detail: 'Extensive bedbugs infestation.',
//             criteria: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime through visual assessment.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-06'
//         },
//         {
//             id: 'hazard_infest_7',
//             name: 'Extensive cockroach infestation (live).',
//             detail: 'Extensive cockroach infestation (live).',
//             criteria: 'Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'HAZARD-INFEST-07'
//         },
//         {
//             id: 'hazard_infest_8',
//             name: 'Extensive mouse infestation.',
//             detail: 'Extensive mouse infestation.',
//             criteria: 'Sighting of at least one live mouse in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-08'
//         },
//         {
//             id: 'hazard_infest_9',
//             name: 'Extensive rat infestation.',
//             detail: 'Extensive rat infestation.',
//             criteria: 'A live rat is seen in the unit.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-INFEST-09'
//         }
//     ]
// };

// export const HAZARD_LITTER: UnitItemDeficiencies = {
//     itemName: 'LITTER',
//     deficiencies: [
//         {
//             id: 'hazard_litter_1',
//             name: 'Litter is accumulated in an unassigned area.',
//             detail: 'Litter is accumulated in an unassigned area.',
//             criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-LITTER-01'
//         }
//     ]
// };

// export const HAZARD_SHARP_EDGES: UnitItemDeficiencies = {
//     itemName: 'Sharp edges',
//     deficiencies: [
//         {
//             id: 'hazard_sharp_1',
//             name: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
//             detail: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
//             criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'HAZARD-SHARP-01'
//         }
//     ]
// };

// export const HAZARD_TRIP: UnitItemDeficiencies = {
//     itemName: 'Trip hazard',
//     deficiencies: [
//         {
//             id: 'hazard_trip_1',
//             name: 'Trip hazard on walking surface.',
//             detail: 'Trip hazard on walking surface.',
//             criteria: 'There is an abrupt change in vertical elevation or horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: - An unintended ¾ inch or greater vertical difference',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-TRIP-01'
//         },
//         {
//             id: 'hazard_trip_2',
//             name: 'Trip hazard - horizontal separation.',
//             detail: 'Trip hazard - horizontal separation.',
//             criteria: 'horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: -An unintended 2-inch horizontal separation perpendicular to the path of travel.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'HAZARD-TRIP-02'
//         }
//     ]
// };

// export const HAZARD_DEFICIENCIES = {
//     category: '16. Hazard',
//     items: [HAZARD_INFESTATION, HAZARD_LITTER, HAZARD_SHARP_EDGES, HAZARD_TRIP]
// };

// // ==========================================
// // 17. HEATING, VENTILATION, AND AIR CONDITIONING
// // ==========================================

// export const HVAC_AC_NOT_OPERATIONAL: UnitItemDeficiencies = {
//     itemName: 'Air conditioning system or device is not operational.',
//     deficiencies: [
//         {
//             id: 'hvac_1',
//             name: 'Air conditioning system or device is not operational.',
//             detail: 'The system or device does not turn on. OR System or device only produces hot or room temperature air.',
//             criteria: '(e.g., a window unit or central air system)',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'HVAC-01'
//         }
//     ]
// };

// export const HVAC_COMBUSTION_CHAMBER: UnitItemDeficiencies = {
//     itemName: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
//     deficiencies: [
//         {
//             id: 'hvac_2',
//             name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
//             detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
//             criteria: 'a combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'HVAC-02'
//         }
//     ]
// };

// export const HVAC_EXHAUST_VENT: UnitItemDeficiencies = {
//     itemName: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
//     deficiencies: [
//         {
//             id: 'hvac_3',
//             name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
//             detail: 'A fuel-burning heating system or device is present. And exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. Or Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'HVAC-03'
//         }
//     ]
// };

// export const HVAC_SAFETY_SHIELD: UnitItemDeficiencies = {
//     itemName: 'Heating system or device safety shield is damaged or missing.',
//     deficiencies: [
//         {
//             id: 'hvac_4',
//             name: 'Heating system or device safety shield is damaged or missing.',
//             detail: 'Heating system or device safety shield is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
//             criteria: 'Safety shield was previously installed and is now not present or is incomplete. Heating systems in tropical islands are excluded.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'HVAC-04'
//         }
//     ]
// };

// export const HVAC_APRIL_SEPT: UnitItemDeficiencies = {
//     itemName: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
//     deficiencies: [
//         {
//             id: 'hvac_5',
//             name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
//             detail: 'A permanently installed heating source is damaged. OR a permanently installed heating source is inoperable, not meeting function or purpose, with or without visible damage. OR a permanently installed heating source is missing (i.e., evidence of prior installation but is now not present or is incomplete). OR A permanently installed heating source is not installed. And The outside temperature is below 68 degrees Fahrenheit',
//             criteria: 'Permanently is affixed within the unit or building, safely connected to the unit or building electrical system, thermostatically controlled by the unit or building, and appropriate for the size of the unit or building. The energy source for a permanently heating system can be electric, gas, or oil (Boiler Chiller system). The heating systems in tropical islands are excluded.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '13.40/n',
//             code: 'HVAC-05'
//         }
//     ]
// };

// export const HVAC_OCT_MARCH: UnitItemDeficiencies = {
//     itemName: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
//     deficiencies: [
//         {
//             id: 'hvac_6',
//             name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
//             detail: 'The inspection date is on or between October 1 and March 31. AND the permanently installed heating source is not working. OR the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
//             criteria: 'The permanently installed heating source is not working to create heat. Heating systems in tropical islands are excluded.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'HVAC-06'
//         }
//     ]
// };

// export const HVAC_UNVENTED_HEATER: UnitItemDeficiencies = {
//     itemName: 'Unvented space heater is present.',
//     deficiencies: [
//         {
//             id: 'hvac_7',
//             name: 'Unvented space heater is present.',
//             detail: 'Unvented space heater that burns gas, oil, or kerosene is present',
//             criteria: 'Inside, include any and all common areas.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'HVAC-07'
//         }
//     ]
// };

// export const HVAC_DEFICIENCIES = {
//     category: '17. Heating, Ventilation, and Air Conditioning',
//     items: [HVAC_AC_NOT_OPERATIONAL, HVAC_COMBUSTION_CHAMBER, HVAC_EXHAUST_VENT, HVAC_SAFETY_SHIELD, HVAC_APRIL_SEPT, HVAC_OCT_MARCH, HVAC_UNVENTED_HEATER]
// };

// // ==========================================
// // 18. KITCHEN
// // ==========================================

// export const KITCHEN_CABINET_STORAGE: UnitItemDeficiencies = {
//     itemName: 'Cabinet and Storage',
//     deficiencies: [
//         {
//             id: 'kitchen_cab_1',
//             name: 'Storage component is damaged, inoperable, or missing.',
//             detail: 'Storage component is damaged, inoperable, or missing.',
//             criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-CAB-01'
//         }
//     ]
// };

// export const KITCHEN_COOKING_APPLIANCE: UnitItemDeficiencies = {
//     itemName: 'Cooking Appliance.',
//     deficiencies: [
//         {
//             id: 'kitchen_cook_1',
//             name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
//             detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
//             criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-COOK-01'
//         },
//         {
//             id: 'kitchen_cook_2',
//             name: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
//             detail: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
//             criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-COOK-02'
//         },
//         {
//             id: 'kitchen_cook_3',
//             name: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
//             detail: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
//             criteria: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'KITCHEN-COOK-03'
//         }
//     ]
// };

// export const KITCHEN_FOOD_PREP: UnitItemDeficiencies = {
//     itemName: 'Food preparation Area',
//     deficiencies: [
//         {
//             id: 'kitchen_food_1',
//             name: 'Food preparation area is damaged or is not functionally adequate.',
//             detail: 'Food preparation area is damaged or is not functionally adequate.',
//             criteria: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-FOOD-01'
//         },
//         {
//             id: 'kitchen_food_2',
//             name: 'Food preparation area is not present.',
//             detail: 'Food preparation area is not present.',
//             criteria: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-FOOD-02'
//         }
//     ]
// };

// export const KITCHEN_MOLD: UnitItemDeficiencies = {
//     itemName: 'MOLD-LIKE SUBSTANCE',
//     deficiencies: [
//         {
//             id: 'kitchen_mold_1',
//             name: 'Peeling Paint-Elevated moisture level.',
//             detail: 'Peeling Paint-Elevated moisture level.',
//             criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-MOLD-01'
//         },
//         {
//             id: 'kitchen_mold_2',
//             name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
//             detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
//             criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'KITCHEN-MOLD-02'
//         },
//         {
//             id: 'kitchen_mold_3',
//             name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
//             detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
//             criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'KITCHEN-MOLD-03'
//         },
//         {
//             id: 'kitchen_mold_4',
//             name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
//             detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
//             criteria: 'Cumulative area of patches is more than 4 square inches and less than one square foot in a room.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-MOLD-04'
//         }
//     ]
// };

// export const KITCHEN_REFRIGERATOR: UnitItemDeficiencies = {
//     itemName: 'Refrigerator',
//     deficiencies: [
//         {
//             id: 'kitchen_fridge_1',
//             name: 'Refrigerator component is damaged such that it impacts functionality.',
//             detail: 'Refrigerator component is damaged such that it impacts functionality.',
//             criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-FRIDGE-01'
//         },
//         {
//             id: 'kitchen_fridge_2',
//             name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
//             detail: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
//             criteria: 'Refrigerator is inoperable (i.e., overall system is not meeting function or purpose; with or without visible damage) such that it may be unable to safely and adequately store food',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-FRIDGE-02'
//         }
//     ]
// };

// export const KITCHEN_SINK: UnitItemDeficiencies = {
//     itemName: 'Sink',
//     deficiencies: [
//         {
//             id: 'kitchen_sink_1',
//             name: 'Cannot activate or deactivate hot and cold water.',
//             detail: 'Cannot activate or deactivate hot and cold water.',
//             criteria: 'Control knobs do not activate or deactivate hot and cold water.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-SINK-01'
//         },
//         {
//             id: 'kitchen_sink_2',
//             name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
//             detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
//             criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-SINK-02'
//         },
//         {
//             id: 'kitchen_sink_3',
//             name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
//             detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
//             criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-SINK-03'
//         },
//         {
//             id: 'kitchen_sink_4',
//             name: 'The sink is not draining, not functioning adequately.',
//             detail: 'The sink is not draining, not functioning adequately.',
//             criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-SINK-04'
//         },
//         {
//             id: 'kitchen_sink_5',
//             name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
//             detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
//             criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
//             severity: 'Moderate',
//             repairBy: '60 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-SINK-05'
//         },
//         {
//             id: 'kitchen_sink_6',
//             name: 'Water pressure, direction.',
//             detail: 'Water pressure, direction.',
//             criteria: 'Water pressure, direction is not adequately functional.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'KITCHEN-SINK-06'
//         }
//     ]
// };

// export const KITCHEN_VENTILATION: UnitItemDeficiencies = {
//     itemName: 'Ventilation',
//     deficiencies: [
//         {
//             id: 'kitchen_vent_1',
//             name: 'Ventilation',
//             detail: 'The restroom does not have ventilation, not present and operable.',
//             criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-VENT-01'
//         },
//         {
//             id: 'kitchen_vent_2',
//             name: 'Ventilation',
//             detail: 'Exhaust system component is damaged or missing.',
//             criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-VENT-02'
//         },
//         {
//             id: 'kitchen_vent_3',
//             name: 'Ventilation',
//             detail: 'Exhaust system does not respond to the control switch.',
//             criteria: 'Exhaust vent inoperable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-VENT-03'
//         },
//         {
//             id: 'kitchen_vent_4',
//             name: 'Ventilation',
//             detail: 'Exhaust system has restricted air flow.',
//             criteria: 'Exhaust system is blocked such that airflow may be restricted.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'KITCHEN-VENT-04'
//         }
//     ]
// };

// export const KITCHEN_DEFICIENCIES = {
//     category: '18. Kitchen',
//     items: [KITCHEN_CABINET_STORAGE, KITCHEN_COOKING_APPLIANCE, KITCHEN_FOOD_PREP, KITCHEN_MOLD, KITCHEN_REFRIGERATOR, KITCHEN_SINK, KITCHEN_VENTILATION]
// };

// // ==========================================
// // 19. LEAK – GAS OR OIL
// // ==========================================

// export const LEAK_GAS_OIL_UNIT: UnitItemDeficiencies = {
//     itemName: 'Natural gas, propane, or oil leak.',
//     deficiencies: [
//         {
//             id: 'leak_gas_1',
//             name: 'Natural gas, propane, or oil leak.',
//             detail: 'Natural gas, propane, or oil leak.',
//             criteria: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '54.50/n',
//             code: 'LEAK-GAS-01'
//         }
//     ]
// };

// export const LEAK_GAS_OIL_DEFICIENCIES = {
//     category: '19- LEAK – Gas or Oil',
//     items: [LEAK_GAS_OIL_UNIT]
// };

// // ==========================================
// // 20. LEAK-SEWAGE SYSTEM (CLOGGED DRAIN)(MISSING DRAIN CAP)
// // ==========================================

// export const LEAK_SEWAGE_BLOCKED: UnitItemDeficiencies = {
//     itemName: 'Blocked sewage system.',
//     deficiencies: [
//         {
//             id: 'leak_sewage_1',
//             name: 'Blocked sewage system.',
//             detail: 'Wastewater is unable to drain resulting in sewer backup.',
//             criteria: 'Blocked sewage system.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'LEAK-SEWAGE-01'
//         }
//     ]
// };

// export const LEAK_SEWAGE_CAP_MISSING: UnitItemDeficiencies = {
//     itemName: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
//     deficiencies: [
//         {
//             id: 'leak_sewage_2',
//             name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
//             detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             criteria: 'Cap to the cleanout or pump cover is detached or missing.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LEAK-SEWAGE-02'
//         }
//     ]
// };

// export const LEAK_SEWAGE_CAP_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Cleanout cap or riser is damaged.',
//     deficiencies: [
//         {
//             id: 'leak_sewage_3',
//             name: 'Cleanout cap or riser is damaged.',
//             detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
//             criteria: 'Protective cap or riser is damaged.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LEAK-SEWAGE-03'
//         }
//     ]
// };

// export const LEAK_SEWAGE_LEAK: UnitItemDeficiencies = {
//     itemName: 'Leak in sewage system.',
//     deficiencies: [
//         {
//             id: 'leak_sewage_4',
//             name: 'Leak in sewage system.',
//             detail: 'There is evidence of a sewer line or fitting leaking.',
//             criteria: 'Leak in sewage system.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'LEAK-SEWAGE-04'
//         }
//     ]
// };

// export const LEAK_SEWAGE_DEFICIENCIES = {
//     category: '20. Leak-sewage system (Clogged drain)(Missing drain cap)',
//     items: [LEAK_SEWAGE_BLOCKED, LEAK_SEWAGE_CAP_MISSING, LEAK_SEWAGE_CAP_DAMAGED, LEAK_SEWAGE_LEAK]
// };

// // ==========================================
// // 21. LEAK- WATER
// // ==========================================

// export const LEAK_WATER_ENV_INTRUSION: UnitItemDeficiencies = {
//     itemName: 'Environmental water intrusion',
//     deficiencies: [
//         {
//             id: 'leak_water_1',
//             name: 'Environmental water intrusion',
//             detail: 'Water from the exterior environment is leaking into the interior.',
//             criteria: 'Environmental water intrusion.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LEAK-WATER-01'
//         }
//     ]
// };

// export const LEAK_WATER_SPRINKLER: UnitItemDeficiencies = {
//     itemName: 'Fluid is leaking from the sprinkler assembly.',
//     deficiencies: [
//         {
//             id: 'leak_water_2',
//             name: 'Fluid is leaking from the sprinkler assembly.',
//             detail: 'Fluid is leaking from the sprinkler assembly.',
//             criteria: 'Fluid is leaking from the sprinkler assembly.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LEAK-WATER-02'
//         }
//     ]
// };

// export const LEAK_WATER_PLUMBING: UnitItemDeficiencies = {
//     itemName: 'Plumbing leak',
//     deficiencies: [
//         {
//             id: 'leak_water_3',
//             name: 'Plumbing leak',
//             detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
//             criteria: 'Plumbing leak.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LEAK-WATER-03'
//         }
//     ]
// };

// export const LEAK_WATER_DEFICIENCIES = {
//     category: '21. Leak- water',
//     items: [LEAK_WATER_ENV_INTRUSION, LEAK_WATER_SPRINKLER, LEAK_WATER_PLUMBING]
// };

// // ==========================================
// // 22. LIGHTING
// // ==========================================

// export const LIGHTING_AUXILIARY: UnitItemDeficiencies = {
//     itemName: 'Lighting - Auxiliary',
//     deficiencies: [
//         {
//             id: 'lighting_aux_1',
//             name: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
//             detail: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
//             criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'LIGHTING-AUX-01'
//         }
//     ]
// };

// export const LIGHTING_INTERIOR: UnitItemDeficiencies = {
//     itemName: 'Lighting - Interior',
//     deficiencies: [
//         {
//             id: 'lighting_int_1',
//             name: 'A permanently installed light fixture is inoperable.',
//             detail: 'A permanently installed light fixture is inoperable.',
//             criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LIGHTING-INT-01'
//         },
//         {
//             id: 'lighting_int_2',
//             name: 'A permanently installed light fixture is not secure.',
//             detail: 'A permanently installed light fixture is not secure.',
//             criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LIGHTING-INT-02'
//         },
//         {
//             id: 'lighting_int_3',
//             name: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
//             detail: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
//             criteria: 'Permanent lighting fixtures are missing or not functioning.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'LIGHTING-INT-03'
//         }
//     ]
// };

// export const LIGHTING_DEFICIENCIES = {
//     category: '22. Lighting',
//     items: [LIGHTING_AUXILIARY, LIGHTING_INTERIOR]
// };

// // ==========================================
// // 23. MOLD
// // ==========================================

// export const MOLD_UNIT: UnitItemDeficiencies = {
//     itemName: 'Mold - Like Substance',
//     deficiencies: [
//         {
//             id: 'mold_1',
//             name: 'Peeling paint, elevated moisture level.',
//             detail: 'Peeling paint, elevated moisture level.',
//             criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'MOLD-01'
//         },
//         {
//             id: 'mold_2',
//             name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
//             detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
//             criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'MOLD-02'
//         },
//         {
//             id: 'mold_3',
//             name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
//             detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
//             criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'MOLD-03'
//         },
//         {
//             id: 'mold_4',
//             name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
//             detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
//             criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'MOLD-04'
//         }
//     ]
// };

// export const MOLD_DEFICIENCIES = {
//     category: '23. Mold',
//     items: [MOLD_UNIT]
// };

// // ==========================================
// // 24. PAINT - POTENTIAL LEAD-BASED PAINT HAZARDS – VISUAL ASSESSMENT
// // ==========================================

// export const PAINT_LESS_2SF: UnitItemDeficiencies = {
//     itemName: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
//     deficiencies: [
//         {
//             id: 'paint_1',
//             name: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
//             detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
//             criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'PAINT-01'
//         }
//     ]
// };

// export const PAINT_MORE_2SF: UnitItemDeficiencies = {
//     itemName: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
//     deficiencies: [
//         {
//             id: 'paint_2',
//             name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
//             detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
//             criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'PAINT-02'
//         }
//     ]
// };

// export const PAINT_DEFICIENCIES = {
//     category: '24. Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
//     items: [PAINT_LESS_2SF, PAINT_MORE_2SF]
// };

// // ==========================================
// // 25. RAILINGS
// // ==========================================

// export const RAILINGS_GUARDRAIL: UnitItemDeficiencies = {
// itemName: 'Guardrail',
//     deficiencies: [
//         {
//             id: 'railing_guard_1',
//             name: 'Guardrail',
//             detail: 'Guardrail is missing or not installed. It does limit its safe use.',
//             criteria: 'The guardrail is missing (i.e., evidence of prior installation but is now not present or is incomplete) or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'RAILING-GUARD-01'
//         },
//         {
//             id: 'railing_guard_2', // Unique ID for the second deficiency
//             name: 'Guardrail Component',
//             detail: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
//             criteria: 'A guardrail is deficient if it’s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to effectively prevent fall hazards.',
//             // !! You must define the correct severity, repair timeline, and points for this level.
//             severity: 'Life-Threatening', // Example - Confirm this with your scoring system.
//             repairBy: '24Hrs',   // Example - Confirm this with your scoring system.
//             points: '27.25/n',    // Example - Confirm this with your scoring system.
//             code: 'RAILING-GUARD-02' // Example - Unique code
//         }
//     ]
// };

// export const RAILINGS_HANDRAIL: UnitItemDeficiencies = {
//     itemName: 'Handrail',
//     deficiencies: [
//         {
//             id: 'railing_hand_1',
//             name: 'Handrail',
//             detail: 'Handrail is missing, damaged, not secured, or not installed.',
//             criteria: 'Handrail is missing, not functionally adequate, not installed where required, or not secured.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '27.25/n',
//             code: 'RAILING-HAND-01'
//         },
//         {
//             id: 'railing_hand_2',
//             name: 'Handrail',
//             detail: 'Handrail is not functionally adequate',
//             criteria: 'A handrail is deficient if it cant be reasonably grasped for support, isnt continuous along the full stair flight, or falls outside the required height range of 28 to 42 inches.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RAILING-HAND-02'
//         },
//         {
//             id: 'railing_hand_3',
//             name: 'Handrail',
//             detail: 'Handrail is not installed where required.',
//             criteria: ' 4 or more stair risers are present, and a handrail is not installed.  OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
//             severity: 'Severe',
//             repairBy: '24Hr',
//             points: '13.40/n',
//             code: 'RAILING-HAND-03'
//         },
//         {
//             id: 'railing_hand_4',
//             name: 'Handrail',
//             detail: 'Handrail is not secured.',
//             criteria: 'There is movement in the anchors of the handrail.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RAILING-HAND-04'
//         }
//     ]
// };

// export const RAILINGS_DEFICIENCIES = {
//     category: '25. Railings',
//     items: [RAILINGS_GUARDRAIL, RAILINGS_HANDRAIL]
// };

// // ==========================================
// // 26. RESTROOM
// // ==========================================

// export const RESTROOM_BATHTUB_SHOWER: UnitItemDeficiencies = {
//     itemName: 'Bathtub and Shower',
//     deficiencies: [
//         {
//             id: 'restroom_bath_1',
//             name: 'Common area, the bathtub or shower is inoperable or does not drain.',
//             detail: 'Common area, the bathtub or shower is inoperable or does not drain.',
//             criteria: 'Common area bathtub or shower is present, and it is inoperable ( not meeting function or purpose, with or without visible damage), or standing water is present such that water is unable to drain.',
//             severity: 'Low',
//             repairBy: '30 Day',
//             points: '2.20/n',
//             code: 'RESTROOM-BATH-01'
//         },
//         {
//             id: 'restroom_bath_2',
//             name: ' Common area bathtub or shower hardware and water fixtures.',
//             detail: ' Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident’s ability to maintain personal hygiene.',
//             criteria: 'Bathtub or shower component is missing (i.e., evidence of prior installation, but now not present or is incomplete) or damaged (i.e., visibly defective; impacts functionality).',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'RESTROOM-BATH-02'
//         },
//         {
//             id: 'restroom_bath_3',
//             name: ' Bathtub or shower component is damaged, inoperable, or missing, and it may limit the residents ability to maintain personal hygiene.',
//             detail: ' Bathtub or shower component is damaged, inoperable, or missing, and it may limit the residents ability to maintain personal hygiene. ',
//             criteria: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident’s ability to maintain personal hygiene.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'RESTROOM-BATH-03'
//         },
//         {
//             id: 'restroom_bath_4',
//             name: ' Bathtub or shower cannot be used in private',
//             detail: 'Bathtub or shower cannot be used in private',
//             criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
//             severity: 'Moderate',
//             repairBy: '60 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-BATH-04'
//         },

//     ]
// };

// export const RESTROOM_CABINET_STORAGE: UnitItemDeficiencies = {
//     itemName: 'Cabinet and Storage',
//     deficiencies: [
//         {
//             id: 'restroom_cab_1',
//             name: 'Cabinet and Storage',
//             detail: 'Storage component is damaged, inoperable, or missing.',
//             criteria: 'Restroom cabinet doors, drawers, or shelves are missing or damaged.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-CAB-01'
//         }
//     ]
// };

// export const RESTROOM_GRAB_BAR: UnitItemDeficiencies = {
//     itemName: 'Grab Bar',
//     deficiencies: [
//         {
//             id: 'restroom_grab_1',
//             name: 'Grab Bar',
//             detail: 'Grab bar is not secure.',
//             criteria: 'Any movement detected in the grab bar.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-GRAB-01'
//         }
//     ]
// };

// export const RESTROOM_MOLD: UnitItemDeficiencies = {
//     itemName: 'Mold -Like Substance',
//     deficiencies: [
//         {
//             id: 'restroom_mold_1',
//             name: 'Mold -Like Substance',
//             detail: 'Presence of mold-like substance or peeling paint from elevated moisture.',
//             criteria: 'Visual observation of mold-like substance or signs of elevated moisture levels.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-MOLD-01'
//         }
//     ]
// };

// export const RESTROOM_SINK: UnitItemDeficiencies = {
//     itemName: 'Sink',
//     deficiencies: [
//         {
//             id: 'restroom_sink_1',
//             name: 'Cannot activate or deactivate hot and cold water.',
//             detail: 'Cannot activate or deactivate hot and cold water.',
//             criteria: 'Control knobs do not activate or deactivate hot and cold water.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-SINK-01'
//         },
//         {
//             id: 'restroom_sink_2',
//             name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
//             detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
//             criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-SINK-02'
//         },
//         {
//             id: 'restroom_sink_3',
//             name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
//             detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
//             criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-SINK-03'
//         },
//         {
//             id: 'restroom_sink_4',
//             name: 'The sink is not draining, not functioning adequately.',
//             detail: 'The sink is not draining, not functioning adequately.',
//             criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-SINK-04'
//         },
//         {
//             id: 'restroom_sink_5',
//             name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
//             detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
//             criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'RESTROOM-SINK-05'
//         }
//     ]
// };

// export const RESTROOM_TOILET: UnitItemDeficiencies = {
//     itemName: 'Toilet',
//     deficiencies: [
//         {
//             id: 'restroom_toilet_1',
//             name: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
//             detail: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
//             criteria: 'A toilet is deficient if it\'s damaged or inoperable, as long as another operational toilet exists elsewhere in the building.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-01'
//         },
//         {
//             id: 'restroom_toilet_2',
//             name: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
//             detail: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
//             criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-02'
//         },
//         {
//             id: 'restroom_toilet_3',
//             name: 'Only 1 toilet was installed, and it is damaged or inoperable.',
//             detail: 'Only 1 toilet was installed, and it is damaged or inoperable.',
//             criteria: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-03'
//         },
//         {
//             id: 'restroom_toilet_4',
//             name: 'Only 1 toilet was installed, and it is missing.',
//             detail: 'Only 1 toilet was installed, and it is missing.',
//             criteria: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-04'
//         },
//         {
//             id: 'restroom_toilet_5',
//             name: 'Toilet can not be used in private.',
//             detail: 'Toilet can not be used in private.',
//             criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the toilet without being observed from an adjacent area or exterior space.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-05'
//         },
//         {
//             id: 'restroom_toilet_6',
//             name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
//             detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
//             criteria: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-06'
//         },
//         {
//             id: 'restroom_toilet_7',
//             name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
//             detail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
//             criteria: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-07'
//         },
//         {
//             id: 'restroom_toilet_8',
//             name: 'Toilet is not secured at the base.',
//             detail: 'Toilet is not secured at the base.',
//             criteria: 'Toilet is not secured at the base.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-TOILET-08'
//         }
//     ]
// };

// export const RESTROOM_VENTILATION: UnitItemDeficiencies = {
//     itemName: 'Ventilation',
//     deficiencies: [
//         {
//             id: 'restroom_vent_1',
//             name: 'Ventilation',
//             detail: 'Restroom ventilation is missing, damaged, or inoperable.',
//             criteria: 'Exhaust fan system failure, missing components, or blocked airflow.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'RESTROOM-VENT-01'
//         }
//     ]
// };

// export const RESTROOM_DEFICIENCIES = {
//     category: '26. Restroom',
//     items: [RESTROOM_BATHTUB_SHOWER, RESTROOM_CABINET_STORAGE, RESTROOM_GRAB_BAR, RESTROOM_MOLD, RESTROOM_SINK, RESTROOM_TOILET, RESTROOM_VENTILATION]
// };

// // ==========================================
// // 27. SINK (LAUNDRY, GARAGE, OR PATIO)
// // ==========================================

// export const SINK_LAUNDRY_CONTROL_KNOBS: UnitItemDeficiencies = {
//     itemName: 'Control Knobs.',
//     deficiencies: [
//         {
//             id: 'sink_laundry_1',
//             name: 'Control Knobs.',
//             detail: 'Control knobs do not activate or deactivate hot and cold water.',
//             criteria: 'Control knobs do not activate or deactivate hot and cold water.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'SINK-LAUNDRY-01'
//         }
//     ]
// };

// export const SINK_LAUNDRY_COMPONENT_MISSING: UnitItemDeficiencies = {
//     itemName: 'Component is missing',
//     deficiencies: [
//         {
//             id: 'sink_laundry_2',
//             name: 'Component is missing',
//             detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'SINK-LAUNDRY-02'
//         }
//     ]
// };

// export const SINK_LAUNDRY_IMPROPERLY_INSTALLED: UnitItemDeficiencies = {
//     itemName: 'Improperly installed.',
//     deficiencies: [
//         {
//             id: 'sink_laundry_3',
//             name: 'Improperly installed.',
//             detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
//             criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'SINK-LAUNDRY-03'
//         }
//     ]
// };

// export const SINK_LAUNDRY_SINK_MISSING: UnitItemDeficiencies = {
//     itemName: 'Sink is missing.',
//     deficiencies: [
//         {
//             id: 'sink_laundry_4',
//             name: 'Sink is missing.',
//             detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
//             criteria: 'not present or incomplete.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'SINK-LAUNDRY-04'
//         }
//     ]
// };

// export const SINK_LAUNDRY_NOT_DRAINING: UnitItemDeficiencies = {
//     itemName: 'Sink not draining',
//     deficiencies: [
//         {
//             id: 'sink_laundry_5',
//             name: 'Sink not draining',
//             detail: 'Water is not draining from the basin of the sink.',
//             criteria: 'Water is not draining from the basin of the sink.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'SINK-LAUNDRY-05'
//         }
//     ]
// };

// export const SINK_LAUNDRY_COMPONENT_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Component is damaged',
//     deficiencies: [
//         {
//             id: 'sink_laundry_6',
//             name: 'Component is damaged',
//             detail: 'The sink component is missing, damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'SINK-LAUNDRY-06'
//         }
//     ]
// };

// export const SINK_LAUNDRY_DEFICIENCIES = {
//     category: '27. Sink (Laundry, Garage, or patio)',
//     items: [SINK_LAUNDRY_CONTROL_KNOBS, SINK_LAUNDRY_COMPONENT_MISSING, SINK_LAUNDRY_IMPROPERLY_INSTALLED, SINK_LAUNDRY_SINK_MISSING, SINK_LAUNDRY_NOT_DRAINING, SINK_LAUNDRY_COMPONENT_DAMAGED]
// };

// // ==========================================
// // 28. STEPS AND STAIRS
// // ==========================================

// export const STEPS_STRINGER_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Stringer is damaged',
//     deficiencies: [
//         {
//             id: 'steps_1',
//             name: 'Stringer is damaged',
//             detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
//             criteria: 'Instability is detected while walking on the stair.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'STEPS-01'
//         }
//     ]
// };

// export const STEPS_TREAD_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Tread on a set of stairs damaged',
//     deficiencies: [
//         {
//             id: 'steps_2',
//             name: 'Tread on a set of stairs damaged',
//             detail: 'Tread on a set of stairs is missing i.e., a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide, is damaged or broken.',
//             criteria: 'Secure accessory treads are not present.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'STEPS-02'
//         }
//     ]
// };

// export const STEPS_STAIRS_DEFICIENCIES = {
//     category: '28. Steps and Stairs',
//     items: [STEPS_STRINGER_DAMAGED, STEPS_TREAD_DAMAGED]
// };

// // ==========================================
// // 29. STRUCTURAL SYSTEM
// // ==========================================

// export const STRUCTURAL_SYSTEM_UNIT: UnitItemDeficiencies = {
//     itemName: 'Structural System',
//     deficiencies: [
//         {
//             id: 'structural_1',
//             name: 'Structural system exhibits signs of serious failure',
//             detail: 'Structural system exhibits signs of serious failure and may threaten the residents\' safety.',
//             criteria: 'Significant structural damage that affects occupants\' safety.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'STRUCTURAL-01'
//         }
//     ]
// };

// export const STRUCTURAL_DEFICIENCIES = {
//     category: '29. Structural System',
//     items: [STRUCTURAL_SYSTEM_UNIT]
// };

// // ==========================================
// // 30. TRASH CHUTE
// // ==========================================

// export const TRASH_CHUTE_DOOR: UnitItemDeficiencies = {
//     itemName: 'The chute door does not open, self-close, or latch.',
//     deficiencies: [
//         {
//             id: 'trash_1',
//             name: 'The chute door does not open, self-close, or latch.',
//             detail: 'The chute door does not open or self-close and latch.',
//             criteria: 'Chute door is damaged.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'TRASH-01'
//         }
//     ]
// };

// export const TRASH_CHUTE_CLOGGED: UnitItemDeficiencies = {
//     itemName: 'Chute is clogged',
//     deficiencies: [
//         {
//             id: 'trash_2',
//             name: 'Chute is clogged',
//             detail: 'Trash is overflowing or backed up inside chute.',
//             criteria: 'The garbage is backing up into the chute.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'TRASH-02'
//         }
//     ]
// };

// export const TRASH_CHUTE_DEFICIENCIES = {
//     category: '30. Trash Chute',
//     items: [TRASH_CHUTE_DOOR, TRASH_CHUTE_CLOGGED]
// };

// // ==========================================
// // 31. VENTILATION
// // ==========================================

// export const VENTILATION_UNIT: UnitItemDeficiencies = {
//     itemName: 'Ventilation',
//     deficiencies: [
//         {
//             id: 'vent_1',
//             name: 'Ventilation is not present and operable.',
//             detail: 'The ventilation system is not present and operable.',
//             criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'VENT-01'
//         },
//         {
//             id: 'vent_2',
//             name: 'Exhaust system component is damaged or missing.',
//             detail: 'Exhaust system component is damaged or missing.',
//             criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'VENT-02'
//         },
//         {
//             id: 'vent_3',
//             name: 'Exhaust system does not respond to the control switch.',
//             detail: 'Exhaust system does not respond to the control switch.',
//             criteria: 'Exhaust fan, inoperable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'VENT-03'
//         },
//         {
//             id: 'vent_4',
//             name: 'Exhaust system has restricted air flow.',
//             detail: 'Exhaust system has restricted air flow.',
//             criteria: 'Exhaust system is blocked such that airflow may be restricted.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'VENT-04'
//         }
//     ]
// };

// export const VENTILATION_DEFICIENCIES = {
//     category: '31. Ventilation',
//     items: [VENTILATION_UNIT]
// };

// // ==========================================
// // 32. WALL
// // ==========================================

// export const WALL_INTERIOR_UNIT: UnitItemDeficiencies = {
//     itemName: 'Wall-Interior',
//     deficiencies: [
//         {
//             id: 'wall_1',
//             name: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
//             detail: 'Wall-Interior',
//             criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WALL-01'
//         },
//         {
//             id: 'wall_2',
//             name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
//             detail: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
//             criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WALL-02'
//         },
//         {
//             id: 'wall_3',
//             name: 'Interior wall has a loose or detached surface covering.',
//             detail: 'Interior wall has a loose or detached surface covering.',
//             criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WALL-03'
//         }
//     ]
// };

// export const WALL_DEFICIENCIES = {
//     category: '32. Wall',
//     items: [WALL_INTERIOR_UNIT]
// };

// // ==========================================
// // 33. WATER HEATER
// // ==========================================

// export const WATER_HEATER_CHIMNEY_BLOCKED: UnitItemDeficiencies = {
//     itemName: 'Chimney or flue piping is blocked, misaligned, or missing',
//     deficiencies: [
//         {
//             id: 'water_heater_1',
//             name: 'Chimney or flue piping is blocked, misaligned, or missing',
//             detail: 'Chimney or flue piping is blocked, misaligned, or missing',
//             criteria: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'WATER-HEATER-01'
//         }
//     ]
// };

// export const WATER_HEATER_GAS_VALVE: UnitItemDeficiencies = {
//     itemName: 'Gas shutoff valve is damaged, missing or not installed',
//     deficiencies: [
//         {
//             id: 'water_heater_2',
//             name: 'Gas shutoff valve is damaged, missing or not installed',
//             detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
//             criteria: 'A gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required.',
//             severity: 'Life-Threatening',
//             repairBy: '24Hrs',
//             points: '27.25/n',
//             code: 'WATER-HEATER-02'
//         }
//     ]
// };

// export const WATER_HEATER_NO_HOT_WATER: UnitItemDeficiencies = {
//     itemName: 'No hot water',
//     deficiencies: [
//         {
//             id: 'water_heater_3',
//             name: 'No hot water',
//             detail: 'No hot water',
//             criteria: 'Hot water does not dispense after handle is engaged.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'WATER-HEATER-03'
//         }
//     ]
// };

// export const WATER_HEATER_TPRV: UnitItemDeficiencies = {
//     itemName: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
//     deficiencies: [
//         {
//             id: 'water_heater_4',
//             name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
//             detail: 'TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
//             criteria: 'The Tprv valve is not functioning adequately.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'WATER-HEATER-04'
//         }
//     ]
// };

// export const WATER_HEATER_RELIEF_VALVE: UnitItemDeficiencies = {
//     itemName: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
//     deficiencies: [
//         {
//             id: 'water_heater_5',
//             name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
//             detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
//             criteria: 'Not properly installed.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WATER-HEATER-05'
//         }
//     ]
// };

// export const WATER_HEATER_DEFICIENCIES = {
//     category: '33. Water Heater',
//     items: [WATER_HEATER_CHIMNEY_BLOCKED, WATER_HEATER_GAS_VALVE, WATER_HEATER_NO_HOT_WATER, WATER_HEATER_TPRV, WATER_HEATER_RELIEF_VALVE]
// };

// // ==========================================
// // 34. WINDOW
// // ==========================================

// export const WINDOW_CANNOT_SECURE: UnitItemDeficiencies = {
//     itemName: 'Window cannot be secured.',
//     deficiencies: [
//         {
//             id: 'window_1',
//             name: 'Window cannot be secured.',
//             detail: 'Window cannot be secured i.e., access controlled) by at least 1 installed lock.',
//             criteria: 'Only one lock present, and it is damaged, inoperable.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WINDOW-01'
//         }
//     ]
// };

// export const WINDOW_COMPONENT_DAMAGED: UnitItemDeficiencies = {
//     itemName: 'Window component is damaged or missing, and the window is not functionally adequate',
//     deficiencies: [
//         {
//             id: 'window_2',
//             name: 'Window component is damaged or missing, and the window is not functionally adequate',
//             detail: 'The window component is missing (i.e., evidence of prior installation, but is now not present or is incomplete) or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater(i.e., can not protect from bugs, or debris).',
//             criteria: 'Window is not functionally adequate.',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WINDOW-02'
//         }
//     ]
// };

// export const WINDOW_WILL_NOT_CLOSE: UnitItemDeficiencies = {
//     itemName: 'Window will not close.',
//     deficiencies: [
//         {
//             id: 'window_3',
//             name: 'Window will not close.',
//             detail: 'The window does not close completely. OR At least one window lock is not present. OR The window can be opened once the lock is engaged.',
//             criteria: 'Window lock does not keep the window closed.',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'WINDOW-03'
//         }
//     ]
// };

// export const WINDOW_WILL_NOT_OPEN: UnitItemDeficiencies = {
//     itemName: 'Window will not open or stay open.',
//     deficiencies: [
//         {
//             id: 'window_4',
//             name: 'Window will not open or stay open.',
//             detail: 'Window will not open. Once opened, the window will not stay open without the use of a tool or item.',
//             criteria: 'Will not stay open without the use of a tool or item..',
//             severity: 'Moderate',
//             repairBy: '30 Day',
//             points: '5.0/n',
//             code: 'WINDOW-04'
//         }
//     ]
// };

// /*export const WINDOW_COMPONENT_ADEQUATE: UnitItemDeficiencies = {
//     itemName: 'Window component is damaged or missing, and the window is functionally adequate.',
//     deficiencies: [
//         {
//             id: 'window_5',
//             name: 'Window component is damaged or missing, and the window is functionally adequate.',
//             detail: 'Window component is damaged or missing, and the window is functionally adequate.',
//             criteria: 'Window component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the window is functionally adequate.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'WINDOW-05'
//         }
//     ]
// };

// export const WINDOW_GLAZING: UnitItemDeficiencies = {
//     itemName: 'Window glazing.',
//     deficiencies: [
//         {
//             id: 'window_6',
//             name: 'Window glazing.',
//             detail: 'Window glazing is cracked or broken.',
//             criteria: 'Window glazing is cracked or broken such that it impacts the window\'s functionality or poses a safety hazard.',
//             severity: 'Low',
//             repairBy: '60 Day',
//             points: '2.20/n',
//             code: 'WINDOW-06'
//         }
//     ]
// };

// export const WINDOW_MISSING: UnitItemDeficiencies = {
//     itemName: 'Window is missing.',
//     deficiencies: [
//         {
//             id: 'window_7',
//             name: 'Window is missing.',
//             detail: 'Window is missing.',
//             criteria: 'Window is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
//             severity: 'Severe',
//             repairBy: '24 Hrs.',
//             points: '13.40/n',
//             code: 'WINDOW-07'
//         }
//     ]
// };*/

// export const WINDOW_DEFICIENCIES = {
//     category: '34. Window',
//     items: [WINDOW_CANNOT_SECURE, WINDOW_COMPONENT_DAMAGED, WINDOW_WILL_NOT_CLOSE, WINDOW_WILL_NOT_OPEN]
// };

// // ==========================================
// // 35. GENERAL COMMENT
// // ==========================================

// export const GENERAL_COMMENT_UNIT: UnitItemDeficiencies = {
//     itemName: 'General comment',
//     deficiencies: [
//         {
//             id: 'general_1',
//             name: 'General comment',
//             detail: 'General comment',
//             criteria: 'General observation or note.',
//             severity: 'Low',
//             repairBy: 'N/A',
//             points: '0',
//             code: 'GENERAL-01'
//         }
//     ]
// };

// export const GENERAL_COMMENT_DEFICIENCIES = {
//     category: '35. General comment: *',
//     items: [GENERAL_COMMENT_UNIT]
// };

// // ==========================================
// // ALL UNIT CATEGORIES - 35 Total
// // ==========================================

// export const ALL_UNIT_CATEGORIES = [
//     CABINET_STORAGE_DEFICIENCIES,           // 1
//     CALL_FOR_AID_DEFICIENCIES,              // 2
//     CARBON_MONOXIDE_DEFICIENCIES,           // 3
//     CEILING_DEFICIENCIES,                   // 4
//     CHIMNEY_DEFICIENCIES,                   // 5
//     CLOTHES_DRYER_DEFICIENCIES,             // 6
//     DOOR_DEFICIENCIES,                      // 7
//     DRAINAGE_DEFICIENCIES,                  // 8
//     EGRESS_DEFICIENCIES,                    // 9
//     ELECTRICAL_DEFICIENCIES,                // 10
//     ELEVATOR_DEFICIENCIES,                  // 11
//     FIRE_SAFETY_DEFICIENCIES,               // 12
//     FLOOR_DEFICIENCIES,                     // 13
//     FOUNDATION_DEFICIENCIES,                // 14
//     GRAB_BAR_DEFICIENCIES,                  // 15
//     HAZARD_DEFICIENCIES,                    // 16
//     HVAC_DEFICIENCIES,                      // 17
//     KITCHEN_DEFICIENCIES,                   // 18
//     LEAK_GAS_OIL_DEFICIENCIES,              // 19
//     LEAK_SEWAGE_DEFICIENCIES,               // 20
//     LEAK_WATER_DEFICIENCIES,                // 21
//     LIGHTING_DEFICIENCIES,                  // 22
//     MOLD_DEFICIENCIES,                      // 23
//     PAINT_DEFICIENCIES,                     // 24
//     RAILINGS_DEFICIENCIES,                  // 25
//     RESTROOM_DEFICIENCIES,                  // 26
//     SINK_LAUNDRY_DEFICIENCIES,              // 27
//     STEPS_STAIRS_DEFICIENCIES,              // 28
//     STRUCTURAL_DEFICIENCIES,                // 29
//     TRASH_CHUTE_DEFICIENCIES,               // 30
//     VENTILATION_DEFICIENCIES,               // 31
//     WALL_DEFICIENCIES,                      // 32
//     WATER_HEATER_DEFICIENCIES,              // 33
//     WINDOW_DEFICIENCIES,                    // 34
//     GENERAL_COMMENT_DEFICIENCIES            // 35
// ];

// // ==========================================
// // MAPPING HELPER FUNCTIONS
// // ==========================================

// /**
//  * Shared helper to find a category using a two-pass matching strategy:
//  * 1. Exact match (normalized)
//  * 2. Robust fuzzy match
//  */
// const findUnitCategory = (categoryName: string) => {
//     const normalize = (str: string) =>
//         str.replace(/^\d+\.\s*/, '')
//             .toLowerCase()
//             .replace(/[\u2013\u2014\-]/g, ' ')
//             .replace(/\s+/g, ' ')
//             .trim();

//     const normalizedSearch = normalize(categoryName);

//     // Pass 1: Exact match first
//     for (const category of ALL_UNIT_CATEGORIES) {
//         if (normalize(category.category) === normalizedSearch) {
//             return category;
//         }
//     }

//     // Pass 2: Robust matching
//     for (const category of ALL_UNIT_CATEGORIES) {
//         if (matchInsideCategory(categoryName, category.category)) {
//             return category;
//         }
//     }

//     return null;
// };

// // List of all Unit category names (normalized)
// export const UNIT_CATEGORIES = ALL_UNIT_CATEGORIES.map(cat => cat.category);

// // Get all unit deficiencies as flat array
// export const ALL_UNIT_DEFICIENCIES: UnitItemDeficiencies[] = ALL_UNIT_CATEGORIES.flatMap(cat => cat.items);

// // Function to get deficiencies by category name
// // IMPORTANT: Must match CATEGORY names properly, not just item names
// // to avoid "Sink (Laundry)" matching Restroom > Sink
// export const getUnitDeficienciesByCategory = (categoryName: string): UnitItemDeficiencies | null => {
//     // Pass 1 & 2: Use shared helper (Exact match, then Robust match)
//     const category = findUnitCategory(categoryName);
//     if (category) {
//         // If it matches a category with multiple items, it should be handled via subcategories.
//         // But if called directly for deficiencies, return the first item as a fallback.
//         return category.items[0];
//     }

//     // PASS 3: Check if search matches a specific item name exactly (for direct item lookup)
//     const normalizedSearch = categoryName.toLowerCase().trim();
//     for (const category of ALL_UNIT_CATEGORIES) {
//         for (const item of category.items) {
//             if (item.itemName.toLowerCase() === normalizedSearch) {
//                 return item;
//             }
//         }
//     }

//     return null;
// };

// // Function to get all items for a specific category
// export const getUnitItemsForCategory = (categoryName: string): UnitItemDeficiencies[] => {
//     const category = findUnitCategory(categoryName);
//     if (category) {
//         return category.items;
//     }

//     return [];
// };

// // Function to search deficiencies by keyword
// export const searchUnitDeficiencies = (keyword: string): UnitDeficiencyOption[] => {
//     const normalizedKeyword = keyword.toLowerCase().trim();
//     const results: UnitDeficiencyOption[] = [];

//     for (const item of ALL_UNIT_DEFICIENCIES) {
//         for (const deficiency of item.deficiencies) {
//             if (deficiency.name.toLowerCase().includes(normalizedKeyword) ||
//                 deficiency.detail.toLowerCase().includes(normalizedKeyword) ||
//                 deficiency.criteria.toLowerCase().includes(normalizedKeyword)) {
//                 results.push(deficiency);
//             }
//         }
//     }

//     return results;
// };

// // ==========================================
// // INSIDE SUBCATEGORY HELPER FUNCTIONS
// // ==========================================

// /**
//  * Helper to match category names properly without false positives
//  * Uses exact match first, then checks if search term starts category name
//  */
// const matchInsideCategory = (searchName: string, categoryFullName: string): boolean => {
//     // Normalize string by removing number prefix, convert to lower case, 
//     // and replace all variations of dashes/hyphens with a single space for robust comparison
//     const normalize = (str: string) =>
//         str.replace(/^\d+\.\s*/, '')
//             .toLowerCase()
//             .replace(/[\u2013\u2014\-]/g, ' ') // Replace various dash types with space
//             .replace(/\s+/g, ' ')             // Collapse multiple spaces
//             .trim();

//     const normalizedSearch = normalize(searchName);
//     const catName = normalize(categoryFullName);

//     // DEBUG: Log when Paint category is being checked
//     if (searchName.toLowerCase().includes('paint') || categoryFullName.toLowerCase().includes('paint')) {
//         console.log('DEBUG matchInsideCategory PAINT:', {
//             searchName,
//             categoryFullName,
//             normalizedSearch,
//             catName,
//             exactMatch: catName === normalizedSearch,
//         });
//     }

//     // Exact match
//     if (catName === normalizedSearch) return true;

//     // Word-based matching for robustness
//     const searchWords = normalizedSearch.split(' ');
//     const catWords = catName.split(' ');

//     // Match if first word is the same AND (it's the only word OR another word matches)
//     // AND ensure we don't match "Hazard" if we're searching for "Paint"
//     if (searchWords[0] === catWords[0] && searchWords[0].length > 3) {
//         if (searchWords.length === 1) return true;
//         // Check if any other word in search exists in the category name
//         if (searchWords.some((word, idx) => idx > 0 && catWords.includes(word))) return true;
//     }

//     // Robust match for Category 24 (Paint) - Move outside first-word block
//     // CRITICAL: Ensure we only match if both sides contain 'paint' or 'lead'
//     // to avoid matching "Paint ... Hazards" with "Hazard"
//     if (searchWords.includes('paint') && catWords.includes('paint')) return true;
//     if (searchWords.includes('lead') && catWords.includes('lead')) return true;

//     // Explicit fallback for Paint if search name is very short
//     if (normalizedSearch === 'paint' && (catWords.includes('paint') || catWords.includes('lead'))) return true;

//     // Loose inclusion (only if search is specific enough and NOT a generic word like Hazard)
//     if (normalizedSearch.length > 5 && normalizedSearch !== 'hazard' && (catName.includes(normalizedSearch) || normalizedSearch.includes(catName))) {
//         if (normalizedSearch.includes('paint') || normalizedSearch.includes('lead')) {
//             return catName.includes('paint') || catName.includes('lead');
//         }
//         return true;
//     }

//     return false;
// };

// /**
//  * Check if an Inside category has subcategories (items.length > 1)
//  */
// export const hasInsideSubcategories = (categoryName: string): boolean => {
//     const category = findUnitCategory(categoryName);
//     return category ? category.items.length > 1 : false;
// };

// /**
//  * Get subcategory names for an Inside category
//  */
// export const getInsideCategorySubcategories = (categoryName: string): string[] => {
//     const category = findUnitCategory(categoryName);
//     if (category && category.items.length > 1) {
//         return category.items.map(item => item.itemName);
//     }
//     return [];
// };

// /**
//  * Get deficiencies for a specific subcategory within an Inside category
//  */
// export const getInsideSubcategoryDeficiencies = (subcategoryName: string): UnitItemDeficiencies | null => {
//     // Normalize string by removing number prefix, convert to lower case, 
//     // and replace all variations of dashes/hyphens with a single space for robust comparison
//     const normalize = (str: string) =>
//         str.replace(/^\d+\.\s*/, '')
//             .toLowerCase()
//             .replace(/[\u2013\u2014\-]/g, ' ') // Replace various dash types with space
//             .replace(/\s+/g, ' ')             // Collapse multiple spaces
//             .trim();

//     const normalizedName = normalize(subcategoryName);

//     for (const category of ALL_UNIT_CATEGORIES) {
//         for (const item of category.items) {
//             const catItemName = normalize(item.itemName);
//             // Exact match first
//             if (catItemName === normalizedName) return item;
//             // Then check if item name starts with search or vice versa
//             if (catItemName.startsWith(normalizedName) || normalizedName.startsWith(catItemName)) {
//                 return item;
//             }
//         }
//     }

//     return null;
// };
// Unit Deficiency Mapping - NSPIRE Standards
// This file contains all deficiency mappings for UNIT inspections only
// EXACT mapping from NSPIRE Excel data - 35 Categories

export interface UnitDeficiencyOption {
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

export interface UnitItemDeficiencies {
    itemName: string;
    deficiencies: UnitDeficiencyOption[];
}

// ==========================================
// 1. CABINET AND STORAGE (PANTRY, LAUNDRY)
// ==========================================

export const CABINET_STORAGE_PANTRY: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage (Pantry, Laundry)',
    deficiencies: [
        {
            id: 'cab_storage_1',
            name: 'Pantry, Food storage space is not present.',
            detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
            criteria: 'Stowed items, including food, sanitation, and household supplies.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'CAB-STORAGE-01',
            codeReference: `🧭 Step 1: Identify Cabinet and Storage Locations
Inspect all built-in or property-installed cabinets and storage units in shared-use areas.
🔍 Step 2: Visual Condition Assessment
Cabinet inaccessible or inoperable
Cabinet missing entirely (with prior install evidence)
🧪 Step 3: Functional Testing
• 	Open/Close Test: Open every door and drawer fully to check for smooth operation
• 	Hardware Check: Confirm knobs, handles, hinges, and slides are secure and functional
• 	Interior Scan: Use a flashlight to inspect inside for water stains, mold-like substance, or loose shelving
• 	Structural Stability: Gently press on cabinet sides and shelves to confirm secure mounting
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
• 	Reach Range: Accessible cabinets should be within 15"–48" AFF
• 	Operability: Doors and drawers must be usable with one hand, no tight grasping or twisting
• 	Clear Floor Space: Minimum 30"x48" in front of accessible cabinets
• 	Safe Use: No sharp edges, splinters, or protruding hardware
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC R307.1: Cabinets must be securely anchored and properly spaced
• 	IRC R702.3: Wall finishes must support mounted cabinetry
• 	IRC P2705.1: Cabinets under sinks must allow access to plumbing without obstruction
• 	IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        }
    ]
};

export const CABINET_STORAGE_DEFICIENCIES = {
    category: '1. Cabinet and Storage (Pantry, Laundry)',
    items: [CABINET_STORAGE_PANTRY]
};

// ==========================================
// 2. CALL-FOR-AID SYSTEM
// ==========================================

export const CALL_FOR_AID_SYSTEM: UnitItemDeficiencies = {
    itemName: 'Call-for-Aid System',
    deficiencies: [
        {
            id: 'call_aid_1',
            name: 'System does not function properly.',
            detail: 'A call-for-Aid system does not emit sound or light or send signal to annunciator.',
            criteria: 'The annunciator does not indicate the correct corresponding room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/50',
            code: 'CALL-AID-01',
            codeReference: `🔍 1. Locate and Identify System Type
• Wall-mounted pull cord: Most common in bathrooms, hallways, or bedrooms.
• Button-based system: May be flush-mounted or raised.
• Annunciator panel: Central panel showing active alerts (if present).
• NSPIRE Note: Wireless personal devices (e.g., pendants) are excluded from inspection

📏 2. Cord Placement and Accessibility (NSPIRE)
• Height check: Pull cord must hang ≤6 inches from the floor
• No knots or coils: Cord must be freely hanging and reachable.
• Missing cord: If evidence of prior installation exists but the cord is gone, cite deficiency.
• NSPIRE Severity: Cord too high or missing = Moderate deficiency

🧪 3. Functionality Test
• Activate system: Pull the cord or press the button to trigger the alert.
• Verify response: Confirm visual/audible signal (e.g., hallway light, buzzer).
• Annunciator panel: If present, confirm that the correct zone illuminates.

🚫 4. Obstruction or Inaccessibility
• Blocked access: Ensure no furniture, equipment, or clutter obstructs the call-for-aid device.
• Tampering: Look for signs of disabled or covered components.

🔥 5. Fire & Life Safety Overlay (IRC §R314, NSPIRE Fire Safety)
• Integration check: If the system is tied to fire alarm or emergency lighting, confirm operability.
• Power source: Confirm hardwired or battery backup is intact.
• NSPIRE Overlay: Emergency systems must be certified.

🧠 6. Accessibility & IBU Local Overlay
• Reach range: Confirm compliant placement (typically 15–48" AFF for buttons).
• Signage: Ensure clear labeling and usage instructions.
• IBU Enforcement: Some jurisdictions require enhanced alerting (e.g., strobe lights, voice annunciation)`
        },
        {
            id: 'call_aid_2',
            name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
            detail: 'The call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
            criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '13.40/50',
            code: 'CALL-AID-02',
            codeReference: `🔍 1. Locate and Identify System Type
• Wall-mounted pull cord: Most common in bathrooms, hallways, or bedrooms.
• Button-based system: May be flush-mounted or raised.
• Annunciator panel: Central panel showing active alerts (if present).
• NSPIRE Note: Wireless personal devices (e.g., pendants) are excluded from inspection

📏 2. Cord Placement and Accessibility (NSPIRE)
• Height check: Pull cord must hang ≤6 inches from the floor
• No knots or coils: Cord must be freely hanging and reachable.
• Missing cord: If evidence of prior installation exists but the cord is gone, cite deficiency.
• NSPIRE Severity: Cord too high or missing = Moderate deficiency

🧪 3. Functionality Test
• Activate system: Pull the cord or press the button to trigger the alert.
• Verify response: Confirm visual/audible signal (e.g., hallway light, buzzer).
• Annunciator panel: If present, confirm that the correct zone illuminates.

🚫 4. Obstruction or Inaccessibility
• Blocked access: Ensure no furniture, equipment, or clutter obstructs the call-for-aid device.
• Tampering: Look for signs of disabled or covered components.

🔥 5. Fire & Life Safety Overlay (IRC §R314, NSPIRE Fire Safety)
• Integration check: If the system is tied to fire alarm or emergency lighting, confirm operability.
• Power source: Confirm hardwired or battery backup is intact.
• NSPIRE Overlay: Emergency systems must be certified.

🧠 6. Accessibility & IBU Local Overlay
• Reach range: Confirm compliant placement (typically 15–48" AFF for buttons).
• Signage: Ensure clear labeling and usage instructions.
• IBU Enforcement: Some jurisdictions require enhanced alerting (e.g., strobe lights, voice annunciation)`
        }
    ]
};

export const CALL_FOR_AID_DEFICIENCIES = {
    category: '2. Call-for-Aid System',
    items: [CALL_FOR_AID_SYSTEM]
};

// ==========================================
// 3. CARBON MONOXIDE ALARM
// ==========================================

export const CARBON_MONOXIDE_ALARM: UnitItemDeficiencies = {
    itemName: 'Carbon Monoxide Alarm',
    deficiencies: [
        {
            id: 'co_alarm_1',
            name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
            detail: 'Carbon monoxide alarm, inoperable. With or without a battery, including low-volume.',
            criteria: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-01',
            codeReference: `🧭 Step 1: Identify Where CO Alarms Are Required
Inspect common areas that contain or are adjacent to potential CO sources.

🔍 Step 2: Visual Condition Assessment
CO alarm missing or not installed, CO alarm obstructed

🧪 Step 3: Functional Testing
• Test Button Activation:
• Press the test button to confirm audible and/or visual alert
• Power Source Check:
• Confirm hardwired connection with battery backup (IRC M1502.4.1)
• Battery-only alarms permitted if the code at time of construction allowed it
• Location Verification:
• Ensure alarms are installed:
• Outside each sleeping area
• In bedrooms with fuel-burning appliances
• In mechanical rooms or near shared combustion sources
• Near the duct register if served by a remote furnace

📏 Step 4: Accessibility Compliance (IBU)
• Reach Range: Test/reset buttons must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Visual Alerts: Required in common areas serving residents with hearing impairments
• Clear Floor Space: Minimum 30"x48" in front of alarm for access

⚒️ Step 5: IRC Installation Requirements
• IRC R315.2: CO alarms required in dwelling units with fuel-burning appliances or attached garages
• IRC R315.3: Must be installed outside each separate sleeping area
• IRC R315.4: Alarms must be hardwired with battery backup unless exempted
• IRC R315.5: Alarms must be listed per UL 2034`
        },
        {
            id: 'co_alarm_2',
            name: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
            detail: 'The building contains a fuel-burning appliance or fuel-burning system, a carbon monoxide alarm is missing (i.e., evidence of prior installation but is now not present or is incomplete), or not installed where needed.',
            criteria: 'Unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-02',
            codeReference: `🧭 Step 1: Identify Where CO Alarms Are Required
Inspect common areas that contain or are adjacent to potential CO sources.

🔍 Step 2: Visual Condition Assessment
CO alarm missing or not installed, CO alarm obstructed

🧪 Step 3: Functional Testing
• Test Button Activation:
• Press the test button to confirm audible and/or visual alert
• Power Source Check:
• Confirm hardwired connection with battery backup (IRC M1502.4.1)
• Battery-only alarms permitted if the code at time of construction allowed it
• Location Verification:
• Ensure alarms are installed:
• Outside each sleeping area
• In bedrooms with fuel-burning appliances
• In mechanical rooms or near shared combustion sources
• Near the duct register if served by a remote furnace

📏 Step 4: Accessibility Compliance (IBU)
• Reach Range: Test/reset buttons must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Visual Alerts: Required in common areas serving residents with hearing impairments
• Clear Floor Space: Minimum 30"x48" in front of alarm for access

⚒️ Step 5: IRC Installation Requirements
• IRC R315.2: CO alarms required in dwelling units with fuel-burning appliances or attached garages
• IRC R315.3: Must be installed outside each separate sleeping area
• IRC R315.4: Alarms must be hardwired with battery backup unless exempted
• IRC R315.5: Alarms must be listed per UL 2034`
        },
        {
            id: 'co_alarm_3',
            name: 'Carbon monoxide alarm is obstructed.',
            detail: 'The carbon monoxide alarm is obstructed by a foreign object (e.g., a plastic bag, a shower cap, a zip tie, paint, tape, or decorative stickers).',
            criteria: 'The carbon monoxide alarm is covered by a foreign object.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-03',
            codeReference: `🧭 Step 1: Identify Where CO Alarms Are Required
Inspect common areas that contain or are adjacent to potential CO sources.

🔍 Step 2: Visual Condition Assessment
CO alarm missing or not installed, CO alarm obstructed

🧪 Step 3: Functional Testing
• Test Button Activation:
• Press the test button to confirm audible and/or visual alert
• Power Source Check:
• Confirm hardwired connection with battery backup (IRC M1502.4.1)
• Battery-only alarms permitted if the code at time of construction allowed it
• Location Verification:
• Ensure alarms are installed:
• Outside each sleeping area
• In bedrooms with fuel-burning appliances
• In mechanical rooms or near shared combustion sources
• Near the duct register if served by a remote furnace

📏 Step 4: Accessibility Compliance (IBU)
• Reach Range: Test/reset buttons must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Visual Alerts: Required in common areas serving residents with hearing impairments
• Clear Floor Space: Minimum 30"x48" in front of alarm for access

⚒️ Step 5: IRC Installation Requirements
• IRC R315.2: CO alarms required in dwelling units with fuel-burning appliances or attached garages
• IRC R315.3: Must be installed outside each separate sleeping area
• IRC R315.4: Alarms must be hardwired with battery backup unless exempted
• IRC R315.5: Alarms must be listed per UL 2034`
        }
    ]
};

export const CARBON_MONOXIDE_DEFICIENCIES = {
    category: '3. Carbon Monoxide Alarm',
    items: [CARBON_MONOXIDE_ALARM]
};

// ==========================================
// 4. CEILING
// ==========================================

export const CEILING: UnitItemDeficiencies = {
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
            code: 'CEILING-01',
            codeReference: `🔍 1. Visual Condition Assessment
• Scan entire surface: Look for sagging, bubbling, cracks, or loose panels.
• Material separation: Identify nail pops, joint tape failure, or plasterboard pulling away.

🕳️ 2. Damage & Penetrations
• Holes or gaps: Any size hole that compromises the enclosure or fire separation must be documented.
• Water stains: Brown or yellow discoloration may indicate active or past leaks.
• IRC Reference: Ceiling must maintain fire separation and structural integrity (IRC §R302.6)

💧 3. Moisture & Mold Indicators
• Discoloration: Look for streaks, rings, or bubbling paint.
• Odor: Musty smells may suggest hidden mold.

🔥 4. Fire Safety Integration
• Sprinkler heads: Confirm they are unobstructed and properly mounted.
• Smoke detectors: If ceiling-mounted, verify presence and operability.
• Penetrations: Ensure any ceiling penetrations are sealed with fire-rated materials.
• IRC Reference: Fire-rated assemblies must be intact (IRC §R302.11)

💡 5. Lighting & Electrical
• Ceiling fixtures: Check for secure mounting, exposed wiring, or flickering lights.
• Recessed lighting: Inspect trim rings and insulation contact rating.

🧠 6. Accessibility & IBU Overlay
• Clearance: Ensure ceiling height meets minimum IRC requirement (IRC §R305.1: ≥7 feet)
• Labeling: If the ceiling contains access panels (e.g., attic), confirm labeling and unobstructed access.
• IBU Local Codes: May require enhanced fireproofing or acoustic treatment in shared spaces`
        },
        {
            id: 'ceiling_2',
            name: 'Ceiling has a hole.',
            detail: 'A hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
            criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'CEILING-02',
            codeReference: `🔍 1. Visual Condition Assessment
• Scan entire surface: Look for sagging, bubbling, cracks, or loose panels.
• Material separation: Identify nail pops, joint tape failure, or plasterboard pulling away.

🕳️ 2. Damage & Penetrations
• Holes or gaps: Any size hole that compromises the enclosure or fire separation must be documented.
• Water stains: Brown or yellow discoloration may indicate active or past leaks.
• IRC Reference: Ceiling must maintain fire separation and structural integrity (IRC §R302.6)

💧 3. Moisture & Mold Indicators
• Discoloration: Look for streaks, rings, or bubbling paint.
• Odor: Musty smells may suggest hidden mold.

🔥 4. Fire Safety Integration
• Sprinkler heads: Confirm they are unobstructed and properly mounted.
• Smoke detectors: If ceiling-mounted, verify presence and operability.
• Penetrations: Ensure any ceiling penetrations are sealed with fire-rated materials.
• IRC Reference: Fire-rated assemblies must be intact (IRC §R302.11)

💡 5. Lighting & Electrical
• Ceiling fixtures: Check for secure mounting, exposed wiring, or flickering lights.
• Recessed lighting: Inspect trim rings and insulation contact rating.

🧠 6. Accessibility & IBU Overlay
• Clearance: Ensure ceiling height meets minimum IRC requirement (IRC §R305.1: ≥7 feet)
• Labeling: If the ceiling contains access panels (e.g., attic), confirm labeling and unobstructed access.
• IBU Local Codes: May require enhanced fireproofing or acoustic treatment in shared spaces`
        },
        {
            id: 'ceiling_3',
            name: 'The ceiling has an unstable surface (bulging, buckling).',
            detail: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category deficiency.',
            criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'CEILING-03',
            codeReference: `🔍 1. Visual Condition Assessment
• Scan entire surface: Look for sagging, bubbling, cracks, or loose panels.
• Material separation: Identify nail pops, joint tape failure, or plasterboard pulling away.

🕳️ 2. Damage & Penetrations
• Holes or gaps: Any size hole that compromises the enclosure or fire separation must be documented.
• Water stains: Brown or yellow discoloration may indicate active or past leaks.
• IRC Reference: Ceiling must maintain fire separation and structural integrity (IRC §R302.6)

💧 3. Moisture & Mold Indicators
• Discoloration: Look for streaks, rings, or bubbling paint.
• Odor: Musty smells may suggest hidden mold.

🔥 4. Fire Safety Integration
• Sprinkler heads: Confirm they are unobstructed and properly mounted.
• Smoke detectors: If ceiling-mounted, verify presence and operability.
• Penetrations: Ensure any ceiling penetrations are sealed with fire-rated materials.
• IRC Reference: Fire-rated assemblies must be intact (IRC §R302.11)

💡 5. Lighting & Electrical
• Ceiling fixtures: Check for secure mounting, exposed wiring, or flickering lights.
• Recessed lighting: Inspect trim rings and insulation contact rating.

🧠 6. Accessibility & IBU Overlay
• Clearance: Ensure ceiling height meets minimum IRC requirement (IRC §R305.1: ≥7 feet)
• Labeling: If the ceiling contains access panels (e.g., attic), confirm labeling and unobstructed access.
• IBU Local Codes: May require enhanced fireproofing or acoustic treatment in shared spaces`
        }
    ]
};

export const CEILING_DEFICIENCIES = {
    category: '4. Ceiling',
    items: [CEILING]
};

// ==========================================
// 5. CHIMNEY
// ==========================================

export const CHIMNEY: UnitItemDeficiencies = {
    itemName: 'Chimney',
    deficiencies: [
        {
            id: 'chimney_1',
            name: 'Visually accessible and observed.',
            detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
            criteria: 'Fireplace or fire burning appliance is not intentionally decommissioned.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'CHIMNEY-01',
            codeReference: `🔍 1. Visual Identification
• Locate chimney: Identify visible chimney stack, flue, or firebox connected to a fireplace or wood-burning appliance.
• Type: Note whether it's masonry, metal, or factory-built.
• Ventless units: Exclude from chimney inspection per NSPIRE protocol

🧱 2. Structural Integrity
• Exterior signs: Look for leaning, separation from the building, or cracked masonry.
• Brick/block condition: Check for missing, spalling, or loose units.
• Flue alignment: Confirm chimney is vertically aligned and not collapsing.

🔥 3. Containment & Venting
• Flue condition: Inspect for cracks, holes, or missing lining.
• Creosote stains: Look for seepage through masonry—indicates failed lining.
• Firebox connection: Confirm a secure and complete connection between the firebox and the flue.

🧯 4. Clearances & Fire Safety (IRC §R1001.11, §R1003.18)
• Roof clearance: Chimney must extend ≥3 feet above roof and ≥2 feet above any point within 10 feet.
• Combustible materials: Check for improper contact with wood framing or trim.
• Anchorage: Confirm seismic straps or bracing if required by IBU overlay.

🧪 5. Functional Components
• Cap & spark arrestor: Ensure chimney cap is present and intact.
• Cleanout door: If accessible, inspect for secure closure and signs of blockage.
• Damper: If visible, verify operability and seal.

🧠 6. Accessibility & IBU Overlay
• Inspection access: Confirm that chimney components are visually accessible without tools or disassembly.
• Labeling: If the chimney serves multiple units or systems, ensure proper identification.
• IBU Local Codes: May require enhanced seismic anchoring, fireproofing, or maintenance logs`
        }
    ]
};

export const CHIMNEY_DEFICIENCIES = {
    category: '5. Chimney',
    items: [CHIMNEY]
};

// ==========================================
// 6. CLOTHES DRYER EXHAUST VENTILATION
// ==========================================

export const CLOTHES_DRYER_EXHAUST: UnitItemDeficiencies = {
    itemName: 'Clothes Dryer Exhaust Ventilation',
    deficiencies: [
        {
            id: 'dryer_1',
            name: 'Dryer transition duct is constructed of unsuitable material.',
            detail: 'Dryer transition duct is not constructed of metal or an approved material.',
            criteria: 'Dryer is being used indoor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-01',
            codeReference: `🔍 1. Locate and Identify System Type
• Dryer type: Electric or gas (gas requires combustion venting)
• Vent type: Rigid metal duct, flexible aluminum, or transition duct
• Termination point: Exterior wall or roof vent (must discharge outdoors per IRC §M1501.1)

🧩 2. Transition Duct Inspection
• Presence: Confirm duct is attached from dryer to wall/floor exhaust port
• Material: Must be UL-listed metal or aluminum—no plastic or foil
• Secure connection: Check clamps or fasteners at both ends

💨 3. Airflow & Obstruction Check
• Visual scan: Look for lint buildup around the duct or the floor
• Airflow test: Run the dryer briefly and feel for exhaust at the termination point
• Backdraft damper: Confirm presence at exterior vent (IRC §M1502.3)

🧱 4. Exterior Vent Termination (IRC §M1502.3)
• Location: Must be ≥3 feet from windows, doors, or other openings
• Cover condition: Check for missing cap, broken louvers, or pest intrusion
• No screens allowed: IRC prohibits screens that trap lint

🔥 5. Fire Safety & IRC Compliance
• Duct length: Max 35 feet (IRC §M1502.4.6), reduced for bends
• Joints: Must be mechanically fastened and airflow-directional (IRC §M1502.4.2)
• No shared systems: Dryer exhaust must be independent (IRC §M1502.2)
• IBU Overlay: May require enhanced fireproofing or annual cleaning logs

🧠 6. Accessibility & Labeling
• Reachability: Ensure duct and vent are visually accessible without tools
• Signage: If the vent serves multiple dryers, confirm labeling or zone identification
• IBU Local Codes: May require inspection access panels or fire-rated enclosure`
        },
        {
            id: 'dryer_2',
            name: 'Electrical dryer exhaust ventilation has restricted airflow.',
            detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-02',
            codeReference: `🔍 1. Locate and Identify System Type
• Dryer type: Electric or gas (gas requires combustion venting)
• Vent type: Rigid metal duct, flexible aluminum, or transition duct
• Termination point: Exterior wall or roof vent (must discharge outdoors per IRC §M1501.1)

🧩 2. Transition Duct Inspection
• Presence: Confirm duct is attached from dryer to wall/floor exhaust port
• Material: Must be UL-listed metal or aluminum—no plastic or foil
• Secure connection: Check clamps or fasteners at both ends

💨 3. Airflow & Obstruction Check
• Visual scan: Look for lint buildup around the duct or the floor
• Airflow test: Run the dryer briefly and feel for exhaust at the termination point
• Backdraft damper: Confirm presence at exterior vent (IRC §M1502.3)

🧱 4. Exterior Vent Termination (IRC §M1502.3)
• Location: Must be ≥3 feet from windows, doors, or other openings
• Cover condition: Check for missing cap, broken louvers, or pest intrusion
• No screens allowed: IRC prohibits screens that trap lint

🔥 5. Fire Safety & IRC Compliance
• Duct length: Max 35 feet (IRC §M1502.4.6), reduced for bends
• Joints: Must be mechanically fastened and airflow-directional (IRC §M1502.4.2)
• No shared systems: Dryer exhaust must be independent (IRC §M1502.2)
• IBU Overlay: May require enhanced fireproofing or annual cleaning logs

🧠 6. Accessibility & Labeling
• Reachability: Ensure duct and vent are visually accessible without tools
• Signage: If the vent serves multiple dryers, confirm labeling or zone identification
• IBU Local Codes: May require inspection access panels or fire-rated enclosure`
        },
        {
            id: 'dryer_3',
            name: 'Electric dryer transition duct is detached or missing.',
            detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-03',
            codeReference: `🔍 1. Locate and Identify System Type
• Dryer type: Electric or gas (gas requires combustion venting)
• Vent type: Rigid metal duct, flexible aluminum, or transition duct
• Termination point: Exterior wall or roof vent (must discharge outdoors per IRC §M1501.1)

🧩 2. Transition Duct Inspection
• Presence: Confirm duct is attached from dryer to wall/floor exhaust port
• Material: Must be UL-listed metal or aluminum—no plastic or foil
• Secure connection: Check clamps or fasteners at both ends

💨 3. Airflow & Obstruction Check
• Visual scan: Look for lint buildup around the duct or the floor
• Airflow test: Run the dryer briefly and feel for exhaust at the termination point
• Backdraft damper: Confirm presence at exterior vent (IRC §M1502.3)

🧱 4. Exterior Vent Termination (IRC §M1502.3)
• Location: Must be ≥3 feet from windows, doors, or other openings
• Cover condition: Check for missing cap, broken louvers, or pest intrusion
• No screens allowed: IRC prohibits screens that trap lint

🔥 5. Fire Safety & IRC Compliance
• Duct length: Max 35 feet (IRC §M1502.4.6), reduced for bends
• Joints: Must be mechanically fastened and airflow-directional (IRC §M1502.4.2)
• No shared systems: Dryer exhaust must be independent (IRC §M1502.2)
• IBU Overlay: May require enhanced fireproofing or annual cleaning logs

🧠 6. Accessibility & Labeling
• Reachability: Ensure duct and vent are visually accessible without tools
• Signage: If the vent serves multiple dryers, confirm labeling or zone identification
• IBU Local Codes: May require inspection access panels or fire-rated enclosure`
        },
        {
            id: 'dryer_4',
            name: 'Gas dryer exhaust ventilation system has restricted airflow.',
            detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-04',
            codeReference: `🔍 1. Locate and Identify System Type
• Dryer type: Electric or gas (gas requires combustion venting)
• Vent type: Rigid metal duct, flexible aluminum, or transition duct
• Termination point: Exterior wall or roof vent (must discharge outdoors per IRC §M1501.1)

🧩 2. Transition Duct Inspection
• Presence: Confirm duct is attached from dryer to wall/floor exhaust port
• Material: Must be UL-listed metal or aluminum—no plastic or foil
• Secure connection: Check clamps or fasteners at both ends

💨 3. Airflow & Obstruction Check
• Visual scan: Look for lint buildup around the duct or the floor
• Airflow test: Run the dryer briefly and feel for exhaust at the termination point
• Backdraft damper: Confirm presence at exterior vent (IRC §M1502.3)

🧱 4. Exterior Vent Termination (IRC §M1502.3)
• Location: Must be ≥3 feet from windows, doors, or other openings
• Cover condition: Check for missing cap, broken louvers, or pest intrusion
• No screens allowed: IRC prohibits screens that trap lint

🔥 5. Fire Safety & IRC Compliance
• Duct length: Max 35 feet (IRC §M1502.4.6), reduced for bends
• Joints: Must be mechanically fastened and airflow-directional (IRC §M1502.4.2)
• No shared systems: Dryer exhaust must be independent (IRC §M1502.2)
• IBU Overlay: May require enhanced fireproofing or annual cleaning logs

🧠 6. Accessibility & Labeling
• Reachability: Ensure duct and vent are visually accessible without tools
• Signage: If the vent serves multiple dryers, confirm labeling or zone identification
• IBU Local Codes: May require inspection access panels or fire-rated enclosure`
        },
        {
            id: 'dryer_5',
            name: 'Gas dryer transition duct is detached or missing',
            detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-05',
            codeReference: `🔍 1. Locate and Identify System Type
• Dryer type: Electric or gas (gas requires combustion venting)
• Vent type: Rigid metal duct, flexible aluminum, or transition duct
• Termination point: Exterior wall or roof vent (must discharge outdoors per IRC §M1501.1)

🧩 2. Transition Duct Inspection
• Presence: Confirm duct is attached from dryer to wall/floor exhaust port
• Material: Must be UL-listed metal or aluminum—no plastic or foil
• Secure connection: Check clamps or fasteners at both ends

💨 3. Airflow & Obstruction Check
• Visual scan: Look for lint buildup around the duct or the floor
• Airflow test: Run the dryer briefly and feel for exhaust at the termination point
• Backdraft damper: Confirm presence at exterior vent (IRC §M1502.3)

🧱 4. Exterior Vent Termination (IRC §M1502.3)
• Location: Must be ≥3 feet from windows, doors, or other openings
• Cover condition: Check for missing cap, broken louvers, or pest intrusion
• No screens allowed: IRC prohibits screens that trap lint

🔥 5. Fire Safety & IRC Compliance
• Duct length: Max 35 feet (IRC §M1502.4.6), reduced for bends
• Joints: Must be mechanically fastened and airflow-directional (IRC §M1502.4.2)
• No shared systems: Dryer exhaust must be independent (IRC §M1502.2)
• IBU Overlay: May require enhanced fireproofing or annual cleaning logs

🧠 6. Accessibility & Labeling
• Reachability: Ensure duct and vent are visually accessible without tools
• Signage: If the vent serves multiple dryers, confirm labeling or zone identification
• IBU Local Codes: May require inspection access panels or fire-rated enclosure`
        }
    ]
};

export const CLOTHES_DRYER_DEFICIENCIES = {
    category: '6. Clothes Dryer Exhaust Ventilation',
    items: [CLOTHES_DRYER_EXHAUST]
};

// ==========================================
// 7. DOOR
// ==========================================

export const DOOR_ENTRY: UnitItemDeficiencies = {



    itemName: 'Door - Entry',
    deficiencies: [
        {
            id: 'door_entry_1',
            name: 'Entry door cannot be secured.',
            detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Installed locks can not be engaged from both sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'DOOR-ENTRY-01',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_2',
            name: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            detail: 'Entry door component is inoperable, damaged or missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'DOOR-ENTRY-02',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_3',
            name: 'The entry door frame, threshold, or trim is damaged.',
            detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
            criteria: 'Observed evidence of prior installation, now missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-03',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_4',
            name: 'Entry door is missing',
            detail: 'Evidence of prior installation',
            criteria: 'Not present or is incomplete.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-ENTRY-04',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_5',
            name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            criteria: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-05',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_6',
            name: 'The self-closing mechanism is deficient if it is damaged, missing, or fails to fully close the door and engage the latch.',
            detail: 'The self-closing mechanism is deficient if it is damaged, missing, or fails to fully close the door and engage the latch.',
            criteria: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-06',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_7',
            name: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
            detail: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
            criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-07',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_8',
            name: 'Entry door does not close (i.e., door seats in frame).',
            detail: 'Entry door does not close (i.e., door seats in frame).',
            criteria: 'Entry door does not close (i.e., door seats in frame).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-ENTRY-08',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_9',
            name: 'Entry door will not open.',
            detail: 'Entry door will not open.',
            criteria: 'Entry door does not open.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-09',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        },
        {
            id: 'door_entry_10',
            name: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
            detail: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
            criteria: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-10',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        }
    ]
};

export const DOOR_FIRE_LABELED: UnitItemDeficiencies = {
    itemName: 'Door – Fire Labeled',
    deficiencies: [
        {
            id: 'door_fire_1',
            name: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
            detail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
            criteria: 'An object is present that may prevent the fire-labeled door from closing and latching. Or An object is present that may prevent the fire-labeled door from self-closing and latching.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-01',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_2',
            name: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged such that its integrity may be compromised.',
            detail: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
            criteria: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged such that its integrity may be compromised.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-02',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_3',
            name: 'Fire-labeled door that serves as an entry door cannot be secured by at least one installed lock.',
            detail: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Fire-labeled door that serves as an entry door cannot be secured by at least one installed lock.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-03',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_4',
            name: 'Fire-labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
            detail: 'Fire-labeled door does not close and latch. OR fire-labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
            criteria: 'Fire-labeled door does not close and latch. OR fire-labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-04',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_5',
            name: 'Fire-labeled door does not open, which that it may limit access between spaces.',
            detail: 'Fire-labeled door does not open, which that it may limit access between spaces.',
            criteria: 'Fire-labeled door does not open such that it may limit access between spaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-05',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_6',
            name: 'Fire-labeled door is missing.',
            detail: 'Fire-labeled door is missing. (i.e., Evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Fire-labeled door is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DOOR-FIRE-06',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        },
        {
            id: 'door_fire_7',
            name: 'Fire - labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing.',
            detail: 'Fire - labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Fire-labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-FIRE-07',
            codeReference: `🔍 1. Door Identification
• Label location: Look for a metal fire label or plug on the door edge (between hinges) or frame.
• If label is missing: Treat as fire-rated if connected to a rated corridor, stairwell, or mechanical room.
• NSPIRE Note: Label absence does not exempt inspection—evaluate based on location and function.

🚪 2. Operability
• Open test: Door must open fully without obstruction or excessive force.
• Close test: Door must close completely and latch securely.

🔒 3. Self-Closing Hardware
• Presence: Required if evidence of prior installation (e.g., mounting holes).
• Functionality: Door must self-close and latch without manual assistance.

🧱 4. Surface & Structural Integrity
• Holes or damage: Any hole or structural damage that compromises fire containment.
• Rust: ≥25% surface rust is a Severe deficiency.
• Broken glass: If the vision panel is cracked or missing, cite as Severe.

🧼 5. Seal & Gasket Condition
• Inspect perimeter: Look for missing, torn, or compressed fire-rated seals.
• Light test: Shine flashlight around edges—light leakage may indicate seal failure.

🚫 6. Obstructions & Improper Use
• Held open: Door propped with wedge, trash can, or kick-down stop.
• Blocked path: Furniture or objects preventing full swing or closure.`
        }
    ]
};

export const DOOR_GENERAL: UnitItemDeficiencies = {
    itemName: 'Door-General',
    deficiencies: [
        {
            id: 'door_general_1',
            name: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
            detail: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
            criteria: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'DOOR-GEN-01',
            codeReference: `🧭 Step 1: Identify Doors to Inspect
Focus on non-fire-rated, non-entry doors in common areas such as:
NSPIRE defines "general doors" as any door not classified as entry, fire-labeled, or emergency exit.

🔍 Step 2: Operability
• IRC (2021) – §R311, §R312, §R302.5
• IBU overlays – Local fire, egress, and accessibility code

🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without excessive force
• Lock Test: Engage and disengage lock to verify security
• Seal Check: Inspect for daylight, drafts, or water intrusion around edges
• Surface Inspection: Look for cracks, holes, or peeling finish
• Frame Stability: Check for loose hinges, warped jambs, or misaligned thresholds

📏 Step 4: Accessibility & IBU Local Requirements
• Clear width: ≥32" clear opening per IRC §R311.2 and ADA standards.
• Operable parts: Must be usable with one hand, no tight grasping.
• IBU Overlay: May require panic hardware, visual signage, or audible alerts

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R311.2–R311.3:
• Doors must permit safe egress and be operable from inside without a key
• IRC R703.4: Flashing is required to prevent water intrusion at door openings
• IRC R612.3: Exterior doors must be tested and labeled for structural performance
• IRC R317.1: Moisture-prone doors must use decay-resistant materials`
        },
        {
            id: 'door_general_2',
            name: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
            detail: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open. A passage door does not open, which may limit access when needed.',
            criteria: 'A passage door does not open such that it may limit access when needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-GEN-02',
            codeReference: `🧭 Step 1: Identify Doors to Inspect
Focus on non-fire-rated, non-entry doors in common areas such as:
NSPIRE defines "general doors" as any door not classified as entry, fire-labeled, or emergency exit.

🔍 Step 2: Operability
• IRC (2021) – §R311, §R312, §R302.5
• IBU overlays – Local fire, egress, and accessibility code

🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without excessive force
• Lock Test: Engage and disengage lock to verify security
• Seal Check: Inspect for daylight, drafts, or water intrusion around edges
• Surface Inspection: Look for cracks, holes, or peeling finish
• Frame Stability: Check for loose hinges, warped jambs, or misaligned thresholds

📏 Step 4: Accessibility & IBU Local Requirements
• Clear width: ≥32" clear opening per IRC §R311.2 and ADA standards.
• Operable parts: Must be usable with one hand, no tight grasping.
• IBU Overlay: May require panic hardware, visual signage, or audible alerts

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R311.2–R311.3:
• Doors must permit safe egress and be operable from inside without a key
• IRC R703.4: Flashing is required to prevent water intrusion at door openings
• IRC R612.3: Exterior doors must be tested and labeled for structural performance
• IRC R317.1: Moisture-prone doors must use decay-resistant materials`
        },
        {
            id: 'door_general_3',
            name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            detail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            criteria: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'DOOR-GEN-03',
            codeReference: `🧭 Step 1: Identify Doors to Inspect
Focus on non-fire-rated, non-entry doors in common areas such as:
NSPIRE defines "general doors" as any door not classified as entry, fire-labeled, or emergency exit.

🔍 Step 2: Operability
• IRC (2021) – §R311, §R312, §R302.5
• IBU overlays – Local fire, egress, and accessibility code

🧪 Step 3: Functional Testing
• Open/Close Test: Confirm smooth operation without excessive force
• Lock Test: Engage and disengage lock to verify security
• Seal Check: Inspect for daylight, drafts, or water intrusion around edges
• Surface Inspection: Look for cracks, holes, or peeling finish
• Frame Stability: Check for loose hinges, warped jambs, or misaligned thresholds

📏 Step 4: Accessibility & IBU Local Requirements
• Clear width: ≥32" clear opening per IRC §R311.2 and ADA standards.
• Operable parts: Must be usable with one hand, no tight grasping.
• IBU Overlay: May require panic hardware, visual signage, or audible alerts

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R311.2–R311.3:
• Doors must permit safe egress and be operable from inside without a key
• IRC R703.4: Flashing is required to prevent water intrusion at door openings
• IRC R612.3: Exterior doors must be tested and labeled for structural performance
• IRC R317.1: Moisture-prone doors must use decay-resistant materials`
        }
    ]
};

export const DOOR_GARAGE: UnitItemDeficiencies = {
    itemName: 'Garage Door',
    deficiencies: [
        {
            id: 'door_garage_1',
            name: 'Garage door does not open, close, or remains closed.',
            detail: 'Garage door does not open, close, or remains closed.',
            criteria: 'Door will not open and remain open, does not function adequately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-GARAGE-01',
            codeReference: `🧭 Step 1: Identify Garage Door Type and Location
Inspect all permanently installed garage doors in common areas such as:
NSPIRE applies to both manual and motorized garage doors serving residential buildings or shared-use areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a garage door as deficient if it cannot reliably open, close, or protect the interior from outside elements.

🧪 Step 3: Functional Testing
• Manual Operation Test: Lift or lower the door to confirm smooth movement and balance
• Motorized Test: Use the wall switch or remote to activate the door (if applicable)
• Latch & Lock Check: Confirm the door can be secured when closed
• Panel & Track Inspection: Look for misalignment, rust, or missing rollers
• Weather Seal Check: Inspect bottom and side seals for gaps or deterioration
If the motor is present, it must function as intended—even if manual operation is possible.

📏 Step 4: Accessibility & IBU Local Requirements
• Manual override: Confirm that motorized doors have accessible manual release.
• Signage: Emergency exit signage may be required in shared garages.
• IBU Local Codes: May require seismic bracing, panic hardware, or inspection access panels

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R309.4: Garage doors must be equipped with automatic reversal if motorized
• IRC R302.5.1: Doors between the garage and the dwelling must be fire-rated and self-closing
• IRC M1307.3: Mechanical equipment must not interfere with door operation
• IRC R703.4: Flashing is required to prevent water intrusion at door openings
IRC ensures garage doors are safe, secure, and compliant with fire and mechanical codes`
        },
        {
            id: 'door_garage_2',
            name: 'The garage door has a hole (broken panel or window).',
            detail: 'The garage door has a hole (broken panel or window).',
            criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-GARAGE-02',
            codeReference: `🧭 Step 1: Identify Garage Door Type and Location
Inspect all permanently installed garage doors in common areas such as:
NSPIRE applies to both manual and motorized garage doors serving residential buildings or shared-use areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a garage door as deficient if it cannot reliably open, close, or protect the interior from outside elements.

🧪 Step 3: Functional Testing
• Manual Operation Test: Lift or lower the door to confirm smooth movement and balance
• Motorized Test: Use the wall switch or remote to activate the door (if applicable)
• Latch & Lock Check: Confirm the door can be secured when closed
• Panel & Track Inspection: Look for misalignment, rust, or missing rollers
• Weather Seal Check: Inspect bottom and side seals for gaps or deterioration
If the motor is present, it must function as intended—even if manual operation is possible.

📏 Step 4: Accessibility & IBU Local Requirements
• Manual override: Confirm that motorized doors have accessible manual release.
• Signage: Emergency exit signage may be required in shared garages.
• IBU Local Codes: May require seismic bracing, panic hardware, or inspection access panels

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R309.4: Garage doors must be equipped with automatic reversal if motorized
• IRC R302.5.1: Doors between the garage and the dwelling must be fire-rated and self-closing
• IRC M1307.3: Mechanical equipment must not interfere with door operation
• IRC R703.4: Flashing is required to prevent water intrusion at door openings
IRC ensures garage doors are safe, secure, and compliant with fire and mechanical codes`
        },



    ]
};

export const DOOR_ENTRY_CANNOT_BE_SECURED: UnitItemDeficiencies = {
    itemName: 'Entry door - Cannot be Secured',
    deficiencies: [
        {
            id: 'Entry_door_1',
            name: 'Entry door cannot be secured.',
            detail: 'Entry door cannot be secured.',
            criteria: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'DOOR-ENTRY-SEC-01',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        }
    ]
};

export const DOOR_ENTRY_COMPONENT_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Entry door - Component Damaged or Missing',
    deficiencies: [
        {
            id: 'Entry_door_2',
            name: 'Entry door component is damaged, inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            detail: 'Entry door component is inoperable, damaged or missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            criteria: 'Entry door component is inoperable, damaged or missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            severity: 'Low',
            repairBy: '30 Day',
            points: '2.20/n',
            code: 'DOOR-ENTRY-COMP-01',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        }
    ]
};

export const DOOR_ENTRY_FRAME_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Entry door - Frame, Threshold, or Trim Damaged',
    deficiencies: [
        {
            id: 'Entry_door_4',
            name: 'The entry door frame, threshold, or trim is damaged.',
            detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
            criteria: 'Entry door frame, threshold, or trim is damaged or missing such that it impacts functionality.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-FRAME-01',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        }
    ]
};

export const DOOR_ENTRY_MISSING: UnitItemDeficiencies = {
    itemName: 'Entry door - Missing',
    deficiencies: [
        {
            id: 'Entry_door_3',
            name: 'Entry door is missing.',
            detail: 'Entry door is missing. Evidence of prior installation.',
            criteria: 'Entry door is not present or is incomplete (evidence of prior installation).',
            severity: 'Severe',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'DOOR-ENTRY-MISS-01',
            codeReference: `🔍 1. Door Functionality
• Open test: Confirm the door opens fully without sticking or obstruction.
• Close test: Release the door—must close completely and latch securely.

🔒 2. Security & Hardware
• Lock operability: Check that the door can be locked and unlocked without excessive force.
• Self-closing mechanism: Required for fire-rated doors—verify it functions properly.

🧱 3. Physical Condition
• Surface damage: Look for holes, splits, or cracks that penetrate the door slab.
• Delamination: Check for peeling veneer or separated layers ≥2 inches.
• Frame & threshold: Inspect for missing trim, loose sill plates, or warped jambs.

🌬️ 4. Weatherproofing & Seal Integrity
• Gasket/seal: Inspect for gaps >¼", light penetration, or water intrusion.
• Sweep/threshold: Confirm the bottom seal is intact and not allowing drafts or pests.

🔥 5. Fire-Rated Assembly (IRC §R302.5, NSPIRE Fire Overlay)
• Label check: Look for a fire-rating label on the door edge or frame.
• Integrity: Ensure no penetrations, warping, or missing components.
• Self-closing: Mandatory for fire-rated doors—must latch automatically.

🧠 6. Accessibility & IBU Overlay
• Clear width: Minimum 32" clear opening per ADA and IRC §R311.2
• Handle height: 34–48" AFF, operable with one hand, no tight grasping
• IBU Local Codes: May require panic hardware, visual signage, or audible alerts`
        }
    ]
};
export const DOOR_DEFICIENCIES = {
    category: '7. Door',
    items: [DOOR_ENTRY, DOOR_FIRE_LABELED, DOOR_GENERAL, DOOR_GARAGE,
        DOOR_ENTRY_CANNOT_BE_SECURED, DOOR_ENTRY_COMPONENT_DAMAGED,
        DOOR_ENTRY_FRAME_DAMAGED, DOOR_ENTRY_MISSING]
};



// ==========================================
// 8. DRAINAGE
// ==========================================

export const DRAINAGE: UnitItemDeficiencies = {
    itemName: 'Drainage',
    deficiencies: [
        {
            id: 'drainage_1',
            name: 'Drain/Floor drain.',
            detail: 'The drain is fully blocked. Or there is a problem with the drainage.',
            criteria: 'The drain is fully blocked. Or there is a problem with the drainage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DRAIN-01',
            codeReference: `🧭 Step 1: Identify Drainage Components
Inspect all drainage systems serving the unit or common area:
• Floor drains, sink drains, shower/tub drains, and exterior area drains
• Confirm drainage is connected and intended to carry water away from the unit

🔍 Step 2: Visual Condition Assessment
• Look for standing water, slow drainage, or signs of backup
• Check for water stains, mold, or damage near drainage points

🧪 Step 3: Functional Testing
• Water flow test: Pour water near the drain and confirm it flows freely
• Standing water check: Look for pooling that indicates blockage or poor slope
• Obstruction check: Confirm drain openings are free of debris or buildup

📏 Step 4: Accessibility & IBU Considerations
• Drain covers must be flush and secured to prevent trip hazards
• Drains must not obstruct accessible routes

⚒️ Step 5: IRC Requirements
• IRC P3005: Drainage systems must be properly sloped and connected
• IRC P3201: Floor drains must be properly trapped and vented`
        }
    ]
};

export const DRAINAGE_DEFICIENCIES = {
    category: '8. Drainage',
    items: [DRAINAGE]
};

// ==========================================
// 9. EGRESS
// ==========================================

export const EGRESS: UnitItemDeficiencies = {
    itemName: 'Egress',
    deficiencies: [
        {
            id: 'egress_1',
            name: 'Obstructed means of egress',
            detail: 'The exit access or exit is obstructed. 1. Exit access - path from any interior location to an exit. 2. Exit doors to the outside and enclosed exit stairways. Double-key cylinder deadbolts, or security features that require a key, a tool, or special effort from the inside to the exterior (street side), are not allowed',
            criteria: 'Double-key Cylinder deadbolt locks or security features requiring a key, tool, or special effort from the stress side are not allowed on exit doors, exit access doors, or egress windows. Fixed or movable security bars must not block designated egress points, and no furniture or items may obstruct the means of egress.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'EGRESS-01',
            codeReference: `🧭 Step 1: Identify Egress Components
• Primary elements: Exit doors, corridors, stairwells, ramps, fire escapes, and discharge paths to the public way
• Egress path: Must be continuous, unobstructed, and lead to a safe exterior location

🔍 Step 2: Visual Condition Assessment
Any obstruction that prevents a resident from exiting quickly and safely is considered a critical safety violation

🧪 Step 3: Functional Testing
• Exit Door Operation: Open the door from inside without a key, a tool, or special knowledge
• Pathway Clearance: Walk the whole route from interior to public way; confirm no obstructions
• Signage Visibility: Check that exit signs are illuminated and visible from all approach angles
• Lighting Test: Confirm emergency lights activate (if test switch is available)
• Fire Escape Access: Ensure ladder or stairs are reachable and structurally sound
• IBU overlays – Local fire, accessibility, and emergency exit code

📏 Step 4: Accessibility & IBU Local Requirements
• Clear width: Minimum 36" for corridors, 32" for doors (IRC §R311.2)
• Thresholds: ≤½" for accessible routes
• IBU Overlay: May require audible exit alerts, tactile signage, or seismic bracing

⚒️ Step 5: IRC Egress Requirements
• IRC (2021) §R311.1–R311.4 – Means of egress.
IRC ensures that egress systems are structurally sound, code-compliant, and safe for emergencies.`
        }
    ]
};

export const EGRESS_DEFICIENCIES = {
    category: '9. Egress',
    items: [EGRESS]
};

// ==========================================
// 10. ELECTRICAL
// ==========================================

export const ELECTRICAL_CONDUCTOR: UnitItemDeficiencies = {
    itemName: 'Conductor-Outlet, and Switch',
    deficiencies: [
        {
            id: 'elec_conductor_1',
            name: 'The electrical conductor is not enclosed or properly insulated.',
            detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
            criteria: 'Electrical conductors must be enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2"; missing light bulbs are evaluated under interior or exterior lighting.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'ELEC-COND-01',
            codeReference: `🧭 Step 1: Identify Electrical Components to Inspect
Inspect all visible and accessible electrical systems in common areas, including:
NSPIRE requires inspection of high-voltage electrical components. Low-voltage systems (e.g., phone, cable) are excluded.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines any exposed or improperly enclosed conductor as a critical hazard, regardless of location.

🧪 Step 3: Functional Testing
• Outlets: Use a UL-listed outlet tester to verify:
• Proper wiring
• Grounding
• Polarity
• Switch Test: Toggle each switch to confirm it controls the intended fixture or outlet
• Conductor Inspection: Look for visible wires outside of conduit or junction boxes
• Confirm wire nuts or caps are present on terminated conductors
Inoperable outlets or switches without visible damage are still cited under NSPIRE's electrical standards.

📏 Step 4: Accessibility & IBU Local Requirements
• Height compliance: Switches and outlets should be within ADA reach range (typically 15–48" AFF).
• Tamper-resistant outlets: Required in child-accessible areas per IRC §E4002.14.
• IBU Overlay: May require labeling, surge protection, or enhanced grounding in shared-use zones

⚒️ Step 5: IRC Electrical Requirements Proximity to Water Sources (IRC §E3902.6, NSPIRE)
• Wet zones: Outlets within 6 feet of sinks, tubs, or laundry equipment must be GFCI-protected.`
        },
        {
            id: 'elec_conductor_2',
            name: 'The outlet (reasonably accessible) shows no visible damage, and testing indicates it is not energized.',
            detail: 'The outlet (reasonably accessible) shows no visible damage, and testing indicates it is not energized.',
            criteria: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-COND-02',
            codeReference: `🧭 Step 1: Identify Electrical Components to Inspect
Inspect all visible and accessible electrical systems in common areas, including:
NSPIRE requires inspection of high-voltage electrical components. Low-voltage systems (e.g., phone, cable) are excluded.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines any exposed or improperly enclosed conductor as a critical hazard, regardless of location.

🧪 Step 3: Functional Testing
• Outlets: Use a UL-listed outlet tester to verify:
• Proper wiring
• Grounding
• Polarity
• Switch Test: Toggle each switch to confirm it controls the intended fixture or outlet
• Conductor Inspection: Look for visible wires outside of conduit or junction boxes
• Confirm wire nuts or caps are present on terminated conductors
Inoperable outlets or switches without visible damage are still cited under NSPIRE's electrical standards.

📏 Step 4: Accessibility & IBU Local Requirements
• Height compliance: Switches and outlets should be within ADA reach range (typically 15–48" AFF).
• Tamper-resistant outlets: Required in child-accessible areas per IRC §E4002.14.
• IBU Overlay: May require labeling, surge protection, or enhanced grounding in shared-use zones

⚒️ Step 5: IRC Electrical Requirements Proximity to Water Sources (IRC §E3902.6, NSPIRE)
• Wet zones: Outlets within 6 feet of sinks, tubs, or laundry equipment must be GFCI-protected.`
        },
        {
            id: 'elec_conductor_3',
            name: 'The outlet or switch is damaged.',
            detail: 'The outlet or switch is damaged. (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
            criteria: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'ELEC-COND-03',
            codeReference: `🧭 Step 1: Identify Electrical Components to Inspect
Inspect all visible and accessible electrical systems in common areas, including:
NSPIRE requires inspection of high-voltage electrical components. Low-voltage systems (e.g., phone, cable) are excluded.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines any exposed or improperly enclosed conductor as a critical hazard, regardless of location.

🧪 Step 3: Functional Testing
• Outlets: Use a UL-listed outlet tester to verify:
• Proper wiring
• Grounding
• Polarity
• Switch Test: Toggle each switch to confirm it controls the intended fixture or outlet
• Conductor Inspection: Look for visible wires outside of conduit or junction boxes
• Confirm wire nuts or caps are present on terminated conductors
Inoperable outlets or switches without visible damage are still cited under NSPIRE's electrical standards.

📏 Step 4: Accessibility & IBU Local Requirements
• Height compliance: Switches and outlets should be within ADA reach range (typically 15–48" AFF).
• Tamper-resistant outlets: Required in child-accessible areas per IRC §E4002.14.
• IBU Overlay: May require labeling, surge protection, or enhanced grounding in shared-use zones

⚒️ Step 5: IRC Electrical Requirements Proximity to Water Sources (IRC §E3902.6, NSPIRE)
• Wet zones: Outlets within 6 feet of sinks, tubs, or laundry equipment must be GFCI-protected.`
        },
        {
            id: 'elec_conductor_4',
            name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            detail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            criteria: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-COND-04',
            codeReference: `🧭 Step 1: Identify Electrical Components to Inspect
Inspect all visible and accessible electrical systems in common areas, including:
NSPIRE requires inspection of high-voltage electrical components. Low-voltage systems (e.g., phone, cable) are excluded.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines any exposed or improperly enclosed conductor as a critical hazard, regardless of location.

🧪 Step 3: Functional Testing
• Outlets: Use a UL-listed outlet tester to verify:
• Proper wiring
• Grounding
• Polarity
• Switch Test: Toggle each switch to confirm it controls the intended fixture or outlet
• Conductor Inspection: Look for visible wires outside of conduit or junction boxes
• Confirm wire nuts or caps are present on terminated conductors
Inoperable outlets or switches without visible damage are still cited under NSPIRE's electrical standards.

📏 Step 4: Accessibility & IBU Local Requirements
• Height compliance: Switches and outlets should be within ADA reach range (typically 15–48" AFF).
• Tamper-resistant outlets: Required in child-accessible areas per IRC §E4002.14.
• IBU Overlay: May require labeling, surge protection, or enhanced grounding in shared-use zones

⚒️ Step 5: IRC Electrical Requirements Proximity to Water Sources (IRC §E3902.6, NSPIRE)
• Wet zones: Outlets within 6 feet of sinks, tubs, or laundry equipment must be GFCI-protected.`
        },
        {
            id: 'elec_conductor_5',
            name: 'Water is currently in contact with an electrical conductor.',
            detail: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'ELEC-COND-05',
            codeReference: `🧭 Step 1: Identify Electrical Components to Inspect
Inspect all visible and accessible electrical systems in common areas, including:
NSPIRE requires inspection of high-voltage electrical components. Low-voltage systems (e.g., phone, cable) are excluded.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines any exposed or improperly enclosed conductor as a critical hazard, regardless of location.

🧪 Step 3: Functional Testing
• Outlets: Use a UL-listed outlet tester to verify:
• Proper wiring
• Grounding
• Polarity
• Switch Test: Toggle each switch to confirm it controls the intended fixture or outlet
• Conductor Inspection: Look for visible wires outside of conduit or junction boxes
• Confirm wire nuts or caps are present on terminated conductors
Inoperable outlets or switches without visible damage are still cited under NSPIRE's electrical standards.

📏 Step 4: Accessibility & IBU Local Requirements
• Height compliance: Switches and outlets should be within ADA reach range (typically 15–48" AFF).
• Tamper-resistant outlets: Required in child-accessible areas per IRC §E4002.14.
• IBU Overlay: May require labeling, surge protection, or enhanced grounding in shared-use zones

⚒️ Step 5: IRC Electrical Requirements Proximity to Water Sources (IRC §E3902.6, NSPIRE)
• Wet zones: Outlets within 6 feet of sinks, tubs, or laundry equipment must be GFCI-protected.`
        }
    ]
};

export const ELECTRICAL_GFCI: UnitItemDeficiencies = {
    itemName: 'Electrical-(GFCI) Or (AFCI)-Outlet or Breaker',
    deficiencies: [
        {
            id: 'elec_gfci_1',
            name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-01',
            codeReference: `🧭 Step 1: Identify Applicable Locations
• IBU overlays – Local fire, shock hazard, and accessibility code
GFCI protects against electrical shock; AFCI protects against fire caused by arc faults. Both are required in specific zones per IRC and NSPIRE

🔍 Step 2: Visual Condition & Safety
• Faceplate: Check for cracks, missing covers, or exposed wiring.
• Burn marks: Look for discoloration or melted plastic.
• Loose mounting: Outlet or switch should not wiggle or shift.

🧪 Step 3: Functional Testing
• GFCI Outlet Test:
• Press the "Test" button → outlet should trip and stop power
• Press "Reset" → outlet should restore power
• Use a UL-listed outlet tester if buttons are inaccessible
• GFCI Breaker Test: If authorized, press the test button on the breaker. → circuit should trip
• Reset breaker to restore power
• AFCI Breaker Test: If authorized, press the test button → breaker should trip
• Reset to confirm functionality
If the outlet or breaker does not respond, it's cited as Severe under NSPIRE.

📏 Step 4: Accessibility & Local Requirement
• Reach range: Devices must be within ADA-compliant height (15–48" AFF).
• Tamper-resistant: Required in child-accessible areas (IRC §E4002.14).
• IBU Local Codes: May require inspection logs, signage, or seismic bracing.

⚒️ Step 5: IRC Electrical Requirements
• IRC E3902.1–E3902.11: GFCI required in wet/damp locations, including laundry, bathrooms, and outdoors
• IRC E3902.12–E3902.16: AFCI required in habitable rooms, including lounges and corridors
• IRC E4002.14: GFCI outlets must be readily accessible and labeled
• IRC E3906.8: Conductors must be enclosed and protected`
        },
        {
            id: 'elec_gfci_2',
            name: 'An unprotected outlet is present within six feet of a water source.',
            detail: 'An unprotected outlet is present within six feet of a water source. An outlet designed for major appliances, when in use, is not evaluated under this category.',
            criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-02',
            codeReference: `🧭 Step 1: Identify Applicable Locations
• IBU overlays – Local fire, shock hazard, and accessibility code
GFCI protects against electrical shock; AFCI protects against fire caused by arc faults. Both are required in specific zones per IRC and NSPIRE

🔍 Step 2: Visual Condition & Safety
• Faceplate: Check for cracks, missing covers, or exposed wiring.
• Burn marks: Look for discoloration or melted plastic.
• Loose mounting: Outlet or switch should not wiggle or shift.

🧪 Step 3: Functional Testing
• GFCI Outlet Test:
• Press the "Test" button → outlet should trip and stop power
• Press "Reset" → outlet should restore power
• Use a UL-listed outlet tester if buttons are inaccessible
• GFCI Breaker Test: If authorized, press the test button on the breaker. → circuit should trip
• Reset breaker to restore power
• AFCI Breaker Test: If authorized, press the test button → breaker should trip
• Reset to confirm functionality
If the outlet or breaker does not respond, it's cited as Severe under NSPIRE.

📏 Step 4: Accessibility & Local Requirement
• Reach range: Devices must be within ADA-compliant height (15–48" AFF).
• Tamper-resistant: Required in child-accessible areas (IRC §E4002.14).
• IBU Local Codes: May require inspection logs, signage, or seismic bracing.

⚒️ Step 5: IRC Electrical Requirements
• IRC E3902.1–E3902.11: GFCI required in wet/damp locations, including laundry, bathrooms, and outdoors
• IRC E3902.12–E3902.16: AFCI required in habitable rooms, including lounges and corridors
• IRC E4002.14: GFCI outlets must be readily accessible and labeled
• IRC E3906.8: Conductors must be enclosed and protected`
        },
        {
            id: 'elec_gfci_3',
            name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
            detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
            criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-03',
            codeReference: `🧭 Step 1: Identify Applicable Locations
• IBU overlays – Local fire, shock hazard, and accessibility code
GFCI protects against electrical shock; AFCI protects against fire caused by arc faults. Both are required in specific zones per IRC and NSPIRE

🔍 Step 2: Visual Condition & Safety
• Faceplate: Check for cracks, missing covers, or exposed wiring.
• Burn marks: Look for discoloration or melted plastic.
• Loose mounting: Outlet or switch should not wiggle or shift.

🧪 Step 3: Functional Testing
• GFCI Outlet Test:
• Press the "Test" button → outlet should trip and stop power
• Press "Reset" → outlet should restore power
• Use a UL-listed outlet tester if buttons are inaccessible
• GFCI Breaker Test: If authorized, press the test button on the breaker. → circuit should trip
• Reset breaker to restore power
• AFCI Breaker Test: If authorized, press the test button → breaker should trip
• Reset to confirm functionality
If the outlet or breaker does not respond, it's cited as Severe under NSPIRE.

📏 Step 4: Accessibility & Local Requirement
• Reach range: Devices must be within ADA-compliant height (15–48" AFF).
• Tamper-resistant: Required in child-accessible areas (IRC §E4002.14).
• IBU Local Codes: May require inspection logs, signage, or seismic bracing.

⚒️ Step 5: IRC Electrical Requirements
• IRC E3902.1–E3902.11: GFCI required in wet/damp locations, including laundry, bathrooms, and outdoors
• IRC E3902.12–E3902.16: AFCI required in habitable rooms, including lounges and corridors
• IRC E4002.14: GFCI outlets must be readily accessible and labeled
• IRC E3906.8: Conductors must be enclosed and protected`
        }
    ]
};

export const ELECTRICAL_SERVICE_PANEL: UnitItemDeficiencies = {
    itemName: 'Electrical Service Panel',
    deficiencies: [
        {
            id: 'elec_panel_1',
            name: 'Electrical service panel is not reasonably accessible.',
            detail: 'Electrical service panel is not reasonably accessible.',
            criteria: 'The electrical service panel is not reasonably accessible. Or it is locked or in locked location, no key to access.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEC-PANEL-01',
            codeReference: `🧭 Step 1: Identify Electrical Service Panel Locations
Inspect all main and sub-panels in shared-use areas. Panel must be reachable without moving furniture, appliances, or fixtures
🔍 Step 2: Cover & Enclosure Integrity
• 	Dead front cover: Must be securely fastened and undamaged
• 	Door function: Opens fully (≥90°) and closes without obstruction
• 	Gaps or missing knockouts: Must be sealed to prevent foreign object intrusion
🧪 Step 3: Functional Testing (Visual Only)
• 	Access Check: Confirm the panel can be opened without tools or moving heavy objects
• 	Cover & Labeling: Ensure a dead-front cover is present and breakers are labeled
• 	Breaker Condition: Look for signs of overheating, discoloration, or physical damage
• 	Moisture or Contamination: Inspect for rust, water stains, or mold inside the panel
• 	Conductor Safety: Confirm no exposed wires or missing knockouts
Do not operate breakers or remove covers unless qualified and authorized.
📏 Step 4: Accessibility & Local Requirements
• 	Height: Panel must be mounted ≤6'7" AFF to top breaker handle (IRC §E3405.3)
• 	Labeling: Circuit directory must be legible and accurate
• 	IBU Local Codes: May require seismic bracing, lockable covers, or inspection logs
⚒️ Step 5: IRC Electrical Requirements
Codes Referenced:
• 	IRC (2021) §E3401–E3405, §E3705–E3706 – Panelboards, overcurrent protection, conductor terminations
• 	IBU overlays – Local fire, shock hazard, and accessibility code`
        },
        {
            id: 'elec_panel_2',
            name: 'The overcurrent protection device is contaminated.',
            detail: 'The overcurrent protection device is contaminated. (e.g., water, rust, corrosion, infestation, or foreign materials, paint).',
            criteria: 'The overcurrent protection device is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-PANEL-02',
            codeReference: `🧭 Step 1: Identify Electrical Service Panel Locations
Inspect all main and sub-panels in shared-use areas. Panel must be reachable without moving furniture, appliances, or fixtures
🔍 Step 2: Cover & Enclosure Integrity
• 	Dead front cover: Must be securely fastened and undamaged
• 	Door function: Opens fully (≥90°) and closes without obstruction
• 	Gaps or missing knockouts: Must be sealed to prevent foreign object intrusion
🧪 Step 3: Functional Testing (Visual Only)
• 	Access Check: Confirm the panel can be opened without tools or moving heavy objects
• 	Cover & Labeling: Ensure a dead-front cover is present and breakers are labeled
• 	Breaker Condition: Look for signs of overheating, discoloration, or physical damage
• 	Moisture or Contamination: Inspect for rust, water stains, or mold inside the panel
• 	Conductor Safety: Confirm no exposed wires or missing knockouts
Do not operate breakers or remove covers unless qualified and authorized.
📏 Step 4: Accessibility & Local Requirements
• 	Height: Panel must be mounted ≤6'7" AFF to top breaker handle (IRC §E3405.3)
• 	Labeling: Circuit directory must be legible and accurate
• 	IBU Local Codes: May require seismic bracing, lockable covers, or inspection logs
⚒️ Step 5: IRC Electrical Requirements
Codes Referenced:
• 	IRC (2021) §E3401–E3405, §E3705–E3706 – Panelboards, overcurrent protection, conductor terminations
• 	IBU overlays – Local fire, shock hazard, and accessibility code`
        },
        {
            id: 'elec_panel_3',
            name: 'The overcurrent protection device is damaged.',
            detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged, impacts functionality of the circuit during an overcurrent (i.e., paint, or other foreign materials).',
            criteria: 'The overcurrent protection device is damaged such that it may not interrupt the circuit during an over current condition.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'ELEC-PANEL-03',
            codeReference: `🧭 Step 1: Identify Electrical Service Panel Locations
Inspect all main and sub-panels in shared-use areas. Panel must be reachable without moving furniture, appliances, or fixtures
🔍 Step 2: Cover & Enclosure Integrity
• 	Dead front cover: Must be securely fastened and undamaged
• 	Door function: Opens fully (≥90°) and closes without obstruction
• 	Gaps or missing knockouts: Must be sealed to prevent foreign object intrusion
🧪 Step 3: Functional Testing (Visual Only)
• 	Access Check: Confirm the panel can be opened without tools or moving heavy objects
• 	Cover & Labeling: Ensure a dead-front cover is present and breakers are labeled
• 	Breaker Condition: Look for signs of overheating, discoloration, or physical damage
• 	Moisture or Contamination: Inspect for rust, water stains, or mold inside the panel
• 	Conductor Safety: Confirm no exposed wires or missing knockouts
Do not operate breakers or remove covers unless qualified and authorized.
📏 Step 4: Accessibility & Local Requirements
• 	Height: Panel must be mounted ≤6'7" AFF to top breaker handle (IRC §E3405.3)
• 	Labeling: Circuit directory must be legible and accurate
• 	IBU Local Codes: May require seismic bracing, lockable covers, or inspection logs
⚒️ Step 5: IRC Electrical Requirements
Codes Referenced:
• 	IRC (2021) §E3401–E3405, §E3705–E3706 – Panelboards, overcurrent protection, conductor terminations
• 	IBU overlays – Local fire, shock hazard, and accessibility code`
        }
    ]
};

export const ELECTRICAL_DEFICIENCIES = {
    category: '10. Electrical',
    items: [ELECTRICAL_CONDUCTOR, ELECTRICAL_GFCI, ELECTRICAL_SERVICE_PANEL]
};

// ==========================================
// 11. ELEVATOR
// ==========================================

export const ELEVATOR: UnitItemDeficiencies = {
    itemName: 'Elevator',
    deficiencies: [
        {
            id: 'elevator_1',
            name: 'Elevator Cab is not level with the floor.',
            detail: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
            criteria: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-01',
            codeReference: `🧭 Step 1: Identify Elevator Type and Location
Inspect all permanently installed vertical transport systems, including: Passenger elevator, Freight/service elevator, Hydraulic or traction systems.
NSPIRE defines an elevator as a vertical transport vehicle powered by electric motors or hydraulic systems

🔍 Step 2: Visual Condition Assessment
NSPIRE requires elevators to be fully functional, safe, and accessible at all times.

🧪 Step 3: Functional Testing
• Call Button Test: Press the call button on each floor; confirm the elevator arrives and the doors open
• Cab Movement Test: Ride the elevator between floors; confirm smooth travel and accurate stopping
• Door Operation Test: Observe door opening/closing speed and full clearance
• Emergency System Test: Check emergency phone, alarm button, and intercom (if present)
• Lighting & Signage Check: Confirm interior lights and floor indicators are working
If the elevator is out of service, NSPIRE allows documentation from a certified technician to verify repair status.

📏 Step 4: Accessibility Compliance (IBU)
• Cab Dimensions: Minimum 51" deep × 68" wide for side-entry wheelchair access
• Braille/tactile controls: Required per IRC §R321.3
• Audible floor announcements: If present, verify clarity and volume
• Signage: Elevator must be clearly labeled with floor and emergency info
• IBU Overlay: May require visual indicators or multilingual signage

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R321.1: Elevators must comply with ASME A17.1 safety code
• IRC E3701.1: Electrical systems must be grounded and protected
• IRC R311.4: Egress routes must include accessible vertical transport if required
• IRC R314 & R315: Smoke and CO alarms must not interfere with elevator operation
IRC ensures elevators are structurally sound, electrically safe, and integrated into emergency egress systems`
        },
        {
            id: 'elevator_2',
            name: 'The elevator door does not fully open or close.',
            detail: 'The elevator door does not fully open (at least 36 inches) and does not close.',
            criteria: 'All elevators must be in working condition.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-02',
            codeReference: `🧭 Step 1: Identify Elevator Type and Location
Inspect all permanently installed vertical transport systems, including: Passenger elevator, Freight/service elevator, Hydraulic or traction systems.
NSPIRE defines an elevator as a vertical transport vehicle powered by electric motors or hydraulic systems

🔍 Step 2: Visual Condition Assessment
NSPIRE requires elevators to be fully functional, safe, and accessible at all times.

🧪 Step 3: Functional Testing
• Call Button Test: Press the call button on each floor; confirm the elevator arrives and the doors open
• Cab Movement Test: Ride the elevator between floors; confirm smooth travel and accurate stopping
• Door Operation Test: Observe door opening/closing speed and full clearance
• Emergency System Test: Check emergency phone, alarm button, and intercom (if present)
• Lighting & Signage Check: Confirm interior lights and floor indicators are working
If the elevator is out of service, NSPIRE allows documentation from a certified technician to verify repair status.

📏 Step 4: Accessibility Compliance (IBU)
• Cab Dimensions: Minimum 51" deep × 68" wide for side-entry wheelchair access
• Braille/tactile controls: Required per IRC §R321.3
• Audible floor announcements: If present, verify clarity and volume
• Signage: Elevator must be clearly labeled with floor and emergency info
• IBU Overlay: May require visual indicators or multilingual signage

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R321.1: Elevators must comply with ASME A17.1 safety code
• IRC E3701.1: Electrical systems must be grounded and protected
• IRC R311.4: Egress routes must include accessible vertical transport if required
• IRC R314 & R315: Smoke and CO alarms must not interfere with elevator operation
IRC ensures elevators are structurally sound, electrically safe, and integrated into emergency egress systems`
        },
        {
            id: 'elevator_3',
            name: 'Elevator is inoperable.',
            detail: 'Elevator is inoperable (i.e. overall system or component thereof not meeting function or purpose; with or without visible damage).',
            criteria: 'Elevator system or component thereof not meeting function or purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-03',
            codeReference: `🧭 Step 1: Identify Elevator Type and Location
Inspect all permanently installed vertical transport systems, including: Passenger elevator, Freight/service elevator, Hydraulic or traction systems.
NSPIRE defines an elevator as a vertical transport vehicle powered by electric motors or hydraulic systems

🔍 Step 2: Visual Condition Assessment
NSPIRE requires elevators to be fully functional, safe, and accessible at all times.

🧪 Step 3: Functional Testing
• Call Button Test: Press the call button on each floor; confirm the elevator arrives and the doors open
• Cab Movement Test: Ride the elevator between floors; confirm smooth travel and accurate stopping
• Door Operation Test: Observe door opening/closing speed and full clearance
• Emergency System Test: Check emergency phone, alarm button, and intercom (if present)
• Lighting & Signage Check: Confirm interior lights and floor indicators are working
If the elevator is out of service, NSPIRE allows documentation from a certified technician to verify repair status.

📏 Step 4: Accessibility Compliance (IBU)
• Cab Dimensions: Minimum 51" deep × 68" wide for side-entry wheelchair access
• Braille/tactile controls: Required per IRC §R321.3
• Audible floor announcements: If present, verify clarity and volume
• Signage: Elevator must be clearly labeled with floor and emergency info
• IBU Overlay: May require visual indicators or multilingual signage

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R321.1: Elevators must comply with ASME A17.1 safety code
• IRC E3701.1: Electrical systems must be grounded and protected
• IRC R311.4: Egress routes must include accessible vertical transport if required
• IRC R314 & R315: Smoke and CO alarms must not interfere with elevator operation
IRC ensures elevators are structurally sound, electrically safe, and integrated into emergency egress systems`
        },
        {
            id: 'elevator_4',
            name: 'Safety edge device has malfunctioned or is inoperable.',
            detail: 'The safety edge device has malfunctioned or is not functionally adequate.',
            criteria: 'Overall, the system or a component thereof is not meeting its function or purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-04',
            codeReference: `🧭 Step 1: Identify Elevator Type and Location
Inspect all permanently installed vertical transport systems, including: Passenger elevator, Freight/service elevator, Hydraulic or traction systems.
NSPIRE defines an elevator as a vertical transport vehicle powered by electric motors or hydraulic systems

🔍 Step 2: Visual Condition Assessment
NSPIRE requires elevators to be fully functional, safe, and accessible at all times.

🧪 Step 3: Functional Testing
• Call Button Test: Press the call button on each floor; confirm the elevator arrives and the doors open
• Cab Movement Test: Ride the elevator between floors; confirm smooth travel and accurate stopping
• Door Operation Test: Observe door opening/closing speed and full clearance
• Emergency System Test: Check emergency phone, alarm button, and intercom (if present)
• Lighting & Signage Check: Confirm interior lights and floor indicators are working
If the elevator is out of service, NSPIRE allows documentation from a certified technician to verify repair status.

📏 Step 4: Accessibility Compliance (IBU)
• Cab Dimensions: Minimum 51" deep × 68" wide for side-entry wheelchair access
• Braille/tactile controls: Required per IRC §R321.3
• Audible floor announcements: If present, verify clarity and volume
• Signage: Elevator must be clearly labeled with floor and emergency info
• IBU Overlay: May require visual indicators or multilingual signage

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R321.1: Elevators must comply with ASME A17.1 safety code
• IRC E3701.1: Electrical systems must be grounded and protected
• IRC R311.4: Egress routes must include accessible vertical transport if required
• IRC R314 & R315: Smoke and CO alarms must not interfere with elevator operation
IRC ensures elevators are structurally sound, electrically safe, and integrated into emergency egress systems`
        }
    ]
};

export const ELEVATOR_DEFICIENCIES = {
    category: '11. Elevator',
    items: [ELEVATOR]
};

// ==========================================
// 12. FIRE SAFETY
// ==========================================

export const FIRE_SAFETY_EXIT_SIGN: UnitItemDeficiencies = {
    itemName: 'Exit Sign',
    deficiencies: [
        {
            id: 'fire_exit_1',
            name: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
            detail: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
            criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXIT-01',
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
Combination units (exit sign + emergency light) must be inspected as two separate items.

📏 Step 4: Accessibility/Code Compliance & IBU Overlay
• Height & Placement: Signs must be mounted high enough to be visible but not obstructive
• Visual Clarity: Letters must be ≥6" high with a stroke width ≥¾"
• Contrast & Illumination: Must be readable by residents with low vision
• Directional Arrows: Required if the exit path is not straight ahead

⚒️ Step 5: IRC Fire Safety Requirements
• IRC (2021) §R311.4, §R315 – Means of egress and emergency escape
• Fire separation walls must not block exit signage or access`
        }
    ]
};

export const FIRE_SAFETY_EXTINGUISHER: UnitItemDeficiencies = {
    itemName: 'Fire Extinguisher',
    deficiencies: [
        {
            id: 'fire_ext_1',
            name: 'A fire extinguisher is damaged or missing.',
            detail: 'A fire extinguisher is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'A fire extinguisher is damaged or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
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
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs; ≤42" if >40 lbs
• Reachability: Must be reachable without tight grasping or bending
• Clear Floor Space: Minimum 30"x48" in front of extinguisher
• Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• IRC Section R313.1: Fire extinguishers must be accessible and maintained in working order
• NFPA 10 Reference: Extinguishers must be inspected monthly and serviced annually
• IRC R315.2: Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
        },
        {
            id: 'fire_ext_2',
            name: 'The fire extinguisher pressure gauge reads over or undercharged.',
            detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
            criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXT-02',
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
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs; ≤42" if >40 lbs
• Reachability: Must be reachable without tight grasping or bending
• Clear Floor Space: Minimum 30"x48" in front of extinguisher
• Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• IRC Section R313.1: Fire extinguishers must be accessible and maintained in working order
• NFPA 10 Reference: Extinguishers must be inspected monthly and serviced annually
• IRC R315.2: Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
        },
        {
            id: 'fire_ext_3',
            name: 'The fire extinguisher tag is missing or illegible or expired.',
            detail: 'The fire extinguisher tag is missing or illegible or expired.',
            criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXT-03',
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
Disposable extinguishers must be replaced if older than 12 years from the manufacture date.

📏 Step 4: Accessibility Compliance (IBU/ADA)
• Mounting Height: Top of extinguisher ≤48" AFF if <40 lbs; ≤42" if >40 lbs
• Reachability: Must be reachable without tight grasping or bending
• Clear Floor Space: Minimum 30"x48" in front of extinguisher
• Label Visibility: Operating instructions must be readable

⚒️ Step 5: IRC Fire Safety Requirements
• IRC Section R313.1: Fire extinguishers must be accessible and maintained in working order
• NFPA 10 Reference: Extinguishers must be inspected monthly and serviced annually
• IRC R315.2: Extinguishers must not obstruct egress or emergency equipment
IRC aligns with NFPA standards for extinguisher placement, maintenance, and visibility`
        }
    ]
};

export const FIRE_SAFETY_FLAMMABLE: UnitItemDeficiencies = {
    itemName: 'Flammable and Combustible Item',
    deficiencies: [
        {
            id: 'fire_flam_1',
            name: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
            detail: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
            criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-FLAM-01',
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

export const FIRE_SAFETY_SMOKE_ALARM: UnitItemDeficiencies = {
    itemName: 'Smoke Alarm',
    deficiencies: [
        {
            id: 'fire_smoke_1',
            name: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
            detail: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
            criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-01',
            codeReference: `🧭 Step 1: Identify Smoke Alarm Locations
• Verify presence: A smoke alarm must be installed on every level of the building, including common areas.

🔍 Step 2: Visual Condition Assessment
• Painted surface
• Stickers or decorations
• Obstructions (e.g., dust, cobwebs, furniture)

🧪 Step 3: Functional Testing
The central alarm system must be certified annually.
• Test Button Activation: Press the test button to confirm audible and/or visual alert
• Battery Check: If accessible, confirm battery is present and properly seated
• Sealed Battery Verification: For battery-only units, confirm it's a sealed, 10-year, tamper-resistant model
• Response Confirmation: Ensure the alarm sounds clearly and immediately when tested
If the alarm does not activate or is silent, it must be cited as inoperable and corrected within 24 hours.

📏 Step 4: Placement & Accessibility Compliance (IBU)
• Ceiling Mount: ≥4 inches from wall
• Wall Mount: Between 4–12 inches from the ceiling
• Distance from Drafts: ≥3 feet from fans, ducts, windows, or exterior doors
• Distance from Cooking Appliances: ≥10 feet away
• Reachability: Test button must be reachable without tools or unsafe climbing
• IBU Local Codes may require multilingual signage, inspection logs, or enhanced visual alarms for hearing-impaired residents

⚒️ Step 5: IRC Installation Requirements
• IRC (2021) §R314 – Smoke alarm installation and performance
• Alarms must be powered by permanent wiring or a sealed battery`
        },
        {
            id: 'fire_smoke_2',
            name: 'Smoke alarm not installed where required.',
            detail: 'Smoke alarm not installed where required. Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
            criteria: 'Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-02',
            codeReference: `🧭 Step 1: Identify Smoke Alarm Locations
• Verify presence: A smoke alarm must be installed on every level of the building, including common areas.

🔍 Step 2: Visual Condition Assessment
• Painted surface
• Stickers or decorations
• Obstructions (e.g., dust, cobwebs, furniture)

🧪 Step 3: Functional Testing
The central alarm system must be certified annually.
• Test Button Activation: Press the test button to confirm audible and/or visual alert
• Battery Check: If accessible, confirm battery is present and properly seated
• Sealed Battery Verification: For battery-only units, confirm it's a sealed, 10-year, tamper-resistant model
• Response Confirmation: Ensure the alarm sounds clearly and immediately when tested
If the alarm does not activate or is silent, it must be cited as inoperable and corrected within 24 hours.

📏 Step 4: Placement & Accessibility Compliance (IBU)
• Ceiling Mount: ≥4 inches from wall
• Wall Mount: Between 4–12 inches from the ceiling
• Distance from Drafts: ≥3 feet from fans, ducts, windows, or exterior doors
• Distance from Cooking Appliances: ≥10 feet away
• Reachability: Test button must be reachable without tools or unsafe climbing
• IBU Local Codes may require multilingual signage, inspection logs, or enhanced visual alarms for hearing-impaired residents

⚒️ Step 5: IRC Installation Requirements
• IRC (2021) §R314 – Smoke alarm installation and performance
• Alarms must be powered by permanent wiring or a sealed battery`
        },
        {
            id: 'fire_smoke_3',
            name: 'Smoke alarm is obstructed by a foreign object.',
            detail: 'Smoke alarm is obstructed by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            criteria: 'Smoke alarm is covered by a foreign object.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-03',
            codeReference: `🧭 Step 1: Identify Smoke Alarm Locations
• Verify presence: A smoke alarm must be installed on every level of the building, including common areas.

🔍 Step 2: Visual Condition Assessment
• Painted surface
• Stickers or decorations
• Obstructions (e.g., dust, cobwebs, furniture)

🧪 Step 3: Functional Testing
The central alarm system must be certified annually.
• Test Button Activation: Press the test button to confirm audible and/or visual alert
• Battery Check: If accessible, confirm battery is present and properly seated
• Sealed Battery Verification: For battery-only units, confirm it's a sealed, 10-year, tamper-resistant model
• Response Confirmation: Ensure the alarm sounds clearly and immediately when tested
If the alarm does not activate or is silent, it must be cited as inoperable and corrected within 24 hours.

📏 Step 4: Placement & Accessibility Compliance (IBU)
• Ceiling Mount: ≥4 inches from wall
• Wall Mount: Between 4–12 inches from the ceiling
• Distance from Drafts: ≥3 feet from fans, ducts, windows, or exterior doors
• Distance from Cooking Appliances: ≥10 feet away
• Reachability: Test button must be reachable without tools or unsafe climbing
• IBU Local Codes may require multilingual signage, inspection logs, or enhanced visual alarms for hearing-impaired residents

⚒️ Step 5: IRC Installation Requirements
• IRC (2021) §R314 – Smoke alarm installation and performance
• Alarms must be powered by permanent wiring or a sealed battery`
        },
        {
            id: 'fire_smoke_4',
            name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            detail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-04',
            codeReference: `🧭 Step 1: Identify Smoke Alarm Locations
• Verify presence: A smoke alarm must be installed on every level of the building, including common areas.

🔍 Step 2: Visual Condition Assessment
• Painted surface
• Stickers or decorations
• Obstructions (e.g., dust, cobwebs, furniture)

🧪 Step 3: Functional Testing
The central alarm system must be certified annually.
• Test Button Activation: Press the test button to confirm audible and/or visual alert
• Battery Check: If accessible, confirm battery is present and properly seated
• Sealed Battery Verification: For battery-only units, confirm it's a sealed, 10-year, tamper-resistant model
• Response Confirmation: Ensure the alarm sounds clearly and immediately when tested
If the alarm does not activate or is silent, it must be cited as inoperable and corrected within 24 hours.

📏 Step 4: Placement & Accessibility Compliance (IBU)
• Ceiling Mount: ≥4 inches from wall
• Wall Mount: Between 4–12 inches from the ceiling
• Distance from Drafts: ≥3 feet from fans, ducts, windows, or exterior doors
• Distance from Cooking Appliances: ≥10 feet away
• Reachability: Test button must be reachable without tools or unsafe climbing
• IBU Local Codes may require multilingual signage, inspection logs, or enhanced visual alarms for hearing-impaired residents

⚒️ Step 5: IRC Installation Requirements
• IRC (2021) §R314 – Smoke alarm installation and performance
• Alarms must be powered by permanent wiring or a sealed battery`
        }
    ]
};

export const FIRE_SAFETY_SPRINKLER: UnitItemDeficiencies = {
    itemName: 'Sprinkler Assembly',
    deficiencies: [
        {
            id: 'fire_sprinkler_1',
            name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
            detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
            criteria: 'The sprinkler assembly component is damaged, inoperable or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-01',
            codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• Mounting Check: Confirm escutcheon rings are flush and intact
• Cover Plate Test: Ensure concealed plates are not glued, painted, or sealed
• Corrosion Check: Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records. Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• IBU overlays – Local fire, seismic, and life-safety code`
        },
        {
            id: 'fire_sprinkler_2',
            name: 'Sprinkler head assembly has evidence of corrosion.',
            detail: 'Sprinkler head assembly has evidence of corrosion.',
            criteria: 'Sprinkler head assembly has evidence of corrosion.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-02',
            codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• Mounting Check: Confirm escutcheon rings are flush and intact
• Cover Plate Test: Ensure concealed plates are not glued, painted, or sealed
• Corrosion Check: Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records. Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• IBU overlays – Local fire, seismic, and life-safety code`
        },
        {
            id: 'fire_sprinkler_3',
            name: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-03',
            codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• Mounting Check: Confirm escutcheon rings are flush and intact
• Cover Plate Test: Ensure concealed plates are not glued, painted, or sealed
• Corrosion Check: Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records. Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• IBU overlays – Local fire, seismic, and life-safety code`
        },
        {
            id: 'fire_sprinkler_4',
            name: 'Sprinkler head assembly is obstructed by any item, object, or encasement within 18 inches of the head, and the reduced clearance is not due to a built‑in feature.',
            detail: 'Sprinkler head assembly is obstructed by any item, object, or encasement within 18 inches of the head, and the reduced clearance is not due to a built‑in feature (e.g., closet or utility enclosure).',
            criteria: '18 inches clearance is not due to feature within built (e.g. closet, utility closet).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-04',
            codeReference: `🧭 Step 1: Identify Sprinkler Assembly Components
• Verify system presence: Sprinkler assemblies are only inspected if installed

🔍 Step 2: Visual Condition Assessment
Obstruction within 18" of sprinkler head, Sprinkler head encased or covered, missing or damaged escutcheon ring, concealed cover plate glued or sealed, foreign material covering >75% of head or bulb, and evidence of corrosion on sprinkler components

🧪 Step 3: Inspection Technique
• Distance Check: Measure clearance around sprinkler heads (≥18 inches required)
• Surface Scan: Look for paint, rust, or debris on the head and escutcheon
• Mounting Check: Confirm escutcheon rings are flush and intact
• Cover Plate Test: Ensure concealed plates are not glued, painted, or sealed
• Corrosion Check: Inspect for rust on functional components (not just trim)
Use a flashlight and measuring tape for an accurate assessment. Do not touch or test the sprinkler head directly.

📏 Step 4: Accessibility & Visibility
• Height: Typically mounted ≥80" AFF for visibility and reach
• Labeling: If part of a monitored system, confirm zone ID and panel integration
• IBU Overlay: May require multilingual signage or maintenance records. Sprinkler heads must be visible and not disguised

⚒️ Step 5: IRC Fire Safety Requirements
• IRC P2904.1–P2904.6: Sprinkler systems must meet NFPA 13D standards for residential buildings
• IRC R315.2: Sprinklers must not interfere with smoke or CO alarms
• IBU overlays – Local fire, seismic, and life-safety code`
        }
    ]
};

export const FIRE_SAFETY_DEFICIENCIES = {
    category: '12. Fire Safety',
    items: [FIRE_SAFETY_EXIT_SIGN, FIRE_SAFETY_EXTINGUISHER, FIRE_SAFETY_FLAMMABLE, FIRE_SAFETY_SMOKE_ALARM, FIRE_SAFETY_SPRINKLER]
};

// ==========================================
// 13. FLOOR
// ==========================================

export const FLOOR: UnitItemDeficiencies = {
    itemName: 'Floor',
    deficiencies: [
        {
            id: 'floor_1',
            name: 'Floor component(s) is not functionally adequate.',
            detail: 'Floor component(s) is not functionally adequate (i.e., does not allow floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping, deflection).',
            criteria: 'Surface abnormalities may indicate the presence of deficiency (i.e. lifting tiles, tilers, hardwood cupping, linoleum bubbling, etc.).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FLOOR-01',
            codeReference: `🧭 Step 1: Identify Floor Types and Locations
Materials: Identify type—carpet, tile, vinyl, wood, concrete, rubber, etc.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Look for curling, buckling, bulging, tears, or separation.

🧪 Step 3: Functional Testing
• Walk Test: Walk across the floor to detect soft spots, deflection, or uneven transitions
• Edge Check: Inspect transitions between materials (e.g., tile to carpet) for height differences
• Substrate Exposure: Measure exposed areas; if ≥10% of the room's floor is bare, cite as a deficiency
• Moisture Scan: Look for signs of water intrusion, mold, or rot
No invasive testing required.

📏 Step 4: Fire Egress & Accessibility (IRC §R311.3, IBU Overlay)
• Egress path: Flooring must not obstruct or impede emergency exit routes.
• Slip resistance: Especially in wet zones (e.g., laundry, entryways)
• IBU Local Codes: May require non-slip finishes, fire-rated underlayment.
• Surface Stability: No loose tiles, torn carpet, or uneven surfaces
• IBU Overlay: May require tactile indicators or color contrast for visually impaired residents

⚒️ Step 5: IRC Structural Requirements
• IRC R301.1–R301.5: Floors must support live loads and be structurally sound
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing required to prevent water intrusion at floor-level transitions`
        },
        {
            id: 'floor_2',
            name: 'Floor substrate is exposed',
            detail: '10% or more of the floor substrate area is exposed in any room.',
            criteria: 'Repair is needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FLOOR-02',
            codeReference: `🧭 Step 1: Identify Floor Types and Locations
Materials: Identify type—carpet, tile, vinyl, wood, concrete, rubber, etc.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Look for curling, buckling, bulging, tears, or separation.

🧪 Step 3: Functional Testing
• Walk Test: Walk across the floor to detect soft spots, deflection, or uneven transitions
• Edge Check: Inspect transitions between materials (e.g., tile to carpet) for height differences
• Substrate Exposure: Measure exposed areas; if ≥10% of the room's floor is bare, cite as a deficiency
• Moisture Scan: Look for signs of water intrusion, mold, or rot
No invasive testing required.

📏 Step 4: Fire Egress & Accessibility (IRC §R311.3, IBU Overlay)
• Egress path: Flooring must not obstruct or impede emergency exit routes.
• Slip resistance: Especially in wet zones (e.g., laundry, entryways)
• IBU Local Codes: May require non-slip finishes, fire-rated underlayment.
• Surface Stability: No loose tiles, torn carpet, or uneven surfaces
• IBU Overlay: May require tactile indicators or color contrast for visually impaired residents

⚒️ Step 5: IRC Structural Requirements
• IRC R301.1–R301.5: Floors must support live loads and be structurally sound
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing required to prevent water intrusion at floor-level transitions`
        }
    ]
};

export const FLOOR_DEFICIENCIES = {
    category: '13. Floor',
    items: [FLOOR]
};

// ==========================================
// 14. FOUNDATION
// ==========================================

export const FOUNDATION: UnitItemDeficiencies = {
    itemName: 'Foundation',
    deficiencies: [
        {
            id: 'foundation_1',
            name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
            detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-01',
            codeReference: `🧭 Step 1: Identify Foundation Areas to Inspect
• Common types: Concrete slab, stem wall, crawlspace, or basement wall

🔍 Step 2: Visual Condition Assessment
• Visible zones: Look for exposed foundation in utility rooms, stairwells, exterior walls, or mechanical closets

🧪 Step 3: Inspection Technique
• Spalling: Surface flaking or crumbling of concrete
• Moisture Scan: Look for water stains, mold-like growth, or dampness near the base
• Level Check: Observe floor transitions and door alignment for signs of settlement
• Material Integrity: Tap concrete lightly to detect hollow or crumbling areas
• Exposed rebar: Indicates loss of cover and potential corrosion
• Drainage slope: Exterior grade must fall ≥6" within the first 10 feet from the foundation.

📏 Step 4: Pest Damage & Decay (IRC §R317.1, IBU Overlay)
• Termite tubes: Mud tunnels along foundation walls
• Rodent entry points: Gaps, holes, or chewed insulation
• Wood contact: No untreated wood should touch concrete or soil
• IBU Local Codes: May require pest barriers, treated lumber, or inspection logs

⚒️ Step 5: IRC Structural Requirements
• IRC R401–R404: Foundations must support loads and resist movement
• IRC R405.1: Drainage systems required to prevent water accumulation
• IRC R406.1: Foundation walls must be damp-proofed
• IRC R403.1.6: Anchor bolts required to secure framing to the foundation`
        },
        {
            id: 'foundation_2',
            name: 'Foundation is cracked.',
            detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
            criteria: 'Foundation cracks (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-02',
            codeReference: `🧭 Step 1: Identify Foundation Areas to Inspect
• Common types: Concrete slab, stem wall, crawlspace, or basement wall

🔍 Step 2: Visual Condition Assessment
• Visible zones: Look for exposed foundation in utility rooms, stairwells, exterior walls, or mechanical closets

🧪 Step 3: Inspection Technique
• Spalling: Surface flaking or crumbling of concrete
• Moisture Scan: Look for water stains, mold-like growth, or dampness near the base
• Level Check: Observe floor transitions and door alignment for signs of settlement
• Material Integrity: Tap concrete lightly to detect hollow or crumbling areas
• Exposed rebar: Indicates loss of cover and potential corrosion
• Drainage slope: Exterior grade must fall ≥6" within the first 10 feet from the foundation.

📏 Step 4: Pest Damage & Decay (IRC §R317.1, IBU Overlay)
• Termite tubes: Mud tunnels along foundation walls
• Rodent entry points: Gaps, holes, or chewed insulation
• Wood contact: No untreated wood should touch concrete or soil
• IBU Local Codes: May require pest barriers, treated lumber, or inspection logs

⚒️ Step 5: IRC Structural Requirements
• IRC R401–R404: Foundations must support loads and resist movement
• IRC R405.1: Drainage systems required to prevent water accumulation
• IRC R406.1: Foundation walls must be damp-proofed
• IRC R403.1.6: Anchor bolts required to secure framing to the foundation`
        },
        {
            id: 'foundation_3',
            name: 'Foundation infiltrated by water.',
            detail: 'Evidence of water infiltration through the foundation through visual evaluation. (e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-03',
            codeReference: `🧭 Step 1: Identify Foundation Areas to Inspect
• Common types: Concrete slab, stem wall, crawlspace, or basement wall

🔍 Step 2: Visual Condition Assessment
• Visible zones: Look for exposed foundation in utility rooms, stairwells, exterior walls, or mechanical closets

🧪 Step 3: Inspection Technique
• Spalling: Surface flaking or crumbling of concrete
• Moisture Scan: Look for water stains, mold-like growth, or dampness near the base
• Level Check: Observe floor transitions and door alignment for signs of settlement
• Material Integrity: Tap concrete lightly to detect hollow or crumbling areas
• Exposed rebar: Indicates loss of cover and potential corrosion
• Drainage slope: Exterior grade must fall ≥6" within the first 10 feet from the foundation.

📏 Step 4: Pest Damage & Decay (IRC §R317.1, IBU Overlay)
• Termite tubes: Mud tunnels along foundation walls
• Rodent entry points: Gaps, holes, or chewed insulation
• Wood contact: No untreated wood should touch concrete or soil
• IBU Local Codes: May require pest barriers, treated lumber, or inspection logs

⚒️ Step 5: IRC Structural Requirements
• IRC R401–R404: Foundations must support loads and resist movement
• IRC R405.1: Drainage systems required to prevent water accumulation
• IRC R406.1: Foundation walls must be damp-proofed
• IRC R403.1.6: Anchor bolts required to secure framing to the foundation`
        },
        {
            id: 'foundation_4',
            name: 'Foundation support post, column, or girder area is damaged.',
            detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-04',
            codeReference: `🧭 Step 1: Identify Foundation Areas to Inspect
• Common types: Concrete slab, stem wall, crawlspace, or basement wall

🔍 Step 2: Visual Condition Assessment
• Visible zones: Look for exposed foundation in utility rooms, stairwells, exterior walls, or mechanical closets

🧪 Step 3: Inspection Technique
• Spalling: Surface flaking or crumbling of concrete
• Moisture Scan: Look for water stains, mold-like growth, or dampness near the base
• Level Check: Observe floor transitions and door alignment for signs of settlement
• Material Integrity: Tap concrete lightly to detect hollow or crumbling areas
• Exposed rebar: Indicates loss of cover and potential corrosion
• Drainage slope: Exterior grade must fall ≥6" within the first 10 feet from the foundation.

📏 Step 4: Pest Damage & Decay (IRC §R317.1, IBU Overlay)
• Termite tubes: Mud tunnels along foundation walls
• Rodent entry points: Gaps, holes, or chewed insulation
• Wood contact: No untreated wood should touch concrete or soil
• IBU Local Codes: May require pest barriers, treated lumber, or inspection logs

⚒️ Step 5: IRC Structural Requirements
• IRC R401–R404: Foundations must support loads and resist movement
• IRC R405.1: Drainage systems required to prevent water accumulation
• IRC R406.1: Foundation walls must be damp-proofed
• IRC R403.1.6: Anchor bolts required to secure framing to the foundation`
        }
    ]
};

export const FOUNDATION_DEFICIENCIES = {
    category: '14. Foundation',
    items: [FOUNDATION]
};

// ==========================================
// 15. GRAB BAR
// ==========================================

export const GRAB_BAR: UnitItemDeficiencies = {
    itemName: 'Grab Bar',
    deficiencies: [
        {
            id: 'grab_bar_1',
            name: 'The grab bar is not secured.',
            detail: 'The grab bar is not secured. Damaged, loose, or missing.',
            criteria: 'Any movement whatsoever is detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'GRAB-BAR-01',
            codeReference: `🧭 Step 1: Identify Grab Bar Locations
Inspect all installed grab bars in shared-use hygiene areas.
NSPIRE defines grab bars as safety devices designed to be grasped to maintain balance or assist with movement, specifically in bathrooms. 
🔍 Step 2: Visual Condition Assessment
Grab bar is loose or unstable or damaged, Grab bar missing where required, Grab bar obstructed or inaccessible
🧪 Step 3: Functional Testing
• 	Stability Test: Grasp the bar in the center and apply a moderate force back and forth.
• 	Any movement = deficiency
• 	Mounting Check: Confirm the grab bar is securely anchored to wall studs or blocking
• 	Surface Inspection: Look for rust, cracks, or sharp edges
• 	Accessibility Review: Ensure the grab bar is reachable and unobstructed.
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
While NSPIRE does not enforce, IBU guidance is useful for best practice:
• 	Height: 33"–36" above finished floor
• 	Length: Minimum 42" for side wall, 36" for rear wall
• 	Clearance: At least 1½" between wall and bar
• 	Grip Surface: Smooth, non-slip, and continuous
• 	Location: Beside toilets, inside showers/tubs, and near transfer zones
⚒️ Step 5: IRC Installation & Safety Requirements
• 	IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• 	IRC P2705.1: Fixtures must be installed to allow safe access and use
• 	IRC R317.1: Moisture-prone areas must use corrosion-resistant materials
• 	IRC R703.4: Proper flashing and sealing are required to prevent water intrusion behind grab bar mounts`
        }
    ]
};

export const GRAB_BAR_DEFICIENCIES = {
    category: '15. Grab Bar',
    items: [GRAB_BAR]
};

// ==========================================
// 16. HAZARD
// ==========================================

export const HAZARD_INFESTATION: UnitItemDeficiencies = {
    itemName: 'Infestation',
    deficiencies: [
        {
            id: 'hazard_infest_1',
            name: 'Evidence of bedbugs.',
            detail: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-01',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_2',
            name: 'Evidence of cockroaches.',
            detail: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            criteria: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-02',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_3',
            name: 'Evidence of mice.',
            detail: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            criteria: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-03',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_4',
            name: 'Evidence of other pests.',
            detail: 'Evidence of other pest infestation—such as ants, wasps, squirrels, birds, or bats—is present in interior areas, posing potential health and safety risks to residents.',
            criteria: 'Evidence is present of other pest infestations, including but not limited to a trail of ants, wasps/beehives, squirrels, birds, and bats in an interior area.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-04',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_5',
            name: 'Evidence of rats.',
            detail: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
            criteria: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-05',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_6',
            name: 'Extensive bedbugs infestation.',
            detail: 'Extensive bedbugs infestation. Sighting of at least one live bedbug in two or more areas',
            criteria: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime through visual assessment.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-06',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_7',
            name: 'Extensive cockroach infestation (live).',
            detail: 'Extensive cockroach infestation (live). Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
            criteria: 'Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'HAZARD-INFEST-07',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_8',
            name: 'Extensive mouse infestation.',
            detail: 'Extensive mouse infestation. Sighting of at least one live mouse in during the daytime surface visual assessment.',
            criteria: 'Sighting of at least one live mouse in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-08',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        },
        {
            id: 'hazard_infest_9',
            name: 'Extensive rat infestation.',
            detail: 'Extensive rat infestation. A live rat is seen in the common area.',
            criteria: 'A live rat is seen in the unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-09',
            codeReference: `🧭 Step 1: Identify Areas Prone to Infestation
Inspect all shared-use spaces where pests may be present.
NSPIRE includes insects, rodents, reptiles, and birds as potential sources of infestation

🔍 Step 2: Visual Condition Assessment
When it cites infestation as a moderate health and safety deficiency, it requires actions.

🧪 Step 3: Inspection Technique
• Flashlight Scan: Use a flashlight to inspect dark corners, under appliances, and behind furniture
• Dropping Identification:
• Rodent droppings: rice-sized, pointed ends
• Cockroach droppings: tiny black specks or smears
• Bedbug signs: rust-colored stains, eggs, or blood trails
• Trap Review: Record only traps with pests present; empty traps are not cited

📏 Step 4: Accessibility & IBU Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing.
• Signage: Pest control logs or warning signs may be required in utility rooms.
• IBU Overlay: May mandate integrated pest management (IPM), sealed entry points, or quarterly inspections

⚒️ Step 5: IRC Sanitation & Pest Prevention Requirements
• IRC R306.1: Buildings must have sanitary drainage and waste disposal
• IRC R408.3: R302.1, §R306.2 – Sanitation and fire separation`
        }
    ]
};

export const HAZARD_LITTER: UnitItemDeficiencies = {
    itemName: 'LITTER',
    deficiencies: [
        {
            id: 'hazard_litter_1',
            name: 'Litter is accumulated in an unassigned area.',
            detail: 'Litter is accumulated in an unassigned area. 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
            criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-LITTER-01',
            codeReference: `🧭 Step 1: Identify Areas Where Litter May Accumulate
Inspect all shared-use spaces where trash or discarded items may appear.
Target zones: Corridors, stairwells, laundry rooms, trash enclosures, lobbies, and mechanical closets

🔍 Step 2: Visual Condition Assessment
• Common items: Food wrappers, paper, bottles, cans, cigarette butts, packaging, clothing, and small debris
• Large items: Furniture, mattresses, appliances, or bulk trash

🧪 Step 3: Inspection Technique
• Area Scan: Visually inspect each 10 ft × 10 ft section of the common area
• Item Count: Count small litter items; if ≥10 in one section, cite as a deficiency
• Size Check: Identify any large discarded items regardless of quantity

📏 Step 4: Accessibility & Local Requirements
• Blocked access: Litter must not obstruct exit routes or emergency equipment
• Signage: Some jurisdictions require "No Dumping" or "Clean Zone" signage in shared areas
• IBU Local Codes: May mandate daily janitorial logs or pest control coordination
• IRC R306.1: Buildings must have sanitary waste disposal systems

⚒️ Step 5: Litter & Discarded Items Inspection
• IRC-R306.2 – Sanitation and cleanliness
• IRC R703.8: Exterior walls must be sealed to prevent pest intrusion from litter`
        }
    ]
};

export const HAZARD_SHARP_EDGES: UnitItemDeficiencies = {
    itemName: 'Sharp edges',
    deficiencies: [
        {
            id: 'hazard_sharp_1',
            name: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care is present.',
            detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
            criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care is present within the built environment.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'HAZARD-SHARP-01',
            codeReference: `🧭 Step 1: Identify Areas Where Sharp Edges May Be Present
Inspect all shared-use spaces where residents may come into contact with built components.
🔍 Step 2: Visual Condition Assessment
• 	Rusted or bent metal,  Splintered wood, 	Chipped ceramic or stone
• 	Protruding nails, screws, staples
🧪 Step 3: Inspection Technique
• 	Visual Scan: Walk through common areas and inspect all surfaces within reach (typically 0–6 feet)
• 	Touch-Free Assessment: Do not touch the edge; visually determine if it could puncture or lacerate skin
• 	Material Identification: Note whether the edge is metal, glass, tile, wood, or plastic
If the edge is damaged and located in a typical path of travel, it must be cited—even if no injury has occurred.
📏 Step 4: Obstruction & Accessibility Overlay
• 	Clear Floor Space: Sharp edges must not protrude into accessible routes
• 	Egress paths: Hazards near exits or stairs elevate severity
• 	IBU Local Codes: May require protective guards, rounded edges, or signage in high-traffic zones 
⚒️ Step 5: IRC Structural & Finish Requirements
• 	IRC R302.1 – Protection against physical hazards
• 	IRC R312.1: Guardrails and handrails must be smooth and free of sharp projections
• 	IRC R302.1: Fire-resistant construction must not include exposed sharp metal or glass`
        }
    ]
};

export const HAZARD_TRIP: UnitItemDeficiencies = {
    itemName: 'Trip hazard',
    deficiencies: [
        {
            id: 'hazard_trip_1',
            name: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch across the path of travel.',
            detail: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch across the path of travel.',
            criteria: 'There is an abrupt change in vertical elevation on any walking surface along the normal path of travel, consisting of an unintended ¾ inch or greater vertical difference.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-TRIP-01',
            codeReference: `🧭 Step 1: Identify Walking Surfaces to Inspect
Target zones: Corridors, stairwells, laundry rooms, lobbies, trash enclosures, and mechanical closets

🔍 Step 2: Visual Condition Assessment
• Common materials: Carpet, tile, concrete, vinyl, wood, metal, extension cords, rugs.

🧪 Step 3: Inspection Technique
• Walk Test: Traverse all common paths and note any unevenness or instability
• Measurement Check: Use a ruler or gauge to confirm: Vertical rise ≥¾ inch. Horizontal gap ≥2 inches
• Touch-Free Scan: Visually inspect flooring for buckling, loose edges, or unsecured items
Non-invasive observation. No lifting or moving of flooring required.

📏 Step 4: Accessibility, Egress & Accessibility Overlay
• Surface Continuity: Walking surfaces must be stable, firm, and slip-resistant
• Thresholds: ≤½ inch beveled or ≤¼ inch vertical allowed at transitions
• Clear Floor Space: No protrusions or loose coverings in accessible paths
• Visual Safety: Hazards must not impair visibility or signage
• IBU Local Codes: May require tactile warnings, beveled transitions, or signage in high-traffic zones

⚒️ Step 5: IRC Structural Requirements
• IRC R311.3–R311.7: Means of egress, flooring transitions, and stair safety
• Floors, landings, and stairs must be uniform and free of abrupt changes
• IRC R312.1: Guardrails and handrails must be smooth and continuous`
        },
        {
            id: 'hazard_trip_2',
            name: 'Walking surfaces have an abrupt change: a horizontal separation ≥2 inches across the path of travel.',
            detail: 'Walking surfaces have an abrupt change: a horizontal separation ≥2 inches across the path of travel.',
            criteria: 'An unintended 2-inch horizontal separation perpendicular to the path of travel.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-TRIP-02',
            codeReference: `🧭 Step 1: Identify Walking Surfaces to Inspect
Target zones: Corridors, stairwells, laundry rooms, lobbies, trash enclosures, and mechanical closets

🔍 Step 2: Visual Condition Assessment
• Common materials: Carpet, tile, concrete, vinyl, wood, metal, extension cords, rugs.

🧪 Step 3: Inspection Technique
• Walk Test: Traverse all common paths and note any unevenness or instability
• Measurement Check: Use a ruler or gauge to confirm: Vertical rise ≥¾ inch. Horizontal gap ≥2 inches
• Touch-Free Scan: Visually inspect flooring for buckling, loose edges, or unsecured items
Non-invasive observation. No lifting or moving of flooring required.

📏 Step 4: Accessibility, Egress & Accessibility Overlay
• Surface Continuity: Walking surfaces must be stable, firm, and slip-resistant
• Thresholds: ≤½ inch beveled or ≤¼ inch vertical allowed at transitions
• Clear Floor Space: No protrusions or loose coverings in accessible paths
• Visual Safety: Hazards must not impair visibility or signage
• IBU Local Codes: May require tactile warnings, beveled transitions, or signage in high-traffic zones

⚒️ Step 5: IRC Structural Requirements
• IRC R311.3–R311.7: Means of egress, flooring transitions, and stair safety
• Floors, landings, and stairs must be uniform and free of abrupt changes
• IRC R312.1: Guardrails and handrails must be smooth and continuous`
        }
    ]
};

export const HAZARD_DEFICIENCIES = {
    category: '16. Hazard',
    items: [HAZARD_INFESTATION, HAZARD_LITTER, HAZARD_SHARP_EDGES, HAZARD_TRIP]
};

// ==========================================
// 17. HEATING, VENTILATION, AND AIR CONDITIONING
// ==========================================

export const HVAC: UnitItemDeficiencies = {
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
            code: 'HVAC-01',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_2',
            name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
            detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
            criteria: 'a combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-02',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_3',
            name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
            detail: 'A fuel-burning heating system or device is present. And exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. Or Exhaust vent is damaged. OR Exhaust vent is missing.',
            criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-03',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_4',
            name: 'Heating system or device safety shield is damaged or missing.',
            detail: 'Heating system or device safety shield is damaged or missing.',
            criteria: 'Safety shield was previously installed and is now not present or is incomplete. Heating systems in tropical islands are excluded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'HVAC-04',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_5',
            name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
            detail: 'A permanently installed heating source is damaged. OR a permanently installed heating source is inoperable. OR a permanently installed heating source is missing. OR A permanently installed heating source is not installed. And The outside temperature is below 68 degrees Fahrenheit',
            criteria: 'Permanently is affixed within the unit or building, safely connected to the unit or building electrical system, thermostatically controlled by the unit or building, and appropriate for the size of the unit or building. The heating systems in tropical islands are excluded.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'HVAC-05',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_6',
            name: 'The inspection date is between October 1 and March 31(cold weather), and the permanently installed heating source is not working, or it is working and the interior temperature is below 64 degrees Fahrenheit.',
            detail: 'The inspection date is on or between October 1 and March 31. AND the permanently installed heating source is not working. OR the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            criteria: 'The permanently installed heating source is not working to create heat. Heating systems in tropical islands are excluded.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-06',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        },
        {
            id: 'hvac_7',
            name: 'Unvented space heater is present.',
            detail: 'An unvented space heater that burns gas, oil, or kerosene is present Inside, including any and all common areas.',
            criteria: 'Inside, include any and all common areas.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-07',
            codeReference: `🧭 Step 1: Identify HVAC Components to Inspect
Focus on permanently installed heating, ventilation, and air conditioning systems in shared-use areas
• Type: Central air, split system, PTAC, wall unit, radiant, or forced air

🔍 Step 2: Visual Condition Assessment
• Components: Thermostat, air handler, furnace, condenser, supply/return registers, exhaust fans

🧪 Step 3: Functional Testing
• Thermostat Test: Adjust settings and confirm system responds (heat or cool activates)
• Airflow Check: Confirm air is flowing from supply vents and returning through returns
• Exhaust Vent Inspection: Ensure combustion appliance vents are correctly connected and unobstructed
• Visual Scan: Look for rust, soot, burn marks, or exposed wires on HVAC units
• Noise & Vibration: Listen for abnormal sounds indicating mechanical failure
Do not open sealed panels or test gas appliances unless qualified and authorized.

📏 Step 4: Accessibility & IBU Local Requirements
• Service access: Units must be reachable without disassembly or unsafe maneuvering
• Labeling: Equipment should be labeled with unit ID and service info
• IBU Overlay: May require seismic bracing, carbon monoxide detectors, or annual service logs

⚒️ Step 5: IRC HVAC Requirements
• IRC M1401–M1507: HVAC systems must be properly installed, vented, and maintained
• IRC M1307.3: Equipment must be accessible and protected from damage
• IBU overlays – Local fire, combustion safety, ventilation, and accessibility code`
        }
    ]
};

export const HVAC_DEFICIENCIES = {
    category: '17. Heating, Ventilation, and Air Conditioning',
    items: [HVAC]
};

// ==========================================
// 18. KITCHEN
// ==========================================

export const KITCHEN_CABINET: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'kitchen_cab_1',
            name: 'Food storage component or kitchen cabinet doors, drawers, or shelves are missing.',
            detail: 'Food storage component or kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-CAB-01',
            codeReference: `🧭 Step 1: Identify Cabinet and Storage Locations
• Cabinetry must exist: If the area is designated as a kitchen or food prep zone, cabinetry must be present.
NSPIRE applies to built-in cabinets used for food, dishware, or storage of supplies. Freestanding furniture is excluded unless installed by the property.

🔍 Step 2: Visual Condition Assessment
Look for peeling laminate, chipped paint, water stains, or delamination

🧪 Step 3: Functional Testing
• Open/Close Test: Open every door and drawer thoroughly to check for smooth operation
• Hardware Check: Confirm knobs, handles, hinges, and slides are secure and functional
• Structural Stability: Gently press on cabinet sides and shelves to confirm they're securely mounted
If more than half of the cabinet components are missing, damaged, or inoperable, cite as a deficiency.

📏 Step 4: Accessibility & IBU Local Requirement
• Reach Range: Accessible cabinets should be within 15"–48" AFF
• Operability: Doors and drawers must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of accessible cabinets
• Safe Use: No sharp edges, splinters, or protruding hardware
• IBU Overlay: May require soft-close hardware, rounded edges, or multilingual labeling in shared-use kitchens

⚒️ Step 5: IRC Installation & Safety Requirements
• R306.2 – Kitchen facilities and sanitation
• IBU overlays – Local sanitation, accessibility, and usability codes`
        }
    ]
};

export const KITCHEN_COOKING: UnitItemDeficiencies = {
    itemName: 'Cooking Appliance',
    deficiencies: [
        {
            id: 'kitchen_cook_1',
            name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-COOK-01',
            codeReference: `🧭 Step 1: Identify Cooking Appliances to Inspect
• Primary appliance: Must be present if the space is designated or used as a kitchen
• Types: Range, cooktop, oven, microwave, hot plate (if primary)

🔍 Step 2: Visual Condition Assessment
• Check for: Missing knobs, racks, grates, drip pans, and Broken door hinges, seals, or handles. Unsafe units must be corrected promptly.

🧪 Step 3: Functional Testing
• Burner Test: Ask POA (Property Owner/Agent) to turn on each burner; observe flame or heat
• Oven Test: Open oven, confirm heat production (feel above coil or check indicator)
• Microwave Test: Run for 30 seconds with a microwave-safe cup of water; check for heating
• Control Check: Confirm knobs, buttons, and displays respond properly
• Safety Scan: Look for exposed wires, broken glass, or missing components
Inspectors should not light pilot lights or operate appliances directly unless they are authorized to do so.

📏 Step 4: Accessibility & IBU Local Requirements
• Reach Range: Controls must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of appliance
• Safe Use: No sharp edges, hot surfaces, or obstructed access
• IBU Overlay: May require multilingual signage, tactile controls, or safety instructions

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1901–M1905 – Cooking appliances, clearances, and exhaust
• IBU overlays – Local fire, ventilation, sanitation, and accessibility code`
        },
        {
            id: 'kitchen_cook_2',
            name: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
            detail: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
            criteria: 'Cooking range, cooktop, or oven component is missing such that the device is unsafe for use.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-COOK-02',
            codeReference: `🧭 Step 1: Identify Cooking Appliances to Inspect
• Primary appliance: Must be present if the space is designated or used as a kitchen
• Types: Range, cooktop, oven, microwave, hot plate (if primary)

🔍 Step 2: Visual Condition Assessment
• Check for: Missing knobs, racks, grates, drip pans, and Broken door hinges, seals, or handles. Unsafe units must be corrected promptly.

🧪 Step 3: Functional Testing
• Burner Test: Ask POA (Property Owner/Agent) to turn on each burner; observe flame or heat
• Oven Test: Open oven, confirm heat production (feel above coil or check indicator)
• Microwave Test: Run for 30 seconds with a microwave-safe cup of water; check for heating
• Control Check: Confirm knobs, buttons, and displays respond properly
• Safety Scan: Look for exposed wires, broken glass, or missing components
Inspectors should not light pilot lights or operate appliances directly unless they are authorized to do so.

📏 Step 4: Accessibility & IBU Local Requirements
• Reach Range: Controls must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of appliance
• Safe Use: No sharp edges, hot surfaces, or obstructed access
• IBU Overlay: May require multilingual signage, tactile controls, or safety instructions

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1901–M1905 – Cooking appliances, clearances, and exhaust
• IBU overlays – Local fire, ventilation, sanitation, and accessibility code`
        },
        {
            id: 'kitchen_cook_3',
            name: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
            detail: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
            criteria: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'KITCHEN-COOK-03',
            codeReference: `🧭 Step 1: Identify Cooking Appliances to Inspect
• Primary appliance: Must be present if the space is designated or used as a kitchen
• Types: Range, cooktop, oven, microwave, hot plate (if primary)

🔍 Step 2: Visual Condition Assessment
• Check for: Missing knobs, racks, grates, drip pans, and Broken door hinges, seals, or handles. Unsafe units must be corrected promptly.

🧪 Step 3: Functional Testing
• Burner Test: Ask POA (Property Owner/Agent) to turn on each burner; observe flame or heat
• Oven Test: Open oven, confirm heat production (feel above coil or check indicator)
• Microwave Test: Run for 30 seconds with a microwave-safe cup of water; check for heating
• Control Check: Confirm knobs, buttons, and displays respond properly
• Safety Scan: Look for exposed wires, broken glass, or missing components
Inspectors should not light pilot lights or operate appliances directly unless they are authorized to do so.

📏 Step 4: Accessibility & IBU Local Requirements
• Reach Range: Controls must be within 15"–48" AFF
• Operability: Must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of appliance
• Safe Use: No sharp edges, hot surfaces, or obstructed access
• IBU Overlay: May require multilingual signage, tactile controls, or safety instructions

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC M1901–M1905 – Cooking appliances, clearances, and exhaust
• IBU overlays – Local fire, ventilation, sanitation, and accessibility code`
        }
    ]
};

export const KITCHEN_FOOD_PREP: UnitItemDeficiencies = {
    itemName: 'Food preparation Area',
    deficiencies: [
        {
            id: 'kitchen_food_1',
            name: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
            detail: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
            criteria: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FOOD-01',
            codeReference: `🧭 Step 1: Identify Food Preparation Areas, Surface Condition & Integrity
• Material check: Must be nonporous (e.g., laminate, stainless steel, sealed stone).
• Damage: Look for cracks, chips, burns, warping, or delamination.

🔍 Step 2: Presence & Identification
• Definition: A food preparation area is a flat, nonporous surface designed for cooking or preparing food.
• Required if: The space is designated or used as a kitchen or food prep zone.

🧪 Step 3: Functional Testing
• Surface Integrity Check: Run a hand across the surface to detect warping, cracks, or peeling
• Structural Stability: Gently press on the countertop to confirm it's securely mounted
• Backsplash Review: Inspect the wall behind the prep area for water damage or missing finish
No invasive testing required. visual and tactile observation.

📏 Step 4: Accessibility & Local Requirements
• Reach range: Surface must be usable by individuals with mobility aids
• Visual contrast: May be required for low-vision accessibility
• IBU Overlay: Could mandate multilingual signage or tactile indicators in shared-use kitchens

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R306.2 – Kitchen facilities and sanitation
• IRC R702.3: Wall finishes behind prep areas must be moisture-resistant
• IRC P2705.1: Countertops near sinks must allow access to plumbing and be sealed
• IRC R317.1: Moisture-prone surfaces must use decay-resistant materials
• IBU overlays – Local sanitation, accessibility, and fire safety codes`
        },
        {
            id: 'kitchen_food_2',
            name: 'Countertop is missing from the kitchen or food preparation space.',
            detail: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
            criteria: 'Countertop is missing from the kitchen or food preparation space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FOOD-02',
            codeReference: `🧭 Step 1: Identify Food Preparation Areas, Surface Condition & Integrity
• Material check: Must be nonporous (e.g., laminate, stainless steel, sealed stone).
• Damage: Look for cracks, chips, burns, warping, or delamination.

🔍 Step 2: Presence & Identification
• Definition: A food preparation area is a flat, nonporous surface designed for cooking or preparing food.
• Required if: The space is designated or used as a kitchen or food prep zone.

🧪 Step 3: Functional Testing
• Surface Integrity Check: Run a hand across the surface to detect warping, cracks, or peeling
• Structural Stability: Gently press on the countertop to confirm it's securely mounted
• Backsplash Review: Inspect the wall behind the prep area for water damage or missing finish
No invasive testing required. visual and tactile observation.

📏 Step 4: Accessibility & Local Requirements
• Reach range: Surface must be usable by individuals with mobility aids
• Visual contrast: May be required for low-vision accessibility
• IBU Overlay: Could mandate multilingual signage or tactile indicators in shared-use kitchens

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R306.2 – Kitchen facilities and sanitation
• IRC R702.3: Wall finishes behind prep areas must be moisture-resistant
• IRC P2705.1: Countertops near sinks must allow access to plumbing and be sealed
• IRC R317.1: Moisture-prone surfaces must use decay-resistant materials
• IBU overlays – Local sanitation, accessibility, and fire safety codes`
        }
    ]
};

export const KITCHEN_MOLD: UnitItemDeficiencies = {
    itemName: 'MOLD-LIKE SUBSTANCE',
    deficiencies: [
        {
            id: 'kitchen_mold_1',
            name: 'Elevated moisture level.',
            detail: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-MOLD-01',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
• Under sinks and inside cabinets, around dishwashers or refrigerators, behind or under cooking appliances
• On walls, ceilings, or backsplashes near cooking steam

🔍 Step 2: Visual Condition Assessment
Irregular patches or spots that are white, green, yellow, gray, brown, or black; may appear fuzzy, fussy or slimy

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, tenant education, or integrated moisture control

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R702.3: Interior finishes must resist moisture damage
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IBU overlays – Local health, ventilation, and moisture control codes`
        },
        {
            id: 'kitchen_mold_2',
            name: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'KITCHEN-MOLD-02',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
• Under sinks and inside cabinets, around dishwashers or refrigerators, behind or under cooking appliances
• On walls, ceilings, or backsplashes near cooking steam

🔍 Step 2: Visual Condition Assessment
Irregular patches or spots that are white, green, yellow, gray, brown, or black; may appear fuzzy, fussy or slimy

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, tenant education, or integrated moisture control

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R702.3: Interior finishes must resist moisture damage
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IBU overlays – Local health, ventilation, and moisture control codes`
        },
        {
            id: 'kitchen_mold_3',
            name: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'KITCHEN-MOLD-03',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
• Under sinks and inside cabinets, around dishwashers or refrigerators, behind or under cooking appliances
• On walls, ceilings, or backsplashes near cooking steam

🔍 Step 2: Visual Condition Assessment
Irregular patches or spots that are white, green, yellow, gray, brown, or black; may appear fuzzy, fussy or slimy

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, tenant education, or integrated moisture control

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R702.3: Interior finishes must resist moisture damage
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IBU overlays – Local health, ventilation, and moisture control codes`
        },
        {
            id: 'kitchen_mold_4',
            name: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            detail: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-MOLD-04',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
• Under sinks and inside cabinets, around dishwashers or refrigerators, behind or under cooking appliances
• On walls, ceilings, or backsplashes near cooking steam

🔍 Step 2: Visual Condition Assessment
Irregular patches or spots that are white, green, yellow, gray, brown, or black; may appear fuzzy, fussy or slimy

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, tenant education, or integrated moisture control

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R702.3: Interior finishes must resist moisture damage
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IBU overlays – Local health, ventilation, and moisture control codes`
        }
    ]
};

export const KITCHEN_REFRIGERATOR: UnitItemDeficiencies = {
    itemName: 'Refrigerator',
    deficiencies: [
        {
            id: 'kitchen_fridge_1',
            name: 'Refrigerator component is damaged such that it impacts functionality.',
            detail: 'Refrigerator component is damaged such that it impacts functionality.',
            criteria: 'Refrigerator component is damaged such that it impacts functionality.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FRIDGE-01',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Appliance type: Standard refrigerator with built-in freezer

🔍 Step 2: Visual Condition Assessment
• Cooling test: Confirm refrigerator maintains 32–40°F and freezer <32°F
• Power check: Unit must be plugged in and running (audible compressor or internal light)

🧪 Step 3: Functional Testing
• Cooling Test: Open refrigerator and freezer doors; feel for cold air
• Confirm freezer maintains temperature below 32°F
• Refrigerator should be between 32°F and 40°F
• Component Check: Inspect shelves, drawers, seals, and lightbulbs for damage
• Door Seal Test: Close the door and gently tug to confirm the seal is intact
• Noise & Vibration: Listen for abnormal sounds indicating compressor issues

📏 Step 4: Electrical & Accessibility Compliance
• Dedicated outlet: Refrigerator should be on a dedicated circuit per NEC overlays
• Cord condition: No fraying, exposed wires, or unsafe routing
• Reach range: Controls and handles should be within ADA-compliant height (typically 15–48" AFF)
• IBU Overlay: May require multilingual signage or tactile controls in shared-use kitchens

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R306.2 – Kitchen facilities and sanitation
• IBU overlays – Local health, food safety, and accessibility codes`
        },
        {
            id: 'kitchen_fridge_2',
            name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            detail: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            criteria: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FRIDGE-02',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Appliance type: Standard refrigerator with built-in freezer

🔍 Step 2: Visual Condition Assessment
• Cooling test: Confirm refrigerator maintains 32–40°F and freezer <32°F
• Power check: Unit must be plugged in and running (audible compressor or internal light)

🧪 Step 3: Functional Testing
• Cooling Test: Open refrigerator and freezer doors; feel for cold air
• Confirm freezer maintains temperature below 32°F
• Refrigerator should be between 32°F and 40°F
• Component Check: Inspect shelves, drawers, seals, and lightbulbs for damage
• Door Seal Test: Close the door and gently tug to confirm the seal is intact
• Noise & Vibration: Listen for abnormal sounds indicating compressor issues

📏 Step 4: Electrical & Accessibility Compliance
• Dedicated outlet: Refrigerator should be on a dedicated circuit per NEC overlays
• Cord condition: No fraying, exposed wires, or unsafe routing
• Reach range: Controls and handles should be within ADA-compliant height (typically 15–48" AFF)
• IBU Overlay: May require multilingual signage or tactile controls in shared-use kitchens

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R306.2 – Kitchen facilities and sanitation
• IBU overlays – Local health, food safety, and accessibility codes`
        }
    ]
};

export const KITCHEN_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'kitchen_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Hot and cold water cannot be activated or deactivated.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-01',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'kitchen_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            criteria: 'Sink component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-02',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'kitchen_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-03',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'kitchen_sink_4',
            name: 'The sink is not draining, not functioning adequately.',
            detail: 'The sink is not draining, not functioning adequately.',
            criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-04',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'kitchen_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            criteria: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-05',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'kitchen_sink_6',
            name: 'Water pressure, direction (outside the basin).',
            detail: 'Water pressure, direction (outside the basin). The water pressure direction is not functioning properly.',
            criteria: 'Water pressure, direction is not adequately functional.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'KITCHEN-SINK-06',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• NSPIRE Deficiency #1: Missing kitchen sink in a designated kitchen = Moderate
• IRC Requirement: Sink must provide hot and cold water and be connected to a sanitary sewer or approved private sewage system.

🔍 Step 2: Visual Condition Assessment
• Surface condition: Must be free of grime, food residue, mold, or pest attractants.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; check for leaks or slow drainage
• Mounting Check: Gently press sink edges to confirm secure installation
• Leak Inspection: Look under the sink for moisture, stains, or active drips
• Stopper Functionality: Confirm stopper seals correctly and releases water when activated

📏 Step 4: Accessibility & IBU Local Requirements
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink
• IBU Overlay: May require lever-style handles, anti-scald protection, or tactile indicators

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        }
    ]
};

export const KITCHEN_VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation',
    deficiencies: [
        {
            id: 'kitchen_vent_1',
            name: 'Ventilation (with or without a fan).',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-01',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Acceptable systems:
• Mechanical exhaust hood vented to exterior
• Through-wall fan venting directly outside

🔍 Step 2: Visual Condition Assessment
• Inspect intake area: Ensure no grease buildup, debris, or physical blockage.
• Check filters: Must be clean and properly seated

🧪 Step 3: Functional Testing
• Fan Activation: Turn on exhaust fans (bathroom, kitchen) and confirm airflow or sound
• Airflow Check: Use a tissue or hand test to confirm air movement at supply/return vents
• Visual Scan: Inspect for dust buildup, mold-like substance, or damaged components
• Moisture Review: Look for condensation, water stains, or mildew near vents or fans

📏 Step 4: Accessibility & Local Requirement
• Reach range: Controls must be within ADA-compliant height (typically 15–48" AFF)
• Labeling: Fan switch should be clearly marked
• IBU Local Codes: May require multilingual signage, tactile controls, or maintenance logs

⚒️ Step 5: IRC Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• IRC M1506.2: Air intake openings must be protected and unobstructed`
        },
        {
            id: 'kitchen_vent_2',
            name: 'Ventilation (with or without a fan).',
            detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). Or an exhaust system component is missing.',
            criteria: 'Exhaust system component is damaged. OR Exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-02',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Acceptable systems:
• Mechanical exhaust hood vented to exterior
• Through-wall fan venting directly outside

🔍 Step 2: Visual Condition Assessment
• Inspect intake area: Ensure no grease buildup, debris, or physical blockage.
• Check filters: Must be clean and properly seated

🧪 Step 3: Functional Testing
• Fan Activation: Turn on exhaust fans (bathroom, kitchen) and confirm airflow or sound
• Airflow Check: Use a tissue or hand test to confirm air movement at supply/return vents
• Visual Scan: Inspect for dust buildup, mold-like substance, or damaged components
• Moisture Review: Look for condensation, water stains, or mildew near vents or fans

📏 Step 4: Accessibility & Local Requirement
• Reach range: Controls must be within ADA-compliant height (typically 15–48" AFF)
• Labeling: Fan switch should be clearly marked
• IBU Local Codes: May require multilingual signage, tactile controls, or maintenance logs

⚒️ Step 5: IRC Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• IRC M1506.2: Air intake openings must be protected and unobstructed`
        },
        {
            id: 'kitchen_vent_3',
            name: 'Ventilation (with or without a fan).',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-03',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Acceptable systems:
• Mechanical exhaust hood vented to exterior
• Through-wall fan venting directly outside

🔍 Step 2: Visual Condition Assessment
• Inspect intake area: Ensure no grease buildup, debris, or physical blockage.
• Check filters: Must be clean and properly seated

🧪 Step 3: Functional Testing
• Fan Activation: Turn on exhaust fans (bathroom, kitchen) and confirm airflow or sound
• Airflow Check: Use a tissue or hand test to confirm air movement at supply/return vents
• Visual Scan: Inspect for dust buildup, mold-like substance, or damaged components
• Moisture Review: Look for condensation, water stains, or mildew near vents or fans

📏 Step 4: Accessibility & Local Requirement
• Reach range: Controls must be within ADA-compliant height (typically 15–48" AFF)
• Labeling: Fan switch should be clearly marked
• IBU Local Codes: May require multilingual signage, tactile controls, or maintenance logs

⚒️ Step 5: IRC Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• IRC M1506.2: Air intake openings must be protected and unobstructed`
        },
        {
            id: 'kitchen_vent_4',
            name: 'Ventilation (with or without a fan).',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-04',
            codeReference: `🧭 Step 1: Presence & Identification
• Required if: The space is designated or used as a kitchen or food prep zone.
• Acceptable systems:
• Mechanical exhaust hood vented to exterior
• Through-wall fan venting directly outside

🔍 Step 2: Visual Condition Assessment
• Inspect intake area: Ensure no grease buildup, debris, or physical blockage.
• Check filters: Must be clean and properly seated

🧪 Step 3: Functional Testing
• Fan Activation: Turn on exhaust fans (bathroom, kitchen) and confirm airflow or sound
• Airflow Check: Use a tissue or hand test to confirm air movement at supply/return vents
• Visual Scan: Inspect for dust buildup, mold-like substance, or damaged components
• Moisture Review: Look for condensation, water stains, or mildew near vents or fans

📏 Step 4: Accessibility & Local Requirement
• Reach range: Controls must be within ADA-compliant height (typically 15–48" AFF)
• Labeling: Fan switch should be clearly marked
• IBU Local Codes: May require multilingual signage, tactile controls, or maintenance logs

⚒️ Step 5: IRC Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• IRC M1506.2: Air intake openings must be protected and unobstructed`
        }
    ]
};

export const KITCHEN_DEFICIENCIES = {
    category: '18. Kitchen',
    items: [KITCHEN_CABINET, KITCHEN_COOKING, KITCHEN_FOOD_PREP, KITCHEN_MOLD, KITCHEN_REFRIGERATOR, KITCHEN_SINK, KITCHEN_VENTILATION]
};

// ==========================================
// 19. LEAK – GAS OR OIL
// ==========================================

export const LEAK_GAS_OIL: UnitItemDeficiencies = {
    itemName: 'LEAK – Gas or Oil',
    deficiencies: [
        {
            id: 'leak_gas_1',
            name: 'Natural gas, propane, or oil leak.',
            detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
            criteria: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '54.50/n',
            code: 'LEAK-GAS-01',
            codeReference: `🧭 Step 1: Identify Fuel Sources and Risk Zones
Inspect all areas where fuel-burning appliances or fuel lines are present.
NSPIRE defines a leak as any unintended release of natural gas, propane, or heating oil into a space where it is not intended to be present.

🔍 Step 2: Visual and Sensory Assessment
Gas/propane Leak-Smell (e.g., rotten egg odor from mercaptan), Oil leak -Oil stains or pooling

🧪 Step 3: Inspection Technique
• Smell Test: Carefully note any strong sulfur-like odor (mercaptan additive in natural gas)
• Sound Check: Listen for hissing near valves, regulators, or appliance connections
• Visual Scan: Look for oil stains, wet spots, or corrosion around fuel lines and tanks
• Cap & Valve Review: Confirm all fuel supply lines are securely capped when not in use
Do not touch or manipulate fuel lines or valves unless certified and authorized.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Fuel leaks must not impair air quality or mobility
• Clear Paths: No fuel lines or tanks should obstruct accessible routes
• Sensory Safety: Odors or fumes must not compromise the health of residents with sensitivities
IBU emphasizes maintaining a clean, safe, and unobstructed environment for all residents

⚒️ Step 5: IRC Fuel System Requirements
• IRC G2415.1–G2415.17: Fuel gas piping must be sealed, supported, and protected from damage
• IRC G2420.5: Shutoff valves must be accessible and operable
• IRC G2421.1: Appliance connectors must be listed and properly installed
• IRC G2406.2: Fuel-burning appliances must not draw air from sleeping areas or bathrooms
IRC ensures fuel systems are safely installed, vented, and maintained to prevent leaks`
        }
    ]
};

export const LEAK_GAS_OIL_DEFICIENCIES = {
    category: '19. LEAK – Gas or Oil',
    items: [LEAK_GAS_OIL]
};

// ==========================================
// 20. LEAK-SEWAGE SYSTEM (CLOGGED DRAIN)(MISSING DRAIN CAP)
// ==========================================

export const LEAK_SEWAGE: UnitItemDeficiencies = {
    itemName: 'Leak-sewage system (Clogged drain)(Missing drain cap)',
    deficiencies: [
        {
            id: 'leak_sewage_1',
            name: 'Blocked sewage system.',
            detail: 'Wastewater is unable to drain resulting in sewer backup.',
            criteria: 'Blocked sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LEAK-SEWAGE-01',
            codeReference: `🧭 Step 1: Identify Sewage System Components and Risk Zones
Inspect all areas where sanitary drainage systems are present or discharge wastewater.

🔍 Step 2: Visual and Sensory Condition Assessment
Detached, missing, or damaged cleanout cap, Foul odor with no visible leak

🧪 Step 3: Inspection Technique
• Odor Detection: Walk through common areas and note any persistent foul smells (sulfur, rot)
• Visual Scan: Look for pooling wastewater, wet spots near drains, or staining around cleanouts
• Fixture Behavior: Flush toilets and run sinks to check for slow drainage or backup
• Component Check: Inspect cleanout caps, risers, and pump covers for cracks or missing parts

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Sewage leaks must not impair air quality or mobility
• Clear Paths: No pooling wastewater or exposed piping in accessible routes
• Sensory Safety: Odors must not compromise the health of residents with sensitivities
• Slip Hazards: Wet floors from leaks must be addressed immediately

⚒️ Step 5: IRC Sanitary Drainage Requirements
• IRC P3001–P3005: Drainage systems must be watertight, vented, and properly sloped
• IRC P3007.1: Cleanouts must be accessible and capped
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P3008.1: Backwater valves are required where the risk of sewer backup exists`
        },
        {
            id: 'leak_sewage_2',
            name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
            detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Cap to the cleanout or pump cover is detached or missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-SEWAGE-02',
            codeReference: `🧭 Step 1: Identify Sewage System Components and Risk Zones
Inspect all areas where sanitary drainage systems are present or discharge wastewater.

🔍 Step 2: Visual and Sensory Condition Assessment
Detached, missing, or damaged cleanout cap, Foul odor with no visible leak

🧪 Step 3: Inspection Technique
• Odor Detection: Walk through common areas and note any persistent foul smells (sulfur, rot)
• Visual Scan: Look for pooling wastewater, wet spots near drains, or staining around cleanouts
• Fixture Behavior: Flush toilets and run sinks to check for slow drainage or backup
• Component Check: Inspect cleanout caps, risers, and pump covers for cracks or missing parts

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Sewage leaks must not impair air quality or mobility
• Clear Paths: No pooling wastewater or exposed piping in accessible routes
• Sensory Safety: Odors must not compromise the health of residents with sensitivities
• Slip Hazards: Wet floors from leaks must be addressed immediately

⚒️ Step 5: IRC Sanitary Drainage Requirements
• IRC P3001–P3005: Drainage systems must be watertight, vented, and properly sloped
• IRC P3007.1: Cleanouts must be accessible and capped
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P3008.1: Backwater valves are required where the risk of sewer backup exists`
        },
        {
            id: 'leak_sewage_3',
            name: 'Cleanout cap or riser is damaged.',
            detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
            criteria: 'Protective cap or riser is damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-SEWAGE-03',
            codeReference: `🧭 Step 1: Identify Sewage System Components and Risk Zones
Inspect all areas where sanitary drainage systems are present or discharge wastewater.

🔍 Step 2: Visual and Sensory Condition Assessment
Detached, missing, or damaged cleanout cap, Foul odor with no visible leak

🧪 Step 3: Inspection Technique
• Odor Detection: Walk through common areas and note any persistent foul smells (sulfur, rot)
• Visual Scan: Look for pooling wastewater, wet spots near drains, or staining around cleanouts
• Fixture Behavior: Flush toilets and run sinks to check for slow drainage or backup
• Component Check: Inspect cleanout caps, risers, and pump covers for cracks or missing parts

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Sewage leaks must not impair air quality or mobility
• Clear Paths: No pooling wastewater or exposed piping in accessible routes
• Sensory Safety: Odors must not compromise the health of residents with sensitivities
• Slip Hazards: Wet floors from leaks must be addressed immediately

⚒️ Step 5: IRC Sanitary Drainage Requirements
• IRC P3001–P3005: Drainage systems must be watertight, vented, and properly sloped
• IRC P3007.1: Cleanouts must be accessible and capped
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P3008.1: Backwater valves are required where the risk of sewer backup exists`
        },
        {
            id: 'leak_sewage_4',
            name: 'Leak in sewage system.',
            detail: 'There is evidence of a sewer line or fitting leaking.',
            criteria: 'Leak in sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LEAK-SEWAGE-04',
            codeReference: `🧭 Step 1: Identify Sewage System Components and Risk Zones
Inspect all areas where sanitary drainage systems are present or discharge wastewater.

🔍 Step 2: Visual and Sensory Condition Assessment
Detached, missing, or damaged cleanout cap, Foul odor with no visible leak

🧪 Step 3: Inspection Technique
• Odor Detection: Walk through common areas and note any persistent foul smells (sulfur, rot)
• Visual Scan: Look for pooling wastewater, wet spots near drains, or staining around cleanouts
• Fixture Behavior: Flush toilets and run sinks to check for slow drainage or backup
• Component Check: Inspect cleanout caps, risers, and pump covers for cracks or missing parts

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Sewage leaks must not impair air quality or mobility
• Clear Paths: No pooling wastewater or exposed piping in accessible routes
• Sensory Safety: Odors must not compromise the health of residents with sensitivities
• Slip Hazards: Wet floors from leaks must be addressed immediately

⚒️ Step 5: IRC Sanitary Drainage Requirements
• IRC P3001–P3005: Drainage systems must be watertight, vented, and properly sloped
• IRC P3007.1: Cleanouts must be accessible and capped
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P3008.1: Backwater valves are required where the risk of sewer backup exists`
        }
    ]
};

export const LEAK_SEWAGE_DEFICIENCIES = {
    category: '20. Leak-sewage system (Clogged drain)(Missing drain cap)',
    items: [LEAK_SEWAGE]
};

// ==========================================
// 21. LEAK- WATER
// ==========================================

export const LEAK_WATER: UnitItemDeficiencies = {
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
            code: 'LEAK-WATER-01',
            codeReference: `🧭 Step 1: Identify Leak-Prone Zones and Components
Inspect all areas and systems where water leaks may originate.

🔍 Step 2: Visual Condition Assessment
Environmental water intrusion, Environmental water intrusion, Plumbing leak

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, bubbling paint, warped flooring, or ceiling stains
• Touch Test: Gently press suspect areas for dampness or softness
• Odor Check: Note musty smells that may indicate hidden moisture
• Component Review: Inspect under sinks, behind appliances, and around sprinkler heads
• Resident/POA Inquiry: If signs of a past leak are present, ask whether repairs were made

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Leaks must not impair air quality or mobility
• Clear Paths: No pooling water or wet flooring in accessible routes
• Sensory Safety: Odors or allergens must not compromise health
• Slip Hazards: Wet surfaces must be addressed immediately

⚒️ Step 5: IRC Plumbing & Moisture Control Requirements
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P2705.1: Fixtures must be watertight and properly connected
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent moisture buildup`
        },
        {
            id: 'leak_water_2',
            name: 'Fluid is leaking from the sprinkler assembly.',
            detail: 'Fluid is leaking from the sprinkler assembly.',
            criteria: 'Fluid is leaking from the sprinkler assembly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-WATER-02',
            codeReference: `🧭 Step 1: Identify Leak-Prone Zones and Components
Inspect all areas and systems where water leaks may originate.

🔍 Step 2: Visual Condition Assessment
Environmental water intrusion, Environmental water intrusion, Plumbing leak

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, bubbling paint, warped flooring, or ceiling stains
• Touch Test: Gently press suspect areas for dampness or softness
• Odor Check: Note musty smells that may indicate hidden moisture
• Component Review: Inspect under sinks, behind appliances, and around sprinkler heads
• Resident/POA Inquiry: If signs of a past leak are present, ask whether repairs were made

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Leaks must not impair air quality or mobility
• Clear Paths: No pooling water or wet flooring in accessible routes
• Sensory Safety: Odors or allergens must not compromise health
• Slip Hazards: Wet surfaces must be addressed immediately

⚒️ Step 5: IRC Plumbing & Moisture Control Requirements
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P2705.1: Fixtures must be watertight and properly connected
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent moisture buildup`
        },
        {
            id: 'leak_water_3',
            name: 'Plumbing leak',
            detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
            criteria: 'Plumbing leak.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-WATER-03',
            codeReference: `🧭 Step 1: Identify Leak-Prone Zones and Components
Inspect all areas and systems where water leaks may originate.

🔍 Step 2: Visual Condition Assessment
Environmental water intrusion, Environmental water intrusion, Plumbing leak

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, bubbling paint, warped flooring, or ceiling stains
• Touch Test: Gently press suspect areas for dampness or softness
• Odor Check: Note musty smells that may indicate hidden moisture
• Component Review: Inspect under sinks, behind appliances, and around sprinkler heads
• Resident/POA Inquiry: If signs of a past leak are present, ask whether repairs were made

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Leaks must not impair air quality or mobility
• Clear Paths: No pooling water or wet flooring in accessible routes
• Sensory Safety: Odors or allergens must not compromise health
• Slip Hazards: Wet surfaces must be addressed immediately

⚒️ Step 5: IRC Plumbing & Moisture Control Requirements
• IRC P2601.2: Plumbing systems must be maintained in a sanitary condition
• IRC P2705.1: Fixtures must be watertight and properly connected
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent moisture buildup`
        }
    ]
};

export const LEAK_WATER_DEFICIENCIES = {
    category: '21. Leak- water',
    items: [LEAK_WATER]
};

// ==========================================
// 22. LIGHTING
// ==========================================

export const LIGHTING_AUXILIARY: UnitItemDeficiencies = {
    itemName: 'Lighting - Auxiliary',
    deficiencies: [
        {
            id: 'lighting_aux_1',
            name: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
            detail: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
            criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LIGHTING-AUX-01',
            codeReference: `🧭 Step 1: Identify Auxiliary Lighting Components and Locations
Inspect all emergency lighting systems designed to operate during power outages.

🔍 Step 2: Visual Condition Assessment
Fixture hanging loose or improperly mounted, Evidence of prior installation but missing

🧪 Step 3: Functional Testing
• Test Button Activation: Press the test button and confirm the light remains illuminated for the full duration
• Visual Inspection: Check for damage, missing components, or loose mounting
• Battery Inquiry: Ask POA (Property Owner/Agent) if backup battery is remotely located
• Combination Units: If the fixture includes both an exit sign and an auxiliary light, inspect and score each separately

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Mounting Height: Controls must be within 15"–48" AFF if accessible
• Clear Floor Space: Minimum 30"x48" in front of lighting controls
• Safe Environment: No exposed wiring or sharp edges in accessible paths
• Visual Clarity: Fixtures must be unobstructed and clearly visible during emergencies

⚒️ Step 5: IRC Electrical Safety Requirements
• IRC E3905.1–E3905.12: Electrical boxes and fixtures must be moisture-resistant and securely mounted
• IRC E3907.1: Lighting fixtures must be listed and installed per the manufacturer's specs
• IRC R317.1: Moisture-prone areas must use corrosion-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior fixtures`
        }
    ]
};

export const LIGHTING_INTERIOR: UnitItemDeficiencies = {
    itemName: 'Lighting - Interior',
    deficiencies: [
        {
            id: 'lighting_int_1',
            name: 'A permanently installed light fixture is inoperable.',
            detail: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            criteria: 'A permanently installed light fixture is inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-01',
            codeReference: `🧭 Step 1: Identify Interior Lighting Components and Locations
Inspect all permanently installed light fixtures in shared-use indoor spaces.

🔍 Step 2: Visual Condition Assessment
Plug-in lamps do not satisfy NSPIRE requirements for kitchens or bathrooms.

🧪 Step 3: Functional Testing
• Switch Activation: Flip the wall switch and confirm the fixture illuminates fully
• Bulb Check: If the fixture doesn't work, inspect for missing or burned-out bulbs
• Mounting Stability: Gently test the fixture for secure attachment to the wall or ceiling
• Cover Inspection: Check for cracked, missing, or sharp-edged globes
• Wiring Safety: Look for exposed conductors or signs of overheating
All bulbs in multi-bulb fixtures must illuminate during testing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Switch Height: Must be within 15"–48" AFF for accessible use
• Clear Floor Space: Minimum 30"x48" in front of switches
• Safe Environment: No protruding fixtures or sharp edges in circulation paths
• Visual Clarity: Lighting must support safe navigation for residents with low vision

⚒️ Step 5: IRC Electrical & Illumination Requirements
• IRC E3905.1–E3905.12: Fixtures must be securely mounted and properly wired
• IRC E3903.2: Lighting outlets required in habitable rooms, hallways, stairways
• IRC E3903.3: Bathrooms must have at least one wall switch-controlled light
• IRC R303.1: Artificial lighting must provide adequate illumination when natural light is insufficient`
        },
        {
            id: 'lighting_int_2',
            name: 'A permanently installed light fixture is not secure.',
            detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-02',
            codeReference: `🧭 Step 1: Identify Interior Lighting Components and Locations
Inspect all permanently installed light fixtures in shared-use indoor spaces.

🔍 Step 2: Visual Condition Assessment
Plug-in lamps do not satisfy NSPIRE requirements for kitchens or bathrooms.

🧪 Step 3: Functional Testing
• Switch Activation: Flip the wall switch and confirm the fixture illuminates fully
• Bulb Check: If the fixture doesn't work, inspect for missing or burned-out bulbs
• Mounting Stability: Gently test the fixture for secure attachment to the wall or ceiling
• Cover Inspection: Check for cracked, missing, or sharp-edged globes
• Wiring Safety: Look for exposed conductors or signs of overheating
All bulbs in multi-bulb fixtures must illuminate during testing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Switch Height: Must be within 15"–48" AFF for accessible use
• Clear Floor Space: Minimum 30"x48" in front of switches
• Safe Environment: No protruding fixtures or sharp edges in circulation paths
• Visual Clarity: Lighting must support safe navigation for residents with low vision

⚒️ Step 5: IRC Electrical & Illumination Requirements
• IRC E3905.1–E3905.12: Fixtures must be securely mounted and properly wired
• IRC E3903.2: Lighting outlets required in habitable rooms, hallways, stairways
• IRC E3903.3: Bathrooms must have at least one wall switch-controlled light
• IRC R303.1: Artificial lighting must provide adequate illumination when natural light is insufficient`
        },
        {
            id: 'lighting_int_3',
            name: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
            detail: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom. Permanent lighting fixtures are missing or not functioning.',
            criteria: 'Permanent lighting fixtures are missing or not functioning.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-03',
            codeReference: `🧭 Step 1: Identify Interior Lighting Components and Locations
Inspect all permanently installed light fixtures in shared-use indoor spaces.

🔍 Step 2: Visual Condition Assessment
Plug-in lamps do not satisfy NSPIRE requirements for kitchens or bathrooms.

🧪 Step 3: Functional Testing
• Switch Activation: Flip the wall switch and confirm the fixture illuminates fully
• Bulb Check: If the fixture doesn't work, inspect for missing or burned-out bulbs
• Mounting Stability: Gently test the fixture for secure attachment to the wall or ceiling
• Cover Inspection: Check for cracked, missing, or sharp-edged globes
• Wiring Safety: Look for exposed conductors or signs of overheating
All bulbs in multi-bulb fixtures must illuminate during testing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Switch Height: Must be within 15"–48" AFF for accessible use
• Clear Floor Space: Minimum 30"x48" in front of switches
• Safe Environment: No protruding fixtures or sharp edges in circulation paths
• Visual Clarity: Lighting must support safe navigation for residents with low vision

⚒️ Step 5: IRC Electrical & Illumination Requirements
• IRC E3905.1–E3905.12: Fixtures must be securely mounted and properly wired
• IRC E3903.2: Lighting outlets required in habitable rooms, hallways, stairways
• IRC E3903.3: Bathrooms must have at least one wall switch-controlled light
• IRC R303.1: Artificial lighting must provide adequate illumination when natural light is insufficient`
        }
    ]
};

export const LIGHTING_DEFICIENCIES = {
    category: '22. Lighting',
    items: [LIGHTING_AUXILIARY, LIGHTING_INTERIOR]
};

// ==========================================
// 23. MOLD
// ==========================================

export const MOLD: UnitItemDeficiencies = {
    itemName: 'Mold - Like Substance',
    deficiencies: [
        {
            id: 'mold_1',
            name: 'Elevated moisture level.',
            detail: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'MOLD-01',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.
🧪 Step 3: Inspection Technique
• 	Visual Scan:
• 	Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• 	Odor Check:
• 	Note musty or earthy smells, but only record if visual confirmation exists
• 	Moisture Source Review:  Inspect for leaks, condensation, or poor ventilation near affected areas
• 	Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
• 	Safe Environment: Mold-like substance must not impair air quality or mobility
• 	Clear Paths: Affected areas must not obstruct accessible routes
• 	Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities
⚒️ Step 5: IRC Moisture & Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials
• 	IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• 	IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'mold_2',
            name: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'MOLD-02',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.
🧪 Step 3: Inspection Technique
• 	Visual Scan:
• 	Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• 	Odor Check:
• 	Note musty or earthy smells, but only record if visual confirmation exists
• 	Moisture Source Review:  Inspect for leaks, condensation, or poor ventilation near affected areas
• 	Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
• 	Safe Environment: Mold-like substance must not impair air quality or mobility
• 	Clear Paths: Affected areas must not obstruct accessible routes
• 	Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities
⚒️ Step 5: IRC Moisture & Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials
• 	IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• 	IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'mold_3',
            name: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'MOLD-03',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.
🧪 Step 3: Inspection Technique
• 	Visual Scan:
• 	Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• 	Odor Check:
• 	Note musty or earthy smells, but only record if visual confirmation exists
• 	Moisture Source Review:  Inspect for leaks, condensation, or poor ventilation near affected areas
• 	Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
• 	Safe Environment: Mold-like substance must not impair air quality or mobility
• 	Clear Paths: Affected areas must not obstruct accessible routes
• 	Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities
⚒️ Step 5: IRC Moisture & Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials
• 	IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• 	IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'mold_4',
            name: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            detail: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'MOLD-04',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.
🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.
🧪 Step 3: Inspection Technique
• 	Visual Scan:
• 	Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• 	Odor Check:
• 	Note musty or earthy smells, but only record if visual confirmation exists
• 	Moisture Source Review:  Inspect for leaks, condensation, or poor ventilation near affected areas
• 	Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food
📏 Step 4: Accessibility & Disability  Considerations. "IBU"
• 	Safe Environment: Mold-like substance must not impair air quality or mobility
• 	Clear Paths: Affected areas must not obstruct accessible routes
• 	Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities
⚒️ Step 5: IRC Moisture & Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC R317.1: Moisture-prone areas must use decay-resistant materials
• 	IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• 	IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        }
    ]
};

export const MOLD_DEFICIENCIES = {
    category: '23. Mold',
    items: [MOLD]
};

// ==========================================
// 24. PAINT - POTENTIAL LEAD-BASED PAINT HAZARDS – VISUAL ASSESSMENT
// ==========================================

export const PAINT: UnitItemDeficiencies = {
    itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
    deficiencies: [
        {
            id: 'paint_1',
            name: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
            detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component (“de minimis”).',
            criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'PAINT-01',
            codeReference: `🧭 Step 1: Determine Applicability
Before inspecting, confirm whether the property is at risk for lead-based paint.

🔍 Step 2: Visual Condition Assessment
Inspect all painted surfaces in common areas for deterioration.

🧪 Step 3: Surface Area Measurement
Use a tape measure or visual estimation to calculate the affected area. Record per room or per component.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Deteriorated paint must not impair air quality or pose ingestion risk
• Reach Zones: Pay special attention to surfaces within 36" AFF, accessible to children
• Clear Paths: No flaking paint in circulation zones or near seating areas
• Visual Safety: Paint deterioration must not obscure signage or contrast surfaces

⚒️ Step 5: IRC Surface & Renovation Requirements
• IRC R702.3: Interior finishes must be properly bonded and maintained
• IRC R315.1: Renovation of painted surfaces must follow safe work practices
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Exterior finishes must be sealed to prevent deterioration`
        },
        {
            id: 'paint_2',
            name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
            detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component (“significant”).',
            criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'PAINT-02',
            codeReference: `🧭 Step 1: Determine Applicability
Before inspecting, confirm whether the property is at risk for lead-based paint.

🔍 Step 2: Visual Condition Assessment
Inspect all painted surfaces in common areas for deterioration.

🧪 Step 3: Surface Area Measurement
Use a tape measure or visual estimation to calculate the affected area. Record per room or per component.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Deteriorated paint must not impair air quality or pose ingestion risk
• Reach Zones: Pay special attention to surfaces within 36" AFF, accessible to children
• Clear Paths: No flaking paint in circulation zones or near seating areas
• Visual Safety: Paint deterioration must not obscure signage or contrast surfaces

⚒️ Step 5: IRC Surface & Renovation Requirements
• IRC R702.3: Interior finishes must be properly bonded and maintained
• IRC R315.1: Renovation of painted surfaces must follow safe work practices
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Exterior finishes must be sealed to prevent deterioration`
        }
    ]
};

export const PAINT_DEFICIENCIES = {
    category: '24. Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
    items: [PAINT]
};

// ==========================================
// 25. RAILINGS
// ==========================================

export const RAILINGS_GUARDRAIL: UnitItemDeficiencies = {
    itemName: 'Guardrail',
    deficiencies: [
        {
            id: 'railing_guard_1',
            name: 'The guardrail is missing or not installed along a walking surface that is more than 30 inches above the floor or grade below.',
            detail: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            criteria: 'The guardrail is missing or not installed along a walking surface that is more than 30 inches above the floor or grade below.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'RAILING-GUARD-01',
            codeReference: `🧭 Step 1: Identify Guardrail Locations
Inspect all elevated walking surfaces where a fall hazard may exist.

🔍 Step 2: Visual Condition Assessment
Guardrail loose or unstable, Guardrail damaged or incomplete, Guardrail missing or not installed

🧪 Step 3: Functional Testing
• Height Check: Measure from the walking surface to the top of the guardrail; must be ≥30 inches
• Stability Test: Apply moderate force (push/pull) to confirm guardrail is securely anchored
• Component Review: Confirm presence of top rail, mid rail, vertical balusters, and posts
• Spacing Check: Openings between balusters should prevent passage of a 4-inch sphere (per IBC/ADA)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Circulation: Guardrails must not obstruct accessible paths
• Edge Protection: Must prevent falls for users with mobility aids
• Visual Contrast: Guardrails should be distinguishable from surroundings
• Reach Hazards: No sharp edges or protrusions within reach zones

⚒️ Step 5: IRC Guardrail Requirements
• IRC R312.1.1: Guardrails required on open-sided walking surfaces ≥30" above grade
• IRC R312.1.2: Minimum guardrail height = 36 inches (IRC exceeds NSPIRE's 30")
• IRC R312.1.3: Openings must prevent the passage of a 4-inch diameter sphere
• IRC R301.5: Guardrails must resist a 200 lb load applied in any direction`
        },
        {
            id: 'railing_guard_2',
            name: 'Guard rail component, missing, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            detail: 'Guard rail component, missing, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            criteria: 'A guardrail is deficient if it’s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to effectively prevent fall hazards.',
            severity: 'Life-Threatening',
            repairBy: '24 Hrs.',
            points: '27.25/n',
            code: 'RAILING-GUARD-02',
            codeReference: `🧭 Step 1: Identify Guardrail Locations
Inspect all elevated walking surfaces where a fall hazard may exist.

🔍 Step 2: Visual Condition Assessment
Guardrail loose or unstable, Guardrail damaged or incomplete, Guardrail missing or not installed

🧪 Step 3: Functional Testing
• Height Check: Measure from the walking surface to the top of the guardrail; must be ≥30 inches
• Stability Test: Apply moderate force (push/pull) to confirm guardrail is securely anchored
• Component Review: Confirm presence of top rail, mid rail, vertical balusters, and posts
• Spacing Check: Openings between balusters should prevent passage of a 4-inch sphere (per IBC/ADA)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Circulation: Guardrails must not obstruct accessible paths
• Edge Protection: Must prevent falls for users with mobility aids
• Visual Contrast: Guardrails should be distinguishable from surroundings
• Reach Hazards: No sharp edges or protrusions within reach zones

⚒️ Step 5: IRC Guardrail Requirements
• IRC R312.1.1: Guardrails required on open-sided walking surfaces ≥30" above grade
• IRC R312.1.2: Minimum guardrail height = 36 inches (IRC exceeds NSPIRE's 30")
• IRC R312.1.3: Openings must prevent the passage of a 4-inch diameter sphere
• IRC R301.5: Guardrails must resist a 200 lb load applied in any direction`
        }
    ]
};

export const RAILINGS_HANDRAIL: UnitItemDeficiencies = {
    itemName: 'Handrail',
    deficiencies: [
        {
            id: 'railing_hand_1',
            name: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches',
            detail: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches',
            criteria: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '27.25/n',
            code: 'RAILING-HAND-01',
            codeReference: `🧭 Step 1: Identify Handrail Locations
Inspect all areas where handrails are required or installed.

🔍 Step 2: Visual Condition Assessment
Handrail missing where required, Handrail loose or unstable, Handrail not continuous

🧪 Step 3: Functional Testing
• Stability Test: Apply a moderate force to confirm the handrail is securely anchored
• Continuity Check: Ensure handrail runs uninterrupted from first to last riser or ramp edge
• Height Measurement: Measure from walking surface to top of handrail (must be 28"–42")
• Grip Assessment: Confirm handrail shape allows firm grasp (round or oval preferred)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Compliant handrails must be between 34"–38" AFF
• Clearance: Minimum 1½" between wall and handrail
• Extensions: Handrails must extend 12" beyond the top and bottom of the ramp or stair run
• Surface: Must be smooth, continuous, and free of sharp edges
• Grip: Circular cross-section between 1¼"–2" diameter or equivalent

⚒️ Step 5: IRC Structural Requirements
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R311.7.8.1: Height must be 34"–38" above tread nosing
• IRC R311.7.8.3: Handrails must be continuous for the full length of the stair run
• IRC R301.5: Handrails must resist a 200 lb load applied in any direction.`
        },
        {
            id: 'railing_hand_2',
            name: 'Handrail is not functionally adequate. Or Handrail is not continuous for the full length of each flight of stairs. or Handrail is not between 28 inches and 42 inches in height.',
            detail: 'Handrail is not functionally adequate. Or Handrail is not continuous for the full length of each flight of stairs. or Handrail is not between 28 inches and 42 inches in height.',
            criteria: 'A handrail is deficient if it cant be reasonably grasped for support, isnt continuous along the full stair flight, or falls outside the required height range of 28 to 42 inches.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RAILING-HAND-02',
            codeReference: `🧭 Step 1: Identify Handrail Locations
Inspect all areas where handrails are required or installed.

🔍 Step 2: Visual Condition Assessment
Handrail missing where required, Handrail loose or unstable, Handrail not continuous

🧪 Step 3: Functional Testing
• Stability Test: Apply a moderate force to confirm the handrail is securely anchored
• Continuity Check: Ensure handrail runs uninterrupted from first to last riser or ramp edge
• Height Measurement: Measure from walking surface to top of handrail (must be 28"–42")
• Grip Assessment: Confirm handrail shape allows firm grasp (round or oval preferred)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Compliant handrails must be between 34"–38" AFF
• Clearance: Minimum 1½" between wall and handrail
• Extensions: Handrails must extend 12" beyond the top and bottom of the ramp or stair run
• Surface: Must be smooth, continuous, and free of sharp edges
• Grip: Circular cross-section between 1¼"–2" diameter or equivalent

⚒️ Step 5: IRC Structural Requirements
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R311.7.8.1: Height must be 34"–38" above tread nosing
• IRC R311.7.8.3: Handrails must be continuous for the full length of the stair run
• IRC R301.5: Handrails must resist a 200 lb load applied in any direction.`
        },
        {
            id: 'railing_hand_3',
            name: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            detail: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'RAILING-HAND-03',
            codeReference: `🧭 Step 1: Identify Handrail Locations
Inspect all areas where handrails are required or installed.

🔍 Step 2: Visual Condition Assessment
Handrail missing where required, Handrail loose or unstable, Handrail not continuous

🧪 Step 3: Functional Testing
• Stability Test: Apply a moderate force to confirm the handrail is securely anchored
• Continuity Check: Ensure handrail runs uninterrupted from first to last riser or ramp edge
• Height Measurement: Measure from walking surface to top of handrail (must be 28"–42")
• Grip Assessment: Confirm handrail shape allows firm grasp (round or oval preferred)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Compliant handrails must be between 34"–38" AFF
• Clearance: Minimum 1½" between wall and handrail
• Extensions: Handrails must extend 12" beyond the top and bottom of the ramp or stair run
• Surface: Must be smooth, continuous, and free of sharp edges
• Grip: Circular cross-section between 1¼"–2" diameter or equivalent

⚒️ Step 5: IRC Structural Requirements
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R311.7.8.1: Height must be 34"–38" above tread nosing
• IRC R311.7.8.3: Handrails must be continuous for the full length of the stair run
• IRC R301.5: Handrails must resist a 200 lb load applied in any direction.`
        },
        {
            id: 'railing_hand_4',
            name: 'Handrail is not secured.',
            detail: 'Handrail is not secured. There is movement in the anchors of the handrail.',
            criteria: 'There is movement in the anchors of the handrail.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RAILING-HAND-04',
            codeReference: `🧭 Step 1: Identify Handrail Locations
Inspect all areas where handrails are required or installed.

🔍 Step 2: Visual Condition Assessment
Handrail missing where required, Handrail loose or unstable, Handrail not continuous

🧪 Step 3: Functional Testing
• Stability Test: Apply a moderate force to confirm the handrail is securely anchored
• Continuity Check: Ensure handrail runs uninterrupted from first to last riser or ramp edge
• Height Measurement: Measure from walking surface to top of handrail (must be 28"–42")
• Grip Assessment: Confirm handrail shape allows firm grasp (round or oval preferred)

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Compliant handrails must be between 34"–38" AFF
• Clearance: Minimum 1½" between wall and handrail
• Extensions: Handrails must extend 12" beyond the top and bottom of the ramp or stair run
• Surface: Must be smooth, continuous, and free of sharp edges
• Grip: Circular cross-section between 1¼"–2" diameter or equivalent

⚒️ Step 5: IRC Structural Requirements
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R311.7.8.1: Height must be 34"–38" above tread nosing
• IRC R311.7.8.3: Handrails must be continuous for the full length of the stair run
• IRC R301.5: Handrails must resist a 200 lb load applied in any direction.`
        }
    ]
};

export const RAILINGS_DEFICIENCIES = {
    category: '25. Railings',
    items: [RAILINGS_GUARDRAIL, RAILINGS_HANDRAIL]
};

// ==========================================
// 26. RESTROOM
// ==========================================

export const RESTROOM_BATHTUB_SHOWER: UnitItemDeficiencies = {
    itemName: 'Bathtub and Shower',
    deficiencies: [
        {
            id: 'restroom_bath_1',
            name: 'Common area bathtub or shower is present, and it is inoperable, or standing water is present such that water is unable to drain.',
            detail: 'Common area bathtub or shower is present, and it is inoperable (not meeting function or purpose, with or without visible damage), or standing water is present such that water is unable to drain.',
            criteria: 'Common area bathtub or shower is present, and it is inoperable, or standing water is present such that water is unable to drain.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'RESTROOM-BATH-01',
            codeReference: `🧭 Step 1: Identify Applicable Fixtures
Inspect all property-installed bathtubs and showers in shared-use areas.

🔍 Step 2: Visual Condition Assessment
Components damaged or missing

🧪 Step 3: Functional Testing
• Water Supply Test: Engage faucet or shower handle; confirm hot and cold water flow
• Drainage Test: Fill tub or shower pan partially; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check for water escaping from the fixture base or plumbing connections
• Privacy Review: Confirm presence of curtain, door, or enclosure

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Floor Space: Minimum 30"x48" in front of fixture
• Grab Bars: Required in accessible tubs/showers, mounted 33"–36" AFF
• Controls: Operable with one hand, no tight grasping or twisting
• Thresholds: Roll-in showers must have low or beveled thresholds
• Transfer Space: Required for transfer-type tubs

⚒️ Step 5: IRC Plumbing & Fixture Requirements
• IRC P2708.1–P2711.1: Shower and tub valves must be pressure-balanced or thermostatic
• IRC P2705.1: Fixtures must be securely mounted and properly connected to drainage
• IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• IRC R317.1: Moisture-prone areas must use decay-resistant materials.`
        },
        {
            id: 'restroom_bath_2',
            name: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident’s ability to maintain personal hygiene.',
            detail: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident’s ability to maintain personal hygiene.',
            criteria: 'Bathtub or shower component is missing or damaged.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'RESTROOM-BATH-02',
            codeReference: `🧭 Step 1: Identify Applicable Fixtures
Inspect all property-installed bathtubs and showers in shared-use areas.

🔍 Step 2: Visual Condition Assessment
Components damaged or missing

🧪 Step 3: Functional Testing
• Water Supply Test: Engage faucet or shower handle; confirm hot and cold water flow
• Drainage Test: Fill tub or shower pan partially; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check for water escaping from the fixture base or plumbing connections
• Privacy Review: Confirm presence of curtain, door, or enclosure

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Floor Space: Minimum 30"x48" in front of fixture
• Grab Bars: Required in accessible tubs/showers, mounted 33"–36" AFF
• Controls: Operable with one hand, no tight grasping or twisting
• Thresholds: Roll-in showers must have low or beveled thresholds
• Transfer Space: Required for transfer-type tubs

⚒️ Step 5: IRC Plumbing & Fixture Requirements
• IRC P2708.1–P2711.1: Shower and tub valves must be pressure-balanced or thermostatic
• IRC P2705.1: Fixtures must be securely mounted and properly connected to drainage
• IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• IRC R317.1: Moisture-prone areas must use decay-resistant materials.`
        },
        {
            id: 'restroom_bath_3',
            name: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident’s ability to maintain personal hygiene.',
            detail: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident’s ability to maintain personal hygiene.',
            criteria: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident’s ability to maintain personal hygiene.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'RESTROOM-BATH-03',
            codeReference: `🧭 Step 1: Identify Applicable Fixtures
Inspect all property-installed bathtubs and showers in shared-use areas.

🔍 Step 2: Visual Condition Assessment
Components damaged or missing

🧪 Step 3: Functional Testing
• Water Supply Test: Engage faucet or shower handle; confirm hot and cold water flow
• Drainage Test: Fill tub or shower pan partially; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check for water escaping from the fixture base or plumbing connections
• Privacy Review: Confirm presence of curtain, door, or enclosure

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Floor Space: Minimum 30"x48" in front of fixture
• Grab Bars: Required in accessible tubs/showers, mounted 33"–36" AFF
• Controls: Operable with one hand, no tight grasping or twisting
• Thresholds: Roll-in showers must have low or beveled thresholds
• Transfer Space: Required for transfer-type tubs

⚒️ Step 5: IRC Plumbing & Fixture Requirements
• IRC P2708.1–P2711.1: Shower and tub valves must be pressure-balanced or thermostatic
• IRC P2705.1: Fixtures must be securely mounted and properly connected to drainage
• IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• IRC R317.1: Moisture-prone areas must use decay-resistant materials.`
        },
        {
            id: 'restroom_bath_4',
            name: 'Bathtub or shower cannot be used in private (no privacy).',
            detail: 'Bathtub or shower cannot be used in private (no privacy).',
            criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-BATH-04',
            codeReference: `🧭 Step 1: Identify Applicable Fixtures
Inspect all property-installed bathtubs and showers in shared-use areas.

🔍 Step 2: Visual Condition Assessment
Components damaged or missing

🧪 Step 3: Functional Testing
• Water Supply Test: Engage faucet or shower handle; confirm hot and cold water flow
• Drainage Test: Fill tub or shower pan partially; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check for water escaping from the fixture base or plumbing connections
• Privacy Review: Confirm presence of curtain, door, or enclosure

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Floor Space: Minimum 30"x48" in front of fixture
• Grab Bars: Required in accessible tubs/showers, mounted 33"–36" AFF
• Controls: Operable with one hand, no tight grasping or twisting
• Thresholds: Roll-in showers must have low or beveled thresholds
• Transfer Space: Required for transfer-type tubs

⚒️ Step 5: IRC Plumbing & Fixture Requirements
• IRC P2708.1–P2711.1: Shower and tub valves must be pressure-balanced or thermostatic
• IRC P2705.1: Fixtures must be securely mounted and properly connected to drainage
• IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• IRC R317.1: Moisture-prone areas must use decay-resistant materials.`
        }
    ]
};

export const RESTROOM_CABINET: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'restroom_cab_1',
            name: 'Some of the restroom cabinet doors, drawers, or shelves are missing or incomplete.',
            detail: 'Some of the restroom cabinet doors, drawers, or shelves are missing or incomplete. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            criteria: 'Restroom cabinet doors, drawers, or shelves are missing or damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-CAB-01',
            codeReference: `🧭 Step 1: Identify Cabinet and Storage Locations
Inspect all built-in or property-installed cabinets and storage units in shared-use areas.

🔍 Step 2: Visual Condition Assessment
Cabinet inaccessible or inoperable
Cabinet missing entirely (with prior install evidence)

🧪 Step 3: Functional Testing
• Open/Close Test: Open every door and drawer fully to check for smooth operation
• Hardware Check: Confirm knobs, handles, hinges, and slides are secure and functional
• Interior Scan: Use a flashlight to inspect inside for water stains, mold-like substance, or loose shelving
• Structural Stability: Gently press on cabinet sides and shelves to confirm secure mounting

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Accessible cabinets should be within 15"–48" AFF
• Operability: Doors and drawers must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of accessible cabinets
• Safe Use: No sharp edges, splinters, or protruding hardware

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R307.1: Cabinets must be securely anchored and properly spaced
• IRC R702.3: Wall finishes must support mounted cabinetry
• IRC P2705.1: Cabinets under sinks must allow access to plumbing without obstruction
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        }
    ]
};

export const RESTROOM_GRAB_BAR: UnitItemDeficiencies = {
    itemName: 'Grab Bar',
    deficiencies: [
        {
            id: 'restroom_grab_1',
            name: 'Grab bar is not secure.',
            detail: 'Grab bar is not secure. Any movement whatever is detected in the grab bar.',
            criteria: 'Any movement detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-GRAB-01',
            codeReference: `🧭 Step 1: Identify Grab Bar Locations
Inspect all installed grab bars in shared-use hygiene areas.
NSPIRE defines grab bars as safety devices designed to be grasped to maintain balance or assist with movement, specifically in bathrooms.

🔍 Step 2: Visual Condition Assessment
Grab bar is loose or unstable or damaged, Grab bar missing where required, Grab bar obstructed or inaccessible

🧪 Step 3: Functional Testing
• Stability Test: Grasp the bar in the center and apply a moderate force back and forth.
• Any movement = deficiency
• Mounting Check: Confirm the grab bar is securely anchored to wall studs or blocking
• Surface Inspection: Look for rust, cracks, or sharp edges
• Accessibility Review: Ensure the grab bar is reachable and unobstructed.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
While NSPIRE does not enforce, IBU guidance is useful for best practice:
• Height: 33"–36" above finished floor
• Length: Minimum 42" for side wall, 36" for rear wall
• Clearance: At least 1½" between wall and bar
• Grip Surface: Smooth, non-slip, and continuous
• Location: Beside toilets, inside showers/tubs, and near transfer zones

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC R307.2: Shower walls must be finished with nonabsorbent material to ≥6 ft above floor
• IRC P2705.1: Fixtures must be installed to allow safe access and use
• IRC R317.1: Moisture-prone areas must use corrosion-resistant materials
• IRC R703.4: Proper flashing and sealing are required to prevent water intrusion behind grab bar mounts`
        }
    ]
};

export const RESTROOM_MOLD: UnitItemDeficiencies = {
    itemName: 'Mold-Like Substance',
    deficiencies: [
        {
            id: 'restroom_mold_1',
            name: 'Elevated moisture level.',
            detail: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Visual observation of mold-like substance or signs of elevated moisture levels.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-MOLD-01',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Mold-like substance must not impair air quality or mobility
• Clear Paths: Affected areas must not obstruct accessible routes
• Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'restroom_mold_2',
            name: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'RESTROOM-MOLD-02',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Mold-like substance must not impair air quality or mobility
• Clear Paths: Affected areas must not obstruct accessible routes
• Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'restroom_mold_3',
            name: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'RESTROOM-MOLD-03',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Mold-like substance must not impair air quality or mobility
• Clear Paths: Affected areas must not obstruct accessible routes
• Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        },
        {
            id: 'restroom_mold_4',
            name: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            detail: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-MOLD-04',
            codeReference: `🧭 Step 1: Identify High-Risk Locations
Inspect all shared-use areas where moisture may accumulate and mold-like substances may appear.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines mold-like substance as visible discoloration or growth that may appear fuzzy, cottony, or spotty in colors like green, black, brown, white, or gray.

🧪 Step 3: Inspection Technique
• Visual Scan: Look for discoloration, fuzzy patches, or water stains on walls, ceilings, floors, and fixtures
• Odor Check: Note musty or earthy smells, but only record if visual confirmation exists
• Moisture Source Review: Inspect for leaks, condensation, or poor ventilation near affected areas
• Surface Type Identification: Mold-like substance on drywall, wood, tile grout, or caulk is scored; ignore household items like clothing or food

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Mold-like substance must not impair air quality or mobility
• Clear Paths: Affected areas must not obstruct accessible routes
• Sensory Safety: Odors or allergens must not compromise the health for residents with sensitivities

⚒️ Step 5: IRC Moisture & Ventilation Requirements
• IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC R703.4: Flashing is required to prevent water intrusion at exterior openings
• IRC R408.3: Crawlspaces must be ventilated to prevent mold growth`
        }
    ]
};

export const RESTROOM_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'restroom_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Hot and cold water cannot be activated or deactivated.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-01',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'restroom_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate',
            detail: 'Sink component is damaged or missing, and the sink is not functionally adequate',
            criteria: 'Sink component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-02',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'restroom_sink_3',
            name: 'Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-03',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'restroom_sink_4',
            name: 'Sink is not draining.',
            detail: 'Sink is not draining.',
            criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-04',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'restroom_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            criteria: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-05',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'restroom_sink_6',
            name: 'Water is directed outside of the basin when in use.',
            detail: 'Water is directed outside of the basin when in use.',
            criteria: 'Water pressure, direction is not adequately functional.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'RESTROOM-SINK-06',
            codeReference: `🧭 Step 1: Identify Sink Components and Locations
Inspect all permanently installed sinks in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin with water using stopper; observe for proper drainage
• Stopper Functionality: Confirm stopper seals properly and releases water when activated
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        }
    ]
};

export const RESTROOM_TOILET: UnitItemDeficiencies = {
    itemName: 'Toilet',
    deficiencies: [
        {
            id: 'restroom_toilet_1',
            name: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
            detail: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
            criteria: 'A toilet is deficient if it\'s damaged or inoperable, as long as another operational toilet exists elsewhere in the building.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-01',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_2',
            name: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
            detail: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
            criteria: 'A toilet is missing and at least 1 toilet is installed elsewhere within the Unit that is operational.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-02',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_3',
            name: 'Only 1 toilet was installed, and it is damaged or inoperable.',
            detail: 'Only 1 toilet was installed, and it is damaged or inoperable.',
            criteria: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-03',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_4',
            name: 'Only 1 toilet was installed, and it is missing.',
            detail: 'Only 1 toilet was installed, and it is missing.',
            criteria: 'Only 1 toilet was installed, and it is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-04',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_5',
            name: 'Toilet can not be used in private. (no privacy)',
            detail: 'Toilet can not be used in private. (no privacy)',
            criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the toilet without being observed from an adjacent area or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-05',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_6',
            name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            criteria: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-06',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_7',
            name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            detail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            criteria: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-07',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        },
        {
            id: 'restroom_toilet_8',
            name: 'Toilet is not secured at the base.',
            detail: 'Toilet is not secured at the base.',
            criteria: 'Toilet is not secured at the base.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-08',
            codeReference: `🧭 Step 1: Identify Toilet Fixtures and Locations
Inspect all property-installed toilets in shared-use restrooms.

🔍 Step 2: Visual Condition Assessment
Toilet inoperable, Toilet components damaged but functional

🧪 Step 3: Functional Testing
• Flush Test: Flush the toilet and confirm: Water drains completely, Tank refills properly, No continuous running or leaks
• Stability Check: Apply gentle pressure to the bowl; it should not shift or rock
• Seat Inspection: Confirm seat is securely attached and free of cracks
• Privacy Review: Ensure stall or enclosure provides adequate privacy

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Toilet seat height must be 17"–19" AFF for accessible use
• Grab Bars: Required beside and behind the toilet, mounted 33"–36" AFF
• Clear Floor Space: Minimum 60" wide × 56" deep for wheelchair access
• Flush Controls: Must be operable with one hand, no tight grasping or twisting
• Privacy: Accessible stalls must have self-closing doors with proper clearance

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Toilets must be securely mounted and properly connected to water and waste systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone areas must use decay-resistant materials`
        }
    ]
};

export const RESTROOM_VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation',
    deficiencies: [
        {
            id: 'restroom_vent_1',
            name: 'The restroom does not have ventilation, not present and operable.',
            detail: 'The restroom does not have ventilation, not present and operable.',
            criteria: 'Exhaust fan system failure, missing components, or blocked airflow.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-01',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all ventilation systems in shared-use restrooms.
NSPIRE requires either a functioning exhaust fan or an operable window to provide ventilation.

🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window, Ventilation grille blocked or damaged, inoperable
NSPIRE considers the lack of ventilation a health and usability issue

🧪 Step 3: Functional Testing
- Fan Activation: Flip the switch and confirm the fan turns on. Listen for motor noise and feel for airflow.
- Window Check: Open the window from the inside. Confirm it opens fully and locks securely.
- Airflow Test: Use a tissue or paper test near the grille to detect suction or exhaust.
- Sensor Inquiry: If no switch is visible, ask POA if the fan is motion-activated or tied to the central system.
In high-rise buildings, central ventilation may require alternate airflow detection methods.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
- Switch Height: Must be within 15"–48" AFF for accessible use
- Clear Floor Space: Minimum 30"x48" in front of ventilation controls
- Safe Environment: No exposed wiring, sharp edges, or obstructed access
- Visual/Audible Feedback: Fan should provide a clear indication of operation,
ensuring ventilation systems are usable and safe for residents with mobility or sensory impairments

⚒️ Step 5: IRC Ventilation Requirements
- IRC R303.3: Bathrooms must have mechanical ventilation or an operable window
- IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
- IRC M1506.2: Air intake openings must be protected and unobstructed
- IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'restroom_vent_2',
            name: 'The exhaust system component is missing or damaged, affecting the function adequately.',
            detail: 'The exhaust system component is missing or damaged, affecting the function adequately.',
            criteria: 'Exhaust system component is damaged or missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-02',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all ventilation systems in shared-use restrooms.
NSPIRE requires either a functioning exhaust fan or an operable window to provide ventilation.

🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window, Ventilation grille blocked or damaged, inoperable
NSPIRE considers the lack of ventilation a health and usability issue

🧪 Step 3: Functional Testing
- Fan Activation: Flip the switch and confirm the fan turns on. Listen for motor noise and feel for airflow.
- Window Check: Open the window from the inside. Confirm it opens fully and locks securely.
- Airflow Test: Use a tissue or paper test near the grille to detect suction or exhaust.
- Sensor Inquiry: If no switch is visible, ask POA if the fan is motion-activated or tied to the central system.
In high-rise buildings, central ventilation may require alternate airflow detection methods.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
- Switch Height: Must be within 15"–48" AFF for accessible use
- Clear Floor Space: Minimum 30"x48" in front of ventilation controls
- Safe Environment: No exposed wiring, sharp edges, or obstructed access
- Visual/Audible Feedback: Fan should provide a clear indication of operation,
ensuring ventilation systems are usable and safe for residents with mobility or sensory impairments

⚒️ Step 5: IRC Ventilation Requirements
- IRC R303.3: Bathrooms must have mechanical ventilation or an operable window
- IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
- IRC M1506.2: Air intake openings must be protected and unobstructed
- IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'restroom_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-03',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all ventilation systems in shared-use restrooms.
NSPIRE requires either a functioning exhaust fan or an operable window to provide ventilation.

🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window, Ventilation grille blocked or damaged, inoperable
NSPIRE considers the lack of ventilation a health and usability issue

🧪 Step 3: Functional Testing
- Fan Activation: Flip the switch and confirm the fan turns on. Listen for motor noise and feel for airflow.
- Window Check: Open the window from the inside. Confirm it opens fully and locks securely.
- Airflow Test: Use a tissue or paper test near the grille to detect suction or exhaust.
- Sensor Inquiry: If no switch is visible, ask POA if the fan is motion-activated or tied to the central system.
In high-rise buildings, central ventilation may require alternate airflow detection methods.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
- Switch Height: Must be within 15"–48" AFF for accessible use
- Clear Floor Space: Minimum 30"x48" in front of ventilation controls
- Safe Environment: No exposed wiring, sharp edges, or obstructed access
- Visual/Audible Feedback: Fan should provide a clear indication of operation,
ensuring ventilation systems are usable and safe for residents with mobility or sensory impairments

⚒️ Step 5: IRC Ventilation Requirements
- IRC R303.3: Bathrooms must have mechanical ventilation or an operable window
- IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
- IRC M1506.2: Air intake openings must be protected and unobstructed
- IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'restroom_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-04',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all ventilation systems in shared-use restrooms.
NSPIRE requires either a functioning exhaust fan or an operable window to provide ventilation.

🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window, Ventilation grille blocked or damaged, inoperable
NSPIRE considers the lack of ventilation a health and usability issue

🧪 Step 3: Functional Testing
- Fan Activation: Flip the switch and confirm the fan turns on. Listen for motor noise and feel for airflow.
- Window Check: Open the window from the inside. Confirm it opens fully and locks securely.
- Airflow Test: Use a tissue or paper test near the grille to detect suction or exhaust.
- Sensor Inquiry: If no switch is visible, ask POA if the fan is motion-activated or tied to the central system.
In high-rise buildings, central ventilation may require alternate airflow detection methods.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
- Switch Height: Must be within 15"–48" AFF for accessible use
- Clear Floor Space: Minimum 30"x48" in front of ventilation controls
- Safe Environment: No exposed wiring, sharp edges, or obstructed access
- Visual/Audible Feedback: Fan should provide a clear indication of operation,
ensuring ventilation systems are usable and safe for residents with mobility or sensory impairments

⚒️ Step 5: IRC Ventilation Requirements
- IRC R303.3: Bathrooms must have mechanical ventilation or an operable window
- IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
- IRC M1506.2: Air intake openings must be protected and unobstructed
- IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        }
    ]
};

export const RESTROOM_DEFICIENCIES = {
    category: '26. Restroom',
    items: [RESTROOM_BATHTUB_SHOWER, RESTROOM_CABINET, RESTROOM_GRAB_BAR, RESTROOM_MOLD, RESTROOM_SINK, RESTROOM_TOILET, RESTROOM_VENTILATION]
};

// ==========================================
// 27. SINK (LAUNDRY, GARAGE, OR PATIO)
// ==========================================

export const SINK_LAUNDRY: UnitItemDeficiencies = {
    itemName: 'Sink (Laundry, Garage, or patio)',
    deficiencies: [
        {
            id: 'sink_laundry_1',
            name: 'Control knobs do not activate or deactivate hot and cold water.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-01',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'sink_laundry_2',
            name: 'Sink component is missing.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-02',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'sink_laundry_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-03',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'sink_laundry_4',
            name: 'Sink is missing.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            criteria: 'not present or incomplete.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-04',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'sink_laundry_5',
            name: 'Sink not draining',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-05',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        },
        {
            id: 'sink_laundry_6',
            name: 'Sink component is damaged.',
            detail: 'The sink component is missing, damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is damaged.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'SINK-LAUNDRY-06',
            codeReference: `🧭 Step 1: Identify Sink Type and Location
Inspect all property-installed utility sinks in shared-use laundry rooms, garages, or maintenance areas.

🔍 Step 2: Visual Condition Assessment
NSPIRE defines a sink as functionally adequate only if it can dispense and hold clean water and discharge wastewater properly.

🧪 Step 3: Functional Testing
• Faucet Test: Turn on hot and cold water; confirm flow and temperature
• Drainage Test: Fill basin partially using stopper; observe for proper drainage
• Stopper Check: Engage and release the stopper to verify water retention and release
• Leak Inspection: Check under the sink for moisture, stains, or active drips
• Mounting Check: Gently press sink edges to confirm secure installation.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Height: Sink rim should be ≤34" AFF for accessible use
• Knee Clearance: Minimum 27" high × 30" wide × 11" deep under sink
• Reach Range: Faucet controls must be within 15"–48" AFF
• Operability: Controls must be usable with one hand, no tight grasping or twisting
• Clear Floor Space: Minimum 30"x48" in front of sink

⚒️ Step 5: IRC Plumbing & Installation Requirements
• IRC P2705.1: Sinks must be securely mounted and properly connected to water and drain systems
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition
• IRC P2706.1: Drainage must prevent backflow and siphoning
• IRC R317.1: Moisture-prone cabinetry must use decay-resistant materials`
        }
    ]
};

export const SINK_LAUNDRY_DEFICIENCIES = {
    category: '27. Sink (Laundry, Garage, or patio)',
    items: [SINK_LAUNDRY]
};

// ==========================================
// 28. STEPS AND STAIRS
// ==========================================

export const STEPS_STAIRS: UnitItemDeficiencies = {
    itemName: 'Steps and Stairs',
    deficiencies: [
        {
            id: 'steps_1',
            name: 'Stringer is damaged',
            detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality). Instability is detected while walking on the stair.',
            criteria: 'Instability is detected while walking on the stair.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'STEPS-01',
            codeReference: `🧭 Step 1: Identify Stair Components and Locations
Inspect all permanently installed steps and stairways used for vertical circulation in shared-use areas.
NSPIRE defines stairs as a single step, a series of steps, or flights of steps that connect two levels

🔍 Step 2: Visual Condition Assessment
Loose or unstable stair components, Step or stair not functionally adequate

🧪 Step 3: Functional Testing
• Walk Test: Walk the full length of the stairway, applying pressure to each tread to check for movement or instability
• Tread & Nosing Check: Inspect each tread for cracks, missing sections, or uneven surfaces
• Stringer Review: Examine side supports for damage, separation, or rot
• Alignment & Level: Confirm steps are evenly spaced and level
• Obstruction Scan: Ensure the stairway is free of clutter, debris, or tripping hazards.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Riser Height: Uniform risers between 4"–7"
• Tread Depth: Minimum 11" for accessible stairs
• Handrails: Required on stairs with ≥4 risers; mounted 34"–38" AFF
• Edge Visibility: Contrasting nosing or markings for low-vision users
• Clear Width: Minimum 36" between handrails

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R311.7.5: Maximum riser height = 7¾"; minimum tread depth = 10"
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R301.5: Stair components must resist a 200 lb load applied in any direction
• IRC R312.1: Guardrails required on open-sided stairs ≥30" above grade`
        },
        {
            id: 'steps_2',
            name: 'Tread on a set of stairs damaged',
            detail: 'Tread on a set of stairs is missing i.e., a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide, is damaged or broken.',
            criteria: 'Secure accessory treads are not present.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'STEPS-02',
            codeReference: `🧭 Step 1: Identify Stair Components and Locations
Inspect all permanently installed steps and stairways used for vertical circulation in shared-use areas.
NSPIRE defines stairs as a single step, a series of steps, or flights of steps that connect two levels

🔍 Step 2: Visual Condition Assessment
Loose or unstable stair components, Step or stair not functionally adequate

🧪 Step 3: Functional Testing
• Walk Test: Walk the full length of the stairway, applying pressure to each tread to check for movement or instability
• Tread & Nosing Check: Inspect each tread for cracks, missing sections, or uneven surfaces
• Stringer Review: Examine side supports for damage, separation, or rot
• Alignment & Level: Confirm steps are evenly spaced and level
• Obstruction Scan: Ensure the stairway is free of clutter, debris, or tripping hazards.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Riser Height: Uniform risers between 4"–7"
• Tread Depth: Minimum 11" for accessible stairs
• Handrails: Required on stairs with ≥4 risers; mounted 34"–38" AFF
• Edge Visibility: Contrasting nosing or markings for low-vision users
• Clear Width: Minimum 36" between handrails

⚒️ Step 5: IRC Structural & Safety Requirements
• IRC R311.7.5: Maximum riser height = 7¾"; minimum tread depth = 10"
• IRC R311.7.8: Handrails required on at least one side of stairs with ≥4 risers
• IRC R301.5: Stair components must resist a 200 lb load applied in any direction
• IRC R312.1: Guardrails required on open-sided stairs ≥30" above grade`
        }
    ]
};

export const STEPS_STAIRS_DEFICIENCIES = {
    category: '28. Steps and Stairs',
    items: [STEPS_STAIRS]
};

// ==========================================
// 29. STRUCTURAL SYSTEM
// ==========================================

export const STRUCTURAL_SYSTEM: UnitItemDeficiencies = {
    itemName: 'Structural System',
    deficiencies: [
        {
            id: 'structural_1',
            name: 'Structural system exhibits signs of serious failure',
            detail: 'Structural system exhibits signs of serious failure and may threaten the residents\' safety.',
            criteria: 'Significant structural damage that affects occupants\' safety.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'STRUCTURAL-01',
            codeReference: `🧭 Step 1: Identify Structural Elements to Inspect
Focus on load-bearing and foundational components within shared-use interior spaces.

🔍 Step 2: Visual Condition Assessment
Structural component visibly damaged, Structural component not functionally adequate

🧪 Step 3: Inspection Technique
• Wall & Ceiling Scan: Look for cracks >⅛", bulging, or separation at joints
• Floor Deflection Check: Walk across floors to detect soft spots, sagging, or bounce
• Beam & Column Review: Inspect for corrosion, rot, or impact damage
• Foundation Wall Inspection: Check for horizontal cracks, water intrusion, or efflorescence
• Moisture Detection: Use flashlight to spot discoloration, mold-like substance, or dampness

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Safe Environment: Structural damage must not obstruct accessible routes
• Clear Paths: No collapsed or unstable surfaces in circulation zones
• Visual Safety: No protrusions, falling hazards, or uneven transitions
• Emergency Egress: Structural integrity must support safe evacuation

⚒️ Step 5: IRC Structural Requirements
• IRC R301.1–R301.5: Buildings must support all imposed loads safely (dead, live, wind, seismic)
• IRC R602.1–R602.10: Wall framing must be properly sized, spaced, and braced
• IRC R404.1: Foundation walls must be reinforced and protected from moisture
• IRC R502.3–R502.6: Floor joists and beams must meet span and load requirements
• IRC R317.1: Structural components in moisture-prone areas must be decay-resistant`
        }
    ]
};

export const STRUCTURAL_DEFICIENCIES = {
    category: '29. Structural System',
    items: [STRUCTURAL_SYSTEM]
};

// ==========================================
// 30. TRASH CHUTE
// ==========================================

export const TRASH_CHUTE: UnitItemDeficiencies = {
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
            code: 'TRASH-01',
            codeReference: `🧭 Step 1: Identify Trash Chute Components and Locations
NSPIRE applies only to active trash chutes used for waste disposal. Inactive or sealed chutes are excluded.

🔍 Step 2: Visual Condition Assessment
The chute door does not open. not self-close and latch

🧪 Step 3: Functional Testing
• Door Operation Test: Turn the knob or handle to open the chute door fully. Confirm it opens smoothly and closes automatically.
• Latch Check: After closing, verify that the door latches securely without manual force.
• Obstruction Scan: Look inside the chute opening for visible trash buildup or blockage.
• Overflow Inspection: Check the surrounding area for trash spilling out or preventing door closure.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Chute door handle must be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of chute door
• Operability: Handle must be usable with one hand, no tight grasping or twisting
• Safe Use: No sharp edges, pinch points, or protrusions

⚒️ Step 5: IRC Fire & Safety Requirements
• IRC R302.5.2: Trash chute discharge doors must be fire-rated and self-closing
• IRC R302.11: Chute enclosures must be constructed with fire-resistant materials
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC M1601.4.1: Duct-like systems (including chutes) must be sealed and supported`
        },
        {
            id: 'trash_2',
            name: 'Chute is clogged',
            detail: 'Trash is overflowing or backed up inside chute.',
            criteria: 'The garbage is backing up into the chute.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'TRASH-02',
            codeReference: `🧭 Step 1: Identify Trash Chute Components and Locations
NSPIRE applies only to active trash chutes used for waste disposal. Inactive or sealed chutes are excluded.

🔍 Step 2: Visual Condition Assessment
The chute door does not open. not self-close and latch

🧪 Step 3: Functional Testing
• Door Operation Test: Turn the knob or handle to open the chute door fully. Confirm it opens smoothly and closes automatically.
• Latch Check: After closing, verify that the door latches securely without manual force.
• Obstruction Scan: Look inside the chute opening for visible trash buildup or blockage.
• Overflow Inspection: Check the surrounding area for trash spilling out or preventing door closure.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Chute door handle must be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of chute door
• Operability: Handle must be usable with one hand, no tight grasping or twisting
• Safe Use: No sharp edges, pinch points, or protrusions

⚒️ Step 5: IRC Fire & Safety Requirements
• IRC R302.5.2: Trash chute discharge doors must be fire-rated and self-closing
• IRC R302.11: Chute enclosures must be constructed with fire-resistant materials
• IRC R317.1: Moisture-prone areas must use decay-resistant materials
• IRC M1601.4.1: Duct-like systems (including chutes) must be sealed and supported`
        }
    ]
};

export const TRASH_CHUTE_DEFICIENCIES = {
    category: '30. Trash Chute',
    items: [TRASH_CHUTE]
};

// ==========================================
// 31. VENTILATION
// ==========================================

export const VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation (with or without a fan)',
    deficiencies: [
        {
            id: 'vent_1',
            name: 'It is not functioning adequately.',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-01',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all mechanical and passive ventilation systems in shared-use interior spaces.
NSPIRE requires that ventilation systems be functionally adequate, meaning they must provide airflow and remove moisture or odors effectively
🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window. Exhaust fan present but inoperable
🧪 Step 3: Functional Testing
• 	Fan Activation: Flip the switch or trigger the motion sensor; confirm the fan turns on and exhausts air
• 	Airflow Check: Use a tissue or hand test near supply/return vents to detect airflow
• 	Window Operation: Open and close operable windows to confirm usability
• 	Moisture Scan: Inspect surrounding surfaces for condensation, staining, or mold-like substance
📏 Step 4: Accessibility & Disability Considerations. "IBU"
• 	Switch Height: Controls must be within 15"–48" AFF
• 	Clear Floor Space: Minimum 30"x48" in front of ventilation controls
• 	Safe Environment: No exposed wiring, sharp edges, or obstructed access
• 	Visual/Audible Feedback: Fan should provide a clear indication of operation
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• 	IRC M1506.2: Air intake openings must be protected and unobstructed
• 	IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'vent_2',
            name: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). Or an exhaust system component is missing.',
            detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). Or an exhaust system component is missing.',
            criteria: 'Exhaust system component is damaged. OR Exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-02',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all mechanical and passive ventilation systems in shared-use interior spaces.
NSPIRE requires that ventilation systems be functionally adequate, meaning they must provide airflow and remove moisture or odors effectively
🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window. Exhaust fan present but inoperable
🧪 Step 3: Functional Testing
• 	Fan Activation: Flip the switch or trigger the motion sensor; confirm the fan turns on and exhausts air
• 	Airflow Check: Use a tissue or hand test near supply/return vents to detect airflow
• 	Window Operation: Open and close operable windows to confirm usability
• 	Moisture Scan: Inspect surrounding surfaces for condensation, staining, or mold-like substance
📏 Step 4: Accessibility & Disability Considerations. "IBU"
• 	Switch Height: Controls must be within 15"–48" AFF
• 	Clear Floor Space: Minimum 30"x48" in front of ventilation controls
• 	Safe Environment: No exposed wiring, sharp edges, or obstructed access
• 	Visual/Audible Feedback: Fan should provide a clear indication of operation
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• 	IRC M1506.2: Air intake openings must be protected and unobstructed
• 	IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-03',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all mechanical and passive ventilation systems in shared-use interior spaces.
NSPIRE requires that ventilation systems be functionally adequate, meaning they must provide airflow and remove moisture or odors effectively
🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window. Exhaust fan present but inoperable
🧪 Step 3: Functional Testing
• 	Fan Activation: Flip the switch or trigger the motion sensor; confirm the fan turns on and exhausts air
• 	Airflow Check: Use a tissue or hand test near supply/return vents to detect airflow
• 	Window Operation: Open and close operable windows to confirm usability
• 	Moisture Scan: Inspect surrounding surfaces for condensation, staining, or mold-like substance
📏 Step 4: Accessibility & Disability Considerations. "IBU"
• 	Switch Height: Controls must be within 15"–48" AFF
• 	Clear Floor Space: Minimum 30"x48" in front of ventilation controls
• 	Safe Environment: No exposed wiring, sharp edges, or obstructed access
• 	Visual/Audible Feedback: Fan should provide a clear indication of operation
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• 	IRC M1506.2: Air intake openings must be protected and unobstructed
• 	IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        },
        {
            id: 'vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-04',
            codeReference: `🧭 Step 1: Identify Ventilation Components and Locations
Inspect all mechanical and passive ventilation systems in shared-use interior spaces.
NSPIRE requires that ventilation systems be functionally adequate, meaning they must provide airflow and remove moisture or odors effectively
🔍 Step 2: Visual Condition Assessment
No exhaust fan and no operable window. Exhaust fan present but inoperable
🧪 Step 3: Functional Testing
• 	Fan Activation: Flip the switch or trigger the motion sensor; confirm the fan turns on and exhausts air
• 	Airflow Check: Use a tissue or hand test near supply/return vents to detect airflow
• 	Window Operation: Open and close operable windows to confirm usability
• 	Moisture Scan: Inspect surrounding surfaces for condensation, staining, or mold-like substance
📏 Step 4: Accessibility & Disability Considerations. "IBU"
• 	Switch Height: Controls must be within 15"–48" AFF
• 	Clear Floor Space: Minimum 30"x48" in front of ventilation controls
• 	Safe Environment: No exposed wiring, sharp edges, or obstructed access
• 	Visual/Audible Feedback: Fan should provide a clear indication of operation
⚒️ Step 5: IRC Ventilation Requirements
• 	IRC R303.3: Bathrooms must have mechanical ventilation or operable windows
• 	IRC M1507.2: Exhaust systems must vent to the outdoors and be sealed
• 	IRC M1506.2: Air intake openings must be protected and unobstructed
• 	IRC R317.1: Moisture-prone areas must use corrosion-resistant materials`
        }
    ]
};

export const VENTILATION_DEFICIENCIES = {
    category: '31. Ventilation',
    items: [VENTILATION]
};

// ==========================================
// 32. WALL
// ==========================================

export const WALL: UnitItemDeficiencies = {
    itemName: 'Wall-Interior',
    deficiencies: [
        {
            id: 'wall_1',
            name: 'Interior wall component(s), severe cracks, not functionally adequate.',
            detail: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
            criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-01',
            codeReference: `🧭 Step 1: Identify Wall Types and Locations
Inspect all permanently constructed walls and wall components in shared-use interior spaces.

🔍 Step 2: Visual Condition Assessment
Cosmetic wear (minor scuffs, faded paint) is not scored

🧪 Step 3: Inspection Technique
• Visual Scan: Walk the perimeter of the space and inspect wall surfaces from floor to ceiling
• Touch Test: Gently press suspect areas for softness, instability, or moisture
• Crack Measurement: Use a ruler or visual estimate to identify cracks >⅛" wide
• Moisture Detection: Look for bubbling paint, mold-like substance, or musty odors
• Accessibility Review: Confirm no protrusions or sharp edges in accessible routes

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Width: Minimum 36" in corridors and pathways
• Surface Safety: No sharp edges, protrusions >4" from wall
• Visual Contrast: Walls should support wayfinding for low-vision users
• Reach Hazards: Damaged surfaces must not be within reach zones (15"–48" AFF)

⚒️ Step 5: IRC Wall Construction & Safety Requirements
• IRC R702.3: Interior wall finishes must be securely attached and fire-rated where required
• IRC R317.1: Walls in moisture-prone areas must use decay-resistant materials
• IRC R302.6: Fire separation walls must be continuous and sealed
• IRC R703.4: Flashing and sealing required to prevent water intrusion at wall penetrations`
        },
        {
            id: 'wall_2',
            name: 'Hole greater than 2 inches in diameter, or accumulation of holes greater than 6" x 6".',
            detail: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-02',
            codeReference: `🧭 Step 1: Identify Wall Types and Locations
Inspect all permanently constructed walls and wall components in shared-use interior spaces.

🔍 Step 2: Visual Condition Assessment
Cosmetic wear (minor scuffs, faded paint) is not scored

🧪 Step 3: Inspection Technique
• Visual Scan: Walk the perimeter of the space and inspect wall surfaces from floor to ceiling
• Touch Test: Gently press suspect areas for softness, instability, or moisture
• Crack Measurement: Use a ruler or visual estimate to identify cracks >⅛" wide
• Moisture Detection: Look for bubbling paint, mold-like substance, or musty odors
• Accessibility Review: Confirm no protrusions or sharp edges in accessible routes

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Width: Minimum 36" in corridors and pathways
• Surface Safety: No sharp edges, protrusions >4" from wall
• Visual Contrast: Walls should support wayfinding for low-vision users
• Reach Hazards: Damaged surfaces must not be within reach zones (15"–48" AFF)

⚒️ Step 5: IRC Wall Construction & Safety Requirements
• IRC R702.3: Interior wall finishes must be securely attached and fire-rated where required
• IRC R317.1: Walls in moisture-prone areas must use decay-resistant materials
• IRC R302.6: Fire separation walls must be continuous and sealed
• IRC R703.4: Flashing and sealing required to prevent water intrusion at wall penetrations`
        },
        {
            id: 'wall_3',
            name: 'Interior wall has a loose or detached surface covering.',
            detail: 'Interior wall has a loose or detached surface covering.',
            criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-03',
            codeReference: `🧭 Step 1: Identify Wall Types and Locations
Inspect all permanently constructed walls and wall components in shared-use interior spaces.

🔍 Step 2: Visual Condition Assessment
Cosmetic wear (minor scuffs, faded paint) is not scored

🧪 Step 3: Inspection Technique
• Visual Scan: Walk the perimeter of the space and inspect wall surfaces from floor to ceiling
• Touch Test: Gently press suspect areas for softness, instability, or moisture
• Crack Measurement: Use a ruler or visual estimate to identify cracks >⅛" wide
• Moisture Detection: Look for bubbling paint, mold-like substance, or musty odors
• Accessibility Review: Confirm no protrusions or sharp edges in accessible routes

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clear Width: Minimum 36" in corridors and pathways
• Surface Safety: No sharp edges, protrusions >4" from wall
• Visual Contrast: Walls should support wayfinding for low-vision users
• Reach Hazards: Damaged surfaces must not be within reach zones (15"–48" AFF)

⚒️ Step 5: IRC Wall Construction & Safety Requirements
• IRC R702.3: Interior wall finishes must be securely attached and fire-rated where required
• IRC R317.1: Walls in moisture-prone areas must use decay-resistant materials
• IRC R302.6: Fire separation walls must be continuous and sealed
• IRC R703.4: Flashing and sealing required to prevent water intrusion at wall penetrations`
        }
    ]
};

export const WALL_DEFICIENCIES = {
    category: '32. Wall',
    items: [WALL]
};

// ==========================================
// 33. WATER HEATER
// ==========================================

export const WATER_HEATER: UnitItemDeficiencies = {
    itemName: 'Water Heater',
    deficiencies: [
        {
            id: 'water_heater_1',
            name: 'Chimney or flue piping is blocked, misaligned, or missing',
            detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Chimney or flue piping is blocked, misaligned, or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'WATER-HEATER-01',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
NSPIRE applies to devices that generate and store hot water for domestic use, including tankless and boiler-integrated systems.

🔍 Step 2: Visual Condition Assessment
Pressure relief valve or discharge pipe obstructed, damaged, Chimney or flue blocked, misaligned, or missing

🧪 Step 3: Functional Testing
• Hot Water Verification: Run hot water from a nearby common-area fixture for 30–60 seconds
• TPR Valve Inspection: Confirm valve is unobstructed and discharge pipe terminates 2–6 inches from floor
• Exhaust Review: Check flue pipe for continuous upward slope and sealed joints
• Gas Valve Check: Confirm presence of manual shutoff valve near heater (if gas-powered)
• Leak Scan: Look for moisture, corrosion, or staining around base and plumbing connections

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clearance: Maintain a minimum 30"x48" clear floor space in front of the heater
• Safe Access: No sharp edges, exposed wiring, or obstructed controls
• Reach Range: Controls and shutoff valves should be within 15"–48" AFF
• Visual Indicators: Labels and warning signs must be visible and legible

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC P2801.1–P2803.6: Water heaters must be listed, properly vented, and installed per manufacturer specs
• IRC G2420.5: Gas shutoff valves must be accessible and operable
• IRC M1801.1: Flue gas vents must be sealed and slope upward
• IRC P2804.6.1: TPR valve discharge pipe must terminate 2–6 inches above the floor and be made of approved material
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition`
        },
        {
            id: 'water_heater_2',
            name: 'Gas shutoff valve is damaged, missing or not installed',
            detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR missing or is not installed or accessible',
            criteria: 'A gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'WATER-HEATER-02',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
NSPIRE applies to devices that generate and store hot water for domestic use, including tankless and boiler-integrated systems.

🔍 Step 2: Visual Condition Assessment
Pressure relief valve or discharge pipe obstructed, damaged, Chimney or flue blocked, misaligned, or missing

🧪 Step 3: Functional Testing
• Hot Water Verification: Run hot water from a nearby common-area fixture for 30–60 seconds
• TPR Valve Inspection: Confirm valve is unobstructed and discharge pipe terminates 2–6 inches from floor
• Exhaust Review: Check flue pipe for continuous upward slope and sealed joints
• Gas Valve Check: Confirm presence of manual shutoff valve near heater (if gas-powered)
• Leak Scan: Look for moisture, corrosion, or staining around base and plumbing connections

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clearance: Maintain a minimum 30"x48" clear floor space in front of the heater
• Safe Access: No sharp edges, exposed wiring, or obstructed controls
• Reach Range: Controls and shutoff valves should be within 15"–48" AFF
• Visual Indicators: Labels and warning signs must be visible and legible

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC P2801.1–P2803.6: Water heaters must be listed, properly vented, and installed per manufacturer specs
• IRC G2420.5: Gas shutoff valves must be accessible and operable
• IRC M1801.1: Flue gas vents must be sealed and slope upward
• IRC P2804.6.1: TPR valve discharge pipe must terminate 2–6 inches above the floor and be made of approved material
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition`
        },
        {
            id: 'water_heater_3',
            name: 'No hot water',
            detail: 'Hot water does not dispense after handle is engaged.',
            criteria: 'Hot water does not dispense after handle is engaged.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WATER-HEATER-03',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
NSPIRE applies to devices that generate and store hot water for domestic use, including tankless and boiler-integrated systems.

🔍 Step 2: Visual Condition Assessment
Pressure relief valve or discharge pipe obstructed, damaged, Chimney or flue blocked, misaligned, or missing

🧪 Step 3: Functional Testing
• Hot Water Verification: Run hot water from a nearby common-area fixture for 30–60 seconds
• TPR Valve Inspection: Confirm valve is unobstructed and discharge pipe terminates 2–6 inches from floor
• Exhaust Review: Check flue pipe for continuous upward slope and sealed joints
• Gas Valve Check: Confirm presence of manual shutoff valve near heater (if gas-powered)
• Leak Scan: Look for moisture, corrosion, or staining around base and plumbing connections

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clearance: Maintain a minimum 30"x48" clear floor space in front of the heater
• Safe Access: No sharp edges, exposed wiring, or obstructed controls
• Reach Range: Controls and shutoff valves should be within 15"–48" AFF
• Visual Indicators: Labels and warning signs must be visible and legible

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC P2801.1–P2803.6: Water heaters must be listed, properly vented, and installed per manufacturer specs
• IRC G2420.5: Gas shutoff valves must be accessible and operable
• IRC M1801.1: Flue gas vents must be sealed and slope upward
• IRC P2804.6.1: TPR valve discharge pipe must terminate 2–6 inches above the floor and be made of approved material
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition`
        },
        {
            id: 'water_heater_4',
            name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
            detail: 'TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged, capped, has an upward slope, or is constructed of unsuitable material.',
            criteria: 'The Tprv valve is not functioning adequately.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WATER-HEATER-04',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
NSPIRE applies to devices that generate and store hot water for domestic use, including tankless and boiler-integrated systems.

🔍 Step 2: Visual Condition Assessment
Pressure relief valve or discharge pipe obstructed, damaged, Chimney or flue blocked, misaligned, or missing

🧪 Step 3: Functional Testing
• Hot Water Verification: Run hot water from a nearby common-area fixture for 30–60 seconds
• TPR Valve Inspection: Confirm valve is unobstructed and discharge pipe terminates 2–6 inches from floor
• Exhaust Review: Check flue pipe for continuous upward slope and sealed joints
• Gas Valve Check: Confirm presence of manual shutoff valve near heater (if gas-powered)
• Leak Scan: Look for moisture, corrosion, or staining around base and plumbing connections

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clearance: Maintain a minimum 30"x48" clear floor space in front of the heater
• Safe Access: No sharp edges, exposed wiring, or obstructed controls
• Reach Range: Controls and shutoff valves should be within 15"–48" AFF
• Visual Indicators: Labels and warning signs must be visible and legible

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC P2801.1–P2803.6: Water heaters must be listed, properly vented, and installed per manufacturer specs
• IRC G2420.5: Gas shutoff valves must be accessible and operable
• IRC M1801.1: Flue gas vents must be sealed and slope upward
• IRC P2804.6.1: TPR valve discharge pipe must terminate 2–6 inches above the floor and be made of approved material
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition`
        },
        {
            id: 'water_heater_5',
            name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
            detail: 'The relief valve discharge piping is missing. Or the relief valve discharge piping terminates greater than 6 inches or less than 2 inches from the waste receptor\'s drain.',
            criteria: 'Not properly installed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WATER-HEATER-05',
            codeReference: `🧭 Step 1: Identify Water Heater Type and Location
NSPIRE applies to devices that generate and store hot water for domestic use, including tankless and boiler-integrated systems.

🔍 Step 2: Visual Condition Assessment
Pressure relief valve or discharge pipe obstructed, damaged, Chimney or flue blocked, misaligned, or missing

🧪 Step 3: Functional Testing
• Hot Water Verification: Run hot water from a nearby common-area fixture for 30–60 seconds
• TPR Valve Inspection: Confirm valve is unobstructed and discharge pipe terminates 2–6 inches from floor
• Exhaust Review: Check flue pipe for continuous upward slope and sealed joints
• Gas Valve Check: Confirm presence of manual shutoff valve near heater (if gas-powered)
• Leak Scan: Look for moisture, corrosion, or staining around base and plumbing connections

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Clearance: Maintain a minimum 30"x48" clear floor space in front of the heater
• Safe Access: No sharp edges, exposed wiring, or obstructed controls
• Reach Range: Controls and shutoff valves should be within 15"–48" AFF
• Visual Indicators: Labels and warning signs must be visible and legible

⚒️ Step 5: IRC Installation & Safety Requirements
• IRC P2801.1–P2803.6: Water heaters must be listed, properly vented, and installed per manufacturer specs
• IRC G2420.5: Gas shutoff valves must be accessible and operable
• IRC M1801.1: Flue gas vents must be sealed and slope upward
• IRC P2804.6.1: TPR valve discharge pipe must terminate 2–6 inches above the floor and be made of approved material
• IRC P2601.2: Plumbing systems must be maintained in sanitary condition`
        }
    ]
};

export const WATER_HEATER_DEFICIENCIES = {
    category: '33. Water Heater',
    items: [WATER_HEATER]
};

// ==========================================
// 34. WINDOW
// ==========================================

export const WINDOW: UnitItemDeficiencies = {
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
            code: 'WINDOW-01',
            codeReference: `🧭 Step 1: Identify Window Types and Locations
Inspect all permanently installed windows in shared-use interior spaces.
NSPIRE applies only to property-installed windows. Windows that are part of doors are inspected under door standards.

🔍 Step 2: Visual Condition Assessment
The window cannot be secured or locked. The window affects illumination or protection

🧪 Step 3: Functional Testing
• Open/Close Test: Unlock and open the window fully. Confirm it stays open without external support.
• Lock Test: Engage the built-in lock and confirm it latches securely.
• Seal & Weather Check: Inspect perimeter for gaps, torn seals, or drafts.
• Screen Inspection: Check for the presence and condition of the screen (if installed initially).
• Frame & Glass Review: Look for cracks, chips, or loose framing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Operable windows and locks should be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of accessible windows
• Operability: Must be usable with one hand, no tight grasping or twisting
• Safety Glazing: Required in hazardous locations (e.g., near floor, stairs)

⚒️ Step 5: IRC Window Requirements
• IRC R308.4: Safety glazing required in hazardous locations
• IRC R612.2–R612.5: Windows must meet performance standards for structural integrity, air infiltration, and water resistance
• IRC R310.2: Egress windows must meet minimum size and operability requirements (if applicable)
• IRC R703.4: Flashing is required around window openings to prevent water intrusion`
        },
        {
            id: 'window_2',
            name: 'Window component is damaged or missing, and the window is not functionally adequate',
            detail: 'The window component is missing (i.e., evidence of prior installation, but is now not present or is incomplete) or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater (i.e., can not protect from bugs, or debris).',
            criteria: 'Window is not functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WINDOW-02',
            codeReference: `🧭 Step 1: Identify Window Types and Locations
Inspect all permanently installed windows in shared-use interior spaces.
NSPIRE applies only to property-installed windows. Windows that are part of doors are inspected under door standards.

🔍 Step 2: Visual Condition Assessment
The window cannot be secured or locked. The window affects illumination or protection

🧪 Step 3: Functional Testing
• Open/Close Test: Unlock and open the window fully. Confirm it stays open without external support.
• Lock Test: Engage the built-in lock and confirm it latches securely.
• Seal & Weather Check: Inspect perimeter for gaps, torn seals, or drafts.
• Screen Inspection: Check for the presence and condition of the screen (if installed initially).
• Frame & Glass Review: Look for cracks, chips, or loose framing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Operable windows and locks should be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of accessible windows
• Operability: Must be usable with one hand, no tight grasping or twisting
• Safety Glazing: Required in hazardous locations (e.g., near floor, stairs)

⚒️ Step 5: IRC Window Requirements
• IRC R308.4: Safety glazing required in hazardous locations
• IRC R612.2–R612.5: Windows must meet performance standards for structural integrity, air infiltration, and water resistance
• IRC R310.2: Egress windows must meet minimum size and operability requirements (if applicable)
• IRC R703.4: Flashing is required around window openings to prevent water intrusion`
        },
        {
            id: 'window_3',
            name: 'Window will not close.',
            detail: 'The window does not close completely. OR At least one window lock is not present. OR The window can be opened once the lock is engaged.',
            criteria: 'Window lock does not keep the window closed.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WINDOW-03',
            codeReference: `🧭 Step 1: Identify Window Types and Locations
Inspect all permanently installed windows in shared-use interior spaces.
NSPIRE applies only to property-installed windows. Windows that are part of doors are inspected under door standards.

🔍 Step 2: Visual Condition Assessment
The window cannot be secured or locked. The window affects illumination or protection

🧪 Step 3: Functional Testing
• Open/Close Test: Unlock and open the window fully. Confirm it stays open without external support.
• Lock Test: Engage the built-in lock and confirm it latches securely.
• Seal & Weather Check: Inspect perimeter for gaps, torn seals, or drafts.
• Screen Inspection: Check for the presence and condition of the screen (if installed initially).
• Frame & Glass Review: Look for cracks, chips, or loose framing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Operable windows and locks should be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of accessible windows
• Operability: Must be usable with one hand, no tight grasping or twisting
• Safety Glazing: Required in hazardous locations (e.g., near floor, stairs)

⚒️ Step 5: IRC Window Requirements
• IRC R308.4: Safety glazing required in hazardous locations
• IRC R612.2–R612.5: Windows must meet performance standards for structural integrity, air infiltration, and water resistance
• IRC R310.2: Egress windows must meet minimum size and operability requirements (if applicable)
• IRC R703.4: Flashing is required around window openings to prevent water intrusion`
        },
        {
            id: 'window_4',
            name: 'Window will not open or stay open.',
            detail: 'Window will not open. Once opened, the window will not stay open without the use of a tool or item.',
            criteria: 'Will not stay open without the use of a tool or item.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WINDOW-04',
            codeReference: `🧭 Step 1: Identify Window Types and Locations
Inspect all permanently installed windows in shared-use interior spaces.
NSPIRE applies only to property-installed windows. Windows that are part of doors are inspected under door standards.

🔍 Step 2: Visual Condition Assessment
The window cannot be secured or locked. The window affects illumination or protection

🧪 Step 3: Functional Testing
• Open/Close Test: Unlock and open the window fully. Confirm it stays open without external support.
• Lock Test: Engage the built-in lock and confirm it latches securely.
• Seal & Weather Check: Inspect perimeter for gaps, torn seals, or drafts.
• Screen Inspection: Check for the presence and condition of the screen (if installed initially).
• Frame & Glass Review: Look for cracks, chips, or loose framing.

📏 Step 4: Accessibility & Disability Considerations. "IBU"
• Reach Range: Operable windows and locks should be within 15"–48" AFF
• Clear Floor Space: Minimum 30"x48" in front of accessible windows
• Operability: Must be usable with one hand, no tight grasping or twisting
• Safety Glazing: Required in hazardous locations (e.g., near floor, stairs)

⚒️ Step 5: IRC Window Requirements
• IRC R308.4: Safety glazing required in hazardous locations
• IRC R612.2–R612.5: Windows must meet performance standards for structural integrity, air infiltration, and water resistance
• IRC R310.2: Egress windows must meet minimum size and operability requirements (if applicable)
• IRC R703.4: Flashing is required around window openings to prevent water intrusion`
        }
    ]
};

export const WINDOW_DEFICIENCIES = {
    category: '34. Window',
    items: [WINDOW]
};

// ==========================================
// 35. GENERAL COMMENT
// ==========================================

export const GENERAL_COMMENT: UnitItemDeficiencies = {
    itemName: 'General comment',
    deficiencies: [
        {
            id: 'general_1',
            name: 'General comment',
            detail: 'General comment',
            criteria: 'General observation or note.',
            severity: 'Low',
            repairBy: 'N/A',
            points: '0',
            code: 'GENERAL-01'
        }
    ]
};

export const GENERAL_COMMENT_DEFICIENCIES = {
    category: '35. General comment: *',
    items: [GENERAL_COMMENT]
};

// ==========================================
// ALL UNIT CATEGORIES - 35 Total
// ==========================================

export const ALL_UNIT_CATEGORIES = [
    CABINET_STORAGE_DEFICIENCIES,           // 1
    CALL_FOR_AID_DEFICIENCIES,              // 2
    CARBON_MONOXIDE_DEFICIENCIES,           // 3
    CEILING_DEFICIENCIES,                   // 4
    CHIMNEY_DEFICIENCIES,                   // 5
    CLOTHES_DRYER_DEFICIENCIES,             // 6
    DOOR_DEFICIENCIES,                      // 7
    DRAINAGE_DEFICIENCIES,                  // 8
    EGRESS_DEFICIENCIES,                    // 9
    ELECTRICAL_DEFICIENCIES,                // 10
    ELEVATOR_DEFICIENCIES,                  // 11
    FIRE_SAFETY_DEFICIENCIES,               // 12
    FLOOR_DEFICIENCIES,                     // 13
    FOUNDATION_DEFICIENCIES,                // 14
    GRAB_BAR_DEFICIENCIES,                  // 15
    HAZARD_DEFICIENCIES,                    // 16
    HVAC_DEFICIENCIES,                      // 17
    KITCHEN_DEFICIENCIES,                   // 18
    LEAK_GAS_OIL_DEFICIENCIES,              // 19
    LEAK_SEWAGE_DEFICIENCIES,               // 20
    LEAK_WATER_DEFICIENCIES,                // 21
    LIGHTING_DEFICIENCIES,                  // 22
    MOLD_DEFICIENCIES,                      // 23
    PAINT_DEFICIENCIES,                     // 24
    RAILINGS_DEFICIENCIES,                  // 25
    RESTROOM_DEFICIENCIES,                  // 26
    SINK_LAUNDRY_DEFICIENCIES,              // 27
    STEPS_STAIRS_DEFICIENCIES,              // 28
    STRUCTURAL_DEFICIENCIES,                // 29
    TRASH_CHUTE_DEFICIENCIES,               // 30
    VENTILATION_DEFICIENCIES,               // 31
    WALL_DEFICIENCIES,                      // 32
    WATER_HEATER_DEFICIENCIES,              // 33
    WINDOW_DEFICIENCIES,                    // 34
    GENERAL_COMMENT_DEFICIENCIES            // 35
];

// ==========================================
// MAPPING HELPER FUNCTIONS
// ==========================================

/**
 * Shared helper to find a category using a two-pass matching strategy:
 * 1. Exact match (normalized)
 * 2. Robust fuzzy match
 */
const findUnitCategory = (categoryName: string) => {
    const normalize = (str: string) =>
        str.replace(/^\d+\.\s*/, '')
            .toLowerCase()
            .replace(/[\u2013\u2014\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

    const normalizedSearch = normalize(categoryName);

    // Pass 1: Exact match first
    for (const category of ALL_UNIT_CATEGORIES) {
        if (normalize(category.category) === normalizedSearch) {
            return category;
        }
    }

    // Pass 2: Robust matching
    for (const category of ALL_UNIT_CATEGORIES) {
        if (matchInsideCategory(categoryName, category.category)) {
            return category;
        }
    }

    return null;
};

// List of all Unit category names (normalized)
export const UNIT_CATEGORIES = ALL_UNIT_CATEGORIES.map(cat => cat.category);

// Get all unit deficiencies as flat array
export const ALL_UNIT_DEFICIENCIES: UnitItemDeficiencies[] = ALL_UNIT_CATEGORIES.flatMap(cat => cat.items);

// Function to get deficiencies by category name
export const getUnitDeficienciesByCategory = (categoryName: string): UnitItemDeficiencies | null => {
    // Pass 1 & 2: Use shared helper (Exact match, then Robust match)
    const category = findUnitCategory(categoryName);
    if (category) {
        // If it matches a category with multiple items, it should be handled via subcategories.
        // But if called directly for deficiencies, return the first item as a fallback.
        return category.items[0];
    }

    // PASS 3: Check if search matches a specific item name exactly (for direct item lookup)
    const normalizedSearch = categoryName.toLowerCase().trim();
    for (const category of ALL_UNIT_CATEGORIES) {
        for (const item of category.items) {
            if (item.itemName.toLowerCase() === normalizedSearch) {
                return item;
            }
        }
    }

    return null;
};

// Function to get all items for a specific category
export const getUnitItemsForCategory = (categoryName: string): UnitItemDeficiencies[] => {
    const category = findUnitCategory(categoryName);
    if (category) {
        return category.items;
    }

    return [];
};

// Function to search deficiencies by keyword
export const searchUnitDeficiencies = (keyword: string): UnitDeficiencyOption[] => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const results: UnitDeficiencyOption[] = [];

    for (const item of ALL_UNIT_DEFICIENCIES) {
        for (const deficiency of item.deficiencies) {
            if (deficiency.name.toLowerCase().includes(normalizedKeyword) ||
                deficiency.detail.toLowerCase().includes(normalizedKeyword) ||
                deficiency.criteria.toLowerCase().includes(normalizedKeyword)) {
                results.push(deficiency);
            }
        }
    }

    return results;
};

// ==========================================
// INSIDE SUBCATEGORY HELPER FUNCTIONS
// ==========================================

/**
 * Helper to match category names properly without false positives
 * Uses exact match first, then checks if search term starts category name
 */
const matchInsideCategory = (searchName: string, categoryFullName: string): boolean => {
    // Normalize string by removing number prefix, convert to lower case, 
    // and replace all variations of dashes/hyphens with a single space for robust comparison
    const normalize = (str: string) =>
        str.replace(/^\d+\.\s*/, '')
            .toLowerCase()
            .replace(/[\u2013\u2014\-]/g, ' ') // Replace various dash types with space
            .replace(/\s+/g, ' ')             // Collapse multiple spaces
            .trim();

    const normalizedSearch = normalize(searchName);
    const catName = normalize(categoryFullName);

    // Exact match
    if (catName === normalizedSearch) return true;

    // Word-based matching for robustness
    const searchWords = normalizedSearch.split(' ');
    const catWords = catName.split(' ');

    // Match if first word is the same AND (it's the only word OR another word matches)
    if (searchWords[0] === catWords[0] && searchWords[0].length > 3) {
        if (searchWords.length === 1) return true;
        // Check if any other word in search exists in the category name
        if (searchWords.some((word, idx) => idx > 0 && catWords.includes(word))) return true;
    }

    // Robust match for Category 24 (Paint)
    if (searchWords.includes('paint') && catWords.includes('paint')) return true;
    if (searchWords.includes('lead') && catWords.includes('lead')) return true;

    // Explicit fallback for Paint if search name is very short
    if (normalizedSearch === 'paint' && (catWords.includes('paint') || catWords.includes('lead'))) return true;

    // Loose inclusion (only if search is specific enough and NOT a generic word like Hazard)
    if (normalizedSearch.length > 5 && normalizedSearch !== 'hazard' && (catName.includes(normalizedSearch) || normalizedSearch.includes(catName))) {
        if (normalizedSearch.includes('paint') || normalizedSearch.includes('lead')) {
            return catName.includes('paint') || catName.includes('lead');
        }
        return true;
    }

    return false;
};

/**
 * Check if an Inside category has subcategories (items.length > 1)
 */
export const hasInsideSubcategories = (categoryName: string): boolean => {
    const category = findUnitCategory(categoryName);
    return category ? category.items.length >= 1 : false;
};

/**
 * Get subcategory names for an Inside category
 */
export const getInsideCategorySubcategories = (categoryName: string): string[] => {
    const category = findUnitCategory(categoryName);
    if (category && category.items.length >= 1) {
        return category.items.map(item => item.itemName);
    }
    return [];
};

/**
 * Get deficiencies for a specific subcategory within a known parent category (Inside locations).
 * More precise than getInsideSubcategoryDeficiencies because it only searches within the matching category,
 * preventing false positives when multiple categories share the same item name (e.g. "Mold-Like Substance").
 */
export const getInsideSubcategoryDeficienciesByParent = (categoryName: string, itemName: string): UnitItemDeficiencies | null => {
    const category = findUnitCategory(categoryName);
    if (!category) return null;

    const normalize = (str: string) =>
        str.replace(/^\d+\.\s*/, '')
            .toLowerCase()
            .replace(/[\u2013\u2014\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

    const normalizedItem = normalize(itemName);

    for (const item of category.items) {
        const catItemName = normalize(item.itemName);
        if (catItemName === normalizedItem) return item;
        if (catItemName.startsWith(normalizedItem) || normalizedItem.startsWith(catItemName)) return item;
    }

    return null;
};

/**
 * Get deficiencies for a specific subcategory within an Inside category
 */
export const getInsideSubcategoryDeficiencies = (subcategoryName: string): UnitItemDeficiencies | null => {
    // Normalize string by removing number prefix, convert to lower case, 
    // and replace all variations of dashes/hyphens with a single space for robust comparison
    const normalize = (str: string) =>
        str.replace(/^\d+\.\s*/, '')
            .toLowerCase()
            .replace(/[\u2013\u2014\-]/g, ' ') // Replace various dash types with space
            .replace(/\s+/g, ' ')             // Collapse multiple spaces
            .trim();

    const normalizedName = normalize(subcategoryName);

    for (const category of ALL_UNIT_CATEGORIES) {
        for (const item of category.items) {
            const catItemName = normalize(item.itemName);
            // Exact match first
            if (catItemName === normalizedName) return item;
            // Then check if item name starts with search or vice versa
            if (catItemName.startsWith(normalizedName) || normalizedName.startsWith(catItemName)) {
                return item;
            }
        }
    }

    return null;
};
