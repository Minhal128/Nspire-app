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
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';
import { inspectionService, propertyService, authService } from '../services';
import { Inspection, Property } from '../services/api';
import { showIOSActionSheet, INSPECTION_STATUS_OPTIONS, DATE_RANGE_OPTIONS } from '../utils/iosPickerUtils';

interface ReportsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

interface Report {
  id: string;
  property: string;
  propertyId: string;
  unit: string;
  inspector: string;
  date: string;
  complianceScore: 'Compliant' | 'Non-Compliant';
  rawData: Inspection;
}

export default function ReportsScreen({ navigation, onMenuPress }: ReportsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<any>(null);

  // iOS Picker functions using ActionSheetIOS
  const showPropertyPicker = () => {
    const propertyOptions = properties.map(p => ({ label: p.name, value: p._id }));
    showIOSActionSheet('Select Property', propertyOptions, setSelectedProperty);
  };

  const showRangePicker = () => {
    showIOSActionSheet('Select Date Range', DATE_RANGE_OPTIONS, setSelectedRange);
  };

  const showStatusPicker = () => {
    showIOSActionSheet('Select Status', INSPECTION_STATUS_OPTIONS, setSelectedStatus);
  };

  const loadData = useCallback(async () => {
    try {
      const [inspectionsData, propertiesData] = await Promise.all([
        inspectionService.getInspections({ status: 'completed' }),
        propertyService.getProperties(),
      ]);

      // Map inspections to report format
      const mappedReports: Report[] = (inspectionsData.inspections || inspectionsData || []).map((inspection: Inspection) => {
        const property = (propertiesData.properties || propertiesData || []).find(
          (p: Property) => p._id === inspection.property || p._id === (inspection as any).propertyId
        );

        return {
          id: inspection._id,
          property: property?.name || 'Unknown Property',
          propertyId: inspection.property || (inspection as any).propertyId,
          unit: (inspection as any).unit || 'N/A',
          inspector: (inspection as any).inspector?.fullName || (inspection as any).inspectorName || 'Unknown',
          date: new Date(inspection.scheduledDate || (inspection as any).completedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          complianceScore: (inspection as any).complianceStatus === 'compliant' ||
            (inspection as any).score >= 70 ? 'Compliant' : 'Non-Compliant',
          rawData: inspection,
        };
      });

      setReports(mappedReports);
      setProperties(propertiesData.properties || propertiesData || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'Failed to load reports');
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
      // Already on Reports
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

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchText ||
      report.property.toLowerCase().includes(searchText.toLowerCase()) ||
      report.unit.toLowerCase().includes(searchText.toLowerCase()) ||
      report.inspector.toLowerCase().includes(searchText.toLowerCase());

    const matchesProperty = !propertyName || report.propertyId === propertyName;

    const matchesStatus = !status ||
      (status === 'compliant' && report.complianceScore === 'Compliant') ||
      (status === 'non-compliant' && report.complianceScore === 'Non-Compliant');

    // Date range filtering could be added here

    return matchesSearch && matchesProperty && matchesStatus;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading reports...</Text>
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
            <Text style={styles.title}>Inspection Reports</Text>
            <Text style={styles.subtitle}>View export and share your inspection reports.</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for property, unit or inspector name"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Filters */}
          <Text style={styles.filtersLabel}>Filters</Text>

          {/* Property Name Filter */}
          <View style={styles.filterRow}>
            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={showPropertyPicker}
                  >
                    <Text style={[styles.iosPickerText, !propertyName && { color: '#9CA3AF' }]}>
                      {propertyName ? properties.find(p => p._id === propertyName)?.name || propertyName : "Property Name"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={propertyName}
                    onValueChange={(itemValue: string) => setPropertyName(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Property Name" value="" />
                    {properties.map((property) => (
                      <Picker.Item key={property._id} label={property.name} value={property._id} />
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

            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={showRangePicker}
                  >
                    <Text style={[styles.iosPickerText, !dateRange && { color: '#9CA3AF' }]}>
                      {dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : "Data Range"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={dateRange}
                    onValueChange={(itemValue: string) => setDateRange(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Data Range" value="" />
                    <Picker.Item label="Last 7 days" value="7days" />
                    <Picker.Item label="Last 30 days" value="30days" />
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

          {/* Status Filter */}
          <View style={styles.filterRow}>
            <View style={styles.filterItemFull}>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={showStatusPicker}
                  >
                    <Text style={[styles.iosPickerText, !status && { color: '#9CA3AF' }]}>
                      {status === 'compliant' ? 'Compliant' : status === 'non-compliant' ? 'Non-Compliant' : "Status"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue: string) => setStatus(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Status" value="" />
                    <Picker.Item label="Compliant" value="compliant" />
                    <Picker.Item label="Non-Compliant" value="non-compliant" />
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

          {/* Reports List */}
          <View style={styles.reportsList}>
            {filteredReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>No reports found</Text>
              </View>
            ) : (
              filteredReports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Property</Text>
                    <Text style={styles.reportValue}>{report.property}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Unit</Text>
                    <Text style={styles.reportValue}>{report.unit}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Inspector</Text>
                    <Text style={styles.reportValue}>{report.inspector}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Date</Text>
                    <Text style={styles.reportValue}>{report.date}</Text>
                  </View>
                  <View style={styles.reportRow}>
                    <Text style={styles.reportLabel}>Compliance{'\n'}Score</Text>
                    <View style={styles.complianceContainer}>
                      <View style={[
                        styles.complianceDot,
                        report.complianceScore === 'Compliant' ? styles.compliantDot : styles.nonCompliantDot
                      ]} />
                      <Text style={styles.complianceText}>{report.complianceScore}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => navigation.navigate('ReportDetail' as never, { report } as never)}
                    >
                      <Ionicons name="document-text-outline" size={24} color="#0E7490" />
                      <Text style={styles.iconButtonLabel}>View Report</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => console.log('Share report:', report.property)}
                    >
                      <Ionicons name="share-social-outline" size={24} color="#0E7490" />
                      <Text style={styles.iconButtonLabel}>Share</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#CEF8FF',
  },
  headerContainer: {
    backgroundColor: '#CEF8FF',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#374151',
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  filterItemFull: {
    width: '100%',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  reportsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reportValue: {
    fontSize: 14,
    color: '#374151',
  },
  complianceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complianceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  compliantDot: {
    backgroundColor: '#10B981',
  },
  nonCompliantDot: {
    backgroundColor: '#EF4444',
  },
  complianceText: {
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  iconButton: {
    padding: 4,
    alignItems: 'center',
    gap: 4,
  },
  iconButtonLabel: {
    fontSize: 11,
    color: '#0E7490',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  doneButton: {
    padding: 4,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#0E7490',
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
  pickerWrapper: {
    height: 250,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iosPicker: {
    height: 250,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
});
