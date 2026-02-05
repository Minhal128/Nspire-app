// Unit Deficiency Mapping - NSPIRE Standards
// This file contains all deficiency mappings for UNIT inspections only
// DO NOT MODIFY - Exact mapping from NSPIRE Excel data

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
// 1. BATHROOM
// ==========================================

export const BATHROOM_BATHTUB_SHOWER: UnitItemDeficiencies = {
    itemName: 'Bathtub and Shower',
    deficiencies: [
        {
            id: 'bath_tub_1',
            name: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
            detail: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.',
            criteria: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-01'
        },
        {
            id: 'bath_tub_2',
            name: 'Bathtub or shower component is damaged, inoperable, or missing, and it may not limit the resident\'s ability to maintain personal hygiene.',
            detail: 'Component, inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface.',
            criteria: 'Component, inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-TUB-02'
        },
        {
            id: 'bath_tub_3',
            name: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
            detail: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface.',
            criteria: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-03'
        },
        {
            id: 'bath_tub_4',
            name: 'Bathtub or shower cannot be used in private.',
            detail: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.',
            criteria: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TUB-04'
        },
        {
            id: 'bath_tub_5',
            name: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
            detail: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.',
            criteria: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'BATH-TUB-05'
        }
    ]
};

export const BATHROOM_CABINET_STORAGE: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'bath_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Some of the bathroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            criteria: 'Some of the bathroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-CAB-01'
        }
    ]
};

export const BATHROOM_GRAB_BAR: UnitItemDeficiencies = {
    itemName: 'Grab Bar',
    deficiencies: [
        {
            id: 'bath_grab_1',
            name: 'Grab Bar is not secure.',
            detail: 'Any movement, whatsoever, is detected in the grab bar.',
            criteria: 'Any movement, whatsoever, is detected in the grab bar.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-GRAB-01'
        }
    ]
};

export const BATHROOM_MOLD: UnitItemDeficiencies = {
    itemName: 'MOLD-LIKE SUBSTANCE',
    deficiencies: [
        {
            id: 'bath_mold_1',
            name: 'Peeling Paint-Elevated moisture level.',
            detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-MOLD-01'
        },
        {
            id: 'bath_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 9 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'BATH-MOLD-02'
        },
        {
            id: 'bath_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'BATH-MOLD-03'
        },
        {
            id: 'bath_mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-MOLD-04'
        }
    ]
};

export const BATHROOM_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'bath_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-01'
        },
        {
            id: 'bath_sink_2',
            name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-02'
        },
        {
            id: 'bath_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-03'
        },
        {
            id: 'bath_sink_4',
            name: 'Sink is not draining.',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-SINK-04'
        },
        {
            id: 'bath_sink_5',
            name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-SINK-05'
        },
        {
            id: 'bath_sink_6',
            name: 'Water is directed outside of the basin.',
            detail: 'Confirm that water is directed into the basin and not outside when in use.',
            criteria: 'Confirm that water is directed into the basin and not outside when in use.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-SINK-06'
        }
    ]
};

export const BATHROOM_TOILET: UnitItemDeficiencies = {
    itemName: 'Toilet',
    deficiencies: [
        {
            id: 'bath_toilet_1',
            name: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
            detail: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit. Defect may be visible or affect overall usability.',
            criteria: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit. Defect may be visible or affect overall usability.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-01'
        },
        {
            id: 'bath_toilet_2',
            name: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
            detail: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete), and at least one toilet is installed elsewhere within the unit that is operational.',
            criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete), and at least one toilet is installed elsewhere within the unit that is operational.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-02'
        },
        {
            id: 'bath_toilet_3',
            name: 'Only one toilet was installed, and it is damaged or inoperable.',
            detail: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).',
            criteria: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'BATH-TOILET-03'
        },
        {
            id: 'bath_toilet_4',
            name: 'Only one toilet was installed, and it is missing.',
            detail: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.',
            criteria: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'BATH-TOILET-04'
        },
        {
            id: 'bath_toilet_5',
            name: 'Toilet cannot be used in private.',
            detail: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
            criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-05'
        },
        {
            id: 'bath_toilet_6',
            name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
            detail: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation.',
            criteria: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'BATH-TOILET-06'
        },
        {
            id: 'bath_toilet_7',
            name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
            detail: 'Toilet component is damaged or inoperable, potentially limiting safe waste discharge.',
            criteria: 'Toilet component is damaged or inoperable, potentially limiting safe waste discharge.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-07'
        },
        {
            id: 'bath_toilet_8',
            name: 'Toilet is not secured at the base.',
            detail: 'Toilet is not secured at the base.',
            criteria: 'Toilet is not secured at the base.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-TOILET-08'
        }
    ]
};

export const BATHROOM_VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation',
    deficiencies: [
        {
            id: 'bath_vent_1',
            name: 'The restroom does not have ventilation, not present and operable.',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-01'
        },
        {
            id: 'bath_vent_2',
            name: 'The exhaust system component is missing and damaged, affecting the function adequately.',
            detail: 'Exhaust system component is damaged OR Exhaust system component is missing.',
            criteria: 'Exhaust system component is damaged OR Exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-02'
        },
        {
            id: 'bath_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust vent inoperable.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-03'
        },
        {
            id: 'bath_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'BATH-VENT-04'
        }
    ]
};

// Bathroom category grouping
export const BATHROOM_DEFICIENCIES = {
    category: 'Bathroom',
    items: [
        BATHROOM_BATHTUB_SHOWER,
        BATHROOM_CABINET_STORAGE,
        BATHROOM_GRAB_BAR,
        BATHROOM_MOLD,
        BATHROOM_SINK,
        BATHROOM_TOILET,
        BATHROOM_VENTILATION
    ]
};

// ==========================================
// 2. CABINETS AND STORAGE (PANTRY/LAUNDRY)
// ==========================================

export const CABINETS_PANTRY_STORAGE: UnitItemDeficiencies = {
    itemName: 'Pantry, Food Storage Space Not Present',
    deficiencies: [
        {
            id: 'cab_pantry_1',
            name: 'Food storage space is not present.',
            detail: 'Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.',
            criteria: 'Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CAB-PANTRY-01'
        }
    ]
};

export const CABINETS_LAUNDRY_STORAGE: UnitItemDeficiencies = {
    itemName: 'Laundry Storage Component damaged, Inoperable, Missing',
    deficiencies: [
        {
            id: 'cab_laundry_1',
            name: '50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).',
            detail: '50% or more of cabinet doors, or 50% or more of drawers, or 50% or more of shelves are missing or damaged.',
            criteria: '50% or more of cabinet doors, or 50% or more of drawers, or 50% or more of shelves are missing or damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CAB-LAUNDRY-01'
        }
    ]
};

export const CABINETS_STORAGE_DEFICIENCIES = {
    category: 'Cabinets and Storage (Pantry/Laundry)',
    items: [
        CABINETS_PANTRY_STORAGE,
        CABINETS_LAUNDRY_STORAGE
    ]
};

// ==========================================
// 3. CALL-FOR-AID SYSTEM
// ==========================================

export const CALL_FOR_AID_SYSTEM: UnitItemDeficiencies = {
    itemName: 'Call-for-Aid System',
    deficiencies: [
        {
            id: 'call_aid_1',
            name: 'System does not function properly.',
            detail: 'A call-for-aid system does not emit sound or light or send signal to annunciator. The annunciator does not indicate the correct corresponding room.',
            criteria: 'A call-for-aid system does not emit sound or light or send signal to annunciator. The annunciator does not indicate the correct corresponding room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/50xn',
            code: 'CALL-AID-01'
        },
        {
            id: 'call_aid_2',
            name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
            detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor. The pull cord end is positioned more than 6 inches above the floor.',
            criteria: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor. The pull cord end is positioned more than 6 inches above the floor.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/50xn',
            code: 'CALL-AID-02'
        }
    ]
};

