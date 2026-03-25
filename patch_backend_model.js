const fs = require('fs');
const file = '../inspire-backend/models/InspectionProgress.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('inspectionData')) {
  content = content.replace(
    /responses: \{/,
    `inspectionData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  responses: {`
  );
  fs.writeFileSync(file, content);
  console.log('Patched schema to include inspectionData');
}
