const { readFileSync, writeFileSync } = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let code = readFileSync(file, 'utf8');

if (code.includes("def.deficiencyDetails || 'No details available'")) {
    console.log("Found deficiencyDetails check");
}
