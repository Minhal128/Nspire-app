/**
 * Enhanced NSPIRE PDF Report Service for Web
 *
 * Draws the NSPIRE inspection report: the summary page's preview here and,
 * through the app's copy of this file, the app's report. What the report says
 * and how it is scored is in ./reportRules; this file only lays it out.
 *
 * Top to bottom: the logo and title; the inspection's details; the preliminary
 * and final scores; the building and unit counts; the deficiency summary; a
 * block for every building of the property with its outside, inside and unit
 * deficiencies; the general comments; the certificate; the footer.
 */

import {
  collectGeneralComments,
  generalCommentFindings,
  generalCommentHeading,
  withoutGeneralComments,
} from './generalComments';
import type { GeneralCommentEntry } from './generalComments';
import {
  CERTIFICATE_STATEMENT,
  CERTIFICATE_TITLE,
  COUNT_COLUMNS,
  DEFICIENCY_COLUMNS,
  FOOTER_LINES,
  INSPECTOR_NAME_LABEL,
  POSSIBLE_SCORE,
  REPORT_TITLE,
  SCORE_AREAS,
  formatPoints,
  inspectionTypeLabel,
  reportBuilding,
  reportBuildings,
  reportScores,
  rowRules,
  scoreArea,
  scoreSeverity,
} from './reportRules';
import type { InspectionCounts, ReportScores, RowRules, ScoreArea, ScoreSeverity } from './reportRules';
import {
  type NSPIREInspectionReport,
  type DeficiencyEntry,
  type InspectionMetadata,
  type PDFGenerationOptions,
  DEFAULT_PDF_OPTIONS,
} from './nspireReport';

/** Set by the app so the report header can embed the logo without a network fetch. */
let injectedLogo = '';
export function setReportLogo(dataUri: string): void {
  injectedLogo = dataUri || '';
}

/** A deficiency as the report draws it: scored, and filed under a building. */
type ReportRow = DeficiencyEntry & RowRules & { filedUnder: string; scored: ScoreArea | null };

/** How wide each column of a deficiency table is, in the order of DEFICIENCY_COLUMNS. */
const DEFICIENCY_COLUMN_WIDTHS = ['17%', '15%', '10%', '13%', '6%', '9.5%', '7.5%', '6%', '7%', '9%'];

const SEVERITIES: ScoreSeverity[] = ['Life-Threatening', 'Severe', 'Moderate', 'Low'];

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** "Unit 2" before "Unit 10": text compared with its numbers read as numbers. */
function naturalCompare(a: string, b: string): number {
  const parts = (text: string): string[] => text.toLowerCase().match(/\d+|\D+/g) || [];
  const left = parts(a);
  const right = parts(b);
  for (let index = 0; index < Math.min(left.length, right.length); index++) {
    const bothNumbers = /^\d/.test(left[index]) && /^\d/.test(right[index]);
    if (bothNumbers) {
      const difference = Number(left[index]) - Number(right[index]);
      if (difference !== 0) return difference;
    } else if (left[index] !== right[index]) {
      return left[index] < right[index] ? -1 : 1;
    }
  }
  return left.length - right.length;
}

