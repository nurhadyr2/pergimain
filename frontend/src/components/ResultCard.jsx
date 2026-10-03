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
      className="card mx-auto w-full max-w-sm border-l-4 border-l-maroon-500"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="p-5">
        <p className="text-sm text-cream-400">
          Hari ini kalian ke <span className="text-blush-300">{place.category?.name}</span>
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-gold-300">{place.name}</h2>

        {place.description && <p className="mt-3 text-sm text-cream-300">{place.description}</p>}

        <p className="mt-3 text-sm text-cream-400">
          {[place.address, priceLabel[place.priceLevel]].filter(Boolean).join(' · ')}
        </p>

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
