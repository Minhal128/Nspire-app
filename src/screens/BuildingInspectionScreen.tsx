import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import offlineStorageService from '../services/offlineStorageService';
import { globalInspectionProgress } from '../utils/globalState';
import { generateNSPIREReport } from '../utils/nspireReportUtils';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS } from '../data/inspectionData';
import authService from '../services/authService';
import { inspectionService } from '../services/inspectionService';

type BuildingInspectionRouteProp = RouteProp<RootStackParamList, 'BuildingInspection'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BuildingInspection'>;

// Finding interface for NSPIRE report display
function getValidDetail(...args: any[]) {
  for (const a of args) {
    if (a && typeof a === 'string' && a.trim() !== '' && a.trim() !== '-') return a;
  }
  return 'No details recorded';
}

interface Finding {
  id: string;
  title?: string;
  deficiencyName: string;
  deficiencyDetails: string;
  severity: string;
  area: string;
  category: string;
  location: string;
  building: string;
  unit: string;
  imageUri?: string;
  nspireCode?: string;
  codeReference?: string;
  comments?: string;
  isGeneralComment?: boolean;
}

interface BuildingRow {
  buildingId: string;
  totalUnits: number;
  unitsForInspection: number;
}

interface BuildingProgressEntry {
  out: number;
  in: number;
  un: number;
  totalUnits: number;
  unitsForInspection: number;
  inspectedUnits: string[];
  modules: {
    Outside: { submodules: string[] };
    Inside: { submodules: string[] };
    Units: { submodules: string[] };
  };
}

