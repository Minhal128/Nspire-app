// NSPIRE Deficiency Mapping for INSIDE Location - Mapped from JSON
// Total Categories: 35+

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
// 1. Cabinet and Storage (Pantry, Laundry)
// ==========================================
export const CABINET_STORAGE_PANTRY_INSIDE: ItemDeficiencies = {
  itemName: 'Cabinet and Storage (Pantry, Laundry)',
  deficiencies: [
    {
      id: 'cab_pantry_1',
      name: 'Pantry, Food storage space is not present.',
      detail: 'Food, sanitation, and household supplies, evidence of previously installed, damaged or missing components.',
      criteria: 'Stowed items, including food, sanitation, and household supplies.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CAB-PANTRY-01'
    }
  ]
};

// ==========================================
// 2. Call-for-Aid System
// ==========================================
export const CALL_FOR_AID_SYSTEM_INSIDE: ItemDeficiencies = {
  itemName: 'Call-for-Aid System',
  deficiencies: [
    {
      id: 'call_aid_1',
      name: 'System does not function properly.',
      detail: 'A call-for-Aid system does not emit sound or light or send signal to annunciator.',
      criteria: 'The annunciator does not indicate the correct corresponding room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CALL-AID-01'
    },
    {
      id: 'call_aid_2',
      name: 'The system is blocked, or the pull cord is higher than 6 inches off the floor.',
      detail: 'Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.',
      criteria: 'The pull cord end is positioned more than 6 inches above the floor.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CALL-AID-02'
    }
  ]
};

// ==========================================
// 3. Carbon Monoxide Alarm
// ==========================================
export const CARBON_MONOXIDE_ALARM_INSIDE: ItemDeficiencies = {
  itemName: 'Carbon Monoxide Alarm',
  deficiencies: [
    {
      id: 'co_alarm_1',
      name: 'Carbon monoxide alarm does not produce audio or visual alarm when tested.',
      detail: 'Carbon monoxide alarm, inoperable.',
      criteria: 'With or without a battery, including low-volume.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CO-ALARM-01'
    },
    {
      id: 'co_alarm_2',
      name: 'Carbon monoxide alarm is missing, not installed, or not installed in the proper location.',
      detail: 'The building contains a fuel-burning appliance or fuel-burning system, carbon monoxide alarm is missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Unit or sleeping area is located one (1) story or less above or below an attached private garage that does not have natural ventilation or is enclosed and does not have a ventilation system for vehicle exhaust.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CO-ALARM-02'
    },
    {
      id: 'co_alarm_3',
      name: 'Carbon monoxide alarm is obstructed.',
      detail: 'Carbon monoxide alarm is obstructed.',
      criteria: 'The carbon monoxide alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CO-ALARM-03'
    }
  ]
};

// ==========================================
// 4. Ceiling
// ==========================================
export const CEILING_INSIDE: ItemDeficiencies = {
  itemName: 'Ceiling',
  deficiencies: [
    {
      id: 'ceiling_1',
      name: 'The ceiling component(s) is not functionally adequate.',
      detail: 'The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under Structural deficiency.',
      criteria: 'Does not allow ceiling to enclose a room, protect shaft or circulation space, create enclosure of and separation between spaces, control the diffusion of light and sound around a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CEILING-01'
    },
    {
      id: 'ceiling_2',
      name: 'Ceiling has a hole.',
      detail: 'Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.',
      criteria: 'Opens directly to the outside light regardless of the size or the ceiling has a damaged opening>2".',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CEILING-02'
    },
    {
      id: 'ceiling_3',
      name: 'The ceiling has an unstable surface (bulging, buckling).',
      detail: 'There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).',
      criteria: 'Unstable surfaces (e.g., drywall, gypsum, or ceiling tiles are missing or detached, or the presence of bubbling, deflection, loose joint tape, or loose panels). Water infiltration should be evaluated under the \'Leak Water\' category deficiency.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'CEILING-03'
    }
  ]
};

// ==========================================
// 5. Chimney (Inside)
// ==========================================
export const CHIMNEY_INSIDE: ItemDeficiencies = {
  itemName: 'Chimney',
  deficiencies: [
    {
      id: 'chim_in_1',
      name: 'Visually accessible and observed.',
      detail: 'A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.',
      criteria: 'Fireplace or fire burning appliance is not intentionally decommissioned.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'CHIM-IN-01'
    }
  ]
};

// ==========================================
// 6. Clothes Dryer Exhaust Ventilation (Inside)
// ==========================================
export const CLOTHES_DRYER_EXHAUST_INSIDE: ItemDeficiencies = {
  itemName: 'Clothes Dryer Exhaust Ventilation',
  deficiencies: [
    {
      id: 'dryer_in_1',
      name: 'Dryer transition duct is constructed of unsuitable material.',
      detail: 'Dryer transition duct is not constructed of metal or an approved material.',
      criteria: 'Dryer is being used indoor.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-01'
    },
    {
      id: 'dryer_in_2',
      name: 'Electrical dryer exhaust ventilation has restricted airflow.',
      detail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-02'
    },
    {
      id: 'dryer_in_3',
      name: 'Electric dryer transition duct is detached or missing.',
      detail: 'Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Dryer transition duct is not securely attached.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRYER-IN-03'
    },
    {
      id: 'dryer_in_4',
      name: 'Gas dryer exhaust ventilation system has restricted airflow.',
      detail: 'Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
      criteria: 'Airflow may be restricted.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DRYER-IN-04'
    },
    {
      id: 'dryer_in_5',
      name: 'Gas dryer transition duct is detached or missing',
      detail: 'Gas dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).',
      criteria: 'Dryer transition duct is not securely attached.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DRYER-IN-05'
    }
  ]
};

// ==========================================
// 7. Door (Inside - General)
// ==========================================
export const DOOR_INSIDE: ItemDeficiencies = {
  itemName: 'Door',
  deficiencies: [
    {
      id: 'door_in_1',
      name: 'Entry door cannot be secured.',
      detail: 'Entry door cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Installed locks can not be engaged from both sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-IN-01'
    },
    {
      id: 'door_in_2',
      name: 'Entry door component is damage inoperable or missing and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
      detail: 'Entry door component is inoperable, missing, and it does not limit the door\'s ability to provide privacy or protection from weather or infestation.',
      criteria: 'A hole ¼ inch or greater in diameter or a split or crack ¼ inch or greater in width that penetrates through the door. Or a hole or a crack with separation is present, or the glass is missing within the door, side lights, or transom.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-IN-02'
    },
    {
      id: 'door_in_3',
      name: 'The entry door frame, threshold, or trim is damaged.',
      detail: 'The entry door frame, threshold, or trim is damaged or missing (i.e. visibly defective; impacts functionality).',
      criteria: 'Observed evidence of prior installation, now missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-IN-03'
    },
    {
      id: 'door_in_4',
      name: 'Entry door is missing',
      detail: 'Evidence of prior installation',
      criteria: 'Not present or is incomplete.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-IN-04'
    }
  ]
};

// ==========================================
// 8. Door - Entry (Inside)
// ==========================================
export const DOOR_ENTRY_INSIDE: ItemDeficiencies = {
  itemName: 'Door - Entry',
  deficiencies: [
    {
      id: 'door_entry_1',
      name: 'Entry door seal, gasket, or stripping is damaged, inoperable or missing.',
      detail: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
      criteria: 'Seal, gasket, or stripping is damaged, inoperable, or missing, and there is either a gap of ¼ inch or more that allows light through or evidence of water penetration such as damage or dry rot around or under the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-01'
    },
    {
      id: 'door_entry_2',
      name: 'Self-closing mechanism is damaged, inoperable or damaged.',
      detail: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
      criteria: 'The self-closing mechanism is damaged. Or the self-closing mechanism does not pull the door closed and engage the latch. Or The self-closing mechanism is missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-02'
    },
    {
      id: 'door_entry_3',
      name: 'Entry door surface is delaminated or separated.',
      detail: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
      criteria: 'There is delamination or separation of the door surface 2 inches wide or greater. Or There is delamination or separation that affects the integrity of the door.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-03'
    },
    {
      id: 'door_entry_4',
      name: 'Entry door will not close.',
      detail: 'Entry door does not close (i.e., door seats in frame).',
      criteria: 'Entry door does not close (i.e., door seats in frame).',
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
      detail: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
      criteria: 'Crack, split, separation, or hole1/4 inch or greater in diameter penetrating through the door or door sides.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-ENTRY-06'
    }
  ]
};

// ==========================================
// 9. Door – Fire Labeled (Inside)
// ==========================================
export const DOOR_FIRE_LABELED_INSIDE: ItemDeficiencies = {
  itemName: 'Door – Fire Labeled',
  deficiencies: [
    {
      id: 'door_fire_1',
      name: 'An object is present that may prevent the fire-labeled door from closing and latching or self-closing and latching.',
      detail: 'An object is present that may prevent the fire-labeled door from closing and latching. Or An object is present that may prevent the fire-labeled door from self-closing and latching.',
      criteria: 'An object is present that may prevent the fire-labeled door from closing and latching. Or An object is present that may prevent the fire-labeled door from self-closing and latching.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-01'
    },
    {
      id: 'door_fire_2',
      name: 'Fire-labeled door assembly has a hole of any size.',
      detail: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
      criteria: 'A fire-labeled door assembly has a hole of any size. Or A fire-labeled door assembly is damaged (i.e., visibly defective; impacts functionality) such that its integrity may be compromised.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-02'
    },
    {
      id: 'door_fire_3',
      name: 'Fire - labeled door cannot be secured.',
      detail: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
      criteria: 'Fire-labeled door that serves as an entry door (i.e., a door that provides a means of access to the unit from the inside or outside) cannot be secured (i.e., access controlled) by at least one installed lock.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-FIRE-03'
    },
    {
      id: 'door_fire_4',
      name: 'Fire - labeled door does not close and latch. OR is damaged or missing such that the door does not self-close and latch.',
      detail: 'Fire - labeled door does not close and latch. OR fire - labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
      criteria: 'Fire - labeled door does not close and latch. OR fire - labeled door self-closing hardware is damaged or missing such that the door does not self-close and latch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-04'
    },
    {
      id: 'door_fire_5',
      name: 'Fire-labeled door does not open.',
      detail: 'Fire-labeled door does not open, which that it may limit access between spaces.',
      criteria: 'Fire-labeled door does not open, which that it may limit access between spaces.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-05'
    },
    {
      id: 'door_fire_6',
      name: 'Fire-labeled door is missing.',
      detail: '(i.e., Evidence of prior installation, but now not present or is incomplete).',
      criteria: '(i.e., Evidence of prior installation, but now not present or is incomplete).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'DOOR-FIRE-06'
    },
    {
      id: 'door_fire_7',
      name: 'Fire-labeled door seal or gasket is damaged.',
      detail: 'Fire - labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Fire - labeled door seal or gasket is damaged, impacts functionality. Or fire labeled door seal or gasket is missing (i.e. evidence of prior installation, but now not present or is incomplete).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'DOOR-FIRE-07'
    }
  ]
};

