import assert from 'node:assert';
import { isAllNA, markUnitNA, labelUnit, isNAInAll } from './unitNA.ts';

assert.ok(isAllNA({ a: 'N/A', b: 'N/A' }), 'all N/A');
assert.ok(!isAllNA({ a: 'N/A', b: 'No OD' }), 'mixed is inspected');
assert.ok(!isAllNA({ a: 'N/A', b: 'OD' }), 'a deficiency is inspected');
assert.ok(!isAllNA({}), 'no answers is not N/A');

const entry: { naUnits?: string[] } = {};
markUnitNA(entry, 'Unit 003', { a: 'N/A' });
markUnitNA(entry, 'Unit 001', { a: 'No OD' });
assert.deepStrictEqual(entry.naUnits, ['Unit 003']);
markUnitNA(entry, 'Unit 003', { a: 'No OD' }); // answered since: later source wins
assert.deepStrictEqual(entry.naUnits, []);

assert.strictEqual(labelUnit('Unit 003', ['Unit 003']), 'Unit 003 (N/A)');
assert.strictEqual(labelUnit('Unit 001', ['Unit 003']), 'Unit 001');

const na = { inspectedUnits: ['Unit 003'], naUnits: ['Unit 003'] };
const answered = { inspectedUnits: ['Unit 003'], naUnits: [] };
assert.ok(isNAInAll([na, {}], 'Unit 003'), 'N/A in the only entry listing it');
assert.ok(!isNAInAll([na, answered], 'Unit 003'), 'real answers in another entry win');
assert.ok(!isNAInAll([na], 'Unit 001'), 'unlisted unit is not N/A');
console.log('unitNA.check.ts OK — all-N/A units are labelled, others untouched');
