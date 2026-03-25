const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace('if (user && user.firstName) {', 'if (user && (user as any).firstName) {');
txt = txt.replace('inspectorName = `${user.firstName} ${user.lastName || \'\'}`.trim();', 'inspectorName = `${(user as any).firstName} ${(user as any).lastName || \'\'}`.trim();');
txt = txt.replace('imageUri: f.imageUri || img.localUri || img.uri || \'\',', 'imageUri: f.imageUri || img.localUri || (img as any).uri || \'\',');

fs.writeFileSync(file, txt);
