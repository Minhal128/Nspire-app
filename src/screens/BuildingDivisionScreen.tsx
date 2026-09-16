import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { propertyService } from '../services';
import {
  BuildingData,
  divideUnitsEvenly,
  redivideKeepingNames,
  redistributeUnits,
  totalUnitsOf,
} from '../utils/buildingDivision';

interface BuildingDivisionScreenProps {
  navigation: any;
  route: any;
}

/**
 * Second step of Add Property, mirroring the web BuildingDivisionModal
 * (components/PropertyModals.tsx).
 *
 * The total unit count entered on Add Property is fixed here: editing one
 * building's units moves the difference to the other buildings rather than
 * changing the total, and Update refuses to save until the total matches.
 */
const BuildingDivisionScreen: React.FC<BuildingDivisionScreenProps> = ({ navigation, route }) => {
  const propertyData = route?.params?.propertyData;

  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!propertyData) return;

    const numBuildings = parseInt(String(propertyData.buildings)) || 1;
    const totalUnits = parseInt(String(propertyData.units)) || 0;

    setBuildings((prev) =>
      prev.length === numBuildings
        ? redivideKeepingNames(prev, totalUnits)
        : divideUnitsEvenly(totalUnits, numBuildings),
    );
  }, [propertyData]);

  const updateBuildingName = (index: number, name: string) => {
    setBuildings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  // Keeps the overall total fixed: whatever is added to one building is taken
  // from the others, and vice versa.
  const updateBuildingUnits = (index: number, newUnits: number) => {
    setBuildings((prev) => redistributeUnits(prev, index, newUnits));
  };

  const totalCalculatedUnits = totalUnitsOf(buildings);
  const originalTotalUnits = parseInt(String(propertyData?.units)) || 0;
  const unitsMatch = totalCalculatedUnits === originalTotalUnits;

  const handleUpdate = async () => {
    // Validate that total units match
    if (!unitsMatch) {
      Alert.alert(
        'Error',
        `Total units must equal ${originalTotalUnits}. Current total: ${totalCalculatedUnits}`,
      );
      return;
    }
    // Validate building names
    for (let i = 0; i < buildings.length; i++) {
      if (!buildings[i].name.trim()) {
        Alert.alert('Error', `Please enter a name for Building ${i + 1}`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await propertyService.createProperty({
        ...propertyData,
        buildings: buildings.length,
        units: buildings.reduce((sum, b) => sum + b.units, 0),
        buildingDetails: buildings.map((b, i) => ({
          buildingId: `B${i + 1}`,
          totalUnits: b.units,
          unitsForInspection: 0,
        })),
      });

      if (response.success) {
        // Save custom building names, keyed the same way the web build does.
        const propId = (response.property as any)?._id || propertyData.propertyId;
        if (propId) {
          const namesMap: Record<string, string> = {};
          buildings.forEach((b, i) => {
            namesMap[`B${i + 1}`] = b.name;
          });
          await AsyncStorage.setItem(`buildingNames_${propId}`, JSON.stringify(namesMap));
        }

        Alert.alert('Success', 'Data saved successfully', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('Dashboard', { newProperty: response.property || propertyData }),
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to add property');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add property');
    } finally {
      setIsLoading(false);
    }
  };

  if (!propertyData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No property data was passed to this step.</Text>
          <TouchableOpacity style={styles.updateButton} onPress={() => navigation.goBack()}>
            <Text style={styles.updateButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const propertyId = propertyData.propertyId || 'N/A';
  const propertyName = propertyData.propertyName || propertyData.name || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Property Details</Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Property Info Header */}
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyInfoText}>
                Property ID: <Text style={styles.propertyInfoValue}>{propertyId}</Text>
              </Text>
              <Text style={styles.propertyInfoText}>
                Property Name: <Text style={styles.propertyInfoValue}>{propertyName}</Text>
              </Text>
            </View>

            {/* Buildings */}
            {buildings.map((building, index) => (
              <View key={index} style={styles.buildingCard}>
                <View style={styles.buildingRow}>
                  <View style={styles.buildingField}>
                    <Text style={styles.label}>Building Name</Text>
                    <TextInput
                      style={styles.input}
                      value={building.name}
                      onChangeText={(t) => updateBuildingName(index, t)}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.buildingField}>
                    <Text style={styles.label}>No. of Unit</Text>
                    <TextInput
                      style={styles.input}
                      value={String(building.units)}
                      onChangeText={(t) => updateBuildingUnits(index, parseInt(t) || 0)}
                      keyboardType="number-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.updateUnitButton}
                  onPress={() => Alert.alert('Updated', `Building ${building.name} updated`)}
                >
                  <Text style={styles.updateUnitButtonText}>Update Unit</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Total Units */}
            <View style={[styles.totalCard, unitsMatch ? styles.totalCardOk : styles.totalCardBad]}>
              <View style={styles.totalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.totalLabel}>Total Units Across All Buildings</Text>
                  <Text style={styles.totalValue}>
                    {totalCalculatedUnits}
                    <Text style={styles.totalValueSuffix}> / {originalTotalUnits}</Text>
                  </Text>
                  {!unitsMatch && (
                    <Text style={styles.totalHint}>
                      {totalCalculatedUnits > originalTotalUnits
                        ? `Remove ${totalCalculatedUnits - originalTotalUnits} units`
                        : `Add ${originalTotalUnits - totalCalculatedUnits} more units`}
                    </Text>
                  )}
                </View>
                <View style={styles.totalIcon}>
                  <Ionicons
                    name={unitsMatch ? 'checkmark' : 'warning-outline'}
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
              onPress={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.updateButtonText}>Update</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12 },
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

  propertyInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  propertyInfoText: { fontSize: 14, color: '#111827', marginBottom: 2 },
  propertyInfoValue: { fontWeight: '700' },

  buildingCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  buildingRow: { flexDirection: 'row', gap: 12 },
  buildingField: { flex: 1 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 6,
  },
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
  updateUnitButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#006795',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  updateUnitButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  totalCard: { borderRadius: 12, padding: 18, marginBottom: 16 },
  totalCardOk: { backgroundColor: '#16A34A' },
  totalCardBad: { backgroundColor: '#DC2626' },
  totalRow: { flexDirection: 'row', alignItems: 'center' },
  totalLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  totalValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  totalValueSuffix: { fontSize: 18, fontWeight: '400' },
  totalHint: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  totalIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    padding: 12,
  },

  updateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  updateButtonDisabled: { backgroundColor: '#D1D5DB' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { fontSize: 14, color: '#6B7280', marginBottom: 16, textAlign: 'center' },
});

export default BuildingDivisionScreen;
