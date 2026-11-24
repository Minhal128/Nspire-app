/**
 * Self-check for the client's "Final correction" of 24 Nov 2026.
 *
 *   node --experimental-strip-types src/utils/featureFlags.check.ts
 *
 *  A. "Export in progress" and
 *  B. "Summary" are switched off, not removed: using either in the middle of an
 *     inspection cleared the unit inspection. Each button is still in the
 *     code and is drawn only while its switch is on (hidden, not greyed out:
 *     the user's choice); each handler refuses to run; and the summary screen
 *     sends back anyone who lands on it without mounting.
 *  C. The note field's label, the three areas to inspect and the edit pens are
 *     red.
 *
 * Also the dashboard's heading, made bigger and bolder the same day.
 *
 * To bring a feature back, set its flag to true in src/config/featureFlags.ts.
 * The first two assertions below are then the ones to change; the rest hold
 * either way.
 */

import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { EXPORT_IN_PROGRESS_ENABLED, IN_PROGRESS_SUMMARY_ENABLED } from '../config/featureFlags.ts';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (path: string) => readFileSync(new URL(path, root), 'utf8').replace(/\r\n/g, '\n');

const RED = '#DC2626';

// --- the two switches ---------------------------------------------------------
assert.strictEqual(EXPORT_IN_PROGRESS_ENABLED, false, 'Export In Progress is switched off at the client\'s request');
assert.strictEqual(IN_PROGRESS_SUMMARY_ENABLED, false, 'the in-progress Summary is switched off at the client\'s request');

// --- the buttons: in the code, drawn only while their switch is on ----------------
/**
 * A button's JSX, from its opening tag to its label, once it is established
 * that the button is drawn only while `flag` is on: what opens the expression
 * it sits in is the switch and nothing else, `{FLAG && (` or `FLAG ? (`.
 */
const drawnOnlyWhile = (source: string, label: string, flag: string, file: string, orWhen?: string): string => {
  const end = source.indexOf(`>${label}</Text>`);
  assert.ok(end > 0, `${file}: the ${label} button is gone from the code; it is switched off, not removed`);
  const start = source.lastIndexOf('<TouchableOpacity', end);
  assert.ok(start > 0, `${file}: ${label} is no longer a TouchableOpacity`);
  const before = source.slice(0, start).trimEnd();
  // `orWhen` names the one other thing that brings the button back: on the
  // building screen, an inspection that is 100% done.
  assert.ok(
    orWhen
      ? before.endsWith(`{(${flag} || ${orWhen}) && (`)
      : before.endsWith(`{${flag} && (`) || before.endsWith(`${flag} ? (`),
    `${file}: ${label} must be drawn only while ${flag} is on${orWhen ? ` or ${orWhen}` : ''}, and not drawn at all otherwise`,
  );
  const jsx = source.slice(start, end);
  // Hidden, not greyed out: no switched-off look left on the button.
  assert.ok(
    !/styles\.\w+Off\b/.test(jsx) && !new RegExp(`disabled=\\{[^}]*${flag}`).test(jsx),
    `${file}: ${label} is hidden while ${flag} is off, not shown greyed out or disabled`,
  );
  return jsx;
};

const building = read('src/screens/BuildingInspectionScreen.tsx');
const categories = read('src/screens/InspectionCategoriesScreen.tsx');
const dashboard = read('src/screens/DashboardScreen.tsx');

// On the building screen the two come back once the inspection is 100% done:
// switched off for good, the app had no way left to finish an inspection.
assert.ok(
  building.includes('const inspectionComplete = overallProgress >= 100;'),
  'BuildingInspectionScreen: an inspection is complete at 100% of its tasks, the figure the screen shows',
);
const viewSummary = drawnOnlyWhile(building, 'View Summary', 'IN_PROGRESS_SUMMARY_ENABLED', 'BuildingInspectionScreen', 'inspectionComplete');
const exportReports = drawnOnlyWhile(building, 'Export Reports', 'EXPORT_IN_PROGRESS_ENABLED', 'BuildingInspectionScreen', 'inspectionComplete');
assert.ok(!viewSummary.includes('EXPORT_IN_PROGRESS_ENABLED'), 'BuildingInspectionScreen: View Summary answers to the summary switch alone');
assert.ok(!exportReports.includes('IN_PROGRESS_SUMMARY_ENABLED'), 'BuildingInspectionScreen: Export Reports answers to the export switch alone');

