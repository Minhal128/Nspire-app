// Inspection data for NSPIRE compliance
import { ALL_UNIT_CATEGORIES } from './unitDeficiencyMapping';
import { ALL_INSIDE_CATEGORIES } from './insideDeficiencyMapping';

export const UNIT_LOCATIONS = [
  'Attic/Loft',
  'Basement',
  'Bathroom1',
  'Bathroom2',
  'Bathroom3',
  'Bedroom 1',
  'Bedroom 2',
  'Bedroom 3',
  'Bedroom 4',
  'Bedroom 5',
  'Closet',
  'Dinning Area',
  'Entryway(Front/Rear',
  'Garage',
  'Hallway/Stairs',
  'Home Office/Study',
  'Kitchen',
  'Laundry Room',
  'Living Room',
  'Location',
  'Mechanical Room',
  'Office',
  'Other',
  'Patio/Porch/Balcony',
  'Storage Room'
];

export interface InspectionItem {
  id: string;
  name: string;
  hasSelectAll?: boolean;
}

export const OUTSIDE_ITEMS: InspectionItem[] = [
  { id: '1', name: 'Address and Signage' },
  { id: '2', name: 'Chimney' },
  { id: '3', name: 'Clothes Dryer Exhaust Ventilation' },
  { id: '4', name: 'Door' },
  { id: '5', name: 'Drain' },
  { id: '6', name: 'Egress' },
  { id: '7', name: 'Electrical' },
  { id: '8', name: 'Fencing/Gate' },
  { id: '9', name: 'Fire Safety' },
  { id: '10', name: 'Foundation Standard' },
  { id: '11', name: 'Hazard' },
  { id: '12', name: 'Heating, Ventilation, and Air Conditioning (HVAC)' },
  { id: '13', name: 'Leak – Gas or Oil' },
  { id: '14', name: 'Leak - Sewage System' },
  { id: '15', name: 'Leak - Water' },
  { id: '16', name: 'Lighting' },
  { id: '17', name: 'Parking Lots, Driveways, Roads' },
  { id: '18', name: 'Paint - Lead-Based Paint' },
  { id: '19', name: 'Railings' },
  { id: '20', name: 'Roof Assembly' },
  { id: '21', name: 'Sidewalk, Walkway, and Ramp' },
  { id: '22', name: 'Step and Stairs' },
  { id: '23', name: 'Structural' },
  { id: '24', name: 'Retaining Wall' },
  { id: '25', name: 'Water Heater' },
  { id: '26', name: 'General Comment' }
];

// Inside items generated directly from unitDeficiencyMapping.ts (35 categories)
export const INSIDE_ITEMS: InspectionItem[] = ALL_UNIT_CATEGORIES.map((cat, index) => {
  let name = cat.category.replace(/^\d+\.\s*/, ''); // Remove number prefix like "1. "
  if (name.toLowerCase().includes('general comment')) {
    name = 'General Comment';
  }
  return { id: String(index + 1), name };
});

// Unit items generated from insideDeficiencyMapping.ts (32 categories)
export const UNIT_ITEMS: InspectionItem[] = ALL_INSIDE_CATEGORIES.map((cat, index) => {
  let name = cat.itemName;
  if (name.toLowerCase().includes('general comment')) {
    name = 'General Comment';
  }
  return { id: String(index + 1), name };
});

export interface InspectionResponse {
  itemId: string;
  response: 'No OD' | 'OD' | 'N/A';
  note?: string;
  images?: string[];
  timestamp: number;
}

export interface InspectionSession {
  propertyId: string;
  buildingId: string;
  selectedUnits: string[];
  outside: InspectionResponse[];
  inside: InspectionResponse[];
  units: {
    [location: string]: InspectionResponse[];
  };
  startedAt: number;
  completedAt?: number;
}
