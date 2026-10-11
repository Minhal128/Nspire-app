/**
 * The reconnect must be announced, or offlineQueue never flushes and offline
 * work never reaches the server.
 *
 *   node --experimental-strip-types --import ./src/utils/__offlineStubs/register.mjs \
 *        src/utils/networkService.check.ts
 *
 * Android (seen on the emulator) turns airplane mode off in two steps:
 * connected-but-not-yet-reachable, then reachable.
 */

import assert from 'node:assert';
import networkService from '../services/networkService.ts';

const stub: any = (globalThis as any).__offlineStub;
const heard: boolean[] = [];
networkService.addListener((online) => heard.push(online));

const emit = (isConnected: boolean, isInternetReachable: boolean | null) =>
  stub.netInfoListener({ isConnected, isInternetReachable, type: 'cellular' });

stub.netState = { isConnected: false, isInternetReachable: false, type: 'none' };
await networkService.initialize();
assert.deepStrictEqual(heard, [false], 'starting offline is announced');

emit(true, false); // airplane mode off: interface up, not validated yet
assert.deepStrictEqual(heard, [false], 'not online until reachable');

emit(true, true); // network validated
assert.deepStrictEqual(heard, [false, true], 'the reconnect is announced');

emit(false, false);
assert.deepStrictEqual(heard, [false, true, false], 'going offline again is announced');

console.log('networkService.check.ts OK — reconnect announced through the not-yet-reachable step');
