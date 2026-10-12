import React, { useState, useEffect } from 'react';
import { globalInspectionProgress } from '../utils/globalState';
import {
  computeSelectAllResponses,
  isSelectAllChecked as isBulkChecked,
} from '../utils/selectAllResponses';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import ModalZoomWrapper from '../components/ModalZoomWrapper';
import { INSPIRE_LOGO_BASE64 } from '../constants/inspireLogo';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, UNIT_LOCATIONS, InspectionResponse } from '../data/inspectionData';
import api from '../services/api';
import { canonicalizeInspectionType } from '../utils/inspectionProgressUtils';
import { markUnitCompleted } from '../utils/unitInspectionStorage';
import offlineQueue from '../services/offlineQueue';
import { serverAnswersWin } from '../utils/offlineQueueCore';
import { savedFindingScope, draftStorageKeys, findingsForItem } from '../utils/savedDeficiencies';

type LocationInspectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LocationInspection'
>;
type LocationInspectionScreenRouteProp = RouteProp<
  RootStackParamList,
  'LocationInspection'
>;

interface Props {
  navigation: LocationInspectionScreenNavigationProp;
  route: LocationInspectionScreenRouteProp;
}

type ResponseType = 'No OD' | 'OD' | 'N/A';

const LocationInspectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId, location, currentUnit } = route.params;
  const [responses, setResponses] = useState<{ [key: string]: ResponseType }>({});
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedFindings, setSavedFindings] = useState<any[]>([]);
  const [loadingSavedFindings, setLoadingSavedFindings] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<any | null>(null);

  const safeLocationName = location === 'Unit' ? `Unit_${currentUnit || selectedUnits?.[0] || 'Unknown'}` : location;
  const canonicalInspectionType = canonicalizeInspectionType(safeLocationName, { currentUnit });
  const saveKey = `inspection_responses_${property?._id || property?.id || property?.propertyId || 'unknown'}_${buildingId}_${canonicalInspectionType}`;
  // One queued save per checklist; a newer offline save replaces the older one.
  const queueKey = `saveProgress:${property?._id || property?.id || property?.propertyId || 'unknown'}:${buildingId}:${canonicalInspectionType}`;

  // Set while the device copy holds answers Save Progress has not sent yet. Kept
  // off the inspection_responses_ prefix: other screens read every such key as
  // a set of answers.
  const unsentKey = `unsent_${saveKey}`;

  // Use appropriate inspection items based on location
  // Outside = OUTSIDE_ITEMS (26), Inside = INSIDE_ITEMS (35), Unit = UNIT_ITEMS (32)
  const isUnitLocation = location === 'Unit' || UNIT_LOCATIONS.includes(location);
  const inspectionItems = location === 'Outside'
    ? OUTSIDE_ITEMS
    : (isUnitLocation ? UNIT_ITEMS : INSIDE_ITEMS);
  const findingScope = savedFindingScope({
    property,
    buildingId,
    isOutside: location?.toLowerCase() === 'outside',
    isUnit: isUnitLocation,
    currentUnit,
    selectedUnits,
  });

  const persistResponsesToDevice = async (nextResponses: { [key: string]: ResponseType }, unsent = true) => {
    try {
      if (nextResponses && Object.keys(nextResponses).length > 0) {
        await AsyncStorage.setItem(saveKey, JSON.stringify(nextResponses));
      } else {
        await AsyncStorage.removeItem(saveKey);
      }
      await (unsent ? AsyncStorage.setItem(unsentKey, '1') : AsyncStorage.removeItem(unsentKey));
    } catch (storageError) {
      console.warn('Failed to persist inspection responses locally:', storageError);
    }
  };

  // Load responses on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [deviceRaw, unsent, ...draftPayloads] = await Promise.all(
          [saveKey, unsentKey, ...draftStorageKeys(findingScope)].map((key) =>
            AsyncStorage.getItem(key).catch(() => null),
          ),
        );
        // Written on every tap, so the one copy that can hold answers nobody
        // has sent yet.
        let device: any = null;
        try {
          device = deviceRaw ? JSON.parse(deviceRaw) : null;
        } catch (parseError) {
          console.warn('Failed to parse locally saved progress:', parseError);
        }

        // Offline this fails at once and the device copy is all there is.
        let serverItems: any = null;
        try {
          const propertyId = property?._id || property?.id || property?.propertyId || 'unknown';
          const result: any = await api.get(`/inspections/progress?property_id=${propertyId}&unit_id=${buildingId}&inspection_type=${encodeURIComponent(canonicalInspectionType)}`);
          serverItems = result?.items;
        } catch (error) {
          // Unreachable or not deployed: carry on with what the device has.
        }

        // The server's copy only replaces the device's if it has answers and
        // the device holds nothing it has not been sent — its empty or older
        // copy erased answers tapped offline, or tapped without Save Progress.
        const useServer = serverAnswersWin(await offlineQueue.list(), queueKey, serverItems, !!unsent);
        // Memory comes last: other screens overwrite it with the server's copy.
        const answers = useServer
          ? serverItems
          : (device && typeof device === 'object' ? device : (!unsent && globalInspectionProgress[saveKey]) || {});

        // A recorded deficiency reaches the server on its own, the item's answer
        // only with Save Progress — so an item can have one without the other.
        // It is OD either way; show it as answered.
        // ponytail: re-parses the drafts once per item; parse once if the list grows.
        const next = { ...answers };
        inspectionItems.forEach((item) => {
          if (!next[item.id] && findingsForItem(draftPayloads, findingScope, item.name).length > 0) {
            next[item.id] = 'OD';
          }
        });

        setResponses(next);
        globalInspectionProgress[saveKey] = next;
        if (useServer) await persistResponsesToDevice(next, false);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProgress();
  }, [saveKey, property, buildingId, location]);

  // What the OD modal shows. The answers in `responses` only say OD/No OD/N/A;
  // the deficiency itself — the picture, the name, the severity — lives in the
  // draft snapshots DeficiencyDetailScreen writes, so read those.
  useEffect(() => {
    if (!showDeficiencyModal || !selectedItem) return;
    let cancelled = false;

    const loadSavedFindings = async () => {
      // Drop the previous item's records first, or they flash under this item's name.
      setSavedFindings([]);
      setSelectedFinding(null);
      setLoadingSavedFindings(true);
      const payloads = await Promise.all(
        draftStorageKeys(findingScope).map((key) =>
          AsyncStorage.getItem(key).catch((error) => {
            console.warn('Could not read saved deficiencies for item:', key, error);
            return null;
          }),
        ),
      );

      if (cancelled) return;
      setSavedFindings(findingsForItem(payloads, findingScope, selectedItem.name));
      setLoadingSavedFindings(false);
    };

    loadSavedFindings();
    return () => { cancelled = true; };
  }, [showDeficiencyModal, selectedItem]);

  const handleResponse = (itemId: string, itemName: string, response: ResponseType) => {
    // If clicking the same response again, unselect it
    if (responses[itemId] === response) {
      // Tapping OD again reopens what was recorded rather than wiping it; the
      // answer still clears from No OD / N/A, or from the other way round.
      if (response === 'OD') {
        setSelectedItem({ id: itemId, name: itemName });
        setShowDeficiencyModal(true);
        return;
      }
      setResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[itemId];
        persistResponsesToDevice(newResponses).catch(() => undefined);
        return newResponses;
      });
      return;
    }

    // Eagerly set the response regardless so it auto-saves immediately
    const updatedResponses = {
      ...responses,
      [itemId]: response,
    };
    setResponses(updatedResponses);

    // Save to global state so it's there when we return from DeficiencyDetail
    try {
      globalInspectionProgress[saveKey] = updatedResponses;
      persistResponsesToDevice(updatedResponses).catch(() => undefined);
    } catch (e) {
      console.error('Error saving updated responses', e);
    }

    if (response === 'OD') {
      // Show deficiency modal when OD is clicked
      setSelectedItem({ id: itemId, name: itemName });

      if (itemName.toLowerCase().includes('general comment')) {
        // Skip modal and go directly to Add New for General Comment
        navigation.navigate('DeficiencyDetail', {
          property,
          selectedUnits,
          currentUnit,
          buildingId,
          location,
          itemId,
          itemName,
        });
      } else {
        setShowDeficiencyModal(true);
      }
    } // removed else block because we already eagerly set the response
  };

  const handleDeficiencyRecorded = () => {
    // Mark the item as OD after deficiency is recorded
    if (selectedItem) {
      const updatedResponses = {
        ...responses,
        [selectedItem.id]: 'OD' as ResponseType,
      };
      setResponses(updatedResponses);

      try {
        globalInspectionProgress[saveKey] = updatedResponses;
        persistResponsesToDevice(updatedResponses).catch(() => undefined);
      } catch (e) {
        console.error('Error saving recorded deficiency response', e);
      }
    }
    setShowDeficiencyModal(false);
  };

  const handleAddNewDeficiency = () => {
    setShowDeficiencyModal(false);
    if (selectedItem) {
      navigation.navigate('DeficiencyDetail', {
        property,
        selectedUnits,
        currentUnit,
        buildingId,
        location,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
      });
    }
  };

  const handleSaveProgress = async () => {
    let remoteSaved = false;
    let progressPayload: any = null;

    try {
      const propertyId = property?._id || property?.id || property?.propertyId || 'unknown';

      // Save locally as fallback
      if (Object.keys(responses).length > 0) {
        globalInspectionProgress[saveKey] = responses;
      } else {
        delete globalInspectionProgress[saveKey];
      }

      await persistResponsesToDevice(responses);

      const isUnitLocation = location === 'Unit' || UNIT_LOCATIONS.includes(location);
      const unitNameToMark = String(currentUnit || selectedUnits?.[0] || '').trim();
      if (isUnitLocation && unitNameToMark && Object.keys(responses).length > 0) {
        await markUnitCompleted(propertyId, String(buildingId || ''), unitNameToMark, {
          inspectionType: canonicalInspectionType,
          savedAt: new Date().toISOString(),
        });
      }

      progressPayload = {
        property_id: propertyId,
        unit_id: buildingId,
        building_id: buildingId,
        buildingId,
        inspection_type: canonicalInspectionType,
        responses: responses,
        inspectionData: {
          buildingId,
          location,
          currentUnit: currentUnit || null,
          // The server only marks Outside / Inside done (green) when told the
          // whole checklist is answered; without this they stayed at 0%.
          isComplete: inspectionItems.every((item) => !!responses[item.id]),
        },
      };

      // Save to remote backend
      await api.put('/inspections/progress', progressPayload);

      remoteSaved = true;

    } catch (e) {
      console.error('Error saving responses to backend:', e);
      // Keep local save, and queue the write so the server gets it on reconnect —
      // the server is what marks the unit / Outside / Inside complete.
      if (progressPayload) {
        await offlineQueue.enqueue('saveProgress', queueKey, progressPayload);
      }
    }
    // Sent or queued either way, so the server's copy can be trusted again.
    if (progressPayload) AsyncStorage.removeItem(unsentKey).catch(() => undefined);

    const successTitle = remoteSaved ? 'Progress Saved' : 'Saved Locally';
    const successMessage = remoteSaved
      ? 'Your inspection progress has been saved successfully.'
      : 'Your inspection progress is saved on this device. It will sync to server when connection is available.';

          if (Platform.OS === 'web') {
        window.alert(successMessage);
        if (location === 'Unit' || isUnitLocation) {
          navigation.navigate('PropertyInfo', {
            property,
            selectedUnits,
            buildingId,
          });
        } else {
          navigation.navigate('InspectionCategories', {
            property,
            propertyId: String(property?._id || property?.id || property?.propertyId || ''),
            selectedUnits,
            buildingId,
          });
        }
      } else {
        Alert.alert(
          successTitle,
          successMessage,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to the correct parent screen
                if (location === 'Unit' || isUnitLocation) {
                  navigation.navigate('PropertyInfo', {
                    property,
                    selectedUnits,
                    buildingId,
                  });
                } else {
                  navigation.navigate('InspectionCategories', {
                    property,
                    propertyId: String(property?._id || property?.id || property?.propertyId || ''),
                    selectedUnits,
                    buildingId,
                  });
                }
              },
            },
          ]
        );
      }
  };

  const itemIds = inspectionItems.map((item) => item.id);

  const isSelectAllChecked = (response: ResponseType) =>
    isBulkChecked(itemIds, responses as any, response as any);

  const handleSelectAll = (response: ResponseType) => {
    const newResponses = computeSelectAllResponses(itemIds, responses as any, response as any);
    if (newResponses === (responses as any)) return;

    setResponses(newResponses as any);
    try {
      globalInspectionProgress[saveKey] = newResponses;
      persistResponsesToDevice(newResponses as any).catch(() => undefined);
    } catch (e) {
      console.error('Error saving selected responses to global state', e);
    }
  };

  const getButtonStyle = (itemId: string, buttonType: ResponseType) => {
    const isSelected = responses[itemId] === buttonType;
    if (isSelected) {
      if (buttonType === 'OD') {
        return [styles.responseButton, styles.responseButtonODActive];
      }
      return [styles.responseButton, styles.responseButtonActive];
    }
    return styles.responseButton;
  };

  const getButtonTextStyle = (itemId: string, buttonType: ResponseType) => {
    return responses[itemId] === buttonType
      ? [styles.responseButtonText, styles.responseButtonTextActive]
      : styles.responseButtonText;
  };

  const completedCount = Object.keys(responses).length;
  const totalCount = inspectionItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0E7490" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{location === 'Unit' && currentUnit ? currentUnit : location}</Text>
          <Text style={styles.headerSubtitle}>
            Building {buildingId} • {selectedUnits.length} Units
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>
            {completedCount}/{totalCount} • {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      {/* Select All Section */}
      <View style={styles.selectAllContainer}>
        <View style={styles.selectAllRow}>
          <TouchableOpacity
            style={styles.selectAllItem}
            onPress={() => handleSelectAll('No OD')}
          >
            <Ionicons
              name={isSelectAllChecked('No OD') ? 'checkbox' : 'square-outline'}
              size={18}
              color="#374151"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.selectAllItemText}>All No OD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectAllItemCenter}
            onPress={() => handleSelectAll('OD')}
          >
            <Ionicons
              name={isSelectAllChecked('OD') ? 'checkbox' : 'square-outline'}
              size={18}
              color="#DC2626"
              style={{ marginRight: 3 }}
            />
            <Text style={styles.observeDeficiencyText}>Observe Deficiency</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectAllItem}
            onPress={() => handleSelectAll('N/A')}
          >
            <Ionicons
              name={isSelectAllChecked('N/A') ? 'checkbox' : 'square-outline'}
              size={18}
              color="#374151"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.selectAllItemText}>All NA</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {inspectionItems.map((item, index) => {
          const isGeneralComment = item.name.toLowerCase().includes('general comment');
          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemNumberBadge}>
                  <Text style={styles.itemNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              {isGeneralComment ? (
                <TouchableOpacity
                  style={[styles.inspectionButton, responses[item.id] === 'OD' && styles.inspectionButtonDone]}
                  onPress={() => {
                    const updatedResponses = { ...responses, [item.id]: 'OD' as ResponseType };
                    setResponses(updatedResponses);

                    try { globalInspectionProgress[saveKey] = updatedResponses; } catch (e) { }
                    persistResponsesToDevice(updatedResponses).catch(() => undefined);

                    navigation.navigate('DeficiencyDetail', {
                      property,
                      selectedUnits,
                      currentUnit,
                      buildingId,
                      location,
                      itemId: item.id,
                      itemName: item.name,
                    });
                  }}
                >
                  <View style={styles.inspectionButtonInner}>
                    <Ionicons
                      name={responses[item.id] === 'OD' ? 'checkmark-circle' : 'clipboard-outline'}
                      size={28}
                      color={responses[item.id] === 'OD' ? '#FFFFFF' : '#0E7490'}
                    />
                    <Text style={[styles.inspectionButtonText, responses[item.id] === 'OD' && styles.inspectionButtonTextDone]}>
                      Write Comment
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.responseButtons}>
                  <TouchableOpacity
                    style={getButtonStyle(item.id, 'No OD')}
                    onPress={() => handleResponse(item.id, item.name, 'No OD')}
                  >
                    <Text style={getButtonTextStyle(item.id, 'No OD')}>No OD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={getButtonStyle(item.id, 'OD')}
                    onPress={() => handleResponse(item.id, item.name, 'OD')}
                  >
                    <Text style={getButtonTextStyle(item.id, 'OD')}>OD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={getButtonStyle(item.id, 'N/A')}
                    onPress={() => handleResponse(item.id, item.name, 'N/A')}
                  >
                    <Text style={getButtonTextStyle(item.id, 'N/A')}>N/A</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Deficiency Modal */}
      <Modal
        visible={showDeficiencyModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeficiencyModal(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {selectedFinding ? (
                  <TouchableOpacity onPress={() => setSelectedFinding(null)} style={styles.modalBackButton}>
                    <Ionicons name="chevron-back" size={24} color="#0E7490" />
                  </TouchableOpacity>
                ) : !!INSPIRE_LOGO_BASE64 && (
                  <Image source={{ uri: INSPIRE_LOGO_BASE64 }} style={styles.modalBadge} resizeMode="contain" />
                )}
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle} numberOfLines={2}>
                    {selectedFinding
                      ? (selectedFinding?.deficiency?.name || selectedFinding?.deficiencyName || 'Deficiency')
                      : selectedItem?.name}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedFinding ? selectedItem?.name : 'NSPIRE Deficiency Inspection'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => { setSelectedFinding(null); setShowDeficiencyModal(false); }}>
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              {selectedFinding ? (
                <>
                  <ScrollView showsVerticalScrollIndicator={false} style={styles.findingScroll}>
                    {(() => {
                      const uri = selectedFinding?.imageUri
                        || selectedFinding?.imageUrl
                        || selectedFinding?.photos?.[0]?.url;
                      return uri ? (
                        <Image source={{ uri }} style={styles.findingImage} resizeMode="cover" />
                      ) : (
                        <View style={[styles.findingImage, styles.savedThumbEmpty]}>
                          <Ionicons name="image-outline" size={40} color="#D1D5DB" />
                          <Text style={styles.findingNoImage}>No photo recorded</Text>
                        </View>
                      );
                    })()}

                    <Text style={styles.findingLabel}>SEVERITY</Text>
                    <Text style={styles.savedSeverity}>
                      {selectedFinding?.deficiency?.severity || selectedFinding?.severity || 'Moderate'}
                    </Text>

                    {!!(selectedFinding?.deficiency?.detail || selectedFinding?.deficiencyDetails) && (
                      <>
                        <Text style={styles.findingLabel}>DEFICIENCY DETAIL</Text>
                        <Text style={styles.findingValue}>
                          {selectedFinding?.deficiency?.detail || selectedFinding?.deficiencyDetails}
                        </Text>
                      </>
                    )}

                    {!!selectedFinding?.location && (
                      <>
                        <Text style={styles.findingLabel}>LOCATION</Text>
                        <Text style={styles.findingValue}>{selectedFinding.location}</Text>
                      </>
                    )}

                    {!!selectedFinding?.note && (
                      <>
                        <Text style={styles.findingLabel}>COMMENT</Text>
                        <Text style={styles.findingValue}>{selectedFinding.note}</Text>
                      </>
                    )}

                    {!!selectedFinding?.deficiency?.aiAnalysis && (
                      <>
                        <Text style={styles.findingLabel}>AI ANALYSIS</Text>
                        <Text style={styles.findingValue}>{selectedFinding.deficiency.aiAnalysis}</Text>
                      </>
                    )}

                    {!!selectedFinding?.deficiencyQRId && (
                      <>
                        <Text style={styles.findingLabel}>REFERENCE</Text>
                        <Text style={styles.findingValue}>{selectedFinding.deficiencyQRId}</Text>
                      </>
                    )}
                  </ScrollView>

                  <TouchableOpacity style={styles.addNewButton} onPress={() => setSelectedFinding(null)}>
                    <Text style={styles.addNewButtonText}>BACK</Text>
                  </TouchableOpacity>
                </>
              ) : loadingSavedFindings ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="large" color="#0E7490" />
                </View>
              ) : savedFindings.length === 0 ? (
                <View style={styles.emptyState}>
                  {INSPIRE_LOGO_BASE64 ? (
                    <Image source={{ uri: INSPIRE_LOGO_BASE64 }} style={styles.emptyStateLogo} resizeMode="contain" />
                  ) : (
                    <Ionicons name="add-circle-outline" size={80} color="#E5E5E5" />
                  )}
                  <Text style={styles.emptyStateText}>
                    No existing deficiency record for this item.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.savedCount}>
                    {savedFindings.length} {savedFindings.length === 1 ? 'deficiency' : 'deficiencies'} recorded on this item
                  </Text>
                  <ScrollView style={styles.savedList} showsVerticalScrollIndicator={false}>
                    {savedFindings.map((finding: any, idx: number) => {
                      const imageUri = finding?.imageUri || finding?.imageUrl || finding?.photos?.[0]?.url;
                      return (
                        <TouchableOpacity
                          key={finding?.deficiencyQRId ?? finding?.id ?? String(idx)}
                          style={styles.savedRow}
                          activeOpacity={0.7}
                          onPress={() => setSelectedFinding(finding)}
                        >
                          {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.savedThumb} />
                          ) : (
                            <View style={[styles.savedThumb, styles.savedThumbEmpty]}>
                              <Ionicons name="image-outline" size={22} color="#D1D5DB" />
                            </View>
                          )}
                          <View style={styles.savedBody}>
                            <Text style={styles.savedTitle} numberOfLines={1}>
                              {finding?.deficiency?.name || finding?.deficiencyName || finding?.title || 'Deficiency'}
                            </Text>
                            <Text style={styles.savedDetail} numberOfLines={2}>
                              {finding?.deficiency?.detail || finding?.deficiencyDetails || finding?.note || ''}
                            </Text>
                            <Text style={styles.savedSeverity}>
                              {finding?.deficiency?.severity || finding?.severity || 'Moderate'}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </>
              )}

              {!selectedFinding && (
                <TouchableOpacity
                  style={styles.addNewButton}
                  onPress={handleAddNewDeficiency}
                >
                  <Text style={styles.addNewButtonText}>ADD NEW</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSaveProgress}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Progress</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 16,
    backgroundColor: '#0E7490',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  headerRight: {
    width: 32,
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 4,
  },
  selectAllContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
  },
  selectAllItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllItemCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  observeDeficiencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  itemNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  responseButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  responseButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  responseButtonActive: {
    backgroundColor: '#0E7490',
    borderColor: '#0E7490',
  },
  responseButtonODActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  responseButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  responseButtonTextActive: {
    color: '#FFFFFF',
  },
  inspectionButton: {
    borderWidth: 2,
    borderColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: '#F0FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  inspectionButtonDone: {
    backgroundColor: '#0E7490',
    borderColor: '#0E7490',
  },
  inspectionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inspectionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    letterSpacing: 0.5,
  },
  inspectionButtonTextDone: {
    color: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  saveButton: {
    backgroundColor: '#0E7490',
    borderRadius: 50,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 10,
  },
  modalHeaderText: {
    flex: 1,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  modalSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateLogo: {
    width: 140,
    height: 140,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
  },
  savedCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 8,
  },
  savedList: {
    maxHeight: 280,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  savedThumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  savedThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackButton: {
    marginRight: 8,
  },
  findingScroll: {
    maxHeight: 420,
  },
  findingImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 12,
  },
  findingNoImage: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  findingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 14,
  },
  findingValue: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
    lineHeight: 20,
  },
  savedBody: {
    flex: 1,
    marginLeft: 10,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  savedDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  savedSeverity: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginTop: 4,
  },
  addNewButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  addNewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LocationInspectionScreen;
