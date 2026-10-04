const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { stub } = require('./helpers');

delete process.env.SUPABASE_URL;
const rows = new Map();
let seq = 0;
class History {
  constructor(d) { Object.assign(this, { note: '', rating: null, photoUrl: '', status: 'done', plannedAt: null, spunAt: new Date() }, d); }
  static async create(d) { const h = new History({ id: ++seq, ...d }); rows.set(h.id, h); return h; }
  static async findByPk(id) { return rows.get(Number(id)) || null; }
  async update(p) { Object.assign(this, p); return this; }
  async destroy() { rows.delete(this.id); }
}
stub('../models', { History });
const svc = require('../src/services/history.service');
const storage = require('../src/services/storage.service');
const png = fs.readFileSync(path.join(__dirname, '..', '..', 'frontend', 'public', 'icons', 'icon-192.png'));

after(() => fs.rmSync(storage.UPLOAD_DIR, { recursive: true, force: true }));

test('create: plannedAt -> rencana; tanpa -> sudah pergi', async () => {
  const plan = await svc.create({ placeId: 1, placeName: 'Museum', plannedAt: '2026-10-07T05:00:00.000Z' });
  assert.equal(plan.status, 'planned');
  assert.ok(plan.plannedAt instanceof Date);
  const now = await svc.create({ placeName: ' Sate ' });
  assert.equal(now.status, 'done');
  assert.equal(now.placeName, 'Sate');
  await assert.rejects(svc.create({ placeName: '' }), /placeName wajib/);
  await assert.rejects(svc.create({ placeName: 'Z', plannedAt: 'bukan tanggal' }), /tidak valid/);
});

test('update status done: tanggal pergi = tanggal rencana bila sudah lewat, else sekarang', async () => {
  const before = Date.now();
  const future = await svc.create({ placeName: 'X', plannedAt: new Date(Date.now() + 86400000).toISOString() });
  await svc.update(future.id, { status: 'done' });
  assert.ok(future.spunAt.getTime() >= before);

  const past = await svc.create({ placeName: 'Y', plannedAt: '2026-09-01T05:00:00.000Z' });
  await svc.update(past.id, { status: 'done' });
  assert.equal(past.spunAt.toISOString(), '2026-09-01T05:00:00.000Z');
});

test('update jurnal + validasi', async () => {
  const h = await svc.create({ placeName: 'J' });
  await svc.update(h.id, { rating: 4, note: 'seru' });
  assert.equal(h.rating, 4);
  await svc.update(h.id, { rating: null });
  assert.equal(h.rating, null);
  await assert.rejects(svc.update(h.id, { rating: 9 }), /rating harus 1-5/);
  await assert.rejects(svc.update(h.id, { rating: 2.5 }), /rating harus 1-5/);
  await assert.rejects(svc.update(h.id, { status: 'x' }), /status harus/);
  await assert.rejects(svc.update(999, {}), /tidak ditemukan/);
});

test('foto ke disk: ganti menghapus lama, hapus riwayat menghapus file', async () => {
  const h = await svc.create({ placeName: 'F' });
  await svc.setPhoto(h.id, { buffer: png, mimetype: 'image/png' });
  assert.match(h.photoUrl, /^\/uploads\/h\d+-.*\.png$/);
  const f1 = path.join(storage.UPLOAD_DIR, path.basename(h.photoUrl));
  assert.ok(fs.existsSync(f1));

  await svc.setPhoto(h.id, { buffer: png, mimetype: 'image/jpeg' });
  assert.ok(!fs.existsSync(f1));
  assert.match(h.photoUrl, /\.jpg$/);
  const f2 = path.join(storage.UPLOAD_DIR, path.basename(h.photoUrl));

  await svc.removePhoto(h.id);
  assert.equal(h.photoUrl, '');
  assert.ok(!fs.existsSync(f2));

  await svc.setPhoto(h.id, { buffer: png, mimetype: 'image/png' });
  const f3 = path.join(storage.UPLOAD_DIR, path.basename(h.photoUrl));
  await svc.remove(h.id);
  assert.ok(!fs.existsSync(f3));
  await assert.rejects(svc.setPhoto(999, null), /tidak ditemukan/);
});
