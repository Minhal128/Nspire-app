/**
 * Self-check for general comments.
 *
 *   node --experimental-strip-types src/utils/generalComments.check.ts
 *
 * The client: the General Comment item takes several pictures, and what is
 * entered there has to come out in the summary and in the report.
 *
 * A general comment is an observation, not a deficiency. It is stored among
 * the findings in more than one shape (website, app, a flag on report rows),
 * and one file -- inspire-web/lib/generalComments.ts, copied to
 * src/services/web/ -- knows them all. This holds that file to what was asked,
 * and the screens and the report to using it.
 */

import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  collectGeneralComments,
  generalCommentDedupeToken,
  generalCommentFindings,
  generalCommentHeading,
  generalCommentPhotos,
  isGeneralCommentFinding,
  withoutGeneralComments,
} from '../services/web/generalComments.ts';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (url: URL) => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');

// --- the three shapes a general comment is stored in --------------------------
const fromWebsite = (photo: string, over: any = {}) => ({
  id: `DEF-1-${photo}`,
  imageUri: photo,
  title: 'General Comment • 26. General Comment',
  description: 'Gate left open at night',
  category: '26. General Comment',
  building: 'B2',
  unit: '-',
  notes: 'Gate left open at night',
  nspireCode: 'GEN-NOTE',
  area: 'outside',
  item: '26. General Comment',
  ...over,
});
const fromApp = (over: any = {}) => ({
  deficiency: { name: 'General Comment', severity: 'Low', detail: 'Hallway smells of gas', points: '0', category: 'General' },
  imageUrl: 'https://cdn.example/app-1.jpg',
  imageUri: 'file:///var/mobile/app-1.jpg',
  note: 'Hallway smells of gas',
  itemName: 'General Comment',
  building: 'B1',
  _area: 'Inside',
  _unit: 'B1',
  ...over,
});
const reportRow = { isGeneralComment: true, deficiencyName: 'General Comment', building: 'B1', unit: 'Unit 003', area: 'Units', comments: 'Tenant not home', imageUri: 'https://cdn.example/row.jpg' };
const deficiency = { title: 'Door is missing', description: 'Entry door is missing', category: 'Door', item: '4. Door', nspireCode: 'D-1', building: 'B1', unit: '-', area: 'outside', imageUri: 'https://cdn.example/door.jpg', notes: 'general comment: see photo' };

for (const [what, finding] of [['website', fromWebsite('a.jpg')], ['app', fromApp()], ['report row', reportRow]] as const) {
  assert.strictEqual(isGeneralCommentFinding(finding), true, `a general comment from the ${what} must be recognised`);
}
assert.strictEqual(isGeneralCommentFinding(deficiency), false, 'a deficiency is not a general comment, whatever its note says');
assert.strictEqual(isGeneralCommentFinding({ deficiency: { name: 'Custom Deficiency' }, itemName: 'Door' }), false);
for (const junk of [null, undefined, 'General Comment', 7]) {
  assert.strictEqual(isGeneralCommentFinding(junk), false);
}

// --- several pictures on one comment -------------------------------------------
// The website stores one finding per photo. They are one comment.
const threePhotos = [fromWebsite('a.jpg'), fromWebsite('b.jpg'), fromWebsite('c.jpg')];
assert.deepStrictEqual(collectGeneralComments([deficiency, ...threePhotos]), [
  { building: 'B2', unit: '-', area: 'Outside', note: 'Gate left open at night', photos: ['a.jpg', 'b.jpg', 'c.jpg'] },
], 'three photos, one comment, and the deficiency is not in it');

// Pages drop findings that read alike. Without the token only the first photo
// of a comment survived that; a deficiency's key must stay what it was.
const tokens = threePhotos.map(generalCommentDedupeToken);
assert.strictEqual(new Set(tokens).size, 3, 'each photo of a comment is told apart');
assert.strictEqual(generalCommentDedupeToken(deficiency), '', 'a deficiency gets no token');

// The phone holds a picture twice, uploaded and local. It is one picture, and
// the uploaded copy is the one anybody else can open.
assert.deepStrictEqual(generalCommentPhotos(fromApp()), ['https://cdn.example/app-1.jpg']);
assert.deepStrictEqual(generalCommentPhotos(fromApp({ imageUrl: null })), ['file:///var/mobile/app-1.jpg'], 'offline, the local file is what there is');
assert.deepStrictEqual(
  generalCommentPhotos({ imageUri: 'x.jpg', photos: ['x.jpg', { url: 'y.jpg' }], images: [{ uri: 'z.jpg' }] }),
  ['x.jpg', 'y.jpg', 'z.jpg'],
);

// --- what is listed -------------------------------------------------------------
const all = collectGeneralComments([fromApp(), reportRow, ...threePhotos, deficiency]);
assert.deepStrictEqual(all.map(generalCommentHeading), ['B1 • Inside', 'B1 • Unit 003 • Unit', 'B2 • Outside']);
assert.strictEqual(all[0].note, 'Hallway smells of gas');
assert.strictEqual(all[1].note, 'Tenant not home');

// A note with no picture is a comment; nothing written and nothing attached is not.
assert.strictEqual(collectGeneralComments([fromWebsite('', { notes: 'Note only', description: 'Note only' })]).length, 1);
assert.deepStrictEqual(
  collectGeneralComments([fromWebsite('', { notes: '', description: '26. General Comment' })]),
  [],
  'the item name the website stores for an empty comment is a label, not a note',
);
assert.deepStrictEqual(collectGeneralComments(null), []);

