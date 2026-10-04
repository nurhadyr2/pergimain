// Util kalender: kelompokkan riwayat per hari + tandai hari naik level.
import { levelFrom } from './level';

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
export const DAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

const pad = (n) => String(n).padStart(2, '0');

// Kunci hari pakai zona waktu lokal (bukan UTC), biar tanggalnya sama dengan yang dilihat user.
export const dayKey = (d) => {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

// Map dayKey -> { trips: [...riwayat], levelUp: nomor level | null }.
// Diurut dari yang paling lama: kunjungan ke-PER, 2*PER, ... adalah momen naik level.
export function indexTrips(items) {
  const asc = [...items].sort((a, b) => new Date(a.spunAt) - new Date(b.spunAt));
  const { per } = levelFrom(0);
  const map = new Map();
  asc.forEach((h, i) => {
    const k = dayKey(h.spunAt);
    const day = map.get(k) || { trips: [], levelUp: null };
    day.trips.push(h);
    const n = i + 1;
    if (n % per === 0) day.levelUp = n / per + 1;
    map.set(k, day);
  });
  return map;
}

// Sel grid satu bulan (kolom pertama = Senin). null = sel kosong di awal/akhir.
export function monthGrid(y, m) {
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}
