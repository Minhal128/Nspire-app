/**
 * NSPIRE Deficiency Data
 * 
 * Contains all NSPIRE-compliant deficiency definitions with details,
 * criteria, and code compliance information for AI-assisted inspections.
 */

export interface DeficiencyItem {
    id: string;
    category: string;
    locationType: 'inside' | 'outside' | 'both';
    deficiencySelected: string;
    deficiencyDetail: string;
    deficiencyCriteria: string;
    codeCompliance: string;
    points?: string;
    severity?: string;
}

// Location options for Inside inspections
export const INSIDE_LOCATIONS = [
    'Basement',
    'Business Space',
    'Classroom',
    'Closet/Utility',
    'Day Care',
    'Halls/Corridors/Stairs',
    'Kitchen',
    'Laundry Room',
    'Leased Commercial',
    'Library',
    'Lobby',
    'Maintenance Shop',
    'Mechanical Room',
    'Office',
    'Other Community Space',
    'Parking Garage',
    'Patio/Porch/Balcony',
    'Receptional Room',
    'Recreation Room',
    'Refuse/Compactor Room',
    'Restrooms',
    'Salon',
    'Store',
    'Workout Room',
];

// Location options for Outside inspections
export const OUTSIDE_LOCATIONS = [
    'Building Site N',
    'Building Site S',
    'Building Site W',
    'Building Site E',
    'Courtyard',
    'Exterior E',
    'Exterior N',
    'Exterior S',
    'Exterior W',
    'Garage/Carport',
    'Grounds',
    'Other',
    'Parking Lot/Driveway/Roads',
    'Patio/Porch/Balcony',
    'Playground',
    'Roof (flat)',
    'Sidewalks/Walkways/Stoops',
];

