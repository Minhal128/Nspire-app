/**
 * Services Index
 * Central export for all API services
 */

export { default as api, API_CONFIG } from './api';
export type { 
  ApiResponse, 
  User, 
  AuthResponse, 
  Property, 
  Inspection, 
  Order, 
  Asset,
  PaginatedResponse 
} from './api';

export { default as authService } from './authService';
export type { LoginCredentials, SignupCredentials, AuthState } from './authService';

export { default as propertyService } from './propertyService';
export type { 
  CreatePropertyData, 
  UpdatePropertyData, 
  PropertyFilters, 
  PropertyStats 
} from './propertyService';

export { default as inspectionService } from './inspectionService';
export type { 
  CreateInspectionData, 
  CreateInspectionRequestData,
  UpdateInspectionData, 
  InspectionFilters, 
  InspectionStats,
  InspectionRequest 
} from './inspectionService';

export { default as orderService } from './orderService';
export type { 
  CreateOrderData, 
  UpdateOrderData, 
  OrderFilters, 
  OrderStats,
  OrderItem 
} from './orderService';

export { default as assetService } from './assetService';
export type { 
  CreateAssetData, 
  UpdateAssetData, 
  AssetFilters, 
  AssetStats,
  MaintenanceRecord 
} from './assetService';

export { default as userService } from './userService';
export type { 
  UpdateProfileData, 
  ChangePasswordData, 
  NotificationSettings 
} from './userService';

export { default as locationService } from './locationService';
export type { 
  CountryOption, 
  StateOption, 
  CityOption, 
  LocationStats 
} from './locationService';
