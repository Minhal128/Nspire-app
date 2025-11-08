import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import BoardingScreen from './src/screens/BoardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export type RootStackParamList = {
  Boarding: undefined;
  SignIn: { userType?: string };
  SignUp: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Boarding"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#7DD3FC' }
          }}
        >
          <Stack.Screen name="Boarding" component={BoardingScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
