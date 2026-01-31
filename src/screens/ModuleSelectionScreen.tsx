import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModuleSelectionScreenProps {
  navigation: any;
  route: any;
}

// Outside inspection modules based on the web portal
const OUTSIDE_MODULES = [
  {
    id: 'address-signage',
    name: 'Address & Signage',
    description: 'Building identification, address visibility, signage compliance',
    icon: 'location-outline',
    color: '#0E7490',
  },
  {
    id: 'building-exterior',
    name: 'Building Exterior',
    description: 'Walls, windows, doors, structural elements, chimneys',
    icon: 'business-outline',
    color: '#7C3AED',
  },
  {
    id: 'grounds',
    name: 'Grounds',
    description: 'Landscaping, drainage, walkways, parking areas',
    icon: 'leaf-outline',
    color: '#059669',
  },
  {
    id: 'site-safety',
    name: 'Site Safety',
    description: 'Lighting, security, accessibility, emergency access',
    icon: 'shield-checkmark-outline',
    color: '#DC2626',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Electrical panels, gas meters, water systems, HVAC units',
    icon: 'flash-outline',
    color: '#F59E0B',
  },
  {
    id: 'parking-roads',
    name: 'Parking & Roads',
    description: 'Parking lots, driveways, road surfaces, markings',
    icon: 'car-outline',
    color: '#6B7280',
  },
];

export default function ModuleSelectionScreen({ navigation, route }: ModuleSelectionScreenProps) {
  const { property, selectedUnits, coverage, totalUnits, samplingInfo, category } = route.params || {};
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    
    // Navigate to deficiency filling with selected module
    navigation.navigate('DeficiencyFilling', {
      property,
      selectedUnits,
      coverage,
      totalUnits,
      samplingInfo,
      category,
      selectedModule: OUTSIDE_MODULES.find(m => m.id === moduleId),
    });
  };

  const renderModuleItem = ({ item }: { item: typeof OUTSIDE_MODULES[0] }) => (
    <TouchableOpacity
      style={[styles.moduleCard, selectedModule === item.id && styles.moduleCardSelected]}
      onPress={() => handleModuleSelect(item.id)}
    >
      <View style={[styles.moduleIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.moduleContent}>
        <Text style={styles.moduleName}>{item.name}</Text>
        <Text style={styles.moduleDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outside Inspection</Text>
        <View style={styles.connectionIndicator}>
          <View style={[styles.connectionDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.connectionText}>Online</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Property Info */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property?.name || 'Unknown Property'}</Text>
          <Text style={styles.propertyAddress}>
            {property?.address || 'karachi, Acton, Australian Capital Territory, 75290'}
          </Text>
        </View>

        {/* Module Selection */}
        <View style={styles.moduleSection}>
          <Text style={styles.sectionTitle}>Select Inspection Module</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the area you want to inspect outside the building
          </Text>
          
          <FlatList
            data={OUTSIDE_MODULES}
            renderItem={renderModuleItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.moduleList}
          />
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text style={styles.progressTitle}>Inspection Progress</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
          <Text style={styles.progressText}>0 of 6 modules completed</Text>
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  moduleSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  moduleList: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moduleCardSelected: {
    borderColor: '#0E7490',
    backgroundColor: '#F0F9FF',
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleContent: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
});