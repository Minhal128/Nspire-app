/**
 * Self-check of the report: its rules, and the document drawn with them.
 *
 *   node --experimental-strip-types --import ./src/utils/__offlineStubs/register.mjs src/utils/reportRules.check.ts
 *
 * The client's correction sheet ("Report Correction"), as assertions:
 *
 *   K  Inspection Type reads "NSPIRE Public"; "Escort Name" is "Inspector Name".
 *   A  Preliminary = Outside 25 + Inside 25 + Units 50 = 100; Calculated is the
 *      sum of the points lost; Final = 100 - lost. No thresholds.
 *   B  Number of Building(s) | Number of Unit(s) | Sample Size | Total Unit Inspected.
 *   C  The deficiency summary lists Outside, Inside, Units, in that order.
 *   D  Every building of the property has its block, the clean ones too.
 *   R  Def Detail | Def Name/Location | Note | Pic | PTS | Severity |
 *      Repair Time | Pts Lost | Possible Score | Date/Time. No "Repeat".
 *   G  "Certificate", with the certificates statement.
 *   X  The footer names NSPIREInspectionApp.Com and State Licensees Corp.
 *
 * Set REPORT_HTML_OUT=<file> to keep the sample report this draws.
 */

import assert from 'node:assert';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import {
  BASE_POINTS,
  CERTIFICATE_STATEMENT,
  COUNT_COLUMNS,
  DEFICIENCY_COLUMNS,
  FOOTER_LINES,
  POSSIBLE_SCORE,
  PRELIMINARY_SCORE,
  deficiencyScore,
  findingFacts,
  findingKey,
  formatDateTime,
  formatPoints,
  propertyBuildings,
  repairTime,
  reportBuilding,
  reportBuildings,
  reportScores,
  rowRules,
  sampleSize,
  scoreArea,
} from '../services/web/reportRules.ts';
import * as rules from '../services/web/reportRules.ts';
import { generateEnhancedNSPIREReportHTML, setReportLogo } from '../services/web/enhancedNspirePDFService.ts';
import { DEFAULT_PDF_OPTIONS } from '../services/web/nspireReport.ts';
import { getUnitsToInspect } from '../services/unitSamplingService.ts';

const root = new URL('../..', import.meta.url);

// --- A: the scores ---------------------------------------------------------------
assert.deepStrictEqual(POSSIBLE_SCORE, { outside: 25, inside: 25, unit: 50 });
assert.strictEqual(PRELIMINARY_SCORE, 100, 'the three areas add up to 100');
assert.deepStrictEqual(reportScores([]), {
  preliminary: 100,
  calculated: 0,
  final: 100,
  lost: { outside: 0, inside: 0, unit: 0 },
}, 'nothing found: nothing lost');
assert.deepStrictEqual(
  reportScores([{ ptsLost: 1.64, area: 'Unit' }, { ptsLost: 0.5, area: 'outside' }, { ptsLost: 3.03, area: 'Inside' }]),
  { preliminary: 100, calculated: 5.17, final: 94.83, lost: { outside: 0.5, inside: 3.03, unit: 1.64 } },
  'calculated is the sum of the points lost; final is 100 less that',
);
assert.strictEqual(reportScores([{ ptsLost: 70 }, { ptsLost: 45.5 }]).final, 0, 'a final score does not go below 0');
assert.strictEqual(reportScores([{ ptsLost: 70 }, { ptsLost: 45.5 }]).calculated, 115.5, 'the points lost are still shown in full');

// --- R: the points of one deficiency ----------------------------------------------
// PTS by area and severity, over the sample size.
assert.deepStrictEqual(deficiencyScore({ area: 'unit', severity: 'Severe' }, 9), {
  area: 'unit', pts: 14.8, ptsLost: 1.64, possibleScore: 50,
});
assert.deepStrictEqual(deficiencyScore({ area: 'Outside', severity: 'moderate' }, 9), {
  area: 'outside', pts: 4.5, ptsLost: 0.5, possibleScore: 25,
});
assert.deepStrictEqual(deficiencyScore({ area: 'inside', severity: 'Life-Threatening' }, 9), {
  area: 'inside', pts: 27.25, ptsLost: 3.03, possibleScore: 25,
});
assert.strictEqual(deficiencyScore({ area: 'unit', severity: 'Low' }, 0).ptsLost, BASE_POINTS.unit.Low, 'no sample size counts as one');