// ==========================================
// 10. Door-General (Inside)
// ==========================================
export const DOOR_GENERAL_INSIDE: ItemDeficiencies = {
  itemName: 'Door-General',
  deficiencies: [
    {
      id: 'door_gen_1',
      name: 'Passage door component is damaged, inoperable, or missing, and the door is not functionally adequate.',
      detail: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
      criteria: 'A passage door is deficient if a component is damaged, inoperable, or missing, and the door cannot adequately provide privacy, room separation, or control the physical atmosphere.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-GEN-01'
    },
    {
      id: 'door_gen_2',
      name: 'A passage door (door into utility room, storage or closet room, or laundry room) does not open.',
      detail: 'A passage door does not open such that it may limit access when needed.',
      criteria: 'A passage door does not open such that it may limit access when needed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DOOR-GEN-02'
    },
    {
      id: 'door_gen_3',
      name: 'A passage door, which is not intended to permit access between rooms, has a damaged component, inoperable or missing, or damaged components.',
      detail: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      criteria: 'A non-access passage door is damaged, inoperable, or missing a component—affecting its intended function.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'DOOR-GEN-03'
    }
  ]
};

// ==========================================
// 11. Garage Door (Inside)
// ==========================================
export const GARAGE_DOOR_INSIDE: ItemDeficiencies = {
  itemName: 'Garage Door',
  deficiencies: [
    {
      id: 'garage_in_1',
      name: 'Garage door does not open, close, or remains closed.',
      detail: 'Door will not open and remain open, does not function adequately.',
      criteria: 'Door will not open and remain open, does not function adequately.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GARAGE-IN-01'
    },
    {
      id: 'garage_in_2',
      name: 'The garage door has a hole (broken panel or window).',
      detail: 'Garage door has a hole of any size that penetrates through to the interior.',
      criteria: 'Garage door has a hole of any size that penetrates through to the interior.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GARAGE-IN-02'
    }
  ]
};

// ==========================================
// 12. Drainage (Inside)
// ==========================================
export const DRAINAGE_INSIDE: ItemDeficiencies = {
  itemName: 'Drainage',
  deficiencies: [
    {
      id: 'drain_in_1',
      name: 'Drain/Floor drain',
      detail: 'The drain is fully blocked.',
      criteria: 'There is a problem with the drainage.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'DRAIN-IN-01'
    }
  ]
};

// ==========================================
// 13. Egress (Inside)
// ==========================================
export const EGRESS_INSIDE: ItemDeficiencies = {
  itemName: 'Egress',
  deficiencies: [
    {
      id: 'egress_in_1',
      name: 'Obstructed means of egress',
      detail: 'The exit access or exit is obstructed. 1. Exit access - path from any interior location to an exit. 2. Exit doors to the outside and enclosed exit stairways.',
      criteria: 'Double-key Cylinder deadbolt locks or security features requiring a key, tool, or special effort from the stress side are not allowed on exit doors, exit access doors, or egress windows. Fixed or movable security bars must not block designated egress points, and no furniture or items may obstruct the means of egress.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'EGRESS-IN-01'
    }
  ]
};

// ==========================================
// 14. Electrical (Inside)
// ==========================================
export const ELECTRICAL_INSIDE: ItemDeficiencies = {
  itemName: 'Electrical',
  deficiencies: [
    {
      id: 'elec_in_1',
      name: 'Conductor-Outlet, and Switch',
      detail: 'The electrical conductor is not enclosed or properly insulated (e.g., damaged or missing sheathing that exposes the insulated wiring or conductor, an open port, a missing knockout, a missing outlet or switch cover, or a missing breaker or fuse). OR An opening or gap is present and measures greater than 1/2".',
      criteria: 'Electrical conductors must be enclosed and insulated, with no exposed wiring, open ports, missing covers, or gaps over 1/2"; missing light bulbs are evaluated under interior or exterior lighting.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-IN-01'
    },
    {
      id: 'elec_in_2',
      name: 'The outlet does not have visible damage, and testing indicates that it is not energized.',
      detail: 'An outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) does not have visible damage and testing indicates that it is not energized.',
      criteria: 'An outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) does not have visible damage and testing indicates that it is not energized.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-IN-02'
    },
    {
      id: 'elec_in_3',
      name: 'The outlet or switch is damaged.',
      detail: 'Any portion of a visually accessible (i.e., can be reasonably accessed and observed) outlet or switch is damaged (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
      criteria: 'Any portion of a visually accessible (i.e., can be reasonably accessed and observed) outlet or switch is damaged (i.e., visibly defective; impacts functionality) such that it may not safely carry or control electrical current at the outlet or switch.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-IN-03'
    },
    {
      id: 'elec_in_4',
      name: 'Testing of a three-pronged outlet indicates that it is not wired correctly or grounded.',
      detail: 'Testing of a three-pronged outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) indicates that it is not properly wired or grounded.',
      criteria: 'Testing of a three-pronged outlet that is reasonably accessible (i.e., can be reached without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or property) indicates that it is not properly wired or grounded.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-IN-04'
    },
    {
      id: 'elec_in_5',
      name: 'Water is currently in contact with an electrical conductor.',
      detail: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
      criteria: 'Water is currently in contact with an electrical conductor. Check for the source (water infiltration from the ceiling or inside of the wall).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-IN-05'
    }
  ]
};

// ==========================================
// 15. Electrical-(GFCI) Or (AFCI)-Outlet or Breaker (Inside)
// ==========================================
export const ELECTRICAL_GFCI_AFCI_INSIDE: ItemDeficiencies = {
  itemName: 'Electrical-(GFCI) Or (AFCI)-Outlet or Breaker',
  deficiencies: [
    {
      id: 'elec_gfci_afci_1',
      name: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable.',
      detail: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'AFCI outlet or AFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-GFCI-AFCI-01'
    },
    {
      id: 'elec_gfci_afci_2',
      name: 'Unprotected outlet is present within six feet of a water source.',
      detail: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
      criteria: 'An outlet, not GFCI-protected, is present within six feet of a water source (i.e., sink, bathtub, shower, water faucet, toilet) located in the same room. An outlet deigned for major appliances, when in use, is not evaluated under this category.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-GFCI-AFCI-02'
    },
    {
      id: 'elec_gfci_afci_3',
      name: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable',
      detail: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      criteria: 'GFCI outlet or GFCI breaker does not have visible damage and the test or reset button is inoperable (i.e., overall system or component thereof is not meeting function or purpose).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-GFCI-AFCI-03'
    }
  ]
};

// ==========================================
// 16. Electrical Service Panel (Inside)
// ==========================================
export const ELECTRICAL_SERVICE_PANEL_INSIDE: ItemDeficiencies = {
  itemName: 'Electrical Service Panel',
  deficiencies: [
    {
      id: 'elec_panel_in_1',
      name: 'Electrical service panel is not reasonably accessible.',
      detail: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property). Or it is looked or in locked location, no key to access.',
      criteria: 'The electrical service panel is not reasonably accessible (i.e., it cannot be reached and opened without moving obstructions, dismantling, destructive measures, or actions that may pose a risk to persons or their personal property). Or it is looked or in locked location, no key to access.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'ELEC-PANEL-IN-01'
    },
    {
      id: 'elec_panel_in_2',
      name: 'The overcurrent protection device is contaminated.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is contaminated (e.g., water, rust, corrosion, infestation, or foreign materials).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEC-PANEL-IN-02'
    },
    {
      id: 'elec_panel_in_3',
      name: 'The overcurrent protection device is damaged.',
      detail: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an over current condition (i.e., paint, or other foreign materials).',
      criteria: 'The overcurrent protection device (i.e., fuse or breaker) is damaged (i.e., visibly defective; impacts functionality) such that it may not interrupt the circuit during an over current condition (i.e., paint, or other foreign materials).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'ELEC-PANEL-IN-03'
    }
  ]
};

// ==========================================
// 17. Elevator (Inside)
// ==========================================
export const ELEVATOR_INSIDE: ItemDeficiencies = {
  itemName: 'Elevator',
  deficiencies: [
    {
      id: 'elevator_1',
      name: 'Elevator Cab is not level with the floor.',
      detail: 'Poses tripping hazards.',
      criteria: 'There is more than 3/4 inch difference in level between the elevator cab and the building floor.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEVATOR-01'
    },
    {
      id: 'elevator_2',
      name: 'The elevator door does not fully open or close.',
      detail: 'The elevator door does not fully open (at least 36 inches) and does not close.',
      criteria: 'All elevators must be in working condition.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEVATOR-02'
    },
    {
      id: 'elevator_3',
      name: 'Elevator is inoperable.',
      detail: 'Elevator is inoperable (i.e. overall system or component thereof not meeting function or purpose; with or without visible damage).',
      criteria: 'Elevator system or component thereof not meeting function or purpose.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEVATOR-03'
    },
    {
      id: 'elevator_4',
      name: 'Safety edge device has malfunctioned or is inoperable.',
      detail: 'The safety edge device hasd has malfunctioned or is not functionally adequate.',
      criteria: 'Overall, the system or a component thereof is not meeting its function or purpose.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'ELEVATOR-04'
    }
  ]
};

// ==========================================
// 18. Fire Safety (Inside)
// ==========================================
export const FIRE_SAFETY_INSIDE: ItemDeficiencies = {
  itemName: 'Fire Safety',
  deficiencies: [
    {
      id: 'fire_safety_in_1',
      name: 'Exit Sign',
      detail: 'The exit sign is damaged, missing, obstructed, or not adequately illuminated.',
      criteria: 'An exit sign is deficient if it\'s damaged, missing, obstructed so "EXIT" isn\'t clearly visible, or not adequately illuminated.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-SAFETY-IN-01'
    },
    {
      id: 'fire_safety_in_2',
      name: 'A fire extinguisher is damaged or missing.',
      detail: 'A fire extinguisher is damaged or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FIRE-SAFETY-IN-02'
    },
    {
      id: 'fire_safety_in_3',
      name: 'The fire extinguisher pressure gauge reads over or undercharged.',
      detail: 'Pressure gauge indicates that the fire extinguisher is over or under charged.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-SAFETY-IN-03'
    },
    {
      id: 'fire_safety_in_4',
      name: 'The fire extinguisher tag is missing or illegible or expired.',
      detail: 'The date on the service tag of any fire extinguisher has exceeded one year. OR The fire extinguisher tag is missing or illegible. OR A non-chargeable or disposable fire extinguisher is more than 12 years old (based on manufacture date).',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FIRE-SAFETY-IN-04'
    },
    {
      id: 'fire_safety_in_5',
      name: 'The flammable or combustible material is on or within 3 feet of an appliance that provides heat for thermal comfort or fuel-burning water heater. Or improperly stored chemical.',
      detail: 'Excluding heating oil in a heating oil tank, propane, gasoline, kerosene should never be stored in the Unit. Combustible item in its original container and stored in a safe place (e.g. under a kitchen sink cabinet, in a hall closet,etc.) is not a deficiency.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'FIRE-SAFETY-IN-05'
    }
  ]
};

