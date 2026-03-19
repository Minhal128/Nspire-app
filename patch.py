import re

with open('src/screens/ReportsScreen.tsx', 'r') as f:
    data = f.read()

replacement = """        });

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
        mappedReports.sort((a, b) => {
          const dateA = new Date(a.rawData.completedDate || a.rawData.scheduledDate || (a.q…Ý…Ñ„…Ì…¹ä¤¹É•…Ñ•‘Ðñð…Ñ”¹¹½Ü ¤¤ì(€€€€€€€€€½¹ÍÐ‘…Ñ•€ô¹•Ü…Ñ”¡ˆ¹É…Ý…Ñ„¹½µÁ±•Ñ•‘…Ñ”ñðˆ¹É…Ý…Ñ„¹Í¡•‘Õ±•‘…Ñ”ñð€¡ˆ¹É…Ý…Ñ„…Ì…¹ä¤¹É•…Ñ•‘Ðñð…Ñ”¹¹½Ü ¤¤ì(€€€€€€€€€É•ÑÕÉ¸‘…Ñ•¹•ÑQ¥µ” ¤€´‘…Ñ•¹•ÑQ¥µ” ¤ì(€€€€€€€ô¤ì((€€€€€€€Í•ÑI•Á½ÉÑÌ¡µ…ÁÁ•‘I•Á½ÉÑÌ¤ìˆˆˆ(()‘…Ñ„€ôÉ”¹ÍÕˆ¡Èœ€€€€€€€qqõqp¤íq¸­qÌ¨¼¼M½ÉÐ‰ä‘…Ñ”qp¡¹•Ý•ÍÐ™¥ÉÍÑqp¥q¹qÌ©µ…ÁÁ•‘I•Á½ÉÑÍqp¹Í½ÉÑqp¡qp¡„°‰qp¤€ôøqqìÐ¸¬ýq¹Í•ÑI•Á½ÉÑÍqp¡µ…ÁÁ•‘I•Á½ÉÑÍqp¤ìœ°É•Á±…•µ•¹Ð°‘…Ñ„°™±…ÌõÉ”¹=Q10¤()Ý¥Ñ ½Á•¸ ÍÉŒ½ÍÉ••¹Ì½I•Á½ÉÑÍMÉ••¸¹ÑÍàœ°€Üœ¤…Ì˜è(€€€˜¹ÝÉ¥Ñ”¡‘…Ñ„¤()ÁÉ¥¹Ð ‰½¹”É•Á±…¥¹œµ…ÁÁ¥¹œˆ¤(