/**
 * The stylesheet of the report
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

    /* Header */
    .report-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .nspire-logo {
      width: 180px;
      height: auto;
      object-fit: contain;
      margin: 0 auto 20px;
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

    /* Scores: two boxes side by side */
    .scores-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .score-block {
      border: 2px solid #000000;
      padding: 12px 15px;
      text-align: left;
    }

    .score-block h3 {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 8px;
      text-decoration: underline;
    }

    .score-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .score-row.total {
      font-weight: bold;
      border-top: 1px solid #000000;
      margin-top: 5px;
      padding-top: 4px;
    }

    .score-label {
      flex: 1;
    }

    .score-value {
      font-weight: bold;
      min-width: 50px;
      text-align: right;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 15px 0;
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

    td.left-align, th.left-align {
      text-align: left;
    }

    /* Section Titles */
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      margin: 20px 0 10px 0;
      text-decoration: underline;
    }

    .inspection-data-section, .deficiency-summary-section {
      margin: 20px 0;
    }

    /* A building and its deficiencies */
    .building-section {
      margin: 22px 0 0 0;
    }

    .building-banner {
      font-size: 11pt;
      font-weight: bold;
      color: #006795;
      background: #E6F0F4;
      border: 1.5px solid #006795;
      padding: 6px 10px;
      page-break-after: avoid;
    }

    .building-section .section-title {
      margin: 12px 0 6px 0;
      page-break-after: avoid;
    }

    .unit-title {
      font-size: 10pt;
      font-weight: bold;
      margin: 8px 0 0 0;
      page-break-after: avoid;
    }

    .no-deficiencies {
      font-size: 9pt;
      font-style: italic;
      color: #555555;
      margin: 4px 0 8px 0;
    }

    /* Deficiency table: ten columns */
    .deficiency-details-table {
      table-layout: fixed;
      font-size: 7.5pt;
      margin: 6px 0 12px 0;
    }

    .deficiency-details-table th {
      font-size: 7.5pt;
      padding: 5px 3px;
    }

    .deficiency-details-table td {
      font-size: 7.5pt;
      padding: 4px 3px;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    .deficiency-image {
      width: 100%;
      max-width: 84px;
      height: 63px;
      object-fit: cover;
      border: 1px solid #000000;
      display: block;
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
      font-size: 7.5pt;
      line-height: 1.2;
    }

    /* General comments */
    .general-comments-box {
      border: 1px solid #000000;
      padding: 10px;
    }

    .general-comment {
      margin-bottom: 12px;
    }

    .general-comment:last-child {
      margin-bottom: 0;
    }

    .general-comment-where {
      font-size: 8pt;
      font-weight: bold;
      text-transform: uppercase;
    }

    .general-comment-note {
      font-size: 9pt;
      line-height: 1.4;
      margin-top: 3px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .general-comment-photos {
      margin-top: 6px;
    }

    .general-comment-photo {
      width: 100px;
      height: 75px;
      object-fit: cover;
      border: 1px solid #000000;
      display: inline-block;
      vertical-align: top;
      margin: 0 6px 6px 0;
    }

    /* Certificate */
    .certification-section {
      margin: 30px 0;
      padding: 20px;
      border: 1px solid #000000;
    }

    .certification-section .section-title {
      margin-top: 0;
    }

    .certificate-statement {
      margin-bottom: 20px;
      font-size: 9pt;
      line-height: 1.4;
    }

    .signature-area {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }

    .signature-name {
      font-size: 9pt;
      font-weight: bold;
      min-height: 12pt;
      margin-bottom: 5px;
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

    /* Footer */
    .report-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 8pt;
      color: #666666;
      border-top: 1px solid #000000;
      padding-top: 10px;
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
 * The logo, the title and the inspection's details
 */
function generateEnhancedHeader(metadata: InspectionMetadata, options: PDFGenerationOptions): string {
  // Only deviation from the web original: React Native has no window and cannot
  // resolve /logo.png, so the app injects a base64 logo through setReportLogo().
  let logoSrc = injectedLogo || '/logo.png';
  if (!injectedLogo && typeof window !== 'undefined') {
    logoSrc = window.location.origin + '/logo.png';
  }

  return `
    <div class="report-header">
      <img src="${logoSrc}" class="nspire-logo" alt="NSPIRE Logo" />

      <h1 class="header-title">${REPORT_TITLE}</h1>

      <div class="header-metadata">
        <div class="header-left">
          <div class="header-row">
            <span class="header-label">Inspection No:</span>
            <span class="header-value">${escapeHtml(metadata.inspectionNo)}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Inspection Type:</span>
            <span class="header-value">${escapeHtml(inspectionTypeLabel(metadata.inspectionType))}</span>
          </div>
          <div class="header-row">
            <span class="header-label">${INSPECTOR_NAME_LABEL}:</span>
            <span class="header-value">${escapeHtml(metadata.inspectorName || '-')}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Property Type:</span>
            <span class="header-value">Multifamily</span>
          </div>
        </div>

        <div class="header-right">
          <div class="header-row">
            <span class="header-label">Inspection Start Date:</span>
            <span class="header-value">${escapeHtml(metadata.startDate)}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Inspection End Date:</span>
            <span class="header-value">${escapeHtml(metadata.endDate)}</span>
          </div>
          <div class="header-row">
            <span class="header-label">Report Created Date:</span>
            <span class="header-value">${escapeHtml(metadata.reportCreatedDate)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * The counts a report prints: what its builder counted or, for a report built
 * before it carried them, what its table of buildings and units says.
 */
function reportCounts(report: NSPIREInspectionReport): InspectionCounts {
  if (report.inspectionCounts) return report.inspectionCounts;
  const rowOf = (type: string) =>
    (report.inspectionData || []).find((row) => String(row.type).toLowerCase().startsWith(type));
  const building = rowOf('building');
  const unit = rowOf('unit');
  return {
    buildings: Number(building?.propertyTotal) || 0,
    units: Number(unit?.propertyTotal) || 0,
    sampleSize: Number(unit?.sampleSize) || 0,
    unitsInspected: Number(unit?.totalUnitsInspected) || 0,
  };
}

/**
 * The scores, the building and unit counts, and the deficiency summary
 */
function generateEnhancedSummaryPage(scores: ReportScores, counts: InspectionCounts, rows: ReportRow[]): string {
  const found = (area: ScoreArea, severity: ScoreSeverity): number =>
    rows.filter((row) => row.scored === area && scoreSeverity(row.severity) === severity).length;

  return `
    <div class="scores-section avoid-break">
      <div class="score-block">
        <h3>Preliminary Scores</h3>
        ${SCORE_AREAS.map(({ area, label }) => `
        <div class="score-row">
          <span class="score-label">${label}:</span>
          <span class="score-value">${formatPoints(POSSIBLE_SCORE[area])}</span>
        </div>`).join('')}
        <div class="score-row total">
          <span class="score-label">Preliminary Inspection Score:</span>
          <span class="score-value">${formatPoints(scores.preliminary)}</span>
        </div>
      </div>

      <div class="score-block">
        <h3>Final Scores</h3>
        <div class="score-row">
          <span class="score-label">Preliminary Inspection Score:</span>
          <span class="score-value">${formatPoints(scores.preliminary)}</span>
        </div>
        <div class="score-row">
          <span class="score-label">Calculated Score:</span>
          <span class="score-value">${formatPoints(scores.calculated)}</span>
        </div>
        <div class="score-row total">
          <span class="score-label">Final Score:</span>
          <span class="score-value">${formatPoints(scores.final)}</span>
        </div>
      </div>
    </div>

    <div class="inspection-data-section avoid-break">
      <h3 class="section-title">Building/Unit Inspection Data</h3>
      <table class="inspection-data-table">
        <thead>
          <tr>
            ${COUNT_COLUMNS.map((column) => `<th>${column}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${counts.buildings}</td>
            <td>${counts.units}</td>
            <td>${counts.sampleSize}</td>
            <td>${counts.unitsInspected}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="deficiency-summary-section avoid-break">
      <h3 class="section-title">Deficiency Summary</h3>
      <table>
        <thead>
          <tr>
            <th class="left-align">Inspectable Area</th>
            ${SEVERITIES.map((severity) => `<th>${severity}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${SCORE_AREAS.map(({ area, label }) => `
          <tr>
            <td class="left-align">${label}</td>
            ${SEVERITIES.map((severity) => `<td>${found(area, severity)}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * One deficiency table: the ten columns of DEFICIENCY_COLUMNS
 */
function generateDeficiencyTable(rows: ReportRow[], options: PDFGenerationOptions): string {
  return `
        <table class="deficiency-details-table">
          <colgroup>
            ${DEFICIENCY_COLUMN_WIDTHS.map((width) => `<col style="width: ${width};" />`).join('')}
          </colgroup>
          <thead>
            <tr>
              ${DEFICIENCY_COLUMNS.map((column) => `<th>${column}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr class="avoid-break">
                <td class="left-align">${escapeHtml(row.deficiencyDetails || 'No details provided')}</td>
                <td class="left-align">
                  <div class="deficiency-name">${escapeHtml(row.deficiencyName)}</div>
                  <div class="nspire-code">${escapeHtml(row.nspireCode)}</div>
                  <div class="location-info">${escapeHtml(row.filedUnder)} | ${escapeHtml(row.unit || '-')}</div>
                </td>
                <td class="left-align">${escapeHtml(row.comments || 'Wait for Input')}</td>
                <td>${options.includeImages && row.imageUri
                  ? `<img src="${escapeHtml(row.imageUri)}" alt="Deficiency picture" class="deficiency-image" onerror="this.style.display='none';" />`
                  : ''}</td>
                <td>${formatPoints(row.pts)}</td>
                <td>${escapeHtml(row.severity)}</td>
                <td>${escapeHtml(row.repairTime)}</td>
                <td>${formatPoints(row.ptsLost)}</td>
                <td>${row.possibleScore === null ? '-' : formatPoints(row.possibleScore)}</td>
                <td>${escapeHtml(row.recordedAt || '-')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
  `;
}

/**
 * A building's block: its outside, inside and unit deficiencies, each said to
 * have none when it has none. The same block is drawn for every building.
 */
function generateBuildingSection(building: string, rows: ReportRow[], options: PDFGenerationOptions): string {
  const areaBlock = (area: ScoreArea, title: string): string => {
    const found = rows.filter((row) => row.scored === area);
    if (found.length === 0) {
      return `
        <h3 class="section-title">${title}</h3>
        <p class="no-deficiencies">No deficiencies found.</p>`;
    }
    if (area !== 'unit') {
      return `
        <h3 class="section-title">${title}</h3>
        ${generateDeficiencyTable(found, options)}`;
    }

    // Unit deficiencies are listed unit by unit.
    const units = new Map<string, ReportRow[]>();
    found.forEach((row) => {
      const recorded = String(row.unit || '').trim();
      const unit = !recorded || recorded === '-' ? 'Unassigned' : recorded;
      units.set(unit, [...(units.get(unit) || []), row]);
    });
    return `
        <h3 class="section-title">${title}</h3>
        ${[...units.keys()].sort(naturalCompare).map((unit) => `
        <div class="unit-title">${escapeHtml(/^unit/i.test(unit) ? unit : `Unit ${unit}`)}</div>
        ${generateDeficiencyTable(units.get(unit) || [], options)}`).join('')}`;
  };

  // A deficiency that names none of the three areas is still shown.
  const elsewhere = rows.filter((row) => row.scored === null);

  return `
    <div class="building-section">
      <div class="building-banner">Building: ${escapeHtml(building)}</div>
      ${SCORE_AREAS.map(({ area, title }) => areaBlock(area, title)).join('')}
      ${elsewhere.length > 0 ? `
        <h3 class="section-title">Other Deficiencies</h3>
        ${generateDeficiencyTable(elsewhere, options)}` : ''}
    </div>
  `;
}

/**
 * Every building of the property, each with its block
 */
function generateEnhancedDeficiencyTable(buildings: string[], rows: ReportRow[], options: PDFGenerationOptions): string {
  if (buildings.length === 0) {
    return `
      <div class="deficiency-details-section">
        <p style="text-align: center; padding: 20px; font-style: italic;">No deficiencies found during this inspection.</p>
      </div>
    `;
  }

  return buildings
    .map((building) =>
      generateBuildingSection(
        building,
        rows.filter((row) => row.filedUnder.toLowerCase() === building.toLowerCase()),
        options
      )
    )
    .join('');
}

/**
 * General comments: the inspector's notes and their pictures, per building,
 * unit and area. They are observations, not deficiencies, so they sit under
 * the deficiency tables in a block of their own, and add nothing to a total.
 */
function generateGeneralCommentsSection(entries: GeneralCommentEntry[], options: PDFGenerationOptions): string {
  if (entries.length === 0) return '';
  return `
    <div class="general-comments-section">
      <h3 class="section-title">General Comments</h3>
      <div class="general-comments-box">
        ${entries.map(entry => `
          <div class="general-comment avoid-break">
            <div class="general-comment-where">${escapeHtml(generalCommentHeading(entry))}</div>
            ${entry.note ? `<div class="general-comment-note">${escapeHtml(entry.note)}</div>` : ''}
            ${options.includeImages && entry.photos.length > 0 ? `
              <div class="general-comment-photos">
                ${entry.photos.map((photo, index) => `<img src="${escapeHtml(photo)}" alt="Comment photo ${index + 1}" class="general-comment-photo" onerror="this.style.display='none';" />`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * The certificate, signed by the inspector
 */
function generateEnhancedCertificationSection(certification: any, metadata: InspectionMetadata): string {
  const inspector = certification?.certifiedBy || metadata.inspectorName || '';
  return `
    <div class="certification-section avoid-break">
      <h3 class="section-title">${CERTIFICATE_TITLE}</h3>
      <p class="certificate-statement">${CERTIFICATE_STATEMENT}</p>

      <div class="signature-area">
        <div>
          <div class="signature-name">${escapeHtml(inspector)}</div>
          <div class="signature-line"></div>
          <div class="signature-label">${INSPECTOR_NAME_LABEL}</div>
        </div>
        <div>
          <div class="signature-name">${escapeHtml(certification?.certificationDate || '')}</div>
          <div class="signature-line" style="width: 150px;"></div>
          <div class="signature-label">Date</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * The footer
 */
function generateEnhancedFooter(options: PDFGenerationOptions): string {
  return `
    <div class="report-footer">
      ${FOOTER_LINES.map((line) => `<p>${line}</p>`).join('\n      ')}
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
  // A general comment is a comment however it reached here: listed for the
  // report, or still sitting among the rows. Either way it is shown once, in
  // the comments block, and never as a deficiency.
  const generalComments = collectGeneralComments([
    ...generalCommentFindings(report.generalCommentEntries),
    ...report.deficiencies,
  ]);

  // Every row is scored here, by the one set of rules, whoever built the
  // report: the scores above the tables are the sum of what the tables show.
  const counts = reportCounts(report);
  const names = report.buildingNames || [];
  const rows: ReportRow[] = withoutGeneralComments(report.deficiencies).map((deficiency) => ({
    ...deficiency,
    ...rowRules(deficiency, counts.sampleSize),
    filedUnder: reportBuilding(deficiency.building, names),
    scored: scoreArea(deficiency.area),
  }));
  const scores = reportScores(rows);
  const buildings = reportBuildings(names, rows);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${REPORT_TITLE}</title>
  <style>${generateEnhancedStyles(options)}</style>
</head>
<body>
  <div class="report-container">
    ${generateEnhancedHeader(report.metadata, options)}

    ${options.includeSummaryPage ? generateEnhancedSummaryPage(scores, counts, rows) : ''}

    ${options.includeDetailedDeficiencies ? generateEnhancedDeficiencyTable(buildings, rows, options) : ''}

    ${generateGeneralCommentsSection(generalComments, options)}

    <div class="avoid-break">
      ${options.includeCertification && report.certification ? generateEnhancedCertificationSection(report.certification, report.metadata) : ''}

      ${generateEnhancedFooter(options)}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Export enhanced PDF using browser print dialog
 */
export function exportEnhancedPDF(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): void {
  const html = generateEnhancedNSPIREReportHTML(report, options);

  // Open a new window with the enhanced report
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Preview enhanced report in a new tab
 */
export function previewEnhancedReport(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): void {
  const html = generateEnhancedNSPIREReportHTML(report, options);

  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
}

/**
 * Get enhanced report HTML string
 */
export function getEnhancedReportHTML(report: NSPIREInspectionReport, options: PDFGenerationOptions = DEFAULT_PDF_OPTIONS): string {
  return generateEnhancedNSPIREReportHTML(report, options);
}

export default {
  generateEnhancedNSPIREReportHTML,
  exportEnhancedPDF,
  previewEnhancedReport,
  getEnhancedReportHTML
};
