/**
 * NSPIRE Report Types
 * HUD National Standards for the Physical Inspection of Real Estate
 */

// Severity levels per NSPIRE standards
export type DeficiencySeverity = 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';

// Inspection type
export type InspectionType = 'General NSPIRE' | 'Follow-up' | 'Complaint' | 'Special';

// Building/Unit type for inspection data
export type InspectionUnitType = 'Building' | 'Unit' | 'Site' | 'Common Area';

/**
 * Inspection Header & Metadata
 */
export interface InspectionMetadata {
  inspectionNo: string;
  inspectionType: InspectionType;
  escortName: string;
  propertyAddress: string;
  propertyName: string;
  propertyId: string;
  
  // Timeline
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reportCreatedDate: string;
  
  // Scores
  preliminaryScore: number;
  finalScore: number;
  calculatedScore: number;
  healthSafetyThreshold: number;
  physicalConditionThreshold: number;
  
  // Inspector Information
  inspectorName: string;
  inspectorId: string;
  inspectorSignature?: string;

  // Building & Unit Information
  buildingName?: string;
  inspectedUnits?: string[];
}

/**
 * Building/Unit Inspection Data Table
 */
export interface InspectionDataRow {
  type: InspectionUnitType;
  propertyTotal: number;
  sampleSize: number;
  totalUnitsInspected: number;
}

/**
 * Occupancy Information
 */
export interface OccupancyInfo {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  occupancyRate: number;
  assistedUnits?: number;
  marketRateUnits?: number;
}

/**
 * Deficiency Entry - Main Table Row
 */
export interface DeficiencyEntry {
  id: string;
  
  // Unique QR identifier for each deficiency image (QR-XXXXX format)
  deficiencyQRId: string;
  
  // Deficiency Picture
  imageUri?: string;
  imagePlaceholder?: boolean;
  
  // Location Details
  building: string;
  unit: string;
  room: string;
  area: string;
  
  // Deficiency Information
  deficiencyName: string;
  nspireCode: string;
  codeReference?: string;
  
  // Technical Details
  deficiencyDetails: string;
  
  // Inspector Notes
  comments: string;
  note?: string;
  isGeneralComment?: boolean;
  
  // Scoring Impact
  deductionPts: number;
  
  // History
  repeatIndicator: boolean;
  previousInspectionDate?: string;
  
  // Severity Classification
  severity: DeficiencySeverity;
  
  // Additional metadata
  inspectedDate: string;
  inspectedTime: string;
  inspectorId: string;
  
  // Corrective Action
  correctiveAction?: string;
  dueDate?: string;
  status?: 'Open' | 'In Progress' | 'Resolved' | 'Verified';
}

/**
 * Deficiency Summary by Severity
 */
export interface DeficiencySummary {
  lifeThreatening: number;
  severe: number;
  moderate: number;
  low: number;
  total: number;
  
  // Additional breakdowns
  byBuilding: Record<string, number>;
  byCategory: Record<string, number>;
  repeatDeficiencies: number;
  newDeficiencies: number;
}

/**
 * Category Breakdown
 */
export interface CategoryBreakdown {
  category: string;
  nspireSection: string;
  deficiencyCount: number;
  totalDeductions: number;
  lifeThreatening: number;
  severe: number;
  moderate: number;
  low: number;
}

/**
 * Complete NSPIRE Inspection Report
 */
export interface NSPIREInspectionReport {
  // Report Identification
  reportId: string;
  version: string;
  generatedAt: string;
  
  // Header & Metadata
  metadata: InspectionMetadata;
  
  // Inspection Data Tables
  inspectionData: InspectionDataRow[];
  occupancyInfo: OccupancyInfo;
  
  // Deficiency Summary (shown at beginning)
  summary: DeficiencySummary;
  categoryBreakdown: CategoryBreakdown[];
  
  // Main Deficiency Table
  deficiencies: DeficiencyEntry[];
  
  // Additional Information
  generalComments?: string;
  recommendations?: string[];
  attachments?: ReportAttachment[];
  
  // Certification
  certification?: ReportCertification;
}

/**
 * Report Attachment
 */
export interface ReportAttachment {
  id: string;
  type: 'image' | 'document' | 'video';
  filename: string;
  uri: string;
  description?: string;
  uploadedAt: string;
}

/**
 * Report Certification
 */
export interface ReportCertification {
  certifiedBy: string;
  certificationDate: string;
  digitalSignature?: string;
  certificationStatement: string;
}

/**
 * PDF Generation Options
 */
