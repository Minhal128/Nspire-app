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
import { propertyService, authService } from '../services';
import {
  PropertyFormValues,
  validatePropertyForm,
  buildPropertyPayload,
} from '../utils/propertyForm';

interface AddPropertyScreenProps {
  navigation: any;
}

interface PropertyForm extends PropertyFormValues {
  id: string;
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

  const handleSafeBack = useCallback(async () => {
    try {
      if (navigation.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
        return;
      }

      const storedUser = await authService.getStoredUser();
      const dashboardRoute = authService.getDashboardRoute(storedUser?.role || 'inspector');
      navigation.reset({
        index: 0,
        routes: [{ name: dashboardRoute as never }],
      });
    } catch (error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' as never }],
      });
    }
  }, [navigation]);

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
    const error = validatePropertyForm(form, index);
    if (error) {
      Alert.alert('Error', error);
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
      const propertiesPayload = forms.map((form, i) => buildPropertyPayload(form, i));

      // Use bulk endpoint for multiple properties, single endpoint for one
      if (propertiesPayload.length === 1) {
        const response = await propertyService.createProperty(propertiesPayload[0]);
        if (response.success) {
          Alert.alert('Success', 'Property added successfully!', [
            { text: 'Add More', onPress: () => { setForms([createEmptyForm()]); setUploadedFile(null); } },
            { text: 'Go to Dashboard', onPress: () => { handleSafeBack(); } },
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
                { text: 'Go to Dashboard', onPress: () => { handleSafeBack(); } },
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
              { text: 'Go to Dashboard', onPress: () => { handleSafeBack(); } },
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
      {/* Only shown once a second property exists — web parity keeps a single form bare */}
      {forms.length > 1 && (
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
      )}

      <View style={styles.fieldBlock}>
        <OptionalLabel text="Property ID (Optional)" />
        <TextInput
          style={styles.input}
          placeholder="Property ID"
          placeholderTextColor="#9CA3AF"
          value={form.propertyId}
          onChangeText={(t) => updateForm(index, 'propertyId', t)}
        />
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="Address " />
        <TextInput
          style={styles.input}
          placeholder="Enter your Address"
          placeholderTextColor="#9CA3AF"
          value={form.address}
          onChangeText={(t) => updateForm(index, 'address', t)}
        />
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="Property Name " />
        <TextInput
          style={styles.input}
          placeholder="Enter your Property Name"
          placeholderTextColor="#9CA3AF"
          value={form.propertyName}
          onChangeText={(t) => updateForm(index, 'propertyName', t)}
        />
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="City (Area) " />
        <TextInput
          style={[styles.input, form.cityError ? styles.inputError : null]}
          placeholder="Enter City/Area"
          placeholderTextColor="#9CA3AF"
          value={form.cityText}
          onChangeText={(t) => {
            updateForm(index, 'cityText', t);
            updateForm(index, 'cityError', '');
            updateForm(index, 'resolvedCityName', '');
          }}
          onBlur={() => handleCityBlur(index)}
          autoCapitalize="words"
        />
        {form.cityError ? <Text style={styles.errorText}>{form.cityError}</Text> : null}
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="Number Of Buildings " />
        <TextInput
          style={styles.input}
          placeholder="Number of Buildings"
          placeholderTextColor="#9CA3AF"
          value={form.numberOfBuildings}
          onChangeText={(t) => updateForm(index, 'numberOfBuildings', t)}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="State (Province) " />
        <TextInput
          style={[styles.input, form.stateError ? styles.inputError : null]}
          placeholder="Enter State/Province"
          placeholderTextColor="#9CA3AF"
          value={form.stateText}
          onChangeText={(t) => {
            updateForm(index, 'stateText', t);
            updateForm(index, 'stateError', '');
            updateForm(index, 'resolvedStateCode', '');
          }}
          onBlur={() => handleStateBlur(index)}
          autoCapitalize="words"
        />
        {form.stateError ? <Text style={styles.errorText}>{form.stateError}</Text> : null}
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="Number Of Units " />
        <TextInput
          style={styles.input}
          placeholder="Number of Units"
          placeholderTextColor="#9CA3AF"
          value={form.numberOfUnits}
          onChangeText={(t) => updateForm(index, 'numberOfUnits', t)}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.fieldBlock}>
        <RequiredLabel text="Zip " />
        <TextInput
          style={styles.input}
          placeholder="Postal Code"
          placeholderTextColor="#9CA3AF"
          value={form.postalCode}
          onChangeText={(t) => updateForm(index, 'postalCode', t)}
          returnKeyType="done"
        />
      </View>
    </View>
  );

  // Same button above and below the import block (web parity)
  const nextButton = (
    <TouchableOpacity
      style={[styles.nextButton, loading && styles.submitButtonDisabled]}
      onPress={handleSubmitAll}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.nextButtonText}>Next</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={styles.sheet}>
            {/* Sheet header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add New Property</Text>
              <View style={styles.sheetHeaderRight}>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>
                    {forms.length} {forms.length === 1 ? 'Property' : 'Properties'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => { handleSafeBack(); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Property Form Cards */}
            {forms.map((form, index) => renderPropertyCard(form, index))}

            {nextButton}

            {/* Add Another Property Button */}
            <TouchableOpacity
              style={styles.addAnotherButton}
              onPress={addPropertyForm}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.addAnotherButtonText}>Add Another Property</Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Import Properties from File */}
            <View style={styles.importSection}>
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
                      <Text style={styles.removeFileText}>Remove file and clear data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.browseButton, { marginTop: 10 }]} onPress={handleBrowseFiles}>
                      <Text style={styles.browseButtonText}>Upload Different File</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.dropZoneIcon}>
                      <Ionicons name="cloud-upload-outline" size={28} color="#0E7490" />
                    </View>
                    <Text style={styles.dropZoneText}>
                      <Text style={styles.dropZoneTextAccent}>Drag &amp; drop </Text>
                      your file here
                    </Text>
                    <Text style={styles.dropZoneSubText}>or click to browse</Text>
                    <TouchableOpacity style={styles.browseButton} onPress={handleBrowseFiles}>
                      <Text style={styles.browseButtonText}>Browse Files</Text>
                    </TouchableOpacity>
                    <Text style={styles.supportedFormats}>
                      Supported formats: TXT, CSV, XLS, XLSX
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.expectedHeaders}>
                <Text style={styles.expectedHeadersTitle}>Expected Column Headers:</Text>
                <View style={styles.headerChipsGrid}>
                  {['Property ID', 'Address', 'Property Name', 'State', 'City', 'Postal Code', 'Buildings', 'Units'].map((h) => (
                    <View key={h} style={styles.headerChip}>
                      <Text style={styles.headerChipText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {nextButton}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// ---------- styles ----------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      web: { boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      },
    }),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#E8394F' },
  sheetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  scrollContent: { padding: 12 },

  /* ---- property card ---- */
  propertyCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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

  /* ---- fields ---- */
  fieldBlock: {
    marginBottom: 14,
  },

  /* ---- labels ---- */
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },

  /* ---- inputs ---- */
  input: {
    backgroundColor: '#E4F1F8',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E4F1F8',
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
    backgroundColor: '#F94A5C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 20,
    alignSelf: 'center',
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
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  importTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E8394F',
    textAlign: 'center',
    marginBottom: 18,
  },
  dropZone: {
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropZoneIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E4F1F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneText: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 12,
    textAlign: 'center',
  },
  dropZoneTextAccent: {
    color: '#0E7490',
    fontWeight: '700',
  },
  dropZoneSubText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  browseButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
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
  },
  headerChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },

  /* ---- submit ---- */
  nextButton: {
    backgroundColor: '#0E6C8E',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonDisabled: { backgroundColor: '#D1D5DB' },
});
