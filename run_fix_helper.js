const fs = require('fs');
let screenFile = 'src/screens/BuildingInspectionScreen.tsx';
let screenContent = fs.readFileSync(screenFile, 'utf8');

// Function string to insert at top or wherever
const helperFunc = `
function getValidDetail(...args: any[]) {
  for (const a of args) {
    if (a && typeof a === 'string' && a.trim() !== '' && a.trim() !== '-') return a;
  }
  return 'No details recorded';
}
`;

if (!screenContent.includes('getValidDetail(')) {
    screenContent = screenContent.replace(
        "interface Finding {",
        helperFunc + "\ninterface Finding {"
    );
}

screenContent = screenContent.replace(
    "deficiencyDetails: (f.deficiencyDetails && f.deficiencyDetails !== '-') ? f.deficiencyDetails : (f.description || f.title || f.name || f.deficiencyName || 'Issue recorded'),",
    "deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, f.detail, f.title, f.name, f.deficiencyName),"
);

screenContent = screenContent.replace(
    "deficiencyDetails: (f.deficiencyDetails && f.deficiencyDetails !== '-') ? f.deficiencyDetails : (f.description || fData.detail || fData.description || f.title || fData.name || fData.title || 'Issue recorded'),",
    "deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, fData?.detail, fData?.description, f.title, fData?.title, fData?.name, f.name, 'Issue recorded'),"
);

fs.writeFileSync(screenFile, screenContent);


let utilsFile = 'src/utils/nspireReportUtils.ts';
let utilsContent = fs.readFileSync(utilsFile, 'utf8');

if (!utilsContent.includes('getValidDetail(')) {
    utilsContent = utilsContent.replace(
        "export const convertFindingsToDeficiencies =",
        "const getValidDetail = (...args: any[]) => {\n  for (const a of args) {\n    if (a && typeof a === 'string' && a.trim() !== '' && a.trim() !== '-') return a;\n  }\n  return 'No details recorded';\n};\n\nexport const convertFindingsToDeficiencies ="
    );
}

utilsContent = utilsContent.replace(
    "deficiencyDetails: (finding.deficiencyDetails && finding.deficiencyDetails !== '-') ? finding.deficiencyDetails : (sanitizeAIDescription(finding.description) || finding.title || finding.deficiencyName || finding.name || 'No details recorded'),",
    "deficiencyDetails: getValidDetail(finding.deficiencyDetails, sanitizeAIDescription(finding.description), finding.detail, finding.title, finding.deficiencyName, finding.name),"
);

fs.writeFileSync(utilsFile, utilsContent);
console.log('Helpers applied');
