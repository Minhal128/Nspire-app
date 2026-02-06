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
}

export interface UnitItemDeficiencies {
    itemName: string;
    deficiencies: UnitDeficiencyOption[];
}

// ==========================================
// 1. CABINET AND STORAGE (PANTRY, LAUNDRY)
// ==========================================

export const CABINET_STORAGE_PANTRY: UnitItemDeficiencies = {
    itemName: 'Pantry, Food storage space is not present.',
    deficiencies: [
        {
            id: 'cab_storage_1',
            name: 'Pantry, Food storage space is not present.',
            detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
            criteria: 'Stowed items, including food, sanitation, and household supplies.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'CAB-STORAGE-01'
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

export const CALL_FOR_AID_NOT_FUNCTION: UnitItemDeficiencies = {
    itemName: 'System does not function properly.',
    deficiencies: [
        {
            id: 'call_aid_1',
            name: 'System does not function properly.',
            detail: 'A call-for-Aid system does not emit sound or light or send signal to annunciator.',
            criteria: 'The annunciator does not indicate the correct corresponding room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/50xn',
            code: 'CALL-AID-01'
        }
    ]
};

export const CALL_FOR_AID_BLOCKED: UnitItemDeficiencies = {
    itemName: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
    deficiencies: [
        {
            id: 'call_aid_2',
            name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
            detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
            criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '13.40/50xn',
            code: 'CALL-AID-02'
        }
    ]
};

export const CALL_FOR_AID_DEFICIENCIES = {
    category: '2. Call-for-Aid System',
    items: [CALL_FOR_AID_NOT_FUNCTION, CALL_FOR_AID_BLOCKED]
};

// ==========================================
// 3. CARBON MONOXIDE ALARM
// ==========================================

export const CO_ALARM_NO_ALARM: UnitItemDeficiencies = {
    itemName: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
    deficiencies: [
        {
            id: 'co_alarm_1',
            name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
            detail: 'Carbon monoxide alarm, inoperable.',
            criteria: 'With or without a battery, including low-volume.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-01'
        }
    ]
};

export const CO_ALARM_MISSING: UnitItemDeficiencies = {
    itemName: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
    deficiencies: [
        {
            id: 'co_alarm_2',
            name: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
            detail: 'The building contains a fuel-burning appliance or fuel-burning system, carbon monoxide alarm is missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-02'
        }
    ]
};

export const CO_ALARM_OBSTRUCTED: UnitItemDeficiencies = {
    itemName: 'Carbon monoxide alarm is obstructed.',
    deficiencies: [
        {
            id: 'co_alarm_3',
            name: 'Carbon monoxide alarm is obstructed.',
            detail: 'Carbon monoxide alarm is obstructed.',
            criteria: 'The carbon monoxide alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-03'
        }
    ]
};

export const CARBON_MONOXIDE_DEFICIENCIES = {
    category: '3. Carbon Monoxide Alarm',
    items: [CO_ALARM_NO_ALARM, CO_ALARM_MISSING, CO_ALARM_OBSTRUCTED]
};

// ==========================================
// 4. CEILING
// ==========================================

export const CEILING_NOT_ADEQUATE: UnitItemDeficiencies = {
    itemName: 'The ceiling component(s) is not functionally adequate.',
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
        }
    ]
};

export const CEILING_HOLE: UnitItemDeficiencies = {
    itemName: 'Ceiling has a hole.',
    deficiencies: [
        {
            id: 'ceiling_2',
            name: 'Ceiling has a hole.',
            detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
            criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'CEILING-02'
        }
    ]
};

export const CEILING_UNSTABLE: UnitItemDeficiencies = {
    itemName: 'The ceiling has an unstable surface (bulging, buckling).',
    deficiencies: [
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

export const CEILING_DEFICIENCIES = {
    category: '4. Ceiling',
    items: [CEILING_NOT_ADEQUATE, CEILING_HOLE, CEILING_UNSTABLE]
};

// ==========================================
// 5. CHIMNEY
// ==========================================

export const CHIMNEY_UNIT: UnitItemDeficiencies = {
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
            code: 'CHIMNEY-01'
        }
    ]
};

export const CHIMNEY_DEFICIENCIES = {
    category: '5. Chimney',
    items: [CHIMNEY_UNIT]
};

// ==========================================
// 6. CLOTHES DRYER EXHAUST VENTILATION
// ==========================================

export const DRYER_UNSUITABLE_MATERIAL: UnitItemDeficiencies = {
    itemName: 'Dryer transition duct is constructed of unsuitable material.',
    deficiencies: [
        {
            id: 'dryer_1',
            name: 'Dryer transition duct is constructed of unsuitable material.',
            detail: 'Dryer transition duct is not constructed of metal or an approved material.',
            criteria: 'Dryer is being used indoor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-01'
        }
    ]
};

export const DRYER_ELECTRIC_RESTRICTED: UnitItemDeficiencies = {
    itemName: 'Electrical dryer exhaust ventilation has restricted airflow.',
    deficiencies: [
        {
            id: 'dryer_2',
            name: 'Electrical dryer exhaust ventilation has restricted airflow.',
            detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-02'
        }
    ]
};

export const DRYER_ELECTRIC_DETACHED: UnitItemDeficiencies = {
    itemName: 'Electric dryer transition duct is detached or missing.',
    deficiencies: [
        {
            id: 'dryer_3',
            name: 'Electric dryer transition duct is detached or missing.',
            detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-03'
        }
    ]
};

export const DRYER_GAS_RESTRICTED: UnitItemDeficiencies = {
    itemName: 'Gas dryer exhaust ventilation system has restricted airflow.',
    deficiencies: [
        {
            id: 'dryer_4',
            name: 'Gas dryer exhaust ventilation system has restricted airflow.',
            detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-04'
        }
    ]
};

export const DRYER_GAS_DETACHED: UnitItemDeficiencies = {
    itemName: 'Gas dryer transition duct is detached or missing',
    deficiencies: [
        {
            id: 'dryer_5',
            name: 'Gas dryer transition duct is detached or missing',
            detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'DRYER-05'
        }
    ]
};

export const CLOTHES_DRYER_DEFICIENCIES = {
    category: '6. Clothes Dryer Exhaust Ventilation',
    items: [DRYER_UNSUITABLE_MATERIAL, DRYER_ELECTRIC_RESTRICTED, DRYER_ELECTRIC_DETACHED, DRYER_GAS_RESTRICTED, DRYER_GAS_DETACHED]
};

// ==========================================
// 7. DOOR
// ==========================================

export const DOOR_CANNOT_BE_SECURED: UnitItemDeficiencies = {
    itemName: 'Entry door cannot be secured.',
    deficiencies: [
        {
            id: 'door_entry_1',
            name: 'Entry door cannot be secured.',
            detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Installed locks can not be engaged from both sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'DOOR-ENTRY-01'
        }
    ]
};

export const DOOR_COMPONENT_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
    deficiencies: [
        {
            id: 'door_entry_2',
            name: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            detail: 'Entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
            criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'DOOR-ENTRY-02'
        }
    ]
};

export const DOOR_FRAME_DAMAGED: UnitItemDeficiencies = {
    itemName: 'The entry door frame, threshold, or trim is damaged.',
    deficiencies: [
        {
            id: 'door_entry_3',
            name: 'The entry door frame, threshold, or trim is damaged.',
            detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
            criteria: 'Observed evidence of prior installation, now missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-03'
        }
    ]
};

export const DOOR_ENTRY_MISSING: UnitItemDeficiencies = {
    itemName: 'Entry door is missing',
    deficiencies: [
        {
            id: 'door_entry_4',
            name: 'Entry door is missing',
            detail: 'Evidence of prior installation',
            criteria: 'Not present or is incomplete.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-ENTRY-04'
        }
    ]
};

