import { getEnhancedReportHTML, setReportLogo } from './web/enhancedNspirePDFService';
import type { NSPIREInspectionReport, PDFGenerationOptions } from '../types/nspireReport';

/** Use the website's complete report, including for inspections still in progress. */
export function getReportPreviewHTML(
  report: NSPIREInspectionReport,
  logo: string,
  options?: PDFGenerationOptions,
): string {
  setReportLogo(logo);
  // A document-width viewport keeps the web tables intact on a phone; users can zoom.
  return getEnhancedReportHTML(report as any, options as any).replace(
    'width=device-width, initial-scale=1.0',
    'width=900',
  );
}
