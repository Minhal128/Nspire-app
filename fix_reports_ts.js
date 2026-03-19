const fs = require('fs');
let code = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');
code = code.replace(/p => p\._id === pId/g, "(p: any) => p._id === pId");
code = code.replace(/defs\.forEach\(d => \{/g, "defs.forEach((d: any) => {");
code = code.replace(/defs\.filter\(f => \{/g, "defs.filter((f: any) => {");
code = code.replace(/'Compliant' : 'Non-Compliant'/g, "'Paid' : 'Unpaid'");
fs.writeFileSync('src/screens/ReportsScreen.tsx', code);
