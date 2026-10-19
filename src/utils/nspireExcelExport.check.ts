/**
 * Self-check for where "Download Excel" puts the file on a phone.
 *
 *   node --experimental-strip-types \
 *     --import ./src/utils/__offlineStubs/register.mjs \
 *     src/utils/nspireExcelExport.check.ts
 *
 * What this guards: on Android the file used to be written only into the app's
 * private storage and handed to the share sheet, so an inspector who closed the
 * sheet had no file to open or print. It must now land in a device folder the
 * inspector picked, and every way that can fail must still end somewhere visible.
 *
 * It also guards where the workbook comes from. The app used to build its own
 * with SheetJS, which could never match the exceljs file web hands out; the
 * bytes must now be exactly what the server returned, untouched.
 */

import assert from 'node:assert';
import * as XLSX from 'xlsx';
import { exportNspireExcel, printNspireExcel } from './nspireExcelExport.ts';

const stub = (globalThis as any).__offlineStub;

const DIR_KEY = 'nspireExcelExportDir';
const PICKED = 'content://com.android.externalstorage.documents/tree/primary%3ADownload%2FNSPIRE%20Reports';
const REPORT = {
  metadata: { propertyName: 'Oak Court', preliminaryScore: 0, calculatedScore: 0, finalScore: 0 },
  summary: { total: 1 },
  deficiencies: [{ room: 'Kitchen', deficiencyName: 'Leak', deductionPts: 0 }],
};

/**
 * Stands in for the server's exceljs workbook. The app must hand these exact
 * bytes to the device, so the check builds something recognisable and then
 * asserts the file written is byte-identical to it.
 */
const serverWorkbook = (report: any): string => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['NSPIRE INSPECTION REPORT'],
    ['Property Name', report?.metadata?.propertyName || ''],
    ['Final Score', report?.metadata?.finalScore ?? ''],
  ]), 'Summary');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
    ['Room', 'Building', 'Unit', 'Area', 'Deficiency', 'NSPIRE Code', 'Severity', 'Deduction', 'Status', 'Details', 'Date'],
    ...(report?.deficiencies || []).map((d: any) => [
      d.room || '', d.building || '', d.unit || '', d.area || '', d.deficiencyName || '',
      d.nspireCode || '', d.severity || '', d.deductionPts ?? '',
      d.status || '', d.deficiencyDetails || '', d.inspectedDate || '',
    ]),
  ]), 'Deficiencies');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
};

let lastServed = '';

const reset = () => {
  stub.storage = {};
  stub.calls = [];
  stub.files = {};
  stub.os = 'android';
  stub.pickerResult = { granted: true, directoryUri: PICKED };
  stub.deadDirs = [];
  stub.shareAvailable = true;
  lastServed = '';
  stub.responders.excel = ({ body }: any) => {
    lastServed = serverWorkbook(JSON.parse(body).data);
    return lastServed;
  };
};
// The server fetch is an implementation detail of every export, so it is not
// part of what each case asserts about delivery.
const kinds = () => stub.calls.map((c: any) => c.kind).filter((k: string) => k !== 'excel');
const callOf = (kind: string) => stub.calls.find((c: any) => c.kind === kind);

/* ---- first export: picker opens in Download, file is saved there ---- */
{
  reset();
  const result = await exportNspireExcel(REPORT, 'NSPIRE_Report_Oak_Court');
  assert.deepStrictEqual(result, { success: true, savedTo: 'Download/NSPIRE Reports' });
  assert.deepStrictEqual(kinds(), ['picker'], 'no share sheet when the file was saved');
  assert.match(callOf('picker').payload, /primary%3ADownload$/, 'picker opens in Download');
  assert.strictEqual(stub.storage[DIR_KEY], PICKED, 'folder is remembered');

  // The report goes to the same endpoint web posts to.
  assert.strictEqual(callOf('excel').payload.endpoint, '/inspections/generate-excel');
  assert.deepStrictEqual(JSON.parse(callOf('excel').payload.body), { data: REPORT });

  const [uri, base64] = Object.entries(stub.files)[0] as [string, string];
  assert.ok(uri.startsWith(PICKED) && uri.endsWith('NSPIRE_Report_Oak_Court.xlsx'), uri);
  // The whole point: the file written is the server's bytes, not a rebuild.
  assert.strictEqual(base64, lastServed, 'written file must be the server workbook, untouched');
}

