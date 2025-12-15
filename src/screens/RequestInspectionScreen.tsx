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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { inspectionService, propertyService } from '../services';
import { Property } from '../services/api';

interface RequestInspectionScreenProps {
  navigation: any;
}

export default function RequestInspectionScreen({ navigation }: RequestInspectionScreenProps) {
  const [loading, setLoading] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [purposeOfInspection, setPurposeOfInspection] = useState('');
  const [hudPreNaphe, setHudPreNaphe] = useState('');
  const [managementCo, setManagementCo] = useState('');
  const [insuranceCo, setInsuranceCo] = useState('');
  const [bankerSale, setBankerSale] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [state, setState] = useState('');
  const [zipPostal, setZipPostal] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredDate, setPreferredDate] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await propertyService.getProperties();
      setProperties(response.properties || response || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProperty) {
      Alert.alert('Error', 'Please select a property');
      return;
    }
    
    if (!purposeOfInspection.trim()) {
      Alert.alert('Error', 'Please enter the purpose of inspection');
      return;
    }

    try {
      setLoading(true);
      
      const requestData = {
        property: selectedProperty,
        purpose: purposeOfInspection.trim(),
        hudPreNaphe: hudPreNaphe.trim(),
        managementCo: managementCo.trim(),
        insuranceCo: insuranceCo.trim(),
        bankerSale: bankerSale.trim(),
        numberOfBuildings: parseInt(numberOfBuildings) || 0,
        numberOfUnits: parseInt(numberOfUnits) || 0,
        state: state.trim(),
        zipCode: zipPostal.trim(),
        notes: notes.trim(),
        preferredDate: preferredDate || undefined,
      };

      await inspectionService.createInspectionRequest(requestData);
      
      Alert.alert(
        'Success',
        'Inspection request submitted successfully! A certified inspector will contact you soon.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit inspection request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          {/* Title */}
          <Text style={styles.title}>
            Request Inspection by a{'\n'}certified inspector.
          </Text>

          {/* Select Property */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Property *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProperty}
                onValueChange={(itemValue: string) => setSelectedProperty(itemValue)}
                style={styles.picker}
                enabled={!loadingProperties}
              >
                <Picker.Item label={loadingProperties ? "Loading properties..." : "Select a property"} value="" />
                {properties.map((property) => (
                  <Picker.Item key={property._id} label={property.name} value={property._id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Purpose of Inspection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purpose of Inspection</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter purpose of Inspection"
              placeholderTextColor="#6B7280"
              value={purposeOfInspection}
              onChangeText={setPurposeOfInspection}
            />
          </View>

          {/* HUD Pre-Naphe Inspection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>HUD Pre-Naphe Inspection</Text>
            <TextInput
              style={styles.input}
              placeholder="Select space"
              placeholderTextColor="#6B7280"
              value={hudPreNaphe}
              onChangeText={setHudPreNaphe}
            />
          </View>

          {/* Management Co/Assessment */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Management Co/Assessment</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter management company or assessment"
              placeholderTextColor="#6B7280"
              value={managementCo}
              onChangeText={setManagementCo}
            />
          </View>

          {/* Insurance Co / Risk Management */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance Co / Risk Management</Text>
            <TextInput
              style={styles.input}
              placeholder="Insurance company"
              placeholderTextColor="#6B7280"
              value={insuranceCo}
              onChangeText={setInsuranceCo}
            />
          </View>

          {/* Banker / Sale */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banker / Sale</Text>
            <TextInput
              style={styles.input}
              placeholder="Banker or sale contact"
              placeholderTextColor="#6B7280"
              value={bankerSale}
              onChangeText={setBankerSale}
            />
          </View>

          {/* Number of buildings */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of buildings</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5"
              placeholderTextColor="#6B7280"
              value={numberOfBuildings}
              onChangeText={setNumberOfBuildings}
              keyboardType="number-pad"
            />
          </View>

          {/* Number of units */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of units</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10"
              placeholderTextColor="#6B7280"
              value={numberOfUnits}
              onChangeText={setNumberOfUnits}
              keyboardType="number-pad"
            />
          </View>

          {/* State / City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>State / City</Text>
            <TextInput
              style={styles.input}
              placeholder="Please select City"
              placeholderTextColor="#6B7280"
              value={state}
              onChangeText={setState}
            />
          </View>

          {/* Zip / Postal Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zip / Postal Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Zip / Postal code"
              placeholderTextColor="#6B7280"
              value={zipPostal}
              onChangeText={setZipPostal}
              keyboardType="number-pad"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
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
  submitButton: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  pickerContainer: {
    backgroundColor: '#D1F2EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#374151',
  },
});
