import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SignUpScreenNavigationProp } from '../types/navigation';

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginType, setLoginType] = useState('');

  const handleCreateAccount = () => {
    navigation.navigate('Dashboard' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Image 
            source={require('../../logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Registration Card */}
          <View style={styles.registrationCard}>
            <Text style={styles.title}>Registration</Text>
            <Text style={styles.subtitle}>
              Enter your Email ID and{'\n'}Password to register
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email ID"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your Full Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create your Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Login Type Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Login Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={loginType}
                  onValueChange={(itemValue: string) => setLoginType(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select..." value="" />
                  <Picker.Item label="Inspector" value="inspector" />
                  <Picker.Item label="Management" value="management" />
                </Picker>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateAccount}
            >
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn', {})}>
                <Text style={styles.signInText}>
                  <Text style={styles.signInLink}>Sign In?</Text>
                  {' '}if already registered
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DD3FC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 30,
  },
  registrationCard: {
    backgroundColor: '#F0F9E8',
    borderRadius: 30,
    padding: 30,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0E7490',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#D1F2EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
  },
  pickerContainer: {
    backgroundColor: '#D1F2EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#374151',
  },
  createButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#374151',
  },
  signInLink: {
    color: '#0E7490',
    fontWeight: '600',
  },
});
