/**
 * NSPIRE Excel export
 *
 * Shared by the screens that offer a "Download Excel" action. Takes a report in
 * the shape produced by generateNSPIREReport() (metadata / summary / deficiencies)
 * and writes the same two-sheet workbook the web portal produces.
 *
 */

import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const EXCEL_DIR_KEY = 'nspireExcelExportDir';

export interface ExcelExportResult {
  success: boolean;
  error?: string;
  /** Android only: the device folder the file was saved into. */
  savedTo?: string;
}

/**
 * Write the file into a device folder the user picks once (the grant is persisted
 * and remembered). Returns that folder's name, or null if the picker was cancelled.
 */
const saveToAndroidFolder = async (fileName: string, base64: string): Promise<string | null> => {
  const SAF = FileSystem.StorageAccessFramework;
  const write = async (dirUri: string) => {
    const uri = await SAF.createFileAsync(dirUri, fileName, XLSX_MIME);
    await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
    return decodeURIComponent(dirUri).split(':').pop() || 'the chosen folder';
  };

  const remembered = await AsyncStorage.getItem(EXCEL_DIR_KEY);
  if (remembered) {
    try {
      return await write(remembered);
    } catch {
      await AsyncStorage.removeItem(EXCEL_DIR_KEY); // grant revoked or folder deleted: ask again
    }
  }

  // Android 11+ won't grant the Download root itself, only a folder inside it,
  // so open the picker there and let the user pick/create one.
  const perm = await SAF.requestDirectoryPermissionsAsync(SAF.getUriForDirectoryInRoot('Download'));
  if (!perm.granted) return null;
  await AsyncStorage.setItem(EXCEL_DIR_KEY, perm.directoryUri);
  return write(perm.directoryUri);
};

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
 * Build the workbook and save it to a device folder (Android), hand it to the
 * share sheet (iOS, or Android if the folder picker is cancelled), or download it (web).
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

    // Android: the share sheet alone never put the file anywhere the inspector could
    // find (or print) it, so save it into a device folder first.
    if (Platform.OS === 'android') {
      const savedTo = await saveToAndroidFolder(safeName, wbout);
      if (savedTo) return { success: true, savedTo };
      // Picker cancelled: fall through to the share sheet.
    }

    const filePath = `${FileSystem.documentDirectory}${safeName}`;
    await FileSystem.writeAsStringAsync(filePath, wbout, { encoding: FileSystem.EncodingType.Base64 });

    if (!(await Sharing.isAvailableAsync())) {
      return { success: false, error: 'Sharing is not available on this device.' };
    }
    await Sharing.shareAsync(filePath, {
      mimeType: XLSX_MIME,
      dialogTitle: 'NSPIRE Inspection Report (Excel)',
      UTI: 'org.openxmlformats.spreadsheetml.sheet',
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

const escapeHtml = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** The same two sheets as the .xlsx, as printable HTML tables. */
export const nspireWorkbookHtml = (report: any): string => {
  const workbook = buildNspireWorkbook(report);
  const tables = workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[name], { header: 1, defval: '' });
    const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    return `<h2>${escapeHtml(name)}</h2><table>${body}</table>`;
  }).join('');
  return `<html><head><meta charset="utf-8"><style>
    @page { size: landscape; margin: 12mm; }
    body { font-family: -apple-system, Roboto, Arial, sans-serif; font-size: 10px; }
    h2 { font-size: 14px; margin: 16px 0 6px; }
    table { border-collapse: collapse; width: 100%; page-break-after: always; }
    td { border: 1px solid #999; padding: 3px 5px; vertical-align: top; }
  </style></head><body>${tables}</body></html>`;
};

/**
 * Open the OS print dialog for the Excel report. iOS can't print an .xlsx from the
 * share sheet and many phones have no spreadsheet app, so this prints the same
 * sheets as HTML instead of relying on the file.
 */
export const printNspireExcel = async (report: any): Promise<ExcelExportResult> => {
  try {
    const html = nspireWorkbookHtml(report);
    if (Platform.OS === 'web') {
      // expo-print on web prints the app page, not the html.
      const win = window.open('', '_blank');
      if (!win) return { success: false, error: 'Allow pop-ups to print the report.' };
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 600);
      return { success: true };
    }
    await Print.printAsync({ html, orientation: Print.Orientation.landscape });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Unknown error' };
  }
};

export default exportNspireExcel;
