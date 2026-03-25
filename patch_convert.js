const fs = require('fs');
const file = 'src/utils/nspireReportUtils.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "deficiencyDetails: finding.deficiencyDetails || sanitizeAIDescription(finding.description) || '-',",
  "deficiencyDetails: finding.deficiencyDetails || sanitizeAIDescription(finding.description) || finding.title || finding.deficiencyName || finding.name || 'No details recorded',"
);

content = content.replace(
  "building: finding.building || finding._building || propertyInfo?.building || finding.category || 'Main',",
  "building: (finding.building && finding.building !== '-') ? finding.building : ((finding._building && finding._building !== '-') ? finding._building : ((propertyInfo?.building && propertyInfo?.building !== '-') ? propertyInfo.building : (finding.category || 'Main'))),"
);

fs.writeFileSync(file, content);
console.log('patched convert');
