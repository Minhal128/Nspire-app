/**
 * NSPIRE Excel export
 *
 * Shared by the screens that offer a "Download Excel" action. Takes a report in
 * the shape produced by generateNSPIREReport() (metadata / summary / deficiencies)
 * and writes the same two-sheet workbook the web portal produces.
 *
 * ponytail: InspectionSummaryScreen still carries its own inline copy of this
 * workbook builder. Fold it into this util the next time that screen is touched.
 */

import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export interface ExcelExportResult {
  success: boolean;
  error?: string;
}

export const buildNspireWorkbook = (report: any): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  const metadata = report?.metadata || {};
  const summary = report?.summary || {};

  const summaryData = [
    ['NSPIRE INSPECTION REPORT'],
    [],
    ['Property Name', metadata.propertyName || ''],
    ['Property Address', metadata.propertyAddress || ''],
    ['Inspection Number', metadata.inspectionNo || ''],
    ['Inspection Date', metadata.startDate || ''],
    ['Inspector', metadata.inspectorName || ''],
    [],
    ['SCORES'],
    ['Preliminary Score', metadata.preliminaryScore ?? 'N/A'],
    ['Calculated Score', metadata.calculatedScore ?? 'N/A'],
    ['Final Score', metadata.finalScore ?? 'N/A'],
    [],
    ['DEFICIENCY SUMMARY'],
    ['Life Threatening', summary.lifeThreatening || 0],
    ['Severe', summary.severe || 0],
    ['Moderate', summary.moderate || 0],
    ['Low', summary.low || 0],
    ['Total Deficiencies', summary.total || 0],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 25 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const deficiencyHeaders = [
    'Room', 'Building', 'Unit', 'Area', 'Deficiency',
    'NSPIRE Code', 'Severity', 'Deduction', 'Status', 'Details', 'Date',
  ];
  const deficiencyRows = (report?.deficiencies || []).map((def: any) => [
    def.room || '',
    def.building || '',
    def.unit || '',
    def.area || '',
    def.deficiencyName || '',
    def.nspireCode || '',
    def.severity || '',
    def.deductionPts ?? '',
    def.status || '',
    def.deficiencyDetails || '',
    def.inspectedDate || '',
  ]);
  const deficiencySheet = XLSX.utils.aoa_to_sheet([deficiencyHeaders, ...deficiencyRows]);
  deficiencySheet['!cols'] = [
    { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 25 },
    { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 30 }, { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(workbook, deficiencySheet, 'Deficiencies');

  return workbook;
};

/**
 * Build the workbook and hand it to the OS share sheet (native) or download it (web).
 */
export const exportNspireExcel = async (report: any, fileName: string): Promise<ExcelExportResult> => {
  try {
    const workbook = buildNspireWorkbook(report);
    const safeName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;

    if (Platform.OS === 'web') {
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: XLSX_MIME });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { success: true };
    }

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
    const filePath = `${FileSystem.documentDirectory}${safeName}`;
    await FileSystem.writeAsStringAsync(filePath, wbout, { encoding: FileSystem.EncodingType.Base64 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: XLSX_MIME,
        dialogTitle: 'NSPIRE Inspection Report (Excel)',
        UTI: 'org.openxmlformats.spreadsheetml.sheet',
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export default exportNspireExcel;
