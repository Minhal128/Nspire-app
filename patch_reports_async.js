const fs = require('fs');
const path = 'src/screens/ReportsScreen.tsx';
let data = fs.readFileSync(path, 'utf8');

const search = `        });

        // Sort by date (newest first)`;

const replace = `        });

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

        // Sort by date (newest first)`;

if (data.includes(search)) {
    data = data.replace(search, replace);
    fs.writeFileSync(path, data);
    console.log('Successfully patched loadData');
} else {
    console.log('Search string not found');
}
