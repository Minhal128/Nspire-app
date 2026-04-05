import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ZoomProvider } from './src/contexts/ZoomContext';
import { ReportPreviewProvider } from './src/contexts/ReportPreviewContext';
import ZoomWrapper from './src/components/ZoomWrapper';

// Import screens
import BoardingScreen from "./src/screens/BoardingScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import EmailVerificationScreen from "./src/screens/EmailVerificationScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import MyInspectionsScreen from "./src/screens/MyInspectionsScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import InspectionStatusScreen from "./src/screens/InspectionStatusScreen";
import AddPropertyScreen from "./src/screens/AddPropertyScreen";
import RequestInspectionScreen from "./src/screens/RequestInspectionScreen";
import EditPropertyScreen from "./src/screens/EditPropertyScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import UnitInspectionScreen from "./src/screens/UnitInspectionScreen";
import InspectionChecklistScreen from "./src/screens/InspectionChecklistScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ManagementDashboardScreen from "./src/screens/ManagementDashboardScreen";
import ManagementReportsScreen from "./src/screens/ManagementReportsScreen";
import ReportDetailScreen from "./src/screens/ReportDetailScreen";
import OrderDashboardScreen from "./src/screens/OrderDashboardScreen";
import OthersScreen from "./src/screens/OthersScreen";
import LocationStatsScreen from "./src/screens/LocationStatsScreen";
import AIInspectionScreen from "./src/screens/AIInspectionScreen";
import InspectionCategoryScreen from "./src/screens/InspectionCategoryScreen";
import ModuleSelectionScreen from "./src/screens/ModuleSelectionScreen";
import DeficiencyFillingScreen from "./src/screens/DeficiencyFillingScreen";
import InspectionSummaryScreen from "./src/screens/InspectionSummaryScreen";
import InspectionReportScreen from "./src/screens/InspectionReportScreen";
import NSPIREReportScreen from "./src/screens/NSPIREReportScreen";
import PropertyInfoScreen from "./src/screens/PropertyInfoScreen";
import InspectionCategoriesScreen from "./src/screens/InspectionCategoriesScreen";
import UnitLocationsScreen from "./src/screens/UnitLocationsScreen";
import LocationInspectionScreen from "./src/screens/LocationInspectionScreen";
import DeficiencyDetailScreen from "./src/screens/DeficiencyDetailScreen";
import PropertyDetailsScreen from "./src/screens/PropertyDetailsScreen";
import BuildingInspectionScreen from "./src/screens/BuildingInspectionScreen";

// Import auth service
import authService from "./src/services/authService";