export const CALL_FOR_AID_DEFICIENCIES = {
    category: 'Call-for-Aid System',
    items: [CALL_FOR_AID_SYSTEM]
};

// ==========================================
// 4. CARBON MONOXIDE ALARM
// ==========================================

export const CARBON_MONOXIDE_ALARM: UnitItemDeficiencies = {
    itemName: 'Carbon Monoxide Alarm',
    deficiencies: [
        {
            id: 'co_alarm_1',
            name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
            detail: 'Carbon monoxide alarm is inoperable (dead batteries) or the alarm does not cease after testing. A required Carbon monoxide alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            criteria: 'Carbon monoxide alarm is inoperable (dead batteries) or the alarm does not cease after testing. A required Carbon monoxide alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-01'
        },
        {
            id: 'co_alarm_2',
            name: 'Carbon monoxide alarm is missing, not installed or not installed in the proper location.',
            detail: 'The location of the previous installation is not relevant. Unit/building contains a fuel-burning appliance or fuel-burning fireplace. Carbon monoxide alarm is missing. Units with fuel-burning appliances or fireplaces must have carbon monoxide alarms in required locations. Missing alarms near sleeping areas, bathrooms, remote furnaces, or garages makes the unit noncompliant.',
            criteria: 'Units with fuel-burning appliances or fireplaces must have carbon monoxide alarms in required locations. Missing alarms near sleeping areas, bathrooms, remote furnaces, or garages makes the unit noncompliant.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-02'
        },
        {
            id: 'co_alarm_3',
            name: 'Carbon monoxide alarm is obstructed.',
            detail: 'Carbon monoxide is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            criteria: 'Carbon monoxide is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'CO-ALARM-03'
        }
    ]
};

export const CARBON_MONOXIDE_DEFICIENCIES = {
    category: 'Carbon Monoxide Alarm',
    items: [CARBON_MONOXIDE_ALARM]
};

// ==========================================
// 5. CEILING
// ==========================================

export const CEILING_UNIT: UnitItemDeficiencies = {
    itemName: 'Ceiling',
    deficiencies: [
        {
            id: 'ceiling_1',
            name: 'The ceiling component(s) is not functionally adequate.',
            detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under structural deficiency. Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
            criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'CEILING-01'
        },
        {
            id: 'ceiling_2',
            name: 'Ceiling has a hole.',
            detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter. Opens directly to the outside light regardless of the size or the ceiling has a damaged opening >2".',
            criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening >2".',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CEILING-02'
        },
        {
            id: 'ceiling_3',
            name: 'The ceiling has an unstable surface (bulging, buckling).',
            detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws). Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category.',
            criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'CEILING-03'
        }
    ]
};

export const CEILING_DEFICIENCIES = {
    category: 'Ceiling',
    items: [CEILING_UNIT]
};

// ==========================================
// 6. CHIMNEY
// ==========================================

export const CHIMNEY_UNIT: UnitItemDeficiencies = {
    itemName: 'Chimney',
    deficiencies: [
        {
            id: 'chimney_1',
            name: 'Visually accessible and observable.',
            detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior. Contains a fuel-burning appliance or fuel-burning fireplace.',
            criteria: 'Contains a fuel-burning appliance or fuel-burning fireplace.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'CHIMNEY-01'
        }
    ]
};

export const CHIMNEY_DEFICIENCIES = {
    category: 'Chimney',
    items: [CHIMNEY_UNIT]
};

// ==========================================
// 7. CLOTHES DRYER EXHAUST VENTILATION
// ==========================================

export const CLOTHES_DRYER_EXHAUST: UnitItemDeficiencies = {
    itemName: 'Clothes Dryer Exhaust Ventilation',
    deficiencies: [
        {
            id: 'dryer_1',
            name: 'Dryer transition duct is constructed of unsuitable material.',
            detail: 'Dryer transition duct is not constructed of metal or an approved material. Dryer is being used indoor.',
            criteria: 'Dryer is being used indoor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-01'
        },
        {
            id: 'dryer_2',
            name: 'Electrical dryer exhaust ventilation has restricted airflow.',
            detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted. Airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'DRYER-02'
        },
        {
            id: 'dryer_3',
            name: 'Electric dryer transition duct is detached or missing.',
            detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete). Dryer transition duct is not securely attached.',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'DRYER-03'
        },
        {
            id: 'dryer_4',
            name: 'Gas dryer exhaust ventilation system has restricted airflow.',
            detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted. Airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'DRYER-04'
        },
        {
            id: 'dryer_5',
            name: 'Gas dryer transition duct is detached or missing.',
            detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation, but is now not present or is incomplete). The dryer transition duct is not securely attached.',
            criteria: 'The dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'DRYER-05'
        }
    ]
};

export const CLOTHES_DRYER_DEFICIENCIES = {
    category: 'Clothes Dryer Exhaust Ventilation',
    items: [CLOTHES_DRYER_EXHAUST]
};

// ==========================================
// 8. DOORS
// ==========================================

export const DOOR_ENTRY_UNIT: UnitItemDeficiencies = {
    itemName: 'Door - Entry',
    deficiencies: [
        {
            id: 'door_entry_1',
            name: 'Entry door cannot be secured adequately, missing, damaged hardware.',
            detail: 'Installed locks cannot be engaged from both sides.',
            criteria: 'Installed locks cannot be engaged from both sides.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'DOOR-ENTRY-01'
        },
        {
            id: 'door_entry_2',
            name: 'Entry door component is damaged, missing, inoperable.',
            detail: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or A hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or A hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'DOOR-ENTRY-02'
        },
        {
            id: 'door_entry_3',
            name: 'Entry door frame, threshold, or trim is damaged.',
            detail: 'Evidence of prior installation, now missing.',
            criteria: 'Evidence of prior installation, now missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-03'
        },
        {
            id: 'door_entry_4',
            name: 'Entry door is missing.',
            detail: 'Not present or is incomplete.',
            criteria: 'Not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'DOOR-ENTRY-04'
        },
        {
            id: 'door_entry_5',
            name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
            detail: 'Entry door seal is damaged, missing, or nonfunctional—causing a gap ≥¼ inch that lets in light or shows signs of water damage or dry rot.',
            criteria: 'Entry door seal is damaged, missing, or nonfunctional—causing a gap ≥¼ inch that lets in light or shows signs of water damage or dry rot.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-05'
        },
        {
            id: 'door_entry_6',
            name: 'Self-closing mechanism is damaged, inoperable or damaged.',
            detail: 'Self-closing mechanism is damaged, missing, or fails to close and latch the door properly.',
            criteria: 'Self-closing mechanism is damaged, missing, or fails to close and latch the door properly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-06'
        },
        {
            id: 'door_entry_7',
            name: 'Entry door surface is delaminated or separated.',
            detail: 'There is delamination or separation of the door surface 2 inches wide or greater. OR There is delamination or separation that affects the integrity of the door.',
            criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. OR There is delamination or separation that affects the integrity of the door.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-07'
        },
        {
            id: 'door_entry_8',
            name: 'Entry door will not close properly.',
            detail: 'Entry door does not close (i.e., door seats in frame).',
            criteria: 'Entry door does not close (i.e., door seats in frame).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-ENTRY-08'
        },
        {
            id: 'door_entry_9',
            name: 'Entry door will not open properly.',
            detail: 'Entry door does not open.',
            criteria: 'Entry door does not open.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-09'
        },
        {
            id: 'door_entry_10',
            name: 'Hole, split, or crack that penetrates completely through the entry door.',
            detail: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
            criteria: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-ENTRY-10'
        }
    ]
};

