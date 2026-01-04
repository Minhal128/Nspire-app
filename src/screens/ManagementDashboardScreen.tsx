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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';
import { authService, propertyService, inspectionService } from '../services';
import { Property, Inspection, User } from '../services/api';

interface ManagementDashboardScreenProps {
  navigation: any;
}

export default function ManagementDashboardScreen({ navigation }: ManagementDashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [complianceStats, setComplianceStats] = useState({
    complianceScore: 0,
    compliantCount: 0,
    needsAttentionCount: 0,
    nonCompliantCount: 0
  });
  
  // State for New Inspection Modal
  const [newInspectionModalVisible, setNewInspectionModalVisible] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [loadingProperties, setLoadingProperties] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      const storedUser = await authService.getStoredUser();
      
      // Role-based access control
      const allowedRoles = ['management', 'supervisor', 'admin'];
      if (!storedUser || !allowedRoles.includes(storedUser.role)) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access the Management portal.',
          [{ text: 'OK', onPress: () => {
            authService.logout();
            navigation.reset({ index: 0, routes: [{ name: 'Boarding' }] });
          }}]
        );
        return;
      }
      
      setUser(storedUser);
      await fetchData();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const fetchData = async () => {
    try {
      // Fetch properties
      const propertiesResponse = await propertyService.getProperties({ limit: 5 });
      if (propertiesResponse.success && propertiesResponse.properties) {
        setProperties(propertiesResponse.properties || []);
      }

      // Fetch inspections
      const inspectionsResponse = await inspectionService.getInspections({ limit: 5 });
      if (inspectionsResponse.success && inspectionsResponse.inspections) {
        const inspectionData = inspectionsResponse.inspections || [];
        setInspections(inspectionData);
        
        // Calculate compliance stats
        const compliant = inspectionData.filter((i: Inspection) => i.status === 'completed' || (i.complianceScore && i.complianceScore >= 80)).length;
        const needsAttention = inspectionData.filter((i: Inspection) => i.status === 'in-progress' || (i.complianceScore && i.complianceScore >= 50 && i.complianceScore < 80)).length;
        const nonCompliant = inspectionData.filter((i: Inspection) => i.complianceScore && i.complianceScore < 50).length;
        const total = inspectionData.length || 1;
        
        setComplianceStats({
          complianceScore: Math.round((compliant / total) * 100),
          compliantCount: compliant,
          needsAttentionCount: needsAttention,
          nonCompliantCount: nonCompliant
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  const handleMenuPress = () => {
    setSidebarVisible(true);
  };
  
  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Already on Management Dashboard, stay here
      return;
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections');
    } else if (screen === 'Reports') {
      navigation.navigate('Reports');
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics');
    } else if (screen === 'Settings') {
      navigation.navigate('Settings');
    }
  };
  
  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' }],
    });
  };

  // Load all properties for the modal
  const loadAllProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await propertyService.getProperties();
      if (response.success && response.properties) {
        setAllProperties(response.properties);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoadingProperties(false);
    }
  };

  // Handle opening the new inspection modal
  const handleOpenNewInspection = async () => {
    setNewInspectionModalVisible(true);
    setSelectedProperty(null);
    setSelectedUnit('');
    await loadAllProperties();
  };

  // Handle starting the inspection
  const handleStartNewInspection = () => {
    if (!selectedProperty) {
      Alert.alert('Select Property', 'Please select a property to start the inspection.');
      return;
    }

    setNewInspectionModalVisible(false);
    
    // Navigate to InspectionChecklist with selected property and unit
    navigation.navigate('InspectionChecklist', { 
      property: selectedProperty,
      unit: selectedUnit ? { 
        id: selectedUnit, 
        name: `Unit ${selectedUnit}`,
        unitNumber: selectedUnit 
      } : null 
    });
  };

  // Generate unit options based on property's unit count
  const generateUnitOptions = () => {
    if (!selectedProperty || !selectedProperty.units) return [];
    const unitCount = selectedProperty.units;
    return Array.from({ length: unitCount }, (_, i) => {
      const unitNumber = (i + 1).toString().padStart(3, '0');
      return { id: unitNumber, name: `Unit ${unitNumber}` };
    });
  };

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
              userType="Management"
            />
          </View>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
      </Modal>

      {/* New Inspection Modal */}
      <Modal
        visible={newInspectionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNewInspectionModalVisible(false)}
      >
        <View style={styles.inspectionModalOverlay}>
          <View style={styles.inspectionModalContent}>
            <View style={styles.inspectionModalHeader}>
              <Text style={styles.inspectionModalTitle}>Start New Inspection</Text>
              <TouchableOpacity 
                onPress={() => setNewInspectionModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {loadingProperties ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color="#0E7490" />
                <Text style={styles.modalLoadingText}>Loading properties...</Text>
              </View>
            ) : (
              <ScrollView style={styles.inspectionModalBody} showsVerticalScrollIndicator={false}>
                {/* Property Selection */}
                <Text style={styles.inputLabel}>Select Property *</Text>
                {allProperties.length === 0 ? (
                  <View style={styles.noPropertiesContainer}>
                    <Ionicons name="home-outline" size={40} color="#9CA3AF" />
                    <Text style={styles.noPropertiesText}>No properties found</Text>
                    <Text style={styles.noPropertiesSubtext}>Add a property first to start an inspection</Text>
                  </View>
                ) : (
                  <View style={styles.propertyList}>
                    {allProperties.map((property) => (
                      <TouchableOpacity
                        key={property._id}
                        style={[
                          styles.propertySelectItem,
                          selectedProperty?._id === property._id && styles.propertySelectItemActive
                        ]}
                        onPress={() => {
                          setSelectedProperty(property);
                          setSelectedUnit('');
                        }}
                      >
                        <View style={styles.propertySelectInfo}>
                          <Text style={[
                            styles.propertySelectName,
                            selectedProperty?._id === property._id && styles.propertySelectNameActive
                          ]}>
                            {property.name}
                          </Text>
                          <Text style={styles.propertySelectDetails}>
                            {property.city}, {property.state} • {property.units || 0} Units
                          </Text>
                        </View>
                        {selectedProperty?._id === property._id && (
                          <Ionicons name="checkmark-circle" size={24} color="#0E7490" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Unit Selection (Optional) */}
                {selectedProperty && selectedProperty.units > 0 && (
                  <>
                    <Text style={[styles.inputLabel, { marginTop: 20 }]}>Select Unit (Optional)</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScrollView}>
                      <View style={styles.unitList}>
                        <TouchableOpacity
                          style={[
                            styles.unitSelectItem,
                            selectedUnit === '' && styles.unitSelectItemActive
                          ]}
                          onPress={() => setSelectedUnit('')}
                        >
                          <Text style={[
                            styles.unitSelectText,
                            selectedUnit === '' && styles.unitSelectTextActive
                          ]}>All Units</Text>
                        </TouchableOpacity>
                        {generateUnitOptions().map((unit) => (
                          <TouchableOpacity
                            key={unit.id}
                            style={[
                              styles.unitSelectItem,
                              selectedUnit === unit.id && styles.unitSelectItemActive
                            ]}
                            onPress={() => setSelectedUnit(unit.id)}
                          >
                            <Text style={[
                              styles.unitSelectText,
                              selectedUnit === unit.id && styles.unitSelectTextActive
                            ]}>{unit.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </>
                )}
              </ScrollView>
            )}

            <View style={styles.inspectionModalFooter}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setNewInspectionModalVisible(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.startModalButton,
                  !selectedProperty && styles.startModalButtonDisabled
                ]}
                onPress={handleStartNewInspection}
                disabled={!selectedProperty}
              >
                <Text style={styles.startModalButtonText}>Start Inspection</Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E7490']}
              tintColor="#0E7490"
            />
          }
        >
          {/* User Greeting */}
          <View style={styles.greetingContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.greetingText}>Hi, {user?.fullName?.split(' ')[0] || 'User'}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          ) : (
            <>
              {/* My Properties Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons name="home" size={20} color="#1F2937" />
                    <Text style={styles.sectionTitle}>My Properties</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addPropertyButton}
                    onPress={() => navigation.navigate('AddProperty')}
                  >
                    <Text style={styles.addPropertyText}>Add Property</Text>
                  </TouchableOpacity>
                </View>

                {properties.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No properties found</Text>
                    <Text style={styles.emptySubtext}>Add a property to get started</Text>
                  </View>
                ) : (
                  properties.slice(0, 2).map((property) => (
                    <View key={property._id} style={styles.propertyCard}>
                      <Text style={styles.propertyName}>{property.name}</Text>
                      <Text style={styles.propertyLocation}>{property.city}, {property.state}</Text>
                      <Text style={styles.propertyUnits}>{property.units || 0} Units</Text>
                      
                      <View style={styles.propertyActions}>
                        <TouchableOpacity 
                          style={styles.viewUnitsButton}
                          onPress={() => navigation.navigate('UnitInspection', { propertyId: property._id })}
                        >
                          <Text style={styles.viewUnitsText}>View Units</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.startInspectionButton}
                          onPress={() => navigation.navigate('InspectionChecklist', { propertyId: property._id })}
                        >
                          <Text style={styles.startInspectionText}>Start Inspection</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('MyInspections')}
                >
                  <Text style={styles.viewAllLink}>View All Properties</Text>
                </TouchableOpacity>
              </View>

              {/* Inspections Overview Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Inspections Overview</Text>
                  <TouchableOpacity 
                    style={styles.startInspectionHeaderButton}
                    onPress={handleOpenNewInspection}
                  >
                    <Text style={styles.startInspectionHeaderText}>Start New Inspection</Text>
                  </TouchableOpacity>
                </View>

                {inspections.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No inspections found</Text>
                    <Text style={styles.emptySubtext}>Start an inspection to see results</Text>
                  </View>
                ) : (
                  inspections.slice(0, 2).map((inspection) => (
                    <View key={inspection._id} style={styles.inspectionCard}>
                      <Text style={styles.inspectionProperty}>
                        {typeof inspection.property === 'object' ? inspection.property.name : 'Property'} / {typeof inspection.unit === 'object' && inspection.unit ? `Unit ${(inspection.unit as any).unitNumber || (inspection.unit as any).name || 'Unknown'}` : 'Unit'}
                      </Text>
                      <View style={styles.compliantBadge}>
                        <Ionicons 
                          name={inspection.status === 'completed' ? "checkmark-circle" : "time"} 
                          size={16} 
                          color={inspection.status === 'completed' ? "#10B981" : "#F59E0B"} 
                        />
                        <Text style={[
                          styles.compliantText,
                          { color: inspection.status === 'completed' ? "#10B981" : "#F59E0B" }
                        ]}>
                          {inspection.status === 'completed' ? 'Compliant' : 'In Progress'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('MyInspections')}
                >
                  <Text style={styles.viewAllLink}>View All Inspections</Text>
                </TouchableOpacity>
              </View>

              {/* Compliance Snapshot Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Compliance Snapshot</Text>

                {/* Circular Progress */}
                <View style={styles.complianceCircleContainer}>
                  <View style={styles.circleBackground} />
                  
                  {/* Progress ring - Left half */}
                  <View style={styles.progressLeftHalf}>
                    <View style={[
                      styles.progressLeftFill,
                      complianceStats.complianceScore >= 50 && styles.progressLeftFillComplete,
                      complianceStats.complianceScore < 50 && {
                        transform: [{ rotate: `${(complianceStats.complianceScore / 50) * 180}deg` }]
                      }
                    ]} />
                  </View>
                  
                  {/* Progress ring - Right half */}
                  {complianceStats.complianceScore > 50 && (
                    <View style={styles.progressRightHalf}>
                      <View style={[
                        styles.progressRightFill,
                        { transform: [{ rotate: `${((complianceStats.complianceScore - 50) / 50) * 180}deg` }] }
                      ]} />
                    </View>
                  )}
                  
                  {/* Center text */}
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressPercentage}>{complianceStats.complianceScore}%</Text>
                    <Text style={styles.progressLabel}>Compliant</Text>
                  </View>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendLabel}>Compliant</Text>
                    <Text style={styles.legendValue}>{complianceStats.compliantCount}</Text>
                  </View>
                  
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendLabel}>Needs Attention</Text>
                    <Text style={styles.legendValue}>{complianceStats.needsAttentionCount}</Text>
                  </View>
                  
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendLabel}>Non-Compliant</Text>
                    <Text style={styles.legendValue}>{complianceStats.nonCompliantCount}</Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
                  <Text style={styles.viewAllLink}>View Full Report</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

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
  headerContainer: {
    backgroundColor: '#0E7490',
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
  greetingContainer: {
    backgroundColor: '#0E7490',
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  addPropertyButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addPropertyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  propertyUnits: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  propertyActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewUnitsButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewUnitsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  startInspectionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
  },
  startInspectionText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '600',
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    textAlign: 'left',
  },
  startInspectionHeaderButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  startInspectionHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inspectionCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  inspectionProperty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  compliantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compliantText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  complianceCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#E5E7EB',
  },
  progressLeftHalf: {
    position: 'absolute',
    width: 70,
    height: 140,
    overflow: 'hidden',
    left: 0,
  },
  progressLeftFill: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: '#10B981',
    borderLeftColor: '#10B981',
    transform: [{ rotate: '0deg' }],
  },
  progressLeftFillComplete: {
    transform: [{ rotate: '180deg' }],
  },
  progressRightHalf: {
    position: 'absolute',
    width: 70,
    height: 140,
    overflow: 'hidden',
    right: 0,
  },
  progressRightFill: {
    position: 'absolute',
    right: 0,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: '#10B981',
    borderRightColor: '#10B981',
    transform: [{ rotate: '0deg' }],
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendContainer: {
    gap: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // New Inspection Modal Styles
  inspectionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  inspectionModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  inspectionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  inspectionModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  inspectionModalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  modalLoadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  noPropertiesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noPropertiesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  noPropertiesSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  propertyList: {
    gap: 8,
  },
  propertySelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  propertySelectItemActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0E7490',
  },
  propertySelectInfo: {
    flex: 1,
  },
  propertySelectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  propertySelectNameActive: {
    color: '#0E7490',
  },
  propertySelectDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  unitScrollView: {
    marginBottom: 10,
  },
  unitList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  unitSelectItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unitSelectItemActive: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0E7490',
  },
  unitSelectText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  unitSelectTextActive: {
    color: '#0E7490',
    fontWeight: '600',
  },
  inspectionModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  startModalButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startModalButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  startModalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
