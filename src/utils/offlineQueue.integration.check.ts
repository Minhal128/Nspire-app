/**
 * End-to-end check of the real offlineQueue against stubbed storage/network/API.
 *
 *   node --experimental-strip-types --import ./src/utils/__offlineStubs/register.mjs \
 *        src/utils/offlineQueue.integration.check.ts
 *
 * offlineQueueCore.check.ts covers the pure transitions. This covers the part
 * that would actually lose an inspector's work: the order flush() does things
 * in. A job removed before its response is trusted, a remap applied after the
 * queue is written, or a cache left holding a local- id would all silently send
 * field work nowhere.
 */

import assert from 'node:assert';
import offlineQueue from '../services/offlineQueue.ts';

const stub: any = (globalThis as any).__offlineStub;

const reset = (online = false) => {
  stub.storage = {};
  stub.online = online;
  stub.listeners = [];
  stub.calls = [];
  stub.responders = {};
};

const queued = () => JSON.parse(stub.storage['offline_request_queue_v1'] || '[]');
const ok = () => ({ success: true });

/* ---- offline: nothing is sent, everything is kept ---- */

{
  reset(false);
  await offlineQueue.enqueue('saveProgress', 'p1:B1', { property_id: 'p1', n: 1 });
  await offlineQueue.enqueue('saveProgress', 'p1:B2', { property_id: 'p1', n: 2 });

  const res = await offlineQueue.flush();
  assert.strictEqual(stub.calls.length, 0, 'offline: nothing may be sent');
  assert.strictEqual(res.sent, 0, 'offline: nothing reported as sent');
  assert.strictEqual(queued().length, 2, 'offline: both jobs stay queued');
}

/* ---- the queue survives a restart ---- */

{
  const persisted = queued();
  assert.strictEqual(persisted.length, 2, 'the queue lives in storage, not memory');
  assert.strictEqual(persisted[0].payload.n, 1, 'payloads are persisted intact');
}

/* ---- back online: everything goes, queue empties ---- */

{
  stub.online = true;
  stub.responders.saveProgress = ok;

  const res = await offlineQueue.flush();
  assert.strictEqual(res.sent, 2, 'both jobs are sent');
  assert.strictEqual(stub.calls.length, 2, 'the API saw both');
  assert.strictEqual(queued().length, 0, 'the queue is empty afterwards');
  assert.strictEqual(await offlineQueue.pendingCount(), 0, 'nothing pending');
}

/* ---- a rejected job is kept, not dropped ---- */

{
  reset(true);
  stub.responders.saveProgress = () => {
    throw new Error('500 from server');
  };
  await offlineQueue.enqueue('saveProgress', 'p1:B1', { property_id: 'p1' });

  const res = await offlineQueue.flush();
  assert.strictEqual(res.sent, 0, 'a rejected job counts as unsent');
  const after = queued();
  assert.strictEqual(after.length, 1, 'a rejected job MUST stay queued');
  assert.strictEqual(after[0].attempts, 1, 'the attempt is recorded');
  assert.match(after[0].lastError, /500 from server/, 'the error is recorded');

  // ...and goes on the next flush once the server is healthy.
  stub.responders.saveProgress = ok;
  assert.strictEqual((await offlineQueue.flush()).sent, 1, 'it is retried and accepted');
  assert.strictEqual(queued().length, 0, 'then it is gone');
}

/* ---- a server that answers {success:false} is a failure, not a success ---- */

{
  reset(true);
  stub.responders.saveProgress = () => ({ success: false, msg: 'bad payload' });
  await offlineQueue.enqueue('saveProgress', 'p1:B1', {});
  await offlineQueue.flush();
  assert.strictEqual(queued().length, 1, 'success:false must not clear the job');
}

/* ---- the whole offline inspection, replayed in order ---- */

