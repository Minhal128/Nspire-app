const fs = require('fs');
const file = 'src/screens/AnalyticsScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
  "commonIssues: { name: string; percentage: number }[];",
  "commonIssues: { name: string; percentage: number }[];\n  trendData?: any;"
);

txt = txt.replace(
  "commonIssues: [],",
  "commonIssues: [],\n    trendData: null,"
);

fs.writeFileSync(file, txt);
console.log('Step 1 applied!');
