const fs = require('fs');
const path = 'src/screens/InspectionSummaryScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldNav = `    navigation.navigate('InspectionCategories', {
      property,
      selectedUnits,
      buildingId,
    });`;

const newNav = `    // More professional: React Navigation handles screen state memory natively without local storage. 
    // Jumping back to 'LocationInspection' ensures all previously marked normal/OD checkboxes remain filled in-memory.
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location: currentArea === 'Units' ? 'Unit' : currentArea,
    });`;

content = content.replace(oldNav, newNav);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed InspectionSummaryScreen');
