const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/screens/InspectionSummaryScreen.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const regex1 = /const key = d\.deficiencyQRId \|\| \(d\.deficiency\?\.name \+ '_' \+ d\.itemName \+ '_' \+ d\.location\);/g;

content = content.replace(regex1, `const fallbackKey = (d.deficiency?.name || '') + '_' + (d.deficiency?.detail || '').slice(0, 30) + '_' + (d.location || '');
            const key = d.deficiencyQRId || fallbackKey;`);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Improved dedupe in InspectionSummaryScreen");
