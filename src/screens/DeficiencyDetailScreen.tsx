import React, { useState, useEffect } from 'react';
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
  CODE_COMPLIANCE 
} from '../data/deficiencyMapping';
import {
  getDeficienciesForItemInside,
  getDeficienciesForSubcategoryInside,
  hasSubcategoriesInside,
  getSubcategoriesForItemInside,
} from '../data/deficiencyMappingInside';
import { cloudinaryService } from '../services/cloudinaryService';
import { geminiService } from '../services/openaiService';

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
  const { property, selectedUnits, buildingId, location, itemId, itemName } = route.params;

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

  useEffect(() => {
    const isInside = location?.toLowerCase() === 'inside';
    
    // Check if item has subcategories based on location type
    const hasSubcats = isInside 
      ? hasSubcategoriesInside(itemName)
      : hasSubcategories(itemName, location);
    setItemHasSubcategories(hasSubcats);
    
    if (hasSubcats) {
      // Get subcategories for this item based on location type
      if (isInside) {
        const subcats = getSubcategoriesForItemInside(itemName);
        setAvailableSubcategories(subcats.map((name, index) => ({ id: `subcat_${index}`, name })));
      } else {
        const subcats = getSubcategoriesForItem(itemName, location);
        setAvailableSubcategories(subcats);
      }
      setAvailableDeficiencies([]);  // Wait for subcategory selection
      setSelectedSubcategory(null);
    } else {
      // Load deficiencies directly for the selected item based on location type
      if (isInside) {
        const itemDeficiencies = getDeficienciesForItemInside(itemName);
        setAvailableDeficiencies(itemDeficiencies?.deficiencies || []);
      } else {
        const itemDeficiencies = getDeficienciesForItem(itemName, location);
        setAvailableDeficiencies(itemDeficiencies.deficiencies);
      }
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
    const isInside = location?.toLowerCase() === 'inside';
    
    // Load deficiencies for selected subcategory based on location type
    if (isInside) {
      const subDeficiencies = getDeficienciesForSubcategoryInside(subcategory.name);
      setAvailableDeficiencies(subDeficiencies?.deficiencies || []);
    } else {
      const subDeficiencies = getDeficienciesForSubcategory(subcategory.name);
      setAvailableDeficiencies(subDeficiencies.deficiencies);
    }
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

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
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
    if (!selectedDeficiency) {
      Alert.alert('Error', 'Please select a deficiency');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    try {
      // Show loading alert
      Alert.alert('Processing', `Analyzing ${images.length} image(s) with AI...`, [{ text: 'Please wait' }]);

      // Upload all images to Cloudinary and analyze with AI
      const analyzedDeficiencies = [];

      for (let i = 0; i < images.length; i++) {
        const imageUri = images[i];

        try {
          // Upload to Cloudinary
          const uploadResult = await cloudinaryService.uploadImage(
            imageUri,
            'nspire-inspections'
          );

          // Call AI analysis (Gemini service) - use LOCAL imageUri, not Cloudinary URL
          let aiAnalysis;
          try {
            aiAnalysis = await geminiService.analyzeDeficiency(
              imageUri, // Use local URI for AI analysis
              selectedDeficiency.name,
              itemName
            );
          } catch (aiError) {
            console.error('AI analysis error:', aiError);
            // Fallback if AI analysis fails
            aiAnalysis = {
              analysis: `${selectedDeficiency.name} observed in ${itemName}`,
              severity: selectedDeficiency.severity,
              recommendations: selectedDeficiency.detail,
            };
          }

          // Create deficiency entry with AI analysis
          analyzedDeficiencies.push({
            deficiency: {
              ...selectedDeficiency,
              aiAnalysis: aiAnalysis.analysis,
              aiSeverity: aiAnalysis.severity,
              aiRecommendations: aiAnalysis.recommendations,
            },
            imageUrl: uploadResult.secureUrl, // Cloudinary URL for storage
            imageUri: imageUri, // Local URI for display
            note: note || aiAnalysis.analysis,
            location,
            itemName,
            itemId,
            analyzedAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error);
          // Still add the deficiency without AI analysis
          analyzedDeficiencies.push({
            deficiency: selectedDeficiency,
            imageUrl: null,
            imageUri: imageUri,
            note,
            location,
            itemName,
            itemId,
            analyzedAt: new Date().toISOString(),
          });
        }
      }

      // Navigate to summary with all analyzed deficiencies
      navigation.navigate('InspectionSummary', {
        property,
        selectedUnits,
        buildingId,
        inspectionData: {
          deficiencies: analyzedDeficiencies, // Array of deficiencies
          totalImages: images.length,
          location,
          itemName,
          itemId,
        },
      });

      // Show success message
      setTimeout(() => {
        Alert.alert(
          'Success',
          `${analyzedDeficiencies.length} deficienc${analyzedDeficiencies.length === 1 ? 'y' : 'ies'} recorded and analyzed successfully!`
        );
      }, 500);
    } catch (error) {
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
        {/* DEFICIENCY SELECTED - First dropdown for all items */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFICIENCY SELECTED</Text>
          {itemHasSubcategories ? (
            // For items with subcategories: Pick subcategory first
            <TouchableOpacity 
              style={[styles.dropdown, selectedSubcategory && styles.dropdownSelected]}
              onPress={() => setShowSubcategoryPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownText, !selectedSubcategory && styles.placeholderText]} numberOfLines={2}>
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
                <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]} numberOfLines={2}>
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

        {/* DEFICIENCY DETAIL - For subcategory items: dropdown to pick deficiency; For non-subcategory items: editable display */}
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
                <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]} numberOfLines={2}>
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
          ) : (
            // For items without subcategories: Editable detail with tap-to-expand
            <TouchableOpacity 
              style={[styles.criteriaDropdownBox, selectedDeficiency && styles.criteriaDropdownBoxActive]}
              onPress={() => handleShowExpandedText('Deficiency Detail', selectedDeficiency?.detail || customDeficiencyDetail || '')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.criteriaDropdownTextEditable, !selectedDeficiency && styles.placeholderText]}
                numberOfLines={4}
              >
                {selectedDeficiency?.detail || '-- Select deficiency first --'}
              </Text>
              <TouchableOpacity 
                style={styles.expandButton}
                onPress={() => handleShowExpandedText('Deficiency Detail', selectedDeficiency?.detail || customDeficiencyDetail || '')}
              >
                <Ionicons name="expand-outline" size={18} color="#0E7490" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        {/* Deficiency Criteria - Editable with tap-to-expand */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFICIENCY CRITERIA</Text>
          <TouchableOpacity 
            style={[styles.criteriaDropdownBox, selectedDeficiency && styles.criteriaDropdownBoxActive]}
            onPress={() => handleShowExpandedText('Deficiency Criteria', deficiencyCriteria || customDeficiencyCriteria || '')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.criteriaDropdownTextEditable, !selectedDeficiency && styles.placeholderText]}
              numberOfLines={3}
            >
              {deficiencyCriteria || '-- Select deficiency first --'}
            </Text>
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => handleShowExpandedText('Deficiency Criteria', deficiencyCriteria || customDeficiencyCriteria || '')}
            >
              <Ionicons name="expand-outline" size={18} color="#0E7490" />
            </TouchableOpacity>
          </TouchableOpacity>
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

        {/* Location and Health & Safety - Side by Side */}
        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>LOCATION</Text>
            <View style={styles.compactDropdown}>
              <Text style={styles.compactDropdownText}>Building {buildingId}</Text>
            </View>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>HEALTH & SAFETY</Text>
            <View style={[
              styles.compactDropdown,
              selectedDeficiency?.severity === 'Life-Threatening' && styles.severityLifeThreateningBg,
              selectedDeficiency?.severity === 'Severe' && styles.severitySevereBg,
              selectedDeficiency?.severity === 'Moderate' && styles.severityModerateBg,
              selectedDeficiency?.severity === 'Low' && styles.severityLowBg,
            ]}>
              <Text style={[
                styles.compactDropdownText,
                selectedDeficiency?.severity && styles.severityTextWhite
              ]}>
                {selectedDeficiency ? selectedDeficiency.severity : 'Low'}
              </Text>
            </View>
          </View>
        </View>
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
      </Modal>

      {/* Expanded Text Modal - Shows full text when user taps on truncated content */}
      <Modal
        visible={showExpandedText}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowExpandedText(false)}
      >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0E7490',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dropdownSelected: {
    borderColor: '#0E7490',
    borderWidth: 2,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
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
    fontSize: 13,
    color: '#EF4444',
    marginLeft: 4,
    fontWeight: '500',
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
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
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 18,
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
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 17,
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
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
    marginRight: 8,
  },
  criteriaDropdownIcon: {
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999999',
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    fontSize: 15,
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  textAreaPlaceholder: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  textAreaValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
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
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
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
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 80,
  },
  compactDropdownText: {
    fontSize: 13,
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
    fontWeight: '500',
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
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pickerSubtitle: {
    fontSize: 13,
    color: '#666666',
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
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  pickerItemTextSelected: {
    color: '#0E7490',
  },
  pickerItemDetail: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
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
    fontSize: 14,
    color: '#1A1A1A',
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
    fontSize: 15,
    color: '#333333',
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
});

export default DeficiencyDetailScreen;
