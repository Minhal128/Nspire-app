const fs = require('fs');
const fn = 'src/screens/BuildingInspectionScreen.tsx';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  "deficiencyName: f.title || fData.name || fData.title || 'Deficiency',",
  "deficiencyName: f.deficiencyName || fData.deficiencyName || f.title || fData.name || fData.title || 'Deficiency',"
);

d = d.replace(
  "codeReference: f.codeReference || fData.codeReference || '',",
  "codeReference: f.codeReference || fData.codeReference || fData.code || f.code || '',"
);

fs.writeFileSync(fn, d);
console.log("Patched fdata block");
