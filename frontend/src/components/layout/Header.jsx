import { useEffect, useState } from 'react';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function Header({ onManage }) {
  const now = useClock();
  const date = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  const time = now
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase();

  return (
    <header className="flex flex-col gap-3">
      {/* Status bar perangkat */}
      <div className="pix-screen flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-bubble-400" style={{ fontSize: 16 }}>♥♥♥</span>
          <span className="pix-title" style={{ fontSize: 8 }}>LV.07</span>
        </div>
        <span className="pix-title" style={{ fontSize: 9 }}>
          {date}&nbsp;&nbsp;{time}
        </span>
        <span
          className="inline-block"
          style={{ width: 22, height: 12, border: '2px solid #463a66', position: 'relative' }}
          title="battery"
        >
          <span style={{ position: 'absolute', inset: 1, background: '#67d6a6' }} />
          <span style={{ position: 'absolute', right: -4, top: 3, width: 3, height: 4, background: '#463a66' }} />
        </span>
      </div>

      {/* Judul */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="pix-title flex items-center gap-2" style={{ fontSize: 13 }}>
          <span className="text-bubble-400 floaty" style={{ fontSize: 15 }}>♥</span>
          MAU KEMANA
        </h1>
        <button className="pix-chip" onClick={onManage} title="Kelola tempat">
          ⚙ KELOLA
        </button>
      </div>
      <p className="font-body" style={{ fontSize: 18, color: '#8367c7', marginTop: -6 }}>
        hari ini, biar mesin yang nentuin ✧
      </p>
    </header>
  );
}
