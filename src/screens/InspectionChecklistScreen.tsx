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

interface InspectionChecklistScreenProps {
  navigation: any;
  route: any;
}

interface Issue {
  id: string;
  title: string;
  description: string;
}

export default function InspectionChecklistScreen({ navigation, route }: InspectionChecklistScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { property, unit } = route.params || {};
  
  // Mock data
  const complianceScore = 88;
  const totalItems = 17;
  const checkedItems = 15;
  const issuesRequireFollowUp = 2;
  const photosAdded = 5;
  
  const issues: Issue[] = [
    {
      id: '1',
      title: 'Smoke Detector',
      description: 'Battery Missing - Needs Replacement'
    },
    {
      id: '2',
      title: 'Faucet Leak - Needs Attention',
      description: ''
    }
  ];
  
  const additionalNotes = "Overall condition is satisfactory. Minor maintenance is required.";

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

  const handleShareReport = () => {
    console.log('Sharing report...');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...');
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
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
          {/* Title */}
          <Text style={styles.title}>Inspection – {unit?.name || 'Unit 101'}</Text>

          {/* Property Info with Status */}
          <View style={styles.propertyInfoCard}>
            <Text style={styles.propertyLabel}>Property: {property?.name || 'Sunset Apartments'}</Text>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.statusText}>Compliant</Text>
            </View>
          </View>

          {/* Compliance Score Card */}
          <View style={styles.complianceCard}>
            <Text style={styles.cardTitle}>Compliance Score</Text>
            
            {/* Circular Progress */}
            <View style={styles.circularProgressContainer}>
              {/* Background ring */}
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

            {/* Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.statText}>{checkedItems} Of {totalItems} Of Items Checked</Text>
              <Text style={styles.statText}>{issuesRequireFollowUp} Issues Require Follow-Up</Text>
              <Text style={styles.statText}>{photosAdded} Photos Added</Text>
            </View>
          </View>

          {/* Issues Found Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Issues Found</Text>
            <View style={styles.issuesList}>
              {issues.map((issue) => (
                <View key={issue.id} style={styles.issueItem}>
                  <View style={styles.issueIcon}>
                    <View style={styles.issueDot} />
                  </View>
                  <View style={styles.issueContent}>
                    <Text style={styles.issueTitle}>{issue.title}</Text>
                    {issue.description ? (
                      <Text style={styles.issueDescription}>{issue.description}</Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Additional Notes Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{additionalNotes}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.topButtonsRow}>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShareReport}
              >
                <Text style={styles.shareButtonText}>Share Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveDraftButton}
                onPress={handleSaveDraft}
              >
                <Text style={styles.saveDraftButtonText}>Save Draft</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleExportPDF}
            >
              <Text style={styles.exportButtonText}>Export PDF</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  propertyInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  complianceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 140,
    height: 140,
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
  statsContainer: {
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  issuesList: {
    gap: 12,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  issueIcon: {
    paddingTop: 4,
  },
  issueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  issueDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtonsContainer: {
    paddingHorizontal: 20,
  },
  topButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  saveDraftButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveDraftButtonText: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '700',
  },
  exportButton: {
    backgroundColor: '#0E7490',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
