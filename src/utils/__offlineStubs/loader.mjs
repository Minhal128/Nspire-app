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
  // For networkService.check.ts, which runs the real networkService.
  netinfo: `
    const st = globalThis.__offlineStub;
    export default {
      fetch: async () => st.netState,
      addEventListener: (fn) => { st.netInfoListener = fn; return () => {}; },
    };
    // Type-only names networkService imports without 'type'.
    export const NetInfoState = undefined, NetInfoSubscription = undefined;
  `,
  networkService: `
    const st = globalThis.__offlineStub;
    const networkService = {
      isOnline: () => st.online,
      // Defaults to "assume we have a connection", like the real one before
      // initialize() runs, so a check that never sets it takes the online path.
      hasNoConnection: () => st.noConnection === true,
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
  // For nspireExcelExport.check.ts: the device folder picker, file writes and
  // share sheet, recorded on __offlineStub so the check can assert on them.
  reactNative: `
    export const Platform = { get OS() { return globalThis.__offlineStub.os || 'android'; } };
  `,
  fileSystem: `
    const st = () => globalThis.__offlineStub;
    export const documentDirectory = 'file:///data/app/files/';
    export const EncodingType = { Base64: 'base64', UTF8: 'utf8' };
    export const writeAsStringAsync = async (uri, contents) => { st().files[uri] = contents; };
    export const StorageAccessFramework = {
      getUriForDirectoryInRoot: (name) => 'content://com.android.externalstorage.documents/tree/primary%3A' + name,
      requestDirectoryPermissionsAsync: async (initialUri) => {
        st().calls.push({ kind: 'picker', payload: initialUri });
        return st().pickerResult;
      },
      createFileAsync: async (dirUri, fileName) => {
        if ((st().deadDirs || []).includes(dirUri)) throw new Error('permission revoked');
        return dirUri + '/document/' + encodeURIComponent(fileName);
      },
    };
  `,
  sharing: `
    const st = () => globalThis.__offlineStub;
    export const isAvailableAsync = async () => st().shareAvailable !== false;
    export const shareAsync = async (uri) => { st().calls.push({ kind: 'share', payload: uri }); };
  `,
  print: `
    export const Orientation = { portrait: 'portrait', landscape: 'landscape' };
    export const printAsync = async (opts) => { globalThis.__offlineStub.calls.push({ kind: 'print', payload: opts }); };
  `,
  // The workbook now comes from the server, so the check plays the server: its
  // 'excel' responder returns the base64 workbook, or throws to stand in for a
  // device with no connection.
  // For capturedImage.check.ts: the document directory and the copy, recorded
  // so the check can assert the photo left the cache.
  captureFileSystem: `
    const st = () => globalThis.__offlineStub;
    export const documentDirectory = 'file:///data/app/files/';
    export const EncodingType = { Base64: 'base64', UTF8: 'utf8' };
    export const getInfoAsync = async (uri) => ({
      exists: !(st().missingDirs || []).includes(uri),
      uri,
    });
    export const makeDirectoryAsync = async (uri) => {
      st().missingDirs = (st().missingDirs || []).filter((d) => d !== uri);
      st().calls.push({ kind: 'mkdir', payload: uri });
    };
    export const copyAsync = async ({ from, to }) => {
      if (st().copyFails) throw new Error('no space left on device');
      st().files[to] = from;
    };
    export const writeAsStringAsync = async (uri, contents) => { st().files[uri] = contents; };
    export const readAsStringAsync = async (uri) => st().files[uri];
    export const deleteAsync = async (uri) => { delete st().files[uri]; };
    export const StorageAccessFramework = {};
  `,
  openaiService: `export const InspectionFinding = {};`,
  excelApi: `
    const st = () => globalThis.__offlineStub;
    export const apiRequestBase64 = async (endpoint, options) =>
      st().call('excel', { endpoint, body: options && options.body });
    export const isUnreachableError = (error) => {
      const name = String((error && error.name) || '');
      const message = String((error && error.message) || '').toLowerCase();
      return name === 'OfflineError' || name === 'AbortError' ||
        message.includes('network request failed') || message.includes('request timeout');
    };
  `,
};

const EXCEL_STUBS = {
  'react-native': 'reactNative',
  'expo-file-system/legacy': 'fileSystem',
  'expo-sharing': 'sharing',
  'expo-print': 'print',
  '../services/api': 'excelApi',
};

export async function resolve(specifier, context, next) {
  const parent = context.parentURL || '';
  const fromQueue = parent.includes('/services/offlineQueue.ts');

  if (specifier === '@react-native-community/netinfo') {
    return { url: `${STUB}netinfo`, format: 'module', shortCircuit: true };
  }
  if (specifier === '@react-native-async-storage/async-storage') {
    return { url: `${STUB}asyncStorage`, format: 'module', shortCircuit: true };
  }
  // networkService wraps NetInfo, which does not exist outside a device, so it
  // is stubbed for every importer rather than only the queue.
  if (specifier === './networkService') {
    return { url: `${STUB}networkService`, format: 'module', shortCircuit: true };
  }
  if (parent.includes('/utils/nspireExcelExport.ts') && specifier in EXCEL_STUBS) {
    return { url: `${STUB}${EXCEL_STUBS[specifier]}`, format: 'module', shortCircuit: true };
  }
  // capturedImage.check.ts reaches expo-file-system through offlineStorageService.
  if (parent.includes('/services/offlineStorageService.ts')) {
    if (specifier === 'expo-file-system/legacy') {
      return { url: `${STUB}captureFileSystem`, format: 'module', shortCircuit: true };
    }
    if (specifier === './openaiService') {
      return { url: `${STUB}openaiService`, format: 'module', shortCircuit: true };
    }
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
