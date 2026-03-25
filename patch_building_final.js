const fs = require('fs');
const file = 'src/screens/BuildingInspectionScreen.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(
    "import { nspirePDFService } from '../services/nspirePDFService';",
    "import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';\nimport * as Sharing from 'expo-sharing';"
);

const searchStr = `      const result = await nspirePDFService.generateAndSharePDF(nspireReport as any, {
        includeImages: true,
        includeDetailedDeficiencies: true
      } as any);

      if (!result.success) {
        Alert.alert('Export Failed', result.error || 'Could not export the report.');
      }`;

const replaceStr = `      nspireReport.metadata.inspectorName = inspectorName;
      nspireReport.metadata.inspectionNo = "INSP-" + Date.now().toString(36).toUpperCase();

      const result = await enhancedNspirePDFService.generateEnhancedPDF(nspireReport as any, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      } as any);

      if (!result.success) {
        Alert.alert('Export Failed', result.error || 'Could not export the report.');
        return;
      }

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'NSPIRE Inspection Report',
          UTI: 'com.adobe.pdf',
        });
      }`;

txt = txt.replace(searchStr, replaceStr);
fs.writeFileSync(file, txt);
console.log('Done replacing strings in BuildingInspectionScreen.tsx');