import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SidebarProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  userType?: string;
}

export default function Sidebar({ onClose, onNavigate, onLogout, userType }: SidebarProps) {
  const getMenuItems = () => {
    if (userType === 'AssetsManager') {
      return [
        { id: 'Dashboard', label: 'Dashboard', icon: 'speedometer-outline' as const },
      ];
    }

    if (userType === 'Other') {
      return [
        { id: 'Dashboard', label: 'Dashboard', icon: 'speedometer-outline' as const },
        { id: 'Others', label: 'Others', icon: 'people-outline' as const },
      ];
    }
    
    // Default menu for Inspector and Management
    return [
      { id: 'Dashboard', label: 'Dashboard', icon: 'speedometer-outline' as const },
      { id: 'MyInspections', label: 'My Inspections', icon: 'business-outline' as const },
      { id: 'Reports', label: 'Reports', icon: 'reader-outline' as const },
      { id: 'InspectionStatus', label: 'Inspection Status', icon: 'list-outline' as const },
      { id: 'Analytics', label: 'Analytics/Insights', icon: 'stats-chart-outline' as const },
      { id: 'Settings', label: 'Settings', icon: 'settings-outline' as const },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <Ionicons name={item.icon} size={24} color="#1F2937" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="power" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  menuSection: {
    paddingTop: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 14,
  },
});
