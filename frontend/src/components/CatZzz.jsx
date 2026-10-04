import { useEffect, useState } from 'react';

// "z z z" melayang dari kucing yang tidur. Sesekali kucingnya kebangun sebentar:
// z-nya berhenti dan muncul "...?" lalu tidur lagi.
export default function CatZzz({ style }) {
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    let t;
    const sleep = () => {
      t = setTimeout(() => {
        setAwake(true);
        t = setTimeout(() => {
          setAwake(false);
          sleep();
        }, 2200);
      }, 20000 + Math.random() * 40000);
    };
    sleep();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pointer-events-none absolute select-none" style={{ ...style, fontFamily: 'VT323, monospace', color: '#8367c7' }} aria-hidden="true">
      {awake ? (
        <span className="cat-awake" style={{ fontSize: 18 }}>...?</span>
      ) : (
        [0, 1, 2].map((i) => (
          <span key={i} className="cat-z" style={{ animationDelay: `${i * 0.9}s`, fontSize: 14 + i * 3 }}>
            z
          </span>
        ))
      )}
    </div>
  );
}
