import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';
import { authService, inspectionService } from '../services';
import { Inspection, User } from '../services/api';

interface OrderDashboardScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

interface StatCard {
  label: string;
  value: string;
  icon: string;
}

export default function OrderDashboardScreen({ navigation }: OrderDashboardScreenProps) {
  console.log('OrderDashboardScreen: Component mounted');
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [stats, setStats] = useState({
    totalInspections: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0
  });

  const loadInitialData = useCallback(async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const dataPromise = (async () => {
        const storedUser = await authService.getStoredUser();
        
        // Role-based access control
        const allowedRoles = ['other', 'order', 'admin'];
        if (!storedUser || !allowedRoles.includes(storedUser.role)) {
          Alert.alert(
            'Access Denied',
            'You do not have permission to access this portal.',
            [{ text: 'OK', onPress: () => {
              authService.logout();
              navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
            }}]
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
      setInspections([]);
      
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
      // Fetch inspections
      const inspectionsResponse = await inspectionService.getInspections();
      if (inspectionsResponse.success && inspectionsResponse.inspections) {
        const inspectionData = inspectionsResponse.inspections || [];
        setInspections(inspectionData);
        
        // Calculate stats
        const scheduled = inspectionData.filter((i: Inspection) => i.status === 'scheduled').length;
        const inProgress = inspectionData.filter((i: Inspection) => i.status === 'in-progress').length;
        const completed = inspectionData.filter((i: Inspection) => i.status === 'completed').length;
        
        setStats({
          totalInspections: inspectionData.length,
          scheduled,
          inProgress,
          completed
        });
      }

      // Also try to get stats from API if available
      try {
        const statsResponse = await inspectionService.getInspectionStats();
        if (statsResponse.success && statsResponse.stats) {
          setStats(prev => ({
            ...prev,
            ...statsResponse.stats
          }));
        }
      } catch (e) {
        // Stats endpoint might not exist, use calculated stats
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Don't show alert, just use empty data
      setInspections([]);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }
    
    setLoading(true);
    try {
      const response = await inspectionService.getInspections();
      if (response.success && response.inspections) {
        // Filter locally by search query
        const filtered = response.inspections.filter((i: Inspection) => 
          i.inspectionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof i.property === 'object' && i.property?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setInspections(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, handleSearch]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('OrderDashboard' as never);
    } else if (screen === 'OrderDashboard') {
      navigation.navigate('OrderDashboard' as never);
    } else if (screen === 'Others') {
      navigation.navigate('Others' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' as never }],
    });
  };

  const statCards: StatCard[] = [
    { label: 'Total Inspections', value: stats.totalInspections.toString(), icon: 'clipboard-check' },
    { label: 'Scheduled', value: stats.scheduled.toString(), icon: 'clock-outline' },
    { label: 'In Progress', value: stats.inProgress.toString(), icon: 'progress-clock' },
    { label: 'Completed', value: stats.completed.toString(), icon: 'check-circle-outline' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#84CC16';
      case 'scheduled':
        return '#FF9800';
      case 'in-progress':
        return '#0E7490';
      case 'pending':
        return '#6B7280';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
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
              userType="Other"
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
            <View style={styles.notificationBadge}>
              <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
                <Ionicons name="notifications-outline" size={28} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.orText}>OR</Text>
            </View>
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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Other Dashboard</Text>
            <Text style={styles.subtitle}>Hi, {user?.fullName?.split(' ')[0] || (user?.email ? user.email.split('@')[0] : 'User')}! View and track inspections</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          ) : (
            <>
              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                {statCards.map((card, index) => (
                  <View key={index} style={styles.statCard}>
                    <Text style={styles.statLabel}>{card.label}</Text>
                    <Text style={styles.statValue}>{card.value}</Text>
                  </View>
                ))}
              </View>

              {/* Search Section */}
              <View style={styles.searchSection}>
                <Text style={styles.searchTitle}>Search Inspections</Text>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by inspection ID or property name"
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* Inspections List */}
              <View style={styles.ordersListContainer}>
                <Text style={styles.ordersTitle}>Recent Inspections</Text>
                {inspections.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No inspections found</Text>
                    <Text style={styles.emptySubtext}>Inspections will appear here when scheduled</Text>
                  </View>
                ) : (
                  inspections.map((inspection) => (
                    <View key={inspection._id} style={styles.orderCard}>
                      <View style={styles.orderHeader}>
                        <View>
                          <Text style={styles.orderNumber}>{inspection.inspectionId || `INS-${inspection._id?.slice(-6).toUpperCase()}`}</Text>
                          <Text style={styles.customerName}>
                            {typeof inspection.property === 'object' ? inspection.property?.name : 'Property'}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(inspection.status || 'pending') },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {(inspection.status || 'pending').charAt(0).toUpperCase() + (inspection.status || 'pending').slice(1)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.orderFooter}>
                        <Text style={styles.orderDate}>{formatDate(inspection.scheduledDate || '')}</Text>
                        <Text style={styles.orderAmount}>{inspection.inspectionType || 'Standard'}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4F8',
  },
  headerContainer: {
    backgroundColor: '#0E7490',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#374151',
  },
  ordersListContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ordersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  orderDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '700',
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
    paddingVertical: 40,
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
});
