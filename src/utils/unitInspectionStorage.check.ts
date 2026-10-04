/**
 * node --experimental-strip-types --import ./src/utils/__offlineStubs/register.mjs \
 *      src/utils/unitInspectionStorage.check.ts
 *
 * An inspector who finishes several units and returns to the unit list must see
 * every one of them completed. Marking them one parallel call at a time lost all
 * but one, because each call read the same stale state.
 */
import assert from 'node:assert';
import {
  initializePropertyInspectionState,
  markUnitCompleted,
  markUnitsCompleted,
  getCompletedUnits,
} from './unitInspectionStorage.ts';

const stub: any = (globalThis as any).__offlineStub;
const units = Array.from({ length: 10 }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`);

{
  stub.storage = {};
  await initializePropertyInspectionState('p1', 'B1', units);
  await Promise.all(units.map((u) => markUnitCompleted('p1', 'B1', u)));
  assert.ok(
    (await getCompletedUnits('p1', 'B1')).length < units.length,
    'documents the race: parallel markUnitCompleted loses completions',
  );
}

{
  stub.storage = {};
  await initializePropertyInspectionState('p1', 'B1', units);
  await markUnitsCompleted('p1', 'B1', units.slice(0, 8));
  await markUnitsCompleted('p1', 'B1', units.slice(6)); // overlapping, already-done units are fine
  assert.deepStrictEqual(await getCompletedUnits('p1', 'B1'), units, 'every unit is completed');
}

console.log('unitInspectionStorage.check.ts OK — batched completion keeps every unit');
