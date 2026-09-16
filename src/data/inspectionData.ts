// Inspection data for NSPIRE compliance
import { ALL_UNIT_CATEGORIES } from './web/insideAppData';
import { ALL_INSIDE_CATEGORIES } from './web/unitAppData';
import inspectionDeficiencies from './inspectionDeficiencies.json';

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
  standard?: string;
  inspectionProtocol?: string;
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
  { id: '18', name: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
  { id: '19', name: 'Railings' },
  { id: '20', name: 'Roof Assembly' },
  { id: '21', name: 'Sidewalk, Walkway, and Ramp' },
  { id: '22', name: 'Step and Stairs' },
  { id: '23', name: 'Structural' },
  { id: '24', name: 'Retaining Wall' },
  { id: '25', name: 'Water Heater' },
  { id: '26', name: 'General Comment' }
];

// Inside items (Common Areas) generated from ALL_UNIT_CATEGORIES in insideAppData.ts
export const INSIDE_ITEMS: InspectionItem[] = ALL_UNIT_CATEGORIES.map((cat: any, index: number) => {
  let name = cat.category.replace(/^\d+\.\s*/, ''); // Remove number prefix like "1. "
  if (name.toLowerCase().includes('general comment')) {
    name = 'General Comment';
  }
  return { id: String(index + 1), name };
});

// Unit items (Apartments) generated from ALL_INSIDE_CATEGORIES in unitAppData.ts
export const UNIT_ITEMS: InspectionItem[] = ALL_INSIDE_CATEGORIES.map((item: any, index: number) => {
  let name = item.itemName;
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

// Helper function to get Standard and Inspection Protocol for a deficiency
export function getInspectionStandardAndProtocol(
  section: 'outside' | 'inside' | 'unit',
  categoryName: string,
  deficiencyName?: string
): { standard: string; inspectionProtocol: string } | null {
  const data = inspectionDeficiencies[section];
  if (!data) return null;
  
  // Clean category name for matching (remove number prefix like "1. ")
  const cleanCategory = categoryName.replace(/^\d+\.\s*/, '').trim().toLowerCase();
  
  // If deficiency name is provided, try to match by deficiency first
  if (deficiencyName) {
    const cleanDeficiency = deficiencyName.trim().toLowerCase();
    
    // Try exact match on deficiencySelected
    let match = data.find((item: any) => {
      const itemCleanCategory = item.category.replace(/^\d+\.\s*/, '').trim().toLowerCase();
      const itemCleanDeficiency = item.deficiencySelected.trim().toLowerCase();
      return itemCleanCategory === cleanCategory && itemCleanDeficiency === cleanDeficiency;
    });
    
    // If no exact match, try partial match
    if (!match) {
      match = data.find((item: any) => {
        const itemCleanCategory = item.category.replace(/^\d+\.\s*/, '').trim().toLowerCase();
        const itemCleanDeficiency = item.deficiencySelected.trim().toLowerCase();
        return (itemCleanCategory === cleanCategory || itemCleanCategory.includes(cleanCategory) || cleanCategory.includes(itemCleanCategory)) 
          && (itemCleanDeficiency.includes(cleanDeficiency) || cleanDeficiency.includes(itemCleanDeficiency));
      });
    }
    
    if (match) {
      return {
        standard: match.standard || '',
        inspectionProtocol: match.inspectionProtocol || ''
      };
    }
  }
  
  // Fallback: match by category only and return first deficiency in that category
  const match = data.find((item: any) => {
    const itemCleanCategory = item.category.replace(/^\d+\.\s*/, '').trim().toLowerCase();
    return itemCleanCategory === cleanCategory || itemCleanCategory.includes(cleanCategory) || cleanCategory.includes(itemCleanCategory);
  });
  
  if (match) {
    return {
      standard: match.standard || '',
      inspectionProtocol: match.inspectionProtocol || ''
    };
  }
  
  return null;
}
