const fs = require('fs');
let content = fs.readFileSync('src/screens/AnalyticsScreen.tsx', 'utf8');
content = content.replace("return String(propId).trim() === String(property).trim();", "console.log('Filtering:', propId, property); return String(propId).trim() === String(property).trim();");
fs.writeFileSync('src/screens/AnalyticsScreen.tsx', content);
