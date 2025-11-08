import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BoardingScreenNavigationProp } from '../types/navigation';

interface BoardingScreenProps {
  navigation: BoardingScreenNavigationProp;
}

export default function BoardingScreen({ navigation }: BoardingScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('../../logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSubtitle}>Choose how you want to continue.</Text>

          {/* Inspector Option */}
          <View style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="clipboard-text" size={60} color="#FF4D67" />
            </View>
            <Text style={styles.optionTitle}>Inspector</Text>
            <Text style={styles.optionDescription}>
              For field inspectors conducting{'\n'}property compliance checks.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('SignIn', { userType: 'Inspector' })}
            >
              <Text style={styles.buttonText}>Continue as Inspector</Text>
            </TouchableOpacity>
          </View>

          {/* Management Option */}
          <View style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="office-building" size={60} color="#FF4D67" />
            </View>
            <Text style={styles.optionTitle}>Management</Text>
            <Text style={styles.optionDescription}>
              For property managers and supervisors{'\n'}reviewing reports and analytics.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('SignIn', { userType: 'Management' })}
            >
              <Text style={styles.buttonText}>Continue as Management</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DD3FC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 250,
    height: 80,
    marginBottom: 30,
  },
  welcomeCard: {
    backgroundColor: '#F0F9E8',
    borderRadius: 30,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0E7490',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
