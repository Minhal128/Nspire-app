import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { globalInspectionProgress } from '../utils/globalState';
import { inspectionService } from '../services/inspectionService';
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
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, UNIT_LOCATIONS } from '../data/inspectionData';
import { getCompletedUnits } from '../utils/unitInspectionStorage';

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
  const [buildingName, setBuildingName] = useState(buildingId);
  const [editBuildingModalVisible, setEditBuildingModalVisible] = useState(false);
  const [tempBuildingName, setTempBuildingName] = useState(buildingId);

  const [outsideProgress, setOutsideProgress] = useState(0);
  const [insideProgress, setInsideProgress] = useState(0);
  const [unitsProgress, setUnitsProgress] = useState(0);
  const [resolvedPropertyId, setResolvedPropertyId] = useState<string>('');
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
    const normalizedBuildingId = String(buildingName || '').trim();
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
  }, [buildingName]);

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
      const apiRes = await inspectionService.getAllProgress();
      const allProgressRecords = Array.isArray(apiRes?.progress) ? apiRes.progress : [];

      const selectedUnitTokens = new Set(
        (selectedUnits || [])
          .map((unit) => normalizeUnitIdentifier(unit))
          .filter(Boolean)
      );

      const relevantProgressRecords = allProgressRecords
        .filter((record: any) => doesProgressRecordMatchBuilding(record, buildingName))
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
  }, [getDirectPropertyIdentifier, selectedUnits, buildingName, inferPropertyIdentifierFromGlobalProgress]);

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
      const completedUnits = await getCompletedUnits(propId, String(buildingName || ''));
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
  }, [getPropertyIdentifier, buildingName]);

  const hydrateSectionProgressFromDeviceCache = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      return;
    }

    const outsideKey = buildInspectionProgressKey({
      propertyId: propId,
      buildingId: buildingName,
      inspectionType: 'Outside',
    });

    const insideKey = buildInspectionProgressKey({
      propertyId: propId,
      buildingId: buildingName,
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
  }, [buildingName, getPropertyIdentifier]);

  const fetchBackendUnitStatus = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      cachedUnitStatusMapRef.current = {};
      return {};
    }

    const requestKey = `${propId}::${String(buildingName || '').trim()}`;
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
        building_id: String(buildingName || ''),
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
  }, [getPropertyIdentifier, buildingName]);

  const syncOutsideInsideFromBackend = useCallback(async (propertyIdentifier?: string) => {
    const propId = normalizePropertyIdentifier(propertyIdentifier || getPropertyIdentifier());
    if (!propId) {
      return;
    }

    const requestKey = `${propId}::${String(buildingName || '').trim()}::outside-inside`;
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
            unit_id: String(buildingName || ''),
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
          buildingId: buildingName,
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
  }, [getPropertyIdentifier, buildingName]);

  const updateLocalState = useCallback((propertyIdentifier?: string, backendStatusOverride?: Record<string, boolean>) => {
    const propId = propertyIdentifier || getPropertyIdentifier();
    const keyPrefix = `inspection_responses_${propId}_${buildingName}_`;

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
  }, [buildingName, selectedUnits, getPropertyIdentifier, totalUnitPossible]);

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
    }, [property, buildingName, selectedUnits, updateLocalState, fetchBackendUnitStatus, resolvePropertyIdentifier, getLocalCompletedUnitStatusMap, mergeUnitStatusMaps, getPropertyIdentifier, hydrateSectionProgressFromDeviceCache, syncOutsideInsideFromBackend])
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

      if (!doesProgressRecordMatchBuilding(progressLikeRecord, buildingName)) {
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

      const effectiveSocketPropertyId = currentPropertyId || socketPropertyId || normalizePropertyIdentifier(resolvedPropertyId);
      const inspectionTypeToken = String(progressUpdate.inspectionType || '').trim();
      const isUnitProgressUpdate = isUnitInspectionTypeToken(inspectionTypeToken);

      if (shouldApplySocketProgress && effectiveSocketPropertyId) {
        const key = buildInspectionProgressKey({
          propertyId: effectiveSocketPropertyId,
          buildingId: buildingName,
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
  }, [property, buildingName, getPropertyIdentifier, updateLocalState, fetchBackendUnitStatus, resolvePropertyIdentifier, getLocalCompletedUnitStatusMap, mergeUnitStatusMaps, resolvedPropertyId]);

  const openBuildingEditModal = () => {
    setTempBuildingName(buildingName);
    setEditBuildingModalVisible(true);
  };

  const handleSaveBuildingName = () => {
    setBuildingName(tempBuildingName.trim() || buildingId);
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
      buildingId: buildingName,
      location: 'Outside',
    });
  };

  const handleInsidePress = () => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId: buildingName,
      location: 'Inside',
    });
  };

  const handleUnitsPress = () => {
    navigation.navigate('PropertyInfo', {
      property,
      selectedUnits,
      buildingId: buildingName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Categories</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Building Info Card */}
        <View style={styles.buildingCard}>
          <View style={styles.buildingHeader}>
            <Ionicons name="business-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buildingTitle}>BUILDING NO: {buildingName}</Text>
          </View>
        </View>


        {/* OUTSIDE Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleOutsidePress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="rainy-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>OUTSIDE</Text>
              <Text style={styles.categorySubtitle}>
                Areas affected by rain, snow, wind
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(100, Math.round((outsideProgress / OUTSIDE_ITEMS.length) * 100))}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {outsideProgress}/{OUTSIDE_ITEMS.length} • {Math.min(100, Math.round((outsideProgress / OUTSIDE_ITEMS.length) * 100))}% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>

        {/* INSIDE Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleInsidePress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="home-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>INSIDE</Text>
              <Text style={styles.categorySubtitle}>
                Interior common area, utility closet, mechanical rooms
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(100, Math.round((insideProgress / INSIDE_ITEMS.length) * 100))}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {insideProgress}/{INSIDE_ITEMS.length} • {Math.min(100, Math.round((insideProgress / INSIDE_ITEMS.length) * 100))}% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>

        {/* UNITS Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleUnitsPress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="grid-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>UNITS</Text>
              <Text style={styles.categorySubtitle}>
                Individual unit inspections
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  {(() => {
                    const pct = Math.min(100, Math.round((unitsProgress / totalUnitPossible) * 100)) || 0;
                    return <View style={[styles.progressFill, { width: `${pct}%` }]} />;
                  })()}
                </View>
                <Text style={styles.progressText}>
                  {unitsProgress}/{totalUnitPossible} • {Math.min(100, Math.round((unitsProgress / totalUnitPossible) * 100)) || 0}% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
  buildingCard: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buildingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  buildingEditBtn: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 6,
  },
  buildingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  unitsInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
    marginLeft: 32,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
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
