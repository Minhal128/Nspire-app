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
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import OtherInspectionCard from '../components/OtherInspectionCard';
import { authService, inspectionService, userService } from '../services';
import { Inspection, User } from '../services/api';
import { getRoleDisplayName } from '../utils/otherPortal';

interface OrderDashboardScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

export default function OrderDashboardScreen({ navigation }: OrderDashboardScreenProps) {
  console.log('OrderDashboardScreen: Component mounted');

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
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
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

    // Non-inspector users, shown at the bottom of the web dashboard.
    try {
      const usersResponse = await userService.getOtherUsers();
      setOtherUsers((usersResponse.users || []).filter((u) => u.role !== 'inspector'));
    } catch (error) {
      console.error('Error loading other users:', error);
      setOtherUsers([]);
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
    if (screen === 'Dashboard' || screen === 'OrderDashboard') {
      // Already here.
      return;
    }
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' as never }],
    });
  };

  const statCards = [
    { label: 'Total Inspections', value: stats.totalInspections },
    { label: 'Scheduled', value: stats.scheduled },
    { label: 'In Progress', value: stats.inProgress },
    { label: 'Completed', value: stats.completed },
  ];

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
        <AppHeader
          onMenuPress={handleMenuPress}
          onNotificationsPress={() => navigation.navigate('Notifications' as never)}
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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Other Portal</Text>
            <Text style={styles.subtitle}>Manage and track your activities</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          ) : (
            <>
              {/* Stats Cards */}
              {statCards.map((card) => (
                <View key={card.label} style={[styles.card, styles.statCard]}>
                  <Text style={styles.statLabel}>{card.label}</Text>
                  <Text style={styles.statValue}>{card.value}</Text>
                </View>
              ))}

              {/* Recent Inspections */}
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Inspections</Text>
                  <View style={styles.countPill}>
                    <Text style={styles.countPillText}>{inspections.length} inspections</Text>
                  </View>
                </View>
                {inspections.length === 0 ? (
                  <Text style={styles.emptyText}>No inspections found.</Text>
                ) : (
                  inspections.map((inspection) => (
                    <OtherInspectionCard key={inspection._id} inspection={inspection} />
                  ))
                )}
              </View>

              {/* Other Users */}
              <View style={styles.card}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Other Users</Text>
                  <View style={styles.countPill}>
                    <Text style={styles.countPillText}>{otherUsers.length} users</Text>
                  </View>
                </View>
                {otherUsers.length === 0 ? (
                  <Text style={styles.emptyText}>No users found.</Text>
                ) : (
                  otherUsers.map((otherUser) => (
                    <View key={otherUser._id || otherUser.id} style={styles.otherUserRow}>
                      <View style={styles.otherUserAvatar}>
                        <Text style={styles.otherUserAvatarText}>
                          {otherUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View style={styles.otherUserInfo}>
                        <Text style={styles.otherUserName}>{otherUser.fullName}</Text>
                        <Text style={styles.otherUserRole}>{getRoleDisplayName(otherUser.role)}</Text>
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
    backgroundColor: '#E4F0F6',
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
  // Every block on this page is the same white card (web parity).
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    paddingVertical: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  countPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  countPillText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  otherUserRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E7490',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  otherUserAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  otherUserInfo: {
    flex: 1,
  },
  otherUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  otherUserRole: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
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
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 15,
    color: '#6B7280',
  },
});
