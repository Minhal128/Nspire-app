import { useOAuth, useClerk } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Modal,
  Pressable,
  StatusBar,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DashboardScreenNavigationProp } from "../types/navigation";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import ModalZoomWrapper from "../components/ModalZoomWrapper";
import {
  propertyService,
  authService,
  inspectionService,
  generateRandomUnitSample,
  isRandomSelectionAvailable
} from "../services";
import { calculatePropertyProgressPercent } from "../utils/inspectionProgressUtils";
import type { UnitSample } from "../services";
import { Property as ApiProperty } from "../services/api";
import { UNIT_SELECTION_OPTIONS } from "../utils/iosPickerUtils";

// Coverage options for inspection
import { COVERAGE_OPTIONS } from '../constants/inspectionCoverage';

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
  onMenuPress?: () => void;
}

interface Property {
  id: string;
  _id?: string;
  name: string;
  propertyId: string;
  buildings: number;
  units: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status?: string;
  inspectionCoverage?: string;
  calculatedUnits?: number;
  buildingDetails?: { buildingId: string; totalUnits: number; unitsForInspection: number }[];
}

export default function DashboardScreen({
  navigation,
  onMenuPress,
}: DashboardScreenProps) {
  const { signOut } = useClerk();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inspectionStep, setInspectionStep] = useState(0);
  const [selectedUnitOption, setSelectedUnitOption] = useState("");
  const [loading, setLoading] = useState(true);

  // Ready for Inspection Modal state
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState('random');
  const [calculatedUnits, setCalculatedUnits] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // iOS picker modal states
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);
  const [tempUnitOption, setTempUnitOption] = useState('');

  // Add maximum loading timeout to prevent infinite loading
  useEffect(() => {
    const maxLoadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(maxLoadingTimeout);
  }, [loading]);
  const [properties, setProperties] = useState<Property[]>([]);

  // Web parity: per-property completion percentage
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({});

  // Web parity: multi-select + bulk delete
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());

  // Load user and properties on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const dataPromise = (async () => {
        const userData = await authService.getStoredUser();

        // Role-based access control
        const allowedRoles = ['inspector', 'admin'];
        if (!userData || !allowedRoles.includes(userData.role)) {
          Alert.alert(
            'Access Denied',
            'You do not have permission to access the Inspector portal.',
            [{
              text: 'OK', onPress: () => {
                authService.logout();
                navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
              }
            }]
          );
          return;
        }

        await fetchProperties();
      })();

      await Promise.race([dataPromise, timeoutPromise]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      // If there's an error, still show the UI but with empty data
      setProperties([]);

      // Show an alert to inform the user about the issue
      Alert.alert(
        'Connection Issue',
        'Unable to load data. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => loadInitialData() },
          { text: 'Continue Offline', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async (filters?: { search?: string; state?: string; city?: string }) => {
    try {
      const propertyFilters: any = { limit: 50 };

      if (filters?.search) propertyFilters.search = filters.search;
      if (filters?.state) propertyFilters.state = filters.state;
      if (filters?.city) propertyFilters.city = filters.city;

      const response = await propertyService.getProperties(propertyFilters);

      if (response.success && response.properties) {
        const mappedProperties: Property[] = response.properties.map((p: ApiProperty) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          propertyId: p.propertyId,
          buildings: p.buildings || 0,
          units: p.units || 0,
          address: p.address,
          city: p.city,
          state: p.state,
          zipCode: p.zipCode,
          status: p.status,
          inspectionCoverage: p.inspectionCoverage,
          calculatedUnits: p.calculatedUnits,
          buildingDetails: p.buildingDetails,
        }));
        setProperties(mappedProperties);
        fetchProgress(mappedProperties);
        return mappedProperties;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch properties:', error);
      return [];
    }
  };

  // Web parity (/dashboard): percentage of inspection tasks completed per property.
  const fetchProgress = async (propertyList: Property[]) => {
    try {
      const response = await inspectionService.getAllProgress();
      if (!response.success || !Array.isArray(response.progress)) return;

      const progressMap: Record<string, number> = {};
      propertyList.forEach(prop => {
        progressMap[prop._id || prop.id] = calculatePropertyProgressPercent(prop, response.progress);
      });
      setPropertyProgress(progressMap);
    } catch (e) {
      console.error('Error fetching progress:', e);
    }
  };

  const handleSelectAll = () => {
    if (selectedProperties.size === properties.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(properties.map(p => p._id || p.id)));
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties(prev => {
      const next = new Set(prev);
      if (next.has(propertyId)) next.delete(propertyId);
      else next.add(propertyId);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedProperties.size === 0) {
      Alert.alert('No Selection', 'Please select properties to delete');
      return;
    }
    const count = selectedProperties.size;
    Alert.alert(
      'Remove Properties',
      `Are you sure you want to remove ${count} ${count === 1 ? 'property' : 'properties'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await propertyService.bulkDelete(Array.from(selectedProperties));
              if (response.success) {
                Alert.alert('Success', response.message || `${count} ${count === 1 ? 'property' : 'properties'} removed successfully`);
                setSelectedProperties(new Set());
                await fetchProperties();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove properties');
            }
          },
        },
      ]
    );
  };

  // Refresh properties when the screen gains focus (so edits/updates reflect immediately)
  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  }, []);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === "Dashboard") {
      // Already on dashboard
    } else if (screen === "MyInspections") {
      navigation.navigate("MyInspections" as never);
    } else if (screen === "Reports") {
      navigation.navigate("Reports" as never);
    } else if (screen === "InspectionStatus") {
      navigation.navigate("InspectionStatus" as never);
    } else if (screen === "Analytics") {
      navigation.navigate("Analytics" as never);
    } else if (screen === "Settings") {
      navigation.navigate("Settings" as never);
    } else {
      navigation.navigate(screen as never);
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    try {
      await signOut(); // Sign out from Clerk
      await authService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' as any }],
      });
    } catch (error) {
      navigation.navigate("Boarding");
    }
  };

  const handleEditPress = (property: Property) => {
    setSelectedProperty(property);
    setActionModalVisible(true);
  };

  const handleEditProperty = () => {
    setActionModalVisible(false);
    navigation.navigate("EditProperty" as any, {
      property: selectedProperty,
      onUpdate: (updatedProperty: Property) => {
        // Update the property in the local state immediately
        setProperties(prevProperties =>
          prevProperties.map(p =>
            p._id === updatedProperty._id ? { ...p, ...updatedProperty } : p
          )
        );
      }
    });
  };

  const handleReadyForInspection = async () => {
    setActionModalVisible(false);
    if (!selectedProperty) return;

    // Coverage already chosen for this property -> go straight to the building screen
    if (selectedProperty.inspectionCoverage && selectedProperty.calculatedUnits) {
      navigation.navigate('BuildingInspection' as any, {
        property: selectedProperty,
        calculatedUnits: selectedProperty.calculatedUnits,
        selectedUnits: buildUnitList(selectedProperty.calculatedUnits),
        coverage: selectedProperty.inspectionCoverage,
      });
      return;
    }

    const totalUnits = selectedProperty.units || 1;
    setSelectedCoverage('random');
    calculateSelectedUnits('random', totalUnits, selectedProperty);
    setInspectionModalVisible(true);
  };

  const buildUnitList = (count: number): string[] => {
    const list: string[] = [];
    for (let i = 1; i <= count; i++) list.push(`Unit ${String(i).padStart(3, '0')}`);
    return list;
  };

  const handleViewSummary = () => {
    setActionModalVisible(false);
    if (!selectedProperty) return;
    navigation.navigate('InspectionSummary' as any, {
      property: selectedProperty,
      selectedUnits: buildUnitList(selectedProperty.calculatedUnits || selectedProperty.units || 1),
      buildingId: 'B1',
      inspectionData: null,
    });
  };

  const calculateSelectedUnits = (coverage: string, totalUnits: number, property: Property) => {
    const unitList: string[] = [];
    let unitsToInspect = 0;

    // Calculate number of units to inspect based on coverage
    if (coverage === '100') {
      unitsToInspect = totalUnits;
    } else if (coverage === '50') {
      unitsToInspect = Math.ceil(totalUnits / 2);
    } else if (coverage === 'random') {
      // Use NSPIRE sampling for all property sizes
      if (isRandomSelectionAvailable(totalUnits)) {
        try {
          const propertyId = property._id || property.id || `property_${Date.now()}`;
          const sample = generateRandomUnitSample(totalUnits, propertyId);
          unitsToInspect = sample.unitsToInspect;
          setSelectedUnits(sample.selectedUnits);
          setCalculatedUnits(unitsToInspect);
          return; // Early return since we already set the selected units
        } catch (error) {
          console.error('Error generating NSPIRE sample:', error);
          // Fallback to old method if NSPIRE sampling fails
          unitsToInspect = Math.max(5, Math.ceil(Math.sqrt(totalUnits)));
          unitsToInspect = Math.min(unitsToInspect, totalUnits);
        }
      } else {
        // Fallback for invalid unit counts
        unitsToInspect = Math.max(5, Math.ceil(Math.sqrt(totalUnits)));
        unitsToInspect = Math.min(unitsToInspect, totalUnits);
      }
    }

    setCalculatedUnits(unitsToInspect);

    // Generate unit names dynamically
    for (let i = 1; i <= unitsToInspect; i++) {
      const unitNumber = String(i).padStart(3, '0');
      unitList.push(`Unit ${unitNumber}`);
    }

    setSelectedUnits(unitList);
  };

  const handleCoverageChange = (coverage: string) => {
    setSelectedCoverage(coverage);
    if (selectedProperty) {
      const totalUnits = selectedProperty.units || 1;
      calculateSelectedUnits(coverage, totalUnits, selectedProperty);
    }
  };

  const handleStartInspection = async () => {
    setInspectionModalVisible(false);
    setActionModalVisible(false);
    setInspectionStep(0);
    setSelectedUnitOption("");

    if (selectedProperty) {
      const propId = selectedProperty._id || selectedProperty.id;
      try {
        await propertyService.setReadyForInspection(propId);
      } catch (error) {
        console.error('Error setting ready for inspection:', error);
      }

      // Persist the coverage choice so it survives a reload (web /dashboard does the same)
      try {
        await propertyService.updateProperty(propId, {
          inspectionCoverage: selectedCoverage,
          calculatedUnits: calculatedUnits,
        });
        setProperties(prev => prev.map(p =>
          (p._id || p.id) === propId
            ? { ...p, inspectionCoverage: selectedCoverage, calculatedUnits }
            : p
        ));
      } catch (error: any) {
        console.error('Failed to save coverage:', error);
        Alert.alert('Error', 'Failed to save coverage selection');
        return;
      }

      // Resume this property if it was on hold so it becomes the active inspection
      if (selectedProperty.status === 'hold') {
        try {
          const response = await propertyService.hold(propId);
          if (response.success) {
            const newStatus = response.property?.status ?? 'active';
            setProperties(prev => prev.map(p =>
              (p._id || p.id) === propId ? { ...p, status: newStatus } : p
            ));
          }
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to resume inspection');
          return;
        }
      }
      // Navigate to BuildingInspection with selected units divided across buildings
      navigation.navigate('BuildingInspection' as any, {
        property: selectedProperty,
        calculatedUnits: calculatedUnits,
        selectedUnits: selectedUnits,
        coverage: selectedCoverage,
      });
    }
  };

  const handleCloseActionModal = () => {
    setActionModalVisible(false);
    setInspectionStep(0);
    setSelectedUnitOption("");
  };

  const handleRemoveProperty = async () => {
    if (!selectedProperty?._id) {
      setActionModalVisible(false);
      return;
    }

    Alert.alert(
      'Remove Property',
      `Are you sure you want to remove "${selectedProperty.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await propertyService.deleteProperty(selectedProperty._id!);
              if (response.success) {
                Alert.alert('Success', 'Property removed successfully');
                await fetchProperties();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove property');
            }
            setActionModalVisible(false);
          },
        },
      ]
    );
  };

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
              userType="Inspector"
            />
          </View>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      {/* Ready for Inspection Modal */}
      <Modal
        visible={inspectionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInspectionModalVisible(false)}
      >
        <ModalZoomWrapper>
        <View style={styles.inspectionModalOverlay}>
          <View style={styles.inspectionModalContent}>
            <View style={styles.inspectionModalHeader}>
              <Text style={styles.inspectionModalTitle}>Ready for Inspection</Text>
              <TouchableOpacity onPress={() => setInspectionModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inspectionPropertyName}>{selectedProperty?.name}</Text>
            <Text style={styles.totalUnitsText}>
              Total Units: <Text style={styles.totalUnitsValue}>{selectedProperty?.units || 1}</Text>
            </Text>

            <Text style={styles.coverageLabel}>Select Inspection Coverage</Text>

            {COVERAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.coverageOption,
                  selectedCoverage === option.value && styles.coverageOptionSelected
                ]}
                onPress={() => handleCoverageChange(option.value)}
              >
                <View style={styles.coverageRadio}>
                  {selectedCoverage === option.value && <View style={styles.coverageRadioInner} />}
                </View>
                <View style={styles.coverageTextContainer}>
                  <Text style={[
                    styles.coverageOptionText,
                    selectedCoverage === option.value && styles.coverageOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.coverageDescription}>{option.description}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.calculationResult}>
              <Text style={styles.calculationLabel}>Units to Inspect:</Text>
              <Text style={styles.calculationValue}>{calculatedUnits}</Text>
            </View>

            {selectedUnits.length > 0 && (
              <View style={styles.selectedUnitsList}>
                <Text style={styles.selectedUnitsLabel}>Selected Units:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.unitChips}>
                    {selectedUnits.slice(0, 5).map((unit, index) => (
                      <View key={index} style={styles.unitChip}>
                        <Text style={styles.unitChipText}>{unit}</Text>
                      </View>
                    ))}
                    {selectedUnits.length > 5 && (
                      <View style={styles.unitChip}>
                        <Text style={styles.unitChipText}>+{selectedUnits.length - 5} more</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.startInspectionButton}
              onPress={handleStartInspection}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.startInspectionButtonText}>Start AI Inspection</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseActionModal}
      >
        <ModalZoomWrapper>
        <View style={styles.actionModalOverlay}>
          <Pressable
            style={styles.actionModalBackdrop}
            onPress={handleCloseActionModal}
          />
          <Pressable style={styles.actionModalContent} onPress={() => { }}>
            <Text style={styles.actionModalTitle}>Action</Text>

            {(propertyProgress[selectedProperty?._id || selectedProperty?.id || ''] || 0) > 0 ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleViewSummary}
              >
                <Text style={styles.actionButtonText}>View Summary</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEditProperty}
              >
                <Text style={styles.actionButtonText}>Edit Property</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.inspectionModalButton]}
              onPress={handleReadyForInspection}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.inspectionModalButtonText,
                ]}
              >
                Continue Inspection
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemoveProperty}
            >
              <Text
                style={[styles.actionButtonText, styles.removeButtonText]}
              >
                Remove Property
              </Text>
            </TouchableOpacity>
          </Pressable>
        </View>
        </ModalZoomWrapper>
      </Modal>

      <SafeAreaView style={styles.container}>
        <AppHeader
          onMenuPress={onMenuPress || handleMenuPress}
          onNotificationsPress={() => navigation.navigate("Notifications")}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E7490']}
              tintColor="#0E7490"
            />
          }
        >
          {/* Page heading (web /dashboard parity) */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Property Dashboard</Text>
            <Text style={styles.pageSubtitle}>Manage your properties and initiate inspections</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddProperty")}
          >
            <Text style={styles.addButtonText}>Add New Property</Text>
          </TouchableOpacity>

          {/* Your Properties card (web parity) */}
          <View style={styles.propertiesCard}>
            <View style={styles.listHeaderRow}>
              {properties.length > 0 ? (
                <TouchableOpacity style={styles.selectAllTouch} onPress={handleSelectAll}>
                  <Ionicons
                    name={selectedProperties.size === properties.length ? 'checkbox' : 'square-outline'}
                    size={22}
                    color="#0E7490"
                  />
                  <Text style={styles.selectAllText}>Your Properties</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.selectAllText}>Your Properties</Text>
              )}
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                </Text>
              </View>
            </View>

            {selectedProperties.size > 0 && (
              <TouchableOpacity style={styles.bulkDeleteButton} onPress={handleBulkDelete}>
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                <Text style={styles.bulkDeleteButtonText}>
                  Remove {selectedProperties.size} {selectedProperties.size === 1 ? 'Property' : 'Properties'}
                </Text>
              </TouchableOpacity>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0E7490" />
              </View>
            ) : properties.length === 0 ? (
              <Text style={styles.emptyText}>No properties found. Add your first property!</Text>
            ) : (
              <>
                  {properties.map((property) => {
                    const propId = property._id || property.id;
                    const progress = propertyProgress[propId] || 0;
                    const isSelected = selectedProperties.has(propId);
                    return (
                      <View key={property.id} style={styles.propertyCard}>
                        <View style={styles.propertyCardHeader}>
                          <TouchableOpacity
                            onPress={() => handleSelectProperty(propId)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons
                              name={isSelected ? 'checkbox' : 'square-outline'}
                              size={22}
                              color={isSelected ? '#0E7490' : '#9CA3AF'}
                            />
                          </TouchableOpacity>
                          <Text style={styles.propertyName}>{property.name}</Text>
                        </View>
                        <Text style={styles.propertyDetail}>
                          Property ID:{" "}
                          <Text style={styles.propertyId}>{property.propertyId}</Text>
                        </Text>
                        <Text style={styles.propertyDetail}>
                          Address:{" "}
                          <Text style={styles.addressLink}>{property.address}</Text>
                        </Text>
                        <View style={styles.propertyMetaGrid}>
                          <View style={styles.propertyMetaCell}>
                            <Text style={styles.propertyMetaLabel}>City/Area</Text>
                            <Text style={styles.propertyMetaValue}>{property.city || '-'}</Text>
                          </View>
                          <View style={styles.propertyMetaCell}>
                            <Text style={styles.propertyMetaLabel}>State/Province</Text>
                            <Text style={styles.propertyMetaValue}>{property.state || '-'}</Text>
                          </View>
                          <View style={styles.propertyMetaCell}>
                            <Text style={styles.propertyMetaLabel}>Postal Code</Text>
                            <Text style={styles.propertyMetaValue}>{property.zipCode || '-'}</Text>
                          </View>
                          <View style={styles.propertyMetaCell}>
                            <Text style={styles.propertyMetaLabel}>Buildings</Text>
                            <Text style={styles.propertyMetaValue}>{property.buildings}</Text>
                          </View>
                          <View style={styles.propertyMetaCell}>
                            <Text style={styles.propertyMetaLabel}>Units</Text>
                            <Text style={styles.propertyMetaValue}>{property.units}</Text>
                          </View>
                        </View>

                        {/* Progress (web parity) */}
                        <View style={styles.progressBlock}>
                          <View style={styles.progressLabelRow}>
                            <Text style={styles.propertyMetaLabel}>Progress</Text>
                            <Text style={styles.progressPercent}>{progress}%</Text>
                          </View>
                          <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: (progress + '%') as any }]} />
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditPress(property)}
                        >
                          <Text style={styles.editButtonText}>
                            {progress > 0 ? 'Inspection Status' : 'Initiate'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* iOS Unit Selection Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={unitPickerVisible} transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContent}>
              <View style={styles.iosModalHeader}>
                <Text style={styles.iosModalTitle}>Select Units For Inspection</Text>
                <TouchableOpacity onPress={() => { setSelectedUnitOption(tempUnitOption); setUnitPickerVisible(false); }}>
                  <Text style={styles.iosModalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={tempUnitOption}
                onValueChange={(value) => setTempUnitOption(value)}
                style={styles.iosPickerWheel}
              >
                <Picker.Item label="Select an option" value="" color="#6B7280" />
                {UNIT_SELECTION_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.iosCancelButton} onPress={() => setUnitPickerVisible(false)}>
                <Text style={styles.iosCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F2942',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  bulkDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  bulkDeleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  selectAllTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F2942',
  },
  propertyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  propertyMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  propertyMetaCell: {
    width: '33.33%',
    paddingVertical: 6,
    paddingRight: 8,
  },
  propertyMetaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  propertyMetaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  progressBlock: {
    marginTop: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0E7490',
  },
  container: {
    flex: 1,
    backgroundColor: "#E4F0F6",
  },
  propertiesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  countPill: {
    backgroundColor: "#EDF2F7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#F94A5C",
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  propertyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  propertyDetail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 6,
  },


  propertyId: {
    color: "#0E7490",
    fontWeight: "600",
  },
  addressLink: {
    color: "#0E7490",
    textDecorationLine: "underline",
  },
  editButton: {
    backgroundColor: "#84CC16",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    flex: 1,
  },
  sidebarContainer: {
    width: 280,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  inspectionModalButton: {
    backgroundColor: "#006B8F",
    borderColor: "#006B8F",
    borderWidth: 0,
  },
  inspectionModalButtonText: {
    color: "#FFFFFF",
  },
  removeButton: {
    backgroundColor: "#FF0000",
    borderColor: "#FF0000",
    borderWidth: 0,
  },
  removeButtonText: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 40,
  },
  // iOS Picker styles
  iosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  iosModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  iosModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iosModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  iosModalDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  iosPickerWheel: {
    backgroundColor: '#FFFFFF',
  },
  iosCancelButton: {
    marginHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  iosCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  // Ready for Inspection Modal Styles
  inspectionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inspectionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inspectionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inspectionModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  inspectionPropertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
    marginBottom: 4,
  },
  totalUnitsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  totalUnitsValue: {
    fontWeight: '700',
    color: '#1F2937',
  },
  coverageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  coverageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 10,
  },
  coverageOptionSelected: {
    borderColor: '#0E7490',
    backgroundColor: '#F0FDFA',
  },
  coverageRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0E7490',
  },
  coverageTextContainer: {
    flex: 1,
  },
  coverageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  coverageOptionTextSelected: {
    color: '#0E7490',
  },
  coverageDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  calculationResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  calculationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  calculationValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E7490',
  },
  selectedUnitsList: {
    marginTop: 16,
  },
  selectedUnitsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  unitChips: {
    flexDirection: 'row',
    gap: 8,
  },
  unitChip: {
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0E7490',
  },
  startInspectionButton: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startInspectionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
