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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';
import IOSPickerModal from '../components/IOSPickerModal';
import { inspectionService, propertyService, authService } from '../services';
import { Inspection, Property } from '../services/api';

// Status options for picker
const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
];

// Date range options for picker
const DATE_RANGE_OPTIONS = [
  { label: 'All Time', value: '' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
];

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
  complianceScore: 'Paid' | 'Unpaid';
  inspectionType: string;
  totalDeficiencies: number;
  criticalDeficiencies: number;
  notes: string;
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

  // iOS Picker Modal visibility states
  const [propertyPickerVisible, setPropertyPickerVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);

  // Get property options for picker
  const getPropertyOptions = () => {
    const options = [{ label: 'All Properties', value: '' }];
    properties.forEach(p => {
      options.push({ label: p.name, value: p._id });
    });
    return options;
  };

  const loadData = useCallback(async () => {
    try {
      // Load user data
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);

      let inspectionsData: any = { inspections: [] };
      let propertiesData: any = { properties: [] };

      // Try to load inspections - handle errors gracefully
      try {
        inspectionsData = await inspectionService.getInspections({ status: 'completed' });
      } catch (inspErr) {
        console.log('Could not load inspections:', inspErr);
        // Continue with empty inspections
      }

      // Try to load properties - handle errors gracefully
      try {
        propertiesData = await propertyService.getProperties();
      } catch (propErr) {
        console.log('Could not load properties:', propErr);
        // Continue with empty properties
      }

      console.log('Reports - Loaded inspections:', (inspectionsData.inspections || []).length);

      // Map inspections to report format
      const mappedReports: Report[] = (inspectionsData.inspections || inspectionsData || []).map((inspection: Inspection) => {
        // Debug log each inspection
        console.log('Mapping inspection:', JSON.stringify({
          id: inspection._id,
          findings: (inspection as any).findings?.length || 0,
          deficiencies: (inspection as any).deficiencies?.length || 0,
          notes: (inspection as any).notes,
          inspectionType: (inspection as any).inspectionType,
        }));

        // Handle property as either populated object or string ID
        const propertyId = typeof inspection.property === 'object' 
          ? (inspection.property as any)?._id 
          : inspection.property;
        
        const property = (propertiesData.properties || propertiesData || []).find(
          (p: Property) => p._id === propertyId
        );

        // Get compliance score - check complianceScore field first
        const score = (inspection as any).complianceScore || (inspection as any).score || 0;
        const isCompliant = (inspection as any).result === 'compliant' || (inspection as any).complianceStatus === 'compliant' || score >= 70;

        // Get findings/deficiencies data
        const findings = (inspection as any).findings || (inspection as any).deficiencies || [];
        const totalDeficiencies = findings.length;
        const criticalDeficiencies = findings.filter((f: any) => 
          f.severity === 'critical' || f.severity === 'life-threatening' || f.severity === 'severe'
        ).length;

        return {
          id: inspection._id,
          property: typeof inspection.property === 'object' 
            ? (inspection.property as any)?.name 
            : (property?.name || 'Unknown Property'),
          propertyId: propertyId || '',
          unit: (inspection as any).unit || 'All Units',
          inspector: (inspection as any).inspector?.fullName || (inspection as any).inspectorName || storedUser?.fullName || 'Unknown',
          date: new Date(inspection.completedDate || inspection.scheduledDate || (inspection as any).createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          complianceScore: isCompliant ? 'Paid' : 'Unpaid',
          inspectionType: (inspection as any).inspectionType || 'INSPIRE Inspection',
          totalDeficiencies,
          criticalDeficiencies,
          notes: (inspection as any).notes || 'No notes available.',
          rawData: inspection,
        };
      });

      // Sort by date (newest first)
      mappedReports.sort((a, b) => {
        const dateA = new Date(a.rawData.completedDate || a.rawData.scheduledDate || (a.rawData as any).createdAt);
        const dateB = new Date(b.rawData.completedDate || b.rawData.scheduledDate || (b.rawData as any).createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setReports(mappedReports);
      setProperties(propertiesData.properties || propertiesData || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      // Don't show alert, just log and show empty state
      setReports([]);
      setProperties([]);
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
      (status === 'paid' && report.complianceScore === 'Paid') ||
      (status === 'unpaid' && report.complianceScore === 'Unpaid');

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
                    onPress={() => setPropertyPickerVisible(true)}
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
                    onPress={() => setDateRangePickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !dateRange && { color: '#9CA3AF' }]}>
                      {dateRange === '7days' ? 'Last 7 days' : dateRange === '30days' ? 'Last 30 days' : dateRange === '90days' ? 'Last 90 days' : "Date Range"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={dateRange}
                    onValueChange={(itemValue: string) => setDateRange(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Date Range" value="" />
                    <Picker.Item label="Last 7 days" value="7days" />
                    <Picker.Item label="Last 30 days" value="30days" />
                    <Picker.Item label="Last 90 days" value="90days" />
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
                    onPress={() => setStatusPickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !status && { color: '#9CA3AF' }]}>
                      {status === 'paid' ? 'Paid' : status === 'unpaid' ? 'Unpaid' : "Status"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue: string) => setStatus(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Status" value="" />
                    <Picker.Item label="Paid" value="paid" />
                    <Picker.Item label="Unpaid" value="unpaid" />
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
                    <Text style={styles.reportLabel}>Payment{'\n'}Status</Text>
                    <View style={styles.complianceContainer}>
                      <View style={[
                        styles.complianceDot,
                        report.complianceScore === 'Paid' ? styles.compliantDot : styles.nonCompliantDot
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

      {/* iOS Picker Modals */}
      <IOSPickerModal
        visible={propertyPickerVisible}
        title="Select Property"
        options={getPropertyOptions()}
        selectedValue={propertyName}
        onSelect={setPropertyName}
        onClose={() => setPropertyPickerVisible(false)}
      />
      <IOSPickerModal
        visible={dateRangePickerVisible}
        title="Select Date Range"
        options={DATE_RANGE_OPTIONS}
        selectedValue={dateRange}
        onSelect={setDateRange}
        onClose={() => setDateRangePickerVisible(false)}
      />
      <IOSPickerModal
        visible={statusPickerVisible}
        title="Select Status"
        options={STATUS_OPTIONS}
        selectedValue={status}
        onSelect={setStatus}
        onClose={() => setStatusPickerVisible(false)}
      />
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
