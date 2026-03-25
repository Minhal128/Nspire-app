const fs = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "const building = def.building || 'Building A';",
  "const building = (def.building && def.building !== '-') ? def.building : 'Building A';"
);

content = content.replace(
  "const building = def.building || 'Building';",
  "const building = (def.building && def.building !== '-') ? def.building : 'Building';"
);

fs.writeFileSync(file, content);
console.log('patched pdf service');
