const { test } = require('node:test');
const assert = require('node:assert/strict');
const { stub } = require('./helpers');

const DAY = 86400000;
const places = [
  { id: 1, name: 'A-baru', priceLevel: 1 },
  { id: 2, name: 'B-kemarin', priceLevel: 1 },
  { id: 3, name: 'C-lama', priceLevel: 2 },
  { id: 4, name: 'D-royal', priceLevel: 3 },
  { id: 5, name: 'E-rencana', priceLevel: 1 },
];
const hist = [
  { placeId: 2, status: 'done', spunAt: new Date(Date.now() - 1 * DAY) },
  { placeId: 3, status: 'done', spunAt: new Date(Date.now() - 200 * DAY) },
  { placeId: 5, status: 'planned', spunAt: new Date() },
];
stub('../models', { History: { findAll: async () => hist } });
stub('./place.service', { findAll: async () => places });
const svc = require('../src/services/spin.service');

const metaFor = async (id, opts) => {
  for (let i = 0; i < 5000; i++) {
    const r = await svc.spin([], opts);
    if (r.winner.id === id) return r.meta;
  }
  throw new Error(`tempat ${id} tidak pernah keluar`);
};

test('budget memfilter priceLevel; budget tak dikenal ditolak', async () => {
  assert.deepEqual((await svc.spin([], { budget: 'royal' })).pool.map((p) => p.id), [4]);
  assert.deepEqual((await svc.spin([], { budget: 'hemat' })).pool.map((p) => p.id), [1, 2, 5]);
  assert.deepEqual((await svc.spin([], { budget: 'sedang' })).pool.map((p) => p.id), [3]);
  await assert.rejects(svc.spin([], { budget: 'mewah' }), /budget harus/);
});

test('fresh: hanya yang belum pernah; kalau habis, pesan jelas', async () => {
  const r = await svc.spin([], { fresh: true });
  assert.deepEqual(r.pool.map((p) => p.id).sort(), [1, 4, 5]);
  await assert.rejects(svc.spin([], { budget: 'sedang', fresh: true }), /udah pernah/);
});

test('meta: hari sejak kunjungan terakhir & status rencana', async () => {
  assert.equal((await metaFor(2)).lastVisitDays, 1);
  assert.equal((await metaFor(3)).lastVisitDays, 200);
  assert.equal((await metaFor(1)).lastVisitDays, null);
  assert.equal((await metaFor(5)).isPlanned, true);
});

test('bobot anti-bosan: baru > lama > rencana > kemarin', async () => {
  const n = {};
  for (let i = 0; i < 4000; i++) {
    const w = (await svc.spin([])).winner.id;
    n[w] = (n[w] || 0) + 1;
  }
  assert.ok(n[1] > n[3], `baru(${n[1]}) > lama(${n[3]})`);
  assert.ok(n[3] > n[5], `lama(${n[3]}) > rencana(${n[5]})`);
  assert.ok(n[5] > n[2], `rencana(${n[5]}) > kemarin(${n[2]})`);
  assert.ok(n[2] < 4000 * 0.05, 'yang kemarin dikunjungi hampir tak pernah keluar');
});
