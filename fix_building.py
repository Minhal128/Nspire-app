import re

with open('src/screens/BuildingInspectionScreen.tsx', 'r') as f:
    content = f.read()

start_str = 'const handleExportInProgressReport = async () => {'

start_idx = content.find(start_str)
if start_idx == -1:
    print("Not found")
    exit(1)

# Find the end of the method
brace_count = 0
end_idx = -1
for i in range(start_idx + len(start_str) - 1, len(content)):
    if content[i] == '{':
        brace_count += 1
    elif content[i] == '}':
        brace_count -= 1
        if brace_count == 0:
            end_idx = i + 1
            break

new_method = """const handleExportInProgressReport = async () => {
    try {
      setIsExporting(true);

      const user = await authService.getCurrentUser();
      let inspectorName = 'Inspector';
      if (user && (user as any).firstName) {
        inspectorName = `${(user as any).firstName} ${(user as any).lastName || ''}`.trim();
      } else if (user && user.email) {
        inspectorName = user.email.split('@')[0];
      }

      const sessions = await offlineStorageService.getAllSessions();
      const propertyIdStr = String(property._id || property.propertyId || property.id);

      const propertySessions = sessions.filter(
        s => String(s.propertyId) === propertyIdStr
      );

      let allFindings: any[] = [];
      let globalResponses: any = {};
      let remoteProgress: any = null;

      try {
        remoteProgress = await inspectionService.getAllProgress();
        if (remoteProgress && remoteProgress.success && remoteProgress.progress) {
          const match = remoteProgress.progress.find(
            (p: any) => String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr
          );
          if (match && match.inspectionData && Array.isArray(match.inspectionData.findings)) {
            allFindings.push(...match.inspectionData.findings);
          }

          remoteProgress.progress.forEach((p: any) => {
            if (String(p.propertyId) === propertyIdStr || String(p.property?._id) === propertyIdStr) {
              if (p.responses) {
                const bName = p.buildingName || p.buildingId || property?.name || 'Building';
                const key = bName + "|" + p.inspectionType + "_" + (p.unitId || 'General');
                if (!globalResponses[key]) globalResponses[key] = 0;
                globalResponses[key] += Object.keys(p.responses).length;
              }
            }
          });
        }
      } catch (err) {
        console.log("Could not fetch remote progress, relying on offline.", err);
      }

      propertySessions.forEach((s: any) => {
        if (s.responses) {
          const bName = s.buildingName || s.buildingId || property?.name || 'Building';
          const key = bName + "|" + s.inspectionType + "_" + (s.unitId || 'General');
          if (!globalResponses[key]) globalResponses[key] = 0;
          globalResponses[key] = Math.max(globalResponses[key], Object.keys(s.responses).length);
        }
      });

      let buildingHasOutside: Record<string, boolean> = {};
      let buildingHasInside: Record<string, boolean> = {};
      let buildingHasUnit: Record<string, boolean> = {};
      let buildingHasItems: Record<string, boolean> = {};

      for (const session of propertySessions) {
        // Mark that this building has at least a session
        const bName = (session as any).buildingName || (session as any).buildingId || property?.name || 'Building';
        buildingHasItems[bName] = true;

        if (session.images && session.images.length > 0) {
          for (const img of session.images) {
            const hasFindings = img.findings && img.findings.length > 0;
            const itemsToProcess = hasFindings ? img.findings : [{}]; // Dummy finding if none exist

            for (const f of itemsToProcess) {
              let imageUri = f.imageUri || img.localUri || (img as any).uri || (f as any).imageUrl || '';

              if (imageUri && Platform.OS !== 'web' && !imageUri.startsWith('data:') && !imageUri.startsWith('http')) {
                try {
                  const fileInfo = await FileSystem.getInfoAsync(imageUri);
                  if (fileInfo.exists) {
                    const base64 = await FileSystem.readAsStringAsync(imageUri, {
                      encoding: FileSystem.EncodingType.Base64,
                    });
                    if (base64 && base64.length > 100) {
                      const ext = imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
                      imageUri = `data:image/${ext};base64,${base64}`;
                    }
                  }
                } catch (err) {
                  console.log('Failed native conversion:', err);
                }
              }

              const cat = (f.category || img.roomCategory || session.inspectionType || '').toLowerCase();
              let computedArea = 'General';

              if (cat.includes('outside')) {
                buildingHasOutside[bName] = true;
                computedArea = 'Outside';
              } else if (cat.includes('inside')) {
                buildingHasInside[bName] = true;
                computedArea = 'Inside';
              } else if (cat.includes('unit')) {
                buildingHasUnit[bName] = true;
                computedArea = 'Units';
              }

              if (!hasFindings) {
                // Fallback for images without explicitly logged defects
                allFindings.push({
                  id: `IMG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                  isGeneralComment: true,
                  title: 'General Photo',
                  deficiencyName: 'General Observation',
                  deficiencyDetails: 'Photo captured during inspection with no notable deficiencies.',
                  severity: '-',
                  area: computedArea,
                  category: computedArea,
                  location: img.room || img.roomCategory || (session as any).inspectionType || 'General',
                  building: bName,
                  unit: (session as any).unitId || '-',
                  imageUri,
                });
                continue;
              }

              const fData = (f as any).deficiency || f;
              allFindings.push({
                ...fData, ...f,
                imageUri,
                severity: f.severity || fData.severity || fData.aiSeverity || 'Moderate',
                area: computedArea,
                category: computedArea,
                location: f.location || img.room || img.roomCategory || (session as any).inspectionType || 'General',
                building: bName,
                unit: (session as any).unitId || '-',
                deficiencyName: f.title || fData.name || fData.title || 'Deficiency',
                nspireCode: f.nspireCode || fData.code || '-',
                deficiencyDetails: f.description || fData.detail || fData.description || 'Issue recorded',
                comments: (f as any).note || fData.aiAnalysis || (f as any).recommendedAction || '',
              });
            }
          }
        }
      }

      let outsideProgress = 0, insideProgress = 0, unitProgress = 0;
      let buildingProgressMap: Record<string, {out: number, in: number, un: number}> = {};

      Object.keys(globalResponses).forEach(k => {
        const parts = k.split("|");
        if (parts.length < 2) return;
        const bName = parts[0];
        const typeKey = parts[1];

        if (!buildingProgressMap[bName]) buildingProgressMap[bName] = {out: 0, in: 0, un: 0};
        
        if (typeKey.startsWith('Outside')) {
            outsideProgress += globalResponses[k];
            buildingProgressMap[bName].out += globalResponses[k];
        } else if (typeKey.startsWith('Inside')) {
            insideProgress += globalResponses[k];
            buildingProgressMap[bName].in += globalResponses[k];
        } else if (typeKey.startsWith('Unit')) {
            unitProgress += globalResponses[k];
            buildingProgressMap[bName].un += globalResponses[k];
        }
      });

      const unitTotalItems = UNIT_ITEMS.length * (selectedUnits && selectedUnits.length > 0 ? selectedUnits.length : 1);

      // Now add NO OD records PER BUILDING
      // Also include buildings that were in state
      const buildNamesSet = new Set<string>();
      if (buildings && buildings.length > 0) {
        buildings.forEach(b => buildNamesSet.add(b.name || b.buildingName || property?.name || 'Building'));
      }
      Object.keys(buildingProgressMap).forEach(bName => buildNamesSet.add(bName));
      Object.keys(buildingHasItems).forEach(bName => buildNamesSet.add(bName));

      buildNamesSet.forEach(bName => {
          const pData = buildingProgressMap[bName] || {out: 0, in: 0, un: 0};
          
          if (pData.out >= OUTSIDE_ITEMS.length && !buildingHasOutside[bName]) {
             allFindings.push({ id: `NO-OD-OUT-${bName}`, title: 'No OD', deficiencyName: 'No OD', deficiencyDetails: 'No observable deficiency was found during inspection.', category: 'Outside', area: 'Outside', location: 'Outside', severity: 'Low', imageUri: '', isGeneralComment: true, building: bName, unit: '-' });
          }
          if (pData.in >= INSIDE_ITEMS.length && !buildingHasInside[bName]) {
             allFindings.push({ id: `NO-OD-IN-${bName}`, title: 'No OD', deficiencyName: 'No OD', deficiencyDetails: 'No observable deficiency was found during inspection.', category: 'Inside', area: 'Inside', location: 'Inside', severity: 'Low', imageUri: '', isGeneralComment: true, building: bName, unit: '-' });
          }
          if (pData.un >= unitTotalItems && !buildingHasUnit[bName]) {
             allFindings.push({ id: `NO-OD-UN-${bName}`, title: 'No OD', deficiencyName: 'No OD', deficiencyDetails: 'No observable deficiency was found during inspection.', category: 'Units', area: 'Units', location: 'Units', severity: 'Low', imageUri: '', isGeneralComment: true, building: bName, unit: '-' });
          }
      });

      // Ensure absolutely ALL images in the final array are base64 before PDF generation
      for (let i = 0; i < allFindings.length; i++) {
        let uri = allFindings[i].imageUri || allFindings[i].imageUrl || allFindings[i].localUri || '';
        if (uri && Platform.OS !== 'web' && typeof uri === 'string' && !uri.startsWith('data:') && !uri.startsWith('http')) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists) {
              const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
              if (b64 && b64.length > 100) {
                const ext = uri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
                allFindings[i].imageUri = `data:image/${ext};base64,${b64}`;
              }
            }
          } catch (e) {
            console.log('Failed fallback native conversion', e);
          }
        } else if (uri && typeof uri === 'string' && uri.startsWith('http')) {
          allFindings[i].imageUri = uri;
        }
      }

      // We still pass global progress into progressData for top-level chart support if needed
      const reportData = {
        property: property,
        inspectorName: inspectorName,
        date: new Date().toISOString(),
        findings: allFindings,
        status: 'in-progress',
        buildingName: property?.name || 'Building',
        selectedUnits: selectedUnits || [],
        progressData: {
          outsideProgress,
          insideProgress,
          unitProgress,
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: unitTotalItems
        }
      };

      const nspireReport = generateNSPIREReport(reportData as any);

      nspireReport.metadata.inspectorName = inspectorName;
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
      }
    } catch (err: any) {
      console.error('Failed to export report', err);
      Alert.alert('Error', `Failed to export in-progress report: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  }"""

new_content = content[:start_idx] + new_method + content[end_idx:]

with open('src/screens/BuildingInspectionScreen.tsx', 'w') as f:
    f.write(new_content)

print("Applied fix_building.py")