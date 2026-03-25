const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inside remote findings
content = content.replace(
    "building: p.buildingName || p.unitId || property?.name || 'Building',",
    "building: (p.buildingName && p.buildingName !== '-') ? p.buildingName : (property?.name && property?.name !== '-' ? property?.name : 'Building'),\n                deficiencyDetails: f.deficiencyDetails || f.description || f.title || f.name || f.deficiencyName || 'Issue recorded',\n                deficiencyName: f.deficiencyName || f.title || f.name || 'Deficiency',"
);

// Inside local sessions
content = content.replace(
    "deficiencyDetails: f.description || fData.detail || fData.description || 'Issue recorded',",
    "deficiencyDetails: f.deficiencyDetails || f.description || fData.detail || fData.description || f.title || fData.name || fData.title || 'Issue recorded',"
);

content = content.replace(
    "const bName = (session as any).buildingName || (session as any).buildingId || property?.name || 'Building';",
    "let bName = (session as any).buildingName || (session as any).buildingId || property?.name || 'Building';\n        if (bName === '-') bName = 'Building';"
);

fs.writeFileSync(file, content);
console.log('patched');
