import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';

const MAX = 8;

// Layar kunci: satu PIN berdua. Tampil sebelum apa pun dimuat dari server.
export default function PinGate({ onSubmit, checking = false }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!checking) inputRef.current?.focus();
  }, [checking]);

  const submit = async (e) => {
    e?.preventDefault();
    if (pin.length < 4 || busy) return;
    setBusy(true);
    setError('');
    try {
      await onSubmit(pin);
    } catch (err) {
      setError(err.message);
      setPin('');
      setShake((n) => n + 1);
      inputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  const onChange = (e) => setPin(e.target.value.replace(/\D/g, '').slice(0, MAX));

  return (
    <div className="pix-panel flex flex-col items-center gap-4 p-5 sm:p-6">
      <div className="pix-screen flex h-16 w-16 items-center justify-center">
        <FontAwesomeIcon icon={ui.lock} style={{ fontSize: 26, color: '#8367c7' }} />
      </div>

      <div className="text-center">
        <h1 className="pix-title" style={{ fontSize: 13, color: '#463a66' }}>MAU KEMANA?</h1>
        <p className="font-body" style={{ fontSize: 18, color: '#8367c7' }}>
          {checking ? 'sebentar, lagi cek...' : 'masukkan PIN kita dulu ya'}
        </p>
      </div>

      {!checking && (
        <form onSubmit={submit} className="flex w-full max-w-xs flex-col items-center gap-3">
          <motion.div
            key={shake}
            className="w-full"
            animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : false}
            transition={{ duration: 0.4 }}
          >
            {/* Kotak-kotak digit; input aslinya transparan di atasnya biar keyboard HP muncul */}
            <label className="relative block cursor-text">
              <div className="flex justify-center gap-2" aria-hidden="true">
                {Array.from({ length: Math.max(4, Math.min(MAX, pin.length + 1)) }).map((_, i) => (
                  <span
                    key={i}
                    className="pix-screen flex h-12 w-10 items-center justify-center font-body"
                    style={{
                      fontSize: 26,
                      color: '#463a66',
                      borderColor: i === pin.length ? '#e45f97' : undefined,
                    }}
                  >
                    {i < pin.length ? '•' : ''}
                  </span>
                ))}
              </div>
              <input
                ref={inputRef}
                className="absolute inset-0 h-full w-full opacity-0"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                pattern="[0-9]*"
                value={pin}
                onChange={onChange}
                disabled={busy}
                aria-label="PIN"
              />
            </label>
          </motion.div>

          <p className="font-body h-5 text-center" style={{ fontSize: 16, color: '#e45f97' }}>
            {error}
          </p>

          <button type="submit" className="pix-btn pix-pink w-full" disabled={pin.length < 4 || busy}>
            {busy ? '...' : 'BUKA'}
          </button>
        </form>
      )}

      <p className="font-body text-center" style={{ fontSize: 15, color: '#9f86d9' }}>
        cuma buat kita berdua
      </p>
    </div>
  );
}
