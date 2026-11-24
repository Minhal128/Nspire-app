import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { globalInspectionProgress } from '../utils/globalState';
import { inspectionService } from '../services/inspectionService';
import { findingFacts, findingsFromProgress, uniqueReportFindings } from '../services/web/reportRules';
import type { ScoreArea } from '../services/web/reportRules';
import { withoutGeneralComments } from '../services/web/generalComments';
import { progressSocketService } from '../services/progressSocketService';
import {
  normalizeUnitIdentifier,
  buildInspectionProgressKey,
  doesProgressRecordMatchBuilding,
  doesProgressRecordMatchProperty,
  extractInspectionTypeTokenFromProgressKey,
  isInsideInspectionTypeToken,
  isOutsideInspectionTypeToken,
  isUnitInspectionTypeToken,
  extractUnitSuffixFromInspectionTypeToken,
} from '../utils/inspectionProgressUtils';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, UNIT_LOCATIONS } from '../data/inspectionData';
import { getCompletedUnits } from '../utils/unitInspectionStorage';
import authService from '../services/authService';
import { IN_PROGRESS_SUMMARY_ENABLED } from '../config/featureFlags';

type InspectionCategoriesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InspectionCategories'
>;
type InspectionCategoriesScreenRouteProp = RouteProp<
  RootStackParamList,
  'InspectionCategories'
>;

interface Props {
  navigation: InspectionCategoriesScreenNavigationProp;
  route: InspectionCategoriesScreenRouteProp;
}

const INVALID_PROPERTY_IDENTIFIER_TOKENS = new Set([
  '',
  '-',
  'unknown',
  'null',
  'undefined',
  '[object object]',
]);

const normalizePropertyIdentifier = (value: unknown): string => {
  const raw = String(value ?? '').trim();
  if (!raw) {
    return '';
  }

  if (INVALID_PROPERTY_IDENTIFIER_TOKENS.has(raw.toLowerCase())) {
    return '';
  }

  return raw;
};

const extractProgressRecordPropertyId = (record: any): string => {
  return normalizePropertyIdentifier(
    record?.propertyId?._id ||
    record?.propertyId ||
    record?.propertyId?.propertyId ||
    record?.inspectionData?.property?._id ||
    record?.inspectionData?.property?.propertyId ||
    ''
  );
};

const extractPropertyIdFromProgressKey = (key: string, buildingId: string): string => {
  const normalizedBuildingId = String(buildingId || '').trim();
  if (!normalizedBuildingId || !key.startsWith('inspection_responses_')) {
    return '';
  }

  const marker = `_${normalizedBuildingId}_`;
  const markerIndex = key.indexOf(marker);
  if (markerIndex <= 'inspection_responses_'.length) {
    return '';
  }

  const propertyIdSegment = key.slice('inspection_responses_'.length, markerIndex);
  return normalizePropertyIdentifier(propertyIdSegment);
};

const InspectionCategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId, propertyId: routePropertyId } = route.params;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // Display label only. It used to feed every storage key and the backend
  // building_id, so renaming a building wrote that session's work under a name
  // that resets to buildingId on the next visit -- the data was never read again.
  const [buildingLabel, setBuildingLabel] = useState(buildingId);
  const [editBuildingModalVisible, setEditBuildingModalVisible] = useState(false);
  const [tempBuildingName, setTempBuildingName] = useState(buildingId);

  const [outsideProgress, setOutsideProgress] = useState(0);
  const [insideProgress, setInsideProgress] = useState(0);
  const [unitsProgress, setUnitsProgress] = useState(0);
  const [buildingFindings, setBuildingFindings] = useState<any[]>([]);
  const [deficiencyArea, setDeficiencyArea] = useState<ScoreArea | null>(null);
  const findingsForArea = (area: ScoreArea) =>
    buildingFindings.map(findingFacts).filter(finding => finding.area === area);
  // Web counts the UNITS section in whole units ("(0/1)"), not in answered
  // items — the item-level tally still drives the other sections.
  const [unitsCompleted, setUnitsCompleted] = useState(0);
  const [resolvedPropertyId, setResolvedPropertyId] = useState<string>('');
  const [userLabel, setUserLabel] = useState('');

  useEffect(() => {
    let active = true;
    authService.getStoredUser()
      .then((user) => { if (active) setUserLabel(user?.fullName || ''); })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const cachedUnitStatusMapRef = useRef<Record<string, boolean>>({});
  const unitStatusRequestRef = useRef<{
    requestKey: string;
    promise: Promise<Record<string, boolean>> | null;
    lastResolvedAt: number;
  }>({
    requestKey: '',
    promise: null,
    lastResolvedAt: 0,
  });
  const sectionSyncRequestRef = useRef<{
    requestKey: string;
    promise: Promise<void> | null;
    lastResolvedAt: number;
  }>({
    requestKey: '',
    promise: null,
    lastResolvedAt: 0,
  });

  const totalUnitPossible = ((selectedUnits ? selectedUnits.length : 1) * UNIT_ITEMS.length) || 0;

  const extractPropertyIdFromUnknownProperty = useCallback((propertyValue: any): string => {
    if (propertyValue && typeof propertyValue === 'object') {
      return normalizePropertyIdentifier(
        propertyValue?._id || propertyValue?.id || propertyValue?.propertyId || ''
      );
    }

    const propertyString = normalizePropertyIdentifier(propertyValue);
    if (!propertyString) {
      return '';
    }

    if (propertyString.startsWith('{') && propertyString.endsWith('}')) {
      try {
        const parsed = JSON.parse(propertyString);
        return normalizePropertyIdentifier(parsed?._id || parsed?.id || parsed?.propertyId || '');
      } catch {
        return '';
      }
    }

    return propertyString;
  }, []);

  const getDirectPropertyIdentifier = useCallback(() => {
    const explicitRouteIdentifier = normalizePropertyIdentifier(routePropertyId);
    if (explicitRouteIdentifier) {
      return explicitRouteIdentifier;
    }

    return extractPropertyIdFromUnknownProperty(property);
  }, [routePropertyId, property, extractPropertyIdFromUnknownProperty]);

  const getPropertyIdentifier = useCallback(() => {
    const directPropertyId = getDirectPropertyIdentifier();
    return directPropertyId || resolvedPropertyId || 'unknown';
  }, [getDirectPropertyIdentifier, resolvedPropertyId]);

  const inferPropertyIdentifierFromGlobalProgress = useCallback(() => {
    const normalizedBuildingId = String(buildingId || '').trim();
    if (!normalizedBuildingId) {
      return '';
    }

    const matchingEntries = Object.entries(globalInspectionProgress || {}).filter(([key, value]) => {
      if (!key.startsWith('inspection_responses_')) {
        return false;
      }

      if (!key.includes(`_${normalizedBuildingId}_`)) {
        return false;
      }

      if (!value || typeof value !== 'object') {
        return false;
      }

      return Object.keys(value as Record<string, any>).length > 0;
    });

    const prioritizedEntries = matchingEntries.sort(([keyA], [keyB]) => {
      const lowerA = keyA.toLowerCase();
      const lowerB = keyB.toLowerCase();

      const score = (key: string) => {
        if (key.includes('_outside')) return 3;
        if (key.includes('_inside')) return 2;
        if (key.includes('_unit_')) return 1;
        return 0;
      };

      return score(lowerB) - score(lowerA);
    });

    for (const [key] of prioritizedEntries) {
      const inferredPropertyId = extractPropertyIdFromProgressKey(key, normalizedBuildingId);
      if (inferredPropertyId) {
        return inferredPropertyId;
      }
    }

    return '';
  }, [buildingId]);

  const resolvePropertyIdentifier = useCallback(async (): Promise<string> => {
    const directPropertyId = getDirectPropertyIdentifier();
    if (directPropertyId) {
      setResolvedPropertyId(directPropertyId);
      return directPropertyId;
    }

    const inferredFromGlobalProgress = inferPropertyIdentifierFromGlobalProgress();
    if (inferredFromGlobalProgress) {
      setResolvedPropertyId(inferredFromGlobalProgress);
      return inferredFromGlobalProgress;
    }

    try {
      const draftHintRes = await inspectionService.getAllProgress({
        inspectionTypePrefix: 'REPORT_DRAFT_PROPERTY',
        timeoutMs: 10000,
      });

      let allProgressRecords = Array.isArray(draftHintRes?.progress) ? draftHintRes.progress : [];

      if (allProgressRecords.length === 0) {
        const apiRes = await inspectionService.getAllProgress({ timeoutMs: 15000 });
        allProgressRecords = Array.isArray(apiRes?.progress) ? apiRes.progress : [];
      }

      const selectedUnitTokens = new Set(
        (selectedUnits || [])
          .map((unit) => normalizeUnitIdentifier(unit))
          .filter(Boolean)
      );

      const relevantProgressRecords = allProgressRecords
        .filter((record: any) => doesProgressRecordMatchBuilding(record, buildingId))
        .filter((record: any) => {
          if (selectedUnitTokens.size === 0) {
            return true;
          }

          const inspectionTypeToken = String(record?.inspectionType || '').trim();
          if (!isUnitInspectionTypeToken(inspectionTypeToken)) {
            return true;
          }

          const unitSuffix = extractUnitSuffixFromInspectionTypeToken(inspectionTypeToken);
          if (!unitSuffix) {
            return true;
          }

          return selectedUnitTokens.has(normalizeUnitIdentifier(unitSuffix));
        })
        .sort((a: any, b: any) => {
          const aTime = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
          const bTime = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
          return bTime - aTime;
        });

      const inferredPropertyId = relevantProgressRecords
        .map((record: any) => extractProgressRecordPropertyId(record))
        .find(Boolean);

      if (inferredPropertyId) {
        setResolvedPropertyId(inferredPropertyId);
        return inferredPropertyId;
      }
    } catch (error) {
      console.log('Could not infer property identifier from progress records', error);
    }

    setResolvedPropertyId('unknown');
    return 'unknown';
  }, [getDirectPropertyIdentifier, selectedUnits, buildingId, inferPropertyIdentifierFromGlobalProgress]);

  useEffect(() => {
    const directPropertyId = getDirectPropertyIdentifier();
    if (directPropertyId && directPropertyId !== resolvedPropertyId) {
      setResolvedPropertyId(directPropertyId);
    }
  }, [getDirectPropertyIdentifier, resolvedPropertyId]);

  const mergeUnitStatusMaps = useCallback((...statusMaps: Array<Record<string, boolean> | undefined>) => {
    const merged: Record<string, boolean> = {};

    statusMaps.forEach((statusMap) => {
      if (!statusMap || typeof statusMap !== 'object') {
        return;
      }

      Object.entries(statusMap).forEach(([unitKey, isCompleted]) => {
        const normalizedUnitKey = normalizeUnitIdentifier(unitKey);
        if (!normalizedUnitKey) {
          return;
        }

        merged[normalizedUnitKey] = Boolean(merged[normalizedUnitKey] || isCompleted);
      });
    });

    return merged;
  }, []);

  const getLocalCompletedUnitStatusMap = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      return {};
    }

    try {
      const completedUnits = await getCompletedUnits(propId, String(buildingId || ''));
      const localStatusMap: Record<string, boolean> = {};

      (completedUnits || []).forEach((unitName) => {
        const normalizedUnitKey = normalizeUnitIdentifier(unitName);
        if (normalizedUnitKey) {
          localStatusMap[normalizedUnitKey] = true;
        }
      });

      return localStatusMap;
    } catch (error) {
      console.log('Could not load local completed units for categories screen', error);
      return {};
    }
  }, [getPropertyIdentifier, buildingId]);

  const hydrateSectionProgressFromDeviceCache = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      return;
    }

    const outsideKey = buildInspectionProgressKey({
      propertyId: propId,
      buildingId: buildingId,
      inspectionType: 'Outside',
    });

    const insideKey = buildInspectionProgressKey({
      propertyId: propId,
      buildingId: buildingId,
      inspectionType: 'Inside',
    });

    try {
      const [outsideCached, insideCached] = await Promise.all([
        AsyncStorage.getItem(outsideKey),
        AsyncStorage.getItem(insideKey),
      ]);

      const applyCachedPayload = (targetKey: string, payload: string | null) => {
        if (!payload) {
          return;
        }

        try {
          const parsed = JSON.parse(payload);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            globalInspectionProgress[targetKey] = parsed;
          }
        } catch {
          // Ignore malformed payloads and continue hydration.
        }
      };

      applyCachedPayload(outsideKey, outsideCached);
      applyCachedPayload(insideKey, insideCached);
    } catch (cacheError) {
      console.log('Could not hydrate section progress from device cache', cacheError);
    }
  }, [buildingId, getPropertyIdentifier]);

  const fetchBackendUnitStatus = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      cachedUnitStatusMapRef.current = {};
      return {};
    }

    const requestKey = `${propId}::${String(buildingId || '').trim()}`;
    const now = Date.now();

    if (
      unitStatusRequestRef.current.requestKey === requestKey &&
      unitStatusRequestRef.current.promise
    ) {
      return unitStatusRequestRef.current.promise;
    }

    if (
      unitStatusRequestRef.current.requestKey === requestKey &&
      now - unitStatusRequestRef.current.lastResolvedAt < 1500
    ) {
      return cachedUnitStatusMapRef.current;
    }

    const requestPromise = (async () => {
      const backendUnitStatus = await inspectionService.getUnitInspectionStatus({
        property_id: String(propId),
        building_id: String(buildingId || ''),
      });

      const normalizedStatusMap: Record<string, boolean> = {};

      if (backendUnitStatus?.unitStatusMap && typeof backendUnitStatus.unitStatusMap === 'object') {
        Object.entries(backendUnitStatus.unitStatusMap).forEach(([unitKey, isInspected]) => {
          const normalizedUnitKey = normalizeUnitIdentifier(unitKey);
          if (normalizedUnitKey) {
            normalizedStatusMap[normalizedUnitKey] = Boolean(isInspected);
          }
        });
      }

      if (Array.isArray(backendUnitStatus?.statuses)) {
        backendUnitStatus.statuses.forEach((statusEntry) => {
          const normalizedUnitKey = normalizeUnitIdentifier(
            statusEntry?.normalizedUnitKey || statusEntry?.unitLabel
          );

          if (normalizedUnitKey) {
            normalizedStatusMap[normalizedUnitKey] = Boolean(statusEntry?.isInspected);
          }
        });
      }

      cachedUnitStatusMapRef.current = normalizedStatusMap;
      return normalizedStatusMap;
    })();

    unitStatusRequestRef.current = {
      requestKey,
      promise: requestPromise,
      lastResolvedAt: unitStatusRequestRef.current.lastResolvedAt,
    };

    try {
      const resolvedMap = await requestPromise;
      unitStatusRequestRef.current = {
        requestKey,
        promise: null,
        lastResolvedAt: Date.now(),
      };
      return resolvedMap;
    } catch (error) {
      unitStatusRequestRef.current = {
        requestKey,
        promise: null,
        lastResolvedAt: Date.now(),
      };
      throw error;
    }
  }, [getPropertyIdentifier, buildingId]);

  const syncOutsideInsideFromBackend = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      return;
    }

    const requestKey = `${propId}::${String(buildingId || '').trim()}::outside-inside`;
    const now = Date.now();

    if (
      sectionSyncRequestRef.current.requestKey === requestKey &&
      sectionSyncRequestRef.current.promise
    ) {
      return sectionSyncRequestRef.current.promise;
    }

    if (
      sectionSyncRequestRef.current.requestKey === requestKey &&
      now - sectionSyncRequestRef.current.lastResolvedAt < 1000
    ) {
      return;
    }

    const syncPromise = (async () => {
      const sectionTypes: Array<'Outside' | 'Inside'> = ['Outside', 'Inside'];

      const results = await Promise.allSettled(
        sectionTypes.map((inspectionType) =>
          inspectionService.getProgress({
            property_id: propId,
            unit_id: String(buildingId || ''),
            inspection_type: inspectionType,
          })
        )
      );

      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') {
          return;
        }

        const payload = result.value;
        if (!payload?.items || typeof payload.items !== 'object' || Object.keys(payload.items).length === 0) {
          return;
        }

        const inspectionType = sectionTypes[index];
        const key = buildInspectionProgressKey({
          propertyId: propId,
          buildingId: buildingId,
          inspectionType,
          inspectionData: payload.inspectionData,
        });

        globalInspectionProgress[key] = payload.items;
      });
    })();

    sectionSyncRequestRef.current = {
      requestKey,
      promise: syncPromise,
      lastResolvedAt: sectionSyncRequestRef.current.lastResolvedAt,
    };

    try {
      await syncPromise;
      sectionSyncRequestRef.current = {
        requestKey,
        promise: null,
        lastResolvedAt: Date.now(),
      };
    } catch {
      sectionSyncRequestRef.current = {
        requestKey,
        promise: null,
        lastResolvedAt: Date.now(),
      };
    }
  }, [getPropertyIdentifier, buildingId]);

  const updateLocalState = useCallback((propertyIdentifier?: string, backendStatusOverride?: Record<string, boolean>) => {
    const propId = propertyIdentifier || getPropertyIdentifier();
    const keyPrefix = `inspection_responses_${propId}_${buildingId}_`;

    const progressEntries = Object.entries(globalInspectionProgress).filter(
      ([key, value]) =>
        key.startsWith(keyPrefix) &&
        value &&
        typeof value === 'object'
    ) as Array<[string, Record<string, any>]>;

    const outsideEntry = progressEntries.find(([key]) => {
      const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, keyPrefix);
      return isOutsideInspectionTypeToken(inspectionTypeToken);
    });

    const insideEntry = progressEntries.find(([key]) => {
      const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, keyPrefix);
      return isInsideInspectionTypeToken(inspectionTypeToken);
    });

    setOutsideProgress(outsideEntry ? Object.keys(outsideEntry[1] || {}).length : 0);
    setInsideProgress(insideEntry ? Object.keys(insideEntry[1] || {}).length : 0);

    const unitEntries = progressEntries.filter(([key]) => {
      const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, keyPrefix);
      return isUnitInspectionTypeToken(inspectionTypeToken);
    });

    let totalUn = 0;
    const selectedUnitSet = new Set(
      (selectedUnits || [])
        .map((unit) => normalizeUnitIdentifier(unit))
        .filter(Boolean)
    );

    if (unitEntries.length > 0) {
      const sumEntryResponses = (entries: Array<[string, Record<string, any>]>) => {
        return entries.reduce((sum, [, unitData]) => {
          return sum + Object.keys(unitData || {}).length;
        }, 0);
      };

      if (selectedUnitSet.size > 0) {
        const matchedEntries = unitEntries.filter(([key]) => {
          const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, keyPrefix);
          const unitSuffix = extractUnitSuffixFromInspectionTypeToken(inspectionTypeToken);
          return unitSuffix && selectedUnitSet.has(normalizeUnitIdentifier(unitSuffix));
        });

        totalUn = matchedEntries.length > 0
          ? sumEntryResponses(matchedEntries)
          : sumEntryResponses(unitEntries);
      } else {
        totalUn = sumEntryResponses(unitEntries);
      }
    }

    const activeBackendStatusMap = backendStatusOverride || cachedUnitStatusMapRef.current;
    const backendCompletedUnitsCount = selectedUnitSet.size > 0
      ? Array.from(selectedUnitSet).filter((unitKey) => Boolean(activeBackendStatusMap[unitKey])).length
      : Object.values(activeBackendStatusMap).filter(Boolean).length;

    const backendDerivedProgress = backendCompletedUnitsCount * UNIT_ITEMS.length;
    const effectiveUnitProgress = Math.min(
      totalUnitPossible,
      Math.max(totalUn, backendDerivedProgress)
    );

    setUnitsProgress(effectiveUnitProgress);
    setUnitsCompleted(
      UNIT_ITEMS.length > 0 ? Math.floor(effectiveUnitProgress / UNIT_ITEMS.length) : 0
    );
  }, [buildingId, selectedUnits, getPropertyIdentifier, totalUnitPossible]);

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const fetchProgress = async () => {
        try {
          const quickPropertyId = normalizePropertyIdentifier(getPropertyIdentifier());
          if (quickPropertyId) {
            updateLocalState(quickPropertyId, cachedUnitStatusMapRef.current);
          }

          const propId = await resolvePropertyIdentifier();

          inspectionService.getAllProgress({ propertyId: propId, buildingId, timeoutMs: 8000 })
            .then(({ success, progress }) => {
              if (success && !isCancelled) {
                setBuildingFindings(uniqueReportFindings(withoutGeneralComments(findingsFromProgress(progress))));
              }
            })
            .catch(() => {});

          await hydrateSectionProgressFromDeviceCache(propId);
          updateLocalState(propId, cachedUnitStatusMapRef.current);

          let latestBackendUnitStatusMap: Record<string, boolean> = {};
          let latestLocalUnitStatusMap: Record<string, boolean> = {};

          const backendStatusPromise = fetchBackendUnitStatus(propId)
            .catch((statusError) => {
              console.log('Could not sync backend unit status in categories screen', statusError);
              return {};
            });

          try {
            latestLocalUnitStatusMap = await getLocalCompletedUnitStatusMap(propId);
          } catch (statusError) {
            console.log('Could not sync local unit status in categories screen', statusError);
          }

          const initialStatusMap = mergeUnitStatusMaps(
            cachedUnitStatusMapRef.current,
            latestLocalUnitStatusMap
          );
          cachedUnitStatusMapRef.current = initialStatusMap;

          // Render instantly from memory first
          updateLocalState(propId, initialStatusMap);

          // Lightweight targeted section sync (faster and less timeout-prone than full progress scan)
          await syncOutsideInsideFromBackend(propId);
          updateLocalState(propId, initialStatusMap);

          if (!isCancelled) {
            latestBackendUnitStatusMap = await backendStatusPromise;

            const refreshedStatusMap = mergeUnitStatusMaps(
              latestBackendUnitStatusMap,
              latestLocalUnitStatusMap
            );
            cachedUnitStatusMapRef.current = refreshedStatusMap;

            updateLocalState(propId, refreshedStatusMap);
          }

        } catch (e) {
          console.error('Failed to load progress', e);
        }
      };

      fetchProgress();

      return () => {
        isCancelled = true;
      };
    }, [property, buildingId, selectedUnits, updateLocalState, fetchBackendUnitStatus, resolvePropertyIdentifier, getLocalCompletedUnitStatusMap, mergeUnitStatusMaps, getPropertyIdentifier, hydrateSectionProgressFromDeviceCache, syncOutsideInsideFromBackend])
  );

  useEffect(() => {
    const propId = getPropertyIdentifier();

    const unsubscribe = progressSocketService.subscribe((progressUpdate) => {
      const progressLikeRecord = {
        propertyId: progressUpdate.propertyId,
        buildingId: progressUpdate.buildingId,
        unitId: progressUpdate.buildingId,
        inspectionType: progressUpdate.inspectionType,
      };

      if (!doesProgressRecordMatchBuilding(progressLikeRecord, buildingId)) {
        return;
      }

      const currentPropertyId = normalizePropertyIdentifier(propId);
      const socketPropertyId = normalizePropertyIdentifier(progressUpdate.propertyId);
      const matchesCurrentProperty = doesProgressRecordMatchProperty(progressLikeRecord, property);
      const hasMatchingExplicitPropertyId =
        !!currentPropertyId &&
        !!socketPropertyId &&
        currentPropertyId === socketPropertyId;
      const canFallbackToSocketPropertyId = !currentPropertyId && !!socketPropertyId;
      const shouldApplySocketProgress =
        matchesCurrentProperty ||
        hasMatchingExplicitPropertyId ||
        canFallbackToSocketPropertyId;

      if (!shouldApplySocketProgress) return;

      const effectiveSocketPropertyId = currentPropertyId || socketPropertyId || normalizePropertyIdentifier(resolvedPropertyId);
      const inspectionTypeToken = String(progressUpdate.inspectionType || '').trim();
      const isUnitProgressUpdate = isUnitInspectionTypeToken(inspectionTypeToken);

      if (effectiveSocketPropertyId) {
        const key = buildInspectionProgressKey({
          propertyId: effectiveSocketPropertyId,
          buildingId: buildingId,
          inspectionType: progressUpdate.inspectionType,
        });

        globalInspectionProgress[key] = progressUpdate.responses || {};
      }

      if (isUnitProgressUpdate) {
        const syncUnitsFromBackend = async () => {
          let effectivePropertyId = normalizePropertyIdentifier(propId);

          if (!effectivePropertyId) {
            effectivePropertyId =
              normalizePropertyIdentifier(progressUpdate.propertyId) ||
              normalizePropertyIdentifier(await resolvePropertyIdentifier());
          }

          if (!effectivePropertyId) {
            updateLocalState(propId);
            return;
          }

          const [latestBackendUnitStatusMap, latestLocalUnitStatusMap] = await Promise.all([
            fetchBackendUnitStatus(effectivePropertyId),
            getLocalCompletedUnitStatusMap(effectivePropertyId),
          ]);
          const mergedUnitStatusMap = mergeUnitStatusMaps(
            latestBackendUnitStatusMap,
            latestLocalUnitStatusMap
          );
          cachedUnitStatusMapRef.current = mergedUnitStatusMap;
          updateLocalState(effectivePropertyId, mergedUnitStatusMap);
        };

        syncUnitsFromBackend()
          .catch(() => {
            updateLocalState(propId);
          })
          ;
        return;
      }

      updateLocalState(effectiveSocketPropertyId || propId);
    });

    return unsubscribe;
  }, [property, buildingId, getPropertyIdentifier, updateLocalState, fetchBackendUnitStatus, resolvePropertyIdentifier, getLocalCompletedUnitStatusMap, mergeUnitStatusMaps, resolvedPropertyId]);

  const openBuildingEditModal = () => {
    setTempBuildingName(buildingLabel);
    setEditBuildingModalVisible(true);
  };

  const handleSaveBuildingName = () => {
    setBuildingLabel(tempBuildingName.trim() || buildingId);
    setEditBuildingModalVisible(false);
  };

  const handleCancelBuildingEdit = () => {
    setEditBuildingModalVisible(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleOutsidePress = () => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId: buildingId,
      location: 'Outside',
    });
  };

  const handleInsidePress = () => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId: buildingId,
      location: 'Inside',
    });
  };

  const handleUnitsPress = () => {
    // A building can have no units to inspect. Its Outside and Inside above are
    // still inspected; there is simply no unit to open. The words are the web's,
    // from its unit picker.
    if (!selectedUnits || selectedUnits.length === 0) {
      Alert.alert('No units allocated to this building.', 'This building has 0 allocated inspection units.');
      return;
    }
    navigation.navigate('PropertyInfo', {
      property,
      selectedUnits,
      buildingId: buildingId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mobile web parity: teal NSPIRE INSPECTION bar carries the back arrow,
          then the Building Unique ID row with its pencil and the Summary pill. */}
      <View style={styles.nspireBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.nspireBack}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.nspirePill}>
          <Ionicons name="shield-checkmark" size={20} color="#006795" />
          <Text style={styles.nspirePillText}>NSPIRE INSPECTION</Text>
        </View>
        <Text style={styles.nspireUser} numberOfLines={1}>{userLabel}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buildingRow}>
          <View style={styles.buildingRowLeft}>
            <Text style={styles.buildingTitle}>BUILDING UNIQUE ID: {buildingLabel}</Text>
            <TouchableOpacity onPress={openBuildingEditModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              {/* The edit pen is red (client's "Final correction", C3). */}
              <Ionicons name="create-outline" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
          {/* Drawn only while IN_PROGRESS_SUMMARY_ENABLED is on
              (config/featureFlags): opening the summary in the middle of an
              inspection cleared the unit inspection. */}
          {IN_PROGRESS_SUMMARY_ENABLED && (
            <TouchableOpacity
              style={styles.summaryButton}
              onPress={() => {
                if (!IN_PROGRESS_SUMMARY_ENABLED) return;
                navigation.navigate('InspectionSummary' as any, {
                  property,
                  selectedUnits,
                  buildingId,
                  inspectionData: null,
                });
              }}
            >
              <Ionicons name="document-text-outline" size={14} color="#FFFFFF" />
              <Text style={styles.summaryButtonText}>SUMMARY</Text>
            </TouchableOpacity>
          )}
        </View>

        {[
          {
            title: 'OUTSIDE (AREAS AFFECTED BY RAIN, SNOW, WIND)',
            done: outsideProgress,
            total: OUTSIDE_ITEMS.length,
            area: 'outside' as const,
            deficiencies: findingsForArea('outside').length,
            onPress: handleOutsidePress,
          },
          {
            title: 'INSIDE (INTERIOR COMMON AREA, UTILITY CLOSET, MECHANICAL ROOMS)',
            done: insideProgress,
            total: INSIDE_ITEMS.length,
            area: 'inside' as const,
            deficiencies: findingsForArea('inside').length,
            onPress: handleInsidePress,
          },
          {
            title: 'UNITS (INDIVIDUAL UNIT INSPECTIONS)',
            done: unitsCompleted,
            total: selectedUnits?.length || 0,
            area: 'unit' as const,
            deficiencies: findingsForArea('unit').length,
            onPress: handleUnitsPress,
            showNext: true,
          },
        ].map((section) => {
          const pct = section.total > 0
            ? Math.min(100, Math.round((section.done / section.total) * 100))
            : 0;
          return (
            <View key={section.title} style={styles.categoryCard}>
              <TouchableOpacity
                style={styles.categoryInner}
                onPress={section.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{section.title}</Text>
                  <View style={styles.categoryCountRow}>
                    <Text style={styles.categoryCount}>({section.done}/{section.total})</Text>
                    <Text style={styles.categoryCount}>{pct}% Completed</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${pct}%` }]} />
                  </View>
                  {section.deficiencies > 0 && (
                    <TouchableOpacity
                      style={styles.deficiencyButton}
                      onPress={() => setDeficiencyArea(section.area)}
                    >
                      <Ionicons name="document-text-outline" size={12} color="#FFFFFF" />
                      <Text style={styles.deficiencyButtonText}>
                        {buildingId} {section.area === 'unit' ? 'Units' : section.area === 'outside' ? 'Outside' : 'Inside'} Deficiencies ({section.deficiencies})
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {section.showNext && section.total > 0 ? (
                  <View style={styles.unitsNextButton}>
                    <Text style={styles.unitsNextLabel}>NEXT</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-down" size={24} color="#006795" />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={deficiencyArea !== null} transparent animationType="fade" onRequestClose={() => setDeficiencyArea(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{buildingId} · {deficiencyArea === 'unit' ? 'Units' : deficiencyArea === 'inside' ? 'Inside' : 'Outside'} Deficiencies</Text>
              <TouchableOpacity accessibilityLabel="Close deficiencies" onPress={() => setDeficiencyArea(null)}>
                <Ionicons name="close" size={24} color="#006795" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
              {deficiencyArea && findingsForArea(deficiencyArea).map((finding, index) => (
                <View key={index} style={{ gap: 4 }}>
                  <Text style={{ fontWeight: '700' }}>{finding.name || finding.details}</Text>
                  {!!finding.unit && <Text>{finding.unit}</Text>}
                  {!!finding.note && <Text>{finding.note}</Text>}
                  {!!finding.picture && <Image accessibilityLabel="Saved deficiency photo" source={{ uri: finding.picture }} style={{ width: 96, height: 72, borderRadius: 6 }} />}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Building Name Modal */}
      <Modal
        visible={editBuildingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelBuildingEdit}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Building Name</Text>
              <TouchableOpacity onPress={handleCancelBuildingEdit}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputRow}>
              <Text style={styles.modalInputLabel}>Building Name</Text>
              <TextInput
                style={styles.modalInput}
                value={tempBuildingName}
                onChangeText={setTempBuildingName}
                placeholder="Enter building name"
                placeholderTextColor="#9CA3AF"
                selectTextOnFocus
                autoFocus
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCancelBuildingEdit}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveBuildingName}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // --- Mobile web (/dashboard/inspection-category) parity ---
  nspireBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D7FA8',
    borderRadius: 14,
    margin: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  nspireBack: {
    padding: 4,
  },
  nspirePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nspirePillText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#006795',
    letterSpacing: -0.3,
  },
  nspireUser: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 70,
  },
  buildingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  buildingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  categoryCard: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryInner: {
    backgroundColor: '#EBF5FF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 11,
    fontWeight: '900',
    color: '#006795',
  },
  deficiencyButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F84B5F',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deficiencyButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#006795',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  summaryButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  buildingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flexShrink: 1,
  },
  unitsNextButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  unitsNextLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '800',
  },
  unitsInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
    marginLeft: 32,
  },
  categoryInfo: {
    flex: 1,
  },
  // The area to inspect -- Outside, Inside, Units -- is named in red
  // (client's "Final correction", C2: area selection).
  categoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    backgroundColor: '#006795',
    borderRadius: 999,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalInputRow: {
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#0E7490',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default InspectionCategoriesScreen;
