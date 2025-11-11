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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { DashboardScreenNavigationProp } from '../types/navigation';
import Sidebar from '../components/Sidebar';

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
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

export default function DashboardScreen({ navigation, onMenuPress }: DashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const handleMenuPress = () => {
    setSidebarVisible(true);
  };
  
  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Already on dashboard
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections' as never);
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
    navigation.navigate('Boarding');
  };
  
  const handleEditPress = (property: Property) => {
    setSelectedProperty(property);
    setActionModalVisible(true);
  };
  
  const handleEditProperty = () => {
    setActionModalVisible(false);
    navigation.navigate('EditProperty', { property: selectedProperty });
  };
  
  const handleReadyForInspection = () => {
    setActionModalVisible(false);
    console.log('Ready for inspection:', selectedProperty);
  };
  
  const handleRemoveProperty = () => {
    setActionModalVisible(false);
    console.log('Remove property:', selectedProperty);
  };
  
  const [propertyName, setPropertyName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  const properties: Property[] = [
    {
      id: '1',
      name: "STEPHEN'S PARK APARTMENTS",
      propertyId: 'R00000017',
      buildings: 12,
      units: 160,
      address: 'Lane , Anchorage, Alaska, 99508'
    },
    {
      id: '2',
      name: 'Demure St-Hilaire',
      propertyId: 'R00000017',
      buildings: 12,
      units: 160,
      address: 'Lane , Anchorage, Alaska, 99508'
    }
  ];

  const clearPropertyName = () => {
    setPropertyName('');
  };

  return (
    <>
      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onClose={() => setSidebarVisible(false)}
              onNavigate={handleSidebarNavigate}
              onLogout={handleLogout}
            />
          </View>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSidebarVisible(false)}
          />
        </View>
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
              style={[styles.actionButton, styles.inspectionModalButton]}
              onPress={handleReadyForInspection}
            >
              <Text style={[styles.actionButtonText, styles.inspectionModalButtonText]}>Ready For Inspection</Text>
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
        {/* User Greeting */}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingContent}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.greetingText}>Hi, Emma</Text>
          </View>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Search By Name, City Or State</Text>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddProperty')}
            >
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.inspectionButton}
              onPress={() => navigation.navigate('RequestInspection')}
            >
              <Text style={styles.inspectionButtonText}>Get Inspection by certified</Text>
            </TouchableOpacity>
          </View>

          {/* Property Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Property Name</Text>
            <View style={styles.inputWithClear}>
              <TextInput
                style={styles.input}
                placeholder="Property Name"
                placeholderTextColor="#9CA3AF"
                value={propertyName}
                onChangeText={setPropertyName}
              />
              {propertyName !== '' && (
                <TouchableOpacity 
                  onPress={clearPropertyName}
                  style={styles.clearButton}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* State Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue: string) => setState(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select State" value="" color="#1F2937" />
                <Picker.Item label="Alaska" value="alaska" color="#1F2937" />
                <Picker.Item label="California" value="california" color="#1F2937" />
                <Picker.Item label="Texas" value="texas" color="#1F2937" />
              </Picker>
              <Ionicons 
                name="chevron-down" 
                size={20} 
                color="#6B7280" 
                style={styles.pickerIcon}
              />
            </View>
          </View>

          {/* City Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={city}
                onValueChange={(itemValue: string) => setCity(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select City" value="" color="#1F2937" />
                <Picker.Item label="Anchorage" value="anchorage" color="#1F2937" />
                <Picker.Item label="Fairbanks" value="fairbanks" color="#1F2937" />
                <Picker.Item label="Juneau" value="juneau" color="#1F2937" />
              </Picker>
              <Ionicons 
                name="chevron-down" 
                size={20} 
                color="#6B7280" 
                style={styles.pickerIcon}
              />
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => {
              console.log('Searching properties:', { propertyName, state, city });
              // Filter logic would go here
            }}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Property List */}
        <View style={styles.propertyList}>
          {properties.map((property) => (
            <View key={property.id} style={styles.propertyCard}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.propertyDetail}>
                Property ID: <Text style={styles.propertyId}>{property.propertyId}</Text>
              </Text>
              <Text style={styles.propertyDetail}>
                No. of Buildings: {property.buildings}
              </Text>
              <Text style={styles.propertyDetail}>
                Units: {property.units}
              </Text>
              <Text style={styles.propertyDetail}>
                Address: <Text style={styles.addressLink}>{property.address}</Text>
              </Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditPress(property)}
              >
                <Text style={styles.editButtonText}>Edit/Update</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
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
    backgroundColor: '#0E7490',
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
  greetingContainer: {
    backgroundColor: '#0E7490',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greetingContent: {
    backgroundColor: '#0E7490',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CEF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchSection: {
    backgroundColor: '#CEF8FF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#FF4D67',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inspectionButton: {
    backgroundColor: '#84CC16',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  inspectionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  inputWithClear: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 36,
    fontSize: 14,
    color: '#374151',
    borderWidth: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 0,
    position: 'relative',
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#1F2937',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  searchButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 10,
    width: 100,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  propertyList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
  },
  propertyDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  propertyId: {
    color: '#0E7490',
    fontWeight: '600',
  },
  addressLink: {
    color: '#0E7490',
    textDecorationLine: 'underline',
  },
  editButton: {
    backgroundColor: '#84CC16',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
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
  inspectionModalButton: {
    backgroundColor: '#006B8F',
    borderColor: '#006B8F',
    borderWidth: 0,
  },
  inspectionModalButtonText: {
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
