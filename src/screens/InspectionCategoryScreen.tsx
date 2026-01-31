import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InspectionCategoryScreenProps {
  navigation: any;
  route: any;
}

export default function InspectionCategoryScreen({ navigation, route }: InspectionCategoryScreenProps) {
  const { property, selectedUnits, coverage, totalUnits, samplingInfo } = route.params || {};

  const handleCategorySelect = (category: 'inside' | 'outside') => {
    if (category === 'inside') {
      // For Inside, go directly to deficiency filling (simplified flow)
      navigation.navigate('DeficiencyFilling', {
        property,
        selectedUnits,
        coverage,
        totalUnits,
        samplingInfo,
        category: 'inside',
        selectedModule: null,
      });
    } else {
      // For Outside, show module selection first
      navigation.navigate('ModuleSelection', {
        property,
        selectedUnits,
        coverage,
        totalUnits,
        samplingInfo,
        category: 'outside',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Inspection</Text>
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

        {/* Inspection Type */}
        <View style={styles.inspectionTypeCard}>
          <View style={styles.inspectionTypeRow}>
            <Ionicons name="clipboard-outline" size={20} color="#0E7490" />
            <Text style={styles.inspectionTypeLabel}>Inspection Type</Text>
            <Text style={styles.inspectionTypeValue}>General Inspection</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </View>

        {/* Processing Mode */}
        <View style={styles.processingModeCard}>
          <Text style={styles.processingModeLabel}>Processing Mode:</Text>
          <View style={styles.processingModeButtons}>
            <TouchableOpacity style={[styles.processingModeButton, styles.processingModeButtonActive]}>
              <Text style={[styles.processingModeButtonText, styles.processingModeButtonTextActive]}>
                One-by-One
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.processingModeButton}>
              <Text style={styles.processingModeButtonText}>Batch</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Capture Images</Text>
          
          <View style={styles.categoryButtons}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => handleCategorySelect('inside')}
            >
              <Ionicons name="camera" size={32} color="#FFFFFF" />
              <Text style={styles.categoryButtonText}>Inside</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.categoryButton, styles.outsideButton]}
              onPress={() => handleCategorySelect('outside')}
            >
              <Ionicons name="images" size={32} color="#FFFFFF" />
              <Text style={styles.categoryButtonText}>Outside</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.previewButton}>
            <Ionicons name="eye-outline" size={20} color="#6B7280" />
            <Text style={styles.previewButtonText}>Preview Report</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.exportButton}>
            <Ionicons name="download-outline" size={20} color="#6B7280" />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
        </View>
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
  inspectionTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspectionTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inspectionTypeLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  inspectionTypeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  processingModeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  processingModeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  processingModeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  processingModeButtonActive: {
    backgroundColor: '#0E7490',
  },
  processingModeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  processingModeButtonTextActive: {
    color: '#FFFFFF',
  },
  categorySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  outsideButton: {
    backgroundColor: '#7C3AED',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});