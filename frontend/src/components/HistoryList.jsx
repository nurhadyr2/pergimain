import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';
import { isDone, planDate, upcomingPlans } from '../lib/calendar';
import { RatingMini } from './TripCalendar';

const fmt = (iso) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const fmtPlan = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

const isPast = (iso) => {
  const d = new Date(iso);
  d.setHours(23, 59, 59, 999);
  return d < new Date();
};

const rowAnim = {
  layout: true,
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
};

export default function HistoryList({ items, onDelete, onJournal, onDone, onCancelPlan }) {
  const plans = upcomingPlans(items);
  const trips = items.filter(isDone);

  return (
    <>
      {/* Rencana (📌): yang akan datang, terdekat dulu */}
      {plans.length > 0 && (
        <section className="pix-panel p-4">
          <h3 className="pix-title mb-3" style={{ fontSize: 11 }}>
            <FontAwesomeIcon icon={ui.pin} style={{ color: '#2f9e6e' }} /> RENCANA
          </h3>
          <ul className="flex flex-col">
            <AnimatePresence initial={false}>
              {plans.map((h) => {
                const late = isPast(planDate(h));
                return (
                  <motion.li
                    key={h.id}
                    {...rowAnim}
                    className="flex items-center gap-2 py-2"
                    style={{ borderBottom: '2px dotted #cdbdec' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body leading-tight" style={{ fontSize: 20, color: '#463a66' }}>
                        {h.placeName}
                      </p>
                      <p className="font-body" style={{ fontSize: 15, color: late ? '#e45f97' : '#2f9e6e' }}>
                        {fmtPlan(planDate(h))}{late ? ' · udah lewat, jadi pergi?' : ''}
                      </p>
                    </div>
                    <button className="pix-chip pix-chip-on" onClick={() => onDone(h)} title="Udah pergi!">
                      <FontAwesomeIcon icon={ui.check} />&nbsp;UDAH PERGI
                    </button>
                    <button className="pix-chip" onClick={() => onCancelPlan(h)} title="Batalkan">
                      <FontAwesomeIcon icon={ui.trash} />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </section>
      )}

      {/* Sudah pergi (♥) */}
      <section className="pix-panel p-4">
        <h3 className="pix-title mb-3" style={{ fontSize: 11 }}>RIWAYAT KALIAN</h3>

        {trips.length === 0 ? (
          <p className="font-body py-4 text-center" style={{ fontSize: 18, color: '#8367c7' }}>
            belum ada riwayat. yuk spin pertama kalian!
          </p>
        ) : (
          <ul className="flex flex-col">
            <AnimatePresence initial={false}>
              {trips.map((h) => (
                <motion.li
                  key={h.id}
                  {...rowAnim}
                  className="flex items-center gap-2 py-2"
                  style={{ borderBottom: '2px dotted #cdbdec' }}
                >
                  {h.photoUrl && <img src={h.photoUrl} alt="" className="jr-thumb" />}
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onJournal(h)}>
                    <span className="block truncate font-body leading-tight" style={{ fontSize: 20, color: '#463a66' }}>
                      {h.placeName}
                    </span>
                    <span className="font-body flex items-center gap-2" style={{ fontSize: 15, color: '#9f86d9' }}>
                      {fmt(h.spunAt)} <RatingMini value={h.rating} />
                    </span>
                    {h.note && (
                      <span className="block truncate font-body" style={{ fontSize: 15, color: '#6b5b95' }}>
                        “{h.note}”
                      </span>
                    )}
                  </button>
                  <button className="pix-chip" onClick={() => onJournal(h)} title="Tulis cerita">
                    <FontAwesomeIcon icon={h.note || h.rating || h.photoUrl ? ui.pen : ui.camera} />
                  </button>
                  <button className="pix-chip" onClick={() => onDelete(h.id)} title="Hapus">
                    <FontAwesomeIcon icon={ui.trash} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </>
  );
}