export const DOOR_ENTRY: UnitItemDeficiencies = {
    itemName: 'Door - Entry',
    deficiencies: [
        {
            id: 'door_entry_5',
            name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            criteria: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-05'
        },
        {
            id: 'door_entry_6',
            name: 'Self-closing mechanism is damaged, inoperable or damaged.',
            detail: 'Self-closing mechanism is damaged, inoperable or damaged.',
            criteria: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-06'
        },
        {
            id: 'door_entry_7',
            name: 'Entry door surface is delaminated or separated.',
            detail: 'Entry door surface is delaminated or separated.',
            criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-07'
        },
        {
            id: 'door_entry_8',
            name: 'Entry door will not close.',
            detail: 'Entry door will not close.',
            criteria: 'Entry door does not close (i.e., door seats in frame).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'DOOR-ENTRY-08'
        },
        {
            id: 'door_entry_9',
            name: 'Entry door will not open.',
            detail: 'Entry door will not open.',
            criteria: 'Entry door does not open.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-09'
        },
        {
            id: 'door_entry_10',
            name: 'Hole, split, or crack that penetrates completely through the entry door.',
            detail: 'Hole, split, or crack that penetrates completely through the entry door.',
            criteria: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-ENTRY-10'
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
            points: '14.8/n',
            code: 'DOOR-FIRE-01'
        },
        {
            id: 'door_fire_2',
            name: 'Fire-labeled door assembly has a hole of any size.',
            detail: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
            criteria: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-02'
        },
        {
            id: 'door_fire_3',
            name: 'Fire-labeled door cannot be secured.',
            detail: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-03'
        },
        {
            id: 'door_fire_4',
            name: 'Fire-labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
            detail: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
            criteria: 'Fire-labeled door does not close and latch. OR fire-labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-04'
        },
        {
            id: 'door_fire_5',
            name: 'Fire-labeled door does not open.',
            detail: 'Fire labeled door does not open such that it may limit access between spaces.',
            criteria: 'Fire-labeled door does not open such that it may limit access between spaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-05'
        },
        {
            id: 'door_fire_6',
            name: 'Fire-labeled door is missing.',
            detail: '(i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Fire-labeled door is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'DOOR-FIRE-06'
        },
        {
            id: 'door_fire_7',
            name: 'Fire-labeled door seal or gasket is damaged.',
            detail: 'Fire-labeled door seal or gasket is damaged.',
            criteria: 'Fire-labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-07'
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
            code: 'DOOR-GEN-01'
        },
        {
            id: 'door_general_2',
            name: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
            detail: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
            criteria: 'A passage door does not open such that it may limit access when needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-GEN-02'
        },
        {
            id: 'door_general_3',
            name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            detail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            criteria: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'DOOR-GEN-03'
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
            code: 'DOOR-GARAGE-01'
        },
        {
            id: 'door_garage_2',
            name: 'The garage door has a hole (broken panel or window).',
            detail: 'The garage door has a hole (broken panel or window).',
            criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DOOR-GARAGE-02'
        }
    ]
};

export const DOOR_DEFICIENCIES = {
    category: '7. Door',
    items: [DOOR_CANNOT_BE_SECURED, DOOR_COMPONENT_DAMAGED, DOOR_FRAME_DAMAGED, DOOR_ENTRY_MISSING, DOOR_ENTRY, DOOR_FIRE_LABELED, DOOR_GENERAL, DOOR_GARAGE]
};

// ==========================================
// 8. DRAINAGE
// ==========================================

export const DRAINAGE_UNIT: UnitItemDeficiencies = {
    itemName: 'Drain/Floor drain',
    deficiencies: [
        {
            id: 'drainage_1',
            name: 'The drain is fully blocked.',
            detail: 'Drain/Floor drain',
            criteria: 'There is a problem with the drainage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'DRAINAGE-01'
        }
    ]
};

export const DRAINAGE_DEFICIENCIES = {
    category: '8. Drainage',
    items: [DRAINAGE_UNIT]
};

// ==========================================
// 9. EGRESS
// ==========================================

export const EGRESS_UNIT: UnitItemDeficiencies = {
    itemName: 'Obstructed means of egress',
    deficiencies: [
        {
            id: 'egress_1',
            name: 'Obstructed means of egress',
            detail: 'The exit access or exit is obstructed. 1. Exit access - path from any interior location to an exit. 2. Exit doors to the outside and enclosed exit stairways.',
            criteria: 'Double-key Cylinder deadbolt locks or security features requiring a key, tool, or special effort from the stress side are not allowed on exit doors, exit access doors, or egress windows. Fixed or movable security bars must not block designated egress points, and no furniture or items may obstruct the means of egress.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'EGRESS-01'
        }
    ]
};

export const EGRESS_DEFICIENCIES = {
    category: '9. Egress',
    items: [EGRESS_UNIT]
};

// ==========================================
// 10. ELECTRICAL
// ==========================================

export const ELECTRICAL_CONDUCTOR_OUTLET_SWITCH: UnitItemDeficiencies = {
    itemName: 'Conductor-Outlet, and Switch',
    deficiencies: [
        {
            id: 'elec_conductor_1',
            name: 'The electrical conductor is not enclosed or properly insulated.',
            detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
            criteria: 'Electrical conductors must be enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2"; missing light bulbs are evaluated under interior or exterior lighting.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COND-01'
        },
        {
            id: 'elec_conductor_2',
            name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
            detail: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
            criteria: 'An outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) does not have visible damage and testing indicates that it is not energized.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COND-02'
        },
        {
            id: 'elec_conductor_3',
            name: 'The outlet or switch is damaged.',
            detail: 'The outlet or switch is damaged.',
            criteria: 'Any portion of a visually accessible (i.e., can be reasonably accessed and observed) outlet or switch is damaged (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COND-03'
        },
        {
            id: 'elec_conductor_4',
            name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            detail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            criteria: 'Testing of a three-pronged outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) indicates that it is not properly wired or grounded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'ELEC-COND-04'
        },
        {
            id: 'elec_conductor_5',
            name: 'Water is currently in contact with an electrical conductor.',
            detail: 'Water is currently in contact with an electrical conductor.',
            criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COND-05'
        }
    ]
};

export const ELECTRICAL_GFCI_AFCI: UnitItemDeficiencies = {
    itemName: 'Electrical-(GFCI) Or (AFCI)-Outlet or Breaker',
    deficiencies: [
        {
            id: 'elec_gfci_1',
            name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-01'
        },
        {
            id: 'elec_gfci_2',
            name: 'Unprotected outlet is present within six feet of a water source.',
            detail: 'Unprotected outlet is present within six feet of a water source.',
            criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-02'
        },
        {
            id: 'elec_gfci_3',
            name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
            detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
            criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'ELEC-GFCI-03'
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
            criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property). Or it is looked or in locked location, no key to access.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'ELEC-PANEL-01'
        },
        {
            id: 'elec_panel_2',
            name: 'The overcurrent protection device is contaminated.',
            detail: 'The overcurrent protection device is contaminated.',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-02'
        },
        {
            id: 'elec_panel_3',
            name: 'The overcurrent protection device is damaged.',
            detail: 'The overcurrent protection device is damaged.',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an over current condition (i.e., paint, or other foreign materials).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-03'
        }
    ]
};

export const ELECTRICAL_DEFICIENCIES = {
    category: '10. Electrical',
    items: [ELECTRICAL_CONDUCTOR_OUTLET_SWITCH, ELECTRICAL_GFCI_AFCI, ELECTRICAL_SERVICE_PANEL]
};

// ==========================================
// 11. ELEVATOR
// ==========================================

