const fs = require('fs');
const fn = 'src/services/enhancedNspirePDFService.ts';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  "let lbl = nspireCode && nspireCode !== '-' ? nspireCode : 'HS-12';",
  "const rawRefStr = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');\n    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : (rawRefStr ? 'How to Inspect' : '-');"
);

fs.writeFileSync(fn, d);
console.log("Fixed lbl!");
