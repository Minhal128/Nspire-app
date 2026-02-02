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
  { id: '1', name: '1. Bathroom' },
  { id: '2', name: '2. Cabinets and Storage (Pantry/Laundry)' },
  { id: '3', name: '3. Call-for-Aid System' },
  { id: '4', name: '4. Carbon Monoxide Alarm' },
  { id: '5', name: '5. Ceiling' },
  { id: '6', name: '6. Chimney' },
  { id: '7', name: '7. Clothes Dryer Exhaust Ventilation' },
  { id: '8', name: '8. Doors' },
  { id: '9', name: '9. Drainage (floor drain)' },
  { id: '10', name: '10. Egress' },
  { id: '11', name: '11. Electrical' },
  { id: '12', name: '12. Fire Safety' },
  { id: '13', name: '13. Floor' },
  { id: '14', name: '14. Foundation' },
  { id: '15', name: '15. Hazard' },
  { id: '16', name: '16. Heating, Ventilation, and Air Conditioning' },
  { id: '17', name: '17. Kitchen' },
  { id: '18', name: '18. Leak – Gas or Oil' },
  { id: '19', name: '19. Leak - Sewage System' },
  { id: '20', name: '20. Leak - Water' },
  { id: '21', name: '21. Lighting' },
  { id: '22', name: '22. Mold' },
  { id: '23', name: '23. Paint - Lead-Based Paint' },
  { id: '24', name: '24. Railings' },
  { id: '25', name: '25. Sink (Laundry, Garage, or Patio)' },
  { id: '26', name: '26. Steps and Stairs' },
  { id: '27', name: '27. Structural System' },
  { id: '28', name: '28. Ventilation (Other)' },
  { id: '29', name: '29. Wall' },
  { id: '30', name: '30. Water Heater' },
  { id: '31', name: '31. Window' },
  { id: '32', name: '32. General Comment' }
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
