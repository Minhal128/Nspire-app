const fs = require('fs');
const fn = 'src/services/enhancedNspirePDFService.ts';
let d = fs.readFileSync(fn, 'utf8');

d = d.replace(
  "    <td class=\"la\">${isGC ? '-' : esc(def.deficiencyDetails || 'No details available')}</td>",
  "    <td class=\"la\">${isGC ? '-' : (def.deficiencyName && def.deficiencyName !== 'Deficiency' && def.deficiencyName !== 'General Comment' ? `<b>${esc(def.deficiencyName)}</b><br/><br/>` : '') + esc(def.deficiencyDetails || 'No details available')}</td>"
);

fs.writeFileSync(fn, d);
console.log("Fixed!");