export const ELEVATOR_NOT_LEVEL: UnitItemDeficiencies = {
    itemName: 'Elevator Cab is not level with the floor.',
    deficiencies: [
        {
            id: 'elevator_1',
            name: 'Elevator Cab is not level with the floor.',
            detail: 'Poses tripping hazards.',
            criteria: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-01'
        }
    ]
};

export const ELEVATOR_DOOR: UnitItemDeficiencies = {
    itemName: 'The elevator door does not fully open or close.',
    deficiencies: [
        {
            id: 'elevator_2',
            name: 'The elevator door does not fully open or close.',
            detail: 'The elevator door does not fully open (at least 36 inches) and does not close.',
            criteria: 'All elevators must be in working condition.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-02'
        }
    ]
};

export const ELEVATOR_INOPERABLE: UnitItemDeficiencies = {
    itemName: 'Elevator is inoperable.',
    deficiencies: [
        {
            id: 'elevator_3',
            name: 'Elevator is inoperable.',
            detail: 'Elevator is inoperable (i.e. overall system or component thereof not meeting function or purpose; with or without visible damage).',
            criteria: 'Elevator system or component thereof not meeting function or purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-03'
        }
    ]
};

export const ELEVATOR_SAFETY_DEVICE: UnitItemDeficiencies = {
    itemName: 'Safety edge device has malfunctioned or is inoperable.',
    deficiencies: [
        {
            id: 'elevator_4',
            name: 'Safety edge device has malfunctioned or is inoperable.',
            detail: 'The safety edge device hasd has malfunctioned or is not functionally adequate.',
            criteria: 'Overall, the system or a component thereof is not meeting its function or purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'ELEVATOR-04'
        }
    ]
};

export const ELEVATOR_DEFICIENCIES = {
    category: '11. Elevator',
    items: [ELEVATOR_NOT_LEVEL, ELEVATOR_DOOR, ELEVATOR_INOPERABLE, ELEVATOR_SAFETY_DEVICE]
};

// ==========================================
// 12. FIRE SAFETY
// ==========================================

export const FIRE_SAFETY_EXIT_SIGN: UnitItemDeficiencies = {
    itemName: 'Exit Sign',
    deficiencies: [
        {
            id: 'fire_exit_1',
            name: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
            detail: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
            criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXIT-01'
        }
    ]
};

export const FIRE_SAFETY_EXTINGUISHER: UnitItemDeficiencies = {
    itemName: 'Fire Extinguisher',
    deficiencies: [
        {
            id: 'fire_ext_1',
            name: 'A fire extinguisher is damaged or missing.',
            detail: 'A fire extinguisher is damaged or missing.',
            criteria: 'A fire extinguisher is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXT-01'
        },
        {
            id: 'fire_ext_2',
            name: 'The fire extinguisher pressure gauge reads over or undercharged.',
            detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
            criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXT-02'
        },
        {
            id: 'fire_ext_3',
            name: 'The fire extinguisher tag is missing or illegible or expired.',
            detail: 'The fire extinguisher tag is missing or illegible or expired.',
            criteria: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-EXT-03'
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
            criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place (e.g. under a kitchen sink cabinet, in a hall closet,etc.) is not a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-FLAM-01'
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
            code: 'FIRE-SMOKE-01'
        },
        {
            id: 'fire_smoke_2',
            name: 'Smoke alarm not installed where required.',
            detail: 'Smoke alarm not installed where required.',
            criteria: 'Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-02'
        },
        {
            id: 'fire_smoke_3',
            name: 'Smoke alarm is obstructed',
            detail: 'Smoke alarm is obstructed',
            criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-03'
        },
        {
            id: 'fire_smoke_4',
            name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            detail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'FIRE-SMOKE-04'
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
            criteria: 'The sprinkler assembly component is damaged,, inoperable or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-01'
        },
        {
            id: 'fire_sprinkler_2',
            name: 'Sprinkler head assembly has evidence of corrosion.',
            detail: 'Sprinkler head assembly has evidence of corrosion.',
            criteria: 'Sprinkler head assembly has evidence of corrosion.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-02'
        },
        {
            id: 'fire_sprinkler_3',
            name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
            detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
            criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-03'
        },
        {
            id: 'fire_sprinkler_4',
            name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
            detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
            criteria: '18 inches clearance is not due to feature within built (e.g. closet, utility closet).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'FIRE-SPRINKLER-04'
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

export const FLOOR_NOT_ADEQUATE: UnitItemDeficiencies = {
    itemName: 'Floor component(s) is not functionally adequate.',
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
        }
    ]
};

export const FLOOR_SUBSTRATE_EXPOSED: UnitItemDeficiencies = {
    itemName: 'Floor substrate is exposed',
    deficiencies: [
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

export const FLOOR_DEFICIENCIES = {
    category: '13. Floor',
    items: [FLOOR_NOT_ADEQUATE, FLOOR_SUBSTRATE_EXPOSED]
};

// ==========================================
// 14. FOUNDATION
// ==========================================

export const FOUNDATION_REBAR_SPALLING: UnitItemDeficiencies = {
    itemName: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
    deficiencies: [
        {
            id: 'foundation_1',
            name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
            detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-01'
        }
    ]
};

export const FOUNDATION_CRACKED: UnitItemDeficiencies = {
    itemName: 'Foundation is cracked.',
    deficiencies: [
        {
            id: 'foundation_2',
            name: 'Foundation is cracked.',
            detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
            criteria: 'Foundation cracks (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-02'
        }
    ]
};

export const FOUNDATION_WATER: UnitItemDeficiencies = {
    itemName: 'Foundation infiltrated by water.',
    deficiencies: [
        {
            id: 'foundation_3',
            name: 'Foundation infiltrated by water.',
            detail: 'Evidence of water infiltration through the foundation through visual evaluation.',
            criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-03'
        }
    ]
};

export const FOUNDATION_SUPPORT_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Foundation support post, column, or girder area is damaged.',
    deficiencies: [
        {
            id: 'foundation_4',
            name: 'Foundation support post, column, or girder area is damaged.',
            detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'FOUNDATION-04'
        }
    ]
};

export const FOUNDATION_DEFICIENCIES = {
    category: '14. Foundation',
    items: [FOUNDATION_REBAR_SPALLING, FOUNDATION_CRACKED, FOUNDATION_WATER, FOUNDATION_SUPPORT_DAMAGED]
};

// ==========================================
// 15. GRAB BAR
// ==========================================

export const GRAB_BAR_UNIT: UnitItemDeficiencies = {
    itemName: 'Grab Bar',
    deficiencies: [
        {
            id: 'grab_bar_1',
            name: 'The grab bar is not secured.',
            detail: 'The grab bar is not secured.',
            criteria: 'Any movement whatsoever is detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'GRAB-BAR-01'
        }
    ]
};

export const GRAB_BAR_DEFICIENCIES = {
    category: '15. Grab Bar',
    items: [GRAB_BAR_UNIT]
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
            detail: 'Evidence of bedbugs.',
            criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-01'
        },
        {
            id: 'hazard_infest_2',
            name: 'Evidence of cockroaches(dead).',
            detail: 'Evidence of cockroaches(dead).',
            criteria: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-02'
        },
        {
            id: 'hazard_infest_3',
            name: 'Evidence of mice.',
            detail: 'Evidence of mice.',
            criteria: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-03'
        },
        {
            id: 'hazard_infest_4',
            name: 'Evidence of other pests.',
            detail: 'Evidence of other pests.',
            criteria: 'Evidence is present of other pest infestations, including but not limited to a trail of ants, wasps/beehives, squirrels, birds, and bats in an interior area. Pests are animals with potential impacts on residents health and safety.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-04'
        },
        {
            id: 'hazard_infest_5',
            name: 'Evidence of rats.',
            detail: 'Evidence of rats.',
            criteria: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-05'
        },
        {
            id: 'hazard_infest_6',
            name: 'Extensive bedbugs infestation.',
            detail: 'Extensive bedbugs infestation.',
            criteria: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime through visual assessment.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-06'
        },
        {
            id: 'hazard_infest_7',
            name: 'Extensive cockroach infestation (live).',
            detail: 'Extensive cockroach infestation (live).',
            criteria: 'Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'HAZARD-INFEST-07'
        },
        {
            id: 'hazard_infest_8',
            name: 'Extensive mouse infestation.',
            detail: 'Extensive mouse infestation.',
            criteria: 'Sighting of at least one live mouse in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-08'
        },
        {
            id: 'hazard_infest_9',
            name: 'Extensive rat infestation.',
            detail: 'Extensive rat infestation.',
            criteria: 'A live rat is seen in the unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-INFEST-09'
        }
    ]
};

