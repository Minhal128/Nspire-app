import { generateNSPIREReport } from './nspireReportUtils';
import { enhancedNspirePDFService } from '../services/enhancedNspirePDFService';

export const buildInProgressReportHtml = (reportData: any): string => {
    const normalizedData = { ...(reportData || {}) };

    normalizedData.findings = normalizedData.findings || normalizedData.deficiencies || [];
    normalizedData.deficiencies = normalizedData.deficiencies || normalizedData.findings || [];

    const nspireReport = generateNSPIREReport(normalizedData as any);
    (nspireReport as any).metadata = {
        ...(nspireReport as any).metadata,
        status: 'in-progress',
    };

    return enhancedNspirePDFService.generateEnhancedHTMLPreview(nspireReport as any, {
        includeImages: true,
        imageQuality: 'high',
        colorCodingSeverity: true,
        includeSummaryPage: true,
        includeDetailedDeficiencies: true,
        includeCertification: true,
        pageSize: 'letter',
        orientation: 'portrait',
    } as any);
};
