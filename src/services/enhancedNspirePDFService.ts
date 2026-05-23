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
import { Platform } from 'react-native';
import { INSPIRE_LOGO_BASE64 } from '../constants/inspireLogo';
import { API_CONFIG } from './api';
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

/** Build a clickable data URI link showing the short NSPIRE code; clicking opens a clean HTML page with the full codeReference text */
function makeCodeRefLink(nspireCode: string, codeReference?: any): string {
  const shortCode = esc(nspireCode && nspireCode !== '-' ? nspireCode : 'HS-12');
  const rawRef = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');
  const url = `${API_CONFIG.BASE_URL}/code-ref?code=${encodeURIComponent(shortCode)}&ref=${encodeURIComponent(rawRef)}`;
  return `<a href="${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;" target="_blank">${shortCode}</a>`;
}

/** Per-image fetch timeout (20 seconds) */
const IMAGE_FETCH_TIMEOUT = 20000;

/** Number of retry attempts for remote image fetch */
const IMAGE_FETCH_RETRIES = 2;

/** Cached logo base64 data URI */
let cachedLogoBase64: string | null = null;

/**
 * Load the INSPIRE logo as base64 data URI for embedding in PDF.
 * Returns a fallback text placeholder if loading fails.
 */
async function getLogoBase64(): Promise<string> {
  if (cachedLogoBase64) return cachedLogoBase64;
  
  try {
    // On web, use fetch to get the logo
    if (Platform.OS === 'web') {
      // Try to load from public folder or bundled asset
      const logoUrl = INSPIRE_LOGO_BASE64 || '/inspire_logo.png';
      if (logoUrl.startsWith('data:')) {
        cachedLogoBase64 = logoUrl;
        return cachedLogoBase64;
      }
      try {
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            cachedLogoBase64 = reader.result as string;
            resolve(cachedLogoBase64 || '');
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn('Failed to load logo on web:', e);
        return '';
      }
    }
    
    // On native, use Image.resolveAssetSource and FileSystem
    const { Image } = require('react-native');
    const logo = require('../../inspire_logo.png');
    const asset = Image.resolveAssetSource(logo);
    
    if (!asset?.uri) {
      console.warn('Could not resolve logo asset');
      return '';
    }
    
    // If it's already a data URI, use it directly
    if (asset.uri.startsWith('data:')) {
      cachedLogoBase64 = asset.uri;
      return cachedLogoBase64 || '';
    }
    
    // If it's a local file or http URI, convert to base64
    if (asset.uri.startsWith('file://') || asset.uri.startsWith('/')) {
      const b64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      cachedLogoBase64 = `data:image/png;base64,${b64}`;
      return cachedLogoBase64 || '';
    }
    
    // If it's an HTTP URI (bundled asset in dev), fetch it
    if (asset.uri.startsWith('http')) {
      const tmpPath = FileSystem.cacheDirectory + 'inspire_logo_' + Date.now() + '.png';
      const result = await FileSystem.downloadAsync(asset.uri, tmpPath);
      if (result?.uri) {
        const b64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
        FileSystem.deleteAsync(tmpPath, { idempotent: true }).catch(() => {});
        cachedLogoBase64 = `data:image/png;base64,${b64}`;
        return cachedLogoBase64;
      }
    }
    
    return '';
  } catch (error) {
    console.warn('Failed to load logo as base64:', error);
    return '';
  }
}

/**
 * Download a remote image and return a data URI (base64).
 * Returns empty string on failure so the PDF still generates.
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  const normalizedUrl = String(url || '').trim();
  try {
    if (!normalizedUrl || (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://'))) return '';

    if (Platform.OS === 'web') {
      for (let attempt = 0; attempt <= IMAGE_FETCH_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutHandle = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT);

        try {
          const response = await fetch(normalizedUrl, { signal: controller.signal });
          if (!response.ok) {
            continue;
          }

          const blob = await response.blob();
          const dataUri = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => reject(new Error('Failed to decode image blob'));
            reader.readAsDataURL(blob);
          });

          if (dataUri && dataUri.startsWith('data:')) {
            return dataUri;
          }
        } catch (webFetchError) {
          if (attempt === IMAGE_FETCH_RETRIES) {
            console.warn('Failed to fetch image:', normalizedUrl, webFetchError);
          }
        } finally {
          clearTimeout(timeoutHandle);
        }
      }

      return '';
    }

    // Use expo-file-system to download to a temp file, then read as base64
    for (let attempt = 0; attempt <= IMAGE_FETCH_RETRIES; attempt++) {
      const tmpPath = FileSystem.cacheDirectory + 'img_' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.jpg';
      const downloadPromise = FileSystem.downloadAsync(normalizedUrl, tmpPath);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), IMAGE_FETCH_TIMEOUT));
      const result = await Promise.race([downloadPromise, timeoutPromise]);
      if (!result || !('uri' in result)) {
        continue;
      }
      const b64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
      // Clean up temp file (fire-and-forget)
      FileSystem.deleteAsync(tmpPath, { idempotent: true }).catch(() => { });
      if (!b64 || b64.length < 100) {
        continue;
      }
      // Detect mime type from URL or default to jpeg
      const ext = normalizedUrl.toLowerCase().includes('.png') ? 'png' : 'jpeg';
      return `data:image/${ext};base64,${b64}`;
    }
    return '';
  } catch (e) {
    console.warn('Failed to fetch image:', normalizedUrl, e);
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
    const rawUri = typeof def.imageUri === 'string' ? def.imageUri.trim() : '';
    if (rawUri) {
      // If already a base64 data URI, add directly to the map
      if (rawUri.startsWith('data:')) {
        imageMap.set(rawUri, rawUri);
      } else if (rawUri.startsWith('http://') || rawUri.startsWith('https://')) {
        uniqueUrls.add(rawUri);
      } else if (!Platform.OS || Platform.OS !== 'web') {
        if (rawUri.startsWith('file://') || rawUri.startsWith('/') || rawUri.startsWith('content://')) {
          // Local file URI - try to convert to base64 (native only)
          try {
            const filePath = rawUri;
            const b64 = await FileSystem.readAsStringAsync(filePath, { encoding: FileSystem.EncodingType.Base64 });
            if (b64 && b64.length > 100) {
              const ext = rawUri.toLowerCase().includes('.png') ? 'png' : 'jpeg';
              imageMap.set(rawUri, `data:image/${ext};base64,${b64}`);
            }
          } catch (e) {
            console.warn('Failed to read local image file:', rawUri, e);
          }
        }
      } else {
        // Web: use the imageUri directly (could be a blob URL or existing data URI)
        imageMap.set(rawUri, rawUri);
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
      // Fallback to original URL if base64 conversion fails
      return [url, b64 || url] as [string, string];
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
 * Generate header with logo.
 * Uses table layout instead of CSS grid for WebView compatibility.
 */
