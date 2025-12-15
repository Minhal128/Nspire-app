import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignInScreenNavigationProp, SignInScreenRouteProp } from '../types/navigation';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants';
import authService from '../services/authService';

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
  route: SignInScreenRouteProp;
}

export default function SignInScreen({ navigation, route }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const userType = route.params?.userType;

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Map userType to role for API
      let role = 'inspector';
      if (userType === 'Management') {
        role = 'management';
      } else if (userType === 'AssetsManager') {
        role = 'asset-manager';
      } else if (userType === 'Other') {
        role = 'other';
      }

      const response = await authService.login({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
        role,
      });

      if (response.success) {
        // Verify user role matches the portal they're trying to access
        const userRole = response.user.role;
        const allowedRolesMap: { [key: string]: string[] } = {
          'Inspector': ['inspector', 'property-manager'],
          'Management': ['management', 'supervisor', 'admin'],
          'AssetsManager': ['asset-manager', 'admin'],
          'Other': ['other', 'order', 'admin'],
        };

        const allowedRoles = allowedRolesMap[userType || 'Inspector'] || ['inspector'];
        
        if (!allowedRoles.includes(userRole)) {
          // Logout and show error
          await authService.logout();
          Alert.alert(
            'Access Denied',
            `Your account role (${userRole}) does not have permission to access the ${userType} portal. Please select the correct portal for your account.`
          );
          return;
        }

        // Navigate based on user's actual role from backend
        const dashboardRoute = authService.getDashboardRoute(response.user.role);
        
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: dashboardRoute as any }],
          });
        }, 100);
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username Or Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me */}
          <TouchableOpacity 
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}
          >
            <Ionicons 
              name={rememberMe ? "checkbox" : "square-outline"} 
              size={24} 
              color="#0E7490" 
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Log in</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <Text style={styles.orText}>Or sign up with</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={32} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={32} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    width: 350,
    height: 140,
    marginBottom: 20,
  },
  welcomeCard: {
    backgroundColor: '#F0F9E8',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0E7490',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordContainer: {
    backgroundColor: '#D1F2EB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#0E7490',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#0E7490',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpButton: {
    backgroundColor: '#FF4D67',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
});
