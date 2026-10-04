import { register } from 'node:module';

// The in-memory world the stubs read; the check drives it.
globalThis.__offlineStub = {
  storage: {},
  online: false,
  listeners: [],
  calls: [],
  responders: {},
  call(kind, payload) {
    this.calls.push({ kind, payload });
    const responder = this.responders[kind];
    if (!responder) throw new Error(`no responder for ${kind}`);
    return responder(payload);
  },
};

register('./loader.mjs', import.meta.url);
