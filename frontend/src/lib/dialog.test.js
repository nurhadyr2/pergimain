import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HAPPY, linesFor } from './dialog.js';

const MAX = 20; // balon muat ±16-20 karakter satu baris

test('semua kalimat cukup pendek untuk satu baris balon', () => {
  const kinds = ['idle', 'spinning', 'result', 'saved', 'planned', 'levelup', 'riwayat', 'locked', 'category'];
  const slugs = ['makan', 'nonton', 'museum', 'hewan', 'taman', 'jalan', 'main', 'belanja', 'nongkrong'];
  for (const kind of kinds)
    for (const slug of slugs)
      for (let seed = 0; seed < 12; seed++)
        for (const hour of [8, 12, 16, 21]) {
          const { girl, boy } = linesFor({ kind, slug, seed }, { hour, toNext: (seed % 3) + 1 });
          assert.ok(girl && boy, `${kind}/${slug}/${seed} kosong`);
          assert.ok(girl.length <= MAX, `cewek kepanjangan: "${girl}"`);
          assert.ok(boy.length <= MAX, `cowok kepanjangan: "${boy}"`);
        }
});

test('deterministik: seed sama -> kalimat sama', () => {
  const a = linesFor({ kind: 'category', slug: 'makan', seed: 3 });
  const b = linesFor({ kind: 'category', slug: 'makan', seed: 3 });
  assert.deepEqual(a, b);
});

test('kategori dikenal -> kalimat kategori; tidak dikenal -> jatuh ke santai', () => {
  const makan = ['Laper banget nih', 'Makan apa ya?'];
  assert.ok(makan.includes(linesFor({ kind: 'category', slug: 'makan', seed: 0 }).girl));
  assert.ok(makan.includes(linesFor({ kind: 'category', slug: 'makan', seed: 1 }).girl));
  const unknown = linesFor({ kind: 'category', slug: 'xyz', seed: 1 }, { hour: 9 });
  assert.ok(unknown.girl.length > 0);
});

test('santai mengikuti jam', () => {
  // seed ganjil -> pakai kalimat sesuai jam
  const pagi = linesFor({ kind: 'idle', seed: 1 }, { hour: 8 });
  const malam = linesFor({ kind: 'idle', seed: 1 }, { hour: 22 });
  assert.notDeepEqual(pagi, malam);
});

test('tinggal 1 kunjungan -> sesekali mengingatkan', () => {
  const r = linesFor({ kind: 'idle', seed: 3 }, { hour: 12, toNext: 1 });
  assert.equal(r.girl, 'Sekali lagi naik lv!');
});

test('HAPPY berisi suasana yang bikin pose peace', () => {
  for (const k of ['result', 'saved', 'planned', 'levelup']) assert.ok(HAPPY.has(k));
  assert.ok(!HAPPY.has('idle'));
});
