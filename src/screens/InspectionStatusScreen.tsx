import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';

interface InspectionStatusScreenProps {
  navigation: any;
}

interface InspectionStatus {
  id: string;
  propertyName: string;
  propertyAddress: string;
  buildingId: string;
  inspectionDate: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  totalItems: number;
  completedItems: number;
  deficienciesFound: number;
  score?: number;
}

export default function InspectionStatusScreen({ navigation }: InspectionStatusScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in-progress' | 'not-started'>('all');
  const [inspections, setInspections] = useState<InspectionStatus[]>([]);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      // TODO: Replace with actual API call
      // Simulating API data
      const mockData: InspectionStatus[] = [
        {
          id: '1',
          propertyName: 'Golden Town Apartments',
          propertyAddress: '123 Main St, New York, NY',
          buildingId: 'Building A',
          inspectionDate: '2026-01-31',
          status: 'completed',
          progress: 100,
          totalItems: 61,
          completedItems: 61,
          deficienciesFound: 1,
          score: 85,
        },
        {
          id: '2',
          propertyName: 'Sunset Plaza',
          propertyAddress: '456 Oak Ave, Los Angeles, CA',
          buildingId: 'Building B',
          inspectionDate: '2026-01-30',
          status: 'in-progress',
          progress: 65,
          totalItems: 61,
          completedItems: 40,
          deficienciesFound: 2,
        },
        {
          id: '3',
          propertyName: 'Riverside Complex',
          propertyAddress: '789 River Rd, Chicago, IL',
          buildingId: 'Building C',
          inspectionDate: '2026-02-01',
          status: 'not-started',
          progress: 0,
          totalItems: 61,
          completedItems: 0,
          deficienciesFound: 0,
        },
      ];
      
      setInspections(mockData);
    } catch (error) {
      console.error('Error loading inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'InspectionStatus') {
      // Already on this screen
      return;
    }
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boarding' as never }],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#F59E0B';
      case 'not-started':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'time';
      case 'not-started':
        return 'ellipse-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'not-started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    if (activeTab === 'all') return true;
    return inspection.status === activeTab;
  });

  const stats = {
    total: inspections.length,
    completed: inspections.filter(i => i.status === 'completed').length,
    inProgress: inspections.filter(i => i.status === 'in-progress').length,
    notStarted: inspections.filter(i => i.status === 'not-started').length,
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

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require('../../inspire_logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0E7490" />
            <Text style={styles.loadingText}>Loading inspections...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Inspection Status</Text>
              <Text style={styles.subtitle}>Track your inspection progress and completion status</Text>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={[styles.statCard, styles.statCardCompleted]}>
                <Text style={[styles.statValue, styles.statValueCompleted]}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={[styles.statCard, styles.statCardInProgress]}>
                <Text style={[styles.statValue, styles.statValueInProgress]}>{stats.inProgress}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={[styles.statCard, styles.statCardNotStarted]}>
                <Text style={[styles.statValue, styles.statValueNotStarted]}>{stats.notStarted}</Text>
                <Text style={styles.statLabel}>Not Started</Text>
              </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                onPress={() => setActiveTab('all')}
              >
                <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                  All ({stats.total})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                onPress={() => setActiveTab('completed')}
              >
                <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                  Completed ({stats.completed})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'in-progress' && styles.tabActive]}
                onPress={() => setActiveTab('in-progress')}
              >
                <Text style={[styles.tabText, activeTab === 'in-progress' && styles.tabTextActive]}>
                  In Progress ({stats.inProgress})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Inspections List */}
            <View style={styles.inspectionsContainer}>
              {filteredInspections.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="clipboard-outline" size={64} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>No inspections found</Text>
                </View>
              ) : (
                filteredInspections.map((inspection) => (
                  <View key={inspection.id} style={styles.inspectionCard}>
                    <View style={styles.inspectionHeader}>
                      <View style={styles.inspectionTitleRow}>
                        <Text style={styles.inspectionProperty}>{inspection.propertyName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inspection.status) }]}>
                          <Ionicons 
                            name={getStatusIcon(inspection.status) as any} 
                            size={14} 
                            color="#FFFFFF" 
                          />
                          <Text style={styles.statusText}>{getStatusLabel(inspection.status)}</Text>
                        </View>
                      </View>
                      <Text style={styles.inspectionAddress}>{inspection.propertyAddress}</Text>
                      <Text style={styles.inspectionBuilding}>Building: {inspection.buildingId}</Text>
                    </View>

                    <View style={styles.inspectionDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{inspection.inspectionDate}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="checkmark-done-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          {inspection.completedItems}/{inspection.totalItems} items completed
                        </Text>
                      </View>
                      {inspection.deficienciesFound > 0 && (
                        <View style={styles.detailRow}>
                          <Ionicons name="alert-circle-outline" size={16} color="#EF4444" />
                          <Text style={[styles.detailText, styles.deficiencyText]}>
                            {inspection.deficienciesFound} deficienc{inspection.deficienciesFound === 1 ? 'y' : 'ies'} found
                          </Text>
                        </View>
                      )}
                      {inspection.score !== undefined && (
                        <View style={styles.detailRow}>
                          <Ionicons name="star-outline" size={16} color="#F59E0B" />
                          <Text style={styles.detailText}>Score: {inspection.score}</Text>
                        </View>
                      )}
                    </View>

                    {/* Progress Bar */}
                    {inspection.status !== 'not-started' && (
                      <View style={styles.progressSection}>
                        <View style={styles.progressHeader}>
                          <Text style={styles.progressLabel}>Progress</Text>
                          <Text style={styles.progressValue}>{inspection.progress}%</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View 
                            style={[
                              styles.progressBarFill, 
                              { 
                                width: `${inspection.progress}%`,
                                backgroundColor: getStatusColor(inspection.status),
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    )}

                    {/* Action Button */}
                    <TouchableOpacity 
                      style={[
                        styles.actionButton,
                        inspection.status === 'completed' && styles.actionButtonCompleted,
                      ]}
                      onPress={() => {
                        // Navigate to appropriate screen based on status
                        if (inspection.status === 'completed') {
                          // View report
                          navigation.navigate('Reports' as never);
                        } else {
                          // Continue inspection
                          navigation.navigate('Dashboard' as never);
                        }
                      }}
                    >
                      <Text style={styles.actionButtonText}>
                        {inspection.status === 'completed' ? 'View Report' : 
                         inspection.status === 'in-progress' ? 'Continue Inspection' : 
                         'Start Inspection'}
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
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
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statCardInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statCardNotStarted: {
    backgroundColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statValueCompleted: {
    color: '#10B981',
  },
  statValueInProgress: {
    color: '#F59E0B',
  },
  statValueNotStarted: {
    color: '#6B7280',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#0E7490',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  inspectionsContainer: {
    paddingHorizontal: 20,
  },
  inspectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspectionHeader: {
    marginBottom: 16,
  },
  inspectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inspectionProperty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inspectionAddress: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  inspectionBuilding: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  inspectionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  deficiencyText: {
    color: '#EF4444',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E7490',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButton: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonCompleted: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
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
});
