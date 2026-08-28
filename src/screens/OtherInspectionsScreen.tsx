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
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Sidebar from '../components/Sidebar';
import { authService, inspectionService } from '../services';
import { Inspection } from '../services/api';
import OtherInspectionCard from '../components/OtherInspectionCard';

interface OtherInspectionsScreenProps {
  navigation: NativeStackNavigationProp<any, any>;
}

// Mirrors the web <select> on /other/inspections.
const STATUS_FILTERS = [
  { label: 'All Status', value: '' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
];

export default function OtherInspectionsScreen({ navigation }: OtherInspectionsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [stats, setStats] = useState({
    totalInspections: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await inspectionService.getInspections(
        statusFilter ? { status: statusFilter } : undefined,
      );
      setInspections(response.success ? response.inspections || [] : []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setInspections([]);
    }

    // Stats are portal-wide, so they ignore the status filter (same as web).
    try {
      const statsResponse = await inspectionService.getInspectionStats();
      if (statsResponse.success && statsResponse.stats) {
        const s: any = statsResponse.stats;
        setStats({
          totalInspections: s.totalInspections || 0,
          scheduled: s.scheduled || 0,
          inProgress: s.inProgress || 0,
          completed: s.completed || 0,
        });
      }
    } catch (error) {
      // ponytail: stats endpoint is optional; the list below still renders.
      console.log('Inspection stats unavailable, keeping previous values');
    }
  }, [statusFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const storedUser = await authService.getStoredUser();
      const allowedRoles = ['other', 'order', 'admin'];
      if (!storedUser || !allowedRoles.includes(storedUser.role)) {
        Alert.alert('Access Denied', 'You do not have permission to access this portal.', [
          {
            text: 'OK',
            onPress: () => {
              authService.logout();
              navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
            },
          },
        ]);
        return;
      }
      await fetchData();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchData, navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard' || screen === 'OrderDashboard') {
      navigation.navigate('OrderDashboard' as never);
    } else if (screen === 'OtherInspections') {
      // Already here.
    } else {
      navigation.navigate(screen as never);
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
  };

  const query = searchQuery.toLowerCase();
  const filteredInspections = inspections.filter((inspection) => {
    const propertyName =
      typeof inspection.property === 'object' ? inspection.property?.name || '' : '';
    return (
      inspection.inspectionId?.toLowerCase().includes(query) ||
      propertyName.toLowerCase().includes(query) ||
      inspection.inspectionType?.toLowerCase().includes(query)
    );
  });

  const statCards = [
    { label: 'Total Inspections', value: stats.totalInspections, color: '#1F2937' },
    { label: 'Scheduled', value: stats.scheduled, color: '#CA8A04' },
    { label: 'In Progress', value: stats.inProgress, color: '#2563EB' },
    { label: 'Completed', value: stats.completed, color: '#16A34A' },
  ];

  return (
    <>
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent
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
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require('../../public/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.notificationBadge}>
              <TouchableOpacity onPress={() => navigation.navigate('Notifications' as any)}>
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
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Inspections</Text>
            <Text style={styles.subtitle}>View and track all inspections</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            {statCards.map((card) => (
              <View key={card.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{card.label}</Text>
                <Text style={[styles.statValue, { color: card.color }]}>{card.value}</Text>
              </View>
            ))}
          </View>

          {/* Search & Filter */}
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>Search & Filter</Text>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by ID, property, or type..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* ponytail: chips instead of a dropdown - five options fit on one row. */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
              contentContainerStyle={styles.filterRowContent}
            >
              {STATUS_FILTERS.map((option) => {
                const active = statusFilter === option.value;
                return (
                  <TouchableOpacity
                    key={option.value || 'all'}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setStatusFilter(option.value)}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* List */}
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>All Inspections</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>
                  {filteredInspections.length} inspections
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0E7490" />
              </View>
            ) : filteredInspections.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>No inspections found.</Text>
              </View>
            ) : (
              filteredInspections.map((inspection) => (
                <OtherInspectionCard key={inspection._id} inspection={inspection} />
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
  filterRow: {
    marginTop: 12,
  },
  filterRowContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#0E7490',
    borderColor: '#0E7490',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  countPill: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  countPillText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  loadingContainer: {
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
    color: '#9CA3AF',
    marginTop: 12,
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
});
