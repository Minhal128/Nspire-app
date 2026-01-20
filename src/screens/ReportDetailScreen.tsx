import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReportDetailScreenProps {
  navigation: any;
  route?: any;
}

export default function ReportDetailScreen({ navigation, route }: ReportDetailScreenProps) {
  const routeReport = route?.params?.report || {};
  
  // Extract and provide defaults for all fields
  const report = {
    property: routeReport.property || 'Unknown Property',
    unit: routeReport.unit || 'All Units',
    inspector: routeReport.inspector || 'Unknown',
    date: routeReport.date || new Date().toLocaleDateString(),
    complianceScore: routeReport.complianceScore || 'Compliant',
    propertyId: routeReport.propertyId || 'N/A',
    inspectionType: routeReport.inspectionType || 'INSPIRE Inspection',
    totalDeficiencies: routeReport.totalDeficiencies ?? 0,
    criticalDeficiencies: routeReport.criticalDeficiencies ?? 0,
    notes: routeReport.notes || 'No notes available.',
    rawData: routeReport.rawData || null,
  };

  const handleShare = () => {
    Alert.alert('Share Report', 'Report sharing will be available in a future update.');
  };

  const handleDownload = () => {
    Alert.alert('Download Report', 'PDF download will be available in a future update.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Report</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Compliance Badge */}
        <View style={[
          styles.complianceBanner,
          report.complianceScore === 'Compliant' ? styles.compliantBanner : styles.nonCompliantBanner
        ]}>
          <Ionicons 
            name={report.complianceScore === 'Compliant' ? "checkmark-circle" : "alert-circle"} 
            size={32} 
            color="#FFFFFF" 
          />
          <Text style={styles.complianceBannerText}>{report.complianceScore}</Text>
        </View>

        {/* Report Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspection Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Property</Text>
            <Text style={styles.detailValue}>{report.property}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Property ID</Text>
            <Text style={styles.detailValue}>{report.propertyId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Unit</Text>
            <Text style={styles.detailValue}>{report.unit}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspector</Text>
            <Text style={styles.detailValue}>{report.inspector}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspection Date</Text>
            <Text style={styles.detailValue}>{report.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Inspection Type</Text>
            <Text style={styles.detailValue}>{report.inspectionType}</Text>
          </View>
        </View>

        {/* Deficiencies Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Deficiencies Summary</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{report.totalDeficiencies}</Text>
              <Text style={styles.summaryLabel}>Total Deficiencies</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, styles.criticalNumber]}>{report.criticalDeficiencies}</Text>
              <Text style={styles.summaryLabel}>Critical</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Inspector Notes</Text>
          <Text style={styles.notesText}>{report.notes}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.printButton}
            onPress={() => console.log('Print report')}
          >
            <Ionicons name="print-outline" size={20} color="#0E7490" />
            <Text style={styles.printButtonText}>Print Report</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  complianceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    gap: 12,
  },
  compliantBanner: {
    backgroundColor: '#10B981',
  },
  nonCompliantBanner: {
    backgroundColor: '#EF4444',
  },
  complianceBannerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  criticalNumber: {
    color: '#EF4444',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  printButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#0E7490',
    gap: 8,
  },
  printButtonText: {
    color: '#0E7490',
    fontSize: 15,
    fontWeight: '600',
  },
});
