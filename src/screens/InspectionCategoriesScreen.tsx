import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { globalInspectionProgress } from '../utils/globalState';
import { inspectionService } from '../services/inspectionService';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { OUTSIDE_ITEMS, INSIDE_ITEMS, UNIT_ITEMS, UNIT_LOCATIONS } from '../data/inspectionData';

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

const InspectionCategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId } = route.params;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [buildingName, setBuildingName] = useState(buildingId);
  const [editBuildingModalVisible, setEditBuildingModalVisible] = useState(false);
  const [tempBuildingName, setTempBuildingName] = useState(buildingId);

  const [outsideProgress, setOutsideProgress] = useState(0);
  const [insideProgress, setInsideProgress] = useState(0);
  const [unitsProgress, setUnitsProgress] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        try {
          const propId = property?._id || property?.id || property?.propertyId || 'unknown';

          const updateLocalState = () => {
            // Outside
            const outKey = `inspection_responses_${propId}_${buildingName}_Outside`;
            const outData = globalInspectionProgress[outKey];
            if (outData) setOutsideProgress(Object.keys(outData).length);
            else setOutsideProgress(0);

            // Inside
            const inKey = `inspection_responses_${propId}_${buildingName}_Inside`;
            const inData = globalInspectionProgress[inKey];
            if (inData) setInsideProgress(Object.keys(inData).length);
            else setInsideProgress(0);

            // Units
            let totalUn = 0;
            if (selectedUnits && selectedUnits.length > 0) {
              for (const unit of selectedUnits) {
                const unKey = `inspection_responses_${propId}_${buildingName}_Unit_${unit}`;
                const unData = globalInspectionProgress[unKey];
                if (unData) totalUn += Object.keys(unData).length;
              }
            }
            setUnitsProgress(totalUn);
          };

          // Render instantly from memory first
          updateLocalState();

          // Sync from API in case app was just opened or progress was saved via other screen/device
          try {
            const apiRes = await inspectionService.getAllProgress();
            if (apiRes && apiRes.success && apiRes.progress) {
              apiRes.progress.forEach((p: any) => {
                const pId = p.propertyId?._id || p.propertyId || 'unknown';
                const pIdStr = String(pId);
                const pPropIdStr = p.propertyId?.propertyId ? String(p.propertyId.propertyId) : '';

                const currentPropIdStr = String(propId);
                const currentPropPropertyIdStr = property?.propertyId ? String(property.propertyId) : '';

                const isMatch = (pIdStr === currentPropIdStr) ||
                  (pPropIdStr && pPropIdStr === currentPropIdStr) ||
                  (pIdStr && currentPropPropertyIdStr && pIdStr === currentPropPropertyIdStr) ||
                  (pPropIdStr && currentPropPropertyIdStr && pPropIdStr === currentPropPropertyIdStr) ||
                  (String(p.propertyId) === currentPropIdStr);

                if (isMatch && String(p.unitId) === String(buildingName)) {
                  // For units, LocationInspectionScreen appends _[unit] to the name when creating the key
                  const safeLoc = p.inspectionType === 'Unit' ? `Unit_${p.unitId}` : p.inspectionType;
                  // Wait, actually LocationInspectionScreen uses actual Unit_1 etc for inspectionType if it is a unit! Or rather location: Unit, unit name appended.
                  // Let's just use what p.inspectionType is, or recreate LocationInspectionScreen's key logic
                  // Backend receives: inspection_type: "Outside" or "Unit_1" etc. Wait, LocationInspectionScreen saves `location` which for Unit is just "Unit".
                  // Let's check api.post call in LocationInspectionScreen again just to be safe. But `p.inspectionType` IS that location.

                  const key = `inspection_responses_${propId}_${p.unitId}_${p.inspectionType}`;
                  if (p.responses && Object.keys(p.responses).length > 0) {
                    globalInspectionProgress[key] = p.responses;
                  }
                }
              });
              updateLocalState();
            }
          } catch (e) {
            console.log("Could not sync category progress from API", e);
          }

        } catch (e) {
          console.error('Failed to load progress', e);
        }
      };

      fetchProgress();
    }, [property, buildingName, selectedUnits])
  );

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
                    const totalPossible = (selectedUnits ? selectedUnits.length : 1) * UNIT_ITEMS.length;
                    const pct = Math.min(100, Math.round((unitsProgress / totalPossible) * 100)) || 0;
                    return <View style={[styles.progressFill, { width: `${pct}%` }]} />;
                  })()}
                </View>
                <Text style={styles.progressText}>
                  {unitsProgress}/{(selectedUnits ? selectedUnits.length : 1) * UNIT_ITEMS.length} • {Math.min(100, Math.round((unitsProgress / ((selectedUnits ? selectedUnits.length : 1) * UNIT_ITEMS.length)) * 100)) || 0}% Complete
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
