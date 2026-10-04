// Balon kata karakter yang bereaksi ke apa yang terjadi di aplikasi.
// Satu baris balon hanya muat ±16 karakter, jadi semua kalimat di sini pendek.
// Pilihan dibuat deterministik dari `seed` supaya tidak berganti tiap render.

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const pick = (arr, seed, salt) => arr[(seed + hash(salt)) % arr.length];

const IDLE = {
  pagi: [
    ['Sarapan dulu yuk?', 'Mumpung sepi~'],
    ['Pagi! Mau kemana?', 'Spin aja dulu'],
  ],
  siang: [
    ['Panas, cari adem?', 'Makan siang yuk'],
    ['Laper nih...', 'Spin aja, seru~'],
  ],
  sore: [
    ['Sore-sore enaknya?', 'Ngopi dulu gak?'],
    ['Jalan yuk, adem', 'Golden hour nih'],
  ],
  malam: [
    ['Udah malem lho', 'Nongkrong aja?'],
    ['Nonton midnight?', 'Cari yang deket'],
  ],
  any: [
    ['Mau makan aja?', 'Spin aja, seru~'],
    ['Bosen di rumah~', 'Biar semesta milih'],
    ['Kemana ya enaknya', 'Tekan SPIN dong'],
  ],
};

const CATEGORY = {
  makan: [['Laper banget nih', 'Yang pedes dong'], ['Makan apa ya?', 'Jangan antre lama']],
  nonton: [['Popcorn wajib!', 'Horor gimana?'], ['Nonton apa ya', 'Kursi belakang ya']],
  museum: [['Jalan budaya nih~', 'Jangan foto doang'], ['Belajar dikit~', 'Adem pula']],
  hewan: [['Mau liat kucing!', 'Kapibara ada?'], ['Gemes pasti', 'Bawa kacang gak?']],
  taman: [['Piknik yuk~', 'Bawa tikar ya'], ['Sunscreen dulu', 'Cari rumput adem']],
  jalan: [['Jalan kaki santai', 'Sepatu nyaman ya'], ['Keliling kota~', 'Nyasar juga seru']],
  main: [['Siap kalah?', 'Yang kalah traktir'], ['Ayo tanding!', 'Jangan curang ya']],
  belanja: [['Dompet aman?', 'Liat-liat doang..'], ['Window shopping~', 'Jangan kalap ya']],
  nongkrong: [['Kopi atau teh?', 'Ngobrol sampe tutup'], ['Cari yang cozy', 'Wifi kenceng ya']],
};

const MOOD = {
  spinning: [['Deg-degan...', 'Semesta, tolong~'], ['Yang enak ya!', 'Jangan yang jauh']],
  result: [['Ayo berangkat!', 'Oke, gas!'], ['Nah, ini dia~', 'Setuju banget']],
  saved: [['Yeay, tersimpan ♥', 'Jangan lupa foto'], ['Catet! ♥', 'Seru banget tadi']],
  planned: [['Masuk kalender!', 'Sabar nunggu ya~'], ['Udah dijadwalin', 'Gak sabar nih']],
  levelup: [['NAIK LEVEL!!', 'Kita makin jago~'], ['Yeaaay! ★', 'Rayain dong']],
  riwayat: [['Inget yang itu?', 'Banyak juga ya~'], ['Kenangan kita ♥', 'Kapan ke sana lagi']],
  locked: [['Masukkan PIN ya~', 'Siapa nih?'], ['Rahasia berdua~', 'PIN-nya inget kan']],
};

export const HAPPY = new Set(['result', 'saved', 'planned', 'levelup']);

const slotOf = (hour) => (hour < 11 ? 'pagi' : hour < 15 ? 'siang' : hour < 18 ? 'sore' : 'malam');

// mood: { kind, slug?, seed }; ctx: { hour, toNext, level }
export function linesFor(mood, ctx = {}) {
  const { kind = 'idle', slug, seed = 0 } = mood || {};
  const hour = ctx.hour ?? new Date().getHours();

  let pair;
  if (kind === 'category' && CATEGORY[slug]) pair = pick(CATEGORY[slug], seed, slug);
  else if (kind === 'result' && CATEGORY[slug] && seed % 2) pair = pick(CATEGORY[slug], seed, 'r' + slug);
  else if (MOOD[kind]) pair = pick(MOOD[kind], seed, kind);
  else {
    // idle: selang-seling antara kalimat sesuai jam dan kalimat umum
    const pool = seed % 2 ? IDLE[slotOf(hour)] : IDLE.any;
    pair = pick(pool, seed, 'idle');
    // tinggal 1 kunjungan lagi naik level -> ingatkan sesekali
    if (ctx.toNext === 1 && seed % 3 === 0) pair = ['Sekali lagi naik lv!', 'Ayo, dikit lagi~'];
  }
  return { girl: pair[0], boy: pair[1] };
}