/* ---- later exports: straight into the remembered folder, no picker ---- */
{
  reset();
  stub.storage[DIR_KEY] = PICKED;
  const result = await exportNspireExcel(REPORT, 'again.xlsx');
  assert.strictEqual(result.savedTo, 'Download/NSPIRE Reports');
  assert.deepStrictEqual(kinds(), [], 'no picker, no share sheet');
}

/* ---- remembered folder deleted or grant revoked: ask again ---- */
{
  reset();
  stub.storage[DIR_KEY] = 'content://old/tree/primary%3AGone';
  stub.deadDirs = ['content://old/tree/primary%3AGone'];
  const result = await exportNspireExcel(REPORT, 'x');
  assert.strictEqual(result.savedTo, 'Download/NSPIRE Reports');
  assert.deepStrictEqual(kinds(), ['picker']);
  assert.strictEqual(stub.storage[DIR_KEY], PICKED, 'stale folder replaced');
}

/* ---- picker cancelled: fall back to the share sheet ---- */
{
  reset();
  stub.pickerResult = { granted: false };
  const result = await exportNspireExcel(REPORT, 'x');
  assert.deepStrictEqual(result, { success: true });
  assert.deepStrictEqual(kinds(), ['picker', 'share']);
  assert.ok(!(DIR_KEY in stub.storage), 'nothing remembered on cancel');
}

/* ---- picker cancelled and no share sheet: report failure, not success ---- */
{
  reset();
  stub.pickerResult = { granted: false };
  stub.shareAvailable = false;
  const result = await exportNspireExcel(REPORT, 'x');
  assert.strictEqual(result.success, false);
}

/* ---- iOS is unchanged: share sheet only ---- */
{
  reset();
  stub.os = 'ios';
  const result = await exportNspireExcel(REPORT, 'x');
  assert.deepStrictEqual(result, { success: true });
  assert.deepStrictEqual(kinds(), ['share']);
}

/* ---- Print Excel: iOS can't print an .xlsx from the share sheet, so print the sheets as HTML ---- */
for (const os of ['ios', 'android']) {
  reset();
  stub.os = os;
  const report = {
    ...REPORT,
    deficiencies: [{ room: 'Kitchen', deficiencyName: 'Leak', deficiencyDetails: 'Tag "A" <under sink> & wall', deductionPts: 0 }],
  };
  const result = await printNspireExcel(report);
  assert.deepStrictEqual(result, { success: true });
  assert.deepStrictEqual(kinds(), ['print'], 'no file or share sheet needed to print');
  const html: string = callOf('print').payload.html;
  for (const text of ['Summary', 'Deficiencies', 'Oak Court', 'Kitchen', 'Leak', 'NSPIRE Code']) {
    assert.ok(html.includes(text), `printed report includes ${text}`);
  }
  assert.ok(html.includes('Tag &#34;A&#34; &#60;under sink&#62; &#38; wall'), 'inspector text is escaped');
  assert.ok(html.includes('<td>0</td>'), 'a score/deduction of 0 prints as 0');
}

/* ---- no connection: say so plainly, and do not pretend the export is queued ---- */
{
  reset();
  stub.responders.excel = () => {
    const err: any = new Error('No internet connection. Your work is saved on this device and syncs when you reconnect.');
    err.name = 'OfflineError';
    throw err;
  };
  const result = await exportNspireExcel(REPORT, 'x');
  assert.strictEqual(result.success, false);
  assert.match(result.error || '', /needs a connection/, 'offline message names the real reason');
  assert.deepStrictEqual(kinds(), [], 'nothing written or shared when the server was never reached');
  assert.deepStrictEqual(stub.files, {}, 'no half-written file left behind');
}

console.log('nspireExcelExport.check.ts OK — server workbook written untouched, saved to a picked device folder, remembered, re-asked when revoked, share sheet on cancel, prints on iOS/Android, clear message offline');
