/**
 * NSPIRE Report Utilities
 * Helper functions for generating and manipulating NSPIRE inspection reports
 */

import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  CategoryBreakdown,
  InspectionMetadata,
  InspectionDataRow,
  OccupancyInfo,
  DeficiencySeverity,
  NSPIRE_CODES,
  SEVERITY_COLORS,
} from '../types/nspireReport';
import { InspectionFinding } from '../services/openaiService';

/**
 * Sanitize description from AI to remove any potential JSON residue
 */
export const sanitizeAIDescription = (text: string): string => {
  if (!text) return '';

  // Try to parse as JSON if it looks like one
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.findings && Array.isArray(parsed.findings) && parsed.findings.length > 0) {
        return parsed.findings[0].description || parsed.findings[0].title || text;
      }
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0].description || parsed[0].title || text;
      }
    } catch (e) {
      // Not valid JSON, proceed to regex cleanup
    }
  }

  // Regex cleanup for common JSON-like garbage from AI
  return text
    .replace(/^\{\s*"findings"\s*:\s*\[\s*\{\s*/i, '')
    .replace(/^"title"\s*:\s*"/i, '')
    .replace(/^"description"\s*:\s*"/i, '')
    .replace(/"\s*\}\s*\]\s*\}$/i, '')
    .replace(/\\"/g, '"') // Unescape quotes
    .trim();
};

/**
 * Map AI inspection finding severity to NSPIRE severity
 */
export const mapFindingSeverityToNSPIRE = (severity: string): DeficiencySeverity => {
  const severityMap: Record<string, DeficiencySeverity> = {
    'critical': 'Life-Threatening',
    'major': 'Severe',
    'minor': 'Moderate',
    'observation': 'Low',
    'life-threatening': 'Life-Threatening',
    'severe': 'Severe',
    'moderate': 'Moderate',
    'low': 'Low',
  };
  return severityMap[severity?.toLowerCase()] || 'Moderate';
};

/**
 * Calculate deduction points based on severity
 */
export const calculateDeductionPoints = (severity: DeficiencySeverity): number => {
  const deductionMap: Record<DeficiencySeverity, number> = {
    'Life-Threatening': 10,
    'Severe': 6,
    'Moderate': 3,
    'Low': 1,
  };
  return deductionMap[severity] || 3;
};

/**
 * Map category to NSPIRE code
 */
export const mapCategoryToNSPIRECode = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'structural': 'BE-3',
    'electrical': 'BS-2',
    'plumbing': 'BS-1',
    'safety': 'HS-12',
    'hvac': 'BS-5',
    'exterior': 'BE-6',
    'interior': 'U-16',
    'appliances': 'U-10',
    'fire': 'BS-4',
    'sanitary': 'BS-6',
    'doors': 'BE-1',
    'windows': 'BE-7',
    'roofs': 'BE-5',
    'walls': 'BE-6',
    'bathroom': 'U-1',
    'kitchen': 'U-10',
    'stairs': 'CA-13',
    'lighting': 'CA-5',
    'smoke_detector': 'U-14',
    'infestation': 'HS-15',
    'mold': 'HS-1',
    'lead': 'HS-17',
  };
  return categoryMap[category?.toLowerCase()] || 'HS-12';
};

/**
 * Get NSPIRE code description
 */
export const getNSPIRECodeDescription = (code: string): string => {
  return NSPIRE_CODES[code as keyof typeof NSPIRE_CODES] || 'Unknown Code';
};

/**
 * Convert AI findings to NSPIRE deficiency entries
 */
export const convertFindingsToDeficiencies = (
  findings: InspectionFinding[],
  propertyInfo?: { building?: string; unit?: string }
): DeficiencyEntry[] => {
  const now = new Date();

  return findings.map((finding: any, index: number) => {
    finding.deficiencyQRId = '';
    const severity = mapFindingSeverityToNSPIRE(finding.severity);
    const nspireCode = finding.nspireCode || finding.code || finding?.deficiency?.code || mapCategoryToNSPIRECode(finding.category || finding.area);
    const rawDetails =
      finding.deficiencyDetails ||
      finding.detail ||
      finding.description ||
      finding?.deficiency?.detail ||
      finding?.deficiency?.description ||
      finding?.deficiencyName ||
      finding?.title ||
      finding?.name ||
      '';
    const detailsText = sanitizeAIDescription(rawDetails) || 'Issue recorded';

    return {
      id: finding.id || `DEF-${index + 1}`, deficiencyQRId: '', imageUri: finding.imageUri || '',
      imagePlaceholder: !finding.imageUri,
      building: finding.building || finding.buildingName || finding.unitId || propertyInfo?.building || 'Building',
      unit: finding.unit || finding.unitId || propertyInfo?.unit || '-',
      room: finding.location || 'General',
      area: finding.area || finding.category || finding.inspectionType || 'General',
      deficiencyName: finding.deficiencyName || finding?.deficiency?.name || finding.title || finding.name || 'Deficiency',
      nspireCode,
      codeReference: finding.codeReference || finding?.deficiency?.codeReference || finding?.deficiency?.source || '',
      deficiencyDetails: detailsText,
      comments: finding.comments || finding.note || finding.recommendedAction || finding.aiAnalysis || '',
      note: finding.note || finding.comments || '',
      deductionPts: calculateDeductionPoints(severity),
      repeatIndicator: false,
      severity,
      inspectedDate: now.toLocaleDateString(),
      inspectedTime: finding.timestamp
        ? new Date(finding.timestamp).toLocaleTimeString()
        : now.toLocaleTimeString(),
      inspectorId: 'INS-001',
      correctiveAction: finding.recommendedAction,
      status: 'Open',
    };
  });
};

/**
 * Calculate deficiency summary from entries
 */
export const calculateDeficiencySummary = (deficiencies: DeficiencyEntry[]): DeficiencySummary => {
  const summary: DeficiencySummary = {
    lifeThreatening: 0,
    severe: 0,
    moderate: 0,
    low: 0,
    total: deficiencies.length,
    byBuilding: {},
    byCategory: {},
    repeatDeficiencies: 0,
    newDeficiencies: 0,
  };

  deficiencies.forEach(def => {
    // Count by severity
    switch (def.severity) {
      case 'Life-Threatening':
        summary.lifeThreatening++;
        break;
      case 'Severe':
        summary.severe++;
        break;
      case 'Moderate':
        summary.moderate++;
        break;
      case 'Low':
        summary.low++;
        break;
    }

    // Count by building
    summary.byBuilding[def.building] = (summary.byBuilding[def.building] || 0) + 1;

    // Count by category (using NSPIRE code prefix)
    const categoryPrefix = def.nspireCode.split('-')[0];
    summary.byCategory[categoryPrefix] = (summary.byCategory[categoryPrefix] || 0) + 1;

    // Count repeats
    if (def.repeatIndicator) {
      summary.repeatDeficiencies++;
    } else {
      summary.newDeficiencies++;
    }
  });

  return summary;
};

/**
 * Calculate category breakdown from deficiencies
 */
export const calculateCategoryBreakdown = (deficiencies: DeficiencyEntry[]): CategoryBreakdown[] => {
  const categoryMap: Record<string, CategoryBreakdown> = {};

  // Define NSPIRE category names
  const categoryNames: Record<string, string> = {
    'S': 'Site',
    'BE': 'Building Exterior',
    'BS': 'Building Systems',
    'CA': 'Common Areas',
    'U': 'Unit',
    'HS': 'Health & Safety',
  };

  deficiencies.forEach(def => {
    const prefix = def.nspireCode.split('-')[0];
    const categoryName = categoryNames[prefix] || prefix;

    if (!categoryMap[prefix]) {
      categoryMap[prefix] = {
        category: categoryName,
        nspireSection: prefix,
        deficiencyCount: 0,
        totalDeductions: 0,
        lifeThreatening: 0,
        severe: 0,
        moderate: 0,
        low: 0,
      };
    }

    categoryMap[prefix].deficiencyCount++;
    categoryMap[prefix].totalDeductions += def.deductionPts;

    switch (def.severity) {
      case 'Life-Threatening':
        categoryMap[prefix].lifeThreatening++;
        break;
      case 'Severe':
        categoryMap[prefix].severe++;
        break;
      case 'Moderate':
        categoryMap[prefix].moderate++;
        break;
      case 'Low':
        categoryMap[prefix].low++;
        break;
    }
  });

  return Object.values(categoryMap).sort((a, b) => b.totalDeductions - a.totalDeductions);
};

/**
 * Calculate overall inspection score
 */
export const calculateInspectionScore = (deficiencies: DeficiencyEntry[]): number => {
  const baseScore = 100;
  const totalDeductions = deficiencies.reduce((sum, def) => sum + def.deductionPts, 0);
  return Math.max(0, baseScore - totalDeductions);
};

/**
 * Generate complete NSPIRE report from inspection data
 */
export const generateNSPIREReport = (
  inspectionData: {
    findings: InspectionFinding[];
    property: any;
    inspectorName?: string;
    inspectorId?: string;
    escortName?: string;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    buildingName?: string;
    selectedUnits?: string[];
  }
): NSPIREInspectionReport => {
  const now = new Date();
  const { findings, property, inspectorName, inspectorId, escortName, startDate, endDate, notes, buildingName, selectedUnits } = inspectionData;

  // Convert findings to deficiencies
  const deficiencies = convertFindingsToDeficiencies(findings, {
    building: property?.building,
    unit: property?.unit,
  });

  // Calculate summary and breakdown
  const summary = calculateDeficiencySummary(deficiencies);
  const categoryBreakdown = calculateCategoryBreakdown(deficiencies);
  const score = calculateInspectionScore(deficiencies);

  // Build metadata
  const metadata: InspectionMetadata = {
    inspectionNo: `INSP-${Date.now().toString(36).toUpperCase()}`,
    inspectionType: 'General NSPIRE',
    escortName: escortName || property?.contactName || '-',
    propertyAddress: property?.address || '-',
    propertyName: property?.name || '-',
    propertyId: property?._id || property?.id || '-',
    startDate: (startDate || now).toLocaleDateString(),
    startTime: (startDate || now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endDate: (endDate || now).toLocaleDateString(),
    endTime: (endDate || now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reportCreatedDate: now.toLocaleDateString(),
    preliminaryScore: score,
    finalScore: score,
    calculatedScore: score,
    healthSafetyThreshold: 60,
    physicalConditionThreshold: 60,
    inspectorName: inspectorName || 'Inspector',
    inspectorId: inspectorId || 'INS-001',
    buildingName: buildingName || undefined,
    inspectedUnits: selectedUnits && selectedUnits.length > 0 ? selectedUnits : undefined,
  };

  // Build inspection data table
  const inspectionDataRows: InspectionDataRow[] = [
    {
      type: 'Building',
      propertyTotal: property?.buildings || 1,
      sampleSize: 1,
      totalUnitsInspected: 1
    },
    {
      type: 'Unit',
      propertyTotal: property?.units || 1,
      sampleSize: 1,
      totalUnitsInspected: 1
    },
    {
      type: 'Site',
      propertyTotal: 1,
      sampleSize: 1,
      totalUnitsInspected: 1
    },
    {
      type: 'Common Area',
      propertyTotal: property?.commonAreas || 1,
      sampleSize: 1,
      totalUnitsInspected: 1
    },
  ];

  // Build occupancy info
  const occupancyInfo: OccupancyInfo = {
    totalUnits: property?.units || 1,
    occupiedUnits: property?.occupiedUnits || property?.units || 1,
    vacantUnits: property?.vacantUnits || 0,
    occupancyRate: property?.occupancyRate || 100,
    assistedUnits: property?.assistedUnits,
    marketRateUnits: property?.marketRateUnits,
  };

  // Generate recommendations based on findings
  const recommendations: string[] = [];

  if (summary.lifeThreatening > 0) {
    recommendations.push('Address all Life-Threatening deficiencies within 24 hours');
  }
  if (summary.severe > 0) {
    recommendations.push('Schedule immediate repairs for Severe deficiencies');
  }
  if (summary.repeatDeficiencies > 0) {
    recommendations.push('Review maintenance procedures to prevent recurring issues');
  }
  if (categoryBreakdown.find(c => c.nspireSection === 'BS' && c.deficiencyCount > 2)) {
    recommendations.push('Consider comprehensive building systems inspection');
  }
  if (categoryBreakdown.find(c => c.nspireSection === 'HS' && c.deficiencyCount > 0)) {
    recommendations.push('Prioritize health and safety related repairs');
  }

  return {
    reportId: `RPT-${Date.now()}`,
    version: '1.0',
    generatedAt: now.toISOString(),
    metadata,
    inspectionData: inspectionDataRows,
    occupancyInfo,
    summary,
    categoryBreakdown,
    deficiencies,
    generalComments: notes,
    recommendations,
    certification: {
      certifiedBy: inspectorName || 'Inspector',
      certificationDate: now.toLocaleDateString(),
      certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
    },
  };
};

/**
 * Get severity color for styling
 */
export const getSeverityColor = (severity: DeficiencySeverity): string => {
  return SEVERITY_COLORS[severity];
};

/**
 * Format score with pass/fail indicator
 */
export const formatScoreWithStatus = (score: number, threshold: number = 60): string => {
  const status = score >= threshold ? '✓ Pass' : '✗ Fail';
  return `${score} (${status})`;
};

/**
 * Generate unique inspection number
 */
export const generateInspectionNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INSP-${timestamp}-${random}`;
};

/**
 * Validate NSPIRE report data
 */
export const validateNSPIREReport = (report: NSPIREInspectionReport): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!report.metadata.inspectionNo) {
    errors.push('Missing inspection number');
  }
  if (!report.metadata.propertyAddress) {
    errors.push('Missing property address');
  }
  if (!report.metadata.inspectorName) {
    errors.push('Missing inspector name');
  }
  if (report.metadata.finalScore < 0 || report.metadata.finalScore > 100) {
    errors.push('Invalid final score (must be 0-100)');
  }
  if (report.deficiencies.some(d => !d.nspireCode)) {
    errors.push('Some deficiencies are missing NSPIRE codes');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Export report data to JSON
 */
export const exportReportToJSON = (report: NSPIREInspectionReport): string => {
  return JSON.stringify(report, null, 2);
};

/**
 * Import report data from JSON
 */
export const importReportFromJSON = (jsonString: string): NSPIREInspectionReport | null => {
  try {
    const report = JSON.parse(jsonString) as NSPIREInspectionReport;
    const validation = validateNSPIREReport(report);

    if (!validation.valid) {
      console.warn('Report validation warnings:', validation.errors);
    }

    return report;
  } catch (error) {
    console.error('Failed to parse report JSON:', error);
    return null;
  }
};
