import { useCallback, useEffect, useState } from 'react';

const BACK_TO_IDLE_MS = 25 * 1000; // reaksi bertahan segini, lalu balik ngobrol santai
const IDLE_ROTATE_MS = 40 * 1000; // kalimat santai berganti pelan-pelan

// Suasana karakter: { kind, slug?, seed }. seed naik tiap ganti supaya pilihan kalimat berubah.
export function useMood(initial = 'idle') {
  const [mood, setMood] = useState({ kind: initial, seed: 0 });

  const say = useCallback((kind, extra = {}) => {
    setMood((m) => ({ kind, ...extra, seed: m.seed + 1 }));
  }, []);

  useEffect(() => {
    if (mood.kind === 'idle') {
      const t = setInterval(() => setMood((m) => ({ ...m, seed: m.seed + 1 })), IDLE_ROTATE_MS);
      return () => clearInterval(t);
    }
    if (mood.kind === 'locked') return undefined;
    const t = setTimeout(() => setMood((m) => ({ kind: 'idle', seed: m.seed + 1 })), BACK_TO_IDLE_MS);
    return () => clearTimeout(t);
  }, [mood]);

  return { mood, say };
}
