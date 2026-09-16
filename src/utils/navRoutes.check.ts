/**
 * Route/param audit for every navigation call in the app.
 *
 *   node --experimental-strip-types src/utils/navRoutes.check.ts
 *
 * Why this exists: ~2/3 of the navigate calls are written
 * `navigation.navigate('X' as any, {...})`, which switches off the compiler.
 * That is how a screen ends up being handed `{ propertyId }` when it destructures
 * `{ property }` — no type error, just a blank screen. This reads App.tsx's
 * RootStackParamList and checks the calls the compiler cannot see.
 */

import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const app = readFileSync(join(root, 'App.tsx'), 'utf8');

/** Slice out the object/`undefined` after `Route:` and return its required keys. */
function requiredParams(block: string, from: number): Set<string> {
  let depth = 0;
  let i = from;
  for (; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const body = block.slice(from + 1, i);
  const declared = new Set([...body.matchAll(/(?:^|;|\{)\s*([A-Za-z_]\w*)\s*:/g)].map((m) => m[1]));
  for (const m of body.matchAll(/([A-Za-z_]\w*)\s*\?\s*:/g)) declared.delete(m[1]);
  return declared;
}

const listBlock = app.slice(app.indexOf('export type RootStackParamList'));
const paramList = listBlock.slice(0, listBlock.indexOf('\n};'));

const routes = new Map<string, Set<string>>();
for (const m of paramList.matchAll(/^ {2}([A-Za-z]+): (undefined|\{)/gm)) {
  routes.set(
    m[1],
    m[2] === 'undefined' ? new Set() : requiredParams(paramList, m.index! + m[0].length - 1)
  );
}
assert.ok(routes.size > 20, `expected the full param list, parsed ${routes.size} routes`);

/** Registered screens — a route can be typed but never mounted. */
const registered = new Set(
  [...app.replace(/\s+/g, ' ').matchAll(/<Stack\.Screen name="([A-Za-z]+)"/g)].map((m) => m[1])
);

/** Top-level keys of a `{...}` literal, ignoring nested braces. */
function topLevelKeys(src: string, open: number): Set<string> {
  let depth = 0;
  let i = open;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const keys = new Set<string>();
  let nest = 0;
  let buf = '';
  const flush = () => {
    const m = /^\s*([A-Za-z_]\w*)/.exec(buf);
    if (m) keys.add(m[1]);
    buf = '';
  };
  for (const ch of src.slice(open + 1, i)) {
    if ('{[('.includes(ch)) nest++;
    else if ('}])'.includes(ch)) nest--;
    else if (ch === ',' && nest === 0) {
      flush();
      continue;
    }
    buf += ch;
  }
  flush();
  return keys;
}

const dirs = ['src/screens', 'src/components'];
const files = dirs.flatMap((d) =>
  readdirSync(join(root, d))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => `${d}/${f}`)
);
assert.ok(files.length > 30, `expected the screen set, found ${files.length} files`);

const unknownRoute: string[] = [];
const missingParams: string[] = [];

for (const rel of files) {
  const src = readFileSync(join(root, rel), 'utf8');
  const calls = src.matchAll(
    /navigation\.(?:navigate|push|replace)\(\s*['"]([A-Za-z]+)['"]\s*(?:as\s+\w+\s*)?(,\s*\{)?/g
  );
  for (const m of calls) {
    const route = m[1];
    const line = src.slice(0, m.index).split('\n').length;
    if (!registered.has(route)) {
      unknownRoute.push(`${rel}:${line} navigate('${route}') — not a <Stack.Screen>`);
      continue;
    }
    const required = routes.get(route);
    if (!required?.size) continue;
    if (!m[2]) {
      missingParams.push(`${rel}:${line} navigate('${route}') passes no params, needs ${[...required]}`);
      continue;
    }
    const passed = topLevelKeys(src, m.index! + m[0].length - 1);
    const missing = [...required].filter((k) => !passed.has(k));
    if (missing.length) {
      missingParams.push(`${rel}:${line} navigate('${route}') missing ${missing}`);
    }
  }
}

assert.deepStrictEqual(unknownRoute, [], `\n${unknownRoute.join('\n')}\n`);
assert.deepStrictEqual(missingParams, [], `\n${missingParams.join('\n')}\n`);

console.log(`navRoutes.check.ts OK — ${routes.size} routes, ${files.length} files`);
