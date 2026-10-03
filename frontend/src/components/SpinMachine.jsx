import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Mesin spin: diberi `pool` (kandidat) + `winner` + `spinId`.
 * Tiap `spinId` berubah -> animasi mengacak kartu lalu berhenti di winner.
 */
export default function SpinMachine({ pool, winner, spinId, onSettle }) {
  const [current, setCurrent] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!spinId || !pool?.length || !winner) return;

    const winnerIndex = Math.max(0, pool.findIndex((p) => p.id === winner.id));
    const loops = 3;
    const totalSteps = pool.length * loops + winnerIndex;

    let step = 0;
    setSpinning(true);

    const tick = () => {
      setCurrent(pool[step % pool.length]);
      step++;
      if (step > totalSteps) {
        setSpinning(false);
        setCurrent(winner);
        onSettle?.(winner);
        return;
      }
      const progress = step / totalSteps;
      const delay = 45 + Math.pow(progress, 3) * 320; // ease-out
      timer.current = setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinId]);

  const card = current;

  return (
    <div
      className="pix-screen relative mx-auto flex h-48 w-full items-center justify-center overflow-hidden p-4"
      style={spinning ? { borderColor: '#e45f97' } : undefined}
    >
      <AnimatePresence mode="popLayout">
        {card ? (
          <motion.div
            key={`${card.id}-${spinning}-${spinId}`}
            className="flex flex-col items-center gap-2 px-2 text-center"
            initial={{ y: spinning ? 40 : 0, opacity: 0, scale: spinning ? 0.95 : 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: spinning ? 0.12 : 0.4, type: spinning ? 'tween' : 'spring' }}
          >
            <span className="pix-title" style={{ fontSize: 8, color: '#e45f97' }}>
              {(card.category?.name || '').toUpperCase()}
            </span>
            <span className="font-body leading-none" style={{ fontSize: 30, color: '#463a66' }}>
              {card.name}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="pix-title blink" style={{ fontSize: 11 }}>...</span>
            <span className="font-body" style={{ fontSize: 18, color: '#8367c7' }}>
              tekan SPIN buat tau mau kemana
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
