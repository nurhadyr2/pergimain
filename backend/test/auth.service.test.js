const { test } = require('node:test');
const assert = require('node:assert/strict');

process.env.APP_PIN = '2468';
const auth = require('../src/services/auth.service');

test('PIN benar -> token; token valid', () => {
  const { token } = auth.login('1.1.1.1', '2468');
  assert.equal(token.length, 64);
  assert.equal(auth.verify(token), true);
  assert.equal(auth.verify('salah'), false);
  assert.equal(auth.verify(''), false);
});

test('PIN salah -> 401 dengan sisa percobaan; non-string juga salah', () => {
  assert.throws(() => auth.login('2.2.2.2', '0000'), (e) => e.statusCode === 401 && /4 percobaan/.test(e.message));
  assert.throws(() => auth.login('2.2.2.2', 2468), (e) => e.statusCode === 401 && /3 percobaan/.test(e.message));
  // benar -> reset hitungan
  auth.login('2.2.2.2', '2468');
  assert.throws(() => auth.login('2.2.2.2', '1'), /4 percobaan/);
});

test('5x salah -> terkunci 15 menit, PIN benar pun ditolak', () => {
  for (let i = 0; i < 4; i++) assert.throws(() => auth.login('3.3.3.3', 'x'), (e) => e.statusCode === 401);
  assert.throws(() => auth.login('3.3.3.3', 'x'), (e) => e.statusCode === 429);
  assert.throws(() => auth.login('3.3.3.3', '2468'), (e) => e.statusCode === 429);
  // IP lain tidak terpengaruh
  assert.ok(auth.login('4.4.4.4', '2468').token);
});

test('token sama untuk PIN yang sama (deterministik), spasi di PIN diabaikan', () => {
  assert.equal(auth.login('5.5.5.5', '2468').token, auth.login('6.6.6.6', ' 2468 ').token);
});
