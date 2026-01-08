import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { propertyService, locationService, CountryOption, StateOption, CityOption } from '../services';

interface AddPropertyScreenProps {
  navigation: any;
}

export default function AddPropertyScreen({ navigation }: AddPropertyScreenProps) {
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Location data
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // iOS Picker State - Remove modal state, use ActionSheetIOS instead
  const showIOSPicker = (type: 'country' | 'state' | 'city') => {
    let options: string[] = [];
    let values: string[] = [];
    
    if (type === 'country') {
      options = ['Cancel', ...countries.map(c => c.label)];
      values = ['', ...countries.map(c => c.isoCode)];
    } else if (type === 'state') {
      if (!selectedCountry) {
        Alert.alert('Notice', 'Please select a country first');
        return;
      }
      options = ['Cancel', ...states.map(s => s.label)];
      values = ['', ...states.map(s => s.isoCode)];
    } else if (type === 'city') {
      if (!selectedState) {
        Alert.alert('Notice', 'Please select a state first');
        return;
      }
      options = ['Cancel', ...cities.map(c => c.label)];
      values = ['', ...cities.map(c => c.value)];
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        title: `Select ${type === 'country' ? 'Country' : type === 'state' ? 'State/Province' : 'City'}`,
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) { // Not cancel
          const selectedValue = values[buttonIndex];
          if (type === 'country') {
            setSelectedCountry(selectedValue);
          } else if (type === 'state') {
            setSelectedState(selectedValue);
          } else if (type === 'city') {
            setSelectedCity(selectedValue);
          }
        }
      }
    );
  };

  // Initialize countries on component mount
  useEffect(() => {
    const allCountries = locationService.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoadingStates(true);
      setSelectedState('');
      setSelectedCity('');
      setCities([]);

      const countryStates = locationService.getStatesByCountry(selectedCountry);
      setStates(countryStates);
      setLoadingStates(false);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoadingCities(true);
      setSelectedCity('');

      const stateCities = locationService.getCitiesByState(selectedCountry, selectedState);
      setCities(stateCities);
      setLoadingCities(false);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const validateForm = () => {
    if (!propertyName.trim()) {
      Alert.alert('Validation Error', 'Property name is required');
      return false;
    }
    if (!selectedCountry) {
      Alert.alert('Validation Error', 'Country is required');
      return false;
    }
    if (!selectedState) {
      Alert.alert('Validation Error', 'State/Province is required');
      return false;
    }
    if (!selectedCity) {
      Alert.alert('Validation Error', 'City is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!postalCode.trim()) {
      Alert.alert('Validation Error', 'Postal code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Generate property ID if not provided
      const generatedPropertyId = propertyId.trim() || `PROP-${Date.now()}`;

      // Get full location names for storage
      const countryData = locationService.getCountryByCode(selectedCountry);
      const stateData = locationService.getStateByCode(selectedCountry, selectedState);

      const propertyData = {
        propertyId: generatedPropertyId,
        name: propertyName.trim(),
        address: address.trim(),
        city: selectedCity,
        state: selectedState,
        country: selectedCountry,
        countryName: countryData?.name || selectedCountry,
        stateName: stateData?.name || selectedState,
        zipCode: postalCode.trim(),
        buildings: parseInt(numberOfBuildings) || 1,
        units: parseInt(numberOfUnits) || 1,
      };

      const response = await propertyService.createProperty(propertyData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Property added successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to add property');
      }
    } catch (error: any) {
      console.error('Add property error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Property</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LocationStats')}
            style={styles.statsButton}
          >
            <Ionicons name="stats-chart" size={20} color="#0E7490" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>

              {/* Info Banner */}
              <View style={styles.infoBanner}>
                <Ionicons name="information-circle" size={20} color="#0E7490" />
                <Text style={styles.infoBannerText}>
                  Inspector Portal supports: US, Canada, UK & Australia
                </Text>
              </View>

              {/* Property ID (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Property ID (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Property ID (auto-generated if empty)"
                  placeholderTextColor="#6B7280"
                  value={propertyId}
                  onChangeText={setPropertyId}
                />
              </View>

              {/* Property Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Property Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Property Name"
                  placeholderTextColor="#6B7280"
                  value={propertyName}
                  onChangeText={setPropertyName}
                />
              </View>

              {/* Number Of Building */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number Of Building</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Number of Buildings"
                  placeholderTextColor="#6B7280"
                  value={numberOfBuildings}
                  onChangeText={setNumberOfBuildings}
                  keyboardType="number-pad"
                />
              </View>

              {/* Number Of Unit */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number Of Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Number of Units"
                  placeholderTextColor="#6B7280"
                  value={numberOfUnits}
                  onChangeText={setNumberOfUnits}
                  keyboardType="number-pad"
                />
              </View>

              {/* Country */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={() => showIOSPicker('country')}
                    >
                      <Text style={[styles.iosPickerText, !selectedCountry && { color: '#6B7280' }]}>
                        {selectedCountry ? countries.find(c => c.isoCode === selectedCountry)?.label || selectedCountry : "Select Country"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={selectedCountry}
                      onValueChange={(itemValue: string) => setSelectedCountry(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Country" value="" color="#6B7280" />
                      {countries.map((country) => (
                        <Picker.Item
                          key={country.isoCode}
                          label={country.label}
                          value={country.isoCode}
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

              {/* State/Province */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>State/Province</Text>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={() => showIOSPicker('state')}
                    >
                      <Text style={[styles.iosPickerText, !selectedState && { color: '#6B7280' }]}>
                        {selectedState ? states.find(s => s.isoCode === selectedState)?.label || selectedState : "Select State/Province"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={selectedState}
                      onValueChange={(itemValue: string) => setSelectedState(itemValue)}
                      style={styles.picker}
                      enabled={states.length > 0 && !loadingStates}
                    >
                      <Picker.Item
                        label={loadingStates ? "Loading states..." : states.length === 0 ? "Select country first" : "Select State/Province"}
                        value=""
                        color="#6B7280"
                      />
                      {states.map((state) => (
                        <Picker.Item
                          key={state.isoCode}
                          label={state.label}
                          value={state.isoCode}
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

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your address"
                  placeholderTextColor="#6B7280"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* City (Area) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City (Area)</Text>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={() => showIOSPicker('city')}
                    >
                      <Text style={[styles.iosPickerText, !selectedCity && { color: '#6B7280' }]}>
                        {selectedCity ? cities.find(c => c.value === selectedCity)?.label || selectedCity : "Select City"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={selectedCity}
                      onValueChange={(itemValue: string) => setSelectedCity(itemValue)}
                      style={styles.picker}
                      enabled={cities.length > 0 && !loadingCities}
                    >
                      <Picker.Item
                        label={loadingCities ? "Loading cities..." : cities.length === 0 ? "Select state first" : "Select City"}
                        value=""
                        color="#6B7280"
                      />
                      {cities.map((city, index) => (
                        <Picker.Item
                          key={`${city.value}-${index}`}
                          label={city.label}
                          value={city.value}
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

              {/* Postal Code */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Postal Code"
                  placeholderTextColor="#6B7280"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  keyboardType="number-pad"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Add Property</Text>
                )}
              </TouchableOpacity>

              {/* Bottom spacing for keyboard */}
              <View style={{ height: 50 }} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  statsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0E7490',
  },
  infoBannerText: {
    fontSize: 13,
    color: '#0E7490',
    marginLeft: 8,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#D1F2EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#D1F2EB',
    borderRadius: 8,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#374151',
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  submitButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  iosPickerButton: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 14,
  },
});