// The app's finding keeps its area, severity, formula and points under other names.
assert.deepStrictEqual(
  deficiencyScore({ _area: 'Unit', deficiency: { severity: 'Life-Threatening', pointsFormula: '60/n' } }, 9),
  { area: 'unit', pts: 60, ptsLost: 6.67, possibleScore: 50 },
  'the formula recorded with a deficiency is its PTS',
);
assert.strictEqual(
  deficiencyScore({ _area: 'Outside', deficiency: { severity: 'Life-Threatening', pointsLostRaw: 49.6 } }, 9).pts,
  49.6,
  'the points recorded with a deficiency are its PTS',
);
assert.strictEqual(
  deficiencyScore({ area: 'inside', severity: 'Life-Threatening', pointsFormula: '27.25/50xn' }, 9).ptsLost,
  0.06,
  'a call-for-aid formula divides by fifty times the sample size',
);
assert.strictEqual(
  deficiencyScore({ _area: 'Unit', deficiency: { severity: 'Life-Threatening', name: 'Carbon monoxide alarm is inoperable' } }, 9).pts,
  0,
  'a smoke or CO alarm takes no points off',
);
// The old flat points (10 / 6 / 3 / 1) a row may still carry are not points lost.
assert.strictEqual(
  deficiencyScore({ area: 'unit', severity: 'Severe', deductionPts: 6 }, 9).ptsLost,
  1.64,
  'deductionPts from an older build is not read back as points lost',
);
// A row that has been scored keeps its numbers when it is scored again.
const once = { area: 'inside', severity: 'Life-Threatening', pointsFormula: '27.25/50xn' };
const scored = { area: 'inside', severity: 'Life-Threatening', ...rowRules(once, 9) };
assert.deepStrictEqual(rowRules(scored, 9), rowRules(once, 9), 'scoring a scored row changes nothing');
assert.strictEqual(deficiencyScore({ severity: 'Moderate' }, 9).possibleScore, null, 'no area: no possible score');

// Repair time and date.
assert.strictEqual(repairTime('24Hrs', 'Low'), '24 Hours');
assert.strictEqual(repairTime('24 Hrs.', 'Low'), '24 Hours');
assert.strictEqual(repairTime('30 Day', 'Severe'), '30 Days');
assert.strictEqual(repairTime('60 Day', 'Severe'), '60 Days');
assert.strictEqual(repairTime('', 'Life-Threatening'), '24 Hours', 'none recorded: by severity');
assert.strictEqual(repairTime(undefined, 'Moderate'), '30 Days');
assert.strictEqual(repairTime(undefined, 'Low'), '60 Days');
assert.strictEqual(repairTime('N/A', 'Severe'), 'N/A');
assert.strictEqual(formatDateTime(new Date(2026, 10, 14, 15, 5)), '11/14/2026 03:05 PM');
assert.strictEqual(formatDateTime(new Date(2026, 0, 2, 0, 7)), '01/02/2026 12:07 AM');
assert.strictEqual(formatDateTime(''), '');
assert.strictEqual(formatDateTime('not a date'), '');
assert.strictEqual(formatPoints(1.005), '1.01');
assert.strictEqual(formatPoints(25), '25.00');
assert.strictEqual(scoreArea('Common Area'), 'inside');
assert.strictEqual(scoreArea('Site'), 'outside');
assert.strictEqual(scoreArea('UNITS'), 'unit');
assert.strictEqual(scoreArea('-'), null);

