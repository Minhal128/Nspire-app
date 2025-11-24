import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BoardingScreenNavigationProp } from '../types/navigation';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants';

interface BoardingScreenProps {
  navigation: BoardingScreenNavigationProp;
}

export default function BoardingScreen({ navigation }: BoardingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('../../logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome Card */}
        <ScrollView style={styles.welcomeCard} showsVerticalScrollIndicator={true}>
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

          {/* Other Option */}
          <View style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="list-box" size={60} color="#FF4D67" />
            </View>
            <Text style={styles.optionTitle}>Other</Text>
            <Text style={styles.optionDescription}>
              For order management and{'\n'}tracking operations.
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('SignIn', { userType: 'Other' })}
            >
              <Text style={styles.buttonText}>Continue as Other</Text>
            </TouchableOpacity>
          </View>

          {/* Assets Manager Option */}
          <View style={[styles.optionCard, styles.lastOptionCard]}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="package-variant" size={60} color="#FF4D67" />
            </View>
            <Text style={styles.optionTitle}>Assets Manager</Text>
            <Text style={styles.optionDescription}>
              For managing and tracking{'\n'}assets and inventory.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.lastButton]}
              onPress={() => navigation.navigate('SignIn', { userType: 'AssetsManager' })}
            >
              <Text style={styles.buttonText}>Continue as Assets Manager</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingTop: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 300,
    height: 120,
    marginBottom: -20,
  },
  welcomeCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xxxl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 400,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.primary.teal,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  optionCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lastOptionCard: {
    marginBottom: 0,
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  optionTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary.teal,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: 30,
    width: '100%',
  },
  lastButton: {
    marginBottom: '5%',
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: FontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
