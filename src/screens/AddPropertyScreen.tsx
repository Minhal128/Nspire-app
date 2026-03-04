import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Country, State, City } from 'country-state-city';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as XLSX from 'xlsx';
import { propertyService } from '../services';

interface AddPropertyScreenProps {
  navigation: any;
}

interface PropertyForm {
  id: string;
  propertyId: string;
  propertyName: string;
  address: string;
  countryText: string;
  stateText: string;
  cityText: string;
  postalCode: string;
  numberOfBuildings: string;
  numberOfUnits: string;
  resolvedCountryCode: string;
  resolvedStateCode: string;
  resolvedCityName: string;
  countryError: string;
  stateError: string;
  cityError: string;
}

// Validation helpers — match user text against country-state-city package data
const findCountryByName = (name: string) => {
  if (!name.trim()) return null;
  const lower = name.trim().toLowerCase();
  const allCountries = Country.getAllCountries();
  let match = allCountries.find(
    (c) => c.name.toLowerCase() === lower || c.isoCode.toLowerCase() === lower,
  );
  if (!match) {
    match = allCountries.find(
      (c) =>
        c.name.toLowerCase().startsWith(lower) ||
        lower.startsWith(c.name.toLowerCase()),
    );
  }
  return match || null;
};

const findStateByName = (name: string, countryCode: string) => {
  if (!name.trim() || !countryCode) return null;
  const lower = name.trim().toLowerCase();
  const countryStates = State.getStatesOfCountry(countryCode);
  let match = countryStates.find(
    (s) => s.name.toLowerCase() === lower || s.isoCode.toLowerCase() === lower,
  );
  if (!match) {
    match = countryStates.find(
      (s) =>
        s.name.toLowerCase().startsWith(lower) ||
        lower.startsWith(s.name.toLowerCase()),
    );
  }
  return match || null;
};

const findCityByName = (
  name: string,
  countryCode: string,
  stateCode: string,
) => {
  if (!name.trim()) return null;
  const lower = name.trim().toLowerCase();
  let cityList = City.getCitiesOfState(countryCode, stateCode);
  if ((!cityList || cityList.length === 0) && countryCode === 'GB') {
    cityList = City.getCitiesOfCountry(countryCode) || [];
  }
  if (!cityList) return null;
  let match = cityList.find((c) => c.name.toLowerCase() === lower);
  if (!match) {
    match = cityList.find(
      (c) =>
        c.name.toLowerCase().startsWith(lower) ||
        lower.startsWith(c.name.toLowerCase()),
    );
  }
  return match || null;
};

const createEmptyForm = (): PropertyForm => ({
  id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  propertyId: '',
  propertyName: '',
  address: '',
  countryText: '',
  stateText: '',
  cityText: '',
  postalCode: '',
  numberOfBuildings: '',
  numberOfUnits: '',
  resolvedCountryCode: '',
  resolvedStateCode: '',
  resolvedCityName: '',
  countryError: '',
  stateError: '',
  cityError: '',
});

