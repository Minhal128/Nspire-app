import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Boarding: undefined;
  SignIn: { userType?: string };
  SignUp: undefined;
  Dashboard: undefined;
};

export type BoardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Boarding'>;
export type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignInScreenRouteProp = RouteProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
