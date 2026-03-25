const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Attempt to load API-saved progress(.*?)\/\/ Track if sections have actual findings/s;

const newBlock = `// Attempt to load API-saved progress just as you requested ("keep in mind the api handling and all save progress")
      let globalResponses: any = {};
      let remoteProgress: any = null;
      try {
        remoteProgress = await inspectionService.getAllProgress();
        if (remoteProgress && remoteProgress.success && remoteProgress.progress) {
          const match = remoteProgress.progress.find(
            (p: any) => String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr
          );
          if (match && match.inspectionData && Array.isArray(match.inspectionData.findings)) {
            allFindings.push(...match.inspectionData.findings);
          }
          
          remoteProgress.progress.forEach((p: any) => {
             if (String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr) {
                 if (p.responses) {
                     const key = p.inspectionType + "_" + (p.unitId || 'General');
                     if (!globalResponses[key]) globalResponses[key] = 0;
                     globalResponses[key] += Object.keys(p.responses).length;
                 }
             }
          });
        }
      } catch (err) {
        console.log("Could not fetch remote progress, relying on offline.", err);
      }

      propertySessions.forEach(s => {
         if (s.responses) {
             const key = s.inspectionType + "_" + (s.unitId || 'General');
             if (!globalResponses[key]) globalResponses[key] = 0;
             globalResponses[key] = Math.max(globalResponses[key], Object.keys(s.responses).length);
         }
      });

      // Track if sections have actual findings`;

txt = txt.replace(regex, newBlock);
fs.writeFileSync(file, txt);
console.log("Correctly patched API load");
