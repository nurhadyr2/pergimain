import { AnimatePresence, motion } from 'framer-motion';

const fmt = (iso) =>
  new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function HistoryList({ items, onDelete }) {
  return (
    <section className="pix-panel p-4">
      <h3 className="pix-title mb-3" style={{ fontSize: 11 }}>♥ RIWAYAT KALIAN</h3>

      {items.length === 0 ? (
        <p className="font-body py-4 text-center" style={{ fontSize: 18, color: '#8367c7' }}>
          belum ada riwayat. yuk spin pertama kalian!
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
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '2px dotted #cdbdec' }}
              >
                <div className="flex flex-col">
                  <span className="font-body leading-tight" style={{ fontSize: 20, color: '#463a66' }}>
                    {h.placeName}
                  </span>
                  <span className="font-body" style={{ fontSize: 15, color: '#9f86d9' }}>
                    {fmt(h.spunAt)}
                  </span>
                </div>
                <button
                  className="pix-chip"
                  onClick={() => onDelete(h.id)}
                  title="Hapus"
                >
                  ✕
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