// NSPIRE Deficiency Definitions (for AI context when analyzing)
export const DEFICIENCY_DATA: DeficiencyItem[] = [
    // --- INSIDE DEFICIENCIES ---
    {
        id: 'in-1',
        category: 'Interior',
        locationType: 'inside',
        deficiencySelected: 'Pantry, Food storage space is not present.',
        deficiencyDetail: 'Food storage space is missing from the unit.',
        deficiencyCriteria: 'Pantry, Food storage space is not present.',
        codeCompliance: 'IRC §R306.2 – Food preparation area requirements'
    },
    // ... adding more inside ones if needed, but I'll focus on the Outside ones user provided

    // --- OUTSIDE DEFICIENCIES (NEW) ---
    {
        id: 'out-1',
        category: 'Address & Signage',
        locationType: 'outside',
        deficiencySelected: 'Address or building identification codes are broken, illegible, or not visible.',
        deficiencyDetail: 'Damaged or vandalized or deteriorated, NOT readable from a reasonable distance (e.g., 20 feet).',
        deficiencyCriteria: 'Address or building identification codes are broken, illegible, or not visible.',
        codeCompliance: '🔍 1. Identification & Applicability: IRC §R319.1 – Address identification for emergency response. Font size: Minimum 4″ high numerals. Contrast check: Ensure text contrasts with background.'
    },
    {
        id: 'out-2',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'A vertical or near vertical passageway connected to a fireplace or wood-burning appliance.',
        deficiencyDetail: 'A chimney, flue, or firebox is incomplete such that it may not safely contain fire and convey combustion gases to the exterior.',
        deficiencyCriteria: 'A visually accessible chimney, flue, or firebox connected to a fireplace or wood-burning appliance is damaged.',
        codeCompliance: '🧱 Assess Structural Integrity: IRC §R1003.9 requires chimneys to extend ≥2′ above any part of the building within 10′. Cap integrity: Must prevent rain, debris, and pests from entering.'
    },
    {
        id: 'out-3',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Chimney exhibits signs of structural failure.',
        deficiencyDetail: 'The chimney exhibits signs of structural failure such that the integrity of the chimney is jeopardized.',
        deficiencyCriteria: 'This condition is a deficiency, regardless of whether the fireplace is working or has been decommissioned.',
        codeCompliance: 'IRC §R1003 – Masonry chimneys and fireplaces. Signs of buckling, leaning, or major cracking.'
    },
    {
        id: 'out-4',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Electrical dryer exhaust has restricted airflow.',
        deficiencyDetail: 'Electric dryer exhaust ventilation system is blocked or damaged such that airflow may be restricted.',
        deficiencyCriteria: 'Airflow is restricted.',
        codeCompliance: '🔍 Locate Exterior Vent: IRC (2021) §M1502 – Dryer exhaust systems must discharge outdoors. Lint accumulation: Indicates restricted airflow.'
    },
    {
        id: 'out-5',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Exterior dryer vent cover, cap, or a component therof is missing.',
        deficiencyDetail: 'Evidence of prior installation, but is now not present or is incomplete.',
        deficiencyCriteria: 'Airflow component is damaged or incomplete.',
        codeCompliance: 'IRC §M1502.3 – Termination headers and covers.'
    },
    {
        id: 'out-6',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Gas dryer exhaust ventilation system has restricted airflow.',
        deficiencyDetail: 'Gas dryer exhaust ventilation system is blocked or damaged, such that airflow may be restricted.',
        deficiencyCriteria: 'Airflow is restricted.',
        codeCompliance: 'IRC §M1502 – Exhaust systems for fuel-burning appliances.'
    },
    {
        id: 'out-7',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Door - General Standard',
        deficiencyDetail: 'An exterior door component is damaged, inoperable, or missing.',
        deficiencyCriteria: 'An exterior door is deficient if any component is damaged, inoperable, or missing in a way that affects its intended function.',
        codeCompliance: '🚪 Exterior Door: IRC (2021) §R311.2 – Means of egress and door operability. IBU Overlay: May require sealed thresholds and pest-proof sweeps.'
    },
    {
        id: 'out-8',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Garage Door',
        deficiencyDetail: 'Garage door does not open, close, or remains closed. Has a hole or will not stay open.',
        deficiencyCriteria: 'Garage door has a hole of any size that penetrates through to the interior. Door will not open and remain open.',
        codeCompliance: '🔍 Garage Door Type: IRC §R612.13 – Structural performance standards. Auto-reverse test (if motorized): Door must reverse when obstructed.'
    },
    {
        id: 'out-9',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Drain',
        deficiencyDetail: 'Drain is fully clogged. Standing water is present over the floor drain.',
        deficiencyCriteria: 'Standing water is present over the floor drain, or the floor drain is blocked such that water is unable to drain.',
        codeCompliance: '🔍 Locate Drainage Components: Drains MUST redirect water away from structures. Grates must be flush and secured to prevent trip hazards.'
    },
    {
        id: 'out-10',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Site Drainage',
        deficiencyDetail: 'Erosion is present or drainage is blocked. Standing water is present.',
        deficiencyCriteria: 'Water runoff is unable to flow through the site drainage system. Standing water is present at the entrance of the outflow pipe.',
        codeCompliance: 'Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3).'
    },
    {
        id: 'out-11',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Obstructed means of egress.',
        deficiencyDetail: 'The exit access or exit is obstructed.',
        deficiencyCriteria: 'Exit discharge path from an exit to public way is blocked.',
        codeCompliance: '🔍 Verify Accessibility: Minimum 36″ clear width for accessible egress routes. Door hardware: Must be operable without tight grasping or twisting.'
    },
    {
        id: 'out-12',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Electrical - Conductor, Outlet, and Switch',
        deficiencyDetail: 'Exposed electrical conductor. Missing covers or gaps larger than 1/2 inch.',
        deficiencyCriteria: 'Electrical systems are deficient if conductors lack proper insulation or enclosure.',
        codeCompliance: '🧠 Verify Accessibility: Switches and outlets must be reachable (≤48″ AFF). Weatherproofing: Exterior outlets must have in-use covers rated for wet locations.'
    },
    {
        id: 'out-13',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'AFCI/GFCI Protection Failure',
        deficiencyDetail: 'The AFCI outlet or AFCI breaker does not reset, or GFCI inoperable.',
        deficiencyCriteria: 'AFCI/GFCI outlet or breaker does not have visible damage, and the test or reset button is inoperable.',
        codeCompliance: 'NSPIRE Deficiency 3: Missing GFCI protection within 6 ft of water source = Severe. Mounting height: ≤48″ AFF for accessibility.'
    },
    {
        id: 'out-14',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Electrical Service Panel',
        deficiencyDetail: 'Electrical service panel is not reasonably accessible or contaminated.',
        deficiencyCriteria: 'The electrical service panel is not reasonably accessible. Overcurrent device is contaminated or damaged.',
        codeCompliance: '🔍 CEC §110.26: Minimum 30″ wide × 36″ deep clear space in front of panel. Mounting height: Panel handles must be ≤6′7″ AFF.'
    },
    {
        id: 'out-15',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Fence and Gate',
        deficiencyDetail: 'Fence components are missing or demonstrate signs of collapse. Gate will not open/close/lock.',
        deficiencyCriteria: 'Fence is deficient if missing components create a hole covering 10% or more. Gate will not open when locked or will not close.',
        codeCompliance: '🔍 Pedestrian Gates: Must provide ≥32″ clear opening (CBC §11B-404.2.3). Handle height: ≤48″ AFF.'
    },
    {
        id: 'out-16',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Exit Sign',
        deficiencyDetail: 'Exit sign is damaged, missing, obstructed, or not adequately illuminated.',
        deficiencyCriteria: 'Sign is deficient if any part of "EXIT" is not clearly visible or not properly illuminated.',
        codeCompliance: '🧭 IRC (2021) §R311.4: Directional arrows required if exit path is not straight. Letters must be ≥6" high with stroke width ≥¾".'
    },
    {
        id: 'out-17',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Fire Escape',
        deficiencyDetail: 'Fire escape component is damaged, or missing.',
        deficiencyCriteria: 'A stair, ladder, platform, guardrail, or handrail is deficient if it is visibly damaged or missing.',
        codeCompliance: '🛠 NSPIRE: Any missing or damaged fire escape component is a LIFE-THREATENING deficiency. IBC 1015.2: Guardrails ≥ 42" height.'
    },
    {
        id: 'out-18',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Fire Extinguisher',
        deficiencyDetail: 'A fire extinguisher is damaged, missing, or has incorrect pressure/expired tag.',
        deficiencyCriteria: 'Visibly damaged, missing, over/under charged, or tag is missing/expired (over 1 year).',
        codeCompliance: '🧭 Mounting Height: Top ≤48" AFF if <40 lbs. NFPA 10 Reference: Extinguishers must be inspected monthly and serviced annually.'
    },
    {
        id: 'out-19',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Flammable and Combustible Item',
        deficiencyDetail: 'Material is on or within 3 feet of an ignition source.',
        deficiencyCriteria: 'Flammable or combustible materials are placed within 3 feet of thermal comfort appliances or ignition sources.',
        codeCompliance: '🧭 IRC (2021) §R302.1: Proximity Check must confirm items are ≥3 feet from ignition sources.'
    },
    {
        id: 'out-20',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Sprinkler Assembly',
        deficiencyDetail: 'Sprinkler assembly component is damaged, inoperable, or missing. Corrosion or obstruction.',
        deficiencyCriteria: 'Component is damaged or missing. Foreign material covers 50% or more. Obstructed within 18 inches.',
        codeCompliance: '🧭 IRC P2904: Sprinkler systems must meet NFPA 13D standards. Clearance: ≥18 inches required around heads.'
    },
    {
        id: 'out-21',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Foundation Issues',
        deficiencyDetail: 'Foundation is cracked, infiltrated by water, or shows exposed rebar.',
        deficiencyCriteria: 'Exposed rebar. Crack ≥1/4" width and ≥12" length. Evidence of water infiltration.',
        codeCompliance: 'Grade check: Confirm slope ≥6″ fall within first 10′ from foundation (IRC §R401.3).'
    },
    {
        id: 'out-22',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Rat',
        deficiencyDetail: 'Evidence of rats (live/dead, droppings, chewed holes).',
        deficiencyCriteria: 'Evidence of rats is found.',
        codeCompliance: '🔍 Entry Points: Check foundation gaps, door sweeps, and wall penetrations. NSPIRE: Presence is a SEVERE deficiency (30-day correction).'
    },
    {
        id: 'out-23',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'LITTER',
        deficiencyDetail: 'Litter is accumulated in an undesignated area.',
        deficiencyCriteria: '10 or more small items or any large items in a 10×10 ft area.',
        codeCompliance: 'IRC §R306.1 – Sanitary drainage and site cleanliness. Quantify litter presence using NSPIRE thresholds.'
    },
    {
        id: 'out-24',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Sharp edges',
        deficiencyDetail: 'A sharp edge that can result in a cut or puncture hazard is present.',
        deficiencyCriteria: 'Sharp edge likely to require emergency care (e.g., stitches) is present within the built environment.',
        codeCompliance: '🔍 Height check: Sharp edges within 24″–72″ AFF pose the greatest risk. IRC §R301.1: Safe for occupants.'
    },
    {
        id: 'out-25',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Trip hazard',
        deficiencyDetail: 'Trip hazard on walking surface.',
        deficiencyCriteria: 'Walking surface has an abrupt change in elevation of ¾ inch or more, or a horizontal gap of 2 inches or more.',
        codeCompliance: '🧠 Slope & surface: Must be firm, stable, and slip-resistant. Cross-slope: ≤2% for accessible routes.'
    },
    {
        id: 'out-26',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'HVAC Exhaust Issue',
        deficiencyDetail: 'Fuel-burning heating exhaust vent is misaligned, blocked, disconnected, or missing.',
        deficiencyCriteria: 'Exhaust vent is misaligned, blocked, disconnected, damaged, or missing.',
        codeCompliance: '🔧 CMC §304.3: Maintain minimum 30″ working space around units. Units must be above grade to prevent water damage.'
    },
    {
        id: 'out-27',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Natural gas, propane, or oil leak.',
        deficiencyDetail: 'Evidence of a gas, propane, or oil leak, or uncapped supply line.',
        deficiencyCriteria: 'Presence of leak detected by smell (sulfur/rotten eggs) or visible staining.',
        codeCompliance: '🔍 IRC §G2420.1.3: Shutoff valves must be accessible and clearly marked.'
    },
    {
        id: 'out-28',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Sewage System Issue',
        deficiencyDetail: 'Blocked sewage system or leak. Missing cleanout cap.',
        deficiencyCriteria: 'Wastewater unable to drain. Evidence of leak. Cleanout cap or pump cover detached/missing.',
        codeCompliance: 'IRC §P2603.2.1: Protection of piping from physical damage; §P3005.2: proper slope and joint integrity.'
    },
    {
        id: 'out-29',
        category: 'Common Areas',
        locationType: 'outside',
        deficiencySelected: 'Lighting Issues',
        deficiencyDetail: 'Permanently installed light fixture is damaged, inoperable, missing, or not secure.',
        deficiencyCriteria: 'Auxiliary lighting is damaged/missing. Exterior fixture is not secure or inoperable.',
        codeCompliance: 'IRC §R303.8: Requires illumination at exterior egress doors for safety and accessibility.'
    },
    {
        id: 'out-30',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Parking Lot / Private Road',
        deficiencyDetail: 'Potholes, ponding, or blocked access.',
        deficiencyCriteria: 'Pothole ≥ 4" deep and 1 sq. ft. Ponding > 3" over 5% of area. Access blocked.',
        codeCompliance: 'IRC §R309.1: Driveway and garage access requirements. Accessible parking: Must include van-accessible spaces.'
    },
    {
        id: 'out-31',
        category: 'Health & Safety',
        locationType: 'outside',
        deficiencySelected: 'Lead-Based Paint Deterioration',
        deficiencyDetail: 'Deteriorated paint on exterior surfaces in pre-1978 buildings.',
        deficiencyCriteria: 'Paint is peeling, chipping, or cracking. >2 SF per room/area or >10% per component.',
        codeCompliance: '🔍 IRC §R703.1: Exterior walls to resist water penetration. If pre-1978, presume lead unless certified testing exists.'
    },
    {
        id: 'out-32',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Guardrail / Handrail Issue',
        deficiencyDetail: 'Missing or unstable guardrail/handrail on stairs, ramps, or elevated surfaces.',
        deficiencyCriteria: 'Missing where required (4+ risers or >30" drop). Not secured or not graspable.',
        codeCompliance: '🔍 IRC §R311.7.8 / §R312.1: Height compliance and stability tests (push/pull test).'
    },
    {
        id: 'out-33',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Roof / Gutter Issue',
        deficiencyDetail: 'Roof damage, holes, standing water, or gutter/downspout failures.',
        deficiencyCriteria: 'Roof has a hole or standing water (25+ sq ft). Gutter component damaged/missing. Restricted flow.',
        codeCompliance: '🧱 IRC Roof Assemblies (§R901–R908): Seal integrity around penetrations. Fall protection at edges.'
    },
    {
        id: 'out-34',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Sidewalk / Walkway / Step Issue',
        deficiencyDetail: 'Blocked path, functionally inadequate, or damaged treads/stringers.',
        deficiencyCriteria: 'Blocked or impassable. Step/stair not functionally adequate. Stringer/tread damaged.',
        codeCompliance: '🔍 IRC §R311.7.5: Risers ≤7¾″ and treads ≥10″. Clear width: Minimum 36″ unobstructed.'
    },
    {
        id: 'out-35',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Structural System Failure',
        deficiencyDetail: 'Structural system exhibits signs of serious failure.',
        deficiencyCriteria: 'Failure in load-bearing elements (beams, columns, foundation) that threatens resident safety.',
        codeCompliance: '🔍 IRC §R301.1: Buildings must safely support loads and resist environmental forces. 24-hour correction required.'
    },
    {
        id: 'out-36',
        category: 'Site',
        locationType: 'outside',
        deficiencySelected: 'Retaining Wall',
        deficiencyDetail: 'Leaning or collapsed retaining wall.',
        deficiencyCriteria: 'Retaining wall is leaning away from the fill side or partially/completely collapsed.',
        codeCompliance: 'IRC §R606.1.1: Mandates engineered design for retaining walls >4′. Wall must be structurally sound.'
    },
    {
        id: 'out-37',
        category: 'Building Exterior',
        locationType: 'outside',
        deficiencySelected: 'Wall - Exterior',
        deficiencyDetail: 'Wall covering missing or has major peeling paint.',
        deficiencyCriteria: 'Missing 1 sq ft+ of covering. >10 sq ft of peeling paint (post-1978).',
        codeCompliance: 'IRC §R703.1: Exterior walls to resist water penetration and protect structural framing.'
    },
    {
        id: 'out-38',
        category: 'Building Systems',
        locationType: 'outside',
        deficiencySelected: 'Water Heater / Gas Valve Issue',
        deficiencyDetail: 'Gas shutoff valve missing/damaged. TPRV leak or discharge pipe issue.',
        deficiencyCriteria: 'Valve missing/damaged. TPRV obstructed or discharge pipe terminates incorrectly (>6" from receptor).',
        codeCompliance: '🔍 IRC §P2801.4: Proper water heater installation. Relief valve discharge must terminate ≥2" and ≤6" from grade/receptor.'
    }
];