{
  reset(false);

  // Offline: a property is created, then work is saved against its local id,
  // and a photo could not be uploaded.
  const localId = 'local-1700000000-abc';
  const localUri = 'file:///data/img-1.jpg';

  await offlineQueue.enqueue('createProperty', `createProperty:${localId}`, {
    localId,
    data: { name: 'Offline Property' },
  });
  await offlineQueue.enqueue('uploadImage', `uploadImage:${localUri}`, {
    imageUri: localUri,
    folder: 'nspire-inspections',
  });
  await offlineQueue.enqueue('saveProgress', `saveProgress:${localId}:B1`, {
    property_id: localId,
    inspectionData: {
      property: { _id: localId },
      deficiencies: [{ propertyId: localId, imageUri: localUri, imageUrl: null }],
    },
  });

  // The caches the screens read hold the local id too.
  stub.storage['cached_properties_v1'] = JSON.stringify([{ _id: localId, name: 'Offline Property' }]);
  stub.storage[`saved_inspection_${localId}_B1`] = JSON.stringify({
    property: { _id: localId },
    deficiencies: [{ imageUri: localUri }],
  });
  stub.storage[`buildingNames_${localId}`] = JSON.stringify({ B1: 'North Tower' });

  assert.strictEqual(queued().length, 3, 'three writes are waiting');

  // Connection returns.
  stub.online = true;
  stub.responders.createProperty = () => ({ success: true, property: { _id: '65fREAL' } });
  stub.responders.uploadImage = () => ({ success: true, url: 'https://cdn/img-1.jpg' });
  stub.responders.saveProgress = ok;

  const res = await offlineQueue.flush();

  assert.strictEqual(res.sent, 3, 'all three writes reach the server');
  assert.strictEqual(queued().length, 0, 'the queue drains completely');

  // The saveProgress that actually went must carry the REAL id and URL.
  const sent = stub.calls.find((c: any) => c.kind === 'saveProgress').payload;
  assert.strictEqual(sent.property_id, '65fREAL', 'the write went against the real property');
  assert.strictEqual(sent.inspectionData.property._id, '65fREAL', 'nested id was remapped');
  assert.strictEqual(
    sent.inspectionData.deficiencies[0].propertyId,
    '65fREAL',
    'the deficiency points at the real property'
  );
  assert.strictEqual(
    sent.inspectionData.deficiencies[0].imageUri,
    'https://cdn/img-1.jpg',
    'the local file URI became the uploaded URL'
  );

  // And the caches must not be left holding the local id.
  const everything = JSON.stringify(stub.storage);
  assert.ok(!everything.includes(localId), 'no cache may still hold the local id');
  assert.ok(!everything.includes(localUri), 'no cache may still hold the local image URI');
  assert.ok(
    stub.storage['cached_properties_v1'].includes('65fREAL'),
    'the cached property now carries the real id'
  );
  assert.ok(
    'buildingNames_65fREAL' in stub.storage,
    'a key that embedded the local id was renamed'
  );
  assert.deepStrictEqual(
    JSON.parse(stub.storage['buildingNames_65fREAL']),
    { B1: 'North Tower' },
    'the renamed key kept its contents'
  );
}

/* ---- the connection dropping mid-flush keeps the rest ---- */

{
  reset(true);
  await offlineQueue.enqueue('saveProgress', 'p1:B1', { n: 1 });
  await offlineQueue.enqueue('saveProgress', 'p1:B2', { n: 2 });
  await offlineQueue.enqueue('saveProgress', 'p1:B3', { n: 3 });

  let seen = 0;
  stub.responders.saveProgress = () => {
    seen++;
    if (seen === 1) return ok();
    stub.online = false; // signal lost right after the first one
    throw new Error('connection lost');
  };

  await offlineQueue.flush();
  const left = queued();
  assert.strictEqual(left.length, 2, 'only the accepted job is cleared');
  assert.deepStrictEqual(
    left.map((j: any) => j.dedupeKey).sort(),
    ['p1:B2', 'p1:B3'],
    'the unsent jobs are exactly the ones still waiting'
  );
}

/* ---- reconnecting triggers a flush by itself ---- */

{
  reset(false);
  stub.responders.saveProgress = ok;
  await offlineQueue.enqueue('saveProgress', 'p1:B1', { n: 1 });

  await offlineQueue.start();
  assert.ok(stub.listeners.length > 0, 'start() subscribes to connection changes');

  stub.online = true;
  stub.listeners.forEach((fn: any) => fn(true)); // NetInfo reports the connection back
  await new Promise((r) => setTimeout(r, 50));

  assert.strictEqual(queued().length, 0, 'coming back online drains the queue on its own');
  offlineQueue.stop();
}

console.log('offlineQueue.integration.check.ts OK — offline work is held, replayed in order, and local ids/URIs are swapped everywhere');
