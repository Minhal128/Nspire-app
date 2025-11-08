import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { DashboardScreenNavigationProp } from '../types/navigation';

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

interface Property {
  id: string;
  name: string;
  propertyId: string;
  buildings: number;
  units: number;
  address: string;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
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
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inspectionButton}>
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
                <Picker.Item label="Select State" value="" />
                <Picker.Item label="Alaska" value="alaska" />
                <Picker.Item label="California" value="california" />
                <Picker.Item label="Texas" value="texas" />
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
                <Picker.Item label="Select City" value="" />
                <Picker.Item label="Anchorage" value="anchorage" />
                <Picker.Item label="Fairbanks" value="fairbanks" />
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
          <TouchableOpacity style={styles.searchButton}>
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
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit/Update</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DD3FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#7DD3FC',
  },
  headerLogo: {
    width: 150,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  greetingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greetingContent: {
    backgroundColor: '#0E7490',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7DD3FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchSection: {
    backgroundColor: '#7DD3FC',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#FF4D67',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inspectionButton: {
    backgroundColor: '#84CC16',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  inspectionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWithClear: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingRight: 40,
    fontSize: 15,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    top: 12,
    pointerEvents: 'none',
  },
  searchButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
});