export const DOOR_FIRE_LABELED_UNIT: UnitItemDeficiencies = {
    itemName: 'Door – Fire Labeled',
    deficiencies: [
        {
            id: 'door_fire_1',
            name: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
            detail: 'An object blocks the fire-labeled door from closing or self-closing and latching properly.',
            criteria: 'An object blocks the fire-labeled door from closing or self-closing and latching properly.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-01'
        },
        {
            id: 'door_fire_2',
            name: 'A fire-labeled door assembly has a hole of any size.',
            detail: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
            criteria: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-02'
        },
        {
            id: 'door_fire_3',
            name: 'Fire-labeled door cannot be secured.',
            detail: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-03'
        },
        {
            id: 'door_fire_4',
            name: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
            detail: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
            criteria: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-04'
        },
        {
            id: 'door_fire_5',
            name: 'Fire-labeled door does not open.',
            detail: 'Fire labeled door does not open such that it may limit access between spaces.',
            criteria: 'Fire labeled door does not open such that it may limit access between spaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-05'
        },
        {
            id: 'door_fire_6',
            name: 'Fire-labeled door is missing.',
            detail: '(i.e., evidence of prior installation, but now not present or is incomplete.',
            criteria: '(i.e., evidence of prior installation, but now not present or is incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '14.8/n',
            code: 'DOOR-FIRE-06'
        },
        {
            id: 'door_fire_7',
            name: 'Fire-labeled door seal or gasket is damaged.',
            detail: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.',
            criteria: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'DOOR-FIRE-07'
        }
    ]
};

export const DOOR_GENERAL_UNIT: UnitItemDeficiencies = {
    itemName: 'Door - General',
    deficiencies: [
        {
            id: 'door_general_1',
            name: 'A passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
            detail: 'Whether visibly defective, nonfunctional, or incomplete—the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.',
            criteria: 'Whether visibly defective, nonfunctional, or incomplete—the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'DOOR-GEN-01'
        },
        {
            id: 'door_general_2',
            name: 'A passage door does not open.',
            detail: 'A passage door does not open such that it may limit access when needed.',
            criteria: 'A passage door does not open such that it may limit access when needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GEN-02'
        },
        {
            id: 'door_general_3',
            name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
            detail: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.',
            criteria: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GEN-03'
        }
    ]
};

export const DOOR_GARAGE_UNIT: UnitItemDeficiencies = {
    itemName: 'Garage Door',
    deficiencies: [
        {
            id: 'door_garage_1',
            name: 'Garage door does not open, close, or remain closed.',
            detail: 'Door will not open and remain open, does not function adequately.',
            criteria: 'Door will not open and remain open, does not function adequately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GARAGE-01'
        },
        {
            id: 'door_garage_2',
            name: 'Garage door has a hole.',
            detail: 'Garage door has a hole of any size that penetrates through to the interior.',
            criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DOOR-GARAGE-02'
        }
    ]
};

export const DOORS_DEFICIENCIES = {
    category: 'Doors',
    items: [
        DOOR_ENTRY_UNIT,
        DOOR_FIRE_LABELED_UNIT,
        DOOR_GENERAL_UNIT,
        DOOR_GARAGE_UNIT
    ]
};

// ==========================================
// 9. DRAINAGE (FLOOR DRAIN)
// ==========================================

export const DRAINAGE_UNIT: UnitItemDeficiencies = {
    itemName: 'Drain',
    deficiencies: [
        {
            id: 'drain_1',
            name: 'Drain is fully blocked.',
            detail: 'There is a problem with the drainage.',
            criteria: 'There is a problem with the drainage.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'DRAIN-01'
        }
    ]
};

export const DRAINAGE_DEFICIENCIES = {
    category: 'Drainage (floor drain)',
    items: [DRAINAGE_UNIT]
};

// ==========================================
// 10. EGRESS
// ==========================================

export const EGRESS_UNIT: UnitItemDeficiencies = {
    itemName: 'Egress (Exit Access)',
    deficiencies: [
        {
            id: 'egress_1',
            name: 'Fire escape access to exteriors - doors and windows.',
            detail: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.',
            criteria: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'EGRESS-01'
        },
        {
            id: 'egress_2',
            name: 'Obstructed means of egress. Interior, closets, bedroom, bathroom, hallway and corridors.',
            detail: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.',
            criteria: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'EGRESS-02'
        },
        {
            id: 'egress_3',
            name: 'Sleeping room is located on the 3rd floor or below and has an obstructed rescue opening.',
            detail: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.',
            criteria: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'EGRESS-03'
        }
    ]
};

export const EGRESS_DEFICIENCIES = {
    category: 'Egress',
    items: [EGRESS_UNIT]
};

// ==========================================
// 11. ELECTRICAL
// ==========================================

export const ELECTRICAL_CONDUCTOR_OUTLET_SWITCH: UnitItemDeficiencies = {
    itemName: 'Conductor-Outlet, and Switch',
    deficiencies: [
        {
            id: 'elec_cos_1',
            name: 'The electrical conductor is not enclosed or properly insulated.',
            detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
            criteria: 'Electrical conductors must be properly enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2". Missing light bulbs should be assessed under interior or exterior lighting.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COS-01'
        },
        {
            id: 'elec_cos_2',
            name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
            detail: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
            criteria: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COS-02'
        },
        {
            id: 'elec_cos_3',
            name: 'The outlet or switch is damaged.',
            detail: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
            criteria: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COS-03'
        },
        {
            id: 'elec_cos_4',
            name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
            detail: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
            criteria: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'ELEC-COS-04'
        },
        {
            id: 'elec_cos_5',
            name: 'Water is currently in contact with an electrical conductor.',
            detail: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-COS-05'
        }
    ]
};

export const ELECTRICAL_GFCI_AFCI: UnitItemDeficiencies = {
    itemName: 'Electrical-Ground Fault Circuit Interrupter(GFCI) Or Arc-Fault Circuit interrupter(AFCI)-Outlet or Breaker',
    deficiencies: [
        {
            id: 'elec_gfci_1',
            name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-AFCI-01'
        },
        {
            id: 'elec_gfci_2',
            name: 'An unprotected outlet is present within six feet of a water source.',
            detail: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet designed for major appliances, when in use, is not evaluated under this category.',
            criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet designed for major appliances, when in use, is not evaluated under this category.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-GFCI-02'
        },
        {
            id: 'elec_gfci_3',
            name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
            detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'ELEC-GFCI-03'
        }
    ]
};

export const ELECTRICAL_SERVICE_PANEL_UNIT: UnitItemDeficiencies = {
    itemName: 'Electrical Service Panel',
    deficiencies: [
        {
            id: 'elec_panel_1',
            name: 'Electrical service panel is not reasonably accessible.',
            detail: 'The electrical service panel is not reasonably accessible. Or it is locked or in locked location, no key to access.',
            criteria: 'The electrical service panel is not reasonably accessible. Or it is locked or in locked location, no key to access.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'ELEC-PANEL-01'
        },
        {
            id: 'elec_panel_2',
            name: 'The overcurrent protection device is contaminated.',
            detail: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-02'
        },
        {
            id: 'elec_panel_3',
            name: 'The overcurrent protection device is damaged.',
            detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an overcurrent condition.',
            criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an overcurrent condition.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'ELEC-PANEL-03'
        }
    ]
};

