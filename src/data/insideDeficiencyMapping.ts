// Comprehensive NSPIRE Deficiency Mapping for All 32 INSIDE Categories

export interface InsideDeficiencyOption {
    id: string;
    name: string;
    detail: string;
    criteria: string;
    severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
    repairBy: string;
}

export interface InsideItemDeficiencies {
    itemName: string;
    subcategories?: {
        name: string;
        deficiencies: InsideDeficiencyOption[];
    }[];
    deficiencies?: InsideDeficiencyOption[];
}

// 1. Bathroom
export const BATHROOM_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '1. Bathroom',
    subcategories: [
        {
            name: 'Bathtub and Shower',
            deficiencies: [
                {
                    id: 'bath_tub_1',
                    name: 'Bathtub or shower is inoperable or does not drain',
                    detail: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
                    criteria: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_tub_2',
                    name: 'Bathtub or shower component damaged (functionally adequate)',
                    detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may not limit the resident\'s ability to maintain personal hygiene.',
                    criteria: 'Component, inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface.',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'bath_tub_3',
                    name: 'Bathtub or shower component damaged (limits hygiene)',
                    detail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    criteria: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_tub_4',
                    name: 'Bathtub or shower cannot be used in private',
                    detail: 'Bathtub or shower cannot be used in private.',
                    criteria: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_tub_5',
                    name: 'Only one bathtub/shower present and inoperable',
                    detail: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
                    criteria: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Cabinet and Storage',
            deficiencies: [
                {
                    id: 'bath_cab_1',
                    name: 'Storage component is damaged, inoperable, or missing',
                    detail: 'Storage component is damaged, inoperable, or missing.',
                    criteria: 'Some of the bathroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
                    severity: 'Low',
                    repairBy: '60 Days'
                }
            ]
        },
        {
            name: 'Grab Bar',
            deficiencies: [
                {
                    id: 'bath_grab_1',
                    name: 'Grab Bar is not secure',
                    detail: 'Grab Bar is not secure.',
                    criteria: 'Any movement, whatsoever, is detected in the grab bar.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Mold-Like Substance',
            deficiencies: [
                {
                    id: 'bath_mold_1',
                    name: 'Peeling Paint - Elevated moisture level',
                    detail: 'Peeling Paint - Elevated moisture level.',
                    criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_mold_2',
                    name: 'More than 9 SF - Mold-like substance at extremely high levels',
                    detail: 'More than 9 SF - Presence of mold-like substance at extremely high levels is observed visually.',
                    criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_mold_3',
                    name: '1 to 9 SF - Mold-like substance at high levels',
                    detail: '1 to 9 SF - Presence of mold-like substance at high levels is observed visually.',
                    criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_mold_4',
                    name: '4 inches or less - Mold-like substance at moderate level',
                    detail: '4 inches or less - Presence of mold-like substance at moderate level observed visually.',
                    criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
                    severity: 'Low',
                    repairBy: '60 Days'
                }
            ]
        },
        {
            name: 'Sink',
            deficiencies: [
                {
                    id: 'bath_sink_1',
                    name: 'Hot and cold water cannot be activated or deactivated',
                    detail: 'Hot and cold water cannot be activated or deactivated.',
                    criteria: 'Control knobs do not activate or deactivate hot and cold water.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_sink_2',
                    name: 'Sink component damaged/missing - not functionally adequate',
                    detail: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
                    criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_sink_3',
                    name: 'Sink is improperly installed',
                    detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
                    criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_sink_4',
                    name: 'Sink is not draining',
                    detail: 'Sink is not draining.',
                    criteria: 'Water is not draining from the basin of the sink.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_sink_5',
                    name: 'Sink component damaged/missing - functionally adequate',
                    detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
                    criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'bath_sink_6',
                    name: 'Water is directed outside of the basin',
                    detail: 'Water is directed outside of the basin.',
                    criteria: 'Confirm that water is directed into the basin and not outside when in use.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Toilet',
            deficiencies: [
                {
                    id: 'bath_toilet_1',
                    name: 'Toilet damaged/inoperable - another toilet exists',
                    detail: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
                    criteria: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit. Defect may be visible or affect overall usability.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_toilet_2',
                    name: 'Toilet missing - another toilet exists',
                    detail: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
                    criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete), and at least one toilet is installed elsewhere within the unit that is operational.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_toilet_3',
                    name: 'Only one toilet installed and damaged/inoperable',
                    detail: 'Only one toilet was installed, and it is damaged or inoperable.',
                    criteria: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_toilet_4',
                    name: 'Only one toilet installed and missing',
                    detail: 'Only one toilet was installed, and it is missing.',
                    criteria: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_toilet_5',
                    name: 'Toilet cannot be used in private',
                    detail: 'Toilet cannot be used in private.',
                    criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_toilet_6',
                    name: 'Toilet component damaged - does not limit waste discharge',
                    detail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
                    criteria: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation.',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'bath_toilet_7',
                    name: 'Toilet component damaged - limits safe waste discharge',
                    detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
                    criteria: 'Toilet component is damaged or inoperable, potentially limiting safe waste discharge.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'bath_toilet_8',
                    name: 'Toilet is not secured at the base',
                    detail: 'Toilet is not secured at the base.',
                    criteria: 'Toilet is not secured at the base.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Ventilation',
            deficiencies: [
                {
                    id: 'bath_vent_1',
                    name: 'Restroom does not have ventilation',
                    detail: 'The restroom does not have ventilation, not present and operable.',
                    criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_vent_2',
                    name: 'Exhaust system component missing/damaged',
                    detail: 'The exhaust system component is missing and damaged, affecting the function adequately.',
                    criteria: 'Exhaust system component is damaged OR exhaust system component is missing.',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'bath_vent_3',
                    name: 'Exhaust system does not respond to control switch',
                    detail: 'Exhaust system does not respond to the control switch.',
                    criteria: 'Exhaust vent inoperable.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'bath_vent_4',
                    name: 'Exhaust system has restricted air flow',
                    detail: 'Exhaust system has restricted air flow.',
                    criteria: 'Exhaust system is blocked such that airflow may be restricted.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 2. Cabinets and Storage (Pantry/Laundry)
export const CABINETS_STORAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '2. Cabinets and Storage (Pantry/Laundry)',
    deficiencies: [
        {
            id: 'cab_1',
            name: 'Pantry, Food Storage Space Not Present',
            detail: 'Food storage space is not present.',
            criteria: 'Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'cab_2',
            name: 'Laundry Storage Component damaged, Inoperable, Missing',
            detail: '50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).',
            criteria: '50% or more of cabinet doors, or 50% or more of drawers, or 50% or more of shelves are missing or damaged.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 3. Call-for-Aid System
export const CALL_FOR_AID_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '3. Call-for-Aid System',
    deficiencies: [
        {
            id: 'cfa_1',
            name: 'System does not function properly',
            detail: 'A call-for-aid system does not emit sound or light or send signal to annunciator.',
            criteria: 'The annunciator does not indicate the correct corresponding room.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'cfa_2',
            name: 'System is blocked or pull cord too high',
            detail: 'Call-for-aid system is blocked OR the pull cord end is higher than 6 inches off the floor.',
            criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 4. Carbon Monoxide Alarm
export const CARBON_MONOXIDE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '4. Carbon Monoxide Alarm',
    deficiencies: [
        {
            id: 'co_1',
            name: 'CO alarm does not produce audio or visual alarm when tested',
            detail: 'Carbon monoxide alarm is inoperable (dead batteries) or the alarm does not cease after testing.',
            criteria: 'A required carbon monoxide alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'co_2',
            name: 'CO alarm is missing or not installed properly',
            detail: 'The location of the previous installation is not relevant. Unit/building contains a fuel-burning appliance or fuel-burning fireplace. Carbon monoxide alarm is missing.',
            criteria: 'Units with fuel-burning appliances or fireplaces must have carbon monoxide alarms in required locations. Missing alarms near sleeping areas, bathrooms, remote furnaces, or garages makes the unit noncompliant.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'co_3',
            name: 'CO alarm is obstructed',
            detail: 'Carbon monoxide alarm is obstructed.',
            criteria: 'Carbon monoxide is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
            severity: 'Severe',
            repairBy: '24 Hours'
        }
    ]
};

// 5. Ceiling
export const CEILING_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '5. Ceiling',
    deficiencies: [
        {
            id: 'ceil_1',
            name: 'Ceiling component is not functionally adequate',
            detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under structural deficiency.',
            criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'ceil_2',
            name: 'Ceiling has a hole',
            detail: 'Hole is present that opens directly to the outside environment OR hole is present that is 2 inches or greater in diameter.',
            criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening > 2".',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'ceil_3',
            name: 'Ceiling has an unstable surface (bulging, buckling)',
            detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
            criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 6. Chimney
export const CHIMNEY_INSIDE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '6. Chimney',
    deficiencies: [
        {
            id: 'chim_in_1',
            name: 'Chimney/flue/firebox incomplete or damaged',
            detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
            criteria: 'Contains a fuel-burning appliance or fuel-burning fireplace.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 7. Clothes Dryer Exhaust Ventilation
export const DRYER_VENT_INSIDE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '7. Clothes Dryer Exhaust Ventilation',
    deficiencies: [
        {
            id: 'dryer_in_1',
            name: 'Dryer transition duct unsuitable material',
            detail: 'Dryer transition duct is not constructed of metal or an approved material.',
            criteria: 'Dryer is being used indoor.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'dryer_in_2',
            name: 'Electrical dryer exhaust has restricted airflow',
            detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'dryer_in_3',
            name: 'Electric dryer transition duct detached/missing',
            detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
            criteria: 'Dryer transition duct is not securely attached.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'dryer_in_4',
            name: 'Gas dryer exhaust has restricted airflow',
            detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
            criteria: 'Airflow may be restricted.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'dryer_in_5',
            name: 'Gas dryer transition duct detached/missing',
            detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
            criteria: 'The dryer transition duct is not securely attached.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 8. Doors
export const DOORS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '8. Doors',
    subcategories: [
        {
            name: 'Door - Entry',
            deficiencies: [
                {
                    id: 'door_entry_1',
                    name: 'Entry door cannot be secured adequately',
                    detail: 'Entry door cannot be secured adequately, missing, damaged hardware.',
                    criteria: 'Installed locks cannot be engaged from both sides.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_entry_2',
                    name: 'Entry door component damaged/missing/inoperable',
                    detail: 'Entry door component is damaged, missing, inoperable.',
                    criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_entry_3',
                    name: 'Entry door frame/threshold/trim damaged',
                    detail: 'Entry door frame, threshold, or trim is damaged.',
                    criteria: 'Evidence of prior installation, now missing.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_entry_4',
                    name: 'Entry door is missing',
                    detail: 'Entry door is missing.',
                    criteria: 'Not present or is incomplete.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_entry_5',
                    name: 'Entry door seal/gasket/stripping damaged',
                    detail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
                    criteria: 'Entry door seal is damaged, missing, or nonfunctional—causing a gap ≥¼ inch that lets in light or shows signs of water damage or dry rot.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_entry_6',
                    name: 'Self-closing mechanism damaged/inoperable',
                    detail: 'Self-closing mechanism is damaged, inoperable or damaged.',
                    criteria: 'Self-closing mechanism is damaged, missing, or fails to close and latch the door properly.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_entry_7',
                    name: 'Entry door surface delaminated/separated',
                    detail: 'Entry door surface is delaminated or separated.',
                    criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. OR there is delamination or separation that affects the integrity of the door.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_entry_8',
                    name: 'Entry door will not close properly',
                    detail: 'Entry door will not close properly.',
                    criteria: 'Entry door does not close (i.e., door seats in frame).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_entry_9',
                    name: 'Entry door will not open properly',
                    detail: 'Entry door will not open properly.',
                    criteria: 'Entry door does not open.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_entry_10',
                    name: 'Hole/split/crack penetrates through entry door',
                    detail: 'Hole, split, or crack that penetrates completely through the entry door.',
                    criteria: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Door - Fire Labeled',
            deficiencies: [
                {
                    id: 'door_fire_1',
                    name: 'Object prevents fire door from closing/latching',
                    detail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
                    criteria: 'An object blocks the fire-labeled door from closing or self-closing and latching properly.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_2',
                    name: 'Fire-labeled door has a hole of any size',
                    detail: 'A fire-labeled door assembly has a hole of any size.',
                    criteria: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_3',
                    name: 'Fire-labeled door cannot be secured',
                    detail: 'Fire-labeled door cannot be secured.',
                    criteria: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_4',
                    name: 'Fire-labeled door does not close and latch',
                    detail: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
                    criteria: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_5',
                    name: 'Fire-labeled door does not open',
                    detail: 'Fire-labeled door does not open.',
                    criteria: 'Fire labeled door does not open such that it may limit access between spaces.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_6',
                    name: 'Fire-labeled door is missing',
                    detail: 'Fire-labeled door is missing.',
                    criteria: '(i.e., evidence of prior installation, but now not present or is incomplete.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_fire_7',
                    name: 'Fire-labeled door seal/gasket damaged',
                    detail: 'Fire-labeled door seal or gasket is damaged.',
                    criteria: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Door - General',
            deficiencies: [
                {
                    id: 'door_gen_1',
                    name: 'Passage door component damaged - not functionally adequate',
                    detail: 'A passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
                    criteria: 'Whether visibly defective, nonfunctional, or incomplete—the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_gen_2',
                    name: 'Passage door does not open',
                    detail: 'A passage door does not open.',
                    criteria: 'A passage door does not open such that it may limit access when needed.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'door_gen_3',
                    name: 'Passage door not intended for access has damaged component',
                    detail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
                    criteria: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.',
                    severity: 'Low',
                    repairBy: '60 Days'
                }
            ]
        },
        {
            name: 'Garage Door',
            deficiencies: [
                {
                    id: 'door_garage_1',
                    name: 'Garage door does not open/close/remain closed',
                    detail: 'Garage door does not open, close, or remain closed.',
                    criteria: 'Door will not open and remain open, does not function adequately.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'door_garage_2',
                    name: 'Garage door has a hole',
                    detail: 'Garage door has a hole.',
                    criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 9. Drainage (floor drain)
export const DRAINAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '9. Drainage (floor drain)',
    deficiencies: [
        {
            id: 'drain_1',
            name: 'Drain is fully blocked',
            detail: 'Drain is fully blocked.',
            criteria: 'There is a problem with the drainage.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 10. Egress
export const EGRESS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '10. Egress',
    deficiencies: [
        {
            id: 'egress_1',
            name: 'Fire escape access - doors and windows',
            detail: 'Fire escape access to exteriors - doors and windows.',
            criteria: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'egress_2',
            name: 'Obstructed means of egress',
            detail: 'Obstructed means of egress. Interior, closets, bedroom, bathroom, hallway and corridors.',
            criteria: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'egress_3',
            name: 'Sleeping room with obstructed rescue opening',
            detail: 'Sleeping room is located on the 3rd floor or below and has an obstructed rescue opening.',
            criteria: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 11. Electrical
export const ELECTRICAL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '11. Electrical',
    subcategories: [
        {
            name: 'Conductor - Outlet and Switch',
            deficiencies: [
                {
                    id: 'elec_cond_1',
                    name: 'Electrical conductor not enclosed/insulated properly',
                    detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR an opening or gap is present and measures greater than 1/2".',
                    criteria: 'Electrical conductors must be properly enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2". Missing light bulbs should be assessed under interior or exterior lighting.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_cond_2',
                    name: 'Outlet not energized (no visible damage)',
                    detail: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
                    criteria: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'elec_cond_3',
                    name: 'Outlet or switch is damaged',
                    detail: 'The outlet or switch is damaged.',
                    criteria: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_cond_4',
                    name: 'Three-pronged outlet not wired correctly/grounded',
                    detail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
                    criteria: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_cond_5',
                    name: 'Water in contact with electrical conductor',
                    detail: 'Water is currently in contact with an electrical conductor.',
                    criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'GFCI/AFCI - Outlet or Breaker',
            deficiencies: [
                {
                    id: 'elec_gfci_1',
                    name: 'AFCI outlet/breaker test/reset button inoperable',
                    detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
                    criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_gfci_2',
                    name: 'Unprotected outlet within 6 feet of water source',
                    detail: 'An unprotected outlet is present within six feet of a water source.',
                    criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet designed for major appliances, when in use, is not evaluated under this category.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_gfci_3',
                    name: 'GFCI outlet/breaker test/reset button inoperable',
                    detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
                    criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Electrical Service Panel',
            deficiencies: [
                {
                    id: 'elec_panel_1',
                    name: 'Electrical service panel not accessible',
                    detail: 'Electrical service panel is not reasonably accessible.',
                    criteria: 'The electrical service panel is not reasonably accessible. Or it is locked or in locked location, no key to access.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'elec_panel_2',
                    name: 'Overcurrent protection device contaminated',
                    detail: 'The overcurrent protection device is contaminated.',
                    criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'elec_panel_3',
                    name: 'Overcurrent protection device damaged',
                    detail: 'The overcurrent protection device is damaged.',
                    criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an overcurrent condition.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Minimum Electrical and Lighting',
            deficiencies: [
                {
                    id: 'elec_min_1',
                    name: 'Insufficient outlets or light fixtures in habitable room',
                    detail: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
                    criteria: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 12. Fire Safety
export const FIRE_SAFETY_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '12. Fire Safety',
    subcategories: [
        {
            name: 'Fire Extinguisher',
            deficiencies: [
                {
                    id: 'fire_ext_1',
                    name: 'Fire extinguisher damaged or missing',
                    detail: 'A fire extinguisher is damaged or missing.',
                    criteria: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or fire extinguisher is missing.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_ext_2',
                    name: 'Fire extinguisher over/undercharged',
                    detail: 'The fire extinguisher pressure gauge reads over or undercharged.',
                    criteria: 'Pressure gauge indicates that the fire extinguisher is over or undercharged.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_ext_3',
                    name: 'Fire extinguisher tag missing/illegible/expired',
                    detail: 'The fire extinguisher tag is missing or illegible or expired.',
                    criteria: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Flammable and Combustible Item',
            deficiencies: [
                {
                    id: 'fire_flam_1',
                    name: 'Flammable material near heat appliance',
                    detail: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or a fuel-burning water heater. Or an improperly stored chemical.',
                    criteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Smoke Alarm',
            deficiencies: [
                {
                    id: 'fire_smoke_1',
                    name: 'Smoke alarm does not produce alarm when tested',
                    detail: 'Smoke alarm does not produce an audio or visual alarm when tested.',
                    criteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_smoke_2',
                    name: 'Smoke alarm not installed where required',
                    detail: 'Smoke alarm not installed where required.',
                    criteria: 'Smoke alarm not installed inside each bedroom and smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_smoke_3',
                    name: 'Smoke alarm is obstructed',
                    detail: 'Smoke alarm is obstructed.',
                    criteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_smoke_4',
                    name: 'Smoke alarm not hardwired or 10-year battery',
                    detail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
                    criteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Sprinkler Assembly',
            deficiencies: [
                {
                    id: 'fire_sprink_1',
                    name: 'Sprinkler assembly component damaged/inoperable/missing',
                    detail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
                    criteria: 'The sprinkler assembly component is damaged, inoperable, or missing.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_sprink_2',
                    name: 'Sprinkler head has evidence of corrosion',
                    detail: 'Sprinkler head assembly has evidence of corrosion.',
                    criteria: 'Sprinkler head assembly has evidence of corrosion.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_sprink_3',
                    name: 'Sprinkler has debris/paint/foreign material',
                    detail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
                    criteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'fire_sprink_4',
                    name: 'Sprinkler head obstructed within 18 inches',
                    detail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
                    criteria: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        }
    ]
};

// 13. Floor
export const FLOOR_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '13. Floor',
    deficiencies: [
        {
            id: 'floor_1',
            name: 'Floor component not functionally adequate',
            detail: 'Floor component(s) is not functionally adequate (i.e., do not allow the floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping, deflection).',
            criteria: 'Surface abnormalities may indicate the presence of deficiency (i.e., lifting tiles, hardwood cupping, linoleum bubbling, etc.).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'floor_2',
            name: 'Floor substrate is exposed',
            detail: '10% or more of the floor substrate area is exposed in any room.',
            criteria: 'Repair is needed.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 14. Foundation
export const FOUNDATION_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '14. Foundation',
    deficiencies: [
        {
            id: 'found_1',
            name: 'Foundation exposed rebar or spalling (serious)',
            detail: 'The structure has any exposed rebar. OR foundation is spalling, flaking, or chipping and the affected area is 12x12 inches or greater and goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of serious failure.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'found_2',
            name: 'Foundation spalling/flaking/chipping (not structural)',
            detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
            criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'found_3',
            name: 'Foundation is cracked',
            detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
            criteria: 'Foundation cracks (e.g., cracks in walls, non-functioning doors, unlevel floors, or windows).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'found_4',
            name: 'Foundation infiltrated by water',
            detail: 'Evidence of water infiltration through the foundation.',
            criteria: '(e.g., excessive dampness, collected water, stains, or mineral deposits).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'found_5',
            name: 'Foundation support post/column/girder damaged',
            detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
            severity: 'Severe',
            repairBy: '24 Hours'
        }
    ]
};

// 15. Hazard
export const HAZARD_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '15. Hazard',
    subcategories: [
        {
            name: 'Infestation',
            deficiencies: [
                {
                    id: 'haz_inf_1',
                    name: 'Evidence of bedbugs',
                    detail: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
                    criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'haz_inf_2',
                    name: 'Evidence of cockroaches',
                    detail: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
                    criteria: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'haz_inf_3',
                    name: 'Evidence of mice',
                    detail: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
                    criteria: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'haz_inf_4',
                    name: 'Evidence of other pests',
                    detail: 'Evidence of other pests.',
                    criteria: 'Evidence of interior pest infestations—such as ants, wasps, squirrels, birds, or bats—may pose health and safety risks to residents.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'haz_inf_5',
                    name: 'Evidence of rats',
                    detail: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
                    criteria: 'Evidence of rats is found, i.e., a live or dead rat, droppings, or chewed holes.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'haz_inf_6',
                    name: 'Extensive bedbug infestation',
                    detail: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime surface visual assessment.',
                    criteria: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime surface visual assessment.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'haz_inf_7',
                    name: 'Extensive cockroach infestation',
                    detail: 'Sighting of one or more live cockroaches in two or more unit areas observed simultaneously during visual assessment on the inspection day.',
                    criteria: 'Sighting of one or more live cockroaches in two or more unit areas observed simultaneously during visual assessment on the inspection day.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'haz_inf_8',
                    name: 'Extensive mouse infestation',
                    detail: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
                    criteria: 'Sighting of at least one live mouse in two or more units or two rooms of the same unit during the daytime through surface visual assessment.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'haz_inf_9',
                    name: 'Extensive rat infestation',
                    detail: 'A live rat is seen in the unit.',
                    criteria: 'A live rat is seen in the unit.',
                    severity: 'Life-Threatening',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Sharp Edges',
            deficiencies: [
                {
                    id: 'haz_sharp_1',
                    name: 'Sharp edge present (cut/puncture hazard)',
                    detail: 'A sharp edge that can result in a cut or puncture hazard is present in the interior area, including, but not limited to, broken glass and damaged tile with exposed edges.',
                    criteria: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Trip Hazard',
            deficiencies: [
                {
                    id: 'haz_trip_1',
                    name: 'Trip hazard on walking surface',
                    detail: 'Trip hazard on walking surface.',
                    criteria: 'Walking surfaces have an abrupt change: a vertical gap ≥¾ inch or a horizontal separation ≥2 inches across the path of travel.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 16. Heating, Ventilation, and Air Conditioning
export const HVAC_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '16. Heating, Ventilation, and Air Conditioning',
    deficiencies: [
        {
            id: 'hvac_1',
            name: 'Air conditioning system not operational',
            detail: 'System or device does not turn on. OR system or device only produces hot or room temperature air.',
            criteria: '(e.g., a window unit or central air system).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'hvac_2',
            name: 'Combustion chamber cover or gas shutoff valve missing',
            detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
            criteria: 'Combustion chamber cover or gas shutoff valve was previously installed but is now either not present or incomplete.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'hvac_3',
            name: 'Fuel-burning heating exhaust vent issue',
            detail: 'Fuel-burning heating system is present, and the exhaust vent is misaligned, blocked, disconnected, or damaged—posing safety risks.',
            criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'hvac_4',
            name: 'Heating system safety shield damaged/missing',
            detail: 'Heating system or device safety shield is damaged or missing.',
            criteria: 'Safety shield was previously installed and is now not present or is incomplete.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'hvac_5',
            name: 'Heating source damaged/inoperable/missing (Apr 1 - Sep 30)',
            detail: 'A permanently installed heating source is damaged or is inoperable or is missing or not installed.',
            criteria: 'A permanently installed heating source may include forced air heating, radiant heat, baseboard units heated by electric, or installed wall unit.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'hvac_6',
            name: 'Temperature below 64°F (Oct 1 - Mar 31)',
            detail: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
            criteria: 'The permanently installed heating or heating source is not working. Or temperature is below 64 degrees Fahrenheit.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'hvac_7',
            name: 'Temperature 64-67.9°F (Oct 1 - Mar 31)',
            detail: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating or heating source is working and the interior temperature is 64 to 67.9 degrees Fahrenheit.',
            criteria: 'The permanently installed heating or heating source is working. However the temperature is 64 to 67.9 degrees Fahrenheit.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'hvac_8',
            name: 'Unvented space heater present',
            detail: 'Unvented space heater that burns gas, oil, or kerosene is present.',
            criteria: 'Inside, include any and all common areas.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 17. Kitchen
export const KITCHEN_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '17. Kitchen',
    subcategories: [
        {
            name: 'Cabinet and Storage',
            deficiencies: [
                {
                    id: 'kit_cab_1',
                    name: 'Storage component damaged/inoperable/missing',
                    detail: 'Storage component is damaged, inoperable, or missing.',
                    criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
                    severity: 'Low',
                    repairBy: '60 Days'
                }
            ]
        },
        {
            name: 'Cooking Appliance',
            deficiencies: [
                {
                    id: 'kit_cook_1',
                    name: 'Burner does not produce heat (other burner works)',
                    detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
                    criteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_cook_2',
                    name: 'Microwave (primary appliance) is damaged',
                    detail: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
                    criteria: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_cook_3',
                    name: 'Control knob missing/component unsafe',
                    detail: 'A control knob is missing, or the oven, cooktop component is damaged or missing, making the device unsafe for use, including the oven door seal.',
                    criteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_cook_4',
                    name: 'Cooktop or oven does not ignite/produce heat',
                    detail: 'No burner on the cooking range or cooktop produces heat. Or the oven does not produce heat temperature.',
                    criteria: 'No burner on the cooking range or cooktop produces heat. Or the oven does not produce heat temperature.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_cook_5',
                    name: 'Primary cooking appliance is missing',
                    detail: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
                    criteria: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Food Preparation Area',
            deficiencies: [
                {
                    id: 'kit_prep_1',
                    name: 'Food preparation area (countertop) damaged',
                    detail: 'The food preparation area (countertop) is damaged or not functionally adequate.',
                    criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_prep_2',
                    name: 'Food preparation area not present',
                    detail: 'The food preparation area, countertop is not present.',
                    criteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Mold-Like Substance',
            deficiencies: [
                {
                    id: 'kit_mold_1',
                    name: 'Peeling Paint - Elevated moisture level',
                    detail: 'Peeling Paint - Elevated moisture level.',
                    criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_mold_2',
                    name: 'More than 9 SF - Mold at extremely high levels',
                    detail: 'More than 9 SF - Presence of mold-like substance at extremely high levels is observed visually.',
                    criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_mold_3',
                    name: '1 to 9 SF - Mold at high levels',
                    detail: '1 to 9 SF - Presence of mold-like substance at high levels is observed visually.',
                    criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_mold_4',
                    name: '4 inches or less - Mold at moderate level',
                    detail: '4 inches or less - Presence of mold-like substance at moderate level observed visually.',
                    criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
                    severity: 'Low',
                    repairBy: '60 Days'
                }
            ]
        },
        {
            name: 'Refrigerator',
            deficiencies: [
                {
                    id: 'kit_fridge_1',
                    name: 'Refrigerator component damaged',
                    detail: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
                    criteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_fridge_2',
                    name: 'Refrigerator is inoperable',
                    detail: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
                    criteria: 'Does not cool adequately for the safe storage of food.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_fridge_3',
                    name: 'Refrigerator is missing',
                    detail: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
                    criteria: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                }
            ]
        },
        {
            name: 'Sink',
            deficiencies: [
                {
                    id: 'kit_sink_1',
                    name: 'Hot and cold water cannot be activated/deactivated',
                    detail: 'Hot and cold water cannot be activated or deactivated.',
                    criteria: 'Control knobs do not activate or deactivate hot and cold water.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_sink_2',
                    name: 'Sink/garbage disposal damaged - not adequate',
                    detail: 'The sink garbage disposal or other component is damaged or missing, and the sink is not functionally adequate.',
                    criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_sink_3',
                    name: 'Sink improperly installed',
                    detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
                    criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_sink_4',
                    name: 'Sink is missing in primary kitchen',
                    detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed in the primary kitchen.',
                    criteria: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'kit_sink_5',
                    name: 'Sink is not draining',
                    detail: 'The sink is not draining, not functioning adequately.',
                    criteria: 'Water is not draining from the basin of the sink. Slow or clogged drain.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_sink_6',
                    name: 'Dishwasher/sink component damaged - adequate',
                    detail: 'The dishwasher or other sink component is damaged or missing, and the sink is functionally adequate.',
                    criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'kit_sink_7',
                    name: 'Water directed outside of basin',
                    detail: 'When in use, water is directed outside of the basin.',
                    criteria: 'When in use, water is directed outside of the basin.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Ventilation',
            deficiencies: [
                {
                    id: 'kit_vent_1',
                    name: 'Kitchen does not have ventilation',
                    detail: 'The kitchen does not have ventilation, not present and operable.',
                    criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_vent_2',
                    name: 'Exhaust system component damaged/missing',
                    detail: 'Exhaust system component is damaged or missing.',
                    criteria: 'Exhaust system component is damaged. Or exhaust system component is missing.',
                    severity: 'Low',
                    repairBy: '60 Days'
                },
                {
                    id: 'kit_vent_3',
                    name: 'Exhaust system does not respond to control switch',
                    detail: 'Exhaust system does not respond to the control switch.',
                    criteria: 'Exhaust vent inoperable.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'kit_vent_4',
                    name: 'Exhaust system has restricted air flow',
                    detail: 'Exhaust system has restricted air flow.',
                    criteria: 'Exhaust system is blocked such that airflow may be restricted.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 18. Leak – Gas or Oil
export const LEAK_GAS_OIL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '18. Leak – Gas or Oil',
    deficiencies: [
        {
            id: 'leak_gas_1',
            name: 'Natural gas, propane, or oil leak',
            detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
            criteria: 'Natural gas, propane, or oil leak. Strong odor.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 19. Leak - Sewage System
export const LEAK_SEWAGE_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '19. Leak - Sewage System',
    deficiencies: [
        {
            id: 'leak_sew_1',
            name: 'Blocked sewage system',
            detail: 'Wastewater is unable to drain resulting in sewer backup.',
            criteria: 'Blocked sewage system.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'leak_sew_2',
            name: 'Protective cap to drain/cleanout/pump cover detached/missing',
            detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Cap to the cleanout or pump cover is detached or missing.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'leak_sew_3',
            name: 'Cleanout cap or riser damaged',
            detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
            criteria: 'Protective cap or riser is damaged.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'leak_sew_4',
            name: 'Leak in sewage system',
            detail: 'There is evidence of a sewer line or fitting leaking.',
            criteria: 'Leak in sewage system.',
            severity: 'Severe',
            repairBy: '24 Hours'
        }
    ]
};

// 20. Leak - Water
export const LEAK_WATER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '20. Leak - Water',
    deficiencies: [
        {
            id: 'leak_wat_1',
            name: 'Environmental water intrusion',
            detail: 'Water from the exterior environment is leaking into the interior.',
            criteria: 'Environmental water intrusion.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'leak_wat_2',
            name: 'Fluid leaking from sprinkler assembly',
            detail: 'Fluid is leaking from the sprinkler assembly.',
            criteria: 'Fluid is leaking from the sprinkler assembly.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'leak_wat_3',
            name: 'Plumbing leak',
            detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
            criteria: 'Plumbing leak.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 21. Lighting
export const LIGHTING_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '21. Lighting',
    subcategories: [
        {
            name: 'Lighting - Interior',
            deficiencies: [
                {
                    id: 'light_int_1',
                    name: 'Permanently installed light fixture inoperable',
                    detail: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
                    criteria: 'A permanently installed light fixture is inoperable (i.e., the overall system or component thereof is not meeting function or purpose; with or without visible damage).',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'light_int_2',
                    name: 'Permanently installed light fixture not secure',
                    detail: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
                    criteria: 'A permanently installed light fixture is not secure to the designed attachment point or the attachment point is not stable.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'light_int_3',
                    name: 'Light fixture not present in kitchen/bathroom',
                    detail: 'At least one (1) permanently installed light fixture is not present in the kitchen or bathroom.',
                    criteria: 'At least one (1) permanently installed light fixture is not present in the kitchen and bathroom.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Minimum Electrical and Lighting',
            deficiencies: [
                {
                    id: 'light_min_1',
                    name: 'Insufficient outlets or light fixtures',
                    detail: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
                    criteria: 'At least two (2) working outlets are absent within each habitable room. Or at least one (1) working outlet and one (1) permanently installed light fixture not present within each habitable room.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 22. Mold
export const MOLD_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '22. Mold',
    deficiencies: [
        {
            id: 'mold_1',
            name: 'Peeling paint - elevated moisture level',
            detail: 'Peeling paint - elevated moisture level.',
            criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'mold_2',
            name: 'More than 9 SF - mold at extremely high levels',
            detail: 'More than 9 SF - presence of mold-like substance at extremely high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 9 square feet in a room.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'mold_3',
            name: '1 to 9 SF - mold at high levels',
            detail: '1 to 9 SF - Presence of mold-like substance at high levels is observed visually.',
            criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'mold_4',
            name: '4 inches or less - mold at moderate level',
            detail: '4 inches or less - presence of mold-like substance at moderate level observed visually.',
            criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
            severity: 'Low',
            repairBy: '60 Days'
        }
    ]
};

// 23. Paint - Lead-Based Paint
export const PAINT_LEAD_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '23. Paint - Lead-Based Paint',
    deficiencies: [
        {
            id: 'paint_1',
            name: 'Less than 2 SF - deteriorated paint (below de minimis)',
            detail: 'Paint is deteriorated for large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
            criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'paint_2',
            name: 'More than 2 SF - deteriorated paint (significant)',
            detail: 'Paint is deteriorated. For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
            criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
            severity: 'Severe',
            repairBy: '24 Hours'
        }
    ]
};

// 24. Railings
export const RAILINGS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '24. Railings',
    subcategories: [
        {
            name: 'Guardrail',
            deficiencies: [
                {
                    id: 'rail_guard_1',
                    name: 'Guardrail missing/not installed - limits safe use',
                    detail: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
                    criteria: 'The guardrail is missing or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'rail_guard_2',
                    name: 'Guardrail component missing/damaged - functionally adequate',
                    detail: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
                    criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to reasonably prevent fall hazards.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        },
        {
            name: 'Handrail',
            deficiencies: [
                {
                    id: 'rail_hand_1',
                    name: 'Handrail not functionally adequate',
                    detail: 'Handrail is not functionally adequate.',
                    criteria: 'A handrail is deficient if it cannot be reasonably grasped for support, is not continuous along the full stair flight, or is outside the required height range of 28 to 42 inches.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'rail_hand_2',
                    name: 'Handrail not continuous or wrong height',
                    detail: 'Handrail is not functionally adequate. Or handrail is not continuous for the full length of each flight of stairs. Or handrail is not between 28 inches and 42 inches in height.',
                    criteria: 'Handrail is not functionally adequate. Or handrail is not continuous for the full length of each flight of stairs. Or handrail is not between 28 inches and 42 inches in height.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                },
                {
                    id: 'rail_hand_3',
                    name: 'Handrail not installed where required',
                    detail: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
                    criteria: '4 or more stair risers are present, and a handrail is not installed. Or a ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
                    severity: 'Severe',
                    repairBy: '24 Hours'
                },
                {
                    id: 'rail_hand_4',
                    name: 'Handrail is not secured',
                    detail: 'Handrail is not secured.',
                    criteria: 'There is movement in the anchors of the handrail.',
                    severity: 'Moderate',
                    repairBy: '30 Days'
                }
            ]
        }
    ]
};

// 25. Sink (Laundry, Garage, or Patio)
export const SINK_OTHER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '25. Sink (Laundry, Garage, or Patio)',
    deficiencies: [
        {
            id: 'sink_oth_1',
            name: 'Control knobs do not activate/deactivate water',
            detail: 'Control knobs do not activate or deactivate hot and cold water.',
            criteria: 'Control knobs do not activate or deactivate hot and cold water.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'sink_oth_2',
            name: 'Sink component is missing',
            detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'sink_oth_3',
            name: 'Sink improperly installed',
            detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
            criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'sink_oth_4',
            name: 'Sink is missing',
            detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed.',
            criteria: 'Not present or incomplete.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'sink_oth_5',
            name: 'Sink not draining',
            detail: 'Water is not draining from the basin of the sink.',
            criteria: 'Water is not draining from the basin of the sink.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'sink_oth_6',
            name: 'Sink component is damaged',
            detail: 'The sink component is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
            criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
            severity: 'Low',
            repairBy: '60 Days'
        },
        {
            id: 'sink_oth_7',
            name: 'Water pressure/direction not adequate',
            detail: 'Water pressure, direction is not adequately functional.',
            criteria: 'The sink\'s faucet water pressure and direction are not functional or adequate.',
            severity: 'Low',
            repairBy: '60 Days'
        }
    ]
};

// 26. Steps and Stairs
export const STEPS_STAIRS_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '26. Steps and Stairs',
    deficiencies: [
        {
            id: 'steps_1',
            name: 'Stringer is damaged',
            detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
            criteria: 'Instability is detected while walking on the stair.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'steps_2',
            name: 'Tread on stairs damaged',
            detail: 'Tread on a set of stairs is missing (i.e., evidence or a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide is damaged or broken.',
            criteria: 'Secure accessory treads are not present.',
            severity: 'Severe',
            repairBy: '24 Hours'
        }
    ]
};

// 27. Structural System
export const STRUCTURAL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '27. Structural System',
    deficiencies: [
        {
            id: 'struct_1',
            name: 'Structural system exhibits signs of serious failure',
            detail: 'Structural system exhibits signs of serious failure and may threaten the resident\'s safety.',
            criteria: 'Major structural damage that affects resident\'s safety.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        }
    ]
};

// 28. Ventilation (Other)
export const VENTILATION_OTHER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '28. Ventilation (Other)',
    deficiencies: [
        {
            id: 'vent_oth_1',
            name: 'Ventilation not functioning adequately',
            detail: 'It is not functioning adequately.',
            criteria: 'Affecting the unit.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'vent_oth_2',
            name: 'Exhaust system component damaged/missing',
            detail: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'Exhaust system component is damaged. Or exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            severity: 'Low',
            repairBy: '60 Days'
        },
        {
            id: 'vent_oth_3',
            name: 'Exhaust system does not respond to control switch',
            detail: 'Exhaust system does not respond to the control switch.',
            criteria: 'Exhaust fan, inoperable.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'vent_oth_4',
            name: 'Exhaust system has restricted air flow',
            detail: 'Exhaust system has restricted air flow.',
            criteria: 'Exhaust system is blocked such that airflow may be restricted.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 29. Wall
export const WALL_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '29. Wall',
    deficiencies: [
        {
            id: 'wall_1',
            name: 'Interior wall not functionally adequate',
            detail: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
            criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'wall_2',
            name: 'Hole greater than 2 inches or accumulation of holes',
            detail: 'Hole is greater than 2 inches in diameter. OR an accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
            criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'wall_3',
            name: 'Interior wall has loose/detached surface covering',
            detail: 'Interior wall has a loose or detached surface covering.',
            criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 30. Water Heater
export const WATER_HEATER_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '30. Water Heater',
    deficiencies: [
        {
            id: 'wh_1',
            name: 'Chimney/flue piping blocked/misaligned/missing',
            detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
            criteria: 'The vent is damaged/misaligned/not connected properly.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'wh_2',
            name: 'Gas shutoff valve damaged/missing/not installed',
            detail: 'Gas shutoff valve is damaged; impacts functionality). OR gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR gas shutoff valve is not installed.',
            criteria: 'Unable to shutoff gas in case of an emergency.',
            severity: 'Life-Threatening',
            repairBy: '24 Hours'
        },
        {
            id: 'wh_3',
            name: 'No hot water',
            detail: 'Hot water does not dispense after handle is engaged.',
            criteria: 'No hot water after several minutes.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'wh_4',
            name: 'TPRV has active leak/obstructed/unsuitable material',
            detail: 'The TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
            criteria: 'The TPRV valve is not functioning adequately.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'wh_5',
            name: 'Relief valve discharge piping improperly installed',
            detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). Or the relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
            criteria: 'Not properly installed.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 31. Window
export const WINDOW_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '31. Window',
    deficiencies: [
        {
            id: 'window_1',
            name: 'Window cannot be secured',
            detail: 'Window cannot be secured (i.e., access controlled) by at least one installed lock.',
            criteria: 'Only one lock is present, and it is damaged or inoperable.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'window_2',
            name: 'Window component damaged/missing - not adequate',
            detail: 'The window component is missing or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater.',
            criteria: 'Window is not functionally adequate.',
            severity: 'Moderate',
            repairBy: '30 Days'
        },
        {
            id: 'window_3',
            name: 'Window will not close',
            detail: 'The window does not close completely, or at least one window lock is not present. Or the window can be opened once the lock is engaged.',
            criteria: 'Window lock does not keep the window closed.',
            severity: 'Severe',
            repairBy: '24 Hours'
        },
        {
            id: 'window_4',
            name: 'Window will not open or stay open',
            detail: 'Window will not open. OR once opened, window will not stay open without the use of a tool or item.',
            criteria: 'Will not stay open without the use of a tool or item.',
            severity: 'Moderate',
            repairBy: '30 Days'
        }
    ]
};

// 32. General Comment
export const GENERAL_COMMENT_DEFICIENCIES: InsideItemDeficiencies = {
    itemName: '32. General Comment',
    deficiencies: [
        {
            id: 'gen_1',
            name: 'Housekeeping / No Access / Resident Refusal',
            detail: 'Housekeeping / No Access / Resident Refusal',
            criteria: 'General observation or access issue documented.',
            severity: 'Low',
            repairBy: 'N/A'
        }
    ]
};

// Map all inside deficiencies for easy lookup
export const INSIDE_DEFICIENCY_MAP: { [key: string]: InsideItemDeficiencies } = {
    '1. Bathroom': BATHROOM_DEFICIENCIES,
    '2. Cabinets and Storage (Pantry/Laundry)': CABINETS_STORAGE_DEFICIENCIES,
    '3. Call-for-Aid System': CALL_FOR_AID_DEFICIENCIES,
    '4. Carbon Monoxide Alarm': CARBON_MONOXIDE_DEFICIENCIES,
    '5. Ceiling': CEILING_DEFICIENCIES,
    '6. Chimney': CHIMNEY_INSIDE_DEFICIENCIES,
    '7. Clothes Dryer Exhaust Ventilation': DRYER_VENT_INSIDE_DEFICIENCIES,
    '8. Doors': DOORS_DEFICIENCIES,
    '9. Drainage (floor drain)': DRAINAGE_DEFICIENCIES,
    '10. Egress': EGRESS_DEFICIENCIES,
    '11. Electrical': ELECTRICAL_DEFICIENCIES,
    '12. Fire Safety': FIRE_SAFETY_DEFICIENCIES,
    '13. Floor': FLOOR_DEFICIENCIES,
    '14. Foundation': FOUNDATION_DEFICIENCIES,
    '15. Hazard': HAZARD_DEFICIENCIES,
    '16. Heating, Ventilation, and Air Conditioning': HVAC_DEFICIENCIES,
    '17. Kitchen': KITCHEN_DEFICIENCIES,
    '18. Leak – Gas or Oil': LEAK_GAS_OIL_DEFICIENCIES,
    '19. Leak - Sewage System': LEAK_SEWAGE_DEFICIENCIES,
    '20. Leak - Water': LEAK_WATER_DEFICIENCIES,
    '21. Lighting': LIGHTING_DEFICIENCIES,
    '22. Mold': MOLD_DEFICIENCIES,
    '23. Paint - Lead-Based Paint': PAINT_LEAD_DEFICIENCIES,
    '24. Railings': RAILINGS_DEFICIENCIES,
    '25. Sink (Laundry, Garage, or Patio)': SINK_OTHER_DEFICIENCIES,
    '26. Steps and Stairs': STEPS_STAIRS_DEFICIENCIES,
    '27. Structural System': STRUCTURAL_DEFICIENCIES,
    '28. Ventilation (Other)': VENTILATION_OTHER_DEFICIENCIES,
    '29. Wall': WALL_DEFICIENCIES,
    '30. Water Heater': WATER_HEATER_DEFICIENCIES,
    '31. Window': WINDOW_DEFICIENCIES,
    '32. General Comment': GENERAL_COMMENT_DEFICIENCIES,
};

// Helper function to get deficiencies for an inside item
export function getInsideDeficienciesForItem(itemName: string): InsideItemDeficiencies | null {
    // Try direct match first
    if (INSIDE_DEFICIENCY_MAP[itemName]) {
        return INSIDE_DEFICIENCY_MAP[itemName];
    }

    // Try partial match
    for (const key of Object.keys(INSIDE_DEFICIENCY_MAP)) {
        if (itemName.includes(key.replace(/^\d+\.\s*/, '')) || key.includes(itemName)) {
            return INSIDE_DEFICIENCY_MAP[key];
        }
    }

    return null;
}

// Helper to check if an inside item has subcategories
export function insideItemHasSubcategories(itemName: string): boolean {
    const item = getInsideDeficienciesForItem(itemName);
    return item?.subcategories !== undefined && item.subcategories.length > 0;
}

// Helper to get subcategories for an inside item
export function getInsideSubcategories(itemName: string): { id: string; name: string }[] {
    const item = getInsideDeficienciesForItem(itemName);
    if (item?.subcategories) {
        return item.subcategories.map((sub, index) => ({
            id: `${itemName}_sub_${index}`,
            name: sub.name,
        }));
    }
    return [];
}

// Helper to get deficiencies for a subcategory
export function getInsideDeficienciesForSubcategory(
    itemName: string,
    subcategoryName: string
): InsideDeficiencyOption[] {
    const item = getInsideDeficienciesForItem(itemName);
    if (item?.subcategories) {
        const subcategory = item.subcategories.find(sub => sub.name === subcategoryName);
        return subcategory?.deficiencies || [];
    }
    return [];
}

// Helper to get all deficiencies for an item (flat list)
export function getAllInsideDeficienciesForItem(itemName: string): InsideDeficiencyOption[] {
    const item = getInsideDeficienciesForItem(itemName);
    if (!item) return [];

    if (item.deficiencies) {
        return item.deficiencies;
    }

    if (item.subcategories) {
        return item.subcategories.flatMap(sub => sub.deficiencies);
    }

    return [];
}