// Helper to get deficiency options based on location type
export const getDeficiencyOptions = (locationType: 'inside' | 'outside'): string[] => {
    return DEFICIENCY_DATA
        .filter(d => d.locationType === locationType || d.locationType === 'both')
        .map(d => d.deficiencySelected);
};

// Deficiency Selected options - legacy/fallback list
export const DEFICIENCY_OPTIONS = DEFICIENCY_DATA.map(d => d.deficiencySelected);

// Get unique categories for grouping
export const getDeficiencyCategories = (): string[] => {
    const categories = [...new Set(DEFICIENCY_DATA.map(d => d.category))];
    return categories.sort();
};

// Search deficiencies
export const searchDeficiencies = (query: string, locationType?: 'inside' | 'outside'): DeficiencyItem[] => {
    const lowerQuery = query.toLowerCase();
    return DEFICIENCY_DATA.filter(d => {
        const matchesQuery = d.deficiencySelected.toLowerCase().includes(lowerQuery) ||
            d.category.toLowerCase().includes(lowerQuery);
        const matchesLocation = locationType ? (d.locationType === locationType || d.locationType === 'both') : true;
        return matchesQuery && matchesLocation;
    });
};

// Paraphrase long deficiency strings for UI display
export const getShortDeficiencyName = (deficiency: string): string => {
    if (!deficiency) return 'Select Deficiency';

    // Exact mapping for common long strings
    const mapping: { [key: string]: string } = {
        'Pantry, Food storage space is not present.': 'Missing Pantry/Storage',
        'Address or building identification codes are broken, illegible, or not visible.': 'Address/ID Signage',
        'A vertical or near vertical passageway connected to a fireplace or wood-burning appliance.': 'Chimney/Flue Passageway',
        'Chimney exhibits signs of structural failure.': 'Chimney Structural Failure',
        'Electrical dryer exhaust has restricted airflow.': 'Dryer Exhaust Airflow',
        'Exterior dryer vent cover, cap, or a component therof is missing.': 'Dryer Vent Cover/Cap',
        'Gas dryer exhaust ventilation system has restricted airflow.': 'Gas Dryer Airflow Issue',
        'Door - General Standard': 'Exterior Door Issue',
        'Garage Door': 'Garage Door Issue',
        'Drain': 'Drainage Issue',
        'Site Drainage': 'Site Drainage Issue',
        'Obstructed means of egress.': 'Egress Obstructed',
        'Electrical - Conductor, Outlet, and Switch': 'Elec. Conductor/Outlet',
        'The AFCI outlet or AFCI breaker does not reset, and if damaged, it is considered an exposed conductor.': 'AFCI/GFCI Device Failure',
        'Electrical Service Panel': 'Electrical Panel Issue',
        'Fence and Gate': 'Fence/Gate Issue',
        'Exit Sign': 'Exit Sign Issue',
        'Fire Escape': 'Fire Escape Issue',
        'Fire Extinguisher': 'Fire Extinguisher Issue',
        'Flammable and Combustible Item': 'Flammable Items',
        'Sprinkler Assembly': 'Sprinkler Issue',
        'Foundation Issues': 'Foundation Issues',
        'Rat': 'Infestation (Rat)',
        'LITTER': 'Litter/Trash',
        'Sharp edges': 'Sharp Edges',
        'Trip hazard': 'Trip Hazard',
        'HVAC Exhaust Issue': 'HVAC Exhaust Vent',
        'Natural gas, propane, or oil leak.': 'Fuel Leak',
        'Sewage System Issue': 'Sewage System Issue',
        'Lighting Issues': 'Exterior Lighting Issue',
        'Parking Lot / Private Road': 'Parking/Road Issue',
        'Lead-Based Paint Deterioration': 'LBP Deterioration',
        'Guardrail / Handrail Issue': 'Rail/Handrail Issue',
        'Roof / Gutter Issue': 'Roof/Gutter Issue',
        'Sidewalk / Walkway / Step Issue': 'Walkway/Step Issue',
        'Structural System Failure': 'Structural Failure',
        'Retaining Wall': 'Retaining Wall Issue',
        'Wall - Exterior': 'Exterior Wall Issue',
        'Water Heater / Gas Valve Issue': 'Water Heater/Gas Valve',
    };

    if (mapping[deficiency]) {
        return mapping[deficiency];
    }

    // Fallback: take first few words or just return as is if short
    if (deficiency.length > 30) {
        return deficiency.substring(0, 27) + '...';
    }

    return deficiency;
};

export const getDeficienciesByCategory = (category: string): DeficiencyItem[] => {
    return DEFICIENCY_DATA.filter(d => d.category === category);
};

export default DEFICIENCY_DATA;
