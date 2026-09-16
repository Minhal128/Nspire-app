// Comprehensive NSPIRE Unit Deficiency Mapping
// Generated from NSPIRE Standards - All UNIT Categories

// Import categories from unitDeficiencyMapping.ts
import {
    CABINET_STORAGE_DEFICIENCIES,
    CALL_FOR_AID_DEFICIENCIES,
    CARBON_MONOXIDE_DEFICIENCIES,
    CEILING_DEFICIENCIES,
    CHIMNEY_DEFICIENCIES,
    CLOTHES_DRYER_DEFICIENCIES,
    DOOR_DEFICIENCIES,
    DRAINAGE_DEFICIENCIES,
    EGRESS_DEFICIENCIES,
    ELECTRICAL_DEFICIENCIES,
    ELEVATOR_DEFICIENCIES,
    FIRE_SAFETY_DEFICIENCIES,
    FLOOR_DEFICIENCIES,
    FOUNDATION_DEFICIENCIES,
    GRAB_BAR_DEFICIENCIES,
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
    TRASH_CHUTE_DEFICIENCIES,
    VENTILATION_DEFICIENCIES,
    WALL_DEFICIENCIES,
    WATER_HEATER_DEFICIENCIES,
    WINDOW_DEFICIENCIES,
    PESTS_INTERIOR_DEFICIENCIES,
    PLUMBING_LEAKS_DRAINAGE_DEFICIENCIES,
    ROOF_DEFICIENCIES,
    SECURITY_DEFICIENCIES,
} from './unitDeficiencyMapping';

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

export interface UnitSubcategory {
    name: string;
    deficiencies: UnitDeficiencyOption[];
}

export interface UnitCategory {
    itemName: string;
    subcategories?: UnitSubcategory[];
    deficiencies?: UnitDeficiencyOption[];
}