const summaryButton = drawnOnlyWhile(categories, 'SUMMARY', 'IN_PROGRESS_SUMMARY_ENABLED', 'InspectionCategoriesScreen');

// In the dashboard's action list the button shares its place with Edit
// Property, which is for a property whose inspection has not started. While
// the summary is off that place is empty for a started inspection: no empty
// button, and Edit Property does not move in.
drawnOnlyWhile(dashboard, 'View Summary', 'IN_PROGRESS_SUMMARY_ENABLED', 'DashboardScreen');
assert.ok(
  />View Summary<\/Text>\s*<\/TouchableOpacity>\s*\) : null\s*\) : \(\s*<TouchableOpacity[^>]*onPress=\{handleEditProperty\}/.test(dashboard),
  'DashboardScreen: with the summary off its place in the action list is empty, and Edit Property stays for a property not yet started',
);

// No greyed-out style is left behind from the first, disabled, version.
for (const [name, source] of [['BuildingInspectionScreen', building], ['InspectionCategoriesScreen', categories], ['DashboardScreen', dashboard]] as const) {
  assert.ok(
    !/\b(?:exportButton|exportButtonText|summaryButton|summaryButtonText|actionButton|actionButtonText)Off\b/.test(source),
    `${name}: a switched-off button is hidden; its greyed-out style should be gone`,
  );
}

// --- the handlers refuse, whoever calls them ------------------------------------
const exportFn = building.match(/const handleExportInProgress = async \([\s\S]*?\n  \};\n/)?.[0];
assert.ok(exportFn, 'BuildingInspectionScreen: handleExportInProgress not found');
const refusal = exportFn.indexOf('if (!switchedOn && !inspectionComplete) return;');
assert.ok(
  refusal > 0 && refusal < exportFn.indexOf('try {'),
  'BuildingInspectionScreen: handleExportInProgress must refuse before it does anything',
);
assert.ok(
  exportFn.slice(0, refusal).includes(
    "const switchedOn = destination === 'reports' ? EXPORT_IN_PROGRESS_ENABLED : IN_PROGRESS_SUMMARY_ENABLED;",
  ),
  'BuildingInspectionScreen: each destination of handleExportInProgress answers to its own switch',
);

const viewSummaryFn = dashboard.match(/const handleViewSummary = \(\) => \{[\s\S]*?\n  \};\n/)?.[0];
assert.ok(viewSummaryFn, 'DashboardScreen: handleViewSummary not found');
const dashboardRefusal = viewSummaryFn.indexOf('if (!IN_PROGRESS_SUMMARY_ENABLED) return;');
assert.ok(
  dashboardRefusal > 0 && dashboardRefusal < viewSummaryFn.indexOf("navigation.navigate('InspectionSummary'"),
  'DashboardScreen: handleViewSummary must refuse before it opens the summary',
);

const categoriesRefusal = summaryButton.indexOf('if (!IN_PROGRESS_SUMMARY_ENABLED) return;');
assert.ok(
  categoriesRefusal > 0 && categoriesRefusal < summaryButton.indexOf("navigation.navigate('InspectionSummary'"),
  'InspectionCategoriesScreen: SUMMARY must refuse before it opens the summary',
);

