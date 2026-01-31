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
  { id: '12', name: 'Heating, Ventilation, and Air Conditioning (HVAC)' },
  { id: '13', name: 'Leak – Gas or Oil' },
  { id: '14', name: 'Leak - sewage system' },
  { id: '15', name: 'Leak - water' },
  { id: '16', name: 'Lighting' },
  { id: '17', name: 'Parking lots, Driveways, Roads' },
  { id: '18', name: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
  { id: '19', name: 'Railings' },
  { id: '20', name: 'Roof Assembly' },
  { id: '21', name: 'Sidewalk, walkway, and ramp' },
  { id: '22', name: 'Step and Stairs' },
  { id: '23', name: 'Structural' },
  { id: '24', name: 'RETAINING WALL' },
  { id: '25', name: 'Water Heater' },
  { id: '26', name: 'General * comment:' }
];

export const INSIDE_ITEMS: InspectionItem[] = [
  { id: '1', name: 'Bathroom' },
  { id: '2', name: 'Cabinet and Storage (Pantry, Laundry)' },
  { id: '3', name: 'Call-for-Aid System' },
  { id: '4', name: 'Carbon Monoxide Alarm' },
  { id: '5', name: 'Ceiling' },
  { id: '6', name: 'Chimney' },
  { id: '7', name: 'Clothes Dryer Exhaust Ventilation' },
  { id: '8', name: 'Door' },
  { id: '9', name: 'Drainage' },
  { id: '10', name: 'Electrical' },
  { id: '11', name: 'Elevator' },
  { id: '12', name: 'Fire Safety' },
  { id: '13', name: 'Floor' },
  { id: '14', name: 'Foundation' },
  { id: '15', name: 'Grab Bar' },
  { id: '16', name: 'Hazard' },
  { id: '17', name: 'Heating, Ventilation, and Air Conditioning (HVAC)' },
  { id: '18', name: 'Kitchen' },
  { id: '19', name: 'LEAK – Gas or Oil' },
  { id: '20', name: 'Leak-sewage system (Clogged drain)(Missing drain cap)' },
  { id: '21', name: 'Leak- water' },
  { id: '22', name: 'Lighting' },
  { id: '23', name: 'Mold' },
  { id: '24', name: 'Paint - Potential Lead-Based Paint Hazards – Visual Assessment' },
  { id: '25', name: 'Railings' },
  { id: '26', name: 'Restroom' },
  { id: '27', name: 'Sink (Laundry, Garage, or patio)' },
  { id: '28', name: 'Steps and Stairs' },
  { id: '29', name: 'Structural System' },
  { id: '30', name: 'Toilet' },
  { id: '31', name: 'Trash Chute' },
  { id: '32', name: 'Ventilation' },
  { id: '33', name: 'Wall' },
  { id: '34', name: 'Water Heater' },
  { id: '35', name: 'Window' },
  { id: '36', name: 'General comment:' }
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