// ==========================================
// 1. BATHROOM
// ==========================================
export const BATHROOM_DEFICIENCIES: UnitCategory = {
    itemName: 'Bathroom',
    subcategories: [
        {
            name: 'Bathtub and Shower',
            deficiencies: [
                {
                    id: 'bath_tub_1',
                    name: 'Bathtusb or howershowe r is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
                    detail: 'Bathtusb or howershowe r is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
                    criteria: 'Bathtusb or howershowe r is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TUB-01',
                    codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
                },
                {
                    id: 'bath_tub_2',
                    name: 'A bathtub or shower component (nonfunctional fixture, discoloration <50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    detail: 'A bathtub or shower component (nonfunctional fixture, discoloration <50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    criteria: 'A bathtub or shower component (nonfunctional fixture, discoloration <50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    severity: 'Low',
                    repairBy: '60 Day',
                    points: '2.40/n',
                    code: 'BATH-TUB-02',
                    codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
                },
                {
                    id: 'bath_tub_3',
                    name: 'Bathtub or shower component (nonfunctional fixture, discoloration>50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    detail: 'Bathtub or shower component (nonfunctional fixture, discoloration>50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    criteria: 'Bathtub or shower component (nonfunctional fixture, discoloration>50%) is damaged, inoperable, or missing, and it may limit the resident\'s ability to maintain personal hygiene.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TUB-03',
                    codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
                },
                {
                    id: 'bath_tub_4',
                    name: 'Bathtub or shower cannot be used in private (no privacy).',
                    detail: 'Bathtub or shower cannot be used in private (no privacy).',
                    criteria: 'Bathtub or shower cannot be used in private (no privacy).',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TUB-04',
                    codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
                },
                {
                    id: 'bath_tub_5',
                    name: 'Only one bathtub or shower is present, and it is inoperable or does not drain (the system is not meeting its function or purpose).',
                    detail: 'Only one bathtub or shower is present, and it is inoperable or does not drain (the system is not meeting its function or purpose).',
                    criteria: 'Only one bathtub or shower is present, and it is inoperable or does not drain (the system is not meeting its function or purpose).',
                    severity: 'Severe',
                    repairBy: '24Hrs',
                    points: '14.8/n',
                    code: 'BATH-TUB-05',
                    codeReference: `🧭 Step 1: Identify the Fixture Type
• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).
• Exclude: Freestanding tubs or portable showers unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.
🧪 Step 3: Functional Testing
• Engage Faucet: Turn on hot and cold water for 30–45 seconds
• Check Diverter: Switch between tub and shower modes
• Observe Drainage: Confirm water drains fully within 60 seconds
• Test Stopper: Fill basin partially, confirm stopper holds water, then release
📏 Step 4: Accessibility & IBU Local Requirements
• Grab Bars: Required in accessible units; must be secure and properly placed
• Controls: Operable with one hand, no tight grasping or twisting
• Shower Seat: Required in roll-in showers
• Clear Floor Space: Minimum 30"x48" in front of tub or shower
• Thresholds: ≤½" for roll-in showers; ≤¾" for transfer-type
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm hot and cold water availability (IRC P2708)
• Drainage: Must connect to approved sanitary system (IRC P2711)
• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)
• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)`
                }
            ]
        },
        {
            name: 'Cabinet and Storage',
            deficiencies: [
                {
                    id: 'bath_cab_1',
                    name: 'Storage component is damaged, inoperable, or missing.',
                    detail: 'Storage component is damaged, inoperable, or missing.',
                    criteria: 'Storage component is damaged, inoperable, or missing.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-CAB-01',
                    codeReference: `🧭 Step 1: Identify Storage Areas to Inspect
• NSPIRE does not require bathroom cabinets to be present. However, if installed, they must be functional and safe.
• IBU overlays – Local habitability, accessibility, and sanitation codes
• Exclude: Freestanding furniture or resident-owned storage unless permanently installed
🔍 Step 2: Cleanability & Sanitation
• Interior: Must be free of grime, mold, pest droppings, or biohazards.
• Odor check: Foul smells may indicate hidden moisture or pest activity.
🧪 Step 3: Functional Testing
• Open/Close All Doors and Drawers: Confirm smooth operation and alignment
• Check Shelving Stability: Apply light pressure to test for sagging or detachment
• Inspect for Moisture or Infestation: Especially under sinks and near laundry plumbing
• Pantry Useability: Ensure shelves are clean, secure, and accessible
📏 Step 4: Accessibility & Local Requirements
• Reach range: Shelves and handles should be within accessibility-compliant height (typically 15–48" AFF)
• Clearance: Doors and drawers must not obstruct egress or accessible paths
• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing
⚒️ Step 5: Installation & Safety (IRC)
• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)
• No Sharp Edges: Corners should be finished and safe
• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation`
                }
            ]
        },
        {
            name: 'Grab Bar',
            deficiencies: [
                {
                    id: 'bath_grab_1',
                    name: 'Grab Bar is not secure.',
                    detail: 'Grab Bar is not secure.',
                    criteria: 'Grab Bar is not secure.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-GRAB-01',
                    codeReference: `🧭 Step 1: Identify Grab Bar Location
• Valid locations: Inside bathrooms—adjacent to toilets, tubs, or showers.
• Invalid locations: Living rooms, bedrooms, or hallways
🔍  Visual Inspection
• Material: Stainless steel, coated metal, compliant plastic
• Cleanliness: Must be free of grime, mold, or residue
🧪 Step 3: Stability Test
• Grip the Bar in the Middle
• Apply Moderate Force: Push and pull back and forth
• Deficiency Criteria: Any movement whatsoever is considered a moderate deficiency under NSPIRE
📏 Step 4: Accessibility & Local Requirements
• Height: Typically 33–36" AFF (above finished floor) for side wall bars
• Length: ≥36" for side wall, ≥42" for rear wall in showers
• Clearance: Minimum 1½" between bar and wall
• IBU Overlay: May require dual bars, textured grip, visual contrast, or tactile indicators for low-vision users
⚒️ Step 5: Structural Safety (IRC)
• Anchoring: Must be secured to wall studs or blocking (IRC R307.2)
• No Drywall-Only Mounting: Anchors must support 250 lbs minimum
• No Electrical Conflict: Ensure the grab bar does not interfere with switches or outlets`
                }
            ]
        },
        {
            name: 'MOLD-LIKE SUBSTANCE',
            deficiencies: [
                {
                    id: 'bath_mold_1',
                    name: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
                    detail: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
                    criteria: 'Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-MOLD-01',
                    codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation:
o Confirm exhaust fan is functional (IRC R303.3)
o If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
                },
                {
                    id: 'bath_mold_2',
                    name: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
                    detail: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
                    criteria: 'More than 9\'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.',
                    severity: 'Life-Threatening',
                    repairBy: '24Hrs',
                    points: '60/n',
                    code: 'BATH-MOLD-02',
                    codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation:
o Confirm exhaust fan is functional (IRC R303.3)
o If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
                },
                {
                    id: 'bath_mold_3',
                    name: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
                    detail: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
                    criteria: '1\' to 9\' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.',
                    severity: 'Severe',
                    repairBy: '24 Hrs.',
                    points: '14.8/n',
                    code: 'BATH-MOLD-03',
                    codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation:
o Confirm exhaust fan is functional (IRC R303.3)
o If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
                },
                {
                    id: 'bath_mold_4',
                    name: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
                    detail: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
                    criteria: '4" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-MOLD-04',
                    codeReference: `🧭 Step 1: Prepare for Inspection
• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers
🔍 Step 2: Visual Identification
Mold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.
📏 Step 3: Measure Affected Area
NSPIRE evaluates total cumulative area across the room, not just isolated patches
🧪 Step 4: Moisture Source Check
• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks
• Check ventilation:
o Confirm exhaust fan is functional (IRC R303.3)
o If no fan, ensure an operable window is present
• Condensation: Look for moisture buildup on mirrors, walls, or ceilings
♿ Step 5: Accessibility & Local Requirements
• Inspection access: Must be visual—no disassembly or invasive probing
• Labeling: Some jurisdictions require mold hazard signage or maintenance logs
• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems
⚒️ Step 6: IRC Compliance
• Ventilation: Required in all bathrooms (IRC R303.3)
• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)
• Caulking & Grout: Must be intact to prevent water intrusion`
                }
            ]
        },
        {
            name: 'Sink',
            deficiencies: [
                {
                    id: 'bath_sink_1',
                    name: 'Hot and cold water cannot be activated or deactivated.',
                    detail: 'Hot and cold water cannot be activated or deactivated.',
                    criteria: 'Hot and cold water cannot be activated or deactivated.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-SINK-01',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                },
                {
                    id: 'bath_sink_2',
                    name: 'Sink component is damaged or missing, and the sink is not functionally adequate',
                    detail: 'Sink component is damaged or missing, and the sink is not functionally adequate',
                    criteria: 'Sink component is damaged or missing, and the sink is not functionally adequate',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-SINK-02',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                },
                {
                    id: 'bath_sink_3',
                    name: 'Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
                    detail: 'Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
                    criteria: 'Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-SINK-03',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                },
                {
                    id: 'bath_sink_4',
                    name: 'Sink is not draining.',
                    detail: 'Sink is not draining.',
                    criteria: 'Sink is not draining.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-SINK-04',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                },
                {
                    id: 'bath_sink_5',
                    name: 'Sink component is damaged or missing, and the sink is functionally adequate.',
                    detail: 'Sink component is damaged or missing, and the sink is functionally adequate.',
                    criteria: 'Sink component is damaged or missing, and the sink is functionally adequate.',
                    severity: 'Low',
                    repairBy: '60 Day',
                    points: '2.40/n',
                    code: 'BATH-SINK-05',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                },
                {
                    id: 'bath_sink_6',
                    name: 'Water is directed outside of the basin when in use.',
                    detail: 'Water is directed outside of the basin when in use.',
                    criteria: 'Water is directed outside of the basin when in use.',
                    severity: 'Low',
                    repairBy: '60 Day',
                    points: '2.40/n',
                    code: 'BATH-SINK-06',
                    codeReference: `🧭 Step 1: Identify Sink Type & Location
• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated
• Components: Faucet, handles, drain, stopper, supply lines, overflow
• Required: Every residential unit bathroom must contain at least one operable sink.
🔍 Step 2: Visual Condition, Cleanability & Sanitation
• Surface condition: Must be free of mold, grime, or pest attractants.
• Odor check: Foul smells may indicate hidden moisture or drainage issues.
🧪 Step 3: Functional Testing
• Run Hot & Cold Water: Confirm activation and temperature control
• Fill Basin: Engage stopper and observe water retention
• Drain Test: Release stopper and confirm full drainage within 60 seconds
• Leak Check: Inspect under sink for dripping or pooling water
📏 Step 4:Accessibility & Local Requirement
• Clear Floor Space: Minimum 30"x48" in front of sink
• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)
• Reach Range: Controls must be within 15"–48" AFF
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Confirm connection to approved potable source (IRC P2902)
• Drainage: Must connect to sanitary system (IRC P2711)
• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)
• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination`
                }
            ]
        },
        {
            name: 'Toilet',
            deficiencies: [
                {
                    id: 'bath_toilet_1',
                    name: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
                    detail: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
                    criteria: 'A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TOILET-01',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_2',
                    name: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
                    detail: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
                    criteria: 'A toilet is missing, and at least one toilet is installed elsewhere that is operational.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TOILET-02',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_3',
                    name: 'Only one toilet was installed, and it is damaged or inoperable.',
                    detail: 'Only one toilet was installed, and it is damaged or inoperable.',
                    criteria: 'Only one toilet was installed, and it is damaged or inoperable.',
                    severity: 'Severe',
                    repairBy: '24 Hrs.',
                    points: '14.8/n',
                    code: 'BATH-TOILET-03',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_4',
                    name: 'Only one toilet was installed, and it is missing.',
                    detail: 'Only one toilet was installed, and it is missing.',
                    criteria: 'Only one toilet was installed, and it is missing.',
                    severity: 'Life-Threatening',
                    repairBy: '24Hrs',
                    points: '30/n',
                    code: 'BATH-TOILET-04',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_5',
                    name: 'Toilet can not be used in private (no privacy)',
                    detail: 'Toilet can not be used in private (no privacy)',
                    criteria: 'Toilet can not be used in private (no privacy)',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TOILET-05',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_6',
                    name: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
                    detail: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
                    criteria: 'Toilet component is damaged, inoperable, or missing and it does not limit the resident\'s ability to discharge human waste.',
                    severity: 'Low',
                    repairBy: '60 Day',
                    points: '2.40/n',
                    code: 'BATH-TOILET-06',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_7',
                    name: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
                    detail: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
                    criteria: 'Toilet component is damaged, inoperable, or missing such that it may limit the resident\'s ability to safely discharge human waste.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TOILET-07',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                },
                {
                    id: 'bath_toilet_8',
                    name: 'Toilet is not secured at the base.',
                    detail: 'Toilet is not secured at the base.',
                    criteria: 'Toilet is not secured at the base.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-TOILET-08',
                    codeReference: `🧭 Step 1: Identify Toilet Type & Location
• Location: Bathroom or restroom inside the unit
• Exclude: Portable toilets or resident-owned bidets unless permanently installed
🔍 Step 2: Presence & Identification
• Required: Every residential unit must have at least one operable toilet.
• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve
🧪 Step 3: Functional Testing
• Flush Test: Open the lid and seat
• Flush and observe water flow, refill, and shut off
• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)
• Confirm it does not move or rock
• Leak Check: Inspect base and supply line for water pooling or dripping
📏 Step 4: Accessibility & Local Requirements
• Height: ADA-compliant toilets typically 17–19" AFF (above finished floor)
• Grab bars: Required in accessible units—must be securely mounted and within reach
• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing
⚒️ Step 5: IRC Plumbing & Safety Checks
• Water Supply: Must connect to potable source (IRC P2902)
• Drainage: Must discharge to approved sanitary system (IRC P3005)
• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)
• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)`
                }
            ]
        },
        {
            name: 'Ventilation',
            deficiencies: [
                {
                    id: 'bath_vent_1',
                    name: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
                    detail: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
                    criteria: 'An exhaust fan, window, or adequate means of ventilation is not present and operable.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-VENT-01',
                    codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation:
• Turn on the switch and listen for the motor
• Use tissue test: hold paper near grill to confirm suction
• Window Test:
• Open and close the window fully
• Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or
• An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
                },
                {
                    id: 'bath_vent_2',
                    name: 'The exhaust system component is missing and damaged, affecting the function adequately.',
                    detail: 'The exhaust system component is missing and damaged, affecting the function adequately.',
                    criteria: 'The exhaust system component is missing and damaged, affecting the function adequately.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-VENT-02',
                    codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation:
• Turn on the switch and listen for the motor
• Use tissue test: hold paper near grill to confirm suction
• Window Test:
• Open and close the window fully
• Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or
• An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
                },
                {
                    id: 'bath_vent_3',
                    name: 'The exhaust system does not respond to the control switch (inoperable).',
                    detail: 'The exhaust system does not respond to the control switch (inoperable).',
                    criteria: 'The exhaust system does not respond to the control switch (inoperable).',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-VENT-03',
                    codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation:
• Turn on the switch and listen for the motor
• Use tissue test: hold paper near grill to confirm suction
• Window Test:
• Open and close the window fully
• Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or
• An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
                },
                {
                    id: 'bath_vent_4',
                    name: 'Exhaust system has restricted air flow.',
                    detail: 'Exhaust system has restricted air flow.',
                    criteria: 'Exhaust system has restricted air flow.',
                    severity: 'Moderate',
                    repairBy: '30 Day',
                    points: '5.5/n',
                    code: 'BATH-VENT-04',
                    codeReference: `🧭 Step 1: Identify Ventilation Type
• Mechanical Ventilation: Exhaust fan ducted to the exterior
• Natural Ventilation: Operable window
• Central Ventilation: Passive or motorized system (standard in high-rise buildings)
🔍 Step 2: Visual Inspection
• Check for dust, grease, or debris blocking the grill
🧪 Step 3: Functional Testing
• Fan Activation:
• Turn on the switch and listen for the motor
• Use tissue test: hold paper near grill to confirm suction
• Window Test:
• Open and close the window fully
• Confirm it stays open without external support
📏 Step 4: Accessibility & Local Requirement
• Switch Height: Must be within 15"–48" AFF for accessible units
• Window Operation: Must be operable with one hand, no tight grasping or twisting
• Reach Range: Controls must be reachable from a seated position if required
• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units
⚒️ Step 5: IRC Compliance
• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or
• An operable window
• Fan Ducting: Must terminate outside the building—not into attic or crawlspace
• Moisture Control: Ventilation must prevent excess humidity and mold risk`
                }
            ]
        }
    ]
};

// Now re-export them to maintain compatibility while adding new categories
export {
    CABINET_STORAGE_DEFICIENCIES,
    CALL_FOR_AID_DEFICIENCIES,
    CARBON_MONOXIDE_DEFICIENCIES,
    CEILING_DEFICIENCIES,
    CHIMNEY_DEFICIENCIES,
    CLOTHES_DRYER_DEFICIENCIES,
    DOOR_DEFICIENCIES,
    DRAINAGE_DEFICIENCIES,
    EGRESS_DEFICIENCIES,
    ELECTRICAL_DEFICIENCIES,
    ELEVATOR_DEFICIENCIES,
    FIRE_SAFETY_DEFICIENCIES,
    FLOOR_DEFICIENCIES,
    FOUNDATION_DEFICIENCIES,
    GRAB_BAR_DEFICIENCIES,
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
    TRASH_CHUTE_DEFICIENCIES,
    VENTILATION_DEFICIENCIES,
    WALL_DEFICIENCIES,
    WATER_HEATER_DEFICIENCIES,
    WINDOW_DEFICIENCIES,
} from './unitDeficiencyMapping';

// Alias to fix ReferenceError if plural is used
export const CABINETS_STORAGE_DEFICIENCIES = CABINET_STORAGE_DEFICIENCIES;

// ==========================================
// ALL INSIDE CATEGORIES
// ==========================================
export const ALL_INSIDE_CATEGORIES: UnitCategory[] = [
    BATHROOM_DEFICIENCIES,
    CABINET_STORAGE_DEFICIENCIES,
    CALL_FOR_AID_DEFICIENCIES,
    CARBON_MONOXIDE_DEFICIENCIES,
    CEILING_DEFICIENCIES,
    CHIMNEY_DEFICIENCIES,
    CLOTHES_DRYER_DEFICIENCIES,
    DOOR_DEFICIENCIES,
    DRAINAGE_DEFICIENCIES,
    EGRESS_DEFICIENCIES,
    ELECTRICAL_DEFICIENCIES,
    ELEVATOR_DEFICIENCIES,
    FIRE_SAFETY_DEFICIENCIES,
    FLOOR_DEFICIENCIES,
    FOUNDATION_DEFICIENCIES,
    GRAB_BAR_DEFICIENCIES,
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
    TRASH_CHUTE_DEFICIENCIES,
    VENTILATION_DEFICIENCIES,
    WALL_DEFICIENCIES,
    WATER_HEATER_DEFICIENCIES,
    WINDOW_DEFICIENCIES,
].map((cat: any) => {
    if (!cat) return { itemName: 'Unknown' };
    return {
        ...cat,
        itemName: cat.itemName || cat.category || 'Unnamed Category'
    };
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function getAllUnitDeficiencies(): UnitDeficiencyOption[] {
    const allDefs: UnitDeficiencyOption[] = [];
    ALL_INSIDE_CATEGORIES.forEach(cat => {
        if (cat.subcategories) {
            cat.subcategories.forEach(sub => {
                allDefs.push(...sub.deficiencies);
            });
        }
        if (cat.deficiencies) {
            allDefs.push(...cat.deficiencies);
        }
    });
    return allDefs;
}

export function getUnitDeficiencyById(id: string): UnitDeficiencyOption | undefined {
    const allDefs = getAllUnitDeficiencies();
    return allDefs.find(d => d.id === id);
}

export function getUnitCategoriesList(): string[] {
    return ALL_INSIDE_CATEGORIES.map(c => c.itemName);
}

export function getSubcategoriesForCategory(categoryName: string): string[] {
    const category = ALL_INSIDE_CATEGORIES.find(c => c.itemName === categoryName);
    if (!category || !category.subcategories) return [];
    return category.subcategories.map(s => s.name);
}

export function getDeficienciesForSubcategory(categoryName: string, subcategoryName: string): UnitDeficiencyOption[] {
    const category = ALL_INSIDE_CATEGORIES.find(c => c.itemName === categoryName);
    if (!category || !category.subcategories) return [];
    const subcategory = category.subcategories.find(s => s.name === subcategoryName);
    return subcategory?.deficiencies || [];
}

// ==========================================
// COMPATIBILITY ALIASES FOR deficiencyMapping.ts
// ==========================================
export const getInsideSubcategories = getSubcategoriesForCategory;

export function getInsideSubcategoryDeficiencies(subcategoryName: string): UnitCategory | null {
    // Find any category that has a subcategory with this name
    for (const cat of ALL_INSIDE_CATEGORIES) {
        if (cat.subcategories) {
            const sub = cat.subcategories.find(s => s.name === subcategoryName);
            if (sub) {
                return {
                    itemName: sub.name,
                    deficiencies: sub.deficiencies
                };
            }
        }
    }
    return null;
}

export function getInsideSubcategoryDeficienciesByParent(parentCategory: string, subcategoryName: string): UnitCategory | null {
    const subdefs = getDeficienciesForSubcategory(parentCategory, subcategoryName);
    if (subdefs.length > 0) {
        return {
            itemName: subcategoryName,
            deficiencies: subdefs
        };
    }
    return null;
}

export function getInsideDeficienciesForItem(itemName: string): UnitCategory | null {
    const cat = ALL_INSIDE_CATEGORIES.find(c => c.itemName === itemName);
    return cat || null;
}

export function getAllInsideDeficienciesForItem(itemName: string): UnitDeficiencyOption[] {
    const cat = getInsideDeficienciesForItem(itemName);
    if (!cat) return [];

    const allDefs: UnitDeficiencyOption[] = [];
    if (cat.subcategories) {
        cat.subcategories.forEach(s => allDefs.push(...s.deficiencies));
    }
    if (cat.deficiencies) {
        allDefs.push(...cat.deficiencies);
    }
    return allDefs;
}