// --- reading a finding: the web's shape and the app's ---------------------------------
const webFinding = {
  area: 'outside', building: 'B1', unit: '-', title: 'Chimney is damaged', description: 'Flue is cracked',
  notes: 'North side', nspireCode: 'chim_out_1', severity: 'Life-Threatening', imageUri: 'https://x/y.jpg',
};
const appFinding = {
  deficiency: { id: 'chim_out_1', name: 'Chimney is damaged', detail: 'Flue is cracked', severity: 'Life-Threatening', code: 'chim_out_1' },
  building: 'B1', buildingInspectionId: 'B1', _area: 'Outside', _unit: 'B1', note: 'North side', imageUrl: 'https://x/y.jpg', imageUri: null,
};
const expectedFacts = { name: 'Chimney is damaged', details: 'Flue is cracked', note: 'North side', code: 'chim_out_1', building: 'B1', unit: '', area: 'outside', severity: 'Life-Threatening', picture: 'https://x/y.jpg' };
assert.deepStrictEqual(findingFacts(webFinding), expectedFacts, 'a finding the web saved');
assert.deepStrictEqual(findingFacts(appFinding), expectedFacts, 'the same finding as the app saves it reads the same');
assert.strictEqual(findingKey(appFinding), findingKey(webFinding), 'and is the same finding');
assert.notStrictEqual(findingKey(appFinding), '', 'a finding from the app is not a blank record');
assert.strictEqual(findingKey({ area: 'unit', building: 'B1', unit: '101' }), '', 'a record with no name and no description is');
// The summary stamps a record's own place on a finding that has none; the
// app's findings sit in a record whose place is "ALL_UNITS", which is no unit.
assert.strictEqual(
  findingFacts({ ...appFinding, deficiency: { ...appFinding.deficiency }, _area: 'Unit', _unit: 'Unit 003', unit: 'ALL_UNITS', area: 'Report_draft_property' }).unit,
  'Unit 003',
  'a finding keeps its own unit over a record\'s "ALL_UNITS"',
);
assert.strictEqual(findingFacts({ area: 'Report_draft_property', _area: 'Unit' }).area, 'unit');
// A finding in none of the three areas keeps its unit and its place apart.
assert.notStrictEqual(
  findingKey({ area: 'Kitchen', building: 'B1', unit: '101', title: 'Leak' }),
  findingKey({ area: 'Kitchen', building: 'B1', unit: '102', title: 'Leak' }),
);
assert.notStrictEqual(
  findingKey({ area: 'Kitchen', building: 'B1', unit: '101', title: 'Leak' }),
  findingKey({ area: 'Bath', building: 'B1', unit: '101', title: 'Leak' }),
);
// A report row, read again, says what it said.
assert.strictEqual(findingFacts({ deficiencyName: 'Leak', deficiencyDetails: 'Under sink', comments: 'noted', area: 'Units', unit: 'Unit 002', building: 'B2' }).unit, 'Unit 002');

// --- D: the buildings ---------------------------------------------------------------
const property = {
  buildings: 4,
  units: 11,
  buildingDetails: [{ buildingId: 'B1' }, { buildingId: 'B2' }, { buildingId: 'BLDG C' }],
};
assert.deepStrictEqual(propertyBuildings(property), ['B1', 'B2', 'BLDG C', 'B4'], 'named buildings by name, the rest B<n>');
assert.deepStrictEqual(propertyBuildings({ buildings: 2 }), ['B1', 'B2']);
assert.deepStrictEqual(propertyBuildings(null), []);
const names = propertyBuildings(property);
assert.strictEqual(reportBuilding('b3', names), 'BLDG C', 'a default id reads as the property\'s own name');
assert.strictEqual(reportBuilding('bldg c', names), 'BLDG C');
assert.strictEqual(reportBuilding('Annex', names), 'Annex', 'a building the property does not know keeps its name');
assert.deepStrictEqual(
  reportBuildings(names, [{ building: 'B2' }, { building: 'Annex' }]),
  ['B1', 'B2', 'BLDG C', 'B4', 'Annex'],
  'every building of the property, then any other a row names',
);

