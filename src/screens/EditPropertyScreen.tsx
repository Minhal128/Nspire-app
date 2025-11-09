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
import { Ionicons } from '@expo/vector-icons';

interface EditPropertyScreenProps {
  navigation: any;
  route: any;
}

export default function EditPropertyScreen({ navigation, route }: EditPropertyScreenProps) {
  const { property } = route.params || {};
  
  const [propertyId, setPropertyId] = useState(property?.propertyId || '');
  const [propertyName, setPropertyName] = useState(property?.name || '');
  const [address, setAddress] = useState(property?.address || '');
  const [state, setState] = useState('');
  const [numberOfBuildings, setNumberOfBuildings] = useState(property?.buildings?.toString() || '');
  const [city, setCity] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState(property?.units?.toString() || '');
  const [zipCode, setZipCode] = useState('');

  const handleUpdate = () => {
    console.log('Update property');
    navigation.goBack();
  };

  const handleDelete = () => {
    console.log('Delete property');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Picker
                selectedValue={state}
                onValueChange={(itemValue: string) => setState(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select State" value="" />
                <Picker.Item label="Alaska" value="alaska" />
                <Picker.Item label="California" value="california" />
                <Picker.Item label="Texas" value="texas" />
              </Picker>
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
              placeholder="Enter Owner's Name"
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
              placeholder="Enter Owner's Name"
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
              placeholder="Enter Owner's Name"
              placeholderTextColor="#6B7280"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="number-pad"
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    overflow: 'hidden',
    position: 'relative',
  },
  picker: {
    height: 50,
    color: '#374151',
    backgroundColor: 'transparent',
  },
  pickerIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    pointerEvents: 'none',
  },
  updateButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 15,
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
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