export default function AddPropertyScreen({
  navigation,
}: AddPropertyScreenProps) {
  const [forms, setForms] = useState<PropertyForm[]>([createEmptyForm()]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Update a specific form field
  const updateForm = (index: number, field: keyof PropertyForm, value: string) => {
    setForms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add a new property form
  const addPropertyForm = () => {
    setForms((prev) => [...prev, createEmptyForm()]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  // Remove a property form
  const removePropertyForm = (index: number) => {
    if (forms.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one property form.');
      return;
    }
    Alert.alert(
      'Remove Property',
      `Are you sure you want to remove Property ${index + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setForms((prev) => prev.filter((_, i) => i !== index));
          },
        },
      ],
    );
  };

  // ---- File Import Logic (matches web app) ----

  /**
   * Fuzzy-match a header string to a PropertyForm field name.
   * Handles variations like "Property Id (Optional)", "Number Of Building", etc.
   */
  const matchHeader = (raw: string): string | null => {
    const h = raw.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (!h) return null;
    // Exact / startsWith checks first
    if (h === 'address') return 'address';
    if (h === 'country') return 'countryText';
    if (h === 'state' || h === 'province') return 'stateText';
    if (h === 'city' || h === 'area') return 'cityText';
    // Property id — may have "(optional)" suffix
    if (h.includes('property') && h.includes('id')) return 'propertyId';
    if (h === 'id') return 'propertyId';
    // Property name
    if (h.includes('property') && h.includes('nam')) return 'propertyName';
    if (h === 'name' || h === 'propertyname') return 'propertyName';
    // Buildings
    if (h.includes('building')) return 'numberOfBuildings';
    // Units
    if (h.includes('unit')) return 'numberOfUnits';
    // Postal / zip
    if (h.includes('postal') || h.includes('zip')) return 'postalCode';
    return null;
  };

  const parseTextOrCSV = (text: string): PropertyForm[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const parsedProperties: PropertyForm[] = [];
    const headers = lines[0].split(/[,\t]/).map((h) => h.trim());
    const fieldNames = headers.map(matchHeader);

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[,\t]/).map((v) => v.trim());
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;

      const property = createEmptyForm();

      fieldNames.forEach((field, idx) => {
        if (field && values[idx]) {
          (property as any)[field] = values[idx];
        }
      });

      if (property.propertyId || property.propertyName) {
        parsedProperties.push(property);
      }
    }

    return parsedProperties;
  };

  /**
   * Parse an Excel (.xls/.xlsx) file from a base64 string.
   * Uses the same column-mapping logic as parseTextOrCSV.
   */
  const parseExcel = (base64: string): PropertyForm[] => {
    try {
      const workbook = XLSX.read(base64, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) return [];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to CSV string, then reuse parseTextOrCSV
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (!csv || csv.trim().length === 0) return [];
      return parseTextOrCSV(csv);
    } catch (err) {
      console.error('Excel parse error:', err);
      return [];
    }
  };

  // Auto-resolve country/state/city codes for imported properties
  const resolveLocationCodes = (properties: PropertyForm[]): PropertyForm[] => {
    return properties.map((prop) => {
      const resolved = { ...prop };

      // Resolve country
      if (resolved.countryText) {
        const country = findCountryByName(resolved.countryText);
        if (country) {
          resolved.resolvedCountryCode = country.isoCode;
          resolved.countryText = country.name;
        } else {
          resolved.resolvedCountryCode = resolved.countryText.trim();
        }
      }

      // Resolve state
      if (resolved.stateText && resolved.resolvedCountryCode) {
        const state = findStateByName(resolved.stateText, resolved.resolvedCountryCode);
        if (state) {
          resolved.resolvedStateCode = state.isoCode;
          resolved.stateText = state.name;
        } else {
          resolved.resolvedStateCode = resolved.stateText.trim();
        }
      }

      // Resolve city
      if (resolved.cityText && resolved.resolvedCountryCode && resolved.resolvedStateCode) {
        const city = findCityByName(resolved.cityText, resolved.resolvedCountryCode, resolved.resolvedStateCode);
        if (city) {
          resolved.resolvedCityName = city.name;
          resolved.cityText = city.name;
        } else {
          resolved.resolvedCityName = resolved.cityText.trim();
        }
      }

      return resolved;
    });
  };

  const handleBrowseFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/plain',
          'text/csv',
          'text/comma-separated-values',
          'application/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      if (!file) return;

      const fileName = file.name || '';
      const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase();
      const validExtensions = ['.txt', '.csv', '.xls', '.xlsx'];

      if (!validExtensions.includes(fileExtension)) {
        Alert.alert('Invalid File', 'Please upload a .txt, .csv, .xls, or .xlsx file');
        return;
      }

      setUploadedFile({ name: fileName, size: file.size || 0 });
      setIsProcessingFile(true);

      try {
        let importedForms: PropertyForm[] = [];

        if (Platform.OS === 'web') {
          // On web, DocumentPicker returns a blob URI — use fetch() to read it
          const response = await fetch(file.uri);
          if (fileExtension === '.txt' || fileExtension === '.csv') {
            const content = await response.text();
            importedForms = parseTextOrCSV(content);
            if (importedForms.length === 0) {
              Alert.alert('No Data Found', 'No property data found in file. Please check the format and ensure it has the expected column headers.');
            }
          } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
            try {
              const buffer = await response.arrayBuffer();
              const workbook = XLSX.read(buffer, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              if (sheetName) {
                const sheet = workbook.Sheets[sheetName];
                const csv = XLSX.utils.sheet_to_csv(sheet);
                importedForms = parseTextOrCSV(csv);
              }
            } catch (xlsErr: any) {
              console.error('xlsx read error:', xlsErr);
            }
            if (importedForms.length === 0) {
              Alert.alert('No Data Found', 'Could not read property data from this Excel file. Make sure the first row has headers like: Property Name, Address, City, State, Country, Postal Code, Number Of Building, Number Of Unit.\n\nAlternatively, save the file as .csv and try again.');
            }
          }
        } else {
          if (fileExtension === '.txt' || fileExtension === '.csv') {
            // Real parsing for text/CSV files
            const content = await FileSystem.readAsStringAsync(file.uri);
            importedForms = parseTextOrCSV(content);

            if (importedForms.length === 0) {
              Alert.alert(
                'No Data Found',
                'No property data found in file. Please check the format and ensure it has the expected column headers.',
              );
            }
          } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
            // Read the Excel file as base64, parse with SheetJS
            try {
              const b64 = await FileSystem.readAsStringAsync(file.uri, { encoding: 'base64' as any });
              importedForms = parseExcel(b64);
            } catch (xlsErr: any) {
              console.error('xlsx read error:', xlsErr);
            }

            if (importedForms.length === 0) {
              Alert.alert(
                'No Data Found',
                'Could not read property data from this Excel file. Make sure the first row has headers like: Property Name, Address, City, State, Country, Postal Code, Number Of Building, Number Of Unit.\n\nAlternatively, save the file as .csv and try again.',
              );
            }
          }
        }

        // Auto-resolve location codes and populate forms
        if (importedForms.length > 0) {
          const resolved = resolveLocationCodes(importedForms);
          setForms(resolved);
          Alert.alert(
            'Import Successful',
            `${resolved.length} ${resolved.length === 1 ? 'property has' : 'properties have'} been loaded into the form. Please review the data and edit any fields before submitting.`,
          );
          // Scroll to top so user sees the first imported property
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }, 300);
        }
      } catch (err: any) {
        Alert.alert('Error', 'Error processing file. Please try again.');
      } finally {
        setIsProcessingFile(false);
      }
    } catch (err: any) {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
  };

  // Blur handlers
  const handleCountryBlur = (index: number) => {
    const form = forms[index];
    if (!form.countryText.trim()) {
      updateForm(index, 'resolvedCountryCode', '');
      updateForm(index, 'countryError', '');
      return;
    }
    const found = findCountryByName(form.countryText);
    if (found) {
      setForms((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          resolvedCountryCode: found.isoCode,
          countryText: found.name,
          countryError: '',
        };
        return updated;
      });
    } else {
      setForms((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          resolvedCountryCode: form.countryText.trim(),
          countryError: '',
        };
        return updated;
      });
    }
  };

  const handleStateBlur = (index: number) => {
    const form = forms[index];
    if (!form.stateText.trim()) {
      updateForm(index, 'resolvedStateCode', '');
      updateForm(index, 'stateError', '');
      return;
    }
    if (form.resolvedCountryCode) {
      const found = findStateByName(form.stateText, form.resolvedCountryCode);
      if (found) {
        setForms((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            resolvedStateCode: found.isoCode,
            stateText: found.name,
            stateError: '',
          };
          return updated;
        });
      } else {
        setForms((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            resolvedStateCode: form.stateText.trim(),
            stateError: '',
          };
          return updated;
        });
      }
    } else {
      updateForm(index, 'resolvedStateCode', form.stateText.trim());
      updateForm(index, 'stateError', '');
    }
  };

  const handleCityBlur = (index: number) => {
    const form = forms[index];
    if (!form.cityText.trim()) {
      updateForm(index, 'resolvedCityName', '');
      updateForm(index, 'cityError', '');
      return;
    }
    if (form.resolvedCountryCode && form.resolvedStateCode) {
      const found = findCityByName(form.cityText, form.resolvedCountryCode, form.resolvedStateCode);
      if (found) {
        setForms((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            resolvedCityName: found.name,
            cityText: found.name,
            cityError: '',
          };
          return updated;
        });
      } else {
        setForms((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            resolvedCityName: form.cityText.trim(),
            cityError: '',
          };
          return updated;
        });
      }
    } else {
      updateForm(index, 'resolvedCityName', form.cityText.trim());
      updateForm(index, 'cityError', '');
    }
  };

  // Validate a single form
  const validateForm = (form: PropertyForm, index: number): boolean => {
    if (!form.propertyName.trim()) {
      Alert.alert('Error', `Property ${index + 1}: Property Name is required`);
      return false;
    }
    if (!form.address.trim()) {
      Alert.alert('Error', `Property ${index + 1}: Address is required`);
      return false;
    }
    if (!form.countryText.trim()) {
      Alert.alert('Error', `Property ${index + 1}: Country is required`);
      return false;
    }
    if (!form.stateText.trim()) {
      Alert.alert('Error', `Property ${index + 1}: State is required`);
      return false;
    }
    if (!form.cityText.trim()) {
      Alert.alert('Error', `Property ${index + 1}: City is required`);
      return false;
    }
    if (!form.postalCode.trim()) {
      Alert.alert('Error', `Property ${index + 1}: Postal Code is required`);
      return false;
    }
    return true;
  };

  // Submit all properties using bulk API
  const handleSubmitAll = async () => {
    for (let i = 0; i < forms.length; i++) {
      if (!validateForm(forms[i], i)) return;
    }

    setLoading(true);

    try {
      // Build the property data array for bulk submission
      const propertiesPayload = forms.map((form, i) => {
        const generatedPropertyId = form.propertyId.trim() || `PROP-${Date.now()}-${i}`;
        const countryData = Country.getCountryByCode(form.resolvedCountryCode);
        const stateData = State.getStateByCodeAndCountry(
          form.resolvedStateCode,
          form.resolvedCountryCode,
        );

        return {
          propertyId: generatedPropertyId,
          name: form.propertyName.trim(),
          address: form.address.trim(),
          city: form.resolvedCityName || form.cityText.trim(),
          state: form.resolvedStateCode || form.stateText.trim(),
          country: form.resolvedCountryCode || form.countryText.trim(),
          countryName: countryData?.name || form.countryText,
          stateName: stateData?.name || form.stateText,
          zipCode: form.postalCode.trim(),
          buildings: parseInt(form.numberOfBuildings) || 1,
          units: parseInt(form.numberOfUnits) || 1,
        };
      });

      // Use bulk endpoint for multiple properties, single endpoint for one
      if (propertiesPayload.length === 1) {
        const response = await propertyService.createProperty(propertiesPayload[0]);
        if (response.success) {
          Alert.alert('Success', 'Property added successfully!', [
            { text: 'Add More', onPress: () => { setForms([createEmptyForm()]); setUploadedFile(null); } },
            { text: 'Go to Dashboard', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Error', response.message || 'Failed to add property.');
        }
      } else {
        // Bulk submit
        try {
          const response = await propertyService.createBulkProperties(propertiesPayload);
          if (response.success) {
            const count = response.properties?.length || propertiesPayload.length;
            Alert.alert(
              'Success',
              `All ${count} properties added successfully!`,
              [
                { text: 'Add More', onPress: () => { setForms([createEmptyForm()]); setUploadedFile(null); } },
                { text: 'Go to Dashboard', onPress: () => navigation.goBack() },
              ],
            );
          } else {
            Alert.alert('Error', response.message || 'Bulk submission failed.');
          }
        } catch (bulkError: any) {
          // Fallback: submit one-by-one if bulk endpoint fails
          const results: { success: boolean; name: string; error?: string }[] = [];
          for (let i = 0; i < propertiesPayload.length; i++) {
            try {
              const resp = await propertyService.createProperty(propertiesPayload[i]);
              results.push({ success: resp.success, name: forms[i].propertyName, error: resp.success ? undefined : resp.message });
            } catch (err: any) {
              results.push({ success: false, name: forms[i].propertyName, error: err.message });
            }
          }
          const successCount = results.filter((r) => r.success).length;
          const failCount = results.filter((r) => !r.success).length;
          if (failCount === 0) {
            Alert.alert('Success', `All ${successCount} properties added successfully!`, [
              { text: 'Add More', onPress: () => { setForms([createEmptyForm()]); setUploadedFile(null); } },
              { text: 'Go to Dashboard', onPress: () => navigation.goBack() },
            ]);
          } else {
            const failedNames = results.filter((r) => !r.success).map((r) => r.name).join(', ');
            Alert.alert('Partial Success', `${successCount} added, ${failCount} failed.\nFailed: ${failedNames}`);
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Label helpers
  const RequiredLabel = ({ text }: { text: string }) => (
    <Text style={styles.label}>
      {text}
      <Text style={styles.requiredAsterisk}>*</Text>
    </Text>
  );

  const OptionalLabel = ({ text }: { text: string }) => (
    <Text style={styles.label}>{text}</Text>
  );

  // Render a single property form card
  const renderPropertyCard = (form: PropertyForm, index: number) => (
    <View key={form.id} style={styles.propertyCard}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Property {index + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removePropertyForm(index)}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      {/* Row 1: Property ID (Optional)  |  Address */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <OptionalLabel text="Property id (Optional)" />
          <TextInput
            style={styles.input}
            placeholder="Auto-generated"
            placeholderTextColor="#6B7280"
            value={form.propertyId}
            onChangeText={(t) => updateForm(index, 'propertyId', t)}
          />
        </View>
        <View style={styles.halfColumn}>
          <RequiredLabel text="Address" />
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            placeholderTextColor="#6B7280"
            value={form.address}
            onChangeText={(t) => updateForm(index, 'address', t)}
          />
        </View>
      </View>

      {/* Row 2: Property Name  |  City */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <RequiredLabel text="Property Name" />
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            placeholderTextColor="#6B7280"
            value={form.propertyName}
            onChangeText={(t) => updateForm(index, 'propertyName', t)}
          />
        </View>
        <View style={styles.halfColumn}>
          <RequiredLabel text="City" />
          <TextInput
            style={[styles.input, form.cityError ? styles.inputError : null]}
            placeholder="Enter City"
            placeholderTextColor="#6B7280"
            value={form.cityText}
            onChangeText={(t) => {
              updateForm(index, 'cityText', t);
              updateForm(index, 'cityError', '');
              updateForm(index, 'resolvedCityName', '');
            }}
            onBlur={() => handleCityBlur(index)}
            autoCapitalize="words"
          />
          {form.cityError ? (
            <Text style={styles.errorText}>{form.cityError}</Text>
          ) : null}
        </View>
      </View>

      {/* Row 3: Number of Buildings  |  State */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <RequiredLabel text="Number of Buildings" />
          <TextInput
            style={styles.input}
            placeholder="Enter Buildings"
            placeholderTextColor="#6B7280"
            value={form.numberOfBuildings}
            onChangeText={(t) => updateForm(index, 'numberOfBuildings', t)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.halfColumn}>
          <RequiredLabel text="State" />
          <TextInput
            style={[styles.input, form.stateError ? styles.inputError : null]}
            placeholder="Enter State"
            placeholderTextColor="#6B7280"
            value={form.stateText}
            onChangeText={(t) => {
              updateForm(index, 'stateText', t);
              updateForm(index, 'stateError', '');
              updateForm(index, 'resolvedStateCode', '');
            }}
            onBlur={() => handleStateBlur(index)}
            autoCapitalize="words"
          />
          {form.stateError ? (
            <Text style={styles.errorText}>{form.stateError}</Text>
          ) : null}
        </View>
      </View>

      {/* Row 4: Number of Units  |  Zip */}
      <View style={styles.row}>
        <View style={styles.halfColumn}>
          <RequiredLabel text="Number of Units" />
          <TextInput
            style={styles.input}
            placeholder="Enter Units"
            placeholderTextColor="#6B7280"
            value={form.numberOfUnits}
            onChangeText={(t) => updateForm(index, 'numberOfUnits', t)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.halfColumn}>
          <RequiredLabel text="Zip" />
          <TextInput
            style={styles.input}
            placeholder="Enter Zip"
            placeholderTextColor="#6B7280"
            value={form.postalCode}
            onChangeText={(t) => updateForm(index, 'postalCode', t)}
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Row 5: Country (full width) */}
      <View style={styles.row}>
        <View style={[styles.halfColumn, { flex: 1 }]}>
          <RequiredLabel text="Country" />
          <TextInput
            style={[
              styles.input,
              form.countryError ? styles.inputError : null,
            ]}
            placeholder="Enter Country"
            placeholderTextColor="#6B7280"
            value={form.countryText}
            onChangeText={(t) => {
              updateForm(index, 'countryText', t);
              updateForm(index, 'countryError', '');
              updateForm(index, 'resolvedCountryCode', '');
            }}
            onBlur={() => handleCountryBlur(index)}
            autoCapitalize="words"
          />
          {form.countryError ? (
            <Text style={styles.errorText}>{form.countryError}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

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
        <View style={styles.headerRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {forms.length} {forms.length === 1 ? 'Property' : 'Properties'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Property Form Cards */}
          {forms.map((form, index) => renderPropertyCard(form, index))}

          {/* Add Another Property Button */}
          <TouchableOpacity
            style={styles.addAnotherButton}
            onPress={addPropertyForm}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.addAnotherButtonText}>Add Another Property</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          {/* Import Properties from File */}
          <View style={[styles.importSection, { width: '100%', maxWidth: 600, alignSelf: 'center' }]}>
            <Text style={styles.importTitle}>Import Properties From File</Text>
            <TouchableOpacity
              style={[styles.dropZone, isProcessingFile && { opacity: 0.7 }]}
              onPress={!isProcessingFile && !uploadedFile ? handleBrowseFiles : undefined}
              activeOpacity={isProcessingFile || uploadedFile ? 1 : 0.7}
              disabled={isProcessingFile}
            >
              {isProcessingFile ? (
                <>
                  <ActivityIndicator size="large" color="#0E7490" />
                  <Text style={[styles.dropZoneSubText, { marginTop: 12 }]}>Processing file...</Text>
                </>
              ) : uploadedFile ? (
                <>
                  <View style={styles.fileSuccessIcon}>
                    <Ionicons name="checkmark-circle" size={32} color="#16A34A" />
                  </View>
                  <Text style={styles.fileNameText}>{uploadedFile.name}</Text>
                  <Text style={styles.dropZoneSubText}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </Text>
                  <Text style={styles.importedBadge}>
                    {forms.length} {forms.length === 1 ? 'property' : 'properties'} loaded into form
                  </Text>
                  <TouchableOpacity onPress={() => { clearUploadedFile(); setForms([createEmptyForm()]); }} style={{ marginTop: 8 }}>
                    <Text style={styles.removeFileText}>Remove file & clear data</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.browseButton, { marginTop: 10 }]} onPress={handleBrowseFiles}>
                    <Text style={styles.browseButtonText}>Upload Different File</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={40} color="#0E7490" />
                  <Text style={styles.dropZoneText}>
                    <Text style={{ color: '#0E7490', fontWeight: '700' }}>Tap to browse </Text>
                    your files
                  </Text>
                  <Text style={styles.dropZoneSubText}>Supported: TXT, CSV, XLS, XLSX</Text>
                  <TouchableOpacity style={styles.browseButton} onPress={handleBrowseFiles}>
                    <Text style={styles.browseButtonText}>Browse Files</Text>
                  </TouchableOpacity>
                  <Text style={styles.supportedFormats}>
                    File data will auto-fill the property forms above
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <View style={styles.expectedHeaders}>
              <Text style={styles.expectedHeadersTitle}>Expected Column Headers:</Text>
              <View style={styles.headerChipsGrid}>
                {[
                  ['Property ID', 'Address'],
                  ['Property Name', 'Country'],
                  ['State', 'City'],
                  ['Postal Code', 'Buildings'],
                  ['Units'],
                ].map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.headerChipRow}>
                    {row.map((h) => (
                      <View key={h} style={styles.headerChip}>
                        <Text style={styles.headerChipText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Submit All Button */}
          <TouchableOpacity
            style={[styles.submitAllButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmitAll}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.submitButtonContent}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitAllButtonText}>
                  Submit {forms.length} {forms.length === 1 ? 'Property' : 'Properties'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------- styles ----------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#0E7490',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, alignItems: 'center' },

  /* ---- property card ---- */
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    maxWidth: 600,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* ---- rows & columns ---- */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfColumn: {
    flex: 1,
    marginHorizontal: 6,
  },

  /* ---- labels ---- */
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  requiredAsterisk: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },

  /* ---- inputs ---- */
  input: {
    backgroundColor: '#D1F2EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#D1F2EB',
    textAlign: 'center',
    height: 46,
  },
  inputError: {
    borderColor: '#DC2626',
    borderWidth: 1,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 4,
  },

  /* ---- add another button ---- */
  addAnotherButton: {
    backgroundColor: '#FF0000',
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addAnotherButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* ---- OR divider ---- */
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  orText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 16,
  },

  /* ---- import section ---- */
  importSection: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  importTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 18,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  dropZoneText: {
    fontSize: 15,
    color: '#374151',
    marginTop: 10,
    textAlign: 'center',
  },
  dropZoneSubText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  browseButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 14,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  supportedFormats: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 12,
  },
  fileSuccessIcon: {
    marginBottom: 8,
  },
  fileNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  removeFileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    textDecorationLine: 'underline',
  },
  importedBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    marginTop: 6,
    textAlign: 'center',
  },
  expectedHeaders: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  expectedHeadersTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerChipsGrid: {
    gap: 10,
  },
  headerChipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  headerChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 100,
    alignItems: 'center',
  },
  headerChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },

  /* ---- submit all ---- */
  submitAllButton: {
    backgroundColor: '#0E7490',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitAllButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  submitButtonDisabled: { backgroundColor: '#D1D5DB' },
});