// ==========================================
// 19. Smoke Alarm (Inside)
// ==========================================
export const SMOKE_ALARM_INSIDE: ItemDeficiencies = {
  itemName: 'Smoke Alarm',
  deficiencies: [
    {
      id: 'smoke_alarm_1',
      name: 'A required smoke alarm does not produce an audio or visual alarm when tested.',
      detail: 'A required smoke alarm does not emit visual or audio alarm or the alarm does not cease after testing.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'SMOKE-ALARM-01'
    },
    {
      id: 'smoke_alarm_2',
      name: 'Smoke alarm not installed where required.',
      detail: 'Smoke alarm not installed within a hallway in the vicinity of multiple units or classrooms on each level.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'SMOKE-ALARM-02'
    },
    {
      id: 'smoke_alarm_3',
      name: 'Smoke alarm is obstructed',
      detail: 'Smoke alarm is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SMOKE-ALARM-03'
    },
    {
      id: 'smoke_alarm_4',
      name: 'A required smoke alarm is not hardwired or a 10-year non-rechargeable, sealed, tamper-resistant, battery-powered smoke alarm device.',
      detail: 'If unable to determine if a required smoke alarm meets the requirement of this standard, consider the condition a deficiency.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SMOKE-ALARM-04'
    }
  ]
};

// ==========================================
// 20. Sprinkler Assembly (Inside)
// ==========================================
export const SPRINKLER_ASSEMBLY_INSIDE: ItemDeficiencies = {
  itemName: 'Sprinkler Assembly',
  deficiencies: [
    {
      id: 'sprinkler_in_1',
      name: 'The sprinkler assembly component is damaged, inoperable, or missing, and it is detrimental to performance.',
      detail: 'The sprinkler assembly component is damaged, inoperable or missing.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'SPRINKLER-IN-01'
    },
    {
      id: 'sprinkler_in_2',
      name: 'Sprinkler head assembly has evidence of corrosion.',
      detail: 'Sprinkler head assembly has evidence of corrosion.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SPRINKLER-IN-02'
    },
    {
      id: 'sprinkler_in_3',
      name: 'Sprinkler assembly has evidence of debris, paint, or foreign material detrimental to performance.',
      detail: 'Foreign material covers 50% or more of the sprinkler assembly or 50% or more of the glass bulb on the sprinkler assembly.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SPRINKLER-IN-03'
    },
    {
      id: 'sprinkler_in_4',
      name: 'Sprinkler head assembly is obstructed by an item, object, or encasement within 18 inches of the sprinkler head.',
      detail: '18 inches clearance is not due to feature within built (e.g. closet, utility closet).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SPRINKLER-IN-04'
    }
  ]
};

// ==========================================
// 21. Floor (Inside)
// ==========================================
export const FLOOR_INSIDE: ItemDeficiencies = {
  itemName: 'Floor',
  deficiencies: [
    {
      id: 'floor_1',
      name: 'Floor component(s) is not functionally adequate.',
      detail: 'Floor component(s) is not functionally adequate (i.e., does not allow floor to separate levels or to be walked on), functionality (e.g., wood rot, sloping,defelection).',
      criteria: 'Surface abnormalities may indicate the presence of deficiency t(i.e. lifting iles,tilers, hardwood cupping, linoleum bubbling, etc.).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FLOOR-01'
    },
    {
      id: 'floor_2',
      name: 'Floor substrate is exposed',
      detail: '10% or more of the floor substrate area is exposed in any room.',
      criteria: 'Repair is needed,',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FLOOR-02'
    }
  ]
};

// ==========================================
// 22. Foundation (Inside)
// ==========================================
export const FOUNDATION_INSIDE: ItemDeficiencies = {
  itemName: 'Foundation',
  deficiencies: [
    {
      id: 'found_in_1',
      name: 'Foundation exposed rebar or foundation is spalling, flaking, or chipping.',
      detail: 'The affected area is 12x12 inches or greater goes into the foundation at a depth of ¾ inch or greater.',
      criteria: 'Foundation exhibits a sign of failure, and it is not structural.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-IN-01'
    },
    {
      id: 'found_in_2',
      name: 'Foundation is cracked.',
      detail: 'Crack is present with a width of ¼ inch or greater and a length of 12 inches or greater.',
      criteria: 'Foundation cracks (e.g., cracks in walls, no functioning doors, unlevel floors or windows).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-IN-02'
    },
    {
      id: 'found_in_3',
      name: 'Foundation infiltrated by water.',
      detail: 'Evidence of water infiltration through the foundation through visual evaluation.',
      criteria: '(e.g., Excessive dampness, collected water, stains, or mineral deposits).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOUND-IN-03'
    },
    {
      id: 'found_in_4',
      name: 'Foundation support post, column, or girder area is damaged.',
      detail: 'Any support post, column, or girder area is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Foundation damage (e.g., rot) on support posts, columns, or girders.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOUND-IN-04'
    }
  ]
};

// ==========================================
// 23. Grab Bar (Inside)
// ==========================================
export const GRAB_BAR_INSIDE: ItemDeficiencies = {
  itemName: 'Grab Bar',
  deficiencies: [
    {
      id: 'grab_bar_1',
      name: 'The grab bar is not secured.',
      detail: 'Any movement whatsoever is detected in the grab bar.',
      criteria: 'Damaged, loose, or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GRAB-BAR-01'
    }
  ]
};

// ==========================================
// 24. Hazard (Inside)
// ==========================================
export const HAZARD_INSIDE: ItemDeficiencies = {
  itemName: 'Hazard',
  deficiencies: [
    {
      id: 'hazard_in_1',
      name: 'Infestation',
      detail: 'Evidence of bedbugs.',
      criteria: 'Evidence of bedbugs is found (i.e., live or dead bedbugs, feces, eggs, or blood trail).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZARD-IN-01'
    },
    {
      id: 'hazard_in_2',
      name: 'Evidence of cockroaches(dead).',
      detail: 'Evidence of cockroaches is found (i.e., dead or live cockroaches, shed skins, droppings (tiny black specks or smears), and egg cases).',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HAZARD-IN-02'
    },
    {
      id: 'hazard_in_3',
      name: 'Evidence of mice.',
      detail: 'Evidence of mice is found (i.e., a live or dead mouse or mice, droppings, chewed holes, or urine trails).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZARD-IN-03'
    },
    {
      id: 'hazard_in_4',
      name: 'Evidence of other pests.',
      detail: 'Evidence is present of other pest infestations, including but not limited to a trail of ants, wasps/beehives, squirrels, birds, and bats in an interior area. Pests are animals with potential impacts on residents health and safety.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HAZARD-IN-04'
    },
    {
      id: 'hazard_in_5',
      name: 'Evidence of rats.',
      detail: 'Evidence of rats is found (i.e., a live or dead rat or droppings, chewed holes).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZARD-IN-05'
    },
    {
      id: 'hazard_in_6',
      name: 'Extensive bedbugs infestation.',
      detail: 'Sighting of at least one live bedbug in two or more units or two rooms of the same unit during the daytime through visual assessment.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZARD-IN-06'
    },
    {
      id: 'hazard_in_7',
      name: 'Extensive cockroach infestation (live).',
      detail: 'Sighting of one or more live cockroaches in two or more area observed simultaneously during visual assessment on the inspection day.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HAZARD-IN-07'
    },
    {
      id: 'hazard_in_8',
      name: 'Extensive mouse infestation.',
      detail: 'Sighting of at least one live mouse in two or more, units or two rooms of the same unit during the daytime surface visual assessment.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZARD-IN-08'
    },
    {
      id: 'hazard_in_9',
      name: 'Extensive rat infestation.',
      detail: 'A live rat is seen in the unit.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HAZARD-IN-09'
    }
  ]
};

// ==========================================
// 25. LITTER (Inside)
// ==========================================
export const LITTER_INSIDE: ItemDeficiencies = {
  itemName: 'LITTER',
  deficiencies: [
    {
      id: 'litter_in_1',
      name: 'Litter is accumulated in an unassigned area.',
      detail: 'Litter is considered deficient if 10 or more small items or any large discarded items are found in a 10×10 ft area not designated for garbage.',
      criteria: '',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'LITTER-IN-01'
    }
  ]
};

// ==========================================
// 26. Sharp edges (Inside)
// ==========================================
export const SHARP_EDGES_INSIDE: ItemDeficiencies = {
  itemName: 'Sharp edges',
  deficiencies: [
    {
      id: 'sharp_in_1',
      name: 'A sharp edge that can result in a cut or puncture hazard is present, in the inside area include, but not limited to, broken glass, damaged tile with exposed edges, or a damaged handrail.',
      detail: 'A sharp edge that can result in a cut or puncture hazard that is likely to require emergency care (e.g., stitches) is present within the built environment (i.e., human-made structures, features, and facilities).',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'SHARP-IN-01'
    }
  ]
};

// ==========================================
// 27. Trip hazard (Inside)
// ==========================================
export const TRIP_HAZARD_INSIDE: ItemDeficiencies = {
  itemName: 'Trip hazard',
  deficiencies: [
    {
      id: 'trip_in_1',
      name: 'Trip hazard on walking surface.',
      detail: 'There is an abrupt change in vertical elevation or horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: - An unintended ¾ inch or greater vertical difference',
      criteria: 'horizontal separation on any walking surface along the normal path of travel, consisting of the following criteria: -An unintended 2-inch horizontal separation perpendicular to the path of travel.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'TRIP-IN-01'
    }
  ]
};

