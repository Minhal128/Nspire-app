/**
 * NSPIRE Excel export
 *
 * Shared by the screens that offer a "Download Excel" action. Takes a report in
 * the shape produced by generateNSPIREReport() (metadata / summary / deficiencies).
 *
 * The workbook itself is built by the server, by the same endpoint and the same
 * exceljs generator the web portal posts to, so the file an inspector gets here
 * is byte for byte the file web gives. It used to be built on the phone with
 * SheetJS instead: a second implementation of the same report that could never
 * match, because SheetJS cannot write the fonts, fills and column styling
 * exceljs does. Only the delivery below — Android folder, share sheet, print —
 * is the app's own.
 *
 * Capturing an inspection still works offline; exporting it does not, which is
 * also true of the unlock check that gates these buttons.
 */

import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequestBase64, isUnreachableError } from '../services/api';

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

/**
 * Ask the server for the workbook, base64-encoded.
 *
 * This is the one place the file comes from. Web posts the same report to the
 * same endpoint, so whatever changes there changes here too, and the two can
 * never drift apart again.
 */
export const fetchNspireWorkbookBase64 = (report: any): Promise<string> =>
  apiRequestBase64('/inspections/generate-excel', {
    method: 'POST',
    body: JSON.stringify({ data: report }),
  });

/**
 * OfflineError says the work is saved and will sync, which is true of an
 * inspection but not of an export — nothing is queued here, so say what the
 * inspector actually has to do.
 */
const exportError = (error: any): string =>
  isUnreachableError(error)
    ? 'The Excel report is built on the server, so this needs a connection. Your inspection is safe on this device.'
    : error?.message || 'Unknown error';

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Only the web branch needs raw bytes; React Native writes the base64 directly. */
const decodeBase64 = (base64: string): number[] => {
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const n =
      (BASE64_ALPHABET.indexOf(clean[i]) << 18) |
      (BASE64_ALPHABET.indexOf(clean[i + 1]) << 12) |
      ((i + 2 < clean.length ? BASE64_ALPHABET.indexOf(clean[i + 2]) : 0) << 6) |
      (i + 3 < clean.length ? BASE64_ALPHABET.indexOf(clean[i + 3]) : 0);
    bytes.push((n >> 16) & 0xff);
    if (i + 2 < clean.length) bytes.push((n >> 8) & 0xff);
    if (i + 3 < clean.length) bytes.push(n & 0xff);
  }
  return bytes;
};

/**
 * Fetch the workbook and save it to a device folder (Android), hand it to the
 * share sheet (iOS, or Android if the folder picker is cancelled), or download it (web).
 */
export const exportNspireExcel = async (report: any, fileName: string): Promise<ExcelExportResult> => {
  try {
    const wbout = await fetchNspireWorkbookBase64(report);
    const safeName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;

    if (Platform.OS === 'web') {
      const blob = new Blob([new Uint8Array(decodeBase64(wbout))], { type: XLSX_MIME });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { success: true };
    }

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
    return { success: false, error: exportError(error) };
  }
};

const escapeHtml = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * The same sheets as the .xlsx, as printable HTML tables.
 *
 * Reads back the server's workbook rather than laying the rows out again, so
 * print cannot drift from the file the inspector downloads.
 */
export const nspireWorkbookHtml = async (report: any): Promise<string> => {
  const workbook = XLSX.read(await fetchNspireWorkbookBase64(report), { type: 'base64' });
  const tables = workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[name], { header: 1, defval: '' });
    const body = rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
    return `<h2>${escapeHtml(name)}</h2><table>${body}</table>`;
  }).join('');
  return `<html><head><meta charset="utf-8"><style>
    @page { size: landscape; margin: 12mm; }
    body { font-family: -apple-system, Roboto, Arial, sans-serif; font-size: 10px; }
    h2 { font-size: 14px; margin: 16px 0 6px; }
    h2:not(:first-child) { page-break-before: always; }
    table { border-collapse: collapse; width: 100%; }
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
    const html = await nspireWorkbookHtml(report);
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
    return { success: false, error: exportError(error) };
  }
};

export default exportNspireExcel;
