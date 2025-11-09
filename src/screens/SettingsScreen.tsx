import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Sidebar from '../components/Sidebar';

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@inspireapp.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [role, setRole] = useState('Inspector');
  const [language, setLanguage] = useState('English US');
  const [timezone, setTimezone] = useState('GMT +05:00');
  
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

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarNavigate = (screen: string) => {
    setSidebarVisible(false);
    if (screen === 'Dashboard') {
      navigation.navigate('Dashboard' as never);
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

  const handleLogout = () => {
    setSidebarVisible(false);
    navigation.navigate('Boarding' as never);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes...');
  };

  const handleLogoutSession = () => {
    console.log('Logging out session...');
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
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
                style={styles.profilePhoto}
              />
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TouchableOpacity>
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
                <TouchableOpacity>
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
                <TouchableOpacity>
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
                <TouchableOpacity>
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    overflow: 'hidden',
    position: 'relative',
    marginTop: 8,
  },
  picker: {
    height: 50,
    color: '#6B7280',
    backgroundColor: 'transparent',
  },
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
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
});
