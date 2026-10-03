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
      className={`relative mx-auto flex h-60 w-full max-w-sm items-center justify-center overflow-hidden rounded-3xl
        bg-gradient-to-b from-ink-800 to-ink-900 p-4 shadow-card ring-1 transition-shadow
        ${spinning ? 'ring-gold-400/70 shadow-gold' : 'ring-gold-400/20'}`}
    >
      {/* lampu atas */}
      <div className="absolute inset-x-0 top-3 flex justify-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i % 2 ? 'bg-blush-400' : 'bg-gold-400'} ${spinning ? 'animate-blink' : 'opacity-25'}`}
            style={{ animationDelay: `${i * 0.1}s` }}
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
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blush-300">
              {card.category?.name}
            </span>
            <span className="font-display text-3xl font-bold leading-tight text-gold-200">
              {card.name}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            className="flex flex-col items-center gap-2 text-center text-cream-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="font-display text-xl font-semibold text-gold-300">
              Tekan tombol SPIN
            </span>
            <span className="text-xs">buat tau mau kemana hari ini</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
