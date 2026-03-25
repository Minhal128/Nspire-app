const fs = require('fs');

const file = 'src/screens/BuildingInspectionScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/f\.imageUrl \|\|/g, "(f as any).imageUrl ||");
txt = txt.replace(/let globalResponses: any = {};/g, "let globalResponses: any = {};\n      let remoteProgress: any = { success: false, progress: [] };");

fs.writeFileSync(file, txt);
console.log("Fixed typings properly");
