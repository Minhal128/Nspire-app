import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';
import { storeData, getData } from '../utils/storage';
import { stripeService } from '../utils/stripeService';
import { usePaymentLink } from '../hooks/usePaymentLink';

type InspectionSummaryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InspectionSummary'
>;
type InspectionSummaryScreenRouteProp = RouteProp<RootStackParamList, 'InspectionSummary'>;

interface Props {
  navigation: InspectionSummaryScreenNavigationProp;
  route: InspectionSummaryScreenRouteProp;
}

const InspectionSummaryScreen = ({ navigation, route }: Props) => {
  const { property, selectedUnits, buildingId, inspectionData, currentUnit: routeCurrentUnit, inspectionId: routeInspectionId } = route.params;
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies'>('summary');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingHTML, setExportingHTML] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [mergedDeficiencies, setMergedDeficiencies] = useState<any[]>(
    inspectionData?.deficiencies || []
  );

  // Use the real inspection ID from route params, or derive a stable per-property+building ID.
  // Never use a hardcoded ID — that causes all inspections to share the same unlock record.
  const propertyId = property?._id || property?.id || property?.propertyId || 'unknown';
  const inspectionId = routeInspectionId || `${propertyId}_${buildingId || 'default'}`;
  // One key for both the load and the save. The two sites used to build it
  // differently (one dropped the propertyId fallback, both dropped the
  // buildingId one), so resumed progress could be written where it is never read.
  const saveKey = `saved_inspection_${propertyId}_${buildingId || 'default'}`;
  const inspectionDate = new Date().toLocaleDateString();

  // ── Payment State ────────────────────────────────────────────────
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [checkingUnlock, setCheckingUnlock] = useState(true);
  const pendingExportAction = useRef<'pdf' | 'html' | 'excel' | null>(null);
  // Holds latest export function references so a deferred export always calls
  // the current render's version rather than a stale closure.
  const exportFnRefs = useRef<{ pdf: () => void; html: () => void; excel: () => void }>({
    pdf: () => {},
    html: () => {},
    excel: () => {},
  });

  // ── Auto-show payment modal when user is coming from inspection flow ──
  // If there are deficiencies and user navigates here via inspection, show payment modal
  const [showPaymentOnMount, setShowPaymentOnMount] = useState(false);
  const hasDeficienciesToExport = mergedDeficiencies.length > 0;

  // On mount: load any previously saved deficiencies and merge with the new ones
  useEffect(() => {
    const loadAndMerge = async () => {
      try {
        const saved = await getData(saveKey);

        // IMPORTANT: Do NOT re-stamp _area/_unit on saved deficiencies.
        // They already have their original area from when they were saved.
        // Only stamp new deficiencies that don't have _area set.
        if (saved?.deficiencies && Array.isArray(saved.deficiencies) && saved.deficiencies.length > 0) {
          // Deduplicate by deficiencyQRId; saved ones first, then new ones not already present
          const existingIds = new Set(saved.deficiencies.map((d: any) => d.deficiencyQRId).filter(Boolean));
          // Stamp currentArea/unit ONLY on new deficiencies that don't already have _area
          const incoming = (inspectionData?.deficiencies || []).map((d: any) => {
            if (d._area !== undefined) {
              // Already has area - preserve it
              return d;
            }
            // New deficiency without area - stamp it
            const currentArea: string = inspectionData?.isOutsideInspection
              ? 'Outside'
              : (inspectionData?.location === 'Inside' ? 'Inside' : 'Units');
            const currentUnit = (currentArea === 'Inside' || currentArea === 'Outside')
              ? '-'
              : (selectedUnits.join(', ') || 'Unit Multiple');
            return { ...d, _area: currentArea, _unit: currentUnit };
          });
          const uniqueNew = incoming.filter((d: any) => !existingIds.has(d.deficiencyQRId));
          setMergedDeficiencies([...saved.deficiencies, ...uniqueNew]);
        } else {
          // No saved data - stamp all incoming deficiencies with current area
          const currentArea: string = inspectionData?.isOutsideInspection
            ? 'Outside'
            : (inspectionData?.location === 'Inside' ? 'Inside' : 'Units');
          const currentUnit = (currentArea === 'Inside' || currentArea === 'Outside')
            ? '-'
            : (selectedUnits.join(', ') || 'Unit Multiple');
          const incoming = (inspectionData?.deficiencies || []).map((d: any) => ({
            ...d,
            _area: d._area || currentArea,
            _unit: d._unit !== undefined ? d._unit : currentUnit,
          }));
          if (incoming.length > 0) {
            setMergedDeficiencies(incoming);
          }
        }
      } catch (e) {
        console.warn('Could not load saved inspection data:', e);
      }
    };
    loadAndMerge();
  }, []);

  // ── Is this report already paid for? ─────────────────────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      const unlocked = await stripeService.checkUnlockStatus(inspectionId);
      if (!mounted) return;
      if (unlocked) setIsReportUnlocked(true);
      setCheckingUnlock(false);
    })();

    return () => { mounted = false; };
  }, []);

  // ── Auto-show payment modal on mount if coming from inspection flow ──
  useEffect(() => {
    // Check if user is coming from inspection flow (has deficiencies and is not yet unlocked)
    if (hasDeficienciesToExport && !isReportUnlocked && !checkingUnlock) {
      // Small delay to let the screen render first
      const timer = setTimeout(() => {
        setPaymentModalVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasDeficienciesToExport, isReportUnlocked, checkingUnlock]);

  /**
   * Run whichever export the user was blocked on, now that the report is unlocked.
   * Reads exportFnRefs (refreshed every render) so it is never a stale closure.
   */
  const runPendingExport = () => {
    const action = pendingExportAction.current;
    if (!action) return;
    pendingExportAction.current = null;
    setTimeout(() => exportFnRefs.current[action](), 500);
  };

  // ── Stripe: the payer gets a checkout link by email ───────────────
  // No card is entered in the app. Once the link is paid, the hook's poll
  // flips the unlock and the export the user was blocked on runs itself.
  const payment = usePaymentLink(inspectionId, () => {
    setIsReportUnlocked(true);
    setPaymentModalVisible(false);
    Alert.alert('Payment Successful', 'Report unlocked. Your download will start now.');
    runPendingExport();
  }, paymentModalVisible);

  const handleSendPaymentLink = async () => {
    const ok = await payment.send();
    if (!ok && payment.error) Alert.alert('Error', payment.error);
  };

  // Any payment in flight — the modal must not be dismissible mid-flow.
  const paymentBusy = payment.sending;

  /**
   * Gate an export action behind payment.
   * If unlocked, runs the callback directly; otherwise opens the payment modal
   * and remembers which export to run once payment lands.
   *
   * Web used to skip the gate outright because Play Billing was native-only.
   * Stripe checkout works on every platform, so the gate now applies everywhere.
   */
  const gateExport = (action: 'pdf' | 'html' | 'excel', callback: () => void) => {
    if (isReportUnlocked) {
      callback();
    } else {
      pendingExportAction.current = action;
      setPaymentModalVisible(true);
    }
  };

  // Calculate actual deficiency counts from mergedDeficiencies
  const deficiencyCounts = {
    lifeThreadening: mergedDeficiencies.filter((d: any) =>
      (d.deficiency?.aiSeverity || d.deficiency?.severity) === 'Life-Threatening'
    ).length,
    severe: mergedDeficiencies.filter((d: any) =>
      (d.deficiency?.aiSeverity || d.deficiency?.severity) === 'Severe'
    ).length,
    moderate: mergedDeficiencies.filter((d: any) =>
      (d.deficiency?.aiSeverity || d.deficiency?.severity) === 'Moderate'
    ).length,
    low: mergedDeficiencies.filter((d: any) =>
      (d.deficiency?.aiSeverity || d.deficiency?.severity) === 'Low'
    ).length,
    // Web parity: the summary also splits repeats from new findings.
    repeat: mergedDeficiencies.filter((d: any) =>
      !!(d.repeatIndicator ?? d.deficiency?.repeatIndicator)
    ).length,
  };

  // Calculate scores based on actual deficiencies
  const totalDeficiencies = mergedDeficiencies.length;
  const deductionPoints = (deficiencyCounts.lifeThreadening * 10) +
    (deficiencyCounts.severe * 6) +
    (deficiencyCounts.moderate * 3) +
    (deficiencyCounts.low * 1);

  const preliminaryScore = Math.max(0, 100 - deductionPoints);
  const calculatedScore = preliminaryScore;
  const finalScore = Math.max(0, preliminaryScore - 5); // Slight adjustment for final
  const isPassing = finalScore >= 60;

  const handleContinueInspection = async () => {
    const nextArea: string = inspectionData?.isOutsideInspection
      ? 'Outside'
      : (inspectionData?.location === 'Inside' ? 'Inside' : 'Units');
    const nextUnit = (nextArea === 'Inside' || nextArea === 'Outside')
      ? '-'
      : (selectedUnits.join(', ') || routeCurrentUnit || 'Unit Multiple');

    try {

      // Convert local image URIs to base64 so images survive navigation,
      // and stamp _area / _unit on each deficiency so they survive future merges
      const deficienciesWithImages = await Promise.all(
        mergedDeficiencies.map(async (defItem: any) => {
          // Keep existing _area if already stamped (from a previous session)
          const area = defItem._area || nextArea;
          const unit = defItem._unit !== undefined ? defItem._unit : nextUnit;

          // If already base64 or a remote URL, keep as-is
          if (
            !defItem.imageUri ||
            defItem.imageUri.startsWith('data:') ||
            defItem.imageUri.startsWith('http')
          ) {
            return { ...defItem, _area: area, _unit: unit, imageUri: defItem.imageUri || defItem.imageUrl || null };
          }
          // Try to convert local file to base64
          if (Platform.OS !== 'web') {
            try {
              const fileInfo = await FileSystem.getInfoAsync(defItem.imageUri);
              if (fileInfo.exists) {
                const base64 = await FileSystem.readAsStringAsync(defItem.imageUri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                if (base64 && base64.length > 100) {
                  return { ...defItem, _area: area, _unit: unit, imageUri: `data:image/jpeg;base64,${base64}` };
                }
              }
            } catch (imgErr) {
              console.warn('Could not encode image to base64:', imgErr);
            }
          }
          // Fall back to Cloudinary URL if local conversion fails
          return { ...defItem, _area: area, _unit: unit, imageUri: defItem.imageUri || defItem.imageUrl || null };
        })
      );
      await storeData(saveKey, {
        deficiencies: deficienciesWithImages,
        savedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not save inspection data:', e);
    }

    // Go back to the specific location inspection screen to continue answering items
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId: buildingId || 'default',
      location: nextArea,
      currentUnit: nextUnit,
    });
  };

  const handlePreviewReport = () => {
    // Generate preview HTML — restricted to 2 pages when locked
    const html = generatePreviewHtml();
    setPreviewHtml(html);
    setPreviewModalVisible(true);
  };

  const generatePreviewHtml = (): string => {
    const propertyName = property.name || 'Property';
    const propertyAddress = property.address || '';

    // ── Restrict preview to 2 deficiencies when report is locked ───
    const PREVIEW_LIMIT = 2;
    const previewDefs = isReportUnlocked
      ? mergedDeficiencies
      : mergedDeficiencies.slice(0, PREVIEW_LIMIT);
    const isPreviewLimited = !isReportUnlocked && mergedDeficiencies.length > PREVIEW_LIMIT;

    // Generate deficiencies HTML
    let deficienciesHtml = '';
    if (previewDefs.length > 0) {
      deficienciesHtml = previewDefs.map((def: any, index: number) => {
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

    // Paywall banner for locked reports
    const paywallBannerHtml = isPreviewLimited ? `
      <div style="background: linear-gradient(135deg, #0E7490 0%, #065666 100%); border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; color: white;">
        <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
        <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Preview Mode</div>
        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">Showing ${PREVIEW_LIMIT} of ${mergedDeficiencies.length} deficiencies</div>
        <div style="font-size: 14px; opacity: 0.9;">Purchase the full report for <strong>$99</strong> to view all pages and export.</div>
      </div>
    ` : '';

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
          ${paywallBannerHtml}
        </div>
      </body>
      </html>
    `;
  };

  // ── Shared helper: build the full reportData object from current state ─────
  const buildReportData = async () => {
    const deficienciesArray: any[] = [];
    const buildingName = property.name || buildingId || 'B1';

    if (mergedDeficiencies.length > 0) {
      for (let i = 0; i < mergedDeficiencies.length; i++) {
        const defItem = mergedDeficiencies[i];
        const deficiency = defItem?.deficiency || {};

        // Convert local image to base64
        let imageBase64: string | null = null;
        const cloudinaryUrl = defItem.imageUrl || null;

        if (defItem.imageUri) {
          if (defItem.imageUri.startsWith('data:')) {
            // Already a base64 data URL — use directly (saved by handleContinueInspection)
            imageBase64 = defItem.imageUri;
          } else if (defItem.imageUri.startsWith('http://') || defItem.imageUri.startsWith('https://')) {
            // Remote URL (Cloudinary etc.) — PDF service will download it
            imageBase64 = defItem.imageUri;
          } else if (Platform.OS !== 'web') {
            // Local file path — convert to base64
            try {
              const fileInfo = await FileSystem.getInfoAsync(defItem.imageUri);
              if (fileInfo.exists) {
                const base64 = await FileSystem.readAsStringAsync(defItem.imageUri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                if (base64 && base64.length > 100) {
                  imageBase64 = `data:image/jpeg;base64,${base64}`;
                }
              }
            } catch (imgError) {
              console.error('Error converting image to base64:', imgError);
            }
          }
        }

        const finalImageUri = imageBase64 || cloudinaryUrl || defItem.imageUri || null;
        // Use per-deficiency saved area (_area) if available (set when continuing inspection),
        // otherwise fall back to the current session's area from inspectionData.
        const inspectionArea: string = defItem._area
          || (inspectionData.isOutsideInspection
            ? 'Outside'
            : (inspectionData.location === 'Inside' ? 'Inside' : 'Units'));
        const isGC = !!(defItem as any).isGeneralComment;
        // Use per-deficiency saved unit (_unit) if available, otherwise compute for current session
        const defUnit: string = defItem._unit !== undefined
          ? defItem._unit
          : ((inspectionArea === 'Inside' || inspectionArea === 'Outside')
            ? '-'
            : (selectedUnits.join(', ') || 'Unit Multiple'));

        deficienciesArray.push({
          id: `${i + 1}`,
          deficiencyQRId: defItem.deficiencyQRId || `QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          building: buildingName,
          unit: defUnit,
          room: defItem.location || 'Multiple',
          area: inspectionArea,
          isGeneralComment: isGC,
          deficiencyName: isGC ? 'General Comment' : (deficiency.name || 'Deficiency'),
          nspireCode: isGC ? '-' : (deficiency.code || 'U-1'),
          codeReference: isGC ? '' : (deficiency.codeReference || ''),
          deficiencyDetails: isGC ? '-' : (deficiency.detail || 'Damaged or vandalized'),
          comments: defItem.note || (isGC ? '' : (deficiency.aiAnalysis || 'AI analyzed')),
          note: defItem.note || '',
          deductionPts: isGC ? 0 : 3,
          repeatIndicator: false,
          severity: isGC ? '-' : (deficiency.severity || deficiency.aiSeverity || 'Moderate'),
          inspectedDate: inspectionDate,
          inspectedTime: new Date().toLocaleTimeString(),
          inspectorId: 'INS-001',
          imageUri: finalImageUri,
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
    const areaKey = inspectionData.isOutsideInspection ? 'Outside' : (inspectionData.location === 'Inside' ? 'Inside' : 'Units');

    return {
      reportId: inspectionId,
      version: '1.0',
      generatedAt: new Date().toISOString(),
      metadata: {
        inspectionNo: inspectionId,
        inspectionType: 'General NSPIRE' as const,
        escortName: 'Property Manager',
        propertyAddress: property.address || '',
        propertyName: property.name || 'Property',
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
        buildingName: buildingName,
        inspectedUnits: selectedUnits.length > 0 ? selectedUnits : undefined,
      },
      inspectionData: [
        { type: 'Building' as const, propertyTotal: property.buildings || property.totalBuildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit' as const, propertyTotal: property.units || property.totalUnits || selectedUnits.length || 1, sampleSize: selectedUnits.length || 1, totalUnitsInspected: selectedUnits.length || 1 },
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
        byBuilding: { [buildingName]: deficienciesArray.length },
        byCategory: { [areaKey]: deficienciesArray.length },
        repeatDeficiencies: 0,
        newDeficiencies: deficienciesArray.length,
      },
      categoryBreakdown: [{
        category: areaKey,
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
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const reportData = await buildReportData();
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
        ? "Report opened in a new tab. Use your browser's print dialog to save as PDF."
        : 'Report downloaded successfully!';
      Alert.alert(successTitle, successMsg, [
        { text: 'Close', style: 'cancel' },
        { text: 'Go to Dashboard', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' as never }] }) },
      ], { cancelable: true });
    } catch (error: any) {
      Alert.alert('Error', `Failed to generate PDF: ${error.message || 'Unknown error'}`);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportHTML = async () => {
    setExportingHTML(true);
    try {
      const reportData = await buildReportData();
      const htmlContent = enhancedNspirePDFService.generateEnhancedHTMLPreview(reportData, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      });

      if (Platform.OS === 'web') {
        // On web: open in a new tab
        const win = (window as any).open('', '_blank') as Window | null;
        if (win) {
          win.document.write(htmlContent);
          win.document.close();
        } else {
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `NSPIRE-Report-${reportData.metadata.inspectionNo}.html`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        Alert.alert('HTML Report Ready', 'Report opened in a new browser tab.');
      } else {
        // On native: save to a temp file and share
        const fileName = `NSPIRE-Report-${reportData.metadata.inspectionNo || Date.now()}.html`;
        const filePath = (FileSystem.cacheDirectory || '') + fileName;
        await FileSystem.writeAsStringAsync(filePath, htmlContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'text/html',
            dialogTitle: 'NSPIRE Inspection Report (HTML)',
            UTI: 'public.html',
          });
        }
        Alert.alert('HTML Exported', 'HTML report file shared successfully!', [
          { text: 'Close', style: 'cancel' },
          { text: 'Go to Dashboard', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' as never }] }) },
        ], { cancelable: true });
      }
    } catch (error: any) {
      Alert.alert('Error', `Failed to generate HTML: ${error.message || 'Unknown error'}`);
    } finally {
      setExportingHTML(false);
    }
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      const reportData = await buildReportData();

      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Summary
      const summaryData = [
        ['NSPIRE INSPECTION REPORT'],
        [],
        ['Property Name', reportData.metadata.propertyName || ''],
        ['Property Address', reportData.metadata.propertyAddress || ''],
        ['Inspection Number', reportData.metadata.inspectionNo || ''],
        ['Inspection Date', reportData.metadata.startDate || ''],
        ['Inspector', reportData.metadata.inspectorName || ''],
        [],
        ['SCORES'],
        ['Preliminary Score', reportData.metadata.preliminaryScore || 'N/A'],
        ['Calculated Score', reportData.metadata.calculatedScore || 'N/A'],
        ['Final Score', reportData.metadata.finalScore || 'N/A'],
        [],
        ['DEFICIENCY SUMMARY'],
        ['Life Threatening', reportData.summary?.lifeThreatening || 0],
        ['Severe', reportData.summary?.severe || 0],
        ['Moderate', reportData.summary?.moderate || 0],
        ['Low', reportData.summary?.low || 0],
        ['Total Deficiencies', reportData.summary?.total || 0],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 25 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      // Sheet 2: Deficiencies
      const deficiencyHeaders = [
        'Room', 'Building', 'Unit', 'Area', 'Deficiency',
        'NSPIRE Code', 'Severity', 'Deduction', 'Status', 'Details', 'Date'
      ];
      const deficiencyRows = (reportData.deficiencies || []).map((def: any) => [
        def.room || '',
        def.building || '',
        def.unit || '',
        def.area || '',
        def.deficiencyName || '',
        def.nspireCode || '',
        def.severity || '',
        def.deductionPts || '',
        def.status || '',
        def.deficiencyDetails || '',
        def.inspectedDate || '',
      ]);
      const deficiencyData = [deficiencyHeaders, ...deficiencyRows];
      const deficiencySheet = XLSX.utils.aoa_to_sheet(deficiencyData);
      deficiencySheet['!cols'] = [
        { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 25 },
        { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 30 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(workbook, deficiencySheet, 'Deficiencies');

      const fileName = `NSPIRE-Report-${inspectionId}.xlsx`;

      if (Platform.OS === 'web') {
        // Web: download the file
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        Alert.alert('Excel Report Ready', 'Report downloaded successfully.');
      } else {
        // Native: write to file system and share
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, wbout, { encoding: FileSystem.EncodingType.Base64 });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'NSPIRE Inspection Report (Excel)',
            UTI: 'org.openxmlformats.spreadsheetml.sheet',
          });
        }
        Alert.alert('Excel Exported', 'Excel report shared successfully!', [
          { text: 'Close', style: 'cancel' },
          { text: 'Go to Dashboard', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' as never }] }) },
        ], { cancelable: true });
      }
    } catch (error: any) {
      Alert.alert('Error', `Failed to generate Excel: ${error.message || 'Unknown error'}`);
    } finally {
      setExportingExcel(false);
    }
  };

  // Keep refs in sync with the latest function versions on every render.
  exportFnRefs.current.pdf = handleExportPDF;
  exportFnRefs.current.html = handleExportHTML;
  exportFnRefs.current.excel = handleExportExcel;

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

          {/* Payment Status Badge - Always visible */}
          <View style={[
            styles.paymentStatusBadge,
            isReportUnlocked ? styles.paymentStatusBadgeUnlocked :
              (checkingUnlock ? styles.paymentStatusBadgeChecking : styles.paymentStatusBadgeLocked)
          ]}>
            {isReportUnlocked ? (
              <>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.paymentStatusTextUnlocked}>Report Unlocked</Text>
              </>
            ) : checkingUnlock ? (
              <>
                <ActivityIndicator size="small" color="#0E7490" />
                <Text style={styles.paymentStatusTextChecking}>Checking payment status...</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color="#F97316" />
                <Text style={styles.paymentStatusTextLocked}>Payment required for export</Text>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => gateExport('pdf', handleExportPDF)}
            disabled={exportingPDF}
          >
            {exportingPDF ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                {!isReportUnlocked && <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />}
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>Export PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.htmlButton}
            onPress={() => gateExport('html', handleExportHTML)}
            disabled={exportingHTML}
          >
            {exportingHTML ? (
              <ActivityIndicator color="#0E7490" />
            ) : (
              <>
                {!isReportUnlocked && <Ionicons name="lock-closed" size={16} color="#0E7490" style={{ marginRight: 4 }} />}
                <Ionicons name="code-slash-outline" size={20} color="#0E7490" />
                <Text style={styles.htmlButtonText}>Export HTML</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.excelButton}
            onPress={() => gateExport('excel', handleExportExcel)}
            disabled={exportingExcel}
          >
            {exportingExcel ? (
              <ActivityIndicator color="#217346" />
            ) : (
              <>
                {!isReportUnlocked && <Ionicons name="lock-closed" size={16} color="#217346" style={{ marginRight: 4 }} />}
                <Ionicons name="grid-outline" size={20} color="#217346" />
                <Text style={styles.excelButtonText}>Export Excel</Text>
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

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueInspection}
          >
            <Ionicons name="arrow-forward-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.continueButtonText}>Continue Inspection</Text>
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

              <View style={styles.deficiencyItem}>
                <View style={[styles.deficiencyBar, styles.totalBar]} />
                <Text style={[styles.deficiencyCount, styles.totalCount]}>{totalDeficiencies}</Text>
                <Text style={[styles.deficiencyLabel, styles.totalLabel]}>Total</Text>
              </View>
            </View>

            {/* Repeat vs new (web parity) */}
            <View style={styles.repeatNewRow}>
              <View style={[styles.repeatNewTile, styles.repeatTile]}>
                <Text style={[styles.repeatNewCount, styles.repeatText]}>{deficiencyCounts.repeat}</Text>
                <Text style={[styles.repeatNewLabel, styles.repeatText]}>Repeat Deficiencies</Text>
              </View>
              <View style={[styles.repeatNewTile, styles.newTile]}>
                <Text style={[styles.repeatNewCount, styles.newText]}>
                  {totalDeficiencies - deficiencyCounts.repeat}
                </Text>
                <Text style={[styles.repeatNewLabel, styles.newText]}>New Deficiencies</Text>
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
                <Text style={styles.detailLabel}>Property Total:</Text>
                <Text style={styles.detailValue}>{property?.units ?? '-'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Sample Size:</Text>
                <Text style={styles.detailValue}>
                  {property?.calculatedUnits ?? selectedUnits.length}
                </Text>
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

            {mergedDeficiencies.length > 0 ? (
              mergedDeficiencies.map((defItem: any, index: number) => (
                <View key={index} style={[styles.deficiencyDetailCard, index > 0 && { marginTop: 16 }]}>
                  {(() => {
                    const deficiency = defItem?.deficiency || {};
                    const severity = deficiency.aiSeverity || deficiency.severity || 'Moderate';
                    return (
                      <>
                        <View style={styles.deficiencyHeader}>
                          <Text style={styles.deficiencyItemName}>{defItem.itemName || inspectionData.itemName}</Text>
                          <View style={[
                            styles.severityBadge,
                            severity === 'Life-Threatening' && styles.lifethreateningBadge,
                            severity === 'Severe' && styles.severeBadge,
                            severity === 'Moderate' && styles.moderateBadge,
                            severity === 'Low' && styles.lowBadge,
                          ]}>
                            <Text style={styles.severityText}>{severity}</Text>
                          </View>
                        </View>

                        <Text style={styles.deficiencyName}>{deficiency.name || 'Deficiency'}</Text>
                        <Text style={styles.deficiencyDescription}>{deficiency.detail || 'No details available'}</Text>

                        {deficiency.aiAnalysis && (
                          <View style={styles.aiAnalysisSection}>
                            <Text style={styles.aiAnalysisLabel}>AI Analysis:</Text>
                            <Text style={styles.aiAnalysisText}>{deficiency.aiAnalysis}</Text>
                          </View>
                        )}

                        <View style={styles.deficiencyMeta}>
                          <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={16} color="#666666" />
                            <Text style={styles.metaText}>Repair by: {deficiency.repairBy || '-'}</Text>
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
                      </>
                    );
                  })()}
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
              onError={(syntheticEvent: any) => {
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

      {/* ── Payment Modal ─────────────────────────────────────── */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { if (!paymentBusy) setPaymentModalVisible(false); }}
      >
        <View style={styles.paymentOverlay}>
          <View style={styles.paymentModal}>
            {/* Close */}
            <TouchableOpacity
              style={styles.paymentCloseButton}
              onPress={() => { if (!paymentBusy) setPaymentModalVisible(false); }}
              disabled={paymentBusy}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>

            {/* Body scrolls: the card + email-link options overflow a small screen. */}
            <ScrollView contentContainerStyle={styles.paymentModalContent} showsVerticalScrollIndicator={false}>

            {/* Payment Provider Badge */}
            <View style={styles.paymentProviderBadge}>
              <Ionicons name="card" size={22} color="#FFFFFF" />
              <Text style={styles.paymentProviderBadgeText}>Stripe</Text>
            </View>

            {/* Icon */}
            <View style={styles.paymentIconContainer}>
              <Ionicons name="document-text" size={48} color="#0E7490" />
            </View>

            <Text style={styles.paymentTitle}>Unlock Full Report</Text>
            <Text style={styles.paymentDescription}>
              Purchase access to generate and export the complete inspection report for this property, including all deficiencies, scores, and detailed analysis.
            </Text>

            {/* Price */}
            <View style={styles.paymentPriceContainer}>
              <Text style={styles.paymentPriceLabel}>One-time payment (unlocks ALL reports)</Text>
              <Text style={styles.paymentPriceSub}>The amount is shown on the secure Stripe checkout page.</Text>
            </View>

            {/* Features */}
            <View style={styles.paymentFeatures}>
              {[
                'Full PDF, HTML & Excel export',
                'All deficiencies & images included',
                'Complete scoring breakdown',
                'Certification & compliance details',
                'Access ALL future inspection reports',
              ].map((feature, idx) => (
                <View key={idx} style={styles.paymentFeatureRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.paymentFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Email-only checkout: the link is mailed, paid anywhere, and the
                poll below unlocks the report without the user coming back. */}
            {payment.sentTo ? (
              <View style={styles.paymentSentBox}>
                <Ionicons name="mail-open-outline" size={28} color="#0E7490" />
                <Text style={styles.paymentSentTitle}>Payment link sent</Text>
                <Text style={styles.paymentSentText}>
                  We emailed the secure Stripe checkout link to {payment.sentTo}. Pay from that
                  email — this screen unlocks and your download starts automatically.
                </Text>
                <View style={styles.paymentWaitingRow}>
                  <ActivityIndicator size="small" color="#0E7490" />
                  <Text style={styles.paymentWaitingText}>Waiting for payment…</Text>
                </View>
                <TouchableOpacity onPress={() => { void payment.checkNow(); }} disabled={payment.checking}>
                  <Text style={styles.paymentSentLink}>
                    {payment.checking ? 'Checking…' : 'Already paid? Check now'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={payment.reset} disabled={payment.checking}>
                  <Text style={styles.paymentSentLinkMuted}>Send to a different email</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.paymentShareLabel}>
                  Email the payment link to whoever is paying
                </Text>
                <TextInput
                  style={styles.paymentShareInput}
                  placeholder="name@company.com"
                  placeholderTextColor="#9CA3AF"
                  value={payment.email}
                  onChangeText={payment.setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!paymentBusy}
                  accessibilityLabel="Email address for the payment link"
                />
                <TouchableOpacity
                  style={[styles.paymentBuyButton, paymentBusy && styles.paymentBuyButtonDisabled]}
                  onPress={handleSendPaymentLink}
                  disabled={paymentBusy}
                  accessibilityLabel="Send payment link"
                >
                  {payment.sending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.paymentBuyButtonText}>Send Payment Link</Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.paymentSecureText}>
                  🔒 Secure payment via Stripe
                </Text>
              </>
            )}

            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  totalBar: { backgroundColor: '#16A34A' },
  totalCount: { color: '#16A34A' },
  totalLabel: { color: '#16A34A' },
  repeatNewRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  repeatNewTile: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  repeatTile: { backgroundColor: '#FFFBEB' },
  newTile: { backgroundColor: '#EFF6FF' },
  repeatNewCount: { fontSize: 22, fontWeight: '800' },
  repeatNewLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  repeatText: { color: '#B45309' },
  newText: { color: '#1D4ED8' },
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
  htmlButton: {
    borderWidth: 2,
    borderColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  htmlButtonText: {
    color: '#0E7490',
    fontSize: 16,
    fontWeight: '700',
  },
  excelButton: {
    borderWidth: 2,
    borderColor: '#217346',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  excelButtonText: {
    color: '#217346',
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
  continueButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
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
  // ── Payment Modal Styles ────────────────────────────────────────
  paymentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  paymentModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  paymentModalContent: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  paymentShareLabel: {
    width: '100%',
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  paymentShareInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  paymentSentBox: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
  },
  paymentSentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    marginTop: 8,
  },
  paymentSentText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },
  paymentWaitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  paymentWaitingText: {
    fontSize: 13,
    color: '#0E7490',
    fontWeight: '600',
  },
  paymentSentLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
    marginTop: 14,
  },
  paymentSentLinkMuted: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 10,
  },
  paymentCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    zIndex: 10,
  },
  paymentProviderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  paymentProviderBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  paymentStatusBadgeUnlocked: {
    backgroundColor: '#E8F5E9',
  },
  paymentStatusBadgeChecking: {
    backgroundColor: '#F3F4F6',
  },
  paymentStatusBadgeLocked: {
    backgroundColor: '#FFF7ED',
  },
  paymentStatusTextUnlocked: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  paymentStatusTextChecking: {
    fontSize: 13,
    color: '#666666',
  },
  paymentStatusTextLocked: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F97316',
  },
  paymentIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  paymentPriceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentPriceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  paymentPriceSub: {
    fontSize: 13,
    color: '#999999',
    marginTop: 2,
  },
  paymentFeatures: {
    width: '100%',
    marginBottom: 24,
  },
  paymentFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  paymentFeatureText: {
    fontSize: 14,
    color: '#374151',
  },
  paymentBuyButton: {
    backgroundColor: '#0E7490',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentBuyButtonDisabled: {
    opacity: 0.7,
  },
  paymentBuyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  paymentSecureText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 12,
  },
});

export default InspectionSummaryScreen;
