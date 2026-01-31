/**
 * NSPIRE PDF Report Service
 * Generates HUD-compliant NSPIRE inspection reports in PDF format
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

const getImageExtension = (uri: string): string => {
  const cleanUri = uri.split('?')[0].split('#')[0];
  const extension = cleanUri.toLowerCase().split('.').pop();
  if (!extension || extension.length > 5) {
    return 'jpeg';
  }
  return extension;
};

/**
 * Clean up accidental JSON from text content
 */
const cleanJsonContent = (text: string): string => {
  if (!text) return '';

  // If it looks like JSON findings, try to extract the description or title
  if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.findings && Array.isArray(parsed.findings) && parsed.findings.length > 0) {
        return parsed.findings[0].description || parsed.findings[0].title || text;
      }
      if (parsed.description) return parsed.description;
      if (parsed.title) return parsed.title;
    } catch (e) {
      // Not valid JSON, but maybe contains it?
    }
  }

  // Remove common JSON-like markers if they appear at the start
  return text
    .replace(/^\{\s*"findings"\s*:\s*\[\s*\{\s*/i, '')
    .replace(/^"title"\s*:\s*"/i, '')
    .replace(/^"description"\s*:\s*"/i, '')
    .replace(/"\s*\}\s*\]\s*\}$/i, '')
    .trim();
};

const getImageMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[extension] || 'image/jpeg';
};

/**
 * Convert local image URI to base64 data URL for PDF embedding
 */
const convertImageToBase64DataUrl = async (imageUri: string): Promise<string> => {
  try {
    if (!imageUri) {
      console.warn('Empty image URI provided');
      return '';
    }

    console.log('Converting image:', imageUri.substring(0, 100) + '...');

    // If already a data URL, return as-is
    if (imageUri.startsWith('data:')) {
      console.log('Image is already a data URL');
      return imageUri;
    }

    // Handle Cloudinary URLs (remote) and other HTTP URLs
    if (imageUri.includes('cloudinary.com') || imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      console.log('Remote image detected, downloading for base64 conversion:', imageUri.substring(0, 50) + '...');

      const extension = getImageExtension(imageUri);
      const tempPath = generateTempFilename(extension);

      const downloadedUri = await downloadWithRetries(imageUri, tempPath);

      if (downloadedUri) {
        console.log('Successfully downloaded remote image, now converting to base64');
        const mimeType = getImageMimeType(extension);
        const base64 = await FileSystem.readAsStringAsync(downloadedUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Clean up temp file
        await FileSystem.deleteAsync(downloadedUri, { idempotent: true });

        if (base64) {
          return `data:${mimeType};base64,${base64}`;
        }
      }

      console.warn('Failed to download/convert remote image, falling back to original URL');
      return imageUri;
    }

    // Handle local file URIs
    console.log('Processing local image file');
    try {
      let localPath = imageUri;

      // Handle different URI formats
      if (localPath.startsWith('file://')) {
        localPath = localPath.replace('file://', '');
      }

      // Determine image type
      const extension = getImageExtension(imageUri);
      const mimeType = getImageMimeType(extension);

      console.log('Reading local file as base64...');
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!base64) {
        console.warn('Failed to read local image as base64');
        return '';
      }

      const dataUrl = `data:${mimeType};base64,${base64}`;
      console.log('Successfully converted local image to data URL', { length: dataUrl.length });
      return dataUrl;
    } catch (localError) {
      console.error('Error processing local image:', localError);
      return '';
    }
  } catch (error) {
    console.error('Error in convertImageToBase64DataUrl:', error);
    return '';
  }
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateTempFilename = (extension: string) => {
  // Use random component to avoid collisions under concurrent processing
  const rand = Math.floor(Math.random() * 1e9);
  return `${FileSystem.cacheDirectory}temp_pdf_image_${Date.now()}_${rand}.${extension}`;
};

const downloadWithRetries = async (sourceUri: string, destPath: string, attempts = 3): Promise<string | null> => {
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await FileSystem.downloadAsync(sourceUri, destPath);
      // result.uri should point to the actual file
      const fileUri = (result && (result as any).uri) || destPath;
      let info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) return fileUri;
      // Try stripping file:// scheme if present
      if (fileUri.startsWith('file://')) {
        const altPath = fileUri.replace('file://', '');
        info = await FileSystem.getInfoAsync(altPath);
        if (info.exists) return altPath;
      }
      console.warn(`Download attempt ${i + 1} completed but file not found at ${fileUri}`);
    } catch (err) {
      console.warn(`Download attempt ${i + 1} failed for ${sourceUri}:`, err);
    }
    // backoff
    await sleep(300 * (i + 1));
  }
  return null;
};

/**
 * Process all images in the report and convert to base64 data URLs
 */
const processReportImages = async (report: NSPIREInspectionReport, forceBase64: boolean = true): Promise<NSPIREInspectionReport> => {
  console.log('Processing report images...', { forceBase64 });
  // Deep clone the report to avoid mutating the original
  const processedReport = JSON.parse(JSON.stringify(report)) as NSPIREInspectionReport;

  // Process deficiency images with individual error handling
  if (processedReport.deficiencies && processedReport.deficiencies.length > 0) {
    console.log(`Processing ${processedReport.deficiencies.length} deficiency images...`);

    // Process images sequentially to avoid overwhelming the system
    for (let index = 0; index < processedReport.deficiencies.length; index++) {
      const def = processedReport.deficiencies[index];

      if (def.imageUri) {
        try {
          console.log(`Converting image ${index + 1}/${processedReport.deficiencies.length}: ${def.imageUri.substring(0, 50)}...`);

          // If remote and not forcing base64 (e.g., for preview), keep as is
          // Improved remote check and protocol enforcement
          let imageUrl = def.imageUri;
          if (imageUrl.includes('cloudinary.com') && !imageUrl.startsWith('http')) {
            imageUrl = `https:${imageUrl.startsWith('//') ? '' : '//'}${imageUrl}`;
          }

          const isRemote = imageUrl.startsWith('http') || imageUrl.startsWith('https');

          let base64DataUrl;
          if (isRemote && !forceBase64) {
            base64DataUrl = imageUrl;
            console.log(`Using remote URI directly for image ${index + 1}`);
          } else {
            // Add timeout for individual image conversion
            const conversionPromise = convertImageToBase64DataUrl(imageUrl);
            const timeoutPromise = new Promise<string>((_, reject) =>
              setTimeout(() => reject(new Error('Image conversion timeout')), 30000)
            );

            base64DataUrl = await Promise.race([conversionPromise, timeoutPromise]);
          }

          if (base64DataUrl && (base64DataUrl.startsWith('data:') || base64DataUrl.startsWith('http'))) {
            processedReport.deficiencies[index].imageUri = base64DataUrl;
            console.log(`✅ Successfully ${base64DataUrl.startsWith('http') ? 'kept remote' : 'converted'} image ${index + 1}`);
          } else {
            console.warn(`⚠️ Image ${index + 1} processing failed, removing from report`);
            processedReport.deficiencies[index].imageUri = undefined;
          }
        } catch (imageError: any) {
          console.error(`❌ Error converting image ${index + 1}:`, imageError.message);
          processedReport.deficiencies[index].imageUri = undefined;
        }
      }
    }

    const successfulImages = processedReport.deficiencies.filter(def => def.imageUri).length;
    console.log(`Image processing complete: ${successfulImages}/${processedReport.deficiencies.length} images converted successfully`);
  }

  return processedReport;
};

/**
 * Generate PDF HTML content from NSPIRE report data
 */
export const generateNSPIREReportHTML = (
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
): string => {
  const styles = generateStyles(options);

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>INSPIRE Inspection Report - ${report.metadata.inspectionNo}</title>
  <style>${styles}</style>
</head>
<body>
  ${generateHeader(report.metadata, options)}
  
  ${options.includeSummaryPage ? generateSummaryPage(report.summary, report.categoryBreakdown) : ''}
  
  ${generateInspectionDataTable(report.inspectionData)}
  
  ${generateOccupancySection(report.occupancyInfo)}
  
  ${options.includeDetailedDeficiencies ? generateDeficiencyTable(report.deficiencies, options) : ''}
  
  ${report.generalComments ? generateCommentsSection(report.generalComments) : ''}
  
  ${report.recommendations?.length ? generateRecommendationsSection(report.recommendations) : ''}
  
  ${options.includeCertification && report.certification ? generateCertificationSection(report.certification) : ''}
  
  ${generateFooter(options)}
</body>
</html>
  `;

  return html;
};

/**
 * Generate CSS Styles
 */
const generateStyles = (options: PDFGenerationOptions): string => {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1F2937;
      padding: 20px;
      background: #FFFFFF;
    }
    
    .report-container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    /* Header Styles */
    .report-header {
      border-bottom: 3px solid #0E7490;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .header-title {
      font-size: 18pt;
      font-weight: bold;
      color: #0E7490;
      text-align: center;
      margin-bottom: 5px;
    }
    
    .header-subtitle {
      font-size: 12pt;
      color: #6B7280;
      text-align: center;
      margin-bottom: 15px;
    }
    
    .header-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    
    @media screen and (max-width: 600px) {
      .header-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
    
    .header-section {
      background: #F9FAFB;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #E5E7EB;
      min-width: 0;
    }
    
    .header-section h3 {
      font-size: 9pt;
      font-weight: bold;
      color: #374151;
      margin-bottom: 6px;
      border-bottom: 1px solid #D1D5DB;
      padding-bottom: 4px;
    }
    
    .header-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 8pt;
      gap: 8px;
    }
    
    .header-label {
      color: #6B7280;
      font-weight: 500;
      flex-shrink: 0;
    }
    
    .header-value {
      color: #1F2937;
      font-weight: 600;
      text-align: right;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    
    /* Scores Section - Compact Professional Style */
    .scores-container {
      display: flex;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #0E7490 0%, #0891B2 100%);
      padding: 12px 16px;
      border-radius: 6px;
      margin: 16px 0;
    }
    
    .score-box {
      text-align: center;
      color: #FFFFFF;
      padding: 6px 16px;
      min-width: 80px;
    }
    
    .score-box:not(:last-child) {
      border-right: 1px solid rgba(255,255,255,0.3);
    }
    
    .score-label {
      font-size: 7pt;
      opacity: 0.9;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .score-value {
      font-size: 18pt;
      font-weight: bold;
      line-height: 1.1;
    }
    
    .score-threshold {
      font-size: 7pt;
      opacity: 0.8;
      margin-top: 2px;
    }
    
    /* Summary Section */
    .summary-section {
      margin: 20px 0;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #0E7490;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 2px solid #0E7490;
    }
    
    /* Professional Compact Summary Grid */
    .summary-grid {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;
    }
    
    .summary-card {
      flex: 1;
      text-align: center;
      padding: 8px 6px;
      border-radius: 4px;
      border-left: 3px solid;
      background: #FFFFFF;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .summary-card.life-threatening {
      background: #FEF2F2;
      border-color: ${SEVERITY_COLORS['Life-Threatening']};
    }
    
    .summary-card.severe {
      background: #FFFBEB;
      border-color: ${SEVERITY_COLORS['Severe']};
    }
    
    .summary-card.moderate {
      background: #EFF6FF;
      border-color: ${SEVERITY_COLORS['Moderate']};
    }
    
    .summary-card.low {
      background: #F9FAFB;
      border-color: ${SEVERITY_COLORS['Low']};
    }
    
    .summary-card.total {
      background: #F0FDF4;
      border-color: #10B981;
    }
    
    .summary-count {
      font-size: 18pt;
      font-weight: bold;
      line-height: 1.2;
    }
    
    .summary-label {
      font-size: 7pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }
    
    /* Repeat/New Deficiencies Row */
    .deficiency-counts-row {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .deficiency-count-card {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 4px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
    }
    
    .deficiency-count-value {
      font-size: 16pt;
      font-weight: bold;
      color: #0E7490;
    }
    
    .deficiency-count-label {
      font-size: 8pt;
      color: #6B7280;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
    }
    
    th {
      background: #0E7490;
      color: #FFFFFF;
      font-weight: bold;
      padding: 10px 8px;
      text-align: left;
      border: 1px solid #0E7490;
    }
    
    td {
      padding: 8px;
      border: 1px solid #E5E7EB;
      vertical-align: top;
    }
    
    tr:nth-child(even) {
      background: #F9FAFB;
    }
    
    tr:hover {
      background: #F3F4F6;
    }
    
    /* Deficiency Table Specific */
    .deficiency-table {
      margin-top: 20px;
    }
    
    .deficiency-table th {
      font-size: 8pt;
      padding: 8px 6px;
    }
    
    .deficiency-table td {
      font-size: 8pt;
      padding: 6px;
    }
    
    .deficiency-image {
      width: 100px;
      height: 75px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #D1D5DB;
      display: block;
    }
    
    .image-placeholder {
      width: 100px;
      height: 75px;
      background: #F9FAFB;
      border: 2px dashed #D1D5DB;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 7pt;
      color: #6B7280;
      text-align: center;
      padding: 4px;
    }
    
    .placeholder-icon {
      font-size: 16pt;
      margin-bottom: 2px;
      opacity: 0.5;
    }
    
    .placeholder-text {
      font-size: 6pt;
      line-height: 1.2;
    }
    
    .location-cell {
      min-width: 100px;
    }
    
    .location-item {
      margin-bottom: 2px;
    }
    
    .location-label {
      color: #6B7280;
      font-size: 7pt;
    }
    
    .location-value {
      font-weight: 600;
    }
    
    .deficiency-name {
      font-weight: bold;
      color: #1F2937;
      margin-bottom: 3px;
    }
    
    .nspire-code {
      font-size: 7pt;
      color: #0E7490;
      font-weight: 600;
      background: #E0F2FE;
      padding: 2px 5px;
      border-radius: 3px;
      display: inline-block;
    }
    
    .details-cell {
      max-width: 200px;
    }
    
    .comments-cell {
      max-width: 150px;
      font-style: italic;
      color: #4B5563;
    }
    
    .deduction-cell {
      text-align: center;
      font-weight: bold;
      color: #DC2626;
    }
    
    .repeat-yes {
      background: #FEF3C7;
      color: #92400E;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 7pt;
      font-weight: bold;
    }
    
    .repeat-no {
      background: #D1FAE5;
      color: #065F46;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 7pt;
      font-weight: bold;
    }
    
    /* Severity Badges */
    .severity-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: bold;
      text-align: center;
      display: inline-block;
    }
    
    .severity-life-threatening {
      background: ${SEVERITY_COLORS['Life-Threatening']};
      color: #FFFFFF;
    }
    
    .severity-severe {
      background: ${SEVERITY_COLORS['Severe']};
      color: #FFFFFF;
    }
    
    .severity-moderate {
      background: ${SEVERITY_COLORS['Moderate']};
      color: #FFFFFF;
    }
    
    .severity-low {
      background: ${SEVERITY_COLORS['Low']};
      color: #FFFFFF;
    }
    
    /* Category Breakdown Table */
    .category-table th,
    .category-table td {
      text-align: center;
    }
    
    .category-table td:first-child {
      text-align: left;
      font-weight: 600;
    }
    
    /* Occupancy Section */
    .occupancy-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 15px 0;
    }
    
    .occupancy-card {
      background: #F9FAFB;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #E5E7EB;
    }
    
    .occupancy-value {
      font-size: 20pt;
      font-weight: bold;
      color: #0E7490;
    }
    
    .occupancy-label {
      font-size: 9pt;
      color: #6B7280;
      margin-top: 5px;
    }
    
    /* Comments & Recommendations */
    .comments-section,
    .recommendations-section {
      background: #F9FAFB;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #0E7490;
    }
    
    .recommendations-list {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .recommendations-list li {
      margin-bottom: 8px;
    }
    
    /* Certification Section */
    .certification-section {
      margin-top: 30px;
      padding: 20px;
      border: 2px solid #0E7490;
      border-radius: 8px;
      background: #F0FDF4;
    }
    
    .certification-title {
      font-size: 12pt;
      font-weight: bold;
      color: #0E7490;
      margin-bottom: 15px;
    }
    
    .signature-line {
      border-bottom: 1px solid #1F2937;
      width: 200px;
      margin: 30px 0 5px 0;
    }
    
    .signature-label {
      font-size: 8pt;
      color: #6B7280;
    }
    
    /* Footer */
    .report-footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 8pt;
      color: #9CA3AF;
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
      
      .report-container {
        padding: 15px;
      }
    }
  `;
};

/**
 * Generate Report Header
 */
const generateHeader = (metadata: InspectionMetadata, options: PDFGenerationOptions): string => {
  return `
    <div class="report-header">
      ${options.headerLogo ? `<img src="${options.headerLogo}" alt="Logo" style="height: 50px; display: block; margin: 0 auto 10px;" />` : ''}
      
      <h1 class="header-title">INSPIRE INSPECTION REPORT</h1>
      <p class="header-subtitle">HUD National Standards for Physical Inspection of Real Estate</p>
      
      <div class="header-grid">
        <div class="header-section">
          <h3>Inspection Details</h3>
          <div class="header-row">
            <span class="header-label">Inspection No:</span>
            <span class="header-value">${metadata.inspectionNo}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Type:</span>
            <span class="header-value">${metadata.inspectionType}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Escort Name:</span>
            <span class="header-value">${metadata.escortName}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Inspector:</span>
            <span class="header-value">${metadata.inspectorName}</span>
          </div>
        </div>
        
        <div class="header-section">
          <h3>Property Information</h3>
          <div class="header-row">
            <span class="header-label">Property:</span>
            <span class="header-value">${metadata.propertyName}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Address:</span>
            <span class="header-value">${metadata.propertyAddress}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Property ID:</span>
            <span class="header-value">${metadata.propertyId}</span>
          </div>
        </div>
        
        <div class="header-section">
          <h3>Timeline</h3>
          <div class="header-row">
            <span class="header-label">Start:</span>
            <span class="header-value">${metadata.startDate} ${metadata.startTime}</span>
          </div>
          <div class="header-row">
            <span class="header-label">End:</span>
            <span class="header-value">${metadata.endDate} ${metadata.endTime}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Report Created:</span>
            <span class="header-value">${metadata.reportCreatedDate}</span>
          </div>
        </div>
        
        <div class="header-section">
          <h3>Thresholds</h3>
          <div class="header-row">
            <span class="header-label">Health & Safety:</span>
            <span class="header-value">${metadata.healthSafetyThreshold}%</span>
          </div>
          <div class="header-row">
            <span class="header-label">Physical Condition:</span>
            <span class="header-value">${metadata.physicalConditionThreshold}%</span>
          </div>
        </div>
      </div>
      
      <div class="scores-container">
        <div class="score-box">
          <div class="score-label">Preliminary Score</div>
          <div class="score-value">${metadata.preliminaryScore}</div>
        </div>
        <div class="score-box">
          <div class="score-label">Calculated Score</div>
          <div class="score-value">${metadata.calculatedScore}</div>
        </div>
        <div class="score-box">
          <div class="score-label">Final Score</div>
          <div class="score-value">${metadata.finalScore}</div>
          <div class="score-threshold">${metadata.finalScore >= 60 ? '✓ Passing' : '✗ Below Threshold'}</div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Generate Summary Page
 */
const generateSummaryPage = (summary: DeficiencySummary, categoryBreakdown: CategoryBreakdown[]): string => {
  return `
    <div class="summary-section avoid-break">
      <h2 class="section-title">Deficiency Summary</h2>
      
      <div class="summary-grid">
        <div class="summary-card life-threatening">
          <div class="summary-count" style="color: ${SEVERITY_COLORS['Life-Threatening']}">${summary.lifeThreatening}</div>
          <div class="summary-label" style="color: ${SEVERITY_COLORS['Life-Threatening']}">LIFE-THREAT</div>
        </div>
        <div class="summary-card severe">
          <div class="summary-count" style="color: ${SEVERITY_COLORS['Severe']}">${summary.severe}</div>
          <div class="summary-label" style="color: ${SEVERITY_COLORS['Severe']}">SEVERE</div>
        </div>
        <div class="summary-card moderate">
          <div class="summary-count" style="color: ${SEVERITY_COLORS['Moderate']}">${summary.moderate}</div>
          <div class="summary-label" style="color: ${SEVERITY_COLORS['Moderate']}">MODERATE</div>
        </div>
        <div class="summary-card low">
          <div class="summary-count" style="color: ${SEVERITY_COLORS['Low']}">${summary.low}</div>
          <div class="summary-label" style="color: ${SEVERITY_COLORS['Low']}">LOW</div>
        </div>
        <div class="summary-card total">
          <div class="summary-count" style="color: #10B981">${summary.total}</div>
          <div class="summary-label" style="color: #10B981">TOTAL</div>
        </div>
      </div>
      
      <div class="deficiency-counts-row">
        <div class="deficiency-count-card">
          <div class="deficiency-count-value" style="color: #92400E;">${summary.repeatDeficiencies}</div>
          <div class="deficiency-count-label">Repeat Deficiencies</div>
        </div>
        <div class="deficiency-count-card">
          <div class="deficiency-count-value" style="color: #1E40AF;">${summary.newDeficiencies}</div>
          <div class="deficiency-count-label">New Deficiencies</div>
        </div>
      </div>
      
      ${categoryBreakdown.length > 0 ? `
        <h3 style="font-size: 10pt; margin-top: 16px; margin-bottom: 8px; color: #374151; font-weight: 600;">Breakdown by Category</h3>
        <table class="category-table" style="font-size: 8pt;">
          <thead>
            <tr>
              <th style="padding: 6px 8px;">Category</th>
              <th style="padding: 6px 8px;">NSPIRE Section</th>
              <th style="padding: 6px 4px;">Count</th>
              <th style="padding: 6px 4px;">LT</th>
              <th style="padding: 6px 4px;">Severe</th>
              <th style="padding: 6px 4px;">Moderate</th>
              <th style="padding: 6px 4px;">Low</th>
              <th style="padding: 6px 4px;">Total Pts</th>
            </tr>
          </thead>
          <tbody>
            ${categoryBreakdown.map(cat => `
              <tr>
                <td style="padding: 6px 8px;">${cat.category}</td>
                <td style="padding: 6px 8px;">${cat.nspireSection}</td>
                <td style="padding: 6px 4px; text-align: center;">${cat.deficiencyCount}</td>
                <td style="padding: 6px 4px; text-align: center; color: ${SEVERITY_COLORS['Life-Threatening']}; font-weight: 600;">${cat.lifeThreatening}</td>
                <td style="padding: 6px 4px; text-align: center; color: ${SEVERITY_COLORS['Severe']}; font-weight: 600;">${cat.severe}</td>
                <td style="padding: 6px 4px; text-align: center; color: ${SEVERITY_COLORS['Moderate']}; font-weight: 600;">${cat.moderate}</td>
                <td style="padding: 6px 4px; text-align: center; color: ${SEVERITY_COLORS['Low']}; font-weight: 600;">${cat.low}</td>
                <td style="padding: 6px 4px; text-align: center; font-weight: 600;">${cat.totalDeductions}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    </div>
  `;
};

/**
 * Generate Inspection Data Table
 */
const generateInspectionDataTable = (inspectionData: InspectionDataRow[]): string => {
  return `
    <div class="summary-section avoid-break">
      <h2 class="section-title">Building/Unit Inspection Data</h2>
      <table style="font-size: 9pt;">
        <thead>
          <tr>
            <th style="padding: 8px 10px;">Type</th>
            <th style="padding: 8px 10px;">Property Total</th>
            <th style="padding: 8px 10px;">Sample Size</th>
            <th style="padding: 8px 10px;">Total Units Inspected</th>
          </tr>
        </thead>
        <tbody>
          ${inspectionData.map(row => `
            <tr>
              <td style="padding: 8px 10px;"><strong>${row.type}</strong></td>
              <td style="padding: 8px 10px; text-align: center;">${row.propertyTotal}</td>
              <td style="padding: 8px 10px; text-align: center;">${row.sampleSize}</td>
              <td style="padding: 8px 10px; text-align: center;">${row.totalUnitsInspected}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Generate Occupancy Section
 */
const generateOccupancySection = (occupancy: OccupancyInfo): string => {
  return `
    <div class="summary-section avoid-break">
      <h2 class="section-title">Occupancy Information</h2>
      <div class="occupancy-grid">
        <div class="occupancy-card">
          <div class="occupancy-value">${occupancy.totalUnits}</div>
          <div class="occupancy-label">Total Units</div>
        </div>
        <div class="occupancy-card">
          <div class="occupancy-value">${occupancy.occupiedUnits}</div>
          <div class="occupancy-label">Occupied Units</div>
        </div>
        <div class="occupancy-card">
          <div class="occupancy-value">${occupancy.vacantUnits}</div>
          <div class="occupancy-label">Vacant Units</div>
        </div>
        <div class="occupancy-card">
          <div class="occupancy-value">${occupancy.occupancyRate.toFixed(1)}%</div>
          <div class="occupancy-label">Occupancy Rate</div>
        </div>
        ${occupancy.assistedUnits !== undefined ? `
          <div class="occupancy-card">
            <div class="occupancy-value">${occupancy.assistedUnits}</div>
            <div class="occupancy-label">Assisted Units</div>
          </div>
        ` : ''}
        ${occupancy.marketRateUnits !== undefined ? `
          <div class="occupancy-card">
            <div class="occupancy-value">${occupancy.marketRateUnits}</div>
            <div class="occupancy-label">Market Rate Units</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

/**
 * Generate Severity Badge HTML
 */
const getSeverityBadge = (severity: DeficiencySeverity): string => {
  const classMap: Record<DeficiencySeverity, string> = {
    'Life-Threatening': 'severity-life-threatening',
    'Severe': 'severity-severe',
    'Moderate': 'severity-moderate',
    'Low': 'severity-low',
  };
  return `<span class="severity-badge ${classMap[severity]}">${severity}</span>`;
};

/**
 * Generate Deficiency Detailed Report Table
 */
const generateDeficiencyTable = (deficiencies: DeficiencyEntry[], options: PDFGenerationOptions): string => {
  if (deficiencies.length === 0) {
    return `
      <div class="summary-section">
        <h2 class="section-title">Deficiency Detailed Report</h2>
        <p style="text-align: center; padding: 40px; color: #10B981; font-size: 14pt;">
          ✓ No deficiencies found during this inspection
        </p>
      </div>
    `;
  }

  return `
    <div class="summary-section">
      <h2 class="section-title">Deficiency Detailed Report</h2>
      <table class="deficiency-table">
        <thead>
          <tr>
            <th style="width: 110px;">Deficiency Picture</th>
            <th style="width: 100px;">Location</th>
            <th style="width: 130px;">Deficiency Name</th>
            <th style="width: 180px;">Deficiency Details</th>
            <th style="width: 140px;">Comments</th>
            <th style="width: 55px;">Deduction Pts</th>
            <th style="width: 50px;">Repeat</th>
            <th style="width: 90px;">Severity</th>
          </tr>
        </thead>
        <tbody>
          ${deficiencies.map(def => `
            <tr class="avoid-break">
              <td>
                ${options.includeImages && def.imageUri
      ? (def.imageUri.startsWith('data:') || def.imageUri.startsWith('http'))
        ? `<img src="${def.imageUri}" alt="Deficiency Image" class="deficiency-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                         <div class="image-placeholder" style="display: none;">
                           <div class="placeholder-icon">📷</div>
                           <div class="placeholder-text">Image Failed to Load</div>
                         </div>`
        : `<div class="image-placeholder">
                           <div class="placeholder-icon">📷</div>
                           <div class="placeholder-text">Image Processing Failed</div>
                         </div>`
      : `<div class="image-placeholder">
                       <div class="placeholder-icon">📷</div>
                       <div class="placeholder-text">No Image Available</div>
                     </div>`
    }
              </td>
              <td class="location-cell">
                <div class="location-item">
                  <span class="location-label">Building:</span>
                  <span class="location-value">${def.building}</span>
                </div>
                <div class="location-item">
                  <span class="location-label">Unit:</span>
                  <span class="location-value">${def.unit}</span>
                </div>
                <div class="location-item">
                  <span class="location-label">Room:</span>
                  <span class="location-value">${def.room}</span>
                </div>
                <div class="location-item">
                  <span class="location-label">Area:</span>
                  <span class="location-value">${def.area}</span>
                </div>
              </td>
              <td>
                <div class="deficiency-name">${def.deficiencyName}</div>
                <span class="nspire-code">${def.nspireCode}</span>
              </td>
              <td class="details-cell">${cleanJsonContent(def.deficiencyDetails)}</td>
              <td class="comments-cell">${def.comments || '-'}</td>
              <td class="deduction-cell">-${def.deductionPts}</td>
              <td style="text-align: center;">
                <span class="${def.repeatIndicator ? 'repeat-yes' : 'repeat-no'}">
                  ${def.repeatIndicator ? 'YES' : 'NO'}
                </span>
              </td>
              <td>${getSeverityBadge(def.severity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Generate Comments Section
 */
const generateCommentsSection = (comments: string): string => {
  return `
    <div class="comments-section avoid-break">
      <h2 class="section-title">General Comments</h2>
      <p style="white-space: pre-wrap;">${comments}</p>
    </div>
  `;
};

/**
 * Generate Recommendations Section
 */
const generateRecommendationsSection = (recommendations: string[]): string => {
  return `
    <div class="recommendations-section avoid-break">
      <h2 class="section-title">Recommendations</h2>
      <ol class="recommendations-list">
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ol>
    </div>
  `;
};

/**
 * Generate Certification Section
 */
const generateCertificationSection = (certification: any): string => {
  return `
    <div class="certification-section avoid-break">
      <h3 class="certification-title">Certification Statement</h3>
      <p style="margin-bottom: 15px;">${certification.certificationStatement}</p>
      
      <div style="display: flex; justify-content: space-between; margin-top: 30px;">
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Inspector Signature</div>
          <div style="font-size: 9pt; margin-top: 5px;"><strong>${certification.certifiedBy}</strong></div>
        </div>
        <div>
          <div class="signature-line"></div>
          <div class="signature-label">Date</div>
          <div style="font-size: 9pt; margin-top: 5px;"><strong>${certification.certificationDate}</strong></div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Generate Footer
 */
const generateFooter = (options: PDFGenerationOptions): string => {
  return `
    <div class="report-footer">
      <p>${options.footerText || 'Generated by INSPIRE Inspection System'}</p>
      <p>Report generated on ${new Date().toLocaleString()}</p>
      <p style="margin-top: 5px;">This report is confidential and intended for authorized personnel only.</p>
    </div>
  `;
};

/**
 * PDF Report Service Class
 */
class NSPIREPDFReportService {
  /**
   * Generate PDF from NSPIRE report data
   */
  async generatePDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ uri: string; success: boolean; error?: string }> {
    try {
      console.log('Starting PDF generation...');
      console.log('Report data:', {
        deficiencies: report.deficiencies?.length || 0,
        metadata: report.metadata?.inspectionNo || 'Unknown',
        includeImages: options.includeImages
      });

      let processedReport = report;

      if (options.includeImages) {
        console.log('Processing images for PDF...');
        try {
          // Process images with timeout to prevent hanging
          const imageProcessingPromise = processReportImages(report);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
              console.error('Image processing timeout reached (60s)');
              reject(new Error('Image conversion timeout'));
            }, 60000)
          );

          processedReport = await Promise.race([imageProcessingPromise, timeoutPromise]) as NSPIREInspectionReport;
          console.log('Images processed successfully');
        } catch (imageError) {
          console.warn('Image processing failed, generating PDF without images:', imageError);
          // Create a version without images
          processedReport = {
            ...report,
            deficiencies: report.deficiencies.map(def => ({
              ...def,
              imageUri: undefined
            }))
          };
        }
      }

      console.log('Generating HTML...');
      const html = generateNSPIREReportHTML(processedReport, options);

      // Validate HTML is not empty
      if (!html || html.trim().length < 100) {
        throw new Error('Generated HTML is empty or too short');
      }

      console.log('HTML generated successfully, length:', html.length);

      console.log('Converting HTML to PDF...');
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
        throw new Error('PDF generation returned empty URI');
      }

      // Check if PDF file exists
      const pdfInfo = await FileSystem.getInfoAsync(printResult.uri);
      if (!pdfInfo.exists) {
        throw new Error('Generated PDF file does not exist');
      }

      console.log('PDF generated successfully:', printResult.uri);
      console.log('PDF file size:', pdfInfo.size, 'bytes');

      return { uri: printResult.uri, success: true };
    } catch (error: any) {
      console.error('PDF Generation Error:', error);
      console.error('Error stack:', error.stack);
      return {
        uri: '',
        success: false,
        error: error.message || 'Failed to generate PDF'
      };
    }
  }

  /**
   * Generate a simple test PDF to verify PDF generation works
   */
  async generateTestPDF(): Promise<{ uri: string; success: boolean; error?: string }> {
    try {
      console.log('Generating test PDF...');

      const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test PDF</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background: white;
    }
    .header { 
      color: #0E7490; 
      font-size: 24px; 
      margin-bottom: 20px; 
    }
    .content { 
      font-size: 14px; 
      line-height: 1.5; 
    }
  </style>
</head>
<body>
  <div class="header">INSPIRE Test Report</div>
  <div class="content">
    <p>This is a test PDF to verify PDF generation is working correctly.</p>
    <p>Generated at: ${new Date().toLocaleString()}</p>
    <p>If you can see this content, PDF generation is working.</p>
  </div>
</body>
</html>`;

      const { uri } = await Print.printToFileAsync({
        html: testHTML,
        base64: false,
      });

      console.log('Test PDF generated successfully:', uri);
      return { uri, success: true };
    } catch (error: any) {
      console.error('Test PDF Generation Error:', error);
      return {
        uri: '',
        success: false,
        error: error.message || 'Failed to generate test PDF'
      };
    }
  }

  /**
   * Generate and share PDF
   */
  async generateAndSharePDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.generatePDF(report, options);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: `INSPIRE Report - ${report.metadata.inspectionNo}`,
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
      console.error('Share PDF Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to share PDF'
      };
    }
  }

  /**
   * Save PDF to device
   */
  async savePDFToDevice(
    report: NSPIREInspectionReport,
    filename: string,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ uri: string; success: boolean; error?: string }> {
    try {
      const result = await this.generatePDF(report, options);

      if (!result.success) {
        throw new Error(result.error);
      }

      const destinationUri = `${FileSystem.documentDirectory}${filename}.pdf`;

      await FileSystem.moveAsync({
        from: result.uri,
        to: destinationUri,
      });

      return { uri: destinationUri, success: true };
    } catch (error: any) {
      console.error('Save PDF Error:', error);
      return {
        uri: '',
        success: false,
        error: error.message || 'Failed to save PDF'
      };
    }
  }

  /**
   * Print PDF directly
   */
  async printPDF(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Process images to convert local URIs to base64 data URLs
      const processedReport = options.includeImages
        ? await processReportImages(report)
        : report;

      const html = generateNSPIREReportHTML(processedReport, options);

      await Print.printAsync({ html });

      return { success: true };
    } catch (error: any) {
      console.error('Print PDF Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to print PDF'
      };
    }
  }

  /**
   * Generate HTML preview (synchronous - images may not display correctly)
   */
  generateHTMLPreview(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): string {
    return generateNSPIREReportHTML(report, options);
  }

  /**
   * Generate HTML preview with processed images (async)
   */
  async generateHTMLPreviewAsync(
    report: NSPIREInspectionReport,
    options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS
  ): Promise<string> {
    // Process images to convert local URIs to base64 data URLs
    // For preview, we don't force base64 for remote images (Cloudinary)
    const processedReport = options.includeImages
      ? await processReportImages(report, false)
      : report;

    return generateNSPIREReportHTML(processedReport, options);
  }

  /**
   * Create sample/mock report for testing
   */
  createSampleReport(): NSPIREInspectionReport {
    const now = new Date();

    return {
      reportId: `RPT-${Date.now()}`,
      version: '1.0',
      generatedAt: now.toISOString(),

      metadata: {
        inspectionNo: `INSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        inspectionType: 'General NSPIRE',
        escortName: 'John Property Manager',
        propertyAddress: '123 Main Street, Anytown, ST 12345',
        propertyName: 'Sunset Gardens Apartments',
        propertyId: 'PROP-001234',
        startDate: now.toLocaleDateString(),
        startTime: '09:00 AM',
        endDate: now.toLocaleDateString(),
        endTime: '04:30 PM',
        reportCreatedDate: now.toLocaleDateString(),
        preliminaryScore: 78,
        finalScore: 75,
        calculatedScore: 76,
        healthSafetyThreshold: 60,
        physicalConditionThreshold: 60,
        inspectorName: 'Inspector Smith',
        inspectorId: 'INS-00567',
      },

      inspectionData: [
        { type: 'Building', propertyTotal: 5, sampleSize: 3, totalUnitsInspected: 3 },
        { type: 'Unit', propertyTotal: 100, sampleSize: 23, totalUnitsInspected: 23 },
        { type: 'Site', propertyTotal: 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Common Area', propertyTotal: 8, sampleSize: 8, totalUnitsInspected: 8 },
      ],

      occupancyInfo: {
        totalUnits: 100,
        occupiedUnits: 94,
        vacantUnits: 6,
        occupancyRate: 94,
        assistedUnits: 75,
        marketRateUnits: 25,
      },

      summary: {
        lifeThreatening: 1,
        severe: 3,
        moderate: 8,
        low: 12,
        total: 24,
        byBuilding: { 'A': 8, 'B': 10, 'C': 6 },
        byCategory: { 'Electrical': 5, 'Plumbing': 7, 'Structural': 4, 'Safety': 8 },
        repeatDeficiencies: 5,
        newDeficiencies: 19,
      },

      categoryBreakdown: [
        { category: 'Electrical System', nspireSection: 'BS-2', deficiencyCount: 5, totalDeductions: 15, lifeThreatening: 1, severe: 1, moderate: 2, low: 1 },
        { category: 'Plumbing', nspireSection: 'BS-1/BS-6', deficiencyCount: 7, totalDeductions: 12, lifeThreatening: 0, severe: 1, moderate: 3, low: 3 },
        { category: 'Structural', nspireSection: 'BE-3/BE-6', deficiencyCount: 4, totalDeductions: 8, lifeThreatening: 0, severe: 0, moderate: 2, low: 2 },
        { category: 'Safety/Fire', nspireSection: 'BS-4/HS', deficiencyCount: 8, totalDeductions: 20, lifeThreatening: 0, severe: 1, moderate: 1, low: 6 },
      ],

      deficiencies: [
        {
          id: '1',
          imageUri: '',
          imagePlaceholder: true,
          building: 'A',
          unit: '101',
          room: 'Kitchen',
          area: 'Ceiling',
          deficiencyName: 'Exposed Electrical Wiring',
          nspireCode: 'HS-4',
          deficiencyDetails: 'Exposed electrical wiring near water source creating potential shock hazard. Wires are not properly secured and insulation is damaged.',
          comments: 'Immediate attention required. Tenant has been notified.',
          deductionPts: 10,
          repeatIndicator: false,
          severity: 'Life-Threatening',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '10:15 AM',
          inspectorId: 'INS-00567',
          correctiveAction: 'Rewire and install proper junction box',
          dueDate: '2026-01-25',
          status: 'Open',
        },
        {
          id: '2',
          imageUri: '',
          imagePlaceholder: true,
          building: 'B',
          unit: '205',
          room: 'Bathroom',
          area: 'Floor',
          deficiencyName: 'Water Leak - Active',
          nspireCode: 'BS-1',
          deficiencyDetails: 'Active water leak from supply line under bathroom sink. Water damage visible on cabinet floor.',
          comments: 'Maintenance called during inspection.',
          deductionPts: 6,
          repeatIndicator: true,
          previousInspectionDate: '2025-06-15',
          severity: 'Severe',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '11:30 AM',
          inspectorId: 'INS-00567',
          correctiveAction: 'Replace supply line and repair cabinet',
          status: 'In Progress',
        },
        {
          id: '3',
          imageUri: '',
          imagePlaceholder: true,
          building: 'A',
          unit: '103',
          room: 'Living Room',
          area: 'Window',
          deficiencyName: 'Inoperable Window',
          nspireCode: 'U-17',
          deficiencyDetails: 'Window does not open properly. Mechanism is jammed and poses egress concern.',
          comments: 'Secondary egress blocked.',
          deductionPts: 4,
          repeatIndicator: false,
          severity: 'Moderate',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '01:45 PM',
          inspectorId: 'INS-00567',
          status: 'Open',
        },
        {
          id: '4',
          imageUri: '',
          imagePlaceholder: true,
          building: 'C',
          unit: 'Common',
          room: 'Hallway',
          area: 'Lighting',
          deficiencyName: 'Missing Light Fixture',
          nspireCode: 'CA-5',
          deficiencyDetails: 'Light fixture missing in 2nd floor hallway. Area has reduced illumination.',
          comments: 'Bulb holder present but fixture cover missing.',
          deductionPts: 2,
          repeatIndicator: true,
          previousInspectionDate: '2025-06-15',
          severity: 'Low',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '02:30 PM',
          inspectorId: 'INS-00567',
          status: 'Open',
        },
        {
          id: '5',
          imageUri: '',
          imagePlaceholder: true,
          building: 'B',
          unit: '310',
          room: 'Kitchen',
          area: 'Appliance',
          deficiencyName: 'Infestation - Insects',
          nspireCode: 'HS-15',
          deficiencyDetails: 'Evidence of cockroach infestation observed near kitchen cabinets. Droppings and live insects found.',
          comments: 'Pest control recommended for entire building.',
          deductionPts: 5,
          repeatIndicator: false,
          severity: 'Severe',
          inspectedDate: now.toLocaleDateString(),
          inspectedTime: '03:15 PM',
          inspectorId: 'INS-00567',
          correctiveAction: 'Professional pest control treatment',
          status: 'Open',
        },
      ],

      generalComments: 'Overall, the property is in fair condition with some areas requiring immediate attention. The management has been cooperative during the inspection process. Building A electrical systems need comprehensive review. Building B plumbing shows signs of aging infrastructure.',

      recommendations: [
        'Address all Life-Threatening deficiencies within 24 hours',
        'Schedule professional electrical inspection for Building A',
        'Implement comprehensive pest control program across all buildings',
        'Review and update preventive maintenance schedule for plumbing systems',
        'Install additional lighting in common areas to meet illumination standards',
      ],

      certification: {
        certifiedBy: 'Inspector Smith',
        certificationDate: now.toLocaleDateString(),
        certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.',
      },
    };
  }
}

// Export singleton instance
export const nspirePDFService = new NSPIREPDFReportService();

// Export class for custom instantiation
export { NSPIREPDFReportService };
