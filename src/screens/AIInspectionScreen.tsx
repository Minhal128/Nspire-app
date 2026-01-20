import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { networkService } from '../services/networkService';
import { geminiService, INSPECTION_TYPES, InspectionFinding, AnalysisResult } from '../services/openaiService';
import { offlineStorageService, InspectionSession, PendingImage } from '../services/offlineStorageService';
import { syncService, SyncProgress } from '../services/syncService';
import { generateNSPIREReport } from '../utils/nspireReportUtils';
import { cloudinaryService } from '../services/cloudinaryService';
import authService from '../services/authService';
import { inspectionService } from '../services/inspectionService';

const { width } = Dimensions.get('window');

interface AIInspectionScreenProps {
  navigation: any;
  route: any;
}

type InspectionMode = 'one-by-one' | 'batch';

export default function AIInspectionScreen({ navigation, route }: AIInspectionScreenProps) {
  const { property, selectedUnits, coverage, totalUnits } = route.params || {};
  
  // Connection state
  const [isOnline, setIsOnline] = useState(true);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  
  // Inspection state
  const [session, setSession] = useState<InspectionSession | null>(null);
  const [inspectionType, setInspectionType] = useState('general');
  const [processingMode, setProcessingMode] = useState<InspectionMode>('one-by-one');
  const [images, setImages] = useState<PendingImage[]>([]);
  const [findings, setFindings] = useState<InspectionFinding[]>([]);
  
  // UI state
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedImageForStatus, setSelectedImageForStatus] = useState<PendingImage | null>(null);
  
  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize
  useEffect(() => {
    initializeInspection();
    
    // Listen for network changes
    const unsubscribe = networkService.addListener((connected) => {
      setIsOnline(connected);
      if (connected && session?.isOffline) {
        // Connection restored - offer to sync
        Alert.alert(
          'Connection Restored',
          'Would you like to analyze your pending images now?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Analyze Now', onPress: () => startBatchAnalysis() },
          ]
        );
      }
    });

    // Listen for sync progress
    const syncUnsubscribe = syncService.addProgressListener((progress) => {
      setSyncProgress(progress);
    });

    return () => {
      unsubscribe();
      syncUnsubscribe();
    };
  }, []);

  const initializeInspection = async () => {
    setCheckingConnection(true);
    
    try {
      // Initialize services
      await networkService.initialize();
      await offlineStorageService.initialize();
      
      // Load API key
      const storedKey = await offlineStorageService.getApiKey();
      if (storedKey) {
        geminiService.setApiKey(storedKey);
        setApiKey(storedKey);
      }
      
      // Check connection
      const connected = await networkService.checkConnection();
      setIsOnline(connected);
      
      if (!connected) {
        setShowOfflineModal(true);
      } else {
        // Test Gemini API connection
        const apiTest = await geminiService.testConnection();
        if (!apiTest.success) {
          Alert.alert(
            'API Connection Failed', 
            `Gemini API Error: ${apiTest.error}\n\nPlease check your API key and try again.`,
            [{ text: 'OK' }]
          );
        }
      }
      // API key is now pre-configured, no need to show modal
      
      // Get logged-in user info
      const currentUser = await authService.getStoredUser();
      const inspectorName = currentUser?.fullName || currentUser?.email || 'Inspector';
      const inspectorId = currentUser?._id || 'INS-001';
      
      // Create inspection session with inspector info
      const newSession = await offlineStorageService.createSession(
        property?._id || 'unknown',
        property?.name || 'Unknown Property',
        property?.address || '',
        inspectionType,
        !connected,
        inspectorName,
        inspectorId
      );
      setSession(newSession);
      
    } catch (error) {
      console.error('Error initializing inspection:', error);
      Alert.alert('Error', 'Failed to initialize inspection');
    } finally {
      setCheckingConnection(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }
    
    try {
      await offlineStorageService.saveApiKey(apiKey.trim());
      geminiService.setApiKey(apiKey.trim());
      setShowApiKeyModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const pickImage = async (useCamera: boolean) => {
    try {
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permission Required', `Please grant ${useCamera ? 'camera' : 'photo library'} access`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: false,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsMultipleSelection: processingMode === 'batch',
          });

      if (!result.canceled && result.assets) {
        for (const asset of result.assets) {
          await addImage(asset.uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const addImage = async (uri: string) => {
    if (!session) return;

    try {
      const pendingImage = await offlineStorageService.addImageToSession(session.id, uri);
      setImages(prev => [...prev, pendingImage]);

      // If online and one-by-one mode, analyze immediately
      if (isOnline && processingMode === 'one-by-one' && geminiService.isConfigured()) {
        await analyzeImage(pendingImage);
      }
    } catch (error) {
      console.error('Error adding image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  const analyzeImage = async (image: PendingImage) => {
    if (!session) return;

    setAnalyzing(true);
    setCurrentAnalysis(image.id);

    try {
      console.log('Starting AI analysis for image:', image.id);
      
      // Skip Cloudinary upload - use local URI directly
      const result = await geminiService.analyzeImage(
        image.localUri,
        session.inspectionType,
        `Property: ${session.propertyName}, Address: ${session.propertyAddress}`
      );

      if (result.success) {
        // Update image with findings (using local URI)
        await offlineStorageService.updateImage(session.id, image.id, {
          status: 'analyzed',
          findings: result.findings,
        });

        // Update local state
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'analyzed', findings: result.findings }
            : img
        ));
        setFindings(prev => [...prev, ...result.findings]);
      } else {
        Alert.alert('Analysis Failed', result.error || 'Failed to analyze image');
        await offlineStorageService.updateImage(session.id, image.id, {
          status: 'failed',
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', error.message || 'Failed to analyze image');
    } finally {
      setAnalyzing(false);
      setCurrentAnalysis('');
    }
  };

  const startBatchAnalysis = async () => {
    if (!session) return;
    
    const pendingImages = images.filter(img => img.status === 'pending');
    if (pendingImages.length === 0) {
      Alert.alert('No Images', 'No pending images to analyze');
      return;
    }

    if (!isOnline) {
      Alert.alert('Offline', 'Cannot analyze images while offline');
      return;
    }

    if (!geminiService.isConfigured()) {
      setShowApiKeyModal(true);
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress({ current: 0, total: pendingImages.length });

    try {
      for (let i = 0; i < pendingImages.length; i++) {
        const image = pendingImages[i];
        setCurrentAnalysis(image.id);
        setAnalysisProgress({ current: i + 1, total: pendingImages.length });

        console.log(`Analyzing image ${i + 1}/${pendingImages.length}...`);
        
        // Skip Cloudinary upload - analyze directly with local URI
        const result = await geminiService.analyzeImage(
          image.localUri,
          session.inspectionType,
          `Property: ${session.propertyName}, Address: ${session.propertyAddress}`
        );

        if (result.success) {
          await offlineStorageService.updateImage(session.id, image.id, {
            status: 'analyzed',
            findings: result.findings,
          });

          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'analyzed', findings: result.findings }
              : img
          ));
          setFindings(prev => [...prev, ...result.findings]);
        } else {
          await offlineStorageService.updateImage(session.id, image.id, {
            status: 'failed',
            error: result.error,
          });
        }
      }

      Alert.alert('Analysis Complete', `Analyzed ${pendingImages.length} images`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete analysis');
    } finally {
      setAnalyzing(false);
      setCurrentAnalysis('');
      setAnalysisProgress({ current: 0, total: 0 });
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!session) return;

    // Find if this image has associated findings
    const imageFindings = findings.filter(f => f.imageUri && images.find(img => img.id === imageId && img.localUri === f.imageUri));
    const hasFindings = imageFindings.length > 0;

    Alert.alert(
      'Delete Image',
      hasFindings 
        ? `Are you sure you want to delete this image? This will also remove ${imageFindings.length} associated finding(s).`
        : 'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Get the image URI before deleting
            const deletedImage = images.find(img => img.id === imageId);
            const deletedImageUri = deletedImage?.localUri;

            // Delete image from storage
            await offlineStorageService.deleteImage(session.id, imageId);
            
            // Remove image from state
            setImages(prev => prev.filter(img => img.id !== imageId));
            
            // Remove associated findings (findings that have this image's URI)
            if (deletedImageUri) {
              setFindings(prev => prev.filter(f => f.imageUri !== deletedImageUri));
            }
          },
        },
      ]
    );
  };

  const viewImageStatus = (image: PendingImage) => {
    setSelectedImageForStatus(image);
    setShowStatusModal(true);
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      structural: 'construct',
      electrical: 'flash',
      plumbing: 'water',
      safety: 'shield-checkmark',
      hvac: 'thermometer',
      exterior: 'home',
      interior: 'bed',
      appliances: 'hardware-chip',
      other: 'ellipsis-horizontal-circle',
    };
    return icons[category] || 'help-circle';
  };

  const generateReport = async () => {
    console.log('Preview Report clicked - generateReport called');
    if (!session) {
      console.log('No session found');
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image before generating a report');
      return;
    }

    // Check for pending images - only show prompt if there are many pending
    const pendingCount = images.filter(img => img.status === 'pending').length;
    const analyzedCount = images.filter(img => img.status === 'analyzed').length;
    
    // If most images are already analyzed, just go to report
    if (analyzedCount > 0 || pendingCount === 0) {
      // Show loading and go directly to report
      setAnalyzing(true);
      setCurrentAnalysis('Preparing report...');
      try {
        await navigateToReport();
      } finally {
        setAnalyzing(false);
        setCurrentAnalysis('');
      }
      return;
    }

    // Only prompt if ALL images are pending and we're online
    if (pendingCount > 0 && isOnline && analyzedCount === 0) {
      Alert.alert(
        'Images Not Analyzed',
        `Your ${pendingCount} image(s) haven't been analyzed yet. Analyze now for better report quality?`,
        [
          { text: 'Skip & View Report', style: 'cancel', onPress: async () => {
            setAnalyzing(true);
            setCurrentAnalysis('Preparing report...');
            try {
              await navigateToReport();
            } finally {
              setAnalyzing(false);
              setCurrentAnalysis('');
            }
          }},
          { text: 'Analyze Now', onPress: () => startBatchAnalysis() },
        ]
      );
      return;
    }

    // Default: just go to report
    setAnalyzing(true);
    setCurrentAnalysis('Preparing report...');
    try {
      await navigateToReport();
    } finally {
      setAnalyzing(false);
      setCurrentAnalysis('');
    }
  };

  const navigateToReport = async () => {
    console.log('navigateToReport called');
    
    // Calculate compliance score
    const complianceScore = calculateComplianceScore();
    const overallCondition = determineOverallCondition();
    
    console.log(`Compliance Score: ${complianceScore}, Overall Condition: ${overallCondition}`);
    console.log(`Findings count: ${findings.length}`);

    try {
      // Upload images to Cloudinary for report if not already uploaded
      const totalImages = findings.length;
      let uploadedCount = 0;
      
      const findingsWithCloudinaryUrls = await Promise.all(
        findings.map(async (finding, index) => {
          // Check if finding already has a Cloudinary URL
          if (finding.imageUri && finding.imageUri.includes('cloudinary.com')) {
            uploadedCount++;
            setCurrentAnalysis(`Preparing report... (${uploadedCount}/${totalImages})`);
            return finding;
          }
          
          // Find the corresponding image to get local URI
          const correspondingImage = images.find(img => 
            img.findings && img.findings.some(f => f.id === finding.id)
          );
          
          if (correspondingImage && correspondingImage.localUri) {
            setCurrentAnalysis(`Uploading image ${index + 1}/${totalImages} to Cloudinary...`);
            console.log(`Uploading image for finding ${finding.id} to Cloudinary...`);
            try {
              const uploadResult = await cloudinaryService.uploadImageWithRetry(
                correspondingImage.localUri,
                3,
                'nspire-inspections/reports'
              );
              
              if (uploadResult.success && uploadResult.url) {
                console.log(`Successfully uploaded image: ${uploadResult.url}`);
                uploadedCount++;
                setCurrentAnalysis(`Uploaded ${uploadedCount}/${totalImages} images...`);
                return {
                  ...finding,
                  imageUri: uploadResult.url
                };
              } else {
                console.warn(`Upload failed for finding ${finding.id}, using local URI`);
                uploadedCount++;
                setCurrentAnalysis(`Processing ${uploadedCount}/${totalImages} images...`);
                return {
                  ...finding,
                  imageUri: correspondingImage.localUri // Fallback to local URI
                };
              }
            } catch (uploadError) {
              console.warn(`Failed to upload image for finding ${finding.id}:`, uploadError);
              uploadedCount++;
              setCurrentAnalysis(`Processing ${uploadedCount}/${totalImages} images...`);
              return {
                ...finding,
                imageUri: correspondingImage.localUri // Fallback to local URI
              };
            }
          }
          
          uploadedCount++;
          setCurrentAnalysis(`Processing ${uploadedCount}/${totalImages} images...`);
          return finding;
        })
      );

      // Generate NSPIRE-compliant report
      const nspireReport = generateNSPIREReport({
        findings: findingsWithCloudinaryUrls,
        property,
        inspectorName: session?.inspectorName || 'Inspector',
        inspectorId: session?.inspectorId || 'INS-001',
        escortName: property?.contactName || property?.manager || '',
        startDate: session?.startTime ? new Date(session.startTime) : new Date(),
        endDate: new Date(),
        notes: session?.notes || '',
      });

      console.log('NSPIRE report generated successfully');

      // Save inspection to backend for Reports and Analytics sync
      setCurrentAnalysis('Saving inspection to database...');
      let savedInspectionId = null;
      
      try {
        // Create inspection with all the data
        const inspectionData = {
          property: property?._id,
          unit: selectedUnits && selectedUnits.length > 0 ? selectedUnits.join(', ') : undefined,
          inspectionType: 'ai',
          inspectionLevel: coverage || '100',
          scheduledDate: session?.startTime || new Date().toISOString(),
          notes: session?.notes || '',
        };

        console.log('Creating inspection with data:', JSON.stringify(inspectionData, null, 2));
        const createResult = await inspectionService.createInspection(inspectionData);
        console.log('Create inspection result:', JSON.stringify(createResult, null, 2));
        
        if (createResult.success && createResult.inspection?._id) {
          savedInspectionId = createResult.inspection._id;
          console.log('Inspection created with ID:', savedInspectionId);
          
          // Now complete the inspection with findings
          const completeData = {
            complianceScore: complianceScore,
            findings: findingsWithCloudinaryUrls.map(f => ({
              area: f.inspectionType || f.category || 'General',
              location: f.location || 'Property',
              severity: f.severity || 'minor',
              description: f.description || '',
              recommendation: f.recommendations?.join(', ') || '',
              imageUrl: f.imageUri || '',
              nspireCode: f.nspireCode || '',
            })),
            notes: session?.notes || `Inspection completed via AI. Coverage: ${coverage || '100%'}, Units inspected: ${totalUnits || 1}`,
          };
          
          console.log('Completing inspection with data:', JSON.stringify(completeData, null, 2));
          const completeResult = await inspectionService.completeInspection(savedInspectionId, completeData);
          console.log('Complete inspection result:', JSON.stringify(completeResult, null, 2));
          
          if (completeResult.success) {
            console.log('Inspection completed and saved successfully');
          } else {
            console.warn('Failed to complete inspection:', completeResult.message);
          }
        } else {
          console.warn('Failed to create inspection:', createResult.message);
        }
      } catch (saveError) {
        console.error('Failed to save inspection to backend:', saveError);
        // Continue to show report even if save fails
      }

      console.log('Navigating to NSPIREReport screen...');

      // Navigate to NSPIRE Report screen
      navigation.navigate('NSPIREReport', {
        report: nspireReport,
        inspectionData: {
          findings: findingsWithCloudinaryUrls,
          complianceScore,
          overallCondition,
          inspectorName: session?.inspectorName,
          notes: session?.notes,
          savedInspectionId,
        },
        property,
        selectedUnits,
        coverage,
      });
    } catch (error) {
      console.error('Error generating or navigating to report:', error);
      Alert.alert('Error', 'Failed to generate report. Please try again.');
    }
  };

  // Direct PDF Export function
  const [exportingPDF, setExportingPDF] = useState(false);

  const exportPDFDirectly = async () => {
    if (!session) return;

    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image before exporting PDF');
      return;
    }

    const pendingCount = images.filter(img => img.status === 'pending').length;
    if (pendingCount > 0 && isOnline) {
      Alert.alert(
        'Pending Images',
        `You have ${pendingCount} images that haven't been analyzed. Export anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Export Anyway', onPress: () => performPDFExport() },
          { text: 'Analyze First', onPress: () => startBatchAnalysis() },
        ]
      );
      return;
    }

    performPDFExport();
  };

  const performPDFExport = async () => {
    setExportingPDF(true);
    try {
      // Generate NSPIRE-compliant report
      const nspireReport = generateNSPIREReport({
        findings,
        property,
        inspectorName: session?.inspectorName || 'Inspector',
        inspectorId: session?.inspectorId || 'INS-001',
        escortName: property?.contactName || property?.manager || '',
        startDate: session?.startTime ? new Date(session.startTime) : new Date(),
        endDate: new Date(),
        notes: session?.notes || '',
      });

      // Generate and share PDF
      const result = await nspirePDFService.generateAndSharePDF(nspireReport);

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error: any) {
      Alert.alert('Export Failed', error.message || 'Failed to export PDF');
    } finally {
      setExportingPDF(false);
    }
  };

  const calculateComplianceScore = (): number => {
    if (findings.length === 0) return 100;

    let deductions = 0;
    for (const finding of findings) {
      switch (finding.severity) {
        case 'critical': deductions += 25; break;
        case 'major': deductions += 15; break;
        case 'minor': deductions += 5; break;
        case 'observation': deductions += 2; break;
      }
    }

    return Math.max(0, 100 - deductions);
  };

  const determineOverallCondition = (): string => {
    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const majorCount = findings.filter(f => f.severity === 'major').length;

    if (criticalCount > 0) return 'Critical';
    if (majorCount > 2) return 'Poor';
    if (majorCount > 0 || findings.length > 5) return 'Fair';
    if (findings.length === 0) return 'Excellent';
    return 'Good';
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

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getScaleColor = (scale: string): string => {
    switch (scale) {
      case 'present': return '#10B981';
      case 'needed': return '#F59E0B';
      case 'not_required': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getInspectionStatusColor = (status: string): string => {
    switch (status) {
      case 'inspected': return '#10B981';
      case 'partial': return '#F59E0B';
      case 'not_inspected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const renderImageItem = ({ item }: { item: PendingImage }) => (
    <View style={styles.imageCard}>
      <Image source={{ uri: item.localUri }} style={styles.thumbnail} />
      <View style={styles.imageInfo}>
        <View style={styles.imageHeader}>
          <Text style={styles.imageTime}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'analyzed' ? '#10B981' : 
              item.status === 'failed' ? '#EF4444' : '#F59E0B' }
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'analyzed' ? 'Analyzed' : 
               item.status === 'failed' ? 'Failed' : 'Pending'}
            </Text>
          </View>
        </View>
        
        {item.findings && item.findings.length > 0 && (
          <Text style={styles.findingsCount}>
            {item.findings.length} issue{item.findings.length !== 1 ? 's' : ''} found
          </Text>
        )}
        
        {currentAnalysis === item.id && (
          <View style={styles.analyzingIndicator}>
            <ActivityIndicator size="small" color="#0E7490" />
            <Text style={styles.analyzingText}>Analyzing...</Text>
          </View>
        )}
        
        {item.status === 'analyzed' && (
          <TouchableOpacity 
            style={styles.viewStatusButton}
            onPress={() => viewImageStatus(item)}
          >
            <Ionicons name="eye" size={14} color="#0E7490" />
            <Text style={styles.viewStatusText}>View Status</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteImage(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  const renderFindingItem = (finding: InspectionFinding, index: number) => (
    <View key={finding.id} style={styles.findingCard}>
      <View style={styles.findingHeader}>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(finding.severity) }]}>
          <Text style={styles.severityText}>{finding.severity.toUpperCase()}</Text>
        </View>
        <Text style={styles.findingCategory}>{finding.category}</Text>
        {/* Confidence/Accuracy Badge */}
        {finding.confidenceLevel !== undefined && (
          <View style={[styles.confidenceBadge, { backgroundColor: getScoreColor(finding.confidenceLevel) }]}>
            <Ionicons name="analytics" size={12} color="#FFFFFF" />
            <Text style={styles.confidenceText}>{finding.confidenceLevel}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.findingTitle}>{finding.title}</Text>
      <Text style={styles.findingDescription}>{finding.description}</Text>
      
      {/* NSPIRE Code Badge */}
      {finding.nspireCode && (
        <View style={styles.nspireCodeBadge}>
          <Ionicons name="document-text" size={12} color="#7C3AED" />
          <Text style={styles.nspireCodeText}>{finding.nspireCode}</Text>
        </View>
      )}
      
      {finding.recommendedAction && (
        <View style={styles.actionContainer}>
          <Ionicons name="build-outline" size={14} color="#0E7490" />
          <Text style={styles.actionText}>{finding.recommendedAction}</Text>
        </View>
      )}
    </View>
  );

  if (checkingConnection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Checking connection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Inspection</Text>
        <View style={styles.connectionIndicator}>
          <View style={[styles.connectionDot, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
          <Text style={styles.connectionText}>{isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Property Info */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property?.name || 'Unknown Property'}</Text>
          <Text style={styles.propertyAddress}>{property?.address || 'No address'}</Text>
        </View>

        {/* Inspection Type Selector */}
        <TouchableOpacity 
          style={styles.selectorButton}
          onPress={() => setShowTypeSelector(true)}
        >
          <View style={styles.selectorContent}>
            <Ionicons name="clipboard-outline" size={20} color="#0E7490" />
            <Text style={styles.selectorLabel}>Inspection Type</Text>
          </View>
          <View style={styles.selectorValue}>
            <Text style={styles.selectorValueText}>
              {INSPECTION_TYPES.find(t => t.id === inspectionType)?.name || 'General'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>

        {/* Processing Mode Toggle */}
        <View style={styles.modeToggle}>
          <Text style={styles.modeLabel}>Processing Mode:</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeButton, processingMode === 'one-by-one' && styles.modeButtonActive]}
              onPress={() => setProcessingMode('one-by-one')}
            >
              <Text style={[styles.modeButtonText, processingMode === 'one-by-one' && styles.modeButtonTextActive]}>
                One-by-One
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, processingMode === 'batch' && styles.modeButtonActive]}
              onPress={() => setProcessingMode('batch')}
            >
              <Text style={[styles.modeButtonText, processingMode === 'batch' && styles.modeButtonTextActive]}>
                Batch
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Capture Buttons */}
        <View style={styles.captureSection}>
          <Text style={styles.sectionTitle}>Capture Images</Text>
          <View style={styles.captureButtons}>
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={() => pickImage(true)}
              disabled={analyzing}
            >
              <Ionicons name="camera" size={28} color="#FFFFFF" />
              <Text style={styles.captureButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.captureButton, styles.galleryButton]}
              onPress={() => pickImage(false)}
              disabled={analyzing}
            >
              <Ionicons name="images" size={28} color="#FFFFFF" />
              <Text style={styles.captureButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Images List */}
        {images.length > 0 && (
          <View style={styles.imagesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Images ({images.length})</Text>
              {processingMode === 'batch' && images.some(img => img.status === 'pending') && (
                <TouchableOpacity 
                  style={styles.analyzeAllButton}
                  onPress={startBatchAnalysis}
                  disabled={analyzing || !isOnline}
                >
                  {analyzing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="flash" size={16} color="#FFFFFF" />
                      <Text style={styles.analyzeAllText}>Analyze All</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
            
            {analysisProgress.total > 0 && (
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(analysisProgress.current / analysisProgress.total) * 100}%` }
                  ]} 
                />
                <Text style={styles.progressText}>
                  {analysisProgress.current} / {analysisProgress.total}
                </Text>
              </View>
            )}

            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Findings Section */}
        {findings.length > 0 && (
          <View style={styles.findingsSection}>
            <Text style={styles.sectionTitle}>Findings ({findings.length})</Text>
            {findings.map((finding, index) => renderFindingItem(finding, index))}
          </View>
        )}

        {/* Report Actions */}
        <View style={styles.reportActionsContainer}>
          {/* Preview Report Button */}
          <TouchableOpacity 
            style={[styles.reportButton, styles.previewButton, images.length === 0 && styles.reportButtonDisabled]}
            onPress={generateReport}
            disabled={images.length === 0}
          >
            <Ionicons name="eye" size={22} color="#0E7490" />
            <Text style={styles.previewButtonText}>Preview Report</Text>
          </TouchableOpacity>

          {/* Export PDF Button */}
          <TouchableOpacity 
            style={[styles.reportButton, styles.exportButton, (images.length === 0 || exportingPDF) && styles.reportButtonDisabled]}
            onPress={exportPDFDirectly}
            disabled={images.length === 0 || exportingPDF}
          >
            {exportingPDF ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download" size={22} color="#FFFFFF" />
                <Text style={styles.reportButtonText}>Export PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Offline Modal */}
      <Modal visible={showOfflineModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.offlineIcon}>
              <Ionicons name="cloud-offline" size={48} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>No Internet Connection</Text>
            <Text style={styles.modalMessage}>
              You can continue capturing images offline. They will be automatically analyzed when connection is restored.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={async () => {
                  const connected = await networkService.checkConnection();
                  setIsOnline(connected);
                  if (connected) setShowOfflineModal(false);
                }}
              >
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => setShowOfflineModal(false)}
              >
                <Text style={styles.continueButtonText}>Continue Offline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* API Key Modal */}
      <Modal visible={showApiKeyModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gemini API Key Required</Text>
            <Text style={styles.modalMessage}>
              Enter your Google Gemini API key to enable AI-powered image analysis.
            </Text>
            <TextInput
              style={styles.apiKeyInput}
              placeholder="sk-..."
              placeholderTextColor="#9CA3AF"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.saveKeyButton} onPress={saveApiKey}>
              <Text style={styles.saveKeyButtonText}>Save API Key</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => setShowApiKeyModal(false)}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Inspection Type Selector Modal */}
      <Modal visible={showTypeSelector} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.typeSelectorContent}>
            <Text style={styles.typeSelectorTitle}>Select Inspection Type</Text>
            {INSPECTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeOption,
                  inspectionType === type.id && styles.typeOptionSelected
                ]}
                onPress={() => {
                  setInspectionType(type.id);
                  setShowTypeSelector(false);
                }}
              >
                <Text style={[
                  styles.typeOptionText,
                  inspectionType === type.id && styles.typeOptionTextSelected
                ]}>
                  {type.name}
                </Text>
                {inspectionType === type.id && (
                  <Ionicons name="checkmark" size={20} color="#0E7490" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.cancelTypeButton}
              onPress={() => setShowTypeSelector(false)}
            >
              <Text style={styles.cancelTypeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Status Detail Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.statusModalContent}>
            <View style={styles.statusModalHeader}>
              <Text style={styles.statusModalTitle}>Image Analysis Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {selectedImageForStatus && (
              <ScrollView style={styles.statusModalScroll}>
                {/* Image Preview */}
                <Image 
                  source={{ uri: selectedImageForStatus.localUri }} 
                  style={styles.statusModalImage}
                  resizeMode="cover"
                />

                {/* Analysis Info */}
                <View style={styles.statusInfoSection}>
                  <View style={styles.statusInfoRow}>
                    <Ionicons name="time" size={16} color="#6B7280" />
                    <Text style={styles.statusInfoLabel}>Captured:</Text>
                    <Text style={styles.statusInfoValue}>
                      {new Date(selectedImageForStatus.timestamp).toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.statusInfoRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#6B7280" />
                    <Text style={styles.statusInfoLabel}>Status:</Text>
                    <Text style={[
                      styles.statusInfoValue,
                      { color: selectedImageForStatus.status === 'analyzed' ? '#10B981' : 
                        selectedImageForStatus.status === 'failed' ? '#EF4444' : '#F59E0B' }
                    ]}>
                      {selectedImageForStatus.status.toUpperCase()}
                    </Text>
                  </View>

                  {selectedImageForStatus.findings && selectedImageForStatus.findings.length > 0 && (
                    <>
                      <View style={styles.statusInfoRow}>
                        <Ionicons name="alert-circle" size={16} color="#6B7280" />
                        <Text style={styles.statusInfoLabel}>Issues Found:</Text>
                        <Text style={styles.statusInfoValue}>
                          {selectedImageForStatus.findings.length}
                        </Text>
                      </View>

                      {/* Overall NSPIRE Compliance Score */}
                      {selectedImageForStatus.findings[0]?.inspectionScore && (
                        <View style={styles.statusInfoRow}>
                          <Ionicons name="star" size={16} color="#F59E0B" />
                          <Text style={styles.statusInfoLabel}>NSPIRE Score:</Text>
                          <Text style={[
                            styles.statusInfoValue,
                            { color: getScoreColor(selectedImageForStatus.findings[0].inspectionScore) }
                          ]}>
                            {selectedImageForStatus.findings[0].inspectionScore}/100
                          </Text>
                        </View>
                      )}

                      {/* Inspection Completion Status */}
                      {selectedImageForStatus.findings[0]?.inspectionStatus && (
                        <View style={styles.statusInfoRow}>
                          <Ionicons name="checkmark-done" size={16} color="#6B7280" />
                          <Text style={styles.statusInfoLabel}>Inspection Status:</Text>
                          <Text style={[
                            styles.statusInfoValue,
                            { color: getInspectionStatusColor(selectedImageForStatus.findings[0].inspectionStatus) }
                          ]}>
                            {selectedImageForStatus.findings[0].inspectionStatus.toUpperCase().replace('_', ' ')}
                          </Text>
                        </View>
                      )}

                      {/* Confidence Level */}
                      {selectedImageForStatus.findings[0]?.confidenceLevel && (
                        <View style={styles.statusInfoRow}>
                          <Ionicons name="analytics" size={16} color="#6B7280" />
                          <Text style={styles.statusInfoLabel}>Confidence:</Text>
                          <Text style={[
                            styles.statusInfoValue,
                            { color: getScoreColor(selectedImageForStatus.findings[0].confidenceLevel) }
                          ]}>
                            {selectedImageForStatus.findings[0].confidenceLevel}%
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {/* Inspection Verification Summary */}
                {selectedImageForStatus.findings && selectedImageForStatus.findings.length > 0 && 
                 selectedImageForStatus.findings[0].inspectionExplanation && (
                  <View style={styles.inspectionVerificationSection}>
                    <Text style={styles.inspectionVerificationTitle}>Inspection Completion Analysis</Text>
                    <Text style={styles.inspectionVerificationExplanation}>
                      {selectedImageForStatus.findings[0].inspectionExplanation}
                    </Text>
                  </View>
                )}

                {/* Findings by Category */}
                {selectedImageForStatus.findings && selectedImageForStatus.findings.length > 0 && (
                  <View style={styles.statusFindingsSection}>
                    <Text style={styles.statusSectionTitle}>INSPIRE Inspection Analysis</Text>
                    
                    {selectedImageForStatus.findings.map((finding, index) => (
                      <View key={finding.id} style={styles.statusFindingCard}>
                        <View style={styles.statusFindingHeader}>
                          <View style={styles.statusCategoryBadge}>
                            <Ionicons 
                              name={getCategoryIcon(finding.category) as any} 
                              size={16} 
                              color="#0E7490" 
                            />
                            <Text style={styles.statusCategoryText}>
                              {finding.category.toUpperCase()}
                            </Text>
                          </View>
                          <View style={[
                            styles.statusSeverityBadge,
                            { backgroundColor: getSeverityColor(finding.severity) }
                          ]}>
                            <Text style={styles.statusSeverityText}>
                              {finding.severity.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.statusFindingTitle}>{finding.title}</Text>
                        <Text style={styles.statusFindingDescription}>{finding.description}</Text>

                        {/* NSPIRE Code */}
                        {finding.nspireCode && (
                          <View style={styles.statusFindingDetail}>
                            <Ionicons name="document-text" size={14} color="#7C3AED" />
                            <Text style={styles.statusFindingDetailText}>
                              NSPIRE Code: {finding.nspireCode}
                            </Text>
                          </View>
                        )}

                        {finding.location && (
                          <View style={styles.statusFindingDetail}>
                            <Ionicons name="location" size={14} color="#6B7280" />
                            <Text style={styles.statusFindingDetailText}>
                              Location: {finding.location}
                            </Text>
                          </View>
                        )}

                        {finding.recommendedAction && (
                          <View style={styles.statusFindingDetail}>
                            <Ionicons name="build" size={14} color="#0E7490" />
                            <Text style={styles.statusFindingDetailText}>
                              Action: {finding.recommendedAction}
                            </Text>
                          </View>
                        )}

                        {finding.estimatedCost && (
                          <View style={styles.statusFindingDetail}>
                            <Ionicons name="cash" size={14} color="#10B981" />
                            <Text style={styles.statusFindingDetailText}>
                              Est. Cost: {finding.estimatedCost}
                            </Text>
                          </View>
                        )}

                        {/* NSPIRE Inspection Quality Metrics */}
                        <View style={styles.nspireMetricsSection}>
                          <Text style={styles.nspireMetricsTitle}>Inspection Quality Assessment</Text>
                          
                          <View style={styles.nspireMetricRow}>
                            <Text style={styles.nspireMetricLabel}>Context/Orientation:</Text>
                            <View style={[styles.nspireMetricBadge, { backgroundColor: getQualityColor(finding.contextOrientation) }]}>
                              <Text style={styles.nspireMetricText}>{finding.contextOrientation?.toUpperCase() || 'N/A'}</Text>
                            </View>
                          </View>

                          <View style={styles.nspireMetricRow}>
                            <Text style={styles.nspireMetricLabel}>Clarity & Detail:</Text>
                            <View style={[styles.nspireMetricBadge, { backgroundColor: getQualityColor(finding.clarityDetail) }]}>
                              <Text style={styles.nspireMetricText}>{finding.clarityDetail?.toUpperCase() || 'N/A'}</Text>
                            </View>
                          </View>

                          <View style={styles.nspireMetricRow}>
                            <Text style={styles.nspireMetricLabel}>Scale Reference:</Text>
                            <View style={[styles.nspireMetricBadge, { backgroundColor: getScaleColor(finding.scaleReference) }]}>
                              <Text style={styles.nspireMetricText}>{finding.scaleReference?.toUpperCase().replace('_', ' ') || 'N/A'}</Text>
                            </View>
                          </View>

                          <View style={styles.nspireMetricRow}>
                            <Text style={styles.nspireMetricLabel}>Metadata Complete:</Text>
                            <View style={[styles.nspireMetricBadge, { backgroundColor: finding.metadataComplete ? '#10B981' : '#EF4444' }]}>
                              <Text style={styles.nspireMetricText}>{finding.metadataComplete ? 'YES' : 'NO'}</Text>
                            </View>
                          </View>

                          {finding.inspectionScore !== undefined && (
                            <View style={styles.nspireScoreRow}>
                              <Text style={styles.nspireScoreLabel}>Inspection Score:</Text>
                              <Text style={[styles.nspireScoreValue, { color: getScoreColor(finding.inspectionScore) }]}>
                                {finding.inspectionScore}/100
                              </Text>
                            </View>
                          )}

                          {finding.complianceNotes && finding.complianceNotes.length > 0 && (
                            <View style={styles.complianceNotesSection}>
                              <Text style={styles.complianceNotesTitle}>Compliance Notes:</Text>
                              {finding.complianceNotes.map((note, noteIndex) => (
                                <View key={noteIndex} style={styles.complianceNoteItem}>
                                  <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                                  <Text style={styles.complianceNoteText}>{note}</Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* No Findings */}
                {selectedImageForStatus.status === 'analyzed' && 
                 (!selectedImageForStatus.findings || selectedImageForStatus.findings.length === 0) && (
                  <View style={styles.statusNoFindings}>
                    <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                    <Text style={styles.statusNoFindingsTitle}>No Issues Found</Text>
                    <Text style={styles.statusNoFindingsText}>
                      This image passed inspection with no deficiencies identified.
                    </Text>
                  </View>
                )}

                {/* Error Message */}
                {selectedImageForStatus.status === 'failed' && selectedImageForStatus.error && (
                  <View style={styles.statusErrorSection}>
                    <Ionicons name="warning" size={24} color="#EF4444" />
                    <Text style={styles.statusErrorTitle}>Analysis Failed</Text>
                    <Text style={styles.statusErrorText}>{selectedImageForStatus.error}</Text>
                  </View>
                )}
              </ScrollView>
            )}

            <TouchableOpacity 
              style={styles.statusModalCloseButton}
              onPress={() => setShowStatusModal(false)}
            >
              <Text style={styles.statusModalCloseText}>Close</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
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
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
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
  },
  selectorButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
  },
  selectorValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
  },
  modeToggle: {
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
  modeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  modeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#0E7490',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  captureSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryButton: {
    backgroundColor: '#6366F1',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imagesSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyzeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  analyzeAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0E7490',
    borderRadius: 12,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  imageCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  imageInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  imageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  imageTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  findingsCount: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  analyzingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  analyzingText: {
    fontSize: 12,
    color: '#0E7490',
    marginLeft: 6,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  findingsSection: {
    marginBottom: 20,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  findingCategory: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
    flex: 1,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
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
  nspireCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  nspireCodeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 8,
  },
  actionText: {
    flex: 1,
    fontSize: 12,
    color: '#0E7490',
    marginLeft: 8,
    lineHeight: 16,
  },
  reportActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  reportButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  previewButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0E7490',
  },
  exportButton: {
    backgroundColor: '#0E7490',
  },
  reportButtonDisabled: {
    backgroundColor: '#9CA3AF',
    borderColor: '#9CA3AF',
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  previewButtonText: {
    color: '#0E7490',
    fontSize: 14,
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
    maxWidth: 340,
    alignItems: 'center',
  },
  offlineIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  continueButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  apiKeyInput: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 16,
  },
  saveKeyButton: {
    width: '100%',
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveKeyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  typeSelectorContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
  },
  typeSelectorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  typeOptionSelected: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  typeOptionText: {
    fontSize: 15,
    color: '#1F2937',
  },
  typeOptionTextSelected: {
    fontWeight: '600',
    color: '#0E7490',
  },
  cancelTypeButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelTypeText: {
    fontSize: 15,
    color: '#6B7280',
  },
  // Status Modal Styles
  viewStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    gap: 4,
  },
  viewStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
  },
  statusModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 0,
    width: '95%',
    maxWidth: 400,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  statusModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusModalScroll: {
    flex: 1,
  },
  statusModalImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  statusInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    minWidth: 70,
  },
  statusInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusFindingsSection: {
    padding: 20,
  },
  statusSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  statusFindingCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusFindingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  statusCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0E7490',
  },
  statusSeverityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusSeverityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusFindingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  statusFindingDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  statusFindingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  statusFindingDetailText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  statusNoFindings: {
    alignItems: 'center',
    padding: 40,
  },
  statusNoFindingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 12,
    marginBottom: 8,
  },
  statusNoFindingsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusErrorSection: {
    alignItems: 'center',
    padding: 20,
  },
  statusErrorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 8,
    marginBottom: 8,
  },
  statusErrorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusModalCloseButton: {
    backgroundColor: '#0E7490',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  statusModalCloseText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // NSPIRE Metrics Styles
  nspireMetricsSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nspireMetricsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  nspireMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nspireMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  nspireMetricBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  nspireMetricText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nspireScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  nspireScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  nspireScoreValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  complianceNotesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  complianceNotesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  complianceNoteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 6,
  },
  complianceNoteText: {
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
    lineHeight: 16,
  },
  // Inspection Verification Styles
  inspectionVerificationSection: {
    padding: 20,
    backgroundColor: '#F0F9FF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inspectionVerificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    marginBottom: 8,
  },
  inspectionVerificationExplanation: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 18,
  },
});
