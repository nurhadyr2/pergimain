import { useLayoutEffect, useRef } from 'react';

// Teks yang ukurannya menyesuaikan kotak: mulai dari `max` px, turun 1px sampai tidak
// meluap (lebar maupun tinggi), minimal `min` px. Boleh pecah jadi 2 baris kalau perlu.
// Dipakai balon kata karakter supaya kalimat apa pun tidak pernah keluar dari balon.
export default function FitText({ children, max = 15, min = 9, className = '', style }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      let size = max;
      el.style.fontSize = `${size}px`;
      while (size > min && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    // Balon desktop lebarnya ikut viewport -> ukur ulang saat jendela berubah.
    window.addEventListener('resize', fit);
    if (document.fonts?.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => window.removeEventListener('resize', fit);
  }, [children, max, min]);

  return (
    <div ref={ref} className={className} style={{ ...style, fontSize: max }}>
      {children}
    </div>
  );
}
