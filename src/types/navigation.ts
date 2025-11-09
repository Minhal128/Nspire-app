import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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
};

export type BoardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Boarding'>;
export type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignInScreenRouteProp = RouteProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
