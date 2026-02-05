import React, { useState } from 'react';
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
  const { property, selectedUnits, buildingId, location } = route.params;
  const [responses, setResponses] = useState<{ [key: string]: ResponseType }>({});
  const [showDeficiencyModal, setShowDeficiencyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

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

    if (response === 'OD') {
      // Show deficiency modal when OD is clicked
      setSelectedItem({ id: itemId, name: itemName });
      setShowDeficiencyModal(true);
    } else {
      setResponses((prev) => ({
        ...prev,
        [itemId]: response,
      }));
    }
  };

  const handleDeficiencyRecorded = () => {
    // Mark the item as OD after deficiency is recorded
    if (selectedItem) {
      setResponses((prev) => ({
        ...prev,
        [selectedItem.id]: 'OD',
      }));
    }
    setShowDeficiencyModal(false);
  };

  const handleAddNewDeficiency = () => {
    setShowDeficiencyModal(false);
    if (selectedItem) {
      navigation.navigate('DeficiencyDetail', {
        property,
        selectedUnits,
        buildingId,
        location,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
      });
    }
  };

  const handleSaveProgress = () => {
    Alert.alert(
      'Progress Saved',
      'Your inspection progress has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to Dashboard
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' as never }],
            });
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
          <Text style={styles.headerTitle}>{location}</Text>
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
        <Text style={styles.selectAllLabel}>Quick Select:</Text>
        <View style={styles.selectAllButtons}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={() => handleSelectAll('No OD')}
          >
            <Text style={styles.selectAllButtonText}>All No OD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectAllButton, styles.selectAllButtonOD]}
            onPress={() => handleSelectAll('OD')}
          >
            <Text style={styles.selectAllButtonText}>All OD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectAllButton, styles.selectAllButtonNA]}
            onPress={() => handleSelectAll('N/A')}
          >
            <Text style={styles.selectAllButtonText}>All N/A</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {inspectionItems.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={styles.itemNumberBadge}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
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
          </View>
        ))}
      </ScrollView>

      {/* Deficiency Modal */}
      <Modal
        visible={showDeficiencyModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDeficiencyModal(false)}
      >
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectAllLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  selectAllButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  selectAllButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectAllButtonOD: {
    backgroundColor: '#EF4444',
  },
  selectAllButtonNA: {
    backgroundColor: '#6B7280',
  },
  selectAllButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
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
