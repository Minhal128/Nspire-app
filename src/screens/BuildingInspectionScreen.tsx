import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

  // Initialise editable building rows
  const initBuildings = useCallback((): BuildingRow[] => {
    const baseTotal = Math.floor(totalUnits / totalBuildings);
    const remainderTotal = totalUnits % totalBuildings;

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

  const [buildings, setBuildings] = useState<BuildingRow[]>(initBuildings);

  // Track which field is actively being edited so we skip auto-save mid-typing
  const editTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------- Building ID editing --------

  const handleBuildingIdChange = useCallback((index: number, newId: string) => {
    setBuildings(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], buildingId: newId };
      return copy;
    });
  }, []);

  // -------- Unit for Inspection editing with auto-redistribution --------

  /**
   * When the user changes "Unit for Inspection" for one building:
   * 1. Cap the value at `calculatedUnits` (total inspection units from coverage).
   * 2. Distribute the remaining inspection units proportionally across the OTHER buildings,
   *    ensuring every building gets at least 0 and the grand total equals `calculatedUnits`.
   */
  const handleInspectionUnitsChange = useCallback(
    (editedIndex: number, rawValue: string) => {
      const parsed = parseInt(rawValue) || 0;
      // Clamp between 0 and the total inspection units available
      const clamped = Math.max(0, Math.min(parsed, calculatedUnits));

      setBuildings(prev => {
        const copy = [...prev];
        const remaining = calculatedUnits - clamped;
        const otherIndices = copy
          .map((_, i) => i)
          .filter(i => i !== editedIndex);

        if (otherIndices.length === 0) {
          // Only one building
          copy[editedIndex] = { ...copy[editedIndex], unitsForInspection: calculatedUnits };
          return copy;
        }

        // Distribute remaining proportionally to existing ratios among others
        const otherCurrentTotal = otherIndices.reduce(
          (sum, i) => sum + copy[i].unitsForInspection,
          0,
        );

        let distributed = 0;
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) {
            // Last one gets whatever is left to avoid rounding errors
            copy[i] = { ...copy[i], unitsForInspection: remaining - distributed };
          } else {
            const ratio =
              otherCurrentTotal > 0
                ? copy[i].unitsForInspection / otherCurrentTotal
                : 1 / otherIndices.length;
            const share = Math.round(remaining * ratio);
            copy[i] = { ...copy[i], unitsForInspection: share };
            distributed += share;
          }
        });

        copy[editedIndex] = { ...copy[editedIndex], unitsForInspection: clamped };
        return copy;
      });
    },
    [calculatedUnits],
  );

  // Debounced wrapper so redistribution happens after a brief pause while typing
  const handleInspectionUnitsText = useCallback(
    (index: number, text: string) => {
      // Immediately update the edited cell's display value
      setBuildings(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], unitsForInspection: parseInt(text) || 0 };
        return copy;
      });

      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
      editTimeoutRef.current = setTimeout(() => {
        handleInspectionUnitsChange(index, text);
      }, 600);
    },
    [handleInspectionUnitsChange],
  );

  // On blur, force redistribution immediately
  const handleInspectionUnitsBlur = useCallback(
    (index: number) => {
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = null;
      }
      setBuildings(prev => {
        const current = prev[index].unitsForInspection;
        // Trigger redistribution through the change handler
        return prev; // will be overridden below
      });
      // Re-run change with current value to redistribute
      setBuildings(prev => {
        const clamped = Math.max(0, Math.min(prev[index].unitsForInspection, calculatedUnits));
        const remaining = calculatedUnits - clamped;
        const copy = [...prev];
        const otherIndices = copy.map((_, i) => i).filter(i => i !== index);

        if (otherIndices.length === 0) {
          copy[index] = { ...copy[index], unitsForInspection: calculatedUnits };
          return copy;
        }

        const otherCurrentTotal = otherIndices.reduce(
          (sum, i) => sum + copy[i].unitsForInspection,
          0,
        );

        let distributed = 0;
        otherIndices.forEach((i, idx) => {
          if (idx === otherIndices.length - 1) {
            copy[i] = { ...copy[i], unitsForInspection: remaining - distributed };
          } else {
            const ratio =
              otherCurrentTotal > 0
                ? copy[i].unitsForInspection / otherCurrentTotal
                : 1 / otherIndices.length;
            const share = Math.round(remaining * ratio);
            copy[i] = { ...copy[i], unitsForInspection: share };
            distributed += share;
          }
        });

        copy[index] = { ...copy[index], unitsForInspection: clamped };
        return copy;
      });
    },
    [calculatedUnits],
  );

  // -------- helpers --------

  const getCoverageLabel = () => {
    if (coverage === '100') return '100% - All Units';
    if (coverage === '50') return '50% - Half Units';
    return 'Random Sample';
  };

  const totalInspectionUnits = buildings.reduce((s, b) => s + b.unitsForInspection, 0);

  const handleStartInspectionForBuilding = (building: BuildingRow) => {
    if (building.unitsForInspection <= 0) {
      Alert.alert('No Units', 'This building has 0 inspection units assigned.');
      return;
    }

    const buildingUnits: string[] = [];
    for (let i = 1; i <= building.unitsForInspection; i++) {
      const unitNumber = String(i).padStart(3, '0');
      buildingUnits.push(`Unit ${unitNumber}`);
    }

    navigation.navigate('PropertyInfo' as any, {
      property: property,
      selectedUnits: buildingUnits,
      buildingId: building.buildingId,
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Building</Text>
            <Text style={styles.unitsBadge}>
              {totalInspectionUnits} / {calculatedUnits} units assigned
            </Text>
          </View>

          {totalInspectionUnits !== calculatedUnits && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={16} color="#92400E" />
              <Text style={styles.warningText}>
                Total inspection units ({totalInspectionUnits}) ≠ required ({calculatedUnits}). Adjust to match.
              </Text>
            </View>
          )}

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
              key={index}
              style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}
            >
              {/* Editable Building ID */}
              <View style={styles.colBuildingId}>
                <TextInput
                  style={styles.editableCell}
                  value={building.buildingId}
                  onChangeText={(text) => handleBuildingIdChange(index, text)}
                  placeholder="ID"
                  placeholderTextColor="#9CA3AF"
                  selectTextOnFocus
                />
              </View>

              {/* Total Units (read-only) */}
              <Text style={[styles.tableCell, styles.colTotalUnits]}>{building.totalUnits}</Text>

              {/* Editable Units for Inspection */}
              <View style={styles.colInspectionUnits}>
                <TextInput
                  style={[
                    styles.editableCell,
                    styles.editableCellNumber,
                    building.unitsForInspection < 0 && styles.editableCellError,
                  ]}
                  value={String(building.unitsForInspection)}
                  onChangeText={(text) => handleInspectionUnitsText(index, text)}
                  onBlur={() => handleInspectionUnitsBlur(index)}
                  keyboardType="number-pad"
                  maxLength={5}
                  selectTextOnFocus
                />
              </View>

              <View style={styles.colAction}>
                <TouchableOpacity
                  style={[
                    styles.startInspectionBtn,
                    building.unitsForInspection <= 0 && styles.startInspectionBtnDisabled,
                  ]}
                  onPress={() => handleStartInspectionForBuilding(building)}
                  disabled={building.unitsForInspection <= 0}
                >
                  <Text style={styles.startInspectionBtnText}>Start Inspection</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  unitsBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },
  // Table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 4,
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
    paddingHorizontal: 4,
  },
  colTotalUnits: {
    flex: 1.2,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colInspectionUnits: {
    flex: 1.5,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  colAction: {
    flex: 2.5,
    alignItems: 'center',
    paddingLeft: 8,
  },
  startInspectionBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 110,
    alignItems: 'center',
  },
  startInspectionBtnDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.7,
  },
  startInspectionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Editable cells
  editableCell: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1E9FF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    minHeight: 36,
  },
  editableCellNumber: {
    color: '#0E7490',
    fontWeight: '700',
  },
  editableCellError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
});
