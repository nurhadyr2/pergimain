import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconFor, ui } from '../lib/icons';

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
  const color = card?.category?.color || '#7c3aed';

  return (
    <div
      className="relative mx-auto flex h-60 w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-white/80 p-4 shadow-card ring-1 ring-black/5 transition-shadow"
      style={{ boxShadow: spinning ? `0 0 0 4px ${color}33, 0 10px 40px -12px ${color}66` : undefined }}
    >
      {/* lampu atas */}
      <div className="absolute inset-x-0 top-3 flex justify-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${spinning ? 'animate-blink' : 'opacity-25'}`}
            style={{ backgroundColor: color, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {card ? (
          <motion.div
            key={`${card.id}-${spinning}-${spinId}`}
            className="flex flex-col items-center gap-2 text-center"
            initial={{ y: spinning ? 50 : 0, opacity: 0, scale: spinning ? 0.9 : 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: spinning ? 0.12 : 0.4, type: spinning ? 'tween' : 'spring' }}
          >
            <span
              className="grid h-16 w-16 place-items-center rounded-2xl text-3xl text-white shadow-card"
              style={{ backgroundColor: color }}
            >
              <FontAwesomeIcon icon={iconFor(card.category?.icon)} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
              {card.category?.name}
            </span>
            <span className="font-display text-2xl font-bold leading-tight text-slate-800">
              {card.name}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-2 text-center text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="grid h-16 w-16 animate-float place-items-center rounded-2xl bg-brand-100 text-3xl text-brand-500">
              <FontAwesomeIcon icon={ui.point} />
            </span>
            <span className="font-display text-lg font-semibold text-slate-500">
              Tekan tombol SPIN
            </span>
            <span className="text-xs">buat tau mau kemana hari ini</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
