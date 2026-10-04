import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, indexTrips, isDone, isPlanned, monthGrid, upcomingPlans } from './calendar.js';

const at = (y, m, d, h = 12) => new Date(y, m - 1, d, h).toISOString();

test('dayKey pakai tanggal lokal', () => {
  assert.equal(dayKey(new Date(2026, 9, 7, 23, 59)), '2026-10-07');
  assert.equal(dayKey(at(2026, 1, 3)), '2026-01-03');
});

test('status: tanpa status = sudah pergi (data lama)', () => {
  assert.equal(isDone({}), true);
  assert.equal(isPlanned({ status: 'planned' }), true);
  assert.equal(isDone({ status: 'planned' }), false);
});

test('indexTrips: kelompok per hari, naik level di kunjungan ke-3/6/..., rencana terpisah', () => {
  const items = [
    { id: 1, spunAt: at(2026, 9, 6) },
    { id: 2, spunAt: at(2026, 9, 13) },
    { id: 3, spunAt: at(2026, 9, 20) }, // ke-3 -> LV.02
    { id: 4, spunAt: at(2026, 10, 2, 13) },
    { id: 5, spunAt: at(2026, 10, 2, 19) },
    { id: 6, spunAt: at(2026, 10, 3) }, // ke-6 -> LV.03
    { id: 7, status: 'planned', plannedAt: at(2026, 10, 10), spunAt: at(2026, 10, 1) },
  ];
  const map = indexTrips(items);
  assert.equal(map.get('2026-09-20').levelUp, 2);
  assert.equal(map.get('2026-10-03').levelUp, 3);
  assert.equal(map.get('2026-10-02').levelUp, null);
  assert.equal(map.get('2026-10-02').trips.length, 2);
  assert.deepEqual(map.get('2026-10-10').plans.map((p) => p.id), [7]);
  assert.equal(map.get('2026-10-10').trips.length, 0);
  assert.equal(map.has('2026-10-01'), false, 'rencana diindeks di plannedAt, bukan spunAt');
});

test('indexTrips: urutan input tidak memengaruhi momen naik level', () => {
  const asc = [1, 2, 3].map((d) => ({ id: d, spunAt: at(2026, 9, d) }));
  const desc = [...asc].reverse();
  assert.equal(indexTrips(desc).get('2026-09-03').levelUp, 2);
  assert.equal(indexTrips(asc).get('2026-09-03').levelUp, 2);
});

test('upcomingPlans: hanya rencana, terdekat dulu', () => {
  const items = [
    { id: 1, status: 'planned', plannedAt: at(2026, 12, 1) },
    { id: 2, spunAt: at(2026, 9, 1) },
    { id: 3, status: 'planned', plannedAt: at(2026, 10, 5) },
  ];
  assert.deepEqual(upcomingPlans(items).map((p) => p.id), [3, 1]);
});

test('monthGrid: Senin kolom pertama, panjang kelipatan 7', () => {
  const okt = monthGrid(2026, 9); // 1 Okt 2026 = Kamis -> 3 sel kosong
  assert.equal(okt.slice(0, 3).every((c) => c === null), true);
  assert.equal(okt[3].getDate(), 1);
  assert.equal(okt.length % 7, 0);
  assert.equal(okt.filter(Boolean).length, 31);
  const feb = monthGrid(2028, 1); // kabisat
  assert.equal(feb.filter(Boolean).length, 29);
});