export const ELECTRICAL_MINIMUM_LIGHTING: UnitItemDeficiencies = {
    itemName: 'Minimum Electrical and Lighting',
    deficiencies: [
        {
            id: 'elec_min_1',
            name: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
            detail: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.',
            criteria: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'ELEC-MIN-01'
        }
    ]
};

export const ELECTRICAL_DEFICIENCIES = {
    category: 'Electrical',
    items: [
        ELECTRICAL_CONDUCTOR_OUTLET_SWITCH,
        ELECTRICAL_GFCI_AFCI,
        ELECTRICAL_SERVICE_PANEL_UNIT,
        ELECTRICAL_MINIMUM_LIGHTING
    ]
};

// ==========================================
// 12. FIRE SAFETY
// ==========================================

export const FIRE_EXTINGUISHER_UNIT: UnitItemDeficiencies = {
    itemName: 'Fire Extinguisher',
    deficiencies: [
        {
            id: 'fire_ext_1',
            name: 'A fire extinguisher is damaged or missing.',
            detail: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or Fire extinguisher is missing.',
            criteria: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or Fire extinguisher is missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'FIRE-EXT-01'
        },
        {
            id: 'fire_ext_2',
            name: 'The fire extinguisher pressure gauge reads over or undercharged.',
            detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            criteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'FIRE-EXT-02'
        },
        {
            id: 'fire_ext_3',
            name: 'The fire extinguisher tag is missing or illegible or expired.',
            detail: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.',
            criteria: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'FIRE-EXT-03'
        }
    ]
};

export const FLAMMABLE_COMBUSTIBLE_UNIT: UnitItemDeficiencies = {
    itemName: 'Flammable and Combustible Item',
    deficiencies: [
        {
            id: 'flam_1',
            name: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or a fuel-burning water heater. Or an improperly stored chemical.',
            detail: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
            criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'FLAM-01'
        }
    ]
};

export const SMOKE_ALARM_UNIT: UnitItemDeficiencies = {
    itemName: 'Smoke Alarm',
    deficiencies: [
        {
            id: 'smoke_1',
            name: 'Smoke alarm does not produce an audio or visual alarm when tested.',
            detail: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-01'
        },
        {
            id: 'smoke_2',
            name: 'Smoke alarm not installed where required.',
            detail: 'Smoke alarm not installed inside each bedroom and Smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.',
            criteria: 'Smoke alarm not installed inside each bedroom and Smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-02'
        },
        {
            id: 'smoke_3',
            name: 'Smoke alarm is obstructed.',
            detail: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-03'
        },
        {
            id: 'smoke_4',
            name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
            detail: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '0.000',
            code: 'SMOKE-04'
        }
    ]
};

export const SPRINKLER_ASSEMBLY_UNIT: UnitItemDeficiencies = {
    itemName: 'Sprinkler Assembly',
    deficiencies: [
        {
            id: 'sprinkler_1',
            name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
            detail: 'The sprinkler assembly component is damaged, inoperable, or missing.',
            criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'SPRINKLER-01'
        },
        {
            id: 'sprinkler_2',
            name: 'Sprinkler head assembly has evidence of corrosion.',
            detail: 'Sprinkler head assembly has evidence of corrosion.',
            criteria: 'Sprinkler head assembly has evidence of corrosion.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'SPRINKLER-02'
        },
        {
            id: 'sprinkler_3',
            name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
            detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'SPRINKLER-03'
        },
        {
            id: 'sprinkler_4',
            name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
            detail: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).',
            criteria: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'SPRINKLER-04'
        }
    ]
};

export const FIRE_SAFETY_DEFICIENCIES = {
    category: 'Fire Safety',
    items: [
        FIRE_EXTINGUISHER_UNIT,
        FLAMMABLE_COMBUSTIBLE_UNIT,
        SMOKE_ALARM_UNIT,
        SPRINKLER_ASSEMBLY_UNIT
    ]
};

// ==========================================
// 13. FLOOR
// ==========================================

export const FLOOR_UNIT: UnitItemDeficiencies = {
    itemName: 'Floor',
    deficiencies: [
        {
            id: 'floor_1',
            name: 'Floor component(s) is not functionally adequate.',
            detail: 'Floor component(s) are not functionally adequate (i.e., do not allow the floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping, deflection). Surface abnormalities may indicate the presence of deficiency (i.e. lifting tiles, hardwood cupping, linoleum bubbling, etc.).',
            criteria: 'Surface abnormalities may indicate the presence of deficiency (i.e. lifting tiles, hardwood cupping, linoleum bubbling, etc.).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FLOOR-01'
        },
        {
            id: 'floor_2',
            name: 'Floor substrate is exposed.',
            detail: '10% or more of the floor substrate area is exposed in any room. Repair is needed.',
            criteria: 'Repair is needed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FLOOR-02'
        }
    ]
};

export const FLOOR_DEFICIENCIES = {
    category: 'Floor',
    items: [FLOOR_UNIT]
};

// ==========================================
// 14. FOUNDATION
// ==========================================

export const FOUNDATION_UNIT: UnitItemDeficiencies = {
    itemName: 'Foundation',
    deficiencies: [
        {
            id: 'foundation_1',
            name: 'Foundation exposed rebar or Foundation is spalling, flaking, or chipping.',
            detail: 'The structure has any exposed rebar. OR Foundation is spalling, flaking, or chipping and the affected area is 12x12 inches or greater and goes into the foundation at a depth of ¾ inch or greater. Foundation exhibits a sign of serious failure.',
            criteria: 'Foundation exhibits a sign of serious failure.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUNDATION-01'
        },
        {
            id: 'foundation_2',
            name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
            detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater. Foundation exhibits a sign of failure, and it is not structural.',
            criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUNDATION-02'
        },
        {
            id: 'foundation_3',
            name: 'Foundation is cracked.',
            detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater. Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
            criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUNDATION-03'
        },
        {
            id: 'foundation_4',
            name: 'Foundation infiltrated by water.',
            detail: 'Evidence of water infiltration through the foundation. (e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUNDATION-04'
        },
        {
            id: 'foundation_5',
            name: 'Foundation support post, column, or girder area is damaged.',
            detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality). Foundation damage (e.g., rot) on support posts, columns, or girders.',
            criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'FOUNDATION-05'
        }
    ]
};

export const FOUNDATION_DEFICIENCIES = {
    category: 'Foundation',
    items: [FOUNDATION_UNIT]
};

// ==========================================
// 15. HAZARD
// ==========================================

