import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';

interface ReportsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

interface Report {
  id: string;
  property: string;
  unit: string;
  inspector: string;
  date: string;
  complianceScore: 'Compliant' | 'Non-Compliant';
}

export default function ReportsScreen({ navigation, onMenuPress }: ReportsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [status, setStatus] = useState('');
  
  const handleMenuPress = () => {
    setSidebarVisible(true);
  };
  
  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('Dashboard' as never);
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
  
  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };

  const reports: Report[] = [
    {
      id: '1',
      property: 'Sunset Apartments',
      unit: 'Unit 101',
      inspector: 'John Doe',
      date: 'Oct 5',
      complianceScore: 'Compliant'
    },
    {
      id: '2',
      property: 'River Heights',
      unit: 'Unit 5A',
      inspector: 'Jane Doe',
      date: 'Oct 3',
      complianceScore: 'Non-Compliant'
    }
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              <Picker
                selectedValue={propertyName}
                onValueChange={(itemValue: string) => setPropertyName(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Property Name" value="" />
                <Picker.Item label="Sunset Apartments" value="sunset" />
                <Picker.Item label="River Heights" value="river" />
              </Picker>
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
              <Picker
                selectedValue={dateRange}
                onValueChange={(itemValue: string) => setDateRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Data Range" value="" />
                <Picker.Item label="Last 7 days" value="7days" />
                <Picker.Item label="Last 30 days" value="30days" />
              </Picker>
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
              <Picker
                selectedValue={status}
                onValueChange={(itemValue: string) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Status" value="" />
                <Picker.Item label="Compliant" value="compliant" />
                <Picker.Item label="Non-Compliant" value="non-compliant" />
              </Picker>
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
          {reports.map((report) => (
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
    paddingVertical: 12,
    marginTop: 15,
  },
  headerLogo: {
    width: 180,
    height: 50,
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
});
