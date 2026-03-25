const fs = require('fs');
const content = fs.readFileSync('src/services/nspirePDFService.ts', 'utf8');

const regex = /def\.imageUri/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('Found full line:', content.substring(match.index - 50, match.index + 50));
}
