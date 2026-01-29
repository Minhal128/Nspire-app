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
import { nspirePDFService } from '../services/nspirePDFService';

const { width } = Dimensions.get('window');

interface AIInspectionScreenProps {
  navigation: any;
  route: any;
}

type InspectionMode = 'one-by-one' | 'batch';

// Room definitions for Inside and Outside
const INSIDE_ROOMS = [
  'Basement', 'Business Space', 'Classroom', 'Closet/Utility', 'Day Care',
  'Halls/Corridors/Stairs', 'Kitchen', 'Laundry Room', 'Leased Commercial',
  'Library', 'Lobby', 'Maintenance Shop', 'Mechanical Room', 'Office',
  'Other Community Space', 'Parking Garage', 'Patio/Porch/Balcony',
  'Receptional Room', 'Recreation Room', 'Refuse/Compactor Room', 'Restrooms',
  'Salon', 'Store', 'Workout Room'
];

const OUTSIDE_ROOMS = [
  'Building Site N', 'Building Site S', 'Building Site W', 'Building Site E',
  'Courtyard', 'Exterior E', 'Exterior N', 'Exterior S', 'Exterior W',
  'Garage/Carport', 'Grounds', 'Other', 'Parking Lot/Driveway/Roads',
  'Patio/Porch/Balcony', 'Playground', 'Roof (flat)', 'Sidewalks/Walkways/Stoops'
];

