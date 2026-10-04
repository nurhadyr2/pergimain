import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';
import { levelFrom } from '../lib/level';
import { DAYS, MONTHS, dayKey, indexTrips, monthGrid } from '../lib/calendar';

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const lv = (n) => `LV.${String(n).padStart(2, '0')}`;

// Kalender bulanan: ♥ = hari pergi bareng, ★ = hari naik level.
// Naik level ikut aturan level.js (tiap PER kunjungan), jadi selalu sinkron dengan status bar.
export default function TripCalendar({ items }) {
  const today = new Date();
  const todayKey = dayKey(today);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setPicked] = useState(null);

  const byDay = useMemo(() => indexTrips(items), [items]);
  const cells = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);

  const shift = (d) =>
    setCursor(({ y, m }) => {
      const x = new Date(y, m + d, 1);
      return { y: x.getFullYear(), m: x.getMonth() };
    });

  const prefix = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`;
  let monthTrips = 0;
  let monthLevelUps = 0;
  byDay.forEach((d, k) => {
    if (!k.startsWith(prefix)) return;
    monthTrips += d.trips.length;
    if (d.levelUp) monthLevelUps += 1;
  });

  const stat = levelFrom(items.length);
  const detail = picked ? byDay.get(picked) : null;
  const pickedDate = picked ? new Date(picked) : null;

  return (
    <section className="pix-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button className="pix-chip" onClick={() => shift(-1)} aria-label="Bulan sebelumnya">
          <FontAwesomeIcon icon={ui.prev} />
        </button>
        <h3 className="pix-title flex items-center gap-2" style={{ fontSize: 10 }}>
          <FontAwesomeIcon icon={ui.calendar} style={{ color: '#8367c7' }} />
          {MONTHS[cursor.m]} {cursor.y}
        </h3>
        <button className="pix-chip" onClick={() => shift(1)} aria-label="Bulan berikutnya">
          <FontAwesomeIcon icon={ui.next} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <span key={d} className="pix-title text-center" style={{ fontSize: 6, color: '#9f86d9' }}>
            {d}
          </span>
        ))}
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const k = dayKey(date);
          const day = byDay.get(k);
          const cls = [
            'cal-cell',
            day && 'cal-trip',
            day?.levelUp && 'cal-lv',
            k === todayKey && 'cal-today',
            k === picked && 'cal-pick',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={k}
              type="button"
              className={cls}
              disabled={!day}
              onClick={() => setPicked(k === picked ? null : k)}
              title={day ? `${day.trips.length} kali pergi bareng` : undefined}
            >
              {date.getDate()}
              {day && (
                <FontAwesomeIcon icon={day.levelUp ? ui.star : ui.heart} className="cal-mark" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="font-body mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1" style={{ fontSize: 15, color: '#6b5b95' }}>
        <span><FontAwesomeIcon icon={ui.heart} style={{ color: '#e45f97' }} /> pergi bareng</span>
        <span><FontAwesomeIcon icon={ui.star} style={{ color: '#d49a00' }} /> naik level</span>
        <span><i className="cal-dot cal-dot-today" /> hari ini</span>
      </div>

      {/* Detail hari yang diketuk */}
      {detail && (
        <div className="pix-screen mt-3 p-3">
          <p className="pix-title" style={{ fontSize: 8, color: '#e45f97' }}>
            {pickedDate.getDate()} {MONTHS[pickedDate.getMonth()]} {pickedDate.getFullYear()}
          </p>
          {detail.levelUp && (
            <p className="font-body mt-1" style={{ fontSize: 17, color: '#b8860b' }}>
              <FontAwesomeIcon icon={ui.star} /> naik ke {lv(detail.levelUp)}!
            </p>
          )}
          <ul className="mt-1 flex flex-col">
            {detail.trips.map((h) => (
              <li key={h.id} className="font-body flex items-baseline justify-between gap-2" style={{ fontSize: 18, color: '#463a66' }}>
                <span className="truncate">{h.placeName}</span>
                <span style={{ fontSize: 15, color: '#9f86d9' }}>{fmtTime(h.spunAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ringkasan */}
      <div className="font-body mt-3 text-center" style={{ fontSize: 16, color: '#8367c7', lineHeight: 1.3 }}>
        <p>
          bulan ini {monthTrips} kali pergi bareng
          {monthLevelUps > 0 && ` · naik level ${monthLevelUps}x`}
        </p>
        <p style={{ color: '#5a4a80' }}>
          sekarang {lv(stat.level)} · {stat.toNext} kunjungan lagi menuju {lv(stat.level + 1)}
        </p>
      </div>
    </section>
  );
}
