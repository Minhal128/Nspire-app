import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';

interface AnalyticsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

export default function AnalyticsScreen({ navigation, onMenuPress }: AnalyticsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [property, setProperty] = useState('');
  const [timePeriod, setTimePeriod] = useState('');

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
      navigation.navigate('Reports' as never);
    } else if (screen === 'Analytics') {
      // Already on Analytics
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };

  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
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
                  <Picker
                    selectedValue={property}
                    onValueChange={(itemValue: string) => setProperty(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Property" value="" />
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

              <View style={styles.filterItem}>
                <View style={styles.pickerContainer}>
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
                  <Ionicons 
                    name="chevron-down" 
                    size={18} 
                    color="#6B7280" 
                    style={styles.pickerIcon}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.applyButton}>
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
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>Sunset Apartments</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, styles.greenProgress, { width: '85%' }]} />
              </View>
            </View>

            <View style={styles.performanceItem}>
              <Text style={styles.performanceLabel}>River Heights</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, styles.redProgress, { width: '45%' }]} />
              </View>
            </View>
          </View>

          {/* Common Issues */}
          <View style={styles.issuesCard}>
            <Text style={styles.cardTitle}>Common Issues</Text>
            
            <View style={styles.issueItem}>
              <Text style={styles.issueLabel}>Electrical</Text>
              <View style={styles.issueBarContainer}>
                <View style={[styles.issueBar, { width: '65%' }]} />
              </View>
            </View>

            <View style={styles.issueItem}>
              <Text style={styles.issueLabel}>Plumbing</Text>
              <View style={styles.issueBarContainer}>
                <View style={[styles.issueBar, { width: '85%' }]} />
              </View>
            </View>

            <View style={styles.issueItem}>
              <Text style={styles.issueLabel}>Fire Safety</Text>
              <View style={styles.issueBarContainer}>
                <View style={[styles.issueBar, { width: '50%' }]} />
              </View>
            </View>

            <View style={styles.issueItem}>
              <Text style={styles.issueLabel}>Doors/Windows</Text>
              <View style={styles.issueBarContainer}>
                <View style={[styles.issueBar, { width: '55%' }]} />
              </View>
            </View>
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
                <Text style={styles.legendText}>Compliant</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.yellowDot]} />
                <Text style={styles.legendText}>Needs Attention</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.redDot]} />
                <Text style={styles.legendText}>Non-Compliant</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Export Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Dashboard</Text>
            </TouchableOpacity>
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
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  picker: {
    height: 45,
    color: '#1F2937',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 13,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#1F2937',
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
});
