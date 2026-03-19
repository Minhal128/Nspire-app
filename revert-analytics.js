const fs = require('fs');
const path = './src/screens/AnalyticsScreen.tsx';

let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const filters: any = \{ status: 'completed', limit: 500 \};/g, 
"const filters: any = { status: 'completed' };");

fs.writeFileSync(path, code);
