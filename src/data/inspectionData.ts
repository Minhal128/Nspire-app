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
  { id: '1', name: 'Cabinet and Storage (Pantry, Laundry)' },
  { id: '2', name: 'Call-for-Aid System' },
  { id: '3', name: 'Carbon Monoxide Alarm' },
  { id: '4', name: 'Ceiling' },
  { id: '5', name: 'Chimney' },
  { id: '6', name: 'Clothes Dryer Exhaust Ventilation' },
  { id: '7', name: 'Door' },
  { id: '8', name: 'Door - Entry' },
  { id: '9', name: 'Door – Fire Labeled' },
  { id: '10', name: 'Door - General' },
  { id: '11', name: 'Garage Door' },
  { id: '12', name: 'Drainage' },
  { id: '13', name: 'Egress' },
  { id: '14', name: 'Electrical' },
  { id: '15', name: 'Electrical Service Panel' },
  { id: '16', name: 'Elevator' },
  { id: '17', name: 'Fire Safety' },
  { id: '18', name: 'Floor' },
  { id: '19', name: 'Foundation' },
  { id: '20', name: 'Grab Bar' },
  { id: '21', name: 'Hazard' },
  { id: '22', name: 'HVAC' },
  { id: '23', name: 'Kitchen' },
  { id: '24', name: 'Leak – Gas or Oil' },
  { id: '25', name: 'Leak - Sewage System' },
  { id: '26', name: 'Leak - Water' },
  { id: '27', name: 'Lighting' },
  { id: '28', name: 'Mold' },
  { id: '29', name: 'Paint (Lead)' },
  { id: '30', name: 'Bathroom' },
  { id: '31', name: 'Restroom' },
  { id: '32', name: 'Wall' },
  { id: '33', name: 'Window' },
  { id: '34', name: 'Ventilation' },
  { id: '35', name: 'General Comment' }
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
