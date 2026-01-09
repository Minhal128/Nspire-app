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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Country, State, City } from 'country-state-city';
import { propertyService } from '../services';

const SUPPORTED_COUNTRIES = ['US', 'GB', 'CA', 'AU'];

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

  // iOS picker modal states
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [statePickerVisible, setStatePickerVisible] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const [tempCountry, setTempCountry] = useState('');
  const [tempState, setTempState] = useState('');
  const [tempCity, setTempCity] = useState('');

  const [countries, setCountries] = useState<{label: string; value: string}[]>([]);
  const [states, setStates] = useState<{label: string; value: string}[]>([]);
  const [cities, setCities] = useState<{label: string; value: string}[]>([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries()
      .filter(c => SUPPORTED_COUNTRIES.includes(c.isoCode))
      .map(c => ({ label: c.name, value: c.isoCode }))
      .sort((a, b) => a.label.localeCompare(b.label));
    setCountries(allCountries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setSelectedState('');
      setSelectedCity('');
      setCities([]);
      const countryStates = State.getStatesOfCountry(selectedCountry)
        .map(s => ({ label: s.name, value: s.isoCode }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setStates(countryStates);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setSelectedCity('');
      let cityList = City.getCitiesOfState(selectedCountry, selectedState);
      if ((!cityList || cityList.length === 0) && selectedCountry === 'GB') {
        cityList = City.getCitiesOfCountry(selectedCountry) || [];
      }
      const formattedCities = (cityList || [])
        .map(c => ({ label: c.name, value: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setCities(formattedCities);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const validateForm = () => {
    if (!propertyName.trim()) {
      Alert.alert('Error', 'Property name is required');
      return false;
    }
    if (!selectedCountry) {
      Alert.alert('Error', 'Country is required');
      return false;
    }
    if (!selectedState) {
      Alert.alert('Error', 'State/Province is required');
      return false;
    }
    if (!selectedCity) {
      Alert.alert('Error', 'City is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const generatedPropertyId = propertyId.trim() || `PROP-${Date.now()}`;
      const countryData = Country.getCountryByCode(selectedCountry);
      const stateData = State.getStateByCodeAndCountry(selectedState, selectedCountry);

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
        Alert.alert('Success', 'Property added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to add property');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LocationStats')} style={styles.statsButton}>
          <Ionicons name="stats-chart" size={20} color="#0E7490" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View style={styles.infoBanner}>
              <Ionicons name="information-circle" size={20} color="#0E7490" />
              <Text style={styles.infoBannerText}>Supports: USA, Canada, UK & Australia</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property ID (Optional)</Text>
              <TextInput style={styles.input} placeholder="Auto-generated if empty" placeholderTextColor="#6B7280" value={propertyId} onChangeText={setPropertyId} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Name</Text>
              <TextInput style={styles.input} placeholder="Enter Property Name" placeholderTextColor="#6B7280" value={propertyName} onChangeText={setPropertyName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number Of Buildings</Text>
              <TextInput style={styles.input} placeholder="Number of Buildings" placeholderTextColor="#6B7280" value={numberOfBuildings} onChangeText={setNumberOfBuildings} keyboardType="number-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number Of Units</Text>
              <TextInput style={styles.input} placeholder="Number of Units" placeholderTextColor="#6B7280" value={numberOfUnits} onChangeText={setNumberOfUnits} keyboardType="number-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Country</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { setTempCountry(selectedCountry); setCountryPickerVisible(true); }}>
                  <Text style={[styles.iosPickerText, !selectedCountry && styles.placeholderText]}>
                    {selectedCountry ? countries.find(c => c.value === selectedCountry)?.label || 'Select Country' : 'Select Country'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker selectedValue={selectedCountry} onValueChange={setSelectedCountry} style={styles.picker} dropdownIconColor="#6B7280">
                    <Picker.Item label="Select Country" value="" color="#6B7280" />
                    {countries.map((c) => (
                      <Picker.Item key={c.value} label={c.label} value={c.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>State/Province</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { if (states.length > 0) { setTempState(selectedState); setStatePickerVisible(true); } }}>
                  <Text style={[styles.iosPickerText, !selectedState && styles.placeholderText]}>
                    {states.length === 0 ? 'Select country first' : (selectedState ? states.find(s => s.value === selectedState)?.label || 'Select State/Province' : 'Select State/Province')}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker selectedValue={selectedState} onValueChange={setSelectedState} style={styles.picker} dropdownIconColor="#6B7280" enabled={states.length > 0}>
                    <Picker.Item label={states.length === 0 ? "Select country first" : "Select State/Province"} value="" color="#6B7280" />
                    {states.map((s) => (
                      <Picker.Item key={s.value} label={s.label} value={s.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput style={styles.input} placeholder="Enter Address" placeholderTextColor="#6B7280" value={address} onChangeText={setAddress} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity style={styles.iosPickerButton} onPress={() => { if (cities.length > 0) { setTempCity(selectedCity); setCityPickerVisible(true); } }}>
                  <Text style={[styles.iosPickerText, !selectedCity && styles.placeholderText]}>
                    {cities.length === 0 ? 'Select state first' : (selectedCity || 'Select City')}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker selectedValue={selectedCity} onValueChange={setSelectedCity} style={styles.picker} dropdownIconColor="#6B7280" enabled={cities.length > 0}>
                    <Picker.Item label={cities.length === 0 ? "Select state first" : "Select City"} value="" color="#6B7280" />
                    {cities.map((c, i) => (
                      <Picker.Item key={`${c.value}-${i}`} label={c.label} value={c.value} color="#1F2937" />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput style={styles.input} placeholder="Enter Postal Code" placeholderTextColor="#6B7280" value={postalCode} onChangeText={setPostalCode} />
            </View>

            <TouchableOpacity style={[styles.submitButton, loading && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Add Property</Text>}
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* iOS Country Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={countryPickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => { setSelectedCountry(tempCountry); setCountryPickerVisible(false); }}>
                  <Text style={styles.modalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempCountry} onValueChange={setTempCountry} style={styles.iosPicker}>
                <Picker.Item label="Select Country" value="" color="#6B7280" />
                {countries.map((c) => (
                  <Picker.Item key={c.value} label={c.label} value={c.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCountryPickerVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS State Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={statePickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select State/Province</Text>
                <TouchableOpacity onPress={() => { setSelectedState(tempState); setStatePickerVisible(false); }}>
                  <Text style={styles.modalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempState} onValueChange={setTempState} style={styles.iosPicker}>
                <Picker.Item label="Select State/Province" value="" color="#6B7280" />
                {states.map((s) => (
                  <Picker.Item key={s.value} label={s.label} value={s.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setStatePickerVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* iOS City Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={cityPickerVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select City</Text>
                <TouchableOpacity onPress={() => { setSelectedCity(tempCity); setCityPickerVisible(false); }}>
                  <Text style={styles.modalDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker selectedValue={tempCity} onValueChange={setTempCity} style={styles.iosPicker}>
                <Picker.Item label="Select City" value="" color="#6B7280" />
                {cities.map((c, i) => (
                  <Picker.Item key={`${c.value}-${i}`} label={c.label} value={c.value} color="#007AFF" />
                ))}
              </Picker>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCityPickerVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  statsButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', borderRadius: 8 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, width: '100%', maxWidth: 500 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', borderRadius: 8, padding: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#0E7490' },
  infoBannerText: { fontSize: 13, color: '#0E7490', marginLeft: 8, fontWeight: '500' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  input: { backgroundColor: '#D1F2EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 14, fontSize: 14, color: '#374151' },
  pickerWrapper: { backgroundColor: '#D1F2EB', borderRadius: 8, overflow: 'hidden' },
  picker: { height: 50, color: '#374151' },
  submitButton: { backgroundColor: '#0E7490', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  // iOS Picker styles
  iosPickerButton: { backgroundColor: '#D1F2EB', borderRadius: 8, paddingVertical: 14, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iosPickerText: { fontSize: 14, color: '#374151' },
  placeholderText: { color: '#6B7280' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#2C2C2E', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#3A3A3C' },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  modalDone: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  iosPicker: { backgroundColor: '#2C2C2E' },
  cancelButton: { marginHorizontal: 16, backgroundColor: '#3A3A3C', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
});
