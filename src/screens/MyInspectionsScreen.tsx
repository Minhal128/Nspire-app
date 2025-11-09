import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';

interface MyInspectionsScreenProps {
  navigation: any;
  onMenuPress?: () => void;
}

interface Property {
  id: string;
  name: string;
  propertyId: string;
  buildings: number;
  units: number;
  address: string;
}

export default function MyInspectionsScreen({ navigation, onMenuPress }: MyInspectionsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [compliance, setCompliance] = useState('');
  
  const handleMenuPress = () => {
    setSidebarVisible(true);
  };
  
  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('Dashboard' as never);
    } else if (screen === 'MyInspections') {
      // Already on MyInspections
    } else if (screen === 'Reports') {
      navigation.navigate('Reports' as never);
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      navigation.navigate('Settings' as never);
    }
  };
  
  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };
  
  const handleEditPress = (property: Property) => {
    setSelectedProperty(property);
    setActionModalVisible(true);
  };
  
  const handleEditProperty = () => {
    setActionModalVisible(false);
    navigation.navigate('EditProperty' as never, { property: selectedProperty } as never);
  };
  
  const handleReadyForInspection = () => {
    setActionModalVisible(false);
    if (selectedProperty) {
      navigation.navigate('UnitInspection' as never, { property: selectedProperty } as never);
    }
  };

  const handlePropertyCardPress = (property: Property) => {
    navigation.navigate('UnitInspection' as never, { property: property } as never);
  };
  
  const handleRemoveProperty = () => {
    setActionModalVisible(false);
    console.log('Remove property:', selectedProperty);
  };

  const properties: Property[] = [
    {
      id: '1',
      name: "STEPHEN'S PARK APARTMENTS",
      propertyId: '800000017',
      buildings: 12,
      units: 160,
      address: 'Lato..., Anchorage, Alaska, 99508'
    },
    {
      id: '2',
      name: 'Demure St-Hilaire',
      propertyId: '800000017',
      buildings: 12,
      units: 160,
      address: 'Lato..., Anchorage, Alaska, 99508'
    }
  ];

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setActionModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={styles.actionModalContent}>
            <Text style={styles.actionModalTitle}>Action</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleEditProperty}
            >
              <Text style={styles.actionButtonText}>Edit Property</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.inspectionButton]}
              onPress={handleReadyForInspection}
            >
              <Text style={[styles.actionButtonText, styles.inspectionButtonText]}>Ready For Inspection</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={handleRemoveProperty}
            >
              <Text style={[styles.actionButtonText, styles.removeButtonText]}>Remove Property</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
            <Ionicons name="menu" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Image 
            source={require('../../logo.png')} 
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>My Inspection</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProperty')}
          >
            <Text style={styles.addButtonText}>Add Property</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search property Here......"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filters */}
        <Text style={styles.filtersLabel}>Filters</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.filterItem}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={location}
                onValueChange={(itemValue: string) => setLocation(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Location" value="" />
                <Picker.Item label="Alaska" value="alaska" />
                <Picker.Item label="California" value="california" />
              </Picker>
              <Ionicons 
                name="chevron-down" 
                size={18} 
                color="#6B7280" 
                style={styles.pickerIcon}
              />
            </View>
          </View>

          <View style={styles.filterItem}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={compliance}
                onValueChange={(itemValue: string) => setCompliance(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Compliance" value="" />
                <Picker.Item label="Compliant" value="compliant" />
                <Picker.Item label="Non-Compliant" value="non-compliant" />
              </Picker>
              <Ionicons 
                name="chevron-down" 
                size={18} 
                color="#6B7280" 
                style={styles.pickerIcon}
              />
            </View>
          </View>
        </View>

        {/* Property List */}
        <View style={styles.propertyList}>
          {properties.map((property) => (
            <TouchableOpacity 
              key={property.id} 
              style={styles.propertyCard}
              activeOpacity={0.7}
              onPress={() => handlePropertyCardPress(property)}
            >
              <View style={styles.propertyHeader}>
                <Text style={styles.propertyName}>{property.name}</Text>
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEditPress(property);
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
                </TouchableOpacity>
              </View>
              <Text style={styles.propertyDetail}>
                Property ID: <Text style={styles.propertyId}>{property.propertyId}</Text>
              </Text>
              <Text style={styles.propertyDetail}>
                No. of Buildings: <Text style={styles.propertyValue}>{property.buildings}</Text>
              </Text>
              <Text style={styles.propertyDetail}>
                Units: <Text style={styles.propertyValue}>{property.units}</Text>
              </Text>
              <Text style={styles.propertyDetail}>
                Address: <Text style={styles.addressLink}>{property.address}</Text>
              </Text>
              
              {/* Edit/Update Button */}
              <TouchableOpacity 
                style={styles.editButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleEditPress(property);
                }}
              >
                <Text style={styles.editButtonText}>Edit/Update</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CEF8FF',
  },
  headerContainer: {
    backgroundColor: '#CEF8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 15,
  },
  headerLogo: {
    width: 180,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#0E7490',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#374151',
  },
  filtersLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterItem: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  picker: {
    height: 45,
    color: '#374151',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 13,
    pointerEvents: 'none',
  },
  propertyList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  propertyDetail: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  propertyId: {
    color: '#0E7490',
    fontWeight: '600',
  },
  propertyValue: {
    color: '#1F2937',
    fontWeight: '600',
  },
  addressLink: {
    color: '#0E7490',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  editButton: {
    backgroundColor: '#84CC16',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  inspectionButton: {
    backgroundColor: '#006B8F',
    borderColor: '#006B8F',
    borderWidth: 0,
  },
  inspectionButtonText: {
    color: '#FFFFFF',
  },
  removeButton: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
    borderWidth: 0,
  },
  removeButtonText: {
    color: '#FFFFFF',
  },
});