export const HAZARD_INFESTATION: UnitItemDeficiencies = {
    itemName: 'Infestation',
    deficiencies: [
        {
            id: 'hazard_inf_1',
            name: 'Evidence of bedbugs.',
            detail: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-INF-01'
        },
        {
            id: 'hazard_inf_2',
            name: 'Evidence of cockroaches (any sign).',
            detail: 'Evidence of cockroaches is found, (i.e. of dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            criteria: 'Evidence of cockroaches is found, (i.e. of dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-INF-02'
        },
        {
            id: 'hazard_inf_3',
            name: 'Evidence of mice (any sign).',
            detail: 'Evidence of mice is found (i.e. a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            criteria: 'Evidence of mice is found (i.e. a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-INF-03'
        },
        {
            id: 'hazard_inf_4',
            name: 'Evidence of other pests.',
            detail: 'Evidence of interior pest infestations—such as ants, wasps, squirrels, birds, or bats—may pose health and safety risks to residents.',
            criteria: 'Evidence of interior pest infestations—such as ants, wasps, squirrels, birds, or bats—may pose health and safety risks to residents.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-INF-04'
        },
        {
            id: 'hazard_inf_5',
            name: 'Evidence of rats (any sign).',
            detail: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
            criteria: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-INF-05'
        },
        {
            id: 'hazard_inf_6',
            name: 'Extensive bedbugs infestation.',
            detail: 'Sighting of at least one live bedbug in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            criteria: 'Sighting of at least one live bedbug in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZARD-INF-06'
        },
        {
            id: 'hazard_inf_7',
            name: 'Extensive cockroach infestation (live).',
            detail: 'Sighting of one or more live cockroaches in two or more unit area observed simultaneously during visual assessment on the inspection day.',
            criteria: 'Sighting of one or more live cockroaches in two or more unit area observed simultaneously during visual assessment on the inspection day.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZARD-INF-07'
        },
        {
            id: 'hazard_inf_8',
            name: 'Extensive mouse infestation.',
            detail: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
            criteria: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZARD-INF-08'
        },
        {
            id: 'hazard_inf_9',
            name: 'Extensive rat infestation.',
            detail: 'A live rat is seen in the unit.',
            criteria: 'A live rat is seen in the unit.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HAZARD-INF-09'
        }
    ]
};

export const HAZARD_SHARP_EDGES: UnitItemDeficiencies = {
    itemName: 'Sharp edges',
    deficiencies: [
        {
            id: 'hazard_sharp_1',
            name: 'A sharp edge that can result in a cut or puncture hazard is present in the interior area.',
            detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities). Including, but not limited to, broken glass and damaged tile with exposed edges.',
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
            detail: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch or a horizontal separation ≥2 inches across the path of travel.',
            criteria: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch or a horizontal separation ≥2 inches across the path of travel.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HAZARD-TRIP-01'
        }
    ]
};

export const HAZARD_DEFICIENCIES = {
    category: 'Hazard',
    items: [
        HAZARD_INFESTATION,
        HAZARD_SHARP_EDGES,
        HAZARD_TRIP
    ]
};

// ==========================================
// 16. HEATING, VENTILATION, AND AIR CONDITIONING (HVAC)
// ==========================================

export const HVAC_UNIT: UnitItemDeficiencies = {
    itemName: 'Heating, Ventilation, and Air Conditioning',
    deficiencies: [
        {
            id: 'hvac_1',
            name: 'Air conditioning system or device is not operational.',
            detail: 'System or device does not turn on. OR System or device only produces hot or room temperature air. (e.g., a window unit or central air system).',
            criteria: '(e.g., a window unit or central air system).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HVAC-01'
        },
        {
            id: 'hvac_2',
            name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance.',
            detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance. Combustion chamber cover or gas shutoff valve was previously installed but is now either not present or incomplete.',
            criteria: 'Combustion chamber cover or gas shutoff valve was previously installed but is now either not present or incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'HVAC-02'
        },
        {
            id: 'hvac_3',
            name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected or improperly connected, damaged or missing.',
            detail: 'Fuel-burning heating system is present, and the exhaust vent is misaligned, blocked, disconnected, or damaged—posing safety risks. Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
            criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'HVAC-03'
        },
        {
            id: 'hvac_4',
            name: 'Heating system or device safety shield is damaged or missing.',
            detail: 'Heating system or device safety shield is damaged or missing. Safety shield was previously installed and is now not present or is incomplete.',
            criteria: 'Safety shield was previously installed and is now not present or is incomplete.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'HVAC-04'
        },
        {
            id: 'hvac_5',
            name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
            detail: 'A permanently installed heating source is damaged Or is inoperable. Or is missing. Or not installed. A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed wall unit.',
            criteria: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed wall unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'HVAC-05'
        },
        {
            id: 'hvac_6',
            name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            detail: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed wall unit. The permanently installed heating or heating source is not working. Or Temperature is below 64 degrees Fahrenheit.',
            criteria: 'The permanently installed heating or heating source is not working. Or Temperature is below 64 degrees Fahrenheit.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'HVAC-06'
        },
        {
            id: 'hvac_7',
            name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is 64 to 67.9 degrees Fahrenheit.',
            detail: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed wall unit. The permanently installed heating or heating source is working. However the temperature is 64 to 67.9 degrees Fahrenheit.',
            criteria: 'The permanently installed heating or heating source is working. However the temperature is 64 to 67.9 degrees Fahrenheit.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '13.8/n',
            code: 'HVAC-07'
        },
        {
            id: 'hvac_8',
            name: 'Unvented space heater is present.',
            detail: 'Unvented space heater that burns gas, oil, or kerosene is present. Inside, include any and all common areas.',
            criteria: 'Inside, include any and all common areas.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'HVAC-08'
        }
    ]
};

export const HVAC_DEFICIENCIES = {
    category: 'Heating, Ventilation, and Air Conditioning',
    items: [HVAC_UNIT]
};

// ==========================================
// 17. KITCHEN
// ==========================================

export const KITCHEN_CABINET_STORAGE: UnitItemDeficiencies = {
    itemName: 'Cabinet and Storage',
    deficiencies: [
        {
            id: 'kitchen_cab_1',
            name: 'Storage component is damaged, inoperable, or missing.',
            detail: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-CAB-01'
        }
    ]
};

export const KITCHEN_COOKING_APPLIANCE: UnitItemDeficiencies = {
    itemName: 'Cooking Appliance',
    deficiencies: [
        {
            id: 'kitchen_cook_1',
            name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-COOK-01'
        },
        {
            id: 'kitchen_cook_2',
            name: 'Microwave is the primary cooking appliance, and it is damaged.',
            detail: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KITCHEN-COOK-02'
        },
        {
            id: 'kitchen_cook_3',
            name: 'A control knob is missing, or the oven, cooktop component is damaged or missing, making the device unsafe for use, including the oven door seal.',
            detail: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
            criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-COOK-03'
        },
        {
            id: 'kitchen_cook_4',
            name: 'Cooktop or oven does not ignite or produce heat.',
            detail: 'No burner on the cooking range or cooktop produces heat. Or The oven does not produce heat temperature.',
            criteria: 'No burner on the cooking range or cooktop produces heat. Or The oven does not produce heat temperature.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KITCHEN-COOK-04'
        },
        {
            id: 'kitchen_cook_5',
            name: 'The primary cooking appliance is missing.',
            detail: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KITCHEN-COOK-05'
        }
    ]
};

export const KITCHEN_FOOD_PREP_AREA: UnitItemDeficiencies = {
    itemName: 'Food preparation Area',
    deficiencies: [
        {
            id: 'kitchen_food_1',
            name: 'The food preparation area (countertop) is damaged or not functionally adequate.',
            detail: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-FOOD-01'
        },
        {
            id: 'kitchen_food_2',
            name: 'The food preparation area, countertop is not present.',
            detail: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
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
            detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-MOLD-01'
        },
        {
            id: 'kitchen_mold_2',
            name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'KITCHEN-MOLD-02'
        },
        {
            id: 'kitchen_mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'KITCHEN-MOLD-03'
        },
        {
            id: 'kitchen_mold_4',
            name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
            detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
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
            detail: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
            criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-FRIDGE-01'
        },
        {
            id: 'kitchen_fridge_2',
            name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
            detail: 'Does not cool adequately for the safe storage of food.',
            criteria: 'Does not cool adequately for the safe storage of food.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-FRIDGE-02'
        },
        {
            id: 'kitchen_fridge_3',
            name: 'Refrigerator is missing.',
            detail: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
            criteria: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-FRIDGE-03'
        }
    ]
};

export const KITCHEN_SINK: UnitItemDeficiencies = {
    itemName: 'Sink',
    deficiencies: [
        {
            id: 'kitchen_sink_1',
            name: 'Hot and cold water cannot be activated or deactivated.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-SINK-01'
        },
        {
            id: 'kitchen_sink_2',
            name: 'The sink garbage disposal or other component is damaged or missing, and the sink is not functionally adequate.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-SINK-02'
        },
        {
            id: 'kitchen_sink_3',
            name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-SINK-03'
        },
        {
            id: 'kitchen_sink_4',
            name: 'Sink is missing or not installed within the primary kitchen.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            criteria: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-SINK-04'
        },
        {
            id: 'kitchen_sink_5',
            name: 'The sink is not draining, not functioning adequately.',
            detail: 'Water is not draining from the basin of the sink. Slow or clogged drain.',
            criteria: 'Water is not draining from the basin of the sink. Slow or clogged drain.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-SINK-05'
        },
        {
            id: 'kitchen_sink_6',
            name: 'The dishwasher or other Sink component is damaged or missing, and the sink is functionally adequate.',
            detail: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'KITCHEN-SINK-06'
        },
        {
            id: 'kitchen_sink_7',
            name: 'Water is directed outside of the basin.',
            detail: 'When in use, water is directed outside of the basin.',
            criteria: 'When in use, water is directed outside of the basin.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'KITCHEN-SINK-07'
        }
    ]
};

export const KITCHEN_VENTILATION: UnitItemDeficiencies = {
    itemName: 'Ventilation',
    deficiencies: [
        {
            id: 'kitchen_vent_1',
            name: 'The kitchen does not have ventilation, not present and operable.',
            detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-VENT-01'
        },
        {
            id: 'kitchen_vent_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged. Or exhaust system component is missing.',
            criteria: 'Exhaust system component is damaged. Or exhaust system component is missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-VENT-02'
        },
        {
            id: 'kitchen_vent_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust vent inoperable.',
            criteria: 'Exhaust vent inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-VENT-03'
        },
        {
            id: 'kitchen_vent_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'KITCHEN-VENT-04'
        }
    ]
};

export const KITCHEN_DEFICIENCIES = {
    category: 'Kitchen',
    items: [
        KITCHEN_CABINET_STORAGE,
        KITCHEN_COOKING_APPLIANCE,
        KITCHEN_FOOD_PREP_AREA,
        KITCHEN_MOLD,
        KITCHEN_REFRIGERATOR,
        KITCHEN_SINK,
        KITCHEN_VENTILATION
    ]
};
// ==========================================
// 18. LEAK – GAS OR OIL
// ==========================================

export const LEAK_GAS_OIL_UNIT: UnitItemDeficiencies = {
    itemName: 'Leak – Gas or Oil',
    deficiencies: [
        {
            id: 'leak_gas_1',
            name: 'Natural gas, propane, or oil leak.',
            detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line. Natural gas, propane, or oil leak. Strong odor.',
            criteria: 'Natural gas, propane, or oil leak. Strong odor.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'LEAK-GAS-01'
        }
    ]
};

export const LEAK_GAS_OIL_DEFICIENCIES = {
    category: 'LEAK – Gas or Oil',
    items: [LEAK_GAS_OIL_UNIT]
};

// ==========================================
// 19. LEAK – SEWAGE SYSTEM
// ==========================================

export const LEAK_SEWAGE_UNIT: UnitItemDeficiencies = {
    itemName: 'Leak-Sewage System (Clogged drain)(Missing drain cap)',
    deficiencies: [
        {
            id: 'leak_sew_1',
            name: 'Blocked sewage system.',
            detail: 'Wastewater is unable to drain resulting in sewer backup. Blocked sewage system.',
            criteria: 'Blocked sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'LEAK-SEW-01'
        },
        {
            id: 'leak_sew_2',
            name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
            detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete). Cap to the cleanout or pump cover is detached or missing.',
            criteria: 'Cap to the cleanout or pump cover is detached or missing.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-SEW-02'
        },
        {
            id: 'leak_sew_3',
            name: 'Cleanout cap or riser is damaged.',
            detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality). Protective cap or riser is damaged.',
            criteria: 'Protective cap or riser is damaged.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-SEW-03'
        },
        {
            id: 'leak_sew_4',
            name: 'Leak in sewage system.',
            detail: 'There is evidence of a sewer line or fitting leaking. Leak in sewage system.',
            criteria: 'Leak in sewage system.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'LEAK-SEW-04'
        }
    ]
};

