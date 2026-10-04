// Level ditentukan dari berapa sering kita pergi bareng (jumlah riwayat).
// Tiap PER kunjungan naik 1 level.
const PER = 3;

export function levelFrom(trips) {
  const t = Math.max(0, trips || 0);
  const level = Math.floor(t / PER) + 1;
  const into = t % PER;
  return {
    level,
    into,
    per: PER,
    toNext: PER - into,
    progress: into / PER, // 0..1 menuju level berikutnya
  };
}

// Gelar per level. Level di antara dua entri memakai gelar di bawahnya;
// di atas entri terakhir tetap gelar terakhir.
const TITLES = [
  [1, 'Baru Kenal'],
  [2, 'Mulai Akrab'],
  [3, 'Partner Jajan'],
  [4, 'Teman Nongkrong'],
  [5, 'Duo Kulineran'],
  [6, 'Penjelajah Kota'],
  [7, 'Pemburu Hidden Gem'],
  [8, 'Pasangan Petualang'],
  [10, 'Sahabat Sejalan'],
  [12, 'Legenda Kencan'],
  [15, 'Pemilik Peta Kota'],
  [20, 'Kita Semesta Sendiri'],
];

export function titleFor(level) {
  let title = TITLES[0][1];
  for (const [min, t] of TITLES) if (level >= min) title = t;
  return title;
}
