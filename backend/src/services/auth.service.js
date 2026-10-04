const crypto = require('crypto');
const { ApiError } = require('../utils/ApiError');

// Satu PIN berdua, disimpan di .env. Tidak ada tabel user.
const PIN = String(process.env.APP_PIN || '').trim();
if (!PIN) {
  console.error('\n[FATAL] APP_PIN belum di-set di .env (PIN buat buka aplikasi)\n');
  process.exit(1);
}
if (PIN.length < 4) {
  console.error('\n[FATAL] APP_PIN minimal 4 karakter\n');
  process.exit(1);
}

// Token sesi diturunkan dari PIN: ganti PIN di .env = semua HP harus login ulang.
// PIN sendiri tidak pernah dikirim ulang / disimpan di browser, hanya token ini.
const TOKEN = crypto.createHmac('sha256', PIN).update('mau-kemana-session:v1').digest('hex');

const safeEqual = (a, b) => {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

// Rem percobaan per IP: MAX_FAILS salah berturut-turut -> tunggu LOCK_MS.
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map(); // ip -> { fails, lockedUntil }

function prune() {
  const now = Date.now();
  for (const [ip, a] of attempts) if (a.lockedUntil < now && a.fails === 0) attempts.delete(ip);
  if (attempts.size > 5000) attempts.clear();
}

exports.login = (ip, pin) => {
  const now = Date.now();
  const a = attempts.get(ip) || { fails: 0, lockedUntil: 0 };

  if (a.lockedUntil > now) {
    const menit = Math.ceil((a.lockedUntil - now) / 60000);
    throw new ApiError(429, `Kebanyakan salah. Coba lagi ${menit} menit lagi`);
  }

  if (typeof pin !== 'string' || !safeEqual(pin.trim(), PIN)) {
    a.fails += 1;
    if (a.fails >= MAX_FAILS) {
      a.fails = 0;
      a.lockedUntil = now + LOCK_MS;
      attempts.set(ip, a);
      throw new ApiError(429, 'Kebanyakan salah. Coba lagi 15 menit lagi');
    }
    attempts.set(ip, a);
    throw new ApiError(401, `PIN salah (${MAX_FAILS - a.fails} percobaan lagi)`);
  }

  attempts.delete(ip);
  prune();
  return { token: TOKEN };
};

exports.verify = (token) => Boolean(token) && safeEqual(token, TOKEN);
