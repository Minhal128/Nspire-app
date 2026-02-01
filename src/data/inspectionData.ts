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
  { id: '1', name: '1. Address and Signage' },
  { id: '2', name: '2. Chimney' },
  { id: '3', name: '3. Clothes Dryer Exhaust Ventilation' },
  { id: '4', name: '4. Door' },
  { id: '5', name: '5. Drain' },
  { id: '6', name: '6. Egress' },
  { id: '7', name: '7. Electrical' },
  { id: '8', name: '8. Fencing/Gate' },
  { id: '9', name: '9. Fire Safety' },
  { id: '10', name: '10. Foundation Standard' },
  { id: '11', name: '11. Hazard' },
  { id: '12', name: '12. HVAC' },
  { id: '13', name: '13. Leak – Gas or Oil' },
  { id: '14', name: '14. Leak - Sewage System' },
  { id: '15', name: '15. Leak - Water' },
  { id: '16', name: '16. Lighting' },
  { id: '17', name: '17. Parking Lots, Driveways, Roads' },
  { id: '18', name: '18. Paint - Lead-Based Paint' },
  { id: '19', name: '19. Railings' },
  { id: '20', name: '20. Roof Assembly' },
  { id: '21', name: '21. Sidewalk, Walkway, and Ramp' },
  { id: '22', name: '22. Step and Stairs' },
  { id: '23', name: '23. Structural' },
  { id: '24', name: '24. Retaining Wall' },
  { id: '25', name: '25. Water Heater' },
  { id: '26', name: '26. General Comment' }
];

export const INSIDE_ITEMS: InspectionItem[] = [
  { id: '1', name: '1. Cabinet and Storage (Pantry, Laundry)' },
  { id: '2', name: '2. Call-for-Aid System' },
  { id: '3', name: '3. Carbon Monoxide Alarm' },
  { id: '4', name: '4. Ceiling' },
  { id: '5', name: '5. Chimney' },
  { id: '6', name: '6. Clothes Dryer Exhaust Ventilation' },
  { id: '7', name: '7. Door' },
  { id: '8', name: '8. Door - Entry' },
  { id: '9', name: '9. Door – Fire Labeled' },
  { id: '10', name: '10. Door - General' },
  { id: '11', name: '11. Garage Door' },
  { id: '12', name: '12. Drainage' },
  { id: '13', name: '13. Egress' },
  { id: '14', name: '14. Electrical' },
  { id: '15', name: '15. Electrical Service Panel' },
  { id: '16', name: '16. Elevator' },
  { id: '17', name: '17. Fire Safety' },
  { id: '18', name: '18. Floor' },
  { id: '19', name: '19. Foundation' },
  { id: '20', name: '20. Grab Bar' },
  { id: '21', name: '21. Hazard' },
  { id: '22', name: '22. HVAC' },
  { id: '23', name: '23. Kitchen' },
  { id: '24', name: '24. Leak – Gas or Oil' },
  { id: '25', name: '25. Leak - Sewage System' },
  { id: '26', name: '26. Leak - Water' },
  { id: '27', name: '27. Lighting' },
  { id: '28', name: '28. Mold' },
  { id: '29', name: '29. Paint (Lead)' },
  { id: '30', name: '30. Bathroom' },
  { id: '31', name: '31. Restroom' },
  { id: '32', name: '32. Wall' },
  { id: '33', name: '33. Window' },
  { id: '34', name: '34. Ventilation' },
  { id: '35', name: '35. General Comment' }
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
