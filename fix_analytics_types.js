const fs = require('fs');
const file = './src/screens/AnalyticsScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Dimensions import
content = content.replace(/import \{([\s\S]*?)Share,/m, "import {$1Share,\n  Dimensions,");

// 2. Remove duplicate trendData typings
content = content.replace(/trendData\?:\s*any;\s*trendData\?:\s*any;/, "trendData?: any;");
content = content.replace(/trendData:\s*null,\s*trendData:\s*null,/, "trendData: null,");

// 3. Fix past4Months type
content = content.replace(/const past4Months = \[\];/, "const past4Months: { label: string; month: number; year: number; totalScore: number; count: number }[] = [];");

// 4. Fix inspection type
content = content.replace(/inspectionsList\.forEach\(\(inspection\) => \{/, "inspectionsList.forEach((inspection: any) => {");

fs.writeFileSync(file, content);
console.log('Fixed types!');
