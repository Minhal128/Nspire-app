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
import { INSIDE_LOCATIONS, OUTSIDE_LOCATIONS, DEFICIENCY_OPTIONS, DEFICIENCY_DATA, DeficiencyItem, getShortDeficiencyName, getDeficiencyOptions } from '../data/deficiencyData';

const { width } = Dimensions.get('window');

interface AIInspectionScreenProps {
  navigation: any;
  route: any;
}

// Outside inspection items
const OUTSIDE_ITEMS = [
  'Address and Signage',
  'Chimney',
  'Clothes Dryer Exhaust Ventilation',
  'Door',
  'Drain',
  'Egress',
  'Electrical',
  'Fencing/Gate',
  'Fire Safety',
  'Foundation Standard',
  'Hazard',
  'Heating, Ventilation, and Air Conditioning (HVAC)',
  'Leak – Gas or Oil',
  'Leak - sewage system',
  'Leak - water',
  'Lighting',
  'Parking lots, Driveways, Roads',
  'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  'Railings',
  'Roof Assembly',
  'Sidewalk, walkway,and ramp',
  'Step and Stairs',
  'Structural',
  'RETAINING WALL',
  'Water Heater',
  'General * comment:',
];

// Inside inspection items
const INSIDE_ITEMS = [
  'Cabinet and Storage (Pantry, Laundry)',
  'Call-for-Aid System',
  'Carbon Monoxide Alarm',
  'Ceiling',
  'Chimney',
  'Clothes Dryer Exhaust Ventilation',
  'Door',
  'Drainage',
  'Electrical',
  'Elevator',
  'Fire Safety',
  'Floor',
  'Foundation',
  'Grab Bar',
  'Hazard',
  'Heating, Ventilation, and Air Conditioning',
  'Kitchen',
  'LEAK – Gas or Oil',
  'Leak-sewage system (Clogged drain)(Missing drain cap).',
  'Leak- water',
  'Lighting',
  'Mold',
  'Paint - Potential Lead-Based Paint Hazards – Visual Assessment',
  'Railings',
  'Restroom',
  'Sink (Laundry, Garage, or patio)',
  'Steps and Stairs',
  'Structural System',
  'Trash Chute',
  'Ventilation',
  'Wall',
  'Water Heater',
  'Window',
  'General comment:',
];

type InspectionStatus = 'No OD' | 'OD' | 'N/A';

interface InspectionItem {
  name: string;
  status: InspectionStatus;
}

