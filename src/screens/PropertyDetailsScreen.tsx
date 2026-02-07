import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import propertyService from '../services/propertyService';

type PropertyDetailsRouteProp = RouteProp<RootStackParamList, 'PropertyDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PropertyDetails'>;

interface BuildingUnit {
  buildingId: string;
  label: string;
  units: number;
}

export default function PropertyDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PropertyDetailsRouteProp>();
  const { property } = route.params;

  const totalBuildings = property.buildings || 1;
  const totalUnits = property.units || 1;

  // Distribute units evenly across buildings
  const initializeBuildings = useCallback((): BuildingUnit[] => {
    const baseUnits = Math.floor(totalUnits / totalBuildings);
    const remainder = totalUnits % totalBuildings;
    const buildings: BuildingUnit[] = [];

    for (let i = 0; i < totalBuildings; i++) {
      buildings.push({
        buildingId: `B${i + 1}`,
        label: `B${i + 1}`,
        units: baseUnits + (i < remainder ? 1 : 0),
      });
    }
    return buildings;
  }, [totalBuildings, totalUnits]);

  const [buildings, setBuildings] = useState<BuildingUnit[]>(initializeBuildings);
  const [loading, setLoading] = useState(false);

  const getTotalAssignedUnits = () => {
    return buildings.reduce((sum, b) => sum + b.units, 0);
  };

  const handleUnitChange = (buildingId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setBuildings(prev =>
      prev.map(b =>
        b.buildingId === buildingId ? { ...b, units: numValue } : b
      )
    );
  };

  const handleUpdateAll = async () => {
    const newTotalUnits = getTotalAssignedUnits();
    if (newTotalUnits <= 0) {
      Alert.alert('Error', 'Total units must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await propertyService.updateProperty(property._id, {
        units: newTotalUnits,
        buildings: buildings.length,
      });
      Alert.alert('Success', 'Property updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard' as any) },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Property Info Card */}
        <View style={styles.propertyInfoCard}>
          <View style={styles.propertyInfoRow}>
            <Ionicons name="business-outline" size={22} color="#0E7490" />
            <View style={styles.propertyInfoText}>
              <Text style={styles.propertyName}>{property.name || 'Property'}</Text>
              <Text style={styles.propertyId}>ID: {property.propertyId}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalBuildings}</Text>
              <Text style={styles.statLabel}>Buildings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalUnits}</Text>
              <Text style={styles.statLabel}>Total Units</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalAssignedUnits()}</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Building & Unit Distribution</Text>
        <Text style={styles.sectionSubtitle}>
          {totalBuildings} buildings × {Math.floor(totalUnits / totalBuildings)} units = {totalUnits} total units
        </Text>

        {/* Building Cards Grid */}
        <View style={styles.gridContainer}>
          {buildings.map((building) => (
            <View key={building.buildingId} style={styles.buildingCard}>
              {/* Building Header */}
              <View style={styles.buildingHeader}>
                <View style={styles.buildingIconContainer}>
                  <Ionicons name="cube-outline" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.buildingLabel}>{building.label}</Text>
              </View>

              {/* Units Input */}
              <View style={styles.unitsSection}>
                <Text style={styles.unitsLabel}>Units</Text>
                <TextInput
                  style={styles.unitsInput}
                  value={String(building.units)}
                  onChangeText={(value) => handleUnitChange(building.buildingId, value)}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>

            </View>
          ))}
        </View>

        {/* Main Update Button */}
        <TouchableOpacity
          style={[styles.mainUpdateButton, loading && styles.mainUpdateButtonDisabled]}
          onPress={handleUpdateAll}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.mainUpdateText}>Update</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 40,
  },
  // Property Info Card
  propertyInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  propertyInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  propertyInfoText: {
    flex: 1,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  propertyId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0E7490',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  buildingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buildingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  buildingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0E7490',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  unitsSection: {
    marginBottom: 12,
  },
  unitsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  unitsInput: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    textAlign: 'center',
  },
  // Main Update
  mainUpdateButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mainUpdateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  mainUpdateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
