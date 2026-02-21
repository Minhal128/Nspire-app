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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  SignInScreenNavigationProp,
  SignInScreenRouteProp,
} from "../types/navigation";
import { Colors, Spacing, BorderRadius, FontSizes } from "../constants";
import authService from "../services/authService";
import { storeData, StorageKeys } from "../utils/storage";
import { useOAuth, useClerk } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';

// Required for OAuth to complete properly on mobile
WebBrowser.maybeCompleteAuthSession();

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
  route: SignInScreenRouteProp;
}

export default function SignInScreen({ navigation, route }: SignInScreenProps) {
  useWarmUpBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userType = route.params?.userType;

  // Persist selected portal to ensure it survives app reload during OAuth
  React.useEffect(() => {
    if (userType) {
      AsyncStorage.setItem('selectedPortal', userType).catch(err =>
        console.error('Failed to persist portal selection:', err)
      );
    }
  }, [userType]);

  // Validation functions
  const validateEmail = (value: string) => {
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!basicEmailRegex.test(value)) {
      setEmailError("Please enter a valid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (value.length > 15) {
      setPasswordError("Password must be maximum 15 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.trim()) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      validatePassword(value);
    } else {
      setPasswordError("");
    }
  };

  // Clerk OAuth hooks
  const { signOut, client } = useClerk();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: 'oauth_facebook' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // Map userType to role for API
      let role = "inspector";
      if (userType === "Management") {
        role = "management";
      } else if (userType === "Other") {
        role = "other";
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
          Inspector: ["inspector"],
          Management: ["management", "supervisor", "admin", "property-manager"],
          Other: ["other", "order", "admin"],
        };

        const allowedRoles = allowedRolesMap[userType || "Inspector"] || [
          "inspector",
        ];

        if (!allowedRoles.includes(userRole)) {
          // Logout and show error
          await authService.logout();
          Alert.alert(
            "Access Denied",
            `Your account role (${userRole}) does not have permission to access the ${userType} portal. Please select the correct portal for your account.`,
          );
          return;
        }

        // Navigate based on user's actual role from backend
        const dashboardRoute = authService.getDashboardRoute(
          response.user.role,
        );

        console.log('Navigating to dashboard:', dashboardRoute, 'for role:', response.user.role);

        // Use immediate navigation with reset to clear the stack
        navigation.reset({
          index: 0,
          routes: [{ name: dashboardRoute as any }],
        });
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Get selected portal from route params (most reliable) or fallback to storage/default
      const selectedPortal = userType || await AsyncStorage.getItem('selectedPortal') || 'Inspector';

      // Create redirect URI for Expo
      const redirectUrl = Linking.createURL('/oauth-callback');
      console.log('OAuth redirect URL:', redirectUrl);

      const result = await startGoogleFlow({ redirectUrl });

      if (result.createdSessionId) {
        // Set active session
        await result.setActive?.({ session: result.createdSessionId });

        // Get user info from Clerk session
        let email = '';
        let fullName = '';

        // Try to get from signUp or signIn objects
        if (result.signUp) {
          email = result.signUp.emailAddress ?? '';
          fullName = (result.signUp as any)?.firstName ?? '';
        }

        if (!email && result.signIn) {
          email = result.signIn.identifier ?? '';
          fullName = (result.signIn as any)?.firstName ?? '';
        }

        // Fallback: Try from createdSession user object
        if (!email && (result as any).createdSession?.user) {
          const user = (result as any).createdSession.user;
          email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '';
          fullName = user.firstName || user.fullName || '';
        }

        // continue to client fallback if email still not available

        // Use email prefix as the name if no full name
        const displayName = fullName || (email.includes('@') ? email.split('@')[0] : email);

        console.log('Google OAuth success - email:', email, 'name:', displayName, 'portal:', selectedPortal);

        // Final fallback - ERROR if no email found
        if (!email) {
          // Check if we can rescue via client
          if (client) {
            try {
              // Try to find the session
              let session;
              if (result.createdSessionId) {
                session = client.sessions.find(s => s.id === result.createdSessionId);
              }
              // If not found by ID, try the last active session if we just set it
              if (!session && client.sessions && client.sessions.length > 0) {
                session = client.sessions[client.sessions.length - 1];
              }

              if (session) {
                console.log('Found session in client fallback');

                // Try publicUserData first (often available immediately)
                if (session.publicUserData && session.publicUserData.identifier) {
                  email = session.publicUserData.identifier;
                  console.log('Retrieved email from publicUserData:', email);
                }

                // If still no email, try user object
                if (!email && session.user) {
                  const user = session.user;
                  email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '';
                  fullName = user.firstName || user.fullName || '';
                  console.log('Retrieved details from session.user');
                }
              }
            } catch (e) {
              console.log('Failed to retrieve from client fallback', e);
            }
          }

          if (!email) {
            console.log('Email not found in OAuth result. Keys:', Object.keys(result));
            Alert.alert('Sign In Failed', 'Could not retrieve email address from your Google account. Please try again or use a different method.');
            setLoading(false);
            return;
          }
        }

        // Proceed directly to backend verification
        handleSocialLoginBackend(email, displayName, selectedPortal, 'google');
      } else {
        console.log('Google OAuth - No session created. Result:', result);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      const errorMessage = err.message || 'Failed to sign in with Google';

      // Provide more helpful error messages
      if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
        // User cancelled - don't show error
        console.log('User cancelled Google sign in');
      } else {
        Alert.alert('Google Sign In Error', errorMessage);
      }
      setLoading(false);
    }
  };

  // Helper function to handle backend social login
  const handleSocialLoginBackend = async (email: string, fullName: string, portal: string, provider: string) => {
    try {
      const response = await authService.socialLogin({
        email,
        fullName,
        portal,
        provider
      });

      if (response.success) {
        const dashboardRoute = authService.getDashboardRoute(response.user.role);
        navigation.reset({
          index: 0,
          routes: [{ name: dashboardRoute as any }],
        });
      } else {
        Alert.alert('Login Failed', response.message || 'Email not allowed for this portal');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Backend social login error:', err);

      // If backend route not found, proceed directly based on portal selection
      // This allows OAuth to work even if backend hasn't been deployed with social-login endpoint
      if (err.message?.includes('Route not found') || err.message?.includes('404')) {
        console.log('Backend social-login not available, proceeding with portal-based navigation');

        // Map portal to role and dashboard route
        const portalRoleMap: { [key: string]: string } = {
          'Inspector': 'inspector',
          'Management': 'management',
          'Other': 'other'
        };

        const portalDashboardMap: { [key: string]: string } = {
          'Inspector': 'Dashboard',
          'Management': 'ManagementDashboard',
          'Other': 'OrderDashboard'
        };

        // Store user data locally so Dashboard can display the name
        const userData = {
          _id: `social_${Date.now()}`,
          id: `social_${Date.now()}`,
          fullName: fullName, // This will be the email prefix (e.g., "rminhal" from "rminhal@gmail.com")
          email: email,
          role: portalRoleMap[portal] || 'inspector',
          socialProvider: provider
        };

        // Store user data using proper storage utilities
        await storeData(StorageKeys.USER_DATA, userData);
        await storeData(StorageKeys.USER_TOKEN, `social_${provider}_${Date.now()}`);
        await storeData(StorageKeys.USER_TYPE, userData.role);

        console.log('Stored social login user data:', userData);

        const dashboardRoute = portalDashboardMap[portal] || 'Dashboard';
        navigation.reset({
          index: 0,
          routes: [{ name: dashboardRoute as any }],
        });
      } else {
        Alert.alert('Error', err.message || 'Backend validation failed');
        setLoading(false);
      }
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);

      // Get selected portal from route params (most reliable) or fallback to storage/default
      const selectedPortal = userType || await AsyncStorage.getItem('selectedPortal') || 'Inspector';

      // Create redirect URI for Expo
      const redirectUrl = Linking.createURL('/oauth-callback');
      console.log('Facebook OAuth redirect URL:', redirectUrl);

      const result = await startFacebookFlow({ redirectUrl });

      if (result.createdSessionId) {
        // Set active session
        await result.setActive?.({ session: result.createdSessionId });

        // Get user info from Clerk session
        let email = '';
        let fullName = '';

        // Try to get from signUp or signIn objects
        if (result.signUp) {
          email = result.signUp.emailAddress ?? '';
          fullName = (result.signUp as any)?.firstName ?? '';
        }

        if (!email && result.signIn) {
          email = result.signIn.identifier ?? '';
          fullName = (result.signIn as any)?.firstName ?? '';
        }

        // Fallback: Try from createdSession user object
        if (!email && (result as any).createdSession?.user) {
          const user = (result as any).createdSession.user;
          email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '';
          fullName = user.firstName || user.fullName || '';
        }

        // Final fallback - ERROR if no email found
        if (!email) {
          console.log('Email not found in Facebook OAuth result');
          Alert.alert('Sign In Failed', 'Could not retrieve email address from your Facebook account.');
          setLoading(false);
          return;
        }

        // Use email prefix as the name if no full name
        const displayName = fullName || (email.includes('@') ? email.split('@')[0] : email);

        console.log('Facebook OAuth success - email:', email, 'name:', displayName, 'portal:', selectedPortal);

        // Proceed directly to backend verification
        handleSocialLoginBackend(email, displayName, selectedPortal, 'facebook');
      } else {
        console.log('Facebook OAuth - No session created. Result:', result);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Facebook OAuth error:', err);
      const errorMessage = err.message || 'Failed to sign in with Facebook';

      // Provide more helpful error messages
      if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
        // User cancelled - don't show error
        console.log('User cancelled Facebook sign in');
      } else {
        Alert.alert('Facebook Sign In Error', errorMessage);
      }
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);

      // Get selected portal from route params (most reliable) or fallback to storage/default
      const selectedPortal = userType || await AsyncStorage.getItem('selectedPortal') || 'Inspector';

      // Create redirect URI for Expo
      const redirectUrl = Linking.createURL('/oauth-callback');
      console.log('Apple OAuth redirect URL:', redirectUrl);

      const result = await startAppleFlow({ redirectUrl });

      if (result.createdSessionId) {
        // Set active session
        await result.setActive?.({ session: result.createdSessionId });

        // Get user info from Clerk session
        let email = '';
        let fullName = '';

        // Try to get from signUp or signIn objects
        if (result.signUp) {
          email = result.signUp.emailAddress ?? '';
          fullName = (result.signUp as any)?.firstName ?? '';
        }

        if (!email && result.signIn) {
          email = result.signIn.identifier ?? '';
          fullName = (result.signIn as any)?.firstName ?? '';
        }

        // Fallback: Try from createdSession user object
        if (!email && (result as any).createdSession?.user) {
          const user = (result as any).createdSession.user;
          email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '';
          fullName = user.firstName || user.fullName || '';
        }

        // Final fallback - ERROR if no email found
        if (!email) {
          console.log('Email not found in Apple OAuth result');
          Alert.alert('Sign In Failed', 'Could not retrieve email address from your Apple account.');
          setLoading(false);
          return;
        }

        // Use email prefix as the name if no full name (Apple can hide real name)
        const displayName = fullName || (email.includes('@') ? email.split('@')[0] : email);

        console.log('Apple OAuth success - email:', email, 'name:', displayName, 'portal:', selectedPortal);

        // Proceed directly to backend verification
        handleSocialLoginBackend(email, displayName, selectedPortal, 'apple');
      } else {
        console.log('Apple OAuth - No session created. Result:', result);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Apple OAuth error:', err);
      const errorMessage = err.message || 'Failed to sign in with Apple';

      // Provide more helpful error messages
      if (errorMessage.includes('cancelled') || errorMessage.includes('canceled')) {
        // User cancelled - don't show error
        console.log('User cancelled Apple sign in');
      } else {
        Alert.alert('Apple Sign In Error', errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Boarding")}
        disabled={loading}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Back to Portal Selection</Text>
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

          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username Or Email</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="example@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, passwordError ? styles.passwordInputError : null]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  maxLength={15}
                  textContentType="password"
                  autoComplete="password"
                  contextMenuHidden={true}
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
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forget Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate("SignUp", { userType })}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Social Login */}
            <Text style={styles.orText}>Or sign up with</Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleFacebookSignIn}
                disabled={loading}
              >
                <Ionicons name="logo-facebook" size={32} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Ionicons name="logo-google" size={32} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                <Ionicons name="logo-apple" size={32} color="#374151" />
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
  content: {
    alignItems: "center",
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  logo: {
    width: 350,
    height: 140,
    marginBottom: 10,
  },
  welcomeCard: {
    backgroundColor: "#F0F9E8",
    borderRadius: 30,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    paddingBottom: 30,
    marginBottom: 0,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0E7490",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
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
  passwordInputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: "#0E7490",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  forgotPassword: {
    alignSelf: "center",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#0E7490",
    fontSize: 14,
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "#FF4D67",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  orText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#374151",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
  },
});