// --- the route itself -----------------------------------------------------------
// The buttons are not the only way in: an older screen still navigates here,
// and on the web build the address bar does.
const summary = read('src/screens/InspectionSummaryScreen.tsx');
assert.ok(
  /\nexport default GuardedInspectionSummaryScreen;\s*$/.test(summary),
  'InspectionSummaryScreen: the screen that is registered must be the guarded one',
);
const guarded = summary.slice(summary.indexOf('const GuardedInspectionSummaryScreen = '));
const closed = guarded.indexOf('if (!opened) return null;');
assert.ok(
  closed > 0 && closed < guarded.indexOf('<InspectionSummaryScreen {...props} />'),
  'InspectionSummaryScreen: while switched off the summary must not be mounted at all; as it opens it loads the unit\'s saved deficiencies and writes them back',
);
assert.ok(
  /if \(opened\) return;\s*if \(navigation\.canGoBack\(\)\) navigation\.goBack\(\);\s*else navigation\.navigate\('Dashboard'\);/.test(guarded),
  'InspectionSummaryScreen: while switched off it sends whoever landed here back',
);
// Export in the unit screen's header is the one way in while an inspection
// is in progress: the client's reference site has it there.
assert.ok(
  guarded.includes('const opened = IN_PROGRESS_SUMMARY_ENABLED || Boolean(route?.params?.openedFromExport);'),
  'InspectionSummaryScreen: opened from the header\'s Export, the summary opens',
);
const exportPill = categories.slice(categories.indexOf('styles.exportPill'), categories.indexOf('>EXPORT</Text>'));
assert.ok(exportPill.length > 0 && exportPill.includes('openedFromExport: true'), 'InspectionCategoriesScreen: the header\'s Export opens the summary as the export');
assert.ok(!exportPill.includes('IN_PROGRESS_SUMMARY_ENABLED'), 'InspectionCategoriesScreen: Export is drawn whatever the switch says, as on the reference site');
const app = read('App.tsx');
assert.ok(
  app.includes('import InspectionSummaryScreen from "./src/screens/InspectionSummaryScreen";')
    && app.includes('<Stack.Screen name="InspectionSummary" component={InspectionSummaryScreen} />'),
  'App.tsx: the InspectionSummary route must be the screen file\'s default export, which is the guarded one',
);

