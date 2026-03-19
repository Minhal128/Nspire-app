const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/utils/nspireReportUtils.ts');
let content = fs.readFileSync(filePath, 'utf8');

const regex = /const severityMap: Record<string, DeficiencySeverity> = \{[^}]+\};/s;

const newMap = `const severityMap: Record<string, DeficiencySeverity> = {
    'critical': 'Life-Threatening',
    'major': 'Severe',
    'minor': 'Moderate',
    'observation': 'Low',
    'life-threatening': 'Life-Threatening',
    'severe': 'Severe',
    'moderate': 'Moderate',
    'low': 'Low',
    'high': 'Severe',
    'low-risk': 'Low',
    'medium': 'Moderate',
  };`;

content = content.replace(regex, newMap);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed map");
