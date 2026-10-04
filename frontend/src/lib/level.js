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
