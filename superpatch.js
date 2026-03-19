const fs = require('fs');
let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

if (!content.includes('import { WebView }')) {
    content = content.replace(
        "import { Inspection, Property } from '../services/api';",
        "import { Inspection, Property } from '../services/api';\nimport { WebView } from 'react-native-webview';\nimport AsyncStorage from '@react-native-async-storage/async-storage';\nimport { generateNSPIREReport } from '../utils/nspireReportUtils';\nimport { generateNSPIREReportHTML, nspirePDFService } from '../services/nspirePDFService';"
    );
}

if (!content.includes('previewModalVisible')) {
    content = content.replace(
        "const [sidebarVisible, setSidebarVisible] = useState(false);",
        "const [sidebarVisible, setSidebarVisible] = useState(false);\n  const [previewModalVisible, setPreviewModalVisible] = useState(false);\n  const [previewHtml, setPreviewHtml] = useState('');\n  const [currentReportTitle, setCurrentReportTitle] = useState('');"
    );
}

const sortComment = "      // Sort by date (newest first)";
const draftCode = `      // Add Local Drafts from AsyncStorage
      try {
        const keys = await AsyncStorage.getAllKeys();
        const draftKeys = keys.filter(k => k.startsWith('saved_inspection_'));
        
        for (const key of draftKeys) {
          const raw = await AsyncStorage.getItem(key);
          if (raw) {
            const draftData = JSON.parse(raw);

            const draftFindings = draftData.findings || draftData.deficiencies || [];
            const dTotalDef = draftFindings.length;
            const dCritDef = draftFindings.filter((f: any) => 
              f.severity === 'critical' || f.severity === 'life-threatening' || f.severity === 'severe'
            ).length;

            const keyParts = key.replace('saved_inspection_', '').split('_');
            const extractedPropertyId = keyParts[0];
            
            const foundProp = (propertiesData.properties || propertiesData || []).find((p: any) => p._id === extractedPropertyId || p.id === extractedPropertyId);
            const resolvedPropName = foundProp?.name || draftData.property?.name || 'Local Draft';

            mappedReports.push({
              id: draftData._id || 'draft_' + key,
              property: resolvedPropName,
              propertyId: extractedPropertyId || draftData.property?._id || '',
              unit: draftData.unit || 'All Units',
              inspector: storedUser?.fullName || 'Draft Inspector',
              date: new Date(draftData.updatedAt || draftData.createdAt || draftData.savedAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }) + ' (Draft)',
              complianceScore: 'Unpaid',
              inspectionType: draftData.inspectionType || 'Draft Inspection',
              totalDeficiencies: dTotalDef,
              criticalDeficiencies: dCritDef,
              notes: draftData.notes || 'Draft from local storage',
              rawData: { ...draftData, property: foundProp || draftData.property || { _id: extractedPropertyId, name: resolvedPropName } },
            });
          }
        }
      } catch (storageErr) {
        console.log('Error loading local drafts:', storageErr);
      }

`;
if (!content.includes('saved_inspection_')) {
    content = content.replace(sortComment, draftCode + sortComment);
}

const viewReportFunc = `  const handleViewReport = async (report: Report) => {
    try {
      setLoading(true);
      setCurrentReportTitle(\`\${report.property} Report\`);
      
      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }
      
      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const nspireReport = generateNSPIREReport(reportData);
      const html = generateNSPIREReportHTML(nspireReport as any);
      
      setPreviewHtml(html);
      setPreviewModalVisible(true);
    } catch (err: any) {
      console.error('Failed to generate preview', err);
      Alert.alert('Error', \`Failed to generate report preview: \${err.message}\`);
    } finally {
      setLoading(false);
    }
  };

  const handleShareReport = async (report: Report) => {
    try {
      setLoading(true);
      
      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }
      
      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const nspireReport = generateNSPIREReport(reportData);
      
      const result = await nspirePDFService.generateAndSharePDF(nspireReport as any, { includeImages: true } as any);
      
      if (!result.success) {
        Alert.alert('Share Failed', result.error || 'Could not share the report.');
      }
    } catch (err: any) {
      console.error('Failed to share report', err);
      Alert.alert('Error', \`Failed to share report: \${err.message}\`);
    } finally {
      setLoading(false);
    }
  };

`;

if (!content.includes('handleShareReport =')) {
    content = content.replace("  if (loading) {", viewReportFunc + "  if (loading) {");
}

content = content.replace(
    "onPress={() => navigation.navigate('ReportDetail' as never, { report } as never)}",
    "onPress={() => handleViewReport(report)}"
);
content = content.replace(
    "onPress={() => console.log('Share report:', report.property)}",
    "onPress={() => handleShareReport(report)}"
);

const modalCode = `      <Modal
        visible={previewModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937' }} numberOfLines={1}>
              {currentReportTitle || 'Report Preview'}
            </Text>
            <TouchableOpacity onPress={() => setPreviewModalVisible(false)}>
              <Ionicons name="close" size={28} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ html: previewHtml }}
            style={{ flex: 1 }}
            originWhitelist={['*']}
            showsVerticalScrollIndicator={true}
          />
        </SafeAreaView>
      </Modal>
`;

if (!content.includes('previewModalVisible}')) {
    content = content.replace("</>\n  );\n}", modalCode + "    </>\n  );\n}");
}

fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
