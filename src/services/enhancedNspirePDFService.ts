/**
 * Enhanced NSPIRE PDF Report Service for Mobile
 * Generates HUD-compliant NSPIRE inspection reports matching exact format
 * of reference document "Imani Fe 12.3.25 (1).pdf"
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import {
  NSPIREInspectionReport,
  DeficiencyEntry,
  DeficiencySummary,
  InspectionMetadata,
  InspectionDataRow,
  OccupancyInfo,
  CategoryBreakdown,
  PDFGenerationOptions,
  SEVERITY_COLORS,
  DEFAULT_PDF_OPTIONS,
  DeficiencySeverity,
} from '../types/nspireReport';

/**
 * Enhanced CSS Styles matching HUD format exactly
 */
function generateEnhancedStyles(options: PDFGenerationOptions): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.3;
      color: #000000;
      padding: 20px;
      background: #FFFFFF;
    }
    
    /* Header Styles - HUD Format */
    .report-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .hud-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 10px;
      display: block;
    }
    
    .header-title {
      font-size: 16pt;
      font-weight: bold;
      color: #000000;
      text-align: center;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .header-metadata {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
      font-size: 9pt;
    }
    
    .header-left, .header-right {
      text-align: left;
    }
    
    .header-row {
      margin-bottom: 3px;
      display: flex;
    }
    
    .header-label {
      font-weight: bold;
      display: inline-block;
      width: 140px;
      flex-shrink: 0;
    }
    
    .header-value {
      color: #000000;
      flex: 1;
    }
    
    /* Score Cards & Metrics - HUD Format */
    .scores-section {
      margin: 20px 0;
      border: 2px solid #000000;
      padding: 15px;
    }
    
    .preliminary-scores {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 20px;
    }
    
    .score-block {
      text-align: left;
    }
    
    .score-block h3 {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .score-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 9pt;
    }
    
    .score-row.bold {
      font-weight: bold;
    }
    
    .score-label {
      flex: 1;
    }
    
    .score-value {
      font-weight: bold;
      min-width: 50px;
      text-align: right;
    }
    
    /* Tables - HUD Format */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
    }
    
    th {
      background: #D3D3D3;
      color: #000000;
      font-weight: bold;
      padding: 8px 6px;
      text-align: center;
      border: 1px solid #000000;
    }
    
    td {
      padding: 6px;
      border: 1px solid #000000;
      vertical-align: top;
      text-align: center;
    }
    
    td.left-align {
      text-align: left;
    }
    
    /* Section Titles */
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      margin: 20px 0 10px 0;
      text-decoration: underline;
    }
    
    /* Building/Unit Inspection Data Table */
    .inspection-data-section {
      margin: 20px 0;
    }
    
    .inspection-data-table th {
      background: #D3D3D3;
    }
    
    .inspection-data-table th.multi-row {
      vertical-align: middle;
    }
    
    /* Deficiency Summary Table */
    .deficiency-summary-section {
      margin: 20px 0;
    }
    
    /* Deficiency Details Table - 7 Column Format */
    .deficiency-details-section {
      margin: 20px 0;
    }
    
    .deficiency-details-table {
      font-size: 8pt;
    }
    
    .deficiency-details-table th {
      background: #D3D3D3;
      font-size: 8pt;
      padding: 6px 4px;
      font-weight: bold;
    }
    
    .deficiency-details-table td {
      font-size: 8pt;
      padding: 4px;
      vertical-align: top;
    }
    
    .deficiency-image {
      width: 100px;
      height: 75px;
      object-fit: cover;
      border: 1px solid #000000;
      display: block;
      margin: 0 auto;
    }
    
    .image-placeholder {
      width: 100px;
      height: 75px;
      background: #F5F5F5;
      border: 1px solid #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #666666;
      text-align: center;
      margin: 0 auto;
    }
    
    .deficiency-name {
      font-weight: bold;
      margin-bottom: 2px;
    }
    
    .nspire-code {
      font-size: 7pt;
      color: #666666;
      font-style: italic;
    }
    
    .location-info {
      font-size: 8pt;
      line-height: 1.2;
    }
    
    /* Certificates Table */
    .certificates-section {
      margin: 20px 0;
    }
    
    .certificates-table th {
      background: #D3D3D3;
    }
    
    /* Certification Section */
    .certification-section {
      margin: 30px 0;
      padding: 20px;
      border: 1px solid #000000;
    }
    
    .signature-area {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    
    .signature-line {
      border-bottom: 1px solid #000000;
      width: 200px;
      margin-bottom: 5px;
    }
    
    .signature-label {
      font-size: 8pt;
      color: #666666;
    }
    
    .signature-name {
      font-size: 9pt;
      font-weight: bold;
      margin-top: 5px;
    }
    
    /* Footer */
    .report-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 8pt;
      color: #666666;
      border-top: 1px solid #000000;
      padding-top: 10px;
    }
    
    .page-number {
      text-align: center;
      font-size: 8pt;
      margin: 20px 0;
      font-weight: bold;
    }
    
    /* Page Break Control */
    .page-break {
      page-break-after: always;
    }
    
    .avoid-break {
      page-break-inside: avoid;
    }
    
    /* Print Specific */
    @media print {
      body {
        padding: 0;
      }
      
      .page-break {
        page-break-after: always;
      }
    }
  `;
}

/**
 * Generate enhanced header matching HUD format exactly
 */
function generateEnhancedHeader(metadata: InspectionMetadata, options: PDFGenerationOptions): string {
  // HUD Logo as SVG data URL
  const hudLogoSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="39" fill="#004488" stroke="#000000" stroke-width="2"/>
      <text x="40" y="30" text-anchor="middle" fill="white" font-size="8" font-family="Arial" font-weight="bold">U.S. DEPARTMENT OF</text>
      <text x="40" y="42" text-anchor="middle" fill="white" font-size="8" font-family="Arial" font-weight="bold">HOUSING AND</text>
      <text x="40" y="54" text-anchor="middle" fill="white" font-size="8" font-family="Arial" font-weight="bold">URBAN DEVELOPMENT</text>
    </svg>
  `)}`;

  return `
    <div class="report-header">
      <img src="${hudLogoSvg}" class="hud-logo" alt="US Department of Housing and Urban Development" />
      
      <h1 class="header-title">NSPIRE - NATIONAL STANDARDS FOR THE PHYSICAL INSPECTION OF REAL ESTATE</h1>
      
      <div class="header-metadata">
        <div class="header-left">
          <div class="header-row">
            <span class="header-label">Inspection No:</span>
            <span class="header-value">${metadata.inspectionNo}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Inspection Type:</span>
            <span class="header-value">${metadata.inspectionType}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Escort Name:</span>
            <span class="header-value">${metadata.escortName}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Property Type:</span>
            <span class="header-value">Multifamily</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="header-row">
            <span class="header-label">Inspection Start Date:</span>
            <span class="header-value">${metadata.startDate}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Inspection End Date:</span>
            <span class="header-value">${metadata.endDate}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Report Created Date:</span>
            <span class="header-value">${metadata.reportCreatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate enhanced summary page with all HUD required sections
 */
function generateEnhancedSummaryPage(
  summary: DeficiencySummary,
  categoryBreakdown: CategoryBreakdown[],
  metadata: InspectionMetadata,
  inspectionData: InspectionDataRow[],
  occupancyInfo: OccupancyInfo
): string {
  return `
    <div class="scores-section avoid-break">
      <div class="preliminary-scores">
        <div class="score-block">
          <h3>Preliminary Scores</h3>
          <div class="score-row">
            <span class="score-label">Preliminary Inspection Score:</span>
            <span class="score-value">${metadata.preliminaryScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Calculated Score:</span>
            <span class="score-value">${metadata.calculatedScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Units Threshold:</span>
            <span class="score-value">10.79</span>
          </div>
          <div class="score-row">
            <span class="score-label">Property Threshold:</span>
            <span class="score-value">${metadata.physicalConditionThreshold}</span>
          </div>
        </div>
        
        <div class="score-block">
          <h3>Final Scores</h3>
          <div class="score-row bold">
            <span class="score-label">Final Inspection Score:</span>
            <span class="score-value">${metadata.finalScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Calculated Score:</span>
            <span class="score-value">${metadata.calculatedScore}</span>
          </div>
          <div class="score-row">
            <span class="score-label">Units Threshold:</span>
            <span class="score-value">10.79</span>
          </div>
          <div class="score-row">
            <span class="score-label">Property Threshold:</span>
            <span class="score-value">${metadata.physicalConditionThreshold}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="inspection-data-section avoid-break">
      <h3 class="section-title">Building/Unit Inspection Data</h3>
      <table class="inspection-data-table">
        <thead>
          <tr>
            <th rowspan="2" class="left-align multi-row">Type</th>
            <th rowspan="2" class="multi-row">Property Total</th>
            <th rowspan="2" class="multi-row">Sample Size</th>
            <th colspan="1">Inspection</th>
          </tr>
          <tr>
            <th>Total Units Inspected</th>
          </tr>
        </thead>
        <tbody>
          ${inspectionData.map(row => `
            <tr>
              <td class="left-align">${row.type}</td>
              <td>${row.propertyTotal}</td>
              <td>${row.sampleSize}</td>
              <td>${row.totalUnitsInspected}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="deficiency-summary-section avoid-break">
      <h3 class="section-title">Deficiency Summary</h3>
      <table>
        <thead>
          <tr>
            <th class="left-align">Inspectable Area</th>
            <th>Life-Threatening</th>
            <th>Severe</th>
            <th>Moderate</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="left-align">Inside</td>
            <td>${summary.lifeThreatening}</td>
            <td>${summary.severe}</td>
            <td>${summary.moderate}</td>
            <td>${summary.low}</td>
          </tr>
          <tr>
            <td class="left-align">Outside</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td class="left-align">Units</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate enhanced deficiency table with exact 7-column format
 */
function generateEnhancedDeficiencyTable(deficiencies: DeficiencyEntry[], options: PDFGenerationOptions): string {
  if (deficiencies.length === 0) {
    return `
      <div class="deficiency-details-section">
        <h3 class="section-title">Inspectable Areas Deficiencies</h3>
        <p style="text-align: center; padding: 20px; font-style: italic;">No deficiencies found during this inspection.</p>
      </div>
    `;
  }

  return `
    <div class="deficiency-details-section">
      <h3 class="section-title">Inspectable Areas Deficiencies</h3>
      <table class="deficiency-details-table">
        <thead>
          <tr>
            <th style="width: 25%;">Deficiency Details</th>
            <th style="width: 15%;">Deficiency Name/Location</th>
            <th style="width: 15%;">Comments</th>
            <th style="width: 15%;">Deficiency Picture</th>
            <th style="width: 10%;">Deduction Pts</th>
            <th style="width: 10%;">Repeat Indicator</th>
            <th style="width: 10%;">Severity</th>
          </tr>
        </thead>
        <tbody>
          ${deficiencies.map(def => `
            <tr class="avoid-break">
              <td class="left-align">
                ${def.deficiencyDetails || 'Address or building identification codes are broken, missing, or not visible'}
              </td>
              <td class="left-align">
                <div class="deficiency-name">${def.deficiencyName}</div>
                <div class="nspire-code">${def.nspireCode}</div>
                <div class="location-info">${def.building} | ${def.unit}</div>
              </td>
              <td class="left-align">
                ${def.comments || 'Wait for Input'}
              </td>
              <td>
                ${options.includeImages && def.imageUri
                  ? `<img src="${def.imageUri}" alt="Deficiency Image" class="deficiency-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                     <div class="image-placeholder" style="display: none;">Image Failed</div>`
                  : `<div class="image-placeholder">N/A</div>`
                }
              </td>
              <td>${def.deductionPts}.0</td>
              <td>${def.repeatIndicator ? 'Repeat' : 'Not Repeat'}</td>
              <td>${def.severity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate certificates table as specified
 */
function generateCertificatesTable(): string {
  const certificates = [
    { name: 'Elevator', status: 'N/A', comment: 'No elevator present' },
    { name: 'Boiler', status: 'Current', comment: 'Valid until 2026' },
    { name: 'Lead-Based Paint', status: 'Current', comment: 'Compliant' },
    { name: 'Fire Alarm', status: 'Current', comment: 'Tested monthly' },
    { name: 'Sprinkler', status: 'N/A', comment: 'Not required' }
  ];

  return `
    <div class="certificates-section avoid-break">
      <h3 class="section-title">Certificates</h3>
      <table class="certificates-table">
        <thead>
          <tr>
            <th class="left-align">Certificate Type</th>
            <th>Status</th>
            <th class="left-align">Comment</th>
          </tr>
        </thead>
        <tbody>
          ${certificates.map(cert => `
            <tr>
              <td class="left-align">${cert.name}</td>
              <td>${cert.status}</td>
              <td class="left-align">${cert.comment}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate enhanced certification section
 */
function generateEnhancedCertificationSection(certification: any): string {
  return `
    <div class="certification-section avoid-break">
      <h3 class="section-title">Inspector Certification</h3>
      <p style="margin-bottom: 20px; font-size: 9pt; line-height: 1.4;">
        ${certification.certificationStatement}
      </p>
      
      <div class="signature-area">
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Inspector Signature</div>
          <div class="signature-name">${certification.certifiedBy}</div>
        </div>
        <div>
          <div class="signature-line" style="width: 150px;"></div>
          <div class="signature-label">Date</div>
          <div class="signature-name">${certification.certificationDate}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate enhanced footer with pagination
 */
function generateEnhancedFooter(options: PDFGenerationOptions): string {
  return `
    <div class="page-number">--- PAGE 1 ---</div>
    <div class="report-footer">
      <p>${options.footerText || 'Generated by NSPIRE Inspection System'}</p>
      <p>Report generated on ${new Date().toLocaleString()}</p>
      <p style="margin-top: 5px;">This document is confidential and intended for authorized use only.</p>
    </div>
  `;
}

/**
 * Generate complete enhanced NSPIRE Report HTML
 */
export function generateEnhancedNSPIREReportHTML(
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NSPIRE - NATIONAL STANDARDS FOR THE PHYSICAL INSPECTION OF REAL ESTATE</title>
  <style>${generateEnhancedStyles(options)}</style>
</head>
<body>
  <div class="report-container">
    ${generateEnhancedHeader(report.metadata, options)}
    
    ${options.includeSummaryPage ? generateEnhancedSummaryPage(
      report.summary,
      report.categoryBreakdown,
      report.metadata,
      report.inspectionData,
      report.occupancyInfo
    ) : ''}
    
    ${options.includeDetailedDeficiencies ? generateEnhancedDeficiencyTable(report.deficiencies, options) : ''}
    
    ${generateCertificatesTable()}
    
    ${options.includeCertification && report.certification ? generateEnhancedCertificationSection(report.certification) : ''}
    
    ${generateEnhancedFooter(options)}
  </div>
</body>
</html>
  `;
}

/**
 * Enhanced PDF Report Service Class
 */
class EnhancedNSPIREPDFReportService {
  /**
   * Generate enhanced PDF from NSPIRE report data
   */
  async generateEnhancedPDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ uri: string; success: boolean; error?: string }> {
    try {
      console.log('Starting Enhanced NSPIRE PDF generation...');
      console.log('Report data:', {
        deficiencies: report.deficiencies?.length || 0,
        metadata: report.metadata?.inspectionNo || 'Unknown',
        includeImages: options.includeImages
      });

      console.log('Generating Enhanced HTML...');
      const html = generateEnhancedNSPIREReportHTML(report, options);

      // Validate HTML is not empty
      if (!html || html.trim().length < 100) {
        throw new Error('Generated HTML is empty or too short');
      }

      console.log('Enhanced HTML generated successfully, length:', html.length);

      console.log('Converting Enhanced HTML to PDF...');
      const printResult = await Print.printToFileAsync({
        html,
        base64: false,
        width: options.pageSize === 'a4' ? 595 : 612,
        height: options.pageSize === 'a4' ? 842 : 792,
        margins: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 50,
        },
      });

      // Validate PDF was created
      if (!printResult.uri) {
        throw new Error('Enhanced PDF generation returned empty URI');
      }

      // Check if PDF file exists
      const pdfInfo = await FileSystem.getInfoAsync(printResult.uri);
      if (!pdfInfo.exists) {
        throw new Error('Generated Enhanced PDF file does not exist');
      }

      console.log('Enhanced PDF generated successfully:', printResult.uri);
      console.log('Enhanced PDF file size:', pdfInfo.size, 'bytes');

      return { uri: printResult.uri, success: true };
    } catch (error: any) {
      console.error('Enhanced PDF Generation Error:', error);
      console.error('Error stack:', error.stack);
      return {
        uri: '',
        success: false,
        error: error.message || 'Failed to generate Enhanced PDF'
      };
    }
  }

  /**
   * Generate and share enhanced PDF
   */
  async generateAndShareEnhancedPDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.generateEnhancedPDF(report, options);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Enhanced NSPIRE Report - ${report.metadata.inspectionNo}`,
          UTI: 'com.adobe.pdf',
        });
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Sharing is not available on this device'
        };
      }
    } catch (error: any) {
      console.error('Share Enhanced PDF Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to share Enhanced PDF'
      };
    }
  }

  /**
   * Print enhanced PDF directly
   */
  async printEnhancedPDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const html = generateEnhancedNSPIREReportHTML(report, options);
      await Print.printAsync({ html });
      return { success: true };
    } catch (error: any) {
      console.error('Print Enhanced PDF Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to print Enhanced PDF'
      };
    }
  }

  /**
   * Generate enhanced HTML preview
   */
  generateEnhancedHTMLPreview(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): string {
    return generateEnhancedNSPIREReportHTML(report, options);
  }

  /**
   * Convert inspection data to enhanced NSPIRE format
   */
  convertToEnhancedNSPIREFormat(data: any): NSPIREInspectionReport {
    const now = new Date();

    // Convert findings/deficiencies to enhanced NSPIRE format
    const deficiencies = (data.findings || data.deficiencies || []).map((item: any, index: number) => ({
      id: item.id || item._id || `DEF-${index + 1}`,
      imageUri: item.imageUrl || item.imageUri || item.photos?.[0]?.url || '',
      building: item.building || data.building || 'Building A',
      unit: item.unit || data.unit || 'Unit Multiple',
      room: item.location || item.room || item.area || 'General Area',
      area: item.subCategory || item.category || 'Inside',
      deficiencyName: item.title || item.description || item.deficiencyName || 'Unnamed Issue',
      nspireCode: item.nspireCode || this.mapCategoryToEnhancedNSPIRECode(item.category || item.area),
      deficiencyDetails: item.description || item.details || item.deficiencyDetails || 'Address or building identification codes are broken, missing, or not visible',
      comments: item.notes || item.comments || item.recommendation || 'Wait for Input',
      deductionPts: this.calculateEnhancedDeductionPoints(item.severity),
      repeatIndicator: item.repeat || false,
      severity: this.mapSeverityToEnhancedNSPIRE(item.severity) as DeficiencySeverity,
      inspectedDate: now.toLocaleDateString(),
      inspectedTime: now.toLocaleTimeString(),
      status: item.status || 'Open'
    }));

    // Calculate enhanced summary statistics
    const summary: DeficiencySummary = {
      lifeThreatening: deficiencies.filter(d => d.severity === 'Life-Threatening').length,
      severe: deficiencies.filter(d => d.severity === 'Severe').length,
      moderate: deficiencies.filter(d => d.severity === 'Moderate').length,
      low: deficiencies.filter(d => d.severity === 'Low').length,
      total: deficiencies.length,
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter(d => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter(d => !d.repeatIndicator).length
    };

    // Calculate final score
    const totalDeductions = deficiencies.reduce((sum, def) => sum + def.deductionPts, 0);
    const finalScore = Math.max(0, 100 - totalDeductions);

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),

      metadata: {
        inspectionNo: data.inspectionNo || data.inspectionId || `INSP-${Date.now().toString(36).toUpperCase()}`,
        inspectionType: data.inspectionType || 'General NSPIRE',
        escortName: data.escortName || data.property?.contactName || 'Property Manager',
        propertyAddress: data.propertyAddress || data.property?.address || 'pink avenue karachi',
        propertyName: data.propertyName || data.property?.name || 'Property Name',
        propertyId: data.propertyId || data.property?._id || 'PROP-001',
        startDate: data.startDate || now.toLocaleDateString(),
        startTime: data.startTime || '09:00 AM',
        endDate: data.endDate || now.toLocaleDateString(),
        endTime: data.endTime || now.toLocaleTimeString(),
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: data.preliminaryScore || finalScore,
        finalScore: data.finalScore || finalScore,
        calculatedScore: data.calculatedScore || finalScore,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: data.inspectorName || data.inspector?.fullName || 'Inspector',
        inspectorId: data.inspectorId || data.inspector?._id || 'INS-001'
      },

      inspectionData: [
        { type: 'Buildings', propertyTotal: data.property?.buildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Units', propertyTotal: data.property?.units || 1, sampleSize: 1, totalUnitsInspected: 1 }
      ],

      occupancyInfo: {
        totalUnits: data.property?.units || 1,
        occupiedUnits: data.property?.occupiedUnits || data.property?.units || 1,
        vacantUnits: data.property?.vacantUnits || 0,
        occupancyRate: data.property?.occupancyRate || 100
      },

      summary,
      categoryBreakdown: [],
      deficiencies,

      generalComments: data.notes || data.generalComments || '',
      recommendations: data.recommendations || [],

      certification: {
        certifiedBy: data.inspectorName || data.inspector?.fullName || 'Inspector',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.'
      }
    };
  }

  // Helper methods for enhanced mapping
  private mapCategoryToEnhancedNSPIRECode(category: string): string {
    const mapping: Record<string, string> = {
      'structural': 'BE-3',
      'electrical': 'BS-2', 
      'plumbing': 'BS-1',
      'safety': 'HS-12',
      'hvac': 'BS-5',
      'exterior': 'BE-6',
      'interior': 'U-16',
      'appliances': 'U-10',
      'site': 'S-2',
      'building': 'BE-6',
      'unit': 'U-16',
      'common': 'CA-5'
    };
    return mapping[category?.toLowerCase()] || 'HS-12';
  }

  private mapSeverityToEnhancedNSPIRE(severity: string): string {
    const mapping: Record<string, string> = {
      'critical': 'Life-Threatening',
      'life-threatening': 'Life-Threatening',
      'major': 'Severe',
      'severe': 'Severe',
      'minor': 'Moderate',
      'moderate': 'Moderate',
      'low': 'Low',
      'observation': 'Low'
    };
    return mapping[severity?.toLowerCase()] || 'Moderate'; mapping[severity?.toLowerCase()] || 'Moderate';
  }

  private calculateEnhancedDeductionPoints(severity: string): number {
    const points: Record<string, number> = {
      'critical': 10,
      'life-threatening': 10,
      'major': 6,
      'severe': 6,
      'minor': 3,
      'moderate': 3,
      'low': 1,
      'observation': 1
    };
    return points[severity?.toLowerCase()] || 3;
  }
}

// Export singleton instance
export const enhancedNspirePDFService = new EnhancedNSPIREPDFReportService();

// Export class for custom instantiation
export { EnhancedNSPIREPDFReportService, generateEnhancedNSPIREReportHTML };