export const LEAK_SEWAGE_DEFICIENCIES = {
    category: 'Leak-Sewage System',
    items: [LEAK_SEWAGE_UNIT]
};

// ==========================================
// 20. LEAK – WATER (PLUMBING LEAK)
// ==========================================

export const LEAK_WATER_UNIT: UnitItemDeficiencies = {
    itemName: 'Leak- Water (plumbing leak)',
    deficiencies: [
        {
            id: 'leak_water_1',
            name: 'Environmental water intrusion.',
            detail: 'Water from the exterior environment is leaking into the interior. Environmental water intrusion.',
            criteria: 'Environmental water intrusion.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-01'
        },
        {
            id: 'leak_water_2',
            name: 'Fluid is leaking from the sprinkler assembly.',
            detail: 'Fluid is leaking from the sprinkler assembly.',
            criteria: 'Fluid is leaking from the sprinkler assembly.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-02'
        },
        {
            id: 'leak_water_3',
            name: 'Plumbing leak.',
            detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas. Plumbing leak.',
            criteria: 'Plumbing leak.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LEAK-WATER-03'
        }
    ]
};

export const LEAK_WATER_DEFICIENCIES = {
    category: 'Leak- Water',
    items: [LEAK_WATER_UNIT]
};

// ==========================================
// 21. LIGHTING
// ==========================================

export const LIGHTING_INTERIOR_UNIT: UnitItemDeficiencies = {
    itemName: 'Lighting - Interior',
    deficiencies: [
        {
            id: 'light_int_1',
            name: 'A permanently installed light fixture is inoperable.',
            detail: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-01'
        },
        {
            id: 'light_int_2',
            name: 'A permanently installed light fixture is not secure.',
            detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-02'
        },
        {
            id: 'light_int_3',
            name: 'At least one (1) permanently installed light fixture is not present in the kitchen or bathroom.',
            detail: 'At least one (1) permanently installed light fixture is not present in the kitchen and bathroom.',
            criteria: 'At least one (1) permanently installed light fixture is not present in the kitchen and bathroom.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-INT-03'
        }
    ]
};

export const LIGHTING_MINIMUM_UNIT: UnitItemDeficiencies = {
    itemName: 'Minimum Electrical and Lighting',
    deficiencies: [
        {
            id: 'light_min_1',
            name: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
            detail: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
            criteria: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'LIGHT-MIN-01'
        }
    ]
};

export const LIGHTING_DEFICIENCIES = {
    category: 'Lighting',
    items: [
        LIGHTING_INTERIOR_UNIT,
        LIGHTING_MINIMUM_UNIT
    ]
};

// ==========================================
// 22. MOLD
// ==========================================

