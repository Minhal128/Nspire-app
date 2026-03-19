const fs = require('fs');
let code = fs.readFileSync('src/screens/DashboardScreen.tsx', 'utf8');
code = code.replace(/navigation\.navigate\("EditProperty", \{/g, "navigation.navigate(\"EditProperty\" as any, {");
fs.writeFileSync('src/screens/DashboardScreen.tsx', code);
