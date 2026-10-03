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
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-slate-700">
        <FontAwesomeIcon icon={ui.history} className="text-brand-500" /> Riwayat Pilihan
      </h3>

      {items.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">
          Belum ada riwayat. Yuk spin pertama kalian! 🎉
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {items.map((h) => (
              <motion.li
                key={h.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700">{h.placeName}</span>
                  <span className="text-xs text-slate-400">{fmt(h.spunAt)}</span>
                </div>
                <button
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
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
