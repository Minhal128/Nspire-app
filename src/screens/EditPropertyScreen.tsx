import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { propertyService } from '../services';
import IOSPickerModal from '../components/IOSPickerModal';
import { US_STATE_OPTIONS } from '../utils/iosPickerUtils';

// State options with all US states
const STATE_OPTIONS = [
  { label: 'Select State', value: '' },
  ...US_STATE_OPTIONS,
];

// Helper function to get state label from code
const getStateLabel = (stateCode: string): string => {
  if (!stateCode) return 'Select State';
  const stateOption = US_STATE_OPTIONS.find(
    s => s.value.toLowerCase() === stateCode.toLowerCase() ||
      s.label.toLowerCase() === stateCode.toLowerCase()
  );
  return stateOption ? stateOption.label : stateCode;
};

interface EditPropertyScreenProps {
  navigation: any;
  route: any;
}

export default function EditPropertyScreen({ navigation, route }: EditPropertyScreenProps) {
  const { property, onUpdate } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState('');
  const [city, setCity] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Fetch full property data on mount
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!property?._id && !property?.propertyId) {
        setFetchingData(false);
        return;
      }

      try {
        const id = property._id || property.propertyId;
        const response = await propertyService.getProperty(id);

        if (response.success && response.property) {
          const p = response.property;
          setPropertyId(p._id || p.propertyId || '');
          setPropertyName(p.name || '');
          setAddress(p.address || '');
          setState(p.state || '');
          setNumberOfBuildings(p.buildings?.toString() || '');
          setCity(p.city || '');
          setNumberOfUnits(p.units?.toString() || '');
          setZipCode(p.zipCode || '');
        } else {
          // Fallback to passed property data
          setPropertyId(property._id || property.propertyId || '');
          setPropertyName(property.name || '');
          setAddress(property.address || '');
          setState(property.state || '');
          setNumberOfBuildings(property.buildings?.toString() || '');
          setCity(property.city || '');
          setNumberOfUnits(property.units?.toString() || '');
          setZipCode(property.zipCode || '');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        // Fallback to passed property data
        setPropertyId(property._id || property.propertyId || '');
        setPropertyName(property.name || '');
        setAddress(property.address || '');
        setState(property.state || '');
        setNumberOfBuildings(property.buildings?.toString() || '');
        setCity(property.city || '');
        setNumberOfUnits(property.units?.toString() || '');
        setZipCode(property.zipCode || '');
      } finally {
        setFetchingData(false);
      }
    };

    fetchPropertyData();
  }, [property]);

  // iOS Picker Modal State
  const [statePickerVisible, setStatePickerVisible] = useState(false);

  const handleUpdate = async () => {
    if (!propertyName.trim()) {
      Alert.alert('Error', 'Property name is required');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Error', 'Address is required');
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        name: propertyName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state,
        zipCode: zipCode.trim(),
        buildings: parseInt(numberOfBuildings) || 0,
        units: parseInt(numberOfUnits) || 0,
      };

      const response = await propertyService.updateProperty(propertyId, updateData);

      // Call the onUpdate callback if provided to refresh the list immediately
      if (onUpdate && response.property) {
        onUpdate(response.property);
      }

      Alert.alert('Success', 'Property updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await propertyService.deleteProperty(propertyId);
              Alert.alert('Success', 'Property deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete property');
            } finally {
              setDeleting(false);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {fetchingData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1B6B93" />
          <Text style={styles.loadingText}>Loading property data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Title */}
            <Text style={styles.title}>Edit Or Delete{'\n'}Property</Text>

            {/* Property ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Property ID"
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

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Address"
                placeholderTextColor="#6B7280"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* State */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setStatePickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !state && { color: '#6B7280' }]}>
                      {getStateLabel(state)}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={state}
                    onValueChange={(itemValue: string) => setState(itemValue)}
                    style={styles.picker}
                  >
                    {STATE_OPTIONS.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
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

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter City"
                placeholderTextColor="#6B7280"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Number Of Unit */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number Of Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Number of Units"
                placeholderTextColor="#6B7280"
                value={numberOfUnits}
                onChangeText={setNumberOfUnits}
                keyboardType="number-pad"
              />
            </View>

            {/* Zip Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Zip Code"
                placeholderTextColor="#6B7280"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="number-pad"
              />
            </View>

            {/* Update Button */}
            <TouchableOpacity
              style={[styles.updateButton, loading && styles.buttonDisabled]}
              onPress={handleUpdate}
              disabled={loading || deleting}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>Update</Text>
              )}
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={[styles.deleteButton, deleting && styles.buttonDisabled]}
              onPress={handleDelete}
              disabled={loading || deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.deleteButtonText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* iOS State Picker Modal */}
      <IOSPickerModal
        visible={statePickerVisible}
        title="Select State"
        options={STATE_OPTIONS}
        selectedValue={state}
        onSelect={setState}
        onClose={() => setStatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 32,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#CEF8FF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#374151',
    borderWidth: 0,
  },
  pickerContainer: {
    backgroundColor: '#CEF8FF',
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
    right: 15,
    top: 18,
    pointerEvents: 'none',
  },
  updateButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iosPickerButton: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 16,
  },
});