export default function BuildingInspectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BuildingInspectionRouteProp>();
  const { property, calculatedUnits, selectedUnits, coverage } = route.params;

  const totalBuildings = property.buildings || 1;
  const totalUnits = property.units || 1;

  // Initialise editable building rows
  const initBuildings = useCallback((): BuildingRow[] => {
    const baseTotal = Math.floor(totalUnits / totalBuildings);
    const remainderTotal = totalUnits % totalBuildings;

    const baseInspection = Math.floor(calculatedUnits / totalBuildings);
    const remainderInspection = calculatedUnits % totalBuildings;

    const rows: BuildingRow[] = [];
    for (let i = 0; i < totalBuildings; i++) {
      rows.push({
        buildingId: `B${i + 1}`,
        totalUnits: baseTotal + (i < remainderTotal ? 1 : 0),
        unitsForInspection: baseInspection + (i < remainderInspection ? 1 : 0),
      });
    }
    return rows;
  }, [totalBuildings, totalUnits, calculatedUnits]);

  const [buildings, setBuildings] = useState<BuildingRow[]>(initBuildings);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFindings, setReportFindings] = useState<Finding[]>([]);
  const [inspectorName, setInspectorName] = useState('Inspector');
  const [previewHtml, setPreviewHtml] = useState<string>('');

  // Track which field is actively being edited so we skip auto-save mid-typing
  const editTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------- Building ID editing --------

  const handleBuildingIdChange = useCallback((index: number, newId: string) => {
    setBuildings(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], buildingId: newId };
      return copy;
    });
  }, []);

  // -------- Unit for Inspection editing with auto-redistribution --------

  /**
   * When the user changes "Unit for Inspection" for one building:
   * 1. Cap the value at `calculatedUnits` (total inspection units from coverage).
   * 2. Distribute the remaining inspection units proportionally across the OTHER buildings,
   *    ensuring every building gets at least 0 and the grand total equals `calculatedUnits`.
   */
  const handleInspectionUnitsChange = useCallback(
    (editedIndex: number, rawValue: string) => {
      const parsed = parseInt(rawValue) || 0;
      // Clamp between 0 and the total inspection units available
      const clamped = Math.max(0, Math.min(parsed, calculatedUnits));

      setBuildings(prev => {
        const copy = [...prev];
        const remaining = calculatedUnits - clamped;
        const otherIndices = copy
          .map((_, i) => i)
          .filter(i => i !== editedIndex);

        if (otherIndices.length === 0) {
          // Only one building
          copy[editedIndex] = { ...copy[editedIndex], unitsForInspection: calculatedUnits };
          return copy;
        }

        // Distribute remaining proportionally to existing ratios among others
        const otherCurrentTotal = otherIndices.reduce(
          (sum, i) => sum + copy[i].unitsForInspection,
          0,
        );

        let distributed = 0;
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) {
            // Last one gets whatever is left to avoid rounding errors
            copy[i] = { ...copy[i], unitsForInspection: remaining - distributed };
          } else {
            const ratio =
              otherCurrentTotal > 0
                ? copy[i].unitsForInspection / otherCurrentTotal
                : 1 / otherIndices.length;
            const share = Math.round(remaining * ratio);
            copy[i] = { ...copy[i], unitsForInspection: share };
            distributed += share;
          }
        });

        copy[editedIndex] = { ...copy[editedIndex], unitsForInspection: clamped };
        return copy;
      });
    },
    [calculatedUnits],
  );

  // Debounced wrapper so redistribution happens after a brief pause while typing
  const handleInspectionUnitsText = useCallback(
    (index: number, text: string) => {
      // Immediately update the edited cell's display value
      setBuildings(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], unitsForInspection: parseInt(text) || 0 };
        return copy;
      });

      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
      editTimeoutRef.current = setTimeout(() => {
        handleInspectionUnitsChange(index, text);
      }, 600);
    },
    [handleInspectionUnitsChange],
  );

  // On blur, force redistribution immediately
  const handleInspectionUnitsBlur = useCallback(
    (index: number) => {
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = null;
      }
      setBuildings(prev => {
        const current = prev[index].unitsForInspection;
        // Trigger redistribution through the change handler
        return prev; // will be overridden below
      });
      // Re-run change with current value to redistribute
      setBuildings(prev => {
        const clamped = Math.max(0, Math.min(prev[index].unitsForInspection, calculatedUnits));
        const remaining = calculatedUnits - clamped;
        const copy = [...prev];
        const otherIndices = copy.map((_, i) => i).filter(i => i !== index);

        if (otherIndices.length === 0) {
          copy[index] = { ...copy[index], unitsForInspection: calculatedUnits };
          return copy;
        }

        const otherCurrentTotal = otherIndices.reduce(
          (sum, i) => sum + copy[i].unitsForInspection,
          0,
        );

        let distributed = 0;
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) {
            copy[i] = { ...copy[i], unitsForInspection: remaining - distributed };
          } else {
            const ratio =
              otherCurrentTotal > 0
                ? copy[i].unitsForInspection / otherCurrentTotal
                : 1 / otherIndices.length;
            const share = Math.round(remaining * ratio);
            copy[i] = { ...copy[i], unitsForInspection: share };
            distributed += share;
          }
        });

        copy[index] = { ...copy[index], unitsForInspection: clamped };
        return copy;
      });
    },
    [calculatedUnits],
  );

  // -------- helpers --------

  const getCoverageLabel = () => {
    if (coverage === '100') return '100% - All Units';
    if (coverage === '50') return '50% - Half Units';
    return 'Random Sample';
  };

  const totalInspectionUnits = buildings.reduce((s, b) => s + b.unitsForInspection, 0);

  const handleStartInspectionForBuilding = (building: BuildingRow) => {
    if (building.unitsForInspection <= 0) {
      Alert.alert('No Units', 'This building has 0 inspection units assigned.');
      return;
    }

    const buildingUnits: string[] = [];
    for (let i = 1; i <= building.unitsForInspection; i++) {
      const unitNumber = String(i).padStart(3, '0');
      buildingUnits.push(`Unit ${unitNumber}`);
    }

    navigation.navigate('InspectionCategories' as any, {
      property: property,
      propertyId: String(property?._id || property?.id || property?.propertyId || ''),
      selectedUnits: buildingUnits,
      buildingId: building.buildingId,
    });
  };

  // Gather all inspection findings and show in modal
  const handleExportInProgress = async () => {
    try {
      setIsExporting(true);

      // Get current user
      const user = await authService.getCurrentUser();
      let inspector = 'Inspector';
      if (user && (user as any).firstName) {
        inspector = `${(user as any).firstName} ${(user as any).lastName || ''}`.trim();
      } else if (user && (user as any).fullName) {
        inspector = (user as any).fullName;
      } else if (user && user.email) {
        inspector = user.email.split('@')[0];
      }
      setInspectorName(inspector);

      // Get offline sessions for this property
      const sessions = await offlineStorageService.getAllSessions();
      const propertyIdStr = String(property._id || property.propertyId || property.id);

      type ProgressSectionToken = 'outside' | 'inside' | 'units';
      const normalizeBuildingToken = (value: unknown): string => String(value || '').trim().toLowerCase();
      const getSectionTokenFromInspectionType = (inspectionTypeValue: unknown): ProgressSectionToken | null => {
        const token = String(inspectionTypeValue || '').trim().toLowerCase();
        if (token.startsWith('outside')) return 'outside';
        if (token.startsWith('inside')) return 'inside';
        if (token.startsWith('unit')) return 'units';
        return null;
      };
      const looksLikeBuildingLabel = (value: unknown): boolean => {
        const label = String(value || '').trim();
        if (!label) return false;
        return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label);
      };
      const normalizeAreaFromFinding = (finding: any): 'Outside' | 'Inside' | 'Unit' | 'General' => {
        const token = String(
          finding?._area || finding?.area || finding?.category || finding?.inspectionType || ''
        )
          .trim()
          .toLowerCase()
          .replace(/[\s_-]+/g, '');

        if (token.includes('outside') || token.includes('site') || token.includes('exterior')) return 'Outside';
        if (token.includes('inside') || token.includes('interior') || token.includes('common')) return 'Inside';
        if (token.includes('unit')) return 'Unit';

        const unitCandidate = String(finding?.unit || finding?._unit || finding?.unitId || '').trim();
        if (unitCandidate && unitCandidate !== '-' && !looksLikeBuildingLabel(unitCandidate)) return 'Unit';

        return 'General';
      };
      const resolveBuildingFromFinding = (finding: any, fallbackBuilding = ''): string => {
        const areaValue = String(
          finding?._area || finding?.area || finding?.category || finding?.inspectionType || ''
        )
          .trim()
          .toLowerCase();
        const isInsideOutside = areaValue.includes('inside') || areaValue.includes('outside');

        const candidates = [
          finding?.buildingInspectionId,
          finding?.building_id,
          finding?.building,
          finding?.buildingName,
          finding?.buildingId,
          looksLikeBuildingLabel(finding?._unit) ? finding?._unit : '',
          isInsideOutside && looksLikeBuildingLabel(finding?.unit) ? finding?.unit : '',
          looksLikeBuildingLabel(fallbackBuilding) ? fallbackBuilding : '',
        ]
          .map((candidate) => String(candidate || '').trim())
          .filter(Boolean);

        return candidates[0] || '';
      };
      const remoteProgressSectionsByBuilding = new Map<string, Set<ProgressSectionToken>>();
      const markRemoteProgressSection = (buildingName: string, sectionToken: ProgressSectionToken) => {
        const buildingToken = normalizeBuildingToken(buildingName);
        if (!buildingToken) return;
        if (!remoteProgressSectionsByBuilding.has(buildingToken)) {
          remoteProgressSectionsByBuilding.set(buildingToken, new Set<ProgressSectionToken>());
        }
        remoteProgressSectionsByBuilding.get(buildingToken)!.add(sectionToken);
      };

      const propertySessions = sessions.filter(
        (s: any) => String(s.propertyId) === propertyIdStr
      );

      const outsideLookup: Record<string, string> = (OUTSIDE_ITEMS as any[]).reduce((acc: Record<string, string>, item: any) => {
        const key = String(item?.id || item?.itemId || item?.name || '').trim();
        const label = String(item?.name || item?.title || item?.label || key).trim();
        if (key) acc[key] = label;
        return acc;
      }, {});

      const insideLookup: Record<string, string> = (INSIDE_ITEMS as any[]).reduce((acc: Record<string, string>, item: any) => {
        const key = String(item?.id || item?.itemId || item?.name || '').trim();
        const label = String(item?.name || item?.title || item?.label || key).trim();
        if (key) acc[key] = label;
        return acc;
      }, {});

      const unitLookup: Record<string, string> = (UNIT_ITEMS as any[]).reduce((acc: Record<string, string>, item: any) => {
        const key = String(item?.id || item?.itemId || item?.name || '').trim();
        const label = String(item?.name || item?.title || item?.label || key).trim();
        if (key) acc[key] = label;
        return acc;
      }, {});

      const buildingProgressMap: Record<string, BuildingProgressEntry> = {};

      const ensureBuildingProgress = (buildingName: string): BuildingProgressEntry => {
        const key = String(buildingName || 'Building').trim() || 'Building';
        if (!buildingProgressMap[key]) {
          const matchingRow = buildings.find((b) => b.buildingId === key);
          buildingProgressMap[key] = {
            out: 0,
            in: 0,
            un: 0,
            totalUnits: matchingRow?.totalUnits || 0,
            unitsForInspection: matchingRow?.unitsForInspection || 0,
            inspectedUnits: [],
            modules: {
              Outside: { submodules: [] },
              Inside: { submodules: [] },
              Units: { submodules: [] },
            },
          };
        }
        return buildingProgressMap[key];
      };

      const pushUnique = (arr: string[], value: string) => {
        const safeValue = String(value || '').trim();
        if (!safeValue) return;
        if (!arr.includes(safeValue)) arr.push(safeValue);
      };

      buildings.forEach((b) => ensureBuildingProgress(b.buildingId));

      let allFindings: Finding[] = [];

      // Try to get remote progress
      try {
        const remoteProgress = await inspectionService.getAllProgress();

        if (remoteProgress && remoteProgress.success && remoteProgress.progress) {
          remoteProgress.progress.forEach((p: any) => {
            const pId = p.propertyId?._id || p.propertyId || 'unknown';
            const pIdStr = String(pId);

            if (pIdStr !== propertyIdStr) return;

            const inspectionType = String(p.inspectionType || '').trim();
            const inspectionTypeLower = inspectionType.toLowerCase();
            const isDraftOnly = inspectionTypeLower.startsWith('report_draft_');

            if (isDraftOnly) {
              const draftTypeMatch = inspectionType.match(/^REPORT_DRAFT_(.+)$/i);
              const draftTypeBuildingCandidate = draftTypeMatch ? String(draftTypeMatch[1] || '').trim() : '';
              const isPropertyWideDraft =
                inspectionTypeLower === 'report_draft_property' ||
                String(p?.unitId || '').trim().toLowerCase() === 'all_units';

              const draftFallbackBuilding = !isPropertyWideDraft
                ? [
                  p?.inspectionData?.buildingId,
                  p?.inspectionData?.buildingInspectionId,
                  p?.buildingName,
                  p?.unitId,
                  draftTypeBuildingCandidate,
                ]
                  .map((candidate) => String(candidate || '').trim())
                  .find((candidate) => looksLikeBuildingLabel(candidate)) || ''
                : '';

              let draftFindings: any[] = [];
              if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
                draftFindings = p.inspectionData.findings;
              } else if (p.inspectionData && Array.isArray(p.inspectionData.deficiencies)) {
                draftFindings = p.inspectionData.deficiencies;
              } else if (Array.isArray(p.findings)) {
                draftFindings = p.findings;
              }

              if (draftFindings.length > 0) {
                draftFindings.forEach((f: any) => {
                  const resolvedBuilding = resolveBuildingFromFinding(f, draftFallbackBuilding);
                  const resolvedArea = normalizeAreaFromFinding(f);

                  if (!resolvedBuilding || resolvedArea === 'General') {
                    return;
                  }

                  const normalizedUnitCandidate = String(f?.unit || f?._unit || f?.unitId || '').trim();
                  const normalizedUnit =
                    normalizedUnitCandidate && !/^b\d+$/i.test(normalizedUnitCandidate)
                      ? normalizedUnitCandidate
                      : '-';

                  allFindings.push({
                    ...f,
                    imageUri: f.imageUrl || f.imageUri || f?.photos?.[0]?.url || f?.deficiency?.imageUrl || f?.deficiency?.imageUri || '',
                    building: resolvedBuilding,
                    deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, f.detail, f?.deficiency?.detail, f.title, f?.deficiency?.title, f.name, f?.deficiency?.name, f.deficiencyName, f?.deficiency?.deficiencyName, 'Issue recorded'),
                    deficiencyName: f.deficiencyName || f?.deficiency?.name || f.title || f?.deficiency?.title || f.name || 'Deficiency',
                    codeReference: f.codeReference || f?.deficiency?.codeReference || f?.deficiency?.code || f.code || '',
                    nspireCode: f.nspireCode || f?.deficiency?.code || '-',
                    area: resolvedArea,
                    unit: normalizedUnit,
                  } as Finding);
                });
              }

              return;
            }

            const sectionToken = getSectionTokenFromInspectionType(inspectionTypeLower);

            const rawBuildingName =
              (p.unitId && p.unitId !== '-')
                ? String(p.unitId)
                : ((p.buildingName && p.buildingName !== '-') ? String(p.buildingName) : 'Building');
            const progressEntry = ensureBuildingProgress(rawBuildingName);

            const parsedUnitFromInspectionType = inspectionTypeLower.startsWith('unit_')
              ? inspectionType.split('_').slice(1).join('_').trim()
              : '';

            const responses = p.responses && typeof p.responses === 'object' ? p.responses : {};
            const answeredKeys = Object.keys(responses).filter((k) => {
              const value = responses[k];
              return value !== null && value !== undefined && String(value).trim() !== '';
            });

            if (answeredKeys.length > 0 && sectionToken) {
              markRemoteProgressSection(rawBuildingName, sectionToken);
            }

            if (inspectionTypeLower.startsWith('outside')) {
              answeredKeys.forEach((k) => pushUnique(progressEntry.modules.Outside.submodules, outsideLookup[k] || k));
            } else if (inspectionTypeLower.startsWith('inside')) {
              answeredKeys.forEach((k) => pushUnique(progressEntry.modules.Inside.submodules, insideLookup[k] || k));
            } else if (inspectionTypeLower.startsWith('unit')) {
              answeredKeys.forEach((k) => pushUnique(progressEntry.modules.Units.submodules, unitLookup[k] || k));

              if (parsedUnitFromInspectionType) pushUnique(progressEntry.inspectedUnits, parsedUnitFromInspectionType);
            }

            progressEntry.out = progressEntry.modules.Outside.submodules.length;
            progressEntry.in = progressEntry.modules.Inside.submodules.length;
            progressEntry.un = progressEntry.inspectedUnits.length;

            // Only include finding payloads from actively-answered inspection records.
            if (answeredKeys.length === 0) {
              return;
            }

            // Get findings from various possible structures
            let findings: any[] = [];
            if (p.inspectionData && Array.isArray(p.inspectionData.findings)) {
              findings = p.inspectionData.findings;
            } else if (p.inspectionData && Array.isArray(p.inspectionData.deficiencies)) {
              findings = p.inspectionData.deficiencies;
            } else if (Array.isArray(p.findings)) {
              findings = p.findings;
            }

            if (findings.length > 0) {
              const recordBuildingLabel = String(rawBuildingName || '').trim();

              const mappedFindings = findings
                .map((f: any) => {
                  const explicitFindingBuilding = [
                    f?.buildingInspectionId,
                    f?.building_id,
                    f?.building,
                    f?.buildingName,
                    f?.buildingId,
                    looksLikeBuildingLabel(f?._unit) ? f?._unit : '',
                    looksLikeBuildingLabel(f?.unit) ? f?.unit : '',
                  ]
                    .map((candidate) => String(candidate || '').trim())
                    .find((candidate) => !!candidate);

                  if (
                    explicitFindingBuilding &&
                    recordBuildingLabel &&
                    explicitFindingBuilding.toLowerCase() !== recordBuildingLabel.toLowerCase()
                  ) {
                    return null;
                  }

                  return {
                    ...f,
                    imageUri: f.imageUrl || f.imageUri || f?.photos?.[0]?.url || f?.deficiency?.imageUrl || f?.deficiency?.imageUri || '',
                    building: (p.buildingName && p.buildingName !== '-')
                      ? p.buildingName
                      : ((p.unitId && p.unitId !== '-') ? p.unitId : 'Building'),
                    deficiencyDetails: getValidDetail(f.deficiencyDetails, f.description, f.detail, f?.deficiency?.detail, f.title, f?.deficiency?.title, f.name, f?.deficiency?.name, f.deficiencyName, f?.deficiency?.deficiencyName, 'Issue recorded'),
                    deficiencyName: f.deficiencyName || f?.deficiency?.name || f.title || f?.deficiency?.title || f.name || 'Deficiency',
                    codeReference: f.codeReference || f?.deficiency?.codeReference || f?.deficiency?.code || f.code || '',
                    nspireCode: f.nspireCode || f?.deficiency?.code || '-',
                    // Strict section source of truth: use inspection_type from the record
                    // so nested/stale finding payload cannot move rows across sections.
                    area: inspectionTypeLower.startsWith('outside')
                      ? 'Outside'
                      : inspectionTypeLower.startsWith('inside')
                        ? 'Inside'
                        : inspectionTypeLower.startsWith('unit')
                          ? 'Unit'
                          : (f.area || f.category || p.inspectionType || 'General'),
                    unit: (() => {
                      const candidate = String(f.unit || f._unit || parsedUnitFromInspectionType || '').trim();
                      return candidate && !/^b\d+$/i.test(candidate) ? candidate : '-';
                    })(),
                  } as Finding;
                })
                .filter((item): item is Finding => !!item);

              allFindings.push(...mappedFindings);
            }
          });
        }
      } catch (err) {
        console.log("Could not fetch remote progress:", err);
      }

      // Process local sessions
      for (const session of propertySessions) {
        let bName = (session as any).buildingName || (session as any).buildingId || property?.name || 'Building';
        if (bName === '-') bName = 'Building';
        const sessionBuildingLabel = String(bName || '').trim();

        const sessionInspectionTypeRaw = String((session as any).inspectionType || '').trim();
        const sessionInspectionType = sessionInspectionTypeRaw.toLowerCase();
        const sessionSectionToken = getSectionTokenFromInspectionType(sessionInspectionType);
        const remoteSectionsForBuilding = remoteProgressSectionsByBuilding.get(normalizeBuildingToken(bName));

        // Avoid duplicate/stale section rehydration from local sessions when remote
        // already has started data for the same section.
        if (sessionSectionToken && remoteSectionsForBuilding?.has(sessionSectionToken)) {
          continue;
        }

        const progressEntry = ensureBuildingProgress(bName);
        const parsedUnitFromSessionType = sessionInspectionType.startsWith('unit_')
          ? sessionInspectionType.split('_').slice(1).join('_').trim()
          : '';

        if (sessionInspectionType.includes('outside')) {
          const keys = Array.isArray((session as any).responses) ? (session as any).responses : Object.keys((session as any).responses || {});
          keys.forEach((k: any) => pushUnique(progressEntry.modules.Outside.submodules, outsideLookup[String(k)] || String(k)));
          progressEntry.out = progressEntry.modules.Outside.submodules.length;
        } else if (sessionInspectionType.includes('inside')) {
          const keys = Array.isArray((session as any).responses) ? (session as any).responses : Object.keys((session as any).responses || {});
          keys.forEach((k: any) => pushUnique(progressEntry.modules.Inside.submodules, insideLookup[String(k)] || String(k)));
          progressEntry.in = progressEntry.modules.Inside.submodules.length;
        } else if (sessionInspectionType.includes('unit')) {
          const keys = Array.isArray((session as any).responses) ? (session as any).responses : Object.keys((session as any).responses || {});
          keys.forEach((k: any) => pushUnique(progressEntry.modules.Units.submodules, unitLookup[String(k)] || String(k)));
          const currentSessionUnit =
            (session as any).currentUnit
            || parsedUnitFromSessionType
            || (!/^b\d+$/i.test(String((session as any).unitId || '')) ? (session as any).unitId : '');
          if (currentSessionUnit) pushUnique(progressEntry.inspectedUnits, String(currentSessionUnit));
          progressEntry.un = progressEntry.inspectedUnits.length;
        }

        if (session.images && session.images.length > 0) {
          for (const img of session.images) {
            const hasFindings = img.findings && img.findings.length > 0;
            const itemsToProcess: any[] = (hasFindings ? img.findings : [{}]) as any[];

            for (const f of itemsToProcess) {
              let imageUri = f.imageUri || img.localUri || (img as any).uri || (f as any).imageUrl || '';

              // Convert local file to base64 for display
              if (imageUri && Platform.OS !== 'web' && !imageUri.startsWith('data:') && !imageUri.startsWith('http')) {
                try {
                  const fileInfo = await FileSystem.getInfoAsync(imageUri);
                  if (fileInfo.exists || imageUri.startsWith('content://') || imageUri.startsWith('file://')) {
                    try {
                      const base64 = await FileSystem.readAsStringAsync(imageUri, {
                        encoding: FileSystem.EncodingType.Base64,
                      });
                      if (base64 && base64.length > 100) {
                        const ext = imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
                        imageUri = `data:image/${ext};base64,${base64}`;
                      }
                    } catch (readErr) {
                      console.log('Direct local/base URI conversion failed:', readErr);
                    }
                  }
                } catch (err) {
                  console.log('Failed native conversion:', err);
                }
              }

              const cat = (f.category || img.roomCategory || (session as any).inspectionType || '').toLowerCase();
              let computedArea = 'General';
              if (sessionInspectionType.startsWith('outside')) {
                computedArea = 'Outside';
              } else if (sessionInspectionType.startsWith('inside')) {
                computedArea = 'Inside';
              } else if (sessionInspectionType.startsWith('unit')) {
                computedArea = 'Unit';
              } else if (cat.includes('outside')) {
                computedArea = 'Outside';
              } else if (cat.includes('unit')) {
                computedArea = 'Unit';
              } else if (cat.includes('inside')) {
                computedArea = 'Inside';
              }

              if (!hasFindings) {
                // Do not auto-create "General Comment" entries from blank image findings.
                // General comments should only appear when the user explicitly selected that option.
                continue;
              }

              const fData = (f as any).deficiency || f;
              const explicitFindingBuilding = [
                (f as any)?.buildingInspectionId,
                (f as any)?.building_id,
                (f as any)?.building,
                (f as any)?.buildingName,
                (f as any)?.buildingId,
                looksLikeBuildingLabel((f as any)?._unit) ? (f as any)?._unit : '',
                looksLikeBuildingLabel((f as any)?.unit) ? (f as any)?.unit : '',
              ]
                .map((candidate) => String(candidate || '').trim())
                .find((candidate) => !!candidate);

              if (
                explicitFindingBuilding &&
                sessionBuildingLabel &&
                explicitFindingBuilding.toLowerCase() !== sessionBuildingLabel.toLowerCase()
              ) {
                continue;
              }

              // Ensure deficiencyDetails has actual text from any available field
              const detailText = f.deficiencyDetails || f.detail || fData?.detail || f.description || fData?.description || fData?.name || fData?.title || '';
              allFindings.push({
                id: f.id || `F-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                title: f.title || fData.name || fData.title || 'Deficiency',
                deficiencyName: f.deficiencyName || fData?.deficiencyName || fData?.name || fData?.title || f.title || f.name || 'Deficiency',
                deficiencyDetails: detailText || 'Issue recorded',
                severity: f.severity || fData.severity || fData.aiSeverity || 'Moderate',
                area: computedArea,
                category: computedArea,
                location: f.location || img.room || img.roomCategory || (session as any).inspectionType || 'General',
                building: bName,
                unit: (() => {
                  const candidate = String(f.unit || f._unit || (session as any).currentUnit || parsedUnitFromSessionType || '').trim();
                  return candidate && !/^b\d+$/i.test(candidate) ? candidate : '-';
                })(),
                imageUri: fData?.imageUrl || imageUri || fData?.imageUri || '',
                nspireCode: f.nspireCode || fData.code || '-',
                codeReference: f.codeReference || fData.codeReference || '',
                comments: (f as any).note || fData.aiAnalysis || (f as any).recommendedAction || '',
              });
            }
          }
        }
      }

      // Add OD responses from globalInspectionProgress that don't have detailed findings
      // This ensures items marked as "ALL OD" (without photos) appear in the report
      // NOTE: Disabled per client request to exclude ALL/OD-only entries from reports.
      /*
      const createODFinding = (itemId: string, itemName: string, areaType: string, bName: string, unitNum: string = '-'): Finding => ({
        id: `OD-${areaType}-${itemId}-${Date.now()}`,
        title: itemName,
        deficiencyName: itemName,
        deficiencyDetails: 'Marked as Operational Deficiency',
        severity: 'Low',
        area: areaType,
        category: areaType,
        location: areaType,
        building: bName,
        unit: unitNum,
        imageUri: '',
        nspireCode: 'OD-MARKED',
        codeReference: '',
        comments: '',
      });

      // Check globalInspectionProgress for OD responses across all buildings
      buildings.forEach((b) => {
        const bName = b.buildingId;
        
        // Check Outside items
        const outsideKey = `inspection_responses_${propertyIdStr}_${bName}_Outside`;
        const outsideResponses = globalInspectionProgress[outsideKey];
        if (outsideResponses && typeof outsideResponses === 'object') {
          Object.entries(outsideResponses).forEach(([itemId, response]) => {
            if (response === 'OD') {
              const item = OUTSIDE_ITEMS.find(i => String(i.id) === String(itemId));
              const itemName = item?.name || `Item ${itemId}`;
              // Check if finding already exists
              const exists = allFindings.some(f => 
                f.deficiencyName === itemName && f.area === 'Outside' && f.building === bName
              );
              if (!exists) {
                allFindings.push(createODFinding(itemId, itemName, 'Outside', bName));
              }
            }
          });
        }
        
        // Check Inside items
        const insideKey = `inspection_responses_${propertyIdStr}_${bName}_Inside`;
        const insideResponses = globalInspectionProgress[insideKey];
        if (insideResponses && typeof insideResponses === 'object') {
          Object.entries(insideResponses).forEach(([itemId, response]) => {
            if (response === 'OD') {
              const item = INSIDE_ITEMS.find(i => String(i.id) === String(itemId));
              const itemName = item?.name || `Item ${itemId}`;
              const exists = allFindings.some(f => 
                f.deficiencyName === itemName && f.area === 'Inside' && f.building === bName
              );
              if (!exists) {
                allFindings.push(createODFinding(itemId, itemName, 'Inside', bName));
              }
            }
          });
        }
        
        // Check Unit items for each selected unit
        (selectedUnits || []).forEach((unit: string) => {
          const unitKey = `inspection_responses_${propertyIdStr}_${bName}_Unit_${unit}`;
          const unitResponses = globalInspectionProgress[unitKey];
          if (unitResponses && typeof unitResponses === 'object') {
            Object.entries(unitResponses).forEach(([itemId, response]) => {
              if (response === 'OD') {
                const item = UNIT_ITEMS.find(i => String(i.id) === String(itemId));
                const itemName = item?.name || `Item ${itemId}`;
                const exists = allFindings.some(f => 
                  f.deficiencyName === itemName && f.area === 'Units' && f.building === bName && f.unit === unit
                );
                if (!exists) {
                  allFindings.push(createODFinding(itemId, itemName, 'Units', bName, unit));
                }
              }
            });
          }
        });
      });
      */

      const normalizeFindingToken = (value: unknown): string => String(value ?? '').trim().toLowerCase();
      const dedupedFindings = new Map<string, Finding>();

      allFindings.forEach((finding) => {
        const key = [
          normalizeFindingToken(finding.building),
          normalizeFindingToken(finding.area),
          normalizeFindingToken(finding.unit),
          normalizeFindingToken(finding.deficiencyName),
          normalizeFindingToken(finding.deficiencyDetails),
          normalizeFindingToken(finding.nspireCode),
          normalizeFindingToken(finding.imageUri),
        ].join('|');

        if (!dedupedFindings.has(key)) {
          dedupedFindings.set(key, finding);
        }
      });

      allFindings = Array.from(dedupedFindings.values());

      console.log(`[BuildingInspection] Total findings collected: ${allFindings.length}`);

      setReportFindings(allFindings);

      const reportData = {
        property: property,
        inspectorName: inspector,
        date: new Date().toISOString(),
        findings: allFindings,
        status: 'in-progress',
        buildingName: (property?.name && property?.name !== '-') ? property.name : 'Building',
        selectedUnits: selectedUnits || [],
        progressData: {
          outsideProgress: Object.values(buildingProgressMap).reduce((sum, b) => sum + Number(b.out || 0), 0),
          insideProgress: Object.values(buildingProgressMap).reduce((sum, b) => sum + Number(b.in || 0), 0),
          unitProgress: Object.values(buildingProgressMap).reduce((sum, b) => sum + Number(b.un || 0), 0),
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: UNIT_ITEMS.length,
          buildingRows: buildings.map((b) => ({
            buildingId: b.buildingId,
            totalUnits: b.totalUnits,
            unitsForInspection: b.unitsForInspection,
          })),
          buildingProgressMap,
        }
      };

      const nspireReport = generateNSPIREReport(reportData as any);
      nspireReport.metadata.inspectorName = inspector;
      nspireReport.metadata.inspectionNo = "INSP-" + Date.now().toString(36).toUpperCase();

      const html = enhancedNspirePDFService.generateEnhancedHTMLPreview(nspireReport as any, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      } as any);

      setPreviewHtml(html);
      setShowReportModal(true);
    } catch (err: any) {
      console.error('Failed to load inspection data:', err);
      Alert.alert('Error', `Failed to load inspection data: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate and share PDF
  const handleGeneratePDF = async () => {
    try {
      setIsExporting(true);

      const reportData = {
        property: property,
        inspectorName: inspectorName,
        date: new Date().toISOString(),
        findings: reportFindings,
        status: 'in-progress',
        buildingName: (property?.name && property?.name !== '-') ? property.name : 'Building',
        selectedUnits: selectedUnits || [],
        progressData: {
          outsideProgress: 0,
          insideProgress: 0,
          unitProgress: 0,
          outsideTotal: OUTSIDE_ITEMS.length,
          insideTotal: INSIDE_ITEMS.length,
          unitTotal: UNIT_ITEMS.length,
          buildingRows: buildings.map((b) => ({
            buildingId: b.buildingId,
            totalUnits: b.totalUnits,
            unitsForInspection: b.unitsForInspection,
          })),
          buildingProgressMap: {}
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
      console.error('Failed to generate PDF:', err);
      Alert.alert('Error', `Failed to generate PDF: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Property Info Banner */}
          <View style={styles.propertyInfoBanner}>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>Property ID:</Text>
              <Text style={styles.infoValue}>{property.propertyId || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>Zip:</Text>
              <Text style={styles.infoValue}>{property.zipCode || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>No. of Building:</Text>
              <Text style={styles.infoValue}>{totalBuildings}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>Property Name:</Text>
              <Text style={styles.infoValue}>{property.name || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>City:</Text>
              <Text style={styles.infoValue}>{property.city || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>State:</Text>
              <Text style={styles.infoValue}>{property.state || property.stateName || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{property.address || '-'}</Text>
            </View>
            <View style={styles.infoPair}>
              <Text style={styles.infoLabel}>Selection:</Text>
              <Text style={styles.infoValue}>{getCoverageLabel()} ({calculatedUnits} units)</Text>
            </View>
          </View>

          {/* Building Table */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Building</Text>
            <Text style={styles.unitsBadge}>
              {totalInspectionUnits} / {calculatedUnits} units assigned
            </Text>
          </View>

          {totalInspectionUnits !== calculatedUnits && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={16} color="#92400E" />
              <Text style={styles.warningText}>
                Total inspection units ({totalInspectionUnits}) ≠ required ({calculatedUnits}). Adjust to match.
              </Text>
            </View>
          )}

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colBuildingId]}>Building Unique ID</Text>
            <Text style={[styles.tableHeaderText, styles.colTotalUnits]}>Total Units</Text>
            <Text style={[styles.tableHeaderText, styles.colInspectionUnits]}>Unit for Inspection</Text>
            <Text style={[styles.tableHeaderText, styles.colAction]}></Text>
          </View>

          {/* Table Rows */}
          {buildings.map((building, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
            >
              {/* Editable Building ID */}
              <View style={styles.colBuildingId}>
                <TextInput
                  style={styles.editableCell}
                  value={building.buildingId}
                  onChangeText={(text) => handleBuildingIdChange(index, text)}
                  placeholder="ID"
                  placeholderTextColor="#9CA3AF"
                  selectTextOnFocus
                />
              </View>

              {/* Total Units (read-only) */}
              <Text style={[styles.tableCell, styles.colTotalUnits]}>{building.totalUnits}</Text>

              {/* Editable Units for Inspection */}
              <View style={styles.colInspectionUnits}>
                <TextInput
                  style={[
                    styles.editableCell,
                    styles.editableCellNumber,
                    building.unitsForInspection < 0 && styles.editableCellError,
                  ]}
                  value={String(building.unitsForInspection)}
                  onChangeText={(text) => handleInspectionUnitsText(index, text)}
                  onBlur={() => handleInspectionUnitsBlur(index)}
                  keyboardType="number-pad"
                  maxLength={5}
                  selectTextOnFocus
                />
              </View>

              <View style={styles.colAction}>
                <TouchableOpacity
                  style={[
                    styles.startInspectionBtn,
                    building.unitsForInspection <= 0 && styles.startInspectionBtnDisabled,
                  ]}
                  onPress={() => handleStartInspectionForBuilding(building)}
                  disabled={building.unitsForInspection <= 0}
                >
                  <Text style={styles.startInspectionBtnText}>Start Inspection</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Export In Progress Button */}
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportInProgress}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>Export In Progress</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* NSPIRE Report Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReportModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowReportModal(false)}>
              <Ionicons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>NSPIRE Report</Text>
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={handleGeneratePDF}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.pdfButtonText}>PDF</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Report Content */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <WebView
              source={{ html: previewHtml }}
              style={{ flex: 1 }}
              originWhitelist={['*']}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              allowFileAccess={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode="always"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Property Info Banner
  propertyInfoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoPair: {
    width: '48%',
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  // Section
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  unitsBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 4,
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '500',
  },
  colBuildingId: {
    flex: 2,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colTotalUnits: {
    flex: 1.2,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colInspectionUnits: {
    flex: 1.5,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colAction: {
    flex: 2.5,
    alignItems: 'center',
    paddingLeft: 8,
  },
  startInspectionBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 110,
    alignItems: 'center',
  },
  startInspectionBtnDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.7,
  },
  startInspectionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Editable cells
  editableCell: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1E9FF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    minHeight: 36,
  },
  editableCellNumber: {
    color: '#0E7490',
    fontWeight: '700',
  },
  editableCellError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  // Export Button
  exportButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  pdfButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