function generateEnhancedHeader(metadata: InspectionMetadata, logoBase64: string): string {
  const logoHtml = logoBase64 
    ? `<img src="${logoBase64}" class="inspire-logo" alt="INSPIRE" />`
    : `<div class="inspire-logo-text" style="font-size:18pt;font-weight:bold;color:#0E7490;margin:0 auto 6px;text-align:center;">INSPIRE</div>`;
  return `
<div class="report-header">
  ${logoHtml}
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
  occupancyInfo: OccupancyInfo,
  deficiencies?: DeficiencyEntry[]
): string {
  // Compute per-area counts dynamically from deficiencies
  const defs = deficiencies || [];
  const insideDefs = defs.filter(d => d.area === 'Inside');
  const outsideDefs = defs.filter(d => d.area === 'Outside');
  const unitsDefs = defs.filter(d => d.area !== 'Inside' && d.area !== 'Outside');
  const countBySev = (arr: DeficiencyEntry[]) => ({
    lt: arr.filter(d => d.severity === 'Life-Threatening').length,
    sv: arr.filter(d => d.severity === 'Severe').length,
    md: arr.filter(d => d.severity === 'Moderate').length,
    lw: arr.filter(d => d.severity === 'Low').length,
  });
  const iC = countBySev(insideDefs);
  const oC = countBySev(outsideDefs);
  const uC = countBySev(unitsDefs);
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
  <h3 class="section-title">Unit Inspection Data</h3>
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
      ${inspectionData
        .filter(row => String(row.type).toLowerCase() !== 'building')
        .map(row => `<tr><td class="la">${esc(row.type)}</td><td>${row.propertyTotal}</td><td>${row.sampleSize}</td><td>${row.totalUnitsInspected}</td></tr>`)
        .join('')}
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
      <tr><td class="la">Inside</td><td>${iC.lt}</td><td>${iC.sv}</td><td>${iC.md}</td><td>${iC.lw}</td></tr>
      <tr><td class="la">Outside</td><td>${oC.lt}</td><td>${oC.sv}</td><td>${oC.md}</td><td>${oC.lw}</td></tr>
      <tr><td class="la">Units</td><td>${uC.lt}</td><td>${uC.sv}</td><td>${uC.md}</td><td>${uC.lw}</td></tr>
    </tbody>
  </table>
</div>`;
}

/**
 * Generate deficiency table – 7 columns matching reference template.
 * Grouped by Building / Unit with yellow header rows.
 * Uses pre-loaded base64 images (no remote URLs in final HTML).
 */
