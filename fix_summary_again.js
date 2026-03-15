const fs = require('fs');
const path = 'src/screens/InspectionSummaryScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const currentCode = `    // More professional: React Navigation handles screen state memory natively without local storage. 
    // Jumping back to 'LocationInspection' ensures all previously marked normal/OD checkboxes remain filled in-memory.
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location: currentArea === 'Units' ? 'Unit' : currentArea,
    });`;

const newCode = `    navigation.navigate('InspectionCategories', {
      property,
      selectedUnits,
      buildingId,
    });`;

content = content.replace(currentCode, newCode);
fs.writeFileSync(path, content, 'utf8');
