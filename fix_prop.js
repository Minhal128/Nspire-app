const fs = require('fs');

let content = fs.readFileSync('src/screens/ReportsScreen.tsx', 'utf8');

const oldDraftCode = `            mappedReports.push({
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
            });`;

const newDraftCode = `            // Extract propertyId from the key which looks like saved_inspection_{propertyId}_{buildingId}
            const keyParts = key.replace('saved_inspection_', '').split('_');
            const extractedPropertyId = keyParts[0];
            
            // Try to find the real property name
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
              rawData: { ...draftData, property: foundProp || draftData.property || extractedPropertyId },
            });`;

if (content.includes("property: draftData.property?.name || 'Local Draft',")) {
    content = content.replace(oldDraftCode, newDraftCode);
    fs.writeFileSync('src/screens/ReportsScreen.tsx', content, 'utf8');
    console.log("Successfully updated draft property extraction.");
} else {
    console.log("Could not find the target code to replace.");
}

