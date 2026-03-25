const fs = require('fs');

const file = 'src/screens/BuildingInspectionScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

if (!txt.includes("import * as FileSystem from 'expo-file-system/legacy';")) {
    txt = txt.replace(
        "import * as Sharing from 'expo-sharing';",
        "import * as Sharing from 'expo-sharing';\nimport * as FileSystem from 'expo-file-system/legacy';\nimport { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS } from '../data/inspectionData';"
    );
}

const searchStr = `      propertySessions.forEach(session => {
        if (session.images && session.images.length > 0) {
          session.images.forEach(img => {
            if (img.findings && img.findings.length > 0) {
              const enhancedFindings = img.findings.map(f => ({
                ...f,
                imageUri: f.imageUri || img.localUri || (img as any).uri || '',
                location: f.location || img.room || img.roomCategory || session.inspectionType || 'General'
              }));
              allFindings.push(...enhancedFindings);
            }
          });
        }
      });`;

const replaceStr = `
      // ---- Count exact responses answered so far
      let globalResponses: any = {};
      try {
        if (remoteProgress && (remoteProgress as any).success && (remoteProgress as any).progress) {
          (remoteProgress as any).progress.forEach((p: any) => {
             if (String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr) {
                 if (p.responses) {
                     const key = p.inspectionType + "_" + (p.unitId || 'General');
                     if (!globalResponses[key]) globalResponses[key] = 0;
                     globalResponses[key] += Object.keys(p.responses).length;
                 }
             }
          });
        }
      } catch (e) {}
      
      propertySessions.forEach(s => {
         if (s.responses) {
             const key = s.inspectionType + "_" + (s.unitId || 'General');
             if (!globalResponses[key]) globalResponses[key] = 0;
             globalResponses[key] = Math.max(globalResponses[key], Object.keys(s.responses).length);
         }
      });

      // Track if sections have actual findings
      let hasOutsideFindings = false;
      let hasInsideFindings = false;
      let hasUnitFindings = false;

      // Ensure all images are converted to base64 so PDF gen works cross platform natively
      for (const session of propertySessions) {
        if (session.images && session.images.length > 0) {
          for (const img of session.images) {
            if (img.findings && img.findings.length > 0) {
              for (const f of img.findings) {
                let imageUri = f.imageUri || img.localUri || (img as any).uri || f.imageUrl || '';
                
                if (imageUri && Platform.OS !== 'web' && !imageUri.startsWith('data:') && !imageUri.startsWith('http')) {
                  try {
                    const fileInfo = await FileSystem.getInfoAsync(imageUri);
                    if (fileInfo.exists) {
                      const base64 = await FileSystem.readAsStringAsync(imageUri, {
                        encoding: FileSystem.EncodingType.Base64,
                      });
                      if (base64 && base64.length > 100) {
                         const ext = imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
                         imageUri = \`data:image/\${ext};base64,\${base64}\`;
                      }
                    }
                  } catch (err) {
                    console.log('Failed native conversion:', err);
                  }
                }

                const cat = (f.category || img.roomCategory || session.inspectionType || '').toLowerCase();
                if (cat.includes('outside')) hasOutsideFindings = true;
                if (cat.includes('inside')) hasInsideFindings = true;
                if (cat.includes('unit')) hasUnitFindings = true;

                allFindings.push({
                  ...f,
                  imageUri,
                  severity: f.severity || 'Moderate',
                  location: f.location || img.room || img.roomCategory || session.inspectionType || 'General'
                });
              }
            }
          }
        }
      }

      // Check if categories are 100% completed but missing any findings
      let outsideProgress = 0, insideProgress = 0, unitProgress = 0;
      Object.keys(globalResponses).forEach(k => {
         if (k.startsWith('Outside')) outsideProgress += globalResponses[k];
         if (k.startsWith('Inside')) insideProgress += globalResponses[k];
         if (k.startsWith('Unit')) unitProgress += globalResponses[k];
      });

      if (outsideProgress >= OUTSIDE_ITEMS.length && !hasOutsideFindings) {
         allFindings.push({ id: 'NO-OD-OUT', title: 'No OD', description: 'No observable deficiency was found during inspection.', category: 'Outside', location: 'Outside', severity: 'Low', imageUri: '', isGeneralComment: true });
      }
      if (insideProgress >= INSIDE_ITEMS.length && !hasInsideFindings) {
         allFindings.push({ id: 'NO-OD-IN', title: 'No OD', description: 'No observable deficiency was found during inspection.', category: 'Inside', location: 'Inside', severity: 'Low', imageUri: '', isGeneralComment: true });
      }
      const unitTotalItems = UNIT_ITEMS.length * (selectedUnits && selectedUnits.length > 0 ? selectedUnits.length : 1);
      if (unitProgress >= unitTotalItems && !hasUnitFindings && selectedUnits && selectedUnits.length > 0) {
         allFindings.push({ id: 'NO-OD-UN', title: 'No OD', description: 'No observable deficiency was found during inspection.', category: 'Units', location: 'Units', severity: 'Low', imageUri: '', isGeneralComment: true });
      }
`;

txt = txt.replace(searchStr, replaceStr);
fs.writeFileSync(file, txt);
console.log("Patched correctly.");