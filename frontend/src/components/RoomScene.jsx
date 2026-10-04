import roomBg from '../Character dan Layout Kamar/assets/layouts/room-sides-bg.png';
import roomTile from '../Character dan Layout Kamar/assets/layouts/room-tile.png';
import girlPeace from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boyPeace from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import girlIdle from '../Character dan Layout Kamar/assets/characters/girl-idle.png';
import boyIdle from '../Character dan Layout Kamar/assets/characters/boy-idle.png';
import CatZzz from './CatZzz';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';

// Artwork 1920x1080 selalu tampil UTUH (contain), menempel di bawah layar.
// Sisa ruang di samping/atas diisi tile dinding+lantai (potongan x 640–960
// dari artwork yang sama, periode motifnya 320px) supaya tidak ada yang terpotong.
const pix = { imageRendering: 'pixelated' };

const W = 'min(100vw, 177.78vh)'; // lebar artwork di layar
const H = 'min(56.25vw, 100vh)'; // tinggi artwork di layar
const BOX_LEFT = `calc((100vw - ${W}) / 2)`;
const BOX_TOP = `calc(100vh - ${H})`;

const WALL_DOT_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E" +
  "%3Crect x='24' y='12' width='4' height='4' fill='%23d8c8ee'/%3E%3C/svg%3E";

// HP: cuma dinding (titik 2px tiap 16px, skala sama dgn MobileScene)
const MOBILE_WALL_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E" +
  "%3Crect x='6' y='6' width='2' height='2' fill='%23d8c8ee'/%3E%3C/svg%3E";

// Posisi dalam % artwork. Karakter & balon sengaja di zona kiri (x < 460)
// dan kanan (x > 1460) — area tengah ketutup panel di layar laptop kecil.
//   cewek: berdiri di tengah karpet pink (x≈363), balon ekor-kanan ke arah kiri,
//          di atas rak buku & tanaman.
//   cowok: berdiri di depan sofa (x≈1600), balon ekor-kiri ke arah kanan,
//          di bawah jendela & di atas sofa.
const GIRL = { left: '13.9%', top: '69.4%', width: '10%' };
const BOY = { left: '78.3%', top: '69.4%', width: '10%' };
const GIRL_BUBBLE = { left: '4.97%', top: '42.2%', width: '15.6%' };
const BOY_BUBBLE = { left: '83.2%', top: '42.2%', width: '15.6%' };

function Bubble({ src, box, children }) {
  // Teks satu baris di tengah badan balon (gambar 248x136, badan 108px atas).
  return (
    <div className="absolute" style={box}>
      <img src={src} alt="" aria-hidden="true" className="block w-full" style={pix} />
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center text-center"
        style={{
          height: `${(108 / 136) * 100}%`,
          whiteSpace: 'nowrap',
          fontFamily: 'VT323, monospace',
          color: '#463a66',
          lineHeight: 1,
          fontSize: `clamp(13px, calc(${W} * 0.0105), 20px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const DEFAULT_LINES = { girl: 'Mau makan aja?', boy: 'Spin aja, seru~' };

// lines: { girl, boy } teks balon; pose: 'idle' | 'peace'; jump: lompat kegirangan.
export default function RoomScene({ lines = DEFAULT_LINES, pose = 'idle', jump = false }) {
  const girl = pose === 'peace' ? girlPeace : girlIdle;
  const boy = pose === 'peace' ? boyPeace : boyIdle;
  const charCls = `absolute ${jump ? 'char-jump' : ''}`;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 lg:hidden" style={{ background: `#e8dcf6 url("${MOBILE_WALL_SVG}")` }} />

      {/* Pengisi samping/atas: tile lantai+dinding sejajar dengan artwork */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          backgroundColor: '#e8dcf6',
          backgroundImage: `url("${roomTile}"), url("${WALL_DOT_SVG}")`,
          backgroundRepeat: 'repeat-x, repeat',
          backgroundSize: `calc(${W} / 6) ${H}, calc(${W} / 60) calc(${W} / 60)`,
          backgroundPosition: `${BOX_LEFT} 100%, ${BOX_LEFT} ${BOX_TOP}`,
          ...pix,
        }}
      />

      {/* Tali tanaman gantung disambung sampai atas layar (art x 448, lebar 4) */}
      <div
        className="absolute top-0 hidden lg:block"
        style={{
          left: `calc(${BOX_LEFT} + ${W} * 448 / 1920)`,
          width: `calc(${W} * 4 / 1920)`,
          height: `calc(${BOX_TOP} + ${W} * 8 / 1920)`,
          background: '#8e889e',
        }}
      />

      <div
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 lg:block"
        style={{ width: W, height: H }}
      >
        <img src={roomBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" style={pix} />

        {/* Kucing tidur ada di artwork (kiri bawah); "z" melayang di atas kepalanya */}
        <CatZzz style={{ left: '8.6%', top: '88%' }} />

        <div className="room-chars">
          <img key={girl} src={girl} alt="" aria-hidden="true" className={charCls} style={{ ...pix, ...GIRL }} />
          <Bubble src={bubbleR} box={GIRL_BUBBLE}>{lines.girl}</Bubble>

          <img key={boy} src={boy} alt="" aria-hidden="true" className={charCls} style={{ ...pix, ...BOY }} />
          <Bubble src={bubbleL} box={BOY_BUBBLE}>{lines.boy}</Bubble>
        </div>
      </div>
    </div>
  );
}
