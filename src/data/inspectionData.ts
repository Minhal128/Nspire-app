// Inspection data for NSPIRE compliance

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
  { id: '12', name: 'HVAC' },
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

export const INSIDE_ITEMS: InspectionItem[] = [
  { id: '1', name: 'Bathroom' },
  { id: '2', name: 'Cabinets and Storage (Pantry/Laundry)' },
  { id: '3', name: 'Call-for-Aid System' },
  { id: '4', name: 'Carbon Monoxide Alarm' },
  { id: '5', name: 'Ceiling' },
  { id: '6', name: 'Chimney' },
  { id: '7', name: 'Clothes Dryer Exhaust Ventilation' },
  { id: '8', name: 'Doors' },
  { id: '9', name: 'Drainage (floor drain)' },
  { id: '10', name: 'Egress' },
  { id: '11', name: 'Electrical' },
  { id: '12', name: 'Fire Safety' },
  { id: '13', name: 'Floor' },
  { id: '14', name: 'Foundation' },
  { id: '15', name: 'Hazard' },
  { id: '16', name: 'Heating, Ventilation, and Air Conditioning' },
  { id: '17', name: 'Kitchen' },
  { id: '18', name: 'Leak – Gas or Oil' },
  { id: '19', name: 'Leak - Sewage System' },
  { id: '20', name: 'Leak - Water' },
  { id: '21', name: 'Lighting' },
  { id: '22', name: 'Mold' },
  { id: '23', name: 'Paint - Lead-Based Paint' },
  { id: '24', name: 'Railings' },
  { id: '25', name: 'Sink (Laundry, Garage, or Patio)' },
  { id: '26', name: 'Steps and Stairs' },
  { id: '27', name: 'Structural System' },
  { id: '28', name: 'Ventilation (Other)' },
  { id: '29', name: 'Wall' },
  { id: '30', name: 'Water Heater' },
  { id: '31', name: 'Window' },
  { id: '32', name: 'General Comment' }
];

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
