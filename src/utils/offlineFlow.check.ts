/**
 * Self-check for what the client hit using the app with no signal.
 *
 *   node --experimental-strip-types src/utils/offlineFlow.check.ts
 *
 *  - "Sab gayab": offline, a property showed 0% and every building "Not
 *    started", though it had been inspected. Progress came from the server
 *    alone; the last answer is now kept on the device and used when the
 *    request fails.
 *  - After saving a deficiency offline, OK on the "Offline Mode" alert left
 *    the screen with nothing to continue from. The alert was raised in the
 *    same tick as the saved panel and won; the notice is now a line inside
 *    the panel.
 *  - The property screen's two buttons: View Summary shows the summary, Export
 *    Reports goes on to the report page.
 */

import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { unitStatusCacheKey, parseCachedUnitStatus, withInspectedLabel } from './unitStatusCache.ts';

const root = new URL('../..', import.meta.url);
// Normalised: git's autocrlf leaves the working tree CRLF.
const read = (path: string) => readFileSync(new URL(path, root), 'utf8').replace(/\r\n/g, '\n');

// --- the cache itself --------------------------------------------------------
assert.strictEqual(unitStatusCacheKey('P1', 'B1'), 'unit_status_cache_P1_B1');
assert.notStrictEqual(unitStatusCacheKey('P1', 'B1'), unitStatusCacheKey('P1', 'B2'), 'one answer per building');

const server = {
  success: true,
  statuses: [
    { unitLabel: 'Outside', normalizedUnitKey: 'outside', isInspected: true },
    { unitLabel: 'Inside', normalizedUnitKey: 'inside', isInspected: true },
  ],
  unitStatusMap: { outside: true, inside: true },
};
assert.deepStrictEqual(parseCachedUnitStatus(JSON.stringify(server)), server, 'what the server said comes back as it was');
for (const junk of [null, undefined, '', 'not json', '{}', '{"statuses":"x"}']) {
  assert.strictEqual(parseCachedUnitStatus(junk as any), null, `unusable cache (${junk}) must read as no cache`);
}

// Finishing a unit offline adds it; the areas the server knew about stay.
const afterUnit = withInspectedLabel(server, 'Unit 001', '2026-11-15T00:00:00.000Z');
assert.deepStrictEqual(
  afterUnit.statuses.filter((s) => s.isInspected).map((s) => s.unitLabel),
  ['Outside', 'Inside', 'Unit 001'],
);
assert.strictEqual(server.statuses.length, 2, 'the cached answer itself is not mutated');
assert.strictEqual(withInspectedLabel(afterUnit, ' unit 001 '), afterUnit, 'marking the same area again changes nothing');
assert.strictEqual(withInspectedLabel(server, ''), server, 'no label, nothing to mark');
assert.deepStrictEqual(
  withInspectedLabel(null, 'Outside', 'now').statuses,
  [{ unitLabel: 'Outside', normalizedUnitKey: 'outside', isInspected: true, inspectedAt: 'now' }],
  'with nothing cached yet, the offline completion is the whole answer',
);

// --- the service keeps the answer and falls back to it -----------------------
const service = read('src/services/inspectionService.ts');
const statusFn = service.match(/async getUnitInspectionStatus\([\s\S]*?\n  \}\n/)?.[0];
assert.ok(statusFn, 'inspectionService.getUnitInspectionStatus not found');
assert.ok(
  /AsyncStorage\.setItem\(cacheKey, JSON\.stringify\(response\)\)/.test(statusFn),
  'a successful unit-status answer must be kept on the device',
);
const failed = statusFn.slice(statusFn.indexOf('catch (error'));
assert.ok(
  failed.includes('parseCachedUnitStatus(') && failed.indexOf('parseCachedUnitStatus(') < failed.indexOf('success: false'),
  'a failed unit-status request must try the cached answer before reporting nothing inspected',
);

// --- an area finished offline is noted when its save is queued ---------------
const location = read('src/screens/LocationInspectionScreen.tsx');
const queued = location.indexOf("await offlineQueue.enqueue('saveProgress', queueKey, progressPayload);");
assert.ok(queued > 0, 'LocationInspectionScreen: the offline queue call moved');
assert.ok(
  location.slice(queued, queued + 900).includes('inspectionService.rememberInspectedOffline('),
  'LocationInspectionScreen: a finished area queued offline must be noted on the device',
);

// --- the saved panel is the only thing presented after a save ---------------
const detail = read('src/screens/DeficiencyDetailScreen.tsx');
const timer = detail.match(/panelTimerRef\.current = setTimeout\(\(\) => \{[\s\S]*?\}, MODAL_SWAP_MS\);/)?.[0];
assert.ok(timer, 'DeficiencyDetailScreen: the saved-panel timer not found');
assert.ok(timer.includes('setSavedPanelVisible(true)'), 'the timer opens the saved panel');
assert.ok(
  !timer.includes('Alert.alert'),
  'no Alert in the same tick as the saved panel: offline it wins, the panel never shows, and the screen is stuck',
);
assert.ok(
  detail.includes('setSavedOffline(true);') && detail.includes('{savedOffline && ('),
  'the offline notice is a line inside the saved panel',
);
const draftQueue = detail.indexOf("await offlineQueue.enqueue(\n        'saveProgress',");
assert.ok(draftQueue > 0 && detail.indexOf('offlineQueue.syncInBackground();', draftQueue) > draftQueue,
  'a deficiency is durably queued before starting background sync');
assert.ok(location.indexOf('setIsLoaded(true);') < location.indexOf('await api.get('),
  'the checklist renders local answers before refreshing from the server');
assert.ok(location.indexOf('offlineQueue.syncInBackground();', queued) > queued,
  'checklist save schedules sync without waiting for it');

// --- View Summary and Export Reports ----------------------------------------
const building = read('src/screens/BuildingInspectionScreen.tsx');
assert.ok(building.includes('>View Summary</Text>'), 'BuildingInspectionScreen: no View Summary button');
assert.ok(building.includes('>Export Reports</Text>'), 'BuildingInspectionScreen: no Export Reports button');
assert.ok(!building.includes('>Export In Progress</Text>'), 'BuildingInspectionScreen: still says Export In Progress');
assert.ok(
  building.indexOf('>View Summary</Text>') < building.indexOf('>Export Reports</Text>'),
  'View Summary comes before Export Reports',
);
const exportFn = building.match(/const handleExportInProgress = async \([\s\S]*?\n  \};\n/)?.[0];
assert.ok(exportFn, 'BuildingInspectionScreen: handleExportInProgress not found');
assert.ok(
  /if \(destination === 'reports'\) \{[\s\S]*?navigation\.navigate\('NSPIREReport'/.test(exportFn),
  'Export Reports must go on to the report page',
);
// The report can come from a draft on the device, a draft on the server or the
// full sweep. Each used to open the preview itself, so with a draft present
// Export Reports showed the summary instead of moving on.
assert.strictEqual(
  (exportFn.match(/openReportPreview\(/g) || []).length, 1,
  'every source of the report must go through present(), which alone decides between preview and report page',
);
assert.strictEqual((exportFn.match(/\bpresent\(/g) || []).length, 3, 'three sources, three calls to present()');

console.log('offlineFlow.check OK');
