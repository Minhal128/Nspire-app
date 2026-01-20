import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  OrderDashboard: undefined;
  NSPIREReport: { report?: any; inspectionData?: any; property?: any };
  InspectionReport: { property?: any; session?: any; findings?: any[]; images?: any[]; complianceScore?: number; overallCondition?: string };
};

export type BoardingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boarding'>;
export type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
export type SignInScreenRouteProp = RouteProp<RootStackParamList, 'SignIn'>;
export type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
export type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