// --- the document -------------------------------------------------------------------
const picture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const row = (id: string, building: string, unit: string, area: string, severity: string, name: string, more: Record<string, unknown> = {}) => ({
  id,
  building,
  unit,
  room: '-',
  area,
  deficiencyName: name,
  nspireCode: id,
  deficiencyDetails: `${name} (details)`,
  comments: '',
  deductionPts: 0,
  repeatIndicator: false,
  severity,
  healthAndSafety: severity,
  repairTimeline: '',
  inspectedDate: '11/14/2026',
  inspectedTime: '',
  inspectorId: 'INS-1',
  status: 'Open',
  ...more,
});
const sample: any = {
  reportId: 'RPT-CHECK',
  version: '1.0',
  generatedAt: '2026-11-14T12:00:00.000Z',
  metadata: {
    inspectionNo: 'INSP-MWH4ZR6T',
    inspectionType: 'general',
    escortName: '-',
    propertyAddress: '1 Sample Street',
    propertyName: 'Sample Court',
    propertyId: 'P-1',
    startDate: '11/14/2026',
    startTime: '',
    endDate: '11/14/2026',
    endTime: '',
    reportCreatedDate: '11/14/2026',
    preliminaryScore: 0,
    finalScore: 0,
    calculatedScore: 0,
    healthSafetyThreshold: 60,
    physicalConditionThreshold: 60,
    inspectorName: 'Dana Inspector',
    inspectorId: 'INS-1',
  },
  inspectionData: [],
  inspectionCounts: { buildings: 4, units: 11, sampleSize: 9, unitsInspected: 6 },
  buildingNames: names,
  occupancyInfo: { totalUnits: 11, occupiedUnits: 11, vacantUnits: 0, occupancyRate: 100 },
  summary: {} as any,
  categoryBreakdown: [],
  deficiencies: [
    row('cfa_2', 'B1', 'Unit 001', 'unit', 'Severe', 'Call-for-aid system is blocked', { imageUri: picture, repairTimeline: '24Hrs', recordedAt: formatDateTime(new Date(2026, 10, 14, 10, 30)) }),
    row('door_out_2', 'B2', '-', 'outside', 'Moderate', 'The garage door does not open', { comments: 'North side <garage>' }),
    row('chim_out_1', 'B2', '-', 'Outside', 'Life-Threatening', 'Chimney is damaged', { pts: 49.6 }),
    row('call_aid_1', 'B2', '-', 'inside', 'Life-Threatening', 'System does not function properly'),
    row('ceiling_2', 'B2', '-', 'Inside', 'Moderate', 'Ceiling has a hole'),
    row('door_fire_2', 'B2', 'Unit 010', 'Unit', 'Severe', 'A fire-labeled door assembly has a hole'),
    row('flam_1', 'B2', 'Unit 002', 'Unit', 'Life-Threatening', 'Flammable material near an appliance'),
    row('co_1', 'b3', '001', 'unit', 'Life-Threatening', 'Carbon monoxide alarm is inoperable'),
    row('cab_1', 'BLDG C', '003', 'unit', 'Moderate', 'Food storage space is not present'),
    row('GEN-NOTE', 'B2', 'Unit 002', 'unit', 'Low', 'General Comment', { isGeneralComment: true, comments: 'needs work' }),
  ],
  generalCommentEntries: [],
  certification: {
    certifiedBy: 'Dana Inspector',
    certificationDate: '11/14/2026',
    certificationStatement: 'I certify that this inspection was conducted in accordance with HUD NSPIRE protocols.',
  },
};

const html = generateEnhancedNSPIREReportHTML(sample, DEFAULT_PDF_OPTIONS);
if (process.env.REPORT_HTML_OUT) writeFileSync(process.env.REPORT_HTML_OUT, html);

const text = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const order = (...parts: string[]) => {
  let from = 0;
  for (const part of parts) {
    const at = text.indexOf(part, from);
    assert.ok(at >= 0, `the report should read "${part}" after "${parts[Math.max(0, parts.indexOf(part) - 1)]}"`);
    from = at + part.length;
  }
};

// K
order('Inspection No: INSP-MWH4ZR6T', 'Inspection Type: NSPIRE Public', 'Inspector Name: Dana Inspector', 'Property Type:');
assert.ok(text.includes('Escort Name:'), 'reference metadata includes Escort Name');
assert.ok(!text.includes('General NSPIRE') && !/Inspection Type: general/.test(text), 'K: the inspection type is NSPIRE Public');

// A -- 14.8/9 + 4.5/9 + 49.6/9 + 27.25/9 + 5/9 + 14.8/9 + 30/9 + 0 + 5.5/9, each rounded to the cent
const lost = [1.64, 0.5, 5.51, 3.03, 0.56, 1.64, 3.33, 0, 0.61];
const calculated = lost.reduce((sum, points) => sum + points, 0);
order(
  'Preliminary Scores', 'Outside: 25', 'Inside: 25', 'Units: 50', 'Preliminary Inspection Score: 100.00',
  'Final Scores', 'Preliminary Inspection Score: 100.00', `Calculated Score: ${calculated.toFixed(2)}`, `Final Score: ${(100 - calculated).toFixed(2)}`,
);
assert.ok(!text.includes('Threshold'), 'A: the thresholds are gone');

// B
order('Building/Unit Inspection Data', ...COUNT_COLUMNS, '4 11 6 9 6');
assert.ok(!text.includes('Property Total') && !text.includes('Common Area'), 'B: the per-type table is replaced');

// C
order('Deficiency Summary', 'Inspectable Area', 'Life-Threatening', 'Severe', 'Moderate', 'Low', 'Outside 1 0 1 0', 'Inside 1 0 1 0', 'Units 2 2 1 0');

