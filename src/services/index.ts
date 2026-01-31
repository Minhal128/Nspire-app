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

export { default as networkService } from './networkService';
export type { ConnectionStatus, NetworkState } from './networkService';

export { default as offlineStorageService } from './offlineStorageService';
export type { 
  PendingImage, 
  InspectionSession 
} from './offlineStorageService';

export { default as geminiService, INSPECTION_TYPES } from './openaiService';
export type { 
  InspectionFinding, 
  AnalysisResult, 
  InspectionType 
} from './openaiService';

export { default as syncService } from './syncService';
export type { SyncProgress, SyncProgressListener } from './syncService';

export { nspirePDFService, NSPIREPDFReportService, generateNSPIREReportHTML } from './nspirePDFService';

export { 
  generateRandomUnitSample, 
  getUnitsToInspect, 
  isRandomSelectionAvailable, 
  getSamplingExplanation,
  NSPIRE_SAMPLING_REFERENCE 
} from './unitSamplingService';
export type { UnitSample } from './unitSamplingService';
