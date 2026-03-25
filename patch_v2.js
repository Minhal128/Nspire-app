const fs = require('fs');
const fn = 'src/screens/BuildingInspectionScreen.tsx';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  "deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, fData?.detail, fData?.description, f.title, fData?.title, fData?.name, f.name, 'Issue recorded'),",
  "deficiencyDetails: getValidDetail(f.deficiencyDetails, fData?.detail, f.detail, f?.deficiency?.detail, f.description, fData?.description, 'Issue recorded'),\n                deficiencyName: f.deficiencyName || fData?.deficiencyName || f.title || fData?.name || fData?.title || f.name || 'Deficiency',"
);

// We made a small mistake, deficiencyName was already there before deficiencyDetails. Let's fix that too.
