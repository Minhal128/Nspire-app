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
import { Colors } from '../constants';
import { Ionicons } from '@expo/vector-icons';

type PropertyInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PropertyInfo'
>;
type PropertyInfoScreenRouteProp = RouteProp<RootStackParamList, 'PropertyInfo'>;

interface Props {
  navigation: PropertyInfoScreenNavigationProp;
  route: PropertyInfoScreenRouteProp;
}

const PropertyInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits } = route.params;

  const handleStartInspection = () => {
    navigation.navigate('InspectionCategories', {
      property,
      selectedUnits,
      buildingId: 'B1',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Name Card */}
        <View style={styles.propertyNameCard}>
          <Text style={styles.propertyName}>{property.name || 'Golden Town'}</Text>
          <Text style={styles.propertyId}>ID: {property.propertyId || 'PRP-674060604'}</Text>
        </View>

        {/* Property Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{property.city || 'Abbotsford'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>State</Text>
              <Text style={styles.infoValue}>{property.state || 'British Columbia'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Zip Code</Text>
              <Text style={styles.infoValue}>{property.zipCode || property.zip || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Buildings</Text>
              <Text style={styles.infoValue}>{property.buildings || property.totalBuildings || 0}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.addressValue}>{property.address}</Text>
          </View>
        </View>

        {/* Building Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Building Information</Text>

          <View style={styles.buildingInfoRow}>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Building ID</Text>
              <Text style={styles.buildingValue}>B1</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Total Units</Text>
              <Text style={styles.buildingValue}>{property.units || property.totalUnits || 0}</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>For Inspection</Text>
              <Text style={styles.buildingValue}>{selectedUnits.length}</Text>
            </View>
          </View>
        </View>

        {/* Selected Units Card */}
        {selectedUnits.length > 0 && (
          <View style={styles.unitsCard}>
            <Text style={styles.unitsTitle}>Selected Units</Text>
            <View style={styles.unitsChipsContainer}>
              {selectedUnits.map((unit, index) => (
                <View key={index} style={styles.unitChip}>
                  <Text style={styles.unitChipText}>{unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartInspection}
          activeOpacity={0.8}
        >
          <Ionicons name="clipboard-outline" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Inspection</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 12,
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
    paddingBottom: 140,
  },
  propertyNameCard: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyId: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  buildingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buildingInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  buildingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buildingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E7490',
  },
  unitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  unitsChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0E7490',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  startButton: {
    backgroundColor: '#0E7490',
    borderRadius: 50,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default PropertyInfoScreen;
