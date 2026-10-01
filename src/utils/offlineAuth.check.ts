/**
 * Self-check for what happens to a session when the network is gone.
 *
 *   node --experimental-strip-types \
 *     --import ./src/utils/__offlineStubs/register.mjs \
 *     src/utils/offlineAuth.check.ts
 *
 * What this guards: requests now fail immediately when the device reports no
 * connection, instead of burning a 30s timeout. That is the fix for the frozen
 * screen, but it moves `verifyToken()` from "slower than the 1.5s assume-valid
 * race in checkSession()" to "faster than it" — and checkSession() calls
 * logout() when verifyToken() answers false. Without the unreachable/rejected
 * split in authService, going offline would silently log an inspector out and
 * take the queued offline work with it. These two cases pin that split down.
 */

import assert from 'node:assert';
import authService from '../services/authService.ts';
import { OfflineError, isUnreachableError } from '../services/api.ts';

const stub = (globalThis as any).__offlineStub;

const TOKEN_KEY = '@inspire:user_token';
const USER_KEY = '@inspire:user_data';

const seedSignedInUser = () => {
  stub.storage = {
    [TOKEN_KEY]: JSON.stringify('a-real-token'),
    [USER_KEY]: JSON.stringify({ _id: 'u1', fullName: 'Inspector', email: 'i@x.com', role: 'inspector' }),
  };
};

/* ---- an unreachable server must never end the session ---- */

{
  seedSignedInUser();
  stub.noConnection = true;

  // Any call that escapes the offline guard would hit the real backend.
  globalThis.fetch = (() => {
    throw new Error('offline check made a real request');
  }) as any;

  const state = await authService.checkSession();

  assert.strictEqual(state.isAuthenticated, true, 'offline must keep the inspector signed in');
  assert.ok(state.user, 'the cached user must be returned');
  assert.ok(TOKEN_KEY in stub.storage, 'offline must NOT clear the stored token');
}

/* ---- a server that actually rejects the token must end it ---- */

{
  seedSignedInUser();
  stub.noConnection = false;

  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ success: false, message: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })) as any;

  const state = await authService.checkSession();

  assert.strictEqual(state.isAuthenticated, false, 'a rejected token must end the session');
  assert.ok(!(TOKEN_KEY in stub.storage), 'a rejected token must clear the stored token');
}

/* ---- the classifier the split rests on ---- */

{
  assert.ok(isUnreachableError(new OfflineError()), 'OfflineError is unreachable');
  assert.ok(
    isUnreachableError(new Error('Network request failed')),
    "React Native's own offline fetch error is unreachable"
  );
  assert.ok(
    isUnreachableError(new Error('Request timeout. Please check your connection.')),
    'the timeout thrown by apiRequest is unreachable'
  );

  const aborted = new Error('Aborted');
  aborted.name = 'AbortError';
  assert.ok(isUnreachableError(aborted), 'an aborted request is unreachable');

  // The other side of the split: these are real answers and must stay logouts.
  assert.ok(!isUnreachableError(new Error('Invalid token')), 'a rejection is NOT unreachable');
  assert.ok(
    !isUnreachableError(new Error('HTTP error! status: 401')),
    'a 401 is NOT unreachable'
  );
  assert.ok(!isUnreachableError(undefined), 'a missing error must not count as unreachable');
}

console.log(
  'offlineAuth.check.ts OK — offline keeps the session, a rejected token still ends it'
);