export const HAZARD_LITTER: UnitItemDeficiencies = {
    itemName: 'LITTER',
    deficiencies: [
        {
            id: 'hazard_litter_1',
            name: 'Litter is accumulated in an unassigned area.',
            detail: 'Litter is accumulated in an unassigned area.',
            criteria: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'HAZARD-LITTER-01'
        }
    ]
};

export const HAZARD_SHARP_EDGES: UnitItemDeficiencies = {
    itemName: 'Sharp edges',
    deficiencies: [
        {
            id: 'hazard_sharp_1',
            name: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
            detail: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
            criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZARD-SHARP-01'
        }
    ]
};

export const HAZARD_TRIP: UnitItemDeficiencies = {
    itemName: 'Trip hazard',
    deficiencies: [
        {
            id: 'hazard_trip_1',
            name: 'Trip hazard on walking surface.',
            detail: 'Trip hazard on walking surface.',
            criteria: 'There is an abrupt change in vertical elevation or horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: - An unintended ¾ inch or greater vertical difference',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-TRIP-01'
        },
        {
            id: 'hazard_trip_2',
            name: 'Trip hazard - horizontal separation.',
            detail: 'Trip hazard - horizontal separation.',
            criteria: 'horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: -An unintended 2-inch horizontal separation perpendicular to the path of travel.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-TRIP-02'
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

export const HVAC_AC_NOT_OPERATIONAL: UnitItemDeficiencies = {
    itemName: 'Air conditioning system or device is not operational.',
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
        }
    ]
};

export const HVAC_COMBUSTION_CHAMBER: UnitItemDeficiencies = {
    itemName: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
    deficiencies: [
        {
            id: 'hvac_2',
            name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
            detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
            criteria: 'a combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-02'
        }
    ]
};

export const HVAC_EXHAUST_VENT: UnitItemDeficiencies = {
    itemName: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
    deficiencies: [
        {
            id: 'hvac_3',
            name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
            detail: 'A fuel-burning heating system or device is present. And exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. Or Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-03'
        }
    ]
};

export const HVAC_SAFETY_SHIELD: UnitItemDeficiencies = {
    itemName: 'Heating system or device safety shield is damaged or missing.',
    deficiencies: [
        {
            id: 'hvac_4',
            name: 'Heating system or device safety shield is damaged or missing.',
            detail: 'Heating system or device safety shield is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
            criteria: 'Safety shield was previously installed and is now not present or is incomplete. Heating systems in tropical islands are excluded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'HVAC-04'
        }
    ]
};

export const HVAC_APRIL_SEPT: UnitItemDeficiencies = {
    itemName: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
    deficiencies: [
        {
            id: 'hvac_5',
            name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
            detail: 'A permanently installed heating source is damaged. OR a permanently installed heating source is inoperable, not meeting function or purpose, with or without visible damage. OR a permanently installed heating source is missing (i.e., evidence of prior installation but is now not present or is incomplete). OR A permanently installed heating source is not installed. And The outside temperature is below 68 degrees Fahrenheit',
            criteria: 'Permanently is affixed within the unit or building, safely connected to the unit or building electrical system, thermostatically controlled by the unit or building, and appropriate for the size of the unit or building. The energy source for a permanently heating system can be electric, gas, or oil (Boiler Chiller system). The heating systems in tropical islands are excluded.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '13.40/n',
            code: 'HVAC-05'
        }
    ]
};

export const HVAC_OCT_MARCH: UnitItemDeficiencies = {
    itemName: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
    deficiencies: [
        {
            id: 'hvac_6',
            name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            detail: 'The inspection date is on or between October 1 and March 31. AND the permanently installed heating source is not working. OR the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            criteria: 'The permanently installed heating source is not working to create heat. Heating systems in tropical islands are excluded.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'HVAC-06'
        }
    ]
};

export const HVAC_UNVENTED_HEATER: UnitItemDeficiencies = {
    itemName: 'Unvented space heater is present.',
    deficiencies: [
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

export const HVAC_DEFICIENCIES = {
    category: '17. Heating, Ventilation, and Air Conditioning',
    items: [HVAC_AC_NOT_OPERATIONAL, HVAC_COMBUSTION_CHAMBER, HVAC_EXHAUST_VENT, HVAC_SAFETY_SHIELD, HVAC_APRIL_SEPT, HVAC_OCT_MARCH, HVAC_UNVENTED_HEATER]
};

// ==========================================
// 18. KITCHEN
// ==========================================

export const KITCHEN_CABINET_STORAGE: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'kitchen_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Storage component is damaged, inoperable, or missing.',
            criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-CAB-01'
        }
    ]
};

export const KITCHEN_COOKING_APPLIANCE: UnitItemDeficiencies = {
    itemName: 'Cooking Appliance.',
    deficiencies: [
        {
            id: 'kitchen_cook_1',
            name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-COOK-01'
        },
        {
            id: 'kitchen_cook_2',
            name: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
            detail: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
            criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-COOK-02'
        },
        {
            id: 'kitchen_cook_3',
            name: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
            detail: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
            criteria: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'KITCHEN-COOK-03'
        }
    ]
};

export const KITCHEN_FOOD_PREP: UnitItemDeficiencies = {
    itemName: 'Food preparation Area',
    deficiencies: [
        {
            id: 'kitchen_food_1',
            name: 'Food preparation area is damaged or is not functionally adequate.',
            detail: 'Food preparation area is damaged or is not functionally adequate.',
            criteria: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FOOD-01'
        },
        {
            id: 'kitchen_food_2',
            name: 'Food preparation area is not present.',
            detail: 'Food preparation area is not present.',
            criteria: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FOOD-02'
        }
    ]
};

export const KITCHEN_MOLD: UnitItemDeficiencies = {
    itemName: 'MOLD-LIKE SUBSTANCE',
    deficiencies: [
        {
            id: 'kitchen_mold_1',
            name: 'Peeling Paint-Elevated moisture level.',
            detail: 'Peeling Paint-Elevated moisture level.',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-MOLD-01'
        },
        {
            id: 'kitchen_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'KITCHEN-MOLD-02'
        },
        {
            id: 'kitchen_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'KITCHEN-MOLD-03'
        },
        {
            id: 'kitchen_mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than one square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-MOLD-04'
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
            criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FRIDGE-01'
        },
        {
            id: 'kitchen_fridge_2',
            name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            detail: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            criteria: 'Refrigerator is inoperable (i.e., overall system is not meeting function or purpose; with or without visible damage) such that it may be unable to safely and adequately store food',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-FRIDGE-02'
        }
    ]
};

