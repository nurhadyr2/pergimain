import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconFor, ui } from '../lib/icons';

const priceLabel = ['Gratis', 'Murah', 'Sedang', 'Mahal'];

export default function ResultCard({ place, onRespin, onChoose, chosen }) {
  if (!place) return null;
  const color = place.category?.color || '#7c3aed';
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
      <div className="px-5 py-2 text-center text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: color }}>
        <FontAwesomeIcon icon={ui.magic} /> Hari ini kalian ke...
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl text-white" style={{ backgroundColor: color }}>
            <FontAwesomeIcon icon={iconFor(place.category?.icon)} />
          </span>
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
              {place.category?.name}
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-slate-800">{place.name}</h2>
          </div>
        </div>

        {place.description && <p className="mt-3 text-sm text-slate-500">{place.description}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {place.address && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <FontAwesomeIcon icon={ui.map} /> {place.address}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <FontAwesomeIcon icon={ui.coins} /> {priceLabel[place.priceLevel] ?? '-'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <a className="btn-ghost text-sm" href={maps} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={ui.map} /> Maps
          </a>
          <button className="btn-ghost text-sm" onClick={onRespin}>
            <FontAwesomeIcon icon={ui.retry} /> Spin lagi
          </button>
          <button
            className="btn-solid col-span-2 text-sm"
            onClick={onChoose}
            disabled={chosen}
            style={{ backgroundColor: color }}
          >
            <FontAwesomeIcon icon={chosen ? ui.done : ui.heart} />
            {chosen ? ' Tersimpan di riwayat!' : ' Pilih ini'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
