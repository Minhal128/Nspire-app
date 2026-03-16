import React, { useState, useEffect } from 'react';
import { globalInspectionProgress } from '../utils/globalState';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import ModalZoomWrapper from '../components/ModalZoomWrapper';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, UNIT_LOCATIONS, InspectionResponse } from '../data/inspectionData';

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

  const safeLocationName = location === 'Unit' ? `Unit_${currentUnit || selectedUnits?.[0] || 'Unknown'}` : location;
  const saveKey = `inspection_responses_${property?._id || property?.id || property?.propertyId || 'unknown'}_${buildingId}_${safeLocationName}`;

  // Load responses from global state on mount
  useEffect(() => {
    try {
      const saved = globalInspectionProgress[saveKey];
      if (saved) {
        setResponses(saved);
      }
    } catch (error) {
      console.error('Error loading saved responses', error);
    } finally {
      setIsLoaded(true);
    }
  }, [saveKey]);

  // Use appropriate inspection items based on location
  // Outside = OUTSIDE_ITEMS (26), Inside = INSIDE_ITEMS (35), Unit = UNIT_ITEMS (32)
  const isUnitLocation = location === 'Unit' || UNIT_LOCATIONS.includes(location);
  const inspectionItems = location === 'Outside'
    ? OUTSIDE_ITEMS
    : (isUnitLocation ? UNIT_ITEMS : INSIDE_ITEMS);

  const handleResponse = (itemId: string, itemName: string, response: ResponseType) => {
    // If clicking the same response again, unselect it
    if (responses[itemId] === response) {
      setResponses((prev) => {
        const newResponses = { ...prev };
        delete newResponses[itemId];
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

  const handleSaveProgress = () => {
    try {
      if (Object.keys(responses).length > 0) {
        globalInspectionProgress[saveKey] = responses;
      } else {
        delete globalInspectionProgress[saveKey];
      }
    } catch (e) {
      console.error('Error saving responses', e);
    }

    Alert.alert(
      'Progress Saved',
      'Your inspection progress has been saved successfully.',
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
                selectedUnits,
                buildingId,
              });
            }
          },
        },
      ]
    );
  };

  const handleSelectAll = (response: ResponseType) => {
    // Check if all items already have this response selected
    const allSelected = inspectionItems.every((item) => responses[item.id] === response);

    if (allSelected) {
      // Unselect all - clear responses
      setResponses({});
    } else {
      // Select all with this response
      const newResponses: { [key: string]: ResponseType } = {};
      inspectionItems.forEach((item) => {
        newResponses[item.id] = response;
      });
      setResponses(newResponses);
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
              name={inspectionItems.every((item) => responses[item.id] === 'No OD') ? 'checkbox' : 'square-outline'}
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
              name={inspectionItems.every((item) => responses[item.id] === 'OD') ? 'checkbox' : 'square-outline'}
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
              name={inspectionItems.every((item) => responses[item.id] === 'N/A') ? 'checkbox' : 'square-outline'}
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
                <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
                <TouchableOpacity onPress={() => setShowDeficiencyModal(false)}>
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              <View style={styles.emptyState}>
                <Ionicons name="add-circle-outline" size={80} color="#E5E5E5" />
                <Text style={styles.emptyStateText}>
                  No existing deficiency record for this item.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addNewButton}
                onPress={handleAddNewDeficiency}
              >
                <Text style={styles.addNewButtonText}>ADD NEW</Text>
              </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
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
