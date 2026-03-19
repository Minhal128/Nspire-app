const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

// 1. Add imports
content = content.replace("import { Inspection, Property } from '../services/api';", "import { Inspection, Property } from '../services/api';\nimport { WebView } from 'react-native-webview';\nimport { generateNSPIREReport } from '../utils/nspireReportUtils';\nimport { generateNSPIREReportHTML } from '../services/nspirePDFService';");

// 2. Add states
content = content.replace("const [sidebarVisible, setSidebarVisible] = useState(false);", "const [sidebarVisible, setSidebarVisible] = useState(false);\n  const [previewModalVisible, setPreviewModalVisible] = useState(false);\n  const [previewHtml, setPreviewHtml] = useState('');\n  const [currentReportTitle, setCurrentReportTitle] = useState('');");

// 3. Add handleViewReport
const viewReportFunc = `  const handleViewReport = async (report: Report) => {
    try {
      setLoading(true);
      setCurrentReportTitle(\`\${report.property} Report\`);
      
      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }

      const nspireReport = generateNSPIREReport(reportData);
      const html = generateNSPIREReportHTML(nspireReport as any);
      
      setPreviewHtml(html);
      setPreviewModalVisible(true);
    } catch (err) {
      console.error('Failed to generate preview', err);
      Alert.alert('Error', 'Failed to generate report preview.');
    } finally {
      setLoading(false);
    }
  };

`;
content = content.replace("  if (loading) {", viewReportFunc + "  if (loading) {");

// 4. Update view report button
content = content.replace("onPress={() => navigation.navigate('ReportDetail' as never, { report } as never)}", "onPress={() => handleViewReport(report)}");

// 5. Add Modal before closing fragment
const modalStr = `      <Modal
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
content = content.replace("</>\n  );\n}", modalStr + "    </>\n  );\n}");

fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
