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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx-js-style';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';
import { storeData, getData, removeData } from '../utils/storage';
import { inspectionService } from '../services/inspectionService';

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
  const { property, selectedUnits, buildingId, inspectionData, currentUnit: routeCurrentUnit } = route.params;
  const propertyId = property?._id || property?.id || property?.propertyId || 'unknown';
  const resolvedBuildingLabel = String(
    buildingId || property?.building || property?.buildingName || 'Building'
  ).trim();
  const summaryDraftInspectionType = 'REPORT_DRAFT_PROPERTY';
  const summaryDraftUnitId = 'ALL_UNITS';
  const propertyDraftSaveKey = `saved_inspection_${propertyId}`;
  const legacyBuildingDraftSaveKey = `saved_inspection_${propertyId}_${buildingId}`;
  const legacySummaryDraftInspectionType = `REPORT_DRAFT_${String(buildingId)}`;
  const [activeTab, setActiveTab] = useState<'summary' | 'deficiencies'>('summary');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingHTML, setExportingHTML] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [mergedDeficiencies, setMergedDeficiencies] = useState<any[]>(
    inspectionData?.deficiencies || []
  );
  const [continuingInspection, setContinuingInspection] = useState(false);
  const [continueToast, setContinueToast] = useState<{
    visible: boolean;
    message: string;
    type: 'info' | 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });
  const continueToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (continueToastTimeoutRef.current) {
        clearTimeout(continueToastTimeoutRef.current);
        continueToastTimeoutRef.current = null;
      }
    };
  }, []);

  const showContinueToast = (
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    autoHideMs: number = 1800
  ) => {
    if (continueToastTimeoutRef.current) {
      clearTimeout(continueToastTimeoutRef.current);
      continueToastTimeoutRef.current = null;
    }

    setContinueToast({ visible: true, message, type });

    if (autoHideMs > 0) {
      continueToastTimeoutRef.current = setTimeout(() => {
        setContinueToast((prev) => ({ ...prev, visible: false }));
        continueToastTimeoutRef.current = null;
      }, autoHideMs);
    }
  };

  const normalizeKeyPart = (value: any): string => String(value ?? '').trim().toLowerCase();

  const normalizeLabelToken = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');

  const isPlaceholderLabel = (value: unknown): boolean => {
    const token = normalizeLabelToken(value);
    return (
      !token ||
      token === '-' ||
      token === 'allunits' ||
      token === 'allunit' ||
      token === 'unknown' ||
      token === 'null' ||
      token === 'undefined' ||
      token === 'property' ||
      token === 'building' ||
      token === 'unitmultiple'
    );
  };

  const looksLikeBuildingLabel = (value: unknown): boolean => {
    const label = String(value ?? '').trim();
    if (!label) {
      return false;
    }

    return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label);
  };

  const firstValidLabel = (values: unknown[]): string => {
    for (const value of values) {
      const label = String(value ?? '').trim();
      if (label && !isPlaceholderLabel(label)) {
        return label;
      }
    }

    return '';
  };

  const resolveDeficiencyContext = (
    deficiencyItem: any,
    fallbackArea: string,
    fallbackUnit: string,
    previousItem?: any,
    fallbackBuilding?: string
  ): { area: string; unit: string; building: string } => {
    const area = String(deficiencyItem?._area || previousItem?._area || fallbackArea || '').trim() || fallbackArea;
    const areaToken = normalizeLabelToken(area);
    const isInsideOutsideArea = areaToken.includes('inside') || areaToken.includes('outside');

    const building = firstValidLabel([
      deficiencyItem?.building,
      deficiencyItem?.buildingName,
      deficiencyItem?.buildingId,
      previousItem?.building,
      previousItem?.buildingName,
      previousItem?.buildingId,
      isInsideOutsideArea ? deficiencyItem?._unit : '',
      isInsideOutsideArea && looksLikeBuildingLabel(deficiencyItem?.unit) ? deficiencyItem?.unit : '',
      isInsideOutsideArea ? previousItem?._unit : '',
      fallbackBuilding,
    ]);

    const unit = isInsideOutsideArea
      ? (firstValidLabel([
        deficiencyItem?._unit,
        looksLikeBuildingLabel(deficiencyItem?.unit) ? deficiencyItem?.unit : '',
        previousItem?._unit,
        building,
      ]) || '-')
      : (firstValidLabel([
        deficiencyItem?._unit,
        deficiencyItem?.unit,
        deficiencyItem?.unitId,
        previousItem?._unit,
        fallbackUnit,
      ]) || fallbackUnit);

    return { area, unit, building };
  };

  const buildDeficiencyDedupeKey = (
    deficiencyItem: any,
    fallbackArea: string,
    fallbackUnit: string,
    fallbackBuilding?: string
  ): string => {
    const context = resolveDeficiencyContext(deficiencyItem, fallbackArea, fallbackUnit, undefined, fallbackBuilding);
    const area = normalizeKeyPart(context.area || fallbackArea || 'unknown-area');
    const building = normalizeKeyPart(context.building || 'unknown-building');
    const unit = normalizeKeyPart(context.unit || fallbackUnit || 'unknown-unit');
    const moduleId = normalizeKeyPart(
      deficiencyItem?.itemId ||
      deficiencyItem?.itemName ||
      deficiencyItem?.deficiencyQRId ||
      'unknown-item'
    );
    const deficiencyName = normalizeKeyPart(
      deficiencyItem?.deficiency?.name ||
      deficiencyItem?.deficiencyName ||
      (deficiencyItem?.isGeneralComment ? 'general comment' : 'unknown-deficiency')
    );
    const deficiencyDetails = normalizeKeyPart(
      deficiencyItem?.deficiency?.detail ||
      deficiencyItem?.deficiencyDetails ||
      deficiencyItem?.detail ||
      deficiencyItem?.description ||
      ''
    );
    const assetIdentity = normalizeKeyPart(
      deficiencyItem?.deficiencyQRId ||
      deficiencyItem?.imageUri ||
      deficiencyItem?.imageUrl ||
      deficiencyItem?.id ||
      deficiencyItem?.analyzedAt ||
      ''
    );

    return `${area}|${building}|${unit}|${moduleId}|${deficiencyName}|${deficiencyDetails}|${assetIdentity || 'no-asset'}`;
  };

  const mergeDeficiencyLists = (
    existingList: any[] = [],
    incomingList: any[] = [],
    fallbackArea: string,
    fallbackUnit: string,
    fallbackBuilding?: string
  ): any[] => {
    const mergedByKey = new Map<string, any>();

    const upsert = (item: any) => {
      const key = buildDeficiencyDedupeKey(item, fallbackArea, fallbackUnit, fallbackBuilding);
      const previous = mergedByKey.get(key) || {};
      const context = resolveDeficiencyContext(item, fallbackArea, fallbackUnit, previous, fallbackBuilding);
      const merged = {
        ...previous,
        ...item,
        _area: context.area,
        _unit: context.unit,
        building: firstValidLabel([
          item?.building,
          item?.buildingName,
          item?.buildingId,
          previous?.building,
          context.building,
        ]) || previous?.building,
        dedupeKey: key,
      };
      mergedByKey.set(key, merged);
    };

    existingList.forEach(upsert);
    incomingList.forEach(upsert);

    return Array.from(mergedByKey.values());
  };

  const scopeDeficienciesToBuilding = (
    deficiencyList: any[] = [],
    fallbackArea: string,
    fallbackUnit: string,
    fallbackBuilding: string
  ): any[] => {
    const targetBuildingToken = normalizeLabelToken(fallbackBuilding);

    return deficiencyList
      .map((item) => {
        const context = resolveDeficiencyContext(item, fallbackArea, fallbackUnit, undefined, fallbackBuilding);
        const resolvedBuilding = firstValidLabel([
          item?.buildingInspectionId,
          item?.building,
          item?.buildingName,
          item?.buildingId,
          context.building,
          fallbackBuilding,
        ]);

        return {
          ...item,
          _area: context.area,
          _unit: context.unit,
          building: resolvedBuilding || item?.building,
          buildingInspectionId: firstValidLabel([item?.buildingInspectionId, resolvedBuilding, fallbackBuilding]) || undefined,
        };
      })
      .filter((item) => {
        if (!targetBuildingToken) {
          return true;
        }

        const itemBuilding = firstValidLabel([
          item?.buildingInspectionId,
          item?.building,
          item?.buildingName,
          item?.buildingId,
        ]);

        if (!itemBuilding) {
          return true;
        }

        return normalizeLabelToken(itemBuilding) === targetBuildingToken;
      });
  };

  // On mount: load any previously saved deficiencies and merge with the new ones
  useEffect(() => {
    const loadAndMerge = async () => {
      try {
        const [propertySaved, legacySaved, remoteProgress, legacyRemoteProgress] = await Promise.all([
          getData(propertyDraftSaveKey),
          legacyBuildingDraftSaveKey !== propertyDraftSaveKey
            ? getData(legacyBuildingDraftSaveKey).catch(() => null)
            : Promise.resolve(null),
          inspectionService
            .getProgress({
              property_id: String(propertyId),
              unit_id: summaryDraftUnitId,
              inspection_type: summaryDraftInspectionType,
            })
            .catch(() => ({ items: {}, inspectionData: {} })),
          inspectionService
            .getProgress({
              property_id: String(propertyId),
              unit_id: String(buildingId),
              inspection_type: legacySummaryDraftInspectionType,
            })
            .catch(() => ({ items: {}, inspectionData: {} })),
        ]);

        // Stamp _area / _unit on incoming deficiencies from the CURRENT session
        const currentArea: string = inspectionData?.isOutsideInspection
          ? 'Outside'
          : (inspectionData?.location === 'Inside' ? 'Inside' : 'Units');
        const currentUnitValue = (currentArea === 'Inside' || currentArea === 'Outside')
          ? resolvedBuildingLabel
          : (routeCurrentUnit || selectedUnits.join(', ') || 'Unit Multiple');

        const incoming = (inspectionData?.deficiencies || []).map((d: any) => {
          const context = resolveDeficiencyContext(d, currentArea, currentUnitValue, undefined, resolvedBuildingLabel);
          const building = firstValidLabel([
            d?.buildingInspectionId,
            d?.building,
            d?.buildingName,
            d?.buildingId,
            context.building,
            resolvedBuildingLabel,
          ]) || d?.building;

          return {
            ...d,
            _area: context.area,
            _unit: context.unit,
            building,
            buildingInspectionId: firstValidLabel([d?.buildingInspectionId, building, resolvedBuildingLabel]) || undefined,
            dedupeKey: buildDeficiencyDedupeKey(
              {
                ...d,
                _area: context.area,
                _unit: context.unit,
                building,
                buildingInspectionId: firstValidLabel([d?.buildingInspectionId, building, resolvedBuildingLabel]) || undefined,
              },
              currentArea,
              currentUnitValue,
              resolvedBuildingLabel
            ),
          };
        });

        const propertySavedDeficiencies = (propertySaved?.deficiencies && Array.isArray(propertySaved.deficiencies))
          ? propertySaved.deficiencies
          : [];
        const legacySavedDeficiencies = (legacySaved?.deficiencies && Array.isArray(legacySaved.deficiencies))
          ? legacySaved.deficiencies
          : [];
        const savedDeficiencies = mergeDeficiencyLists(
          propertySavedDeficiencies,
          legacySavedDeficiencies,
          currentArea,
          currentUnitValue,
          resolvedBuildingLabel
        );

        const remoteDeficiencies = (remoteProgress?.inspectionData?.deficiencies && Array.isArray(remoteProgress.inspectionData.deficiencies))
          ? remoteProgress.inspectionData.deficiencies
          : [];
        const legacyRemoteDeficiencies = (legacyRemoteProgress?.inspectionData?.deficiencies && Array.isArray(legacyRemoteProgress.inspectionData.deficiencies))
          ? legacyRemoteProgress.inspectionData.deficiencies
          : [];
        const mergedRemoteDeficiencies = mergeDeficiencyLists(
          remoteDeficiencies,
          legacyRemoteDeficiencies,
          currentArea,
          currentUnitValue,
          resolvedBuildingLabel
        );

        const mergedLocalRemote = mergeDeficiencyLists(
          mergedRemoteDeficiencies,
          savedDeficiencies,
          currentArea,
          currentUnitValue,
          resolvedBuildingLabel
        );
        const merged = mergeDeficiencyLists(
          mergedLocalRemote,
          incoming,
          currentArea,
          currentUnitValue,
          resolvedBuildingLabel
        );
        const scopedMerged = scopeDeficienciesToBuilding(
          merged,
          currentArea,
          currentUnitValue,
          resolvedBuildingLabel
        );

        if (scopedMerged.length > 0) {
          setMergedDeficiencies(scopedMerged);
        }
      } catch (e) {
        console.warn('Could not load saved inspection data:', e);
      }
    };
    loadAndMerge();
  }, [
    propertyId,
    buildingId,
    propertyDraftSaveKey,
    legacyBuildingDraftSaveKey,
    summaryDraftUnitId,
    summaryDraftInspectionType,
    legacySummaryDraftInspectionType,
  ]);

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

  const inspectionId = `697e0d82e115b966d90cc009`;
  const inspectionDate = new Date().toLocaleDateString();

  const isUnitContextInspection =
    ['unit', 'units'].includes(String(inspectionData?.location || '').toLowerCase()) ||
    mergedDeficiencies.some((d: any) => String(d?._area || '').toLowerCase() === 'unit' || (d?._unit && d._unit !== '-'));

  const inspectedUnitSet = new Set(
    mergedDeficiencies
      .map((d: any) => String(d?._unit || '').trim())
      .filter((u: string) => !!u && u !== '-' && u.toLowerCase() !== 'unit multiple')
  );

  const inspectedUnitsCount = isUnitContextInspection
    ? (inspectedUnitSet.size > 0 ? inspectedUnitSet.size : (routeCurrentUnit ? 1 : ((selectedUnits?.length || 0) === 1 ? 1 : null)))
    : null;

  const handleContinueInspection = async () => {
    if (continuingInspection) {
      showContinueToast('Please wait, opening your inspection…', 'info', 1200);
      return;
    }

    setContinuingInspection(true);
    showContinueToast('Saving progress and preparing inspection…', 'info', 0);

    const nextArea: string = inspectionData?.isOutsideInspection
      ? 'Outside'
      : (inspectionData?.location === 'Inside' ? 'Inside' : 'Units');
    const nextUnit = (nextArea === 'Inside' || nextArea === 'Outside')
      ? resolvedBuildingLabel
      : (selectedUnits.join(', ') || routeCurrentUnit || 'Unit Multiple');

    try {
      // Convert local image URIs to base64 so images survive navigation,
      // and stamp _area / _unit on each deficiency so they survive future merges
      const deficienciesWithImages = await Promise.all(
        mergedDeficiencies.map(async (defItem: any) => {
          // Keep existing _area if already stamped (from a previous session)
          const context = resolveDeficiencyContext(defItem, nextArea, nextUnit, undefined, resolvedBuildingLabel);
          const area = context.area;
          const unit = context.unit;
          const building = firstValidLabel([
            defItem?.buildingInspectionId,
            defItem?.building,
            defItem?.buildingName,
            defItem?.buildingId,
            context.building,
            resolvedBuildingLabel,
          ]) || defItem?.building;

          // If already base64 or a remote URL, keep as-is
          if (
            !defItem.imageUri ||
            defItem.imageUri.startsWith('data:') ||
            defItem.imageUri.startsWith('http')
          ) {
            return {
              ...defItem,
              _area: area,
              _unit: unit,
              building,
              buildingInspectionId: firstValidLabel([defItem?.buildingInspectionId, building, resolvedBuildingLabel]) || undefined,
              imageUri: defItem.imageUri || defItem.imageUrl || null,
            };
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
                  return {
                    ...defItem,
                    _area: area,
                    _unit: unit,
                    building,
                    buildingInspectionId: firstValidLabel([defItem?.buildingInspectionId, building, resolvedBuildingLabel]) || undefined,
                    imageUri: `data:image/jpeg;base64,${base64}`,
                  };
                }
              }
            } catch (imgErr) {
              console.warn('Could not encode image to base64:', imgErr);
            }
          }
          // Fall back to Cloudinary URL if local conversion fails
          return {
            ...defItem,
            _area: area,
            _unit: unit,
            building,
            buildingInspectionId: firstValidLabel([defItem?.buildingInspectionId, building, resolvedBuildingLabel]) || undefined,
            imageUri: defItem.imageUrl || null,
          };
        })
      );

      const dedupedForSave = mergeDeficiencyLists(
        [],
        deficienciesWithImages,
        nextArea,
        nextUnit,
        resolvedBuildingLabel
      );
      const scopedForSave = scopeDeficienciesToBuilding(
        dedupedForSave,
        nextArea,
        nextUnit,
        resolvedBuildingLabel
      );
      const savedAt = new Date().toISOString();

      await storeData(propertyDraftSaveKey, {
        deficiencies: scopedForSave,
        savedAt,
      });

      if (legacyBuildingDraftSaveKey !== propertyDraftSaveKey) {
        await removeData(legacyBuildingDraftSaveKey).catch(() => undefined);
      }

      await inspectionService.saveProgress({
        property_id: String(propertyId),
        unit_id: summaryDraftUnitId,
        inspection_type: summaryDraftInspectionType,
        inspectionData: {
          deficiencies: scopedForSave,
          property: {
            _id: propertyId,
            name: property?.name || 'Property',
          },
          buildingId: resolvedBuildingLabel,
          unit: nextUnit,
          inspectionType: 'Draft Inspection',
          savedAt,
        },
      });

      setMergedDeficiencies(scopedForSave);
      showContinueToast('Progress saved. Opening inspection…', 'success', 900);
    } catch (e) {
      console.warn('Could not save inspection data:', e);
      showContinueToast('Opening inspection. Progress sync will retry later.', 'error', 1800);
    } finally {
      setContinuingInspection(false);
    }

    // Go back to the specific location inspection screen to continue answering items
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location: nextArea,
      currentUnit: nextUnit,
    });
  };

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
    if (mergedDeficiencies.length > 0) {
      deficienciesHtml = mergedDeficiencies.map((def: any, index: number) => {
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

  // ── Shared helper: build the full reportData object from current state ─────
  const buildReportData = async () => {
    const deficienciesArray: any[] = [];
    const buildingName = resolvedBuildingLabel || 'Building';

    if (mergedDeficiencies.length > 0) {
      for (let i = 0; i < mergedDeficiencies.length; i++) {
        const defItem = mergedDeficiencies[i];
        const deficiency = defItem?.deficiency || {};

        // Convert local image to base64
        let imageBase64: string | null = null;
        const cloudinaryUrl = defItem.imageUrl || null;

        if (defItem.imageUri && Platform.OS !== 'web') {
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

        const finalImageUri = imageBase64 || cloudinaryUrl || null;
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
            ? buildingName
            : (selectedUnits.join(', ') || 'Unit Multiple'));
        const defUnitLabel = String(defUnit ?? '').trim();
        const defBuildingCandidates = [
          defItem.building,
          defItem.buildingName,
          defItem.buildingId,
          (inspectionArea === 'Inside' || inspectionArea === 'Outside') && looksLikeBuildingLabel(defUnitLabel)
            ? defUnitLabel
            : '',
        ];
        const defBuilding =
          defBuildingCandidates
            .map((candidate) => String(candidate ?? '').trim())
            .find((label) => {
              const normalized = label.toLowerCase().replace(/[\s_-]+/g, '');
              return !!label && !['-', 'allunits', 'allunit', 'unknown', 'property', 'building', 'unitmultiple'].includes(normalized);
            }) || '-';

        deficienciesArray.push({
          id: `${i + 1}`,
          deficiencyQRId: defItem.deficiencyQRId || `QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
          building: defBuilding,
          unit: defUnit,
          room: defItem.location || 'Multiple',
          area: inspectionArea,
          module: defItem.itemName || defItem.module || defItem.submodule || '',
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
        inspectionType: 'General INSPIRE' as const,
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
          dialogTitle: 'INSPIRE Inspection Report',
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
          a.download = `INSPIRE-Report-${reportData.metadata.inspectionNo}.html`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        Alert.alert('HTML Report Ready', 'Report opened in a new browser tab.');
      } else {
        // On native: save to a temp file and share
        const fileName = `INSPIRE-Report-${reportData.metadata.inspectionNo || Date.now()}.html`;
        const filePath = (FileSystem.cacheDirectory || '') + fileName;
        await FileSystem.writeAsStringAsync(filePath, htmlContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'text/html',
            dialogTitle: 'INSPIRE Inspection Report (HTML)',
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

      // Create workbook with report-clone layout
      const workbook = XLSX.utils.book_new();

      type DefGroupKey = 'Outside' | 'Inside' | 'Units' | 'GeneralComment';
      type GroupedDef = { def: any; isRepeat: boolean };

      const detailsSeen = new Map<string, number>();
      const repeatFlags = (reportData.deficiencies || []).map((def: any) => {
        const key = String(def?.deficiencyDetails || '').trim().toLowerCase();
        if (!key) return false;
        const count = detailsSeen.get(key) || 0;
        detailsSeen.set(key, count + 1);
        return count > 0;
      });

      const buildingsMap = new Map<string, Map<DefGroupKey, GroupedDef[]>>();

      (reportData.deficiencies || []).forEach((def: any, idx: number) => {
        const building = (def?.building && def.building !== '-') ? String(def.building) : 'Building';
        if (!buildingsMap.has(building)) {
          buildingsMap.set(building, new Map<DefGroupKey, GroupedDef[]>());
        }

        const isGeneralComment =
          !!def?.isGeneralComment ||
          String(def?.deficiencyName || '').trim().toLowerCase() === 'general comment';

        let key: DefGroupKey;
        if (isGeneralComment) {
          key = 'GeneralComment';
        } else {
          const area = String(def?.area || '').toLowerCase();
          if (area.includes('outside')) key = 'Outside';
          else if (area.includes('inside')) key = 'Inside';
          else key = 'Units';
        }

        const buildingGroups = buildingsMap.get(building)!;
        if (!buildingGroups.has(key)) {
          buildingGroups.set(key, []);
        }
        buildingGroups.get(key)!.push({
          def,
          isRepeat: !!def?.repeatIndicator || repeatFlags[idx],
        });
      });

      const orderedSections: DefGroupKey[] = ['Outside', 'Inside', 'Units', 'GeneralComment'];
      const sortedBuildings = Array.from(buildingsMap.keys()).sort((a, b) => a.localeCompare(b));

      const tableHeaders = [
        'Deficiency Details',
        'Code of Reference',
        'Deficiency Picture',
        'Deduction Pts.',
        'Repeat Indicator',
        'Severity',
        'Note',
      ];

      const reportCloneRows: any[][] = [];
      const merges: any[] = [];
      const totalColumns = tableHeaders.length;
      const sectionRowIndexes = new Set<number>();
      const headerRowIndexes = new Set<number>();
      const detailRowIndexes = new Set<number>();
      const statementRowIndexes = new Set<number>();
      const signatureRowIndexes = new Set<number>();
      const imageRowIndexes = new Set<number>();

      const pushMergedLabelRow = (label: string, kind: 'section' | 'statement' = 'section') => {
        const rowIndex = reportCloneRows.length;
        reportCloneRows.push([label, ...Array(totalColumns - 1).fill('')]);
        merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: totalColumns - 1 } });
        if (kind === 'statement') {
          statementRowIndexes.add(rowIndex);
        } else {
          sectionRowIndexes.add(rowIndex);
        }
      };

      const codeReferenceLabel = (def: any): string => {
        const nspireCode = String(def?.nspireCode || '').trim();
        const rawRef = typeof def?.codeReference === 'string'
          ? def.codeReference
          : (def?.codeReference?.text || def?.codeReference?.source || '');
        if (nspireCode && nspireCode !== '-') return nspireCode;
        return rawRef ? 'How to Inspect' : '-';
      };

      const imageCellValue = (def: any): any => {
        const imageUri = String(def?.imageUri || '').trim();
        if (!imageUri) return 'Photo not attached';
        if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
          const safeUrl = imageUri.replace(/"/g, '""');
          // Excel compatibility: show inline preview where IMAGE is supported,
          // and gracefully fall back to a clickable link where it is not.
          return { f: `IFERROR(_xlfn.IMAGE("${safeUrl}"),HYPERLINK("${safeUrl}","View Image"))` };
        }
        if (imageUri.startsWith('data:')) return 'Embedded photo attached';
        return 'Photo attached';
      };

      // Page heading row similar to report page layout
      const titleRowIndex = reportCloneRows.length;
      reportCloneRows.push([new Date().toLocaleString(), '', 'INSPIRE Report', '', '', '', '']);
      merges.push({ s: { r: 0, c: 2 }, e: { r: 0, c: 6 } });
      reportCloneRows.push([]);

      // Deficiency table header (matching page 2 structure)
      const deficiencyHeaderRowIndex = reportCloneRows.length;
      reportCloneRows.push(tableHeaders);
      headerRowIndexes.add(deficiencyHeaderRowIndex);

      if (sortedBuildings.length === 0) {
        pushMergedLabelRow('No inspectable data available.');
      } else {
        sortedBuildings.forEach((building) => {
          const buildingGroups = buildingsMap.get(building)!;

          orderedSections.forEach((sectionKey) => {
            const items = buildingGroups.get(sectionKey) || [];
            if (items.length === 0) return;

            const sectionLabel = sectionKey === 'GeneralComment'
              ? 'General Comment'
              : `${sectionKey} (Building - ${building})`;

            pushMergedLabelRow(sectionLabel);

            items.forEach(({ def, isRepeat }) => {
              const isGC = !!def?.isGeneralComment || String(def?.deficiencyName || '').toLowerCase() === 'general comment';
              const detailPrefix = isGC
                ? '-'
                : ((def?.deficiencyName && def.deficiencyName !== 'Deficiency' && def.deficiencyName !== 'General Comment')
                  ? `${def.deficiencyName}: `
                  : '');
              const detailText = isGC
                ? '-'
                : `${detailPrefix}${String(def?.deficiencyDetails || 'No details available')}`;

              const detailRowIndex = reportCloneRows.length;
              reportCloneRows.push([
                detailText,
                isGC ? '-' : codeReferenceLabel(def),
                imageCellValue(def),
                isGC ? '-' : (def?.deductionPts ?? '-'),
                isGC ? '-' : (isRepeat ? 'Repeat' : 'Not Repeat'),
                isGC ? '-' : (def?.severity || '-'),
                def?.note || def?.comments || '-',
              ]);
              detailRowIndexes.add(detailRowIndex);
              if (typeof def?.imageUri === 'string' && /^https?:\/\//i.test(def.imageUri.trim())) {
                imageRowIndexes.add(detailRowIndex);
              }
            });
          });
        });
      }

      reportCloneRows.push([]);

      // Certificates block (matching report)
      pushMergedLabelRow('Certificates');
      const certificateHeaderRowIndex = reportCloneRows.length;
      reportCloneRows.push(['Certificate Type', 'Status', 'Comment', '', '', '', '']);
      headerRowIndexes.add(certificateHeaderRowIndex);
      [
        ['Elevator', 'N/A', 'No elevator present'],
        ['Boiler', 'Current', 'Valid until 2026'],
        ['Lead-Based Paint', 'Current', 'Compliant'],
        ['Fire Alarm', 'Current', 'Tested monthly'],
        ['Sprinkler', 'N/A', 'Not required'],
      ].forEach((row) => {
        const certDataRowIndex = reportCloneRows.length;
        reportCloneRows.push([row[0], row[1], row[2], '', '', '', '']);
        detailRowIndexes.add(certDataRowIndex);
      });

      reportCloneRows.push([]);

      // Inspector Certification block
      pushMergedLabelRow('Inspector Certification');
      pushMergedLabelRow('I certify this inspection was conducted per INSPIRE standards.', 'statement');
      reportCloneRows.push([]);
      const signatureRowIndex = reportCloneRows.length;
      reportCloneRows.push([
        'Inspector Signature',
        reportData.metadata.inspectorName || 'Current User',
        '',
        '',
        '',
        'Date',
        reportData.metadata.startDate || inspectionDate,
      ]);
      signatureRowIndexes.add(signatureRowIndex);
      detailRowIndexes.add(signatureRowIndex);

      const reportCloneSheet = XLSX.utils.aoa_to_sheet(reportCloneRows);

      const palette = {
        blueBg: 'FF1F4E78',
        whiteBg: 'FFFFFFFF',
        whiteFont: 'FFFFFFFF',
        darkText: 'FF1F2937',
        border: 'FF9CA3AF',
      };

      const thinBorder = {
        top: { style: 'thin', color: { rgb: palette.border } },
        right: { style: 'thin', color: { rgb: palette.border } },
        bottom: { style: 'thin', color: { rgb: palette.border } },
        left: { style: 'thin', color: { rgb: palette.border } },
      };

      const bodyStyle: any = {
        font: { name: 'Calibri', sz: 11, color: { rgb: palette.darkText } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.whiteBg } },
        alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
        border: thinBorder,
      };

      const sectionStyle: any = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: palette.whiteFont } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.blueBg } },
        alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
        border: thinBorder,
      };

      const headerStyle: any = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: palette.whiteFont } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.blueBg } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: thinBorder,
      };

      const statementStyle: any = {
        font: { name: 'Calibri', sz: 11, italic: true, color: { rgb: palette.darkText } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.whiteBg } },
        alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
        border: thinBorder,
      };

      const titleDateStyle: any = {
        font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: palette.darkText } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.whiteBg } },
        alignment: { horizontal: 'left', vertical: 'center', wrapText: false },
        border: thinBorder,
      };

      const titleMainStyle: any = {
        font: { name: 'Calibri', sz: 14, bold: true, color: { rgb: palette.whiteFont } },
        fill: { patternType: 'solid', fgColor: { rgb: palette.blueBg } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
        border: thinBorder,
      };

      const applyRowStyle = (rowIndex: number, style: any) => {
        for (let col = 0; col < totalColumns; col++) {
          const address = XLSX.utils.encode_cell({ r: rowIndex, c: col });
          if (!reportCloneSheet[address]) {
            reportCloneSheet[address] = { t: 's', v: '' } as any;
          }
          (reportCloneSheet[address] as any).s = style;
        }
      };

      headerRowIndexes.forEach((rowIndex) => applyRowStyle(rowIndex, headerStyle));
      sectionRowIndexes.forEach((rowIndex) => applyRowStyle(rowIndex, sectionStyle));
      statementRowIndexes.forEach((rowIndex) => applyRowStyle(rowIndex, statementStyle));
      detailRowIndexes.forEach((rowIndex) => applyRowStyle(rowIndex, bodyStyle));
      signatureRowIndexes.forEach((rowIndex) => applyRowStyle(rowIndex, headerStyle));

      // Title row styling: left timestamp cell white, merged title block in blue.
      const timestampAddress = XLSX.utils.encode_cell({ r: titleRowIndex, c: 0 });
      if (reportCloneSheet[timestampAddress]) {
        (reportCloneSheet[timestampAddress] as any).s = titleDateStyle;
      }
      for (let col = 1; col < totalColumns; col++) {
        const address = XLSX.utils.encode_cell({ r: titleRowIndex, c: col });
        if (!reportCloneSheet[address]) {
          reportCloneSheet[address] = { t: 's', v: '' } as any;
        }
        (reportCloneSheet[address] as any).s = (col >= 2) ? titleMainStyle : titleDateStyle;
      }

      reportCloneSheet['!cols'] = [
        { wch: 45 }, // Deficiency Details
        { wch: 16 }, // Code of Reference
        { wch: 24 }, // Deficiency Picture
        { wch: 12 }, // Deduction
        { wch: 14 }, // Repeat
        { wch: 12 }, // Severity
        { wch: 30 }, // Note
      ];

      reportCloneSheet['!rows'] = reportCloneRows.map((_, idx) => {
        if (idx === titleRowIndex) return { hpt: 24 };
        if (headerRowIndexes.has(idx)) return { hpt: 22 };
        if (sectionRowIndexes.has(idx) || statementRowIndexes.has(idx)) return { hpt: 20 };
        if (imageRowIndexes.has(idx)) return { hpt: 90 };
        return { hpt: 18 };
      });

      reportCloneSheet['!autofilter'] = {
        ref: `${XLSX.utils.encode_cell({ r: deficiencyHeaderRowIndex, c: 0 })}:${XLSX.utils.encode_cell({ r: deficiencyHeaderRowIndex, c: totalColumns - 1 })}`,
      };

      reportCloneSheet['!merges'] = merges;

      XLSX.utils.book_append_sheet(workbook, reportCloneSheet, 'INSPIRE Report');

      const fileName = `INSPIRE-Report-${inspectionId}.xlsx`;

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
            dialogTitle: 'INSPIRE Inspection Report (Excel)',
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
            style={styles.htmlButton}
            onPress={handleExportHTML}
            disabled={exportingHTML}
          >
            {exportingHTML ? (
              <ActivityIndicator color="#0E7490" />
            ) : (
              <>
                <Ionicons name="code-slash-outline" size={20} color="#0E7490" />
                <Text style={styles.htmlButtonText}>Export HTML</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.excelButton}
            onPress={handleExportExcel}
            disabled={exportingExcel}
          >
            {exportingExcel ? (
              <ActivityIndicator color="#217346" />
            ) : (
              <>
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
            style={[styles.continueButton, continuingInspection && styles.continueButtonDisabled]}
            onPress={handleContinueInspection}
            disabled={continuingInspection}
          >
            {continuingInspection ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.continueButtonText}>Continuing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="arrow-forward-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.continueButtonText}>Continue Inspection</Text>
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

              {inspectedUnitsCount !== null && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Units Inspected:</Text>
                  <Text style={styles.detailValue}>{inspectedUnitsCount}</Text>
                </View>
              )}

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
                <View key={defItem.dedupeKey || defItem.deficiencyQRId || `${defItem.itemId || defItem.itemName || 'def'}-${index}`} style={[styles.deficiencyDetailCard, index > 0 && { marginTop: 16 }]}>
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

      {continueToast.visible && (
        <View
          style={[
            styles.continueToast,
            continueToast.type === 'success' && styles.continueToastSuccess,
            continueToast.type === 'error' && styles.continueToastError,
          ]}
        >
          {continuingInspection ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={(
                continueToast.type === 'error'
                  ? 'alert-circle-outline'
                  : continueToast.type === 'success'
                    ? 'checkmark-circle-outline'
                    : 'time-outline'
              ) as any}
              size={18}
              color="#FFFFFF"
            />
          )}
          <Text style={styles.continueToastText}>{continueToast.message}</Text>
        </View>
      )}

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
  continueButtonDisabled: {
    opacity: 0.72,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  continueToast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 20,
  },
  continueToastSuccess: {
    backgroundColor: '#15803D',
  },
  continueToastError: {
    backgroundColor: '#B91C1C',
  },
  continueToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
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