export interface PDFGenerationOptions {
  includeImages: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  colorCodingSeverity: boolean;
  includeSummaryPage: boolean;
  includeDetailedDeficiencies: boolean;
  includeCertification: boolean;
  pageSize: 'letter' | 'a4' | 'legal';
  orientation: 'portrait' | 'landscape';
  headerLogo?: string;
  footerText?: string;
}

/**
 * NSPIRE Standard Codes Reference
 */
export const NSPIRE_CODES = {
  // Site
  'S-1': 'Fencing/Gates',
  'S-2': 'Grounds/Walkways',
  'S-3': 'Lighting - Exterior',
  'S-4': 'Mailboxes',
  'S-5': 'Parking Lots/Driveways',
  'S-6': 'Play Areas',
  'S-7': 'Refuse Disposal',
  'S-8': 'Retaining Walls',
  'S-9': 'Signs',
  'S-10': 'Storm Drainage',
  
  // Building Exterior
  'BE-1': 'Doors',
  'BE-2': 'Fire Escapes',
  'BE-3': 'Foundations',
  'BE-4': 'Lighting - Exterior',
  'BE-5': 'Roofs',
  'BE-6': 'Walls',
  'BE-7': 'Windows',
  
  // Building Systems
  'BS-1': 'Domestic Water',
  'BS-2': 'Electrical System',
  'BS-3': 'Elevators',
  'BS-4': 'Emergency/Fire',
  'BS-5': 'HVAC',
  'BS-6': 'Sanitary System',
  
  // Common Areas
  'CA-1': 'Basement/Garage',
  'CA-2': 'Closets/Utility',
  'CA-3': 'Community Room',
  'CA-4': 'Day Care',
  'CA-5': 'Halls/Corridors',
  'CA-6': 'Kitchens',
  'CA-7': 'Laundry Room',
  'CA-8': 'Lobby',
  'CA-9': 'Office',
  'CA-10': 'Other',
  'CA-11': 'Patio/Porch/Balcony',
  'CA-12': 'Restrooms',
  'CA-13': 'Stairs',
  'CA-14': 'Storage',
  
  // Unit
  'U-1': 'Bathroom',
  'U-2': 'Call-for-Aid',
  'U-3': 'Ceiling',
  'U-4': 'Doors',
  'U-5': 'Electrical',
  'U-6': 'Floors',
  'U-7': 'GFI/AFCI',
  'U-8': 'Hot Water Heater',
  'U-9': 'HVAC',
  'U-10': 'Kitchen',
  'U-11': 'Lighting',
  'U-12': 'Outlets/Switches',
  'U-13': 'Patio/Porch/Balcony',
  'U-14': 'Smoke Detectors',
  'U-15': 'Stairs',
  'U-16': 'Walls',
  'U-17': 'Windows',
  
  // Health & Safety
  'HS-1': 'Air Quality - Mold',
  'HS-2': 'Air Quality - Propane/Gas',
  'HS-3': 'Air Quality - Sewer Odor',
  'HS-4': 'Electrical Hazards',
  'HS-5': 'Emergency/Fire - CO Detectors',
  'HS-6': 'Emergency/Fire - Fire Extinguisher',
  'HS-7': 'Emergency/Fire - Smoke Detectors',
  'HS-8': 'Flammable Materials',
  'HS-9': 'Garbage/Debris - Inside',
  'HS-10': 'Garbage/Debris - Outside',
  'HS-11': 'Handrail',
  'HS-12': 'Hazards - Other',
  'HS-13': 'Hazards - Sharp Edges',
  'HS-14': 'Hazards - Tripping',
  'HS-15': 'Infestation - Insects',
  'HS-16': 'Infestation - Rodents',
  'HS-17': 'Lead Paint',
} as const;

/**
 * Severity Colors for PDF
 */
export const SEVERITY_COLORS = {
  'Life-Threatening': '#DC2626', // Red
  'Severe': '#F59E0B',           // Orange/Yellow
  'Moderate': '#3B82F6',         // Blue
  'Low': '#6B7280',              // Gray
} as const;

/**
 * Default PDF Generation Options
 */
export const DEFAULT_PDF_OPTIONS: PDFGenerationOptions = {
  includeImages: true, // Re-enable images for proper inspector report
  imageQuality: 'medium',
  colorCodingSeverity: true,
  includeSummaryPage: true,
  includeDetailedDeficiencies: true,
  includeCertification: true,
  pageSize: 'letter',
  orientation: 'portrait',
  footerText: 'Generated by INSPIRE Inspection System',
};