// ==========================================
// 28. Heating, Ventilation, and Air Conditioning (Inside)
// ==========================================
export const HVAC_INSIDE: ItemDeficiencies = {
  itemName: 'Heating, Ventilation, and Air Conditioning',
  deficiencies: [
    {
      id: 'hvac_in_1',
      name: 'Air conditioning system or device is not operational.',
      detail: 'The system or device does not turn on. OR System or device only produces hot or room temperature air.',
      criteria: '(e.g., a window unit or central air system)',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-IN-01'
    },
    {
      id: 'hvac_in_2',
      name: 'Combustion chamber cover or gas shutoff valve is missing from a combustion-fueled heating appliance. Heating system in tropical islands are excluded.',
      detail: 'Combustion chamber cover or gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete) from a combustion-fueled heating appliance.',
      criteria: 'a combustion chamber cover or gas shutoff valve was previously installed and is now not present or is incomplete.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-IN-02'
    },
    {
      id: 'hvac_in_3',
      name: 'Fuel-burning heating system or device exhaust vent is misaligned, blocked, disconnected, improperly connected, damaged or missing. Heating system in tropical islands are excluded.',
      detail: 'A fuel-burning heating system or device is present. And exhaust vent is misaligned, blocked, disconnected, or improperly connected through to the ceiling or wall. Or Exhaust vent is damaged (i.e., visibly defective; impacts functionality). OR Exhaust vent is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Not properly connected through to the ceiling or wall. Metal tape of any kind is not a substitute for improperly connected flue vent.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-IN-03'
    },
    {
      id: 'hvac_in_4',
      name: 'Heating system or device safety shield is damaged or missing.',
      detail: 'Heating system or device safety shield is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but is now not present or is incomplete).',
      criteria: 'Safety shield was previously installed and is now not present or is incomplete. Heating systems in tropical islands are excluded.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-IN-04'
    },
    {
      id: 'hvac_in_5',
      name: 'The inspection date is on or between April 1 and September 30, and a heating source is damaged, inoperable, missing, or not installed.',
      detail: 'A permanently installed heating source is damaged. OR a permanently installed heating source is inoperable, not meeting function or purpose, with or without visible damage. OR a permanently installed heating source is missing (i.e., evidence of prior installation but is now not present or is incomplete). OR A permanently installed heating source is not installed. And The outside temperature is below 68 degrees Fahrenheit',
      criteria: 'Permanently is affixed within the unit or building, safely connected to the unit or building electrical system, thermostatically controlled by the unit or building, and appropriate for the size of the unit or building. The energy source for a permanently heating system can be electric, gas, or oil (Boiler Chiller system). The heating systems in tropical islands are excluded.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HVAC-IN-05'
    },
    {
      id: 'hvac_in_6',
      name: 'The inspection date is on or between October 1 and March 31 and the permanently installed heating source is not working or the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
      detail: 'The inspection date is on or between October 1 and March 31. AND the permanently installed heating source is not working. OR the permanently installed heating source is working and the interior temperature is below 64 degrees Fahrenheit.',
      criteria: 'The permanently installed heating source is not working to create heat. Heating systems in tropical islands are excluded.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-IN-06'
    },
    {
      id: 'hvac_in_7',
      name: 'Unvented space heater is present.',
      detail: 'Unvented space heater that burns gas, oil, or kerosene is present',
      criteria: 'Inside, include any and all common areas.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'HVAC-IN-07'
    }
  ]
};

// ==========================================
// 29. Kitchen (Inside)
// ==========================================
export const KITCHEN_INSIDE: ItemDeficiencies = {
  itemName: 'Kitchen',
  deficiencies: [
    {
      id: 'kitchen_1',
      name: 'Cabinet and Storage',
      detail: 'Storage component is damaged, inoperable, or missing.',
      criteria: 'Some of the kitchen cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'KITCHEN-01'
    }
  ]
};

// ==========================================
// 30. Cooking Appliance (Inside)
// ==========================================
export const COOKING_APPLIANCE_INSIDE: ItemDeficiencies = {
  itemName: 'Cooking Appliance.',
  deficiencies: [
    {
      id: 'cooking_1',
      name: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
      detail: 'A burner does not produce heat, but at least one other burner is present on the cooking range or cooktop and does produce heat.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'COOKING-01'
    },
    {
      id: 'cooking_2',
      name: 'A cooking range, cooktop, or oven component, including the oven door seal is damaged or missing, making the device unsafe.',
      detail: 'Cooking range, cooktop, or oven component is missing (i.e., evidence of prior installation, but now not present or is incomplete) such that the device is unsafe for use.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'COOKING-02'
    },
    {
      id: 'cooking_3',
      name: 'Cooking range, cooktop, or oven does not ignite or produce heat.',
      detail: 'No burner on the cooking range or cooktop produces heat. OR The oven does not produce heat temperature.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'COOKING-03'
    }
  ]
};

// ==========================================
// 31. Food preparation Area (Inside)
// ==========================================
export const FOOD_PREPARATION_AREA_INSIDE: ItemDeficiencies = {
  itemName: 'Food preparation Area',
  deficiencies: [
    {
      id: 'food_prep_1',
      name: 'Food preparation area is damaged or is not functionally adequate.',
      detail: 'A kitchen countertop or food prep area is deficient if 10% or more of the surface is exposed substrate or if the space does not reasonably support adequate food preparation.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FOOD-PREP-01'
    },
    {
      id: 'food_prep_2',
      name: 'Food preparation area is not present.',
      detail: 'Countertop is missing (i.e., evidence of prior installation, but now not present or is incomplete) from the kitchen or food preparation space.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FOOD-PREP-02'
    }
  ]
};

// ==========================================
// 32. MOLD-LIKE SUBSTANCE (Inside)
// ==========================================
export const MOLD_LIKE_SUBSTANCE_INSIDE: ItemDeficiencies = {
  itemName: 'MOLD-LIKE SUBSTANCE',
  deficiencies: [
    {
      id: 'mold_1',
      name: 'Peeling Paint-Elevated moisture level.',
      detail: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-01'
    },
    {
      id: 'mold_2',
      name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: '',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'MOLD-02'
    },
    {
      id: 'mold_3',
      name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-03'
    },
    {
      id: 'mold_4',
      name: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
      detail: 'Cumulative area of patches is more than 4 square inches and less than one square foot in a room.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-04'
    }
  ]
};

// ==========================================
// 33. Refrigerator (Inside)
// ==========================================
export const REFRIGERATOR_INSIDE: ItemDeficiencies = {
  itemName: 'Refrigerator',
  deficiencies: [
    {
      id: 'fridge_1',
      name: 'Refrigerator component is damaged such that it impacts functionality.',
      detail: 'Refrigerator component is damaged (i.e., visibly defective) such that it impacts functionality.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'FRIDGE-01'
    },
    {
      id: 'fridge_2',
      name: 'Refrigerator is inoperable such that it may be unable to safely and adequately store food.',
      detail: 'Refrigerator is inoperable (i.e., overall system is not meeting function or purpose; with or without visible damage) such that it may be unable to safely and adequately store food',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'FRIDGE-02'
    }
  ]
};

// ==========================================
// 34. Sink (Inside - Kitchen)
// ==========================================
export const SINK_INSIDE: ItemDeficiencies = {
  itemName: 'Sink',
  deficiencies: [
    {
      id: 'sink_in_1',
      name: 'Cannot activate or deactivate hot and cold water.',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-IN-01'
    },
    {
      id: 'sink_in_2',
      name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
      detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: '',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SINK-IN-02'
    },
    {
      id: 'sink_in_3',
      name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-IN-03'
    },
    {
      id: 'sink_in_4',
      name: 'The sink is not draining, not functioning adequately.',
      detail: 'Water is not draining from the basin of the sink. slow or clogged drain.',
      criteria: '',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-IN-04'
    },
    {
      id: 'sink_in_5',
      name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
      detail: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete) and the sink is functionally adequate.',
      criteria: '',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-IN-05'
    },
    {
      id: 'sink_in_6',
      name: 'Water pressure, direction.',
      detail: 'Water pressure, direction is not adequately functional.',
      criteria: '',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-IN-06'
    }
  ]
};

// ==========================================
// 35. Ventilation - Kitchen (Inside)
// ==========================================
export const VENTILATION_KITCHEN_INSIDE: ItemDeficiencies = {
  itemName: 'Ventilation',
  deficiencies: [
    {
      id: 'vent_kitchen_1',
      name: 'The kitchen does not have ventilation, not present and operable.',
      detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
      criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-KITCHEN-01'
    },
    {
      id: 'vent_kitchen_2',
      name: 'Exhaust system component is damaged or missing.',
      detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-KITCHEN-02'
    },
    {
      id: 'vent_kitchen_3',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust vent inoperable.',
      criteria: 'Exhaust vent inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-KITCHEN-03'
    },
    {
      id: 'vent_kitchen_4',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-KITCHEN-04'
    }
  ]
};

// ==========================================
// 36. LEAK – Gas or Oil (Inside)
// ==========================================
export const LEAK_GAS_OIL_INSIDE: ItemDeficiencies = {
  itemName: 'LEAK – Gas or Oil',
  deficiencies: [
    {
      id: 'leak_gas_in_1',
      name: 'Natural gas, propane, or oil leak.',
      detail: 'There is evidence of a gas, propane, or oil leak, or there is an uncapped gas or fuel supply line.',
      criteria: 'Natural gas, propane, or oil leak.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-GAS-IN-01'
    }
  ]
};

// ==========================================
// 37. Leak-sewage system (Inside)
// ==========================================
export const LEAK_SEWAGE_INSIDE: ItemDeficiencies = {
  itemName: 'Leak-sewage system (Clogged drain)(Missing drain cap).',
  deficiencies: [
    {
      id: 'leak_sew_in_1',
      name: 'Blocked sewage system.',
      detail: 'Wastewater is unable to drain resulting in sewer backup.',
      criteria: 'Blocked sewage system.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-SEW-IN-01'
    },
    {
      id: 'leak_sew_in_2',
      name: 'The protective cap to drain. Or cleanout or pump cover is detached or missing.',
      detail: 'The cap to the cleanout or pump cover is detached or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Cap to the cleanout or pump cover is detached or missing.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-IN-02'
    },
    {
      id: 'leak_sew_in_3',
      name: 'Cleanout cap or riser is damaged.',
      detail: 'Cap to the cleanout or pump cover is detached or missing (i.e., visibly defective, impacts functionality).',
      criteria: 'Protective cap or riser is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LEAK-SEW-IN-03'
    },
    {
      id: 'leak_sew_in_4',
      name: 'Leak in sewage system.',
      detail: 'There is evidence of a sewer line or fitting leaking.',
      criteria: 'Leak in sewage system.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'LEAK-SEW-IN-04'
    }
  ]
};

// ==========================================
// 38. Leak- water (Inside)
// ==========================================
export const LEAK_WATER_INSIDE: ItemDeficiencies = {
  itemName: 'Leak- water',
  deficiencies: [
    {
      id: 'leak_water_in_1',
      name: 'Environmental water intrusion',
      detail: 'Water from the exterior environment is leaking into the interior.',
      criteria: 'Environmental water intrusion.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-IN-01'
    },
    {
      id: 'leak_water_in_2',
      name: 'Fluid is leaking from the sprinkler assembly.',
      detail: 'Fluid is leaking from the sprinkler assembly.',
      criteria: 'Fluid is leaking from the sprinkler assembly.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-IN-02'
    },
    {
      id: 'leak_water_in_3',
      name: 'Plumbing leak',
      detail: 'Failure of a plumbing system that allows for water intrusion in unintended areas.',
      criteria: 'Plumbing leak.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'LEAK-WATER-IN-03'
    }
  ]
};

