const fs = require('fs');
const fn = 'src/screens/BuildingInspectionScreen.tsx';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  "                deficiencyName: f.deficiencyName || fData.deficiencyName || f.title || fData.name || fData.title || 'Deficiency',\n                deficiencyDetails: getValidDetail(f.deficiencyDetails, fData?.detail, f.detail, f?.deficiency?.detail, f.description, fData?.description, 'Issue recorded'),\n                deficiencyName: f.deficiencyName || fData?.deficiencyName || f.title || fData?.name || fData?.title || f.name || 'Deficiency',",
  "                deficiencyName: f.deficiencyName || fData?.deficiencyName || fData?.name || fData?.title || f.title || f.name || 'Deficiency',\n                deficiencyDetails: getValidDetail(f.deficiencyDetails, fData?.detail, f.detail, f?.deficiency?.detail, f.description, fData?.description, 'Issue recorded'),"
);

fs.writeFileSync(fn, d);
