/**
 * Self-check for the offline write queue's state transitions.
 *
 *   node --experimental-strip-types src/utils/offlineQueueCore.check.ts
 *
 * What this guards: an inspector working with no signal must not lose a single
 * saved deficiency, and a long outage must not grow the queue without bound.
 * The screens already write to AsyncStorage first, so the risk is entirely in
 * these transitions — a job dropped before the server accepted it is work the
 * backend never hears about.
 */

import assert from 'node:assert';
import type { QueuedJob } from './offlineQueueCore.ts';
import {
  inSendOrder,
  isLocalId,
  makeJob,
  makeLocalId,
  markFailure,
  remapJobs,
  remapValue,
  removeJob,
  upsertJob,
} from './offlineQueueCore.ts';

const job = (key: string, payload: any, at: number) =>
  makeJob('saveProgress', key, payload, at, key.replace(/\W/g, ''));

/* ---- a job is kept until the server accepts it ---- */

{
  let q: QueuedJob[] = [];
  q = upsertJob(q, job('p1:B1', { n: 1 }, 1000));
  assert.strictEqual(q.length, 1, 'enqueue should hold the job');

  q = markFailure(q, q[0].id, 'network down');
  assert.strictEqual(q.length, 1, 'a failed send must NOT drop the job');
  assert.strictEqual(q[0].attempts, 1, 'the attempt should be recorded');
  assert.strictEqual(q[0].lastError, 'network down', 'the error should be recorded');

  q = markFailure(q, q[0].id, 'still down');
  assert.strictEqual(q.length, 1, 'repeated failures still keep the job');
  assert.strictEqual(q[0].attempts, 2, 'attempts accumulate');

  q = removeJob(q, q[0].id);
  assert.strictEqual(q.length, 0, 'only a successful send clears the job');
}

/* ---- one building never queues more than one job ---- */

{
  let q: QueuedJob[] = [];
  for (let i = 1; i <= 50; i++) {
    q = upsertJob(q, job('p1:B1', { deficiencies: i }, 1000 + i));
  }
  assert.strictEqual(q.length, 1, '50 offline saves for one building must collapse to 1 job');
  assert.deepStrictEqual(
    q[0].payload,
    { deficiencies: 50 },
    'the newest payload wins — it already carries every earlier deficiency'
  );
}

/* ---- different buildings and properties stay separate ---- */

{
  let q: QueuedJob[] = [];
  q = upsertJob(q, job('p1:B1', { a: 1 }, 1000));
  q = upsertJob(q, job('p1:B2', { a: 2 }, 1001));
  q = upsertJob(q, job('p2:B1', { a: 3 }, 1002));
  assert.strictEqual(q.length, 3, 'distinct property/building pairs must not collapse');

  q = upsertJob(q, job('p1:B2', { a: 22 }, 1003));
  assert.strictEqual(q.length, 3, 'replacing one pair leaves the others alone');
  assert.deepStrictEqual(
    q.find((j) => j.dedupeKey === 'p1:B2')!.payload,
    { a: 22 },
    'only the matching pair is replaced'
  );
  assert.deepStrictEqual(
    q.find((j) => j.dedupeKey === 'p1:B1')!.payload,
    { a: 1 },
    'the other pairs keep their payloads'
  );
}

/* ---- replacing keeps the queue in the order work was done ---- */

{
  let q: QueuedJob[] = [];
  q = upsertJob(q, job('p1:B1', {}, 1000));
  q = upsertJob(q, job('p1:B2', {}, 2000));
  q = upsertJob(q, job('p1:B3', {}, 3000));
  // B1 is edited again, which moves it to the end of the array...
  q = upsertJob(q, job('p1:B1', { again: true }, 4000));
  assert.deepStrictEqual(
    inSendOrder(q).map((j) => j.dedupeKey),
    ['p1:B2', 'p1:B3', 'p1:B1'],
    'send order follows queuedAt, so the re-edited building goes last'
  );
}

