import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Colors } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import {
  initializePropertyInspectionState,
  markUnitCompleted,
  getCompletedUnits,
  resetPropertyInspectionState,
} from '../utils/unitInspectionStorage';
import { getData } from '../utils/storage';
import { globalInspectionProgress } from '../utils/globalState';
import { inspectionService } from '../services/inspectionService';
import { progressSocketService } from '../services/progressSocketService';
import {
  normalizeUnitIdentifier,
  buildInspectionProgressKey,
  doesProgressRecordMatchBuilding,
  doesProgressRecordMatchProperty,
  extractInspectionTypeTokenFromProgressKey,
  isUnitInspectionTypeToken,
  extractUnitSuffixFromInspectionTypeToken,
} from '../utils/inspectionProgressUtils';

type PropertyInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PropertyInfo'
>;
type PropertyInfoScreenRouteProp = RouteProp<RootStackParamList, 'PropertyInfo'>;

interface Props {
  navigation: PropertyInfoScreenNavigationProp;
  route: PropertyInfoScreenRouteProp;
}

const PropertyInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, completedUnits: passedCompletedUnits, buildingId: paramBuildingId } = route.params;
  const buildingId = paramBuildingId || 'B1';
  const propertyId = property._id || property.id || property.propertyId || 'unknown';

  // Editable unit names
  const [unitNames, setUnitNames] = useState<string[]>(selectedUnits);
  const [completedUnits, setCompletedUnits] = useState<string[]>(passedCompletedUnits || []);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempUnitNames, setTempUnitNames] = useState<string[]>(selectedUnits);

  const [refreshTick, setRefreshTick] = useState(0);

  const resolveCompletedUnitsFromProgress = useCallback((progressRecords: any[] = []): string[] => {
    const normalizedUnitLookup = new Map<string, string>();

    unitNames.forEach((unitName) => {
      const normalized = normalizeUnitIdentifier(unitName);
      if (normalized) {
        normalizedUnitLookup.set(normalized, unitName);
      }
    });

    const completedUnitTokens = new Set<string>();

    const markCompletedFromCandidate = (candidate: unknown) => {
      const normalized = normalizeUnitIdentifier(candidate);
      if (!normalized || !normalizedUnitLookup.has(normalized)) {
        return;
      }

      completedUnitTokens.add(normalized);
    };

    progressRecords.forEach((record: any) => {
      if (!doesProgressRecordMatchProperty(record, property)) {
        return;
      }

      if (!doesProgressRecordMatchBuilding(record, buildingId)) {
        return;
      }

      const inspectionType = String(record?.inspectionType || '').trim();
      const inspectionTypeUpper = inspectionType.toUpperCase();
      const hasResponsePayload =
        !!record?.responses &&
        typeof record.responses === 'object' &&
        Object.keys(record.responses).length > 0;

      if (isUnitInspectionTypeToken(inspectionType)) {
        const explicitUnitFromType = extractUnitSuffixFromInspectionTypeToken(inspectionType);
        const fallbackCurrentUnit = String(record?.inspectionData?.currentUnit || '').trim();

        if (hasResponsePayload || fallbackCurrentUnit) {
          markCompletedFromCandidate(explicitUnitFromType || fallbackCurrentUnit);
        }
      }

      if (!inspectionTypeUpper.startsWith('REPORT_DRAFT_')) {
        return;
      }

      const draftDeficiencies = Array.isArray(record?.inspectionData?.deficiencies)
        ? record.inspectionData.deficiencies
        : [];

      draftDeficiencies.forEach((deficiencyItem: any) => {
        [
          deficiencyItem?._unit,
          deficiencyItem?.unit,
          deficiencyItem?.unitId,
          deficiencyItem?.currentUnit,
        ].forEach(markCompletedFromCandidate);
      });
    });

    return Array.from(completedUnitTokens)
      .map((token) => normalizedUnitLookup.get(token) || '')
      .filter(Boolean);
  }, [unitNames, property, buildingId]);

  const resolveCompletedUnitsFromDeficiencies = useCallback((deficiencies: any[] = []): string[] => {
    const normalizedUnitLookup = new Map<string, string>();
    const targetBuildingToken = String(buildingId || '').trim().toLowerCase();

    unitNames.forEach((unitName) => {
      const normalized = normalizeUnitIdentifier(unitName);
      if (normalized) {
        normalizedUnitLookup.set(normalized, unitName);
      }
    });

    const completedUnitTokens = new Set<string>();

    const markCompletedFromCandidate = (candidate: unknown) => {
      const normalized = normalizeUnitIdentifier(candidate);
      if (!normalized || !normalizedUnitLookup.has(normalized)) {
        return;
      }

      completedUnitTokens.add(normalized);
    };

    deficiencies.forEach((deficiencyItem: any) => {
      if (!deficiencyItem || typeof deficiencyItem !== 'object') {
        return;
      }

      const buildingCandidates = [
        deficiencyItem?.buildingInspectionId,
        deficiencyItem?.building,
        deficiencyItem?.buildingName,
        deficiencyItem?.buildingId,
      ]
        .map((candidate) => String(candidate || '').trim().toLowerCase())
        .filter(Boolean);

      const hasExplicitBuilding = buildingCandidates.length > 0;
      const matchesBuilding =
        !targetBuildingToken ||
        !hasExplicitBuilding ||
        buildingCandidates.includes(targetBuildingToken);

      if (!matchesBuilding) {
        return;
      }

      [
        deficiencyItem?._unit,
        deficiencyItem?.unit,
        deficiencyItem?.unitId,
        deficiencyItem?.currentUnit,
      ].forEach(markCompletedFromCandidate);
    });

    return Array.from(completedUnitTokens)
      .map((token) => normalizedUnitLookup.get(token) || '')
      .filter(Boolean);
  }, [unitNames, buildingId]);

  // Load completed units from storage on mount and when returning from inspection
  const loadCompletedUnits = useCallback(async () => {
    try {
      await initializePropertyInspectionState(propertyId, buildingId, unitNames);
      const completed = await getCompletedUnits(propertyId, buildingId);

      const propertyDraftSaveKey = `saved_inspection_${propertyId}`;
      const legacyBuildingDraftSaveKey = `saved_inspection_${propertyId}_${buildingId}`;
      const [propertyDraft, legacyDraft] = await Promise.all([
        getData(propertyDraftSaveKey).catch(() => null),
        legacyBuildingDraftSaveKey !== propertyDraftSaveKey
          ? getData(legacyBuildingDraftSaveKey).catch(() => null)
          : Promise.resolve(null),
      ]);

      const localDraftDeficiencies = [
        ...(Array.isArray(propertyDraft?.deficiencies) ? propertyDraft.deficiencies : []),
        ...(Array.isArray(legacyDraft?.deficiencies) ? legacyDraft.deficiencies : []),
      ];
      const inferredFromLocalDrafts = resolveCompletedUnitsFromDeficiencies(localDraftDeficiencies);

      const backendUnitStatus = await inspectionService.getUnitInspectionStatus({
        property_id: String(propertyId),
        building_id: String(buildingId),
      });

      const inferredFromBackendFlags = unitNames.filter((unitName) => {
        const normalizedUnit = normalizeUnitIdentifier(unitName);
        return Boolean(backendUnitStatus?.unitStatusMap?.[normalizedUnit]);
      });

      // Merge with any passed completed units
      const allCompleted = [...new Set([
        ...completed,
        ...(passedCompletedUnits || []),
        ...inferredFromLocalDrafts,
        ...inferredFromBackendFlags,
      ])];
      setCompletedUnits(allCompleted);

      // Persist any newly passed completed units
      if (passedCompletedUnits && passedCompletedUnits.length > 0) {
        for (const unit of passedCompletedUnits) {
          if (!completed.includes(unit)) {
            await markUnitCompleted(propertyId, buildingId, unit);
          }
        }
      }

      // Sync progress from API to global memory so it reflects checkmarks properly
      try {
        const apiRes = await inspectionService.getAllProgress();
        if (apiRes && apiRes.success && apiRes.progress) {
          const inferredFromProgress = resolveCompletedUnitsFromProgress(apiRes.progress);

          apiRes.progress.forEach((p: any) => {
            if (doesProgressRecordMatchProperty(p, property) && doesProgressRecordMatchBuilding(p, buildingId)) {
              const key = buildInspectionProgressKey({
                propertyId,
                buildingId,
                inspectionType: p.inspectionType,
                inspectionData: p.inspectionData,
              });

              if (p.responses && Object.keys(p.responses).length > 0) {
                globalInspectionProgress[key] = p.responses;
              }
            }
          });

          const mergedCompletedUnits = Array.from(new Set([
            ...allCompleted,
            ...inferredFromProgress,
          ]));

          setCompletedUnits(mergedCompletedUnits);

          await Promise.all(
            mergedCompletedUnits.map(async (unitName) => {
              if (!completed.includes(unitName)) {
                await markUnitCompleted(propertyId, buildingId, unitName);
              }
            })
          );

          setRefreshTick(tick => tick + 1); // trigger re-render of checkmarks
        }
      } catch (e) {
        console.log("Could not sync from API in PropertyInfoScreen", e);
      }

    } catch (error) {
      console.error('Error loading completed units:', error);
    }
  }, [propertyId, buildingId, unitNames, passedCompletedUnits, resolveCompletedUnitsFromProgress, resolveCompletedUnitsFromDeficiencies, property]);

  useEffect(() => {
    loadCompletedUnits();
  }, [loadCompletedUnits]);

  // Refresh on screen focus (when coming back from inspection flow)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCompletedUnits();
      setRefreshTick(tick => tick + 1);
    });
    return unsubscribe;
  }, [navigation, loadCompletedUnits]);

  useEffect(() => {
    const unsubscribe = progressSocketService.subscribe((progressUpdate) => {
      const progressLikeRecord = {
        propertyId: progressUpdate.propertyId,
        buildingId: progressUpdate.buildingId,
        unitId: progressUpdate.buildingId,
        inspectionType: progressUpdate.inspectionType,
      };

      if (!doesProgressRecordMatchProperty(progressLikeRecord, property)) {
        return;
      }

      if (!doesProgressRecordMatchBuilding(progressLikeRecord, buildingId)) {
        return;
      }

      const key = buildInspectionProgressKey({
        propertyId,
        buildingId,
        inspectionType: progressUpdate.inspectionType,
      });

      globalInspectionProgress[key] = progressUpdate.responses || {};
      setRefreshTick((tick) => tick + 1);

      const inspectionTypeToken = String(progressUpdate.inspectionType || '').trim();
      const isDraftInspection = inspectionTypeToken.toUpperCase().startsWith('REPORT_DRAFT_');

      if (isDraftInspection || isUnitInspectionTypeToken(inspectionTypeToken)) {
        loadCompletedUnits();
      }
    });

    return unsubscribe;
  }, [property, propertyId, buildingId, loadCompletedUnits]);

  const isUnitCompleted = (unitName: string) => {
    if (completedUnits.includes(unitName)) return true;

    // Check if it has any manual inspection responses in global state
    try {
      const unitPrefix = `inspection_responses_${propertyId}_${buildingId}_`;
      const normalizedTargetUnit = normalizeUnitIdentifier(unitName);

      const unitProgressEntries = Object.entries(globalInspectionProgress).filter(
        ([key, value]) => {
          if (!key.startsWith(unitPrefix) || !value || typeof value !== 'object') {
            return false;
          }

          const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, unitPrefix);
          return isUnitInspectionTypeToken(inspectionTypeToken);
        }
      ) as Array<[string, Record<string, any>]>;

      const hasMatchingUnitProgress = unitProgressEntries.some(([key, unitData]) => {
        if (!unitData || Object.keys(unitData).length === 0) {
          return false;
        }

        const inspectionTypeToken = extractInspectionTypeTokenFromProgressKey(key, unitPrefix);
        const unitSuffix = extractUnitSuffixFromInspectionTypeToken(inspectionTypeToken);
        return normalizeUnitIdentifier(unitSuffix) === normalizedTargetUnit;
      });

      if (hasMatchingUnitProgress) {
        return true;
      }
    } catch (e) { }

    return false;
  };

  const completedCount = unitNames.filter(u => isUnitCompleted(u)).length;
  const totalCount = unitNames.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const openEditModal = () => {
    setTempUnitNames([...unitNames]);
    setEditModalVisible(true);
  };

  const handleSaveUnitNames = () => {
    setUnitNames(tempUnitNames.map(n => n.trim() || 'Unnamed'));
    setEditModalVisible(false);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
  };

  const updateTempName = (index: number, value: string) => {
    setTempUnitNames(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleStartUnitInspection = (unitName: string) => {
    // Navigate directly whether starting fresh or viewing/editing a completed unit
    navigateToInspection(unitName);
  };

  const navigateToInspection = (unitName: string) => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits: unitNames,
      currentUnit: unitName,
      buildingId,
      location: 'Unit',
    });
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset Inspections',
      'Are you sure you want to reset all unit inspection progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetPropertyInspectionState(propertyId, buildingId);
            setCompletedUnits([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Name Card */}
        <View style={styles.propertyNameCard}>
          <Text style={styles.propertyName}>{property.name || 'Golden Town'}</Text>
          <Text style={styles.propertyId}>ID: {property.propertyId || 'PRP-674060604'}</Text>
        </View>

        {/* Property Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{property.city || 'Abbotsford'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>State</Text>
              <Text style={styles.infoValue}>{property.state || 'British Columbia'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Zip Code</Text>
              <Text style={styles.infoValue}>{property.zipCode || property.zip || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Buildings</Text>
              <Text style={styles.infoValue}>{property.buildings || property.totalBuildings || 0}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.addressValue}>{property.address}</Text>
          </View>
        </View>

        {/* Building Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Building Information</Text>

          <View style={styles.buildingInfoRow}>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Building ID</Text>
              <Text style={styles.buildingValue}>{buildingId}</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Total Units</Text>
              <Text style={styles.buildingValue}>{property.units || property.totalUnits || 0}</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>For Inspection</Text>
              <Text style={styles.buildingValue}>{selectedUnits.length}</Text>
            </View>
          </View>
        </View>

        {/* Inspection Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Inspection Progress</Text>
            <Text style={styles.progressCount}>
              {completedCount}/{totalCount} Completed
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          {allCompleted && (
            <View style={styles.allCompleteBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#059669" />
              <Text style={styles.allCompleteText}>All units inspected!</Text>
            </View>
          )}
        </View>

        {/* Units Inspection List */}
        <View style={styles.unitsListCard}>
          <View style={styles.unitsListHeader}>
            <Text style={styles.unitsListTitle}>Units for Inspection</Text>
            <View style={styles.unitsListActions}>
              <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                <Ionicons name="pencil-outline" size={14} color="#0E7490" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              {completedCount > 0 && (
                <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
                  <Ionicons name="refresh-outline" size={14} color="#EF4444" />
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 0.1 }]}>#</Text>
            <Text style={[styles.tableHeaderText, { flex: 0.4 }]}>Unit Name</Text>
            <Text style={[styles.tableHeaderText, { flex: 0.25, textAlign: 'center' }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 0.25, textAlign: 'center' }]}>Action</Text>
          </View>

          {/* Unit Rows */}
          {unitNames.map((unitName, index) => {
            const completed = isUnitCompleted(unitName);
            return (
              <View
                key={index}
                style={[
                  styles.unitRow,
                  completed && styles.unitRowCompleted,
                  index === unitNames.length - 1 && styles.unitRowLast,
                ]}
              >
                {/* Row Number */}
                <View style={{ flex: 0.1, justifyContent: 'center' }}>
                  <Text style={styles.unitRowNumber}>{index + 1}</Text>
                </View>

                {/* Unit Name */}
                <View style={{ flex: 0.4, justifyContent: 'center' }}>
                  <View style={styles.unitNameContainer}>
                    {completed && (
                      <Ionicons name="checkmark-circle" size={16} color="#059669" style={{ marginRight: 6 }} />
                    )}
                    <Text style={[styles.unitName, completed && styles.unitNameCompleted]}>
                      {unitName}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={[styles.statusBadge, completed ? styles.statusCompleted : styles.statusPending]}>
                    <Text style={[styles.statusText, completed ? styles.statusTextCompleted : styles.statusTextPending]}>
                      {completed ? 'Done' : 'Pending'}
                    </Text>
                  </View>
                </View>

                {/* Action Button */}
                <View style={{ flex: 0.25, alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={[
                      styles.unitStartButton,
                      completed && styles.unitStartButtonCompleted,
                    ]}
                    onPress={() => handleStartUnitInspection(unitName)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={completed ? 'eye-outline' : 'play-circle-outline'}
                      size={14}
                      color={completed ? '#059669' : '#FFFFFF'}
                    />
                    <Text style={[styles.unitStartText, completed && styles.unitStartTextCompleted]}>
                      {completed ? 'View' : 'Start'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Edit Units Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelEdit}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Rename Units</Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {tempUnitNames.map((name, index) => (
                  <View key={index} style={styles.modalInputRow}>
                    <Text style={styles.modalInputLabel}>Unit {index + 1}</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={name}
                      onChangeText={(text) => updateTempName(index, text)}
                      placeholder={`Enter unit name`}
                      placeholderTextColor="#9CA3AF"
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCancelEdit}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveUnitNames}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
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
    paddingVertical: 12,
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
    paddingBottom: 40,
  },
  propertyNameCard: {
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
  propertyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyId: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
  },
  card: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  buildingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buildingInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  buildingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buildingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E7490',
  },
  // Progress Card
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E7490',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  allCompleteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 12,
    gap: 6,
  },
  allCompleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  // Units Inspection List
  unitsListCard: {
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
  unitsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  unitsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  unitsListActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  // Table styles
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    marginBottom: 6,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0E7490',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unitRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  unitRowCompleted: {
    backgroundColor: '#F0FDF4',
  },
  unitRowLast: {
    borderBottomWidth: 0,
  },
  unitRowNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  unitNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  unitNameCompleted: {
    color: '#059669',
  },
  // Status badge
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusTextCompleted: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#D97706',
  },
  // Unit start button
  unitStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E7490',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  unitStartButtonCompleted: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#059669',
  },
  unitStartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  unitStartTextCompleted: {
    color: '#059669',
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
    maxHeight: '70%',
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
  modalScroll: {
    maxHeight: 300,
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

export default PropertyInfoScreen;
