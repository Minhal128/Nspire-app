/**
 * Self-check for keeping a captured photo alive until it is uploaded.
 *
 *   node --experimental-strip-types \
 *     --import ./src/utils/__offlineStubs/register.mjs \
 *     src/utils/capturedImage.check.ts
 *
 * What this guards: the camera's URI points into the app's cache, which the OS
 * clears whenever it wants storage back. Offline that file is the only copy of
 * the photo — the upload is still queued — so a cleared cache left the queue
 * retrying a file that no longer existed and the deficiency lost its picture
 * for good. The copy must land somewhere that is not cache, and failing to
 * copy must never cost the inspector the deficiency itself.
 */

import assert from 'node:assert';
import { persistCapturedImage } from './capturedImage.ts';

const stub = (globalThis as any).__offlineStub;

const CACHE_URI = 'file:///data/cache/ImagePicker/abc123.jpg';

const reset = () => {
  stub.calls = [];
  stub.files = {};
  stub.copyFails = false;
  stub.missingPaths = [];
};

/* ---- the happy path: the photo leaves the cache ---- */
{
  reset();
  const kept = await persistCapturedImage(CACHE_URI, 'prop-1');

  assert.ok(!kept.includes('/cache/'), `copy must leave the cache directory, got ${kept}`);
  assert.ok(kept.includes('inspection_images/'), `copy belongs in the image directory, got ${kept}`);
  assert.ok(kept.startsWith('file:///data/app/files/'), `copy belongs in document storage, got ${kept}`);
  assert.ok(kept.includes('prop-1'), 'the copy is named after what it belongs to');
  assert.strictEqual(stub.files[kept], CACHE_URI, 'the bytes were actually copied');
}

/* ---- the directory does not exist yet: make it, do not lose the photo ---- */
{
  reset();
  stub.missingPaths = ['file:///data/app/files/inspection_images/'];
  const kept = await persistCapturedImage(CACHE_URI, 'prop-1');
  assert.ok(kept.includes('inspection_images/'), 'a missing directory is created, not a reason to fail');
}

/* ---- the copy fails: keep the original rather than dropping the photo ---- */
{
  reset();
  stub.copyFails = true;
  const kept = await persistCapturedImage(CACHE_URI, 'prop-1');
  assert.strictEqual(kept, CACHE_URI, 'a failed copy falls back to the cache URI, never to nothing');
}

/* ---- a URI that is not a local file is left alone ---- */
{
  reset();
  const remote = 'https://res.cloudinary.com/demo/image/upload/v1/x.jpg';
  assert.strictEqual(await persistCapturedImage(remote, 'prop-1'), remote, 'an uploaded URL is not re-copied');
  assert.strictEqual(await persistCapturedImage('', 'prop-1'), '', 'no URI, nothing to do');
  assert.deepStrictEqual(stub.files, {}, 'nothing was copied');
}

console.log('capturedImage.check.ts OK — captured photos leave the cache, the directory is created, a failed copy keeps the original, remote URLs are left alone');