export type RootStackParamList = {
  Boarding: undefined;
  SignIn: { userType?: string };
  SignUp: { userType?: string };
  EmailVerification: { email: string; role: string };
  ForgotPassword: undefined;
  Notifications: undefined;
  Dashboard: undefined;
  MyInspections: undefined;
  Reports: undefined;
  InspectionStatus: undefined;
  ManagementReports: undefined;
  Settings: undefined;
  AddProperty: undefined;
  RequestInspection: undefined;
  EditProperty: { property: any };
  PropertyDetails: { property: any };
  BuildingInspection: { property: any; calculatedUnits: number; selectedUnits: string[]; coverage: string };
  Analytics: undefined;
  UnitInspection: { property: any };
  InspectionChecklist: { property: any; unit: any };
  ManagementDashboard: undefined;
  ReportDetail: { report: any };
  OrderDashboard: undefined;
  Others: undefined;
  LocationStats: undefined;
  AIInspection: { property: any; selectedUnits?: string[]; coverage?: string; totalUnits?: number; samplingInfo?: any };
  ModuleSelection: { property: any; selectedUnits?: string[]; coverage?: string; totalUnits?: number; samplingInfo?: any; category: 'inside' | 'outside' };
  DeficiencyFilling: { property: any; selectedUnits?: string[]; coverage?: string; totalUnits?: number; samplingInfo?: any; category: 'inside' | 'outside'; selectedModule?: any };
  LegacyAIInspection: { property: any };
  InspectionReport: { property: any; session: any; findings: any[]; images: any[]; complianceScore: number; overallCondition: string };
  NSPIREReport: { report?: any; inspectionData?: any; property?: any };
  PropertyInfo: { property: any; selectedUnits: string[]; completedUnits?: string[] };
  InspectionCategories: { property: any; selectedUnits: string[]; buildingId: string; currentUnit?: string };
  UnitLocations: { property: any; selectedUnits: string[]; buildingId: string };
  LocationInspection: { property: any; selectedUnits: string[]; buildingId: string; location: string };
  DeficiencyDetail: {
    property: any;
    selectedUnits: string[];
    buildingId: string;
    location: string;
    itemId: string;
    itemName: string;
  };
  InspectionSummary: {
    property: any;
    selectedUnits: string[];
    buildingId: string;
    inspectionData: any;
    currentUnit?: string;
    allUnits?: string[];
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Biometric 2FA key
const BIOMETRIC_2FA_KEY = 'biometric_2fa_enabled';

// Clerk token cache
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
  async clearToken(key: string) {
    try {
      return SecureStore.deleteItemAsync(key);
    } catch (err) {
      return;
    }
  },
};

// Deep linking configuration
const prefix = Linking.createURL("/");

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, "inspire://", "https://inspire.app", "https://*.inspire.app"],
  config: {
    screens: {
      Boarding: "boarding",
      SignIn: "signin",
      SignUp: "signup",
      EmailVerification: "verify-email",
      ForgotPassword: "forgot-password",
      Notifications: "notifications",
      Dashboard: "dashboard",
      MyInspections: "inspections",
      Reports: "reports",
      InspectionStatus: "inspection-status",
      ManagementReports: "management-reports",
      Settings: "settings",
      AddProperty: "add-property",
      RequestInspection: "request-inspection",
      EditProperty: "edit-property",
      Analytics: "analytics",
      UnitInspection: "unit-inspection",
      InspectionChecklist: "checklist",
      ManagementDashboard: "management",
      ReportDetail: "report",
      OrderDashboard: "orders",
      Others: "others",
      LocationStats: "location-stats",
      AIInspection: "ai-inspection",
      InspectionReport: "inspection-report",
      NSPIREReport: "nspire-report",
    },
  },
};

// Loading screen component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0E7490" />
    </View>
  );
}

