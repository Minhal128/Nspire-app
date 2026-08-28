import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { authService, propertyService } from '../services';
import { Property, User } from '../services/api';
import { resolveCoverageUnits } from '../utils/coverageUnits';

interface ManagementDashboardScreenProps {
  navigation: any;
}

export default function ManagementDashboardScreen({ navigation }: ManagementDashboardScreenProps) {
  console.log('ManagementDashboardScreen: Component mounted');

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add maximum loading timeout to prevent infinite loading
  useEffect(() => {
    const maxLoadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout reached, forcing loading to false');
        setLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(maxLoadingTimeout);
  }, [loading]);
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  // State for New Inspection Modal

  const loadInitialData = useCallback(async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const dataPromise = (async () => {
        const storedUser = await authService.getStoredUser();

        // Role-based access control
        const allowedRoles = ['management', 'supervisor', 'admin', 'property-manager'];
        if (!storedUser || !allowedRoles.includes(storedUser.role)) {
          Alert.alert(
            'Access Denied',
            'You do not have permission to access the Management portal.',
            [{
              text: 'OK', onPress: () => {
                authService.logout();
                navigation.reset({ index: 0, routes: [{ name: 'Boarding' }] });
              }
            }]
          );
          return;
        }

        setUser(storedUser);
        await fetchData();
      })();

      await Promise.race([dataPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      // If there's an error, still show the UI but with empty data
      setProperties([]);

      // Show an alert to inform the user about the issue
      Alert.alert(
        'Connection Issue',
        'Unable to load data. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => loadInitialData() },
          { text: 'Continue Offline', style: 'cancel' }
        ]
      );
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
      navigation.navigate('ManagementReports');
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics');
    } else if (screen === 'Settings') {
      navigation.navigate('Settings');
    } else {
      navigation.navigate(screen as never);
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

  /**
   * Web parity: /management/dashboard "Initiate" opens the same NSPIRE property
   * details flow the inspector portal uses. Coverage saved on the property wins;
   * otherwise default to the NSPIRE random sample (re-selectable on that screen).
   */
  const startNspireInspection = (property: Property) => {
    const totalUnits = property.units || 1;
    const coverage = property.inspectionCoverage || 'random';
    const propertyId = String(property._id || property.propertyId || `property_${totalUnits}`);

    const { calculatedUnits, selectedUnits } = property.calculatedUnits
      ? {
          calculatedUnits: property.calculatedUnits,
          selectedUnits: resolveCoverageUnits(coverage, totalUnits, propertyId).selectedUnits,
        }
      : resolveCoverageUnits(coverage, totalUnits, propertyId);

    navigation.navigate('BuildingInspection', {
      property,
      calculatedUnits,
      selectedUnits,
      coverage,
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

      <SafeAreaView style={styles.container}>
        <AppHeader
          onMenuPress={handleMenuPress}
          onNotificationsPress={() => navigation.navigate("Notifications" as any)}
        />

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
          {/* Inspection Overview hero (web parity) */}
          <LinearGradient
            colors={['#1387AC', '#0B5C7B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.overviewCard}
          >
            <Text style={styles.overviewTitle}>Inspection Overview</Text>
            <Text style={styles.overviewSubtitle}>Start a new inspection by adding a property</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('AddProperty')}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start New Inspection</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Properties */}
          <View style={styles.propertiesCard}>
            {loading ? (
              <ActivityIndicator size="large" color="#0E7490" style={{ paddingVertical: 40 }} />
            ) : properties.length === 0 ? (
              <Text style={styles.emptyText}>No properties found.</Text>
            ) : (
              properties.map((property) => (
                <View key={property._id} style={styles.propertyCard}>
                  <Text style={styles.propertyName}>{property.name}</Text>
                  <Text style={styles.propertyLocation}>{property.city}, {property.state}</Text>
                  <Text style={styles.propertyUnits}>{property.units || 0} Units</Text>

                  <View style={styles.propertyActions}>
                    <TouchableOpacity
                      style={styles.viewUnitsButton}
                      onPress={() => navigation.navigate('UnitInspection', { property })}
                    >
                      <Text style={styles.viewUnitsText}>View Units</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.startInspectionButton}
                      onPress={() => startNspireInspection(property)}
                    >
                      <Text style={styles.startInspectionText}>Start Inspection</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
    borderRadius: 10,
    margin: 16,
    padding: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#D6E9F2',
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#116E93',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 18,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  propertiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#E4F0F6',
  },
  scrollView: {
    flex: 1,
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
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 15,
    color: '#6B7280',
  },
  // New Inspection Modal Styles
});
