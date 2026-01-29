import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from 'react-native-webview';
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignUpScreenNavigationProp, SignUpScreenRouteProp } from "../types/navigation";
import authService from "../services/authService";
import IOSPickerModal from "../components/IOSPickerModal";

const LOGIN_TYPE_OPTIONS = [
  { label: 'Inspector', value: 'inspector' },
  { label: 'Management', value: 'management' },
  { label: 'Other', value: 'other' },
];

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
}

export default function SignUpScreen({ navigation, route }: SignUpScreenProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [loading, setLoading] = useState(false);

  const userType = route.params?.userType;

  // Set login type based on portal
  useEffect(() => {
    const initializeRole = async () => {
      // Get role from route params or fallback to AsyncStorage
      let portal = userType;
      if (!portal) {
        portal = await AsyncStorage.getItem('selectedPortal') || 'Inspector';
      }

      // Map portal to role
      const roleMap: { [key: string]: string } = {
        'Inspector': 'inspector',
        'Management': 'management',
        'Other': 'other'
      };

      setLoginType(roleMap[portal as keyof typeof roleMap] || 'inspector');
    };

    initializeRole();
  }, [userType]);

  // Show/hide password states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time validation errors
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Captcha state
  const [captchaId, setCaptchaId] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Real-time validation functions
  const validateEmail = (value: string) => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailParts = value.split('@');
    const localPart = emailParts[0] || '';

    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!basicEmailRegex.test(value)) {
      setEmailError("Please enter a valid email format");
    } else {
      setEmailError("");
    }
  };

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Full name is required");
    } else if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
    } else {
      setNameError("");
    }
  };

  const validatePassword = (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (value.length > 15) {
      setPasswordError("Password must be maximum 15 characters");
    } else if (!passwordRegex.test(value)) {
      setPasswordError("Must contain uppercase, lowercase, and number");
    } else {
      setPasswordError("");
    }
    // Also validate confirm password when password changes
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateCaptcha = (value: string) => {
    if (!value.trim()) {
      setCaptchaError("Captcha code is required");
    } else if (value.length !== 5) {
      setCaptchaError("Captcha code must be 5 characters");
    } else {
      setCaptchaError("");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  const handleCaptchaChange = (value: string) => {
    setCaptchaCode(value);
    validateCaptcha(value);
  };

  // iOS Picker Modal state
  const [loginTypePickerVisible, setLoginTypePickerVisible] = useState(false);

  // Load captcha on mount
  React.useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      console.log('Loading captcha...');
      const response = await authService.getCaptcha();
      console.log('Captcha response:', { success: response.success, hasId: !!response.captchaId, imageLength: response.captchaImage?.length });

      if (response.success && response.captchaImage) {
        setCaptchaId(response.captchaId);

        // The backend already returns the full data URI
        const imageUri = response.captchaImage;
        console.log('Setting captcha image, starts with:', imageUri.substring(0, 50));

        setCaptchaImage(imageUri);
        setCaptchaCode("");
      } else {
        console.log("Captcha load failed - no success or no image");
        setCaptchaImage("");
      }
    } catch (error) {
      console.error("Failed to load captcha:", error);
      setCaptchaImage("");
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!loginType) {
      Alert.alert("Error", "Please select a login type");
      return;
    }

    // Validate captcha
    if (!captchaCode.trim()) {
      Alert.alert("Error", "Please enter the captcha code");
      return;
    }
    if (captchaCode.length !== 5) {
      Alert.alert("Error", "Captcha code must be 5 characters");
      return;
    }

    // Check password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must contain uppercase, lowercase, and number",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signupWithCaptcha({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: loginType,
        captchaId,
        captchaCode: captchaCode.toUpperCase(),
      });

      if (response.success) {
        if (response.requiresVerification) {
          // Navigate to email verification screen
          navigation.navigate("EmailVerification", {
            email: email.trim().toLowerCase(),
            role: loginType,
          });
        } else {
          // Fallback for direct login (if verification not required)
          Alert.alert("Success", "Account created successfully!", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("SignIn", {});
              },
            },
          ]);
        }
      } else {
        Alert.alert(
          "Registration Failed",
          response.message || "Failed to create account",
        );
        // Reload captcha on failure
        loadCaptcha();
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again.",
      );
      // Reload captcha on failure
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SignIn")}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Back to Sign In</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo */}
          <Image
            source={require("../../logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Registration Card */}
          <View style={styles.registrationCard}>
            <Text style={styles.title}>Registration</Text>
            <Text style={styles.subtitle}>
              Enter your Email ID and{"\n"}Password to register
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Enter your email ID"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Enter your Full Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={handleNameChange}
                onBlur={() => validateName(name)}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create your Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry={!showPassword}
                  maxLength={15}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  contextMenuHidden={true}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.passwordContainer, confirmPasswordError ? styles.inputError : null]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your Password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  secureTextEntry={!showConfirmPassword}
                  maxLength={15}
                  textContentType="newPassword"
                  autoComplete="password-new"
                  contextMenuHidden={true}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            {/* Hardcoded Role Display */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Role</Text>
              <View style={[styles.input, { backgroundColor: '#E5E7EB', opacity: 0.8, justifyContent: 'center' }]}>
                <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>
                  {loginType ? loginType.charAt(0).toUpperCase() + loginType.slice(1) : "Loading..."}
                </Text>
              </View>
            </View>

            {/* Captcha */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Security Check</Text>
              <View style={styles.captchaContainer}>
                {captchaLoading ? (
                  <View style={styles.captchaImagePlaceholder}>
                    <ActivityIndicator size="small" color="#0E7490" />
                  </View>
                ) : captchaImage ? (
                  <View style={styles.captchaImageContainer}>
                    <WebView
                      originWhitelist={['*']}
                      source={{
                        html: `
                          <html>
                            <head>
                              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                              <style>
                                body { 
                                  margin: 0; 
                                  padding: 0; 
                                  display: flex; 
                                  justify-content: center; 
                                  align-items: center; 
                                  background-color: transparent; 
                                  overflow: hidden;
                                }
                                img { 
                                  max-width: 100%; 
                                  height: 100%; 
                                  object-fit: contain;
                                }
                              </style>
                            </head>
                            <body>
                              <img src="${captchaImage}" />
                            </body>
                          </html>
                        `
                      }}
                      style={styles.captchaWebView}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      androidHardwareAccelerationDisabled={true}
                    />
                  </View>
                ) : (
                  <View style={styles.captchaImagePlaceholder}>
                    <Text style={styles.captchaErrorText}>Failed to load</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={loadCaptcha}
                  disabled={captchaLoading}
                >
                  <Ionicons name="refresh" size={24} color="#0E7490" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[styles.input, styles.captchaInput, captchaError ? styles.inputError : null]}
                placeholder="Enter code from image"
                placeholderTextColor="#9CA3AF"
                value={captchaCode}
                onChangeText={handleCaptchaChange}
                onBlur={() => validateCaptcha(captchaCode)}
                autoCapitalize="characters"
                maxLength={5}
              />
              {captchaError ? <Text style={styles.errorText}>{captchaError}</Text> : null}
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                loading && styles.createButtonDisabled,
              ]}
              onPress={handleCreateAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.createButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignIn", {})}
              >
                <Text style={styles.signInText}>
                  <Text style={styles.signInLink}>Sign In?</Text> if already
                  registered
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* iOS Login Type Picker Modal */}
      <IOSPickerModal
        visible={loginTypePickerVisible}
        title="Select Login Type"
        options={LOGIN_TYPE_OPTIONS}
        selectedValue={loginType}
        onSelect={setLoginType}
        onClose={() => setLoginTypePickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DD3FC",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  pickerModalContainer: {
    flex: 1,
    backgroundColor: '#7DD3FC',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerCancelButton: {
    padding: 8,
  },
  pickerCancelText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  pickerDoneButton: {
    padding: 8,
  },
  pickerDoneText: {
    fontSize: 16,
    color: '#0E7490',
    fontWeight: '600',
  },
  iosPickerFull: {
    height: 216,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  iosPickerItemStyle: {
    height: 44,
    fontSize: 18,
    color: '#000000',
  },
  iosPickerButton: {
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  iosPickerText: {
    fontSize: 16,
    color: '#374151',
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  content: {
    alignItems: "center",
    paddingTop: 10,
  },
  logo: {
    width: 350,
    height: 140,
    marginBottom: 20,
  },
  registrationCard: {
    backgroundColor: "#F0F9E8",
    borderRadius: 30,
    padding: 30,
    paddingBottom: 150,
    width: "100%",
    maxWidth: 400,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0E7490",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#D1F2EB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#374151",
  },
  passwordContainer: {
    backgroundColor: "#D1F2EB",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#374151",
  },
  eyeIcon: {
    padding: 4,
  },
  pickerContainer: {
    backgroundColor: "#D1F2EB",
    borderRadius: 12,
    minHeight: 55,
    justifyContent: "center",
  },
  picker: {
    height: 55,
    color: "#374151",
    paddingVertical: 8,
  },
  captchaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  captchaImageContainer: {
    width: 180,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0E7490",
    overflow: "hidden",
  },
  captchaWebView: {
    width: 176, // Subtract border width (2*2)
    height: 66,
    backgroundColor: "transparent",
  },
  captchaImagePlaceholder: {
    width: 180,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0E7490",
    justifyContent: "center",
    alignItems: "center",
  },
  captchaErrorText: {
    color: "#0E7490",
    fontSize: 12,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  refreshButton: {
    marginLeft: 15,
    padding: 10,
    backgroundColor: "#D1F2EB",
    borderRadius: 10,
  },
  captchaInput: {
    textAlign: "center",
    letterSpacing: 5,
    fontSize: 18,
    fontWeight: "700",
  },
  createButton: {
    backgroundColor: "#0E7490",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  createButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  signInContainer: {
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: "#374151",
  },
  signInLink: {
    color: "#0E7490",
    fontWeight: "600",
  },
});
