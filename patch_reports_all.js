const fs = require('fs');
const path = 'src/screens/ReportsScreen.tsx';
let data = fs.readFileSync(path, 'utf8');

// 1. Add AsyncStorage mapping to loadData
const loadDataRegex = /(\s+\}\);\s+)(\/\/ Sort by date \(newest first\))/;
const loadDataReplacement = `$1// Add Local Drafts from AsyncStorage
        try {
          const keys = await AsyncStorage.getAllKeys();
          const draftKeys = keys.filter(k => k.startsWith('saved_inspection_'));
          
          for (const key of draftKeys) {
            const raw = await AsyncStorage.getItem(key);
            if (raw) {
              const draftData = JSON.parse(raw);
              
              const draftFindings = draftData.findings || draftData.deficiencies || [];
              const dTotalDef = draftFindings.length;
              const dCritDef = draftFindings.filter((f) => 
                f.severity === 'critical' || f.severity === 'life-threatening' || f.severity === 'severe'
              ).length;
              
              mappedReports.push({
                id: draftData._id || 'draft_' + key,
                property: draftData.property?.name || 'Local Draft',
                propertyId: draftData.property?._id || '',
                unit: draftData.unit || 'All Units',
                inspector: storedUser?.fullName || 'Draft Inspector',
                date: new Date(draftData.updatedAt || draftData.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                }) + ' (Draft)',
                complianceScore: 'Unpaid',
                inspectionType: draftData.inspectionType || 'Draft Inspection',
                totalDeficiencies: dTotalDef,
                criticalDeficiencies: dCritDef,
                notes: draftData.notes || 'Draft from local storage',
                rawData: draftData,
              });
            }
          }
        } catch (storageErr) {
          console.log('Error loading local drafts:', storageErr);
        }

        $2`;

if (loadDataRegex.test(data)) {
    data = data.replace(loadDataRegex, loadDataReplacement);
    console.log('Patched local drafts into loadData');
} else {
    console.log('Could not find loadData replacement anchor');
}


// 2. Add handleViewReport function right above "if (loading && !refreshing) {" OR "return (" (before the render)
const viewReportFunc = `
    const handleViewReport = async (report: Report) => {
      try {
        setLoading(true);
        setCurrentReportTitle(\`\${report.property} Report\`);
        
        // Mock full property if only ID is present
        const reportData = { ...report.rawData };
        if (typeof reportData.property === 'string') {
          reportData.property = { _id: reportData.property, name: report.property };
        }
        
        // Convert to standard NSPIRE format
        const nspireReport = generateNSPIREReport(reportData);
        
        // Generate HTML preview
        const html = await generateNSPIREReportHTML(nspireReport, {
          includePhotos: true,
          includeSignatures: true
        });
        
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

if (!data.includes('const handleViewReport = async')) {
    data = data.replace(/(\s+if\s*\(loading && !refreshing\)\s*\{)/, viewReportFunc + '$1');
    console.log('Patched handleViewReport');
} else {
    console.log('handleViewReport already exists');
}

// 3. Update the navigation call to use handleViewReport
const navRegex = /onPress=\{\(\)\s*=>\s*navigation\.navigate\('ReportDetail'\s*as\s*never,\s*\{\s*report\s*\}\s*as\s*never\)\}/g;
if (navRegex.test(data)) {
    data = data.replace(navRegex, `onPress={() => handleViewReport(report)}`);
    console.log('Patched navigation onPress');
} else {
    console.log('Could not find navigation onPress');
}

// 4. Inject Preview Modal right before the closing tag, e.g., </SafeAreaView>
// Wait, the main render returns <SafeAreaView> on the outside?
// No, the main return has a React Fragment <> ... </> 
// Let's locate the ending of the component render: </Modal> from the sidebar, then the </>, and insert our Modal before </>

const modalHtml = `
      {/* WebView Preview Modal */}
      <Modal
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

if (!data.includes('visible={previewModalVisible}')) {
    const endRenderRegex = /(\s+)(<\/Modal>\s*<\/>)/;
    if (endRenderRegex.test(data)) {
        data = data.replace(endRenderRegex, `$1</Modal>$1${modalHtml}$1</>`);
        console.log('Patched Modal inside component render');
    } else {
        console.log('Could not find end of render anchor. Will try to search for the end differently.');
        // Maybe it just ends with </SafeAreaView>\s*\n\s*</>
        data = data.replace(/(\s+)(<\/SafeAreaView>\s*<\/>)/, `$1</SafeAreaView>$1${modalHtml}$1</>`);
        console.log('Patched Modal at alternative endpoint');
    }
} else {
    console.log('Modal already exists');
}

fs.writeFileSync(path, data);
console.log('Done.');
