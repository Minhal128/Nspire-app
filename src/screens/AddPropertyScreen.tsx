import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { propertyService } from '../services';
import { US_STATES } from '../constants/usStates';

interface AddPropertyScreenProps {
  navigation: any;
}

export default function AddPropertyScreen({ navigation }: AddPropertyScreenProps) {
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!propertyName.trim()) {
      Alert.alert('Validation Error', 'Property name is required');
      return false;
    }
    if (!state) {
      Alert.alert('Validation Error', 'State is required');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required');
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
      
      const propertyData = {
        propertyId: generatedPropertyId,
        name: propertyName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state,
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
        <View style={styles.placeholder} />
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

            {/* State */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={state}
                  onValueChange={(itemValue: string) => setState(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select State" value="" color="#6B7280" />
                  {US_STATES.map((stateItem) => (
                    <Picker.Item 
                      key={stateItem.value} 
                      label={stateItem.label} 
                      value={stateItem.value} 
                    />
                  ))}
                </Picker>
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
              <TextInput
              style={styles.input}
              placeholder="Enter your City"
              placeholderTextColor="#6B7280"
              value={city}
              onChangeText={setCity}
            />
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
});
