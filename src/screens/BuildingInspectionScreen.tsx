import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type BuildingInspectionRouteProp = RouteProp<RootStackParamList, 'BuildingInspection'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BuildingInspection'>;

interface BuildingRow {
  buildingId: string;
  totalUnits: number;
  unitsForInspection: number;
}

export default function BuildingInspectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BuildingInspectionRouteProp>();
  const { property, calculatedUnits, selectedUnits, coverage } = route.params;

  const totalBuildings = property.buildings || 1;
  const totalUnits = property.units || 1;

  // Divide the calculatedUnits (from coverage selection) across buildings
  const buildings: BuildingRow[] = useMemo(() => {
    // First calculate total units per building (original distribution)
    const baseTotal = Math.floor(totalUnits / totalBuildings);
    const remainderTotal = totalUnits % totalBuildings;

    // Calculate inspection units per building from calculatedUnits
    const baseInspection = Math.floor(calculatedUnits / totalBuildings);
    const remainderInspection = calculatedUnits % totalBuildings;

    const rows: BuildingRow[] = [];
    for (let i = 0; i < totalBuildings; i++) {
      rows.push({
        buildingId: `B${i + 1}`,
        totalUnits: baseTotal + (i < remainderTotal ? 1 : 0),
        unitsForInspection: baseInspection + (i < remainderInspection ? 1 : 0),
      });
    }
    return rows;
  }, [totalBuildings, totalUnits, calculatedUnits]);

  const getCoverageLabel = () => {
    if (coverage === '100') return '100% - All Units';
    if (coverage === '50') return '50% - Half Units';
    return 'Random Sample';
  };

  const handleStartInspectionForBuilding = (building: BuildingRow) => {
    // Generate unit names for this building's inspection units
    const buildingUnits: string[] = [];
    for (let i = 1; i <= building.unitsForInspection; i++) {
      const unitNumber = String(i).padStart(3, '0');
      buildingUnits.push(`Unit ${unitNumber}`);
    }

    // Navigate to PropertyInfo with this building's context
    navigation.navigate('PropertyInfo' as any, {
      property: property,
      selectedUnits: buildingUnits,
    });
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
        {/* Property Info Banner */}
        <View style={styles.propertyInfoBanner}>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Property ID:</Text>
            <Text style={styles.infoValue}>{property.propertyId || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Zip:</Text>
            <Text style={styles.infoValue}>{property.zipCode || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>No. of Building:</Text>
            <Text style={styles.infoValue}>{totalBuildings}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Property Name:</Text>
            <Text style={styles.infoValue}>{property.name || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>City:</Text>
            <Text style={styles.infoValue}>{property.city || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>State:</Text>
            <Text style={styles.infoValue}>{property.state || property.stateName || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{property.address || '-'}</Text>
          </View>
          <View style={styles.infoPair}>
            <Text style={styles.infoLabel}>Selection:</Text>
            <Text style={styles.infoValue}>{getCoverageLabel()} ({calculatedUnits} units)</Text>
          </View>
        </View>

        {/* Building Table */}
        <Text style={styles.sectionTitle}>Building</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colBuildingId]}>Building Unique ID</Text>
          <Text style={[styles.tableHeaderText, styles.colTotalUnits]}>Total Units</Text>
          <Text style={[styles.tableHeaderText, styles.colInspectionUnits]}>Unit for Inspection</Text>
          <Text style={[styles.tableHeaderText, styles.colAction]}></Text>
        </View>

        {/* Table Rows */}
        {buildings.map((building, index) => (
          <View
            key={building.buildingId}
            style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
          >
            <Text style={[styles.tableCell, styles.colBuildingId]}>{building.buildingId}</Text>
            <Text style={[styles.tableCell, styles.colTotalUnits]}>{building.totalUnits}</Text>
            <Text style={[styles.tableCell, styles.colInspectionUnits]}>{building.unitsForInspection}</Text>
            <View style={styles.colAction}>
              <TouchableOpacity
                style={styles.startInspectionBtn}
                onPress={() => handleStartInspectionForBuilding(building)}
              >
                <Text style={styles.startInspectionBtnText}>Start Inspection</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    padding: 16,
    paddingBottom: 40,
  },
  // Property Info Banner
  propertyInfoBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoPair: {
    width: '48%',
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    fontWeight: '500',
  },
  colBuildingId: {
    flex: 2,
    textAlign: 'center',
  },
  colTotalUnits: {
    flex: 1.5,
    textAlign: 'center',
  },
  colInspectionUnits: {
    flex: 2,
    textAlign: 'center',
  },
  colAction: {
    flex: 2,
    alignItems: 'center',
  },
  startInspectionBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  startInspectionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