// D -- all four buildings, in the property's order; B4 has nothing and still has its block
order('Building: B1', 'Building: B2', 'Building: BLDG C', 'Building: B4');
order('Building: B1', 'Outside Deficiencies', 'No deficiencies found.', 'Inside Deficiencies', 'No deficiencies found.', 'Unit Deficiencies', 'Unit 001', 'Building: B2');
order('Building: B4', 'Outside Deficiencies', 'No deficiencies found.', 'Inside Deficiencies', 'No deficiencies found.', 'Unit Deficiencies', 'No deficiencies found.');
order('Building: B2', 'Unit Deficiencies', 'Unit 002', 'Unit 010', 'Building: BLDG C');
order('Building: BLDG C', 'Unit 001', 'Carbon monoxide alarm is inoperable', 'Unit 003', 'Building: B4');
assert.ok(!text.includes('Building: b3'), 'D: a row recorded against B3 is filed under the building\'s own name');

// R
order('Building: B1', ...DEFICIENCY_COLUMNS, 'Call-for-aid system is blocked', '14.80 Severe 24 hrs 1.64 50 11/14/2026 10:30 AM');
order('Chimney is damaged', '49.60 Life-Threatening 24 hrs 5.51 25');
order('Carbon monoxide alarm is inoperable', '0.00 Life-Threatening 24 hrs 0.00 50');
assert.ok(!/Repeat/.test(text), 'R: the Repeat column is gone');
assert.ok(text.includes('North side &lt;garage&gt;'), 'what an inspector typed is shown as text, not read as markup');

// General comments stay a block of their own and score nothing.
order('Building: B2', 'Unit Deficiencies', 'General Comments', 'needs work', 'Building: BLDG C', 'Certificate');
assert.strictEqual((text.match(/General Comment /g) || []).length, 0, 'a general comment is not a deficiency row');

// G
order('Certificate', CERTIFICATE_STATEMENT, 'Dana Inspector', 'Inspector Name', '11/14/2026', 'Date');
assert.ok(!text.includes('Inspector Certification') && !text.includes('HUD NSPIRE protocols'), 'G: the old certification is gone');
assert.ok(!text.includes('Valid until'), 'the made-up certificates table is gone');

// X
order('Date', ...FOOTER_LINES);
assert.ok(!text.includes('Generated by NSPIRE Inspection System'), 'X: the old footer is gone');
assert.ok(text.includes('NSPIREInspectionApp.Com') && text.includes('State Licensees Corp'));

// --- the sample size --------------------------------------------------------------
// What a deficiency's points are divided by is the table the units to inspect
// are picked with. The rules write it out again (the server needs it and has a
// different table of its own); the two must not come apart.
for (let units = 1; units <= 1200; units++) {
  assert.strictEqual(
    sampleSize(units),
    getUnitsToInspect(units),
    `a property of ${units} units: the report's sample size and the units picked for inspection differ`,
  );
}
// A property may have no units at all. The app's picker throws for one, so no
// screen that scores a report may reach for it: they ask the rules.
assert.strictEqual(sampleSize(0), 0, 'a property with no units has no sample, and scoring it must not throw');
assert.throws(() => getUnitsToInspect(0), 'the picker no longer throws for no units — the note above is out of date');
for (const file of ['src/screens/InspectionSummaryScreen.tsx', 'src/screens/NSPIREReportScreen.tsx', 'src/utils/nspireReportUtils.ts']) {
  const source = readFileSync(fileURLToPath(new URL(file, root)), 'utf8');
  assert.ok(
    source.includes('sampleSizeFor(totalUnits)') && !source.includes('getUnitsToInspect'),
    `${file}: the sample size a report is scored by comes from the report rules`,
  );
}
assert.strictEqual(deficiencyScore({ area: 'outside', severity: 'Severe' }, sampleSize(0)).ptsLost, 12.2, 'no units: an outside deficiency still scores');