// ==========================================
// 39. Lighting - Auxiliary (Inside)
// ==========================================
export const LIGHTING_AUXILIARY_INSIDE: ItemDeficiencies = {
  itemName: 'Lighting',
  deficiencies: [
    {
      id: 'light_aux_in_1',
      name: 'Lighting - Auxiliary',
      detail: 'Auxiliary lighting is damaged, missing or fail to illuminate when tested.',
      criteria: 'Auxiliary lighting is not present or not installed. Missing or fails to illuminate when tested.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-AUX-IN-01'
    }
  ]
};

// ==========================================
// 40. Lighting - Interior (Inside)
// ==========================================
export const LIGHTING_INTERIOR_INSIDE: ItemDeficiencies = {
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
      name: 'At least one (1) permanently installed light fixture is not present in the kitchen or restroom.',
      detail: 'Permanent lighting fixtures are missing or not functioning.',
      criteria: 'Permanent lighting fixtures are missing or not functioning.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'LIGHT-INT-03'
    }
  ]
};

// ==========================================
// 41. Mold (Inside)
// ==========================================
export const MOLD_INSIDE: ItemDeficiencies = {
  itemName: 'Mold',
  deficiencies: [
    {
      id: 'mold_cat_1',
      name: 'Mold - Like Substance',
      detail: 'Peeling paint, elevated moisture level.',
      criteria: 'Elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-CAT-01'
    },
    {
      id: 'mold_cat_2',
      name: 'Mold - Like Substance',
      detail: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'MOLD-CAT-02'
    },
    {
      id: 'mold_cat_3',
      name: 'Mold - Like Substance',
      detail: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      criteria: 'Cumulative area of patches is more than 1 square foot and less than 9 square feet in a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-CAT-03'
    },
    {
      id: 'mold_cat_4',
      name: 'Mold - Like Substance',
      detail: '4" or less-- Presence of mold-like substance at moderate level observed visually.',
      criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-CAT-04'
    }
  ]
};

// ==========================================
// 42. Paint - Potential Lead-Based Paint Hazards (Inside)
// ==========================================
export const PAINT_LEAD_INSIDE: ItemDeficiencies = {
  itemName: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  deficiencies: [
    {
      id: 'paint_in_1',
      name: 'Less than 2\'SF -Paint in a Unit or Inside the target property is deteriorated – below the level required for lead-safe work practices by a lead certified firm or for passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is less than or equal to 2 square feet, per room; for small surface areas, less than or equal to 10% per component ("de minimis").',
      criteria: 'Less than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'PAINT-IN-01'
    },
    {
      id: 'paint_in_2',
      name: 'More than 2\' SF-Paint in a Unit or Inside the target property is deteriorated – above the level required for lead-safe work practices by a lead certified firm and passing clearance.',
      detail: 'Paint is deteriorated (e.g., peeling, chipping, chalking, cracking, or detached from the substrate). For large surface areas in the Unit, deteriorated paint is more than 2 square feet, per room; for small surface areas, greater than 10% per component ("significant").',
      criteria: 'More than 2 square feet per room deteriorated paint, damage to the surface such as holes that expose paint layers, and friction on painted surfaces.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'PAINT-IN-02'
    }
  ]
};

// ==========================================
// 43. Railings (Inside)
// ==========================================
export const RAILINGS_INSIDE: ItemDeficiencies = {
  itemName: 'Railings',
  deficiencies: [
    {
      id: 'railings_in_1',
      name: 'Guardrail',
      detail: 'The guardrail is missing or not installed. It does limit its safe use.',
      criteria: 'The guardrail is missing (i.e., evidence of prior installation but is now not present or is incomplete) or not installed (i.e., never installed, but should have been) along a walking surface that is more than 30 inches above the floor or grade below.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'RAILINGS-IN-01'
    }
  ]
};

// ==========================================
// 44. Guardrail (Inside)
// ==========================================
export const GUARDRAIL_INSIDE: ItemDeficiencies = {
  itemName: 'Guardrail',
  deficiencies: [
    {
      id: 'guardrail_in_1',
      name: 'Guard rail component, missing, damaged. Does not limit the safe use. The guardrail is functionally adequate.',
      detail: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to effectively prevent fall hazards',
      criteria: 'A guardrail is deficient if it\'s missing critical components, visibly damaged, under 30 inches in height, or not securely attached to effectively prevent fall hazards',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GUARDRAIL-IN-01'
    }
  ]
};

// ==========================================
// 45. Handrail (Inside)
// ==========================================
export const HANDRAIL_INSIDE: ItemDeficiencies = {
  itemName: 'Handrail',
  deficiencies: [
    {
      id: 'handrail_in_1',
      name: 'Handrail is missing.',
      detail: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Handrail is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HANDRAIL-IN-01'
    },
    {
      id: 'handrail_in_2',
      name: 'Handrail is not functionally adequate.',
      detail: 'A handrail is deficient if it can\'t be reasonably grasped for support, isn\'t continuous along the full stair flight, or falls outside the required height range of 28 to 42 inches.',
      criteria: 'A handrail is deficient if it can\'t be reasonably grasped for support, isn\'t continuous along the full stair flight, or falls outside the required height range of 28 to 42 inches.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HANDRAIL-IN-02'
    },
    {
      id: 'handrail_in_3',
      name: 'Handrail is not installed where required.',
      detail: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      criteria: '4 or more stair risers are present, and a handrail is not installed. OR A ramp has a rise greater than 6 inches or a horizontal projection greater than 72 inches and a handrail is not installed on both sides.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'HANDRAIL-IN-03'
    },
    {
      id: 'handrail_in_4',
      name: 'Handrail is not secured.',
      detail: 'There is movement in the anchors of the handrail.',
      criteria: 'There is movement in the anchors of the handrail.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'HANDRAIL-IN-04'
    }
  ]
};

// ==========================================
// 46. Restroom (Inside)
// ==========================================
export const RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Restroom',
  deficiencies: [
    {
      id: 'restroom_1',
      name: 'Bathtub and Shower',
      detail: 'Common area, the bathtub or shower is inoperable or does not drain.',
      criteria: 'Common area bathtub or shower is present, and it is inoperable ( not meeting function or purpose, with or without visible damage), or standing water is present such that water is unable to drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RESTROOM-01'
    },
    {
      id: 'restroom_2',
      name: 'Common area bathtub or shower hardware and water fixtures.',
      detail: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident\'s ability to maintain personal hygiene.',
      criteria: 'Common area bathtub or shower water fixture is damaged or inoperable, not meeting function or purpose, such that it may not limit the resident\'s ability to maintain personal hygiene.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'RESTROOM-02'
    },
    {
      id: 'restroom_3',
      name: 'Bathtub or shower component is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
      detail: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene.',
      criteria: 'A bathtub or shower is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to maintain personal hygiene.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'RESTROOM-03'
    },
    {
      id: 'restroom_4',
      name: 'Bathtub or shower cannot be used in private.',
      detail: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      criteria: 'Hole in the door and damaged hardware, missing door. The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'RESTROOM-04'
    }
  ]
};

// ==========================================
// 47. Cabinet and Storage - Restroom (Inside)
// ==========================================
export const CABINET_STORAGE_RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Cabinet and Storage',
  deficiencies: [
    {
      id: 'cab_rest_1',
      name: 'Storage component is damaged, inoperable, or missing.',
      detail: 'Some of the restroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
      criteria: 'Some of the restroom cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation, but now not present or incomplete). Visibly defective; impacts the functionality or does not meet the functionality or serve the purpose.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'CAB-REST-01'
    }
  ]
};

// ==========================================
// 48. Grab Bar - Restroom (Inside)
// ==========================================
export const GRAB_BAR_RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Grab Bar',
  deficiencies: [
    {
      id: 'grab_rest_1',
      name: 'Grab bar is not secure.',
      detail: 'Any movement whatever is detected in the grab bar.',
      criteria: 'Any movement whatever is detected in the grab bar.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'GRAB-REST-01'
    }
  ]
};

// ==========================================
// 49. Mold -Like Substance - Restroom (Inside)
// ==========================================
export const MOLD_RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Mold -Like Substance',
  deficiencies: [
    {
      id: 'mold_rest_1',
      name: 'Peeling paint-elevated moisture level.',
      detail: 'elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      criteria: 'elevated moisture level (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-REST-01'
    },
    {
      id: 'mold_rest_2',
      name: 'More than 9\'SF- Presence of mold-like substance at extremely high levels is observed visually.',
      detail: 'Cumulative area of patches is more than 9 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 9 square foot in a room.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'MOLD-REST-02'
    },
    {
      id: 'mold_rest_3',
      name: '1\' to 9\' SF-Presence of mold-like substance at high levels is observed visually.',
      detail: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
      criteria: 'Cumulative area of patches is more than one square foot and less than 9 square feet in a room.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'MOLD-REST-03'
    },
    {
      id: 'mold_rest_4',
      name: '4" or less Presence of a mold-like substance at a moderate level observed visually.',
      detail: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      criteria: 'Cumulative area of patches is more than 4 square inches and less than 1 square foot in a room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'MOLD-REST-04'
    }
  ]
};

// ==========================================
// 50. Sink - Restroom (Inside)
// ==========================================
export const SINK_RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Sink',
  deficiencies: [
    {
      id: 'sink_rest_1',
      name: 'Cannot activate or deactivate hot and cold water.',
      detail: 'Control knobs do not activate or deactivate hot and cold water.',
      criteria: 'Control knobs do not activate or deactivate hot and cold water.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-REST-01'
    },
    {
      id: 'sink_rest_2',
      name: 'Sink component is damaged or missing, and the sink is not functionally adequate.',
      detail: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SINK-REST-02'
    },
    {
      id: 'sink_rest_3',
      name: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      detail: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-REST-03'
    },
    {
      id: 'sink_rest_4',
      name: 'The sink is not draining, not functioning adequately.',
      detail: 'Water is not draining from the basin of the sink, slow or clogged drain.',
      criteria: 'Water is not draining from the basin of the sink, slow or clogged drain.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-REST-04'
    },
    {
      id: 'sink_rest_5',
      name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
      detail: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
      criteria: 'Sink component is damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete), and the sink is functionally adequate.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-REST-05'
    },
    {
      id: 'sink_rest_6',
      name: 'Water is directed outside of the basin.',
      detail: 'When in use, water is directed outside of the basin.',
      criteria: 'When in use, water is directed outside of the basin.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-REST-06'
    }
  ]
};

