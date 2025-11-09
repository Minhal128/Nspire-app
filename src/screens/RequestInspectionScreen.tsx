import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface RequestInspectionScreenProps {
  navigation: any;
}

export default function RequestInspectionScreen({ navigation }: RequestInspectionScreenProps) {
  const [purposeOfInspection, setPurposeOfInspection] = useState('');
  const [hudPreNaphe, setHudPreNaphe] = useState('');
  const [managementCo, setManagementCo] = useState('');
  const [insuranceCo, setInsuranceCo] = useState('');
  const [bankerSale, setBankerSale] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [state, setState] = useState('');
  const [zipPostal, setZipPostal] = useState('');

  const handleSubmit = () => {
    // Handle submission
    console.log('Form submitted');
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
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
