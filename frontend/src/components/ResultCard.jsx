import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui, catIcon } from '../lib/icons';

// Estimasi kisaran harga dari priceLevel.
const priceRange = [
  'Gratis',
  'Rp10.000 - 50.000',
  'Rp50.000 - 150.000',
  'Rp150.000 ke atas',
];

export default function ResultCard({ place, onRespin, onChoose, chosen }) {
  if (!place) return null;
  const maps =
    place.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name} ${place.address || ''}`.trim()
    )}`;

  return (
    <motion.div
      className="pix-screen w-full p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="pix-title" style={{ fontSize: 8, color: '#e45f97' }}>
        HARI INI KITA KE...
      </p>

      <div className="mt-3 flex items-start gap-3">
        <span className="pix-thumb">
          <FontAwesomeIcon icon={catIcon(place.category?.slug)} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-body leading-none" style={{ fontSize: 28, color: '#463a66' }}>
            {place.name}
          </h2>
          <p className="font-body" style={{ fontSize: 16, color: '#8367c7', marginTop: 4 }}>
            {[place.category?.name, place.address].filter(Boolean).join(' · ')}
          </p>
          <p className="font-body" style={{ fontSize: 16, color: '#67d6a6' }}>
            {priceRange[place.priceLevel] || priceRange[1]}
          </p>
        </div>
      </div>

      {place.description && (
        <p className="font-body" style={{ fontSize: 18, color: '#5a4a80', marginTop: 10 }}>
          {place.description}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a className="pix-btn pix-mint" href={maps} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={ui.map} />&nbsp; LIHAT TEMPAT
        </a>
        <button className="pix-btn pix-pink" onClick={onChoose} disabled={chosen}>
          <FontAwesomeIcon icon={ui.bookmark} />&nbsp; {chosen ? 'TERSIMPAN' : 'SIMPAN'}
        </button>
      </div>

      <button className="pix-btn pix-white mt-2 w-full" onClick={onRespin}>
        SPIN LAGI
      </button>
    </motion.div>
  );
}
