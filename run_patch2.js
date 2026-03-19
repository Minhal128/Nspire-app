const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

// Ensure AsyncStorage is imported
if (!content.includes('import AsyncStorage')) {
    content = content.replace("import { WebView } from 'react-native-webview';", "import { WebView } from 'react-native-webview';\nimport AsyncStorage from '@react-native-async-storage/async-storage';");
}


// Inject local drafts block before sorting
const draftCode = `

      // Add Local Drafts from AsyncStorage
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

      // Sort by date (newest first)
`;

content = content.replace("      // Sort by date (newest first)", draftCode);

fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
