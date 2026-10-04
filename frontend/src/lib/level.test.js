import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levelFrom, titleFor } from './level.js';

test('level naik tiap 3 kunjungan', () => {
  assert.equal(levelFrom(0).level, 1);
  assert.equal(levelFrom(2).level, 1);
  assert.equal(levelFrom(3).level, 2);
  assert.equal(levelFrom(6).level, 3);
  assert.equal(levelFrom(29).level, 10);
});

test('progress & toNext', () => {
  assert.deepEqual([levelFrom(4).into, levelFrom(4).toNext], [1, 2]);
  assert.equal(levelFrom(5).progress, 2 / 3);
  assert.equal(levelFrom(6).toNext, 3);
});

test('input aneh dianggap 0', () => {
  assert.equal(levelFrom(undefined).level, 1);
  assert.equal(levelFrom(-5).level, 1);
});

test('gelar per level: naik bertahap dan mentok di gelar terakhir', () => {
  assert.equal(titleFor(1), 'Baru Kenal');
  assert.equal(titleFor(3), 'Partner Jajan');
  assert.equal(titleFor(9), 'Pasangan Petualang'); // di antara 8 dan 10 pakai gelar 8
  assert.equal(titleFor(20), 'Kita Semesta Sendiri');
  assert.equal(titleFor(99), 'Kita Semesta Sendiri');
});