export const KITCHEN_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'kitchen_sink_1',
            name: 'Cannot activate or deactivate hot and cold water.',
            detail: 'Cannot activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-01'
        },
        {
            id: 'kitchen_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-02'
        },
        {
            id: 'kitchen_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-03'
        },
        {
            id: 'kitchen_sink_4',
            name: 'The sink is not draining, not functioning adequately.',
            detail: 'The sink is not draining, not functioning adequately.',
            criteria: 'Water is not draining from the basin of the sink. slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-SINK-04'
        },
        {
            id: 'kitchen_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'KITCHEN-SINK-05'
        },
        {
            id: 'kitchen_sink_6',
            name: 'Water pressure, direction.',
            detail: 'Water pressure, direction.',
            criteria: 'Water pressure, direction is not adequately functional.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'KITCHEN-SINK-06'
        }
    ]
};

export const KITCHEN_VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation',
    deficiencies: [
        {
            id: 'kitchen_vent_1',
            name: 'The kitchen does not have ventilation, not present and operable.',
            detail: 'The kitchen does not have ventilation, not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-01'
        },
        {
            id: 'kitchen_vent_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged or missing.',
            criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-02'
        },
        {
            id: 'kitchen_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-03'
        },
        {
            id: 'kitchen_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'KITCHEN-VENT-04'
        }
    ]
};

export const KITCHEN_DEFICIENCIES = {
    category: '18. Kitchen',
    items: [KITCHEN_CABINET_STORAGE, KITCHEN_COOKING_APPLIANCE, KITCHEN_FOOD_PREP, KITCHEN_MOLD, KITCHEN_REFRIGERATOR, KITCHEN_SINK, KITCHEN_VENTILATION]
};

// ==========================================
// 19. LEAK – GAS OR OIL
// ==========================================

export const LEAK_GAS_OIL_UNIT: UnitItemDeficiencies = {
    itemName: 'Natural gas, propane, or oil leak.',
    deficiencies: [
        {
            id: 'leak_gas_1',
            name: 'Natural gas, propane, or oil leak.',
            detail: 'Natural gas, propane, or oil leak.',
            criteria: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '54.50/n',
            code: 'LEAK-GAS-01'
        }
    ]
};

export const LEAK_GAS_OIL_DEFICIENCIES = {
    category: '19- LEAK – Gas or Oil',
    items: [LEAK_GAS_OIL_UNIT]
};

// ==========================================
// 20. LEAK-SEWAGE SYSTEM (CLOGGED DRAIN)(MISSING DRAIN CAP)
// ==========================================

export const LEAK_SEWAGE_BLOCKED: UnitItemDeficiencies = {
    itemName: 'Blocked sewage system.',
    deficiencies: [
        {
            id: 'leak_sewage_1',
            name: 'Blocked sewage system.',
            detail: 'Wastewater is unable to drain resulting in sewer backup.',
            criteria: 'Blocked sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LEAK-SEWAGE-01'
        }
    ]
};

export const LEAK_SEWAGE_CAP_MISSING: UnitItemDeficiencies = {
    itemName: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
    deficiencies: [
        {
            id: 'leak_sewage_2',
            name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
            detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Cap to the cleanout or pump cover is detached or missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-SEWAGE-02'
        }
    ]
};

export const LEAK_SEWAGE_CAP_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Cleanout cap or riser is damaged.',
    deficiencies: [
        {
            id: 'leak_sewage_3',
            name: 'Cleanout cap or riser is damaged.',
            detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
            criteria: 'Protective cap or riser is damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-SEWAGE-03'
        }
    ]
};

export const LEAK_SEWAGE_LEAK: UnitItemDeficiencies = {
    itemName: 'Leak in sewage system.',
    deficiencies: [
        {
            id: 'leak_sewage_4',
            name: 'Leak in sewage system.',
            detail: 'There is evidence of a sewer line or fitting leaking.',
            criteria: 'Leak in sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LEAK-SEWAGE-04'
        }
    ]
};

export const LEAK_SEWAGE_DEFICIENCIES = {
    category: '20. Leak-sewage system (Clogged drain)(Missing drain cap)',
    items: [LEAK_SEWAGE_BLOCKED, LEAK_SEWAGE_CAP_MISSING, LEAK_SEWAGE_CAP_DAMAGED, LEAK_SEWAGE_LEAK]
};

// ==========================================
// 21. LEAK- WATER
// ==========================================

export const LEAK_WATER_ENV_INTRUSION: UnitItemDeficiencies = {
    itemName: 'Environmental water intrusion',
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
        }
    ]
};

export const LEAK_WATER_SPRINKLER: UnitItemDeficiencies = {
    itemName: 'Fluid is leaking from the sprinkler assembly.',
    deficiencies: [
        {
            id: 'leak_water_2',
            name: 'Fluid is leaking from the sprinkler assembly.',
            detail: 'Fluid is leaking from the sprinkler assembly.',
            criteria: 'Fluid is leaking from the sprinkler assembly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LEAK-WATER-02'
        }
    ]
};

