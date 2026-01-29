import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Sidebar from '../components/Sidebar';
import { inspectionService, authService } from '../services';

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
  const [saving, setSaving] = useState(false);
  const { property, unit, inspection } = route.params || {};

  // State for inspection data
  const [complianceScore, setComplianceScore] = useState(inspection?.score || 88);
  const [totalItems, setTotalItems] = useState(inspection?.totalItems || 17);
  const [checkedItems, setCheckedItems] = useState(inspection?.checkedItems || 15);
  const [issuesRequireFollowUp, setIssuesRequireFollowUp] = useState(inspection?.issueCount || 2);
  const [photosAdded, setPhotosAdded] = useState(inspection?.photosCount || 5);

  const [issues, setIssues] = useState<Issue[]>(inspection?.issues || [
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
  ]);

  const [additionalNotes, setAdditionalNotes] = useState(
    inspection?.notes || "Overall condition is satisfactory. Minor maintenance is required."
  );

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = async (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Navigate to correct dashboard based on user role
      const storedUser = await authService.getStoredUser();
      const userRole = storedUser?.role || 'inspector';
      const dashboardRoute = authService.getDashboardRoute(userRole);
      navigation.navigate(dashboardRoute as never);
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

  const handleShareReport = () => {
    Alert.alert('Share Report', 'Report sharing will be available in a future update.');
  };

  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      const inspectionData = {
        property: property?._id,
        unit: unit?.id,
        scheduledDate: new Date().toISOString(),
        status: 'in-progress',
        score: complianceScore,
        totalItems,
        checkedItems,
        issues: issues.map(issue => ({
          title: issue.title,
          description: issue.description,
        })),
        notes: additionalNotes,
      };

      if (inspection?._id) {
        await inspectionService.updateInspection(inspection._id, inspectionData);
      } else {
        await inspectionService.createInspection(inspectionData);
      }

      Alert.alert('Success', 'Draft saved successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteInspection = async () => {
    try {
      setSaving(true);

      const inspectionData = {
        property: property?._id,
        unit: unit?.id,
        scheduledDate: new Date().toISOString(),
        status: 'completed',
        score: complianceScore,
        totalItems,
        checkedItems,
        issues: issues.map(issue => ({
          title: issue.title,
          description: issue.description,
        })),
        notes: additionalNotes,
        completedDate: new Date().toISOString(),
      };

      if (inspection?._id) {
        await inspectionService.completeInspection(inspection._id, {
          complianceScore: complianceScore,
          notes: additionalNotes,
        });
      } else {
        await inspectionService.createInspection(inspectionData);
      }

      Alert.alert('Success', 'Inspection completed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete inspection');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setSaving(true);
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #1F2937; }
              h1 { color: #0D6A8D; border-bottom: 2px solid #0D6A8D; padding-bottom: 10px; }
              .header { margin-bottom: 20px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #374151; }
              .score-box { background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; }
              .score { font-size: 36px; font-weight: bold; color: #10B981; }
              .issue { margin-bottom: 10px; padding-left: 20px; position: relative; }
              .issue:before { content: '•'; position: absolute; left: 0; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Inspection Report</h1>
              <p><strong>Property:</strong> ${property?.name || 'N/A'}</p>
              <p><strong>Unit:</strong> ${unit?.name || 'N/A'}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section">
              <div class="score-box">
                <div class="section-title">Compliance Score</div>
                <div class="score">${complianceScore}%</div>
                <p>Compliant</p>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Issues Found</div>
              ${issues.map(issue => `
                <div class="issue">
                  <strong>${issue.title}</strong><br/>
                  ${issue.description || 'No description provided'}
                </div>
              `).join('')}
            </div>

            <div class="section">
              <div class="section-title">Additional Notes</div>
              <p>${additionalNotes || 'No additional notes'}</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Inspection Report',
          UTI: 'com.adobe.pdf'
        });
      }
    } catch (error) {
      console.error('PDF Export error:', error);
      Alert.alert('Error', 'Failed to generate PDF report');
    } finally {
      setSaving(false);
    }
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
            <TouchableOpacity onPress={() => navigation.navigate("Notifications" as any)}>
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
                disabled={saving}
              >
                <Text style={styles.shareButtonText}>Share Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveDraftButton, saving && styles.buttonDisabled]}
                onPress={handleSaveDraft}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#1F2937" />
                ) : (
                  <Text style={styles.saveDraftButtonText}>Save Draft</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.completeButton, saving && styles.buttonDisabled]}
              onPress={handleCompleteInspection}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.completeButtonText}>Complete Inspection</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExportPDF}
              disabled={saving}
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
  completeButton: {
    backgroundColor: '#10B981',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: '#FFFFFF',
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
  buttonDisabled: {
    opacity: 0.6,
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
