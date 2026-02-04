import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';
import { 
  propertyService, 
  authService, 
  generateRandomUnitSample, 
  isRandomSelectionAvailable, 
  getSamplingExplanation 
} from '../services';
import type { UnitSample } from '../services';

interface UnitInspectionScreenProps {
  navigation: any;
  route: any;
}

interface Unit {
  id: string;
  name: string;
  status: 'needs-attention' | 'completed' | 'non-compliant';
}

export default function UnitInspectionScreen({ navigation, route }: UnitInspectionScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [user, setUser] = useState<any>(null);
  const [randomSample, setRandomSample] = useState<UnitSample | null>(null);
  const [showRandomSample, setShowRandomSample] = useState(false);
  const { property: routeProperty } = route.params || {};
  const [property, setProperty] = useState<any>(routeProperty);

  const loadUnits = useCallback(async () => {
    try {
      // Load user data
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);
      if (property?._id) {
        // Try to fetch property details with units from API
        const propertyData = await propertyService.getProperty(property._id);
        
        // Update property state with fetched data that includes zipCode
        if (propertyData?.property) {
          setProperty(propertyData.property);
        }
        
        const unitCount = propertyData?.property?.units || property?.units || 1;
        
        // Generate units based on unit count
        const generatedUnits: Unit[] = Array.from({ length: unitCount }, (_, i) => ({
          id: `${i + 1}`.padStart(3, '0'),
          name: `Unit ${(i + 1).toString().padStart(3, '0')}`,
          status: 'needs-attention' as const,
        }));
        
        setUnits(generatedUnits);
      } else if (property?.units && typeof property.units === 'number') {
        // Generate units from route params unit count
        const generatedUnits: Unit[] = Array.from({ length: property.units }, (_, i) => ({
          id: `${i + 1}`.padStart(3, '0'),
          name: `Unit ${(i + 1).toString().padStart(3, '0')}`,
          status: 'needs-attention' as const,
        }));
        setUnits(generatedUnits);
      } else {
        // Generate at least 1 unit if none specified
        setUnits([
          { id: '001', name: 'Unit 001', status: 'needs-attention' },
        ]);
      }
    } catch (error) {
      console.error('Error loading units:', error);
      // Generate units based on property.units or default to 1
      const unitCount = property?.units || 1;
      const generatedUnits: Unit[] = Array.from({ length: unitCount }, (_, i) => ({
        id: `${i + 1}`.padStart(3, '0'),
        name: `Unit ${(i + 1).toString().padStart(3, '0')}`,
        status: 'needs-attention' as const,
      }));
      setUnits(generatedUnits);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [property]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUnits();
  }, [loadUnits]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = async (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Navigate to correct dashboard based on user role
      const userRole = user?.role || 'inspector';
      const dashboardRoute = authService.getDashboardRoute(userRole);
      navigation.navigate(dashboardRoute as never);
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections' as never);
    } else if (screen === 'Reports') {
      navigation.navigate('Reports' as never);
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setSidebarVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' as never }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleStartInspection = (unit: Unit) => {
    // Go directly to AI Inspection with the selected unit
    navigation.navigate('AIInspection' as never, { 
      property: property,
      selectedUnits: [unit.name],
      coverage: '100',
      totalUnits: 1
    } as never);
  };

  const handleStartAIInspection = () => {
    // Start AI inspection for all units
    const allUnitNames = units.map(u => u.name);
    navigation.navigate('AIInspection' as never, { 
      property: property,
      selectedUnits: allUnitNames,
      coverage: '100',
      totalUnits: units.length
    } as never);
  };

  const handleRandomUnitSelection = () => {
    try {
      const totalUnits = units.length;
      const propertyId = property?._id || property?.id || `property_${Date.now()}`;
      
      // Check if random selection is available
      if (!isRandomSelectionAvailable(totalUnits)) {
        Alert.alert(
          'Random Selection Not Available',
          `Random unit selection requires at least 1 unit. This property has ${totalUnits} units.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Generate random sample
      const sample = generateRandomUnitSample(totalUnits, propertyId);
      setRandomSample(sample);
      setShowRandomSample(true);
      
    } catch (error) {
      console.error('Error generating random sample:', error);
      Alert.alert(
        'Error',
        'Failed to generate random unit sample. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleStartRandomInspection = () => {
    if (!randomSample) return;
    
    setShowRandomSample(false);
    navigation.navigate('PropertyInfo' as never, { 
      property: property,
      selectedUnits: randomSample.selectedUnits,
    } as never);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs-attention':
        return '#FF9800';
      case 'completed':
        return '#84CC16';
      case 'non-compliant':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'needs-attention':
        return 'Needs Attention';
      case 'completed':
        return 'Completed';
      case 'non-compliant':
        return 'Non-Compliant';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading units...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Random Sample Modal */}
      <Modal
        visible={showRandomSample}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRandomSample(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.randomSampleModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Random Unit Sample</Text>
              <TouchableOpacity 
                onPress={() => setShowRandomSample(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {randomSample && (
              <View style={styles.modalContent}>
                <View style={styles.sampleSummary}>
                  <Text style={styles.sampleSummaryTitle}>Sampling Summary</Text>
                  <Text style={styles.sampleSummaryText}>
                    Property has {randomSample.totalUnits} units
                  </Text>
                  <Text style={styles.sampleSummaryText}>
                    {randomSample.unitsToInspect} units selected for inspection
                  </Text>
                </View>
                
                <View style={styles.selectedUnitsContainer}>
                  <Text style={styles.selectedUnitsTitle}>Selected Units:</Text>
                  <View style={styles.selectedUnitsList}>
                    {randomSample.selectedUnits.map((unit, index) => (
                      <View key={index} style={styles.selectedUnitChip}>
                        <Text style={styles.selectedUnitText}>{unit}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={styles.samplingNote}>
                  <Ionicons name="information-circle" size={16} color="#0E7490" />
                  <Text style={styles.samplingNoteText}>
                    This selection is consistent and will be the same each time for this property.
                  </Text>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowRandomSample(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.startInspectionButton}
                    onPress={handleStartRandomInspection}
                  >
                    <Text style={styles.startInspectionButtonText}>Start Inspection</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image 
              source={require('../../logo.png')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E7490']} />
          }
        >
          {/* Title */}
          <Text style={styles.title}>Select Unit For Inspection</Text>

          {/* Property Info Card */}
          <View style={styles.propertyCard}>
            <Text style={styles.propertyName}>
              {property?.name || 'Sunset Apartments'}
            </Text>
            <Text style={styles.propertyAddress}>New York</Text>
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              {/* AI Inspection Button */}
              <TouchableOpacity 
                style={styles.aiInspectionButton}
                onPress={handleStartAIInspection}
              >
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                <Text style={styles.aiInspectionButtonText}>Start AI Inspection</Text>
              </TouchableOpacity>
              
              {/* Random Unit Selection Button */}
              {isRandomSelectionAvailable(units.length) && (
                <TouchableOpacity 
                  style={styles.randomSelectionButton}
                  onPress={handleRandomUnitSelection}
                >
                  <Ionicons name="shuffle" size={20} color="#FFFFFF" />
                  <Text style={styles.randomSelectionButtonText}>Random Unit Selection</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Sampling Info */}
            {isRandomSelectionAvailable(units.length) && (
              <View style={styles.samplingInfoContainer}>
                <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                <Text style={styles.samplingInfoText}>
                  {getSamplingExplanation(units.length)}
                </Text>
              </View>
            )}
          </View>

          {/* Units List */}
          <View style={styles.unitsList}>
            {units.map((unit) => (
              <View key={unit.id} style={styles.unitCard}>
                <View style={styles.unitHeader}>
                  <Text style={styles.unitName}>{unit.name}</Text>
                  <View style={styles.statusContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(unit.status) }
                      ]} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(unit.status) }]}>
                      {getStatusText(unit.status)}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => handleStartInspection(unit)}
                >
                  <Text style={styles.startButtonText}>Start Inspection</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEF8FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  headerContainer: {
    backgroundColor: '#CEF8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 15,
  },
  headerLogo: {
    width: 240,
    height: 65,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  aiInspectionButton: {
    flexDirection: 'row',
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  aiInspectionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  randomSelectionButton: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  randomSelectionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  samplingInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 8,
  },
  samplingInfoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  unitsList: {
    paddingHorizontal: 20,
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitHeader: {
    marginBottom: 15,
  },
  unitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Random Sample Modal Styles
  randomSampleModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: 20,
    marginTop: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  sampleSummary: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sampleSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    marginBottom: 8,
  },
  sampleSummaryText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  selectedUnitsContainer: {
    marginBottom: 20,
  },
  selectedUnitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedUnitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedUnitChip: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedUnitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  samplingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  samplingNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#0E7490',
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  startInspectionButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startInspectionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
