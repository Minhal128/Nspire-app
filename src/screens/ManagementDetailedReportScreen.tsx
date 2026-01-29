import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySeverity,
  SEVERITY_COLORS,
} from '../types/nspireReport';

interface ManagementDetailedReportScreenProps {
  navigation: any;
  route: any;
}

export default function ManagementDetailedReportScreen({ navigation, route }: ManagementDetailedReportScreenProps) {
  const { report } = route.params || {};
  const [loading, setLoading] = useState(false);

  const getSeverityColor = (severity: DeficiencySeverity): string => {
    return SEVERITY_COLORS[severity] || Colors.neutral.gray500;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.neutral.white} />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Deficiency Detailed Report</Text>
        {report && (
          <Text style={styles.headerSubtitle}>{report.metadata.inspectionNo}</Text>
        )}
      </View>
    </View>
  );

  const renderDeficiencyTable = () => {
    if (!report || !report.deficiencies || report.deficiencies.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.status.success} />
          <Text style={styles.emptyStateTitle}>No Deficiencies Found</Text>
          <Text style={styles.emptyStateText}>
            This property passed inspection with no issues identified.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          {/* Table Header - EXACT SAME AS PDF */}
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, { width: 110 }]}>
              <Text style={styles.headerText}>Deficiency Picture</Text>
            </View>
            <View style={[styles.headerCell, { width: 100 }]}>
              <Text style={styles.headerText}>Location</Text>
            </View>
            <View style={[styles.headerCell, { width: 130 }]}>
              <Text style={styles.headerText}>Deficiency Name</Text>
            </View>
            <View style={[styles.headerCell, { width: 180 }]}>
              <Text style={styles.headerText}>Deficiency Details</Text>
            </View>
            <View style={[styles.headerCell, { width: 140 }]}>
              <Text style={styles.headerText}>Comments</Text>
            </View>
            <View style={[styles.headerCell, { width: 80 }]}>
              <Text style={styles.headerText}>Deduction Pts</Text>
            </View>
            <View style={[styles.headerCell, { width: 60 }]}>
              <Text style={styles.headerText}>Repeat</Text>
            </View>
            <View style={[styles.headerCell, { width: 90 }]}>
              <Text style={styles.headerText}>Severity</Text>
            </View>
          </View>

          {/* Table Rows - EXACT SAME AS PDF */}
          {report.deficiencies.map((deficiency, index) => (
            <View key={deficiency.id} style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
              {/* Deficiency Picture */}
              <View style={[styles.cell, { width: 110 }]}>
                {deficiency.imageUri ? (
                  <Image
                    source={{ uri: deficiency.imageUri }}
                    style={styles.deficiencyImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={20} color={Colors.neutral.gray400} />
                    <Text style={styles.imagePlaceholderText}>No Image</Text>
                  </View>
                )}
              </View>

              {/* Location */}
              <View style={[styles.cell, { width: 100 }]}>
                <View style={styles.locationInfo}>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Building:</Text>
                    <Text style={styles.locationValue}>{deficiency.building}</Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Unit:</Text>
                    <Text style={styles.locationValue}>{deficiency.unit}</Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Room:</Text>
                    <Text style={styles.locationValue}>{deficiency.room}</Text>
                  </View>
                  <View style={styles.locationItem}>
                    <Text style={styles.locationLabel}>Area:</Text>
                    <Text style={styles.locationValue}>{deficiency.area}</Text>
                  </View>
                </View>
              </View>

              {/* Deficiency Name */}
              <View style={[styles.cell, { width: 130 }]}>
                <Text style={styles.deficiencyName}>{deficiency.deficiencyName}</Text>
                <View style={styles.nspireCodeBadge}>
                  <Text style={styles.nspireCodeText}>{deficiency.nspireCode}</Text>
                </View>
              </View>

              {/* Deficiency Details */}
              <View style={[styles.cell, { width: 180 }]}>
                <Text style={styles.cellText}>{deficiency.deficiencyDetails}</Text>
              </View>

              {/* Comments */}
              <View style={[styles.cell, { width: 140 }]}>
                <Text style={[styles.cellText, styles.commentsText]}>{deficiency.comments || '-'}</Text>
              </View>

              {/* Deduction Points */}
              <View style={[styles.cell, { width: 80 }]}>
                <Text style={[styles.cellText, styles.deductionText]}>-{deficiency.deductionPts}</Text>
              </View>

              {/* Repeat */}
              <View style={[styles.cell, { width: 60 }]}>
                <View style={deficiency.repeatIndicator ? styles.repeatYes : styles.repeatNo}>
                  <Text style={deficiency.repeatIndicator ? styles.repeatYesText : styles.repeatNoText}>
                    {deficiency.repeatIndicator ? 'YES' : 'NO'}
                  </Text>
                </View>
              </View>

              {/* Severity */}
              <View style={[styles.cell, { width: 90 }]}>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(deficiency.severity) }]}>
                  <Text style={styles.severityText}>{deficiency.severity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => {
          // Print functionality
          Alert.alert('Print', 'Print functionality will be implemented');
        }}
        disabled={loading}
      >
        <Ionicons name="print-outline" size={20} color={Colors.primary.teal} />
        <Text style={styles.secondaryButtonText}>Print</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => {
          // Save functionality
          Alert.alert('Save', 'Save functionality will be implemented');
        }}
        disabled={loading}
      >
        <Ionicons name="download-outline" size={20} color={Colors.primary.teal} />
        <Text style={styles.secondaryButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => {
          // Export PDF functionality
          Alert.alert('Export PDF', 'Export PDF functionality will be implemented');
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.neutral.white} />
        ) : (
          <>
            <Ionicons name="share-outline" size={20} color={Colors.neutral.white} />
            <Text style={styles.primaryButtonText}>Export PDF</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (!report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.teal} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderDeficiencyTable()}
      </ScrollView>
      {renderActionButtons()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.neutral.gray600,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.teal,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.neutral.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.neutral.white,
    opacity: 0.8,
  },

  // Content
  content: {
    flex: 1,
    padding: 16,
  },

  // Table
  tableContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.teal,
  },
  headerCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.primary.teal,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.neutral.white,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  evenRow: {
    backgroundColor: Colors.neutral.gray50,
  },
  cell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: Colors.neutral.gray200,
    justifyContent: 'flex-start',
  },
  cellText: {
    fontSize: 9,
    color: Colors.neutral.gray700,
    lineHeight: 12,
  },

  // Deficiency Image
  deficiencyImage: {
    width: 80,
    height: 60,
    borderRadius: 4,
    backgroundColor: Colors.neutral.gray200,
  },
  imagePlaceholder: {
    width: 80,
    height: 60,
    borderRadius: 4,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 8,
    color: Colors.neutral.gray400,
    marginTop: 2,
    textAlign: 'center',
  },

  // Location
  locationInfo: {
    gap: 2,
  },
  locationItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationLabel: {
    fontSize: 8,
    color: Colors.neutral.gray500,
    width: 35,
  },
  locationValue: {
    fontSize: 8,
    fontWeight: '500',
    color: Colors.neutral.gray700,
    flex: 1,
  },

  // Deficiency Name
  deficiencyName: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.neutral.gray800,
    marginBottom: 4,
    lineHeight: 12,
  },
  nspireCodeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  nspireCodeText: {
    fontSize: 7,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Comments
  commentsText: {
    fontStyle: 'italic',
    color: Colors.neutral.gray600,
  },

  // Deduction
  deductionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#DC2626',
  },

  // Repeat
  repeatYes: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'center',
  },
  repeatNo: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'center',
  },
  repeatYesText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
  },
  repeatNoText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#065F46',
    textAlign: 'center',
  },

  // Severity
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'center',
  },
  severityText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: Colors.neutral.white,
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.status.success,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.neutral.gray500,
    textAlign: 'center',
    marginTop: 8,
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: Colors.primary.teal,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.white,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.teal,
  },
});