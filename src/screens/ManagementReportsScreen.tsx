import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Share,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { WebView } from 'react-native-webview';
import Sidebar from '../components/Sidebar';
import IOSPickerModal from '../components/IOSPickerModal';
import { inspectionService, propertyService, authService } from '../services';
import { Inspection, Property } from '../services/api';
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  DeficiencySeverity,
  DEFAULT_PDF_OPTIONS
} from '../types/nspireReport';

const { width, height } = Dimensions.get('window');

// Status options for picker
const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Paid', value: 'paid' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Needs Attention', value: 'needs-attention' },
];

// Date range options for picker
const DATE_RANGE_OPTIONS = [
  { label: 'All Dates', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

interface ManagementReportsScreenProps {
  navigation: any;
}

interface Report {
  _id: string;
  id?: string;
  propertyName?: string;
  property: {
    _id: string;
    name: string;
  };
  unit: {
    _id: string;
    unitNumber: string;
  };
  inspector: {
    _id: string;
    name: string;
  };
  inspectorName?: string;
  scheduledDate: string;
  inspectionDate?: string;
  status: string;
  result?: string;
  score?: number;
  complianceScore?: number;
  findings?: any[];
  deficiencies?: any[];
  notes?: string;
}

// Helper function to convert inspection data to NSPIRE report format
const convertInspectionToNSPIREReport = (inspection: Report): NSPIREInspectionReport => {
  const now = new Date();

  // Safely convert numeric values to prevent casting errors
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };

  // Check both findings and deficiencies arrays for data
  const findingsArray = inspection.findings || [];
  const deficienciesArray = inspection.deficiencies || [];

  // Convert findings to deficiency entries
  let deficiencies: DeficiencyEntry[] = [];

  // Process findings array (AI inspection format)
  if (findingsArray.length > 0) {
    deficiencies = findingsArray.map((finding: any, index: number) => {
      // Enhanced image URL mapping for Cloudinary
      let imageUri = '';

      // Priority order for image URL detection
      if (finding.imageUrl && finding.imageUrl.includes('cloudinary.com')) {
        imageUri = finding.imageUrl;
      } else if (finding.imageUri && finding.imageUri.includes('cloudinary.com')) {
        imageUri = finding.imageUri;
      } else if (finding.image && finding.image.includes('cloudinary.com')) {
        imageUri = finding.image;
      } else if (finding.photos && finding.photos.length > 0) {
        // Handle photos array
        const photo = finding.photos[0];
        if (typeof photo === 'string' && photo.includes('cloudinary.com')) {
          imageUri = photo;
        } else if (photo && photo.url && photo.url.includes('cloudinary.com')) {
          imageUri = photo.url;
        }
      } else if (finding.imageUrl) {
        imageUri = finding.imageUrl; // Fallback to any imageUrl
      } else if (finding.imageUri) {
        imageUri = finding.imageUri; // Fallback to any imageUri
      } else if (finding.image) {
        imageUri = finding.image; // Fallback to any image
      }

      return {
        deficiencyQRId: '',
        id: finding.id || `DEF-${index + 1}`,
        imageUri: imageUri,
        building: finding.building || 'A',
        unit: inspection.unit?.unitNumber || '-',
        room: finding.location || finding.room || '-',
        area: finding.area || '-',
        deficiencyName: finding.description || finding.title || 'Unnamed Deficiency',
        nspireCode: finding.nspireCode || mapCategoryToNSPIRECode(finding.category),
        deficiencyDetails: finding.description || '',
        comments: finding.recommendation || finding.comments || finding.recommendedAction || '',
        deductionPts: calculateDeductionPoints(finding.severity),
        repeatIndicator: finding.repeat || false,
        severity: mapSeverity(finding.severity),
        inspectedDate: now.toLocaleDateString(),
        inspectedTime: finding.timestamp ? new Date(finding.timestamp).toLocaleTimeString() : now.toLocaleTimeString(),
        inspectorId: inspection.inspector?._id || 'INS-001',
        status: 'Open',
      };
    });
  }

  // Process deficiencies array (traditional inspection format)
  if (deficienciesArray.length > 0 && deficiencies.length === 0) {
    deficiencies = deficienciesArray.map((deficiency: any, index: number) => {
      // Enhanced image URL mapping for Cloudinary
      let imageUri = '';

      // Priority order for image URL detection
      if (deficiency.photos && deficiency.photos.length > 0) {
        const photo = deficiency.photos[0];
        if (typeof photo === 'string' && photo.includes('cloudinary.com')) {
          imageUri = photo;
        } else if (photo && photo.url && photo.url.includes('cloudinary.com')) {
          imageUri = photo.url;
        }
      } else if (deficiency.imageUrl && deficiency.imageUrl.includes('cloudinary.com')) {
        imageUri = deficiency.imageUrl;
      } else if (deficiency.imageUri && deficiency.imageUri.includes('cloudinary.com')) {
        imageUri = deficiency.imageUri;
      } else if (deficiency.image && deficiency.image.includes('cloudinary.com')) {
        imageUri = deficiency.image;
      } else if (deficiency.imageUrl) {
        imageUri = deficiency.imageUrl; // Fallback to any imageUrl
      } else if (deficiency.imageUri) {
        imageUri = deficiency.imageUri; // Fallback to any imageUri
      } else if (deficiency.image) {
        imageUri = deficiency.image; // Fallback to any image
      }

      return {
        deficiencyQRId: '',
        id: deficiency.id || deficiency._id || `DEF-${index + 1}`,
        imageUri: imageUri,
        building: deficiency.building || 'A',
        unit: inspection.unit?.unitNumber || '-',
        room: deficiency.location || deficiency.room || '-',
        area: deficiency.area || '-',
        deficiencyName: deficiency.description || deficiency.title || 'Unnamed Deficiency',
        nspireCode: deficiency.nspireCode || mapCategoryToNSPIRECode(deficiency.category),
        deficiencyDetails: deficiency.description || '',
        comments: deficiency.notes || deficiency.comments || '',
        deductionPts: calculateDeductionPoints(deficiency.severity),
        repeatIndicator: deficiency.repeat || false,
        severity: mapSeverity(deficiency.severity),
        inspectedDate: now.toLocaleDateString(),
        inspectedTime: now.toLocaleTimeString(),
        inspectorId: inspection.inspector?._id || 'INS-001',
        status: deficiency.status || 'Open',
      };
    });
  }

  // Summary calculation
  const summary: DeficiencySummary = {
    lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening').length,
    severe: deficiencies.filter(d => d.severity === 'Severe').length,
    moderate: deficiencies.filter(d => d.severity === 'Moderate').length,
    low: deficiencies.filter(d => d.severity === 'Low').length,
    total: deficiencies.length,
    byBuilding: {},
    byCategory: {},
    repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
    newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length,
  };

  // Report structure
  return {
    reportId: `RPT-${Date.now()}`,
    version: '1.0',
    generatedAt: now.toISOString(),
    metadata: {
      inspectionNo: inspection._id || `INSP-${Date.now().toString(36).toUpperCase()}`,
      inspectionType: 'General NSPIRE',
      escortName: 'Property Manager',
      propertyAddress: inspection.property?.name || 'Property Address',
      propertyName: inspection.propertyName || inspection.property?.name || 'Property',
      propertyId: inspection.property?._id || 'PROP-001',
      startDate: inspection.inspectionDate || inspection.scheduledDate || now.toLocaleDateString(),
      startTime: '09:00 AM',
      endDate: inspection.inspectionDate || inspection.scheduledDate || now.toLocaleDateString(),
      endTime: now.toLocaleTimeString(),
      reportCreatedDate: now.toLocaleDateString(),
      preliminaryScore: safeNumber(inspection.complianceScore || inspection.score, 100 - (deficiencies.length * 2)),
      finalScore: safeNumber(inspection.complianceScore || inspection.score, 100 - (deficiencies.length * 2)),
      calculatedScore: safeNumber(inspection.complianceScore || inspection.score, 100 - (deficiencies.length * 2)),
      healthSafetyThreshold: 60,
      physicalConditionThreshold: 60,
      inspectorName: inspection.inspectorName || inspection.inspector?.name || 'Inspector',
      inspectorId: inspection.inspector?._id || 'INS-001',
    },
    inspectionData: [
      { type: 'Building', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      { type: 'Unit', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
      { type: 'Common Area', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
    ],
    occupancyInfo: {
      totalUnits: safeNumber(1, 1),
      occupiedUnits: safeNumber(1, 1),
      vacantUnits: safeNumber(0, 0),
      occupancyRate: safeNumber(100, 100),
    },
    summary,
    categoryBreakdown: [],
    deficiencies,
    generalComments: inspection.notes || '',
    recommendations: [],
    certification: {
      certifiedBy: inspection.inspectorName || inspection.inspector?.name || 'Inspector',
      certificationDate: now.toLocaleDateString(),
      certificationStatement: 'I certify that this inspection was conducted in accordance with HUD INSPIRE protocols.',
    },
  };
};

const mapCategoryToNSPIRECode = (category: string): string => {
  const mapping: Record<string, string> = {
    'structural': 'BE-3',
    'electrical': 'BS-2',
    'plumbing': 'BS-1',
    'safety': 'HS-12',
    'hvac': 'BS-5',
    'exterior': 'BE-6',
    'interior': 'U-16',
    'appliances': 'U-10',
    'kitchen': 'U-10',
    'bathroom': 'U-1',
    'ceiling': 'U-3',
    'floor': 'U-6',
    'wall': 'U-16',
    'window': 'U-17',
    'door': 'U-4',
  };
  return mapping[category?.toLowerCase()] || 'HS-12';
};

const mapSeverity = (severity: string): DeficiencySeverity => {
  const mapping: Record<string, DeficiencySeverity> = {
    'critical': 'Life-Threatening',
    'major': 'Severe',
    'minor': 'Moderate',
    'observation': 'Low',
    'high': 'Severe',
    'medium': 'Moderate',
    'low': 'Low',
  };
  return mapping[severity?.toLowerCase()] || 'Moderate';
};

const calculateDeductionPoints = (severity: string): number => {
  const points: Record<string, number> = {
    'critical': 10,
    'major': 6,
    'minor': 3,
    'observation': 1,
    'high': 6,
    'medium': 3,
    'low': 1,
  };
  return points[severity?.toLowerCase()] || 3;
};

export default function ManagementReportsScreen({ navigation }: ManagementReportsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<any>(null);

  // iOS Picker Modal visibility states
  const [propertyPickerVisible, setPropertyPickerVisible] = useState(false);
  const [dateRangePickerVisible, setDateRangePickerVisible] = useState(false);
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);

  // Simple PDF Preview Modal states
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [currentReportTitle, setCurrentReportTitle] = useState('');

  // Get property options for picker
  const getPropertyOptions = () => {
    const options = [{ label: 'All Properties', value: '' }];
    properties.forEach(p => {
      options.push({ label: p.name, value: p._id });
    });
    return options;
  };

  const loadData = useCallback(async () => {
    try {
      // Load user data and check permissions
      const storedUser = await authService.getStoredUser();
      setUser(storedUser);

      // Role-based access control for management portal
      const allowedRoles = ['management', 'supervisor', 'admin', 'property-manager'];
      if (!storedUser || !allowedRoles.includes(storedUser.role)) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access the Management Reports.',
          [{
            text: 'OK', onPress: () => {
              navigation.goBack();
            }
          }]
        );
        return;
      }

      // Load all inspections (management can see all)
      const inspectionsResponse = await inspectionService.getAllInspections();
      console.log('Management Reports - Loaded inspections:', inspectionsResponse);

      // Load all properties
      const propertiesResponse = await propertyService.getProperties();
      console.log('Management Reports - Loaded properties:', propertiesResponse);

      if (inspectionsResponse.success && inspectionsResponse.inspections) {
        const inspections = inspectionsResponse.inspections || [];
        setReports(inspections as unknown as Report[]);
      }

      if (propertiesResponse.success && propertiesResponse.properties) {
        setProperties(propertiesResponse.properties || []);
      }

    } catch (error) {
      console.error('Error loading management reports:', error);
      Alert.alert('Error', 'Failed to load reports. Please try again.');
      setReports([]);
      setProperties([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('ManagementDashboard');
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections');
    } else if (screen === 'ManagementReports') {
      // Already on Management Reports
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics');
    } else if (screen === 'Settings') {
      navigation.navigate('Settings');
    } else {
      navigation.navigate(screen as never);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setSidebarVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStatusStyle = (status: string, result?: string) => {
    const finalStatus = result || status;
    if (finalStatus === 'completed' || finalStatus === 'pass' || finalStatus === 'Compliant' || finalStatus === 'paid' || finalStatus === 'Paid') {
      return {
        deficiencyQRId: '', color: '#10B981', bg: '#D1FAE5'
      };
    } else if (finalStatus === 'failed' || finalStatus === 'fail' || finalStatus === 'Non-Compliant' || finalStatus === 'unpaid' || finalStatus === 'Unpaid') {
      return {
        deficiencyQRId: '', color: '#EF4444', bg: '#FEE2E2'
      };
    } else if (finalStatus === 'in-progress' || finalStatus === 'pending') {
      return {
        deficiencyQRId: '', color: '#F59E0B', bg: '#FEF3C7'
      };
    }
    return {
      deficiencyQRId: '', color: '#6B7280', bg: '#F3F4F6'
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handlePreview = async (reportId: string) => {
    try {
      const report = reports.find(r => r._id === reportId);
      if (!report) return;

      // Set modal title
      const propertyName = report.propertyName || report.property?.name || 'Property';
      const unitNumber = report.unit?.unitNumber || 'All Units';
      setCurrentReportTitle(`${propertyName} - Unit ${unitNumber}`);

      // Create simple HTML that won't crash
      const simpleHtml = createSimplePreviewHtml(report);
      setPreviewHtml(simpleHtml);

      // Show modal
      setPreviewModalVisible(true);

    } catch (error) {
      console.error('Preview error:', error);
      Alert.alert('Error', 'Failed to generate preview');
    }
  };

  const createSimplePreviewHtml = (report: Report): string => {
    // Helper function for safe number conversion
    const safeNumber = (value: any, defaultValue: number = 0): number => {
      if (typeof value === 'number' && !isNaN(value)) return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return !isNaN(parsed) ? parsed : defaultValue;
      }
      return defaultValue;
    };

    const propertyName = report.propertyName || report.property?.name || 'Property';
    const unitNumber = report.unit?.unitNumber || 'All Units';
    const inspectorName = report.inspectorName || report.inspector?.name || 'Inspector';
    const score = safeNumber(report.complianceScore || report.score, 0);
    const findingsCount = (report.findings || []).length;
    const deficienciesCount = (report.deficiencies || []).length;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INSPIRE Report - ${propertyName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
            color: #1f2937;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0e7490;
            padding-bottom: 20px;
            margin-bottom: 24px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #0e7490;
            margin: 0 0 8px 0;
        }
        .subtitle {
            font-size: 16px;
            color: #6b7280;
            margin: 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }
        .info-card {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 8px;
        }
        .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        .score-card {
            background: linear-gradient(135deg, #0e7490, #0891b2);
            color: white;
            text-align: center;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
        }
        .score-value {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .score-label {
            font-size: 14px;
            opacity: 0.9;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
        }
        .summary-card {
            background: #fef3c7;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }
        .summary-count {
            font-size: 24px;
            font-weight: bold;
            color: #92400e;
            margin-bottom: 4px;
        }
        .summary-label {
            font-size: 12px;
            color: #92400e;
            font-weight: 600;
        }
        .message {
            background: #e0f2fe;
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #0e7490;
            margin-top: 24px;
        }
        .message-title {
            font-weight: 600;
            color: #0e7490;
            margin-bottom: 8px;
        }
        .message-text {
            color: #374151;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">INSPIRE Inspection Report</h1>
            <p class="subtitle">Simplified Preview</p>
        </div>
        
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Property</div>
                <div class="info-value">${propertyName}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Unit</div>
                <div class="info-value">${unitNumber}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Inspector</div>
                <div class="info-value">${inspectorName}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Date</div>
                <div class="info-value">${new Date(report.inspectionDate || report.scheduledDate).toLocaleDateString()}</div>
            </div>
        </div>
        
        <div class="score-card">
            <div class="score-value">${score}</div>
            <div class="score-label">Compliance Score</div>
        </div>
        
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-count">${findingsCount}</div>
                <div class="summary-label">Findings</div>
            </div>
            <div class="summary-card">
                <div class="summary-count">${deficienciesCount}</div>
                <div class="summary-label">Deficiencies</div>
            </div>
        </div>
        
        <div class="message">
            <div class="message-title">Preview Limitation</div>
            <div class="message-text">
                This is a simplified preview. For the complete INSPIRE report with detailed deficiencies, 
                images, and full formatting, please use the "Export PDF" function.
            </div>
        </div>
    </div>
</body>
</html>`;
  };

  const handleExport = async (reportId: string) => {
    try {
      const report = reports.find(r => r._id === reportId);
      if (!report) return;

      // Get full inspection data with findings
      let fullInspectionData = null;

      // First try the admin route
      try {
        const { api } = await import('../services');
        const adminResponse = await api.get(`/admin/inspections/${reportId}`);
        if (adminResponse.success && adminResponse.inspection) {
          fullInspectionData = adminResponse.inspection;
        }
      } catch (adminError) {
        console.log('Export: Admin route failed:', (adminError as Error)?.message || adminError);
      }

      // If admin route failed, try the regular inspection route
      if (!fullInspectionData) {
        try {
          const { api } = await import('../services');
          const regularResponse = await api.get(`/inspections/${reportId}`);
          if (regularResponse.success && regularResponse.inspection) {
            fullInspectionData = regularResponse.inspection;
          }
        } catch (regularError) {
          console.log('Export: Regular route also failed:', (regularError as Error)?.message || regularError);
        }
      }

      // Use full inspection data if available, otherwise use the report data
      const inspectionDataToUse = fullInspectionData || report;

      // Convert to NSPIRE format
      const nspireReport = convertInspectionToNSPIREReport(inspectionDataToUse);

      if (!nspireReport) return;

      try {
        console.log('Starting PDF export...');

        // Show progress to user
        Alert.alert('Generating PDF', 'Please wait while we generate your inspection report...', [], { cancelable: false });

        // Import the NSPIRE PDF service
        const { nspirePDFService } = await import('../services/nspirePDFService');

        // PDF options
        const pdfOptions = {
          includeImages: true,
          imageQuality: 'medium' as const,
          colorCodingSeverity: true,
          includeSummaryPage: true,
          includeDetailedDeficiencies: true,
          includeCertification: true,
          pageSize: 'letter' as const,
          orientation: 'portrait' as const,
          footerText: 'Generated by INSPIRE Management Portal',
        };

        // Generate PDF
        const result = await nspirePDFService.generateAndSharePDF(nspireReport, pdfOptions);

        // Dismiss the progress alert
        Alert.alert('', '', [], { cancelable: true });

        if (!result.success) {
          throw new Error(result.error);
        }

        console.log('PDF export successful');
        Alert.alert('Success', 'PDF report generated and ready to share!');
      } catch (error: any) {
        console.error('PDF Export Error:', error);
        Alert.alert('', '', [], { cancelable: true }); // Dismiss progress alert

        let errorMessage = 'Failed to export PDF';
        if (error.message.includes('timeout')) {
          errorMessage = 'PDF generation timed out. This may be due to large images. Please try again.';
        } else if (error.message.includes('Image')) {
          errorMessage = 'There was an issue processing images. The PDF may have been generated without some images.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        Alert.alert('Export Failed', errorMessage);
      }
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Failed to export PDF');
    }
  };

  const handleShare = async (reportId: string) => {
    const report = reports.find(r => r._id === reportId);
    if (!report) return;

    const propertyName = report.propertyName || report.property?.name || 'Property';
    const unitNumber = report.unit?.unitNumber || 'All Units';
    const inspectorName = report.inspectorName || report.inspector?.name || 'Inspector';
    const dateStr = report.inspectionDate || report.scheduledDate;
    const status = report.result || report.status;

    const summary = `INSPIRE Inspection Report\n\nProperty: ${propertyName}\nUnit: ${unitNumber}\nInspector: ${inspectorName}\nDate: ${formatDate(dateStr)}\nStatus: ${status}`;

    // Web parity: share an expiring public link. If the link can't be generated
    // (offline, endpoint down) fall back to sharing the summary text.
    let message = `${summary}\n\nGenerated by INSPIRE Inspection System`;
    try {
      const { shareUrl, expiresAt } = await inspectionService.generateShareLink(reportId);
      if (shareUrl) {
        const expiry = expiresAt ? `\nLink expires: ${formatDate(expiresAt)}` : '';
        message = `${summary}\n\nView report: ${shareUrl}${expiry}`;
      }
    } catch (error) {
      console.error('Share link error:', error);
    }

    try {
      await Share.share({ message, title: 'Inspection Report' });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share report');
    }
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter(report => {
    const propertyName = report.propertyName || report.property?.name || '';
    const unitNumber = report.unit?.unitNumber || '';
    const inspectorName = report.inspectorName || report.inspector?.name || '';

    const matchesSearch = searchQuery === '' ||
      propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspectorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProperty = selectedProperty === '' || report.property?._id === selectedProperty;
    const matchesStatus = selectedStatus === '' || report.status === selectedStatus || report.result === selectedStatus;

    // Date range filtering
    let matchesDateRange = true;
    if (selectedDateRange) {
      const reportDate = new Date(report.inspectionDate || report.scheduledDate);
      const now = new Date();

      switch (selectedDateRange) {
        case 'today':
          matchesDateRange = reportDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDateRange = reportDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDateRange = reportDate >= monthAgo;
          break;
        default:
          matchesDateRange = true;
      }
    }

    return matchesSearch && matchesProperty && matchesStatus && matchesDateRange;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading management reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              source={require('../../public/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E7490']}
              tintColor="#0E7490"
            />
          }
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Inspection Reports</Text>
            <Text style={styles.subtitle}>View, export and share your inspection reports.</Text>
          </View>

          {/* Filters Card */}
          <View style={styles.filtersCard}>
            <Text style={styles.filtersTitle}>Filters</Text>

            {/* Property Filter */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Property Name</Text>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setPropertyPickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !selectedProperty && { color: '#9CA3AF' }]}>
                      {selectedProperty ? properties.find(p => p._id === selectedProperty)?.name || 'All Properties' : "All Properties"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={selectedProperty}
                    onValueChange={(itemValue: string) => setSelectedProperty(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Properties" value="" />
                    {properties.map((property) => (
                      <Picker.Item key={property._id} label={property.name} value={property._id} />
                    ))}
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            {/* Date Range Filter */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setDateRangePickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !selectedDateRange && { color: '#9CA3AF' }]}>
                      {DATE_RANGE_OPTIONS.find(opt => opt.value === selectedDateRange)?.label || "All Dates"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={selectedDateRange}
                    onValueChange={(itemValue: string) => setSelectedDateRange(itemValue)}
                    style={styles.picker}
                  >
                    {DATE_RANGE_OPTIONS.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.pickerContainer}>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setStatusPickerVisible(true)}
                  >
                    <Text style={[styles.iosPickerText, !selectedStatus && { color: '#9CA3AF' }]}>
                      {STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label || "All Status"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={selectedStatus}
                    onValueChange={(itemValue: string) => setSelectedStatus(itemValue)}
                    style={styles.picker}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                )}
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by property, unit or inspector name"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Reports List */}
          <View style={styles.reportsList}>
            {filteredReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
                <Text style={styles.emptyText}>No reports found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            ) : (
              <>
                <Text style={styles.resultsCount}>Showing {filteredReports.length} Reports</Text>
                {filteredReports.map((report) => {
                  const statusStyle = getStatusStyle(report.status, report.result);
                  const propertyName = report.propertyName || report.property?.name || 'N/A';
                  const unitNumber = report.unit?.unitNumber || 'All Units';
                  const inspectorName = report.inspectorName || report.inspector?.name || 'N/A';
                  const dateStr = report.inspectionDate || report.scheduledDate;

                  return (
                    <View key={report._id || report.id} style={styles.reportCard}>
                      <View style={styles.reportHeader}>
                        <Text style={styles.reportProperty}>{propertyName}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                          <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
                          <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {report.result || report.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.reportDetails}>
                        <View style={styles.reportRow}>
                          <Text style={styles.reportLabel}>Unit:</Text>
                          <Text style={styles.reportValue}>{unitNumber}</Text>
                        </View>
                        <View style={styles.reportRow}>
                          <Text style={styles.reportLabel}>Inspector:</Text>
                          <Text style={styles.reportValue}>{inspectorName}</Text>
                        </View>
                        <View style={styles.reportRow}>
                          <Text style={styles.reportLabel}>Date:</Text>
                          <Text style={styles.reportValue}>{formatDate(dateStr)}</Text>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handlePreview(report._id)}
                        >
                          <Ionicons name="eye-outline" size={20} color="#0E7490" />
                          <Text style={styles.actionButtonText}>Preview</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleExport(report._id)}
                        >
                          <Ionicons name="download-outline" size={20} color="#0E7490" />
                          <Text style={styles.actionButtonText}>Export PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShare(report._id)}
                        >
                          <Ionicons name="share-outline" size={20} color="#0E7490" />
                          <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* iOS Picker Modals */}
      <IOSPickerModal
        visible={propertyPickerVisible}
        title="Select Property"
        options={getPropertyOptions()}
        selectedValue={selectedProperty}
        onSelect={setSelectedProperty}
        onClose={() => setPropertyPickerVisible(false)}
      />
      <IOSPickerModal
        visible={dateRangePickerVisible}
        title="Select Date Range"
        options={DATE_RANGE_OPTIONS}
        selectedValue={selectedDateRange}
        onSelect={setSelectedDateRange}
        onClose={() => setDateRangePickerVisible(false)}
      />
      <IOSPickerModal
        visible={statusPickerVisible}
        title="Select Status"
        options={STATUS_OPTIONS}
        selectedValue={selectedStatus}
        onSelect={setSelectedStatus}
        onClose={() => setStatusPickerVisible(false)}
      />

      {/* Simple PDF Preview Modal */}
      <Modal
        visible={previewModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <SafeAreaView style={styles.previewModalContainer}>
          {/* Modal Header */}
          <View style={styles.previewModalHeader}>
            <View style={styles.previewModalTitleContainer}>
              <Text style={styles.previewModalTitle}>INSPIRE PDF Preview</Text>
              <Text style={styles.previewModalSubtitle}>{currentReportTitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.previewModalCloseButton}
              onPress={() => setPreviewModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <View style={styles.previewModalContent}>
            <WebView
              source={{ html: previewHtml }}
              style={styles.previewWebView}
              scalesPageToFit={true}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.previewLoadingContainer}>
                  <ActivityIndicator size="large" color="#0E7490" />
                  <Text style={styles.previewLoadingText}>Loading preview...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
              }}
              // Simple crash-safe settings
              javaScriptEnabled={false}
              domStorageEnabled={false}
              cacheEnabled={false}
              originWhitelist={['*']}
              scrollEnabled={true}
              bounces={true}
            />
          </View>

          {/* Modal Footer */}
          <View style={styles.previewModalFooter}>
            <TouchableOpacity
              style={styles.previewModalPrimaryButton}
              onPress={() => setPreviewModalVisible(false)}
            >
              <Ionicons name="close-outline" size={18} color="#FFFFFF" />
              <Text style={styles.previewModalPrimaryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  titleSection: {
    backgroundColor: '#0E7490',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0F7FA',
  },
  filtersCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    position: 'relative',
    minHeight: 48,
    justifyContent: 'center',
  },
  picker: {
    height: 48,
    color: '#374151',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
    pointerEvents: 'none',
  },
  iosPickerButton: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iosPickerText: {
    fontSize: 14,
    color: '#374151',
  },
  searchContainer: {
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: '#E8F4F8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#374151',
  },
  reportsList: {
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportProperty: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDetails: {
    marginBottom: 16,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Preview Modal Styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  previewModalTitleContainer: {
    flex: 1,
  },
  previewModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  previewModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  previewModalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  previewModalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewWebView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  previewLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  previewLoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  previewModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  previewModalPrimaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0E7490',
    borderRadius: 8,
    gap: 8,
  },
  previewModalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});