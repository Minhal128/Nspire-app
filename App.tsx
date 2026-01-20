import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

// Import screens
import BoardingScreen from "./src/screens/BoardingScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import MyInspectionsScreen from "./src/screens/MyInspectionsScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import AddPropertyScreen from "./src/screens/AddPropertyScreen";
import RequestInspectionScreen from "./src/screens/RequestInspectionScreen";
import EditPropertyScreen from "./src/screens/EditPropertyScreen";
import AnalyticsScreen from "./src/screens/AnalyticsScreen";
import UnitInspectionScreen from "./src/screens/UnitInspectionScreen";
import InspectionChecklistScreen from "./src/screens/InspectionChecklistScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import ManagementDashboardScreen from "./src/screens/ManagementDashboardScreen";
import ReportDetailScreen from "./src/screens/ReportDetailScreen";
import OrderDashboardScreen from "./src/screens/OrderDashboardScreen";
import OthersScreen from "./src/screens/OthersScreen";
import LocationStatsScreen from "./src/screens/LocationStatsScreen";
import AIInspectionScreen from "./src/screens/AIInspectionScreen";
import InspectionReportScreen from "./src/screens/InspectionReportScreen";
import NSPIREReportScreen from "./src/screens/NSPIREReportScreen";

// Import auth service
import authService from "./src/services/authService";

export type RootStackParamList = {
  Boarding: undefined;
  SignIn: { userType?: string };
  SignUp: undefined;
  Dashboard: undefined;
  MyInspections: undefined;
  Reports: undefined;
  Settings: undefined;
  AddProperty: undefined;
  RequestInspection: undefined;
  EditProperty: { property: any };
  Analytics: undefined;
  UnitInspection: { property: any };
  InspectionChecklist: { property: any; unit: any };
  ManagementDashboard: undefined;
  ReportDetail: { report: any };
  OrderDashboard: undefined;
  Others: undefined;
  LocationStats: undefined;
  AIInspection: { property: any };
  InspectionReport: { property: any; session: any; findings: any[]; images: any[]; complianceScore: number; overallCondition: string };
  NSPIREReport: { report?: any; inspectionData?: any; property?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
const prefix = Linking.createURL("/");

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, "inspire://", "https://inspire.app", "https://*.inspire.app"],
  config: {
    screens: {
      Boarding: "boarding",
      SignIn: "signin",
      SignUp: "signup",
      Dashboard: "dashboard",
      MyInspections: "inspections",
      Reports: "reports",
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

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>("Boarding");

  // Check authentication state on app start
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const authState = await authService.checkSession();
        
        if (authState.isAuthenticated && authState.user) {
          // User is logged in, determine the correct dashboard
          const dashboardRoute = authService.getDashboardRoute(authState.user.role);
          setInitialRoute(dashboardRoute as keyof RootStackParamList);
        } else {
          // User is not logged in, go to boarding
          setInitialRoute("Boarding");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setInitialRoute("Boarding");
      } finally {
        setIsReady(true);
      }
    };

    checkAuthState();
  }, []);

  // Handle deep links when app is already open
  const onReady = useCallback(() => {
    // App navigation container is ready
    console.log("Navigation ready");
  }, []);

  // Show loading screen while checking auth
  if (!isReady) {
    return (
      <>
        <StatusBar style="dark" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
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
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="MyInspections" component={MyInspectionsScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
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
          <Stack.Screen name="AIInspection" component={AIInspectionScreen} />
          <Stack.Screen name="InspectionReport" component={InspectionReportScreen} />
          <Stack.Screen name="NSPIREReport" component={NSPIREReportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97F0FF",
  },
});
