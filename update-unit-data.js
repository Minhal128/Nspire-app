// Script to generate updated unitDeficiencyMapping.ts from JSON data
// Run with: node update-unit-data.js

const fs = require('fs');

// Your JSON data (paste directly or import)
const jsonData = {
  "categories": [
    {
      "name": "Bathroom",
      "deficiencies": [
        {
          "deficiency_selected": "Bathtub and Shower",
          "deficiency_detail": "Bathtusb or howershowe r is inoperable or does not drain, and at least one bathtub or shower is present elsewhere that is operational.",
          "how_to_inspect": "🧭 Step 1: Identify the Fixture Type\n• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).\n• Exclude: Freestanding tubs or portable showers unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.\n🧪 Step 3: Functional Testing\n• Engage Faucet: Turn on hot and cold water for 30–45 seconds\n• Check Diverter: Switch between tub and shower modes\n• Observe Drainage: Confirm water drains fully within 60 seconds\n• Test Stopper: Fill basin partially, confirm stopper holds water, then release\n📏 Step 4: Accessibility & IBU Local Requirements\n• Grab Bars: Required in accessible units; must be secure and properly placed\n• Controls: Operable with one hand, no tight grasping or twisting\n• Shower Seat: Required in roll-in showers\n• Clear Floor Space: Minimum 30\"x48\" in front of tub or shower\n• Thresholds: ≤½\" for roll-in showers; ≤¾\" for transfer-type\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm hot and cold water availability (IRC P2708)\n• Drainage: Must connect to approved sanitary system (IRC P2711)\n• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)\n• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Bathtub and Shower",
          "deficiency_detail": "A bathtub or shower component (nonfunctional fixture, discoloration <50%) is damaged, inoperable, or missing, and it may limit the resident's ability to maintain personal hygiene.",
          "how_to_inspect": "🧭 Step 1: Identify the Fixture Type\n• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).\n• Exclude: Freestanding tubs or portable showers unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.\n🧪 Step 3: Functional Testing\n• Engage Faucet: Turn on hot and cold water for 30–45 seconds\n• Check Diverter: Switch between tub and shower modes\n• Observe Drainage: Confirm water drains fully within 60 seconds\n• Test Stopper: Fill basin partially, confirm stopper holds water, then release\n📏 Step 4: Accessibility & IBU Local Requirements\n• Grab Bars: Required in accessible units; must be secure and properly placed\n• Controls: Operable with one hand, no tight grasping or twisting\n• Shower Seat: Required in roll-in showers\n• Clear Floor Space: Minimum 30\"x48\" in front of tub or shower\n• Thresholds: ≤½\" for roll-in showers; ≤¾\" for transfer-type\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm hot and cold water availability (IRC P2708)\n• Drainage: Must connect to approved sanitary system (IRC P2711)\n• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)\n• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)",
          "note": "",
          "pic": "",
          "health_safety": "Low",
          "repair_by": "60 Day",
          "score_formula": "2.40/n"
        },
        {
          "deficiency_selected": "Bathtub and Shower",
          "deficiency_detail": "Bathtub or shower component (nonfunctional fixture, discoloration>50%) is damaged, inoperable, or missing, and it may limit the resident's ability to maintain personal hygiene.",
          "how_to_inspect": "🧭 Step 1: Identify the Fixture Type\n• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).\n• Exclude: Freestanding tubs or portable showers unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.\n🧪 Step 3: Functional Testing\n• Engage Faucet: Turn on hot and cold water for 30–45 seconds\n• Check Diverter: Switch between tub and shower modes\n• Observe Drainage: Confirm water drains fully within 60 seconds\n• Test Stopper: Fill basin partially, confirm stopper holds water, then release\n📏 Step 4: Accessibility & IBU Local Requirements\n• Grab Bars: Required in accessible units; must be secure and properly placed\n• Controls: Operable with one hand, no tight grasping or twisting\n• Shower Seat: Required in roll-in showers\n• Clear Floor Space: Minimum 30\"x48\" in front of tub or shower\n• Thresholds: ≤½\" for roll-in showers; ≤¾\" for transfer-type\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm hot and cold water availability (IRC P2708)\n• Drainage: Must connect to approved sanitary system (IRC P2711)\n• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)\n• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Bathtub and Shower",
          "deficiency_detail": "Bathtub or shower cannot be used in private (no privacy).",
          "how_to_inspect": "🧭 Step 1: Identify the Fixture Type\n• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).\n• Exclude: Freestanding tubs or portable showers unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.\n🧪 Step 3: Functional Testing\n• Engage Faucet: Turn on hot and cold water for 30–45 seconds\n• Check Diverter: Switch between tub and shower modes\n• Observe Drainage: Confirm water drains fully within 60 seconds\n• Test Stopper: Fill basin partially, confirm stopper holds water, then release\n📏 Step 4: Accessibility & IBU Local Requirements\n• Grab Bars: Required in accessible units; must be secure and properly placed\n• Controls: Operable with one hand, no tight grasping or twisting\n• Shower Seat: Required in roll-in showers\n• Clear Floor Space: Minimum 30\"x48\" in front of tub or shower\n• Thresholds: ≤½\" for roll-in showers; ≤¾\" for transfer-type\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm hot and cold water availability (IRC P2708)\n• Drainage: Must connect to approved sanitary system (IRC P2711)\n• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)\n• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Bathtub and Shower",
          "deficiency_detail": "Only one bathtub or shower is present, and it is inoperable or does not drain (the system is not meeting its function or purpose).",
          "how_to_inspect": "🧭 Step 1: Identify the Fixture Type\n• Required: Every residential unit must have at least one operable bathtub or shower unless exempted (e.g., Single Room Occupancy Units with shared facilities).\n• Exclude: Freestanding tubs or portable showers unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Surface condition: Must be free of mold, mildew, soap scum, or biohazards.\n🧪 Step 3: Functional Testing\n• Engage Faucet: Turn on hot and cold water for 30–45 seconds\n• Check Diverter: Switch between tub and shower modes\n• Observe Drainage: Confirm water drains fully within 60 seconds\n• Test Stopper: Fill basin partially, confirm stopper holds water, then release\n📏 Step 4: Accessibility & IBU Local Requirements\n• Grab Bars: Required in accessible units; must be secure and properly placed\n• Controls: Operable with one hand, no tight grasping or twisting\n• Shower Seat: Required in roll-in showers\n• Clear Floor Space: Minimum 30\"x48\" in front of tub or shower\n• Thresholds: ≤½\" for roll-in showers; ≤¾\" for transfer-type\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm hot and cold water availability (IRC P2708)\n• Drainage: Must connect to approved sanitary system (IRC P2711)\n• Ventilation: Ensure operable window or exhaust fan (IRC R303.3)\n• Anti-scald Protection: Check for mixing valve or temperature control (IRC P2708.4)",
          "note": "",
          "pic": "",
          "health_safety": "Severe",
          "repair_by": "24Hrs",
          "score_formula": "14.8/n"
        },
        {
          "deficiency_selected": "Cabinet and Storage",
          "deficiency_detail": "Storage component is damaged, inoperable, or missing.",
          "how_to_inspect": "🧭 Step 1: Identify Storage Areas to Inspect\n• NSPIRE does not require bathroom cabinets to be present. However, if installed, they must be functional and safe.\n• IBU overlays – Local habitability, accessibility, and sanitation codes \n• Exclude: Freestanding furniture or resident-owned storage unless permanently installed\n🔍 Step 2: Cleanability & Sanitation\n• Interior: Must be free of grime, mold, pest droppings, or biohazards.\n• Odor check: Foul smells may indicate hidden moisture or pest activity.\n🧪 Step 3: Functional Testing\n• Open/Close All Doors and Drawers: Confirm smooth operation and alignment\n• Check Shelving Stability: Apply light pressure to test for sagging or detachment\n• Inspect for Moisture or Infestation: Especially under sinks and near laundry plumbing\n• Pantry Useability: Ensure shelves are clean, secure, and accessible\n📏 Step 4: Accessibility & Local Requirements\n• Reach range: Shelves and handles should be within accessibility-compliant height (typically 15–48\" AFF)\n• Clearance: Doors and drawers must not obstruct egress or accessible paths\n• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing\n⚒️ Step 5: Installation & Safety (IRC)\n• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)\n• No Sharp Edges: Corners should be finished and safe\n• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Grab Bar",
          "deficiency_detail": "Grab Bar is not secure.",
          "how_to_inspect": "🧭 Step 1: Identify Grab Bar Location\n• Valid locations: Inside bathrooms—adjacent to toilets, tubs, or showers.\n• Invalid locations: Living rooms, bedrooms, or hallways \n🔍  Visual Inspection\n• Material: Stainless steel, coated metal, compliant plastic\n• Cleanliness: Must be free of grime, mold, or residue\n🧪 Step 3: Stability Test\n• Grip the Bar in the Middle\n• Apply Moderate Force: Push and pull back and forth\n• Deficiency Criteria: Any movement whatsoever is considered a moderate deficiency under NSPIRE\n📏 Step 4: Accessibility & Local Requirements\n• Height: Typically 33–36\" AFF (above finished floor) for side wall bars\n• Length: ≥36\" for side wall, ≥42\" for rear wall in showers\n• Clearance: Minimum 1½\" between bar and wall\n• IBU Overlay: May require dual bars, textured grip, visual contrast, or tactile indicators for low-vision users\n⚒️ Step 5: Structural Safety (IRC)\n• Anchoring: Must be secured to wall studs or blocking (IRC R307.2)\n• No Drywall-Only Mounting: Anchors must support 250 lbs minimum\n• No Electrical Conflict: Ensure the grab bar does not interfere with switches or outlets",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "MOLD-LIKE SUBSTANCE",
          "deficiency_detail": "Elevated moisture level. (e.g., peeling paint or wallpaper, a wall that is warped or stained, or a buckled, cracked, or water-stained ceiling, carpet, or wooden floor).",
          "how_to_inspect": "🧭 Step 1: Prepare for Inspection\n• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers\n🔍 Step 2: Visual Identification\nMold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.\n📏 Step 3: Measure Affected Area\nNSPIRE evaluates total cumulative area across the room, not just isolated patches\n🧪 Step 4: Moisture Source Check\n• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks\n• Check ventilation:\no Confirm exhaust fan is functional (IRC R303.3)\no If no fan, ensure an operable window is present\n• Condensation: Look for moisture buildup on mirrors, walls, or ceilings\n♿ Step 5: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or invasive probing\n• Labeling: Some jurisdictions require mold hazard signage or maintenance logs\n• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems\n⚒️ Step 6: IRC Compliance\n• Ventilation: Required in all bathrooms (IRC R303.3)\n• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)\n• Caulking & Grout: Must be intact to prevent water intrusion",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "MOLD-LIKE SUBSTANCE",
          "deficiency_detail": "More than 9'SF(cumulative)- Presence of mold-like substance at extremely high levels is observed visually.",
          "how_to_inspect": "🧭 Step 1: Prepare for Inspection\n• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers\n🔍 Step 2: Visual Identification\nMold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.\n📏 Step 3: Measure Affected Area\nNSPIRE evaluates total cumulative area across the room, not just isolated patches\n🧪 Step 4: Moisture Source Check\n• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks\n• Check ventilation:\no Confirm exhaust fan is functional (IRC R303.3)\no If no fan, ensure an operable window is present\n• Condensation: Look for moisture buildup on mirrors, walls, or ceilings\n♿ Step 5: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or invasive probing\n• Labeling: Some jurisdictions require mold hazard signage or maintenance logs\n• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems\n⚒️ Step 6: IRC Compliance\n• Ventilation: Required in all bathrooms (IRC R303.3)\n• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)\n• Caulking & Grout: Must be intact to prevent water intrusion",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "60/n"
        },
        {
          "deficiency_selected": "MOLD-LIKE SUBSTANCE",
          "deficiency_detail": "1' to 9' SF(cumulative)-Presence of mold-like substance at high levels is observed visually.",
          "how_to_inspect": "🧭 Step 1: Prepare for Inspection\n• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers\n🔍 Step 2: Visual Identification\nMold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.\n📏 Step 3: Measure Affected Area\nNSPIRE evaluates total cumulative area across the room, not just isolated patches\n🧪 Step 4: Moisture Source Check\n• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks\n• Check ventilation:\no Confirm exhaust fan is functional (IRC R303.3)\no If no fan, ensure an operable window is present\n• Condensation: Look for moisture buildup on mirrors, walls, or ceilings\n♿ Step 5: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or invasive probing\n• Labeling: Some jurisdictions require mold hazard signage or maintenance logs\n• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems\n⚒️ Step 6: IRC Compliance\n• Ventilation: Required in all bathrooms (IRC R303.3)\n• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)\n• Caulking & Grout: Must be intact to prevent water intrusion",
          "note": "",
          "pic": "",
          "health_safety": "Severe",
          "repair_by": "24 Hrs.",
          "score_formula": "14.8/n"
        },
        {
          "deficiency_selected": "MOLD-LIKE SUBSTANCE",
          "deficiency_detail": "4\" or less than 1 square foot in a room. (cumulative)-- Presence of mold-like substance at a moderate level observed visually.",
          "how_to_inspect": "🧭 Step 1: Prepare for Inspection\n• Focus Areas: Walls, ceilings, grout lines, caulking, under sinks, behind toilets, and around tubs/showers\n🔍 Step 2: Visual Identification\nMold-like substances include irregular patches or spots that may be white, green, yellow, gray, brown, or black. They may appear fuzzy, cottony, slimy, or dusty.\n📏 Step 3: Measure Affected Area\nNSPIRE evaluates total cumulative area across the room, not just isolated patches\n🧪 Step 4: Moisture Source Check\n• Inspect for leaks: Around faucets, showerheads, toilet bases, and under sinks\n• Check ventilation:\no Confirm exhaust fan is functional (IRC R303.3)\no If no fan, ensure an operable window is present\n• Condensation: Look for moisture buildup on mirrors, walls, or ceilings\n♿ Step 5: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or invasive probing\n• Labeling: Some jurisdictions require mold hazard signage or maintenance logs\n• IBU Local Codes: May mandate quarterly inspections, moisture sensors, or integrated ventilation systems\n⚒️ Step 6: IRC Compliance\n• Ventilation: Required in all bathrooms (IRC R303.3)\n• Moisture Protection: Bathtub/shower walls must be moisture-resistant (IRC R702.4.2)\n• Caulking & Grout: Must be intact to prevent water intrusion",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Hot and cold water cannot be activated or deactivated.",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Sink component is damaged or missing, and the sink is not functionally adequate",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Sink or vanity is improperly installed, pulling away from the wall, leaning, or there are gaps between the sink and wall.",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Sink is not draining.",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Sink component is damaged or missing, and the sink is functionally adequate.",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Low",
          "repair_by": "60 Day",
          "score_formula": "2.40/n"
        },
        {
          "deficiency_selected": "Sink",
          "deficiency_detail": "Water is directed outside of the basin when in use.",
          "how_to_inspect": "🧭 Step 1: Identify Sink Type & Location\n• Fixed Basin: Wall-mounted, pedestal, or vanity-integrated\n• Components: Faucet, handles, drain, stopper, supply lines, overflow\n• Required: Every residential unit bathroom must contain at least one operable sink.\n🔍 Step 2: Visual Condition, Cleanability & Sanitation\n• Surface condition: Must be free of mold, grime, or pest attractants.\n• Odor check: Foul smells may indicate hidden moisture or drainage issues.\n🧪 Step 3: Functional Testing\n• Run Hot & Cold Water: Confirm activation and temperature control\n• Fill Basin: Engage stopper and observe water retention\n• Drain Test: Release stopper and confirm full drainage within 60 seconds\n• Leak Check: Inspect under sink for dripping or pooling water\n📏 Step 4:Accessibility & Local Requirement\n• Clear Floor Space: Minimum 30\"x48\" in front of sink\n• Knee Clearance: Required under sink for wheelchair users (IBU 606.2)\n• Reach Range: Controls must be within 15\"–48\" AFF\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Confirm connection to approved potable source (IRC P2902)\n• Drainage: Must connect to sanitary system (IRC P2711)\n• Ventilation: Ensure proper venting to prevent sewer gas (IRC P3101)\n• IBU Overlay: May require sealed surfaces, mold-resistant materials, or pest control coordination",
          "note": "",
          "pic": "",
          "health_safety": "Low",
          "repair_by": "60 Day",
          "score_formula": "2.40/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "A toilet is damaged or inoperable, and at least one operational toilet is installed elsewhere.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "A toilet is missing, and at least one toilet is installed elsewhere that is operational.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Only one toilet was installed, and it is damaged or inoperable.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Severe",
          "repair_by": "24 Hrs.",
          "score_formula": "14.8/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Only one toilet was installed, and it is missing.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "30/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Toilet can not be used in private (no privacy)",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Toilet component is damaged, inoperable, or missing and it does not limit the resident's ability to discharge human waste.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Low",
          "repair_by": "60 Day",
          "score_formula": "2.40/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Toilet component is damaged, inoperable, or missing such that it may limit the resident's ability to safely discharge human waste.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Toilet",
          "deficiency_detail": "Toilet is not secured at the base.",
          "how_to_inspect": "🧭 Step 1: Identify Toilet Type & Location\n• Location: Bathroom or restroom inside the unit\n• Exclude: Portable toilets or resident-owned bidets unless permanently installed\n🔍 Step 2: Presence & Identification\n• Required: Every residential unit must have at least one operable toilet.\n• Standard Components: Bowl, tank, seat, flush handle, supply line, shut-off valve\n🧪 Step 3: Functional Testing\n• Flush Test: Open the lid and seat\n• Flush and observe water flow, refill, and shut off\n• Stability Check: Apply gentle pressure to the bowl (e.g., with knee)\n• Confirm it does not move or rock\n• Leak Check: Inspect base and supply line for water pooling or dripping\n📏 Step 4: Accessibility & Local Requirements\n• Height: ADA-compliant toilets typically 17–19\" AFF (above finished floor)\n• Grab bars: Required in accessible units—must be securely mounted and within reach\n• IBU Overlay: May require lever-style flush controls, rear clearance, or transfer spacing\n⚒️ Step 5: IRC Plumbing & Safety Checks\n• Water Supply: Must connect to potable source (IRC P2902)\n• Drainage: Must discharge to approved sanitary system (IRC P3005)\n• Ventilation: Bathroom must have operable window or exhaust fan (IRC R303.3)\n• Seal & Mounting: Toilet must be sealed with wax ring and bolted securely (IRC P2705.1)",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Ventilation",
          "deficiency_detail": "An exhaust fan, window, or adequate means of ventilation is not present and operable.",
          "how_to_inspect": "🧭 Step 1: Identify Ventilation Type\n• Mechanical Ventilation: Exhaust fan ducted to the exterior\n• Natural Ventilation: Operable window\n• Central Ventilation: Passive or motorized system (standard in high-rise buildings)\n🔍 Step 2: Visual Inspection\n• Check for dust, grease, or debris blocking the grill\n🧪 Step 3: Functional Testing\n• Fan Activation:\n• Turn on the switch and listen for the motor\n• Use tissue test: hold paper near grill to confirm suction\n• Window Test:\n• Open and close the window fully\n• Confirm it stays open without external support\n📏 Step 4: Accessibility & Local Requirement\n• Switch Height: Must be within 15\"–48\" AFF for accessible units\n• Window Operation: Must be operable with one hand, no tight grasping or twisting\n• Reach Range: Controls must be reachable from a seated position if required\n• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units\n⚒️ Step 5: IRC Compliance\n• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or\n• An operable window\n• Fan Ducting: Must terminate outside the building—not into attic or crawlspace\n• Moisture Control: Ventilation must prevent excess humidity and mold risk",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Ventilation",
          "deficiency_detail": "The exhaust system component is missing and damaged, affecting the function adequately.",
          "how_to_inspect": "🧭 Step 1: Identify Ventilation Type\n• Mechanical Ventilation: Exhaust fan ducted to the exterior\n• Natural Ventilation: Operable window\n• Central Ventilation: Passive or motorized system (standard in high-rise buildings)\n🔍 Step 2: Visual Inspection\n• Check for dust, grease, or debris blocking the grill\n🧪 Step 3: Functional Testing\n• Fan Activation:\n• Turn on the switch and listen for the motor\n• Use tissue test: hold paper near grill to confirm suction\n• Window Test:\n• Open and close the window fully\n• Confirm it stays open without external support\n📏 Step 4: Accessibility & Local Requirement\n• Switch Height: Must be within 15\"–48\" AFF for accessible units\n• Window Operation: Must be operable with one hand, no tight grasping or twisting\n• Reach Range: Controls must be reachable from a seated position if required\n• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units\n⚒️ Step 5: IRC Compliance\n• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or\n• An operable window\n• Fan Ducting: Must terminate outside the building—not into attic or crawlspace\n• Moisture Control: Ventilation must prevent excess humidity and mold risk",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Ventilation",
          "deficiency_detail": "The exhaust system does not respond to the control switch (inoperable).",
          "how_to_inspect": "🧭 Step 1: Identify Ventilation Type\n• Mechanical Ventilation: Exhaust fan ducted to the exterior\n• Natural Ventilation: Operable window\n• Central Ventilation: Passive or motorized system (standard in high-rise buildings)\n🔍 Step 2: Visual Inspection\n• Check for dust, grease, or debris blocking the grill\n🧪 Step 3: Functional Testing\n• Fan Activation:\n• Turn on the switch and listen for the motor\n• Use tissue test: hold paper near grill to confirm suction\n• Window Test:\n• Open and close the window fully\n• Confirm it stays open without external support\n📏 Step 4: Accessibility & Local Requirement\n• Switch Height: Must be within 15\"–48\" AFF for accessible units\n• Window Operation: Must be operable with one hand, no tight grasping or twisting\n• Reach Range: Controls must be reachable from a seated position if required\n• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units\n⚒️ Step 5: IRC Compliance\n• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or\n• An operable window\n• Fan Ducting: Must terminate outside the building—not into attic or crawlspace\n• Moisture Control: Ventilation must prevent excess humidity and mold risk",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Ventilation",
          "deficiency_detail": "Exhaust system has restricted air flow.",
          "how_to_inspect": "🧭 Step 1: Identify Ventilation Type\n• Mechanical Ventilation: Exhaust fan ducted to the exterior\n• Natural Ventilation: Operable window\n• Central Ventilation: Passive or motorized system (standard in high-rise buildings)\n🔍 Step 2: Visual Inspection\n• Check for dust, grease, or debris blocking the grill\n🧪 Step 3: Functional Testing\n• Fan Activation:\n• Turn on the switch and listen for the motor\n• Use tissue test: hold paper near grill to confirm suction\n• Window Test:\n• Open and close the window fully\n• Confirm it stays open without external support\n📏 Step 4: Accessibility & Local Requirement\n• Switch Height: Must be within 15\"–48\" AFF for accessible units\n• Window Operation: Must be operable with one hand, no tight grasping or twisting\n• Reach Range: Controls must be reachable from a seated position if required\n• IBU Overlay: May require tactile controls, multilingual signage, or audible indicators in accessible units\n⚒️ Step 5: IRC Compliance\n• IRC R303.3: Bathrooms must have either: A mechanical exhaust fan vented to the outdoors, or\n• An operable window\n• Fan Ducting: Must terminate outside the building—not into attic or crawlspace\n• Moisture Control: Ventilation must prevent excess humidity and mold risk",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        }
      ]
    },
    {
      "name": "Cabinets and Storage (Pantry/Laundry)",
      "deficiencies": [
        {
          "deficiency_selected": "Pantry, Food Storage Space Not Present",
          "deficiency_detail": "Storage for essential food items is damaged, inoperable, or missing—affecting over 50% of cabinet doors, drawers, or shelves.",
          "how_to_inspect": "🧭 Step 1: Identify Storage Areas to Inspect\n• Kitchen Cabinets: Wall-mounted and base units\n• Pantry: Built-in or closet-style food storage\n• Laundry Cabinets: Overhead or base cabinets near washer/dryer\n• Exclude: Freestanding furniture or resident-owned storage unless permanently installed\n🔍 Step 2:Presence & Identification\n• Required if: The space is designated for kitchen or bathroom use.\n• Cabinet types: Wall-mounted, base cabinets, vanities, pantry units, and under-sink storage.\n🧪 Step 3:  Functionality Test\n• Open and close all doors and drawers—confirm smooth operation and full extension.\n• Check shelves for sagging, missing supports, or instability.\n• Hardware: Inspect knobs, handles, hinges, and drawer slides for looseness or failure.\n📏 Step 4: Accessibility & Local Requirements\n• Reach range: Shelves and handles should be within ADA-compliant height (typically 15–48\" AFF)\n• Clearance: Doors and drawers must not obstruct egress or accessible paths\n• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing\n⚒️ Step 5: Installation & Safety (IRC)\n• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)\n• NSPIRE Cabinet Standard v3.0 – NSPIRE Protocol Guide\n• IBU overlays – Local habitability, accessibility, and sanitation codes \n• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "Laundry Storage Component damaged, Inoperable, Missing.",
          "deficiency_detail": "50% or more of laundry cabinet doors, drawers, or shelves are missing (i.e., evidence of prior installation).",
          "how_to_inspect": "🧭 Step 1: Identify Storage Areas to Inspect\n• Kitchen Cabinets: Wall-mounted and base units\n• Pantry: Built-in or closet-style food storage\n• Laundry Cabinets: Overhead or base cabinets near washer/dryer\n• Exclude: Freestanding furniture or resident-owned storage unless permanently installed\n🔍 Step 2:Presence & Identification\n• Required if: The space is designated for kitchen or bathroom use.\n• Cabinet types: Wall-mounted, base cabinets, vanities, pantry units, and under-sink storage.\n🧪 Step 3:  Functionality Test\n• Open and close all doors and drawers—confirm smooth operation and full extension.\n• Check shelves for sagging, missing supports, or instability.\n• Hardware: Inspect knobs, handles, hinges, and drawer slides for looseness or failure.\n📏 Step 4: Accessibility & Local Requirements\n• Reach range: Shelves and handles should be within ADA-compliant height (typically 15–48\" AFF)\n• Clearance: Doors and drawers must not obstruct egress or accessible paths\n• IBU Overlay: May require rounded edges, soft-close hardware, or tactile indicators in elderly housing\n⚒️ Step 5: Installation & Safety (IRC)\n• Secure Mounting: Cabinets must be anchored to wall studs (IRC R602.3)\n• NSPIRE Cabinet Standard v3.0 – NSPIRE Protocol Guide\n• IBU overlays – Local habitability, accessibility, and sanitation codes \n• No Electrical Obstruction: Cabinets must not block outlets, switches, or ventilation",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        }
      ]
    },
    {
      "name": "Call-for-Aid System",
      "deficiencies": [
        {
          "deficiency_selected": "System does not function properly.",
          "deficiency_detail": "A call-for-aid system does not emit sound or light or send signal to annunciator.",
          "how_to_inspect": "🧭 Step 1: Presence & Identification\n•  NSPIRE does not mandate Call-For-Aid systems, but if present, they must be functional and accessible.\n• Valid locations: Bathrooms, bedrooms, and hallways.\n• System types: Pull cords, wall-mounted buttons, annunciator panels, audible alarms, and visual indicators.\n• Exclusions: Personal wearable devices \n🔍 Step 2: Visual Accessibility\n• Pull cord, Wall-mounted button, Annunciator panel, Audible alarm or flashing light\n🧪 Step 3: Operability Test\n• Activation: Gently pull the cord or press the button—confirm the system triggers an audible and/or visual alert.\n• Response check: Verify that the signal reaches the annunciator panel or designated alert system.\n• NSPIRE Deficiency: System does not function properly = Life-threatening\n• IBU Overlay: May require integration with on-site staff alert systems or third-party monitoring\n📏 Step 4: Accessibility & Mounting Height\n• Pull cord height: The end of the cord must be ≤6 inches above the finished floor.\n• NSPIRE Deficiency 1: If the cord is missing or mounted too high = Moderate\n• IBU Overlay: May require dual-height activation points for seated and standing users\n⚡ Step 5: IRC Electrical Safety\n• Wiring: Must be enclosed and compliant with IRC Chapter E3900\n• Power Source: Confirm backup power or battery if system is hardwired\n• No exposed conductors: Any exposed wiring is a code violation",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "60/50xn"
        },
        {
          "deficiency_selected": "The system is blocked, or the pull cord is higher than 6 inches off the floor.",
          "deficiency_detail": "Call-for-aid system is blocked. OR The pull cord end is higher than 6 inches off the floor.",
          "how_to_inspect": "🧭 Step 1: Presence & Identification\n•  NSPIRE does not mandate Call-For-Aid systems, but if present, they must be functional and accessible.\n• Valid locations: Bathrooms, bedrooms, and hallways.\n• System types: Pull cords, wall-mounted buttons, annunciator panels, audible alarms, and visual indicators.\n• Exclusions: Personal wearable devices \n🔍 Step 2: Visual Accessibility\n• Pull cord, Wall-mounted button, Annunciator panel, Audible alarm or flashing light\n🧪 Step 3: Operability Test\n• Activation: Gently pull the cord or press the button—confirm the system triggers an audible and/or visual alert.\n• Response check: Verify that the signal reaches the annunciator panel or designated alert system.\n• NSPIRE Deficiency: System does not function properly = Life-threatening\n• IBU Overlay: May require integration with on-site staff alert systems or third-party monitoring\n📏 Step 4: Accessibility & Mounting Height\n• Pull cord height: The end of the cord must be ≤6 inches above the finished floor.\n• NSPIRE Deficiency 1: If the cord is missing or mounted too high = Moderate\n• IBU Overlay: May require dual-height activation points for seated and standing users\n⚡ Step 5: IRC Electrical Safety\n• Wiring: Must be enclosed and compliant with IRC Chapter E3900\n• Power Source: Confirm backup power or battery if system is hardwired\n• No exposed conductors: Any exposed wiring is a code violation",
          "note": "",
          "pic": "",
          "health_safety": "Severe",
          "repair_by": "24Hrs",
          "score_formula": "14.8/50xn"
        }
      ]
    },
    {
      "name": "Carbon Monoxide Alarm",
      "deficiencies": [
        {
          "deficiency_selected": "Carbon monoxide alarm does not produce audio or visual alarm when tested.",
          "deficiency_detail": "Required carbon monoxide alarm is inoperable(dead batteries) or the alarm does not cease after testing.",
          "how_to_inspect": "🧭 Step 1: Location Requirements\n• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit\n• In the immediate vicinity of each sleeping area\n• Inside each bedroom if it contains or is adjacent to a fuel-burning source\n• In the room with the first duct register if served by a remote furnace\n• On the ceiling of any room containing a fuel-burning appliance\n• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms\n unit.🔍 Step 2:Obstruction & Visibility\n• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise\n• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc. \n Step 3: Functional Testing\n- Press Test Button:\n- Confirm audible alarm sounds\n- If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates\n- Battery Check:  If battery-powered, confirm battery is present and not expired\n- Hardwired Units: Confirm backup battery is installed and functional\nNSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours\n📏 Step 4: Accessibility & Local Requirement\n- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access\n- Reach Range: Must be operable within 15\"–48\" AFF in accessible units\n-IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems                                                                  ⚒️ Step 5: IRC Installation & Safety\n- IRC Section R315:  CO alarms must be listed to UL 2034",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "0.000"
        },
        {
          "deficiency_selected": "carbon monoxide alarm is missing, not installed or not installed in the proper location.",
          "deficiency_detail": "The location of the previous installation is not relevant. Unit/building contains a fuel-burning appliance or fuel-burning fireplace. Carbon monoxide alarm is missing alarms near sleeping areas, bathrooms, remote furnaces, or garages, making the unit noncompliant.",
          "how_to_inspect": "🧭 Step 1: Location Requirements\n• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit\n• In the immediate vicinity of each sleeping area\n• Inside each bedroom if it contains or is adjacent to a fuel-burning source\n• In the room with the first duct register if served by a remote furnace\n• On the ceiling of any room containing a fuel-burning appliance\n• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms\n unit.🔍 Step 2:Obstruction & Visibility\n• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise\n• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc. \n Step 3: Functional Testing\n- Press Test Button:\n- Confirm audible alarm sounds\n- If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates\n- Battery Check:  If battery-powered, confirm battery is present and not expired\n- Hardwired Units: Confirm backup battery is installed and functional\nNSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours\n📏 Step 4: Accessibility & Local Requirement\n- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access\n- Reach Range: Must be operable within 15\"–48\" AFF in accessible units\n-IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems                                                                  ⚒️ Step 5: IRC Installation & Safety\n- IRC Section R315:  CO alarms must be listed to UL 2034",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "0.000"
        },
        {
          "deficiency_selected": "Carbon monoxide alarm is obstructed.",
          "deficiency_detail": "Carbon monoxide alarm is obstructed.is covered by a foreign object (e.g., plastic bag, shower cap, zip tie, paint, tape, decorative stickers).",
          "how_to_inspect": "🧭 Step 1: Location Requirements\n• IRC and NSPIRE require alarms to be installed outside each sleeping area and on each level of the unit\n• In the immediate vicinity of each sleeping area\n• Inside each bedroom if it contains or is adjacent to a fuel-burning source\n• In the room with the first duct register if served by a remote furnace\n• On the ceiling of any room containing a fuel-burning appliance\n• IBU Overlay: May require CO alarms in hallways, near garages, or in mechanical rooms\n unit.🔍 Step 2:Obstruction & Visibility\n• Mounting height: Typically 5–6 feet AFF (above finished floor) unless manufacturer specifies otherwise\n• Obstruction check: Alarm must not be blocked by furniture, drapes, or fixtures, etc. \n Step 3: Functional Testing\n- Press Test Button:\n- Confirm audible alarm sounds\n- If a visual alarm is required (e.g., for hearing-impaired residents), confirm strobe or display activates\n- Battery Check:  If battery-powered, confirm battery is present and not expired\n- Hardwired Units: Confirm backup battery is installed and functional\nNSPIRE cites non-functional alarms as a life-threatening deficiency requiring correction within 24 hours\n📏 Step 4: Accessibility & Local Requirement\n- Mounting Height: Typically 5–6 feet AFF (above finished floor) for visibility and access\n- Reach Range: Must be operable within 15\"–48\" AFF in accessible units\n-IBU Overlay: May require UL 2034 compliance, multilingual signage, or integration with building-wide alert systems                                                                  ⚒️ Step 5: IRC Installation & Safety\n- IRC Section R315:  CO alarms must be listed to UL 2034",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "0.000"
        }
      ]
    },
    {
      "name": "Ceiling",
      "deficiencies": [
        {
          "deficiency_selected": "The ceiling component(s) is not functionally adequate.",
          "deficiency_detail": "The ceiling component is not functionally adequate. (Water infiltration should be evaluated under Leak Water Deficiency.) Severe failure should be evaluated under structural deficiency.",
          "how_to_inspect": "🧭 Step 1: Identify Ceiling Type & Location\n• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling\n• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces\n• Include: Lofted ceilings, drop ceilings, and soffits\n• Exclude: Decorative elements unless they affect safety or function\n🔍 Step 2: Visual Identification & Coverage\n• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens\n• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)\n🧪 Step 3: Functional Testing (if applicable)\n• Touch Test: Gently press on sagging areas to check for movement or softness\n• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)\n📏 Step 4: Accessibility & Local Requirement\n• Ceiling-Mounted Devices (e.g., alarms, fans, lights):\n• Must be operable via accessible controls (15\"–48\" AFF)\n• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents\n• Clear Headroom: Minimum 80 inches required in accessible paths\n⚒️ Step 5: IRC Structural & Safety Checks\n• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)\n• IRC R703.3: Moisture-resistant materials required in wet areas\n• IRC R302.6: Fire-resistance required between dwelling units and garages\n• IRC P2601: Leaks from above must be repaired and properly drained",
          "note": "",
          "pic": "",
          "health_safety": "Severe",
          "repair_by": "24 Hrs.",
          "score_formula": "14.8/n"
        },
        {
          "deficiency_selected": "Ceiling has a hole.",
          "deficiency_detail": "Hole is present that opens directly to the outside environment. OR Hole is present that is 2 inches or greater in diameter.",
          "how_to_inspect": "🧭 Step 1: Identify Ceiling Type & Location\n• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling\n• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces\n• Include: Lofted ceilings, drop ceilings, and soffits\n• Exclude: Decorative elements unless they affect safety or function\n🔍 Step 2: Visual Identification & Coverage\n• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens\n• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)\n🧪 Step 3: Functional Testing (if applicable)\n• Touch Test: Gently press on sagging areas to check for movement or softness\n• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)\n📏 Step 4: Accessibility & Local Requirement\n• Ceiling-Mounted Devices (e.g., alarms, fans, lights):\n• Must be operable via accessible controls (15\"–48\" AFF)\n• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents\n• Clear Headroom: Minimum 80 inches required in accessible paths\n⚒️ Step 5: IRC Structural & Safety Checks\n• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)\n• IRC R703.3: Moisture-resistant materials required in wet areas\n• IRC R302.6: Fire-resistance required between dwelling units and garages\n• IRC P2601: Leaks from above must be repaired and properly drained",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        },
        {
          "deficiency_selected": "The ceiling has an unstable surface (bulging, buckling).",
          "deficiency_detail": "There is cracking and/or small circles or blisters (nail pops) on the ceiling (which are a sign the plasterboard sheeting may be pulling away from the nails or screws).",
          "how_to_inspect": "🧭 Step 1: Identify Ceiling Type & Location\n• Ceiling type: Drywall, plaster, acoustic tile, concrete, or drop ceiling\n• Areas to Inspect: All rooms, especially bathrooms, kitchens, and utility spaces\n• Include: Lofted ceilings, drop ceilings, and soffits\n• Exclude: Decorative elements unless they affect safety or function\n🔍 Step 2: Visual Identification & Coverage\n• Scan entire ceiling in living areas, bedrooms, bathrooms, and kitchens\n• Minimum height: IRC requires ≥7′ for habitable spaces (≥6′8″ for bathrooms and hallways)\n🧪 Step 3: Functional Testing (if applicable)\n• Touch Test: Gently press on sagging areas to check for movement or softness\n• Ventilation Check: Ensure ceiling-mounted exhaust fans are functional (especially in bathrooms)\n📏 Step 4: Accessibility & Local Requirement\n• Ceiling-Mounted Devices (e.g., alarms, fans, lights):\n• Must be operable via accessible controls (15\"–48\" AFF)\n• IBU Overlay: May require seismic bracing, compliant lighting controls, or visual contrast for low-vision residents\n• Clear Headroom: Minimum 80 inches required in accessible paths\n⚒️ Step 5: IRC Structural & Safety Checks\n• IRC R702.3: Ceilings must be covered with approved materials (e.g., gypsum board)\n• IRC R703.3: Moisture-resistant materials required in wet areas\n• IRC R302.6: Fire-resistance required between dwelling units and garages\n• IRC P2601: Leaks from above must be repaired and properly drained",
          "note": "",
          "pic": "",
          "health_safety": "Moderate",
          "repair_by": "30 Day",
          "score_formula": "5.5/n"
        }
      ]
    },
    {
      "name": "Chimney",
      "deficiencies": [
        {
          "deficiency_selected": "Visually accessable and observable.",
          "deficiency_detail": "A chimney, flue, or firebox connected to a fireplace or wood-burning appliance is incomplete or damaged such that it may not safely contain the fire and convey smoke and combustion gases to the exterior.",
          "how_to_inspect": "🧭 Step 1: Identify Chimney Type & Location\n• Appliance Connection: Confirm chimney is connected to a fireplace, wood-burning stove, or gas appliance\n• Interior Components: Firebox, Flue, Damper, Hearth\n• Exclude: Ventless fireplaces (not scored on NSPIRE)\n🔍 Step 2: Visual Condition Assessment\n• Check for unsealed penetrations: Around light fixtures, smoke alarms, or HVAC vents\n🧪 Step 3: Functional Testing (if safe and permitted)\n• Damper Operation: Open and close to confirm movement\n• Visual Flue Check: Shine flashlight up flue to check for blockage or daylight\n• Smoke Test: Only performed by certified professionals—NSPIRE does not require this\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or rooftop access required\n• Labeling: Chimney systems should be clearly marked if serving multiple units\n• IBU Overlay: May require signage, emergency shutoff access, or integration with fire suppression systems\n⚒️ Step 5: IRC Structural & Fire Safety Checks\n• IRC R1001–R1005: Chimney must be constructed of approved masonry or metal\n• Flue must be continuous and properly sized\n• Clearance from combustibles must meet code (typically 2 inches)\n• Hearth extension must be noncombustible and appropriately sized\n• IBU overlays – Local fire safety, seismic, and ventilation codes",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "30/n"
        }
      ]
    },
    {
      "name": "Clothes Dryer Exhaust Ventilation",
      "deficiencies": [
        {
          "deficiency_selected": "Dryer transition duct is constructed of unsuitable material.",
          "deficiency_detail": "Dryer transition duct is not constructed of metal or an approved material. The dryer is being used indoors.",
          "how_to_inspect": "🧭 Step 1: Identify Dryer Type & Location\n- Electric or Gas Dryer: Inspection requirements differ slightly\n- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent\n- Location: Typically in laundry rooms, closets, or utility spaces\n🔍 Step 2: Presence & Applicability\n• Required if: A dryer is installed and positioned for use\nNSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards\n🧪 Step 3: Functional Testing\n- Visual Airflow Check:  Run dryer briefly (if permitted) and observe airflow at exterior vent\n- Lint Inspection:  Check behind the dryer and inside the duct for lint accumulation\n- Secure Connections:  Confirm transition duct is tightly clamped to both dryer and wall outlet\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or appliance movement required\n• Labeling: Duct and termination should be identifiable and traceable\n• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers\n⚒️ Step 5: IRC Installation & Safety Requirements\n• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled\n• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace\n• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance\n• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "60/n"
        },
        {
          "deficiency_selected": "Electrical dryer exhaust ventilation has restricted airflow.",
          "deficiency_detail": "Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.",
          "how_to_inspect": "🧭 Step 1: Identify Dryer Type & Location\n- Electric or Gas Dryer: Inspection requirements differ slightly\n- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent\n- Location: Typically in laundry rooms, closets, or utility spaces\n🔍 Step 2: Presence & Applicability\n• Required if: A dryer is installed and positioned for use\nNSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards\n🧪 Step 3: Functional Testing\n- Visual Airflow Check:  Run dryer briefly (if permitted) and observe airflow at exterior vent\n- Lint Inspection:  Check behind the dryer and inside the duct for lint accumulation\n- Secure Connections:  Confirm transition duct is tightly clamped to both dryer and wall outlet\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or appliance movement required\n• Labeling: Duct and termination should be identifiable and traceable\n• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers\n⚒️ Step 5: IRC Installation & Safety Requirements\n• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled\n• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace\n• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance\n• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "60/n"
        },
        {
          "deficiency_selected": "Electric dryer transition duct is detached or missing.",
          "deficiency_detail": "Electric dryer transition duct is detached or missing (i.e., evidence of prior installation but is now not present or is incomplete).",
          "how_to_inspect": "🧭 Step 1: Identify Dryer Type & Location\n- Electric or Gas Dryer: Inspection requirements differ slightly\n- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent\n- Location: Typically in laundry rooms, closets, or utility spaces\n🔍 Step 2: Presence & Applicability\n• Required if: A dryer is installed and positioned for use\nNSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards\n🧪 Step 3: Functional Testing\n- Visual Airflow Check:  Run dryer briefly (if permitted) and observe airflow at exterior vent\n- Lint Inspection:  Check behind the dryer and inside the duct for lint accumulation\n- Secure Connections:  Confirm transition duct is tightly clamped to both dryer and wall outlet\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or appliance movement required\n• Labeling: Duct and termination should be identifiable and traceable\n• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers\n⚒️ Step 5: IRC Installation & Safety Requirements\n• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled\n• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace\n• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance\n• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "30/n"
        },
        {
          "deficiency_selected": "Gas dryer exhaust ventilation system has restricted airflow.",
          "deficiency_detail": "Gas dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.",
          "how_to_inspect": "🧭 Step 1: Identify Dryer Type & Location\n- Electric or Gas Dryer: Inspection requirements differ slightly\n- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent\n- Location: Typically in laundry rooms, closets, or utility spaces\n🔍 Step 2: Presence & Applicability\n• Required if: A dryer is installed and positioned for use\nNSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards\n🧪 Step 3: Functional Testing\n- Visual Airflow Check:  Run dryer briefly (if permitted) and observe airflow at exterior vent\n- Lint Inspection:  Check behind the dryer and inside the duct for lint accumulation\n- Secure Connections:  Confirm transition duct is tightly clamped to both dryer and wall outlet\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or appliance movement required\n• Labeling: Duct and termination should be identifiable and traceable\n• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers\n⚒️ Step 5: IRC Installation & Safety Requirements\n• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled\n• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace\n• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance\n• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "30/n"
        },
        {
          "deficiency_selected": "Gas dryer transition duct is detached or missing.",
          "deficiency_detail": "Gas dryer transition duct is detached or missing (i.e., evidence of prior installation, but is now not present or is incomplete).",
          "how_to_inspect": "🧭 Step 1: Identify Dryer Type & Location\n- Electric or Gas Dryer: Inspection requirements differ slightly\n- Ventilation System: Includes transition duct, rigid ductwork, and exterior vent\n- Location: Typically in laundry rooms, closets, or utility spaces\n🔍 Step 2: Presence & Applicability\n• Required if: A dryer is installed and positioned for use\nNSPIRE flags restricted airflow or improper materials as high-risk due to fire and carbon monoxide hazards\n🧪 Step 3: Functional Testing\n- Visual Airflow Check:  Run dryer briefly (if permitted) and observe airflow at exterior vent\n- Lint Inspection:  Check behind the dryer and inside the duct for lint accumulation\n- Secure Connections:  Confirm transition duct is tightly clamped to both dryer and wall outlet\n📏 Step 4: Accessibility & Local Requirements\n• Inspection access: Must be visual—no disassembly or appliance movement required\n• Labeling: Duct and termination should be identifiable and traceable\n• IBU Overlay: May require compliant controls, multilingual signage, or tamper-resistant covers\n⚒️ Step 5: IRC Installation & Safety Requirements\n• IRC M1502.4.1: Exhaust ducts must be metal and smooth-walled\n• IRC M1502.3: Ducts must terminate outdoors, not into the attic or crawlspace\n• IRC G2420.5: Gas shutoff valve required within 6 feet of appliance\n• IRC M1502.6: Maximum duct length and bends must comply with manufacturer specs",
          "note": "",
          "pic": "",
          "health_safety": "Life-Threatening",
          "repair_by": "24Hrs",
          "score_formula": "30/n"
        }
      ]
    }
  ]
};

// Since this file is too large, I'll create a new file with the complete data
// This is just a portion - the full JSON has more categories

console.log('JSON data loaded. This is a partial template.');
console.log('Categories found:', jsonData.categories.length);
console.log('First category:', jsonData.categories[0]?.name);