export const LEAK_WATER_PLUMBING: UnitItemDeficiencies = {
    itemName: 'Plumbing leak',
    deficiencies: [
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

export const LEAK_WATER_DEFICIENCIES = {
    category: '21. Leak- water',
    items: [LEAK_WATER_ENV_INTRUSION, LEAK_WATER_SPRINKLER, LEAK_WATER_PLUMBING]
};

// ==========================================
// 22. LIGHTING
// ==========================================

export const LIGHTING_AUXILIARY: UnitItemDeficiencies = {
    itemName: 'Lighting - Auxiliary',
    deficiencies: [
        {
            id: 'lighting_aux_1',
            name: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
            detail: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
            criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'LIGHTING-AUX-01'
        }
    ]
};

export const LIGHTING_INTERIOR: UnitItemDeficiencies = {
    itemName: 'Lighting - Interior',
    deficiencies: [
        {
            id: 'lighting_int_1',
            name: 'A permanently installed light fixture is inoperable.',
            detail: 'A permanently installed light fixture is inoperable.',
            criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-01'
        },
        {
            id: 'lighting_int_2',
            name: 'A permanently installed light fixture is not secure.',
            detail: 'A permanently installed light fixture is not secure.',
            criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-02'
        },
        {
            id: 'lighting_int_3',
            name: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
            detail: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
            criteria: 'Permanent lighting fixtures are missing or not functioning.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'LIGHTING-INT-03'
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

export const MOLD_UNIT: UnitItemDeficiencies = {
    itemName: 'Mold - Like Substance',
    deficiencies: [
        {
            id: 'mold_1',
            name: 'Peeling paint, elevated moisture level.',
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
            detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'MOLD-02'
        },
        {
            id: 'mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'MOLD-03'
        },
        {
            id: 'mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'MOLD-04'
        }
    ]
};

export const MOLD_DEFICIENCIES = {
    category: '23. Mold',
    items: [MOLD_UNIT]
};

// ==========================================
// 24. PAINT - POTENTIAL LEAD-BASED PAINT HAZARDS – VISUAL ASSESSMENT
// ==========================================

export const PAINT_LESS_2SF: UnitItemDeficiencies = {
    itemName: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
    deficiencies: [
        {
            id: 'paint_1',
            name: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
            detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
            criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'PAINT-01'
        }
    ]
};

export const PAINT_MORE_2SF: UnitItemDeficiencies = {
    itemName: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
    deficiencies: [
        {
            id: 'paint_2',
            name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
            detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
            criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'PAINT-02'
        }
    ]
};

export const PAINT_DEFICIENCIES = {
    category: '24. Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
    items: [PAINT_LESS_2SF, PAINT_MORE_2SF]
};

// ==========================================
// 25. RAILINGS
// ==========================================

export const RAILINGS_GUARDRAIL: UnitItemDeficiencies = {
    itemName: 'Guardrail',
    deficiencies: [
        {
            id: 'railing_guard_1',
            name: 'The guardrail is missing or not installed. It does limit its safe use.',
            detail: 'The guardrail is missing or not installed. It does limit its safe use.',
            criteria: 'The guardrail is missing (i.e., evidence of prior installation but is now not present or is incomplete) or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'RAILING-GUARD-01'
        },
        {
            id: 'railing_guard_2',
            name: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
            detail: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
            criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to effectively prevent fall hazards',
            severity: 'Life-Threatening',
            repairBy: '24 Hrs.',
            points: '27.25/n',
            code: 'RAILING-GUARD-02'
        }
    ]
};

export const RAILINGS_HANDRAIL: UnitItemDeficiencies = {
    itemName: 'Handrail',
    deficiencies: [
        {
            id: 'railing_hand_1',
            name: 'Handrail is missing.',
            detail: 'Handrail is missing.',
            criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '27.25/n',
            code: 'RAILING-HAND-01'
        },
        {
            id: 'railing_hand_2',
            name: 'Handrail is not functionally adequate.',
            detail: 'Handrail is not functionally adequate.',
            criteria: 'A handrail is deficient if it can\'t be reasonably grasped for support, isn\'t continuous along the full stair flight, or falls outside the required height range of 28 to 42 inches.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RAILING-HAND-02'
        },
        {
            id: 'railing_hand_3',
            name: 'Handrail is not installed where required.',
            detail: 'Handrail is not installed where required.',
            criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'RAILING-HAND-03'
        },
        {
            id: 'railing_hand_4',
            name: 'Handrail is not secured.',
            detail: 'Handrail is not secured.',
            criteria: 'There is movement in the anchors of the handrail.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RAILING-HAND-04'
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
            name: 'Bathtub or shower is inoperable or does not drain.',
            detail: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
            criteria: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RESTROOM-BATH-01'
        },
        {
            id: 'restroom_bath_2',
            name: 'Bathtub or shower component damaged (may not limit hygiene).',
            detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may not limit the resident\'s ability to maintain personal hygiene.',
            criteria: 'Component, inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'RESTROOM-BATH-02'
        },
        {
            id: 'restroom_bath_3',
            name: 'Bathtub or shower component damaged (may limit hygiene).',
            detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
            criteria: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RESTROOM-BATH-03'
        },
        {
            id: 'restroom_bath_4',
            name: 'Bathtub or shower cannot be used in private.',
            detail: 'Bathtub or shower cannot be used in private.',
            criteria: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RESTROOM-BATH-04'
        },
        {
            id: 'restroom_bath_5',
            name: 'Only one bathtub/shower present and inoperable.',
            detail: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
            criteria: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'RESTROOM-BATH-05'
        }
    ]
};

export const RESTROOM_CABINET_STORAGE: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'restroom_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Storage component is damaged, inoperable, or missing.',
            criteria: 'Some of the restroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-CAB-01'
        }
    ]
};

export const RESTROOM_GRAB_BAR: UnitItemDeficiencies = {
    itemName: 'Grab Bar',
    deficiencies: [
        {
            id: 'restroom_grab_1',
            name: 'Grab bar is not secure.',
            detail: 'Grab bar is not secure.',
            criteria: 'Any movement whatever is detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-GRAB-01'
        }
    ]
};

export const RESTROOM_MOLD: UnitItemDeficiencies = {
    itemName: 'Mold -Like Substance',
    deficiencies: [
        {
            id: 'restroom_mold_1',
            name: 'Peeling paint-elevated moisture level.',
            detail: 'Peeling paint-elevated moisture level.',
            criteria: 'elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-MOLD-01'
        },
        {
            id: 'restroom_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'RESTROOM-MOLD-02'
        },
        {
            id: 'restroom_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'RESTROOM-MOLD-03'
        },
        {
            id: 'restroom_mold_4',
            name: '4" or less Presence of a mold-like substance at a moderate level observed visually.',
            detail: '4" or less Presence of a mold-like substance at a moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-MOLD-04'
        }
    ]
};

export const RESTROOM_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'restroom_sink_1',
            name: 'Cannot activate or deactivate hot and cold water.',
            detail: 'Cannot activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-01'
        },
        {
            id: 'restroom_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-02'
        },
        {
            id: 'restroom_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-03'
        },
        {
            id: 'restroom_sink_4',
            name: 'The sink is not draining, not functioning adequately.',
            detail: 'The sink is not draining, not functioning adequately.',
            criteria: 'Water is not draining from the basin of the sink, slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-04'
        },
        {
            id: 'restroom_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-SINK-05'
        },
        {
            id: 'restroom_sink_6',
            name: 'Water is directed outside of the basin.',
            detail: 'Water is directed outside of the basin.',
            criteria: 'When in use, water is directed outside of the basin.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'RESTROOM-SINK-06'
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
            code: 'RESTROOM-TOILET-01'
        },
        {
            id: 'restroom_toilet_2',
            name: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
            detail: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
            criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-02'
        },
        {
            id: 'restroom_toilet_3',
            name: 'Only 1 toilet was installed, and it is damaged or inoperable.',
            detail: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).',
            criteria: 'Only one toilet was installed, and it is damaged or inoperable.',
            severity: 'Severe',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'RESTROOM-TOILET-03'
        },
        {
            id: 'restroom_toilet_4',
            name: 'Only 1 toilet was installed, and it is missing.',
            detail: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.',
            criteria: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'RESTROOM-TOILET-04'
        },
        {
            id: 'restroom_toilet_5',
            name: 'Toilet can not be used in private.',
            detail: 'Toilet can not be used in private.',
            criteria: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-05'
        },
        {
            id: 'restroom_toilet_6',
            name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            criteria: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-06'
        },
        {
            id: 'restroom_toilet_7',
            name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            detail: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation.',
            criteria: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'RESTROOM-TOILET-07'
        },
        {
            id: 'restroom_toilet_8',
            name: 'Toilet is not secured at the base.',
            detail: 'Toilet is not secured at the base.',
            criteria: 'Toilet is not secured at the base.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-TOILET-08'
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
            criteria: 'Effecting the restroom.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-01'
        },
        {
            id: 'restroom_vent_2',
            name: 'The exhaust system component is missing or damaged, affecting the function adequately.',
            detail: 'The exhaust system component is missing or damaged, affecting the function adequately.',
            criteria: 'Exhaust system component is damaged or missing (i.e., visibly defective; impacts functionality).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-02'
        },
        {
            id: 'restroom_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-03'
        },
        {
            id: 'restroom_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'RESTROOM-VENT-04'
        }
    ]
};

export const RESTROOM_DEFICIENCIES = {
    category: '26. Restroom',
    items: [RESTROOM_BATHTUB_SHOWER, RESTROOM_CABINET_STORAGE, RESTROOM_GRAB_BAR, RESTROOM_MOLD, RESTROOM_SINK, RESTROOM_TOILET, RESTROOM_VENTILATION]
};

// ==========================================
// 27. SINK (LAUNDRY, GARAGE, OR PATIO)
// ==========================================

export const SINK_LAUNDRY_CONTROL_KNOBS: UnitItemDeficiencies = {
    itemName: 'Control Knobs.',
    deficiencies: [
        {
            id: 'sink_laundry_1',
            name: 'Control Knobs.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-01'
        }
    ]
};

export const SINK_LAUNDRY_COMPONENT_MISSING: UnitItemDeficiencies = {
    itemName: 'Component is missing',
    deficiencies: [
        {
            id: 'sink_laundry_2',
            name: 'Component is missing',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-02'
        }
    ]
};

export const SINK_LAUNDRY_IMPROPERLY_INSTALLED: UnitItemDeficiencies = {
    itemName: 'Improperly installed.',
    deficiencies: [
        {
            id: 'sink_laundry_3',
            name: 'Improperly installed.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-03'
        }
    ]
};

export const SINK_LAUNDRY_SINK_MISSING: UnitItemDeficiencies = {
    itemName: 'Sink is missing.',
    deficiencies: [
        {
            id: 'sink_laundry_4',
            name: 'Sink is missing.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            criteria: 'not present or incomplete.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-04'
        }
    ]
};

