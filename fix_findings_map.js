const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/utils/nspireReportUtils.ts');
let content = fs.readFileSync(filePath, 'utf8');

const oldStr = `'observation': 'Low',
    'life-threatening': 'Life-Threatening',
    'severe': 'Severe',
    'moderate': 'Moderate',
    'low': 'Low',`;

const newStr = `'observation': 'Low',
    'life-threatening': 'Life-Threatening',
    'severe': 'Severe',
    'moderate': 'Moderate',
    'low': 'Low',
    'high': 'Severe',
    'critical': 'Life-Threatening',
    'low-risk': 'Low',
    'medium': 'Moderate',`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully fixed the severity mapping in nspireReportUtils.ts");
}
