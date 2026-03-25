const fs = require('fs');
const fn = 'src/screens/BuildingInspectionScreen.tsx';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(/nspireCode: f\.nspireCode \|\| fData\.code \|\| '-',\n\s*comments: \(f as any\)\.note/g,
  "nspireCode: f.nspireCode || fData.code || '-',\n                codeReference: f.codeReference || fData.codeReference || '',\n                comments: (f as any).note");

if (d.includes("codeReference: f.codeReference")) {
  fs.writeFileSync(fn, d);
  console.log("Fixed codeReference mapping in BuildingInspectionScreen!");
} else {
  console.log("Could not find insertion point!");
}