export const MOLD_UNIT: UnitItemDeficiencies = {
    itemName: 'Mold - Like Substance',
    deficiencies: [
        {
            id: 'mold_1',
            name: 'Peeling paint -elevated moisture level.',
            detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'MOLD-01'
        },
        {
            id: 'mold_2',
            name: 'More than 9\'SF- presence of mold-like substance at extremely high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'MOLD-02'
        },
        {
            id: 'mold_3',
            name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
            detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'MOLD-03'
        },
        {
            id: 'mold_4',
            name: '4" or less-- presence of mold-like substance at moderate level observed visually.',
            detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'MOLD-04'
        }
    ]
};

export const MOLD_DEFICIENCIES = {
    category: 'Mold',
    items: [MOLD_UNIT]
};

// ==========================================
// 23. PAINT - POTENTIAL LEAD-BASED PAINT HAZARDS
// ==========================================

export const PAINT_LEAD_UNIT: UnitItemDeficiencies = {
    itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
    deficiencies: [
        {
            id: 'paint_1',
            name: 'Less than 2\'SF -paint in a unit or inside the target property is deteriorated – below the level required for lead - safe work practices by a lead certified firm or for passing clearance.',
            detail: 'Paint is deteriorated for large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis"). Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'PAINT-01'
        },
        {
            id: 'paint_2',
            name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
            detail: 'Paint is deteriorated. For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant"). More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'PAINT-02'
        }
    ]
};

export const PAINT_DEFICIENCIES = {
    category: 'Paint - Potential Lead-Based Paint Hazards',
    items: [PAINT_LEAD_UNIT]
};

// ==========================================
// 24. RAILINGS
// ==========================================

export const RAILINGS_GUARDRAIL: UnitItemDeficiencies = {
    itemName: 'Guardrail',
    deficiencies: [
        {
            id: 'rail_guard_1',
            name: 'The guardrail is missing or not installed. Does limit the safe use.',
            detail: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            criteria: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'RAIL-GUARD-01'
        },
        {
            id: 'rail_guard_2',
            name: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
            detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '30/n',
            code: 'RAIL-GUARD-02'
        }
    ]
};

export const RAILINGS_HANDRAIL: UnitItemDeficiencies = {
    itemName: 'Handrail',
    deficiencies: [
        {
            id: 'rail_hand_1',
            name: 'Handrail is not functionally adequate.',
            detail: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches',
            criteria: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RAIL-HAND-01'
        },
        {
            id: 'rail_hand_2',
            name: 'Handrail is not functionally adequate.',
            detail: 'Handrail is not functionally adequate. Or Handrail is not continuous for the full length of each flight of stairs. Or Handrail is not between 28 inches and 42 inches in height.',
            criteria: 'Handrail is not functionally adequate. Or Handrail is not continuous for the full length of each flight of stairs. Or Handrail is not between 28 inches and 42 inches in height.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RAIL-HAND-02'
        },
        {
            id: 'rail_hand_3',
            name: 'Handrail is not installed where required.',
            detail: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            criteria: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.4/n',
            code: 'RAIL-HAND-03'
        },
        {
            id: 'rail_hand_4',
            name: 'Handrail is not secured.',
            detail: 'There is movement in the anchors of the handrail.',
            criteria: 'There is movement in the anchors of the handrail.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'RAIL-HAND-04'
        }
    ]
};

export const RAILINGS_DEFICIENCIES = {
    category: 'Railings',
    items: [
        RAILINGS_GUARDRAIL,
        RAILINGS_HANDRAIL
    ]
};

// ==========================================
// 25. SINK (LAUNDRY, GARAGE, OR PATIO)
// ==========================================

export const SINK_LAUNDRY_UNIT: UnitItemDeficiencies = {
    itemName: 'Sink (Laundry, Garage, or patio)',
    deficiencies: [
        {
            id: 'sink_laundry_1',
            name: 'Control Knobs.',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-01'
        },
        {
            id: 'sink_laundry_2',
            name: 'Component is missing.',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-02'
        },
        {
            id: 'sink_laundry_3',
            name: 'Improperly installed.',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall. Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-03'
        },
        {
            id: 'sink_laundry_4',
            name: 'Sink is missing.',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen. Not present or incomplete.',
            criteria: 'Not present or incomplete.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-04'
        },
        {
            id: 'sink_laundry_5',
            name: 'Sink not draining.',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'SINK-LAUNDRY-05'
        },
        {
            id: 'sink_laundry_6',
            name: 'Component is damaged.',
            detail: 'The sink component is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate. Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'SINK-LAUNDRY-06'
        },
        {
            id: 'sink_laundry_7',
            name: 'Water pressure, direction.',
            detail: 'Water pressure, direction is not adequately functional. The sink\'s faucet water pressure and direction are not functional or adequate.',
            criteria: 'The sink\'s faucet water pressure and direction are not functional or adequate.',
            severity: 'Low',
            repairBy: '60 Day',
            points: '2.40/n',
            code: 'SINK-LAUNDRY-07'
        }
    ]
};

export const SINK_LAUNDRY_DEFICIENCIES = {
    category: 'Sink (Laundry, Garage, or patio)',
    items: [SINK_LAUNDRY_UNIT]
};

// ==========================================
// 26. STEPS AND STAIRS
// ==========================================

export const STEPS_STAIRS_UNIT: UnitItemDeficiencies = {
    itemName: 'Steps and Stairs',
    deficiencies: [
        {
            id: 'steps_1',
            name: 'Stringer is damaged.',
            detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality). Instability is detected while walking on the stair.',
            criteria: 'Instability is detected while walking on the stair.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'STEPS-01'
        },
        {
            id: 'steps_2',
            name: 'Tread on a set of stairs damaged.',
            detail: 'Tread on a set of stairs is missing (i.e., evidence or A portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken. Secure accessory treads are not present.',
            criteria: 'Secure accessory treads are not present.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'STEPS-02'
        }
    ]
};

export const STEPS_STAIRS_DEFICIENCIES = {
    category: 'Steps and Stairs',
    items: [STEPS_STAIRS_UNIT]
};

// ==========================================
// 27. STRUCTURAL SYSTEM
// ==========================================

export const STRUCTURAL_SYSTEM_UNIT: UnitItemDeficiencies = {
    itemName: 'Structural System',
    deficiencies: [
        {
            id: 'structural_1',
            name: 'Structural system exhibits signs of serious failure.',
            detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety. Major Structural damage that affects resident\'s safety.',
            criteria: 'Major Structural damage that affects resident\'s safety.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '.1/n',
            code: 'STRUCTURAL-01'
        }
    ]
};

export const STRUCTURAL_DEFICIENCIES = {
    category: 'Structural System',
    items: [STRUCTURAL_SYSTEM_UNIT]
};

// ==========================================
// 28. VENTILATION (OTHER)
// ==========================================

export const VENTILATION_OTHER_UNIT: UnitItemDeficiencies = {
    itemName: 'Ventilation (with or without a fan)',
    deficiencies: [
        {
            id: 'vent_other_1',
            name: 'It is not functioning adequately.',
            detail: 'Affecting the unit.',
            criteria: 'Affecting the unit.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-OTHER-01'
        },
        {
            id: 'vent_other_2',
            name: 'Exhaust system component is damaged or missing.',
            detail: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-OTHER-02'
        },
        {
            id: 'vent_other_3',
            name: 'Exhaust system does not respond to the control switch.',
            detail: 'Exhaust fan, inoperable.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-OTHER-03'
        },
        {
            id: 'vent_other_4',
            name: 'Exhaust system has restricted air flow.',
            detail: 'Exhaust system is blocked such that airflow may be restricted.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'VENT-OTHER-04'
        }
    ]
};

export const VENTILATION_OTHER_DEFICIENCIES = {
    category: 'Ventilation (other)',
    items: [VENTILATION_OTHER_UNIT]
};