export default function AIInspectionScreen({ navigation, route }: AIInspectionScreenProps) {
  const { property, selectedUnits, coverage, totalUnits, samplingInfo } = route.params || {};
  
  const [currentView, setCurrentView] = useState<'main' | 'outside' | 'inside' | 'units'>('main');
  const [outsideItems, setOutsideItems] = useState<InspectionItem[]>(
    OUTSIDE_ITEMS.map(name => ({ name, status: 'No OD' }))
  );
  const [insideItems, setInsideItems] = useState<InspectionItem[]>(
    INSIDE_ITEMS.map(name => ({ name, status: 'No OD' }))
  );

  const handleStatusChange = (index: number, status: InspectionStatus, type: 'outside' | 'inside') => {
    if (type === 'outside') {
      const newItems = [...outsideItems];
      newItems[index].status = status;
      setOutsideItems(newItems);
    } else {
      const newItems = [...insideItems];
      newItems[index].status = status;
      setInsideItems(newItems);
    }
  };

  const handleSelectAll = (status: InspectionStatus, type: 'outside' | 'inside') => {
    if (type === 'outside') {
      setOutsideItems(outsideItems.map(item => ({ ...item, status })));
    } else {
      setInsideItems(insideItems.map(item => ({ ...item, status })));
    }
  };

  const getStatusColor = (status: InspectionStatus) => {
    switch (status) {
      case 'No OD': return '#10B981';
      case 'OD': return '#EF4444';
      case 'N/A': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      {/* Property Info */}
      <View style={styles.propertyCard}>
        <Text style={styles.propertyName}>{property?.name || 'pink avenue'}</Text>
        <Text style={styles.propertyAddress}>
          karachi, Acton, Australian Capital Territory, 75290
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

      {/* Three Main Buttons */}
      <View style={styles.mainButtonsContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => setCurrentView('outside')}
        >
          <Ionicons name="camera" size={32} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>Outside</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mainButton, styles.insideButton]}
          onPress={() => setCurrentView('inside')}
        >
          <Ionicons name="images" size={32} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>Inside</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.mainButton, styles.unitsButton]}
          onPress={() => setCurrentView('units')}
        >
          <Ionicons name="business" size={32} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>Units</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.previewButton}>
          <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
          <Text style={styles.previewButtonText}>Preview Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInspectionTable = (items: InspectionItem[], type: 'outside' | 'inside') => (
    <View style={styles.tableContainer}>
      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>{type.toUpperCase()} INSPECTION</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('main')}
        >
          <Ionicons name="arrow-back" size={20} color="#0E7490" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header Row */}
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderCell, styles.itemNameHeader]}>
          {type.toUpperCase()} BUTTON
        </Text>
        <TouchableOpacity 
          style={styles.selectAllButton}
          onPress={() => handleSelectAll('No OD', type)}
        >
          <Text style={styles.selectAllText}>Select All{'\n'}No OD</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.selectAllButton}
          onPress={() => handleSelectAll('OD', type)}
        >
          <Text style={styles.selectAllText}>Observe{'\n'}Deficiency</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.selectAllButton}
          onPress={() => handleSelectAll('N/A', type)}
        >
          <Text style={styles.selectAllText}>Select All{'\n'}N/A</Text>
        </TouchableOpacity>
      </View>

      {/* Table Rows */}
      <ScrollView style={styles.tableScrollView}>
        {items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.itemNumber}>{index + 1}.</Text>
            <Text style={styles.itemName}>{item.name}</Text>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                item.status === 'No OD' && styles.statusButtonActive,
                { backgroundColor: item.status === 'No OD' ? '#10B981' : '#F3F4F6' }
              ]}
              onPress={() => handleStatusChange(index, 'No OD', type)}
            >
              <Text style={[
                styles.statusButtonText,
                item.status === 'No OD' && styles.statusButtonTextActive
              ]}>
                No OD
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                item.status === 'OD' && styles.statusButtonActive,
                { backgroundColor: item.status === 'OD' ? '#EF4444' : '#F3F4F6' }
              ]}
              onPress={() => handleStatusChange(index, 'OD', type)}
            >
              <Text style={[
                styles.statusButtonText,
                item.status === 'OD' && styles.statusButtonTextActive
              ]}>
                OD
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton,
                item.status === 'N/A' && styles.statusButtonActive,
                { backgroundColor: item.status === 'N/A' ? '#6B7280' : '#F3F4F6' }
              ]}
              onPress={() => handleStatusChange(index, 'N/A', type)}
            >
              <Text style={[
                styles.statusButtonText,
                item.status === 'N/A' && styles.statusButtonTextActive
              ]}>
                N/A
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderUnitsView = () => (
    <View style={styles.unitsContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableTitle}>UNITS INSPECTION</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('main')}
        >
          <Ionicons name="arrow-back" size={20} color="#0E7490" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.unitsContent}>
        <Text style={styles.unitsTitle}>Selected Units for Inspection</Text>
        <Text style={styles.unitsSubtitle}>
          Total Units: {totalUnits || 1} | Coverage: {coverage || '100%'}
        </Text>
        
        {selectedUnits && selectedUnits.length > 0 ? (
          <View style={styles.unitsList}>
            {selectedUnits.map((unit: string, index: number) => (
              <View key={index} style={styles.unitChip}>
                <Text style={styles.unitChipText}>{unit}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noUnitsContainer}>
            <Ionicons name="business-outline" size={48} color="#6B7280" />
            <Text style={styles.noUnitsText}>No specific units selected</Text>
            <Text style={styles.noUnitsSubtext}>General property inspection</Text>
          </View>
        )}
        
        {samplingInfo && (
          <View style={styles.samplingInfo}>
            <Text style={styles.samplingTitle}>Sampling Information</Text>
            <Text style={styles.samplingText}>
              Method: {samplingInfo.method || 'Standard'}
            </Text>
            <Text style={styles.samplingText}>
              Selected: {samplingInfo.selectedUnits || samplingInfo.unitsToInspect || 1} units
            </Text>
          </View>
        )}
      </View>
    </View>
  );

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

      {/* Content */}
      {currentView === 'main' && renderMainView()}
      {currentView === 'outside' && renderInspectionTable(outsideItems, 'outside')}
      {currentView === 'inside' && renderInspectionTable(insideItems, 'inside')}
      {currentView === 'units' && renderUnitsView()}
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
  mainContainer: {
    flex: 1,
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
  inspectionTypeCard: {
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
  inspectionTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inspectionTypeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 10,
    flex: 1,
  },
  inspectionTypeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  processingModeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingModeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  processingModeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  processingModeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
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
  mainButtonsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  mainButton: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  insideButton: {
    backgroundColor: '#6366F1',
  },
  unitsButton: {
    backgroundColor: '#10B981',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
  },
  previewButtonText: {
    color: '#0E7490',
    fontSize: 14,
    fontWeight: '700',
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 14,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    flex: 2,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  itemNameHeader: {
    flex: 2,
  },
  selectAllButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  selectAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },
  tableScrollView: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 60,
  },
  itemNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 24,
  },
  itemName: {
    flex: 2,
    fontSize: 13,
    color: '#374151',
    paddingRight: 8,
    lineHeight: 18,
  },
  statusButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusButtonActive: {
    borderColor: 'transparent',
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  unitsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  unitsContent: {
    flex: 1,
    padding: 20,
  },
  unitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  unitsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  unitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  unitChip: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  unitChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
  },
  noUnitsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noUnitsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  noUnitsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  samplingInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  samplingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 8,
  },
  samplingText: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 4,
  },
});