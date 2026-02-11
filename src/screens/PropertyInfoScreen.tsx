import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Colors } from '../constants';
import { Ionicons } from '@expo/vector-icons';

type PropertyInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PropertyInfo'
>;
type PropertyInfoScreenRouteProp = RouteProp<RootStackParamList, 'PropertyInfo'>;

interface Props {
  navigation: PropertyInfoScreenNavigationProp;
  route: PropertyInfoScreenRouteProp;
}

const PropertyInfoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { property, selectedUnits } = route.params;

  // Editable unit names
  const [unitNames, setUnitNames] = useState<string[]>(selectedUnits);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempUnitNames, setTempUnitNames] = useState<string[]>(selectedUnits);

  const openEditModal = () => {
    setTempUnitNames([...unitNames]);
    setEditModalVisible(true);
  };

  const handleSaveUnitNames = () => {
    setUnitNames(tempUnitNames.map(n => n.trim() || 'Unnamed'));
    setEditModalVisible(false);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
  };

  const updateTempName = (index: number, value: string) => {
    setTempUnitNames(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleStartInspection = () => {
    navigation.navigate('InspectionCategories', {
      property,
      selectedUnits: unitNames,
      buildingId: 'B1',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Name Card */}
        <View style={styles.propertyNameCard}>
          <Text style={styles.propertyName}>{property.name || 'Golden Town'}</Text>
          <Text style={styles.propertyId}>ID: {property.propertyId || 'PRP-674060604'}</Text>
        </View>

        {/* Property Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{property.city || 'Abbotsford'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>State</Text>
              <Text style={styles.infoValue}>{property.state || 'British Columbia'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Zip Code</Text>
              <Text style={styles.infoValue}>{property.zipCode || property.zip || 'N/A'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Buildings</Text>
              <Text style={styles.infoValue}>{property.buildings || property.totalBuildings || 0}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.addressValue}>{property.address}</Text>
          </View>
        </View>

        {/* Building Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Building Information</Text>

          <View style={styles.buildingInfoRow}>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Building ID</Text>
              <Text style={styles.buildingValue}>B1</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>Total Units</Text>
              <Text style={styles.buildingValue}>{property.units || property.totalUnits || 0}</Text>
            </View>
            <View style={styles.buildingInfoItem}>
              <Text style={styles.buildingLabel}>For Inspection</Text>
              <Text style={styles.buildingValue}>{selectedUnits.length}</Text>
            </View>
          </View>
        </View>

        {/* Selected Units Card */}
        {unitNames.length > 0 && (
          <View style={styles.unitsCard}>
            <View style={styles.unitsTitleRow}>
              <Text style={styles.unitsTitle}>Selected Units</Text>
              <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                <Ionicons name="pencil-outline" size={16} color="#0E7490" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.unitsChipsContainer}>
              {unitNames.map((unit, index) => (
                <View key={index} style={styles.unitChip}>
                  <Text style={styles.unitChipText}>{unit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Edit Units Modal */}
        <Modal
          visible={editModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelEdit}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Rename Units</Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {tempUnitNames.map((name, index) => (
                  <View key={index} style={styles.modalInputRow}>
                    <Text style={styles.modalInputLabel}>Unit {index + 1}</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={name}
                      onChangeText={(text) => updateTempName(index, text)}
                      placeholder={`Enter unit name`}
                      placeholderTextColor="#9CA3AF"
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={handleCancelEdit}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveUnitNames}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartInspection}
          activeOpacity={0.8}
        >
          <Ionicons name="clipboard-outline" size={22} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Inspection</Text>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 140,
  },
  propertyNameCard: {
    backgroundColor: '#0E7490',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyId: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  buildingInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buildingInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  buildingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buildingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E7490',
  },
  unitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  unitsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0E7490',
  },
  unitsChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#0E7490',
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0E7490',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  startButton: {
    backgroundColor: '#0E7490',
    borderRadius: 50,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalInputRow: {
    marginBottom: 14,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#0E7490',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PropertyInfoScreen;