export const SINK_LAUNDRY_NOT_DRAINING: UnitItemDeficiencies = {
    itemName: 'Sink not draining',
    deficiencies: [
        {
            id: 'sink_laundry_5',
            name: 'Sink not draining',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'SINK-LAUNDRY-05'
        }
    ]
};

export const SINK_LAUNDRY_COMPONENT_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Component is damaged',
    deficiencies: [
        {
            id: 'sink_laundry_6',
            name: 'Component is damaged',
            detail: 'The sink component is missing, damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'SINK-LAUNDRY-06'
        }
    ]
};

export const SINK_LAUNDRY_DEFICIENCIES = {
    category: '27. Sink (Laundry, Garage, or patio)',
    items: [SINK_LAUNDRY_CONTROL_KNOBS, SINK_LAUNDRY_COMPONENT_MISSING, SINK_LAUNDRY_IMPROPERLY_INSTALLED, SINK_LAUNDRY_SINK_MISSING, SINK_LAUNDRY_NOT_DRAINING, SINK_LAUNDRY_COMPONENT_DAMAGED]
};

// ==========================================
// 28. STEPS AND STAIRS
// ==========================================

export const STEPS_STRINGER_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Stringer is damaged',
    deficiencies: [
        {
            id: 'steps_1',
            name: 'Stringer is damaged',
            detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Instability is detected while walking on the stair.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'STEPS-01'
        }
    ]
};

export const STEPS_TREAD_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Tread on a set of stairs damaged',
    deficiencies: [
        {
            id: 'steps_2',
            name: 'Tread on a set of stairs damaged',
            detail: 'Tread on a set of stairs is missing i.e., a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide, is damaged or broken.',
            criteria: 'Secure accessory treads are not present.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'STEPS-02'
        }
    ]
};

export const STEPS_STAIRS_DEFICIENCIES = {
    category: '28. Steps and Stairs',
    items: [STEPS_STRINGER_DAMAGED, STEPS_TREAD_DAMAGED]
};

// ==========================================
// 29. STRUCTURAL SYSTEM
// ==========================================

export const STRUCTURAL_SYSTEM_UNIT: UnitItemDeficiencies = {
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
            code: 'STRUCTURAL-01'
        }
    ]
};

export const STRUCTURAL_DEFICIENCIES = {
    category: '29. Structural System',
    items: [STRUCTURAL_SYSTEM_UNIT]
};

// ==========================================
// 30. TRASH CHUTE
// ==========================================

export const TRASH_CHUTE_DOOR: UnitItemDeficiencies = {
    itemName: 'The chute door does not open, self-close, or latch.',
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
        }
    ]
};

