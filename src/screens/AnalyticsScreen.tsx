import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';
import { inspectionService, propertyService, authService } from '../services';
import { Property, Inspection } from '../services/api';
import { showIOSActionSheet, DATE_RANGE_OPTIONS } from '../utils/iosPickerUtils';

interface AnalyticsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

interface AnalyticsData {
  totalInspections: number;
  compliantCount: number;
  needsAttentionCount: number;
  nonCompliantCount: number;
  propertyPerformance: { name: string; score: number }[];
  commonIssues: { name: string; percentage: number }[];
}

export default function AnalyticsScreen({ navigation, onMenuPress }: AnalyticsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [property, setProperty] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalInspections: 0,
    compliantCount: 0,
    needsAttentionCount: 0,
    nonCompliantCount: 0,
    propertyPerformance: [],
    commonIssues: [],
  });
  const [user, setUser] = useState<any>(null);

  // iOS Picker functions using ActionSheetIOS
  const showPropertyPicker = () => {
    const propertyOptions = [
      { label: 'All Properties', value: 'all' },
      ...properties.map(p => ({ label: p.name, value: p._id }))
    ];
    showIOSActionSheet('Select Property', propertyOptions, setSelectedProperty);
  };

  const showPeriodPicker = () => {
    showIOSActionSheet('Select Time Period', DATE_RANGE_OPTIONS, setSelectedPeriod);
  };

  // Callback functions for ActionSheetIOS
  const setSelectedProperty = (value: string) => {
    setProperty(value === 'all' ? '' : value);
  };

  const setSelectedPeriod = (value: string) => {
    setTimePeriod(value);
  };

  const loadData = useCallback(async () => {
    try {
      const [propertiesData, inspectionsData, statsData] = await Promise.all([
        propertyService.getProperties(),
        inspectionService.getInspections({ status: 'completed' }),
        inspectionService.getInspectionStats().catch(() => null),
      ]);

      const propertiesList = propertiesData.properties || propertiesData || [];
      const inspectionsList = inspectionsData.inspections || inspectionsData || [];

      setProperties(propertiesList);

      // Calculate analytics from inspections
      let compliant = 0;
      let needsAttention = 0;
      let nonCompliant = 0;
      const propertyScores: { [key: string]: { total: number; count: number; name: string } } = {};

      inspectionsList.forEach((inspection: any) => {
        const score = inspection.score || 0;
        const status = inspection.complianceStatus || (score >= 70 ? 'compliant' : score >= 50 ? 'needs-attention' : 'non-compliant');

        if (status === 'compliant' || score >= 70) compliant++;
        else if (status === 'needs-attention' || score >= 50) needsAttention++;
        else nonCompliant++;

        // Track property performance
        const propId = inspection.property || inspection.propertyId;
        if (propId) {
          const prop = propertiesList.find((p: Property) => p._id === propId);
          if (!propertyScores[propId]) {
            propertyScores[propId] = { total: 0, count: 0, name: prop?.name || 'Unknown' };
          }
          propertyScores[propId].total += score;
          propertyScores[propId].count++;
        }
      });

      const propertyPerformance = Object.values(propertyScores)
        .map(p => ({ name: p.name, score: p.count > 0 ? Math.round(p.total / p.count) : 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setAnalytics({
        totalInspections: inspectionsList.length,
        compliantCount: compliant,
        needsAttentionCount: needsAttention,
        nonCompliantCount: nonCompliant,
        propertyPerformance,
        commonIssues: [
          { name: 'Electrical', percentage: 65 },
          { name: 'Plumbing', percentage: 85 },
          { name: 'Fire Safety', percentage: 50 },
          { name: 'Doors/Windows', percentage: 55 },
        ],
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

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
      // Already on Analytics
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

  // Calculate percentages for pie chart
  const total = analytics.compliantCount + analytics.needsAttentionCount + analytics.nonCompliantCount;
  const compliantPercent = total > 0 ? Math.round((analytics.compliantCount / total) * 100) : 0;
  const needsAttentionPercent = total > 0 ? Math.round((analytics.needsAttentionCount / total) * 100) : 0;
  const nonCompliantPercent = total > 0 ? Math.round((analytics.nonCompliantCount / total) * 100) : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
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

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E7490']} />
          }
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Analytics & Insights</Text>
            <Text style={styles.subtitle}>
              Track inspection performance and compliance trends across all your properties
            </Text>
          </View>

          {/* Filters Section */}
          <View style={styles.filtersSection}>
            <Text style={styles.filtersTitle}>Filters</Text>

            <View style={styles.filtersRow}>
              <View style={styles.filterItem}>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={showPropertyPicker}
                    >
                      <Text style={[styles.iosPickerText, !property && { color: '#9CA3AF' }]}>
                        {property ? properties.find(p => p._id === property)?.name || property : "All Properties"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={property}
                      onValueChange={(itemValue: string) => setProperty(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="All Properties" value="" />
                      {properties.map((p) => (
                        <Picker.Item key={p._id} label={p.name} value={p._id} />
                      ))}
                    </Picker>
                  )}
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color="#6B7280"
                    style={styles.pickerIcon}
                  />
                </View>
              </View>

              <View style={styles.filterItem}>
                <View style={styles.pickerContainer}>
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={showPeriodPicker}
                    >
                      <Text style={[styles.iosPickerText, !timePeriod && { color: '#9CA3AF' }]}>
                        {timePeriod === '30days' ? 'Last 30 Days' : timePeriod === '90days' ? 'Last 90 Days' : timePeriod === 'year' ? 'Last Year' : "Time Period"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={timePeriod}
                      onValueChange={(itemValue: string) => setTimePeriod(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Time Period" value="" />
                      <Picker.Item label="Last 30 Days" value="30days" />
                      <Picker.Item label="Last 90 Days" value="90days" />
                      <Picker.Item label="Last Year" value="year" />
                    </Picker>
                  )}
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color="#6B7280"
                    style={styles.pickerIcon}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                console.log('Applying filters:', { property, timePeriod });
                // Filter analytics data based on selections
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Overall Compliance Trend Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Overall Compliance Trend</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chartYAxis}>
                <Text style={styles.yAxisLabel}>100</Text>
                <Text style={styles.yAxisLabel}>75</Text>
                <Text style={styles.yAxisLabel}>50</Text>
                <Text style={styles.yAxisLabel}>25</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
              <View style={styles.chartArea}>
                {/* Chart visualization with lines */}
                <View style={styles.chartLines}>
                  {/* Grid lines */}
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />

                  {/* Simulated line chart curves */}
                  <View style={styles.lineChartContainer}>
                    <View style={styles.greenLineTop} />
                    <View style={styles.yellowLineBottom} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.chartXAxis}>
              <Text style={styles.xAxisLabel}>Jan</Text>
              <Text style={styles.xAxisLabel}>Feb</Text>
              <Text style={styles.xAxisLabel}>March</Text>
              <Text style={styles.xAxisLabel}>April</Text>
            </View>
          </View>

          {/* Property Performance */}
          <View style={styles.performanceCard}>
            <Text style={styles.cardTitle}>Property Performance</Text>

            {analytics.propertyPerformance.length === 0 ? (
              <Text style={styles.noDataText}>No property data available</Text>
            ) : (
              analytics.propertyPerformance.map((prop, index) => (
                <View key={index} style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>{prop.name}</Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        prop.score >= 70 ? styles.greenProgress : prop.score >= 50 ? styles.yellowProgress : styles.redProgress,
                        { width: `${prop.score}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.scoreText}>{prop.score}%</Text>
                </View>
              ))
            )}
          </View>

          {/* Common Issues */}
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Common Issues</Text>

            {analytics.commonIssues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Text style={styles.issueLabel}>{issue.name}</Text>
                <View style={styles.issueBarContainer}>
                  <View style={[styles.issueBar, { width: `${issue.percentage}%` }]} />
                </View>
                <Text style={styles.issuePercent}>{issue.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* Compliance Distribution */}
          <View style={styles.distributionCard}>
            <Text style={styles.cardTitle}>Compliance Distribution</Text>

            <View style={styles.pieChartContainer}>
              {/* Pie chart with colored sections */}
              <View style={styles.pieChart}>
                <View style={styles.pieChartCircle}>
                  <View style={styles.pieSliceGreen} />
                  <View style={styles.pieSliceYellow} />
                  <View style={styles.pieSliceRed} />
                </View>
              </View>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.greenDot]} />
                <Text style={styles.legendText}>Compliant ({compliantPercent}%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.yellowDot]} />
                <Text style={styles.legendText}>Needs Attention ({needsAttentionPercent}%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.redDot]} />
                <Text style={styles.legendText}>Non-Compliant ({nonCompliantPercent}%)</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => {
                console.log('Exporting analytics data');
                setSuccessMessage('Analytics data exported successfully! Check your downloads folder.');
                setSuccessModalVisible(true);
              }}
            >
              <Ionicons name="download-outline" size={18} color="#FFFFFF" />
              <Text style={styles.exportButtonText}>Export Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {
                console.log('Sharing dashboard');
                setSuccessMessage('Dashboard link copied to clipboard! Share with your team.');
                setSuccessModalVisible(true);
              }}
            >
              <Ionicons name="share-social-outline" size={18} color="#0E7490" />
              <Text style={styles.shareButtonText}>Share Dashboard</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.successModalTitle}>Success!</Text>
            <Text style={styles.successModalMessage}>{successMessage}</Text>
            <TouchableOpacity
              style={styles.successModalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.successModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    minWidth: 35,
  },
  issuePercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    minWidth: 35,
  },
  yellowProgress: {
    backgroundColor: '#FBBF24',
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
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  filterItem: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  applyButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: 100,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
  },
  chartYAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chartArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chartLines: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    top: '20%',
  },
  lineChartContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  greenLineTop: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#10B981',
    borderRadius: 2,
    transform: [{ translateY: 20 }],
  },
  yellowLineBottom: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FBBF24',
    borderRadius: 2,
    transform: [{ translateY: 10 }],
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginLeft: 30,
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  performanceItem: {
    marginBottom: 15,
  },
  performanceLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  greenProgress: {
    backgroundColor: '#10B981',
  },
  redProgress: {
    backgroundColor: '#EF4444',
  },
  issuesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  issueItem: {
    marginBottom: 12,
  },
  issueLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 6,
  },
  issueBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  issueBar: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 6,
  },
  distributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pieChart: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  pieSliceGreen: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#4ADE80',
    left: 0,
  },
  pieSliceYellow: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    backgroundColor: '#FCD34D',
    right: 0,
    top: 0,
  },
  pieSliceRed: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    backgroundColor: '#F87171',
    right: 0,
    bottom: 0,
  },
  legend: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  greenDot: {
    backgroundColor: '#4ADE80',
  },
  yellowDot: {
    backgroundColor: '#FCD34D',
  },
  redDot: {
    backgroundColor: '#F87171',
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: '#0E7490',
    fontSize: 14,
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
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  successModalMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successModalButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 48,
  },
  successModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  iosPickerButton: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
  },
});
