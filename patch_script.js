const fs = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `  const deficiencies = report.deficiencies || [];\n  if (!deficiencies.length) {`,
  `  const deficiencies = report.deficiencies || [];\n  if (!deficiencies.length && Object.keys(bMap).length === 0) {`
);

fs.writeFileSync(file, code);
console.log("Patched!");
