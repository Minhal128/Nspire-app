const fs = require('fs');

const path = 'src/screens/LocationInspectionScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `} else {\n      setResponses((prev) => ({\n        ...prev,\n        [itemId]: response,\n      }));\n    }`,
  `} // removed else block because we already eagerly set the response`
);

fs.writeFileSync(path, content, 'utf8');
