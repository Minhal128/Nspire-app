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
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import Sidebar from '../components/Sidebar';
import IOSPickerModal from '../components/IOSPickerModal';
import { 
  authService, 
  inspectionService, 
  propertyService,
  generateRandomUnitSample,
  isRandomSelectionAvailable
} from '../services';
import type { UnitSample } from '../services';
import { Inspection, Property as PropertyType, User } from '../services/api';
import { US_STATES } from '../constants/usStates';
import { US_STATE_OPTIONS } from '../utils/iosPickerUtils';

const COMPLIANCE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

// State options with "All States" as first option
const STATE_OPTIONS = [
  { label: 'All States', value: '' },
  ...US_STATE_OPTIONS,
];

// Coverage options for inspection
const COVERAGE_OPTIONS = [
  { label: 'Random Units', value: 'random', description: 'Automatically select a random sample based on NSPIRE guidelines' },
  { label: '50%', value: '50', description: 'Inspect half of all units (randomly selected)' },
  { label: '100%', value: '100', description: 'Inspect every unit in the property' },
];

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

  // Country/State/City filter states (text-based)
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [countryFilterText, setCountryFilterText] = useState('');
  const [stateFilterText, setStateFilterText] = useState('');
  const [cityFilterText, setCityFilterText] = useState('');

  // iOS Picker Modal states
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [compliancePickerVisible, setCompliancePickerVisible] = useState(false);

  // Edit Property Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPropertyName, setEditPropertyName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editZipCode, setEditZipCode] = useState('');
  const [editBuildings, setEditBuildings] = useState('');
  const [editUnits, setEditUnits] = useState('');
  const [savingProperty, setSavingProperty] = useState(false);

  // Ready for Inspection Modal state
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState('random');
  const [calculatedUnits, setCalculatedUnits] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

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

  // Load all countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState('');
      setSelectedCity('');
      setCities([]);
      setStateFilterText('');
      setCityFilterText('');
    } else {
      setStates([]);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      setSelectedCity('');
      setCityFilterText('');
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry, selectedState]);

  // Country/State/City blur handlers for filter text inputs
  const handleCountryFilterBlur = () => {
    if (!countryFilterText.trim()) {
      setSelectedCountry('');
      return;
    }
    const lower = countryFilterText.trim().toLowerCase();
    const found = countries.find(
      (c) => c.name.toLowerCase() === lower || c.isoCode.toLowerCase() === lower,
    ) || countries.find(
      (c) => c.name.toLowerCase().startsWith(lower),
    );
    if (found) {
      setSelectedCountry(found.isoCode);
      setCountryFilterText(found.name);
    } else {
      setSelectedCountry('');
    }
  };

  const handleStateFilterBlur = () => {
    if (!stateFilterText.trim()) {
      setSelectedState('');
      return;
    }
    const lower = stateFilterText.trim().toLowerCase();
    const found = states.find(
      (s) => s.name.toLowerCase() === lower || s.isoCode.toLowerCase() === lower,
    ) || states.find(
      (s) => s.name.toLowerCase().startsWith(lower),
    );
    if (found) {
      setSelectedState(found.isoCode);
      setStateFilterText(found.name);
    } else {
      setSelectedState('');
    }
  };

  const handleCityFilterBlur = () => {
    if (!cityFilterText.trim()) {
      setSelectedCity('');
      return;
    }
    const lower = cityFilterText.trim().toLowerCase();
    const found = cities.find(
      (c) => c.name.toLowerCase() === lower,
    ) || cities.find(
      (c) => c.name.toLowerCase().startsWith(lower),
    );
    if (found) {
      setSelectedCity(found.name);
      setCityFilterText(found.name);
    } else {
      setSelectedCity('');
    }
  };

  // Filter properties based on search and filters with null safety
  const filteredProperties = (properties || []).filter((property) => {
    if (!property) return false;

    const matchesSearch = !searchText ||
      property.name?.toLowerCase()?.includes(searchText.toLowerCase()) ||
      property._id?.toLowerCase()?.includes(searchText.toLowerCase());

    // Match country - if property doesn't have country field, don't filter by country
    // Also check if property country matches selected country name or code
    const selectedCountryName = countries.find(c => c.isoCode === selectedCountry)?.name;
    const propertyCountry = (property as any).country?.toLowerCase();
    const matchesCountry = !selectedCountry || 
      !propertyCountry || // If property has no country, don't exclude it
      propertyCountry === selectedCountryName?.toLowerCase() ||
      propertyCountry === selectedCountry?.toLowerCase() ||
      propertyCountry === 'usa' && selectedCountry === 'US' ||
      propertyCountry === 'united states' && selectedCountry === 'US' ||
      propertyCountry === 'uk' && selectedCountry === 'GB' ||
      propertyCountry === 'united kingdom' && selectedCountry === 'GB' ||
      propertyCountry === 'canada' && selectedCountry === 'CA' ||
      propertyCountry === 'australia' && selectedCountry === 'AU';

    // Match state - check both state name and state code
    const selectedStateName = states.find(s => s.isoCode === selectedState)?.name;
    const propertyState = property.state?.toLowerCase();
    const matchesState = !selectedState ||
      !propertyState || // If property has no state, don't exclude it
      propertyState === selectedStateName?.toLowerCase() ||
      propertyState === selectedState?.toLowerCase();

    // Match city
    const propertyCity = property.city?.toLowerCase();
    const matchesCity = !selectedCity ||
      !propertyCity || // If property has no city, don't exclude it
      propertyCity === selectedCity?.toLowerCase() ||
      propertyCity?.includes(selectedCity?.toLowerCase()) ||
      selectedCity?.toLowerCase()?.includes(propertyCity);

    // Find inspection status for this property with null safety
    const propertyInspections = (inspections || []).filter(i => {
      if (!i || !property?._id) return false;
      const inspectionPropertyId = typeof i.property === 'object' ? i.property?._id : i.property;
      return inspectionPropertyId === property._id;
    });
    const isPaid = propertyInspections.some(i => i?.status === 'completed');
    const matchesCompliance = !compliance ||
      (compliance === 'paid' && isPaid) ||
      (compliance === 'unpaid' && !isPaid);

    return matchesSearch && matchesCountry && matchesState && matchesCity && matchesCompliance;
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
    if (selectedProperty) {
      // Populate edit modal fields with current property data
      setEditPropertyName(selectedProperty.name || '');
      setEditAddress(selectedProperty.address || '');
      setEditCity(selectedProperty.city || '');
      setEditState(selectedProperty.state || '');
      setEditZipCode(selectedProperty.zipCode || '');
      setEditBuildings(String(selectedProperty.buildings || ''));
      setEditUnits(String(selectedProperty.units || ''));
      setEditModalVisible(true);
    }
  };

  const handleSaveEditProperty = async () => {
    if (!selectedProperty?._id) return;
    
    if (!editPropertyName.trim() || !editAddress.trim() || !editCity.trim() || !editState.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSavingProperty(true);
    try {
      const updatedData = {
        name: editPropertyName.trim(),
        address: editAddress.trim(),
        city: editCity.trim(),
        state: editState.trim(),
        zipCode: editZipCode.trim(),
        buildings: parseInt(editBuildings) || 1,
        units: parseInt(editUnits) || 1,
      };

      const response = await propertyService.updateProperty(selectedProperty._id, updatedData);
      if (response.success) {
        // Update local state
        setProperties(prev => prev.map(p => 
          p._id === selectedProperty._id ? { ...p, ...updatedData } : p
        ));
        setEditModalVisible(false);
        Alert.alert('Success', 'Property updated successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Error', 'Failed to update property');
    } finally {
      setSavingProperty(false);
    }
  };

  const handleReadyForInspection = async () => {
    setActionModalVisible(false);
    if (selectedProperty) {
      // Show coverage modal first
      const totalUnits = selectedProperty.units || 1;
      setCalculatedUnits(totalUnits);
      setSelectedCoverage('random');
      calculateSelectedUnits('random', totalUnits, selectedProperty);
      setInspectionModalVisible(true);
    }
  };

  const calculateSelectedUnits = (coverage: string, totalUnits: number, property: PropertyType) => {
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

    // Generate unit names - use property's unit data if available, otherwise generate sequentially
    const propertyUnits = property.unitList || [];
    if (propertyUnits.length > 0) {
      // Use actual unit names from property
      if (coverage === '100') {
        unitList.push(...propertyUnits.slice(0, unitsToInspect));
      } else {
        // Randomly select units
        const shuffled = [...propertyUnits].sort(() => Math.random() - 0.5);
        unitList.push(...shuffled.slice(0, unitsToInspect));
      }
    } else {
      // Generate unit names dynamically
      for (let i = 1; i <= unitsToInspect; i++) {
        const unitNumber = String(i).padStart(3, '0');
        unitList.push(`Unit ${unitNumber}`);
      }
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
    if (selectedProperty) {
      try {
        await propertyService.setReadyForInspection(selectedProperty._id!);
      } catch (error) {
        console.error('Error setting ready for inspection:', error);
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

  const handlePropertyCardPress = (property: PropertyType) => {
    // Open the Ready for Inspection modal when clicking on property card
    setSelectedProperty(property);
    const totalUnits = property.units || 1;
    setCalculatedUnits(totalUnits);
    setSelectedCoverage('100');
    calculateSelectedUnits('100', totalUnits, property);
    setInspectionModalVisible(true);
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
            <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
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
          <View style={styles.filterSection}>
            <View style={styles.filterInputGroup}>
              <Text style={styles.filterInputLabel}>Country</Text>
              <TextInput
                style={styles.filterTextInput}
                placeholder="Enter Country"
                placeholderTextColor="#9CA3AF"
                value={countryFilterText}
                onChangeText={(t) => { setCountryFilterText(t); if (!t.trim()) setSelectedCountry(''); }}
                onBlur={handleCountryFilterBlur}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.filterInputGroup}>
              <Text style={styles.filterInputLabel}>State</Text>
              <TextInput
                style={styles.filterTextInput}
                placeholder={selectedCountry ? 'Enter State' : 'Select Country first'}
                placeholderTextColor="#9CA3AF"
                value={stateFilterText}
                onChangeText={(t) => { setStateFilterText(t); if (!t.trim()) setSelectedState(''); }}
                onBlur={handleStateFilterBlur}
                autoCapitalize="words"
                editable={!!selectedCountry}
              />
            </View>

            <View style={styles.filterInputGroup}>
              <Text style={styles.filterInputLabel}>City</Text>
              <TextInput
                style={styles.filterTextInput}
                placeholder={selectedState ? 'Enter City' : 'Select state first'}
                placeholderTextColor="#9CA3AF"
                value={cityFilterText}
                onChangeText={(t) => { setCityFilterText(t); if (!t.trim()) setSelectedCity(''); }}
                onBlur={handleCityFilterBlur}
                autoCapitalize="words"
                editable={!!selectedState}
              />
            </View>
          </View>

          {/* Payment Status */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterItem}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setCompliancePickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !compliance && { color: '#9CA3AF' }]}>
                      {compliance === 'paid' ? 'Paid' : compliance === 'unpaid' ? 'Unpaid' : "Payment Status"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={compliance}
                    onValueChange={(itemValue: string) => setCompliance(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Payment Status" value="" />
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

      {/* iOS Picker Modals */}
      <IOSPickerModal
        visible={compliancePickerVisible}
        title="Select Payment Status"
        options={COMPLIANCE_OPTIONS}
        selectedValue={compliance}
        onSelect={setCompliance}
        onClose={() => setCompliancePickerVisible(false)}
      />

      {/* Edit Property Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.editModalOverlay}
        >
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Property</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editModalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Property Name *</Text>
                <TextInput
                  style={styles.editInput}
                  value={editPropertyName}
                  onChangeText={setEditPropertyName}
                  placeholder="Enter property name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address *</Text>
                <TextInput
                  style={styles.editInput}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Enter street address"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editCity}
                    onChangeText={setEditCity}
                    placeholder="City"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editState}
                    onChangeText={setEditState}
                    placeholder="Enter State"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Zip Code</Text>
                <TextInput
                  style={styles.editInput}
                  value={editZipCode}
                  onChangeText={setEditZipCode}
                  placeholder="Zip Code"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Buildings</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editBuildings}
                    onChangeText={setEditBuildings}
                    placeholder="No. of Buildings"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Units</Text>
                  <TextInput
                    style={styles.editInput}
                    value={editUnits}
                    onChangeText={setEditUnits}
                    placeholder="No. of Units"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelEditButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveEditButton, savingProperty && styles.disabledButton]}
                onPress={handleSaveEditProperty}
                disabled={savingProperty}
              >
                {savingProperty ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveEditButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Ready for Inspection Modal */}
      <Modal
        visible={inspectionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInspectionModalVisible(false)}
      >
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
      </Modal>
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
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterInputGroup: {
    marginBottom: 12,
  },
  filterInputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  filterTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  // Edit Property Modal Styles
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  editModalForm: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1F2937',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  editPickerWrapper: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  editPicker: {
    height: 48,
    marginHorizontal: -8,
  },
  pickerSelectedText: {
    fontSize: 14,
    color: '#1F2937',
  },
  pickerPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  editModalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelEditButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveEditButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
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
