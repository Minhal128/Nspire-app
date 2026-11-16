/**
 * Self-check for the report actions on the two report screens.
 *
 *   node --experimental-strip-types src/utils/reportActions.check.ts
 *
 * Everything this guards was reported by the client:
 *  - the actions are View Report, Share Report, Unlock Report $1, in that
 *    order, as on the web summary header, not View Deficiency / View Free
 *    Report in the old order;
 *  - Share Report reaches the server. The client's base URL already ends in
 *    /api, so an endpoint that starts with /api is requested as /api/api/...
 *    and comes back "Route not found";
 *  - the score card and the report rows use the web's deduction table. Every
 *    row used to carry a flat 3 points while the card weighed severities
 *    itself, so the screen never matched the report it produced;
 *  - CONTINUE INSPECTION goes to the building's categories, where the web's
 *    does, not back into the location screen it came from.
 */

import assert from 'node:assert';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (url: URL) => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');

const LABELS = ['View Report', 'Share Report', 'Unlock Report $1'];

// --- names and order on both screens ----------------------------------------
for (const name of ['InspectionSummaryScreen.tsx', 'NSPIREReportScreen.tsx']) {
  const src = read(new URL(`src/screens/${name}`, root));
  const at = LABELS.map(label => src.indexOf(`>${label}</Text>`));
  at.forEach((i, n) => assert.ok(i > 0, `${name}: no "${LABELS[n]}" button`));
  assert.ok(
    at[0] < at[1] && at[1] < at[2],
    `${name}: the report actions must read ${LABELS.join(', ')} in that order`
  );
  for (const old of ['View Deficiency', 'View Free Report']) {
    assert.ok(!src.includes(old), `${name}: still says "${old}"`);
  }
}

// --- a report paid for earlier must open unlocked ----------------------------
// The payment-link poll only runs while the payment box is up, so each screen
// has to ask the server once when it opens.
for (const name of ['InspectionSummaryScreen.tsx', 'NSPIREReportScreen.tsx']) {
  const src = read(new URL(`src/screens/${name}`, root));
  assert.ok(
    src.includes('stripeService.checkUnlockStatus(unlockReference)'),
    `${name}: must ask check-unlock when it opens, or a paid report shows as locked`
  );
}

// --- the same names the web shows, when it is checked out beside the app -----
const webPage = new URL('../inspire-web/app/dashboard/inspection/summary/page.tsx', root);
if (existsSync(fileURLToPath(webPage))) {
  const page = read(webPage);
  // On the web each label sits alone on its line inside a <Button>.
  const at = LABELS.map(label => page.search(new RegExp(`\\n\\s+${label.replace('$', '\\$')}\\n`)));
  at.forEach((i, n) => assert.ok(i > 0, `inspire-web summary page has no "${LABELS[n]}" button — the app has drifted from it`));
  assert.ok(at[0] < at[1] && at[1] < at[2], 'inspire-web orders the report actions differently from the app');
} else {
  console.log('reportActions.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

// --- no endpoint may repeat the /api the base URL already ends in ------------
assert.match(
  read(new URL('src/services/api.ts', root)),
  /const API_BASE_URL = '[^']+\/api';/,
  'api.ts: the base URL no longer ends in /api — the endpoint rule below needs rethinking'
);
const sources: URL[] = [];
const walk = (dir: URL) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    if (entry.isDirectory()) walk(new URL(`${entry.name}/`, dir));
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.check.ts')) sources.push(new URL(entry.name, dir));
  }
};
walk(new URL('src/', root));
assert.ok(sources.length > 50, `expected the whole app, only found ${sources.length} files`);
for (const file of sources) {
  const hit = read(file).match(/\bapi\.(?:get|post|put|patch|delete)\(\s*[`'"]\/api\/[^`'"]*/);
  assert.ok(
    !hit,
    `${file.pathname.split('/').pop()}: ${hit?.[0]} — the base URL already ends in /api, so this is requested as /api/api/...`
  );
}

// --- scores: the report's rules, on the card and on the rows ------------------
// The client's correction sheet replaced the flat table this used to hold the
// screen to (10 / 6 / 3 / 1 a row, the final score five under the preliminary).
// A property starts at 100; a deficiency loses it its PTS over the sample
// size; the calculated score is the points lost and the final score what is
// left. reportRules.check.ts holds the rules themselves, this holds the screen
// to them.
const summary = read(new URL('src/screens/InspectionSummaryScreen.tsx', root));
assert.ok(
  summary.includes("} from '../services/web/reportRules';"),
  'InspectionSummaryScreen: its scores must come from the report rules in src/services/web/'
);
assert.ok(
  summary.includes('const rules = rowScore(defItem);') &&
    summary.includes('deductionPts: rules.ptsLost,') &&
    summary.includes('deficiencyItems.map((d: any) => ({ ptsLost: rowScore(d).ptsLost, area: rowArea(d) }))'),
  'InspectionSummaryScreen: the score card and the report rows must be scored by the same rowScore()'
);
assert.ok(!summary.includes('calculateDeductionPoints'), 'InspectionSummaryScreen: the flat points table is back');
assert.ok(!/deductionPts: isGC \? 0 : 3\b/.test(summary), 'InspectionSummaryScreen: a report row is back to a flat 3 points');
assert.ok(!summary.includes('deficienciesArray.length * 3'), 'InspectionSummaryScreen: total deductions are back to 3 a row');
assert.ok(!/preliminaryScore - 5\b/.test(summary), 'InspectionSummaryScreen: the final score is five under the preliminary again');
assert.ok(
  summary.includes('const preliminaryScore = scores.preliminary;') &&
    summary.includes('const calculatedScore = scores.calculated;') &&
    summary.includes('const finalScore = scores.final;'),
  'InspectionSummaryScreen: preliminary is 100, calculated the points lost, final what is left of the 100'
);

// --- CONTINUE INSPECTION ------------------------------------------------------
const handler = summary.match(/const handleContinueInspection = async \(\) => \{[\s\S]*?\n  \};/)?.[0];
assert.ok(handler, 'InspectionSummaryScreen: handleContinueInspection not found');
assert.ok(
  handler.includes("navigation.navigate('InspectionCategories'") && !handler.includes("navigate('LocationInspection'"),
  'InspectionSummaryScreen: CONTINUE INSPECTION must open InspectionCategories, as the web does'
);

console.log('reportActions.check.ts passed');
