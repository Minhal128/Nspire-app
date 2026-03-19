const fs = require('fs');
let code = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

const targetStr = `        });

        // Sort by date (newest first)`;

const injectStr = `        });

        // Add local drafts from AsyncStorage
        try {
          if (AsyncStorage) {
            const allKeys = await AsyncStorage.getAllKeys();
            const savedKeys = allKeys.filter(k => k && k.startsWith('saved_inspection_'));
            for (const key of savedKeys) {
              try {
                const rawData = await AsyncStorage.getItem(key);
                if (rawData) {
                  const parsed = JSON.parse(rawData);
                  if (parsed && typeof parsed === 'object') {
                    const parts = key.split('_');
                    if (parts.length >= 3) {
                      const pId = parts[2];
                      const dbProp = (propertiesData.properties || propertiesData || []).find((p: any) => p._id === pId);
                      
                      let deduct = 0;
                      const defs = parsed.deficiencies || [];
                      defs.forEach((d: any) => {
                        const sev = d.severity || d.aiSeverity || (d.deficiency && d.deficiency.severity) || 'Moderate';
                        if (sev === 'Life-Threatening' || sev === 'critical') deduct += 10;
                        else if (sev === 'Severe' || sev === 'major') deduct += 6;
                        else if (sev === 'Moderate' || sev === 'minor') deduct += 3;
                        else deduct += 1;
                      });
                      const deducedScore = Math.max(0, 100 - deduct);
                      const isCompliant = deducedScore >= 70;
                      
                      const cCount = defs.filter((f: any) => {
                        const s = f.severity || (f.deficiency && f.deficiency.severity);
                        return s === 'critical' || s === 'Life-Threatening' || s === 'life-threatening' || s === 'severe';
                      }).length;

                      mappedReports.push({
                        id: "local_" + key,
                        property: dbProp ? dbProp.name : 'Prop', 
                        propertyId: pId,
                        unit: 'All Units',
                        inspector: storedUser ? storedUser.fullName : 'Draft Inspector',
                        date: new Date(parsed.savedAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        complianceScore: isCompliant ? 'Compliant' : 'Non-Compliant',
                        inspectionType: 'Draft Record',
                        totalDeficiencies: defs.length,
                        criticalDeficiencies: cCount,
                        notes: 'Unsynced draft stored locally on device',
                        rawData: {
                          ...parsed,
                          _id: pId, 
                          isLocal: true,
                          property: dbProp || { name: 'Prop', _id: pId },
                          deficiencies: defs,
                          findings: defs,
                          score: deducedScore
                        } as any
                      });
                    }
                  }
                }
              } catch (innerErr) {
                console.warn("Failed parsing " + key);
              }
            }
          }
        } catch (e) {
          console.warn("Error grabbing AsyncStorage for drafts:", e);
        }

        // Sort by date (newest first)`;

if (code.includes(targetStr)) {
  fs.writeFileSync('src/screens/ReportsScreen.tsx', code.replace(targetStr, injectStr));
  console.log('SUCCESS');
} else {
  console.log('FAILED TO MATCH STR');
}
