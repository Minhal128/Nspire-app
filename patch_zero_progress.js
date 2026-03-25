const fs = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `if (!itemsShownForBuilding && (bProgress.out > 0 || bProgress.in > 0 || bProgress.un > 0)) {`,
  `if (!itemsShownForBuilding) {`
);

fs.writeFileSync(file, code);
