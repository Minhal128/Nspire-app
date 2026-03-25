const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `            const match = remoteProgress.progress.find(
              (p: any) => String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr
            );
            if (match && match.inspectionData && Array.isArray(match.inspectionData.findings)) {
              allFindings.push(...match.inspectionData.findings);
            }`,
  `            remoteProgress.progress.forEach((p: any) => {
              if (String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr) {
                if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
                  allFindings.push(...p.inspectionData.findings);
                }
              }
            });`
);
fs.writeFileSync(file, code);
console.log("Patched BuildingInspectionScreen.tsx!");
