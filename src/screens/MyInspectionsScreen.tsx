import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';
import { authService, inspectionService, propertyService } from '../services';
import { Inspection, Property as PropertyType, User } from '../services/api';
import { US_STATES } from '../constants/usStates';

interface MyInspectionsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

export default function MyInspectionsScreen({ navigation, onMenuPress }: MyInspectionsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [compliance, setCompliance] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  // iOS Picker State
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'location' | 'compliance' | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);
      await fetchData();
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      // Fetch properties with error handling
      try {
        const propertiesResponse = await propertyService.getProperties();
        if (propertiesResponse?.success && Array.isArray(propertiesResponse.properties)) {
          setProperties(propertiesResponse.properties);
        } else {
          setProperties([]);
        }
      } catch (propError) {
        console.error('Error fetching properties:', propError);
        setProperties([]);
      }

      // Fetch inspections with error handling
      try {
        const inspectionsResponse = await inspectionService.getInspections();
        if (inspectionsResponse?.success && Array.isArray(inspectionsResponse.inspections)) {
          setInspections(inspectionsResponse.inspections);
        } else {
          setInspections([]);
        }
      } catch (inspError) {
        console.error('Error fetching inspections:', inspError);
        setInspections([]);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Filter properties based on search and filters with null safety
  const filteredProperties = (properties || []).filter((property) => {
    if (!property) return false;

    const matchesSearch = !searchText ||
      property.name?.toLowerCase()?.includes(searchText.toLowerCase()) ||
      property._id?.toLowerCase()?.includes(searchText.toLowerCase());

    const matchesLocation = !location ||
      property.state?.toLowerCase() === location.toLowerCase();

    // Find inspection status for this property with null safety
    const propertyInspections = (inspections || []).filter(i => {
      if (!i || !property?._id) return false;
      const inspectionPropertyId = typeof i.property === 'object' ? i.property?._id : i.property;
      return inspectionPropertyId === property._id;
    });
    const isCompliant = propertyInspections.some(i => i?.status === 'completed');
    const matchesCompliance = !compliance ||
      (compliance === 'compliant' && isCompliant) ||
      (compliance === 'non-compliant' && !isCompliant);

    return matchesSearch && matchesLocation && matchesCompliance;
  });

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
      // Already on MyInspections
    } else if (screen === 'Reports') {
      navigation.navigate('Reports' as never);
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' as never }],
    });
  };

  const handleEditPress = (property: PropertyType) => {
    setSelectedProperty(property);
    setActionModalVisible(true);
  };

  const handleEditProperty = () => {
    setActionModalVisible(false);
    navigation.navigate('EditProperty' as never, { property: selectedProperty } as never);
  };

  const handleReadyForInspection = async () => {
    setActionModalVisible(false);
    if (selectedProperty) {
      try {
        await propertyService.setReadyForInspection(selectedProperty._id!);
        navigation.navigate('UnitInspection' as never, { property: selectedProperty } as never);
      } catch (error) {
        console.error('Error setting ready for inspection:', error);
        navigation.navigate('UnitInspection' as never, { property: selectedProperty } as never);
      }
    }
  };

  const handlePropertyCardPress = (property: PropertyType) => {
    navigation.navigate('UnitInspection' as never, { property: property } as never);
  };

  const handleRemoveProperty = async () => {
    if (!selectedProperty?._id) return;

    Alert.alert(
      'Remove Property',
      `Are you sure you want to remove "${selectedProperty.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setActionModalVisible(false);
            try {
              const response = await propertyService.deleteProperty(selectedProperty._id!);
              if (response.success) {
                setProperties(prev => prev.filter(p => p._id !== selectedProperty._id));
                Alert.alert('Success', 'Property removed successfully');
              } else {
                Alert.alert('Error', response.message || 'Failed to remove property');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove property');
            }
          }
        }
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

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalTitle}>Action</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditProperty}
            >
              <Text style={styles.actionButtonText}>Edit Property</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.inspectionButton]}
              onPress={handleReadyForInspection}
            >
              <Text style={[styles.actionButtonText, styles.inspectionButtonText]}>Ready For Inspection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemoveProperty}
            >
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove Property</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* iOS Picker Modal */}
      <Modal
        visible={pickerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickerModalVisible(false)}
          />
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity
                onPress={() => setPickerModalVisible(false)}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={
                  pickerType === 'location' ? location :
                    compliance
                }
                onValueChange={(itemValue) => {
                  if (pickerType === 'location') setLocation(itemValue);
                  else if (pickerType === 'compliance') setCompliance(itemValue);
                }}
                style={styles.iosPicker}
                itemStyle={{ fontSize: 18, height: 50, color: 'black' }}
              >
                {pickerType === 'location' && (
                  <>
                    <Picker.Item label="All States" value="" color="black" />
                    {US_STATES.map((stateItem) => (
                      <Picker.Item
                        key={stateItem.value}
                        label={stateItem.label}
                        value={stateItem.value}
                        color="black"
                      />
                    ))}
                  </>
                )}
                {pickerType === 'compliance' && (
                  <>
                    <Picker.Item label="Compliance" value="" color="black" />
                    <Picker.Item label="Compliant" value="compliant" color="black" />
                    <Picker.Item label="Non-Compliant" value="non-compliant" color="black" />
                  </>
                )}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require('../../logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>My Inspection</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProperty')}
            >
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search property Here......"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Filters */}
          <Text style={styles.filtersLabel}>Filters</Text>
          <View style={styles.filtersContainer}>
            <View style={styles.filterItem}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => {
                      setPickerType('location');
                      setPickerModalVisible(true);
                    }}
                  >
                    <Text style={[styles.iosPickerText, !location && { color: '#9CA3AF' }]}>
                      {location ? US_STATES.find(s => s.value === location)?.label || location : "All States"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={location}
                    onValueChange={(itemValue: string) => setLocation(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="All States" value="" />
                    {US_STATES.map((stateItem) => (
                      <Picker.Item
                        key={stateItem.value}
                        label={stateItem.label}
                        value={stateItem.value}
                      />
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

            <View style={styles.filterItem}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => {
                      setPickerType('compliance');
                      setPickerModalVisible(true);
                    }}
                  >
                    <Text style={[styles.iosPickerText, !compliance && { color: '#9CA3AF' }]}>
                      {compliance === 'compliant' ? 'Compliant' : compliance === 'non-compliant' ? 'Non-Compliant' : "Compliance"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={compliance}
                    onValueChange={(itemValue: string) => setCompliance(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Compliance" value="" />
                    <Picker.Item label="Compliant" value="compliant" />
                    <Picker.Item label="Non-Compliant" value="non-compliant" />
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

          {/* Property List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          ) : filteredProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No properties found</Text>
              <Text style={styles.emptySubtext}>Add a property to get started</Text>
            </View>
          ) : (
            <View style={styles.propertyList}>
              {filteredProperties.map((property) => property && (
                <TouchableOpacity
                  key={property._id || Math.random().toString()}
                  style={styles.propertyCard}
                  activeOpacity={0.7}
                  onPress={() => handlePropertyCardPress(property)}
                >
                  <View style={styles.propertyHeader}>
                    <Text style={styles.propertyName}>{property.name || 'Unnamed Property'}</Text>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditPress(property);
                      }}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.propertyDetail}>
                    Property ID: <Text style={styles.propertyId}>{property._id?.slice(-8)?.toUpperCase() || 'N/A'}</Text>
                  </Text>
                  <Text style={styles.propertyDetail}>
                    No. of Buildings: <Text style={styles.propertyValue}>{property.buildings || 0}</Text>
                  </Text>
                  <Text style={styles.propertyDetail}>
                    Units: <Text style={styles.propertyValue}>{property.units || 0}</Text>
                  </Text>
                  <Text style={styles.propertyDetail}>
                    Address: <Text style={styles.addressLink}>{[property.address, property.city, property.state, property.zipCode].filter(Boolean).join(', ') || 'No address'}</Text>
                  </Text>

                  {/* Edit/Update Button */}
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditPress(property);
                    }}
                  >
                    <Text style={styles.editButtonText}>Edit/Update</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterItem: {
    flex: 1,
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
  propertyList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  propertyDetail: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  propertyId: {
    color: '#0E7490',
    fontWeight: '600',
  },
  propertyValue: {
    color: '#1F2937',
    fontWeight: '600',
  },
  addressLink: {
    color: '#0E7490',
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
  editButton: {
    backgroundColor: '#84CC16',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inspectionButton: {
    backgroundColor: '#006B8F',
    borderColor: '#006B8F',
    borderWidth: 0,
  },
  inspectionButtonText: {
    color: '#FFFFFF',
  },
  removeButton: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
    borderWidth: 0,
  },
  removeButtonText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
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
