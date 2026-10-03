// Karakter pixel 8-bit (cewe & cowo) + hati, digambar pakai SVG rect (bukan foto/emoji).
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
  p: '#ef7fae', // hati
};

const GIRL = [
  '..ooooo..',
  '.oHHHHHo.',
  'oHHHHHHHo',
  'oHkkkkkHo',
  'oHkekekHo',
  '.okkkkko.',
  '..okkko..',
  '.odddddo.',
  'odddddddo',
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
  'ogggggggo'.slice(0, 9),
  'ogggggggo',
  '.ob...bo.',
  '.oo...oo.',
];

const HEART = [
  '.pp.pp.',
  'ppppppp',
  'ppppppp',
  '.ppppp.',
  '..ppp..',
  '...p...',
];

function Sprite({ rows, px = 7, className = '' }) {
  const w = rows[0].length;
  const h = rows.length;
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = PAL[row[x]];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={fill} />);
    }
  });
  return (
    <svg
      className={className}
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w * px} ${h * px}`}
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
      <Sprite rows={HEART} px={5} className="floaty" />
      <Sprite rows={BOY} />
    </div>
  );
}
