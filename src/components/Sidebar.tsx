import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigationState } from '@react-navigation/native';
import authService from '../services/authService';
import { menuItemsFor, userTypeForRole } from '../utils/sidebarMenu';

interface SidebarProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  userType?: string;
}

export default function Sidebar({ onClose, onNavigate, onLogout, userType }: SidebarProps) {
  // Most screens render the sidebar without knowing the role, which used to show
  // every user the Inspector menu. Fall back to the stored user's role instead.
  const [resolvedType, setResolvedType] = useState<string | undefined>(userType);

  // The sidebar lives in a Modal but still inside the navigator's React tree, so
  // the active route is readable here — no prop to thread through every screen.
  const activeRoute = useNavigationState((s) => s.routes[s.index]?.name);

  useEffect(() => {
    if (userType) {
      setResolvedType(userType);
      return;
    }
    let active = true;
    authService
      .getStoredUser()
      .then((user) => {
        if (active) setResolvedType(userTypeForRole(user?.role));
      })
      .catch(() => {
        if (active) setResolvedType('Inspector');
      });
    return () => {
      active = false;
    };
  }, [userType]);

  // Empty until the role is known, so nobody taps an Inspector item that a
  // one-frame flash put under their finger.
  const menuItems = resolvedType ? menuItemsFor(resolvedType) : [];
  // Settings sits below a divider with Logout (web parity).
  const mainItems = menuItems.filter((i) => i.id !== 'Settings');
  const settingsItem = menuItems.find((i) => i.id === 'Settings');

  const renderItem = (id: string, label: string, icon: any, onPress: () => void) => {
    // Each portal's dashboard route is named differently (Dashboard,
    // ManagementDashboard, OrderDashboard) but the menu id is always Dashboard.
    const active = id === activeRoute || (id === 'Dashboard' && !!activeRoute?.endsWith('Dashboard'));
    return (
      <TouchableOpacity
        key={id}
        style={[styles.menuItem, active && styles.menuItemActive]}
        onPress={onPress}
      >
        <Ionicons name={icon} size={22} color={active ? '#0E7490' : '#FFFFFF'} />
        <Text style={[styles.menuText, active && styles.menuTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1387AC', '#0B5C7B']} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../public/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        {mainItems.map((item) =>
          renderItem(item.id, item.label, item.icon, () => {
            onNavigate(item.id);
            onClose();
          })
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.menuSection}>
        {settingsItem &&
          renderItem(settingsItem.id, settingsItem.label, settingsItem.icon, () => {
            onNavigate(settingsItem.id);
            onClose();
          })}
        {renderItem('Logout', 'Logout', 'log-out-outline', onLogout)}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    height: 44,
    width: 77, // 1200/683 logo ratio; any other box letterboxes it
  },
  menuSection: {
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  menuItemActive: {
    backgroundColor: '#FFFFFF',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 14,
  },
  menuTextActive: {
    color: '#0E7490',
  },
});