function generateEnhancedDeficiencyTable(
  deficiencies: DeficiencyEntry[],
  imageMap: Map<string, string> = new Map(),
  propertyName: string = ''
): string {
  if (deficiencies.length === 0) {
    return `
<div>
  <h3 class="section-title">Inspectable Areas Deficiencies</h3>
  <p style="text-align:center;padding:12px;font-style:italic;">No deficiencies found during this inspection.</p>
</div>`;
  }

  const normalizeToken = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');

  const isLikelyUnitLabel = (value: unknown): boolean => {
    const normalized = String(value ?? '').trim().toLowerCase();
    return normalized.startsWith('unit ') || normalized.startsWith('unit-') || normalized.startsWith('unit_');
  };

  const isPlaceholder = (value: unknown): boolean => {
    const token = normalizeToken(value);
    return (
      !token ||
      token === '-' ||
      token === 'allunits' ||
      token === 'allunit' ||
      token === 'unknown' ||
      token === 'null' ||
      token === 'undefined' ||
      token === 'property' ||
      token === 'building'
    );
  };

  const normalizeUnitLabel = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s*\/\s*building\s*-\s*[^/]+/gi, '')
      .replace(/\s*\(\s*building\s*-\s*[^)]+\)/gi, '')
      .replace(/\s*\/\s*property\s*-\s*[^/]+/gi, '')
      .replace(/\s*\(\s*property\s*-\s*[^)]+\)/gi, '')
      .replace(/^\s*building\s*-\s*/i, '')
      .trim();

  const formatUnitHeading = (value: unknown): string => {
    const normalized = normalizeUnitLabel(value);
    if (!normalized || isPlaceholder(normalized)) return 'Unit 001';
    return /^unit[\s_-]*/i.test(normalized) ? normalized : `Unit ${normalized}`;
  };

  // Build repeat detection map
  const detailsSeen = new Map<string, number>();
  const repeatFlags = deficiencies.map(def => {
    const key = (def.deficiencyDetails || '').trim().toLowerCase();
    if (!key) return false;
    const count = detailsSeen.get(key) || 0;
    detailsSeen.set(key, count + 1);
    return count > 0;
  });

  interface GroupedDef { def: DeficiencyEntry; isRepeat: boolean; }
  const buildingMap = new Map<string, {
    Outside: GroupedDef[];
    Inside: GroupedDef[];
    Units: GroupedDef[];
    GeneralComment: GroupedDef[];
  }>();

  deficiencies.forEach((def, idx) => {
    const resolvedBuildingCandidate = String(
      (def as any).buildingInspectionId ||
      (def as any).building_id ||
      def.building ||
      (def as any).buildingId ||
      ''
    ).trim();
    const building =
      resolvedBuildingCandidate &&
      !isPlaceholder(resolvedBuildingCandidate) &&
      !isLikelyUnitLabel(resolvedBuildingCandidate)
        ? resolvedBuildingCandidate
        : 'B1';

    if (!buildingMap.has(building)) {
      buildingMap.set(building, {
        Outside: [],
        Inside: [],
        Units: [],
        GeneralComment: [],
      });
    }

    let section: 'Outside' | 'Inside' | 'Units' | 'GeneralComment' = 'Inside';
    const areaToken = normalizeToken(def.area);
    if ((def as any).isGeneralComment) {
      section = 'GeneralComment';
    } else if (areaToken.includes('outside') || areaToken.includes('site') || areaToken.includes('exterior')) {
      section = 'Outside';
    } else if (areaToken.includes('inside') || areaToken.includes('interior') || areaToken.includes('common')) {
      section = 'Inside';
    } else if (areaToken.includes('unit')) {
      section = 'Units';
    } else {
      const unitToken = normalizeToken(def.unit);
      section = (unitToken && !isPlaceholder(unitToken)) ? 'Units' : 'Inside';
    }

    buildingMap.get(building)![section].push({ def, isRepeat: def.repeatIndicator || repeatFlags[idx] });
  });

  const normalizedPropertyName = String(propertyName || '').trim();
  const propertySuffix = normalizedPropertyName ? ` / ${normalizedPropertyName}` : '';

  const renderDeficiencyRow = ({ def, isRepeat }: GroupedDef): string => {
      // Check if imageUri is already a base64 data URI (use directly) or look up from the preloaded map
      let imgSrc = '';
      if (def.imageUri) {
        const normalized = String(def.imageUri).trim();
        if (normalized.startsWith('data:')) {
          // Already a base64 data URI — use directly
          imgSrc = normalized;
        } else if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
          // Remote URL — try base64 first, fall back to original URL
          imgSrc = imageMap.get(normalized) || normalized;
        } else {
          // Local file or other — try from map
          imgSrc = imageMap.get(normalized) || '';
        }
      }
      const imgCell = imgSrc
        ? `<img src="${imgSrc}" style="width:80px;height:60px;object-fit:cover;border:1px solid #000;display:block;margin:0 auto" />`
        : `<div class="ip">Photo</div>`;
      const isGC = !!(def as any).isGeneralComment;
      return `<tr class="avoid-break">
<td class="la">${isGC ? '-' : esc(def.deficiencyDetails || 'No details available')}</td>
<td class="la" style="text-align:center;vertical-align:middle;">${isGC ? '-' : makeCodeRefLink(def.nspireCode, def.codeReference)}</td>
<td>${imgCell}</td>
<td>${isGC ? '-' : def.deductionPts}</td>
<td>${isGC ? '-' : (isRepeat ? 'Repeat' : 'Not Repeat')}</td>
<td>${isGC ? '-' : esc(def.severity)}</td>
<td class="la">${esc(def.note || '-')}</td>
</tr>\n`;
  };

  let rows = '';
  const sortedBuildings = Array.from(buildingMap.keys()).sort((a, b) => a.localeCompare(b));
  sortedBuildings.forEach((building) => {
    const sections = buildingMap.get(building)!;
    const sectionOrder: Array<'Outside' | 'Inside' | 'Units' | 'GeneralComment'> = ['Outside', 'Inside', 'Units', 'GeneralComment'];

    sectionOrder.forEach((sectionName) => {
      const items = sections[sectionName] || [];
      if (items.length === 0) return;

      if (sectionName === 'Units') {
        const unitBuckets = new Map<string, GroupedDef[]>();
        items.forEach((entry) => {
          const normalizedUnit = normalizeUnitLabel(entry.def.unit);
          const unitKey = !isPlaceholder(normalizedUnit) ? normalizedUnit : '001';
          if (!unitBuckets.has(unitKey)) {
            unitBuckets.set(unitKey, []);
          }
          unitBuckets.get(unitKey)!.push(entry);
        });

        Array.from(unitBuckets.keys()).sort((a, b) => a.localeCompare(b)).forEach((unitKey) => {
          const displayGroupKey = `${formatUnitHeading(unitKey)} - ${building}${propertySuffix}`;
          rows += `<tr class="gh"><td colspan="7">${esc(displayGroupKey)}</td></tr>\n`;
          unitBuckets.get(unitKey)!.forEach((entry) => {
            rows += renderDeficiencyRow(entry);
          });
        });

        return;
      }

      const displayGroupKey = sectionName === 'GeneralComment'
        ? `General Comment - ${building}${propertySuffix}`
        : `${sectionName} - ${building}${propertySuffix}`;

      rows += `<tr class="gh"><td colspan="7">${esc(displayGroupKey)}</td></tr>\n`;
      items.forEach((entry) => {
        rows += renderDeficiencyRow(entry);
      });
    });
  });

  return `
<div>
  <h3 class="section-title">Inspectable Areas Deficiencies</h3>
  <table class="dt">
    <thead>
      <tr>
        <th style="width:22%">Deficiency Details</th>
        <th style="width:10%">Code of Reference</th>
        <th style="width:16%">Deficiency Picture</th>
        <th style="width:9%">Deduction Pts.</th>
        <th style="width:11%">Repeat Indicator</th>
        <th style="width:9%">Severity</th>
        <th style="width:13%">Note</th>
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
 * Generate footer with logo at the end
 */
function generateEnhancedFooter(options: PDFGenerationOptions, logoBase64: string): string {
  const footerLogo = logoBase64 
    ? `<img src="${logoBase64}" style="width:80px;height:auto;margin:12px auto 8px;display:block;" alt="INSPIRE" />`
    : `<div style="font-size:14pt;font-weight:bold;color:#0E7490;margin:12px auto 8px;text-align:center;">INSPIRE</div>`;
  return `
<div class="page-number">--- PAGE 1 ---</div>
<div class="report-footer">
  ${footerLogo}
  <p>${esc(options.footerText || 'Generated by NSPIRE Inspection System')}</p>
  <p>Report generated on ${new Date().toLocaleString()}</p>
  <p style="margin-top:4px">This document is confidential and intended for authorized use only.</p>
