import { useOAuth, useClerk } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Country, State, City, IState } from 'country-state-city';
import { DashboardScreenNavigationProp } from "../types/navigation";
import Sidebar from "../components/Sidebar";
import {
  propertyService,
  authService,
  generateRandomUnitSample,
  isRandomSelectionAvailable
} from "../services";
import type { UnitSample } from "../services";
import { Property as ApiProperty, User } from "../services/api";
import { UNIT_SELECTION_OPTIONS } from "../utils/iosPickerUtils";

// Coverage options for inspection
const COVERAGE_OPTIONS = [
  { label: '100% - All Units', value: '100', description: 'Inspect every unit in the property' },
  { label: '50% - Half Units', value: '50', description: 'Inspect half of all units (randomly selected)' },
  { label: 'Random Sample', value: 'random', description: 'Automatically select a random sample based on NSPIRE guidelines' },
];

// Countries with their ISO codes for proper state/city lookup
const COUNTRIES = [
  { label: "USA", value: "USA", isoCode: "US" },
  { label: "UK", value: "UK", isoCode: "GB" },
  { label: "CANADA", value: "CANADA", isoCode: "CA" },
  { label: "Australia", value: "Australia", isoCode: "AU" },
];

// Helper to get country ISO code
const getCountryIsoCode = (countryValue: string): string => {
  const country = COUNTRIES.find(c => c.value === countryValue);
  return country?.isoCode || 'US';
};

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
}

