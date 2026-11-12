/**
 * Bounded blob read check.
 *
 *   node --experimental-strip-types src/utils/readBlob.check.ts
 *
 * Saving a deficiency used to leave the screen dead. Most of the ways in were
 * visible -- an overlay that hid without releasing the save guard, a watchdog
 * firing on work that was still running. This one was not: FileReader wrapped
 * in a promise that only settles on onloadend or onerror, so a reader that
 * reports neither never settles, and the save awaiting it never returns.
 *
 * The assertion that matters is the first: a reader that says nothing must
 * still reject, and within its deadline.
 */

import assert from 'node:assert';

// A FileReader that behaves however the test needs. Node has none, and the
// point here is the silent one, which no real environment hands you on demand.
type Behaviour = 'silent' | 'load' | 'error';
let behaviour: Behaviour = 'silent';
let aborted = false;

class FakeFileReader {
  result: string | null = null;
  error: Error | null = null;
  onloadend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  readAsDataURL(_blob: unknown) {
    if (behaviour === 'load') {
      setTimeout(() => {
        this.result = 'data:image/png;base64,QUJD';
        this.onloadend?.();
      }, 5);
    } else if (behaviour === 'error') {
      setTimeout(() => {
        this.error = new Error('unreadable');
        this.onerror?.();
      }, 5);
    }
    // 'silent': says nothing, ever. This is the case that used to hang.
  }

  abort() {
    aborted = true;
  }
}

(globalThis as any).FileReader = FakeFileReader;

const { readBlobAsDataUrl, readBlobAsBase64 } = await import('./readBlob.ts');

const blob = {} as Blob;

// --- a reader that never reports anything ---------------------------------
behaviour = 'silent';
aborted = false;
const startedAt = Date.now();
await assert.rejects(
  () => readBlobAsDataUrl(blob, 120),
  /longer than 120ms/,
  'a silent reader must reject rather than hang'
);
const waited = Date.now() - startedAt;
assert.ok(waited < 2000, `rejected after ${waited}ms, which is not a deadline`);
assert.ok(aborted, 'the reader should be torn down when its deadline passes');

// --- the ordinary case still works ----------------------------------------
behaviour = 'load';
assert.strictEqual(await readBlobAsDataUrl(blob, 1000), 'data:image/png;base64,QUJD');
assert.strictEqual(await readBlobAsBase64(blob, 1000), 'QUJD', 'the data: prefix comes off');

// --- a reader that fails still fails, and says why -------------------------
behaviour = 'error';
await assert.rejects(() => readBlobAsDataUrl(blob, 1000), /unreadable/);

// --- a late reader cannot settle a promise the deadline already rejected ---
behaviour = 'silent';
await assert.rejects(() => readBlobAsDataUrl(blob, 60), /longer than 60ms/);

console.log('readBlob.check.ts OK — a silent reader rejects on time, a working one still reads');
