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
  ActionSheetIOS,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { propertyService } from '../services';

interface EditPropertyScreenProps {
  navigation: any;
  route: any;
}

export default function EditPropertyScreen({ navigation, route }: EditPropertyScreenProps) {
  const { property } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [propertyId, setPropertyId] = useState(property?._id || property?.propertyId || '');
  const [propertyName, setPropertyName] = useState(property?.name || '');
  const [address, setAddress] = useState(property?.address || '');
  const [state, setState] = useState(property?.state || '');
  const [numberOfBuildings, setNumberOfBuildings] = useState(property?.buildings?.toString() || property?.totalBuildings?.toString() || '');
  const [city, setCity] = useState(property?.city || '');
  const [numberOfUnits, setNumberOfUnits] = useState(property?.units?.toString() || property?.totalUnits?.toString() || '');
  const [zipCode, setZipCode] = useState(property?.zipCode || '');

  // iOS Picker State - Use ActionSheetIOS instead
  const showIOSStatePicker = () => {
    const stateOptions = ['Cancel', 'Alaska', 'California', 'Texas'];
    const stateValues = ['', 'alaska', 'california', 'texas'];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: stateOptions,
        cancelButtonIndex: 0,
        title: 'Select State',
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) { // Not cancel
          setState(stateValues[buttonIndex]);
        }
      }
    );
  };

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
        totalBuildings: parseInt(numberOfBuildings) || 0,
        totalUnits: parseInt(numberOfUnits) || 0,
      };

      await propertyService.updateProperty(propertyId, updateData);
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
                    onPress={showIOSStatePicker}
                  >
                    <Text style={[styles.iosPickerText, !state && { color: '#6B7280' }]}>
                      {state ? (state.charAt(0).toUpperCase() + state.slice(1)) : "Select State"}
                    </Text>
                  </TouchableOpacity>
                ) : (
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
