const fs = require('fs');
const file = 'src/utils/nspireReportUtils.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    "deficiencyDetails: finding.deficiencyDetails || sanitizeAIDescription(finding.description) || finding.title || finding.deficiencyName || finding.name || 'No details recorded',",
    "deficiencyDetails: (finding.deficiencyDetails && finding.deficiencyDetails !== '-') ? finding.deficiencyDetails : (sanitizeAIDescription(finding.description) || finding.title || finding.deficiencyName || finding.name || 'No details recorded'),"
);

fs.writeFileSync(file, content);

const screenFile = 'src/screens/BuildingInspectionScreen.tsx';
let screenContent = fs.readFileSync(screenFile, 'utf8');

screenContent = screenContent.replace(
    "deficiencyDetails: f.deficiencyDetails || f.description || f.title || f.name || f.deficiencyName || 'Issue recorded',",
    "deficiencyDetails: (f.deficiencyDetails && f.deficiencyDetails !== '-') ? f.deficiencyDetails : (f.description || f.title || f.name || f.deficiencyName || 'Issue recorded'),"
);

screenContent = screenContent.replace(
    "deficiencyDetails: f.deficiencyDetails || f.description || fData.detail || fData.description || f.title || fData.name || fData.title || 'Issue recorded',",
    "deficiencyDetails: (f.deficiencyDetails && f.deficiencyDetails !== '-') ? f.deficiencyDetails : (f.description || fData.detail || fData.description || f.title || fData.name || fData.title || 'Issue recorded'),"
);

fs.writeFileSync(screenFile, screenContent);
console.log('patched more strings');
