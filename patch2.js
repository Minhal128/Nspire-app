const fs = require('fs');
const fn = 'src/screens/BuildingInspectionScreen.tsx';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  /deficiencyDetails: getValidDetail\(f\.deficiencyDetails, f\.description, f\.detail, f\.title, f\.name, f\.deficiencyName\),/g,
  "deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, f.detail, f?.deficiency?.detail, f.title, f?.deficiency?.title, f.name, f?.deficiency?.name, f.deficiencyName, f?.deficiency?.deficiencyName, 'Issue recorded'),"
);

d = d.replace(
  /deficiencyName: f\.deficiencyName \|\| f\.title \|\| f\.name \|\| 'Deficiency',/g,
  "deficiencyName: f.deficiencyName || f?.deficiency?.name || f.title || f?.deficiency?.title || f.name || 'Deficiency',\n                codeReference: f.codeReference || f?.deficiency?.codeReference || f?.deficiency?.code || f.code || '',\n                nspireCode: f.nspireCode || f?.deficiency?.code || '-',"
);

fs.writeFileSync(fn, d);
console.log("Patched!!");
