import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface ReportDetailScreenProps {
  navigation: any;
  route?: any;
}

export default function ReportDetailScreen({ navigation, route }: ReportDetailScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const routeReport = route?.params?.report || {};
  
  // Extract and provide defaults for all fields
  const report = {
    property: routeReport.property || 'Unknown Property',
    unit: routeReport.unit || 'All Units',
    inspector: routeReport.inspector || 'Unknown',
    date: routeReport.date || new Date().toLocaleDateString(),
    complianceScore: routeReport.complianceScore || 'Paid',
    propertyId: routeReport.propertyId || 'N/A',
    inspectionType: routeReport.inspectionType || 'INSPIRE Inspection',
    totalDeficiencies: routeReport.totalDeficiencies ?? 0,
    criticalDeficiencies: routeReport.criticalDeficiencies ?? 0,
    notes: routeReport.notes || 'No notes available.',
    rawData: routeReport.rawData || null,
  };

  const handleShare = async () => {
    try {
      const shareMessage = `
INSPIRE Inspection Report

Property: ${report.property}
Property ID: ${report.propertyId}
Unit: ${report.unit}
Inspector: ${report.inspector}
Date: ${report.date}
Compliance: ${report.complianceScore}

Deficiencies Summary:
- Total: ${report.totalDeficiencies}
- Critical: ${report.criticalDeficiencies}

Notes: ${report.notes}
      `.trim();

      await Share.share({
        message: shareMessage,
        title: `Inspection Report - ${report.property}`,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share report');
    }
  };

  const generatePdfHtml = () => {
    const complianceColor = report.complianceScore === 'Paid' ? '#10B981' : '#EF4444';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Inspection Report</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              padding: 40px;
              color: #1F2937;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0E7490;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #0E7490;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #6B7280;
              margin: 5px 0 0;
            }
            .compliance-badge {
              display: inline-block;
              background-color: ${complianceColor};
              color: white;
              padding: 12px 30px;
              border-radius: 8px;
              font-size: 20px;
              font-weight: bold;
              margin: 20px 0;
            }
            .section {
              margin: 25px 0;
              background: #F9FAFB;
              padding: 20px;
              border-radius: 8px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 15px;
              border-bottom: 1px solid #E5E7EB;
              padding-bottom: 10px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #E5E7EB;
            }
            .detail-label {
              font-weight: 600;
              color: #6B7280;
            }
            .detail-value {
              font-weight: 600;
              color: #1F2937;
            }
            .summary-grid {
              display: flex;
              justify-content: space-around;
              text-align: center;
              margin-top: 15px;
            }
            .summary-item {
              flex: 1;
            }
            .summary-number {
              font-size: 36px;
              font-weight: bold;
            }
            .summary-number.green { color: #10B981; }
            .summary-number.red { color: #EF4444; }
            .summary-label {
              color: #6B7280;
              font-size: 14px;
            }
            .notes-text {
              color: #374151;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #9CA3AF;
              font-size: 12px;
              border-top: 1px solid #E5E7EB;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INSPIRE Inspection Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <div class="compliance-badge">${report.complianceScore}</div>
          </div>

          <div class="section">
            <div class="section-title">Inspection Details</div>
            <div class="detail-row">
              <span class="detail-label">Property</span>
              <span class="detail-value">${report.property}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Property ID</span>
              <span class="detail-value">${report.propertyId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Unit</span>
              <span class="detail-value">${report.unit}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Inspector</span>
              <span class="detail-value">${report.inspector}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Inspection Date</span>
              <span class="detail-value">${report.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Inspection Type</span>
              <span class="detail-value">${report.inspectionType}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Deficiencies Summary</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-number green">${report.totalDeficiencies}</div>
                <div class="summary-label">Total Deficiencies</div>
              </div>
              <div class="summary-item">
                <div class="summary-number red">${report.criticalDeficiencies}</div>
                <div class="summary-label">Critical</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Inspector Notes</div>
            <p class="notes-text">${report.notes}</p>
          </div>

          <div class="footer">
            <p>This report was generated by the INSPIRE Inspection System</p>
            <p>© ${new Date().getFullYear()} INSPIRE. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Generate PDF from HTML
      const html = generatePdfHtml();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Inspection Report',
          UTI: 'com.adobe.pdf',
        });
        Alert.alert('Success', 'PDF report generated successfully!');
      } else {
        Alert.alert('Success', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const html = generatePdfHtml();
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Error', 'Failed to print report');
    }
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
          report.complianceScore === 'Paid' ? styles.compliantBanner : styles.nonCompliantBanner
        ]}>
          <Ionicons 
            name={report.complianceScore === 'Paid' ? "checkmark-circle" : "alert-circle"} 
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
            style={[styles.downloadButton, downloading && styles.buttonDisabled]}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.downloadButtonText}>
              {downloading ? 'Generating...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.printButton}
            onPress={handlePrint}
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
  buttonDisabled: {
    opacity: 0.6,
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
