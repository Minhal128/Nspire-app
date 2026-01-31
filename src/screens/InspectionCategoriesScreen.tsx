import React, { useState } from 'react';
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
import { OUTSIDE_ITEMS, INSIDE_ITEMS } from '../data/inspectionData';

type InspectionCategoriesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'InspectionCategories'
>;
type InspectionCategoriesScreenRouteProp = RouteProp<
  RootStackParamList,
  'InspectionCategories'
>;

interface Props {
  navigation: InspectionCategoriesScreenNavigationProp;
  route: InspectionCategoriesScreenRouteProp;
}

const InspectionCategoriesScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, buildingId } = route.params;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleOutsidePress = () => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location: 'Outside',
    });
  };

  const handleInsidePress = () => {
    navigation.navigate('LocationInspection', {
      property,
      selectedUnits,
      buildingId,
      location: 'Inside',
    });
  };

  const handleUnitsPress = () => {
    navigation.navigate('UnitLocations', {
      property,
      selectedUnits,
      buildingId,
    });
  };

  const calculateProgress = (total: number) => {
    // This would be calculated from actual inspection data
    return 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Categories</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Building Info Card */}
        <View style={styles.buildingCard}>
          <View style={styles.buildingHeader}>
            <Ionicons name="business-outline" size={24} color="#0E7490" />
            <Text style={styles.buildingTitle}>BUILDING NO: {buildingId}</Text>
          </View>
          <Text style={styles.unitsInfo}>
            Units Under {buildingId}: {selectedUnits.join(', ')}
          </Text>
        </View>

        {/* OUTSIDE Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleOutsidePress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="rainy-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>OUTSIDE</Text>
              <Text style={styles.categorySubtitle}>
                Areas affected by rain, snow, wind
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
                <Text style={styles.progressText}>
                  0/{OUTSIDE_ITEMS.length} • 0% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>

        {/* INSIDE Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleInsidePress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="home-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>INSIDE</Text>
              <Text style={styles.categorySubtitle}>
                Interior common area, utility closet, mechanical rooms
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
                <Text style={styles.progressText}>
                  0/{INSIDE_ITEMS.length} • 0% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>

        {/* UNITS Section */}
        <TouchableOpacity
          style={styles.categoryCard}
          onPress={handleUnitsPress}
          activeOpacity={0.7}
        >
          <View style={styles.categoryContent}>
            <View style={styles.categoryIconContainer}>
              <Ionicons name="grid-outline" size={28} color="#0E7490" />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>UNITS</Text>
              <Text style={styles.categorySubtitle}>
                Individual unit inspections
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
                <Text style={styles.progressText}>
                  0/{selectedUnits.length} • 0% Complete
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </View>
        </TouchableOpacity>
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
  buildingCard: {
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
  buildingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  buildingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  unitsInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
    marginLeft: 32,
  },
  categoryCard: {
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
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  categorySubtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
});

export default InspectionCategoriesScreen;
