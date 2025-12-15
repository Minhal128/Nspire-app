import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Sidebar from '../components/Sidebar';
import { authService, userService } from '../services';
import { User } from '../services/api';

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('English US');
  const [timezone, setTimezone] = useState('GMT +05:00');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Notification preferences
  const [inspectionReminderEmail, setInspectionReminderEmail] = useState(true);
  const [inspectionReminderInApp, setInspectionReminderInApp] = useState(false);
  const [reportAlertsEmail, setReportAlertsEmail] = useState(false);
  const [reportAlertsInApp, setReportAlertsInApp] = useState(true);
  const [followUpEmail, setFollowUpEmail] = useState(false);
  const [followUpInApp, setFollowUpInApp] = useState(true);
  const [systemUpdatesEmail, setSystemUpdatesEmail] = useState(true);
  const [systemUpdatesInApp, setSystemUpdatesInApp] = useState(false);
  
  // Security
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const loadUserData = useCallback(async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setName(storedUser.fullName || '');
        setEmail(storedUser.email || '');
        setPhone(storedUser.phone || '');
        setRole(storedUser.role || '');
        setProfileImage(storedUser.profileImage || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const pickImage = async () => {
    // Request permission
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload a photo.');
        return;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      // TODO: Upload to backend when API supports it
      Alert.alert('Photo Updated', 'Your profile photo has been updated locally. Server sync coming soon.');
    }
  };

  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take a photo.');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      // TODO: Upload to backend when API supports it
      Alert.alert('Photo Updated', 'Your profile photo has been updated locally. Server sync coming soon.');
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Remove Photo', onPress: () => setProfileImage(null), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = async (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      // Navigate to correct dashboard based on user role
      const userRole = user?.role || 'inspector';
      const dashboardRoute = authService.getDashboardRoute(userRole);
      navigation.navigate(dashboardRoute as never);
    } else if (screen === 'MyInspections') {
      navigation.navigate('MyInspections' as never);
    } else if (screen === 'Reports') {
      navigation.navigate('Reports' as never);
    } else if (screen === 'Analytics') {
      navigation.navigate('Analytics' as never);
    } else if (screen === 'Settings') {
      // Already on Settings
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setSidebarVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Boarding' as never }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      let updateData: any = {};
      
      switch(editField) {
        case 'name':
          updateData.fullName = editValue;
          setName(editValue);
          break;
        case 'email':
          updateData.email = editValue;
          setEmail(editValue);
          break;
        case 'phone':
          updateData.phone = editValue;
          setPhone(editValue);
          break;
      }
      
      await userService.updateProfile(updateData);
      setEditModalVisible(false);
      setSuccessMessage(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully!`);
      setSuccessModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Update notification settings
      await userService.updateNotificationSettings({
        inspectionReminder: { email: inspectionReminderEmail, inApp: inspectionReminderInApp },
        reportAlerts: { email: reportAlertsEmail, inApp: reportAlertsInApp },
        followUp: { email: followUpEmail, inApp: followUpInApp },
        systemUpdates: { email: systemUpdatesEmail, inApp: systemUpdatesInApp },
      });
      
      setSuccessMessage('Settings saved successfully!');
      setSuccessModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    try {
      setSaving(true);
      await userService.changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password changed successfully!');
      setSuccessModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutSession = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Boarding' as never }],
              });
            } catch (error) {
              console.error('Error logging out session:', error);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2937" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={handleMenuPress}>
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
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Manage your account, organization, and app preferences.</Text>
          </View>

          {/* Profile Settings Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile Settings</Text>
            <Text style={styles.cardDescription}>Manage personal details of the logged-in user.</Text>
            
            {/* Profile Photo */}
            <View style={styles.photoContainer}>
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }}
                  style={styles.profilePhoto}
                />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  <Ionicons name="person" size={50} color="#9CA3AF" />
                </View>
              )}
              <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TouchableOpacity onPress={() => handleEditField('name', name)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldInput}>
                <Text style={styles.fieldValue}>{name}</Text>
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TouchableOpacity onPress={() => handleEditField('email', email)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldInput}>
                <Text style={styles.fieldValue}>{email}</Text>
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Phone</Text>
                <TouchableOpacity onPress={() => handleEditField('phone', phone)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldInput}>
                <Text style={styles.fieldValue}>{phone}</Text>
              </View>
            </View>

            {/* Role Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Role</Text>
                <TouchableOpacity onPress={() => handleEditField('role', role)}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldInput}>
                <Text style={styles.fieldValue}>{role}</Text>
              </View>
            </View>

            {/* Language Dropdown */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Language</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={language}
                  onValueChange={(itemValue) => setLanguage(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="English US" value="English US" />
                  <Picker.Item label="Spanish" value="Spanish" />
                  <Picker.Item label="French" value="French" />
                </Picker>
                <Ionicons 
                  name="chevron-down" 
                  size={18} 
                  color="#6B7280" 
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            {/* Timezone Dropdown */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Timezone</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={timezone}
                  onValueChange={(itemValue) => setTimezone(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="GMT +05:00" value="GMT +05:00" />
                  <Picker.Item label="GMT +00:00" value="GMT +00:00" />
                  <Picker.Item label="GMT -05:00" value="GMT -05:00" />
                </Picker>
                <Ionicons 
                  name="chevron-down" 
                  size={18} 
                  color="#6B7280" 
                  style={styles.pickerIcon}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.buttonDisabled]} 
              onPress={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Notification Preferences Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notification Preferences</Text>
            <Text style={styles.cardDescription}>Manage in-app and email notifications.</Text>

            {/* Inspection Reminders */}
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Inspection Reminders</Text>
              <View style={styles.checkboxRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setInspectionReminderEmail(!inspectionReminderEmail)}
                >
                  <View style={[styles.checkbox, inspectionReminderEmail && styles.checkboxChecked]}>
                    {inspectionReminderEmail && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setInspectionReminderInApp(!inspectionReminderInApp)}
                >
                  <View style={[styles.checkbox, inspectionReminderInApp && styles.checkboxChecked]}>
                    {inspectionReminderInApp && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>In-App</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Report Completion Alerts */}
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Report Completion Alerts</Text>
              <View style={styles.checkboxRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setReportAlertsEmail(!reportAlertsEmail)}
                >
                  <View style={[styles.checkbox, reportAlertsEmail && styles.checkboxChecked]}>
                    {reportAlertsEmail && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setReportAlertsInApp(!reportAlertsInApp)}
                >
                  <View style={[styles.checkbox, reportAlertsInApp && styles.checkboxChecked]}>
                    {reportAlertsInApp && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>In-App</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Follow-Up Tasks */}
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Follow-Up Tasks</Text>
              <View style={styles.checkboxRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setFollowUpEmail(!followUpEmail)}
                >
                  <View style={[styles.checkbox, followUpEmail && styles.checkboxChecked]}>
                    {followUpEmail && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setFollowUpInApp(!followUpInApp)}
                >
                  <View style={[styles.checkbox, followUpInApp && styles.checkboxChecked]}>
                    {followUpInApp && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>In-App</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* System Updates */}
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>System Updates</Text>
              <View style={styles.checkboxRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setSystemUpdatesEmail(!systemUpdatesEmail)}
                >
                  <View style={[styles.checkbox, systemUpdatesEmail && styles.checkboxChecked]}>
                    {systemUpdatesEmail && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Email</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setSystemUpdatesInApp(!systemUpdatesInApp)}
                >
                  <View style={[styles.checkbox, systemUpdatesInApp && styles.checkboxChecked]}>
                    {systemUpdatesInApp && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>In-App</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.buttonDisabled]} 
              onPress={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Security Settings Card */}
          <View style={styles.card}>
            <View style={styles.securityHeader}>
              <Text style={styles.cardTitle}>Security Settings</Text>
              <Ionicons name="lock-closed" size={20} color="#1F2937" style={styles.lockIcon} />
            </View>
            <Text style={styles.cardDescription}>Manage passwords, sessions, and 2FA.</Text>

            {/* Change Password Section */}
            <Text style={styles.sectionTitle}>Change Password</Text>
            
            <View style={styles.passwordFieldContainer}>
              <Text style={styles.passwordLabel}>Old Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your old password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
            </View>

            <View style={styles.passwordFieldContainer}>
              <Text style={styles.passwordLabel}>New Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your old password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.passwordFieldContainer}>
              <Text style={styles.passwordLabel}>Confirm Password</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity 
              style={[styles.changePasswordButton, saving && styles.buttonDisabled]} 
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.changePasswordButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>

            {/* 2FA Toggle */}
            <Text style={styles.sectionTitle}>2FA Toggle</Text>
            <TouchableOpacity style={styles.twoFactorButton}>
              <Ionicons name="lock-closed" size={20} color="#1F2937" />
              <Text style={styles.twoFactorText}>Enable Two-Factor Authentication</Text>
            </TouchableOpacity>

            {/* Session Management */}
            <Text style={styles.sectionTitle}>Session Management</Text>
            <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Ionicons name="desktop-outline" size={24} color="#1F2937" />
                <Text style={styles.sessionTitle}>Web Browser</Text>
              </View>
              <View style={styles.sessionDetails}>
                <View style={styles.sessionRow}>
                  <Text style={styles.sessionDevice}>Chrome On Windows</Text>
                  <Text style={styles.sessionIP}>192.168.0.15</Text>
                </View>
                <View style={styles.sessionRow}>
                  <Text style={styles.sessionLocation}>NewYork NY</Text>
                  <Text style={styles.sessionTime}>2 hours ago</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleLogoutSession}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Edit Field Modal */}
      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}</Text>
            <TextInput
              style={styles.editModalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editField}`}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.editModalButtons}>
              <TouchableOpacity 
                style={styles.editModalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.editModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editModalSaveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.editModalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.successModalTitle}>Success!</Text>
            <Text style={styles.successModalMessage}>{successMessage}</Text>
            <TouchableOpacity 
              style={styles.successModalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.successModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 18,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    borderWidth: 2,
    borderColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  changePhotoText: {
    color: '#0E7490',
    fontSize: 14,
    fontWeight: '600',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  editLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E7490',
  },
  fieldInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 14,
  },
  fieldValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  pickerContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    position: 'relative',
    marginTop: 8,
    minHeight: 55,
    justifyContent: 'center',
  },
  picker: {
    height: 55,
    color: '#6B7280',
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 18,
    pointerEvents: 'none',
  },
  saveButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  changePasswordButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  changePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  notificationSection: {
    marginBottom: 20,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  lockIcon: {
    marginTop: -2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 12,
  },
  passwordFieldContainer: {
    marginBottom: 16,
  },
  passwordLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: '#374151',
  },
  twoFactorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 20,
  },
  twoFactorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  sessionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  sessionDetails: {
    gap: 6,
    marginBottom: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionDevice: {
    fontSize: 14,
    color: '#374151',
  },
  sessionIP: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
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
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
  },
  editModalInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 24,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editModalCancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editModalCancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  editModalSaveButton: {
    flex: 1,
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editModalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  successModalMessage: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successModalButton: {
    backgroundColor: '#0E7490',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 48,
  },
  successModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
