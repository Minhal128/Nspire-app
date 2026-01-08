import React, { useState } from "react";
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
  ActionSheetIOS,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SignUpScreenNavigationProp } from "../types/navigation";
import authService from "../services/authService";

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [loading, setLoading] = useState(false);

  // iOS Picker State - Use ActionSheetIOS instead
  const showIOSLoginTypePicker = () => {
    const options = [
      'Cancel',
      'Inspector',
      'Property Manager',
      'Management',
      'Supervisor',
      'Other'
    ];
    const values = [
      '',
      'inspector',
      'property-manager',
      'management',
      'supervisor',
      'other'
    ];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        title: 'Select Login Type',
      },
      (buttonIndex) => {
        if (buttonIndex !== 0) { // Not cancel
          setLoginType(values[buttonIndex]);
        }
      }
    );
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
      const response = await authService.signup({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: loginType,
      });

      if (response.success) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              const dashboardRoute = authService.getDashboardRoute(
                response.user.role,
              );
              navigation.reset({
                index: 0,
                routes: [{ name: dashboardRoute as any }],
              });
            },
          },
        ]);
      } else {
        Alert.alert(
          "Registration Failed",
          response.message || "Failed to create account",
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
                  {Platform.OS === 'ios' ? (
                    <TouchableOpacity
                      style={styles.iosPickerButton}
                      onPress={showIOSLoginTypePicker}
                    >
                      <Text style={[styles.iosPickerText, !loginType && { color: '#9CA3AF' }]}>
                        {loginType ? loginType.charAt(0).toUpperCase() + loginType.slice(1).replace('-', ' ') : "Select..."}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={loginType}
                      onValueChange={(itemValue: string) => setLoginType(itemValue)}
                      style={styles.picker}
                      enabled={!loading}
                    >
                      <Picker.Item label="Select..." value="" />
                      <Picker.Item label="Inspector" value="inspector" />
                      <Picker.Item
                        label="Property Manager"
                        value="property-manager"
                      />
                      <Picker.Item label="Management" value="management" />
                      <Picker.Item label="Supervisor" value="supervisor" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  )}
                </View>
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
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DD3FC",
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
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
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
    width: "100%",
    maxWidth: 400,
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
    fontWeight: "600",
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
});