</div>`;
}

/**
 * In-progress report deficiency table generator using standard UI format
 */
function generateInProgressDeficiencyTable(
  report: any,
  imageMap: Map<string, string>
): string {
  const m = report.metadata;
  const pData = m.progressData || {
    outsideProgress: 0, insideProgress: 0, unitProgress: 0,
    outsideTotal: 1, insideTotal: 1, unitTotal: 1,
    buildingProgressMap: {}
  };

  const bMap = pData.buildingProgressMap || {};

  const esc = (txt: string | undefined | null) => (txt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const normalizeLabelToken = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '');

  const isPlaceholderLabel = (value: unknown): boolean => {
    const token = normalizeLabelToken(value);
    return (
      !token ||
      token === 'allunits' ||
      token === 'allunit' ||
      token === 'unknown' ||
      token === 'null' ||
      token === 'undefined' ||
      token === 'property' ||
      token === 'building' ||
      token === 'unitmultiple'
    );
  };

  const toLabel = (value: unknown): string => String(value ?? '').trim();

  const firstValidLabel = (values: unknown[]): string => {
    for (const value of values) {
      const label = toLabel(value);
      if (!isPlaceholderLabel(label)) {
        return label;
      }
    }

    return '';
  };

  const sanitizeUnitLabel = (value: unknown): string => {
    const label = toLabel(value);
    if (!label) return '';

    return label
      .replace(/\s*\/\s*building\s*-\s*[^/]+/gi, '')
      .replace(/\s*\(\s*building\s*-\s*[^)]+\)/gi, '')
      .replace(/\s*\/\s*property\s*-\s*[^/]+/gi, '')
      .replace(/\s*\(\s*property\s*-\s*[^)]+\)/gi, '')
      .replace(/^\s*building\s*-\s*/i, '')
      .trim();
  };

  const formatUnitSectionHeading = (value: unknown): string => {
    const normalized = sanitizeUnitLabel(value);
    if (!normalized || isPlaceholderLabel(normalized)) return 'Unit 001';
    return /^unit[\s_-]*/i.test(normalized) ? normalized : `Unit ${normalized}`;
  };

  const looksLikeBuildingLabel = (value: string): boolean => {
    const label = toLabel(value);
    if (!label) return false;
    return /^b\d+$/i.test(label) || /^building[\s_-]?[a-z0-9]+$/i.test(label);
  };

  const looksLikeUnitLabel = (value: string): boolean => {
    const label = toLabel(value).toLowerCase();
    return label.startsWith('unit ') || label.startsWith('unit-') || label.startsWith('unit_');
  };

  const fallbackBuildingFromMetadata = firstValidLabel([
    report?.metadata?.buildingInspectionId,
    report?.metadata?.buildingName,
    report?.metadata?.buildingId,
    report?.metadata?.progressData?.buildingInspectionId,
    report?.metadata?.progressData?.buildingId,
  ]);

  const nonPlaceholderProgressBuildings = Object.keys(bMap)
    .map((key) => toLabel(key))
    .filter((key) => !isPlaceholderLabel(key));

  const fallbackBuildingFromProgress =
    nonPlaceholderProgressBuildings.length === 1 ? nonPlaceholderProgressBuildings[0] : '';

  const resolveBuildingLabel = (rawBuilding: unknown, areaValue: unknown, rawUnit: unknown): string => {
    const unitLabel = toLabel(rawUnit);
    const candidateFromUnit = looksLikeBuildingLabel(unitLabel) ? unitLabel : '';
    const rawBuildingLabel = toLabel(rawBuilding);
    const safeRawBuilding = looksLikeUnitLabel(rawBuildingLabel) ? '' : rawBuildingLabel;

    let resolved = firstValidLabel([
      safeRawBuilding,
      candidateFromUnit,
      fallbackBuildingFromMetadata,
      fallbackBuildingFromProgress,
    ]);

    if (!resolved && looksLikeBuildingLabel(unitLabel)) {
      resolved = unitLabel;
    }

    return resolved || 'B1';
  };

  const makeCodeRefLink = (nspireCode: string, codeReference?: any) => {
    const rawRef = typeof codeReference === 'string' ? codeReference : (codeReference?.text || codeReference?.source || '');
    let lbl = nspireCode && nspireCode !== '-' ? nspireCode : (rawRef ? 'How to Inspect' : '-');
    if (!rawRef && lbl === '-') return '-';
    if (!rawRef) return esc(lbl);
    const url = `${API_CONFIG.BASE_URL}/code-ref?code=${encodeURIComponent(lbl)}&ref=${encodeURIComponent(rawRef)}`;
    return `<a href="${url}" style="color:#0E7490;font-weight:600;text-decoration:underline;cursor:pointer;" target="_blank" onclick="window.open('${url}'); return false;">${esc(lbl)}</a>`;
  };

  const deficiencies = report.deficiencies || [];
  if (!deficiencies.length && Object.keys(bMap).length === 0) {
    return `
  <div>
    <h3 class="section-title">Inspectable Areas Deficiencies</h3>
    <table class="dt">
      <thead>
        <tr>
          <th style="width:22%">Deficiency Details</th>
          <th style="width:10%">Code of Reference</th>
          <th style="width:16%">Deficiency Picture</th>
          <th style="width:9%">Deduction Pts.</th>
          <th style="width:11%">Repeat Indicator</th>
          <th style="width:9%">Severity</th>
          <th style="width:13%">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="7" style="text-align:center;padding:20px;">No inspectable data available.</td></tr>
      </tbody>
    </table>
  </div>`;
  }

  const detailsSeen = new Map<string, number>();
  const repeatFlags = deficiencies.map((def: any) => {
    const key = (def.deficiencyDetails || '').trim().toLowerCase();
    if (!key) return false;
    const count = detailsSeen.get(key) || 0;
    detailsSeen.set(key, count + 1);
    return count > 0;
  });

  interface GroupedDef { def: any; isRepeat: boolean; }
  const buildingsMap = new Map<string, Map<string, GroupedDef[]>>();
  const buildingUnitsMap = new Map<string, Set<string>>();

  const inferSectionForDef = (def: any, bProgress: any): 'Outside' | 'Inside' | 'Units' => {
    const area = String(def?.area || '').toLowerCase();
    if (area.includes('outside')) return 'Outside';
    if (area.includes('inside')) return 'Inside';
    if (area.includes('unit')) return 'Units';

    const unitValue = String(def?.unit || '').trim().toLowerCase();
    if (unitValue && unitValue !== '-' && !unitValue.includes('multiple')) return 'Units';

    const textBlob = [
      def?.location,
      def?.room,
      def?.category,
      def?.subCategory,
      def?.itemName,
      def?.inspectionType,
      def?.title,
      def?.deficiencyName,
    ].map((v) => String(v || '').toLowerCase()).join(' ');

    const outsideKeywords = ['outside', 'exterior', 'site', 'ground', 'roof', 'facade', 'parking', 'yard'];
    const insideKeywords = ['inside', 'interior', 'lobby', 'hall', 'corridor', 'stair', 'common area', 'community'];
    const unitKeywords = ['unit', 'apartment', 'bedroom', 'bathroom', 'kitchen', 'living room', 'tenant'];

    if (outsideKeywords.some((k) => textBlob.includes(k))) return 'Outside';
    if (unitKeywords.some((k) => textBlob.includes(k))) return 'Units';
    if (insideKeywords.some((k) => textBlob.includes(k))) return 'Inside';

    const outScore = Number(bProgress?.out || 0);
    const inScore = Number(bProgress?.in || 0);
    const unScore = Number(bProgress?.un || 0);

    if (outScore >= inScore && outScore >= unScore && outScore > 0) return 'Outside';
    if (unScore >= inScore && unScore >= outScore && unScore > 0) return 'Units';
    if (inScore > 0) return 'Inside';

    // Safe default when no signal is available
    return 'Inside';
  };

  // Create a bucket for every building that has deficiencies
  console.log(`[PDFService] Processing ${deficiencies.length} deficiencies for PDF generation`);
  // NOTE: OD-specific report/debug output disabled per client request.
  /*
  const odDeficiencies = deficiencies.filter((d: any) => d.nspireCode === 'OD-MARKED');
  if (odDeficiencies.length > 0) {
    console.log(`[PDFService] Found ${odDeficiencies.length} OD deficiencies`);
    console.log(`[PDFService] OD items:`, odDeficiencies.map((d: any) => ({ name: d.deficiencyName, area: d.area, building: d.building })));
  }
  */
  
  deficiencies.forEach((def: any, idx: number) => {
    const area = String(def.area || def._area || '').trim();
    const normalizedUnit = sanitizeUnitLabel(firstValidLabel([
      def.unit,
      normalizeLabelToken(area).includes('unit') ? def._unit : '',
      def.unitId,
    ]));
    const building = resolveBuildingLabel(
      def.buildingInspectionId || def.building_id || def.building || def.buildingName || def.buildingId,
      area,
      normalizedUnit
    );

    if (!buildingsMap.has(building)) buildingsMap.set(building, new Map());
    if (!buildingUnitsMap.has(building)) buildingUnitsMap.set(building, new Set<string>());

    if (normalizedUnit && !isPlaceholderLabel(normalizedUnit)) {
      buildingUnitsMap.get(building)!.add(normalizedUnit);
    }

    // Within building, segment by 'Outside', 'Inside', 'Units', or 'General Comment'
    let currentArea = area;
    const isExplicitGeneralComment =
      !!def.isGeneralComment ||
      String(def.deficiencyName || '').trim().toLowerCase() === 'general comment' ||
      String(def.title || '').trim().toLowerCase() === 'general comment';
    if (isExplicitGeneralComment) {
      currentArea = def.category || currentArea || 'General Comment';
    }

    let subGroupKey: 'Outside' | 'Inside' | 'Units' | 'GeneralComment';
    const lArea = currentArea.toLowerCase();
    if (isExplicitGeneralComment) subGroupKey = 'GeneralComment';
    else if (lArea.includes('outside')) subGroupKey = 'Outside';
    else if (lArea.includes('inside')) {
      const normalizedUnitLabel = sanitizeUnitLabel(firstValidLabel([
        def.unit,
        def._unit,
        def.unitId,
      ]));
      const shouldTreatAsUnits =
        !!normalizedUnitLabel &&
        !isPlaceholderLabel(normalizedUnitLabel) &&
        normalizeLabelToken(normalizedUnitLabel) !== normalizeLabelToken(building);

      subGroupKey = shouldTreatAsUnits ? 'Units' : 'Inside';
    }
    else if (lArea.includes('unit')) subGroupKey = 'Units';
    else {
      const bProgress = bMap[building] || { out: 0, in: 0, un: 0 };
      subGroupKey = inferSectionForDef(def, bProgress);
    }

    const buildingGroups = buildingsMap.get(building)!;
    if (!buildingGroups.has(subGroupKey)) buildingGroups.set(subGroupKey, []);
    buildingGroups.get(subGroupKey)!.push({ def, isRepeat: def.repeatIndicator || repeatFlags[idx] });
  });

  // Add empty buildings from progress map
  Object.entries(bMap).forEach(([rawBuildingName, progressEntry]: [string, any]) => {
    const resolvedBuildingName = resolveBuildingLabel(rawBuildingName, '', '');
    if (!buildingsMap.has(resolvedBuildingName)) buildingsMap.set(resolvedBuildingName, new Map());
    if (!buildingUnitsMap.has(resolvedBuildingName)) buildingUnitsMap.set(resolvedBuildingName, new Set<string>());

    const progressUnits = Array.isArray(progressEntry?.inspectedUnits) ? progressEntry.inspectedUnits : [];
    progressUnits.forEach((unitLabel: unknown) => {
      const normalizedUnitLabel = sanitizeUnitLabel(firstValidLabel([unitLabel]));
      if (normalizedUnitLabel && !isPlaceholderLabel(normalizedUnitLabel)) {
        buildingUnitsMap.get(resolvedBuildingName)!.add(normalizedUnitLabel);
      }
    });
  });

  // Sort Buildings alphabetically
  const sortedBuildings = Array.from(buildingsMap.keys()).sort((a, b) => a.localeCompare(b));

  const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

  const getSelectedModulesForSection = (
    building: string,
    groupKey: 'Outside' | 'Inside' | 'Units' | 'GeneralComment',
    items: GroupedDef[]
  ): string[] => {
    if (groupKey === 'GeneralComment') return [];

    const matchingProgressEntries = Object.entries(bMap)
      .filter(([rawBuildingName]) => resolveBuildingLabel(rawBuildingName, '', '') === building)
      .map(([, progressEntry]) => progressEntry || {});

    const progressModules = unique(
      matchingProgressEntries.flatMap((entry: any) => {
        if (groupKey === 'Outside') {
          return Array.isArray(entry?.modules?.Outside?.submodules)
            ? entry.modules.Outside.submodules.map((sub: unknown) => String(sub || '').trim())
            : [];
        }

        if (groupKey === 'Inside') {
          return Array.isArray(entry?.modules?.Inside?.submodules)
            ? entry.modules.Inside.submodules.map((sub: unknown) => String(sub || '').trim())
            : [];
        }

        return Array.isArray(entry?.modules?.Units?.submodules)
          ? entry.modules.Units.submodules.map((sub: unknown) => String(sub || '').trim())
          : [];
      })
    );

    const inferredFromRows = items
      .map(({ def }) => String(def?.itemName || def?.module || def?.submodule || '').trim())
      .filter((v) => !!v);

    return unique([
      ...progressModules.map((m: any) => String(m).trim()),
      ...inferredFromRows,
    ]);
  };

  let rows = '';

  sortedBuildings.forEach(building => {
    const matchingProgressEntries = Object.entries(bMap)
      .filter(([rawBuildingName]) => resolveBuildingLabel(rawBuildingName, '', '') === building)
      .map(([, progressEntry]) => progressEntry || {});

    const mergedProgress = {
      out: matchingProgressEntries.reduce((sum: number, entry: any) => sum + Number(entry?.out || 0), 0),
      in: matchingProgressEntries.reduce((sum: number, entry: any) => sum + Number(entry?.in || 0), 0),
      un: matchingProgressEntries.reduce((sum: number, entry: any) => sum + Number(entry?.un || 0), 0),
      inspectedUnits: unique(
        matchingProgressEntries.flatMap((entry: any) =>
          Array.isArray(entry?.inspectedUnits) ? entry.inspectedUnits.map((u: unknown) => String(u || '').trim()) : []
        )
      ),
      modules: {
        Outside: {
          submodules: unique(
            matchingProgressEntries.flatMap((entry: any) =>
              Array.isArray(entry?.modules?.Outside?.submodules)
                ? entry.modules.Outside.submodules.map((s: unknown) => String(s || '').trim())
                : []
            )
          ),
        },
        Inside: {
          submodules: unique(
            matchingProgressEntries.flatMap((entry: any) =>
              Array.isArray(entry?.modules?.Inside?.submodules)
                ? entry.modules.Inside.submodules.map((s: unknown) => String(s || '').trim())
                : []
            )
          ),
        },
        Units: {
          submodules: unique(
            matchingProgressEntries.flatMap((entry: any) =>
              Array.isArray(entry?.modules?.Units?.submodules)
                ? entry.modules.Units.submodules.map((s: unknown) => String(s || '').trim())
                : []
            )
          ),
        },
      },
    };

    const outPct = Math.min(100, Math.round((mergedProgress.out / (pData.outsideTotal || 1)) * 100));
    const inPct = Math.min(100, Math.round((mergedProgress.in / (pData.insideTotal || 1)) * 100));
    const unPct = Math.min(100, Math.round((mergedProgress.un / (pData.unitTotal || 1)) * 100));

    const buildingGroups = buildingsMap.get(building)!;

    const combinedUnits = unique([
      ...Array.from(buildingUnitsMap.get(building) || []).map((unit) => sanitizeUnitLabel(unit)),
      ...mergedProgress.inspectedUnits.map((unit) => sanitizeUnitLabel(unit)),
    ]).filter((unit) => !isPlaceholderLabel(unit));

    // Enforce order: Outside -> Inside -> Units
    const ordering = [
      { key: 'Outside', pct: outPct },
      { key: 'Inside', pct: inPct },
      { key: 'Units', pct: unPct },
      { key: 'GeneralComment', pct: null },
    ];

    let itemsShownForBuilding = false;
    const hasProgressContextForBuilding = matchingProgressEntries.length > 0;

    const sectionHasRecordedProgress = (
      sectionKey: 'Outside' | 'Inside' | 'Units' | 'GeneralComment'
    ): boolean => {
      if (sectionKey === 'Outside') {
        return mergedProgress.out > 0 || mergedProgress.modules.Outside.submodules.length > 0;
      }

      if (sectionKey === 'Inside') {
        return mergedProgress.in > 0 || mergedProgress.modules.Inside.submodules.length > 0;
      }

      if (sectionKey === 'Units') {
        return (
          mergedProgress.un > 0 ||
          mergedProgress.modules.Units.submodules.length > 0 ||
          mergedProgress.inspectedUnits.length > 0
        );
      }

      return true;
    };

    ordering.forEach(groupOrderDef => {
      const items = buildingGroups.get(groupOrderDef.key) || [];
      const selectedModules = getSelectedModulesForSection(
        building,
        groupOrderDef.key as 'Outside' | 'Inside' | 'Units' | 'GeneralComment',
        items
      );

      // When progress context exists for a building, trust it as the source of truth:
      // if a section was never started, suppress it even if stale findings leaked in.
      if (
        hasProgressContextForBuilding &&
        groupOrderDef.key !== 'GeneralComment' &&
        !sectionHasRecordedProgress(groupOrderDef.key as 'Outside' | 'Inside' | 'Units' | 'GeneralComment')
      ) {
        return;
      }

      // We render a section if it has findings OR if it has SOME progress
      if (
        items.length === 0 &&
        (groupOrderDef.pct === 0 || groupOrderDef.pct === null) &&
        selectedModules.length === 0
      ) {
        return; // Skip completely empty & untouched sections
      }

      itemsShownForBuilding = true;

      if (groupOrderDef.key === 'Units' && items.length > 0) {
        const unitBuckets = new Map<string, GroupedDef[]>();
        items.forEach((entry) => {
          const unitCandidate = sanitizeUnitLabel(firstValidLabel([
            entry.def?.unit,
            entry.def?._unit,
            entry.def?.unitId,
          ]));

          const normalizedUnit =
            unitCandidate &&
            !isPlaceholderLabel(unitCandidate) &&
            normalizeLabelToken(unitCandidate) !== normalizeLabelToken(building)
              ? unitCandidate
              : '001';

          if (!unitBuckets.has(normalizedUnit)) {
            unitBuckets.set(normalizedUnit, []);
          }
          unitBuckets.get(normalizedUnit)!.push(entry);
        });

        const propertyNameForHeading = String(report?.metadata?.propertyName || '').trim();
        const sortedUnitLabels = Array.from(unitBuckets.keys()).sort((a, b) => a.localeCompare(b));

        sortedUnitLabels.forEach((unitLabel) => {
          const unitItems = unitBuckets.get(unitLabel) || [];
          const propertySuffix = propertyNameForHeading ? ` / ${esc(propertyNameForHeading)}` : '';
          const displayGroupKey = `${formatUnitSectionHeading(unitLabel)} - ${esc(building)}${propertySuffix}`;

          rows += `\n<tr><td colspan="7" style="background:#F3F4F6;font-weight:700;font-size:7.5pt;text-align:left;padding:6px 4px;border:1px solid #000;">${displayGroupKey}</td></tr>\n`;

          unitItems.forEach(({ def, isRepeat }) => {
            let imgSrc = '';
            if (def.imageUri) {
              const normalized = String(def.imageUri).trim();
              if (normalized.startsWith('data:')) {
                imgSrc = normalized;
              } else if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
                imgSrc = imageMap.get(normalized) || normalized;
              } else {
                imgSrc = imageMap.get(normalized) || '';
              }
            }

            const imgCell = imgSrc
              ? `<img src="${imgSrc}" style="width:80px;height:60px;object-fit:cover;border:1px solid #000;display:block;margin:0 auto" />`
              : `<div class="ip">Photo</div>`;

            const isGC = !!def.isGeneralComment;
            const detailText = def.deficiencyDetails || def.detail || def.description || 'No details available';

            rows += `<tr class="avoid-break">
    <td class="la">${isGC ? '-' : (def.deficiencyName && def.deficiencyName !== 'Deficiency' && def.deficiencyName !== 'General Comment' ? `<b>${esc(def.deficiencyName)}</b><br/><br/>` : '') + esc(detailText)}</td>
    <td class="la" style="text-align:center;vertical-align:middle;cursor:pointer;">${isGC ? '-' : makeCodeRefLink(def.nspireCode, def.codeReference)}</td>
    <td>${imgCell}</td>
    <td>${isGC ? '-' : (def.deductionPts || '-')}</td>
    <td>${isGC ? '-' : (isRepeat ? 'Repeat' : 'Not Repeat')}</td>
    <td>${isGC ? '-' : esc(def.severity || '-')}</td>
    <td class="la">${esc(def.note || def.comments || '-')}</td>
    </tr>\n`;
          });
        });

        return;
      }

      const propertyNameForHeading = String(report?.metadata?.propertyName || '').trim();
      const propertySuffix = propertyNameForHeading ? ` / ${esc(propertyNameForHeading)}` : '';

      let displayGroupKey = 'General Comment';
      if (groupOrderDef.key === 'Outside' || groupOrderDef.key === 'Inside') {
        displayGroupKey = `${groupOrderDef.key} - ${esc(building)}${propertySuffix}`;
      } else if (groupOrderDef.key === 'Units') {
        const fallbackUnitLabel = combinedUnits.length > 0
          ? formatUnitSectionHeading(combinedUnits[0])
          : 'Unit 001';
        displayGroupKey = `${fallbackUnitLabel} - ${esc(building)}${propertySuffix}`;
      } else if (groupOrderDef.key === 'GeneralComment') {
        displayGroupKey = `General Comment - ${esc(building)}${propertySuffix}`;
      }

      rows += `\n<tr><td colspan="7" style="background:#F3F4F6;font-weight:700;font-size:7.5pt;text-align:left;padding:6px 4px;border:1px solid #000;">${displayGroupKey}</td></tr>\n`;

      if (items.length === 0) {
        // NOTE: OD placeholder rows are intentionally disabled.
        // Render generic in-progress row for sections without logged deficiencies.
        rows += `<tr class="avoid-break"><td colspan="7" style="text-align:center;font-style:italic;padding:10px;">In Progress - No Deficiencies Logged Yet</td></tr>\n`;
      } else {
        items.forEach(({ def, isRepeat }) => {
          let imgSrc = '';
          if (def.imageUri) {
            const normalized = String(def.imageUri).trim();
            if (normalized.startsWith('data:')) {
              imgSrc = normalized;
            } else if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
              imgSrc = imageMap.get(normalized) || normalized;
            } else {
              imgSrc = imageMap.get(normalized) || '';
            }
          }
          const imgCell = imgSrc
            ? `<img src="${imgSrc}" style="width:80px;height:60px;object-fit:cover;border:1px solid #000;display:block;margin:0 auto" />`
            : `<div class="ip">Photo</div>`;

          // Special handling for General Comments
          // NOTE: NO-OD banner row intentionally disabled.
          const isGC = !!def.isGeneralComment;

          const detailText = def.deficiencyDetails || def.detail || def.description || 'No details available';
          rows += `<tr class="avoid-break">
    <td class="la">${isGC ? '-' : (def.deficiencyName && def.deficiencyName !== 'Deficiency' && def.deficiencyName !== 'General Comment' ? `<b>${esc(def.deficiencyName)}</b><br/><br/>` : '') + esc(detailText)}</td>
    <td class="la" style="text-align:center;vertical-align:middle;cursor:pointer;">${isGC ? '-' : makeCodeRefLink(def.nspireCode, def.codeReference)}</td>
    <td>${imgCell}</td>
    <td>${isGC ? '-' : (def.deductionPts || '-')}</td>
    <td>${isGC ? '-' : (isRepeat ? 'Repeat' : 'Not Repeat')}</td>
    <td>${isGC ? '-' : esc(def.severity || '-')}</td>
    <td class="la">${esc(def.note || def.comments || '-')}</td>
    </tr>\n`;
        });
      }
    });

    if (!itemsShownForBuilding) {
      rows += `<tr class="avoid-break"><td colspan="7" style="text-align:center;font-style:italic;padding:10px;">In Progress - No sections started yet</td></tr>\n`;
    }
  });

  if (!rows) {
    rows = '<tr><td colspan="7" style="text-align:center;padding:20px;">No inspectable areas data available.</td></tr>';
  }

  return `
  <div>
    <h3 class="section-title">Inspectable Areas Deficiencies</h3>
    <table class="dt">
      <thead>
        <tr>
          <th style="width:22%">Deficiency Details</th>
          <th style="width:10%">Code of Reference</th>
          <th style="width:16%">Deficiency Picture</th>
          <th style="width:9%">Deduction Pts.</th>
          <th style="width:11%">Repeat Indicator</th>
          <th style="width:9%">Severity</th>
          <th style="width:13%">Note</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
}

