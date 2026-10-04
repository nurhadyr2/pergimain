/* Rekam video promo TikTok (9:16, 1080x1920) langsung dari aplikasi.
 *
 *   cd frontend && npm run build && npx vite preview --port 4173 &
 *   node promo/record-tiktok.cjs [folder-output]
 *
 * API ditiru (route Playwright) supaya tidak menyentuh data asli & tidak perlu PIN.
 * Frame ditangkap 1080x1920 lalu digabung ffmpeg jadi MP4 H.264 30fps.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const BASE_URL = process.env.PROMO_URL || 'http://localhost:4173';
const OUT = path.resolve(process.argv[2] || 'promo/out');
const FRAMES = path.join(OUT, 'frames');
const SITE = 'ngedatebarengayang.zavokra.com';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (y, m, d, h = 12) => new Date(y, m - 1, d, h).toISOString();

// ---------- data contoh ----------
const CATS = ['makan', 'nonton', 'museum', 'hewan', 'taman', 'jalan', 'main', 'belanja', 'nongkrong'];
const CAT_NAME = { makan: 'Makan', nonton: 'Nonton', museum: 'Museum', hewan: 'Hewan', taman: 'Taman', jalan: 'Jalan-jalan', main: 'Main', belanja: 'Belanja', nongkrong: 'Nongkrong' };
const categories = CATS.map((slug, i) => ({ id: i + 1, slug, name: CAT_NAME[slug] }));
const place = (id, name, slug, priceLevel, address) => ({ id, name, category: { slug, name: CAT_NAME[slug] }, priceLevel, address });
const places = [
  place(1, 'Sate Khas Senayan', 'makan', 2, 'Senayan'),
  place(2, 'Museum Nasional', 'museum', 1, 'Gambir'),
  place(3, 'Taman Suropati', 'taman', 0, 'Menteng'),
  place(4, 'Ragunan', 'hewan', 1, 'Jaksel'),
  place(5, 'Kopi Tuku', 'nongkrong', 1, 'Cipete'),
  place(6, 'XXI Plaza Senayan', 'nonton', 2, 'Senayan'),
  place(7, 'Timezone', 'main', 2, 'Grand Indonesia'),
  place(8, 'Kota Tua', 'jalan', 0, 'Jakbar'),
  place(9, 'Blok M', 'belanja', 2, 'Jaksel'),
];
const now = new Date();
const Y = now.getFullYear();
const M = now.getMonth() + 1;
const D = now.getDate();
const prev = (days) => { const d = new Date(now); d.setDate(D - days); return d; };
const pi = (days, h) => { const d = prev(days); return iso(d.getFullYear(), d.getMonth() + 1, d.getDate(), h); };
let seq = 100;
const history = [
  { id: 1, placeId: 8, placeName: 'Kota Tua', status: 'done', spunAt: pi(28, 15), rating: 4, note: 'panas tapi seru, fotonya banyak', photoUrl: '/promo/photo1.jpg' },
  { id: 2, placeId: 4, placeName: 'Ragunan', status: 'done', spunAt: pi(21, 10), rating: 5, note: 'liat kapibara!!', photoUrl: '' },
  { id: 3, placeId: 1, placeName: 'Sate Khas Senayan', status: 'done', spunAt: pi(14, 19), rating: 4, note: 'sate kulitnya juara', photoUrl: '/promo/photo2.jpg' },
  { id: 4, placeId: 6, placeName: 'XXI Plaza Senayan', status: 'done', spunAt: pi(7, 20), rating: 3, note: 'nangis berdua', photoUrl: '' },
  { id: 5, placeId: 7, placeName: 'Timezone', status: 'done', spunAt: pi(2, 16), rating: 4, note: '', photoUrl: '' },
  { id: 6, placeId: 5, placeName: 'Kopi Tuku', status: 'planned', plannedAt: iso(Y, M, D, 12), spunAt: pi(3, 9), rating: null, note: '', photoUrl: '' },
];

// ---------- overlay caption + jari ----------
const OVERLAY_CSS = `
#pv{position:fixed;inset:0;z-index:99999;pointer-events:none;font-family:VT323,monospace}
#pv .cap{position:absolute;left:50%;transform:translateX(-50%) scale(.9);width:max-content;max-width:88vw;
  background:#fff;border:4px solid #463a66;box-shadow:7px 7px 0 #463a66;padding:14px 20px;text-align:center;
  opacity:0;transition:opacity .18s,transform .18s}
#pv .cap.on{opacity:1;transform:translateX(-50%) scale(1)}
#pv .cap b{font-family:'Press Start 2P',monospace;font-size:21px;line-height:1.7;color:#352b4d;display:block}
#pv .cap b .pk{color:#e45f97}#pv .cap b .gr{color:#2f9e6e}#pv .cap b .pu{color:#8367c7}
#pv .cap small{display:block;font-size:28px;line-height:1.1;color:#6b5b95;margin-top:4px}
#pv .cap.pink{background:#f7a8c9}#pv .cap.sun{background:#ffe08a}#pv .cap.mint{background:#9fe6c6}
#pv .tap{position:absolute;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;
  background:rgba(228,95,151,.35);border:4px solid #e45f97;opacity:0;transform:scale(.4)}
#pv .tap.on{animation:pvtap .55s ease-out forwards}
@keyframes pvtap{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1.5)}}
#pv .end{position:absolute;inset:0;background:#efeaf9 radial-gradient(rgba(107,91,149,.08) 1px,transparent 1px);background-size:8px 8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;opacity:0;transition:opacity .35s}
#pv .end.on{opacity:1}
`;
const OVERLAY_JS = `
(() => {
  const root = document.createElement('div'); root.id = 'pv';
  const st = document.createElement('style'); st.textContent = ${JSON.stringify(OVERLAY_CSS)};
  document.head.appendChild(st); document.body.appendChild(root);
  const caps = {};
  window.__cap = (id, html, { top = '11%', cls = '' } = {}) => {
    let el = caps[id]; if (!el) { el = document.createElement('div'); el.className = 'cap'; root.appendChild(el); caps[id] = el; }
    el.className = 'cap ' + cls; el.style.top = top; el.innerHTML = html; requestAnimationFrame(() => el.classList.add('on'));
  };
  window.__capOff = (id) => { const el = caps[id]; if (el) el.classList.remove('on'); };
  window.__capClear = () => Object.keys(caps).forEach(window.__capOff);
  window.__tap = (x, y) => { const t = document.createElement('div'); t.className = 'tap'; t.style.left = x + 'px'; t.style.top = y + 'px'; root.appendChild(t); requestAnimationFrame(() => t.classList.add('on')); setTimeout(() => t.remove(), 700); };
  window.__end = (html) => { const e = document.createElement('div'); e.className = 'end'; e.innerHTML = html; root.appendChild(e); requestAnimationFrame(() => e.classList.add('on')); };
})();`;

// ---------- foto contoh (pastel + karakter) ----------
const ASSETS = path.resolve(__dirname, '..', 'frontend', 'src', 'Character dan Layout Kamar', 'assets');
const b64 = (f) => fs.readFileSync(path.join(ASSETS, f)).toString('base64');
const GIRL = b64('characters/girl-peace.png');
const BOY = b64('characters/boy-peace.png');

async function makePhotos(browser) {
  const girl = GIRL;
  const boy = BOY;
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 }, deviceScaleFactor: 1 });
  const out = [];
  for (const [i, bg, label] of [[1, 'linear-gradient(135deg,#ffd6e8,#cdbdec)', 'kota tua ☀️'], [2, 'linear-gradient(135deg,#ffe08a,#f7a8c9)', 'sate kulit 🍢']]) {
    await page.setContent(`<body style="margin:0;width:1280px;height:960px;background:${bg};display:flex;align-items:flex-end;justify-content:center;gap:40px;padding-bottom:120px;box-sizing:border-box;position:relative;font-family:monospace">
      <img src="data:image/png;base64,${girl}" style="width:280px;image-rendering:pixelated">
      <img src="data:image/png;base64,${boy}" style="width:280px;image-rendering:pixelated">
      <div style="position:absolute;top:70px;left:0;right:0;text-align:center;font-size:72px;color:#463a66">${label}</div></body>`);
    const buf = await page.screenshot({ type: 'jpeg', quality: 85 });
    fs.writeFileSync(path.join(OUT, `photo${i}.jpg`), buf);
    out.push(buf);
  }
  await page.close();
  return out;
}

(async () => {
  const browser = await chromium.launch();
  const photos = await makePhotos(browser);

  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'id-ID' });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.accept());
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

  // ----- API tiruan -----
  await page.route('**/promo/photo*.jpg', (r) => r.fulfill({ contentType: 'image/jpeg', body: photos[r.request().url().endsWith('1.jpg') ? 0 : 1] }));
  await page.route('**/api/**', (r) => {
    const req = r.request(); const u = new URL(req.url()); const m = req.method(); const pth = u.pathname;
    const json = (body, status = 200) => r.fulfill({ status, json: body });
    if (pth === '/api/auth/login') return json({ token: 'tok' });
    if (pth === '/api/auth/me') return json({ ok: true });
    if (pth === '/api/categories') return json(categories);
    if (pth === '/api/places') return json(places);
    if (pth === '/api/spin') {
      const fresh = u.searchParams.get('fresh') === '1';
      const budget = u.searchParams.get('budget');
      let pool = places;
      if (budget === 'hemat') pool = pool.filter((p) => p.priceLevel <= 1);
      if (fresh) pool = pool.filter((p) => !history.some((h) => h.placeId === p.id && h.status !== 'planned'));
      const winner = fresh ? pool.find((p) => p.id === 3) : pool.find((p) => p.id === 2);
      pool = [winner, ...pool.filter((p) => p !== winner)].slice(0, 5); // pool pendek = animasi spin ±2.5 dtk
      return json({ pool, winner, meta: { lastVisitDays: null, isPlanned: false } });
    }
    if (pth === '/api/history' && m === 'GET') return json([...history].sort((a, b) => new Date(b.spunAt) - new Date(a.spunAt)));
    if (pth === '/api/history' && m === 'POST') {
      const body = req.postDataJSON();
      const it = { id: ++seq, placeId: body.placeId, placeName: body.placeName, status: body.plannedAt ? 'planned' : 'done', plannedAt: body.plannedAt || null, spunAt: new Date().toISOString(), note: '', rating: null, photoUrl: '' };
      history.push(it); return json(it, 201);
    }
    let mm = pth.match(/^\/api\/history\/(\d+)\/photo$/);
    if (mm) { const it = history.find((h) => h.id == mm[1]); it.photoUrl = m === 'POST' ? '/promo/photo2.jpg' : ''; return json(it); }
    mm = pth.match(/^\/api\/history\/(\d+)$/);
    if (mm && m === 'PATCH') { const it = history.find((h) => h.id == mm[1]); const body = req.postDataJSON(); if (body.status === 'done' && it.status === 'planned') it.spunAt = new Date().toISOString(); Object.assign(it, body); return json(it); }
    if (mm && m === 'DELETE') { const i = history.findIndex((h) => h.id == mm[1]); if (i >= 0) history.splice(i, 1); return json({ ok: true }); }
    return json({ error: 'nf ' + pth }, 404);
  });

  // ----- perekam frame -----
  const cdp = await ctx.newCDPSession(page);
  const stamps = [];
  let recording = false;
  let n = 0;
  const startRecording = () => { recording = true; return (async () => {
    while (recording) {
      const t = Date.now();
      // clip memakai koordinat dokumen -> geser sesuai scroll supaya yang terekam = yang terlihat
      const { result } = await cdp.send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, clip: { x: 0, y: result.value || 0, width: 540, height: 960, scale: 2 } });
      fs.writeFileSync(path.join(FRAMES, `f${String(n++).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
      stamps.push(t);
    }
  })(); };
  let recLoop;
  let T0 = Date.now();
  const at = () => ((Date.now() - T0) / 1000).toFixed(1) + 's';

  // ----- helper -----
  const cap = (id, html, opts) => page.evaluate(([i, h, o]) => window.__cap(i, h, o), [id, html, opts || {}]);
  const capOff = (id) => page.evaluate((i) => window.__capOff(i), id);
  const clear = () => page.evaluate(() => window.__capClear());
  const tap = async (loc, holdMs = 320) => {
    await loc.scrollIntoViewIfNeeded();
    const box = await loc.boundingBox();
    const x = box.x + box.width / 2; const y = box.y + box.height / 2;
    await page.evaluate(([a, b]) => window.__tap(a, b), [x, y]);
    await sleep(holdMs);
    await page.mouse.click(x, y);
  };
  const scrollTo = async (loc, block = 'center') => {
    await loc.evaluate((el, b) => el.scrollIntoView({ behavior: 'smooth', block: b }), block);
    await sleep(700);
  };

  // ===================== MULAI =====================
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(OVERLAY_JS);
  // login dulu (di luar bagian menarik: token tersimpan lalu reload bersih)
  await page.getByLabel('PIN').fill('2468');
  await page.getByText('BUKA').click();
  await page.waitForSelector('text=PILIH KATEGORI');
  await page.evaluate(OVERLAY_JS);
  await page.waitForTimeout(400);
  recLoop = startRecording();
  T0 = Date.now();

  // --- HOOK (0-6 dtk) ---
  console.log(at(), 'hook');
  await cap('h1', `<b>pacar: <span class="pk">"terserah~"</span> 🙄</b>`, { top: '12%' });
  await sleep(1050);
  await cap('h2', `<b>aku: <span class="pu">*bikin website*</span> 💻</b>`, { top: '21%' });
  await sleep(1050);
  await clear();
  await cap('h3', `<b>biar <span class="pk">semesta</span> yang milih ✨</b>`, { top: '12%' });
  await tap(page.getByRole('button', { name: /SPIN!/ }));
  await page.waitForSelector('text=GAS SEKARANG', { timeout: 20000 });
  await clear();
  await scrollTo(page.getByText('HARI INI KITA KE...'), 'start');
  await cap('r1', `<b>nggak ada lagi<br>debat <span class="pk">1 jam</span> 😮‍💨</b><small>bahkan tau kalian udah pernah ke sana atau belum</small>`, { top: '58%' });
  await sleep(2300);
  await clear();

  // --- FILTER (≈6-12 dtk) ---
  console.log(at(), 'filter');
  await scrollTo(page.getByText('BUDGET'), 'center');
  await cap('f1', `<b>tanggal tua? 💸</b><small>filter budget + "belum pernah"</small>`, { top: '12%' });
  await tap(page.getByRole('button', { name: 'HEMAT' }));
  await sleep(300);
  await tap(page.getByRole('button', { name: 'BELUM PERNAH' }));
  await sleep(400);
  await tap(page.getByRole('button', { name: /SPIN!/ }));
  await page.waitForSelector('text=Taman Suropati', { timeout: 20000 });
  await sleep(300);
  await clear();
  await scrollTo(page.getByText('HARI INI KITA KE...'), 'start');
  await cap('f2', `<b><span class="gr">gratis</span> & belum pernah 🌿</b>`, { top: '58%' });
  await sleep(1800);
  await clear();

  // --- JADWALKAN (≈12-17 dtk) ---
  console.log(at(), 'jadwalkan');
  await cap('j1', `<b>belum bisa sekarang?</b><small>jadwalin aja 📌</small>`, { top: '12%' });
  await tap(page.getByRole('button', { name: 'JADWALKAN' }));
  await sleep(500);
  const d = new Date(now); d.setDate(D + 6);
  const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  await page.locator('input[type=date]').fill(ymd);
  await sleep(500);
  await tap(page.getByRole('button', { name: 'OK' }));
  await page.waitForSelector('text=RENCANA');
  await sleep(1200);
  await clear();

  // --- KALENDER (≈17-23 dtk) ---
  console.log(at(), 'kalender');
  await tap(page.getByRole('button', { name: 'RIWAYAT' }));
  await page.waitForSelector('.cal-cell.cal-plan');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(600);
  await scrollTo(page.locator('.cal-cell').first(), 'center');
  await cap('k1', `<b>kalender <span class="pk">kencan</span> kita ♥</b><small>♥ udah pergi · ★ naik level · 📌 rencana</small>`, { top: '12%' });
  await sleep(1500);
  await tap(page.locator('.cal-cell.cal-trip').first());
  await sleep(1800);
  await clear();

  // --- UDAH PERGI -> NAIK LEVEL (≈23-30 dtk) ---
  console.log(at(), 'level up');
  const plan = page.locator('.cal-cell.cal-plan').first();
  await tap(plan);
  await sleep(600);
  await cap('l1', `<b>abis jalan? tandain ✅</b>`, { top: '12%' });
  await sleep(600);
  await tap(page.locator('.pix-screen').getByRole('button', { name: /UDAH PERGI/ }).first());
  await page.waitForSelector('[role=dialog]', { timeout: 5000 });
  await sleep(500);
  await clear();
  await cap('l2', `<b>tiap 3x jalan<br><span class="pk">NAIK LEVEL</span> 🎉</b><small>dapet gelar baru tiap level</small>`, { top: '8%', cls: 'sun' });
  await sleep(3200);
  await clear();
  await tap(page.getByRole('button', { name: /YEAY/ }));
  await sleep(500);

  // --- JURNAL (≈30-38 dtk) ---
  console.log(at(), 'jurnal');
  await page.waitForSelector('text=CERITA HARI ITU');
  await cap('c1', `<b>terus tulis <span class="pk">ceritanya</span> 📸</b><small>rating · catatan · foto</small>`, { top: '6%' });
  const hearts = page.locator('.rate-heart');
  for (let i = 0; i < 5; i++) { await tap(hearts.nth(i), 120); await sleep(80); }
  await sleep(300);
  await page.locator('textarea').click();
  await page.keyboard.type('kopinya enak, ngobrol sampe 3 jam', { delay: 45 });
  await sleep(300);
  await page.locator('input[type=file]').setInputFiles(path.join(OUT, 'photo2.jpg'));
  await page.waitForSelector('img.jr-photo');
  await scrollTo(page.locator('img.jr-photo'), 'center');
  await sleep(1200);
  await tap(page.getByRole('button', { name: 'SIMPAN CERITA' }));
  await sleep(900);
  await clear();

  // --- KARAKTER (≈38-42 dtk) ---
  console.log(at(), 'karakter');
  await tap(page.getByRole('button', { name: 'SPIN', exact: true }));
  await sleep(300);
  await tap(page.locator('.cat-tile').first()); // makan -> "Laper banget nih"
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await sleep(900);
  await cap('x1', `<b>karakternya ikut <span class="pu">komen</span> 💬</b><small>beda kategori, beda celetukan</small>`, { top: '12%' });
  await sleep(2600);
  await clear();

  // --- PIN (≈42-46 dtk) ---
  console.log(at(), 'pin');
  await tap(page.getByRole('button', { name: /kunci/ }));
  await page.getByLabel('PIN').waitFor();
  await sleep(400);
  await cap('p1', `<b>cuma <span class="pk">kita berdua</span><br>yang bisa buka 🔒</b>`, { top: '12%' });
  await sleep(2400);
  await clear();

  // --- END CARD (≈46-51 dtk) ---
  console.log(at(), 'end');
  await page.evaluate(([site, girl, boy]) => window.__end(`
    <div style="display:flex;gap:28px;align-items:flex-end;margin-bottom:10px">
      <img src="data:image/png;base64,${girl}" style="width:112px;image-rendering:pixelated">
      <img src="data:image/png;base64,${boy}" style="width:112px;image-rendering:pixelated"></div>
    <div style="font-family:'Press Start 2P',monospace;font-size:13px;color:#8367c7;letter-spacing:1px">COBA DI</div>
    <div class="cap on" style="position:static;transform:none;max-width:92vw;padding:18px 22px"><b style="font-size:17px;color:#352b4d">${site}</b></div>
    <div style="font-size:30px;color:#6b5b95;margin-top:6px">bikin buat kita berdua ♥</div>
    <div style="margin-top:34px;font-family:'Press Start 2P',monospace;font-size:11px;color:#9f86d9;line-height:2">dibikin sama<br><span style="font-size:20px;color:#463a66">ZAVOKRA</span></div>
    <div style="font-size:28px;color:#e45f97;margin-top:10px">mau versi kalian? DM ya 💌</div>
  `), [SITE, GIRL, BOY]);
  await sleep(4500);

  recording = false;
  await recLoop;
  await browser.close();

  // ----- gabung jadi MP4 -----
  const list = stamps.map((t, i) => {
    const dur = (i + 1 < stamps.length ? stamps[i + 1] - t : 80) / 1000;
    return `file 'frames/f${String(i).padStart(5, '0')}.jpg'\nduration ${dur.toFixed(4)}`;
  }).join('\n') + `\nfile 'frames/f${String(stamps.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(path.join(OUT, 'frames.txt'), list);
  const mp4 = path.join(OUT, 'ngedate-tiktok.mp4');
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'frames.txt',
    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-movflags', '+faststart', mp4], { cwd: OUT });
  const total = (stamps[stamps.length - 1] - stamps[0]) / 1000;
  console.log(`selesai: ${mp4}\n${stamps.length} frame, ${total.toFixed(1)} dtk, ~${(stamps.length / total).toFixed(1)} fps tangkapan -> 30 fps`);
})();