// --- they are not deficiencies --------------------------------------------------
assert.deepStrictEqual(withoutGeneralComments([deficiency, ...threePhotos, fromApp(), reportRow]), [deficiency]);

// Back to findings and round again: nothing is lost on the way to a saved record.
const rows = generalCommentFindings(all);
assert.strictEqual(rows.length, 5, 'one row per photo');
assert.ok(rows.every((row) => row.isGeneralComment && row.deductionPts === 0));
assert.deepStrictEqual(collectGeneralComments(rows), all);

// --- the report draws them in their own block, never as a row -------------------
const generator = read(new URL('src/services/web/enhancedNspirePDFService.ts', root));
assert.ok(
  generator.includes('const rows: ReportRow[] = withoutGeneralComments(report.deficiencies).map((deficiency) => ({') &&
    generator.includes('generateEnhancedDeficiencyTable(buildings, rows, filedComments, options)') &&
    generator.includes('const scores = reportScores(rows);'),
  'the report must keep general comments out of the deficiency tables, and out of the scores',
);
assert.ok(
  generator.includes('generateGeneralCommentsSection(comments.filter((entry) => scoreArea(entry.area) === area), options)'),
  'the report must print the General Comments block',
);
assert.ok(
  /entry\.photos\.map\(\(photo, index\) => `<img src=/.test(generator),
  'every photo of a comment goes into the report, not the first one',
);

// --- the app's own screens ------------------------------------------------------
const summary = read(new URL('src/screens/InspectionSummaryScreen.tsx', root));
assert.ok(
  summary.includes('const deficiencyItems = withoutGeneralComments(mergedDeficiencies);') &&
    summary.includes('const scores = reportScores(\n    deficiencyItems.map('),
  'InspectionSummaryScreen: a general comment must not be counted or scored as a deficiency',
);
assert.ok(
  summary.includes('generalCommentEntries: collectGeneralComments(commentFindings),'),
  'InspectionSummaryScreen: the report must be handed the general comments',
);
assert.ok(
  summary.includes('<Text style={styles.generalCommentsTitle}>General Comments</Text>') &&
    summary.includes('entry.photos.map((photo, photoIndex) => ('),
  'InspectionSummaryScreen: the summary lists the general comments with all their photos',
);
// Back from the summary is the property screen, not a reset to the Dashboard.
assert.ok(
  /onPress=\{handleBackToProperty\}\n\s+style=\{styles\.backButton\}/.test(summary),
  'InspectionSummaryScreen: the header arrow goes back to the property screen',
);
const back = summary.match(/const handleBackToProperty = async \(\) => \{[\s\S]*?\n  \};\n/)?.[0];
assert.ok(back?.includes("navigation.navigate('BuildingInspection'"), 'handleBackToProperty opens the property screen');

for (const [name, path] of [
  ['nspireReportUtils', 'src/utils/nspireReportUtils.ts'],
  ['NSPIREReportScreen', 'src/screens/NSPIREReportScreen.tsx'],
] as const) {
  const source = read(new URL(path, root));
  assert.ok(
    source.includes('collectGeneralComments(') && source.includes('withoutGeneralComments('),
    `${name}: reports built here must split general comments from deficiencies`,
  );
}

// The General Comment item takes any number of pictures.
const detail = read(new URL('src/screens/DeficiencyDetailScreen.tsx', root));
assert.ok(
  detail.includes('setImages((previous) => [...previous, ...picked]);'),
  'DeficiencyDetailScreen: each picked picture is added to the ones already taken',
);

// The panel that confirms a save says what was saved. It read name, detail and
// severity from the top of the entry, where the app does not keep them, so
// every row said "Deficiency" and "Moderate" -- a general comment included.
assert.ok(
  detail.includes("finding?.deficiency?.name || finding?.title"),
  'DeficiencyDetailScreen: the saved panel must name the deficiency that was saved',
);
assert.ok(
  detail.includes("? (savedItemFindings.length === 1 ? 'comment' : 'comments')") &&
    detail.includes("{isGeneralComment ? 'Add Comment' : 'Add Deficiency'}"),
  'DeficiencyDetailScreen: a saved general comment is called a comment, not a deficiency',
);

// --- the web does the same, when it is checked out beside the app ---------------
const webBase = new URL('../inspire-web/app/dashboard/', root);
if (existsSync(fileURLToPath(webBase))) {
  const webInspection = read(new URL('inspection-category/[id]/page.tsx', webBase));
  assert.ok(!webInspection.includes('setGeneralImage('), 'inspire-web: the General Comment modal must hold several photos, not one');
  const save = webInspection.match(/const handleSaveGeneralComment = async \(\) => \{[\s\S]*?\n    \};\n/)?.[0];
  assert.ok(save?.includes('await persistSectionFindings('), 'inspire-web: saving a general comment must store it');
  const webSummary = read(new URL('inspection/summary/page.tsx', webBase));
  assert.ok(webSummary.includes('report.generalCommentEntries'), 'inspire-web: the summary lists the general comments');
  assert.ok(
    webSummary.includes('router.push(`/dashboard/property-details/${propertyId}`)'),
    'inspire-web: Back from the summary goes to the property page',
  );
} else {
  console.log('generalComments.check.ts: web comparison SKIPPED — inspire-web is not checked out beside the app');
}

console.log('generalComments.check OK');