// ==========================================
// 51. Toilet (Inside)
// ==========================================
export const TOILET_INSIDE: ItemDeficiencies = {
  itemName: 'Toilet',
  deficiencies: [
    {
      id: 'toilet_1',
      name: 'A toilet is damaged or inoperable and at least 1 toilet is installed elsewhere that is operational.',
      detail: 'A toilet is deficient if it\'s damaged or inoperable, as long as another operational toilet exists elsewhere in the building.',
      criteria: 'A toilet is deficient if it\'s damaged or inoperable, as long as another operational toilet exists elsewhere in the building.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-01'
    },
    {
      id: 'toilet_2',
      name: 'A toilet is missing and at least 1 toilet is installed elsewhere that is operational.',
      detail: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
      criteria: 'A toilet is missing (i.e., evidence of prior installation, but now not present or is incomplete) and at least 1 toilet is installed elsewhere within the Unit that is operational.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-02'
    },
    {
      id: 'toilet_3',
      name: 'Only 1 toilet was installed, and it is damaged or inoperable.',
      detail: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
      criteria: 'A single installed toilet is deficient if it\'s damaged or inoperable, affecting its ability to function properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'TOILET-03'
    },
    {
      id: 'toilet_4',
      name: 'Only 1 toilet was installed, and it is missing.',
      detail: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Only 1 toilet was installed, and it is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'TOILET-04'
    },
    {
      id: 'toilet_5',
      name: 'Toilet can not be used in private.',
      detail: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      criteria: 'Hole in the door and damaged hardware, missing door The resident should be able to use the bathtub or shower without being observed from an adjacent area or exterior space.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-05'
    },
    {
      id: 'toilet_6',
      name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
      detail: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
      criteria: 'A toilet is deficient if any component is damaged, inoperable, or missing in a way that limits the resident\'s ability to discharge human waste safely.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'TOILET-06'
    },
    {
      id: 'toilet_7',
      name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
      detail: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
      criteria: 'A toilet component is deficient if it\'s damaged, inoperable, or missing, even if it does not limit the resident\'s ability to discharge human waste safely.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-07'
    },
    {
      id: 'toilet_8',
      name: 'Toilet is not secured at the base.',
      detail: 'Toilet is not secured at the base.',
      criteria: 'Toilet is not secured at the base.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TOILET-08'
    }
  ]
};

// ==========================================
// 52. Ventilation - Restroom (Inside)
// ==========================================
export const VENTILATION_RESTROOM_INSIDE: ItemDeficiencies = {
  itemName: 'Ventilation',
  deficiencies: [
    {
      id: 'vent_rest_1',
      name: 'The restroom does not have ventilation, not present and operable.',
      detail: 'Effecting the restroom.',
      criteria: 'Effecting the restroom.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-REST-01'
    },
    {
      id: 'vent_rest_2',
      name: 'The exhaust system component is missing or damaged, affecting the function adequately.',
      detail: 'Exhaust system component is damaged or missing (i.e., visibly defective; impacts functionality).',
      criteria: 'Exhaust system component is damaged or missing (i.e., visibly defective; impacts functionality).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-REST-02'
    },
    {
      id: 'vent_rest_3',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust fan, inoperable.',
      criteria: 'Exhaust fan, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-REST-03'
    },
    {
      id: 'vent_rest_4',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-REST-04'
    }
  ]
};

// ==========================================
// 53. Sink (Laundry, Garage, or patio) (Inside)
// ==========================================
export const SINK_LAUNDRY_GARAGE_INSIDE: ItemDeficiencies = {
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
      name: 'Component is missing',
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
      detail: 'Sink is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
      criteria: 'Signs of separation at the seams of a sink or vanity is pulling away from the wall.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-LAUNDRY-03'
    },
    {
      id: 'sink_laundry_4',
      name: 'Sink is missing.',
      detail: 'Sink is missing (i.e., evidence of prior installation, but now not present or is incomplete) or not installed (i.e., never installed, but should have been) in the primary kitchen.',
      criteria: 'not present or incomplete.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'SINK-LAUNDRY-04'
    },
    {
      id: 'sink_laundry_5',
      name: 'Sink not draining',
      detail: 'Water is not draining from the basin of the sink.',
      criteria: 'Water is not draining from the basin of the sink.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'SINK-LAUNDRY-05'
    },
    {
      id: 'sink_laundry_6',
      name: 'Component is damaged',
      detail: 'The sink component is missing, damaged (i.e., visibly defective; impacts functionality) or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Sink component is damaged (i.e., stopper missing, damaged or inoperable visibly defective; impacts functionality).',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'SINK-LAUNDRY-06'
    }
  ]
};

// ==========================================
// 54. Steps and Stairs (Inside)
// ==========================================
export const STEPS_STAIRS_INSIDE: ItemDeficiencies = {
  itemName: 'Steps and Stairs',
  deficiencies: [
    {
      id: 'steps_1',
      name: 'Stringer is damaged',
      detail: 'Stringer is damaged (i.e., visibly defective; impacts functionality).',
      criteria: 'Instability is detected while walking on the stair.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STEPS-01'
    },
    {
      id: 'steps_2',
      name: 'Tread on a set of stairs damaged',
      detail: 'Tread on a set of stairs is missing i.e., a portion of the tread nosing that is greater than 1 inch in depth or 4 inches wide, is damaged or broken.',
      criteria: 'Secure accessory treads are not present.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'STEPS-02'
    }
  ]
};

// ==========================================
// 55. Structural System (Inside)
// ==========================================
export const STRUCTURAL_SYSTEM_INSIDE: ItemDeficiencies = {
  itemName: 'Structural System',
  deficiencies: [
    {
      id: 'structural_1',
      name: 'Structural system exhibits signs of serious failure',
      detail: 'Structural system exhibits signs of serious failure and may threaten the residents\' safety.',
      criteria: 'Significant structural damage that affects occupants\' safety.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'STRUCTURAL-01'
    }
  ]
};

// ==========================================
// 56. Trash Chute (Inside)
// ==========================================
export const TRASH_CHUTE_INSIDE: ItemDeficiencies = {
  itemName: 'Trash Chute',
  deficiencies: [
    {
      id: 'trash_1',
      name: 'The chute door does not open, self-close, or latch.',
      detail: 'The chute door does not open or self-close and latch.',
      criteria: 'Chute door is damaged.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'TRASH-01'
    },
    {
      id: 'trash_2',
      name: 'Chute is clogged',
      detail: 'Trash is overflowing or backed up inside chute.',
      criteria: 'The garbage is backing up into the chute.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'TRASH-02'
    }
  ]
};

// ==========================================
// 57. Ventilation - General (Inside)
// ==========================================
export const VENTILATION_GENERAL_INSIDE: ItemDeficiencies = {
  itemName: 'Ventilation',
  deficiencies: [
    {
      id: 'vent_gen_1',
      name: 'Ventilation (with or without a fan)',
      detail: 'It is not functioning adequately.',
      criteria: 'Effecting the room.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-GEN-01'
    },
    {
      id: 'vent_gen_2',
      name: 'Exhaust system component is damaged or missing.',
      detail: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'Exhaust system component is damaged (i.e., visibly defective; impacts functionality). OR Exhaust system component is missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-GEN-02'
    },
    {
      id: 'vent_gen_3',
      name: 'Exhaust system does not respond to the control switch.',
      detail: 'Exhaust fan, inoperable.',
      criteria: 'Exhaust fan, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-GEN-03'
    },
    {
      id: 'vent_gen_4',
      name: 'Exhaust system has restricted air flow.',
      detail: 'Exhaust system is blocked such that airflow may be restricted.',
      criteria: 'Exhaust system is blocked such that airflow may be restricted.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'VENT-GEN-04'
    }
  ]
};

// ==========================================
// 58. Wall (Inside)
// ==========================================
export const WALL_INSIDE: ItemDeficiencies = {
  itemName: 'Wall',
  deficiencies: [
    {
      id: 'wall_in_1',
      name: 'Wall-Interior',
      detail: 'Interior wall component(s), severe cracks, not functionally adequate. Damaged trim greater than 10% to 50% of the wall area.',
      criteria: 'Interior wall component(s) is not functionally adequate (i.e., impacts the integrity of the interior wall or does not allow interior wall to provide vertical separation between rooms or spaces).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WALL-IN-01'
    },
    {
      id: 'wall_in_2',
      name: 'Hole is greater than 2 inches in diameter. OR An accumulation of holes in any one wall is greater than 6 inches by 6 inches.',
      detail: 'The wall is damaged, and repairs still need to be completed appropriately.',
      criteria: 'The wall is damaged, and repairs still need to be completed appropriately.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WALL-IN-02'
    },
    {
      id: 'wall_in_3',
      name: 'Interior wall has a loose or detached surface covering.',
      detail: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
      criteria: 'Loose or detached surface coverings (e.g., drywall, plaster, paneling).',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WALL-IN-03'
    }
  ]
};

// ==========================================
// 59. Water Heater (Inside)
// ==========================================
export const WATER_HEATER_INSIDE: ItemDeficiencies = {
  itemName: 'Water Heater',
  deficiencies: [
    {
      id: 'water_ht_in_1',
      name: 'Chimney or flue piping is blocked, misaligned, or missing',
      detail: 'Chimney or flue piping is blocked, misaligned, or missing (i.e., evidence of prior installation, but now not present or is incomplete).',
      criteria: 'The vent is damaged/misaligned/not connected properly.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WATER-HT-IN-01'
    },
    {
      id: 'water_ht_in_2',
      name: 'Gas shutoff valve is damaged, missing or not installed',
      detail: 'Gas shutoff valve is damaged (i.e., visibly defective; impacts functionality). OR Gas shutoff valve is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR Gas shutoff valve is not installed (i.e., never installed, but should have been).',
      criteria: 'A gas shutoff valve is deficient if it\'s damaged, missing, or not installed where required.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WATER-HT-IN-02'
    },
    {
      id: 'water_ht_in_3',
      name: 'No hot water',
      detail: 'Hot water does not dispense after handle is engaged.',
      criteria: 'No hot water after several minutes.',
      severity: 'Severe',
      repairBy: '24 Hrs.',
      points: '14.8/n',
      code: 'WATER-HT-IN-03'
    },
    {
      id: 'water_ht_in_4',
      name: 'TPRV has an active leak. Or obstructed, is unable to be fully actuated. Constructed of unsuitable material.',
      detail: 'TPRV is obstructed such that the TPRV cannot be fully actuated. OR Relief valve discharge piping is damaged (i.e., visibly defective; impacts functionality), capped, has an upward slope, or is constructed of unsuitable material.',
      criteria: 'The Tprv valve is not functioning adequately.',
      severity: 'Life-Threatening',
      repairBy: '24Hrs',
      points: '30/n',
      code: 'WATER-HT-IN-04'
    },
    {
      id: 'water_ht_in_5',
      name: 'The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor flood level.',
      detail: 'The relief valve discharge piping is missing (i.e., evidence of prior installation, but is now not present or is incomplete). OR The relief valve discharge piping terminates greater than 6 inches or less than 2 inches from waste receptor.',
      criteria: 'Not properly installed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WATER-HT-IN-05'
    }
  ]
};

