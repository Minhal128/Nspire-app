const fs = require('fs');
let code = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');
code = code.replace(/mappedReports\.sort\(\(a, b\) => \{/, "const inject_token_here = true;\n        mappedReports.sort((a, b) => {");
fs.writeFileSync('src/screens/ReportsScreen.tsx', code);