export const TRASH_CHUTE_CLOGGED: UnitItemDeficiencies = {
    itemName: 'Chute is clogged',
    deficiencies: [
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

export const TRASH_CHUTE_DEFICIENCIES = {
    category: '30. Trash Chute',
    items: [TRASH_CHUTE_DOOR, TRASH_CHUTE_CLOGGED]
};

// ==========================================
// 31. VENTILATION
// ==========================================

export const VENTILATION_UNIT: UnitItemDeficiencies = {
    itemName: 'Ventilation (with or without a fan)',
    deficiencies: [
        {
            id: 'vent_1',
            name: 'It is not functioning adequately.',
            detail: 'Ventilation (with or without a fan)',
            criteria: 'Effecting the room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-01'
        },
        {
            id: 'vent_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged or missing.',
            criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-02'
        },
        {
            id: 'vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-03'
        },
        {
            id: 'vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'VENT-04'
        }
    ]
};

export const VENTILATION_DEFICIENCIES = {
    category: '31. Ventilation',
    items: [VENTILATION_UNIT]
};

// ==========================================
// 32. WALL
// ==========================================

export const WALL_INTERIOR_UNIT: UnitItemDeficiencies = {
    itemName: 'Wall-Interior',
    deficiencies: [
        {
            id: 'wall_1',
            name: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
            detail: 'Wall-Interior',
            criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-01'
        },
        {
            id: 'wall_2',
            name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            detail: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-02'
        },
        {
            id: 'wall_3',
            name: 'Interior wall has a loose or detached surface covering.',
            detail: 'Interior wall has a loose or detached surface covering.',
            criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WALL-03'
        }
    ]
};

export const WALL_DEFICIENCIES = {
    category: '32. Wall',
    items: [WALL_INTERIOR_UNIT]
};

// ==========================================
// 33. WATER HEATER
// ==========================================

export const WATER_HEATER_CHIMNEY_BLOCKED: UnitItemDeficiencies = {
    itemName: 'Chimney or flue piping is blocked, misaligned, or missing',
    deficiencies: [
        {
            id: 'water_heater_1',
            name: 'Chimney or flue piping is blocked, misaligned, or missing',
            detail: 'Chimney or flue piping is blocked, misaligned, or missing',
            criteria: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'WATER-HEATER-01'
        }
    ]
};

export const WATER_HEATER_GAS_VALVE: UnitItemDeficiencies = {
    itemName: 'Gas shutoff valve is damaged, missing or not installed',
    deficiencies: [
        {
            id: 'water_heater_2',
            name: 'Gas shutoff valve is damaged, missing or not installed',
            detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
            criteria: 'A gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '27.25/n',
            code: 'WATER-HEATER-02'
        }
    ]
};

export const WATER_HEATER_NO_HOT_WATER: UnitItemDeficiencies = {
    itemName: 'No hot water',
    deficiencies: [
        {
            id: 'water_heater_3',
            name: 'No hot water',
            detail: 'No hot water',
            criteria: 'Hot water does not dispense after handle is engaged.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WATER-HEATER-03'
        }
    ]
};

export const WATER_HEATER_TPRV: UnitItemDeficiencies = {
    itemName: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
    deficiencies: [
        {
            id: 'water_heater_4',
            name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
            detail: 'TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
            criteria: 'The Tprv valve is not functioning adequately.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WATER-HEATER-04'
        }
    ]
};

export const WATER_HEATER_RELIEF_VALVE: UnitItemDeficiencies = {
    itemName: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
    deficiencies: [
        {
            id: 'water_heater_5',
            name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
            detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
            criteria: 'Not properly installed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WATER-HEATER-05'
        }
    ]
};

export const WATER_HEATER_DEFICIENCIES = {
    category: '33. Water Heater',
    items: [WATER_HEATER_CHIMNEY_BLOCKED, WATER_HEATER_GAS_VALVE, WATER_HEATER_NO_HOT_WATER, WATER_HEATER_TPRV, WATER_HEATER_RELIEF_VALVE]
};

// ==========================================
// 34. WINDOW
// ==========================================

export const WINDOW_CANNOT_SECURE: UnitItemDeficiencies = {
    itemName: 'Window cannot be secured.',
    deficiencies: [
        {
            id: 'window_1',
            name: 'Window cannot be secured.',
            detail: 'Window cannot be secured.',
            criteria: 'Window cannot be secured (i.e., access controlled) by at least 1 installed lock.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WINDOW-01'
        }
    ]
};

export const WINDOW_COMPONENT_DAMAGED: UnitItemDeficiencies = {
    itemName: 'Window component is damaged or missing, and the window is not functionally adequate',
    deficiencies: [
        {
            id: 'window_2',
            name: 'Window component is damaged or missing, and the window is not functionally adequate',
            detail: 'The window component is missing (i.e., evidence of prior installation, but is now not present or is incomplete) or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater(i.e., can not protect from bugs, or debris).',
            criteria: 'Window is not functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WINDOW-02'
        }
    ]
};

export const WINDOW_WILL_NOT_CLOSE: UnitItemDeficiencies = {
    itemName: 'Window will not close.',
    deficiencies: [
        {
            id: 'window_3',
            name: 'Window will not close.',
            detail: 'The window does not close completely. OR At least one window lock is not present. OR The window can be opened once the lock is engaged.',
            criteria: 'Window lock does not keep the window closed.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WINDOW-03'
        }
    ]
};

export const WINDOW_WILL_NOT_OPEN: UnitItemDeficiencies = {
    itemName: 'Window will not open or stay open.',
    deficiencies: [
        {
            id: 'window_4',
            name: 'Window will not open or stay open.',
            detail: 'Window will not open or stay open.',
            criteria: 'Window will not open. Once opened, the window will not stay open without the use of a tool or item.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.0/n',
            code: 'WINDOW-04'
        }
    ]
};

export const WINDOW_COMPONENT_ADEQUATE: UnitItemDeficiencies = {
    itemName: 'Window component is damaged or missing, and the window is functionally adequate.',
    deficiencies: [
        {
            id: 'window_5',
            name: 'Window component is damaged or missing, and the window is functionally adequate.',
            detail: 'Window component is damaged or missing, and the window is functionally adequate.',
            criteria: 'Window component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the window is functionally adequate.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'WINDOW-05'
        }
    ]
};

export const WINDOW_GLAZING: UnitItemDeficiencies = {
    itemName: 'Window glazing.',
    deficiencies: [
        {
            id: 'window_6',
            name: 'Window glazing.',
            detail: 'Window glazing is cracked or broken.',
            criteria: 'Window glazing is cracked or broken such that it impacts the window\'s functionality or poses a safety hazard.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.20/n',
            code: 'WINDOW-06'
        }
    ]
};

export const WINDOW_MISSING: UnitItemDeficiencies = {
    itemName: 'Window is missing.',
    deficiencies: [
        {
            id: 'window_7',
            name: 'Window is missing.',
            detail: 'Window is missing.',
            criteria: 'Window is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.40/n',
            code: 'WINDOW-07'
        }
    ]
};

export const WINDOW_DEFICIENCIES = {
    category: '34. Window',
    items: [WINDOW_CANNOT_SECURE, WINDOW_COMPONENT_DAMAGED, WINDOW_WILL_NOT_CLOSE, WINDOW_WILL_NOT_OPEN, WINDOW_COMPONENT_ADEQUATE, WINDOW_GLAZING, WINDOW_MISSING]
};

// ==========================================
// 35. GENERAL COMMENT
// ==========================================

export const GENERAL_COMMENT_UNIT: UnitItemDeficiencies = {
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
    items: [GENERAL_COMMENT_UNIT]
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

// List of all Unit category names
export const UNIT_CATEGORIES = ALL_UNIT_CATEGORIES.map(cat => cat.category);

// Get all unit deficiencies as flat array
export const ALL_UNIT_DEFICIENCIES: UnitItemDeficiencies[] = ALL_UNIT_CATEGORIES.flatMap(cat => cat.items);

// Function to get deficiencies by category name
// IMPORTANT: Must match CATEGORY names properly, not just item names
// to avoid "Sink (Laundry)" matching Restroom > Sink
export const getUnitDeficienciesByCategory = (categoryName: string): UnitItemDeficiencies | null => {
    const normalizedName = categoryName.toLowerCase().trim().replace(/^\d+\.\s*/, '');

    // PASS 1: Exact category name match (without number prefix)
    for (const category of ALL_UNIT_CATEGORIES) {
        const catName = category.category.replace(/^\d+\.\s*/, '').toLowerCase();
        if (catName === normalizedName) {
            return category.items[0];
        }
    }

    // PASS 2: Category name starts with search term OR search term starts with category name
    for (const category of ALL_UNIT_CATEGORIES) {
        const catName = category.category.replace(/^\d+\.\s*/, '').toLowerCase();
        // Check if the first word matches
        const catFirstWord = catName.split(/[\s\-\(]/)[0];
        const searchFirstWord = normalizedName.split(/[\s\-\(]/)[0];
        
        // If first words match AND have similar length (to distinguish "Sink" from "Sink (Laundry...)")
        if (catFirstWord === searchFirstWord) {
            // For categories like "Sink (Laundry, Garage, or patio)" vs item "Sink"
            // Check if the search has parentheses or extra qualifiers
            const searchHasQualifier = normalizedName.includes('(') || normalizedName.includes(',');
            const catHasQualifier = catName.includes('(') || catName.includes(',');
            
            if (searchHasQualifier && catHasQualifier) {
                // Both have qualifiers, check if they match
                if (catName.includes(normalizedName) || normalizedName.includes(catName)) {
                    return category.items[0];
                }
            } else if (!searchHasQualifier && !catHasQualifier) {
                // Neither has qualifiers - exact first word match
                return category.items[0];
            }
        }
    }

    // PASS 3: Check if search matches a specific item name exactly
    for (const category of ALL_UNIT_CATEGORIES) {
        for (const item of category.items) {
            const itemNameLower = item.itemName.toLowerCase();
            if (itemNameLower === normalizedName) {
                return item;
            }
        }
    }

    // PASS 4: Looser category matching - contains
    for (const category of ALL_UNIT_CATEGORIES) {
        const catName = category.category.replace(/^\d+\.\s*/, '').toLowerCase();
        if (catName.includes(normalizedName) || normalizedName.includes(catName)) {
            return category.items[0];
        }
    }

    return null;
};

// Function to get all items for a specific category
export const getUnitItemsForCategory = (categoryName: string): UnitItemDeficiencies[] => {
    const normalizedName = categoryName.toLowerCase().trim();

    for (const category of ALL_UNIT_CATEGORIES) {
        if (category.category.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(category.category.toLowerCase())) {
            return category.items;
        }
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
    const normalizedSearch = searchName.toLowerCase().trim().replace(/^\d+\.\s*/, '');
    const catName = categoryFullName.replace(/^\d+\.\s*/, '').toLowerCase();
    
    // Exact match
    if (catName === normalizedSearch) return true;
    
    // Check if search starts with category name (e.g., "railings" matches "25. Railings")
    if (normalizedSearch.startsWith(catName.split(' ')[0])) return true;
    
    // Check if category starts with search term's first word
    const searchFirstWord = normalizedSearch.split(/[\s\-]/)[0];
    const catFirstWord = catName.split(/[\s\-]/)[0];
    if (searchFirstWord === catFirstWord && searchFirstWord.length > 3) return true;
    
    return false;
};

/**
 * Check if an Inside category has subcategories (items.length > 1)
 */
export const hasInsideSubcategories = (categoryName: string): boolean => {
    for (const category of ALL_UNIT_CATEGORIES) {
        if (matchInsideCategory(categoryName, category.category)) {
            return category.items.length > 1;
        }
    }
    
    return false;
};

/**
 * Get subcategory names for an Inside category
 */
export const getInsideCategorySubcategories = (categoryName: string): string[] => {
    for (const category of ALL_UNIT_CATEGORIES) {
        if (matchInsideCategory(categoryName, category.category)) {
            if (category.items.length > 1) {
                return category.items.map(item => item.itemName);
            }
        }
    }
    
    return [];
};

/**
 * Get deficiencies for a specific subcategory within an Inside category
 */
export const getInsideSubcategoryDeficiencies = (subcategoryName: string): UnitItemDeficiencies | null => {
    const normalizedName = subcategoryName.toLowerCase().trim();
    
    for (const category of ALL_UNIT_CATEGORIES) {
        for (const item of category.items) {
            const itemNameLower = item.itemName.toLowerCase();
            // Exact match first
            if (itemNameLower === normalizedName) return item;
            // Then check if item name starts with search or vice versa
            if (itemNameLower.startsWith(normalizedName) || normalizedName.startsWith(itemNameLower)) {
                return item;
            }
        }
    }
    
    return null;
};
