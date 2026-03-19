const fs = require('fs');
const file = 'src/screens/ReportsScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

const imports = `import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateNSPIREReport } from '../utils/nspireReportUtils';
import { generateNSPIREReportHTML } from '../services/nspirePDFService';`;

if (!data.includes('react-native-webview')) {
  data = data.replace(
    `import { Inspection, Property } from '../services/api';`,
    `import { Inspection, Property } from '../services/api';\n${imports}`
  );
  fs.writeFileSync(file, data);
  console.log("Imports added");
} else {
  console.log("Imports already present");
}
