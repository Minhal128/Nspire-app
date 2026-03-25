const fs = require('fs');
const file = '/Users/glplanet/Desktop/development/inspire/Nspire-app/src/screens/BuildingInspectionScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { WebView }')) {
    // 1. Import WebView
    content = content.replace(
        "import { Ionicons } from '@expo/vector-icons';",
        "import { WebView } from 'react-native-webview';\nimport { Ionicons } from '@expo/vector-icons';"
    );
}

if (!content.includes('const [previewHtml')) {
    // 2. Add previewHtml state
    content = content.replace(
        "const [inspectorName, setInspectorName] = useState('Inspector');",
        "const [inspectorName, setInspectorName] = useState('Inspector');\n  const [previewHtml, setPreviewHtml] = useState<string>('');"
    );
}

// 3. Generate HTML in handleExportInProgress
const reportGenLogic = `
      console.log('Sample findings:', JSON.stringify(allFindings.slice(0, 2), null, 2));
      
      setReportFindings(allFindings);

      const reportData = {
        property: property,
        inspectorName: inspector,
        date: new Date().toISOString(),
        findings: allFindings,
        status: 'in-progress',
        buildingName: property?.name || 'Building',
        selectedUnits: selectedUnits || [],
        progressData: {
          outsideProgress: 0,
          insideProgress: 0,
          unitProgress: 0,
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: UNIT_ITEMS.length,
          buildingProgressMap: {}
        }
      };

      const nspireReport = generateNSPIREReport(reportData as any);
      nspireReport.metadata.inspectorName = inspector;
      nspireReport.metadata.inspectionNo = "INSP-" + Date.now().toString(36).toUpperCase();

      const html = enhancedNspirePDFService.generateEnhancedHTMLPreview(nspireReport as any, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      } as any);

      setPreviewHtml(html);
      
      setShowReportModal(true);`;

if (!content.includes('setPreviewHtml(html)')) {
    content = content.replace(
        "      console.log('Sample findings:', JSON.stringify(allFindings.slice(0, 2), null, 2));\n      \n      setReportFindings(allFindings);\n      setShowReportModal(true);",
        reportGenLogic
    );
}

// 4. Replace Modal Content with WebView
const replacement = `{/* Report Content */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <WebView
              source={{ html: previewHtml }}
              style={{ flex: 1 }}
              originWhitelist={['*']}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              allowFileAccess={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode="always"
            />
          </View>
        `;

content = content.replace(/\{\/\*\s*Report Content\s*\*\/\}.*?(?=<\/SafeAreaView>)/s, replacement);

fs.writeFileSync(file, content);
console.log('Patched');
