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
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
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
import OtherInspectionsScreen from "./src/screens/OtherInspectionsScreen";
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
  BuildingInspection: { property: any; calculatedUnits?: number; selectedUnits?: string[]; coverage?: string };
  Analytics: undefined;
  UnitInspection: { property: any };
  InspectionChecklist: { property: any; unit: any };
  ManagementDashboard: undefined;
  ReportDetail: { report: any };
  OrderDashboard: undefined;
  Others: undefined;
  OtherInspections: undefined;
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
    buildingId?: string;
    inspectionData?: any;
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
      OtherInspections: "other-inspections",
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
  const handleAuthenticate = useCallback(async () => {
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
  }, [onAuthenticate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleAuthenticate();
    }, 500);
    return () => clearTimeout(timeout);
  }, [handleAuthenticate]);

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

// Error Boundary to catch crashes and prevent blank screen
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [isReady, setIsReady] = useState(false);
  const [biometricRequired, setBiometricRequired] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Boarding");

  // Check authentication state on app start with safety timeout
  useEffect(() => {
    let didFinish = false;

    const checkAuthState = async () => {
      try {
        const authState = await authService.checkSession();

        if (authState.isAuthenticated && authState.user) {
          const biometricEnabled = await SecureStore.getItemAsync(BIOMETRIC_2FA_KEY);
          if (biometricEnabled === 'true') {
            setBiometricRequired(true);
          } else {
            setBiometricVerified(true);
          }

          const dashboardRoute = authService.getDashboardRoute(authState.user.role);
          setInitialRoute(dashboardRoute as keyof RootStackParamList);
        } else {
          setInitialRoute("Boarding");
          setBiometricVerified(true);
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setInitialRoute("Boarding");
        setBiometricVerified(true);
      } finally {
        didFinish = true;
        setIsReady(true);
      }
    };

    checkAuthState();

    // Safety timeout: if auth check hangs for 10s, force proceed to Boarding
    const safetyTimer = setTimeout(() => {
      if (!didFinish) {
        console.warn("Auth check timed out after 10s, forcing app to load");
        setInitialRoute("Boarding");
        setBiometricVerified(true);
        setIsReady(true);
      }
    }, 10000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleBiometricSuccess = () => {
    setBiometricVerified(true);
  };

  const onReady = useCallback(() => {
    console.log("Navigation ready");
  }, []);

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
            publishableKey={"pk_test_bGlnaHQtbXV0dC03Mi5jbGVyay5hY2NvdW50cy5kZXYk"}
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
                  <Stack.Screen name="OtherInspections" component={OtherInspectionsScreen} />
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

// Main App export wraps everything in ErrorBoundary
export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContent />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97F0FF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 32,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  errorButton: {
    backgroundColor: "#0E7490",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
