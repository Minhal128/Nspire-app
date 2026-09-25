import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import networkService from '../services/networkService';

/**
 * App-wide "you are offline" bar. Mounted once in App.tsx so every screen gets
 * the same notice instead of each one inventing its own.
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!networkService.isOnline());

  useEffect(() => networkService.addListener(connected => setIsOffline(!connected)), []);

  if (!isOffline) return null;

  return (
    <View style={styles.bar} pointerEvents="none">
      <Text style={styles.text}>Offline — work is saved on this device and syncs when you reconnect</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#B45309',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
});
