const fs = require('fs');
const file = 'src/services/api.ts';

let content = fs.readFileSync(file, 'utf8');

// Switch back to localhost
content = content.replace("const API_BASE_URL = 'https://inspirebackend-eight.vercel.app/api';", "const API_BASE_URL = 'http://localhost:5001/api';");

fs.writeFileSync(file, content);
console.log("API substituted back to localhost!");
