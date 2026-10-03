// Karakter pixel 8-bit (cewe & cowo) digambar pakai SVG rect, bukan foto.
const PX = 7;

const PAL = {
  o: '#352b4d', // outline
  H: '#8a5a34', // rambut cewe
  h: '#3a2e22', // rambut cowo
  k: '#f4c89f', // kulit
  e: '#352b4d', // mata
  d: '#ef7fae', // dress pink
  g: '#67d6a6', // kaos cowo (hijau mint)
  c: '#ffffff', // topi cowo
  b: '#6b5b95', // celana
};

// 9 kolom per baris
const GIRL = [
  '..ooooo..',
  '.oHHHHHo.',
  'oHHHHHHHo',
  'oHkkkkkHo',
  'oHkekekHo',
  '.okkkkko.',
  '..okkko..',
  '.odddddo.',
  'oddddddo.'.padEnd(9, 'd'),
  'odddddddo',
  '.o.d.d.o.',
  '.oo...oo.',
];

const BOY = [
  '..ccccc..',
  '.ccccccc.',
  'occcccccc',
  '.hkkkkkh.',
  '.hkekekh.',
  '.hkkkkkh.',
  '..okkko..',
  '.ogggggo.',
  'oggggggo'.padEnd(9, 'g'),
  'ogggggggo',
  '.ob...bo.',
  '.oo...oo.',
];

function Sprite({ rows, className = '' }) {
  const w = rows[0].length;
  const h = rows.length;
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const fill = PAL[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x * PX} y={y * PX} width={PX} height={PX} fill={fill} />);
    }
  });
  return (
    <svg
      className={className}
      width={w * PX}
      height={h * PX}
      viewBox={`0 0 ${w * PX} ${h * PX}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}

export default function PixelCouple() {
  return (
    <div className="flex items-end justify-center gap-3 py-1">
      <Sprite rows={GIRL} />
      <span className="text-bubble-400 floaty" style={{ fontSize: 22, alignSelf: 'center' }}>♥</span>
      <Sprite rows={BOY} />
    </div>
  );
}