export default function DashboardScreen({
  navigation,
  onMenuPress,
}: DashboardScreenProps) {
  console.log('DashboardScreen: Component mounted');
  const { signOut } = useClerk();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inspectionStep, setInspectionStep] = useState(0);
  const [selectedUnitOption, setSelectedUnitOption] = useState("");
  const [loading, setLoading] = useState(true);

  // Ready for Inspection Modal state
  const [inspectionModalVisible, setInspectionModalVisible] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState('100');
  const [calculatedUnits, setCalculatedUnits] = useState(0);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // iOS picker modal states
  const [statePickerVisible, setStatePickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [unitPickerVisible, setUnitPickerVisible] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [tempState, setTempState] = useState('');
  const [tempCity, setTempCity] = useState('');

  const [tempCountry, setTempCountry] = useState('USA');
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
  const [user, setUser] = useState<User | null>(null);

  const [propertyName, setPropertyName] = useState("");
  const [country, setCountry] = useState("USA");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  // Refresh icon animation
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [iconAnimating, setIconAnimating] = useState(false);
  const animationRef = useRef<any>(null);

  // Load user and properties on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const isoCode = getCountryIsoCode(country);
    const countryStates = State.getStatesOfCountry(isoCode) || [];
    const formattedStates = countryStates.map((s: IState) => ({
      label: s.name,
      value: s.isoCode
    })).sort((a, b) => a.label.localeCompare(b.label));
    console.log(`Dashboard states loaded for ${country}:`, formattedStates.length);
    setStates(formattedStates);
    setState(''); // Clear state selection when country changes
    setCity('');
    setCities([]);
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (state) {
      setLoadingCities(true);
      setCity(''); // Clear current city selection

      try {
        // Get cities using proper country ISO code
        const isoCode = getCountryIsoCode(country);
        const stateCities = City.getCitiesOfState(isoCode, state) || [];
        const formattedCities = stateCities.map(c => ({ label: c.name, value: c.name }))
          .sort((a, b) => a.label.localeCompare(b.label));
        console.log('Dashboard cities loaded:', formattedCities.length);
        setCities(formattedCities);
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
      setCity('');
    }
  }, [state, country]);

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

        setUser(userData);
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
          address: `${p.address}, ${p.city}, ${p.state}, ${p.zipCode}`,
        }));
        setProperties(mappedProperties);
        return mappedProperties;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch properties:', error);
      return [];
    }
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

  const startRotate = () => {
    if (iconAnimating) return;
    setIconAnimating(true);
    rotateAnim.setValue(0);
    animationRef.current = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    );
    animationRef.current.start();
  };

  const stopRotate = () => {
    try {
      animationRef.current?.stop();
    } catch (e) { }
    rotateAnim.setValue(0);
    setIconAnimating(false);
  };

  const handleRefreshIconPress = async () => {
    try {
      startRotate();
      await fetchProperties();
    } finally {
      stopRotate();
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    await fetchProperties({
      search: propertyName,
      state: state,
      city: city,
    });
    setLoading(false);
  };

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
    navigation.navigate("EditProperty", {
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
    if (selectedProperty) {
      // Calculate units based on property data
      const totalUnits = selectedProperty.units || 1;
      setCalculatedUnits(totalUnits);
      setSelectedCoverage('100');
      calculateSelectedUnits('100', totalUnits, selectedProperty);
      setInspectionModalVisible(true);
    }
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
      // Use NSPIRE hardcoded sampling for properties with 1-32 units
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
        // For properties with more than 32 units, use fallback method
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
      try {
        await propertyService.setReadyForInspection(selectedProperty._id || selectedProperty.id);
      } catch (error) {
        console.error('Error setting ready for inspection:', error);
      }
      // Navigate to PropertyInfo screen with property and selected units
      navigation.navigate('PropertyInfo', {
        property: selectedProperty,
        selectedUnits: selectedUnits,
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

  const clearPropertyName = () => {
    setPropertyName("");
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

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseActionModal}
      >
        <View style={styles.actionModalOverlay}>
          <Pressable
            style={styles.actionModalBackdrop}
            onPress={handleCloseActionModal}
          />
          <Pressable style={styles.actionModalContent} onPress={() => { }}>
            <Text style={styles.actionModalTitle}>Action</Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditProperty}
            >
              <Text style={styles.actionButtonText}>Edit Property</Text>
            </TouchableOpacity>

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
                Ready For Inspection
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
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require("../../logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Ionicons
                name="notifications-outline"
                size={28}
                color="#1F2937"
              />
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
          {/* User Greeting */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingContent}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.greetingText}>Hi, {user?.fullName?.split(' ')[0] || (user?.email ? user.email.split('@')[0] : 'User')}</Text>
            </View>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchTitleRow}>
              <Text style={styles.searchTitle}>
                Search By Name, City Or State
              </Text>
              <TouchableOpacity onPress={handleRefreshIconPress} style={styles.refreshIconButton} disabled={iconAnimating} accessibilityLabel="Refresh properties">
                <Animated.View style={{ transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
                  <Animated.View>
                    <Ionicons name={iconAnimating ? 'refresh' : 'refresh'} size={20} color={iconAnimating ? '#0E7490' : '#1F2937'} />
                  </Animated.View>
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddProperty")}
            >
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>

            {/* Property Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Property Name</Text>
              <View style={styles.inputWithClear}>
                <TextInput
                  style={styles.input}
                  placeholder="Property Name"
                  placeholderTextColor="#9CA3AF"
                  value={propertyName}
                  onChangeText={setPropertyName}
                />
                {propertyName !== "" && (
                  <TouchableOpacity
                    onPress={clearPropertyName}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Country Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { setTempCountry(country); setCountryPickerVisible(true); }}>
                  <Text style={[styles.iosPickerText, !country && styles.placeholderText]}>
                    {country || 'Select Country'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={country}
                    onValueChange={(itemValue: string) => setCountry(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#6B7280"
                  >
                    {COUNTRIES.map((c) => (
                      <Picker.Item key={c.value} label={c.label} value={c.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* State Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>State</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { setTempState(state); setStatePickerVisible(true); }}>
                  <Text style={[styles.iosPickerText, !state && styles.placeholderText]}>
                    {state ? states.find(s => s.value === state)?.label || 'Select State' : 'Select State'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state}
                    onValueChange={(itemValue: string) => setState(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#6B7280"
                  >
                    <Picker.Item label="Select State" value="" color="#6B7280" />
                    {states.map((stateItem) => (
                      <Picker.Item key={stateItem.value} label={stateItem.label} value={stateItem.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* City Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { if (cities.length > 0) { setTempCity(city); setCityPickerVisible(true); } }}>
                  <Text style={[styles.iosPickerText, !city && styles.placeholderText]}>
                    {cities.length === 0 ? 'Select state first' : (city || 'Select City')}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={city}
                    onValueChange={(itemValue: string) => setCity(itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#6B7280"
                    enabled={cities.length > 0}
                  >
                    <Picker.Item label={cities.length === 0 ? "Select state first" : "Select City"} value="" color="#6B7280" />
                    {cities.map((c, i) => (
                      <Picker.Item key={`${c.value}-${i}`} label={c.label} value={c.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            {/* Search Button */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          )}

          {/* Property List */}
          {!loading && (
            <View style={styles.propertyList}>
              {properties.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="home-outline" size={64} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No properties found</Text>
                  <Text style={styles.emptySubtext}>Add a property to get started</Text>
                </View>
              ) : (
                properties.map((property) => (
                  <View key={property.id} style={styles.propertyCard}>
                    <Text style={styles.propertyName}>{property.name}</Text>
                    <Text style={styles.propertyDetail}>
                      Property ID:{" "}
                      <Text style={styles.propertyId}>{property.propertyId}</Text>
                    </Text>
                    <Text style={styles.propertyDetail}>
                      No. of Buildings: {property.buildings}
                    </Text>
                    <Text style={styles.propertyDetail}>
                      Units: {property.units}
                    </Text>
                    <Text style={styles.propertyDetail}>
                      Address:{" "}
                      <Text style={styles.addressLink}>{property.address}</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditPress(property)}
                    >
                      <Text style={styles.editButtonText}>Edit/Update</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* iOS State Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={statePickerVisible} transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContent}>
              <View style={styles.iosModalHeader}>
                <Text style={styles.iosModalTitle}>Select State</Text>
                <TouchableOpacity onPress={() => { setState(tempState); setStatePickerVisible(false); }}>
                  <Text style={styles.iosModalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempState} onValueChange={setTempState} style={styles.iosPickerWheel}>
                <Picker.Item label="Select State" value="" color="#6B7280" />
                {states.map((stateItem) => (
                  <Picker.Item key={stateItem.value} label={stateItem.label} value={stateItem.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.iosCancelButton} onPress={() => setStatePickerVisible(false)}>
                <Text style={styles.iosCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS City Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={cityPickerVisible} transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContent}>
              <View style={styles.iosModalHeader}>
                <Text style={styles.iosModalTitle}>Select City</Text>
                <TouchableOpacity onPress={() => { setCity(tempCity); setCityPickerVisible(false); }}>
                  <Text style={styles.iosModalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempCity} onValueChange={setTempCity} style={styles.iosPickerWheel}>
                <Picker.Item label="Select City" value="" color="#6B7280" />
                {cities.map((c, i) => (
                  <Picker.Item key={`${c.value}-${i}`} label={c.label} value={c.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.iosCancelButton} onPress={() => setCityPickerVisible(false)}>
                <Text style={styles.iosCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS Country Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={countryPickerVisible} transparent animationType="slide">
          <View style={styles.iosModalOverlay}>
            <View style={styles.iosModalContent}>
              <View style={styles.iosModalHeader}>
                <Text style={styles.iosModalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => { setCountry(tempCountry); setCountryPickerVisible(false); }}>
                  <Text style={styles.iosModalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempCountry} onValueChange={setTempCountry} style={styles.iosPickerWheel}>
                {COUNTRIES.map((c) => (
                  <Picker.Item key={c.value} label={c.label} value={c.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.iosCancelButton} onPress={() => setCountryPickerVisible(false)}>
                <Text style={styles.iosCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS Unit Selection Picker Modal - MOVED OUTSIDE ACTION MODAL */}
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
  container: {
    flex: 1,
    backgroundColor: "#CEF8FF",
  },
  headerContainer: {
    backgroundColor: "#0E7490",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  greetingContainer: {
    backgroundColor: "#0E7490",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greetingContent: {
    backgroundColor: "#0E7490",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#CEF8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchSection: {
    backgroundColor: "#CEF8FF",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  searchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#FF4D67",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inspectionButton: {
    backgroundColor: "#84CC16",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  inspectionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  inputWithClear: {
    position: "relative",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 36,
    fontSize: 14,
    color: "#374151",
    borderWidth: 0,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 0,
    position: "relative",
    minHeight: 55,
    justifyContent: "center",
  },
  picker: {
    height: 55,
    color: "#1F2937",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: "absolute",
    right: 12,
    top: 18,
    pointerEvents: "none",
  },
  searchButton: {
    backgroundColor: "#0E7490",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 10,
    width: 100,
  },
  refreshIconButton: {
    padding: 6,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  propertyList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  unitSelectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  unitPickerContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  unitPicker: {
    height: 50,
    color: "#1F2937",
  },
  backButton: {
    backgroundColor: "#6B7280",
    borderColor: "#6B7280",
    borderWidth: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  // iOS Picker styles
  iosPickerButton: {
    backgroundColor: '#D1F2EB',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
  },
  placeholderText: {
    color: '#6B7280',
  },
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
