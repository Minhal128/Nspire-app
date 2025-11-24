import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';

interface ManagementDashboardScreenProps {
  navigation: any;
}

export default function ManagementDashboardScreen({ navigation }: ManagementDashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
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
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };
  
  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };

  // Mock data
  const complianceScore = 82;
  const compliantCount = 10;
  const needsAttentionCount = 3;
  const nonCompliantCount = 1;

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
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Greeting */}
          <View style={styles.greetingContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.greetingText}>Hi, Joe</Text>
          </View>

          {/* My Properties Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="home" size={20} color="#1F2937" />
                <Text style={styles.sectionTitle}>My Properties</Text>
              </View>
              <TouchableOpacity 
                style={styles.addPropertyButton}
                onPress={() => navigation.navigate('AddProperty' as never)}
              >
                <Text style={styles.addPropertyText}>Add Property</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.propertyCard}>
              <Text style={styles.propertyName}>Sunset Apartments</Text>
              <Text style={styles.propertyLocation}>New York</Text>
              <Text style={styles.propertyUnits}>24 Units</Text>
              
              <View style={styles.propertyActions}>
                <TouchableOpacity 
                  style={styles.viewUnitsButton}
                  onPress={() => navigation.navigate('UnitInspection' as never)}
                >
                  <Text style={styles.viewUnitsText}>View Units</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.startInspectionButton}
                  onPress={() => navigation.navigate('InspectionChecklist' as never)}
                >
                  <Text style={styles.startInspectionText}>Start Inspection</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard' as never)}
            >
              <Text style={styles.viewAllLink}>View All Properties</Text>
            </TouchableOpacity>
          </View>

          {/* Inspections Overview Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Inspections Overview</Text>
              <TouchableOpacity 
                style={styles.startInspectionHeaderButton}
                onPress={() => navigation.navigate('InspectionChecklist' as never)}
              >
                <Text style={styles.startInspectionHeaderText}>Start New Inspection</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inspectionCard}>
              <Text style={styles.inspectionProperty}>Sunset Apartments / Unit 12</Text>
              <View style={styles.compliantBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.compliantText}>Compliant</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('MyInspections' as never)}
            >
              <Text style={styles.viewAllLink}>View All Inspections</Text>
            </TouchableOpacity>
          </View>

          {/* Compliance Snapshot Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compliance Snapshot</Text>

            {/* Circular Progress */}
            <View style={styles.complianceCircleContainer}>
              <View style={styles.circleBackground} />
              
              {/* Progress ring - Left half */}
              <View style={styles.progressLeftHalf}>
                <View style={[
                  styles.progressLeftFill,
                  complianceScore >= 50 && styles.progressLeftFillComplete,
                  complianceScore < 50 && {
                    transform: [{ rotate: `${(complianceScore / 50) * 180}deg` }]
                  }
                ]} />
              </View>
              
              {/* Progress ring - Right half */}
              {complianceScore > 50 && (
                <View style={styles.progressRightHalf}>
                  <View style={[
                    styles.progressRightFill,
                    { transform: [{ rotate: `${((complianceScore - 50) / 50) * 180}deg` }] }
                  ]} />
                </View>
              )}
              
              {/* Center text */}
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressPercentage}>{complianceScore}%</Text>
                <Text style={styles.progressLabel}>Compliant</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendLabel}>Compliant</Text>
                <Text style={styles.legendValue}>{compliantCount}</Text>
              </View>
              
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendLabel}>Needs Attention</Text>
                <Text style={styles.legendValue}>{needsAttentionCount}</Text>
              </View>
              
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendLabel}>Non-Compliant</Text>
                <Text style={styles.legendValue}>{nonCompliantCount}</Text>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View Full Report</Text>
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
    paddingBottom: 10,
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
  greetingContainer: {
    backgroundColor: '#0E7490',
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  addPropertyButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addPropertyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  viewAllLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    textAlign: 'left',
  },
  startInspectionHeaderButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  startInspectionHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inspectionCard: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  inspectionProperty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  compliantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compliantText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  complianceCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: '#E5E7EB',
  },
  progressLeftHalf: {
    position: 'absolute',
    width: 70,
    height: 140,
    overflow: 'hidden',
    left: 0,
  },
  progressLeftFill: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: '#10B981',
    borderLeftColor: '#10B981',
    transform: [{ rotate: '0deg' }],
  },
  progressLeftFillComplete: {
    transform: [{ rotate: '180deg' }],
  },
  progressRightHalf: {
    position: 'absolute',
    width: 70,
    height: 140,
    overflow: 'hidden',
    right: 0,
  },
  progressRightFill: {
    position: 'absolute',
    right: 0,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 12,
    borderColor: 'transparent',
    borderTopColor: '#10B981',
    borderRightColor: '#10B981',
    transform: [{ rotate: '0deg' }],
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendContainer: {
    gap: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
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
});
