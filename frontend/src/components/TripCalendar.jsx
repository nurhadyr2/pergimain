import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';
import { levelFrom } from '../lib/level';
import { DAYS, MONTHS, dayKey, fmtDay, indexTrips, isDone, monthGrid, planDate, upcomingPlans } from '../lib/calendar';

const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const lv = (n) => `LV.${String(n).padStart(2, '0')}`;

export function RatingMini({ value }) {
  if (!value) return null;
  return (
    <span className="rate-mini" aria-label={`${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <FontAwesomeIcon key={n} icon={ui.heart} className={n <= value ? '' : 'off'} />
      ))}
    </span>
  );
}

// Kalender bulanan: ♥ = hari pergi bareng, ★ = hari naik level, 📌 = rencana.
// Naik level ikut aturan level.js (tiap PER kunjungan), jadi selalu sinkron dengan status bar.
export default function TripCalendar({ items, onJournal, onDone, onCancelPlan }) {
  const today = new Date();
  const todayKey = dayKey(today);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setPicked] = useState(null);

  const byDay = useMemo(() => indexTrips(items), [items]);
  const cells = useMemo(() => monthGrid(cursor.y, cursor.m), [cursor]);
  const nextPlan = useMemo(() => upcomingPlans(items)[0], [items]);

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

  const stat = levelFrom(items.filter(isDone).length);
  const detail = picked ? byDay.get(picked) : null;
  const pickedDate = picked ? new Date(picked) : null;
  const hasDetail = detail && (detail.trips.length || detail.plans.length);

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
          const hasTrip = day?.trips.length > 0;
          const hasPlan = day?.plans.length > 0;
          const cls = [
            'cal-cell',
            hasTrip && 'cal-trip',
            hasTrip && day.levelUp && 'cal-lv',
            !hasTrip && hasPlan && 'cal-plan',
            k === todayKey && 'cal-today',
            k === picked && 'cal-pick',
          ]
            .filter(Boolean)
            .join(' ');
          const mark = hasTrip ? (day.levelUp ? ui.star : ui.heart) : hasPlan ? ui.pin : null;
          return (
            <button
              key={k}
              type="button"
              className={cls}
              disabled={!mark}
              onClick={() => setPicked(k === picked ? null : k)}
              title={hasTrip ? `${day.trips.length} kali pergi bareng` : hasPlan ? 'ada rencana' : undefined}
            >
              {date.getDate()}
              {mark && <FontAwesomeIcon icon={mark} className="cal-mark" />}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="font-body mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1" style={{ fontSize: 15, color: '#6b5b95' }}>
        <span><FontAwesomeIcon icon={ui.heart} style={{ color: '#e45f97' }} /> pergi bareng</span>
        <span><FontAwesomeIcon icon={ui.star} style={{ color: '#d49a00' }} /> naik level</span>
        <span><FontAwesomeIcon icon={ui.pin} style={{ color: '#2f9e6e' }} /> rencana</span>
        <span><i className="cal-dot cal-dot-today" /> hari ini</span>
      </div>

      {/* Detail hari yang diketuk */}
      {hasDetail ? (
        <div className="pix-screen mt-3 p-3">
          <p className="pix-title" style={{ fontSize: 8, color: '#e45f97' }}>
            {pickedDate.getDate()} {MONTHS[pickedDate.getMonth()]} {pickedDate.getFullYear()}
          </p>
          {detail.levelUp && (
            <p className="font-body mt-1" style={{ fontSize: 17, color: '#b8860b' }}>
              <FontAwesomeIcon icon={ui.star} /> naik ke {lv(detail.levelUp)}!
            </p>
          )}

          <ul className="mt-1 flex flex-col gap-1">
            {detail.trips.map((h) => (
              <li key={h.id} className="flex items-center gap-2">
                {h.photoUrl && <img src={h.photoUrl} alt="" className="jr-thumb" />}
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onJournal?.(h)}>
                  <span className="font-body block truncate leading-tight" style={{ fontSize: 18, color: '#463a66' }}>
                    {h.placeName}
                  </span>
                  <span className="font-body flex items-center gap-2" style={{ fontSize: 14, color: '#9f86d9' }}>
                    {fmtTime(h.spunAt)} <RatingMini value={h.rating} />
                    {h.note && <span className="truncate" style={{ color: '#6b5b95' }}>“{h.note}”</span>}
                  </span>
                </button>
                <button className="pix-chip" onClick={() => onJournal?.(h)} title="Tulis cerita">
                  <FontAwesomeIcon icon={ui.pen} />
                </button>
              </li>
            ))}

            {detail.plans.map((h) => (
              <li key={h.id} className="flex items-center gap-2">
                <FontAwesomeIcon icon={ui.pin} style={{ color: '#2f9e6e', fontSize: 14 }} />
                <span className="font-body min-w-0 flex-1 truncate leading-tight" style={{ fontSize: 18, color: '#463a66' }}>
                  {h.placeName}
                </span>
                <button className="pix-chip pix-chip-on" onClick={() => onDone?.(h)} title="Udah pergi!">
                  <FontAwesomeIcon icon={ui.check} />&nbsp;UDAH PERGI
                </button>
                <button className="pix-chip" onClick={() => onCancelPlan?.(h)} title="Batalkan rencana">
                  <FontAwesomeIcon icon={ui.trash} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Ringkasan */}
      <div className="font-body mt-3 text-center" style={{ fontSize: 16, color: '#8367c7', lineHeight: 1.3 }}>
        <p>
          bulan ini {monthTrips} kali pergi bareng
          {monthLevelUps > 0 && ` · naik level ${monthLevelUps}x`}
        </p>
        {nextPlan && (
          <p style={{ color: '#2f9e6e' }}>
            <FontAwesomeIcon icon={ui.pin} /> berikutnya: {nextPlan.placeName} · {fmtDay(planDate(nextPlan))}
          </p>
        )}
        <p style={{ color: '#5a4a80' }}>
          sekarang {lv(stat.level)} · {stat.toNext} kunjungan lagi menuju {lv(stat.level + 1)}
        </p>
      </div>
    </section>
  );
}
