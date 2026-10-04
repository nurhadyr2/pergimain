import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../../lib/icons';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(t);
  }, []);
  return now;
}

// Baterai cuma hiasan: isinya ikut progress level biar hidup.
function battPct(progress) {
  return Math.round(55 + progress * 44); // 55%..99%
}

export default function Header({ level = 1, progress = 0, toNext = 0 }) {
  const now = useClock();
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  const time = now
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase();
  const pct = battPct(progress);
  const lv = String(level).padStart(2, '0');

  return (
    <header className="flex flex-col gap-3">
      {/* Status bar perangkat */}
      <div className="pix-screen flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={ui.heart} style={{ color: '#ef7fae', fontSize: 11 }} />
          <span className="pix-title" style={{ fontSize: 8 }}>LV.{lv}</span>
          <span className="lv-bar" title={`${toNext} kunjungan lagi menuju level berikutnya`}>
            <i style={{ width: `${Math.round(progress * 100)}%` }} />
          </span>
        </div>
        <span className="pix-title hidden sm:inline" style={{ fontSize: 8 }}>
          {date}&nbsp;{time}
        </span>
        <div className="flex items-center gap-1">
          <span className="pix-title" style={{ fontSize: 7 }}>{pct}%</span>
          <span
            className="inline-block"
            style={{ width: 22, height: 12, border: '2px solid #463a66', position: 'relative' }}
            title="battery"
          >
            <span style={{ position: 'absolute', top: 1, bottom: 1, left: 1, width: `${(pct / 100) * 18}px`, background: '#67d6a6' }} />
            <span style={{ position: 'absolute', right: -4, top: 3, width: 3, height: 4, background: '#463a66' }} />
          </span>
        </div>
      </div>

      {/* Judul */}
      <div className="flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={ui.heart} style={{ color: '#f7a8c9', fontSize: 11 }} />
        <h1 className="pix-title" style={{ fontSize: 15, color: '#463a66' }}>MAU KEMANA?</h1>
        <FontAwesomeIcon icon={ui.heart} style={{ color: '#f7a8c9', fontSize: 11 }} />
      </div>
      <p className="font-body text-center" style={{ fontSize: 18, color: '#8367c7', marginTop: -6 }}>
        hari ini, biar semesta yang milih
      </p>
    </header>
  );
}