// ==========================================
// 60. Window (Inside)
// ==========================================
export const WINDOW_INSIDE: ItemDeficiencies = {
  itemName: 'Window',
  deficiencies: [
    {
      id: 'window_1',
      name: 'Window cannot be secured.',
      detail: 'Window cannot be secured (i.e., access controlled) by at least 1 installed lock.',
      criteria: 'Only one lock present, and it is damaged, inoperable.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WINDOW-01'
    },
    {
      id: 'window_2',
      name: 'Window component is damaged or missing, and the window is not functionally adequate',
      detail: 'The window component is missing (i.e., evidence of prior installation, but is now not present or is incomplete) or damaged window seals (i.e., cannot protect from the elements), window screen has a hole, tear, or cut that is 1 inch or greater(i.e., can not protect from bugs, or debris).',
      criteria: 'Window is not functionally adequate.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WINDOW-02'
    },
    {
      id: 'window_3',
      name: 'Window will not close.',
      detail: 'The window does not close completely. OR At least one window lock is not present. OR The window can be opened once the lock is engaged.',
      criteria: 'Window lock does not keep the window closed.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WINDOW-03'
    },
    {
      id: 'window_4',
      name: 'Window will not open or stay open.',
      detail: 'Window will not open. Once opened, the window will not stay open without the use of a tool or item.',
      criteria: 'Will not stay open without the use of a tool or item.',
      severity: 'Moderate',
      repairBy: '30 Day',
      points: '5.5/n',
      code: 'WINDOW-04'
    }
  ]
};

// ==========================================
// 61. General comment (Inside)
// ==========================================
export const GENERAL_COMMENT_INSIDE: ItemDeficiencies = {
  itemName: 'General comment: *',
  deficiencies: [
    {
      id: 'gen_comment_1',
      name: 'General observation or comment',
      detail: 'General observation or comment',
      criteria: 'General comment.',
      severity: 'Low',
      repairBy: '60 Day',
      points: '2.40/n',
      code: 'GEN-COMMENT-01'
    }
  ]
};

// ==========================================
// ALL INSIDE CATEGORIES
// ==========================================
export const ALL_INSIDE_CATEGORIES = [
  'Cabinet and Storage (Pantry, Laundry)',
  'Call-for-Aid System',
  'Carbon Monoxide Alarm',
  'Ceiling',
  'Chimney',
  'Clothes Dryer Exhaust',
  'Door',
  'Door - Entry',
  'Door - Fire Labeled',
  'Door - General',
  'Garage Door',
  'Drainage',
  'Egress',
  'Electrical',
  'Electrical - GFCI/AFCI',
  'Electrical - Service Panel',
  'Elevator',
  'Fire Safety',
  'Smoke Alarm',
  'Sprinkler Assembly',
  'Floor',
  'Foundation',
  'Grab Bar',
  'Hazard',
  'HVAC',
  'Kitchen',
  'Cooking Appliance',
  'Food Preparation Area',
  'MOLD-LIKE SUBSTANCE Kitchen',
  'Refrigerator',
  'Sink Kitchen',
  'Ventilation Kitchen',
  'LEAK - Gas/Oil',
  'LEAK - Sewage',
  'LEAK - Water',
  'Lighting - Auxiliary',
  'Lighting - Interior',
  'Mold',
  'Paint Lead',
  'Railings',
  'Guardrail',
  'Handrail',
  'Restroom',
  'Cabinet and Storage Restroom',
  'Grab Bar Restroom',
  'Mold-Like Substance Restroom',
  'Sink Restroom',
  'Toilet',
  'Ventilation Restroom',
  'Sink (Laundry, Garage, or patio)',
  'Steps and Stairs',
  'Structural System',
  'Trash Chute',
  'Ventilation General',
  'Wall',
  'Water Heater',
  'Window',
  'General comment'
] as const;

// ==========================================
// SUBCATEGORIES DEFINITIONS
// ==========================================

// Kitchen subcategories
export const KITCHEN_SUBCATEGORIES_INSIDE = [
  'Cooking Appliance',
  'Food Preparation Area',
  'MOLD-LIKE SUBSTANCE',
  'Refrigerator',
  'Sink',
  'Ventilation'
] as const;

// Restroom subcategories
export const RESTROOM_SUBCATEGORIES_INSIDE = [
  'Bathtub and Shower',
  'Cabinet and Storage',
  'Grab Bar',
  'Mold-Like Substance',
  'Sink',
  'Toilet',
  'Ventilation'
] as const;

// Hazard subcategories
export const HAZARD_SUBCATEGORIES_INSIDE = [
  'Ants',
  'Bed Bugs',
  'Cockroaches',
  'Flies',
  'Mice',
  'Mold',
  'Mosquitoes',
  'Rats',
  'LITTER',
  'Sharp edges',
  'Trip hazard'
] as const;

// Electrical subcategories
export const ELECTRICAL_SUBCATEGORIES_INSIDE = [
  'Electrical - General',
  'Electrical - GFCI/AFCI',
  'Electrical - Service Panel'
] as const;

// Door subcategories
export const DOOR_SUBCATEGORIES_INSIDE = [
  'Door - Entry',
  'Door - Fire Labeled',
  'Door - General',
  'Garage Door'
] as const;

// Railings subcategories
export const RAILINGS_SUBCATEGORIES_INSIDE = [
  'Guardrail',
  'Handrail'
] as const;

// Leak subcategories
export const LEAK_SUBCATEGORIES_INSIDE = [
  'Gas/Oil',
  'Sewage',
  'Water'
] as const;

// Lighting subcategories
export const LIGHTING_SUBCATEGORIES_INSIDE = [
  'Lighting - Auxiliary',
  'Lighting - Interior'
] as const;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Check if a category has subcategories
 */
export function hasSubcategoriesInside(itemName: string): boolean {
  const itemLower = itemName.toLowerCase();
  if (itemLower.includes('kitchen') && !itemLower.includes('ventilation')) return true;
  if (itemLower.includes('restroom') && !itemLower.includes('ventilation')) return true;
  if (itemLower === 'hazard') return true;
  if (itemLower === 'electrical') return true;
  if (itemLower === 'door') return true;
  if (itemLower === 'railings') return true;
  if (itemLower === 'leak') return true;
  if (itemLower === 'lighting') return true;
  return false;
}

/**
 * Get subcategories for an item
 */
export function getSubcategoriesForItemInside(itemName: string): readonly string[] {
  const itemLower = itemName.toLowerCase();
  if (itemLower.includes('kitchen') && !itemLower.includes('ventilation')) {
    return KITCHEN_SUBCATEGORIES_INSIDE;
  }
  if (itemLower.includes('restroom') && !itemLower.includes('ventilation')) {
    return RESTROOM_SUBCATEGORIES_INSIDE;
  }
  if (itemLower === 'hazard') return HAZARD_SUBCATEGORIES_INSIDE;
  if (itemLower === 'electrical') return ELECTRICAL_SUBCATEGORIES_INSIDE;
  if (itemLower === 'door') return DOOR_SUBCATEGORIES_INSIDE;
  if (itemLower === 'railings') return RAILINGS_SUBCATEGORIES_INSIDE;
  if (itemLower === 'leak') return LEAK_SUBCATEGORIES_INSIDE;
  if (itemLower === 'lighting') return LIGHTING_SUBCATEGORIES_INSIDE;
  return [];
}

/**
 * Get deficiencies for a specific subcategory
 */
export function getDeficienciesForSubcategoryInside(subcategory: string): ItemDeficiencies | null {
  const subLower = subcategory.toLowerCase();
  
  // Kitchen subcategories
  if (subLower.includes('cooking appliance')) return COOKING_APPLIANCE_INSIDE;
  if (subLower.includes('food preparation')) return FOOD_PREPARATION_AREA_INSIDE;
  if (subLower.includes('mold') && subLower.includes('kitchen')) return MOLD_LIKE_SUBSTANCE_INSIDE;
  if (subLower.includes('refrigerator')) return REFRIGERATOR_INSIDE;
  if (subLower.includes('sink') && subLower.includes('kitchen')) return SINK_INSIDE;
  if (subLower.includes('ventilation') && subLower.includes('kitchen')) return VENTILATION_KITCHEN_INSIDE;
  
  // Restroom subcategories
  if (subLower.includes('bathtub') || subLower.includes('shower')) return RESTROOM_INSIDE;
  if (subLower.includes('cabinet') && subLower.includes('restroom')) return CABINET_STORAGE_RESTROOM_INSIDE;
  if (subLower.includes('grab bar') && subLower.includes('restroom')) return GRAB_BAR_RESTROOM_INSIDE;
  if (subLower.includes('mold') && subLower.includes('restroom')) return MOLD_RESTROOM_INSIDE;
  if (subLower.includes('sink') && subLower.includes('restroom')) return SINK_RESTROOM_INSIDE;
  if (subLower.includes('toilet')) return TOILET_INSIDE;
  if (subLower.includes('ventilation') && subLower.includes('restroom')) return VENTILATION_RESTROOM_INSIDE;
  
  // Hazard subcategories
  if (subLower.includes('ant')) return HAZARD_INSIDE;
  if (subLower.includes('bed bug')) return HAZARD_INSIDE;
  if (subLower.includes('cockroach')) return HAZARD_INSIDE;
  if (subLower.includes('flies') || subLower.includes('fly')) return HAZARD_INSIDE;
  if (subLower.includes('mice') || subLower.includes('mouse')) return HAZARD_INSIDE;
  if (subLower.includes('mosquito')) return HAZARD_INSIDE;
  if (subLower.includes('rat')) return HAZARD_INSIDE;
  if (subLower.includes('litter')) return HAZARD_INSIDE;
  if (subLower.includes('sharp')) return HAZARD_INSIDE;
  if (subLower.includes('trip')) return HAZARD_INSIDE;
  
  // Electrical subcategories
  if (subLower.includes('gfci') || subLower.includes('afci')) return ELECTRICAL_GFCI_AFCI_INSIDE;
  if (subLower.includes('service panel')) return ELECTRICAL_SERVICE_PANEL_INSIDE;
  if (subLower.includes('electrical') && !subLower.includes('gfci') && !subLower.includes('afci') && !subLower.includes('service panel')) return ELECTRICAL_INSIDE;
  
  // Door subcategories
  if (subLower.includes('entry')) return DOOR_ENTRY_INSIDE;
  if (subLower.includes('fire')) return DOOR_FIRE_LABELED_INSIDE;
  if (subLower.includes('garage')) return GARAGE_DOOR_INSIDE;
  if (subLower.includes('door') && !subLower.includes('entry') && !subLower.includes('fire') && !subLower.includes('garage')) return DOOR_GENERAL_INSIDE;
  
  // Railings subcategories
  if (subLower.includes('guardrail')) return GUARDRAIL_INSIDE;
  if (subLower.includes('handrail')) return HANDRAIL_INSIDE;
  
  // Leak subcategories
  if (subLower.includes('gas') || subLower.includes('oil')) return LEAK_GAS_OIL_INSIDE;
  if (subLower.includes('sewage')) return LEAK_SEWAGE_INSIDE;
  if (subLower.includes('water') && !subLower.includes('heater')) return LEAK_WATER_INSIDE;
  
  // Lighting subcategories
  if (subLower.includes('auxiliary')) return LIGHTING_AUXILIARY_INSIDE;
  if (subLower.includes('lighting - interior') || (subLower.includes('lighting') && subLower.includes('interior'))) return LIGHTING_INTERIOR_INSIDE;
  
  return null;
}