/**
 * Render per-building progress details for in-progress exports.
 * Includes building name, units coverage, modules started, and sub-modules inspected.
 */
function generateInProgressBuildingSummary(report: any): string {
  const pData = report?.metadata?.progressData || {};
  const bMap = pData.buildingProgressMap || {};
  const buildingKeys = Object.keys(bMap).sort((a, b) => a.localeCompare(b));

  if (buildingKeys.length === 0) return '';

  const formatSubmoduleList = (entry: any, key: 'Outside' | 'Inside' | 'Units'): string => {
    const modules = entry?.modules || {};
    const subs = Array.isArray(modules?.[key]?.submodules) ? modules[key].submodules : [];
    if (subs.length === 0) return '-';
    return esc(subs.join(', '));
  };

  const rows = buildingKeys.map((buildingName) => {
    const entry = bMap[buildingName] || {};
    const outCount = Number(entry?.out || 0);
    const inCount = Number(entry?.in || 0);
    const unitCount = Number(entry?.un || 0);
    const inspectedUnits = Array.isArray(entry?.inspectedUnits) ? entry.inspectedUnits : [];

    return `
      <tr>
        <td class="la">${esc(buildingName)}</td>
        <td>${Number(entry?.totalUnits || 0)}</td>
        <td>${Number(entry?.unitsForInspection || 0)}</td>
        <td class="la">${inspectedUnits.length ? esc(inspectedUnits.join(', ')) : '-'}</td>
        <td class="la">
          Outside (${outCount})<br/>
          Inside (${inCount})<br/>
          Units (${unitCount})
        </td>
        <td class="la">
          <b>Outside:</b> ${formatSubmoduleList(entry, 'Outside')}<br/>
          <b>Inside:</b> ${formatSubmoduleList(entry, 'Inside')}<br/>
          <b>Units:</b> ${formatSubmoduleList(entry, 'Units')}
        </td>
      </tr>`;
  }).join('');

  return `
  <div class="avoid-break">
    <h3 class="section-title">In-Progress Building Summary</h3>
    <table>
      <thead>
        <tr>
          <th class="la" style="width:14%">Building</th>
          <th style="width:8%">Total Units</th>
          <th style="width:10%">Units for Inspection</th>
          <th class="la" style="width:16%">Inspected Units</th>
          <th class="la" style="width:14%">Modules</th>
          <th class="la" style="width:38%">Sub-Modules Inspected</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
}

/**
 * In-progress report template function
 */
function generateInProgressReportHTML(
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions,
  imageMap: Map<string, string>,
  logoBase64: string
): string {
  // Uses the EXACT SAME top-level UI, just replaces the deficiencies payload with the in-progress module grouping
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>NSPIRE Report (In-Progress)</title><style>${generateEnhancedStyles()}</style></head><body><div class="report-container">${generateEnhancedHeader(report.metadata, logoBase64)}${options.includeSummaryPage ? generateEnhancedSummaryPage(report.summary, report.categoryBreakdown, report.metadata, report.inspectionData, report.occupancyInfo, report.deficiencies) : ''}${options.includeDetailedDeficiencies ? generateInProgressDeficiencyTable(report, imageMap) : ''}${generateCertificatesTable()}${options.includeCertification && report.certification ? generateEnhancedCertificationSection(report.certification) : ''}${generateEnhancedFooter(options, logoBase64)}</div></body></html>`;
}

