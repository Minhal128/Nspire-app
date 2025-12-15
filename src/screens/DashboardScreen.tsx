import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DashboardScreenNavigationProp } from "../types/navigation";
import Sidebar from "../components/Sidebar";
import { propertyService, authService } from "../services";
import { Property as ApiProperty, User } from "../services/api";
import { US_STATES } from "../constants/usStates";

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
  onMenuPress?: () => void;
}

interface Property {
  id: string;
  _id?: string;
  name: string;
  propertyId: string;
  buildings: number;
  units: number;
  address: string;
}

export default function DashboardScreen({
  navigation,
  onMenuPress,
}: DashboardScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inspectionStep, setInspectionStep] = useState(0);
  const [selectedUnitOption, setSelectedUnitOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  const [propertyName, setPropertyName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  // Load user and properties on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const userData = await authService.getStoredUser();
      
      // Role-based access control
      const allowedRoles = ['inspector', 'property-manager', 'admin'];
      if (!userData || !allowedRoles.includes(userData.role)) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access the Inspector portal.',
          [{ text: 'OK', onPress: () => {
            authService.logout();
            navigation.reset({ index: 0, routes: [{ name: 'Boarding' as never }] });
          }}]
        );
        return;
      }
      
      setUser(userData);
      await fetchProperties();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async (filters?: { search?: string; state?: string; city?: string }) => {
    try {
      const response = await propertyService.getProperties({
        search: filters?.search,
        state: filters?.state,
        city: filters?.city,
        limit: 50,
      });
      
      if (response.success && response.properties) {
        const mappedProperties: Property[] = response.properties.map((p: ApiProperty) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          propertyId: p.propertyId,
          buildings: p.buildings || 0,
          units: p.units || 0,
          address: `${p.address}, ${p.city}, ${p.state}, ${p.zipCode}`,
        }));
        setProperties(mappedProperties);
        return mappedProperties;
      }
      return [];
    } catch (error: any) {
      console.error('Failed to fetch properties:', error);
      return [];
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    await fetchProperties({
      search: propertyName,
      state: state,
      city: city,
    });
    setLoading(false);
  };

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === "Dashboard") {
      // Already on dashboard
    } else if (screen === "MyInspections") {
      navigation.navigate("MyInspections" as never);
    } else if (screen === "Reports") {
      navigation.navigate("Reports" as never);
    } else if (screen === "Analytics") {
      navigation.navigate("Analytics" as never);
    } else if (screen === "Settings") {
      navigation.navigate("Settings" as never);
    }
  };

  const handleLogout = async () => {
    setSidebarVisible(false);
    try {
      await authService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' as any }],
      });
    } catch (error) {
      navigation.navigate("Boarding");
    }
  };

  const handleEditPress = (property: Property) => {
    setSelectedProperty(property);
    setActionModalVisible(true);
  };

  const handleEditProperty = () => {
    setActionModalVisible(false);
    navigation.navigate("EditProperty", { property: selectedProperty });
  };

  const handleReadyForInspection = async () => {
    if (selectedProperty?._id) {
      try {
        await propertyService.setReadyForInspection(selectedProperty._id);
        setInspectionStep(1);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to set property ready');
      }
    } else {
      setInspectionStep(1);
    }
  };

  const handleStartInspection = () => {
    setActionModalVisible(false);
    setInspectionStep(0);
    setSelectedUnitOption("");
    console.log(
      "Starting inspection with option:",
      selectedUnitOption,
      "for property:",
      selectedProperty,
    );
    // Navigate to inspection or perform inspection logic here
    navigation.navigate("MyInspections" as never);
  };

  const handleCloseActionModal = () => {
    setActionModalVisible(false);
    setInspectionStep(0);
    setSelectedUnitOption("");
  };

  const handleRemoveProperty = async () => {
    if (!selectedProperty?._id) {
      setActionModalVisible(false);
      return;
    }
    
    Alert.alert(
      'Remove Property',
      `Are you sure you want to remove "${selectedProperty.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await propertyService.deleteProperty(selectedProperty._id!);
              if (response.success) {
                Alert.alert('Success', 'Property removed successfully');
                await fetchProperties();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to remove property');
            }
            setActionModalVisible(false);
          },
        },
      ]
    );
  };

  const clearPropertyName = () => {
    setPropertyName("");
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
              userType="Inspector"
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
        onRequestClose={handleCloseActionModal}
      >
        <View style={styles.actionModalOverlay}>
          <Pressable
            style={styles.actionModalBackdrop}
            onPress={handleCloseActionModal}
          />
          <Pressable style={styles.actionModalContent} onPress={() => {}}>
            <Text style={styles.actionModalTitle}>Action</Text>

            {inspectionStep === 0 ? (
              <>
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
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.inspectionModalButtonText,
                    ]}
                  >
                    Ready For Inspection
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={handleRemoveProperty}
                >
                  <Text
                    style={[styles.actionButtonText, styles.removeButtonText]}
                  >
                    Remove Property
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.unitSelectionLabel}>
                  Select Units For Inspection
                </Text>

                <View style={styles.unitPickerContainer}>
                  <Picker
                    selectedValue={selectedUnitOption}
                    onValueChange={(itemValue: string) =>
                      setSelectedUnitOption(itemValue)
                    }
                    style={styles.unitPicker}
                  >
                    <Picker.Item
                      label="Select an option"
                      value=""
                      color="#9CA3AF"
                    />
                    <Picker.Item
                      label="Random Select Unit (Max 32 units)"
                      value="random_32"
                      color="#1F2937"
                    />
                    <Picker.Item
                      label="Select unit 50%"
                      value="select_50"
                      color="#1F2937"
                    />
                    <Picker.Item
                      label="Select unit 100%"
                      value="select_100"
                      color="#1F2937"
                    />
                  </Picker>
                </View>

                {selectedUnitOption !== "" && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.startInspectionButton]}
                    onPress={handleStartInspection}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.startInspectionButtonText,
                      ]}
                    >
                      Start Inspection
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.actionButton, styles.backButton]}
                  onPress={() => {
                    setInspectionStep(0);
                    setSelectedUnitOption("");
                  }}
                >
                  <Text style={styles.actionButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* Header with White Bar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={onMenuPress || handleMenuPress}>
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Image
              source={require("../../logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={28}
                color="#1F2937"
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0E7490']}
              tintColor="#0E7490"
            />
          }
        >
          {/* User Greeting */}
          <View style={styles.greetingContainer}>
            <View style={styles.greetingContent}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.greetingText}>Hi, {user?.fullName?.split(' ')[0] || 'User'}</Text>
            </View>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>
              Search By Name, City Or State
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddProperty")}
            >
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>

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
                {propertyName !== "" && (
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
                  {US_STATES.map((stateItem) => (
                    <Picker.Item 
                      key={stateItem.value} 
                      label={stateItem.label} 
                      value={stateItem.value} 
                      color="#1F2937" 
                    />
                  ))}
                </Picker>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            {/* City Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputWithClear}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter City"
                  placeholderTextColor="#9CA3AF"
                  value={city}
                  onChangeText={setCity}
                />
                {city !== "" && (
                  <TouchableOpacity
                    onPress={() => setCity("")}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0E7490" />
            </View>
          )}

          {/* Property List */}
          {!loading && (
            <View style={styles.propertyList}>
              {properties.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="home-outline" size={64} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No properties found</Text>
                  <Text style={styles.emptySubtext}>Add a property to get started</Text>
                </View>
              ) : (
                properties.map((property) => (
                  <View key={property.id} style={styles.propertyCard}>
                    <Text style={styles.propertyName}>{property.name}</Text>
                    <Text style={styles.propertyDetail}>
                      Property ID:{" "}
                      <Text style={styles.propertyId}>{property.propertyId}</Text>
                    </Text>
                    <Text style={styles.propertyDetail}>
                      No. of Buildings: {property.buildings}
                    </Text>
                    <Text style={styles.propertyDetail}>
                      Units: {property.units}
                    </Text>
                    <Text style={styles.propertyDetail}>
                      Address:{" "}
                      <Text style={styles.addressLink}>{property.address}</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditPress(property)}
                    >
                      <Text style={styles.editButtonText}>Edit/Update</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}

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
    backgroundColor: "#CEF8FF",
  },
  headerContainer: {
    backgroundColor: "#0E7490",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    backgroundColor: "#0E7490",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greetingContent: {
    backgroundColor: "#0E7490",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#CEF8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchSection: {
    backgroundColor: "#CEF8FF",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  searchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#FF4D67",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inspectionButton: {
    backgroundColor: "#84CC16",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
  },
  inspectionButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 6,
  },
  inputWithClear: {
    position: "relative",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 36,
    fontSize: 14,
    color: "#374151",
    borderWidth: 0,
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 0,
    position: "relative",
    minHeight: 55,
    justifyContent: "center",
  },
  picker: {
    height: 55,
    color: "#1F2937",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerIcon: {
    position: "absolute",
    right: 12,
    top: 18,
    pointerEvents: "none",
  },
  searchButton: {
    backgroundColor: "#0E7490",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 10,
    width: 100,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  propertyList: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  propertyDetail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 5,
  },
  propertyId: {
    color: "#0E7490",
    fontWeight: "600",
  },
  addressLink: {
    color: "#0E7490",
    textDecorationLine: "underline",
  },
  editButton: {
    backgroundColor: "#84CC16",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    flex: 1,
  },
  sidebarContainer: {
    width: 280,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  inspectionModalButton: {
    backgroundColor: "#006B8F",
    borderColor: "#006B8F",
    borderWidth: 0,
  },
  inspectionModalButtonText: {
    color: "#FFFFFF",
  },
  removeButton: {
    backgroundColor: "#FF0000",
    borderColor: "#FF0000",
    borderWidth: 0,
  },
  removeButtonText: {
    color: "#FFFFFF",
  },
  unitSelectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  unitPickerContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  unitPicker: {
    height: 50,
    color: "#1F2937",
  },
  startInspectionButton: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
    borderWidth: 0,
  },
  startInspectionButtonText: {
    color: "#FFFFFF",
  },
  backButton: {
    backgroundColor: "#6B7280",
    borderColor: "#6B7280",
    borderWidth: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