// Biometric authentication screen
function BiometricAuthScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access NSPIRE',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        onAuthenticate();
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
    }
  };

  return (
    <View style={styles.biometricContainer}>
      <View style={styles.biometricContent}>
        <Ionicons name="finger-print" size={80} color="#0E7490" />
        <Text style={styles.biometricTitle}>Authentication Required</Text>
        <Text style={styles.biometricSubtitle}>
          Use biometric authentication to access the app
        </Text>
        <TouchableOpacity style={styles.biometricButton} onPress={handleAuthenticate}>
          <Ionicons name="lock-open-outline" size={24} color="#fff" />
          <Text style={styles.biometricButtonText}>Authenticate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [biometricRequired, setBiometricRequired] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Boarding");

  // Check authentication state on app start
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authState = await authService.checkSession();

        if (authState.isAuthenticated && authState.user) {
          // User is logged in, check if biometric 2FA is enabled
          const biometricEnabled = await SecureStore.getItemAsync(BIOMETRIC_2FA_KEY);
          if (biometricEnabled === 'true') {
            setBiometricRequired(true);
            // Auto-prompt for biometric authentication
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Authenticate to access NSPIRE',
              cancelLabel: 'Cancel',
              disableDeviceFallback: false,
            });
            if (result.success) {
              setBiometricVerified(true);
            }
          } else {
            setBiometricVerified(true);
          }

          // Determine the correct dashboard
          const dashboardRoute = authService.getDashboardRoute(authState.user.role);
          setInitialRoute(dashboardRoute as keyof RootStackParamList);
        } else {
          // User is not logged in, go to boarding
          setInitialRoute("Boarding");
          setBiometricVerified(true); // No biometric needed for unauthenticated users
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setInitialRoute("Boarding");
        setBiometricVerified(true);
      } finally {
        setIsReady(true);
      }
    };

    checkAuthState();
  }, []);

  // Handle biometric authentication success
  const handleBiometricSuccess = () => {
    setBiometricVerified(true);
  };

  // Handle deep links when app is already open
  const onReady = useCallback(() => {
    // App navigation container is ready
    console.log("Navigation ready");
  }, []);

  // Show loading screen while checking auth
  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ZoomProvider>
          <ZoomWrapper>
            <StatusBar style="dark" />
            <LoadingScreen />
          </ZoomWrapper>
        </ZoomProvider>
      </GestureHandlerRootView>
    );
  }

  // Show biometric authentication screen if required and not verified
  if (biometricRequired && !biometricVerified) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ZoomProvider>
          <ZoomWrapper>
            <StatusBar style="dark" />
            <BiometricAuthScreen onAuthenticate={handleBiometricSuccess} />
          </ZoomWrapper>
        </ZoomProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ZoomProvider>
        <ZoomWrapper>
          <ClerkProvider
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
            tokenCache={tokenCache}
          >
            <ReportPreviewProvider>
              <StatusBar style="dark" />
              <NavigationContainer
                linking={linking}
                fallback={<LoadingScreen />}
                onReady={onReady}
              >
                <Stack.Navigator
                  initialRouteName={initialRoute}
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#97F0FF" },
                  }}
                >
                  <Stack.Screen name="Boarding" component={BoardingScreen} />
                  <Stack.Screen name="SignIn" component={SignInScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                  <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                  <Stack.Screen name="Notifications" component={NotificationScreen} />
                  <Stack.Screen name="Dashboard" component={DashboardScreen} />
                  <Stack.Screen name="MyInspections" component={MyInspectionsScreen} />
                  <Stack.Screen name="Reports" component={ReportsScreen} />
                  <Stack.Screen name="InspectionStatus" component={InspectionStatusScreen} />
                  <Stack.Screen name="ManagementReports" component={ManagementReportsScreen} />
                  <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
                  <Stack.Screen
                    name="RequestInspection"
                    component={RequestInspectionScreen}
                  />
                  <Stack.Screen name="EditProperty" component={EditPropertyScreen} />
                  <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                  <Stack.Screen
                    name="UnitInspection"
                    component={UnitInspectionScreen}
                  />
                  <Stack.Screen
                    name="InspectionChecklist"
                    component={InspectionChecklistScreen}
                  />
                  <Stack.Screen name="Settings" component={SettingsScreen} />
                  <Stack.Screen
                    name="ManagementDashboard"
                    component={ManagementDashboardScreen}
                  />
                  <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
                  <Stack.Screen
                    name="OrderDashboard"
                    component={OrderDashboardScreen}
                  />
                  <Stack.Screen name="Others" component={OthersScreen} />
                  <Stack.Screen name="LocationStats" component={LocationStatsScreen} />
                  <Stack.Screen name="AIInspection" component={InspectionCategoryScreen} />
                  <Stack.Screen name="ModuleSelection" component={ModuleSelectionScreen} />
                  <Stack.Screen name="DeficiencyFilling" component={DeficiencyFillingScreen} />
                  <Stack.Screen name="InspectionSummary" component={InspectionSummaryScreen} />
                  <Stack.Screen name="LegacyAIInspection" component={AIInspectionScreen} />
                  <Stack.Screen name="InspectionReport" component={InspectionReportScreen} />
                  <Stack.Screen name="NSPIREReport" component={NSPIREReportScreen} />
                  <Stack.Screen name="PropertyInfo" component={PropertyInfoScreen} />
                  <Stack.Screen name="InspectionCategories" component={InspectionCategoriesScreen} />
                  <Stack.Screen name="UnitLocations" component={UnitLocationsScreen} />
                  <Stack.Screen name="LocationInspection" component={LocationInspectionScreen} />
                  <Stack.Screen name="DeficiencyDetail" component={DeficiencyDetailScreen} />
                  <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
                  <Stack.Screen name="BuildingInspection" component={BuildingInspectionScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ReportPreviewProvider>
          </ClerkProvider>
        </ZoomWrapper>
      </ZoomProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97F0FF",
  },
  biometricContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  biometricContent: {
    alignItems: "center",
    padding: 40,
  },
  biometricTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 24,
    marginBottom: 8,
  },
  biometricSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E7490",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  biometricButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