/**
 * Generate complete lightweight NSPIRE Report HTML.
 * Designed to stay under ~20KB for reliable mobile WebView PDF conversion.
 */
function generateEnhancedNSPIREReportHTML(
  report: NSPIREInspectionReport,
  options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS,
  imageMap: Map<string, string> = new Map(),
  logoBase64: string = ''
): string {
  if (report.metadata.status === 'in-progress') {
    return generateInProgressReportHTML(report, options, imageMap, logoBase64);
  }
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>NSPIRE Report</title><style>${generateEnhancedStyles()}</style></head><body><div class="report-container">${generateEnhancedHeader(report.metadata, logoBase64)}${options.includeSummaryPage ? generateEnhancedSummaryPage(report.summary, report.categoryBreakdown, report.metadata, report.inspectionData, report.occupancyInfo, report.deficiencies) : ''}${options.includeDetailedDeficiencies ? generateEnhancedDeficiencyTable(report.deficiencies, imageMap, report?.metadata?.propertyName || '') : ''}${generateCertificatesTable()}${options.includeCertification && report.certification ? generateEnhancedCertificationSection(report.certification) : ''}${generateEnhancedFooter(options, logoBase64)}</div></body></html>`;
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
    // Load logo as base64 for embedding in PDF
    const logoBase64 = await getLogoBase64();
    console.log('Logo loaded:', logoBase64 ? `${logoBase64.length} chars` : 'failed (using text fallback)');

    // ── Web: open HTML in a new browser tab and trigger the print dialog ──────
    if (Platform.OS === 'web') {
      try {
        const imageMap = await preloadDeficiencyImages(report.deficiencies || []);
        const html = generateEnhancedNSPIREReportHTML(report, options, imageMap, logoBase64);
        const win = (window as any).open('', '_blank') as Window | null;
        if (win) {
          win.document.write(html);
          win.document.close();
          // Give browser time to render before triggering the print dialog
          setTimeout(() => win.print(), 600);
        } else {
          // Fallback: create a download link
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `NSPIRE-Report-${report.metadata.inspectionNo || Date.now()}.html`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        return { uri: '', success: true };
      } catch (error: any) {
        console.error('Web PDF/Print Error:', error);
        return { uri: '', success: false, error: error.message || 'Failed to open print dialog' };
      }
    }

    // ── Native: generate PDF file via expo-print ──────────────────────────────
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

      const html = generateEnhancedNSPIREReportHTML(report, options, imageMap, logoBase64);

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
      if (Platform.OS === 'web') {
        const webResult = await this.generateEnhancedPDF(report, options);
        if (!webResult.success) {
          throw new Error(webResult.error);
        }
        return { success: true };
      }

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

    const normalizeAreaBucket = (value: unknown, fallbackIsUnit = false): string => {
      const token = String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
      if (token.includes('outside') || token.includes('site') || token.includes('exterior')) return 'Outside';
      if (token.includes('inside') || token.includes('interior') || token.includes('common')) return 'Inside';
      if (token.includes('unit')) return 'Units';
      return fallbackIsUnit ? 'Units' : 'Inside';
    };

    // Convert findings/deficiencies to enhanced NSPIRE format
    const deficiencies = (data.findings || data.deficiencies || []).map((item: any, index: number) => {
      const area = normalizeAreaBucket(
        item.area || item._area || item.inspectionArea || item.subCategory || item.category || item.inspectionType,
        !!(item.unit || item._unit || item.unitId)
      );

      return {
        id: item.id || item._id || `DEF-${index + 1}`,
        imageUri: item.imageUrl || item.imageUri || item.photos?.[0]?.url || '',
        building: item.buildingInspectionId || item.building_id || item.buildingId || item.building || data.buildingInspectionId || data.buildingId || data.building || 'B1',
        unit: item.unit || item._unit || item.unitId || data.unit || 'Unit Multiple',
        room: item.location || item.room || item.area || 'General Area',
        area,
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
      };
    });

    // Calculate enhanced summary statistics
    const summary: DeficiencySummary = {
      lifeThreatening: deficiencies.filter((d: any) => d.severity === 'Life-Threatening').length,
      severe: deficiencies.filter((d: any) => d.severity === 'Severe').length,
      moderate: deficiencies.filter((d: any) => d.severity === 'Moderate').length,
      low: deficiencies.filter((d: any) => d.severity === 'Low').length,
      total: deficiencies.length,
      byBuilding: {},
      byCategory: {},
      repeatDeficiencies: deficiencies.filter((d: any) => d.repeatIndicator).length,
      newDeficiencies: deficiencies.filter((d: any) => !d.repeatIndicator).length
    };

    // Calculate final score
    const totalDeductions = deficiencies.reduce((sum: number, def: any) => sum + def.deductionPts, 0);
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
        { type: 'Building' as any, propertyTotal: data.property?.buildings || 1, sampleSize: 1, totalUnitsInspected: 1 },
        { type: 'Unit' as any, propertyTotal: data.property?.units || 1, sampleSize: 1, totalUnitsInspected: 1 }
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
export { EnhancedNSPIREPDFReportService }; export { generateEnhancedNSPIREReportHTML as makeHTML };