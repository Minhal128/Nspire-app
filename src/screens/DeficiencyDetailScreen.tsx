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
import { getDeficienciesForItem, DeficiencyOption, CODE_COMPLIANCE } from '../data/deficiencyMapping';
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

  const [availableDeficiencies, setAvailableDeficiencies] = useState<DeficiencyOption[]>([]);
  const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyOption | null>(null);
  const [showDeficiencyPicker, setShowDeficiencyPicker] = useState(false);
  const [showDetailPicker, setShowDetailPicker] = useState(false);

  const [repairBy, setRepairBy] = useState('');
  const [deficiencyCriteria, setDeficiencyCriteria] = useState('');
  const [note, setNote] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Load deficiencies for the selected item - NO autofill, user must select
    // Pass location type to get Inside vs Outside specific deficiencies
    const itemDeficiencies = getDeficienciesForItem(itemName, location);
    setAvailableDeficiencies(itemDeficiencies.deficiencies);
    // Reset selection when item changes - user must manually select from dropdown
    setSelectedDeficiency(null);
    setRepairBy('');
    setDeficiencyCriteria('');
  }, [itemName, location]);

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
          const uploadResult = await cloudinaryService.uploadImage(imageUri, {
            folder: 'nspire-inspections',
            tags: ['inspection', buildingId, itemName],
          });

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
            imageUrl: uploadResult.secure_url, // Cloudinary URL for storage
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
        {/* Deficiency Selected */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFICIENCY SELECTED</Text>
<<<<<<< HEAD
          <TouchableOpacity 
            style={[styles.dropdown, selectedDeficiency && styles.dropdownSelected]}
=======
          <TouchableOpacity
            style={styles.dropdown}
>>>>>>> 3aac976f54a9203e2cac3faffbe592ecb276d272
            onPress={() => setShowDeficiencyPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]} numberOfLines={2}>
              {selectedDeficiency ? selectedDeficiency.name : '-- Select Deficiency --'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={selectedDeficiency ? "#0E7490" : "#666666"} />
          </TouchableOpacity>
          {selectedDeficiency && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSelection}>
              <Ionicons name="close-circle" size={16} color="#EF4444" />
              <Text style={styles.clearButtonText}>Clear Selection</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Deficiency Detail and Criteria - Side by Side */}
        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>DEFICIENCY DETAIL</Text>
            <TouchableOpacity 
              style={[styles.compactDropdown, !selectedDeficiency && styles.detailBoxDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.compactDropdownText, !selectedDeficiency && styles.placeholderText]} numberOfLines={3}>
                {selectedDeficiency ? selectedDeficiency.detail : '--'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666666" />
            </TouchableOpacity>
          </View>
<<<<<<< HEAD
          <View style={styles.halfSection}>
            <Text style={styles.sectionLabel}>DEFICIENCY CRITERIA</Text>
            <TouchableOpacity 
              style={[styles.compactDropdown, !selectedDeficiency && styles.detailBoxDisabled]}
              activeOpacity={0.7}
            >
              <Text style={[styles.compactDropdownText, !selectedDeficiency && styles.placeholderText]} numberOfLines={3}>
                {deficiencyCriteria || '--'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666666" />
            </TouchableOpacity>
=======
        </View>

        {/* Deficiency Detail */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFICIENCY DETAIL</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDetailPicker(true)}
            disabled={!selectedDeficiency}
          >
            <Text style={[styles.dropdownText, !selectedDeficiency && styles.placeholderText]}>
              {selectedDeficiency ? selectedDeficiency.detail : '--Select--'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Deficiency Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DEFICIENCY CRITERIA</Text>
          <View style={styles.textAreaContainer}>
            <Text style={styles.textAreaValue}>
              {deficiencyCriteria || 'For example, 20 feet distance.'}
            </Text>
          </View>
        </View>

        {/* Code and Local Compliance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CODE AND LOCAL COMPLIANCE</Text>
          <View style={styles.textAreaContainer}>
            <Text style={styles.textAreaPlaceholder}>
              {CODE_COMPLIANCE}
            </Text>
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

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LOCATION</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>Building {buildingId}</Text>
          </View>
        </View>

        {/* Health & Safety */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HEALTH & SAFETY</Text>
          <View style={styles.textAreaContainer}>
            <Text style={styles.textAreaValue}>
              {selectedDeficiency ? selectedDeficiency.severity : 'Moderate'}
            </Text>
>>>>>>> 3aac976f54a9203e2cac3faffbe592ecb276d272
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
              <Text style={styles.pickerTitle}>Select Deficiency</Text>
              <TouchableOpacity 
                onPress={() => setShowDeficiencyPicker(false)}
                style={styles.pickerCloseButton}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.pickerSubtitle}>
              {availableDeficiencies.length} option{availableDeficiencies.length !== 1 ? 's' : ''} available
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minHeight: 80,
  },
  detailBoxDisabled: {
    backgroundColor: '#F9FAFB',
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
});

export default DeficiencyDetailScreen;