// ==========================================
// 29. WALL
// ==========================================

export const WALL_INTERIOR_UNIT: UnitItemDeficiencies = {
    itemName: 'Wall-Interior',
    deficiencies: [
        {
            id: 'wall_int_1',
            name: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
            detail: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-INT-01'
        },
        {
            id: 'wall_int_2',
            name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            detail: 'The wall is damaged, and repairs still need to be completed appropriately.',
            criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-INT-02'
        },
        {
            id: 'wall_int_3',
            name: 'Interior wall has a loose or detached surface covering.',
            detail: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WALL-INT-03'
        }
    ]
};

export const WALL_DEFICIENCIES = {
    category: 'Wall',
    items: [WALL_INTERIOR_UNIT]
};

// ==========================================
// 30. WATER HEATER
// ==========================================

export const WATER_HEATER_UNIT: UnitItemDeficiencies = {
    itemName: 'Water Heater',
    deficiencies: [
        {
            id: 'water_heater_1',
            name: 'Chimney or flue piping is blocked, misaligned, or missing.',
            detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete). The vent is damaged/misaligned/not connected properly.',
            criteria: 'The vent is damaged/misaligned/not connected properly.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'WATER-HEATER-01'
        },
        {
            id: 'water_heater_2',
            name: 'Gas shutoff valve is damaged, missing or not installed.',
            detail: 'Gas shutoff valve is damaged; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed. Unable to shutoff gas in case of an emergency.',
            criteria: 'Unable to shutoff gas in case of an emergency.',
            severity: 'Life-Threatening',
            repairBy: '24Hrs',
            points: '60/n',
            code: 'WATER-HEATER-02'
        },
        {
            id: 'water_heater_3',
            name: 'No hot water.',
            detail: 'Hot water does not dispense after handle is engaged. No hot water after several minutes.',
            criteria: 'No hot water after several minutes.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WATER-HEATER-03'
        },
        {
            id: 'water_heater_4',
            name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
            detail: 'The TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged, capped, has an upward slope, or is constructed of unsuitable material. The TPRV valve is not functioning adequately.',
            criteria: 'The TPRV valve is not functioning adequately.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WATER-HEATER-04'
        },
        {
            id: 'water_heater_5',
            name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
            detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). Or the relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor. Not properly installed.',
            criteria: 'Not properly installed.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WATER-HEATER-05'
        }
    ]
};

export const WATER_HEATER_DEFICIENCIES = {
    category: 'Water Heater',
    items: [WATER_HEATER_UNIT]
};

// ==========================================
// 31. WINDOW
// ==========================================

export const WINDOW_UNIT: UnitItemDeficiencies = {
    itemName: 'Window',
    deficiencies: [
        {
            id: 'window_1',
            name: 'Window cannot be secured.',
            detail: 'Window cannot be secured (i.e., access controlled) by at least one installed lock. Only one lock is present, and it is damaged or inoperable.',
            criteria: 'Only one lock is present, and it is damaged or inoperable.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-01'
        },
        {
            id: 'window_2',
            name: 'Window component is damaged or missing, and the window is not functionally adequate.',
            detail: 'The window component is missing or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater. Window is not functionally adequate.',
            criteria: 'Window is not functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-02'
        },
        {
            id: 'window_3',
            name: 'Window will not close.',
            detail: 'The window does not close completely, or at least one window lock is not present. Or The window can be opened once the lock is engaged. Window lock does not keep the window closed.',
            criteria: 'Window lock does not keep the window closed.',
            severity: 'Severe',
            repairBy: '24 Hrs.',
            points: '14.8/n',
            code: 'WINDOW-03'
        },
        {
            id: 'window_4',
            name: 'Window will not open or stay open.',
            detail: 'Window will not open. OR Once opened, window will not stay open without the use of a tool or item. Will not stay open without the use of a tool or item.',
            criteria: 'Will not stay open without the use of a tool or item.',
            severity: 'Moderate',
            repairBy: '30 Day',
            points: '5.5/n',
            code: 'WINDOW-04'
        }
    ]
};

export const WINDOW_DEFICIENCIES = {
    category: 'Window',
    items: [WINDOW_UNIT]
};

// ==========================================
// 32. GENERAL COMMENT
// ==========================================

export const GENERAL_COMMENT_UNIT: UnitItemDeficiencies = {
    itemName: 'General comment',
    deficiencies: [
        {
            id: 'general_1',
            name: 'Housekeeping / no access / resident refusal',
            detail: 'General observation or note regarding housekeeping conditions, inability to access certain areas, or resident refusal to allow inspection.',
            criteria: 'General observation or note regarding housekeeping conditions, inability to access certain areas, or resident refusal to allow inspection.',
            severity: 'Low',
            repairBy: 'N/A',
            points: '0',
            code: 'GENERAL-01'
        }
    ]
};

export const GENERAL_COMMENT_DEFICIENCIES = {
    category: 'General comment',
    items: [GENERAL_COMMENT_UNIT]
};

// ==========================================
// ALL UNIT CATEGORIES
// ==========================================

export const ALL_UNIT_CATEGORIES = [
    BATHROOM_DEFICIENCIES,
    CABINETS_STORAGE_DEFICIENCIES,
    CALL_FOR_AID_DEFICIENCIES,
    CARBON_MONOXIDE_DEFICIENCIES,
    CEILING_DEFICIENCIES,
    CHIMNEY_DEFICIENCIES,
    CLOTHES_DRYER_DEFICIENCIES,
    DOORS_DEFICIENCIES,
    DRAINAGE_DEFICIENCIES,
    EGRESS_DEFICIENCIES,
    ELECTRICAL_DEFICIENCIES,
    FIRE_SAFETY_DEFICIENCIES,
    FLOOR_DEFICIENCIES,
    FOUNDATION_DEFICIENCIES,
    HAZARD_DEFICIENCIES,
    HVAC_DEFICIENCIES,
    KITCHEN_DEFICIENCIES,
    LEAK_GAS_OIL_DEFICIENCIES,
    LEAK_SEWAGE_DEFICIENCIES,
    LEAK_WATER_DEFICIENCIES,
    LIGHTING_DEFICIENCIES,
    MOLD_DEFICIENCIES,
    PAINT_DEFICIENCIES,
    RAILINGS_DEFICIENCIES,
    SINK_LAUNDRY_DEFICIENCIES,
    STEPS_STAIRS_DEFICIENCIES,
    STRUCTURAL_DEFICIENCIES,
    VENTILATION_OTHER_DEFICIENCIES,
    WALL_DEFICIENCIES,
    WATER_HEATER_DEFICIENCIES,
    WINDOW_DEFICIENCIES,
    GENERAL_COMMENT_DEFICIENCIES
];

// List of all Unit category names
export const UNIT_CATEGORIES = ALL_UNIT_CATEGORIES.map(cat => cat.category);

// Get all unit deficiencies as flat array
export const ALL_UNIT_DEFICIENCIES: UnitItemDeficiencies[] = ALL_UNIT_CATEGORIES.flatMap(cat => cat.items);

// Function to get deficiencies by category name
export const getUnitDeficienciesByCategory = (categoryName: string): UnitItemDeficiencies | null => {
    const normalizedName = categoryName.toLowerCase().trim();

    for (const category of ALL_UNIT_CATEGORIES) {
        for (const item of category.items) {
            if (item.itemName.toLowerCase().includes(normalizedName) ||
                normalizedName.includes(item.itemName.toLowerCase())) {
                return item;
            }
        }
        // Also check category name
        if (category.category.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(category.category.toLowerCase())) {
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