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
 */

import assert from 'node:assert';
import * as XLSX from 'xlsx';
import { exportNspireExcel } from './nspireExcelExport.ts';

const stub = (globalThis as any).__offlineStub;

const DIR_KEY = 'nspireExcelExportDir';
const PICKED = 'content://com.android.externalstorage.documents/tree/primary%3ADownload%2FNSPIRE%20Reports';
const REPORT = {
  metadata: { propertyName: 'Oak Court', preliminaryScore: 0, calculatedScore: 0, finalScore: 0 },
  summary: { total: 1 },
  deficiencies: [{ room: 'Kitchen', deficiencyName: 'Leak', deductionPts: 0 }],
};

const reset = () => {
  stub.storage = {};
  stub.calls = [];
  stub.files = {};
  stub.os = 'android';
  stub.pickerResult = { granted: true, directoryUri: PICKED };
  stub.deadDirs = [];
  stub.shareAvailable = true;
};
const kinds = () => stub.calls.map((c: any) => c.kind);

/* ---- first export: picker opens in Download, file is saved there ---- */
{
  reset();
  const result = await exportNspireExcel(REPORT, 'NSPIRE_Report_Oak_Court');
  assert.deepStrictEqual(result, { success: true, savedTo: 'Download/NSPIRE Reports' });
  assert.deepStrictEqual(kinds(), ['picker'], 'no share sheet when the file was saved');
  assert.match(stub.calls[0].payload, /primary%3ADownload$/, 'picker opens in Download');
  assert.strictEqual(stub.storage[DIR_KEY], PICKED, 'folder is remembered');

  const [uri, base64] = Object.entries(stub.files)[0] as [string, string];
  assert.ok(uri.startsWith(PICKED) && uri.endsWith('NSPIRE_Report_Oak_Court.xlsx'), uri);
  // The bytes written are a real workbook, and a score of 0 stays 0 (not "N/A").
  const wb = XLSX.read(base64, { type: 'base64' });
  assert.deepStrictEqual(wb.SheetNames, ['Summary', 'Deficiencies']);
  assert.strictEqual(wb.Sheets.Summary.B12.v, 0, 'final score 0 is kept');
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

console.log('nspireExcelExport.check.ts OK — saved to a picked device folder, remembered, re-asked when revoked, share sheet on cancel');
