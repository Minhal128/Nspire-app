import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';

type InspectionSummaryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InspectionSummary'
>;
type InspectionSummaryScreenRouteProp = RouteProp<RootStackParamList, 'InspectionSummary'>;

interface Props {
  navigation: InspectionSummaryScreenNavigationProp;
  route: InspectionSummaryScreenRouteProp;
}

const { width, height } = Dimensions.get('window');

const InspectionSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId, inspectionData } = route.params;
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies'>('summary');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Calculate actual deficiency counts from inspectionData
  const deficiencyCounts = {
    lifeThreadening: inspectionData?.deficiencies?.filter((d: any) =>
      (d.deficiency.aiSeverity || d.deficiency.severity) === 'Life-Threatening'
    ).length || 0,
    severe: inspectionData?.deficiencies?.filter((d: any) =>
      (d.deficiency.aiSeverity || d.deficiency.severity) === 'Severe'
    ).length || 0,
    moderate: inspectionData?.deficiencies?.filter((d: any) =>
      (d.deficiency.aiSeverity || d.deficiency.severity) === 'Moderate'
    ).length || 0,
    low: inspectionData?.deficiencies?.filter((d: any) =>
      (d.deficiency.aiSeverity || d.deficiency.severity) === 'Low'
    ).length || 0,
  };

  // Calculate scores based on actual deficiencies
  const totalDeficiencies = inspectionData?.deficiencies?.length || 0;
  const deductionPoints = (deficiencyCounts.lifeThreadening * 10) +
    (deficiencyCounts.severe * 6) +
    (deficiencyCounts.moderate * 3) +
    (deficiencyCounts.low * 1);

  const preliminaryScore = Math.max(0, 100 - deductionPoints);
  const calculatedScore = preliminaryScore;
  const finalScore = Math.max(0, preliminaryScore - 5); // Slight adjustment for final
  const isPassing = finalScore >= 60;

  const inspectionId = `697e0d82e115b966d90cc009`;
  const inspectionDate = new Date().toLocaleDateString();

  const handlePreviewReport = () => {
    // Generate preview HTML
    const html = generatePreviewHtml();
    setPreviewHtml(html);
    setPreviewModalVisible(true);
  };

  const generatePreviewHtml = (): string => {
    const propertyName = property.name || 'Property';
    const propertyAddress = property.address || '';
    
    // Generate deficiencies HTML
    let deficienciesHtml = '';
    if (inspectionData?.deficiencies && inspectionData.deficiencies.length > 0) {
      deficienciesHtml = inspectionData.deficiencies.map((def: any, index: number) => {
        const severity = def.deficiency?.aiSeverity || def.deficiency?.severity || 'Moderate';
        const severityColor = 
          severity === 'Life-Threatening' ? '#DC2626' :
          severity === 'Severe' ? '#F97316' :
          severity === 'Moderate' ? '#EAB308' : '#84CC16';
        
        return `
          <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin-bottom: 12px; border-left: 4px solid ${severityColor};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-weight: 600; color: #1a1a1a;">${def.deficiency?.name || 'Deficiency ' + (index + 1)}</span>
              <span style="background: ${severityColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${severity}</span>
            </div>
            <p style="color: #666; margin: 0; font-size: 14px;">${def.deficiency?.detail || 'No details available'}</p>
            ${def.location ? `<p style="color: #999; margin: 8px 0 0 0; font-size: 12px;">Location: ${def.location}</p>` : ''}
          </div>
        `;
      }).join('');
    } else {
      deficienciesHtml = '<p style="color: #666; text-align: center; padding: 20px;">No deficiencies recorded</p>';
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #fff; }
          .header { text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0E7490; }
          .title { color: #0E7490; font-size: 20px; font-weight: bold; margin-bottom: 8px; }
          .property-name { font-size: 18px; font-weight: 600; color: #1a1a1a; }
          .property-address { font-size: 14px; color: #666; margin-top: 4px; }
          .inspection-info { font-size: 13px; color: #999; margin-top: 8px; }
          .score-card { background: #0E7490; border-radius: 12px; padding: 20px; margin-bottom: 20px; color: white; }
          .score-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
          .score-row:last-child { border-bottom: none; }
          .score-label { font-size: 12px; letter-spacing: 0.5px; opacity: 0.9; }
          .score-value { font-size: 32px; font-weight: bold; }
          .final-score { font-size: 40px; }
          .passing-badge { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 14px; display: inline-block; margin-top: 8px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 16px; font-weight: 700; color: #0E7490; margin-bottom: 12px; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
          .summary-item { text-align: center; padding: 16px 8px; background: #f8f9fa; border-radius: 8px; }
          .summary-count { font-size: 24px; font-weight: bold; color: #1a1a1a; }
          .summary-label { font-size: 11px; color: #666; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">INSPIRE INSPECTION REPORT</div>
          <div class="property-name">${propertyName}</div>
          <div class="property-address">${propertyAddress}</div>
          <div class="inspection-info">Building: ${buildingId || 'B1'} | Units: ${selectedUnits.join(', ')}</div>
          <div class="inspection-info">Inspection #${inspectionId} | ${inspectionDate}</div>
        </div>
        
        <div class="score-card">
          <div class="score-row">
            <span class="score-label">PRELIMINARY SCORE</span>
            <span class="score-value">${preliminaryScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">CALCULATED SCORE</span>
            <span class="score-value">${calculatedScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">FINAL SCORE</span>
            <div>
              <span class="score-value final-score">${finalScore}</span>
              <div class="passing-badge">✓ ${isPassing ? 'Passing' : 'Failing'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">DEFICIENCY SUMMARY</div>
          <div class="summary-grid">
            <div class="summary-item" style="border-top: 4px solid #DC2626;">
              <div class="summary-count">${deficiencyCounts.lifeThreadening}</div>
              <div class="summary-label">Life-Threatening</div>
            </div>
            <div class="summary-item" style="border-top: 4px solid #F97316;">
              <div class="summary-count">${deficiencyCounts.severe}</div>
              <div class="summary-label">Severe</div>
            </div>
            <div class="summary-item" style="border-top: 4px solid #EAB308;">
              <div class="summary-count">${deficiencyCounts.moderate}</div>
              <div class="summary-label">Moderate</div>
            </div>
            <div class="summary-item" style="border-top: 4px solid #84CC16;">
              <div class="summary-count">${deficiencyCounts.low}</div>
              <div class="summary-label">Low</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">DEFICIENCIES</div>
          ${deficienciesHtml}
        </div>
      </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);

    try {
      // Prepare deficiencies array - handle multiple deficiencies
      const deficienciesArray = [];

      if (inspectionData?.deficiencies && Array.isArray(inspectionData.deficiencies)) {
        // Multiple deficiencies from AI analysis
        for (let i = 0; i < inspectionData.deficiencies.length; i++) {
          const defItem = inspectionData.deficiencies[i];

          // Convert local image to base64 for PDF
          let imageBase64: string | null = null;
          const cloudinaryUrl = defItem.imageUrl || null;
          
          if (defItem.imageUri && Platform.OS !== 'web') {
            try {
              // Check if file exists before trying to read
              const fileInfo = await FileSystem.getInfoAsync(defItem.imageUri);
              if (fileInfo.exists) {
                const base64 = await FileSystem.readAsStringAsync(defItem.imageUri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                if (base64 && base64.length > 100) {
                  imageBase64 = `data:image/jpeg;base64,${base64}`;
                  console.log(`Image ${i + 1} converted to base64 (${Math.round(base64.length / 1024)}KB)`);
                }
              } else {
                console.log(`Local image file not found: ${defItem.imageUri.substring(0, 60)}...`);
              }
            } catch (imgError) {
              console.error('Error converting image to base64:', imgError);
            }
          }
          
          // Use base64 if available, otherwise use Cloudinary URL for the enhanced PDF service to fetch
          const finalImageUri = imageBase64 || cloudinaryUrl || null;

          // Determine the inspectable area (Outside / Inside / Units)
          const inspectionArea: string = inspectionData.isOutsideInspection
            ? 'Outside'
            : (inspectionData.location === 'Inside' ? 'Inside' : 'Units');

          const isGC = !!(defItem as any).isGeneralComment;
          deficienciesArray.push({
            id: `${i + 1}`,
            deficiencyQRId: defItem.deficiencyQRId || `QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
            building: buildingId || 'B1',
            unit: selectedUnits.join(', ') || 'Unit Multiple',
            room: defItem.location || 'Multiple',
            area: inspectionArea,
            isGeneralComment: isGC,
            deficiencyName: isGC ? 'General Comment' : (defItem.deficiency.name || 'Deficiency'),
            nspireCode: isGC ? '-' : (defItem.deficiency.code || 'U-1'),
            codeReference: isGC ? '' : (defItem.deficiency.codeReference || ''),
            deficiencyDetails: isGC ? '-' : (defItem.deficiency.detail || 'Damaged or vandalized'),
            comments: defItem.note || (isGC ? '' : (defItem.deficiency.aiAnalysis || 'AI analyzed')),
            note: defItem.note || '',
            deductionPts: isGC ? 0 : 3,
            repeatIndicator: false,
            severity: isGC ? '-' : (defItem.deficiency.severity || defItem.deficiency.aiSeverity || 'Moderate'),
            inspectedDate: inspectionDate,
            inspectedTime: new Date().toLocaleTimeString(),
            inspectorId: 'INS-001',
            imageUri: finalImageUri, // base64 data URI or Cloudinary URL
            status: 'Open' as const,
          });
        }
      }

      const defCountsCalc = {
        lifeThreadening: deficienciesArray.filter(d => d.severity === 'Life-Threatening').length,
        severe: deficienciesArray.filter(d => d.severity === 'Severe').length,
        moderate: deficienciesArray.filter(d => d.severity === 'Moderate').length,
        low: deficienciesArray.filter(d => d.severity === 'Low').length,
      };

      const reportData: any = {
        reportId: inspectionId,
        version: '1.0',
        generatedAt: new Date().toISOString(),
        metadata: {
          inspectionNo: inspectionId,
          inspectionType: 'General NSPIRE' as const,
          escortName: 'Property Manager',
          propertyAddress: property.address || '',
          propertyName: property.name || 'Golden Town',
          propertyId: property._id || property.id || 'PROP-001',
          startDate: inspectionDate,
          startTime: '09:00 AM',
          endDate: inspectionDate,
          endTime: '05:00 PM',
          reportCreatedDate: inspectionDate,
          preliminaryScore: preliminaryScore,
          finalScore: finalScore,
          calculatedScore: calculatedScore,
          healthSafetyThreshold: 60,
          physicalConditionThreshold: 60,
          inspectorName: 'Current User',
          inspectorId: 'INS-001',
          buildingName: buildingId || undefined,
          inspectedUnits: selectedUnits.length > 0 ? selectedUnits : undefined,
        },
        inspectionData: [
          { type: 'Building' as const, propertyTotal: 2, sampleSize: 1, totalUnitsInspected: 1 },
          { type: 'Unit' as const, propertyTotal: property.totalUnits || 10, sampleSize: 1, totalUnitsInspected: 1 },
        ],
        occupancyInfo: {
          totalUnits: property.totalUnits || selectedUnits.length,
          occupiedUnits: property.totalUnits || selectedUnits.length,
          vacantUnits: 0,
          occupancyRate: 100,
        },
        summary: {
          lifeThreatening: defCountsCalc.lifeThreadening,
          severe: defCountsCalc.severe,
          moderate: defCountsCalc.moderate,
          low: defCountsCalc.low,
          total: deficienciesArray.length,
          byBuilding: { [buildingId || 'B1']: deficienciesArray.length },
          byCategory: { [inspectionData.isOutsideInspection ? 'Outside' : (inspectionData.location === 'Inside' ? 'Inside' : 'Units')]: deficienciesArray.length },
          repeatDeficiencies: 0,
          newDeficiencies: deficienciesArray.length,
        },
        categoryBreakdown: [{
          category: inspectionData.isOutsideInspection ? 'Outside' : (inspectionData.location === 'Inside' ? 'Inside' : 'Units'),
          nspireSection: 'U-1',
          deficiencyCount: deficienciesArray.length,
          totalDeductions: deficienciesArray.length * 3,
          lifeThreatening: defCountsCalc.lifeThreadening,
          severe: defCountsCalc.severe,
          moderate: defCountsCalc.moderate,
          low: defCountsCalc.low,
        }],
        deficiencies: deficienciesArray,
        generalComments: `${deficienciesArray.length} deficiencies analyzed with AI.`,
        certification: {
          certifiedBy: 'Current User',
          certificationDate: inspectionDate,
          certificationStatement: 'I certify this inspection was conducted per INSPIRE standards.',
        },
      };

      const result = await enhancedNspirePDFService.generateEnhancedPDF(reportData, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      });

      if (Platform.OS !== 'web' && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'NSPIRE Inspection Report',
          UTI: 'com.adobe.pdf',
        });
      }

      const successTitle = Platform.OS === 'web' ? 'Report Ready' : 'PDF Downloaded';
      const successMsg = Platform.OS === 'web'
        ? 'Report opened in a new tab. Use your browser\'s print dialog to save as PDF.'
        : 'Report downloaded successfully!';

      Alert.alert(successTitle, successMsg, [
        { text: 'Close', style: 'cancel' },
        { text: 'Continue Inspection', onPress: () => navigation.navigate('LocationInspection', { property, selectedUnits, buildingId, location: inspectionData?.location || 'Outside' }) },
        { text: 'Go to Dashboard', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' as never }] }) },
      ], { cancelable: true });
    } catch (error: any) {
      Alert.alert('Error', `Failed to generate PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' as never }],
          })}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Report</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Header Card */}
        <View style={styles.reportCard}>
          <Text style={styles.reportTitle}>INSPIRE INSPECTION REPORT</Text>
          <Text style={styles.propertyName}>{property.name || 'Golden Town'}</Text>
          <Text style={styles.propertyAddress}>{property.address}</Text>
          <Text style={styles.inspectionInfo}>
            Inspection #{inspectionId} | {inspectionDate}
          </Text>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportPDF}
            disabled={exportingPDF}
          >
            {exportingPDF ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>Export PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previewButton}
            onPress={handlePreviewReport}
          >
            <Ionicons name="eye-outline" size={20} color="#0E7490" />
            <Text style={styles.previewButtonText}>Preview Report</Text>
          </TouchableOpacity>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>PRELIMINARY SCORE</Text>
            <Text style={styles.scoreValue}>{preliminaryScore}</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>CALCULATED SCORE</Text>
            <Text style={styles.scoreValue}>{calculatedScore}</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>FINAL SCORE</Text>
            <Text style={styles.scoreFinal}>{finalScore}</Text>
            <View style={styles.passingBadge}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              <Text style={styles.passingText}>{isPassing ? 'Passing' : 'Failing'}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'summary' && styles.tabActive]}
            onPress={() => setActiveTab('summary')}
          >
            <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'deficiencies' && styles.tabActive]}
            onPress={() => setActiveTab('deficiencies')}
          >
            <Text style={[styles.tabText, activeTab === 'deficiencies' && styles.tabTextActive]}>
              Deficiencies
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'summary' ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>DEFICIENCY SUMMARY</Text>

            <View style={styles.deficiencyGrid}>
              <View style={styles.deficiencyItem}>
                <View style={[styles.deficiencyBar, styles.lifeThreateningBar]} />
                <Text style={styles.deficiencyCount}>{deficiencyCounts.lifeThreadening}</Text>
                <Text style={styles.deficiencyLabel}>Life-Threatening</Text>
              </View>

              <View style={styles.deficiencyItem}>
                <View style={[styles.deficiencyBar, styles.severeBar]} />
                <Text style={styles.deficiencyCount}>{deficiencyCounts.severe}</Text>
                <Text style={styles.deficiencyLabel}>Severe</Text>
              </View>

              <View style={styles.deficiencyItem}>
                <View style={[styles.deficiencyBar, styles.moderateBar]} />
                <Text style={styles.deficiencyCount}>{deficiencyCounts.moderate}</Text>
                <Text style={styles.deficiencyLabel}>Moderate</Text>
              </View>

              <View style={styles.deficiencyItem}>
                <View style={[styles.deficiencyBar, styles.lowBar]} />
                <Text style={styles.deficiencyCount}>{deficiencyCounts.low}</Text>
                <Text style={styles.deficiencyLabel}>Low</Text>
              </View>
            </View>

            {/* Inspection Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Inspection Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Building:</Text>
                <Text style={styles.detailValue}>{buildingId}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Units Inspected:</Text>
                <Text style={styles.detailValue}>{selectedUnits.length}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Inspector:</Text>
                <Text style={styles.detailValue}>Current User</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{inspectionDate}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.deficienciesCard}>
            <Text style={styles.deficienciesTitle}>Recorded Deficiencies</Text>

            {inspectionData?.deficiencies && inspectionData.deficiencies.length > 0 ? (
              inspectionData.deficiencies.map((defItem: any, index: number) => (
                <View key={index} style={[styles.deficiencyDetailCard, index > 0 && { marginTop: 16 }]}>
                  <View style={styles.deficiencyHeader}>
                    <Text style={styles.deficiencyItemName}>{defItem.itemName || inspectionData.itemName}</Text>
                    <View style={[
                      styles.severityBadge,
                      (defItem.deficiency.aiSeverity || defItem.deficiency.severity) === 'Life-Threatening' && styles.lifethreateningBadge,
                      (defItem.deficiency.aiSeverity || defItem.deficiency.severity) === 'Severe' && styles.severeBadge,
                      (defItem.deficiency.aiSeverity || defItem.deficiency.severity) === 'Moderate' && styles.moderateBadge,
                      (defItem.deficiency.aiSeverity || defItem.deficiency.severity) === 'Low' && styles.lowBadge,
                    ]}>
                      <Text style={styles.severityText}>{defItem.deficiency.aiSeverity || defItem.deficiency.severity}</Text>
                    </View>
                  </View>

                  <Text style={styles.deficiencyName}>{defItem.deficiency.name}</Text>
                  <Text style={styles.deficiencyDescription}>{defItem.deficiency.detail}</Text>

                  {defItem.deficiency.aiAnalysis && (
                    <View style={styles.aiAnalysisSection}>
                      <Text style={styles.aiAnalysisLabel}>AI Analysis:</Text>
                      <Text style={styles.aiAnalysisText}>{defItem.deficiency.aiAnalysis}</Text>
                    </View>
                  )}

                  <View style={styles.deficiencyMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color="#666666" />
                      <Text style={styles.metaText}>Repair by: {defItem.deficiency.repairBy}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={16} color="#666666" />
                      <Text style={styles.metaText}>{defItem.location}</Text>
                    </View>
                  </View>

                  {defItem.imageUrl && (
                    <View style={styles.imagesInfo}>
                      <Ionicons name="images-outline" size={16} color="#0E7490" />
                      <Text style={styles.imagesText}>Photo attached</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.noDeficienciesContainer}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
                <Text style={styles.noDeficienciesText}>No deficiencies recorded</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Preview Report Modal */}
      <Modal
        visible={previewModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <SafeAreaView style={styles.previewModalContainer}>
          {/* Modal Header */}
          <View style={styles.previewModalHeader}>
            <View style={styles.previewModalTitleContainer}>
              <Text style={styles.previewModalTitle}>Report Preview</Text>
              <Text style={styles.previewModalSubtitle}>{property.name || 'Property'}</Text>
            </View>
            <TouchableOpacity
              style={styles.previewModalCloseButton}
              onPress={() => setPreviewModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <View style={styles.previewModalContent}>
            <WebView
              source={{ html: previewHtml }}
              style={styles.previewWebView}
              scalesPageToFit={true}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.previewLoadingContainer}>
                  <ActivityIndicator size="large" color="#0E7490" />
                  <Text style={styles.previewLoadingText}>Loading preview...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
              }}
              javaScriptEnabled={false}
              domStorageEnabled={false}
              cacheEnabled={false}
              originWhitelist={['*']}
              scrollEnabled={true}
              bounces={true}
            />
          </View>

          {/* Modal Footer */}
          <View style={styles.previewModalFooter}>
            <TouchableOpacity
              style={styles.previewModalSecondaryButton}
              onPress={() => setPreviewModalVisible(false)}
            >
              <Ionicons name="close-outline" size={18} color="#374151" />
              <Text style={styles.previewModalSecondaryButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewModalPrimaryButton}
              onPress={() => {
                setPreviewModalVisible(false);
                handleExportPDF();
              }}
            >
              <Ionicons name="download-outline" size={18} color="#FFFFFF" />
              <Text style={styles.previewModalPrimaryButtonText}>Export PDF</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E7490',
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  inspectionInfo: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 16,
  },
  exportButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scoreCard: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreFinal: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  passingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  passingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#0E7490',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 20,
  },
  deficiencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  deficiencyItem: {
    alignItems: 'center',
    flex: 1,
  },
  deficiencyBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginBottom: 12,
  },
  lifeThreateningBar: {
    backgroundColor: '#DC2626',
  },
  severeBar: {
    backgroundColor: '#F97316',
  },
  moderateBar: {
    backgroundColor: '#EAB308',
  },
  lowBar: {
    backgroundColor: '#84CC16',
  },
  deficiencyCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  deficiencyLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  deficienciesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deficienciesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 16,
  },
  deficiencyDetailCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
  },
  deficiencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deficiencyItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lifethreateningBadge: {
    backgroundColor: '#DC2626',
  },
  severeBadge: {
    backgroundColor: '#F97316',
  },
  moderateBadge: {
    backgroundColor: '#EAB308',
  },
  lowBadge: {
    backgroundColor: '#84CC16',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deficiencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  deficiencyDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  deficiencyMeta: {
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666666',
  },
  imagesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  imagesText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E7490',
  },
  aiAnalysisSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0E7490',
  },
  aiAnalysisLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiAnalysisText: {
    fontSize: 13,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  noDeficienciesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noDeficienciesText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
  },
  previewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#0E7490',
  },
  previewButtonText: {
    color: '#0E7490',
    fontSize: 16,
    fontWeight: '700',
  },
  // Preview Modal Styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  previewModalTitleContainer: {
    flex: 1,
  },
  previewModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  previewModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  previewModalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  previewModalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewWebView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  previewLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  previewModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  previewModalSecondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 8,
  },
  previewModalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  previewModalPrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0E7490',
    borderRadius: 8,
    gap: 8,
  },
  previewModalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default InspectionSummaryScreen;
