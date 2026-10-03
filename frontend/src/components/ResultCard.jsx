import { motion } from 'framer-motion';

const priceLabel = ['Gratis', 'Murah', 'Sedang', 'Mahal'];

export default function ResultCard({ place, onRespin, onChoose, chosen }) {
  if (!place) return null;
  const maps =
    place.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name} ${place.address || ''}`.trim()
    )}`;

  return (
    <motion.div
      className="card mx-auto w-full max-w-sm overflow-hidden"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <div className="bg-maroon-600 px-5 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
        Hari ini kalian ke...
      </div>

      <div className="p-5">
        <span className="text-xs font-bold uppercase tracking-wide text-blush-300">
          {place.category?.name}
        </span>
        <h2 className="font-display text-2xl font-bold leading-tight text-gold-200">{place.name}</h2>

        {place.description && <p className="mt-3 text-sm text-cream-300">{place.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {place.address && (
            <span className="rounded-full bg-ink-800 px-3 py-1 text-xs font-medium text-cream-300 ring-1 ring-gold-400/15">
              {place.address}
            </span>
          )}
          <span className="rounded-full bg-ink-800 px-3 py-1 text-xs font-medium text-cream-300 ring-1 ring-gold-400/15">
            {priceLabel[place.priceLevel] ?? '-'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <a className="btn-ghost text-sm" href={maps} target="_blank" rel="noreferrer">
            Buka Maps
          </a>
          <button className="btn-ghost text-sm" onClick={onRespin}>
            Spin lagi
          </button>
          <button className="btn-pink col-span-2 text-sm" onClick={onChoose} disabled={chosen}>
            {chosen ? 'Tersimpan di riwayat' : 'Pilih ini'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
