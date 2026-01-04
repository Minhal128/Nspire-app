import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Boarding"
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
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
