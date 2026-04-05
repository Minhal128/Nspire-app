import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';
import IOSPickerModal from '../components/IOSPickerModal';
import { inspectionService, propertyService, authService } from '../services';
import { Inspection, Property } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { globalInspectionProgress } from '../utils/globalState';
import { buildInspectionProgressKey } from '../utils/inspectionProgressUtils';
import { generateNSPIREReport } from '../utils/nspireReportUtils';
import { buildInProgressReportHtml } from '../utils/reportPreviewUtils';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';
import { progressSocketService } from '../services/progressSocketService';
import { useReportPreview } from '../contexts/ReportPreviewContext';

// Status options for picker
const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

// Date range options for picker
const DATE_RANGE_OPTIONS = [
  { label: 'All Time', value: '' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
];

interface ReportsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

interface Report {
  id: string;
  property: string;
  propertyId: string;
  unit: string;
  inspector: string;
  date: string;
  complianceScore: 'Paid' | 'Unpaid';
  inspectionType: string;
  totalDeficiencies: number;
  criticalDeficiencies: number;
  notes: string;
  rawData: Inspection;
  sourceInspectionIds?: string[];
  sourceLocalDraftKeys?: string[];
  sourceBackendDraftRefs?: Array<{
    propertyId: string;
    unitId: string;
    inspectionType: string;
  }>;
  draftMeta?: {
    source: 'local' | 'backend';
    key?: string;
    propertyId?: string;
    unitId?: string;
    inspectionType?: string;
  };
}

export default function ReportsScreen({ navigation, onMenuPress }: ReportsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<any>(null);
  const { openReportPreview } = useReportPreview();
  const socketRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // iOS Picker Modal visibility states
  const [propertyPickerVisible, setPropertyPickerVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);

  // Get property options for picker
  const getPropertyOptions = () => {
    const options = [{ label: 'All Properties', value: '' }];
    properties.forEach(p => {
      options.push({ label: p.name, value: p._id });
    });
    return options;
  };

  const loadData = useCallback(async () => {
    try {
      // Load user data
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);

      let inspectionsData: any = { inspections: [] };
      let propertiesData: any = { properties: [] };
      let allProgressRecords: any[] = [];

      // Try to load inspections - handle errors gracefully
      try {
        inspectionsData = await inspectionService.getInspections({ status: 'completed' });
      } catch (inspErr) {
        console.log('Could not load inspections:', inspErr);
        // Continue with empty inspections
      }

      // Try to load properties - handle errors gracefully
      try {
        propertiesData = await propertyService.getProperties();
      } catch (propErr) {
        console.log('Could not load properties:', propErr);
        // Continue with empty properties
      }

      console.log('Reports - Loaded inspections:', (inspectionsData.inspections || []).length);

      const normalizeUnitToken = (value: unknown): string => {
        return String(value ?? '')
          .trim()
          .toLowerCase()
          .replace(/[\s_-]+/g, '');
      };

      const isPlaceholderUnitLabel = (label: string): boolean => {
        const token = normalizeUnitToken(label);
        return !token || token === '-' || token === 'unknown' || token === 'allunits' || token === 'allunit' || token === 'property';
      };

      const normalizeUnitLabel = (unitValue: unknown): string => {
        if (unitValue && typeof unitValue === 'object') {
          const unitObject = unitValue as any;
          return normalizeUnitLabel(unitObject?.unitNumber || unitObject?.unitId || unitObject?.name || '');
        }

        const stringUnit = String(unitValue ?? '').trim();
        if (isPlaceholderUnitLabel(stringUnit)) {
          return 'All Units';
        }

        return stringUnit;
      };

      const looksLikeBuildingLabel = (value: unknown): boolean => {
        const label = String(value ?? '').trim();
        if (!label) {
          return false;
        }

        return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label);
      };

      const canonicalizeBuildingLabel = (value: unknown): string => {
        const label = String(value ?? '').trim();
        if (!label) {
          return '';
        }

        const compactLabel = label.replace(/[\s_-]+/g, '');
        const bMatch = compactLabel.match(/^b(\d+)$/i);
        if (bMatch) {
          return `B${bMatch[1]}`;
        }

        const buildingMatch = compactLabel.match(/^building(\d+)$/i);
        if (buildingMatch) {
          return `B${buildingMatch[1]}`;
        }

        return label;
      };

      const looksLikeUnitLabel = (value: unknown): boolean => {
        const label = String(value ?? '').trim().toLowerCase();
        return label.startsWith('unit ') || label.startsWith('unit-') || label.startsWith('unit_');
      };

      const normalizeBuildingCandidate = (value: unknown): string => {
        const label = normalizeUnitLabel(value);
        if (!label || isPlaceholderUnitLabel(label) || looksLikeUnitLabel(label) || !looksLikeBuildingLabel(label)) {
          return '';
        }
        return canonicalizeBuildingLabel(label);
      };

      const parseBuildingCandidatesFromUnitLabel = (value: unknown): string[] => {
        return String(value ?? '')
          .split(',')
          .map((chunk) => chunk.trim())
          .flatMap((chunk) => chunk.split('/').map((part) => part.trim()))
          .map((candidate) => normalizeUnitLabel(candidate))
          .filter((candidate) => !isPlaceholderUnitLabel(candidate) && looksLikeBuildingLabel(candidate))
          .map((candidate) => canonicalizeBuildingLabel(candidate));
      };

      const mergeUniqueStringArrays = (values: string[]): string[] => {
        return Array.from(new Set(values.filter((value) => Boolean(value && value.trim()))));
      };

      const extractUnitFromInspectionType = (inspectionTypeValue: unknown): string => {
        const inspectionType = String(inspectionTypeValue ?? '').trim();
        if (!inspectionType) {
          return '';
        }

        const draftMatch = inspectionType.match(/^REPORT_DRAFT_(.+)$/i);
        if (!draftMatch) {
          return '';
        }

        const candidate = normalizeUnitLabel(draftMatch[1]);
        return isPlaceholderUnitLabel(candidate) ? '' : candidate;
      };

      const buildMergedUnitLabel = (unitCandidates: unknown[]): string => {
        const normalizedCandidates = unitCandidates
          .map((candidate) => normalizeUnitLabel(candidate))
          .filter(Boolean);
        const uniqueCandidates = mergeUniqueStringArrays(normalizedCandidates);
        const specificUnits = uniqueCandidates.filter((label) => !isPlaceholderUnitLabel(label));

        if (specificUnits.length > 0) {
          return specificUnits.join(', ');
        }

        return uniqueCandidates[0] || 'All Units';
      };

      const buildMergedBuildingLabel = (buildingCandidates: unknown[]): string => {
        const normalizedCandidates = buildingCandidates
          .flatMap((candidate) => {
            return [
              normalizeBuildingCandidate(candidate),
              ...parseBuildingCandidatesFromUnitLabel(candidate),
            ];
          })
          .filter(Boolean) as string[];

        const uniqueCandidates = Array.from(
          normalizedCandidates.reduce((deduped, candidate) => {
            const key = normalizeUnitToken(candidate);
            if (!deduped.has(key)) {
              deduped.set(key, candidate);
            }
            return deduped;
          }, new Map<string, string>()).values()
        );

        return uniqueCandidates.length > 0 ? uniqueCandidates.join(', ') : '-';
      };

      const normalizeNoteForMerge = (noteValue: unknown): string => {
        const note = String(noteValue ?? '').trim();
        if (!note) {
          return '';
        }

        const lowered = note.toLowerCase();
        if (lowered === 'draft from local storage' || lowered === 'draft synced to cloud' || lowered === 'no notes available.') {
          return '';
        }

        return note;
      };

      const propertyBuildingCandidatesMap = new Map<string, string[]>();

      const addPropertyBuildingCandidate = (propertyIdValue: unknown, buildingValue: unknown) => {
        const propertyToken = String(propertyIdValue ?? '').trim();
        if (!propertyToken || ['unknown', 'null', 'undefined'].includes(propertyToken.toLowerCase())) {
          return;
        }

        const normalizedBuilding = normalizeBuildingCandidate(buildingValue);
        if (!normalizedBuilding) {
          return;
        }

        const existing = propertyBuildingCandidatesMap.get(propertyToken) || [];
        propertyBuildingCandidatesMap.set(
          propertyToken,
          mergeUniqueStringArrays([...existing, normalizedBuilding])
        );
      };

      const hydratePropertyBuildingsFromGlobalProgress = () => {
        Object.entries(globalInspectionProgress || {}).forEach(([key, value]) => {
          if (!key.startsWith('inspection_responses_')) {
            return;
          }

          if (!value || typeof value !== 'object' || Object.keys(value).length === 0) {
            return;
          }

          const keyMatch = key.match(/^inspection_responses_([^_]+)_([^_]+)_.+$/);
          if (!keyMatch) {
            return;
          }

          const [, propertyToken, buildingToken] = keyMatch;
          addPropertyBuildingCandidate(propertyToken, buildingToken);
        });
      };

      hydratePropertyBuildingsFromGlobalProgress();

      // Map inspections to report format
      const mappedReports: Report[] = (inspectionsData.inspections || inspectionsData || []).map((inspection: Inspection) => {
        // Debug log each inspection
        console.log('Mapping inspection:', JSON.stringify({
          id: inspection._id,
          findings: (inspection as any).findings?.length || 0,
          deficiencies: (inspection as any).deficiencies?.length || 0,
          notes: (inspection as any).notes,
          inspectionType: (inspection as any).inspectionType,
        }));

        // Handle property as either populated object or string ID
        const propertyId = typeof inspection.property === 'object'
          ? (inspection.property as any)?._id
          : inspection.property;

        const property = (propertiesData.properties || propertiesData || []).find(
          (p: Property) => p._id === propertyId
        );

        // Get compliance score - check complianceScore field first
        const score = (inspection as any).complianceScore || (inspection as any).score || 0;
        const isCompliant = (inspection as any).result === 'compliant' || (inspection as any).complianceStatus === 'compliant' || score >= 70;

        // Get findings/deficiencies data
        const findings = (inspection as any).findings || (inspection as any).deficiencies || [];
        const totalDeficiencies = findings.length;
        const criticalDeficiencies = findings.filter((f: any) =>
          f.severity === 'critical' || f.severity === 'life-threatening' || f.severity === 'severe'
        ).length;

        const inspectionUnitValue = typeof (inspection as any).unit === 'object'
          ? ((inspection as any).unit?.unitNumber || (inspection as any).unit?.unitId || (inspection as any).unit?.name || '')
          : (inspection as any).unit;
        const inspectionTypeUnit = extractUnitFromInspectionType((inspection as any).inspectionType);

        return {
          id: inspection._id,
          property: typeof inspection.property === 'object'
            ? (inspection.property as any)?.name
            : (property?.name || 'Unknown Property'),
          propertyId: propertyId || '',
          unit: buildMergedBuildingLabel([
            (inspection as any)?.buildingInspectionId,
            (inspection as any)?.buildingName,
            (inspection as any)?.buildingId,
            inspectionUnitValue,
            inspectionTypeUnit,
          ]),
          inspector: (inspection as any).inspector?.fullName || (inspection as any).inspectorName || storedUser?.fullName || 'Unknown',
          date: new Date(inspection.completedDate || inspection.scheduledDate || (inspection as any).createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          complianceScore: isCompliant ? 'Paid' : 'Unpaid',
          inspectionType: (inspection as any).inspectionType || 'INSPIRE Inspection',
          totalDeficiencies,
          criticalDeficiencies,
          notes: normalizeNoteForMerge((inspection as any).notes),
          rawData: inspection,
        };
      });

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

            const keyParts = key.replace('saved_inspection_', '').split('_');
            const extractedPropertyId = keyParts[0];
            const extractedUnitId = keyParts.length > 1 ? keyParts.slice(1).join('_') : '';
            const normalizedExtractedPropertyId =
              extractedPropertyId &&
                !['unknown', 'null', 'undefined'].includes(extractedPropertyId.trim().toLowerCase())
                ? extractedPropertyId
                : '';

            const foundProp = (propertiesData.properties || propertiesData || []).find((p: any) => p._id === extractedPropertyId || p.id === extractedPropertyId);
            const resolvedPropName = foundProp?.name || draftData.property?.name || 'Local Draft';
            const resolvedPropertyId = normalizedExtractedPropertyId || draftData.property?._id || foundProp?._id || '';

            const localDraftTypeUnit = extractUnitFromInspectionType(draftData.inspectionType || draftData?.inspectionData?.inspectionType);

            mappedReports.push({
              id: draftData._id || 'draft_' + key,
              property: resolvedPropName,
              propertyId: resolvedPropertyId,
              unit: buildMergedBuildingLabel([
                draftData.buildingInspectionId,
                draftData.building,
                draftData.buildingName,
                draftData.unit,
                extractedUnitId,
                localDraftTypeUnit,
              ]),
              inspector: storedUser?.fullName || 'Draft Inspector',
              date: new Date(draftData.updatedAt || draftData.createdAt || draftData.savedAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }) + ' (Draft)',
              complianceScore: 'Unpaid',
              inspectionType: draftData.inspectionType || 'Draft Inspection',
              totalDeficiencies: dTotalDef,
              criticalDeficiencies: dCritDef,
              notes: normalizeNoteForMerge(draftData.notes || draftData?.inspectionData?.notes),
              rawData: { ...draftData, property: foundProp || draftData.property || { _id: extractedPropertyId, name: resolvedPropName } },
              draftMeta: {
                source: 'local',
                key,
              },
            });
          }
        }
      } catch (storageErr) {
        console.log('Error loading local drafts:', storageErr);
      }

      // Add DB-synced drafts from inspection progress (tied to logged-in user)
      try {
        const progressRes = await inspectionService.getAllProgress({ timeoutMs: 20000 });
        allProgressRecords = Array.isArray(progressRes?.progress) ? progressRes.progress : [];

        allProgressRecords.forEach((progressItem: any) => {
          const progressPropertyId = String(
            progressItem?.propertyId?._id ||
            progressItem?.propertyId ||
            progressItem?.inspectionData?.property?._id ||
            ''
          ).trim();

          if (!progressPropertyId) {
            return;
          }

          [
            progressItem?.buildingId,
            progressItem?.inspectionData?.buildingId,
            progressItem?.inspectionData?.building,
            progressItem?.inspectionData?.buildingName,
            progressItem?.unitId,
            extractUnitFromInspectionType(progressItem?.inspectionType),
            extractUnitFromInspectionType(progressItem?.inspectionData?.inspectionType),
          ].forEach((buildingCandidate) => {
            addPropertyBuildingCandidate(progressPropertyId, buildingCandidate);
          });
        });

        const backendDrafts = (progressRes?.progress || []).filter((p: any) =>
          String(p?.inspectionType || '').startsWith('REPORT_DRAFT_') &&
          Array.isArray(p?.inspectionData?.deficiencies) &&
          p.inspectionData.deficiencies.length > 0
        );

        backendDrafts.forEach((p: any) => {
          const propertyObj = p.propertyId;
          const extractedPropertyId =
            propertyObj?._id ||
            (typeof propertyObj === 'string' ? propertyObj : '') ||
            p?.inspectionData?.property?._id ||
            '';
          const foundProp = (propertiesData.properties || propertiesData || []).find((prop: any) =>
            prop._id === extractedPropertyId || prop.id === extractedPropertyId
          );
          const resolvedPropName =
            propertyObj?.name ||
            p?.inspectionData?.property?.name ||
            foundProp?.name ||
            'Cloud Draft';

          const draftFindings = p.inspectionData.deficiencies || [];
          const dTotalDef = draftFindings.length;
          const dCritDef = draftFindings.filter((f: any) => {
            const sev = String(f?.severity || f?.deficiency?.severity || f?.deficiency?.aiSeverity || '').toLowerCase();
            return sev === 'critical' || sev === 'life-threatening' || sev === 'severe';
          }).length;
          const backendDraftTypeUnit = extractUnitFromInspectionType(p.inspectionType || p?.inspectionData?.inspectionType);

          mappedReports.push({
            id: `draftdb_${p._id}`,
            property: resolvedPropName,
            propertyId: extractedPropertyId,
            unit: buildMergedBuildingLabel([
              p?.inspectionData?.buildingInspectionId,
              p?.inspectionData?.building,
              p?.inspectionData?.buildingName,
              p?.inspectionData?.unit,
              p.unitId,
              backendDraftTypeUnit,
            ]),
            inspector: storedUser?.fullName || 'Draft Inspector',
            date: new Date(p.updatedAt || p.createdAt || p?.inspectionData?.savedAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }) + ' (Draft)',
            complianceScore: 'Unpaid',
            inspectionType: p?.inspectionData?.inspectionType || 'Draft Inspection',
            totalDeficiencies: dTotalDef,
            criticalDeficiencies: dCritDef,
            notes: normalizeNoteForMerge(p?.inspectionData?.notes),
            rawData: {
              ...(p.inspectionData || {}),
              deficiencies: draftFindings,
              findings: draftFindings,
              property: foundProp || p?.inspectionData?.property || { _id: extractedPropertyId, name: resolvedPropName },
            } as any,
            draftMeta: {
              source: 'backend',
              propertyId: extractedPropertyId,
              unitId: String(p.unitId || ''),
              inspectionType: String(p.inspectionType || ''),
            },
          });
        });
      } catch (backendDraftErr) {
        console.log('Error loading backend drafts:', backendDraftErr);
      }

      // Fallback: if a property has active inspection progress but no completed/draft report yet,
      // surface it in Reports so inspectors can still access in-progress output.
      try {
        const existingPropertyIds = new Set(
          mappedReports
            .map((report) => String(report.propertyId || '').trim())
            .filter((token) => !!token)
        );

        const progressFallbackMap = new Map<
          string,
          {
            propertyId: string;
            propertyName: string;
            propertyObj: any;
            buildingLabel: string;
            latestTimestamp: number;
            notes: string[];
            findings: any[];
            selectedUnits: Set<string>;
          }
        >();

        const isMeaningfulResponseValue = (value: unknown): boolean => {
          return value !== null && value !== undefined && String(value).trim() !== '';
        };

        allProgressRecords.forEach((progressItem: any) => {
          const inspectionTypeToken = String(progressItem?.inspectionType || '').trim();
          if (!inspectionTypeToken) {
            return;
          }

          // Drafts are handled above; this fallback is for section/unit progress records.
          if (inspectionTypeToken.toUpperCase().startsWith('REPORT_DRAFT_')) {
            return;
          }

          const responses =
            progressItem?.responses && typeof progressItem.responses === 'object'
              ? progressItem.responses
              : {};
          const answeredCount = Object.values(responses).filter(isMeaningfulResponseValue).length;

          const progressFindings = Array.isArray(progressItem?.inspectionData?.deficiencies)
            ? progressItem.inspectionData.deficiencies
            : (Array.isArray(progressItem?.inspectionData?.findings)
              ? progressItem.inspectionData.findings
              : []);

          if (answeredCount === 0 && progressFindings.length === 0) {
            return;
          }

          const progressPropertyObj = progressItem?.propertyId;
          const progressPropertyId = String(
            progressPropertyObj?._id ||
            (typeof progressPropertyObj === 'string' ? progressPropertyObj : '') ||
            progressItem?.inspectionData?.property?._id ||
            ''
          ).trim();

          if (!progressPropertyId) {
            return;
          }

          // If this property already has a report card from completed inspections or drafts,
          // avoid duplicating by injecting this fallback.
          if (existingPropertyIds.has(progressPropertyId)) {
            return;
          }

          const foundProp = (propertiesData.properties || propertiesData || []).find((prop: any) =>
            prop._id === progressPropertyId || prop.id === progressPropertyId
          );

          const resolvedPropertyName =
            progressPropertyObj?.name ||
            progressItem?.inspectionData?.property?.name ||
            foundProp?.name ||
            'In-Progress Property';

          const buildingLabel = buildMergedBuildingLabel([
            progressItem?.buildingId,
            progressItem?.inspectionData?.buildingId,
            progressItem?.inspectionData?.building,
            progressItem?.inspectionData?.buildingName,
            progressItem?.unitId,
          ]);

          const fallbackKey = `${progressPropertyId}::${normalizeUnitToken(buildingLabel || '-')}`;

          if (!progressFallbackMap.has(fallbackKey)) {
            progressFallbackMap.set(fallbackKey, {
              propertyId: progressPropertyId,
              propertyName: resolvedPropertyName,
              propertyObj: foundProp || progressItem?.inspectionData?.property || { _id: progressPropertyId, name: resolvedPropertyName },
              buildingLabel: buildingLabel || '-',
              latestTimestamp: 0,
              notes: [],
              findings: [],
              selectedUnits: new Set<string>(),
            });
          }

          const aggregate = progressFallbackMap.get(fallbackKey)!;

          const recordTimestamp = Date.parse(
            String(progressItem?.updatedAt || progressItem?.createdAt || progressItem?.inspectionData?.savedAt || 0)
          );
          if (Number.isFinite(recordTimestamp) && recordTimestamp > aggregate.latestTimestamp) {
            aggregate.latestTimestamp = recordTimestamp;
          }

          const noteCandidate = normalizeNoteForMerge(progressItem?.inspectionData?.notes);
          if (noteCandidate) {
            aggregate.notes.push(noteCandidate);
          }

          if (progressFindings.length > 0) {
            aggregate.findings.push(...progressFindings);
          }

          const unitFromType = extractUnitFromInspectionType(inspectionTypeToken);
          if (unitFromType && !isPlaceholderUnitLabel(unitFromType) && !looksLikeBuildingLabel(unitFromType)) {
            aggregate.selectedUnits.add(unitFromType);
          }

          const currentUnitCandidate = normalizeUnitLabel(progressItem?.inspectionData?.currentUnit);
          if (currentUnitCandidate && !isPlaceholderUnitLabel(currentUnitCandidate) && !looksLikeBuildingLabel(currentUnitCandidate)) {
            aggregate.selectedUnits.add(currentUnitCandidate);
          }
        });

        progressFallbackMap.forEach((aggregate) => {
          const fallbackFindings = aggregate.findings.filter(Boolean);
          const criticalDeficiencies = fallbackFindings.filter((finding: any) => {
            const severityToken = String(
              finding?.severity ||
              finding?.deficiency?.severity ||
              finding?.deficiency?.aiSeverity ||
              ''
            ).toLowerCase();

            return severityToken === 'critical' || severityToken === 'life-threatening' || severityToken === 'severe';
          }).length;

          const mergedNotes = Array.from(new Set(aggregate.notes)).join('\n\n');
          const resolvedDate = aggregate.latestTimestamp > 0
            ? new Date(aggregate.latestTimestamp)
            : new Date();

          mappedReports.push({
            id: `progress_${aggregate.propertyId}_${normalizeUnitToken(aggregate.buildingLabel || 'building')}`,
            property: aggregate.propertyName,
            propertyId: aggregate.propertyId,
            unit: aggregate.buildingLabel,
            inspector: storedUser?.fullName || 'Inspector',
            date: resolvedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }) + ' (Draft)',
            complianceScore: 'Unpaid',
            inspectionType: 'In-Progress Inspection',
            totalDeficiencies: fallbackFindings.length,
            criticalDeficiencies,
            notes: mergedNotes,
            rawData: {
              property: aggregate.propertyObj,
              findings: fallbackFindings,
              deficiencies: fallbackFindings,
              selectedUnits: Array.from(aggregate.selectedUnits),
              notes: mergedNotes,
              updatedAt: resolvedDate.toISOString(),
              inspectionType: 'In-Progress Inspection',
              status: 'in-progress',
            } as any,
          });
        });
      } catch (progressFallbackErr) {
        console.log('Error creating progress fallback reports:', progressFallbackErr);
      }

      const getPropertyGroupKey = (report: Report): string => {
        const propertyIdValue = String(report.propertyId || '').trim();
        if (propertyIdValue && !['unknown', 'null', 'undefined'].includes(propertyIdValue.toLowerCase())) {
          return propertyIdValue;
        }

        const normalizedPropertyName = String(report.property || '').trim().toLowerCase();
        return normalizedPropertyName || 'unknown-property';
      };

      const dedupeBackendDraftRefs = (
        refs: Array<{ propertyId: string; unitId: string; inspectionType: string }>
      ) => {
        const deduped = new Map<string, { propertyId: string; unitId: string; inspectionType: string }>();

        refs.forEach((ref) => {
          const normalizedRef = {
            propertyId: String(ref.propertyId || ''),
            unitId: String(ref.unitId || ''),
            inspectionType: String(ref.inspectionType || ''),
          };

          const key = `${normalizedRef.propertyId}|${normalizedRef.unitId}|${normalizedRef.inspectionType}`;
          if (!deduped.has(key)) {
            deduped.set(key, normalizedRef);
          }
        });

        return Array.from(deduped.values());
      };

      const normalizeFindingKeyPart = (value: unknown): string => String(value ?? '').trim().toLowerCase();

      const buildFindingDedupeKey = (finding: any): string => {
        const stableFindingId = normalizeFindingKeyPart(
          finding?.deficiencyQRId ||
          finding?.findingId ||
          finding?._id ||
          ''
        );

        if (stableFindingId && !['unknown', 'undefined', 'null'].includes(stableFindingId)) {
          const unitAsBuilding = looksLikeBuildingLabel(normalizeUnitLabel(finding?._unit))
            ? normalizeBuildingCandidate(finding?._unit)
            : '';
          const unitLabelAsBuilding = looksLikeBuildingLabel(normalizeUnitLabel(finding?.unit))
            ? normalizeBuildingCandidate(finding?.unit)
            : '';

          const stableBuildingTokenRaw =
            normalizeBuildingCandidate(finding?.buildingInspectionId) ||
            normalizeBuildingCandidate(finding?.building_id) ||
            normalizeBuildingCandidate(finding?.building) ||
            normalizeBuildingCandidate(finding?.buildingName) ||
            normalizeBuildingCandidate(finding?.buildingId) ||
            unitAsBuilding ||
            unitLabelAsBuilding ||
            '';

          const stableBuildingToken = normalizeFindingKeyPart(stableBuildingTokenRaw);

          return `finding-id|${stableFindingId}|${stableBuildingToken || 'unknown-building'}`;
        }

        const area = normalizeFindingKeyPart(finding?._area || finding?.area || 'unknown-area');
        const isInsideOutsideArea = area.includes('inside') || area.includes('outside');
        const buildingLabelCandidates = mergeUniqueStringArrays([
          normalizeBuildingCandidate(finding?.buildingInspectionId),
          normalizeBuildingCandidate(finding?.building_id),
          normalizeBuildingCandidate(finding?.building),
          normalizeBuildingCandidate(finding?.buildingName),
          normalizeBuildingCandidate(finding?.buildingId),
          isInsideOutsideArea && looksLikeBuildingLabel(normalizeUnitLabel(finding?._unit)) ? normalizeBuildingCandidate(finding?._unit) : '',
          isInsideOutsideArea && looksLikeBuildingLabel(normalizeUnitLabel(finding?.unit)) ? normalizeBuildingCandidate(finding?.unit) : '',
        ]).filter((candidate) => !isPlaceholderUnitLabel(candidate));
        const building = normalizeFindingKeyPart(buildingLabelCandidates[0] || 'unknown-building');
        const unit = normalizeFindingKeyPart(
          finding?._unit !== undefined
            ? finding._unit
            : (finding?.unit || finding?.unitId || finding?.building || finding?.buildingName || 'unknown-unit')
        );
        const location = normalizeFindingKeyPart(finding?.location || finding?.room || 'unknown-location');
        const moduleId = normalizeFindingKeyPart(
          finding?.itemId ||
          finding?.itemName ||
          finding?.module ||
          finding?.submodule ||
          finding?.deficiencyQRId ||
          finding?.id ||
          'unknown-item'
        );
        const deficiencyName = normalizeFindingKeyPart(
          finding?.deficiency?.name ||
          finding?.deficiencyName ||
          finding?.name ||
          finding?.title ||
          (finding?.isGeneralComment ? 'general comment' : 'unknown-deficiency')
        );
        const deficiencyCode = normalizeFindingKeyPart(
          finding?.deficiency?.code ||
          finding?.nspireCode ||
          finding?.codeReference ||
          'unknown-code'
        );
        const details = normalizeFindingKeyPart(
          finding?.deficiency?.detail ||
          finding?.deficiencyDetails ||
          finding?.detail ||
          finding?.description ||
          ''
        );

        return `${area}|${building}|${unit}|${location}|${moduleId}|${deficiencyCode}|${deficiencyName}|${details}`;
      };

      const dedupeFindings = (findings: any[]): any[] => {
        const deduped = new Map<string, any>();

        findings.forEach((finding) => {
          if (!finding) {
            return;
          }

          const key = buildFindingDedupeKey(finding);
          const existing = deduped.get(key) || {};

          deduped.set(key, {
            ...existing,
            ...finding,
            dedupeKey: key,
          });
        });

        return Array.from(deduped.values());
      };

      const extractBuildingLabelsFromFindings = (findings: any[]): string[] => {
        const buildingCandidates: string[] = [];

        findings.forEach((finding) => {
          const directCandidates = [
            finding?.buildingInspectionId,
            finding?.building_id,
            finding?.building,
            finding?.buildingName,
            finding?.buildingId,
          ];

          directCandidates.forEach((candidate) => {
            const normalized = normalizeBuildingCandidate(candidate);
            if (normalized) {
              buildingCandidates.push(normalized);
            }
          });

          const underscoreUnit = normalizeUnitLabel(finding?._unit);
          if (looksLikeBuildingLabel(underscoreUnit)) {
            const normalized = normalizeBuildingCandidate(underscoreUnit);
            if (normalized) {
              buildingCandidates.push(normalized);
            }
          }
        });

        return mergeUniqueStringArrays(buildingCandidates);
      };

      const extractUnitLabelsFromFindings = (findings: any[]): string[] => {
        const unitCandidates: string[] = [];

        findings.forEach((finding) => {
          const candidates = [
            finding?._unit,
            finding?.unit,
            finding?.unitId,
            finding?.unitNumber,
            finding?.building,
            finding?.buildingName,
            finding?.buildingId,
          ];

          candidates.forEach((candidate) => {
            const normalized = normalizeUnitLabel(candidate);
            if (!isPlaceholderUnitLabel(normalized)) {
              unitCandidates.push(normalized);
            }
          });
        });

        return mergeUniqueStringArrays(unitCandidates);
      };

      const aggregateReportsByProperty = (sourceReports: Report[]): Report[] => {
        const groupedReports = new Map<string, Report>();

        const getInspectionTimestamp = (candidate: Report): number => {
          const raw = candidate.rawData as any;
          const timestamp = raw?.updatedAt || raw?.completedDate || raw?.scheduledDate || raw?.createdAt;
          if (timestamp) {
            const parsed = new Date(timestamp).getTime();
            if (!Number.isNaN(parsed)) {
              return parsed;
            }
          }

          const fallback = Date.parse(String(candidate.date || '').replace('(Draft)', '').trim());
          return Number.isNaN(fallback) ? Date.now() : fallback;
        };

        const isCriticalSeverity = (finding: any): boolean => {
          const severity = String(
            finding?.severity ||
            finding?.deficiency?.severity ||
            finding?.deficiency?.aiSeverity ||
            ''
          ).toLowerCase();

          return severity === 'critical' || severity === 'life-threatening' || severity === 'severe';
        };

        sourceReports.forEach((report) => {
          const rawReportData = report.rawData as any;
          const reportFindingsRaw = ((rawReportData as any).findings || (rawReportData as any).deficiencies || []).filter(Boolean);

          const explicitFindingBuildingLabels = mergeUniqueStringArrays(
            reportFindingsRaw.flatMap((finding: any) => {
              const areaToken = normalizeUnitToken(
                finding?._area || finding?.area || finding?.inspectionType || ''
              );
              const isInsideOutsideFinding = areaToken.includes('inside') || areaToken.includes('outside');
              const normalizedExistingUnit = normalizeUnitLabel(
                finding?._unit ?? finding?.unit ?? finding?.unitId ?? ''
              );

              return [
                normalizeBuildingCandidate(finding?.buildingInspectionId),
                normalizeBuildingCandidate(finding?.building_id),
                normalizeBuildingCandidate(finding?.building),
                normalizeBuildingCandidate(finding?.buildingName),
                normalizeBuildingCandidate(finding?.buildingId),
                isInsideOutsideFinding && looksLikeBuildingLabel(normalizedExistingUnit)
                  ? normalizeBuildingCandidate(normalizedExistingUnit)
                  : '',
              ].filter((candidate) => !isPlaceholderUnitLabel(candidate));
            })
          );

          const reportBuildingCandidates = mergeUniqueStringArrays([
            normalizeBuildingCandidate(rawReportData?.buildingInspectionId),
            normalizeBuildingCandidate(rawReportData?.buildingName),
            normalizeBuildingCandidate(rawReportData?.buildingId),
            normalizeBuildingCandidate(rawReportData?.inspectionData?.buildingInspectionId),
            normalizeBuildingCandidate(rawReportData?.inspectionData?.buildingId),
            ...parseBuildingCandidatesFromUnitLabel(report.unit),
          ]).filter((candidate) => !isPlaceholderUnitLabel(candidate));

          const singleReportBuildingCandidate = reportBuildingCandidates.length === 1
            ? reportBuildingCandidates[0]
            : '';
          const canFallbackToReportBuilding =
            !!singleReportBuildingCandidate &&
            (
              explicitFindingBuildingLabels.length === 0 ||
              explicitFindingBuildingLabels.every((label) => label === singleReportBuildingCandidate)
            );

          const defaultReportBuilding = canFallbackToReportBuilding ? singleReportBuildingCandidate : '';

          const reportFindingsWithContext = reportFindingsRaw.map((finding: any) => {
            const areaToken = normalizeUnitToken(
              finding?._area || finding?.area || finding?.inspectionType || ''
            );
            const isInsideOutsideFinding = areaToken.includes('inside') || areaToken.includes('outside');

            const normalizedExistingUnit = normalizeUnitLabel(
              finding?._unit ?? finding?.unit ?? finding?.unitId ?? ''
            );

            const findingBuildingCandidates = mergeUniqueStringArrays([
              normalizeBuildingCandidate(finding?.buildingInspectionId),
              normalizeBuildingCandidate(finding?.building_id),
              normalizeBuildingCandidate(finding?.building),
              normalizeBuildingCandidate(finding?.buildingName),
              normalizeBuildingCandidate(finding?.buildingId),
              isInsideOutsideFinding && looksLikeBuildingLabel(normalizedExistingUnit) ? normalizedExistingUnit : '',
              defaultReportBuilding,
            ]).filter((candidate) => !isPlaceholderUnitLabel(candidate));

            const resolvedFindingBuilding = findingBuildingCandidates[0] || '';
            const normalizedFinding = { ...finding };

            const existingBuildingToken = normalizeUnitLabel(
              normalizedFinding?.buildingInspectionId ||
              normalizedFinding?.building_id ||
              normalizedFinding?.building ||
              normalizedFinding?.buildingName ||
              normalizedFinding?.buildingId ||
              ''
            );

            if (resolvedFindingBuilding && (!existingBuildingToken || isPlaceholderUnitLabel(existingBuildingToken) || looksLikeUnitLabel(existingBuildingToken))) {
              normalizedFinding.building = resolvedFindingBuilding;
            }

            if (isInsideOutsideFinding) {
              const resolvedInsideOutsideUnit =
                !isPlaceholderUnitLabel(normalizedExistingUnit)
                  ? normalizedExistingUnit
                  : resolvedFindingBuilding;

              if (resolvedInsideOutsideUnit) {
                const existingUnderscoreUnitToken = normalizeUnitLabel(normalizedFinding?._unit || '');
                const existingUnitToken = normalizeUnitLabel(normalizedFinding?.unit || '');

                if (!normalizedFinding?._unit || isPlaceholderUnitLabel(existingUnderscoreUnitToken)) {
                  normalizedFinding._unit = resolvedInsideOutsideUnit;
                }

                if (!normalizedFinding?.unit || isPlaceholderUnitLabel(existingUnitToken)) {
                  normalizedFinding.unit = resolvedInsideOutsideUnit;
                }
              }
            }

            return normalizedFinding;
          });

          const reportInspectionIds = report.sourceInspectionIds?.length
            ? report.sourceInspectionIds
            : (!report.draftMeta ? [report.id] : []);
          const reportLocalDraftKeys = report.sourceLocalDraftKeys?.length
            ? report.sourceLocalDraftKeys
            : (report.draftMeta?.source === 'local' && report.draftMeta.key ? [report.draftMeta.key] : []);
          const reportBackendDraftRefs = report.sourceBackendDraftRefs?.length
            ? report.sourceBackendDraftRefs
            : (report.draftMeta?.source === 'backend'
              ? [{
                propertyId: String(report.draftMeta.propertyId || report.propertyId || ''),
                unitId: String(report.draftMeta.unitId || ''),
                inspectionType: String(report.draftMeta.inspectionType || ''),
              }]
              : []);
          const reportFindings = dedupeFindings(reportFindingsWithContext);
          const reportFindingsBuildingLabels = extractBuildingLabelsFromFindings(reportFindings);
          const groupKey = getPropertyGroupKey(report);
          const reportUnitLabel = buildMergedBuildingLabel([
            report.unit,
            ...reportBuildingCandidates,
            ...reportFindingsBuildingLabels,
            ...reportBackendDraftRefs.map((ref) => ref.unitId),
            (report.rawData as any)?.buildingInspectionId,
            (report.rawData as any)?.buildingName,
            (report.rawData as any)?.buildingId,
          ]);
          const reportNotes = normalizeNoteForMerge(report.notes);

          const existing = groupedReports.get(groupKey);

          if (!existing) {
            groupedReports.set(groupKey, {
              ...report,
              unit: reportUnitLabel,
              totalDeficiencies: reportFindings.length,
              criticalDeficiencies: reportFindings.filter(isCriticalSeverity).length,
              notes: reportNotes,
              rawData: {
                ...(report.rawData as any),
                findings: reportFindings,
                deficiencies: reportFindings,
                notes: reportNotes,
              } as any,
              sourceInspectionIds: mergeUniqueStringArrays(reportInspectionIds),
              sourceLocalDraftKeys: mergeUniqueStringArrays(reportLocalDraftKeys),
              sourceBackendDraftRefs: dedupeBackendDraftRefs(reportBackendDraftRefs),
            });
            return;
          }

          const existingFindings = ((existing.rawData as any).findings || (existing.rawData as any).deficiencies || []).filter(Boolean);
          const mergedFindings = dedupeFindings([...existingFindings, ...reportFindings]);
          const mergedNotes = [existing.notes, report.notes]
            .map((noteValue) => normalizeNoteForMerge(noteValue))
            .filter((note): note is string => Boolean(note && note.trim()))
            .filter((note, index, allNotes) => allNotes.indexOf(note) === index)
            .join('\n\n');
          const latestReport = getInspectionTimestamp(report) > getInspectionTimestamp(existing) ? report : existing;
          const mergedInspectionIds = mergeUniqueStringArrays([
            ...(existing.sourceInspectionIds || []),
            ...reportInspectionIds,
          ]);
          const mergedLocalDraftKeys = mergeUniqueStringArrays([
            ...(existing.sourceLocalDraftKeys || []),
            ...reportLocalDraftKeys,
          ]);
          const mergedBackendDraftRefs = dedupeBackendDraftRefs([
            ...(existing.sourceBackendDraftRefs || []),
            ...reportBackendDraftRefs,
          ]);
          const mergedFindingsBuildingLabels = extractBuildingLabelsFromFindings(mergedFindings);
          const mergedUnitLabel = buildMergedBuildingLabel([
            ...String(existing.unit || '').split(','),
            report.unit,
            ...mergedFindingsBuildingLabels,
            ...mergedBackendDraftRefs.map((ref) => ref.unitId),
            (existing.rawData as any)?.buildingInspectionId,
            (existing.rawData as any)?.buildingName,
            (existing.rawData as any)?.buildingId,
            (latestReport.rawData as any)?.buildingInspectionId,
            (latestReport.rawData as any)?.buildingName,
            (latestReport.rawData as any)?.buildingId,
          ]);

          groupedReports.set(groupKey, {
            ...existing,
            id: latestReport.id,
            date: latestReport.date,
            inspector: latestReport.inspector,
            complianceScore: latestReport.complianceScore,
            unit: mergedUnitLabel,
            totalDeficiencies: mergedFindings.length,
            criticalDeficiencies: mergedFindings.filter(isCriticalSeverity).length,
            notes: mergedNotes,
            rawData: {
              ...(existing.rawData as any),
              ...(latestReport.rawData as any),
              findings: mergedFindings,
              deficiencies: mergedFindings,
              notes: mergedNotes,
            } as any,
            sourceInspectionIds: mergedInspectionIds,
            sourceLocalDraftKeys: mergedLocalDraftKeys,
            sourceBackendDraftRefs: mergedBackendDraftRefs,
            draftMeta: latestReport.draftMeta || existing.draftMeta,
          });
        });

        return Array.from(groupedReports.values());
      };

      const finalReports = aggregateReportsByProperty(mappedReports);

      // Sort by date (newest first)
      const getSortTimestamp = (candidate: Report): number => {
        const raw = candidate.rawData as any;
        const timestamp = raw?.updatedAt || raw?.completedDate || raw?.scheduledDate || raw?.createdAt;
        if (timestamp) {
          const parsed = new Date(timestamp).getTime();
          if (!Number.isNaN(parsed)) {
            return parsed;
          }
        }

        const fallback = Date.parse(String(candidate.date || '').replace('(Draft)', '').trim());
        return Number.isNaN(fallback) ? Date.now() : fallback;
      };

      finalReports.sort((a, b) => {
        return getSortTimestamp(b) - getSortTimestamp(a);
      });

      const finalReportsWithProgressBuildings = finalReports.map((report) => {
        const propertyToken = String(report.propertyId || '').trim();
        if (!propertyToken) {
          return report;
        }

        const progressBuildings = propertyBuildingCandidatesMap.get(propertyToken) || [];
        if (progressBuildings.length === 0) {
          return report;
        }

        const existingValidBuildings = parseBuildingCandidatesFromUnitLabel(report.unit);

        return {
          ...report,
          unit: buildMergedBuildingLabel([...existingValidBuildings, ...progressBuildings]),
        };
      });

      setReports(finalReportsWithProgressBuildings);
      setProperties(propertiesData.properties || propertiesData || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      // Don't show alert, just log and show empty state
      setReports([]);
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = progressSocketService.subscribe((progressUpdate) => {
      const propertyIdToken = String(progressUpdate?.propertyId || '').trim();
      const buildingIdToken = String(progressUpdate?.buildingId || '').trim();
      const inspectionTypeToken = String(progressUpdate?.inspectionType || '').trim();

      if (!propertyIdToken || !buildingIdToken || !inspectionTypeToken) {
        return;
      }

      const progressKey = buildInspectionProgressKey({
        propertyId: propertyIdToken,
        buildingId: buildingIdToken,
        inspectionType: inspectionTypeToken,
      });

      globalInspectionProgress[progressKey] =
        progressUpdate?.responses && typeof progressUpdate.responses === 'object'
          ? progressUpdate.responses
          : {};

      if (socketRefreshTimerRef.current) {
        clearTimeout(socketRefreshTimerRef.current);
      }

      socketRefreshTimerRef.current = setTimeout(() => {
        socketRefreshTimerRef.current = null;
        loadData().catch((socketRefreshError) => {
          console.error('Reports socket refresh failed:', socketRefreshError);
        });
      }, 250);
    });

    return () => {
      unsubscribe();

      if (socketRefreshTimerRef.current) {
        clearTimeout(socketRefreshTimerRef.current);
        socketRefreshTimerRef.current = null;
      }
    };
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = async (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Navigate to correct dashboard based on user role
      const userRole = user?.role || 'inspector';
      const dashboardRoute = authService.getDashboardRoute(userRole);
      navigation.navigate(dashboardRoute as never);
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections' as never);
    } else if (screen === 'Reports') {
      // Already on Reports
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setSidebarVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' as never }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchText ||
      report.property.toLowerCase().includes(searchText.toLowerCase()) ||
      report.unit.toLowerCase().includes(searchText.toLowerCase()) ||
      report.inspector.toLowerCase().includes(searchText.toLowerCase());

    const matchesProperty = !propertyName || report.propertyId === propertyName;

    // Status filter - compare case-insensitively
    const matchesStatus = !status ||
      (status.toLowerCase() === report.complianceScore.toLowerCase());

    // Date range filtering
    let matchesDateRange = true;
    if (dateRange) {
      const reportDate = new Date(report.date);
      const now = new Date();
      let cutoffDate = new Date();

      switch (dateRange) {
        case '7days':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        default:
          cutoffDate = new Date(0); // Include all dates
      }

      matchesDateRange = reportDate >= cutoffDate;
    }

    return matchesSearch && matchesProperty && matchesStatus && matchesDateRange;
  });

  const normalizeReportLabelToken = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');

  const isPlaceholderReportLabel = (value: unknown): boolean => {
    const token = normalizeReportLabelToken(value);
    return (
      !token ||
      token === 'allunits' ||
      token === 'allunit' ||
      token === 'unknown' ||
      token === 'null' ||
      token === 'undefined' ||
      token === 'property' ||
      token === 'building'
    );
  };

  const parseUnitLabelCandidates = (value: unknown): string[] => {
    return String(value ?? '')
      .split(',')
      .map((chunk) => chunk.trim())
      .flatMap((chunk) => chunk.split('/').map((part) => part.trim()))
      .filter((chunk) => Boolean(chunk) && !isPlaceholderReportLabel(chunk));
  };

  const looksLikeBuildingReportLabel = (value: string): boolean => {
    const label = String(value || '').trim();
    if (!label) {
      return false;
    }

    return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label);
  };

  const collectReportBuildingCandidates = (report: Report): string[] => {
    const raw = report.rawData as any;
    const directCandidates = [
      raw?.buildingInspectionId,
      raw?.buildingName,
      raw?.buildingId,
      raw?.inspectionData?.buildingInspectionId,
      raw?.inspectionData?.buildingId,
      raw?.property?.building,
      raw?.property?.buildingName,
    ]
      .map((candidate) => String(candidate ?? '').trim())
      .filter((candidate) => candidate && !isPlaceholderReportLabel(candidate))
      .filter((candidate) => {
        const normalized = candidate.toLowerCase();
        return !(normalized.startsWith('unit ') || normalized.startsWith('unit-') || normalized.startsWith('unit_'));
      });

    const parsedFromUnit = parseUnitLabelCandidates(report.unit)
      .map((candidate) => String(candidate ?? '').trim())
      .filter((candidate) => looksLikeBuildingReportLabel(candidate));

    return Array.from(new Set([...directCandidates, ...parsedFromUnit]));
  };

  const resolveReportBuildingName = (report: Report): string => {
    const candidates = collectReportBuildingCandidates(report);
    return candidates[0] || '';
  };

  const extractFindingBuildingName = (finding: any): string => {
    const directCandidate = [
      finding?.buildingInspectionId,
      finding?.building_id,
      finding?.building,
      finding?.buildingName,
      finding?.buildingId,
    ]
      .map((candidate) => String(candidate ?? '').trim())
      .find((candidate) => {
        if (!candidate || isPlaceholderReportLabel(candidate)) {
          return false;
        }

        const normalized = candidate.toLowerCase();
        return !(normalized.startsWith('unit ') || normalized.startsWith('unit-') || normalized.startsWith('unit_'));
      });

    if (directCandidate) {
      return directCandidate;
    }

    const areaToken = normalizeReportLabelToken(
      finding?._area || finding?.area || finding?.inspectionType || ''
    );
    const isInsideOutside = areaToken.includes('inside') || areaToken.includes('outside');

    if (isInsideOutside) {
      const unitCandidate = String(finding?._unit ?? finding?.unit ?? '').trim();
      if (looksLikeBuildingReportLabel(unitCandidate)) {
        return unitCandidate;
      }
    }

    return '';
  };

  const applySingleBuildingScopeToFindings = (
    findings: any[],
    buildingCandidates: string[],
    resolvedBuildingName: string
  ): any[] => {
    if (!Array.isArray(findings)) {
      return [];
    }

    if (!resolvedBuildingName || buildingCandidates.length !== 1) {
      return findings;
    }

    const targetBuildingToken = normalizeReportLabelToken(resolvedBuildingName);

    return findings
      .map((finding) => {
        const detectedBuilding = extractFindingBuildingName(finding);
        if (detectedBuilding) {
          return finding;
        }

        const areaToken = normalizeReportLabelToken(
          finding?._area || finding?.area || finding?.inspectionType || ''
        );
        const isInsideOutside = areaToken.includes('inside') || areaToken.includes('outside');

        return {
          ...finding,
          building: resolvedBuildingName,
          buildingInspectionId: finding?.buildingInspectionId || resolvedBuildingName,
          ...(isInsideOutside
            ? {
              _unit: String(finding?._unit || finding?.unit || resolvedBuildingName).trim(),
              unit: String(finding?.unit || finding?._unit || resolvedBuildingName).trim(),
            }
            : {}),
        };
      })
      .filter((finding) => {
        const detectedBuilding = extractFindingBuildingName(finding);
        if (!detectedBuilding) {
          return true;
        }

        return normalizeReportLabelToken(detectedBuilding) === targetBuildingToken;
      });
  };

  const handleViewReport = async (report: Report) => {
    try {
      setLoading(true);

      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }

      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const buildingCandidates = collectReportBuildingCandidates(report);
      const resolvedBuildingName = resolveReportBuildingName(report);
      const scopedFindings = applySingleBuildingScopeToFindings(
        reportData.findings || [],
        buildingCandidates,
        resolvedBuildingName
      );
      reportData.findings = scopedFindings;
      reportData.deficiencies = scopedFindings;
      const explicitFindingBuildingEvidence: string[] = Array.from(
        new Set(
          (reportData.findings || [])
            .flatMap((finding: any) => {
              const direct = [
                finding?.buildingInspectionId,
                finding?.building_id,
                finding?.building,
                finding?.buildingName,
                finding?.buildingId,
              ]
                .map((candidate: unknown) => String(candidate ?? '').trim())
                .filter((candidate: string) => !!candidate && !isPlaceholderReportLabel(candidate));

              const underscoreUnit = String(finding?._unit ?? '').trim();
              const fromUnit = looksLikeBuildingReportLabel(underscoreUnit)
                ? [underscoreUnit]
                : [];

              return [...direct, ...fromUnit];
            })
        )
      );

      const shouldPinSingleBuilding =
        buildingCandidates.length === 1 &&
        !!resolvedBuildingName &&
        explicitFindingBuildingEvidence.length > 0 &&
        explicitFindingBuildingEvidence.every((label) => label.toLowerCase() === resolvedBuildingName.toLowerCase());

      if (shouldPinSingleBuilding) {
        reportData.buildingName = resolvedBuildingName;
      } else {
        delete reportData.buildingName;
      }

      if (!Array.isArray(reportData.selectedUnits) || reportData.selectedUnits.length === 0) {
        const selectedUnitsFromLabel = parseUnitLabelCandidates(report.unit);
        if (selectedUnitsFromLabel.length > 0) {
          reportData.selectedUnits = selectedUnitsFromLabel;
        }
      }

      const html = buildInProgressReportHtml(reportData);

      openReportPreview({
        title: `${report.property} Report`,
        html,
      });
    } catch (err: any) {
      console.error('Failed to generate preview', err);
      Alert.alert('Error', `Failed to generate report preview: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = (report: Report) => {
    Alert.alert(
      "Delete Report",
      `Are you sure you want to delete the report for ${report.property}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const localDraftKeysToDelete = Array.from(new Set(report.sourceLocalDraftKeys || []));
              for (const draftKey of localDraftKeysToDelete) {
                await AsyncStorage.removeItem(draftKey);
              }

              const backendDraftsToDelete = report.sourceBackendDraftRefs || [];
              for (const backendDraft of backendDraftsToDelete) {
                if (!backendDraft.propertyId || !backendDraft.unitId || !backendDraft.inspectionType) {
                  continue;
                }

                await inspectionService.saveProgress({
                  property_id: String(backendDraft.propertyId),
                  unit_id: String(backendDraft.unitId),
                  inspection_type: String(backendDraft.inspectionType),
                  inspectionData: {
                    deleted: true,
                    deficiencies: [],
                    savedAt: new Date().toISOString(),
                  },
                  responses: {},
                });
              }

              const inspectionIdsToDelete = Array.from(new Set(
                report.sourceInspectionIds?.length
                  ? report.sourceInspectionIds
                  : (!report.draftMeta ? [report.id] : [])
              ));

              for (const inspectionId of inspectionIdsToDelete) {
                await inspectionService.deleteInspection(inspectionId);
              }

              await loadData();
            } catch (err: any) {
              console.error('Failed to delete report:', err);
              Alert.alert('Error', `Failed to delete report: ${err.message}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleShareReport = async (report: Report) => {
    try {
      setLoading(true);

      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }

      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const buildingCandidates = collectReportBuildingCandidates(report);
      const resolvedBuildingName = resolveReportBuildingName(report);
      const scopedFindings = applySingleBuildingScopeToFindings(
        reportData.findings || [],
        buildingCandidates,
        resolvedBuildingName
      );
      reportData.findings = scopedFindings;
      reportData.deficiencies = scopedFindings;
      const explicitFindingBuildingEvidence: string[] = Array.from(
        new Set(
          (reportData.findings || [])
            .flatMap((finding: any) => {
              const direct = [
                finding?.buildingInspectionId,
                finding?.building_id,
                finding?.building,
                finding?.buildingName,
                finding?.buildingId,
              ]
                .map((candidate: unknown) => String(candidate ?? '').trim())
                .filter((candidate: string) => !!candidate && !isPlaceholderReportLabel(candidate));

              const underscoreUnit = String(finding?._unit ?? '').trim();
              const fromUnit = looksLikeBuildingReportLabel(underscoreUnit)
                ? [underscoreUnit]
                : [];

              return [...direct, ...fromUnit];
            })
        )
      );

      const shouldPinSingleBuilding =
        buildingCandidates.length === 1 &&
        !!resolvedBuildingName &&
        explicitFindingBuildingEvidence.length > 0 &&
        explicitFindingBuildingEvidence.every((label) => label.toLowerCase() === resolvedBuildingName.toLowerCase());

      if (shouldPinSingleBuilding) {
        reportData.buildingName = resolvedBuildingName;
      } else {
        delete reportData.buildingName;
      }

      if (!Array.isArray(reportData.selectedUnits) || reportData.selectedUnits.length === 0) {
        const selectedUnitsFromLabel = parseUnitLabelCandidates(report.unit);
        if (selectedUnitsFromLabel.length > 0) {
          reportData.selectedUnits = selectedUnitsFromLabel;
        }
      }

      const nspireReport = generateNSPIREReport(reportData);
      // Force the same visual template used by "Export In Progress"
      (nspireReport as any).metadata = {
        ...(nspireReport as any).metadata,
        status: 'in-progress',
      };

      const result = await enhancedNspirePDFService.generateAndShareEnhancedPDF(nspireReport as any, {
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
        Alert.alert('Share Failed', result.error || 'Could not share the report.');
      }
    } catch (err: any) {
      console.error('Failed to share report', err);
      Alert.alert('Error', `Failed to share report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (report: Report) => {
    try {
      setLoading(true);

      const reportData = { ...report.rawData } as any;
      if (typeof reportData.property === 'string') {
        reportData.property = { _id: reportData.property, name: report.property };
      }

      reportData.findings = reportData.findings || reportData.deficiencies || [];
      reportData.inspectorName = report.inspector;

      const buildingCandidates = collectReportBuildingCandidates(report);
      const resolvedBuildingName = resolveReportBuildingName(report);
      const scopedFindings = applySingleBuildingScopeToFindings(
        reportData.findings || [],
        buildingCandidates,
        resolvedBuildingName
      );
      reportData.findings = scopedFindings;
      reportData.deficiencies = scopedFindings;

      const explicitFindingBuildingEvidence: string[] = Array.from(
        new Set(
          (reportData.findings || [])
            .flatMap((finding: any) => {
              const direct = [
                finding?.buildingInspectionId,
                finding?.building_id,
                finding?.building,
                finding?.buildingName,
                finding?.buildingId,
              ]
                .map((candidate: unknown) => String(candidate ?? '').trim())
                .filter((candidate: string) => !!candidate && !isPlaceholderReportLabel(candidate));

              const underscoreUnit = String(finding?._unit ?? '').trim();
              const fromUnit = looksLikeBuildingReportLabel(underscoreUnit)
                ? [underscoreUnit]
                : [];

              return [...direct, ...fromUnit];
            })
        )
      );

      const shouldPinSingleBuilding =
        buildingCandidates.length === 1 &&
        !!resolvedBuildingName &&
        explicitFindingBuildingEvidence.length > 0 &&
        explicitFindingBuildingEvidence.every((label) => label.toLowerCase() === resolvedBuildingName.toLowerCase());

      if (shouldPinSingleBuilding) {
        reportData.buildingName = resolvedBuildingName;
      } else {
        delete reportData.buildingName;
      }

      if (!Array.isArray(reportData.selectedUnits) || reportData.selectedUnits.length === 0) {
        const selectedUnitsFromLabel = parseUnitLabelCandidates(report.unit);
        if (selectedUnitsFromLabel.length > 0) {
          reportData.selectedUnits = selectedUnitsFromLabel;
        }
      }

      const nspireReport = generateNSPIREReport(reportData);
      (nspireReport as any).metadata = {
        ...(nspireReport as any).metadata,
        status: 'in-progress',
      };

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
        Alert.alert('Download Failed', result.error || 'Could not generate the PDF.');
        return;
      }

      if (Platform.OS === 'web') {
        Alert.alert('Download Ready', 'Report opened in a new tab. Use Print → Save as PDF to download.');
        return;
      }

      if (!result.uri) {
        Alert.alert('Download Failed', 'No PDF file was returned.');
        return;
      }

      const safePropertyName = String(report.property || 'property')
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
      const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
      const fileName = `${safePropertyName || 'property'}_${timestamp}.pdf`;
      const baseDirectory = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';

      if (!baseDirectory) {
        Alert.alert('Download Failed', 'Unable to access local storage for saving the PDF.');
        return;
      }

      const destinationPath = `${baseDirectory}${fileName}`;
      await FileSystem.deleteAsync(destinationPath, { idempotent: true }).catch(() => undefined);
      await FileSystem.copyAsync({ from: result.uri, to: destinationPath });

      Alert.alert('Download Complete', `PDF saved as ${fileName}`);
    } catch (err: any) {
      console.error('Failed to download report', err);
      Alert.alert('Error', `Failed to download report: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require('../../inspire_logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E7490']} />
          }
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Inspection Reports</Text>
            <Text style={styles.subtitle}>View export and share your inspection reports.</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for property, unit or inspector name"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Filters */}
          <Text style={styles.filtersLabel}>Filters</Text>

          {/* Property Name Filter */}
          <View style={styles.filterRow}>
            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setPropertyPickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !propertyName && { color: '#9CA3AF' }]}>
                      {propertyName ? properties.find(p => p._id === propertyName)?.name || propertyName : "Property Name"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={propertyName}
                    onValueChange={(itemValue: string) => setPropertyName(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Property Name" value="" />
                    {properties.map((property) => (
                      <Picker.Item key={property._id} label={property.name} value={property._id} />
                    ))}
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setDateRangePickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !dateRange && { color: '#9CA3AF' }]}>
                      {dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : dateRange === '90days' ? 'Last 90 days' : "Date Range"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={dateRange}
                    onValueChange={(itemValue: string) => setDateRange(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Date Range" value="" />
                    <Picker.Item label="Last 7 days" value="7days" />
                    <Picker.Item label="Last 30 days" value="30days" />
                    <Picker.Item label="Last 90 days" value="90days" />
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>
          </View>

          {/* Status Filter */}
          <View style={styles.filterRow}>
            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setStatusPickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !status && { color: '#9CA3AF' }]}>
                      {status === 'paid' ? 'Paid' : status === 'unpaid' ? 'Unpaid' : "Status"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue: string) => setStatus(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Status" value="" />
                    <Picker.Item label="Paid" value="paid" />
                    <Picker.Item label="Unpaid" value="unpaid" />
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>
          </View>

          {/* Reports List */}
          <View style={styles.reportsList}>
            {filteredReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>No reports found</Text>
              </View>
            ) : (
              filteredReports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Property</Text>
                    <Text style={styles.reportValue}>{report.property}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Building</Text>
                    <Text style={styles.reportValue}>{report.unit}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Inspector</Text>
                    <Text style={styles.reportValue}>{report.inspector}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Date</Text>
                    <Text style={styles.reportValue}>{report.date}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Payment{'\n'}Status</Text>
                    <View style={styles.complianceContainer}>
                      <View style={[
                        styles.complianceDot,
                        report.complianceScore === 'Paid' ? styles.compliantDot : styles.nonCompliantDot
                      ]} />
                      <Text style={styles.complianceText}>{report.complianceScore}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleViewReport(report)}
                    >
                      <Ionicons name="document-text-outline" size={24} color="#0E7490" />
                      <Text style={styles.iconButtonLabel}>View Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleShareReport(report)}
                    >
                      <Ionicons name="share-social-outline" size={24} color="#0E7490" />
                      <Text style={styles.iconButtonLabel}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDownloadReport(report)}
                    >
                      <Ionicons name="download-outline" size={24} color="#0E7490" />
                      <Text style={styles.iconButtonLabel}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleDeleteReport(report)}
                    >
                      <Ionicons name="trash-outline" size={24} color="#EF4444" />
                      <Text style={[styles.iconButtonLabel, { color: '#EF4444' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* iOS Picker Modals */}
      <IOSPickerModal
        visible={propertyPickerVisible}
        title="Select Property"
        options={getPropertyOptions()}
        selectedValue={propertyName}
        onSelect={setPropertyName}
        onClose={() => setPropertyPickerVisible(false)}
      />
      <IOSPickerModal
        visible={dateRangePickerVisible}
        title="Select Date Range"
        options={DATE_RANGE_OPTIONS}
        selectedValue={dateRange}
        onSelect={setDateRange}
        onClose={() => setDateRangePickerVisible(false)}
      />
      <IOSPickerModal
        visible={statusPickerVisible}
        title="Select Status"
        options={STATUS_OPTIONS}
        selectedValue={status}
        onSelect={setStatus}
        onClose={() => setStatusPickerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEF8FF',
  },
  headerContainer: {
    backgroundColor: '#CEF8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 15,
  },
  headerLogo: {
    width: 240,
    height: 65,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#374151',
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  filterItemFull: {
    width: '100%',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  reportsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reportValue: {
    fontSize: 14,
    color: '#374151',
  },
  complianceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complianceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  compliantDot: {
    backgroundColor: '#10B981',
  },
  nonCompliantDot: {
    backgroundColor: '#EF4444',
  },
  complianceText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  iconButton: {
    padding: 4,
    alignItems: 'center',
    gap: 4,
  },
  iconButtonLabel: {
    fontSize: 11,
    color: '#0E7490',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  doneButton: {
    padding: 4,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#0E7490',
    fontWeight: '600',
  },
  iosPickerButton: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
  },
  pickerWrapper: {
    height: 250,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iosPicker: {
    height: 250,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});