interface RoomImages {
  room: string;
  category: 'inside' | 'outside';
  images: string[];
  analyzed: boolean;
  savedToCloud: boolean;
  cloudinaryUrls?: string[];
}

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

  // Room capture state
  const [showRoomSelectionModal, setShowRoomSelectionModal] = useState(false);
  const [roomCategory, setRoomCategory] = useState<'inside' | 'outside'>('inside');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomImages, setRoomImages] = useState<RoomImages[]>([]);
  const [currentRoomPhotos, setCurrentRoomPhotos] = useState<string[]>([]);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [showPostSaveOptions, setShowPostSaveOptions] = useState(false);
  const [savingToCloud, setSavingToCloud] = useState(false);
  const [analysisTimeEstimate, setAnalysisTimeEstimate] = useState<string>('');
  const [showAnalysisSuccessModal, setShowAnalysisSuccessModal] = useState(false);
  const [analysisSuccessData, setAnalysisSuccessData] = useState<{ count: number; rooms: string[] }>({ count: 0, rooms: [] });
  const [showYellowPopup, setShowYellowPopup] = useState(false);

  // Custom rooms state
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Background upload queue
  const [uploadQueue, setUploadQueue] = useState<{ photoUri: string; room: string; category: 'inside' | 'outside' }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 });

  // SECRET: Background analysis queue (analyzes previous room while user captures next room)
  const [backgroundAnalysisQueue, setBackgroundAnalysisQueue] = useState<PendingImage[]>([]);
  const [isBackgroundAnalyzing, setIsBackgroundAnalyzing] = useState(false);
  const [backgroundAnalysisRoom, setBackgroundAnalysisRoom] = useState<string>('');
  const backgroundQueueRef = useRef<PendingImage[]>([]);
  const backgroundRoomRef = useRef<string>('');

  // UI state
  const [analyzing, setAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);

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
          // Show user-friendly error message instead of technical details
          const userFriendlyMessage = apiTest.error?.includes('429') || apiTest.error?.includes('quota') || apiTest.error?.includes('rate')
            ? 'AI service is currently experiencing high traffic. Please wait a moment and try again.'
            : apiTest.error?.includes('API Error')
              ? 'AI service is temporarily unavailable. Please try again in a few moments.'
              : 'Unable to connect to AI service. Please check your internet connection.';

          Alert.alert(
            'AI Service Busy',
            userFriendlyMessage,
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

  // Room capture functions
  const handleCameraPress = () => {
    setShowYellowPopup(true);
    setRoomCategory('inside');
    setSelectedRoom(null);
    setCurrentRoomPhotos([]);
  };

  const handleRoomSelect = async (room: string) => {
    setSelectedRoom(room);
    await captureRoomPhoto();
  };

  const captureRoomPhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please grant camera access');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCurrentRoomPhotos(prev => [...prev, result.assets[0].uri]);
        setShowCameraPreview(true);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const addMorePhotos = async () => {
    await captureRoomPhoto();
  };

  // Background upload processor
  useEffect(() => {
    const processUploadQueue = async () => {
      if (isUploading || uploadQueue.length === 0) return;

      setIsUploading(true);
      const currentQueue = [...uploadQueue];

      for (let i = 0; i < currentQueue.length; i++) {
        const item = currentQueue[i];
        setUploadProgress({ completed: i, total: currentQueue.length });

        try {
          const result = await cloudinaryService.uploadImage(item.photoUri);
          if (result.success && result.url) {
            // Update roomImages with cloudinary URL
            setRoomImages(prev => {
              const roomIndex = prev.findIndex(r => r.room === item.room && r.category === item.category);
              if (roomIndex >= 0) {
                const updated = [...prev];
                updated[roomIndex] = {
                  ...updated[roomIndex],
                  savedToCloud: true,
                  cloudinaryUrls: [...(updated[roomIndex].cloudinaryUrls || []), result.url!],
                };
                return updated;
              }
              return prev;
            });

            // Update image in main images array with cloudinary URL
            setImages(prev => prev.map(img =>
              img.localUri === item.photoUri
                ? { ...img, cloudinaryUrl: result.url }
                : img
            ));
          }
        } catch (error) {
          console.error('Background upload error:', error);
        }
      }

      setUploadQueue([]);
      setIsUploading(false);
      setUploadProgress({ completed: 0, total: 0 });
    };

    processUploadQueue();
  }, [uploadQueue, isUploading]);

  // SECRET: Background analysis processor - analyzes previous room while user captures next room
  useEffect(() => {
    // Keep refs in sync
    backgroundQueueRef.current = backgroundAnalysisQueue;
    backgroundRoomRef.current = backgroundAnalysisRoom;
  }, [backgroundAnalysisQueue, backgroundAnalysisRoom]);

  useEffect(() => {
    let isCancelled = false;

    const processBackgroundAnalysis = async () => {
      if (isBackgroundAnalyzing) return;
      if (backgroundQueueRef.current.length === 0) return;
      if (!isOnline || !session) return;
      if (!geminiService.isConfigured()) return;

      setIsBackgroundAnalyzing(true);
      const imagesToAnalyze = [...backgroundQueueRef.current];
      const roomName = backgroundRoomRef.current;

      console.log(`[AUTO-ANALYZE] Starting analysis for ${roomName}: ${imagesToAnalyze.length} images`);

      for (const image of imagesToAnalyze) {
        if (isCancelled) break;

        try {
          // Skip if already analyzed
          if (image.status === 'analyzed') continue;

          console.log(`[AUTO-ANALYZE] Analyzing image ${imagesToAnalyze.indexOf(image) + 1}/${imagesToAnalyze.length}: ${image.id}`);

          const result = await geminiService.analyzeImage(
            image.localUri,
            session.inspectionType,
            `Property: ${session.propertyName}, Address: ${session.propertyAddress}, Room: ${image.room || roomName}`
          );

          if (result.success && !isCancelled) {
            // Add room info to findings
            const findingsWithRoom = result.findings.map(f => ({
              ...f,
              location: image.room ? `${image.room} - ${f.location}` : f.location,
            }));

            // Update image with findings silently
            setImages(prev => prev.map(img =>
              img.id === image.id
                ? {
                  ...img,
                  status: 'analyzed' as const,
                  findings: findingsWithRoom,
                  notes: result.summary,
                  analyzedAt: new Date().toISOString(),
                }
                : img
            ));

            // Add findings to global findings list
            setFindings(prev => [...prev, ...findingsWithRoom]);

            // Update storage with findings
            if (session) {
              await offlineStorageService.updateImage(session.id, image.id, {
                status: 'analyzed',
                findings: findingsWithRoom,
              }).catch(err => console.log('Storage update error:', err));
            }

            // Update room record
            setRoomImages(prev => prev.map(r =>
              r.room === roomName
                ? { ...r, analyzed: true }
                : r
            ));

            console.log(`[AUTO-ANALYZE] ✓ Analyzed: ${image.id} in ${roomName} - ${result.findings.length} findings`);
          } else if (!result.success) {
            console.error(`[AUTO-ANALYZE] ✗ Failed: ${image.id}`, result.error);
            // Mark as failed
            setImages(prev => prev.map(img =>
              img.id === image.id
                ? { ...img, status: 'failed' as const, error: result.error }
                : img
            ));
          }
        } catch (error) {
          console.error(`[AUTO-ANALYZE] ✗ Error analyzing ${image.id}:`, error);
          // Mark as failed
          setImages(prev => prev.map(img =>
            img.id === image.id
              ? { ...img, status: 'failed' as const, error: String(error) }
              : img
          ));
        }
      }

      if (!isCancelled) {
        setBackgroundAnalysisQueue([]);
        setIsBackgroundAnalyzing(false);
        setBackgroundAnalysisRoom('');

        const succeededCount = imagesToAnalyze.filter(img =>
          images.find(i => i.id === img.id && i.status === 'analyzed')
        ).length;

        console.log(`[AUTO-ANALYZE] ✓ Complete for ${roomName}: ${succeededCount}/${imagesToAnalyze.length} analyzed`);
      }
    };

    // Small delay to ensure state is settled
    const timer = setTimeout(() => {
      processBackgroundAnalysis();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [backgroundAnalysisQueue.length, isBackgroundAnalyzing, isOnline, session, images]);

  const saveRoomPhotos = async () => {
    if (!selectedRoom || currentRoomPhotos.length === 0) return;

    // INSTANT: No loading spinner, immediate state update
    const newRoomRecord: RoomImages = {
      room: selectedRoom,
      category: roomCategory,
      images: currentRoomPhotos,
      analyzed: false,
      savedToCloud: false,
      cloudinaryUrls: [],
    };

    // Update room images immediately (sync)
    setRoomImages(prev => {
      const existingIndex = prev.findIndex(r => r.room === selectedRoom && r.category === roomCategory);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          images: [...updated[existingIndex].images, ...currentRoomPhotos],
        };
        return updated;
      }
      return [...prev, newRoomRecord];
    });

    // Create pending images instantly in memory (no await, no storage write)
    const newPendingImages: PendingImage[] = currentRoomPhotos.map((photoUri, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      localUri: photoUri,
      propertyId: session?.propertyId || property?._id || '',
      inspectionId: session?.id || '',
      inspectionType: session?.inspectionType || inspectionType,
      timestamp: new Date().toISOString(),
      status: 'pending' as const,
      retryCount: 0,
      room: selectedRoom,
      roomCategory: roomCategory,
    }));

    // Add to images state immediately
    setImages(prev => [...prev, ...newPendingImages]);

    // Show post-save options IMMEDIATELY
    setShowCameraPreview(false);
    setShowPostSaveOptions(true);

    // Calculate analysis time estimate
    const totalImages = images.length + currentRoomPhotos.length;
    if (totalImages > 50) {
      const minutes = Math.ceil(totalImages / 20);
      setAnalysisTimeEstimate(`For better accuracy with ${totalImages} images, analysis may take approximately ${minutes} minutes`);
    } else {
      setAnalysisTimeEstimate('');
    }

    // Queue for background: storage write + Cloudinary upload (non-blocking)
    const queueItems = currentRoomPhotos.map(photoUri => ({
      photoUri,
      room: selectedRoom,
      category: roomCategory,
    }));
    setUploadQueue(prev => [...prev, ...queueItems]);

    // Background: persist to storage (fire and forget)
    if (session) {
      Promise.all(
        currentRoomPhotos.map(photoUri =>
          offlineStorageService.addImageToSession(
            session.id,
            photoUri,
            undefined,
            undefined,
            selectedRoom,
            roomCategory
          ).catch(err => console.log('Background storage write error:', err))
        )
      ).catch(() => { });
    }
  };

  // Custom room functions
  const addCustomRoom = () => {
    if (!newRoomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    const trimmedName = newRoomName.trim();
    if (customRooms.includes(trimmedName)) {
      Alert.alert('Error', 'This room already exists');
      return;
    }

    setCustomRooms(prev => [...prev, trimmedName]);
    setNewRoomName('');
  };

  const removeCustomRoom = (roomName: string) => {
    setCustomRooms(prev => prev.filter(r => r !== roomName));
  };

  const finishAddingRooms = () => {
    setShowAddRoomModal(false);
    setNewRoomName('');
  };

  const handleAnalyzeRoom = async () => {
    setShowPostSaveOptions(false);
    setShowRoomSelectionModal(false);
    setCurrentRoomPhotos([]);
    setSelectedRoom(null);

    // Start batch analysis for all pending images
    await startBatchAnalysis();
  };

  const handleMoveToNextRoom = () => {
    // Just close the modal and reset state - no background analysis
    setShowPostSaveOptions(false);
    setCurrentRoomPhotos([]);
    setSelectedRoom(null);
    // Stay in modal to select next room
  };

  const getCompletedRooms = (category: 'inside' | 'outside') => {
    return roomImages
      .filter(r => r.category === category)
      .map(r => r.room);
  };

  const getRoomPhotoCount = (room: string, category: 'inside' | 'outside') => {
    const roomRecord = roomImages.find(r => r.room === room && r.category === category);
    return roomRecord?.images.length || 0;
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

  const addImage = async (uri: string, room?: string, category?: 'inside' | 'outside') => {
    if (!session) return;

    try {
      const pendingImage = await offlineStorageService.addImageToSession(
        session.id,
        uri,
        undefined,
        undefined,
        room,
        category
      );
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

    // Get all pending images (not currently being analyzed)
    const pendingImages = images.filter(img => img.status === 'pending');

    if (pendingImages.length === 0) {
      const alreadyAnalyzed = images.filter(img => img.status === 'analyzed').length;
      if (alreadyAnalyzed > 0) {
        // All images already analyzed
        const analyzedRooms = [...new Set(images.filter(img => img.status === 'analyzed' && img.room).map(img => img.room!))];
        setAnalysisSuccessData({ count: alreadyAnalyzed, rooms: analyzedRooms });
        setShowAnalysisSuccessModal(true);
      } else {
        Alert.alert('No Images', 'No images to analyze. Please capture some photos first.');
      }
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
      const analyzedRooms: string[] = [];

      for (let i = 0; i < pendingImages.length; i++) {
        const image = pendingImages[i];
        setCurrentAnalysis(image.id);
        setAnalysisProgress({ current: i + 1, total: pendingImages.length });

        console.log(`Analyzing image ${i + 1}/${pendingImages.length}...`);

        // Track room for this image
        if (image.room && !analyzedRooms.includes(image.room)) {
          analyzedRooms.push(image.room);
        }

        // Skip Cloudinary upload - analyze directly with local URI
        const result = await geminiService.analyzeImage(
          image.localUri,
          session.inspectionType,
          `Property: ${session.propertyName}, Address: ${session.propertyAddress}, Room: ${image.room || 'General'}`
        );

        if (result.success) {
          // Add room info to each finding
          const findingsWithRoom = result.findings.map(f => ({
            ...f,
            location: image.room ? `${image.room} - ${f.location}` : f.location,
          }));

          await offlineStorageService.updateImage(session.id, image.id, {
            status: 'analyzed',
            findings: findingsWithRoom,
          });

          setImages(prev => prev.map(img =>
            img.id === image.id
              ? { ...img, status: 'analyzed', findings: findingsWithRoom }
              : img
          ));
          setFindings(prev => [...prev, ...findingsWithRoom]);
        } else {
          await offlineStorageService.updateImage(session.id, image.id, {
            status: 'failed',
            error: result.error,
          });
        }
      }

      // Show success modal
      setAnalysisSuccessData({ count: pendingImages.length, rooms: analyzedRooms });
      setShowAnalysisSuccessModal(true);
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
          {
            text: 'Skip & View Report', style: 'cancel', onPress: async () => {
              setAnalyzing(true);
              setCurrentAnalysis('Preparing report...');
              try {
                await navigateToReport();
              } finally {
                setAnalyzing(false);
                setCurrentAnalysis('');
              }
            }
          },
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
              recommendation: f.recommendedAction || '',
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

  const renderImageItem = ({ item }: { item: PendingImage }) => {
    // Format date safely
    const getTimeDisplay = () => {
      try {
        if (!item.timestamp) return 'Just now';
        const date = new Date(item.timestamp);
        if (isNaN(date.getTime())) return 'Just now';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return 'Just now';
      }
    };

    return (
      <View style={styles.imageCard}>
        <Image source={{ uri: item.localUri }} style={styles.thumbnail} />
        <View style={styles.imageInfo}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageTime}>
              {item.room ? `${item.room}` : getTimeDisplay()}
            </Text>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: item.status === 'analyzed' ? '#10B981' :
                  item.status === 'failed' ? '#EF4444' : '#F59E0B'
              }
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


        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteImage(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

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

      {/* Background Upload Indicator */}
      {isUploading && uploadProgress.total > 0 && (
        <View style={styles.uploadIndicator}>
          <ActivityIndicator size="small" color="#0E7490" />
          <Text style={styles.uploadIndicatorText}>
            Uploading to cloud: {uploadProgress.completed + 1}/{uploadProgress.total}
          </Text>
        </View>
      )}

      {/* Background Analysis runs secretly - no visible indicator */}

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

          {/* Room Summary */}
          {roomImages.length > 0 && (
            <View style={styles.roomSummary}>
              <Text style={styles.roomSummaryTitle}>Captured Rooms: {roomImages.length}</Text>
              <View style={styles.roomChips}>
                {roomImages.map((room, index) => (
                  <View key={index} style={styles.roomChip}>
                    <Text style={styles.roomChipText}>{room.room}</Text>
                    <Text style={styles.roomChipCount}>{room.images.length} photos</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.captureButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCameraPress}
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

        {/* Findings Section - Grouped by Room */}
        {findings.length > 0 && (
          <View style={styles.findingsSection}>
            <Text style={styles.sectionTitle}>Findings ({findings.length})</Text>

            {/* Group findings by room from images */}
            {(() => {
              // Get unique rooms from analyzed images
              const roomsWithFindings = images
                .filter(img => img.status === 'analyzed' && img.room)
                .reduce((acc, img) => {
                  if (img.room && !acc.includes(img.room)) {
                    acc.push(img.room);
                  }
                  return acc;
                }, [] as string[]);

              // General findings (no room assigned)
              const generalImages = images.filter(img => img.status === 'analyzed' && !img.room);

              return (
                <>
                  {roomsWithFindings.map((room) => {
                    const roomImgs = images.filter(img => img.room === room && img.status === 'analyzed');
                    const roomFindings = roomImgs.flatMap(img => img.findings || []);

                    if (roomFindings.length === 0) return null;

                    return (
                      <View key={room} style={styles.roomFindingsSection}>
                        <View style={styles.roomFindingsHeader}>
                          <Ionicons name="location" size={18} color="#0E7490" />
                          <Text style={styles.roomFindingsTitle}>{room}</Text>
                          <View style={styles.roomFindingsCount}>
                            <Text style={styles.roomFindingsCountText}>
                              {roomFindings.length} issue{roomFindings.length !== 1 ? 's' : ''}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.roomFindingsContent}>
                          {roomFindings.map((finding, index) => renderFindingItem(finding, index))}
                        </View>
                      </View>
                    );
                  })}

                  {/* General findings without room */}
                  {generalImages.length > 0 && generalImages.some(img => img.findings && img.findings.length > 0) && (
                    <View style={styles.roomFindingsSection}>
                      <View style={styles.roomFindingsHeader}>
                        <Ionicons name="images" size={18} color="#6B7280" />
                        <Text style={styles.roomFindingsTitle}>General</Text>
                      </View>
                      <View style={styles.roomFindingsContent}>
                        {generalImages.flatMap(img => img.findings || []).map((finding, index) =>
                          renderFindingItem(finding, index)
                        )}
                      </View>
                    </View>
                  )}
                </>
              );
            })()}
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

      {/* Room Selection Modal */}
      <Modal visible={showRoomSelectionModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.roomModalContainer}>
          {/* Room Modal Header */}
          <View style={styles.roomModalHeader}>
            <TouchableOpacity onPress={() => {
              setShowRoomSelectionModal(false);
              setSelectedRoom(null);
              setCurrentRoomPhotos([]);
              setShowCameraPreview(false);
              setShowPostSaveOptions(false);
            }}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.roomModalTitle}>
              {showCameraPreview ? `Capture: ${selectedRoom}` : showPostSaveOptions ? 'Photos Saved' : 'Select Area'}
            </Text>
            <TouchableOpacity onPress={() => {
              setShowRoomSelectionModal(false);
              setSelectedRoom(null);
              setCurrentRoomPhotos([]);
            }}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {!showCameraPreview && !showPostSaveOptions && (
            <>
              {/* Inside/Outside Toggle */}
              <View style={styles.categoryToggle}>
                <TouchableOpacity
                  style={[styles.categoryButton, roomCategory === 'inside' && styles.categoryButtonActive]}
                  onPress={() => setRoomCategory('inside')}
                >
                  <Ionicons name="home" size={20} color={roomCategory === 'inside' ? '#FFFFFF' : '#0E7490'} />
                  <Text style={[styles.categoryButtonText, roomCategory === 'inside' && styles.categoryButtonTextActive]}>
                    Inside
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.categoryButton, roomCategory === 'outside' && styles.categoryButtonActive]}
                  onPress={() => setRoomCategory('outside')}
                >
                  <Ionicons name="leaf" size={20} color={roomCategory === 'outside' ? '#FFFFFF' : '#0E7490'} />
                  <Text style={[styles.categoryButtonText, roomCategory === 'outside' && styles.categoryButtonTextActive]}>
                    Outside
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Section Switcher Label with Add Room Button */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionSwitcherLabel}>Section Switcher</Text>
                <TouchableOpacity
                  style={styles.addRoomButton}
                  onPress={() => setShowAddRoomModal(true)}
                >
                  <Ionicons name="add-circle" size={20} color="#0E7490" />
                  <Text style={styles.addRoomButtonText}>Room</Text>
                  {customRooms.length > 0 && (
                    <View style={styles.roomCounterBadge}>
                      <Text style={styles.roomCounterText}>{customRooms.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Room Grid */}
              <ScrollView style={styles.roomGrid} showsVerticalScrollIndicator={false}>
                <View style={styles.roomButtonsContainer}>
                  {/* Default rooms + Custom rooms */}
                  {[...(roomCategory === 'inside' ? INSIDE_ROOMS : OUTSIDE_ROOMS), ...customRooms].map((room, index) => {
                    const completedRooms = getCompletedRooms(roomCategory);
                    const isCompleted = completedRooms.includes(room);
                    const photoCount = getRoomPhotoCount(room, roomCategory);

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.roomButton,
                          isCompleted && styles.roomButtonCompleted
                        ]}
                        onPress={() => handleRoomSelect(room)}
                      >
                        <Text style={[
                          styles.roomButtonText,
                          isCompleted && styles.roomButtonTextCompleted
                        ]}>
                          {room}
                        </Text>
                        {isCompleted && (
                          <View style={styles.roomPhotoCountBadge}>
                            <Text style={styles.roomPhotoCountText}>{photoCount}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </>
          )}

          {/* Camera Preview */}
          {showCameraPreview && (
            <View style={styles.cameraPreviewContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                {currentRoomPhotos.map((photo, index) => (
                  <View key={index} style={styles.previewPhotoContainer}>
                    <Image source={{ uri: photo }} style={styles.previewPhoto} />
                    <View style={styles.photoIndex}>
                      <Text style={styles.photoIndexText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.addMoreButton} onPress={addMorePhotos}>
                  <Ionicons name="add-circle" size={40} color="#0E7490" />
                  <Text style={styles.addMoreText}>Add More</Text>
                </TouchableOpacity>
              </ScrollView>

              <Text style={styles.photoCountLabel}>{selectedRoom}: {currentRoomPhotos.length} Photos</Text>

              <View style={styles.saveButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelPhotoButton}
                  onPress={() => {
                    setShowCameraPreview(false);
                    setCurrentRoomPhotos([]);
                    setSelectedRoom(null);
                  }}
                >
                  <Text style={styles.cancelPhotoButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.savePhotoButton}
                  onPress={saveRoomPhotos}
                >
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.savePhotoButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Post Save Options */}
          {showPostSaveOptions && (
            <View style={styles.postSaveContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Photos Saved!</Text>
              <Text style={styles.successSubtitle}>
                {currentRoomPhotos.length} photos saved for {selectedRoom}
              </Text>

              {analysisTimeEstimate && (
                <View style={styles.timeEstimateBox}>
                  <Ionicons name="time" size={20} color="#F59E0B" />
                  <Text style={styles.timeEstimateText}>{analysisTimeEstimate}</Text>
                </View>
              )}

              <View style={styles.postSaveButtons}>
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={handleAnalyzeRoom}
                >
                  <Ionicons name="flash" size={22} color="#FFFFFF" />
                  <Text style={styles.analyzeButtonText}>Analyze All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nextRoomButton}
                  onPress={handleMoveToNextRoom}
                >
                  <Ionicons name="arrow-forward" size={22} color="#0E7490" />
                  <Text style={styles.nextRoomButtonText}>Move to Next Room</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Add Custom Room Modal */}
      <Modal visible={showAddRoomModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.addRoomModalContent}>
            <View style={styles.addRoomModalHeader}>
              <Text style={styles.addRoomModalTitle}>Add Custom Rooms</Text>
              <TouchableOpacity onPress={finishAddingRooms}>
                <Ionicons name="close-circle" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.addRoomModalSubtitle}>
              Add custom room names that will appear in your room selector
            </Text>

            {/* Input row */}
            <View style={styles.addRoomInputRow}>
              <TextInput
                style={styles.addRoomInput}
                placeholder="Enter room name..."
                placeholderTextColor="#9CA3AF"
                value={newRoomName}
                onChangeText={setNewRoomName}
                autoCapitalize="words"
                onSubmitEditing={addCustomRoom}
              />
              <TouchableOpacity
                style={styles.addRoomSubmitButton}
                onPress={addCustomRoom}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Custom rooms list */}
            {customRooms.length > 0 && (
              <View style={styles.customRoomsList}>
                <Text style={styles.customRoomsListLabel}>
                  Added Rooms ({customRooms.length}):
                </Text>
                <ScrollView style={styles.customRoomsScroll} showsVerticalScrollIndicator={false}>
                  {customRooms.map((room, index) => (
                    <View key={index} style={styles.customRoomItem}>
                      <View style={styles.customRoomInfo}>
                        <Ionicons name="cube" size={18} color="#0E7490" />
                        <Text style={styles.customRoomName}>{room}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeCustomRoom(room)}
                        style={styles.removeRoomButton}
                      >
                        <Ionicons name="trash" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {customRooms.length === 0 && (
              <View style={styles.noCustomRooms}>
                <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                <Text style={styles.noCustomRoomsText}>
                  No custom rooms added yet
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.finishAddingButton}
              onPress={finishAddingRooms}
            >
              <Text style={styles.finishAddingButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Analysis Success Modal */}
      <Modal visible={showAnalysisSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.analysisSuccessModal}>
            <View style={styles.successIconLarge}>
              <Ionicons name="checkmark-circle" size={72} color="#10B981" />
            </View>
            <Text style={styles.analysisSuccessTitle}>Analysis Complete!</Text>
            <Text style={styles.analysisSuccessSubtitle}>
              Successfully analyzed {analysisSuccessData.count} images
            </Text>

            {analysisSuccessData.rooms.length > 0 && (
              <View style={styles.analyzedRoomsList}>
                <Text style={styles.analyzedRoomsLabel}>Rooms Analyzed:</Text>
                {analysisSuccessData.rooms.map((room, index) => (
                  <View key={index} style={styles.analyzedRoomItem}>
                    <Ionicons name="checkmark" size={16} color="#10B981" />
                    <Text style={styles.analyzedRoomText}>{room}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.viewReportButton}
              onPress={() => {
                setShowAnalysisSuccessModal(false);
                // Scroll to findings section
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
            >
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
              <Text style={styles.viewReportButtonText}>View Summary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeSuccessButton}
              onPress={() => setShowAnalysisSuccessModal(false)}
            >
              <Text style={styles.closeSuccessButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Yellow Camera Popup */}
      <Modal visible={showYellowPopup} transparent animationType="fade">
        <View style={styles.yellowModalOverlay}>
          <View style={styles.yellowPopupContent}>
            {/* Table Structure matching the image */}
            <View style={styles.yellowTable}>
              {/* Row 1: PROPERTY */}
              <View style={styles.yellowTableRowFull}>
                <Text style={styles.yellowTableLabel}>PROPERTY</Text>
              </View>

              {/* Row 2: PROPERTY TYPE */}
              <View style={styles.yellowTableRowFull}>
                <Text style={styles.yellowTableLabel}>PROPERTY TYPE</Text>
              </View>

              {/* Row 3: INSIDE | OUTSIDE */}
              <View style={styles.yellowTableRowSplit}>
                <TouchableOpacity
                  style={styles.yellowTableCell}
                  onPress={() => setRoomCategory('inside')}
                >
                  <View style={[styles.selectionPill, roomCategory === 'inside' && styles.selectionPillActive]}>
                    <Text style={[styles.yellowTableLabel, roomCategory === 'inside' && styles.yellowTableLabelActive]}>INSIDE</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.yellowTableCell}
                  onPress={() => setRoomCategory('outside')}
                >
                  <View style={[styles.selectionPill, roomCategory === 'outside' && styles.selectionPillActive]}>
                    <Text style={[styles.yellowTableLabel, roomCategory === 'outside' && styles.yellowTableLabelActive]}>OUTSIDE</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Row 4: Heading change | Heading change */}
              <View style={styles.yellowTableRowSplit}>
                <TouchableOpacity
                  style={styles.yellowTableCell}
                  onPress={() => {
                    setShowYellowPopup(false);
                    setShowRoomSelectionModal(true);
                  }}
                >
                  <Text style={styles.yellowTableLabelSmall}>Heading change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.yellowTableCell}
                  onPress={() => {
                    setShowYellowPopup(false);
                    setShowRoomSelectionModal(true);
                  }}
                >
                  <Text style={styles.yellowTableLabelSmall}>Heading change</Text>
                </TouchableOpacity>
              </View>

              {/* Row 5: Deficiency selected | Deficiency selected */}
              <View style={styles.yellowTableRowSplit}>
                <View style={styles.yellowTableCell}>
                  <Text style={styles.yellowTableLabelSmall}>Deficiency selected</Text>
                </View>
                <View style={styles.yellowTableCell}>
                  <Text style={styles.yellowTableLabelSmall}>Deficiency selected</Text>
                </View>
              </View>

              {/* Row 6: Camera for inspection | Deficiency selected */}
              <View style={styles.yellowTableRowSplit}>
                <TouchableOpacity
                  style={styles.yellowTableCell}
                  onPress={() => {
                    setShowYellowPopup(false);
                    // If room is already selected, go directly to camera, otherwise show room selection
                    if (selectedRoom) {
                      captureRoomPhoto();
                    } else {
                      setShowRoomSelectionModal(true);
                    }
                  }}
                >
                  <Text style={styles.yellowTableLabelSmall}>Camera for inspection</Text>
                </TouchableOpacity>
                <View style={styles.yellowTableCell}>
                  <Text style={styles.yellowTableLabelSmall}>Deficiency selected</Text>
                </View>
              </View>
            </View>

            {/* Close Button beneath table */}
            <TouchableOpacity
              style={styles.yellowPopupCloseButton}
              onPress={() => setShowYellowPopup(false)}
            >
              <Text style={styles.yellowPopupCloseButtonText}>Close</Text>
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
  uploadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
  },
  uploadIndicatorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0E7490',
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
  // Room Selection Modal Styles
  roomModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  roomModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  roomModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
  },
  categoryToggle: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0E7490',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#0E7490',
    borderColor: '#0E7490',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionSwitcherLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  addRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  addRoomButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
  },
  roomCounterBadge: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  roomCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roomGrid: {
    flex: 1,
    paddingHorizontal: 12,
  },
  roomButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  roomButton: {
    width: '23%',
    marginHorizontal: '1%',
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  roomButtonCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  roomButtonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  roomButtonTextCompleted: {
    color: '#059669',
  },
  roomPhotoCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roomPhotoCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  roomSummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  roomSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  roomChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roomChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
  },
  roomChipCount: {
    fontSize: 11,
    color: '#0E7490',
    opacity: 0.8,
  },
  // Camera Preview Styles
  cameraPreviewContainer: {
    flex: 1,
    padding: 16,
  },
  photoStrip: {
    maxHeight: 200,
    marginBottom: 16,
  },
  previewPhotoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  previewPhoto: {
    width: 150,
    height: 180,
    borderRadius: 12,
  },
  photoIndex: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addMoreButton: {
    width: 120,
    height: 180,
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0E7490',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
    marginTop: 8,
  },
  photoCountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  saveButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  cancelPhotoButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelPhotoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  savePhotoButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePhotoButtonDisabled: {
    opacity: 0.6,
  },
  savePhotoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Post Save Options Styles
  postSaveContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeEstimateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  timeEstimateText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
  },
  autoAnalysisBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  autoAnalysisText: {
    fontSize: 14,
    color: '#0E7490',
    fontWeight: '500',
  },
  postSaveButtons: {
    width: '100%',
    gap: 12,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 12,
    backgroundColor: '#0E7490',
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nextRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0E7490',
    backgroundColor: '#FFFFFF',
  },
  nextRoomButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0E7490',
  },
  // Room Findings Styles
  roomFindingsSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roomFindingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
  },
  roomFindingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E7490',
    marginLeft: 10,
    flex: 1,
  },
  roomFindingsCount: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roomFindingsCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  roomFindingsContent: {
    padding: 12,
    gap: 12,
  },
  // Analysis Success Modal Styles
  analysisSuccessModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
  },
  successIconLarge: {
    marginBottom: 16,
  },
  analysisSuccessTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  analysisSuccessSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  analyzedRoomsList: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  analyzedRoomsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  analyzedRoomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  analyzedRoomText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },
  viewReportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeSuccessButton: {
    paddingVertical: 8,
  },
  closeSuccessButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Add Custom Room Modal Styles
  addRoomModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  addRoomModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addRoomModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addRoomModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  addRoomInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  addRoomInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addRoomSubmitButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customRoomsList: {
    flex: 1,
    marginBottom: 16,
  },
  customRoomsListLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  customRoomsScroll: {
    maxHeight: 200,
  },
  customRoomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  customRoomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  customRoomName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  removeRoomButton: {
    padding: 8,
  },
  noCustomRooms: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noCustomRoomsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  finishAddingButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  finishAddingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Yellow Camera Popup Styles (Re-themed to App Theme)
  yellowModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  yellowPopupContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  yellowTable: {
    backgroundColor: '#FFFFFF',
  },
  yellowTableRowFull: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  yellowTableRowSplit: {
    flexDirection: 'row',
    height: 90,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  yellowTableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectionPill: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionPillActive: {
    backgroundColor: '#0E7490', // App Primary Color
    elevation: 2,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  yellowTableLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  yellowTableLabelActive: {
    color: '#FFFFFF',
  },
  yellowTableLabelSmall: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  yellowPopupCloseButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  yellowPopupCloseButtonText: {
    color: '#0E7490',
    fontWeight: '600',
    fontSize: 15,
  },
});
