import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';
import { titleFor } from '../lib/level';
import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';

const COLORS = ['#f7a8c9', '#ffe08a', '#9fe6c6', '#b39ddb', '#ffd6e8', '#ef7fae'];
const AUTO_CLOSE_MS = 7000;

// Perayaan naik level: konfeti pixel + karakter lompat + gelar baru. Ketuk di mana saja untuk tutup.
export default function LevelUp({ info, onClose }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${((i * 53) % 25) / 10}s`,
        dur: `${2.4 + ((i * 29) % 14) / 10}s`,
        size: 6 + ((i * 7) % 3) * 3,
        color: COLORS[i % COLORS.length],
      })),
    []
  );

  useEffect(() => {
    if (!info) return undefined;
    const t = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [info, onClose]);

  return (
    <AnimatePresence>
      {info && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden p-4"
          style={{ background: 'rgba(53,43,77,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-label="Naik level"
        >
          {pieces.map((c, i) => (
            <i
              key={i}
              className="confetti"
              style={{
                left: c.left,
                width: c.size,
                height: c.size,
                background: c.color,
                animationDelay: c.delay,
                animationDuration: c.dur,
              }}
            />
          ))}

          <motion.div
            className="pix-panel relative flex w-full max-w-sm flex-col items-center gap-2 p-5 text-center"
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="pix-title" style={{ fontSize: 14, color: '#e45f97' }}>
              <FontAwesomeIcon icon={ui.star} style={{ color: '#ffcf4d' }} /> NAIK LEVEL!{' '}
              <FontAwesomeIcon icon={ui.star} style={{ color: '#ffcf4d' }} />
            </p>
            <p className="font-body leading-none" style={{ fontSize: 56, color: '#463a66' }}>
              LV.{String(info.level).padStart(2, '0')}
            </p>
            <p className="pix-title" style={{ fontSize: 10, color: '#8367c7' }}>
              {titleFor(info.level).toUpperCase()}
            </p>
            <p className="font-body" style={{ fontSize: 17, color: '#6b5b95' }}>
              {info.trips} kali pergi bareng · {info.toNext} lagi menuju LV.{String(info.level + 1).padStart(2, '0')}
            </p>

            <div className="mt-2 flex items-end justify-center gap-6">
              <img src={girl} alt="" className="char-jump" style={{ width: 84 }} />
              <img src={boy} alt="" className="char-jump" style={{ width: 84, animationDelay: '0.15s' }} />
            </div>

            <button className="pix-btn pix-pink mt-3 w-full" onClick={onClose}>
              YEAY! <FontAwesomeIcon icon={ui.heart} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
