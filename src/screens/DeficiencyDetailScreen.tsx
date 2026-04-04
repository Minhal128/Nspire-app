import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Modal,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  getDeficienciesForItem,
  getDeficienciesForSubcategory,
  hasSubcategories,
  getSubcategoriesForItem,
  DeficiencyOption,
  CODE_COMPLIANCE,
  isUnitLocation
} from '../data/deficiencyMapping';
import { cloudinaryService } from '../services/cloudinaryService';
import ModalZoomWrapper from '../components/ModalZoomWrapper';
import { geminiService } from '../services/openaiService';
import { inspectionService } from '../services/inspectionService';
import { ScoringResult, calculateUnitScore, POSSIBLE_SCORE } from '../utils/scoringCalculations';
import { UNIT_TOTAL_POSSIBLE_POINTS } from '../data/insideDeficiencyMapping';
import {
  calculateOutsideScore,
  extractCategoryNumber,
  OutsideScoringResult
} from '../utils/outsideScoringCalculations';
import {
  calculateInsideScore,
  extractInsideCategoryNumber,
  InsideScoringResult
} from '../utils/insideScoringCalculations';
import {
  calculateUnitInspectionScore,
  extractUnitCategoryNumber,
  UnitScoringResult
} from '../utils/unitScoringCalculations';

// Outside inspection location options
const OUTSIDE_LOCATION_OPTIONS = [
  'Building Site N',
  'Building Site S',
  'Building Site W',
  'Building Site E',
  'Courtyard',
  'Exterior E',
  'Exterior N',
  'Exterior S',
  'Exterior W',
  'Garage/Carport',
  'Grounds',
  'Other',
  'Parking Lot/Driveway/Roads',
  'Patio/Porch/Balcony',
  'Playground',
  'Roof (flat)',
  'Sidewalks/Walkways/Stoops',
];

// Inside inspection location options
const INSIDE_LOCATION_OPTIONS = [
  'Basement',
  'Business Space',
  'Classroom',
  'Closet/Utility',
  'Day Care',
  'Halls/Corridors/Stairs',
  'Kitchen',
  'Laundry Room',
  'Leased Commercial',
  'Library',
  'Lobby',
  'Maintenance Shop',
  'Mechanical Room',
  'Office',
  'Other Community Space',
  'Parking Garage',
  'Patio/Porch/Balcony',
  'Recreational Room',
  'Recreation Room',
  'Refuse/Compactor Room',
  'Restrooms',
  'Salon',
  'Store',
  'Workout Room',
];

// Unit inspection location options (25 locations)
const UNIT_LOCATION_OPTIONS = [
  'Attic/Loft',
  'Basement',
  'Bathroom1',
  'Bathroom2',
  'Bathroom3',
  'Bedroom 1',
  'Bedroom 2',
  'Bedroom 3',
  'Bedroom 4',
  'Bedroom 5',
  'Closet',
  'Dinning Area',
  'Entryway(Front/Rear',
  'Garage',
  'Hallway/Stairs',
  'Home Office/Study',
  'Kitchen',
  'Laundry Room',
  'Living Room',
  'Location',
  'Mechanical Room',
  'Office',
  'Other',
  'Patio/Porch/Balcony',
  'Storage Room',
];

type DeficiencyDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DeficiencyDetail'
>;
type DeficiencyDetailScreenRouteProp = RouteProp<RootStackParamList, 'DeficiencyDetail'>;

interface Props {
  navigation: DeficiencyDetailScreenNavigationProp;
  route: DeficiencyDetailScreenRouteProp;
}

const DeficiencyDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits, currentUnit, buildingId, location, itemId, itemName } = route.params;

  const isGeneralComment = itemName.toLowerCase().includes('general comment');

  // Subcategory state (for items like Door in Outside section)
  const [showSubcategoryPicker, setShowSubcategoryPicker] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ id: string; name: string } | null>(null);
  const [itemHasSubcategories, setItemHasSubcategories] = useState(false);

  const [availableDeficiencies, setAvailableDeficiencies] = useState<DeficiencyOption[]>([]);
  const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyOption | null>(null);
  const [showDeficiencyPicker, setShowDeficiencyPicker] = useState(false);
  const [showDetailPicker, setShowDetailPicker] = useState(false);

  const [repairBy, setRepairBy] = useState('');
  const [deficiencyCriteria, setDeficiencyCriteria] = useState('');
  const [note, setNote] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Expandable text modal states
  const [showExpandedText, setShowExpandedText] = useState(false);
  const [expandedTextTitle, setExpandedTextTitle] = useState('');
  const [expandedTextContent, setExpandedTextContent] = useState('');

  // Custom text input states
  const [customDeficiencyName, setCustomDeficiencyName] = useState('');
  const [customDeficiencyDetail, setCustomDeficiencyDetail] = useState('');
  const [customDeficiencyCriteria, setCustomDeficiencyCriteria] = useState('');
  const [isCustomEntry, setIsCustomEntry] = useState(false);

  // Scoring state - automatically calculated based on deficiency selection
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [outsideScoringResult, setOutsideScoringResult] = useState<OutsideScoringResult | null>(null);
  const [insideScoringResult, setInsideScoringResult] = useState<InsideScoringResult | null>(null);
  const [unitScoringResult, setUnitScoringResult] = useState<UnitScoringResult | null>(null);

  // Outside location picker state
  const [selectedOutsideLocation, setSelectedOutsideLocation] = useState<string>(OUTSIDE_LOCATION_OPTIONS[0]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Inside location picker state
  const [selectedInsideLocation, setSelectedInsideLocation] = useState<string>(INSIDE_LOCATION_OPTIONS[0]);
  const [showInsideLocationPicker, setShowInsideLocationPicker] = useState(false);
  const [selectedUnitLocation, setSelectedUnitLocation] = useState<string>(UNIT_LOCATION_OPTIONS[0]);
  const [showUnitLocationPicker, setShowUnitLocationPicker] = useState(false);

  // Code Reference modal state
  const [showCodeReference, setShowCodeReference] = useState(false);
  const [codeReferenceContent, setCodeReferenceContent] = useState('');
  const [codeRefFontSize, setCodeRefFontSize] = useState(15);

  // Processing modal state
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const processingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }
    };
  }, []);

  // Check if we're in the Outside inspection module
  const isOutsideLocation = location?.toLowerCase() === 'outside';

  // Check if we're in a Unit location (specific room like Basement, Bedroom, etc.)
  const isUnit = isUnitLocation(location);

  // Get total samples from selectedUnits (default to 20 if not available)
  const totalSamples = selectedUnits?.length || 20;

  // Auto-count deficiencies: count is based on images uploaded (0 until image is uploaded)
  const deficiencyCount = images.length > 0 ? images.length : 0;

  // Generate a unique QR-XXXXX ID for each deficiency image
  const generateDeficiencyQRId = (): string => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `QR-${randomNum}`;
  };

  // Get the raw points formula from the selected deficiency (e.g., "2.20/n", "27.25/n")
  const getPointsFormula = (): number => {
    if (!selectedDeficiency?.points) return 0;
    const pointsStr = selectedDeficiency.points;
    // Parse the formula like "2.20/n" or "27.25/50xn" to get the base value
    const match = pointsStr.match(/^([\d.]+)/);
    if (match) {
      return parseFloat(match[1]);
    }
    return 0;
  };

  // Calculate PTS LOST from formula: formula_value / n (where n = totalSamples)
  const calculatePtsLost = (): number => {
    const rawPoints = getPointsFormula();
    if (rawPoints === 0 || totalSamples === 0) return 0;
    return rawPoints / totalSamples;
  };

  // Calculate SCORE: Possible Score - PTS LOST
  // Unit inspections have 50 possible points, Inside/Outside have 25
  const getPossibleScore = (): number => {
    return isUnit ? UNIT_TOTAL_POSSIBLE_POINTS : POSSIBLE_SCORE;
  };

  // Check if the current deficiency should force Score to 0.00
  const isZeroScoreDeficiency = (): boolean => {
    if (!selectedDeficiency && !isCustomEntry) return false;
    const name = (selectedDeficiency?.name || customDeficiencyName || '').toLowerCase();
    const detail = (selectedDeficiency?.detail || customDeficiencyDetail || '').toLowerCase();
    const criteria = (selectedDeficiency?.criteria || customDeficiencyCriteria || '').toLowerCase();
    const combined = `${name} ${detail} ${criteria}`;
    const item = (itemName || '').toLowerCase();

    // Carbon Monoxide Alarm — any deficiency in this category
    if (item.includes('carbon monoxide alarm') || combined.includes('carbon monoxide alarm')) {
      return true;
    }
    // ALL Smoke Alarm deficiencies under Fire Safety
    if (item.includes('fire safety') && combined.includes('smoke alarm')) {
      return true;
    }
    return false;
  };

  const calculateScore = (): number => {
    if (isZeroScoreDeficiency()) return 0;
    const ptsLost = calculatePtsLost();
    return getPossibleScore() - ptsLost;
  };

  // Update scoring dynamically when deficiency is selected/changed
  // Only calculate scoring when a deficiency is explicitly selected
  useEffect(() => {
    // Don't calculate scoring if no deficiency is selected
    if (!selectedDeficiency && !isCustomEntry) {
      setScoringResult(null);
      setOutsideScoringResult(null);
      setInsideScoringResult(null);
      setUnitScoringResult(null);
      return;
    }

    if (isOutsideLocation) {
      // Use Outside-specific scoring with category-based and deficiency-based rules
      const categoryNumber = extractCategoryNumber(itemId, itemName);
      // Include name, detail, AND criteria fields for pattern matching
      const deficiencyDescription = [
        selectedDeficiency?.name,
        selectedDeficiency?.detail,
        selectedDeficiency?.criteria,
        customDeficiencyDetail,
        customDeficiencyCriteria,
      ].filter(Boolean).join(' ') || '';

      const outsideResult = calculateOutsideScore({
        categoryNumber,
        totalSamples,
        deficiencyDescription,
        deficiencyCount,
        // Pass the deficiency's actual points formula if available
        deficiencyPointsFormula: selectedDeficiency?.points,
        deficiencySeverity: selectedDeficiency?.severity,
      });
      setOutsideScoringResult(outsideResult);

      // Also set the standard scoring result for compatibility
      const result = calculateUnitScore({
        totalSamples,
        deficiencies: deficiencyCount,
        severity: outsideResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low',
      });
      // Override with Outside-specific values
      result.ptsLostRaw = outsideResult.pointsLostRaw;
      result.ptsLost = outsideResult.pointsLost;
      result.maxPtsLost = outsideResult.maxPtsLost;
      result.score = outsideResult.score;
      result.severity = outsideResult.severity;
      // Force score to 0 for Carbon Monoxide Alarm / smoke alarm covered by foreign object
      if (isZeroScoreDeficiency()) {
        result.score = 0;
        outsideResult.score = 0;
      }
      setScoringResult(result);
      setInsideScoringResult(null);
      setUnitScoringResult(null);
    } else if (isUnit) {
      // Use Unit-specific scoring - NO pattern-based overrides
      // Severity comes DIRECTLY from the deficiency mapping (unitDeficiencyMapping.ts)
      const unitResult = calculateUnitInspectionScore({
        totalSamples,
        deficiencyCount,
        severity: selectedDeficiency?.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low' | undefined,
        deficiencyPointsFormula: selectedDeficiency?.points,
      });
      setUnitScoringResult(unitResult);

      // Also set the standard scoring result for compatibility
      const result = calculateUnitScore({
        totalSamples,
        deficiencies: deficiencyCount,
        severity: unitResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low',
      });
      // Override with Unit-specific values
      result.ptsLostRaw = unitResult.pointsLostRaw;
      result.ptsLost = unitResult.pointsLost;
      result.maxPtsLost = unitResult.maxPtsLost;
      result.score = unitResult.score;
      result.severity = unitResult.severity;
      // Force score to 0 for Carbon Monoxide Alarm / smoke alarm covered by foreign object
      if (isZeroScoreDeficiency()) {
        result.score = 0;
        unitResult.score = 0;
      }
      setScoringResult(result);
      setOutsideScoringResult(null);
      setInsideScoringResult(null);
    } else {
      // Use Inside-specific scoring with category-based and deficiency-based rules
      const categoryNumber = extractInsideCategoryNumber(itemId, itemName);
      // Include name, detail, AND criteria fields for pattern matching
      const deficiencyDescription = [
        selectedDeficiency?.name,
        selectedDeficiency?.detail,
        selectedDeficiency?.criteria,
        customDeficiencyDetail,
        customDeficiencyCriteria,
      ].filter(Boolean).join(' ') || '';

      const insideResult = calculateInsideScore({
        categoryNumber,
        totalSamples,
        deficiencyDescription,
        deficiencyCount,
        severity: selectedDeficiency?.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low' | undefined,
        // Pass the deficiency's actual points formula if available
        deficiencyPointsFormula: selectedDeficiency?.points,
      });
      setInsideScoringResult(insideResult);

      // Also set the standard scoring result for compatibility
      const result = calculateUnitScore({
        totalSamples,
        deficiencies: deficiencyCount,
        severity: insideResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low',
      });
      // Override with Inside-specific values
      result.ptsLostRaw = insideResult.pointsLostRaw;
      result.ptsLost = insideResult.pointsLost;
      result.maxPtsLost = insideResult.maxPtsLost;
      result.score = insideResult.score;
      result.severity = insideResult.severity;
      // Force score to 0 for Carbon Monoxide Alarm / smoke alarm covered by foreign object
      if (isZeroScoreDeficiency()) {
        result.score = 0;
        insideResult.score = 0;
      }
      setScoringResult(result);
      setOutsideScoringResult(null);
      setUnitScoringResult(null);
    }
  }, [selectedDeficiency, deficiencyCount, totalSamples, isOutsideLocation, isUnit, itemId, itemName, customDeficiencyDetail, customDeficiencyCriteria, isCustomEntry, images.length]);

  useEffect(() => {
    // Check if item has subcategories (e.g., Door in Outside section)
    const hasSubcats = hasSubcategories(itemName, location);
    setItemHasSubcategories(hasSubcats);

    if (hasSubcats) {
      // Get subcategories for this item
      const subcats = getSubcategoriesForItem(itemName, location);
      setAvailableSubcategories(subcats);
      setAvailableDeficiencies([]);  // Wait for subcategory selection
      setSelectedSubcategory(null);
    } else {
      // Load deficiencies directly for the selected item
      const itemDeficiencies = getDeficienciesForItem(itemName, location);
      console.log('DEBUG getDeficienciesForItem:', { itemName, location, deficiencies: itemDeficiencies.deficiencies.map(d => ({ name: d.name, severity: d.severity, points: d.points })) });
      setAvailableDeficiencies(itemDeficiencies.deficiencies);
      setAvailableSubcategories([]);
    }

    // Reset selection when item changes
    setSelectedDeficiency(null);
    setRepairBy('');
    setDeficiencyCriteria('');
  }, [itemName, location]);

  // Handle subcategory selection
  const handleSelectSubcategory = (subcategory: { id: string; name: string }) => {
    setSelectedSubcategory(subcategory);
    // Load deficiencies for selected subcategory
    // Pass location so Inside uses unitDeficiencyMapping data instead of falling through to Outside data
    const subDeficiencies = getDeficienciesForSubcategory(subcategory.name, location, itemName);
    setAvailableDeficiencies(subDeficiencies.deficiencies);
    setShowSubcategoryPicker(false);
    // Reset deficiency selection
    setSelectedDeficiency(null);
    setRepairBy('');
    setDeficiencyCriteria('');
  };

  const handleSelectDeficiency = (deficiency: DeficiencyOption) => {
    setSelectedDeficiency(deficiency);
    setRepairBy(deficiency.repairBy);
    setDeficiencyCriteria(deficiency.criteria);
    setShowDeficiencyPicker(false);
  };

  const handleClearSelection = () => {
    setSelectedDeficiency(null);
    setRepairBy('');
    setDeficiencyCriteria('');
    setCustomDeficiencyName('');
    setCustomDeficiencyDetail('');
    setCustomDeficiencyCriteria('');
    setIsCustomEntry(false);
  };

  // Show expanded text modal
  const handleShowExpandedText = (title: string, content: string) => {
    if (content && content !== '-- Select deficiency first --') {
      setExpandedTextTitle(title);
      setExpandedTextContent(content);
      setShowExpandedText(true);
    }
  };

  const requestPermissions = async (useCamera: boolean) => {
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device Settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Permission Required',
          'Please enable photo library access in your device Settings to select photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions(true);
    if (!hasPermission) return;

    const mediaTypes: any = ['images'];

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions(false);
    if (!hasPermission) return;

    const mediaTypes: any = ['images'];

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleProceed = async () => {
    let currentDeficiency: any = null;
    
    if (isGeneralComment) {
      currentDeficiency = {
        name: 'General Comment',
        severity: 'Low',
        detail: note || 'General observation',
        criteria: '',
        points: '0',
        repairBy: '',
        category: 'General'
      };
    } else if (isCustomEntry) {
      if (!customDeficiencyDetail) {
        Alert.alert('Error', 'Please enter details for the custom deficiency');
        return;
      }
      currentDeficiency = {
        name: customDeficiencyName || 'Custom Deficiency',
        severity: 'Moderate',
        detail: customDeficiencyDetail,
        criteria: customDeficiencyCriteria || '',
        points: '0',
        repairBy: '',
        category: 'Custom'
      };
    } else {
      currentDeficiency = selectedDeficiency;
    }

    if (!currentDeficiency) {
      Alert.alert('Error', 'Please select a deficiency');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    const normalizedArea = isOutsideLocation ? 'Outside' : (isUnit ? 'Unit' : 'Inside');
    const normalizedBuildingLabel = String(
      buildingId || property?.building || property?.buildingName || ''
    ).trim();
    const normalizedUnit = isUnit
      ? (currentUnit || selectedUnits?.[0] || '-')
      : (normalizedBuildingLabel || '-');
    const selectedInspectionLocation = isOutsideLocation
      ? selectedOutsideLocation
      : (isUnit ? selectedUnitLocation : selectedInsideLocation);
    const deficiencyDedupeKey = `${String(normalizedArea).trim().toLowerCase()}|${String(normalizedUnit).trim().toLowerCase()}|${String(itemId || itemName || 'unknown-item').trim().toLowerCase()}|${String(currentDeficiency.name || 'unknown-deficiency').trim().toLowerCase()}`;

    try {
      // Show processing modal - will be dismissed when processing completes
      setProcessingMessage(`Analyzing ${images.length} image(s) with AI...`);
      setShowProcessingModal(true);

      // Clear any existing timer
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }

      // Upload all images to Cloudinary and analyze with AI
      const analyzedDeficiencies = [];

      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];

        try {
          // Upload to Cloudinary
          const uploadResult = await cloudinaryService.uploadImage(imageUri, 'nspire-inspections');

          // Call AI analysis (Gemini service) - use LOCAL imageUri, not Cloudinary URL
          let aiAnalysis;
          try {
            aiAnalysis = await geminiService.analyzeDeficiency(
              imageUri, // Use local URI for AI analysis
              currentDeficiency.name,
              itemName
            );
          } catch (aiError) {
            console.error('AI analysis error:', aiError);
            // Fallback if AI analysis fails
            aiAnalysis = {
              analysis: `${currentDeficiency.name} observed in ${itemName}`,
              severity: currentDeficiency.severity,
              recommendations: currentDeficiency.detail,
            };
          }

          // Create deficiency entry with AI analysis
          analyzedDeficiencies.push({
            deficiency: {
              ...currentDeficiency,
              // Override severity with Outside-specific scoring if applicable
              severity: isOutsideLocation && outsideScoringResult
                ? outsideScoringResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
                : currentDeficiency.severity,
              aiAnalysis: aiAnalysis.analysis,
              aiSeverity: aiAnalysis.severity,
              aiRecommendations: aiAnalysis.recommendations,
              // Include Outside-specific scoring info
              ...(isOutsideLocation && outsideScoringResult && {
                categoryNumber: outsideScoringResult.categoryNumber,
                pointsLostFormula: outsideScoringResult.formulaNumerator,
                pointsLostRaw: outsideScoringResult.pointsLostRaw,
                isDeficiencyOverride: outsideScoringResult.isDeficiencyOverride,
              }),
            },
            deficiencyQRId: generateDeficiencyQRId(), // Unique QR-XXXXX ID per image
            imageUrl: uploadResult.success ? uploadResult.url : null, // Cloudinary URL for storage
            imageUri: imageUri, // Local URI for display
            note: note || '',
            location: selectedInspectionLocation,
            itemName,
            itemId,
            building: normalizedBuildingLabel || undefined,
            buildingInspectionId: normalizedBuildingLabel || undefined,
            dedupeKey: deficiencyDedupeKey,
            _area: normalizedArea,
            _unit: normalizedUnit,
            analyzedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error);
          // Still add the deficiency without AI analysis
          analyzedDeficiencies.push({
            deficiency: {
              ...currentDeficiency,
              // Override severity with Outside-specific scoring if applicable
              severity: isOutsideLocation && outsideScoringResult
                ? outsideScoringResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
                : currentDeficiency.severity,
              // Include Outside-specific scoring info
              ...(isOutsideLocation && outsideScoringResult && {
                categoryNumber: outsideScoringResult.categoryNumber,
                pointsLostFormula: outsideScoringResult.formulaNumerator,
                pointsLostRaw: outsideScoringResult.pointsLostRaw,
                isDeficiencyOverride: outsideScoringResult.isDeficiencyOverride,
              }),
            },
            deficiencyQRId: generateDeficiencyQRId(), // Unique QR-XXXXX ID per image
            imageUrl: null,
            imageUri: imageUri,
            note,
            location: selectedInspectionLocation,
            itemName,
            itemId,
            building: normalizedBuildingLabel || undefined,
            buildingInspectionId: normalizedBuildingLabel || undefined,
            dedupeKey: deficiencyDedupeKey,
            _area: normalizedArea,
            _unit: normalizedUnit,
            analyzedAt: new Date().toISOString(),
          });
        }
      }

      const propertyIdentifier = String(property?._id || property?.id || property?.propertyId || 'unknown');
      const draftSavedAt = new Date().toISOString();

      try {
        await inspectionService.saveProgress({
          property_id: propertyIdentifier,
          unit_id: 'ALL_UNITS',
          inspection_type: 'REPORT_DRAFT_PROPERTY',
          inspectionData: {
            deficiencies: analyzedDeficiencies,
            property: {
              _id: propertyIdentifier,
              name: property?.name || 'Property',
            },
            buildingId: normalizedBuildingLabel,
            unit: normalizedUnit,
            inspectionType: 'Draft Inspection',
            savedAt: draftSavedAt,
          },
        });
      } catch (draftSaveError) {
        console.warn('Could not persist draft from detail screen:', draftSaveError);
      }

      // Hide processing modal before navigation
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }
      setShowProcessingModal(false);

      // Navigate to summary with all analyzed deficiencies
      navigation.navigate('InspectionSummary', {
        property,
        selectedUnits,
        buildingId,
        inspectionData: {
          deficiencies: analyzedDeficiencies, // Array of deficiencies
          totalImages: images.length,
          location: isOutsideLocation ? selectedOutsideLocation : location,
          itemName,
          itemId,
          scoringResult: scoringResult || calculateUnitScore({
            totalSamples,
            deficiencies: deficiencyCount,
            severity: isOutsideLocation && outsideScoringResult
              ? outsideScoringResult.severity as 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low'
              : (currentDeficiency?.severity || 'Moderate'),
          }),
          // Include Outside-specific scoring information
          outsideScoringResult: isOutsideLocation ? outsideScoringResult : undefined,
          isOutsideInspection: isOutsideLocation,
          outsideLocation: isOutsideLocation ? selectedOutsideLocation : undefined,
        },
        currentUnit: currentUnit || selectedUnits[0] || undefined,
        allUnits: selectedUnits,
      });

      // Show success message
      setTimeout(() => {
        Alert.alert(
          'Success',
          `${analyzedDeficiencies.length} deficienc${analyzedDeficiencies.length === 1 ? 'y' : 'ies'} recorded and analyzed successfully!`
        );
      }, 500);
    } catch (error) {
      // Hide processing modal on error
      if (processingTimerRef.current) {
        clearTimeout(processingTimerRef.current);
      }
      setShowProcessingModal(false);

      console.error('Error in handleProceed:', error);
      Alert.alert('Error', 'Failed to process images. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{itemName}</Text>
          <Text style={styles.headerSubtitle}>{location}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* DEFICIENCY SELECTED - First dropdown for all items except General Comment */}
        {itemName !== 'General Comment' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DEFICIENCY SELECTED</Text>
            {itemHasSubcategories ? (
              // For items with subcategories: Pick subcategory first
              <TouchableOpacity
                style={[styles.dropdown, selectedSubcategory && styles.dropdownSelected]}
                onPress={() => setShowSubcategoryPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dropdownText, !selectedSubcategory && styles.placeholderText]}>
                  {selectedSubcategory ? selectedSubcategory.name : '-- Select --'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={selectedSubcategory ? "#0E7490" : "#666666"} />
              </TouchableOpacity>
            ) : (
              // For items without subcategories: Pick deficiency directly
              <>
                <TouchableOpacity
                  style={[styles.dropdown, selectedDeficiency && styles.dropdownSelected]}
                  onPress={() => setShowDeficiencyPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]}>
                    {selectedDeficiency ? selectedDeficiency.name : '-- Select --'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={selectedDeficiency ? "#0E7490" : "#666666"} />
                </TouchableOpacity>
                {selectedDeficiency && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearSelection}>
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Clear Selection</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        {/* DEFICIENCY DETAIL - For subcategory items: dropdown to pick deficiency; For non-subcategory items: editable display */}
        {itemName !== 'General Comment' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DEFICIENCY DETAIL</Text>
            {itemHasSubcategories ? (
              // For items with subcategories: Dropdown to pick deficiency within subcategory
              <>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    selectedDeficiency && styles.dropdownSelected,
                    !selectedSubcategory && styles.detailBoxDisabled
                  ]}
                  onPress={() => {
                    if (!selectedSubcategory) {
                      Alert.alert('Select Deficiency', 'Please select a deficiency first.');
                      return;
                    }
                    setShowDeficiencyPicker(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]}>
                    {selectedDeficiency ? (selectedDeficiency.detail || selectedDeficiency.name) : '-- Select --'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={selectedDeficiency ? "#0E7490" : "#666666"} />
                </TouchableOpacity>
                {selectedDeficiency && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearSelection}>
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                    <Text style={styles.clearButtonText}>Clear Selection</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              // For items without subcategories: Editable detail with tap-to-expand
              <TouchableOpacity
                style={[styles.criteriaDropdownBox, selectedDeficiency && styles.criteriaDropdownBoxActive]}
                onPress={() => handleShowExpandedText('Deficiency Detail', selectedDeficiency?.detail || customDeficiencyDetail || '')}
                activeOpacity={0.8}
              >
                <TextInput
                  style={[styles.criteriaDropdownTextEditable, !selectedDeficiency && !customDeficiencyDetail && styles.placeholderText]}
                  placeholder="-- Select deficiency first or type here --"
                  placeholderTextColor="#9CA3AF"
                  value={customDeficiencyDetail || selectedDeficiency?.detail || ''}
                  onChangeText={(text) => {
                    setCustomDeficiencyDetail(text);
                    setIsCustomEntry(true);
                  }}
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => handleShowExpandedText('Deficiency Detail', selectedDeficiency?.detail || customDeficiencyDetail || '')}
                >
                  <Ionicons name="expand-outline" size={18} color="#0E7490" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {/* CODE OF REFERENCE Button */}
            <TouchableOpacity
              style={[
                styles.codeRefButton,
                !selectedDeficiency ? styles.codeRefButtonDisabled : styles.codeRefButtonActive,
                { marginTop: 16 },
              ]}
              onPress={() => {
                if (!selectedDeficiency) {
                  Alert.alert('Select a Deficiency', 'Please select a deficiency from the dropdown above to view its code reference guidelines.');
                } else if (selectedDeficiency.codeReference) {
                  setCodeReferenceContent(selectedDeficiency.codeReference);
                  setShowCodeReference(true);
                } else {
                  Alert.alert('No Reference Available', `No code reference guidelines are available for "${selectedDeficiency.name}".`);
                }
              }}
              activeOpacity={selectedDeficiency ? 0.8 : 1}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={'#FFFFFF'}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.codeRefButtonText, !selectedDeficiency && styles.codeRefButtonTextDisabled]}>
                How to Inspect (IRC, IBU, Local)
              </Text>
            </TouchableOpacity>
            {!selectedDeficiency && (
              <Text style={styles.codeRefHintText}>
                Select a deficiency above to view inspection guidelines
              </Text>
            )}
          </View>
        )}

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTE</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Write your observation..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* PIC Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PIC</Text>

          {/* Image Grid */}
          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Photo Buttons */}
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
              <View style={styles.photoIconContainer}>
                <Ionicons name="camera" size={32} color="#0E7490" />
              </View>
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
              <View style={styles.photoIconContainer}>
                <Ionicons name="images" size={32} color="#0E7490" />
              </View>
              <Text style={styles.photoButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scoring Section - Shows placeholder values until deficiency is selected */}
        {itemName !== 'General Comment' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>INSPECTION SCORING</Text>

            <View style={styles.scoringCard}>
              {/* Row 1: Location and Severity */}
              <View style={styles.scoringRow}>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Location</Text>
                  {isOutsideLocation ? (
                    <TouchableOpacity
                      style={styles.locationDropdown}
                      onPress={() => setShowLocationPicker(true)}
                    >
                      <Text style={styles.locationDropdownText} numberOfLines={1}>
                        {selectedOutsideLocation}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#0E7490" />
                    </TouchableOpacity>
                  ) : isUnit ? (
                    <TouchableOpacity
                      style={styles.locationDropdown}
                      onPress={() => setShowUnitLocationPicker(true)}
                    >
                      <Text style={styles.locationDropdownText} numberOfLines={1}>
                        {selectedUnitLocation}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#0E7490" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.locationDropdown}
                      onPress={() => setShowInsideLocationPicker(true)}
                    >
                      <Text style={styles.locationDropdownText} numberOfLines={1}>
                        {selectedInsideLocation}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#0E7490" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Severity</Text>
                  <Text style={[
                    styles.scoringFieldValue,
                    scoringResult?.severity === 'Life-Threatening' && { color: '#DC2626' },
                    scoringResult?.severity === 'Severe' && { color: '#EA580C' },
                    scoringResult?.severity === 'Moderate' && { color: '#CA8A04' },
                    scoringResult?.severity === 'Low' && { color: '#16A34A' },
                    !scoringResult && { color: '#9CA3AF' },
                  ]}>
                    {scoringResult?.severity || '--'}
                  </Text>
                </View>
              </View>

              {/* Row 2: All Sample and Pts Lost (Raw) - Shows general formula from points field */}
              <View style={styles.scoringRow}>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>All Sample</Text>
                  <Text style={styles.scoringFieldValue}>{totalSamples}</Text>
                </View>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Pts Lost (Raw)</Text>
                  <Text style={[styles.scoringFieldValue, !selectedDeficiency && { color: '#9CA3AF' }]}>
                    {selectedDeficiency ? getPointsFormula().toFixed(2) : '--'}
                  </Text>
                </View>
              </View>

              {/* Row 3: Pts Lost and Possible Score - PTS LOST calculated from formula */}
              <View style={styles.scoringRow}>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Pts Lost</Text>
                  <Text style={[styles.scoringFieldValue, !selectedDeficiency && { color: '#9CA3AF' }]}>
                    {selectedDeficiency ? calculatePtsLost().toFixed(2) : '--'}
                  </Text>
                </View>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Possible Score</Text>
                  <Text style={styles.scoringFieldValue}>{getPossibleScore()}</Text>
                </View>
              </View>

              {/* Row 4: Max Pts Lost and Score - calculated from formula */}
              <View style={styles.scoringRow}>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Max Pts Lost</Text>
                  <Text style={[styles.scoringFieldValue, !selectedDeficiency && { color: '#9CA3AF' }]}>
                    {selectedDeficiency ? calculatePtsLost().toFixed(2) : '--'}
                  </Text>
                </View>
                <View style={styles.scoringField}>
                  <Text style={styles.scoringFieldLabel}>Score</Text>
                  <Text style={[styles.scoringFieldValue, selectedDeficiency ? styles.scoreHighlight : { color: '#9CA3AF' }]}>
                    {selectedDeficiency ? calculateScore().toFixed(2) : '--'}
                  </Text>
                </View>
              </View>

              {/* Row 5: # of Violations */}
              <View style={styles.scoringRow}>
                <View style={styles.scoringFieldFull}>
                  <Text style={styles.scoringFieldLabel}># of Violations</Text>
                  <Text style={styles.scoringFieldValue}>{deficiencyCount}</Text>
                </View>
              </View>

              {/* Show override indicator for Outside inspections */}
              {isOutsideLocation && outsideScoringResult?.isDeficiencyOverride && (
                <View style={styles.scoringRow}>
                  <View style={styles.scoringFieldFull}>
                    <Text style={[styles.scoringFieldLabel, { color: '#0E7490', fontSize: 10 }]}>
                      * Severity determined by deficiency description override
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Subcategory Picker Modal */}
      <Modal
        visible={showSubcategoryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubcategoryPicker(false)}
      >
        <View style={styles.pickerModalOverlay}>
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Deficiency</Text>
              <TouchableOpacity
                onPress={() => setShowSubcategoryPicker(false)}
                style={styles.pickerCloseButton}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.pickerSubtitle}>
              {availableSubcategories.length} deficienc{availableSubcategories.length !== 1 ? 'ies' : 'y'} available
            </Text>
            <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
              {availableSubcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory.id}
                  style={[
                    styles.pickerItem,
                    selectedSubcategory?.id === subcategory.id && styles.pickerItemSelected
                  ]}
                  onPress={() => handleSelectSubcategory(subcategory)}
                  activeOpacity={0.7}
                >
                  <View style={styles.pickerItemHeader}>
                    <Text style={[
                      styles.pickerItemText,
                      selectedSubcategory?.id === subcategory.id && styles.pickerItemTextSelected
                    ]}>
                      {subcategory.name}
                    </Text>
                    {selectedSubcategory?.id === subcategory.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#0E7490" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Deficiency Picker Modal */}
      <Modal
        visible={showDeficiencyPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeficiencyPicker(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>
                  {itemHasSubcategories ? 'Select Deficiency Detail' : 'Select Deficiency'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDeficiencyPicker(false)}
                  style={styles.pickerCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pickerSubtitle}>
                {availableDeficiencies.length} detail{availableDeficiencies.length !== 1 ? 's' : ''} available
              </Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
                {availableDeficiencies.map((deficiency, index) => (
                  <TouchableOpacity
                    key={deficiency.id}
                    style={[
                      styles.pickerItem,
                      selectedDeficiency?.id === deficiency.id && styles.pickerItemSelected
                    ]}
                    onPress={() => handleSelectDeficiency(deficiency)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemHeader}>
                      <Text style={[
                        styles.pickerItemText,
                        selectedDeficiency?.id === deficiency.id && styles.pickerItemTextSelected
                      ]}>
                        {deficiency.name}
                      </Text>
                      {selectedDeficiency?.id === deficiency.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#0E7490" />
                      )}
                    </View>
                    <Text style={styles.pickerItemDetail} numberOfLines={2}>
                      {deficiency.detail}
                    </Text>
                    <View style={styles.pickerItemMeta}>
                      <View style={[
                        styles.severityBadge,
                        deficiency.severity === 'Life-Threatening' && styles.severityLifeThreatening,
                        deficiency.severity === 'Severe' && styles.severitySevere,
                        deficiency.severity === 'Moderate' && styles.severityModerate,
                        deficiency.severity === 'Low' && styles.severityLow,
                      ]}>
                        <Text style={styles.severityText}>{deficiency.severity}</Text>
                      </View>
                      <Text style={styles.repairByText}>Repair: {deficiency.repairBy}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Expanded Text Modal - Shows full text when user taps on truncated content */}
      <Modal
        visible={showExpandedText}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowExpandedText(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.expandedTextOverlay}>
            <View style={styles.expandedTextContent}>
              <View style={styles.expandedTextHeader}>
                <Text style={styles.expandedTextTitle}>{expandedTextTitle}</Text>
                <TouchableOpacity
                  onPress={() => setShowExpandedText(false)}
                  style={styles.expandedTextCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.expandedTextScrollView} showsVerticalScrollIndicator={true}>
                <Text style={styles.expandedTextBody} selectable={true}>
                  {expandedTextContent || 'No content available'}
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.expandedTextDoneButton}
                onPress={() => setShowExpandedText(false)}
              >
                <Text style={styles.expandedTextDoneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Outside Location Picker Modal */}
      <Modal
        visible={showLocationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationPicker(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Location</Text>
                <TouchableOpacity
                  onPress={() => setShowLocationPicker(false)}
                  style={styles.pickerCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pickerSubtitle}>
                {OUTSIDE_LOCATION_OPTIONS.length} locations available
              </Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
                {OUTSIDE_LOCATION_OPTIONS.map((locationOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      selectedOutsideLocation === locationOption && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setSelectedOutsideLocation(locationOption);
                      setShowLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemHeader}>
                      <Text style={[
                        styles.pickerItemText,
                        selectedOutsideLocation === locationOption && styles.pickerItemTextSelected
                      ]}>
                        {locationOption}
                      </Text>
                      {selectedOutsideLocation === locationOption && (
                        <Ionicons name="checkmark-circle" size={20} color="#0E7490" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Inside Location Picker Modal */}
      <Modal
        visible={showInsideLocationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInsideLocationPicker(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Location</Text>
                <TouchableOpacity
                  onPress={() => setShowInsideLocationPicker(false)}
                  style={styles.pickerCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pickerSubtitle}>
                {INSIDE_LOCATION_OPTIONS.length} locations available
              </Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
                {INSIDE_LOCATION_OPTIONS.map((locationOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      selectedInsideLocation === locationOption && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setSelectedInsideLocation(locationOption);
                      setShowInsideLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemHeader}>
                      <Text style={[
                        styles.pickerItemText,
                        selectedInsideLocation === locationOption && styles.pickerItemTextSelected
                      ]}>
                        {locationOption}
                      </Text>
                      {selectedInsideLocation === locationOption && (
                        <Ionicons name="checkmark-circle" size={20} color="#0E7490" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Unit Location Picker Modal */}
      <Modal
        visible={showUnitLocationPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUnitLocationPicker(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Location</Text>
                <TouchableOpacity
                  onPress={() => setShowUnitLocationPicker(false)}
                  style={styles.pickerCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.pickerSubtitle}>
                {UNIT_LOCATION_OPTIONS.length} locations available
              </Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={true}>
                {UNIT_LOCATION_OPTIONS.map((locationOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pickerItem,
                      selectedUnitLocation === locationOption && styles.pickerItemSelected
                    ]}
                    onPress={() => {
                      setSelectedUnitLocation(locationOption);
                      setShowUnitLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerItemHeader}>
                      <Text style={[
                        styles.pickerItemText,
                        selectedUnitLocation === locationOption && styles.pickerItemTextSelected
                      ]}>
                        {locationOption}
                      </Text>
                      {selectedUnitLocation === locationOption && (
                        <Ionicons name="checkmark-circle" size={20} color="#0E7490" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Processing Modal with 3-second auto-dismiss */}
      <Modal
        visible={showProcessingModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowProcessingModal(false)}
      >
        <View style={styles.processingModalOverlay}>
          <View style={styles.processingModalContent}>
            <Text style={styles.processingModalTitle}>Processing</Text>
            <Text style={styles.processingModalMessage}>{processingMessage}</Text>
            <ActivityIndicator size="large" color="#0E7490" style={{ marginTop: 16 }} />
            <TouchableOpacity
              style={styles.processingModalButton}
              onPress={() => setShowProcessingModal(false)}
            >
              <Text style={styles.processingModalButtonText}>Please wait</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Code Reference Modal */}
      <Modal
        visible={showCodeReference}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCodeReference(false)}
      >
        <ModalZoomWrapper>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Ionicons name="document-text-outline" size={24} color="#0E7490" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle}>How to Inspect (IRC, IBU, Local)</Text>
                </View>
                <View style={styles.codeRefHeaderRight}>
                  {/* Font size controls */}
                  <View style={styles.fontSizePill}>
                    <TouchableOpacity
                      style={[styles.fontSizeBtn, codeRefFontSize <= 11 && styles.fontSizeBtnDisabled]}
                      onPress={() => setCodeRefFontSize(s => Math.max(11, s - 2))}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.fontSizeBtnText}>A－</Text>
                    </TouchableOpacity>
                    <View style={styles.fontSizeDivider} />
                    <TouchableOpacity
                      style={[styles.fontSizeBtn, codeRefFontSize >= 28 && styles.fontSizeBtnDisabled]}
                      onPress={() => setCodeRefFontSize(s => Math.min(28, s + 2))}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.fontSizeBtnText}>A＋</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => { setShowCodeReference(false); setCodeRefFontSize(15); }} style={styles.modalCloseButton}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <Text style={[styles.codeReferenceText, { fontSize: codeRefFontSize, lineHeight: codeRefFontSize * 1.6 }]}>{codeReferenceContent}</Text>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalDoneButton}
                  onPress={() => setShowCodeReference(false)}
                >
                  <Text style={styles.modalDoneButtonText}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ModalZoomWrapper>
      </Modal>

      {/* Fixed Bottom Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>PROCEED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0A4F63',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 1,
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 0.7,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  dropdownSelected: {
    borderColor: '#0E7490',
    borderWidth: 2,
  },
  dropdownText: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: '800',
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#374151',
    minHeight: 90,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  detailBoxDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E5E5E5',
  },
  detailBoxText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 22,
  },
  detailDropdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailDropdownBoxActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0E7490',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailDropdownText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
    marginRight: 6,
  },
  detailDropdownIcon: {
    paddingTop: 2,
  },
  criteriaDropdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  criteriaDropdownBoxActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0E7490',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  criteriaDropdownText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  criteriaDropdownIcon: {
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
  },
  inputText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  placeholderText: {
    color: '#4B5563',
    fontWeight: '700',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#374151',
  },
  textArea: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
    textAlignVertical: 'top',
  },
  textAreaPlaceholder: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '700',
  },
  textAreaValue: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '800',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  photoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
  },
  compactDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  compactDropdownText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    marginRight: 8,
    fontWeight: '700',
  },
  severityLifeThreateningBg: {
    backgroundColor: '#DC2626',
  },
  severitySevereBg: {
    backgroundColor: '#EA580C',
  },
  severityModerateBg: {
    backgroundColor: '#CA8A04',
  },
  severityLowBg: {
    backgroundColor: '#16A34A',
  },
  severityTextWhite: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  cancelButtonText: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  proceedButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  codeRefButton: {
    width: '100%',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  codeRefButtonActive: {
    backgroundColor: '#0E7490',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  codeRefButtonDisabled: {
    backgroundColor: '#0E7490',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  codeRefButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  codeRefButtonTextDisabled: {
    color: '#FFFFFF',
  },
  codeRefHintText: {
    marginTop: 8,
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '700',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  pickerCloseButton: {
    padding: 4,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  pickerSubtitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pickerList: {
    padding: 16,
  },
  pickerItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pickerItemSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0E7490',
    borderWidth: 2,
  },
  pickerItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  pickerItemTextSelected: {
    color: '#0E7490',
  },
  pickerItemDetail: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityLifeThreatening: {
    backgroundColor: '#FEE2E2',
  },
  severitySevere: {
    backgroundColor: '#FEF3C7',
  },
  severityModerate: {
    backgroundColor: '#DBEAFE',
  },
  severityLow: {
    backgroundColor: '#D1FAE5',
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  repairByText: {
    fontSize: 12,
    color: '#0E7490',
    fontWeight: '600',
  },
  pickerItemSeverity: {
    fontSize: 12,
    color: '#0E7490',
    fontWeight: '600',
  },
  // Editable text input style for criteria/detail boxes
  criteriaDropdownTextEditable: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 20,
    textAlignVertical: 'top',
    paddingRight: 30,
  },
  // Expand button for showing full text
  expandButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
  },
  // Expanded text modal styles
  expandedTextOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  expandedTextContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  expandedTextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  expandedTextTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  expandedTextCloseButton: {
    padding: 4,
  },
  expandedTextScrollView: {
    padding: 16,
    maxHeight: 400,
  },
  expandedTextBody: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
    lineHeight: 24,
  },
  expandedTextDoneButton: {
    backgroundColor: '#0E7490',
    margin: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  expandedTextDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Scoring Section Styles
  scoringCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  scoringRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  scoringField: {
    flex: 1,
  },
  scoringFieldFull: {
    flex: 1,
  },
  scoringFieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoringFieldValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  scoreHighlight: {
    color: '#0E7490',
    fontWeight: '700',
    fontSize: 16,
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  locationDropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  processingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  processingModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  processingModalMessage: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  processingModalButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 20,
    width: '100%',
  },
  processingModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  modalCloseButton: {
    padding: 4,
  },
  codeRefHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontSizePill: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  fontSizeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnDisabled: {
    opacity: 0.30,
  },
  fontSizeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0E7490',
  },
  fontSizeDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  codeReferenceText: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    fontWeight: '700',
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  modalDoneButton: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default DeficiencyDetailScreen;
