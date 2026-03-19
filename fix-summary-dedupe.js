const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/InspectionSummaryScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `const uniqueNew = incoming.filter((d: any) => !existingIds.has(d.deficiencyQRId));
          setMergedDeficiencies([...saved.deficiencies, ...uniqueNew]);
        } else if (incoming.length > 0) {
          setMergedDeficiencies(incoming);
        }`;

const newStr = `const uniqueNew = incoming.filter((d: any) => d.deficiencyQRId && !existingIds.has(d.deficiencyQRId));
          // Additional layer of deduplication based on content strings if QR ID fails
          const combined = [...saved.deficiencies, ...uniqueNew];
          const seen = new Set();
          const dedupedCombined = combined.filter((d: any) => {
             const key = d.deficiencyQRId || (d.deficiency?.name + '_' + d.itemName + '_' + d.location);
             if (seen.has(key)) return false;
       const fs = require('fs');
const pathtuconst path = require('pa  
const filePath = path.joies(delet content = fs.readFileSync(filePath, 'utf8');

const oldStr = `const uniqueNe n
const oldStr = `const uniqueNew = incoming.filomi          setMergedDeficiencies([...saved.deficiencies, ...uniqueNew]);
        } else if (incomid.        } else if (incoming.length > 0) {
          setMergedDeficiencal          setMergedDeficiencies(incoming          }`;

const newStr = `const uniqueet
const newcie          // Additional layer of deduplication based on content strings if QR ID fails
          const combined = [..            const combined = [...saved.deficiencies, ...uniqueNew];
          const seeti          const see} else {
    console.log("Could not find string  ;
}

