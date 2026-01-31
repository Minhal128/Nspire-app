import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { UNIT_LOCATIONS } from '../data/inspectionData';

type UnitLocationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UnitLocations'
>;
type UnitLocationsScreenRouteProp = RouteProp<RootStackParamList, 'UnitLocations'>;

interface Props {
  navigation: UnitLocationsScreenNavigationProp;
  route: UnitLocationsScreenRouteProp;
}

const UnitLocationsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId } = route.params;

  const handleLocationPress = (location: string) => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unit Locations</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Building Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Building</Text>
              <Text style={styles.infoValue}>{buildingId}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Selected Units</Text>
              <Text style={styles.infoValue}>{selectedUnits.length}</Text>
            </View>
          </View>
          <View style={styles.unitsChipsContainer}>
            {selectedUnits.slice(0, 3).map((unit, index) => (
              <View key={index} style={styles.unitChip}>
                <Text style={styles.unitChipText}>{unit}</Text>
              </View>
            ))}
            {selectedUnits.length > 3 && (
              <View style={styles.unitChip}>
                <Text style={styles.unitChipText}>+{selectedUnits.length - 3} more</Text>
              </View>
            )}
          </View>
        </View>

        {/* Locations Grid */}
        <Text style={styles.sectionTitle}>Select Location to Inspect</Text>
        <View style={styles.locationsGrid}>
          {UNIT_LOCATIONS.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.locationCard}
              onPress={() => handleLocationPress(location)}
              activeOpacity={0.7}
            >
              <View style={styles.locationIconContainer}>
                <Ionicons name="location" size={24} color="#0E7490" />
              </View>
              <Text style={styles.locationText}>{location}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unitsChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  locationsGrid: {
    gap: 12,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
});

export default UnitLocationsScreen;
