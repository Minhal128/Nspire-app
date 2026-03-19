const fs = require('fs');
const path = 'src/screens/ReportsScreen.tsx';
let data = fs.readFileSync(path, 'utf8');

const regex = /const html = generateNSPIREReportHTML[\s\S]*?'Inspector'\n\s*\};/;
data = data.replace(regex, 'const html = await nspirePDFService.getPreviewHTML(nspireReport as any);');

// Let's actually use getPreviewHTML from nspirePDFService if they imported it, 
// else just generateNSPIREReportHTML(nspireReport as any, { includeImages: true });
const rewrite = \`const html = generateNSPIREReportHTML(nspireReport as any, { includeImages: true });\`;
data = data.replace(/const html = generateNSPIREReportHTML[\s\S]*?'Inspector'/m, rewrite);

fs.writeFileSync(path, data);
