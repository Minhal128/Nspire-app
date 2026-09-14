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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Colors } from '../constants/Colors';
import { usePaymentLink } from '../hooks/usePaymentLink';
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
import { sanitizeAIDescription } from '../utils/nspireReportUtils';

const { width, height } = Dimensions.get('window');

interface NSPIREReportScreenProps {
  navigation: any;
  route: any;
}

export default function NSPIREReportScreen({ navigation, route }: NSPIREReportScreenProps) {
  const { report: initialReport, inspectionData: passedInspectionData, property, preGeneratedHtml, buildingName: passedBuildingName, selectedUnits: passedSelectedUnits } = route.params || {};

  // Extract or initialize inspection data with building and units info
  const inspectionData = passedInspectionData ? {
    ...passedInspectionData,
    buildingName: passedBuildingName || passedInspectionData.buildingName || 'B1',
    selectedUnits: passedSelectedUnits || passedInspectionData.selectedUnits || [],
  } : undefined;

  const [report, setReport] = useState<NSPIREInspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pdfOptions, setPdfOptions] = useState<PDFGenerationOptions>(DEFAULT_PDF_OPTIONS);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>(preGeneratedHtml || '');
  const [preparingPreview, setPreparingPreview] = useState(false);
  // Web landing page: report stays locked until paid; "View Deficiency" opens
  // the PDF preview, and the email box mails the full report link.
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEmailBox, setShowEmailBox] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  // Same email-link Stripe unlock the Inspection Status screen uses: the
  // backend mails a checkout link, so there is no card entry here either.
  const payment = usePaymentLink(
    (inspectionData as any)?._id || '',
    () => setUnlocked(true),
    showEmailBox,
  );

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
      deficiencyQRId: finding.deficiencyQRId || `QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
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

    // Add OD responses from globalInspectionProgress that don't have detailed findings
    // NOTE: Disabled per client request to exclude ALL/OD-only items from report output.
    /*
    const propertyId = property?._id || property?.id || property?.propertyId || inspectionData?.property?._id || inspectionData?.property?.id || 'unknown';
    
    // Determine buildingName - try multiple sources
    let buildingName = inspectionData?.buildingName || inspectionData?.building || 'B1';
    
    // If buildingName is still the default, try to discover it from globalInspectionProgress keys
    if (buildingName === 'B1' && typeof globalInspectionProgress === 'object') {
      const progressKeys = Object.keys(globalInspectionProgress);
      const matchingKey = progressKeys.find(k => 
        k.includes(`inspection_responses_${propertyId}_`) && (k.includes('_Outside') || k.includes('_Inside'))
      );
      if (matchingKey) {
        // Extract building name from key like "inspection_responses_prop_B2_Outside"
        const matches = matchingKey.match(/inspection_responses_[^_]+_([^_]+)_(Outside|Inside)/);
        if (matches && matches[1]) {
          buildingName = matches[1];
          console.log(`[NSPIREReport] Auto-discovered building name: ${buildingName} from key: ${matchingKey}`);
        }
      }
    }
    
    console.log(`[NSPIREReport] Using building name: ${buildingName}, property ID: ${propertyId}`);
    
    const selectedUnits = inspectionData?.selectedUnits || [];
    
    // Helper to create deficiency from OD response
    const createODDeficiency = (itemId: string, itemName: string, areaName: string, index: number): DeficiencyEntry => {
      // Normalize area to 'Outside', 'Inside', or 'Units'
      const normalizedArea = areaName.startsWith('Unit_') ? 'Units' : areaName;
      const unitNum = areaName.startsWith('Unit_') ? areaName.replace('Unit_', '') : '-';
      
      return {
        id: `OD-${areaName}-${itemId}`,
        deficiencyQRId: `QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
        imageUri: '',
        building: buildingName,
        unit: unitNum,
        room: areaName,
        area: normalizedArea,  // CRITICAL: Must be 'Outside', 'Inside', or 'Units'
        deficiencyName: itemName,
        nspireCode: 'OD-MARKED', // Generic code for marked-only deficiencies
        deficiencyDetails: 'Marked as Operational Deficiency',
        comments: '',
        deductionPts: 1, // Minimal deduction for marked-only
        repeatIndicator: false,
        severity: 'Low',
        inspectedDate: now.toLocaleDateString(),
        inspectedTime: now.toLocaleTimeString(),
        inspectorId: data.inspectorId || 'INS-001',
        status: 'Open',
      };
    };

    // Scan globalInspectionProgress for OD responses
    let odDeficiencyIndex = deficiencies.length;
    
    // Check each location type
    const locationsToCheck = [
      { key: `inspection_responses_${propertyId}_${buildingName}_Outside`, area: 'Outside', items: OUTSIDE_ITEMS },
      { key: `inspection_responses_${propertyId}_${buildingName}_Inside`, area: 'Inside', items: INSIDE_ITEMS },
    ];

    locationsToCheck.forEach(({ key, area, items }) => {
      const responses = globalInspectionProgress[key];
      if (responses && typeof responses === 'object') {
        Object.entries(responses).forEach(([itemId, response]: [string, any]) => {
          if (response === 'OD') {
            // Find the item name
            const item = items.find(i => String(i.id) === String(itemId));
            const itemName = item?.name || `Item ${itemId}`;
            
            // Check if a detailed finding already exists for this item
            const existingFinding = deficiencies.find(d => 
              d.deficiencyName === itemName && d.area === area
            );
            
            // Only add if no detailed finding exists
            if (!existingFinding) {
              deficiencies.push(createODDeficiency(itemId, itemName, area, odDeficiencyIndex++));
            }
          }
        });
      }
    });

    // Also check Unit responses
    if (selectedUnits && Array.isArray(selectedUnits)) {
      selectedUnits.forEach((unit: string) => {
        const unitKey = `inspection_responses_${propertyId}_${buildingName}_Unit_${unit}`;
        const responses = globalInspectionProgress[unitKey];
        if (responses && typeof responses === 'object') {
          Object.entries(responses).forEach(([itemId, response]: [string, any]) => {
            if (response === 'OD') {
              const item = UNIT_ITEMS.find(i => String(i.id) === String(itemId));
              const itemName = item?.name || `Item ${itemId}`;
              
              const existingFinding = deficiencies.find(d => 
                d.deficiencyName === itemName && d.unit === unit
              );
              
              if (!existingFinding) {
                deficiencies.push(createODDeficiency(itemId, itemName, `Unit_${unit}`, odDeficiencyIndex++));
              }
            }
          });
        }
      });
    }

    const odItems = deficiencies.filter(d => d.nspireCode === 'OD-MARKED');
    console.log(`[NSPIREReport] Total deficiencies including OD items: ${deficiencies.length}`);
    console.log(`[NSPIREReport] OD deficiencies found: ${odItems.length}`);
    if (odItems.length > 0) {
      console.log(`[NSPIREReport] OD items by area:`, odItems.reduce((acc: any, d) => {
        acc[d.area] = (acc[d.area] || 0) + 1;
        return acc;
      }, {}));
    }
    */

    console.log(`[NSPIREReport] Total deficiencies: ${deficiencies.length}`);

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
      'life-threatening': 'Life-Threatening',
      'life threatening': 'Life-Threatening',
      'lifethreatening': 'Life-Threatening',
      'major': 'Severe',
      'severe': 'Severe',
      'high': 'Severe',
      'medium': 'Moderate',
      'moderate': 'Moderate',
      'minor': 'Low',
      'low': 'Low',
      'observation': 'Low',
    };
    return mapping[severity?.toLowerCase()] || 'Moderate';
  };

  const calculateDeductionPoints = (severity: string): number => {
    const points: Record<string, number> = {
      'critical': 10,
      'life-threatening': 10,
      'life threatening': 10,
      'lifethreatening': 10,
      'major': 6,
      'severe': 6,
      'high': 6,
      'medium': 3,
      'moderate': 3,
      'minor': 1,
      'low': 1,
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
        includeImages: true, // Enable images for preview
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



  /** "View Deficiency" on the web opens the PDF preview; reuse the WebView. */
  const handleOpenPreview = async () => {
    setShowPreviewModal(true);
    if (!previewHtml) await preparePreview();
  };

  const handleSendReportLink = async () => {
    const ok = await payment.send();
    if (!ok && payment.error) Alert.alert('Error', payment.error);
  };

  const renderPreviewModal = () => (
    <Modal
      visible={showPreviewModal}
      animationType="slide"
      onRequestClose={() => setShowPreviewModal(false)}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.previewModalHeader}>
          <Text style={styles.previewModalTitle}>Report PDF Preview</Text>
          <TouchableOpacity onPress={() => setShowPreviewModal(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={24} color={Colors.neutral.gray600} />
          </TouchableOpacity>
        </View>
        {renderPreviewTab()}
      </SafeAreaView>
    </Modal>
  );

  const renderProgressPage = () => {
    if (!report) return null;
    const m = report.metadata;
    const started = m.startDate ? new Date(m.startDate).toLocaleDateString() : '-';
    const firstDeficiency = report.deficiencies?.[0];

    return (
      <ScrollView style={styles.tabContent} contentContainerStyle={styles.progressContent} showsVerticalScrollIndicator={false}>
        <View style={styles.webCard}>
          <Text style={styles.progressTitle}>HUD INSPIRE INSPECTION PROGRESS</Text>
          <Text style={styles.progressProperty}>{m.propertyName}</Text>
          <Text style={styles.progressMeta}>{m.propertyAddress}</Text>
          <Text style={styles.progressMeta}>Inspection #{m.inspectionNo} | {started}</Text>

          <View style={styles.progressButtonRow}>
            <TouchableOpacity style={[styles.webButton, styles.webButtonNavy]} onPress={() => setShowEmailBox(true)}>
              <Ionicons name="lock-closed-outline" size={14} color="#FFFFFF" />
              <Text style={styles.webButtonText}>Unlock to Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.webButton, styles.webButtonGreen]} onPress={() => setShowOptionsModal(true)}>
              <Ionicons name="clipboard-outline" size={14} color="#FFFFFF" />
              <Text style={styles.webButtonText}>Work Order</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.webButton, styles.webButtonOrange, styles.webButtonWide]} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={14} color="#FFFFFF" />
            <Text style={styles.webButtonText}>CONTINUE INSPECTION</Text>
          </TouchableOpacity>
        </View>

        {!unlocked && (
        <View style={styles.lockedCard}>
          <View style={styles.lockedHeaderRow}>
            <Ionicons name="lock-closed" size={16} color="#B45309" />
            <View style={{ flex: 1 }}>
              <Text style={styles.lockedTitle}>REPORT LOCKED</Text>
              <Text style={styles.lockedSubtitle}>Pay once to unlock full export access</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.unlockButton} onPress={() => setShowEmailBox(true)}>
            <Ionicons name="lock-closed-outline" size={14} color="#FFFFFF" />
            <Text style={styles.unlockButtonText}>Unlock Report - $1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewDeficiencyButton} onPress={handleOpenPreview}>
            <Ionicons name="mail-outline" size={14} color="#374151" />
            <Text style={styles.viewDeficiencyText}>View Deficiency</Text>
          </TouchableOpacity>
        </View>
        )}

        <View style={styles.webCard}>
          <Text style={styles.webCardHeading}>INSPECTION DATA</Text>
          <View style={styles.webCardHeadingRule} />
          {report.inspectionData.map((row, i) => (
            <View key={i} style={styles.dataBlock}>
              <Text style={styles.dataBlockTitle}>{row.type}</Text>
              <View style={styles.dataBlockRow}>
                <View style={styles.dataBlockCell}>
                  <Text style={styles.dataBlockLabel}>Property Total</Text>
                  <Text style={styles.dataBlockValue}>{row.propertyTotal}</Text>
                </View>
                <View style={styles.dataBlockCell}>
                  <Text style={styles.dataBlockLabel}>Sample Size</Text>
                  <Text style={styles.dataBlockValue}>{row.sampleSize}</Text>
                </View>
                <View style={styles.dataBlockCell}>
                  <Text style={styles.dataBlockLabel}>Inspected</Text>
                  <Text style={styles.dataBlockValue}>{row.totalUnitsInspected}</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.repeatNewRow}>
            <View style={[styles.repeatNewCell, styles.repeatCell]}>
              <Text style={styles.repeatValue}>{report.summary.repeatDeficiencies}</Text>
              <Text style={styles.repeatLabel}>Repeat</Text>
            </View>
            <View style={[styles.repeatNewCell, styles.newCell]}>
              <Text style={styles.newValue}>{report.summary.newDeficiencies}</Text>
              <Text style={styles.newLabel}>New</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreBanner}>
          <Text style={styles.scoreBannerTitle}>Inspection Score</Text>
          <View style={styles.scoreBannerRow}>
            <View style={styles.scoreBannerCell}>
              <Text style={styles.scoreBannerLabel}>PRELIMINARY</Text>
              <Text style={styles.scoreBannerValue}>{m.preliminaryScore}</Text>
            </View>
            <View style={styles.scoreBannerCell}>
              <Text style={styles.scoreBannerLabel}>CALCULATED</Text>
              <Text style={styles.scoreBannerValue}>{m.calculatedScore}</Text>
            </View>
            <View style={styles.scoreBannerCell}>
              <Text style={styles.scoreBannerLabel}>FINAL SCORE</Text>
              <Text style={styles.scoreBannerValue}>{m.finalScore}</Text>
            </View>
          </View>
        </View>

        {!!firstDeficiency && (
          <View style={styles.webCard}>
            <Text style={styles.deficiencyPreviewHeading}>
              Deficiency Preview (1 of {report.deficiencies.length})
            </Text>
            <TouchableOpacity style={styles.deficiencyPreviewCard} onPress={handleOpenPreview}>
              {!!firstDeficiency.imageUri && (
                <Image source={{ uri: firstDeficiency.imageUri }} style={styles.deficiencyThumb} />
              )}
              <View style={{ flex: 1 }}>
                <View style={styles.deficiencyPreviewTitleRow}>
                  <Text style={styles.deficiencyPreviewName} numberOfLines={1}>{firstDeficiency.deficiencyName}</Text>
                  <Text style={styles.deficiencyPreviewSeverity}>
                    {String(firstDeficiency.severity || '').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.deficiencyPreviewDetail} numberOfLines={2}>
                  {firstDeficiency.deficiencyDetails}
                </Text>
                <Text style={styles.deficiencyPreviewMeta}>
                  {firstDeficiency.area || firstDeficiency.room || '-'} · {firstDeficiency.building || '-'} · {firstDeficiency.unit || '-'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {showEmailBox && (
          <View style={styles.emailCard}>
            <View style={styles.lockedHeaderRow}>
              <Ionicons name="mail-outline" size={16} color="#B45309" />
              <Text style={styles.emailCardTitle}>Get Full Report via Email</Text>
            </View>
            <Text style={styles.emailCardBody}>
              Enter your email to receive the complete inspection report with all deficiency details, photos, and recommendations.
            </Text>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={payment.email}
              onChangeText={payment.setEmail}
              editable={!payment.sending}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.emailButtonRow}>
              <TouchableOpacity style={styles.sendReportButton} onPress={handleSendReportLink} disabled={payment.sending}>
                <Text style={styles.sendReportButtonText}>
                  {payment.sending ? 'Sending...' : 'Send Full Report Link'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.emailCancelButton} onPress={() => setShowEmailBox(false)}>
                <Text style={styles.emailCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            💡 Note: The full report includes detailed photos, inspector comments, repair timelines, and compliance codes for each deficiency.
          </Text>
        </View>
      </ScrollView>
    );
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
      {renderProgressPage()}
      {renderPreviewModal()}
      {renderOptionsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Web /report landing page parity (built from the web screens) ---
  progressContent: {
    padding: 12,
    paddingBottom: 40,
  },
  webCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0E7490',
    marginBottom: 8,
  },
  progressProperty: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  progressMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  progressButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  webButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  webButtonWide: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  webButtonNavy: { backgroundColor: '#0E5C86' },
  webButtonGreen: { backgroundColor: '#0E8A5F' },
  webButtonOrange: { backgroundColor: '#F59E0B' },
  webButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  lockedCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lockedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  lockedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  lockedSubtitle: {
    fontSize: 11,
    color: '#B45309',
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  viewDeficiencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
  },
  viewDeficiencyText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  webCardHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E7490',
    letterSpacing: 0.5,
  },
  webCardHeadingRule: {
    height: 2,
    backgroundColor: '#0E7490',
    marginTop: 8,
    marginBottom: 14,
  },
  dataBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dataBlockTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E7490',
    marginBottom: 8,
  },
  dataBlockRow: {
    flexDirection: 'row',
  },
  dataBlockCell: {
    flex: 1,
  },
  dataBlockLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  dataBlockValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  repeatNewRow: {
    flexDirection: 'row',
    gap: 10,
  },
  repeatNewCell: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  repeatCell: { backgroundColor: '#FFFBEB' },
  newCell: { backgroundColor: '#EFF6FF' },
  repeatValue: { fontSize: 16, fontWeight: '800', color: '#B45309' },
  repeatLabel: { fontSize: 11, color: '#B45309' },
  newValue: { fontSize: 16, fontWeight: '800', color: '#2563EB' },
  newLabel: { fontSize: 11, color: '#2563EB' },
  scoreBanner: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scoreBannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  scoreBannerRow: {
    flexDirection: 'row',
  },
  scoreBannerCell: {
    flex: 1,
  },
  scoreBannerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreBannerValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  deficiencyPreviewHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E7490',
    marginBottom: 12,
  },
  deficiencyPreviewCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
  },
  deficiencyThumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  deficiencyPreviewTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  deficiencyPreviewName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  deficiencyPreviewSeverity: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  deficiencyPreviewDetail: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  deficiencyPreviewMeta: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  emailCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  emailCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  emailCardBody: {
    fontSize: 11,
    color: '#92400E',
    marginBottom: 12,
  },
  emailInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#111827',
    marginBottom: 10,
  },
  emailButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sendReportButton: {
    flex: 1,
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendReportButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emailCancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  emailCancelButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
  },
  noteCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
  },
  noteText: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
  },

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
