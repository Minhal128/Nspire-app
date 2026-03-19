const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');
content = content.replace("Alert.alert('Error', 'Failed to generate report preview.');", "Alert.alert('Error', `Failed to generate report preview: ${err.message}`);");
fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
