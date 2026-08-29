import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import {
  propertyService,
  inspectionService,
  authService,
} from '../services';
import { generateNSPIREReport } from '../utils/nspireReportUtils';
import {
  calculatePropertyProgressPercent,
  countUniqueDeficiencies,
} from '../utils/inspectionProgressUtils';
import { exportNspireExcel } from '../utils/nspireExcelExport';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';
import { stripeService } from '../utils/stripeService';
import { usePaymentLink } from '../hooks/usePaymentLink';

interface InspectionStatusScreenProps {
  navigation: any;
}

interface PropertyWithInspection {
  _id: string;
  propertyId?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  buildings?: number;
  units?: number;
  calculatedUnits?: number;
  buildingDetails?: { buildingId: string; totalUnits: number; unitsForInspection: number }[];
  inspection?: any;
  hasInspection: boolean;
  isUnlocked: boolean;
}

const safeFileName = (name: string) =>
  `NSPIRE_Report_${String(name || 'Property').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}`;

export default function InspectionStatusScreen({ navigation }: InspectionStatusScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<PropertyWithInspection[]>([]);
  const [propertyProgress, setPropertyProgress] = useState<Record<string, number>>({});
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  // The property whose report is being unlocked — also drives the payment modal.
  const [payFor, setPayFor] = useState<PropertyWithInspection | null>(null);

  // Percentage of inspection tasks completed per property (same heuristic as web)
  const fetchProgress = async (propertyList: any[]): Promise<Record<string, number>> => {
    try {
      const response = await inspectionService.getAllProgress();
      if (!response.success || !Array.isArray(response.progress)) return {};

      const progressMap: Record<string, number> = {};
      propertyList.forEach((prop: any) => {
        progressMap[prop._id] = calculatePropertyProgressPercent(prop, response.progress);
      });
      return progressMap;
    } catch (e) {
      console.error('Error fetching progress:', e);
      return {};
    }
  };

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const [propertiesRes, inspectionsRes] = await Promise.all([
        propertyService.getProperties({ limit: 100 }).catch(() => ({ success: false, properties: [], pagination: null })),
        inspectionService.getInspections().catch(() => ({ success: false, inspections: [], pagination: null })),
      ]);

      const allProperties: any[] = propertiesRes.success ? (propertiesRes.properties || []) : [];
      const completedInspections: any[] = inspectionsRes.success ? (inspectionsRes.inspections || []) : [];

      const progressMap = await fetchProgress(allProperties);
      setPropertyProgress(progressMap);

      const mapped: PropertyWithInspection[] = allProperties.map((property: any) => {
        const inspection = completedInspections.find((insp: any) => {
          const inspPropId = typeof insp?.property === 'object' ? insp?.property?._id : insp?.property;
          if (!inspPropId) return false;
          return String(inspPropId) === String(property._id);
        });

        // Progress is the source of truth when we have it; fall back to the DB status.
        const progressValue = progressMap[property._id];
        const hasCompletedInspection = !!inspection && inspection.status === 'completed';
        const isComplete = progressValue !== undefined ? progressValue === 100 : hasCompletedInspection;

        return {
          ...property,
          inspection,
          hasInspection: isComplete,
          isUnlocked: false,
        };
      });

      // Payment/unlock status for properties with a completed inspection
      const withUnlock = await Promise.all(
        mapped.map(async (property) => {
          if (property.hasInspection && property.inspection?._id) {
            try {
              const unlocked = await stripeService.checkUnlockStatus(property.inspection._id);
              return { ...property, isUnlocked: unlocked };
            } catch (err) {
              console.error(`Error checking unlock status for ${property._id}:`, err);
            }
          }
          return property;
        })
      );

      // Not-yet-inspected first, completed last (same order as web)
      withUnlock.sort((a, b) => {
        if (a.hasInspection === b.hasInspection) return 0;
        return a.hasInspection ? 1 : -1;
      });

      setProperties(withUnlock);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      const userData = await authService.getStoredUser();
      if (!userData) {
        navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
        return;
      }
      await fetchData();
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true);
  }, [fetchData]);

  const handleMenuPress = () => setSidebarVisible(true);

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'InspectionStatus') return;
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    await authService.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
  };

  const buildReport = (property: PropertyWithInspection) => {
    const inspection = property.inspection || {};
    return generateNSPIREReport({
      findings: inspection.findings || inspection.deficiencies || [],
      property: typeof inspection.property === 'object' ? inspection.property : property,
      inspectorName: inspection.inspector?.fullName || inspection.inspectorName,
      notes: inspection.notes,
      status: inspection.status,
    } as any);
  };

  const handleDownloadPDF = async (property: PropertyWithInspection) => {
    if (!property.inspection) {
      Alert.alert('No Report', 'No inspection completed for this property');
      return;
    }
    setDownloadingId(property._id);
    try {
      const nspireReport = buildReport(property);
      const result = await enhancedNspirePDFService.generateAndShareEnhancedPDF(nspireReport as any, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
      } as any);
      if (!result.success) {
        Alert.alert('Download Failed', result.error || 'Could not generate the PDF.');
      }
    } catch (error: any) {
      console.error('PDF download error:', error);
      Alert.alert('Error', `Failed to download PDF: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadExcel = async (property: PropertyWithInspection) => {
    if (!property.inspection) {
      Alert.alert('No Report', 'No inspection completed for this property');
      return;
    }
    setDownloadingId(property._id + '_excel');
    try {
      const nspireReport = buildReport(property);
      const result = await exportNspireExcel(nspireReport, safeFileName(property.name));
      if (!result.success) {
        Alert.alert('Download Failed', result.error || 'Could not generate the Excel file.');
      }
    } catch (error: any) {
      console.error('Excel download error:', error);
      Alert.alert('Error', `Failed to download Excel: ${error.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Email-only unlock: the backend mails a Stripe link, the hook polls, and the
  // download buttons appear as soon as the payment lands.
  const payment = usePaymentLink(payFor?.inspection?._id || '', () => {
    setPayFor(null);
    Alert.alert('Payment Successful', 'Report unlocked. You can download it now.');
    fetchData(true);
  }, !!payFor);

  const handlePayToUnlock = (property: PropertyWithInspection) => {
    if (!property.inspection?._id) {
      Alert.alert('Error', 'Inspection details not found');
      return;
    }
    payment.reset();
    setPayFor(property);
  };

  const handleSendPaymentLink = async () => {
    const ok = await payment.send();
    if (!ok && payment.error) Alert.alert('Error', payment.error);
  };

  const handleStartInspection = (property: PropertyWithInspection) => {
    navigation.navigate('BuildingInspection' as never, {
      property,
      calculatedUnits: property.calculatedUnits || property.units || 0,
      selectedUnits: [],
      coverage: (property as any).inspectionCoverage || 'random',
    } as never);
  };

  const completedCount = properties.filter(p => p.hasInspection).length;
  const pendingCount = properties.filter(p => !p.hasInspection).length;
  const thisMonthCount = properties.filter(p => {
    if (!p.inspection?.inspectionDate) return false;
    const inspDate = new Date(p.inspection.inspectionDate);
    const now = new Date();
    return inspDate.getMonth() === now.getMonth() && inspDate.getFullYear() === now.getFullYear();
  }).length;

  const renderStatusMeta = (property: PropertyWithInspection) => {
    const progress = propertyProgress[property._id] || 0;
    if (property.hasInspection) {
      return { icon: 'checkmark-circle' as const, color: '#16A34A', bg: '#DCFCE7', label: 'Completed' };
    }
    if (progress > 0) {
      return { icon: 'time' as const, color: '#D97706', bg: '#FEF3C7', label: `In Progress (${progress}%)` };
    }
    return { icon: 'alert-circle' as const, color: '#DC2626', bg: '#FEE2E2', label: 'Pending' };
  };

  return (
    <>
      {/* Payment Modal — email-only Stripe checkout, no card entry in the app */}
      <Modal
        visible={!!payFor}
        animationType="fade"
        transparent
        onRequestClose={() => { if (!payment.sending) setPayFor(null); }}
      >
        <View style={styles.payOverlay}>
          <View style={styles.payCard}>
            <TouchableOpacity
              style={styles.payClose}
              onPress={() => setPayFor(null)}
              disabled={payment.sending}
            >
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>

            <Ionicons name="lock-closed" size={36} color="#0E7490" />
            <Text style={styles.payTitle}>Unlock Full Report</Text>
            <Text style={styles.paySubtitle} numberOfLines={2}>{payFor?.name}</Text>

            {payment.sentTo ? (
              <>
                <Text style={styles.payBody}>
                  We emailed the secure Stripe checkout link to {payment.sentTo}. Pay from that
                  email — this screen unlocks on its own and the download buttons appear.
                </Text>
                <View style={styles.payWaitingRow}>
                  <ActivityIndicator size="small" color="#0E7490" />
                  <Text style={styles.payWaitingText}>Waiting for payment…</Text>
                </View>
                <TouchableOpacity onPress={() => { void payment.checkNow(); }} disabled={payment.checking}>
                  <Text style={styles.payLink}>
                    {payment.checking ? 'Checking…' : 'Already paid? Check now'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={payment.reset} disabled={payment.checking}>
                  <Text style={styles.payLinkMuted}>Send to a different email</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.payBody}>
                  Enter the email that should receive the payment link.
                </Text>
                <TextInput
                  style={styles.payInput}
                  placeholder="name@company.com"
                  placeholderTextColor="#9CA3AF"
                  value={payment.email}
                  onChangeText={payment.setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!payment.sending}
                  accessibilityLabel="Email address for the payment link"
                />
                <TouchableOpacity
                  style={[styles.payButton, payment.sending && styles.buttonDisabled]}
                  onPress={handleSendPaymentLink}
                  disabled={payment.sending}
                >
                  {payment.sending ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Send Payment Link</Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.paySecure}>🔒 Secure payment via Stripe</Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
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
        <AppHeader
          onMenuPress={handleMenuPress}
          onNotificationsPress={() => navigation.navigate('Notifications' as never)}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0E7490" />
            <Text style={styles.loadingText}>Loading inspection status...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E7490']} tintColor="#0E7490" />
            }
          >
            <TouchableOpacity style={styles.refreshBar} onPress={onRefresh}>
              <Ionicons name="refresh" size={18} color="#0E7490" />
              <Text style={styles.refreshBarText}>Refresh</Text>
            </TouchableOpacity>

            {/* Stat cards (web parity) */}
            {[
              { label: 'Total Properties', value: properties.length, color: '#2563EB', dark: '#1E3A8A', from: '#EFF6FF', to: '#DBEAFE', icon: 'business-outline' as const },
              { label: 'Completed', value: completedCount, color: '#16A34A', dark: '#14532D', from: '#F0FDF4', to: '#DCFCE7', icon: 'checkmark-circle-outline' as const },
              { label: 'Pending', value: pendingCount, color: '#DC2626', dark: '#7F1D1D', from: '#FEF2F2', to: '#FEE2E2', icon: 'alert-circle-outline' as const },
              { label: 'This Month', value: thisMonthCount, color: '#9333EA', dark: '#581C87', from: '#FAF5FF', to: '#F3E8FF', icon: 'calendar-outline' as const },
            ].map((stat) => (
              <LinearGradient
                key={stat.label}
                colors={[stat.from, stat.to]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statLabel, { color: stat.color }]}>{stat.label}</Text>
                  <Text style={[styles.statValue, { color: stat.dark }]}>{stat.value}</Text>
                </View>
                <Ionicons name={stat.icon} size={30} color={stat.color} />
              </LinearGradient>
            ))}

            {properties.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="business-outline" size={56} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>No Properties Found</Text>
                <Text style={styles.emptyStateText}>Add a property to start inspections.</Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate('AddProperty' as never)}
                >
                  <Text style={styles.primaryButtonText}>Add Property</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.list}>
                {properties.map((property) => {
                  const meta = renderStatusMeta(property);
                  const progress = propertyProgress[property._id] || 0;
                  const deficiencyCount = property.inspection
                    ? countUniqueDeficiencies(property.inspection.findings || property.inspection.deficiencies)
                    : 0;
                  const isDownloading = downloadingId === property._id || downloadingId === property._id + '_excel';

                  return (
                    <View
                      key={property._id}
                      style={[
                        styles.card,
                        { borderColor: meta.color },
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View style={[styles.statusIconWrap, { backgroundColor: meta.bg }]}>
                          <Ionicons name={meta.icon} size={22} color={meta.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.propertyName} numberOfLines={1}>{property.name}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.metaRow}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {[property.address, property.city, property.state].filter(Boolean).join(', ')}
                        </Text>
                      </View>

                      {property.inspection && (
                        <>
                          <View style={styles.metaRow}>
                            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>
                              {property.inspection.inspectionDate
                                ? new Date(property.inspection.inspectionDate).toLocaleDateString()
                                : '-'}
                            </Text>
                          </View>
                          <View style={styles.metaRow}>
                            <Ionicons name="person-outline" size={14} color="#6B7280" />
                            <Text style={styles.metaText} numberOfLines={1}>
                              {property.inspection.inspector?.fullName || property.inspection.inspectorName || '-'}
                            </Text>
                          </View>
                        </>
                      )}

                      {deficiencyCount > 0 && (
                        <View style={styles.deficiencyBadge}>
                          <Text style={styles.deficiencyBadgeText}>{deficiencyCount} Deficiencies</Text>
                        </View>
                      )}

                      {/* Actions (web parity) */}
                      <View style={styles.actionsRow}>
                        {property.hasInspection ? (
                          property.isUnlocked ? (
                            <>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.pdfButton, isDownloading && styles.buttonDisabled]}
                                disabled={isDownloading}
                                onPress={() => handleDownloadPDF(property)}
                              >
                                {downloadingId === property._id ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                                )}
                                <Text style={styles.actionButtonText}>
                                  {downloadingId === property._id ? 'Generating...' : 'Download PDF'}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[styles.actionButton, styles.excelButton, isDownloading && styles.buttonDisabled]}
                                disabled={isDownloading}
                                onPress={() => handleDownloadExcel(property)}
                              >
                                {downloadingId === property._id + '_excel' ? (
                                  <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                  <Ionicons name="grid-outline" size={16} color="#FFFFFF" />
                                )}
                                <Text style={styles.actionButtonText}>
                                  {downloadingId === property._id + '_excel' ? 'Generating...' : 'Download Excel'}
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <TouchableOpacity
                              style={[styles.actionButton, styles.unlockButton]}
                              onPress={() => handlePayToUnlock(property)}
                            >
                              <Ionicons name="lock-closed-outline" size={16} color="#FFFFFF" />
                              <Text style={styles.actionButtonText}>Pay to Unlock Report</Text>
                            </TouchableOpacity>
                          )
                        ) : (
                          <TouchableOpacity
                            style={[styles.actionButton, styles.startButton]}
                            onPress={() => handleStartInspection(property)}
                          >
                            <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>
                              {progress > 0 ? 'Continue Inspection' : 'Start Inspection'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  payOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  payCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  payClose: { position: 'absolute', top: 14, right: 14, padding: 4 },
  payTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginTop: 10 },
  paySubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2, textAlign: 'center' },
  payBody: { fontSize: 13, color: '#374151', textAlign: 'center', lineHeight: 19, marginTop: 12 },
  payInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#F9FAFB',
    marginTop: 12,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#635BFF',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
  },
  paySecure: { fontSize: 12, color: '#9CA3AF', marginTop: 10 },
  payWaitingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  payWaitingText: { fontSize: 13, fontWeight: '600', color: '#0E7490' },
  payLink: { fontSize: 13, fontWeight: '700', color: '#0E7490', marginTop: 14 },
  payLinkMuted: { fontSize: 12, color: '#6B7280', marginTop: 10 },
  container: { flex: 1, backgroundColor: '#E4F0F6' },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  sidebarContainer: { width: '75%', maxWidth: 300, backgroundColor: '#FFFFFF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  scrollView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#1F2937', fontSize: 14 },
  refreshBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  refreshBarText: { color: '#374151', fontSize: 15, fontWeight: '600' },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  statLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '800' },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 6,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 20 },
  emptyStateText: { fontSize: 14, color: '#4B5563', marginTop: 10, marginBottom: 24, textAlign: 'center' },
  primaryButton: {
    backgroundColor: '#0E6C8E',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 999,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  statusIconWrap: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  propertyName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontSize: 12, color: '#4B5563', flex: 1 },
  deficiencyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 8,
  },
  deficiencyBadgeText: { fontSize: 11, fontWeight: '700', color: '#9A3412' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    flexGrow: 1,
  },
  actionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  buttonDisabled: { opacity: 0.6 },
  pdfButton: { backgroundColor: '#16A34A' },
  excelButton: { backgroundColor: '#059669' },
  unlockButton: { backgroundColor: '#D97706' },
  startButton: { backgroundColor: '#006795' },
});