/**
 * Get deficiencies for an item by name
 */
export function getDeficienciesForItemInside(itemName: string): ItemDeficiencies | null {
  const itemLower = itemName.toLowerCase();
  
  // Direct matches
  if (itemLower.includes('cabinet') && itemLower.includes('pantry')) return CABINET_STORAGE_PANTRY_INSIDE;
  if (itemLower.includes('call-for-aid') || itemLower.includes('call for aid')) return CALL_FOR_AID_SYSTEM_INSIDE;
  if (itemLower.includes('carbon monoxide')) return CARBON_MONOXIDE_ALARM_INSIDE;
  if (itemLower.includes('ceiling')) return CEILING_INSIDE;
  if (itemLower.includes('chimney')) return CHIMNEY_INSIDE;
  if (itemLower.includes('clothes dryer') || itemLower.includes('dryer exhaust')) return CLOTHES_DRYER_EXHAUST_INSIDE;
  if (itemLower.includes('door - entry') || itemLower === 'entry door') return DOOR_ENTRY_INSIDE;
  if (itemLower.includes('door - fire') || itemLower.includes('fire labeled')) return DOOR_FIRE_LABELED_INSIDE;
  if (itemLower.includes('door - general') || itemLower === 'general door') return DOOR_GENERAL_INSIDE;
  if (itemLower.includes('garage door')) return GARAGE_DOOR_INSIDE;
  if (itemLower === 'door') return DOOR_INSIDE;
  if (itemLower.includes('drainage')) return DRAINAGE_INSIDE;
  if (itemLower.includes('egress')) return EGRESS_INSIDE;
  if (itemLower.includes('gfci') || itemLower.includes('afci')) return ELECTRICAL_GFCI_AFCI_INSIDE;
  if (itemLower.includes('service panel')) return ELECTRICAL_SERVICE_PANEL_INSIDE;
  if (itemLower === 'electrical') return ELECTRICAL_INSIDE;
  if (itemLower.includes('elevator')) return ELEVATOR_INSIDE;
  if (itemLower.includes('fire safety')) return FIRE_SAFETY_INSIDE;
  if (itemLower.includes('smoke alarm')) return SMOKE_ALARM_INSIDE;
  if (itemLower.includes('sprinkler')) return SPRINKLER_ASSEMBLY_INSIDE;
  if (itemLower.includes('floor')) return FLOOR_INSIDE;
  if (itemLower.includes('foundation')) return FOUNDATION_INSIDE;
  if (itemLower === 'grab bar') return GRAB_BAR_INSIDE;
  if (itemLower === 'hazard') return HAZARD_INSIDE;
  if (itemLower.includes('hvac')) return HVAC_INSIDE;
  if (itemLower === 'kitchen') return KITCHEN_INSIDE;
  if (itemLower.includes('cooking appliance')) return COOKING_APPLIANCE_INSIDE;
  if (itemLower.includes('food preparation')) return FOOD_PREPARATION_AREA_INSIDE;
  if (itemLower.includes('refrigerator')) return REFRIGERATOR_INSIDE;
  if (itemLower.includes('mold') && itemLower.includes('kitchen')) return MOLD_LIKE_SUBSTANCE_INSIDE;
  if (itemLower.includes('sink') && itemLower.includes('kitchen')) return SINK_INSIDE;
  if (itemLower.includes('ventilation') && itemLower.includes('kitchen')) return VENTILATION_KITCHEN_INSIDE;
  if (itemLower.includes('leak') && (itemLower.includes('gas') || itemLower.includes('oil'))) return LEAK_GAS_OIL_INSIDE;
  if (itemLower.includes('leak') && itemLower.includes('sewage')) return LEAK_SEWAGE_INSIDE;
  if (itemLower.includes('leak') && itemLower.includes('water')) return LEAK_WATER_INSIDE;
  if (itemLower.includes('lighting - auxiliary') || itemLower.includes('auxiliary lighting')) return LIGHTING_AUXILIARY_INSIDE;
  if (itemLower.includes('lighting - interior') || itemLower.includes('interior lighting')) return LIGHTING_INTERIOR_INSIDE;
  if (itemLower === 'mold' || itemLower === 'mold-like substance') return MOLD_INSIDE;
  if (itemLower.includes('paint') && itemLower.includes('lead')) return PAINT_LEAD_INSIDE;
  if (itemLower === 'railings') return RAILINGS_INSIDE;
  if (itemLower.includes('guardrail')) return GUARDRAIL_INSIDE;
  if (itemLower.includes('handrail')) return HANDRAIL_INSIDE;
  if (itemLower === 'restroom') return RESTROOM_INSIDE;
  if (itemLower.includes('cabinet') && itemLower.includes('restroom')) return CABINET_STORAGE_RESTROOM_INSIDE;
  if (itemLower.includes('grab bar') && itemLower.includes('restroom')) return GRAB_BAR_RESTROOM_INSIDE;
  if (itemLower.includes('mold') && itemLower.includes('restroom')) return MOLD_RESTROOM_INSIDE;
  if (itemLower.includes('sink') && itemLower.includes('restroom')) return SINK_RESTROOM_INSIDE;
  if (itemLower.includes('toilet')) return TOILET_INSIDE;
  if (itemLower.includes('ventilation') && itemLower.includes('restroom')) return VENTILATION_RESTROOM_INSIDE;
  if (itemLower.includes('sink') && (itemLower.includes('laundry') || itemLower.includes('garage') || itemLower.includes('patio'))) return SINK_LAUNDRY_GARAGE_INSIDE;
  if (itemLower.includes('steps') || itemLower.includes('stairs')) return STEPS_STAIRS_INSIDE;
  if (itemLower.includes('structural')) return STRUCTURAL_SYSTEM_INSIDE;
  if (itemLower.includes('trash chute')) return TRASH_CHUTE_INSIDE;
  if (itemLower.includes('ventilation') && !itemLower.includes('kitchen') && !itemLower.includes('restroom')) return VENTILATION_GENERAL_INSIDE;
  if (itemLower.includes('wall')) return WALL_INSIDE;
  if (itemLower.includes('water heater')) return WATER_HEATER_INSIDE;
  if (itemLower.includes('window')) return WINDOW_INSIDE;
  if (itemLower.includes('general comment')) return GENERAL_COMMENT_INSIDE;
  
  return null;
}

/**
 * Get all inside deficiency categories as a map
 */
export const INSIDE_DEFICIENCY_MAP: Record<string, ItemDeficiencies> = {
  'Cabinet and Storage (Pantry, Laundry)': CABINET_STORAGE_PANTRY_INSIDE,
  'Call-for-Aid System': CALL_FOR_AID_SYSTEM_INSIDE,
  'Carbon Monoxide Alarm': CARBON_MONOXIDE_ALARM_INSIDE,
  'Ceiling': CEILING_INSIDE,
  'Chimney': CHIMNEY_INSIDE,
  'Clothes Dryer Exhaust': CLOTHES_DRYER_EXHAUST_INSIDE,
  'Door': DOOR_INSIDE,
  'Door - Entry': DOOR_ENTRY_INSIDE,
  'Door - Fire Labeled': DOOR_FIRE_LABELED_INSIDE,
  'Door - General': DOOR_GENERAL_INSIDE,
  'Garage Door': GARAGE_DOOR_INSIDE,
  'Drainage': DRAINAGE_INSIDE,
  'Egress': EGRESS_INSIDE,
  'Electrical': ELECTRICAL_INSIDE,
  'Electrical - GFCI/AFCI': ELECTRICAL_GFCI_AFCI_INSIDE,
  'Electrical - Service Panel': ELECTRICAL_SERVICE_PANEL_INSIDE,
  'Elevator': ELEVATOR_INSIDE,
  'Fire Safety': FIRE_SAFETY_INSIDE,
  'Smoke Alarm': SMOKE_ALARM_INSIDE,
  'Sprinkler Assembly': SPRINKLER_ASSEMBLY_INSIDE,
  'Floor': FLOOR_INSIDE,
  'Foundation': FOUNDATION_INSIDE,
  'Grab Bar': GRAB_BAR_INSIDE,
  'Hazard': HAZARD_INSIDE,
  'HVAC': HVAC_INSIDE,
  'Kitchen': KITCHEN_INSIDE,
  'Cooking Appliance': COOKING_APPLIANCE_INSIDE,
  'Food Preparation Area': FOOD_PREPARATION_AREA_INSIDE,
  'MOLD-LIKE SUBSTANCE Kitchen': MOLD_LIKE_SUBSTANCE_INSIDE,
  'Refrigerator': REFRIGERATOR_INSIDE,
  'Sink Kitchen': SINK_INSIDE,
  'Ventilation Kitchen': VENTILATION_KITCHEN_INSIDE,
  'LEAK - Gas/Oil': LEAK_GAS_OIL_INSIDE,
  'LEAK - Sewage': LEAK_SEWAGE_INSIDE,
  'LEAK - Water': LEAK_WATER_INSIDE,
  'Lighting - Auxiliary': LIGHTING_AUXILIARY_INSIDE,
  'Lighting - Interior': LIGHTING_INTERIOR_INSIDE,
  'Mold': MOLD_INSIDE,
  'Paint Lead': PAINT_LEAD_INSIDE,
  'Railings': RAILINGS_INSIDE,
  'Guardrail': GUARDRAIL_INSIDE,
  'Handrail': HANDRAIL_INSIDE,
  'Restroom': RESTROOM_INSIDE,
  'Cabinet and Storage Restroom': CABINET_STORAGE_RESTROOM_INSIDE,
  'Grab Bar Restroom': GRAB_BAR_RESTROOM_INSIDE,
  'Mold-Like Substance Restroom': MOLD_RESTROOM_INSIDE,
  'Sink Restroom': SINK_RESTROOM_INSIDE,
  'Toilet': TOILET_INSIDE,
  'Ventilation Restroom': VENTILATION_RESTROOM_INSIDE,
  'Sink (Laundry, Garage, or patio)': SINK_LAUNDRY_GARAGE_INSIDE,
  'Steps and Stairs': STEPS_STAIRS_INSIDE,
  'Structural System': STRUCTURAL_SYSTEM_INSIDE,
  'Trash Chute': TRASH_CHUTE_INSIDE,
  'Ventilation General': VENTILATION_GENERAL_INSIDE,
  'Wall': WALL_INSIDE,
  'Water Heater': WATER_HEATER_INSIDE,
  'Window': WINDOW_INSIDE,
  'General comment': GENERAL_COMMENT_INSIDE
};
