import assert from 'node:assert';
import { isAllNA, markUnitNA, labelUnit } from './unitNA.ts';

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
console.log('unitNA.check.ts OK — all-N/A units are labelled, others untouched');
