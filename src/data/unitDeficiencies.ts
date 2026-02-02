/**
 * NSPIRE Unit Deficiencies - Complete 32 Categories
 * Contains all deficiency options for unit inspections
 */

export interface UnitDeficiency {
  id: string;
  category: string;
  deficiencySelected: string;
  deficiencyDetail: string;
  deficiencyCriteria: string;
}

export interface UnitCategory {  
  name: string;
  deficiencies: UnitDeficiency[];
}

// All 32 NSPIRE Unit Categories - Available for all locations
export const UNIT_DEFICIENCIES: UnitCategory[] = [
  {
    name: 'Bathroom',
    deficiencies: [
      {
        id: 'bath_1',
        category: 'Bathtub and Shower',
        deficiencySelected: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
        deficiencyDetail: 'Bathtub or shower is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
        deficiencyCriteria: 'A bathtub or shower is inoperable, or standing water is present, such that the inspector believes water is unable to drain or drains very slowly.'
      },
      {
        id: 'bath_2',
        category: 'Bathtub and Shower',
        deficiencySelected: 'Bathtub or shower component is damaged, inoperable, or missing, and it may not limit the resident\'s ability to maintain personal hygiene.',
        deficiencyDetail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may not limit the resident\'s ability to maintain personal hygiene.',
        deficiencyCriteria: 'Component, inoperable or missing—whether due to system failure, incomplete installation, or absence of non-mechanical parts like a stopper or discoloration affecting less than 50% of the surface'
      },
      {
        id: 'bath_3',
        category: 'Bathtub and Shower',
        deficiencySelected: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
        deficiencyDetail: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
        deficiencyCriteria: 'Bathtub or shower is inoperable or missing, limiting the resident\'s ability to maintain personal hygiene. This includes nonfunctional fixtures, absent components with signs of prior installation, or severe discoloration affecting over 50% of the surface'
      },
      {
        id: 'bath_4',
        category: 'Bathtub and Shower',
        deficiencySelected: 'Bathtub or shower cannot be used in private.',
        deficiencyDetail: 'Bathtub or shower cannot be used in private.',
        deficiencyCriteria: 'For the purpose of this standard, the resident should be able to use the bathtub or shower without being observed from an adjacent room or exterior space.'
      },
      {
        id: 'bath_5',
        category: 'Bathtub and Shower',
        deficiencySelected: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
        deficiencyDetail: 'Only one bathtub or shower is present, and it is inoperable or does not drain.',
        deficiencyCriteria: 'Only one bathtub or shower is present within the unit and it is inoperable (i.e., overall system is not meeting function or purpose, with or without visible damage). Or, standing water is present such that the inspector believes water is unable to drain.'
      },
      {
        id: 'bath_6',
        category: 'Cabinet and Storage',
        deficiencySelected: 'Storage component is damaged, inoperable, or missing.',
        deficiencyDetail: 'Storage component is damaged, inoperable, or missing.',
        deficiencyCriteria: 'Some of the bathroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.'
      },
      {
        id: 'bath_7',
        category: 'Grab Bar',
        deficiencySelected: 'Grab Bar is not secure.',
        deficiencyDetail: 'Grab Bar is not secure.',
        deficiencyCriteria: 'Any movement, whatsoever, is detected in the grab bar.'
      },
      {
        id: 'bath_8',
        category: 'MOLD-LIKE SUBSTANCE',
        deficiencySelected: 'Peeling Paint-Elevated moisture level.',
        deficiencyDetail: 'Peeling Paint-Elevated moisture level.',
        deficiencyCriteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).'
      },
      {
        id: 'bath_9',
        category: 'MOLD-LIKE SUBSTANCE',
        deficiencySelected: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
        deficiencyDetail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
        deficiencyCriteria: 'Cumulative area of patches is more than 9 square foot in a room.'
      },
      {
        id: 'bath_10',
        category: 'MOLD-LIKE SUBSTANCE',
        deficiencySelected: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
        deficiencyDetail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
        deficiencyCriteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.'
      },
      {
        id: 'bath_11',
        category: 'MOLD-LIKE SUBSTANCE',
        deficiencySelected: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
        deficiencyDetail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
        deficiencyCriteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.'
      },
      {
        id: 'bath_12',
        category: 'Sink',
        deficiencySelected: 'Hot and cold water cannot be activated or deactivated.',
        deficiencyDetail: 'Hot and cold water cannot be activated or deactivated.',
        deficiencyCriteria: 'Control knobs do not activate or deactivate hot and cold water.'
      },
      {
        id: 'bath_13',
        category: 'Sink',
        deficiencySelected: 'Sink component is damaged or missing, and the sink is not functionally adequate',
        deficiencyDetail: 'Sink component is damaged or missing, and the sink is not functionally adequate',
        deficiencyCriteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).'
      },
      {
        id: 'bath_14',
        category: 'Sink',
        deficiencySelected: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
        deficiencyDetail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
        deficiencyCriteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.'
      },
      {
        id: 'bath_15',
        category: 'Sink',
        deficiencySelected: 'Sink is not draining.',
        deficiencyDetail: 'Sink is not draining.',
        deficiencyCriteria: 'Water is not draining from the basin of the sink.'
      },
      {
        id: 'bath_16',
        category: 'Sink',
        deficiencySelected: 'Sink component is damaged or missing, and the sink is functionally adequate.',
        deficiencyDetail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
        deficiencyCriteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).'
      },
      {
        id: 'bath_17',
        category: 'Sink',
        deficiencySelected: 'Water is directed outside of the basin.',
        deficiencyDetail: 'Water is directed outside of the basin.',
        deficiencyCriteria: 'Confirm that water is directed into the basin and not outside when in use.'
      },
      {
        id: 'bath_18',
        category: 'Toilet',
        deficiencySelected: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
        deficiencyDetail: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
        deficiencyCriteria: 'A toilet is damaged or inoperable, but another functional toilet exists within the unit. Defect may be visible or affect overall usability'
      },
      {
        id: 'bath_19',
        category: 'Toilet',
        deficiencySelected: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
        deficiencyDetail: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
        deficiencyCriteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete), and at least one toilet is installed elsewhere within the unit that is operational.'
      },
      {
        id: 'bath_20',
        category: 'Toilet',
        deficiencySelected: 'Only one toilet was installed, and it is damaged or inoperable.',
        deficiencyDetail: 'Only one toilet was installed, and it is damaged or inoperable.',
        deficiencyCriteria: 'Only one toilet was installed, and it is now missing (i.e., there is evidence of prior installation, but it is no longer present or is incomplete).'
      },
      {
        id: 'bath_21',
        category: 'Toilet',
        deficiencySelected: 'Only one toilet was installed, and it is missing.',
        deficiencyDetail: 'Only one toilet was installed, and it is missing.',
        deficiencyCriteria: 'Only one toilet is present, and it\'s either damaged or inoperable—preventing proper use.'
      },
      {
        id: 'bath_22',
        category: 'Toilet',
        deficiencySelected: 'Toilet can not be used in private',
        deficiencyDetail: 'Toilet can not be used in private',
        deficiencyCriteria: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.'
      },
      {
        id: 'bath_23',
        category: 'Toilet',
        deficiencySelected: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
        deficiencyDetail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
        deficiencyCriteria: 'A toilet component may be damaged, inoperable, or missing—whether visibly defective, functionally impaired, or absent despite evidence of prior installation'
      },
      {
        id: 'bath_24',
        category: 'Toilet',
        deficiencySelected: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
        deficiencyDetail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
        deficiencyCriteria: 'Toilet component is damaged or inoperable, potentially limiting safe waste discharge.'
      },
      {
        id: 'bath_25',
        category: 'Toilet',
        deficiencySelected: 'Toilet is not secured at the base.',
        deficiencyDetail: 'Toilet is not secured at the base.',
        deficiencyCriteria: 'Toilet is not secured at the base.'
      },
      {
        id: 'bath_26',
        category: 'Ventilation',
        deficiencySelected: 'The restroom does not have ventilation, not present and operable.',
        deficiencyDetail: 'The restroom does not have ventilation, not present and operable.',
        deficiencyCriteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.'
      },
      {
        id: 'bath_27',
        category: 'Ventilation',
        deficiencySelected: 'The exhaust system component is missing and damaged, affecting the function adequately.',
        deficiencyDetail: 'The exhaust system component is missing and damaged, affecting the function adequately.',
        deficiencyCriteria: 'Exhaust system component is damaged OR Exhaust system component is missing'
      },
      {
        id: 'bath_28',
        category: 'Ventilation',
        deficiencySelected: 'Exhaust system does not respond to the control switch.',
        deficiencyDetail: 'Exhaust system does not respond to the control switch.',
        deficiencyCriteria: 'Exhaust vent inoperable.'
      },
      {
        id: 'bath_29',
        category: 'Ventilation',
        deficiencySelected: 'Exhaust system has restricted air flow.',
        deficiencyDetail: 'Exhaust system has restricted air flow.',
        deficiencyCriteria: 'Exhaust system is blocked such that airflow may be restricted.'
      }
    ]
  },
  {
    name: 'Kitchen',
    deficiencies: [
      {
        id: 'kitchen_1',
        category: 'Cabinet and Storage',
        deficiencySelected: 'Storage component is damaged, inoperable, or missing.',
        deficiencyDetail: 'Storage component is damaged, inoperable, or missing.',
        deficiencyCriteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing. Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.'
      },
      {
        id: 'kitchen_2',
        category: 'Cooking Appliance',
        deficiencySelected: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
        deficiencyDetail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
        deficiencyCriteria: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.'
      },
      {
        id: 'kitchen_3',
        category: 'Cooking Appliance',
        deficiencySelected: 'Microwave is the primary cooking appliance, and it is damaged.',
        deficiencyDetail: 'Microwave is the primary cooking appliance, and it is damaged.',
        deficiencyCriteria: 'A microwave is the primary cooking appliance and it is damaged (i.e., visibly defective; impacts functionality).'
      },
      {
        id: 'kitchen_4',
        category: 'Cooking Appliance',
        deficiencySelected: 'A control knob is missing, or the oven, cooktop component is damaged or missing, making the device unsafe for use, including the oven door seal.',
        deficiencyDetail: 'A control knob is missing, or the oven, cooktop component is damaged or missing, making the device unsafe for use, including the oven door seal.',
        deficiencyCriteria: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.'
      },
      {
        id: 'kitchen_5',
        category: 'Cooking Appliance',
        deficiencySelected: 'Cooktop or oven does not ignite or produce heat.',
        deficiencyDetail: 'Cooktop or oven does not ignite or produce heat.',
        deficiencyCriteria: 'No burner on the cooking range or cooktop produces heat. Or The oven does not produce heat temperature.'
      },
      {
        id: 'kitchen_6',
        category: 'Cooking Appliance',
        deficiencySelected: 'The primary cooking appliance is missing.',
        deficiencyDetail: 'The primary cooking appliance is missing.',
        deficiencyCriteria: 'Primary cooking appliance is missing (i.e., evidence of prior installation, but now not present or is incomplete).'
      },
      {
        id: 'kitchen_7',
        category: 'Food preparation Area',
        deficiencySelected: 'The food preparation area (countertop) is damaged or not functionally adequate.',
        deficiencyDetail: 'The food preparation area (countertop) is damaged or not functionally adequate.',
        deficiencyCriteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient'
      },
      {
        id: 'kitchen_8',
        category: 'Food preparation Area',
        deficiencySelected: 'The food preparation area, countertop is not present.',
        deficiencyDetail: 'The food preparation area, countertop is not present.',
        deficiencyCriteria: 'Kitchen countertops must be fully surfaced and functional; exposed substrate over 10% or setups that hinder food prep are deficient'
      },
      {
        id: 'kitchen_9',
        category: 'Refrigerator',
        deficiencySelected: 'Refrigerator component is damaged such that it impacts functionality.',
        deficiencyDetail: 'Refrigerator component is damaged such that it impacts functionality.',
        deficiencyCriteria: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.'
      },
      {
        id: 'kitchen_10',
        category: 'Refrigerator',
        deficiencySelected: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
        deficiencyDetail: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
        deficiencyCriteria: 'Does not cool adequately for the safe storage of food.'
      },
      {
        id: 'kitchen_11',
        category: 'Refrigerator',
        deficiencySelected: 'Refrigerator is missing.',
        deficiencyDetail: 'Refrigerator is missing.',
        deficiencyCriteria: 'Refrigerator is missing (i.e., evidence of prior installation but is now not present).'
      },
      {
        id: 'kitchen_12',
        category: 'Sink',
        deficiencySelected: 'Hot and cold water cannot be activated or deactivated.',
        deficiencyDetail: 'Hot and cold water cannot be activated or deactivated.',
        deficiencyCriteria: 'Control knobs do not activate or deactivate hot and cold water.'
      },
      {
        id: 'kitchen_13',
        category: 'Sink',
        deficiencySelected: 'The sink garbage disposal or other component is damaged or missing, and the sink is not functionally adequate.',
        deficiencyDetail: 'The sink garbage disposal or other component is damaged or missing, and the sink is not functionally adequate.',
        deficiencyCriteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).'
      },
      {
        id: 'kitchen_14',
        category: 'Sink',
        deficiencySelected: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
        deficiencyDetail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
        deficiencyCriteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.'
      },
      {
        id: 'kitchen_15',
        category: 'Sink',
        deficiencySelected: 'Sink is missing or not installed within the primary kitchen.',
        deficiencyDetail: 'Sink is missing or not installed within the primary kitchen.',
        deficiencyCriteria: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.'
      },
      {
        id: 'kitchen_16',
        category: 'Sink',
        deficiencySelected: 'The sink is not draining, not functioning adequately.',
        deficiencyDetail: 'The sink is not draining, not functioning adequately.',
        deficiencyCriteria: 'Water is not draining from the basin of the sink. slow or clogged drain.'
      },
      {
        id: 'kitchen_17',
        category: 'Sink',
        deficiencySelected: 'The dishwasher or other Sink component is damaged or missing, and the sink is functionally adequate.',
        deficiencyDetail: 'The dishwasher or other Sink component is damaged or missing, and the sink is functionally adequate.',
        deficiencyCriteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).'
      },
      {
        id: 'kitchen_18',
        category: 'Sink',
        deficiencySelected: 'Water is directed outside of the basin.',
        deficiencyDetail: 'Water is directed outside of the basin.',
        deficiencyCriteria: 'When in use, water is directed outside of the basin.'
      },
      {
        id: 'kitchen_19',
        category: 'Ventilation',
        deficiencySelected: 'The kitchen does not have ventilation, not present and operable.',
        deficiencyDetail: 'The kitchen does not have ventilation, not present and operable.',
        deficiencyCriteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.'
      },
      {
        id: 'kitchen_20',
        category: 'Ventilation',
        deficiencySelected: 'Exhaust system component is damaged or missing.',
        deficiencyDetail: 'Exhaust system component is damaged or missing.',
        deficiencyCriteria: 'Exhaust system component is damaged. Or exhaust system component is missing.'
      },
      {
        id: 'kitchen_21',
        category: 'Ventilation',
        deficiencySelected: 'Exhaust system does not respond to the control switch.',
        deficiencyDetail: 'Exhaust system does not respond to the control switch.',
        deficiencyCriteria: 'Exhaust vent inoperable.'
      },
      {
        id: 'kitchen_22',
        category: 'Ventilation',
        deficiencySelected: 'Exhaust system has restricted air flow.',
        deficiencyDetail: 'Exhaust system has restricted air flow.',
        deficiencyCriteria: 'Exhaust system is blocked such that airflow may be restricted.'
      }
    ]
  },
  {
    name: 'Cabinets and Storage (Pantry/Laundry)',
    deficiencies: [
      {
        id: 'cab_1',
        category: 'Pantry, Food Storage Space Not Present',
        deficiencySelected: 'Food storage space is not present.',
        deficiencyDetail: 'Food storage space is not present.',
        deficiencyCriteria: 'Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.'
      },
      {
        id: 'cab_2',
        category: 'Laundry Storage Component damaged, Inoperable, Missing',
        deficiencySelected: '50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).',
        deficiencyDetail: '50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).',
        deficiencyCriteria: '50% or more of cabinet doors, or 50% or more of drawers, or 50% or more of shelves are missing or damaged.'
      }
    ]
  },
  {
    name: 'Call-for-Aid System',
    deficiencies: [
      {
        id: 'call_1',
        category: 'System does not function properly',
        deficiencySelected: 'A call-for-aid system does not emit sound or light or send signal to annunciator.',
        deficiencyDetail: 'A call-for-aid system does not emit sound or light or send signal to annunciator.',
        deficiencyCriteria: 'The annunciator does not indicate the correct corresponding room.'
      },
      {
        id: 'call_2',
        category: 'System blocked or pull cord height',
        deficiencySelected: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
        deficiencyDetail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
        deficiencyCriteria: 'The pull cord end is positioned more than 6 inches above the floor.'
      }
    ]
  },
  {
    name: 'Carbon Monoxide Alarm',
    deficiencies: [
      {
        id: 'co_1',
        category: 'Alarm inoperable',
        deficiencySelected: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
        deficiencyDetail: 'Carbon monoxide alarm is inoperable(dead batteries) or the alarm does not cease after testing.',
        deficiencyCriteria: 'A required Carbon monoxide alarm does not emit visual or audio alarm or the alarm does not cease after testing.'
      },
      {
        id: 'co_2',
        category: 'Alarm missing',
        deficiencySelected: 'Carbon monoxide alarm is missing, not installed or not installed in the proper location.',
        deficiencyDetail: 'The location of the previous installation is not relevant. Unit/building contains a fuel-burning appliance or fuel-burning fireplace Carbon monoxide alarm is missing',
        deficiencyCriteria: 'Units with fuel-burning appliances or fireplaces must have carbon monoxide alarms in required locations. Missing alarms near sleeping areas, bathrooms, remote furnaces, or garages makes the unit noncompliant.'
      },
      {
        id: 'co_3',
        category: 'Alarm obstructed',
        deficiencySelected: 'Carbon monoxide alarm is obstructed.',
        deficiencyDetail: 'Carbon monoxide alarm is obstructed.',
        deficiencyCriteria: 'Carbon monoxide is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).'
      }
    ]
  },
  {
    name: 'Ceiling',
    deficiencies: [
      {
        id: 'ceil_1',
        category: 'Not functionally adequate',
        deficiencySelected: 'The ceiling component(s) is not functionally adequate.',
        deficiencyDetail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under structural deficiency.',
        deficiencyCriteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.'
      },
      {
        id: 'ceil_2',
        category: 'Has hole',
        deficiencySelected: 'Ceiling has a hole.',
        deficiencyDetail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
        deficiencyCriteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".'
      },
      {
        id: 'ceil_3',
        category: 'Unstable surface',
        deficiencySelected: 'The ceiling has an unstable surface (bulging, buckling).',
        deficiencyDetail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
        deficiencyCriteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category. Deficiency.'
      }
    ]
  },
  {
    name: 'Chimney',
    deficiencies: [
      {
        id: 'chim_1',
        category: 'Damaged or incomplete',
        deficiencySelected: 'Visually accessible and observable.',
        deficiencyDetail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
        deficiencyCriteria: 'Contains a fuel-burning appliance or fuel-burning fireplace.'
      }
    ]
  },
  {
    name: 'Clothes Dryer Exhaust Ventilation',
    deficiencies: [
      {
        id: 'dryer_1',
        category: 'Unsuitable material',
        deficiencySelected: 'Dryer transition duct is constructed of unsuitable material.',
        deficiencyDetail: 'Dryer transition duct is not constructed of metal or an approved material.',
        deficiencyCriteria: 'Dryer is being used indoor.'
      },
      {
        id: 'dryer_2',
        category: 'Electric restricted airflow',
        deficiencySelected: 'Electrical dryer exhaust ventilation has restricted airflow.',
        deficiencyDetail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
        deficiencyCriteria: 'Airflow may be restricted.'
      },
      {
        id: 'dryer_3',
        category: 'Electric duct detached',
        deficiencySelected: 'Electric dryer transition duct is detached or missing.',
        deficiencyDetail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
        deficiencyCriteria: 'Dryer transition duct is not securely attached.'
      },
      {
        id: 'dryer_4',
        category: 'Gas restricted airflow',
        deficiencySelected: 'Gas dryer exhaust ventilation system has restricted airflow.',
        deficiencyDetail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
        deficiencyCriteria: 'Airflow may be restricted.'
      },
      {
        id: 'dryer_5',
        category: 'Gas duct detached',
        deficiencySelected: 'Gas dryer transition duct is detached or missing.',
        deficiencyDetail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
        deficiencyCriteria: 'The dryer transition duct is not securely attached.'
      }
    ]
  },
  {
    name: 'Doors',
    deficiencies: [
      {
        id: 'door_1',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door cannot be secured adequately, missing, damaged hardware.',
        deficiencyDetail: 'Entry door cannot be secured adequately, missing, damaged hardware.',
        deficiencyCriteria: 'Installed locks can not be engaged from both sides.'
      },
      {
        id: 'door_2',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door component is damage, missing, inoperable',
        deficiencyDetail: 'Entry door component is damage, missing, inoperable',
        deficiencyCriteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or A hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.'
      },
      {
        id: 'door_3',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door frame, threshold, or trim is damaged.',
        deficiencyDetail: 'Entry door frame, threshold, or trim is damaged.',
        deficiencyCriteria: 'Evidence of prior installation, now missing.'
      },
      {
        id: 'door_4',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door is missing.',
        deficiencyDetail: 'Entry door is missing.',
        deficiencyCriteria: 'Not present or is incomplete.'
      },
      {
        id: 'door_5',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
        deficiencyDetail: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
        deficiencyCriteria: 'Entry door seal is damaged, missing, or nonfunctional—causing a gap ≥¼ inch that lets in light or shows signs of water damage or dry rot.'
      },
      {
        id: 'door_6',
        category: 'Door- Entry',
        deficiencySelected: 'Self-closing mechanism is damaged, inoperable or damaged.',
        deficiencyDetail: 'Self-closing mechanism is damaged, inoperable or damaged.',
        deficiencyCriteria: 'Self-closing mechanism is damaged, missing, or fails to close and latch the door properly.'
      },
      {
        id: 'door_7',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door surface is delaminated or separated.',
        deficiencyDetail: 'There is delamination or separation of the door surface 2 inches wide or greater. OR There is delamination or separation that affects the integrity of the door',
        deficiencyCriteria: 'There is delamination or separation of the door surface 2 inches wide or greater. OR There is delamination or separation that affects the integrity of the door'
      },
      {
        id: 'door_8',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door will not close properly.',
        deficiencyDetail: 'Entry door will not close properly.',
        deficiencyCriteria: 'Entry door does not close (i.e., door seats in frame).'
      },
      {
        id: 'door_9',
        category: 'Door- Entry',
        deficiencySelected: 'Entry door will not open properly.',
        deficiencyDetail: 'Entry door will not open properly.',
        deficiencyCriteria: 'Entry door does not open.'
      },
      {
        id: 'door_10',
        category: 'Door- Entry',
        deficiencySelected: 'Hole, split, or crack that penetrates completely through the entry door.',
        deficiencyDetail: 'Hole, split, or crack that penetrates completely through the entry door.',
        deficiencyCriteria: 'Crack, split, separation, or hole 1/4 inch or greater in diameter penetrating through the door or door sides.'
      },
      {
        id: 'door_11',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
        deficiencyDetail: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
        deficiencyCriteria: 'An object blocks the fire-labeled door from closing or self-closing and latching properly.'
      },
      {
        id: 'door_12',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'A fire-labeled door assembly has a hole of any size.',
        deficiencyDetail: 'A fire-labeled door assembly has a hole of any size.',
        deficiencyCriteria: 'A fire-labeled door assembly has a hole of any size. Or assembly is damaged such that its integrity may be compromised.'
      },
      {
        id: 'door_13',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'Fire-labeled door can not be secured.',
        deficiencyDetail: 'Fire-labeled door can not be secured.',
        deficiencyCriteria: 'Fire labeled door that serves as entry door cannot be secured (i.e., access controlled) by at least one installed lock.'
      },
      {
        id: 'door_14',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
        deficiencyDetail: 'Fire labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
        deficiencyCriteria: 'Fire-labeled door fails to close and latch due to missing or damaged self-closing hardware.'
      },
      {
        id: 'door_15',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'Fire-labeled door does not open.',
        deficiencyDetail: 'Fire-labeled door does not open.',
        deficiencyCriteria: 'Fire labeled door does not open such that it may limit access between spaces.'
      },
      {
        id: 'door_16',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'Fire-labeled door is missing.',
        deficiencyDetail: 'Fire-labeled door is missing.',
        deficiencyCriteria: '(i.e., evidence of prior installation, but now not present or is incomplete.'
      },
      {
        id: 'door_17',
        category: 'Door – Fire Labeled',
        deficiencySelected: 'Fire-labeled door seal or gasket is damaged.',
        deficiencyDetail: 'Fire-labeled door seal or gasket is damaged.',
        deficiencyCriteria: 'Fire-labeled door seal or gasket is damaged or missing, affecting proper function.'
      },
      {
        id: 'door_18',
        category: 'Door-General',
        deficiencySelected: 'A passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
        deficiencyDetail: 'A passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
        deficiencyCriteria: 'Whether visibly defective, nonfunctional, or incomplete— the door fails to provide adequate privacy, separation between rooms, or control over the physical atmosphere within a space.'
      },
      {
        id: 'door_19',
        category: 'Door-General',
        deficiencySelected: 'A passage door does not open.',
        deficiencyDetail: 'A passage door does not open.',
        deficiencyCriteria: 'A passage door does not open such that it may limit access when needed.'
      },
      {
        id: 'door_20',
        category: 'Door-General',
        deficiencySelected: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
        deficiencyDetail: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
        deficiencyCriteria: 'A passage door not intended for room access has a component that is either damaged, inoperable, or missing—each condition affecting its function or indicating prior installation.'
      },
      {
        id: 'door_21',
        category: 'Garage Door',
        deficiencySelected: 'Garage door does not open, close, or remain closed.',
        deficiencyDetail: 'Garage door does not open, close, or remain closed.',
        deficiencyCriteria: 'Door will not open and remain open, does not function adequately.'
      },
      {
        id: 'door_22',
        category: 'Garage Door',
        deficiencySelected: 'Garage door has a hole.',
        deficiencyDetail: 'Garage door has a hole.',
        deficiencyCriteria: 'Garage door has a hole of any size that penetrates through to the interior.'
      }
    ]
  },
  {
    name: 'Drainage (floor drain)',
    deficiencies: [
      {
        id: 'drain_1',
        category: 'Drain',
        deficiencySelected: 'Drain is fully blocked.',
        deficiencyDetail: 'Drain is fully blocked.',
        deficiencyCriteria: 'There is a problem with the drainage.'
      }
    ]
  },
  {
    name: 'Egress',
    deficiencies: [
      {
        id: 'egr_1',
        category: 'Egress (Exit Access)',
        deficiencySelected: 'Fire escape access to exteriors - doors and windows.',
        deficiencyDetail: 'Fire escape access to exteriors - doors and windows.',
        deficiencyCriteria: 'Double-key cylinder deadbolts and any locks or security features requiring a key, tool, or special effort from the street side are prohibited on exit doors, exit access doors, and egress windows.'
      },
      {
        id: 'egr_2',
        category: 'Egress (Exit Access)',
        deficiencySelected: 'Obstructed means of egress. Interior, closets, bedroom, bathroom., hallway and corridors.',
        deficiencyDetail: 'Obstructed means of egress. Interior, closets, bedroom, bathroom., hallway and corridors.',
        deficiencyCriteria: 'Exit paths—including doors, stairways, and egress windows—must remain clear and operable without keys, tools, or special effort.'
      },
      {
        id: 'egr_3',
        category: 'Egress (Exit Access)',
        deficiencySelected: 'Sleeping room is located on the 3rd floor or below and has an obtrude rescue opening.',
        deficiencyDetail: 'Sleeping room is located on the 3rd floor or below and has an obtrude rescue opening.',
        deficiencyCriteria: 'If the egress door is the unit entry, see Deficiency 1; if near a fire escape, see Deficiency 3. Egress may be blocked by locks, bars, or obstructions.'
      }
    ]
  },
  {
    name: 'Electrical',
    deficiencies: [
      {
        id: 'elec_1',
        category: 'Conductor-Outlet, and Switch',
        deficiencySelected: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
        deficiencyDetail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
        deficiencyCriteria: 'Electrical conductors must be properly enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2". Missing light bulbs should be assessed under interior or exterior lighting.'
      },
      {
        id: 'elec_2',
        category: 'Conductor-Outlet, and Switch',
        deficiencySelected: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
        deficiencyDetail: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
        deficiencyCriteria: 'An outlet that is reasonably accessible does not have visible damage and testing indicates that it is not energized.'
      },
      {
        id: 'elec_3',
        category: 'Conductor-Outlet, and Switch',
        deficiencySelected: 'The outlet or switch is damaged.',
        deficiencyDetail: 'The outlet or switch is damaged.',
        deficiencyCriteria: 'Any portion of a visually accessible outlet or switch is damaged such that it may not safely carry or control electrical current at the outlet or switch'
      },
      {
        id: 'elec_4',
        category: 'Conductor-Outlet, and Switch',
        deficiencySelected: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
        deficiencyDetail: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
        deficiencyCriteria: 'Testing of a three-pronged outlet that is reasonably accessible indicates that it is not properly wired or grounded.'
      },
      {
        id: 'elec_5',
        category: 'Conductor-Outlet, and Switch',
        deficiencySelected: 'Water is currently in contact with an electrical conductor.',
        deficiencyDetail: 'Water is currently in contact with an electrical conductor.',
        deficiencyCriteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).'
      },
      {
        id: 'elec_6',
        category: 'Electrical-Ground Fault Circuit Interrupter(GFCI) Or Arc-Fault Circuit interrupter(AFCI)-Outlet or Breaker',
        deficiencySelected: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
        deficiencyDetail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
        deficiencyCriteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.'
      },
      {
        id: 'elec_7',
        category: 'Electrical-Ground Fault Circuit Interrupter(GFCI) Or Arc-Fault Circuit interrupter(AFCI)-Outlet or Breaker',
        deficiencySelected: 'An unprotected outlet is present within six feet of a water source.',
        deficiencyDetail: 'An unprotected outlet is present within six feet of a water source.',
        deficiencyCriteria: 'An outlet, not GFCI-protected, is present within six feet of a water source located in the same room. An outlet designed for major appliances, when in use, is not evaluated under this category.'
      },
      {
        id: 'elec_8',
        category: 'Electrical-Ground Fault Circuit Interrupter(GFCI) Or Arc-Fault Circuit interrupter(AFCI)-Outlet or Breaker',
        deficiencySelected: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
        deficiencyDetail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable.',
        deficiencyCriteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).'
      },
      {
        id: 'elec_9',
        category: 'Electrical Service Panel',
        deficiencySelected: 'Electrical service panel is not reasonably accessible.',
        deficiencyDetail: 'Electrical service panel is not reasonably accessible.',
        deficiencyCriteria: 'The electrical service panel is not reasonably accessible. Or it is locked or in locked location, no key to access.'
      },
      {
        id: 'elec_10',
        category: 'Electrical Service Panel',
        deficiencySelected: 'The overcurrent protection device is contaminated.',
        deficiencyDetail: 'The overcurrent protection device is contaminated.',
        deficiencyCriteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation).'
      },
      {
        id: 'elec_11',
        category: 'Electrical Service Panel',
        deficiencySelected: 'The overcurrent protection device is damaged.',
        deficiencyDetail: 'The overcurrent protection device is damaged.',
        deficiencyCriteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged such that it may not interrupt the circuit during an over current condition.'
      },
      {
        id: 'elec_12',
        category: 'Minimum Electrical and Lighting',
        deficiencySelected: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
        deficiencyDetail: 'At least two (2) working outlets are not present within each habitable room. OR at least one (1) working outlet and one (1) permanently installed light fixture is not present within each habitable room.',
        deficiencyCriteria: 'Habitable rooms includes rooms that are in a building for living, sleeping, eating, or cooking.'
      }
    ]
  },
  {
    name: 'Fire Safety',
    deficiencies: [
      {
        id: 'fire_1',
        category: 'Fire Extinguisher',
        deficiencySelected: 'A fire extinguisher is damaged or missing.',
        deficiencyDetail: 'A fire extinguisher is damaged or missing.',
        deficiencyCriteria: 'Fire extinguisher is damaged (i.e., visibly defective; impacts functionality). Or Fire extinguisher is missing.'
      },
      {
        id: 'fire_2',
        category: 'Fire Extinguisher',
        deficiencySelected: 'The fire extinguisher pressure gauge reads over or undercharged.',
        deficiencyDetail: 'The fire extinguisher pressure gauge reads over or undercharged.',
        deficiencyCriteria: 'Pressure gauge indicates that the fire extinguisher is over or under charged.'
      },
      {
        id: 'fire_3',
        category: 'Fire Extinguisher',
        deficiencySelected: 'The fire extinguisher tag is missing or illegible or expired.',
        deficiencyDetail: 'The fire extinguisher tag is missing or illegible or expired.',
        deficiencyCriteria: 'Fire extinguisher is noncompliant if the service tag is over a year old, missing, illegible, or if a disposable unit is over 12 years old.'
      },
      {
        id: 'fire_4',
        category: 'Flammable and Combustible Item',
        deficiencySelected: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or a fuel-burning water heater. Or an improperly stored chemical.',
        deficiencyDetail: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or a fuel-burning water heater. Or an improperly stored chemical.',
        deficiencyCriteria: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place is not a deficiency.'
      },
      {
        id: 'fire_5',
        category: 'Smoke Alarm',
        deficiencySelected: 'Smoke alarm does not produce an audio or visual alarm when tested.',
        deficiencyDetail: 'Smoke alarm does not produce an audio or visual alarm when tested.',
        deficiencyCriteria: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.'
      },
      {
        id: 'fire_6',
        category: 'Smoke Alarm',
        deficiencySelected: 'Smoke alarm not installed where required.',
        deficiencyDetail: 'Smoke alarm not installed where required.',
        deficiencyCriteria: 'Smoke alarm not installed inside each bedroom and Smoke alarm not installed outside the bedroom(s) and in each bedroom or on each level.'
      },
      {
        id: 'fire_7',
        category: 'Smoke Alarm',
        deficiencySelected: 'Smoke alarm is obstructed.',
        deficiencyDetail: 'Smoke alarm is obstructed.',
        deficiencyCriteria: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).'
      },
      {
        id: 'fire_8',
        category: 'Smoke Alarm',
        deficiencySelected: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
        deficiencyDetail: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
        deficiencyCriteria: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.'
      },
      {
        id: 'fire_9',
        category: 'Sprinkler Assembly',
        deficiencySelected: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
        deficiencyDetail: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
        deficiencyCriteria: 'The sprinkler assembly component is damaged, inoperable, or missing.'
      },
      {
        id: 'fire_10',
        category: 'Sprinkler Assembly',
        deficiencySelected: 'Sprinkler head assembly has evidence of corrosion.',
        deficiencyDetail: 'Sprinkler head assembly has evidence of corrosion.',
        deficiencyCriteria: 'Sprinkler head assembly has evidence of corrosion.'
      },
      {
        id: 'fire_11',
        category: 'Sprinkler Assembly',
        deficiencySelected: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
        deficiencyDetail: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
        deficiencyCriteria: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.'
      },
      {
        id: 'fire_12',
        category: 'Sprinkler Assembly',
        deficiencySelected: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
        deficiencyDetail: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
        deficiencyCriteria: '18 inches of clearance is not due to features within the built (e.g., closet, utility closet).'
      }
    ]
  },
  {
    name: 'Floor',
    deficiencies: [
      {
        id: 'floor_1',
        category: 'Floor',
        deficiencySelected: 'The floor is damaged.',
        deficiencyDetail: 'The floor is damaged.',
        deficiencyCriteria: 'Finished floor or substrate is damaged and impairs usability. Cracks measuring less than 1/8", wear from normal use, or cosmetic blemishes are not a deficiency.'
      },
      {
        id: 'floor_2',
        category: 'Floor',
        deficiencySelected: 'Water is present on the floor.',
        deficiencyDetail: 'Water is present on the floor.',
        deficiencyCriteria: 'Water on the floor not associated with a sink, water heater, or drain, should be recorded under the appropriate leak category. Water on the floor can be recorded here.'
      }
    ]
  },
  {
    name: 'Foundation',
    deficiencies: [
      {
        id: 'found_1',
        category: 'Foundation',
        deficiencySelected: 'The foundation is deteriorated (e.g., spalling, cracking, or exposed rebar).',
        deficiencyDetail: 'The foundation is deteriorated (e.g., spalling, cracking, or exposed rebar).',
        deficiencyCriteria: 'Cracks measuring less than 1/8", wear from normal use, or cosmetic blemishes are not a deficiency. e.g. exposed rebar.'
      }
    ]
  },
  {
    name: 'Hazard',
    deficiencies: [
      {
        id: 'haz_1',
        category: 'Hazard',
        deficiencySelected: 'The hazard may cause physical harm and cannot be recategorized.',
        deficiencyDetail: 'The hazard may cause physical harm and cannot be recategorized.',
        deficiencyCriteria: 'If a hazard can be recategorized, it should be recorded in that category or item (e.g., exposed wiring, tripping hazard, broken glass, protruding object, biological infestation, presence of lead). Do not duplicate in two categories.'
      }
    ]
  },
  {
    name: 'HVAC',
    deficiencies: [
      {
        id: 'hvac_1',
        category: 'HVAC',
        deficiencySelected: 'The HVAC system does not produce adequate heat or cooling.',
        deficiencyDetail: 'The HVAC system does not produce adequate heat or cooling.',
        deficiencyCriteria: 'Check thermostat operation and settings; verify heating or cooling based on season. Document inability to achieve adequate temperature.'
      },
      {
        id: 'hvac_2',
        category: 'HVAC',
        deficiencySelected: 'The HVAC system is contaminated (e.g., mold, debris, infestation).',
        deficiencyDetail: 'The HVAC system is contaminated (e.g., mold, debris, infestation).',
        deficiencyCriteria: 'Contamination including mold, debris, and vermin intrusion. Excessively dirtiness of heat pump condenser coils or evaporator coils.'
      },
      {
        id: 'hvac_3',
        category: 'HVAC',
        deficiencySelected: 'The HVAC system is damaged or is not secured.',
        deficiencyDetail: 'The HVAC system is damaged or is not secured.',
        deficiencyCriteria: 'HVAC system or component is damaged or not secured (impacts functionality or purpose). Improperly installed HVAC system or component.'
      },
      {
        id: 'hvac_4',
        category: 'HVAC',
        deficiencySelected: 'The filter is missing or excessively dirty, and the HVAC system is otherwise functional.',
        deficiencyDetail: 'The filter is missing or excessively dirty, and the HVAC system is otherwise functional.',
        deficiencyCriteria: 'Record if the filter is missing or too dirty to determine if it obstructs airflow (over 50% dirtiness).'
      }
    ]
  },
  {
    name: 'Leak (Gas or Oil)',
    deficiencies: [
      {
        id: 'leak_gas_1',
        category: 'Leak (Gas or Oil)',
        deficiencySelected: 'Gas or oil odor is present.',
        deficiencyDetail: 'Gas or oil odor is present.',
        deficiencyCriteria: 'Strong odor of gas or oil is present. Use appropriate safety measures.'
      }
    ]
  },
  {
    name: 'Leak (Sewage)',
    deficiencies: [
      {
        id: 'leak_sewage_1',
        category: 'Leak (Sewage)',
        deficiencySelected: 'Sewage backs up from the plumbing fixture drain or exhaust trap or floor drain.',
        deficiencyDetail: 'Sewage backs up from the plumbing fixture drain or exhaust trap or floor drain.',
        deficiencyCriteria: 'Sewage backup at the time of inspection, confirmed by odor or visual observation. Prior evidence of backup should be recorded in mold or hazard.'
      }
    ]
  },
  {
    name: 'Leak (Water)',
    deficiencies: [
      {
        id: 'leak_water_1',
        category: 'Leak (Water)',
        deficiencySelected: 'Evidence of a prior leak exists.',
        deficiencyDetail: 'Evidence of a prior leak exists.',
        deficiencyCriteria: 'Evidence of a water leak or infiltration that is not actively leaking at time of inspection (e.g., efflorescence, water staining, or discoloration).'
      },
      {
        id: 'leak_water_2',
        category: 'Leak (Water)',
        deficiencySelected: 'Water is actively leaking or infiltrating, excluding condensation or is associated with mold at the leak source (i.e., at the water entry point).',
        deficiencyDetail: 'Water is actively leaking or infiltrating, excluding condensation or is associated with mold at the leak source (i.e., at the water entry point).',
        deficiencyCriteria: 'Water leaks onto the floor should be assessed in Floor. Condensation or planned on-off cycling (such as HVAC systems) is not a deficiency.'
      }
    ]
  },
  {
    name: 'Lighting',
    deficiencies: [
      {
        id: 'light_1',
        category: 'Lighting',
        deficiencySelected: 'The interior or exterior lighting is not functioning.',
        deficiencyDetail: 'The interior or exterior lighting is not functioning.',
        deficiencyCriteria: 'Interior lighting (e.g., ceiling fixture, sconce). Exterior lighting for building entry. If the fixture has more than one bulb, at least one (1) must be working.'
      }
    ]
  },
  {
    name: 'Mold',
    deficiencies: [
      {
        id: 'mold_1',
        category: 'Mold',
        deficiencySelected: 'Mold is present.',
        deficiencyDetail: 'Mold is present.',
        deficiencyCriteria: 'Confirms the presence of mold. Identify the location. Try to link to leak source (if applicable).'
      }
    ]
  },
  {
    name: 'Paint',
    deficiencies: [
      {
        id: 'paint_1',
        category: 'Paint',
        deficiencySelected: 'The paint surface is contaminated (e.g., dirt, grease, or biological growth).',
        deficiencyDetail: 'The paint surface is contaminated (e.g., dirt, grease, or biological growth).',
        deficiencyCriteria: 'Contamination includes dirt, grease, biological growth, mold, mildew.'
      },
      {
        id: 'paint_2',
        category: 'Paint',
        deficiencySelected: 'The paint surface is deteriorated (e.g., peeling, chipping, cracking, flaking, blistering).',
        deficiencyDetail: 'The paint surface is deteriorated (e.g., peeling, chipping, cracking, flaking, blistering).',
        deficiencyCriteria: 'Deterioration includes peeling, chipping, cracking, flaking, or blistering to the extent that it impacts health and safety.'
      }
    ]
  },
  {
    name: 'Railings',
    deficiencies: [
      {
        id: 'rail_1',
        category: 'Railings',
        deficiencySelected: 'A handrail is damaged or not secured.',
        deficiencyDetail: 'A handrail is damaged or not secured.',
        deficiencyCriteria: 'Handrail or guard is damaged (impacting functionality or safety) or is not properly secured.'
      },
      {
        id: 'rail_2',
        category: 'Railings',
        deficiencySelected: 'A top railing or handrail is missing.',
        deficiencyDetail: 'A top railing or handrail is missing.',
        deficiencyCriteria: 'A top railing or handrail is missing on stairs with four (4) or more risers, a landing, or a balcony.'
      },
      {
        id: 'rail_3',
        category: 'Railings',
        deficiencySelected: 'An opening measures more than 6" (six inches).',
        deficiencyDetail: 'An opening measures more than 6" (six inches).',
        deficiencyCriteria: 'Measure the diagonal distance for guards required by local code at the time of construction. If the diagonal measures greater than 6", it is a deficiency.'
      },
      {
        id: 'rail_4',
        category: 'Railings',
        deficiencySelected: 'An opening measures more than 4" (four inches).',
        deficiencyDetail: 'An opening measures more than 4" (four inches).',
        deficiencyCriteria: 'Measure the diagonal distance for guards. If the diagonal measures greater than 4", it is a deficiency (for construction newer than year 2000).'
      }
    ]
  },
  {
    name: 'Sink',
    deficiencies: [
      {
        id: 'sink_1',
        category: 'Sink',
        deficiencySelected: 'The sink is cracked and leaking, or stopper is missing or damaged.',
        deficiencyDetail: 'The sink is cracked and leaking, or stopper is missing or damaged.',
        deficiencyCriteria: 'Sink is cracked or broken and is currently leaking, or the drain stopper is missing or damaged (not functional).'
      }
    ]
  },
  {
    name: 'Steps or Stairs',
    deficiencies: [
      {
        id: 'steps_1',
        category: 'Steps or Stairs',
        deficiencySelected: 'The step or stair treads or risers are damaged or deteriorated.',
        deficiencyDetail: 'The step or stair treads or risers are damaged or deteriorated.',
        deficiencyCriteria: 'Treads, risers, or nosing are damaged and impacts function or safety.'
      }
    ]
  },
  {
    name: 'Structural',
    deficiencies: [
      {
        id: 'struct_1',
        category: 'Structural',
        deficiencySelected: 'The structure is sloping, sagging, or deflected.',
        deficiencyDetail: 'The structure is sloping, sagging, or deflected.',
        deficiencyCriteria: 'Visible evidence of sagging, deflection, or bulging (e.g., floors, roofs, walls, ceiling, beams, columns, steps/stairs).'
      },
      {
        id: 'struct_2',
        category: 'Structural',
        deficiencySelected: 'The structure is damaged.',
        deficiencyDetail: 'The structure is damaged.',
        deficiencyCriteria: 'Structural component is damaged and requires repair or replacement. Cracks measuring less than 1/8", wear from normal use, or cosmetic blemishes are not a deficiency.'
      }
    ]
  },
  {
    name: 'Ventilation',
    deficiencies: [
      {
        id: 'vent_1',
        category: 'Ventilation',
        deficiencySelected: 'Bathroom ventilation is not functional.',
        deficiencyDetail: 'Bathroom ventilation is not functional.',
        deficiencyCriteria: 'Bathroom does not have a window or a functional exhaust fan. Fan may be inoperable, excessively dirty, or disconnected.'
      },
      {
        id: 'vent_2',
        category: 'Ventilation',
        deficiencySelected: 'Dryer ventilation is not functional.',
        deficiencyDetail: 'Dryer ventilation is not functional.',
        deficiencyCriteria: 'Dryer vent is disconnected, damaged, or obstructed preventing proper exhaust.'
      },
      {
        id: 'vent_3',
        category: 'Ventilation',
        deficiencySelected: 'Kitchen ventilation is not functional.',
        deficiencyDetail: 'Kitchen ventilation is not functional.',
        deficiencyCriteria: 'Kitchen does not have a window or a functional exhaust fan or range hood. Fan may be inoperable, excessively dirty, or disconnected.'
      }
    ]
  },
  {
    name: 'Wall',
    deficiencies: [
      {
        id: 'wall_1',
        category: 'Wall',
        deficiencySelected: 'The wall is damaged.',
        deficiencyDetail: 'The wall is damaged.',
        deficiencyCriteria: 'Wall is damaged and impairs usability. Damage could be a hole, crack, missing piece, or puncture. Cracks measuring less than 1/8", wear from normal use, or cosmetic blemishes are not a deficiency.'
      },
      {
        id: 'wall_2',
        category: 'Wall',
        deficiencySelected: 'An opening or gap measures greater than 1/2" at the wall where a pipe, duct, or vent penetrates.',
        deficiencyDetail: 'An opening or gap measures greater than 1/2" at the wall where a pipe, duct, or vent penetrates.',
        deficiencyCriteria: 'Opening or gap measuring greater than 1/2" where a pipe, duct, or vent penetrates a wall, floor, or ceiling may create a pest entry point.'
      }
    ]
  },
  {
    name: 'Water Heater',
    deficiencies: [
      {
        id: 'wh_1',
        category: 'Water Heater',
        deficiencySelected: 'Evidence of corrosion is present on the water heater.',
        deficiencyDetail: 'Evidence of corrosion is present on the water heater.',
        deficiencyCriteria: 'Corrosion is present on the water heater tank or pipes.'
      },
      {
        id: 'wh_2',
        category: 'Water Heater',
        deficiencySelected: 'The relief valve is inoperable.',
        deficiencyDetail: 'The relief valve is inoperable.',
        deficiencyCriteria: 'Temperature and pressure relief valve (T&P valve) is inoperable, damaged, or missing.'
      },
      {
        id: 'wh_3',
        category: 'Water Heater',
        deficiencySelected: 'The water heater is damaged or not secured.',
        deficiencyDetail: 'The water heater is damaged or not secured.',
        deficiencyCriteria: 'Water heater is damaged (impacts functionality or purpose) or is not properly secured.'
      }
    ]
  },
  {
    name: 'Window',
    deficiencies: [
      {
        id: 'win_1',
        category: 'Window',
        deficiencySelected: 'The window is cracked or broken.',
        deficiencyDetail: 'The window is cracked or broken.',
        deficiencyCriteria: 'Window pane is cracked or broken. Small chips measuring less than 1/8" are not a deficiency.'
      },
      {
        id: 'win_2',
        category: 'Window',
        deficiencySelected: 'The window does not function as intended.',
        deficiencyDetail: 'The window does not function as intended.',
        deficiencyCriteria: 'Double-hung or sliding windows must open at least 60% in at least one direction. Frame or sash is damaged such that the window cannot close or lock.'
      },
      {
        id: 'win_3',
        category: 'Window',
        deficiencySelected: 'The window is not weathertight.',
        deficiencyDetail: 'The window is not weathertight.',
        deficiencyCriteria: 'Weatherstripping is missing, deteriorated, or not functioning such that the window is not weathertight (e.g., weather infiltration, daylight, missing pane).'
      }
    ]
  },
  {
    name: 'General Comment',
    deficiencies: [
      {
        id: 'general_1',
        category: 'General comment',
        deficiencySelected: 'Housekeeping / No access / Resident refusal',
        deficiencyDetail: 'Housekeeping / No access / Resident refusal',
        deficiencyCriteria: 'Housekeeping / No access / Resident refusal'
      }
    ]
  }
];

// Export category names for easy access
export const UNIT_CATEGORY_NAMES = UNIT_DEFICIENCIES.map(cat => cat.name);

// Helper function to get deficiencies by category
export const getDeficienciesByCategory = (categoryName: string): UnitDeficiency[] => {
  const category = UNIT_DEFICIENCIES.find(cat => cat.name === categoryName);
  return category?.deficiencies || [];
};
