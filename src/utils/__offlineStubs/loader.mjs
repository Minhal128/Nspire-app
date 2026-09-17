/**
 * Loader for offlineQueue.integration.check.ts.
 *
 * offlineQueue.ts talks to AsyncStorage, NetInfo and four API services, none of
 * which exist outside a device. This swaps each of them for an in-memory stub
 * driven through globalThis.__offlineStub, so the real queue class — its flush
 * ordering, its remapping, its cache rewrites — runs unmodified under test.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const STUB = 'offline-stub:';

const SYNTHETIC = {
  asyncStorage: `
    // Dereferenced per call: the check replaces .storage between scenarios.
    const s = () => globalThis.__offlineStub.storage;
    export default {
      getItem: async (k) => (k in s() ? s()[k] : null),
      setItem: async (k, v) => { s()[k] = v; },
      removeItem: async (k) => { delete s()[k]; },
      getAllKeys: async () => Object.keys(s()),
    };
  `,
  networkService: `
    const st = globalThis.__offlineStub;
    const networkService = {
      isOnline: () => st.online,
      initialize: async () => {},
      addListener: (fn) => { st.listeners.push(fn); return () => {}; },
    };
    export default networkService;
    export { networkService };
  `,
  inspectionService: `
    const st = globalThis.__offlineStub;
    const inspectionService = {
      saveProgress: async (p) => st.call('saveProgress', p),
    };
    export default inspectionService;
    export { inspectionService };
  `,
  propertyService: `
    const st = globalThis.__offlineStub;
    const propertyService = {
      createProperty: async (d) => st.call('createProperty', d),
    };
    export default propertyService;
    export { propertyService };
  `,
  cloudinaryService: `
    const st = globalThis.__offlineStub;
    const cloudinaryService = {
      uploadImage: async (uri, folder) => st.call('uploadImage', { uri, folder }),
    };
    export default cloudinaryService;
    export { cloudinaryService };
  `,
};

export async function resolve(specifier, context, next) {
  const parent = context.parentURL || '';
  const fromQueue = parent.includes('/services/offlineQueue.ts');

  if (specifier === '@react-native-async-storage/async-storage') {
    return { url: `${STUB}asyncStorage`, format: 'module', shortCircuit: true };
  }
  if (fromQueue) {
    const name = specifier.replace('./', '');
    if (name in SYNTHETIC) {
      return { url: `${STUB}${name}`, format: 'module', shortCircuit: true };
    }
  }
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, parent);
    for (const ext of ['.ts', '.tsx', '/index.ts']) {
      if (existsSync(fileURLToPath(new URL(base.href + ext)))) return next(base.href + ext, context);
    }
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.startsWith(STUB)) {
    return { format: 'module', shortCircuit: true, source: SYNTHETIC[url.slice(STUB.length)] };
  }
  if (url.endsWith('.ts')) {
    return {
      format: 'module-typescript',
      shortCircuit: true,
      source: readFileSync(fileURLToPath(url), 'utf8'),
    };
  }
  return next(url, context);
}
