const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /buildingName: property\?.name \|\| 'Building',/g,
  "buildingName: (property?.name && property?.name !== '-') ? property.name : 'Building',"
);

fs.writeFileSync(file, content);
console.log('patched prop name');
