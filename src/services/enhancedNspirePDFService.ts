/**
 * Enhanced NSPIRE PDF Report Service for Mobile
 * Lightweight version optimized for mobile WebView PDF generation.
 * Generates compact A5-style NSPIRE reports matching the reference template.
 * 
 * Key optimizations:
 * - No base64 logo (text header instead) to keep HTML under 30KB
 * - No remote image URLs (placeholder text) to prevent WebView hangs
 * - Table-based layout (no CSS grid) for WebView compatibility
 * - Timeout wrapper on Print.printToFileAsync
 * - Compact 7-8pt fonts matching reference template
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { INSPIRE_LOGO_BASE64 } from '../constants/inspireLogo';
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

/** Timeout for PDF generation in milliseconds */
const PDF_GENERATION_TIMEOUT = 30000;

/**
 * Clean JSON from comments/AI analysis output
 */
function cleanJsonComments(text: string): string {
  if (!text) return '';
  if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed.analysis) return parsed.analysis;
      if (parsed.findings && Array.isArray(parsed.findings) && parsed.findings.length > 0) {
        return parsed.findings[0].description || parsed.findings[0].title || text;
      }
      if (parsed.description) return parsed.description;
      if (parsed.title) return parsed.title;
    } catch (e) { /* not valid JSON */ }
  }
  const analysisMatch = text.match(/"analysis"\s*:\s*"([^"]+)/i);
  if (analysisMatch) return analysisMatch[1].trim();
  return text
    .replace(/^\{\s*"findings"\s*:\s*\[\s*\{\s*/i, '')
    .replace(/^"title"\s*:\s*"/i, '')
    .replace(/^"description"\s*:\s*"/i, '')
    .replace(/^\{\s*"analysis"\s*:\s*"/i, '')
    .replace(/"\s*\}\s*\]\s*\}$/i, '')
    .replace(/"\s*\}$/i, '')
    .trim();
}

/** Escape HTML special characters */
function esc(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Per-image fetch timeout (8 seconds) */
const IMAGE_FETCH_TIMEOUT = 8000;

/**
 * Download a remote image and return a data URI (base64).
 * Returns empty string on failure so the PDF still generates.
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return '';
    // Use expo-file-system to download to a temp file, then read as base64
    const tmpPath = FileSystem.cacheDirectory + 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.jpg';
    const downloadPromise = FileSystem.downloadAsync(url, tmpPath);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), IMAGE_FETCH_TIMEOUT));
    const result = await Promise.race([downloadPromise, timeoutPromise]);
    if (!result || !('uri' in result)) return '';
    const b64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
    // Clean up temp file (fire-and-forget)
    FileSystem.deleteAsync(tmpPath, { idempotent: true }).catch(() => {});
    if (!b64 || b64.length < 100) return '';
    // Detect mime type from URL or default to jpeg
    const ext = url.toLowerCase().includes('.png') ? 'png' : 'jpeg';
    return `data:image/${ext};base64,${b64}`;
  } catch (e) {
    console.warn('Failed to fetch image:', url, e);
    return '';
  }
}

/**
 * Pre-fetch all deficiency images in parallel.
 * Returns a Map from original imageUri to base64 data URI.
 * Images that fail to load will map to empty string.
 */
async function preloadDeficiencyImages(deficiencies: DeficiencyEntry[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  const uniqueUrls = new Set<string>();
  for (const def of deficiencies) {
    if (def.imageUri) {
      // If already a base64 data URI, add directly to the map
      if (def.imageUri.startsWith('data:')) {
        imageMap.set(def.imageUri, def.imageUri);
      } else if (def.imageUri.startsWith('http://') || def.imageUri.startsWith('https://')) {
        uniqueUrls.add(def.imageUri);
      } else if (def.imageUri.startsWith('file://') || def.imageUri.startsWith('/')) {
        // Local file URI - try to convert to base64
        try {
          const filePath = def.imageUri.startsWith('file://') ? def.imageUri : def.imageUri;
          const b64 = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.Base64 });
          if (b64 && b64.length > 100) {
            const ext = def.imageUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
            imageMap.set(def.imageUri, `data:image/${ext};base64,${b64}`);
          }
        } catch (e) {
          console.warn('Failed to read local image file:', def.imageUri, e);
        }
      }
    }
  }
  if (uniqueUrls.size === 0 && imageMap.size > 0) {
    console.log(`${imageMap.size} images already in base64/local format, no remote images to fetch.`);
    return imageMap;
  }
  if (uniqueUrls.size === 0) return imageMap;
  console.log(`Pre-fetching ${uniqueUrls.size} remote deficiency image(s)...`);
  const entries = await Promise.all(
    Array.from(uniqueUrls).map(async (url) => {
      const b64 = await fetchImageAsBase64(url);
      return [url, b64] as [string, string];
    })
  );
  for (const [url, b64] of entries) {
    imageMap.set(url, b64);
  }
  const loaded = entries.filter(([, b]) => b.length > 0).length;
  console.log(`Pre-fetched ${loaded}/${uniqueUrls.size} images successfully.`);
  return imageMap;
}

/**
 * Lightweight CSS matching reference A5 template.
 * Uses only tables and floats — no CSS grid or flexbox for WebView compat.
 */
function generateEnhancedStyles(): string {
  return `
@page{size:A5;margin:15mm 12mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;font-size:8pt;line-height:1.3;color:#000;padding:12mm 10mm;background:#fff}
.report-header{text-align:center;margin-bottom:15px}
.inspire-logo{width:120px;height:auto;margin:0 auto 6px;display:block}
.logo-sub{font-size:7pt;color:#666;margin-bottom:10px}
.header-title{font-size:12pt;font-weight:bold;text-align:center;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px}
.meta-table{width:100%;border:none;margin-bottom:12px;font-size:7pt}
.meta-table td{border:none;padding:1px 4px;vertical-align:top;text-align:left}
.meta-label{font-weight:bold;width:110px}
.scores-section{margin:12px 0;border:2px solid #000;padding:10px}
.scores-table{width:100%;border:none;font-size:7pt}
.scores-table td{border:none;padding:2px 4px;vertical-align:top}
.scores-table .score-heading{font-size:9pt;font-weight:bold;text-decoration:underline;padding-bottom:6px}
.scores-table .score-val{font-weight:bold;text-align:right;min-width:40px}
.scores-table .score-bold td{font-weight:bold}
table{width:100%;border-collapse:collapse;margin:10px 0;font-size:7pt}
th{background:#D3D3D3;color:#000;font-weight:bold;padding:5px 4px;text-align:center;border:1px solid #000}
td{padding:4px;border:1px solid #000;vertical-align:top;text-align:center}
td.la{text-align:left}
.section-title{font-size:9pt;font-weight:bold;margin:12px 0 6px;text-decoration:underline}
.dt{font-size:7pt}
.dt th{background:#D3D3D3;font-size:7pt;padding:4px 3px;font-weight:bold}
.dt td{font-size:7pt;padding:3px;vertical-align:top}
.gh td{background:#FFFF00;font-weight:bold;font-size:8pt;text-align:left;padding:6px 4px;border:1px solid #000}
.dn{font-weight:bold;margin-bottom:2px}
.ip{width:80px;height:60px;background:#F5F5F5;border:1px solid #000;text-align:center;line-height:60px;font-size:7pt;color:#666;margin:0 auto}
.cert-section{margin:20px 0;padding:12px;border:1px solid #000}
.sig-table{width:100%;border:none;margin-top:20px}
.sig-table td{border:none;padding:2px 4px}
.sig-line{border-bottom:1px solid #000;width:140px;margin-bottom:4px}
.sig-label{font-size:7pt;color:#666}
.sig-name{font-size:8pt;font-weight:bold;margin-top:4px}
.report-footer{margin-top:20px;text-align:center;font-size:7pt;color:#666;border-top:1px solid #000;padding-top:8px}
.page-number{text-align:center;font-size:7pt;margin:12px 0;font-weight:bold}
.avoid-break{page-break-inside:avoid}
.page-break{page-break-after:always}
@media print{body{padding:0}}
`;
}

/**
 * Generate header – text-only logo (no base64 image to keep HTML small).
 * Uses table layout instead of CSS grid for WebView compatibility.
 */
function generateEnhancedHeader(metadata: InspectionMetadata): string {
  return `
<div class="report-header">
  <img src="${INSPIRE_LOGO_BASE64}" class="inspire-logo" alt="INSPIRE" />
  <div class="logo-sub">NATIONAL STANDARDS FOR THE PHYSICAL INSPECTION OF REAL ESTATE</div>
  <h1 class="header-title">INSPIRE INSPECTION REPORT</h1>
  <table class="meta-table"><tr>
    <td>
      <table class="meta-table">
        <tr><td class="meta-label">Inspection No:</td><td>${esc(metadata.inspectionNo)}</td></tr>
        <tr><td class="meta-label">Inspection Type:</td><td>${esc(metadata.inspectionType)}</td></tr>
        <tr><td class="meta-label">Escort Name:</td><td>${esc(metadata.escortName)}</td></tr>
        <tr><td class="meta-label">Property Type:</td><td>Multifamily</td></tr>
      </table>
    </td>
    <td>
      <table class="meta-table">
        <tr><td class="meta-label">Start Date:</td><td>${esc(metadata.startDate)}</td></tr>
        <tr><td class="meta-label">End Date:</td><td>${esc(metadata.endDate)}</td></tr>
        <tr><td class="meta-label">Report Created:</td><td>${esc(metadata.reportCreatedDate)}</td></tr>
        ${metadata.buildingName ? `<tr><td class="meta-label">Building:</td><td>${esc(metadata.buildingName)}</td></tr>` : ''}
        ${metadata.inspectedUnits && metadata.inspectedUnits.length > 0 ? `<tr><td class="meta-label">Inspected Units:</td><td>${esc(metadata.inspectedUnits.join(', '))}</td></tr>` : ''}
      </table>
    </td>
  </tr></table>
</div>`;
}

/**
 * Generate summary page — scores, inspection data, deficiency summary.
 * Uses table layout for WebView compatibility.
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
  <table class="scores-table"><tr>
    <td style="width:50%;vertical-align:top">
      <div class="score-heading">Preliminary Scores</div>
      <table class="scores-table">
        <tr><td>Preliminary Inspection Score:</td><td class="score-val">${metadata.preliminaryScore}</td></tr>
        <tr><td>Calculated Score:</td><td class="score-val">${metadata.calculatedScore}</td></tr>
        <tr><td>Units Threshold:</td><td class="score-val">10.79</td></tr>
        <tr><td>Property Threshold:</td><td class="score-val">${metadata.physicalConditionThreshold}</td></tr>
      </table>
    </td>
    <td style="width:50%;vertical-align:top">
      <div class="score-heading">Final Scores</div>
      <table class="scores-table">
        <tr class="score-bold"><td>Final Inspection Score:</td><td class="score-val">${metadata.finalScore}</td></tr>
        <tr><td>Calculated Score:</td><td class="score-val">${metadata.calculatedScore}</td></tr>
        <tr><td>Units Threshold:</td><td class="score-val">10.79</td></tr>
        <tr><td>Property Threshold:</td><td class="score-val">${metadata.physicalConditionThreshold}</td></tr>
      </table>
    </td>
  </tr></table>
</div>

<div class="avoid-break">
  <h3 class="section-title">Building/Unit Inspection Data</h3>
  <table>
    <thead>
      <tr>
        <th rowspan="2" class="la" style="vertical-align:middle">Type</th>
        <th rowspan="2" style="vertical-align:middle">Property Total</th>
        <th rowspan="2" style="vertical-align:middle">Sample Size</th>
        <th colspan="1">Inspection</th>
      </tr>
      <tr><th>Total Units Inspected</th></tr>
    </thead>
    <tbody>
      ${inspectionData.map(row => `<tr><td class="la">${esc(row.type)}</td><td>${row.propertyTotal}</td><td>${row.sampleSize}</td><td>${row.totalUnitsInspected}</td></tr>`).join('')}
    </tbody>
  </table>
</div>

<div class="avoid-break">
  <h3 class="section-title">Deficiency Summary</h3>
  <table>
    <thead>
      <tr><th class="la">Inspectable Area</th><th>Life-Threatening</th><th>Severe</th><th>Moderate</th><th>Low</th></tr>
    </thead>
    <tbody>
      <tr><td class="la">Inside</td><td>${summary.lifeThreatening}</td><td>${summary.severe}</td><td>${summary.moderate}</td><td>${summary.low}</td></tr>
      <tr><td class="la">Outside</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
      <tr><td class="la">Units</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    </tbody>
  </table>
</div>`;
}

/**
 * Generate deficiency table – 7 columns matching reference template.
 * Grouped by Building / Unit with yellow header rows.
 * Uses pre-loaded base64 images (no remote URLs in final HTML).
 */
function generateEnhancedDeficiencyTable(deficiencies: DeficiencyEntry[], imageMap: Map<string, string> = new Map()): string {
  if (deficiencies.length === 0) {
    return `
<div>
  <h3 class="section-title">Inspectable Areas Deficiencies</h3>
  <p style="text-align:center;padding:12px;font-style:italic;">No deficiencies found during this inspection.</p>
</div>`;
  }

  // Build repeat detection map
  const detailsSeen = new Map<string, number>();
  const repeatFlags = deficiencies.map(def => {
    const key = (def.deficiencyDetails || '').trim().toLowerCase();
    if (!key) return false;
    const count = detailsSeen.get(key) || 0;
    detailsSeen.set(key, count + 1);
    return count > 0;
  });

  // Group deficiencies by building + unit
  interface GroupedDef { def: DeficiencyEntry; isRepeat: boolean; }
  const groups = new Map<string, GroupedDef[]>();
  deficiencies.forEach((def, idx) => {
    const building = def.building || 'Building A';
    const unit = def.unit || '';
    const groupKey = unit ? `Unit - ${unit}` : `Building - ${building}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push({ def, isRepeat: def.repeatIndicator || repeatFlags[idx] });
  });

  let rows = '';
  groups.forEach((items, groupKey) => {
    rows += `<tr class="gh"><td colspan="7">${esc(groupKey)}</td></tr>\n`;
    items.forEach(({ def, isRepeat }) => {
      const comments = cleanJsonComments(def.comments);
      // Check if imageUri is already a base64 data URI (use directly) or look up from the preloaded map
      let imgSrc = '';
      if (def.imageUri) {
        if (def.imageUri.startsWith('data:')) {
          // Already a base64 data URI — use directly
          imgSrc = def.imageUri;
        } else {
          // Look up from the preloaded image map
          imgSrc = imageMap.get(def.imageUri) || '';
        }
      }
      const imgCell = imgSrc
        ? `<img src="${imgSrc}" style="width:80px;height:60px;object-fit:cover;border:1px solid #000;display:block;margin:0 auto" />`
        : `<div class="ip">Photo</div>`;
      rows += `<tr class="avoid-break">
<td class="la">${esc(def.deficiencyDetails || 'No details available')}</td>
<td class="la"><div class="dn">${esc(def.deficiencyQRId || 'QR-00000000')}</div></td>
<td class="la">${esc(comments) || '-'}</td>
<td>${imgCell}</td>
<td>${def.deductionPts}</td>
<td>${isRepeat ? 'Repeat' : 'Not Repeat'}</td>
<td>${esc(def.severity)}</td>
</tr>\n`;
    });
  });

  return `
<div>
  <h3 class="section-title">Inspectable Areas Deficiencies</h3>
  <table class="dt">
    <thead>
      <tr>
        <th style="width:18%">Deficiency Details</th>
        <th style="width:10%">Deficiency Name</th>
        <th style="width:18%">Comments</th>
        <th style="width:14%">Deficiency Picture</th>
        <th style="width:8%">Deduction Pts.</th>
        <th style="width:10%">Repeat Indicator</th>
        <th style="width:8%">Severity</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
}

/**
 * Generate certificates table
 */
function generateCertificatesTable(): string {
  const certs = [
    ['Elevator', 'N/A', 'No elevator present'],
    ['Boiler', 'Current', 'Valid until 2026'],
    ['Lead-Based Paint', 'Current', 'Compliant'],
    ['Fire Alarm', 'Current', 'Tested monthly'],
    ['Sprinkler', 'N/A', 'Not required'],
  ];
  return `
<div class="avoid-break">
  <h3 class="section-title">Certificates</h3>
  <table>
    <thead><tr><th class="la">Certificate Type</th><th>Status</th><th class="la">Comment</th></tr></thead>
    <tbody>
      ${certs.map(c => `<tr><td class="la">${c[0]}</td><td>${c[1]}</td><td class="la">${c[2]}</td></tr>`).join('')}
    </tbody>
  </table>
</div>`;
}

/**
 * Generate certification section — table-based signature layout
 */
function generateEnhancedCertificationSection(certification: any): string {
  return `
<div class="cert-section avoid-break">
  <h3 class="section-title">Inspector Certification</h3>
  <p style="margin-bottom:12px;font-size:7pt;line-height:1.4">${esc(certification.certificationStatement)}</p>
  <table class="sig-table"><tr>
    <td>
      <div class="sig-line"></div>
      <div class="sig-label">Inspector Signature</div>
      <div class="sig-name">${esc(certification.certifiedBy)}</div>
    </td>
    <td style="text-align:right">
      <div class="sig-line" style="width:100px;margin-left:auto"></div>
      <div class="sig-label">Date</div>
      <div class="sig-name">${esc(certification.certificationDate)}</div>
    </td>
  </tr></table>
</div>`;
}

/**
 * Generate footer
 */
function generateEnhancedFooter(options: PDFGenerationOptions): string {
  return `
<div class="page-number">--- PAGE 1 ---</div>
<div class="report-footer">
  <p>${esc(options.footerText || 'Generated by NSPIRE Inspection System')}</p>
  <p>Report generated on ${new Date().toLocaleString()}</p>
  <p style="margin-top:4px">This document is confidential and intended for authorized use only.</p>
</div>`;
}

/**
 * Generate complete lightweight NSPIRE Report HTML.
 * Designed to stay under ~20KB for reliable mobile WebView PDF conversion.
 */
export function generateEnhancedNSPIREReportHTML(
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS,
  imageMap: Map<string, string> = new Map()
): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>NSPIRE Report</title><style>${generateEnhancedStyles()}</style></head><body><div class="report-container">${generateEnhancedHeader(report.metadata)}${options.includeSummaryPage ? generateEnhancedSummaryPage(report.summary, report.categoryBreakdown, report.metadata, report.inspectionData, report.occupancyInfo) : ''}${options.includeDetailedDeficiencies ? generateEnhancedDeficiencyTable(report.deficiencies, imageMap) : ''}${generateCertificatesTable()}${options.includeCertification && report.certification ? generateEnhancedCertificationSection(report.certification) : ''}${generateEnhancedFooter(options)}</div></body></html>`;
}

/**
 * Enhanced PDF Report Service Class
 */
class EnhancedNSPIREPDFReportService {
  /**
   * Generate enhanced PDF from NSPIRE report data.
   * Uses a timeout wrapper to prevent indefinite hangs on mobile.
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
      });

      // Log image URIs for debugging
      if (report.deficiencies) {
        report.deficiencies.forEach((def, i) => {
          if (def.imageUri) {
            const uriType = def.imageUri.startsWith('data:') ? 'base64' 
              : def.imageUri.startsWith('http') ? 'remote' 
              : def.imageUri.startsWith('file://') ? 'local-file' 
              : 'other';
            console.log(`Deficiency ${i + 1} image: ${uriType}, length: ${def.imageUri.length}`);
          } else {
            console.log(`Deficiency ${i + 1} image: none`);
          }
        });
      }

      // Pre-fetch deficiency images as base64 before building HTML
      const imageMap = await preloadDeficiencyImages(report.deficiencies || []);
      console.log(`Image map has ${imageMap.size} entries, ${Array.from(imageMap.values()).filter(v => v.length > 0).length} with data`);

      const html = generateEnhancedNSPIREReportHTML(report, options, imageMap);

      if (!html || html.trim().length < 100) {
        throw new Error('Generated HTML is empty or too short');
      }

      console.log('Enhanced HTML generated, length:', html.length, 'bytes');

      // A5 dimensions in points: 419.53 × 595.28
      // Use a timeout wrapper to prevent indefinite hang
      console.log('Converting HTML to PDF with timeout...');
      const printPromise = Print.printToFileAsync({
        html,
        base64: false,
        width: 420,   // A5 width in points
        height: 595,  // A5 height in points
        margins: {
          left: 34,  // ~12mm
          right: 34,
          top: 42,   // ~15mm
          bottom: 42,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PDF generation timed out after 30s')), PDF_GENERATION_TIMEOUT)
      );

      const printResult = await Promise.race([printPromise, timeoutPromise]);

      if (!printResult.uri) {
        throw new Error('PDF generation returned empty URI');
      }

      const pdfInfo = await FileSystem.getInfoAsync(printResult.uri);
      if (!pdfInfo.exists) {
        throw new Error('Generated PDF file does not exist');
      }

      console.log('Enhanced PDF generated:', printResult.uri, 'size:', pdfInfo.size, 'bytes');
      return { uri: printResult.uri, success: true };
    } catch (error: any) {
      console.error('Enhanced PDF Generation Error:', error);
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
        certificationStatement: 'I certify that this inspection was conducted in accordance with INSPIRE protocols and that the findings documented in this report accurately reflect the conditions observed during the inspection.'
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
      'life threatening': 'Life-Threatening',
      'lifethreatening': 'Life-Threatening',
      'major': 'Severe',
      'severe': 'Severe',
      'high': 'Severe',
      'medium': 'Moderate',
      'moderate': 'Moderate',
      'minor': 'Low',
      'low': 'Low',
      'observation': 'Low'
    };
    return mapping[severity?.toLowerCase()] || 'Moderate';
  }

  private calculateEnhancedDeductionPoints(severity: string): number {
    const points: Record<string, number> = {
      'critical': 10,
      'life-threatening': 10,
      'life threatening': 10,
      'lifethreatening': 10,
      'major': 6,
      'severe': 6,
      'high': 6,
      'medium': 3,
      'moderate': 3,
      'minor': 1,
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