// --- the spreadsheet's rows -----------------------------------------------------
// The server draws the sheet from the rows a screen sends, and can show only
// what a row carries. The report made from a saved inspection (Inspection
// Status) left out the item inspected, a note typed on the website (saved as
// `notes`, where this app saves `note`), and the standard and protocol saved
// with a finding made there; the website's summary left out the item too. So
// one inspection came out as a different sheet from each button.
{
  const builder = readFileSync(fileURLToPath(new URL('src/utils/nspireReportUtils.ts', root)), 'utf8');
  for (const field of [
    "itemName: finding.itemName || finding.item || ''",
    "note: finding.notes || finding.note || finding.comments || ''",
    "standard: finding.standard || ''",
    "inspectionProtocol: finding.inspectionProtocol || finding.protocol || ''",
  ]) {
    assert.ok(builder.includes(field), `nspireReportUtils.ts: a report row should carry \`${field}\``);
  }
  const summaryScreen = readFileSync(fileURLToPath(new URL('src/screens/InspectionSummaryScreen.tsx', root)), 'utf8');
  assert.ok(summaryScreen.includes('itemName: defItem.itemName'), 'InspectionSummaryScreen.tsx: a report row should carry the item inspected');

  const webApp = new URL('../inspire-web/app/', root);
  if (existsSync(fileURLToPath(webApp))) {
    for (const portal of ['dashboard', 'management/dashboard', 'asset-manager/dashboard', 'other/dashboard', 'admin']) {
      const page = readFileSync(fileURLToPath(new URL(`${portal}/inspection/summary/page.tsx`, webApp)), 'utf8');
      assert.ok(
        page.includes("itemName: finding.itemName || finding.item || ''"),
        `inspire-web/app/${portal}/inspection/summary/page.tsx: a report row should carry the item inspected`,
      );
    }
  }
}

// --- the server draws the same document, by the same rules ------------------------
const require = createRequire(import.meta.url);
const read = (url: URL) => readFileSync(fileURLToPath(url), 'utf8').replace(/\r\n/g, '\n');
const serverCopy = new URL('../inspire-backend/utils/webReport/', root);
const webLib = new URL('../inspire-web/lib/', root);

if (existsSync(fileURLToPath(serverCopy))) {
  const server = require(fileURLToPath(new URL('reportRules.js', serverCopy)));
  const mine = rules as Record<string, any>;
  for (const name of Object.keys(mine)) {
    assert.ok(name in server, `the server's reportRules.js has no ${name}: run inspire-backend/scripts/syncWebReport.js`);
    if (typeof mine[name] !== 'function') {
      assert.deepStrictEqual(server[name], mine[name], `the server's ${name} differs from the app's`);
    }
  }
  for (const finding of sample.deficiencies) {
    assert.deepStrictEqual(server.rowRules(finding, 9), rowRules(finding, 9), `the server scores ${finding.id} differently`);
  }
  assert.deepStrictEqual(server.propertyBuildings(property), propertyBuildings(property));

  // The same sample report, drawn by the server's copy of the generator.
  const serverGenerator = require(fileURLToPath(new URL('enhancedNspirePDFService.js', serverCopy)));
  setReportLogo('logo');
  serverGenerator.setReportLogo('logo');
  assert.strictEqual(
    serverGenerator.generateEnhancedNSPIREReportHTML(sample, DEFAULT_PDF_OPTIONS),
    generateEnhancedNSPIREReportHTML(sample, DEFAULT_PDF_OPTIONS),
    'the server draws the report differently from the app: run inspire-backend/scripts/syncWebReport.js',
  );
  setReportLogo('');

  // And the server's files are the web's, made by its script and not by hand.
  if (existsSync(fileURLToPath(webLib))) {
    const sync = require(fileURLToPath(new URL('../inspire-backend/scripts/syncWebReport.js', root)));
    const ts = require('typescript');
    for (const name of sync.FILES as string[]) {
      assert.strictEqual(
        read(new URL(`${name}.js`, serverCopy)),
        sync.transpile(ts, name, read(new URL(`${name}.ts`, webLib))),
        `inspire-backend/utils/webReport/${name}.js is not what the web's ${name}.ts makes: run scripts/syncWebReport.js`,
      );
    }
  }
} else {
  console.log('reportRules.check.ts: server comparison SKIPPED — inspire-backend is not checked out beside the app');
}

// --- the copies -------------------------------------------------------------------
if (existsSync(fileURLToPath(webLib))) {
  assert.strictEqual(
    read(new URL('src/services/web/reportRules.ts', root)),
    read(new URL('reportRules.ts', webLib)),
    'src/services/web/reportRules.ts has drifted from inspire-web/lib/reportRules.ts — re-copy it',
  );
} else {
  console.log('reportRules.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

console.log('reportRules.check OK');
