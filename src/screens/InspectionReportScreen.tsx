import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Share,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InspectionFinding } from '../services/openaiService';
import { InspectionSession, PendingImage } from '../services/offlineStorageService';
import { inspectionService } from '../services';

interface InspectionReportScreenProps {
  navigation: any;
  route: any;
}

export default function InspectionReportScreen({ navigation, route }: InspectionReportScreenProps) {
  const { property, session, findings, images, complianceScore, overallCondition } = route.params || {};
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingFinding, setEditingFinding] = useState<InspectionFinding | null>(null);
  const [editedFindings, setEditedFindings] = useState<InspectionFinding[]>(findings || []);
  const [notes, setNotes] = useState(session?.notes || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAction, setEditAction] = useState('');

  const groupedFindings = editedFindings.reduce((acc, finding) => {
    const category = finding.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(finding);
    return acc;
  }, {} as Record<string, InspectionFinding[]>);

  const categoryLabels: Record<string, string> = {
    structural: 'Structural',
    electrical: 'Electrical',
    plumbing: 'Plumbing',
    safety: 'Safety',
    hvac: 'HVAC',
    exterior: 'Exterior',
    interior: 'Interior',
    appliances: 'Appliances',
    other: 'Other',
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'major': return '#F59E0B';
      case 'minor': return '#3B82F6';
      case 'observation': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getConditionColor = (condition: string): string => {
    switch (condition) {
      case 'Excellent': return '#10B981';
      case 'Good': return '#34D399';
      case 'Fair': return '#F59E0B';
      case 'Poor': return '#EF4444';
      case 'Critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleEditFinding = (finding: InspectionFinding) => {
    setEditingFinding(finding);
    setEditTitle(finding.title);
    setEditDescription(finding.description);
    setEditAction(finding.recommendedAction);
    setShowEditModal(true);
  };

  const saveEditedFinding = () => {
    if (!editingFinding) return;

    setEditedFindings(prev => prev.map(f => 
      f.id === editingFinding.id 
        ? { ...f, title: editTitle, description: editDescription, recommendedAction: editAction }
        : f
    ));
    setShowEditModal(false);
    setEditingFinding(null);
  };

  const handleDeleteFinding = (findingId: string) => {
    Alert.alert(
      'Delete Finding',
      'Are you sure you want to remove this finding from the report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEditedFindings(prev => prev.filter(f => f.id !== findingId));
          },
        },
      ]
    );
  };

  const handleSaveReport = async () => {
    setSaving(true);
    try {
      // Validate property exists
      if (!property?._id && !property?.id) {
        Alert.alert('Error', 'Property information is missing. Please go back and try again.');
        setSaving(false);
        return;
      }

      const propertyId = property._id || property.id;

      // Create the inspection with all required data
      const inspectionData = {
        property: propertyId,
        scheduledDate: new Date().toISOString(),
        inspectionType: 'NSPIRE',
        inspectionLevel: 'Standard',
        notes: notes || '',
      };

      const createResponse = await inspectionService.createInspection(inspectionData);
      
      // If creation successful, update with completion data
      if (createResponse.success && createResponse.inspection?._id) {
        try {
          await inspectionService.completeInspection(createResponse.inspection._id, {
            complianceScore: complianceScore || 0,
            findings: editedFindings.map(f => ({
              category: f.category,
              severity: f.severity,
              title: f.title,
              description: f.description,
              location: f.location,
              recommendedAction: f.recommendedAction,
            })),
            notes: notes || '',
          });
        } catch (completeError) {
          // If complete fails, try update instead
          console.log('Complete failed, trying update:', completeError);
          await inspectionService.updateInspection(createResponse.inspection._id, {
            status: 'completed',
            complianceScore: complianceScore || 0,
            findings: editedFindings.map(f => ({
              category: f.category,
              severity: f.severity,
              title: f.title,
              description: f.description,
              location: f.location,
              recommendedAction: f.recommendedAction,
            })),
            notes: notes || '',
          });
        }
      }
      
      setSaved(true);
      Alert.alert('Success', 'Inspection report saved successfully!');
    } catch (error: any) {
      console.error('Save report error:', error);
      Alert.alert('Error', error.message || 'Failed to save report. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShareReport = async () => {
    try {
      const criticalCount = editedFindings.filter(f => f.severity === 'critical').length;
      const majorCount = editedFindings.filter(f => f.severity === 'major').length;
      const minorCount = editedFindings.filter(f => f.severity === 'minor').length;

      const reportText = `
PROPERTY INSPECTION REPORT
==========================

Property: ${property?.name || 'Unknown'}
Address: ${property?.address || 'N/A'}
Date: ${new Date().toLocaleDateString()}

COMPLIANCE SCORE: ${complianceScore}%
OVERALL CONDITION: ${overallCondition}

SUMMARY
-------
Total Issues Found: ${editedFindings.length}
- Critical: ${criticalCount}
- Major: ${majorCount}
- Minor: ${minorCount}
- Observations: ${editedFindings.length - criticalCount - majorCount - minorCount}

FINDINGS BY CATEGORY
--------------------
${Object.entries(groupedFindings).map(([category, items]) => `
${categoryLabels[category] || category}:
${items.map(f => `  • [${f.severity.toUpperCase()}] ${f.title}: ${f.description}`).join('\n')}
`).join('')}

${notes ? `ADDITIONAL NOTES\n----------------\n${notes}` : ''}

Generated by INSPIRE AI Inspection System
      `.trim();

      await Share.share({
        message: reportText,
        title: `Inspection Report - ${property?.name}`,
      });
    } catch (error) {
      console.error('Error sharing report:', error);
    }
  };

  const handleFinishInspection = () => {
    if (!saved) {
      Alert.alert(
        'Unsaved Report',
        'Would you like to save the report before leaving?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.popToTop() },
          { text: 'Save First', onPress: handleSaveReport },
        ]
      );
    } else {
      navigation.popToTop();
    }
  };

  const renderFindingCard = (finding: InspectionFinding) => (
    <View key={finding.id} style={styles.findingCard}>
      <View style={styles.findingHeader}>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(finding.severity) }]}>
          <Text style={styles.severityText}>{finding.severity.toUpperCase()}</Text>
        </View>
        <View style={styles.findingActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditFinding(finding)}
          >
            <Ionicons name="pencil" size={16} color="#0E7490" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteFinding(finding.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.findingTitle}>{finding.title}</Text>
      <Text style={styles.findingDescription}>{finding.description}</Text>
      
      {finding.location && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text style={styles.locationText}>{finding.location}</Text>
        </View>
      )}
      
      {finding.recommendedAction && (
        <View style={styles.actionContainer}>
          <Ionicons name="build-outline" size={14} color="#0E7490" />
          <Text style={styles.actionText}>{finding.recommendedAction}</Text>
        </View>
      )}
      
      {finding.estimatedCost && (
        <View style={styles.costRow}>
          <Ionicons name="cash-outline" size={14} color="#10B981" />
          <Text style={styles.costText}>Est. Cost: {finding.estimatedCost}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Report</Text>
        <TouchableOpacity onPress={handleShareReport}>
          <Ionicons name="share-outline" size={24} color="#0E7490" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Property Info */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property?.name || 'Unknown Property'}</Text>
          <Text style={styles.propertyAddress}>{property?.address || 'No address'}</Text>
          <Text style={styles.reportDate}>
            Report Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Compliance Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{complianceScore}%</Text>
            <Text style={styles.scoreLabel}>Compliance</Text>
          </View>
          <View style={styles.conditionContainer}>
            <Text style={styles.conditionLabel}>Overall Condition</Text>
            <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(overallCondition) }]}>
              <Text style={styles.conditionText}>{overallCondition}</Text>
            </View>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{images?.length || 0}</Text>
              <Text style={styles.statLabel}>Images</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{editedFindings.length}</Text>
              <Text style={styles.statLabel}>Issues</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#DC2626' }]}>
                {editedFindings.filter(f => f.severity === 'critical').length}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {editedFindings.filter(f => f.severity === 'major').length}
              </Text>
              <Text style={styles.statLabel}>Major</Text>
            </View>
          </View>
        </View>

        {/* Findings by Category */}
        {Object.entries(groupedFindings).map(([category, categoryFindings]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {categoryLabels[category] || category}
              </Text>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{categoryFindings.length}</Text>
              </View>
            </View>
            {categoryFindings.map(finding => renderFindingCard(finding))}
          </View>
        ))}

        {editedFindings.length === 0 && (
          <View style={styles.noFindingsCard}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text style={styles.noFindingsTitle}>No Issues Found</Text>
            <Text style={styles.noFindingsText}>
              The property passed inspection with no deficiencies identified.
            </Text>
          </View>
        )}

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any additional notes or observations..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSaveReport}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {saved ? 'Saved ✓' : 'Save Report'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.finishButton}
            onPress={handleFinishInspection}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
            <Text style={styles.finishButtonText}>Finish Inspection</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Finding Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Finding</Text>
            
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Finding title"
              placeholderTextColor="#9CA3AF"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <Text style={styles.inputLabel}>Recommended Action</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              value={editAction}
              onChangeText={setEditAction}
              placeholder="Recommended action"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveEditButton}
                onPress={saveEditedFinding}
              >
                <Text style={styles.saveEditButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    borderWidth: 4,
    borderColor: '#0E7490',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0E7490',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  conditionContainer: {
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  conditionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  conditionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  categoryCount: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  categoryCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  findingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  findingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  findingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  findingDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 12,
    color: '#0E7490',
    marginLeft: 8,
    lineHeight: 16,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  noFindingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noFindingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  noFindingsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  finishButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  multilineInput: {
    minHeight: 80,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveEditButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
