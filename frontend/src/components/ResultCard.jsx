import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui, catIcon } from '../lib/icons';
import { fmtDay } from '../lib/calendar';

// Estimasi kisaran harga dari priceLevel.
const priceRange = [
  'Gratis',
  'Rp10.000 - 50.000',
  'Rp50.000 - 150.000',
  'Rp150.000 ke atas',
];

const pad = (n) => String(n).padStart(2, '0');
const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Catatan kecil dari mesin spin: belum pernah / terakhir ke sini kapan / sudah direncanakan.
function visitNote(meta) {
  if (!meta) return null;
  if (meta.isPlanned) return { text: 'udah ada di rencana kalian', color: '#2f9e6e' };
  if (meta.lastVisitDays == null) return { text: 'belum pernah ke sini, cobain yuk!', color: '#2f9e6e' };
  if (meta.lastVisitDays === 0) return { text: 'baru hari ini ke sini lho', color: '#e45f97' };
  if (meta.lastVisitDays < 30) return { text: `terakhir ke sini ${meta.lastVisitDays} hari lalu`, color: '#e45f97' };
  if (meta.lastVisitDays < 365) return { text: `terakhir ke sini ${Math.round(meta.lastVisitDays / 30)} bulan lalu`, color: '#8367c7' };
  return { text: 'udah lama banget nggak ke sini', color: '#8367c7' };
}

export default function ResultCard({ place, onRespin, onChoose, onPlan, chosen, planned, meta }) {
  const [planning, setPlanning] = useState(false);
  const [date, setDate] = useState(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return toInputDate(t);
  });
  const [busy, setBusy] = useState(false);

  if (!place) return null;
  const maps =
    place.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name} ${place.address || ''}`.trim()
    )}`;
  const today = toInputDate(new Date());
  const note = visitNote(meta);

  const submitPlan = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onPlan(date);
      setPlanning(false);
    } finally {
      setBusy(false);
    }
  };

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
      {note && (
        <p className="font-body" style={{ fontSize: 16, color: note.color, marginTop: 6 }}>
          <FontAwesomeIcon icon={ui.sparkle} />&nbsp;{note.text}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a className="pix-btn pix-mint" href={maps} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={ui.map} />&nbsp; LIHAT TEMPAT
        </a>
        <button className="pix-btn pix-pink" onClick={onChoose} disabled={chosen || !!planned}>
          <FontAwesomeIcon icon={chosen ? ui.heart : ui.bookmark} />&nbsp; {chosen ? 'TERSIMPAN' : 'GAS SEKARANG'}
        </button>
      </div>

      {/* Jadwalkan: masuk kalender sebagai rencana (📌), nanti ditandai "udah pergi" */}
      {planned ? (
        <p className="pix-btn pix-sun mt-2 w-full" style={{ cursor: 'default' }}>
          <FontAwesomeIcon icon={ui.pin} />&nbsp; RENCANA {fmtDay(planned).toUpperCase()}
        </p>
      ) : planning ? (
        <form onSubmit={submitPlan} className="mt-2 flex gap-2">
          <input
            type="date"
            className="pix-input flex-1"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <button className="pix-btn pix-sun" disabled={busy || !date}>
            <FontAwesomeIcon icon={ui.check} />&nbsp; OK
          </button>
          <button type="button" className="pix-btn pix-white" onClick={() => setPlanning(false)}>
            <FontAwesomeIcon icon={ui.close} />
          </button>
        </form>
      ) : (
        <button className="pix-btn pix-sun mt-2 w-full" onClick={() => setPlanning(true)} disabled={chosen}>
          <FontAwesomeIcon icon={ui.plan} />&nbsp; JADWALKAN
        </button>
      )}

      <button className="pix-btn pix-white mt-2 w-full" onClick={onRespin}>
        SPIN LAGI
      </button>
    </motion.div>
  );
}
