import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authService from '../services/authService';

interface AppHeaderProps {
  onMenuPress: () => void;
  onNotificationsPress: () => void;
}

const initialsOf = (name?: string) =>
  (name || 'U')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/** Teal bar shared by every portal screen (web parity). */
export default function AppHeader({ onMenuPress, onNotificationsPress }: AppHeaderProps) {
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    let active = true;
    authService
      .getStoredUser()
      .then((user) => {
        if (active) setInitials(initialsOf(user?.fullName || user?.email));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} hitSlop={hitSlop}>
        <Ionicons name="menu" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Image
        source={require('../../public/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.right}>
        <TouchableOpacity onPress={onNotificationsPress} hitSlop={hitSlop}>
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
          <View style={styles.dot} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E7490',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // Expo's status bar is translucent, so Android has to pad past it itself.
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 10,
    paddingBottom: 14,
  },
  logo: {
    height: 46,
    // logo.png is 4591x2613 — any other ratio makes `contain` shrink the image
    // and centre it, leaving dead space that shoves it off the hamburger.
    aspectRatio: 4591 / 2613,
    // Sits beside the hamburger; the auto margin eats the free space so the
    // bell + avatar still pin to the right.
    marginLeft: 14,
    marginRight: 'auto',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E93B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
