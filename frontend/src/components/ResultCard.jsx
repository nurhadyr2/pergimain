import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';

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
      className="pix-panel mx-auto w-full p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="pix-title" style={{ fontSize: 8, color: '#e45f97' }}>
        HARI INI KALIAN KE {(place.category?.name || '').toUpperCase()}
      </p>
      <h2 className="font-body leading-none" style={{ fontSize: 30, color: '#463a66', marginTop: 8 }}>
        {place.name}
      </h2>

      {place.description && (
        <p className="font-body" style={{ fontSize: 18, color: '#5a4a80', marginTop: 8 }}>
          {place.description}
        </p>
      )}

      <p className="font-body" style={{ fontSize: 17, color: '#8367c7', marginTop: 8 }}>
        {[place.address, priceLabel[place.priceLevel]].filter(Boolean).join(' · ')}
      </p>

      <a
        className="pix-btn pix-mint mt-4 w-full"
        href={maps}
        target="_blank"
        rel="noreferrer"
      >
        <FontAwesomeIcon icon={ui.map} />&nbsp; BUKA DI MAPS
      </a>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className="pix-btn pix-white" onClick={onRespin}>
          SPIN LAGI
        </button>
        <button className="pix-btn pix-pink" onClick={onChoose} disabled={chosen}>
          {chosen ? 'TERSIMPAN' : 'PILIH INI'}
        </button>
      </div>
    </motion.div>
  );
}
