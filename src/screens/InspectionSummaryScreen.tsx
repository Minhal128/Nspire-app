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
} from 'react-native';
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

const InspectionSummaryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId, inspectionData } = route.params;
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies'>('summary');
  const [exportingPDF, setExportingPDF] = useState(false);

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
          let imageBase64 = null;
          if (defItem.imageUri) {
            try {
              const base64 = await FileSystem.readAsStringAsync(defItem.imageUri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              imageBase64 = `data:image/jpeg;base64,${base64}`;
            } catch (imgError) {
              console.error('Error converting image to base64:', imgError);
              // Try using Cloudinary URL as fallback
              if (defItem.imageUrl) {
                imageBase64 = defItem.imageUrl;
              }
            }
          }
          
          deficienciesArray.push({
            id: `${i + 1}`,
            building: buildingId,
            unit: selectedUnits[0] || 'Unit Multiple',
            room: defItem.location || 'Multiple',
            area: defItem.location || 'Multiple',
            deficiencyName: defItem.deficiency.name || 'Deficiency',
            nspireCode: defItem.deficiency.code || 'U-1',
            deficiencyDetails: defItem.deficiency.detail || 'Damaged or vandalized',
            comments: defItem.note || defItem.deficiency.aiAnalysis || 'AI analyzed',
            deductionPts: 3,
            repeatIndicator: false,
            severity: defItem.deficiency.aiSeverity || defItem.deficiency.severity || 'Moderate',
            inspectedDate: inspectionDate,
            inspectedTime: new Date().toLocaleTimeString(),
            inspectorId: 'INS-001',
            imageUri: imageBase64, // Use base64 data URI
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
          byBuilding: { [buildingId]: deficienciesArray.length },
          byCategory: { 'Inside': deficienciesArray.length },
          repeatDeficiencies: 0,
          newDeficiencies: deficienciesArray.length,
        },
        categoryBreakdown: [{
          category: 'Inside',
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
          certificationStatement: 'I certify this inspection was conducted per HUD NSPIRE standards.',
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
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'NSPIRE Inspection Report',
          UTI: 'com.adobe.pdf',
        });
      }
      
      Alert.alert('PDF Downloaded', 'Report downloaded successfully!', [
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
          <Text style={styles.reportTitle}>HUD INSPIRE INSPECTION REPORT</Text>
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
});

export default InspectionSummaryScreen;
