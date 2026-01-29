/**
 * NSPIRE Report Preview Screen
 * Displays and exports HUD-compliant NSPIRE inspection reports
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Colors } from '../constants/Colors';
import {
  nspirePDFService,
  generateNSPIREReportHTML,
} from '../services/nspirePDFService';
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  PDFGenerationOptions,
  SEVERITY_COLORS,
  DEFAULT_PDF_OPTIONS,
  DeficiencySeverity,
} from '../types/nspireReport';
import { inspectionService } from '../services/inspectionService';

const { width, height } = Dimensions.get('window');

interface NSPIREReportScreenProps {
  navigation: any;
  route: any;
}

export default function NSPIREReportScreen({ navigation, route }: NSPIREReportScreenProps) {
  const { report: initialReport, inspectionData, property, preGeneratedHtml } = route.params || {};

  const [report, setReport] = useState<NSPIREInspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pdfOptions, setPdfOptions] = useState<PDFGenerationOptions>(DEFAULT_PDF_OPTIONS);
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies' | 'preview'>(preGeneratedHtml ? 'preview' : 'summary');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>(preGeneratedHtml || '');
  const [preparingPreview, setPreparingPreview] = useState(false);

  const webViewRef = useRef<WebView>(null);


  useEffect(() => {
    initializeReport();
  }, []);

  const initializeReport = async () => {
    try {
      if (initialReport) {
        setReport(initialReport);
      } else if (inspectionData) {
        // Convert inspection data to NSPIRE report format
        const convertedReport = convertToNSPIREReport(inspectionData, property);
        setReport(convertedReport);
      } else {
        // Load sample report for demonstration
        const sampleReport = nspirePDFService.createSampleReport();
        setReport(sampleReport);
      }
    } catch (error) {
      console.error('Failed to initialize report:', error);
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const convertToNSPIREReport = (data: any, property: any): NSPIREInspectionReport => {
    const now = new Date();

    // Convert findings to deficiency entries
    const deficiencies: DeficiencyEntry[] = (data.findings || []).map((finding: any, index: number) => ({
      id: finding.id || `DEF-${index + 1}`,
      imageUri: finding.imageUri || '',
      building: finding.building || property?.building || 'A',
      unit: finding.unit || property?.unit || '-',
      room: finding.location || finding.room || '-',
      area: finding.area || '-',
      deficiencyName: finding.title || 'Unnamed Deficiency',
      nspireCode: finding.nspireCode || mapCategoryToNSPIRECode(finding.category),
      deficiencyDetails: finding.description || '',
      comments: finding.comments || finding.recommendedAction || '',
      deductionPts: calculateDeductionPoints(finding.severity),
      repeatIndicator: finding.repeat || false,
      severity: mapSeverity(finding.severity),
      inspectedDate: now.toLocaleDateString(),
      inspectedTime: finding.timestamp ? new Date(finding.timestamp).toLocaleTimeString() : now.toLocaleTimeString(),
      inspectorId: data.inspectorId || 'INS-001',
      status: 'Open',
    }));

    // Calculate summary
    const summary: DeficiencySummary = {
      lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening').length,
      severe: deficiencies.filter(d => d.severity === 'Severe').length,
      moderate: deficiencies.filter(d => d.severity === 'Moderate').length,
      low: deficiencies.filter(d => d.severity === 'Low').length,
      total: deficiencies.length,
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length,
    };

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),
      metadata: {
        inspectionNo: data.inspectionNo || `INSP-${Date.now().toString(36).toUpperCase()}`,
        inspectionType: 'General NSPIRE',
        escortName: data.escortName || property?.contactName || '-',
        propertyAddress: property?.address || data.address || '-',
        propertyName: property?.name || data.propertyName || '-',
        propertyId: property?._id || data.propertyId || '-',
        startDate: data.startDate || now.toLocaleDateString(),
        startTime: data.startTime || '09:00 AM',
        endDate: data.endDate || now.toLocaleDateString(),
        endTime: data.endTime || now.toLocaleTimeString(),
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: data.complianceScore || 100 - (deficiencies.length * 2),
        finalScore: data.finalScore || data.complianceScore || 100 - (deficiencies.length * 2),
        calculatedScore: data.calculatedScore || data.complianceScore || 100 - (deficiencies.length * 2),
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: data.inspectorName || 'Inspector',
        inspectorId: data.inspectorId || 'INS-001',
      },
      inspectionData: [
        { type: 'Building', propertyTotal: property?.buildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit', propertyTotal: property?.units || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      ],
      occupancyInfo: {
        totalUnits: property?.units || 1,
        occupiedUnits: property?.occupiedUnits || property?.units || 1,
        vacantUnits: property?.vacantUnits || 0,
        occupancyRate: property?.occupancyRate || 100,
      },
      summary,
      categoryBreakdown: [],
      deficiencies,
      generalComments: data.notes || '',
      recommendations: [],
      certification: {
        certifiedBy: data.inspectorName || 'Inspector',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols.',
      },
    };
  };

  const mapCategoryToNSPIRECode = (category: string): string => {
    const mapping: Record<string, string> = {
      'structural': 'BE-3',
      'electrical': 'BS-2',
      'plumbing': 'BS-1',
      'safety': 'HS-12',
      'hvac': 'BS-5',
      'exterior': 'BE-6',
      'interior': 'U-16',
      'appliances': 'U-10',
    };
    return mapping[category?.toLowerCase()] || 'HS-12';
  };

  const mapSeverity = (severity: string): DeficiencySeverity => {
    const mapping: Record<string, DeficiencySeverity> = {
      'critical': 'Life-Threatening',
      'major': 'Severe',
      'minor': 'Moderate',
      'observation': 'Low',
    };
    return mapping[severity?.toLowerCase()] || 'Moderate';
  };

  const calculateDeductionPoints = (severity: string): number => {
    const points: Record<string, number> = {
      'critical': 10,
      'major': 6,
      'minor': 3,
      'observation': 1,
    };
    return points[severity?.toLowerCase()] || 3;
  };

  const handleExportPDF = async () => {
    if (!report) return;

    setExporting(true);
    try {
      console.log('Starting PDF export...');

      // Show progress to user
      Alert.alert('Generating PDF', 'Please wait while we generate your inspection report...', [], { cancelable: false });

      console.log('Generating PDF with images...');
      const result = await nspirePDFService.generateAndSharePDF(report, pdfOptions);

      // Dismiss the progress alert
      Alert.alert('', '', [], { cancelable: true });

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('PDF export successful');
      Alert.alert('Success', 'PDF report generated and ready to share!');
    } catch (error: any) {
      console.error('PDF Export Error:', error);
      Alert.alert('', '', [], { cancelable: true }); // Dismiss progress alert

      // Provide specific error messages
      let errorMessage = 'Failed to export PDF';
      if (error.message.includes('timeout')) {
        errorMessage = 'PDF generation timed out. This may be due to large images. Please try again.';
      } else if (error.message.includes('Image')) {
        errorMessage = 'There was an issue processing images. The PDF may have been generated without some images.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Export Failed', errorMessage);
    } finally {
      setExporting(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!report) return;

    setExporting(true);
    try {
      const result = await nspirePDFService.printPDF(report, pdfOptions);

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      Alert.alert('Print Failed', error.message || 'Failed to print PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleSavePDF = async () => {
    if (!report) return;

    setExporting(true);
    try {
      // First, ensure inspection is saved to backend
      if (inspectionData && property && !inspectionData.savedInspectionId) {
        console.log('Saving inspection to backend from NSPIREReport...');
        try {
          const createData = {
            property: property._id,
            unit: inspectionData.unit || 'All Units',
            inspectionType: 'ai',
            inspectionLevel: '100',
            scheduledDate: new Date().toISOString(),
            notes: inspectionData.notes || '',
          };

          const createResult = await inspectionService.createInspection(createData);
          console.log('Create result:', createResult);

          if (createResult.success && createResult.inspection?._id) {
            const completeData = {
              complianceScore: report.metadata.finalScore || inspectionData.complianceScore || 0,
              findings: (inspectionData.findings || []).map((f: any) => ({
                area: f.inspectionType || f.category || 'General',
                location: f.location || 'Property',
                severity: f.severity || 'minor',
                description: f.description || '',
                recommendation: f.recommendations?.join(', ') || f.recommendedAction || '',
                imageUrl: f.imageUri || '',
                nspireCode: f.nspireCode || '',
              })),
              notes: `INSPIRE Inspection - Score: ${report.metadata.finalScore}`,
            };

            const completeResult = await inspectionService.completeInspection(createResult.inspection._id, completeData);
            console.log('Complete result:', completeResult);

            if (completeResult.success) {
              console.log('Inspection saved to backend successfully');
            }
          }
        } catch (backendError) {
          console.error('Failed to save to backend:', backendError);
          // Continue with PDF save even if backend fails
        }
      }

      // Save PDF locally
      const filename = `NSPIRE_Report_${report.metadata.inspectionNo}_${Date.now()}`;
      const result = await nspirePDFService.savePDFToDevice(report, filename, pdfOptions);

      if (result.success) {
        Alert.alert('Success', `Report saved to:\n${result.uri}\n\nInspection also synced to Reports.`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      Alert.alert('Save Failed', error.message || 'Failed to save PDF');
    } finally {
      setExporting(false);
    }
  };


  const getSeverityColor = (severity: DeficiencySeverity): string => {
    return SEVERITY_COLORS[severity] || Colors.neutral.gray500;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.neutral.white} />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>INSPIRE Report</Text>
        {report && (
          <Text style={styles.headerSubtitle}>{report.metadata.inspectionNo}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => setShowOptionsModal(true)}
      >
        <Ionicons name="options" size={24} color={Colors.neutral.white} />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      {(['summary', 'deficiencies', 'preview'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSummaryTab = () => {
    if (!report) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {/* Score Cards - Compact Professional Style */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Preliminary Score</Text>
            <Text style={styles.scoreValue}>{report.metadata.preliminaryScore}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Calculated Score</Text>
            <Text style={styles.scoreValue}>{report.metadata.calculatedScore}</Text>
          </View>
          <View style={[styles.scoreCard, styles.mainScoreCard]}>
            <Text style={[styles.scoreLabel, { color: 'rgba(255,255,255,0.9)' }]}>Final Score</Text>
            <Text style={[styles.scoreValue, styles.mainScoreValue]}>{report.metadata.finalScore}</Text>
            <Text style={styles.scoreStatus}>
              {report.metadata.finalScore >= 60 ? '✓ Passing' : '✗ Below Threshold'}
            </Text>
          </View>
        </View>

        {/* Summary Cards - Professional Compact Grid */}
        <Text style={styles.sectionTitle}>Deficiency Summary</Text>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCardCompact, { borderLeftColor: SEVERITY_COLORS['Life-Threatening'], backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.summaryCountCompact, { color: SEVERITY_COLORS['Life-Threatening'] }]}>
              {report.summary.lifeThreatening}
            </Text>
            <Text style={[styles.summaryLabelCompact, { color: SEVERITY_COLORS['Life-Threatening'] }]}>
              LIFE-THREAT
            </Text>
          </View>
          <View style={[styles.summaryCardCompact, { borderLeftColor: SEVERITY_COLORS['Severe'], backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.summaryCountCompact, { color: SEVERITY_COLORS['Severe'] }]}>
              {report.summary.severe}
            </Text>
            <Text style={[styles.summaryLabelCompact, { color: SEVERITY_COLORS['Severe'] }]}>SEVERE</Text>
          </View>
          <View style={[styles.summaryCardCompact, { borderLeftColor: SEVERITY_COLORS['Moderate'], backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.summaryCountCompact, { color: SEVERITY_COLORS['Moderate'] }]}>
              {report.summary.moderate}
            </Text>
            <Text style={[styles.summaryLabelCompact, { color: SEVERITY_COLORS['Moderate'] }]}>MODERATE</Text>
          </View>
          <View style={[styles.summaryCardCompact, { borderLeftColor: SEVERITY_COLORS['Low'], backgroundColor: '#F9FAFB' }]}>
            <Text style={[styles.summaryCountCompact, { color: SEVERITY_COLORS['Low'] }]}>
              {report.summary.low}
            </Text>
            <Text style={[styles.summaryLabelCompact, { color: SEVERITY_COLORS['Low'] }]}>LOW</Text>
          </View>
          <View style={[styles.summaryCardCompact, { borderLeftColor: '#10B981', backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.summaryCountCompact, { color: '#10B981' }]}>
              {report.summary.total}
            </Text>
            <Text style={[styles.summaryLabelCompact, { color: '#10B981' }]}>TOTAL</Text>
          </View>
        </View>

        {/* Repeat/New Deficiencies Row */}
        <View style={styles.deficiencyCountsRow}>
          <View style={styles.deficiencyCountCard}>
            <Text style={[styles.deficiencyCountValue, { color: '#92400E' }]}>{report.summary.repeatDeficiencies}</Text>
            <Text style={styles.deficiencyCountLabel}>Repeat Deficiencies</Text>
          </View>
          <View style={styles.deficiencyCountCard}>
            <Text style={[styles.deficiencyCountValue, { color: '#1E40AF' }]}>{report.summary.newDeficiencies}</Text>
            <Text style={styles.deficiencyCountLabel}>New Deficiencies</Text>
          </View>
        </View>

        {/* Property Info */}
        <Text style={styles.sectionTitle}>Property Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property Name</Text>
            <Text style={styles.infoValue}>{report.metadata.propertyName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{report.metadata.propertyAddress}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Inspector</Text>
            <Text style={styles.infoValue}>{report.metadata.inspectorName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Inspection Date</Text>
            <Text style={styles.infoValue}>{report.metadata.startDate}</Text>
          </View>
        </View>

        {/* Inspection Data */}
        <Text style={styles.sectionTitle}>Inspection Data</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Type</Text>
            <Text style={styles.tableHeaderCell}>Total</Text>
            <Text style={styles.tableHeaderCell}>Sample</Text>
            <Text style={styles.tableHeaderCell}>Inspected</Text>
          </View>
          {report.inspectionData.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: '600' }]}>{row.type}</Text>
              <Text style={styles.tableCell}>{row.propertyTotal}</Text>
              <Text style={styles.tableCell}>{row.sampleSize}</Text>
              <Text style={styles.tableCell}>{row.totalUnitsInspected}</Text>
            </View>
          ))}
        </View>

        {/* Occupancy */}
        <Text style={styles.sectionTitle}>Occupancy Information</Text>
        <View style={styles.occupancyGrid}>
          <View style={styles.occupancyCard}>
            <Text style={styles.occupancyValue}>{report.occupancyInfo.totalUnits}</Text>
            <Text style={styles.occupancyLabel}>Total Units</Text>
          </View>
          <View style={styles.occupancyCard}>
            <Text style={styles.occupancyValue}>{report.occupancyInfo.occupiedUnits}</Text>
            <Text style={styles.occupancyLabel}>Occupied</Text>
          </View>
          <View style={styles.occupancyCard}>
            <Text style={styles.occupancyValue}>{report.occupancyInfo.occupancyRate.toFixed(0)}%</Text>
            <Text style={styles.occupancyLabel}>Rate</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderDeficienciesTab = () => {
    if (!report) return null;

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {report.deficiencies.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.status.success} />
            <Text style={styles.emptyStateTitle}>No Deficiencies Found</Text>
            <Text style={styles.emptyStateText}>
              This property passed inspection with no issues identified.
            </Text>
          </View>
        ) : (
          report.deficiencies.map((deficiency, index) => (
            <View key={deficiency.id} style={styles.deficiencyCard}>
              <View style={styles.deficiencyHeader}>
                <View style={styles.deficiencyTitleRow}>
                  <Text style={styles.deficiencyNumber}>#{index + 1}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(deficiency.severity) }
                  ]}>
                    <Text style={styles.severityText}>{deficiency.severity}</Text>
                  </View>
                  {deficiency.repeatIndicator && (
                    <View style={styles.repeatBadge}>
                      <Ionicons name="repeat" size={12} color="#92400E" />
                      <Text style={styles.repeatText}>REPEAT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.deductionText}>-{deficiency.deductionPts} pts</Text>
              </View>

              <View style={styles.deficiencyContent}>
                {deficiency.imageUri ? (
                  <Image
                    source={{ uri: deficiency.imageUri }}
                    style={styles.deficiencyImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color={Colors.neutral.gray400} />
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}

                <View style={styles.deficiencyDetails}>
                  <Text style={styles.deficiencyName}>{deficiency.deficiencyName}</Text>
                  <View style={styles.nspireCodeBadge}>
                    <Text style={styles.nspireCodeText}>{deficiency.nspireCode}</Text>
                  </View>

                  <View style={styles.locationInfo}>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationLabel}>Building:</Text>
                      <Text style={styles.locationValue}>{deficiency.building}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationLabel}>Unit:</Text>
                      <Text style={styles.locationValue}>{deficiency.unit}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationLabel}>Room:</Text>
                      <Text style={styles.locationValue}>{deficiency.room}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.deficiencyDescription}>
                <Text style={styles.descriptionLabel}>Details:</Text>
                <Text style={styles.descriptionText}>{deficiency.deficiencyDetails}</Text>
              </View>

              {deficiency.comments && (
                <View style={styles.commentsSection}>
                  <Text style={styles.commentsLabel}>Inspector Comments:</Text>
                  <Text style={styles.commentsText}>{deficiency.comments}</Text>
                </View>
              )}
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  // Prepare preview when tab changes to preview
  useEffect(() => {
    if (activeTab === 'preview' && report && !previewHtml && !preparingPreview) {
      preparePreview();
    }
  }, [activeTab, report, previewHtml, preparingPreview]);

  // Reset preview when options change
  useEffect(() => {
    if (previewHtml) {
      setPreviewHtml('');
    }
  }, [pdfOptions]);

  const preparePreview = async () => {
    if (!report || preparingPreview) return;

    setPreparingPreview(true);
    try {
      // Check if we have pre-generated HTML from backend
      if (preGeneratedHtml && preGeneratedHtml.length > 1000) {
        console.log('Using pre-generated HTML from backend');
        setPreviewHtml(preGeneratedHtml);
        return;
      }

      console.log('Generating HTML preview locally...');
      
      // Generate HTML with memory optimization
      const html = await nspirePDFService.generateHTMLPreviewAsync(report, {
        ...pdfOptions,
        includeImages: false, // Disable images for preview to prevent crashes
        imageQuality: 'low'
      });
      
      // Limit HTML size to prevent crashes
      const maxSize = 50000; // 50KB limit
      const finalHtml = html.length > maxSize ? 
        html.substring(0, maxSize) + '\n<!-- Content truncated for performance -->\n</body></html>' : 
        html;
        
      setPreviewHtml(finalHtml);
      console.log(`Preview HTML prepared: ${finalHtml.length} bytes`);
    } catch (error) {
      console.error('Error preparing preview:', error);
      // Fallback to simple HTML
      const fallbackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>INSPIRE Report Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .error { color: #dc3545; background: #f8d7da; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>INSPIRE Inspection Report</h1>
          <div class="error">
            <h3>Preview Error</h3>
            <p>Unable to generate full preview. The report contains ${report.deficiencies?.length || 0} deficiencies.</p>
            <p>Use the Export PDF function to generate the complete report.</p>
          </div>
        </body>
        </html>
      `;
      setPreviewHtml(fallbackHtml);
    } finally {
      setPreparingPreview(false);
    }
  };

  const renderPreviewTab = () => {
    if (!report) return null;

    if (preparingPreview || !previewHtml) {
      return (
        <View style={[styles.previewContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary.teal} />
          <Text style={{ marginTop: 12, color: Colors.neutral.gray600 }}>Preparing preview...</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: previewHtml }}
          style={styles.webView}
          scalesPageToFit={true}
          javaScriptEnabled={false} // Disable JS to prevent crashes
          domStorageEnabled={false}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={[styles.previewContainer, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={Colors.primary.teal} />
              <Text style={{ marginTop: 12, color: Colors.neutral.gray600 }}>Loading preview...</Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
          }}
          onLoadEnd={() => {
            console.log('WebView loaded successfully');
          }}
          // Memory optimization settings
          cacheEnabled={false}
          incognito={true}
          originWhitelist={['*']}
          allowFileAccess={false}
          allowFileAccessFromFileURLs={false}
          allowUniversalAccessFromFileURLs={false}
          mixedContentMode="never"
        />
      </View>
    );
  };

  const renderOptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Export Options</Text>
            <TouchableOpacity onPress={() => setShowOptionsModal(false)}>
              <Ionicons name="close" size={24} color={Colors.neutral.gray600} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Include Images</Text>
              <TouchableOpacity
                style={[styles.toggle, pdfOptions.includeImages && styles.toggleActive]}
                onPress={() => setPdfOptions(prev => ({ ...prev, includeImages: !prev.includeImages }))}
              >
                <View style={[styles.toggleCircle, pdfOptions.includeImages && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Color-Code Severity</Text>
              <TouchableOpacity
                style={[styles.toggle, pdfOptions.colorCodingSeverity && styles.toggleActive]}
                onPress={() => setPdfOptions(prev => ({ ...prev, colorCodingSeverity: !prev.colorCodingSeverity }))}
              >
                <View style={[styles.toggleCircle, pdfOptions.colorCodingSeverity && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Include Summary Page</Text>
              <TouchableOpacity
                style={[styles.toggle, pdfOptions.includeSummaryPage && styles.toggleActive]}
                onPress={() => setPdfOptions(prev => ({ ...prev, includeSummaryPage: !prev.includeSummaryPage }))}
              >
                <View style={[styles.toggleCircle, pdfOptions.includeSummaryPage && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Include Certification</Text>
              <TouchableOpacity
                style={[styles.toggle, pdfOptions.includeCertification && styles.toggleActive]}
                onPress={() => setPdfOptions(prev => ({ ...prev, includeCertification: !prev.includeCertification }))}
              >
                <View style={[styles.toggleCircle, pdfOptions.includeCertification && styles.toggleCircleActive]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.optionSectionTitle}>Image Quality</Text>
            <View style={styles.qualityOptions}>
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <TouchableOpacity
                  key={quality}
                  style={[
                    styles.qualityOption,
                    pdfOptions.imageQuality === quality && styles.qualityOptionActive
                  ]}
                  onPress={() => setPdfOptions(prev => ({ ...prev, imageQuality: quality }))}
                >
                  <Text style={[
                    styles.qualityOptionText,
                    pdfOptions.imageQuality === quality && styles.qualityOptionTextActive
                  ]}>
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.optionSectionTitle}>Page Size</Text>
            <View style={styles.qualityOptions}>
              {(['letter', 'a4', 'legal'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.qualityOption,
                    pdfOptions.pageSize === size && styles.qualityOptionActive
                  ]}
                  onPress={() => setPdfOptions(prev => ({ ...prev, pageSize: size }))}
                >
                  <Text style={[
                    styles.qualityOptionText,
                    pdfOptions.pageSize === size && styles.qualityOptionTextActive
                  ]}>
                    {size.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowOptionsModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={handlePrintPDF}
        disabled={exporting}
      >
        <Ionicons name="print-outline" size={20} color={Colors.primary.teal} />
        <Text style={styles.secondaryButtonText}>Print</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={handleSavePDF}
        disabled={exporting}
      >
        <Ionicons name="download-outline" size={20} color={Colors.primary.teal} />
        <Text style={styles.secondaryButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleExportPDF}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator size="small" color={Colors.neutral.white} />
        ) : (
          <>
            <Ionicons name="share-outline" size={20} color={Colors.neutral.white} />
            <Text style={styles.primaryButtonText}>Export PDF</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.teal} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}

      {activeTab === 'summary' && renderSummaryTab()}
      {activeTab === 'deficiencies' && renderDeficienciesTab()}
      {activeTab === 'preview' && renderPreviewTab()}

      {renderActionButtons()}
      {renderOptionsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.neutral.gray600,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.neutral.white,
    opacity: 0.8,
  },
  optionsButton: {
    padding: 8,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.teal,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.gray500,
  },
  activeTabText: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },

  // Tab Content
  tabContent: {
    flex: 1,
    padding: 16,
  },

  // Scores
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mainScoreCard: {
    backgroundColor: Colors.primary.teal,
    flex: 1.2,
  },
  scoreLabel: {
    fontSize: 11,
    color: Colors.neutral.gray500,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral.gray800,
  },
  mainScoreValue: {
    color: Colors.neutral.white,
  },
  scoreStatus: {
    fontSize: 10,
    color: Colors.neutral.white,
    opacity: 0.9,
    marginTop: 4,
  },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.gray800,
    marginBottom: 12,
    marginTop: 8,
  },

  // Summary Grid (legacy)
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: Colors.neutral.white,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: '1%',
    borderWidth: 2,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },

  // New Compact Summary Row
  summaryRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  summaryCardCompact: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: 'center',
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryCountCompact: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  summaryLabelCompact: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // Deficiency Counts Row
  deficiencyCountsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  deficiencyCountCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.neutral.gray50,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  deficiencyCountValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deficiencyCountLabel: {
    fontSize: 11,
    color: Colors.neutral.gray600,
  },

  // Total Card (legacy - keeping for backwards compatibility)
  totalCard: {
    backgroundColor: Colors.neutral.white,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.gray800,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  totalDivider: {
    height: 1,
    backgroundColor: Colors.neutral.gray200,
    marginVertical: 8,
  },
  totalSubLabel: {
    fontSize: 14,
    color: Colors.neutral.gray600,
  },
  totalSubValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.gray700,
  },

  // Info Card
  infoCard: {
    backgroundColor: Colors.neutral.white,
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.neutral.gray500,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.neutral.gray800,
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },

  // Table
  tableContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.teal,
    padding: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  tableRowEven: {
    backgroundColor: Colors.neutral.gray50,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: Colors.neutral.gray700,
    textAlign: 'center',
  },

  // Occupancy
  occupancyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  occupancyCard: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  occupancyValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary.teal,
  },
  occupancyLabel: {
    fontSize: 11,
    color: Colors.neutral.gray500,
    marginTop: 4,
  },

  // Deficiency Card
  deficiencyCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deficiencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.neutral.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  deficiencyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  deficiencyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.gray600,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral.white,
    textTransform: 'uppercase',
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  repeatText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#92400E',
  },
  deductionText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.status.error,
  },
  deficiencyContent: {
    flexDirection: 'row',
    padding: 12,
  },
  deficiencyImage: {
    width: 100,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.neutral.gray200,
  },
  imagePlaceholder: {
    width: 100,
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: Colors.neutral.gray400,
    marginTop: 4,
  },
  deficiencyDetails: {
    flex: 1,
    marginLeft: 12,
  },
  deficiencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral.gray800,
    marginBottom: 6,
  },
  nspireCodeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  nspireCodeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
  locationInfo: {
    gap: 2,
  },
  locationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationLabel: {
    fontSize: 11,
    color: Colors.neutral.gray500,
    width: 55,
  },
  locationValue: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.neutral.gray700,
    flex: 1,
    flexWrap: 'wrap',
  },
  deficiencyDescription: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral.gray500,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.neutral.gray700,
    lineHeight: 18,
  },
  commentsSection: {
    backgroundColor: Colors.neutral.gray50,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
  },
  commentsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.neutral.gray500,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.neutral.gray600,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.status.success,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral.gray500,
    textAlign: 'center',
    marginTop: 8,
  },

  // Preview
  previewContainer: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  webView: {
    flex: 1,
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: Colors.primary.teal,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.gray800,
  },
  modalBody: {
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray100,
  },
  optionLabel: {
    fontSize: 15,
    color: Colors.neutral.gray700,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.neutral.gray300,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary.teal,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral.white,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  optionSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.gray500,
    marginTop: 16,
    marginBottom: 8,
  },
  qualityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    alignItems: 'center',
  },
  qualityOptionActive: {
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.sky,
  },
  qualityOptionText: {
    fontSize: 13,
    color: Colors.neutral.gray600,
  },
  qualityOptionTextActive: {
    color: Colors.primary.teal,
    fontWeight: '600',
  },
  modalCloseButton: {
    margin: 16,
    padding: 14,
    backgroundColor: Colors.primary.teal,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
});
