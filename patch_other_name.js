const fs = require('fs');
const file = 'src/services/enhancedNspirePDFService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const displayGroupKey = groupOrderDef.key === 'General Comment'`,
  `const displayGroupKey = groupOrderDef.key === 'Other'`
).replace(
  `? 'General Comment'`,
  `? 'General Comment'`
).replace(
  `: \`\${groupOrderDef.key} (Building - \${building})\`;`,
  `: \`\${groupOrderDef.key} (Building - \${building})\`;`
);
fs.writeFileSync(file, code);
