import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DEFICIENCY_DATA, DeficiencyItem } from '../data/deficiencyData';
import { 
  calculateInsideScore, 
  extractInsideCategoryNumber,
  InsideScoringResult 
} from '../utils/insideScoringCalculations';

interface DeficiencyFillingScreenProps {
  navigation: any;
  route: any;
}

export default function DeficiencyFillingScreen({ navigation, route }: DeficiencyFillingScreenProps) {
  const { property, selectedUnits, coverage, totalUnits, samplingInfo, category, selectedModule } = route.params || {};
  
  const [selectedDeficiency, setSelectedDeficiency] = useState<DeficiencyItem | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Calculate NSPIRE scoring based on selected deficiency
  const scoringResult: InsideScoringResult | null = useMemo(() => {
    if (!selectedDeficiency || category !== 'inside') return null;
    
    const categoryNumber = extractInsideCategoryNumber(
      selectedDeficiency.id,
      selectedDeficiency.category
    );
    const totalSamples = selectedUnits?.length || 1;
    
    return calculateInsideScore({
      categoryNumber,
      totalSamples,
      deficiencyDescription: selectedDeficiency.deficiencyDetail || selectedDeficiency.deficiencySelected,
      deficiencyCount: 1,
    });
  }, [selectedDeficiency, category, selectedUnits]);

  // Auto-select first deficiency for the category/module
  useEffect(() => {
    const relevantDeficiencies = DEFICIENCY_DATA.filter(d => 
      d.locationType === category || d.locationType === 'both'
    );
    
    if (relevantDeficiencies.length > 0) {
      // For outside, filter by module if available
      if (category === 'outside' && selectedModule) {
        const moduleDeficiencies = relevantDeficiencies.filter(d => 
          d.category.toLowerCase().includes(selectedModule.name.toLowerCase().split(' ')[0]) ||
          selectedModule.name.toLowerCase().includes(d.category.toLowerCase().split(' ')[0])
        );
        setSelectedDeficiency(moduleDeficiencies[0] || relevantDeficiencies[0]);
      } else {
        setSelectedDeficiency(relevantDeficiencies[0]);
      }
    }
  }, [category, selectedModule]);

  const handleImageCapture = async (useCamera: boolean) => {
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
            allowsMultipleSelection: false,
          });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCapturedImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (capturedImages.length === 0) {
      Alert.alert('No Images', 'Please capture at least one image before proceeding');
      return;
    }

    // Navigate to summary screen
    navigation.navigate('InspectionSummary', {
      property,
      selectedUnits,
      coverage,
      totalUnits,
      samplingInfo,
      category,
      selectedModule,
      selectedDeficiency,
      capturedImages,
      scoringResult, // Include NSPIRE scoring data
    });
  };

  if (!selectedDeficiency) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E7490" />
          <Text style={styles.loadingText}>Loading deficiency data...</Text>
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
        <Text style={styles.headerTitle}>Deficiency Filling</Text>
        <View style={styles.connectionIndicator}>
          <View style={[styles.connectionDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.connectionText}>Online</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Property Info */}
        <View style={styles.propertyCard}>
          <Text style={styles.propertyName}>{property?.name || 'Unknown Property'}</Text>
          <Text style={styles.propertyAddress}>
            {property?.address || 'karachi, Acton, Australian Capital Territory, 75290'}
          </Text>
        </View>

        {/* Module Info (for outside) */}
        {selectedModule && (
          <View style={styles.moduleCard}>
            <View style={[styles.moduleIcon, { backgroundColor: selectedModule.color }]}>
              <Ionicons name={selectedModule.icon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{selectedModule.name}</Text>
              <Text style={styles.moduleDescription}>{selectedModule.description}</Text>
            </View>
          </View>
        )}

        {/* Deficiency Details */}
        <View style={styles.deficiencyCard}>
          <View style={styles.deficiencyHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{selectedDeficiency.category}</Text>
            </View>
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>{category.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.deficiencyTitle}>Selected Deficiency</Text>
          <Text style={styles.deficiencySelected}>{selectedDeficiency.deficiencySelected}</Text>

          <Text style={styles.sectionTitle}>Deficiency Detail</Text>
          <Text style={styles.deficiencyDetail}>{selectedDeficiency.deficiencyDetail}</Text>

          <Text style={styles.sectionTitle}>Deficiency Criteria</Text>
          <Text style={styles.deficiencyCriteria}>{selectedDeficiency.deficiencyCriteria}</Text>

          <Text style={styles.sectionTitle}>Code Compliance</Text>
          <Text style={styles.codeCompliance}>{selectedDeficiency.codeCompliance}</Text>
        </View>

        {/* NSPIRE Scoring Card - Inside inspections only */}
        {scoringResult && (
          <View style={styles.scoringCard}>
            <View style={styles.scoringHeader}>
              <Ionicons name="calculator" size={20} color="#0E7490" />
              <Text style={styles.scoringTitle}>NSPIRE Scoring</Text>
            </View>
            
            <View style={styles.scoringGrid}>
              <View style={styles.scoringItem}>
                <Text style={styles.scoringLabel}>Severity</Text>
                <View style={[
                  styles.severityBadge,
                  scoringResult.severity === 'Life-Threatening' && styles.severityLifeThreatening,
                  scoringResult.severity === 'Severe' && styles.severitySevere,
                  scoringResult.severity === 'Moderate' && styles.severityModerate,
                  scoringResult.severity === 'Low' && styles.severityLow,
                ]}>
                  <Text style={styles.severityText}>{scoringResult.severity}</Text>
                </View>
              </View>
              
              <View style={styles.scoringItem}>
                <Text style={styles.scoringLabel}>Points Lost</Text>
                <Text style={styles.scoringValue}>{scoringResult.pointsLost.toFixed(2)}</Text>
              </View>
              
              <View style={styles.scoringItem}>
                <Text style={styles.scoringLabel}>Max Pts Lost</Text>
                <Text style={styles.scoringValue}>{scoringResult.maxPtsLost.toFixed(4)}</Text>
              </View>
              
              <View style={styles.scoringItem}>
                <Text style={styles.scoringLabel}>Score</Text>
                <Text style={[styles.scoringValue, styles.scoreHighlight]}>{scoringResult.score.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.scoringFooter}>
              <Text style={styles.scoringFooterText}>
                Category {scoringResult.categoryNumber} • {scoringResult.totalSamples} samples • Possible: {scoringResult.possibleScore}
              </Text>
            </View>
          </View>
        )}

        {/* Image Capture Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Capture Evidence</Text>
          <Text style={styles.sectionSubtitle}>
            Take photos to document this deficiency
          </Text>

          <View style={styles.captureButtons}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => handleImageCapture(true)}
            >
              <Ionicons name="camera" size={24} color="#FFFFFF" />
              <Text style={styles.captureButtonText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, styles.galleryButton]}
              onPress={() => handleImageCapture(false)}
            >
              <Ionicons name="images" size={24} color="#FFFFFF" />
              <Text style={styles.captureButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Captured Images */}
          {capturedImages.length > 0 && (
            <View style={styles.capturedImagesSection}>
              <Text style={styles.capturedImagesTitle}>
                Captured Images ({capturedImages.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesList}>
                  {capturedImages.map((imageUri, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri: imageUri }} style={styles.capturedImage} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[styles.proceedButton, capturedImages.length === 0 && styles.proceedButtonDisabled]}
          onPress={handleProceed}
          disabled={capturedImages.length === 0}
        >
          <Text style={[styles.proceedButtonText, capturedImages.length === 0 && styles.proceedButtonTextDisabled]}>
            Proceed to Summary
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={capturedImages.length === 0 ? '#9CA3AF' : '#FFFFFF'} 
          />
        </TouchableOpacity>
      </ScrollView>
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
    gap: 12,
  },
  loadingText: {
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
    fontWeight: '600',
    color: '#1F2937',
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  moduleDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  deficiencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deficiencyHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#0E7490',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  locationBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deficiencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  deficiencySelected: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
    marginTop: 12,
  },
  deficiencyDetail: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  deficiencyCriteria: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  codeCompliance: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  imageSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  galleryButton: {
    backgroundColor: '#7C3AED',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  capturedImagesSection: {
    marginTop: 16,
  },
  capturedImagesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  imagesList: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  capturedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  proceedButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  proceedButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  proceedButtonTextDisabled: {
    color: '#9CA3AF',
  },
  // NSPIRE Scoring Styles
  scoringCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#0E7490',
  },
  scoringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scoringTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  scoringGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scoringItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  scoringLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  scoringValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  scoreHighlight: {
    color: '#059669',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  severityLifeThreatening: {
    backgroundColor: '#DC2626',
  },
  severitySevere: {
    backgroundColor: '#EA580C',
  },
  severityModerate: {
    backgroundColor: '#F59E0B',
  },
  severityLow: {
    backgroundColor: '#10B981',
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scoringFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  scoringFooterText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});