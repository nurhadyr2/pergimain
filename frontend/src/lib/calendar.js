// Util kalender: kelompokkan riwayat per hari + tandai hari naik level & hari rencana.
import { levelFrom } from './level.js';

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
export const DAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

const pad = (n) => String(n).padStart(2, '0');

// Kunci hari pakai zona waktu lokal (bukan UTC), biar tanggalnya sama dengan yang dilihat user.
export const dayKey = (d) => {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

// 'planned' = rencana (📌), selain itu = sudah pergi (♥) dan dihitung ke level.
export const isPlanned = (h) => h.status === 'planned';
export const isDone = (h) => !isPlanned(h);
export const planDate = (h) => h.plannedAt || h.spunAt;

export const fmtDay = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

// Map dayKey -> { trips: [...sudah pergi], plans: [...rencana], levelUp: nomor level | null }.
// Kunjungan diurut dari yang paling lama: ke-PER, 2*PER, ... adalah momen naik level.
export function indexTrips(items) {
  const map = new Map();
  const at = (k) => {
    if (!map.has(k)) map.set(k, { trips: [], plans: [], levelUp: null });
    return map.get(k);
  };

  const { per } = levelFrom(0);
  items
    .filter(isDone)
    .sort((a, b) => new Date(a.spunAt) - new Date(b.spunAt))
    .forEach((h, i) => {
      const day = at(dayKey(h.spunAt));
      day.trips.push(h);
      const n = i + 1;
      if (n % per === 0) day.levelUp = n / per + 1;
    });

  items.filter(isPlanned).forEach((h) => at(dayKey(planDate(h))).plans.push(h));

  return map;
}

// Semua rencana, yang terdekat dulu (yang sudah lewat tanggalnya tetap tampil sampai ditandai/dibatalkan).
export const upcomingPlans = (items) =>
  items.filter(isPlanned).sort((a, b) => new Date(planDate(a)) - new Date(planDate(b)));

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