// Every way into the summary is known. A new one has to be thought about
// (a switched-off button, or the guard above) before it is added here.
const screens = readdirSync(new URL('src/screens/', root)).filter((name) => name.endsWith('.tsx'));
const waysIn = screens
  .filter((name) => /navigation\.(?:navigate|replace|push)\(\s*['"]InspectionSummary['"]/.test(read(`src/screens/${name}`)))
  .sort();
assert.deepStrictEqual(
  waysIn,
  ['DashboardScreen.tsx', 'DeficiencyFillingScreen.tsx', 'InspectionCategoriesScreen.tsx'],
  'the screens that open the in-progress summary',
);

// A finished inspection's report is another screen and stays open.
const status = read('src/screens/InspectionStatusScreen.tsx');
assert.ok(
  /navigation\.navigate\('NSPIREReport'/.test(status),
  'InspectionStatusScreen: a completed inspection still opens its report',
);
for (const name of ['InspectionStatusScreen.tsx', 'NSPIREReportScreen.tsx']) {
  assert.ok(
    !read(`src/screens/${name}`).includes('featureFlags'),
    `${name}: the report of a completed inspection is not behind either switch`,
  );
}

// --- C. red: the note's label, the area to inspect, the edit pens -------------------
const redStyle = (source: string, style: string, file: string) =>
  assert.ok(
    new RegExp(`\\n  ${style}: \\{[^}]*\\bcolor: ['"]${RED}['"]`).test(source),
    `${file}: ${style} is red (${RED})`,
  );

// C1. "Work order / Note": the note field, which a general comment uses too.
const detail = read('src/screens/DeficiencyDetailScreen.tsx');
assert.ok(
  detail.includes('<Text style={[styles.sectionLabel, styles.noteLabel]}>COMMENT</Text>'),
  'DeficiencyDetailScreen: the note field\'s label is drawn with noteLabel',
);
redStyle(detail, 'noteLabel', 'DeficiencyDetailScreen');
assert.strictEqual(
  (detail.match(/styles\.noteLabel/g) || []).length, 1,
  'DeficiencyDetailScreen: only the note field\'s label is red, not every section label',
);
const location = read('src/screens/LocationInspectionScreen.tsx');
assert.ok(
  location.includes('<Text style={[styles.findingLabel, styles.noteLabel]}>COMMENT</Text>'),
  'LocationInspectionScreen: a saved deficiency\'s note label is drawn with noteLabel',
);
redStyle(location, 'noteLabel', 'LocationInspectionScreen');

// C2. "Area selection": the headings of the Add New Property form, as the
// client put it on 25 Nov 2026 -- not the three area titles of the unit
// screen, which were made red first and are teal again.
const addProperty = read('src/screens/AddPropertyScreen.tsx');
for (const heading of ['Property ID (Optional)', 'Address ', 'Property Name ', 'City (Area) ', 'Number Of Buildings ', 'State (Province) ', 'Number Of Units ', 'Zip ']) {
  assert.ok(addProperty.includes(`Label text="${heading}"`), `AddPropertyScreen: the heading "${heading.trim()}" is gone`);
}
assert.ok(
  addProperty.includes('<Text style={styles.label}>') && addProperty.includes('<Text style={styles.label}>{text}</Text>'),
  'AddPropertyScreen: the form\'s headings are drawn with the label style',
);
redStyle(addProperty, 'label', 'AddPropertyScreen');
for (const title of [
  'OUTSIDE (AREAS AFFECTED BY RAIN, SNOW, WIND)',
  'INSIDE (INTERIOR COMMON AREA, UTILITY CLOSET, MECHANICAL ROOMS)',
  'UNITS (INDIVIDUAL UNIT INSPECTIONS)',
]) {
  assert.ok(categories.includes(`title: '${title}'`), `InspectionCategoriesScreen: the area "${title}" is gone`);
}
assert.ok(
  /\n  categoryTitle: \{[^}]*\bcolor: '#006795'/.test(categories),
  'InspectionCategoriesScreen: the three area titles are teal, not red; the client took the red back',
);

// C3. "Edit Pen": every pencil, wherever one is drawn.
const PEN = /<[A-Za-z]+ name="(?:pencil|create)[a-z-]*"[^>]*>/g;
const pens: Record<string, number> = {};
for (const folder of ['src/screens/', 'src/components/']) {
  for (const name of readdirSync(new URL(folder, root)).filter((file) => file.endsWith('.tsx'))) {
    for (const pen of read(`${folder}${name}`).match(PEN) || []) {
      assert.ok(pen.includes(`color="${RED}"`), `${name}: an edit pen that is not red: ${pen}`);
      pens[name] = (pens[name] || 0) + 1;
    }
  }
}
assert.deepStrictEqual(
  pens,
  {
    'BuildingInspectionScreen.tsx': 1,
    'InspectionCategoriesScreen.tsx': 1,
    'InspectionReportScreen.tsx': 1,
    'PropertyInfoScreen.tsx': 1,
  },
  'the edit pens of the app',
);

// --- the dashboard's heading: bigger and bolder, its subtitle as it was -------------
assert.ok(
  dashboard.includes('<Text style={styles.pageTitle}>Property Dashboard</Text>'),
  'DashboardScreen: the heading is drawn with pageTitle',
);
const pageTitle = dashboard.match(/\n  pageTitle: \{[^}]*\}/)?.[0] || '';
assert.ok(/fontWeight: ['"]800['"]/.test(pageTitle), 'DashboardScreen: the heading is bold (800)');
const headingSize = Number(pageTitle.match(/fontSize: (\d+)/)?.[1]);
assert.ok(
  headingSize >= 30 && headingSize <= 32,
  `DashboardScreen: the heading is 4 to 6 px bigger than the 26 it was (it is ${headingSize})`,
);
const pageSubtitle = dashboard.match(/\n  pageSubtitle: \{[^}]*\}/)?.[0] || '';
assert.ok(
  /fontSize: 14\b/.test(pageSubtitle) && !pageSubtitle.includes('fontWeight'),
  'DashboardScreen: the subtitle under the heading is as it was',
);

console.log('featureFlags.check OK');
