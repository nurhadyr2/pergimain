import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';

const fmt = (iso) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function HistoryList({ items, onDelete }) {
  return (
    <section className="card p-5">
      <h3 className="mb-2 font-display text-lg font-bold text-gold-300">Riwayat Pilihan</h3>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-cream-400">
          Belum ada riwayat. Yuk spin pertama kalian!
        </p>
      ) : (
        <ul className="flex flex-col">
          <AnimatePresence initial={false}>
            {items.map((h) => (
              <motion.li
                key={h.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="flex items-center justify-between border-b border-ink-700 py-2.5 last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-cream-100">{h.placeName}</span>
                  <span className="text-xs text-cream-400">{fmt(h.spunAt)}</span>
                </div>
                <button
                  className="icon-btn hover:bg-ink-800 hover:text-blush-300"
                  onClick={() => onDelete(h.id)}
                  title="Hapus"
                >
                  <FontAwesomeIcon icon={ui.trash} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
