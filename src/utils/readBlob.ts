/**
 * Reading a blob, bounded.
 *
 * FileReader reports through onloadend and onerror. Wrapping it in a promise
 * and waiting on those alone means that if neither ever fires -- a truncated
 * download, a blob the platform cannot read -- the promise never settles, and
 * every caller awaiting it waits for good. That is one of the ways saving a
 * deficiency left the screen frozen.
 *
 * So give it a deadline, and tear the reader down when it passes.
 */

/** Long enough for a large photo on a slow device, short enough to notice. */
export const BLOB_READ_TIMEOUT_MS = 20000;

export const readBlobAsDataUrl = (
  blob: Blob,
  timeoutMs: number = BLOB_READ_TIMEOUT_MS,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    let settled = false;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    const timer = setTimeout(() => {
      finish(() => {
        try {
          reader.abort();
        } catch (_) {
          // abort() throws if the read already ended; nothing to do about it.
        }
        reject(new Error(`Reading the image took longer than ${timeoutMs}ms`));
      });
    }, timeoutMs);

    reader.onloadend = () => finish(() => resolve(reader.result as string));
    reader.onerror = () => finish(() => reject(reader.error || new Error('Could not read the image')));

    try {
      reader.readAsDataURL(blob);
    } catch (error) {
      finish(() => reject(error));
    }
  });

/** The same, without the `data:...;base64,` prefix. */
export const readBlobAsBase64 = async (blob: Blob, timeoutMs?: number): Promise<string> => {
  const dataUrl = await readBlobAsDataUrl(blob, timeoutMs);
  return dataUrl.split(',')[1] ?? '';
};