/* ---- removing a job that is not there is harmless ---- */

{
  const q = upsertJob([], job('p1:B1', {}, 1000));
  assert.strictEqual(removeJob(q, 'no-such-id').length, 1, 'an unknown id must not clear the queue');
  assert.strictEqual(markFailure(q, 'no-such-id', 'x')[0].attempts, 0, 'an unknown id changes nothing');
}

/* ---- a partial flush keeps exactly the unsent jobs ---- */

{
  let q: QueuedJob[] = [];
  q = upsertJob(q, job('p1:B1', {}, 1000));
  q = upsertJob(q, job('p1:B2', {}, 2000));
  q = upsertJob(q, job('p1:B3', {}, 3000));

  // First succeeds, second fails, connection drops before the third.
  const order = inSendOrder(q);
  q = removeJob(q, order[0].id);
  q = markFailure(q, order[1].id, 'connection lost');

  assert.deepStrictEqual(
    inSendOrder(q).map((j) => j.dedupeKey),
    ['p1:B2', 'p1:B3'],
    'the sent job goes, the failed and the untried ones stay'
  );
}

/* ---- local ids are swapped for real ones once the server assigns them ---- */

{
  const localId = makeLocalId(1000, 'abc');
  assert.ok(isLocalId(localId), 'a locally-minted id is recognisable');
  assert.ok(!isLocalId('65f0c1a2b3'), 'a real mongo id is not mistaken for a local one');

  // A property created offline, then two deficiency saves against it.
  let q: QueuedJob[] = [];
  q = upsertJob(
    q,
    makeJob('createProperty', `createProperty:${localId}`, { localId, data: { name: 'X' } }, 1000, 'cp'),
  );
  q = upsertJob(q, makeJob('saveProgress', `saveProgress:${localId}:B1`, {
    property_id: localId,
    inspectionData: { property: { _id: localId }, deficiencies: [{ propertyId: localId }] },
  }, 2000, 'b1'));

  const mapped = remapJobs(q, { [localId]: '65f0REAL' });
  const save = mapped.find((j) => j.kind === 'saveProgress')!;

  assert.strictEqual(save.payload.property_id, '65f0REAL', 'top-level id is swapped');
  assert.strictEqual(save.payload.inspectionData.property._id, '65f0REAL', 'nested id is swapped');
  assert.strictEqual(
    save.payload.inspectionData.deficiencies[0].propertyId,
    '65f0REAL',
    'ids inside arrays are swapped'
  );
  assert.strictEqual(save.dedupeKey, 'saveProgress:65f0REAL:B1', 'the dedupe key follows the id');
  assert.ok(
    !JSON.stringify(mapped).includes(localId),
    'no trace of the local id may survive the remap'
  );
}

{
  // An image queued offline: the local file URI becomes the Cloudinary URL.
  const uri = 'file:///data/user/0/img-1.jpg';
  const q = upsertJob([], makeJob('saveProgress', 'p:B1', {
    inspectionData: { deficiencies: [{ imageUri: uri, imageUrl: null }] },
  }, 1000, 'x'));
  const mapped = remapJobs(q, { [uri]: 'https://res.cloudinary.com/x/img-1.jpg' });
  assert.strictEqual(
    mapped[0].payload.inspectionData.deficiencies[0].imageUri,
    'https://res.cloudinary.com/x/img-1.jpg',
    'the local image URI is replaced'
  );
}

{
  // Remapping must leave everything else exactly as it was.
  const payload = { a: 1, b: true, c: null, d: 'keep', e: [1, 'keep', { f: 'keep' }] };
  assert.deepStrictEqual(
    remapValue(payload, { 'not-present': 'x' }),
    payload,
    'a mapping that matches nothing changes nothing'
  );
  assert.deepStrictEqual(remapJobs([], { a: 'b' }), [], 'an empty queue stays empty');
}

console.log('offlineQueueCore.check.ts OK — jobs survive failure, one job per building, send order held, local ids remapped');
