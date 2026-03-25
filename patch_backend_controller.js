const fs = require('fs');
const file = '../inspire-backend/controllers/inspectionController.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const { property_id, unit_id, inspection_type, responses } = req.body;',
  'const { property_id, unit_id, inspection_type, responses, inspectionData } = req.body;'
);

content = content.replace(
  'progress.responses = responses || progress.responses;',
  'progress.responses = responses || progress.responses;\n      if (inspectionData) progress.inspectionData = inspectionData;'
);

content = content.replace(
  'responses: responses || {}',
  'responses: responses || {},\n        inspectionData: inspectionData || {}'
);

fs.writeFileSync(file, content);
console.log('Patched controller');
