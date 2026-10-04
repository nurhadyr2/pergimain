import girlPeace from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boyPeace from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import girlIdle from '../Character dan Layout Kamar/assets/characters/girl-idle.png';
import boyIdle from '../Character dan Layout Kamar/assets/characters/boy-idle.png';
import CatZzz from './CatZzz';
import FitText from './FitText';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';
import desk from '../Character dan Layout Kamar/assets/room/desk-laptop-coffee.png';
import lights from '../Character dan Layout Kamar/assets/room/string-lights.png';
import polaroidCity from '../Character dan Layout Kamar/assets/room/polaroid-city.png';
import polaroidHeart from '../Character dan Layout Kamar/assets/room/polaroid-heart.png';
import bookshelf from '../Character dan Layout Kamar/assets/room/bookshelf.png';
import sofa from '../Character dan Layout Kamar/assets/room/sofa.png';
import cat from '../Character dan Layout Kamar/assets/room/cat-sleeping.png';
import heart from '../Character dan Layout Kamar/assets/decor/heart.png';
import sparkle from '../Character dan Layout Kamar/assets/decor/sparkle.png';

// Kamar mini versi HP. Semua sprite (file 4x) ditampilkan setengah ukuran file,
// jadi 1 pixel art = 2px layar — motif dinding/lantai di-skala sama.
const pix = { imageRendering: 'pixelated' };

const SCENE_H = 330;
const FLOOR_H = 120;

const FLOOR_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='48'%3E" +
  "%3Crect width='160' height='48' fill='%23d6c3ec'/%3E" +
  "%3Cg fill='%23c8b2e3'%3E%3Crect y='22' width='160' height='2'/%3E%3Crect y='46' width='160' height='2'/%3E" +
  "%3Crect x='66' width='2' height='22'/%3E%3Crect x='146' y='24' width='2' height='22'/%3E%3C/g%3E%3C/svg%3E";

function Sprite({ src, w, style, className = '' }) {
  return <img src={src} alt="" aria-hidden="true" className={`absolute select-none ${className}`} style={{ ...pix, width: w, ...style }} />;
}

// Balon pixel yang sama dengan versi desktop; teks di tengah badan balon
// (gambar 248x136, badan 108px atas, sisanya ekor).
function Bubble({ src, children, style }) {
  return (
    <div className="absolute w-[124px] select-none" style={style}>
      <img src={src} alt="" aria-hidden="true" className="block w-full" style={pix} />
      {/* Teks mengecil otomatis (boleh 2 baris) supaya tidak pernah keluar dari balon */}
      <FitText
        max={15}
        min={9}
        className="absolute inset-x-0 top-0 flex items-center justify-center text-center"
        style={{
          height: `${(108 / 136) * 100}%`,
          padding: '0 9px',
          boxSizing: 'border-box',
          fontFamily: 'VT323, monospace',
          color: '#463a66',
          lineHeight: 0.95,
        }}
      >
        {children}
      </FitText>
    </div>
  );
}

const DEFAULT_LINES = { girl: 'Mau makan aja?', boy: 'Spin aja, seru~' };

// lines: { girl, boy } teks balon; pose: 'idle' | 'peace'; jump: lompat kegirangan.
export default function MobileScene({ lines = DEFAULT_LINES, pose = 'idle', jump = false }) {
  const girl = pose === 'peace' ? girlPeace : girlIdle;
  const boy = pose === 'peace' ? boyPeace : boyIdle;
  const charCls = jump ? 'char-jump' : '';
  return (
    <div
      className="pointer-events-none relative left-1/2 mt-auto w-screen -translate-x-1/2 overflow-hidden lg:hidden"
      style={{ height: SCENE_H }}
    >
      {/* Lantai + plint, sama seperti artwork desktop */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: FLOOR_H, backgroundImage: `url("${FLOOR_SVG}")` }} />
      <div className="absolute inset-x-0" style={{ bottom: FLOOR_H, height: 2, background: '#bfa8de' }} />
      <div className="absolute inset-x-0" style={{ bottom: FLOOR_H + 2, height: 12, background: '#ddcdef' }} />

      {/* Dinding */}
      <Sprite src={lights} w={248} style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />
      <Sprite src={polaroidCity} w={48} style={{ top: 50, left: 22, transform: 'rotate(-4deg)' }} />
      <Sprite src={polaroidHeart} w={48} style={{ top: 50, right: 22, transform: 'rotate(4deg)' }} />
      <Sprite src={sparkle} w={18} style={{ top: 70, left: '30%' }} />
      <Sprite src={heart} w={18} style={{ top: 64, right: '30%' }} />

      {/* Perabot & kucing */}
      {/* Layar agak lebar (tablet): rak buku & sofa mengapit meja */}
      <Sprite src={bookshelf} w={104} className="hidden sm:block" style={{ bottom: FLOOR_H + 2, left: 'calc(50% - 186px)' }} />
      <Sprite src={sofa} w={196} className="hidden sm:block" style={{ bottom: FLOOR_H - 4, left: 'calc(50% + 80px)' }} />
      <Sprite src={desk} w={132} style={{ bottom: FLOOR_H - 2, left: '50%', transform: 'translateX(-50%)' }} />
      <Sprite src={cat} w={92} style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)' }} />
      <CatZzz style={{ bottom: 44, left: 'calc(50% + 30px)' }} />

      {/* Karakter + balon */}
      <Sprite key={girl} src={girl} w={112} className={charCls} style={{ bottom: 12, left: 4 }} />
      <Bubble src={bubbleL} style={{ bottom: 128, left: 14 }}>{lines.girl}</Bubble>

      <Sprite key={boy} src={boy} w={112} className={charCls} style={{ bottom: 12, right: 4 }} />
      <Bubble src={bubbleR} style={{ bottom: 128, right: 14 }}>{lines.boy}</Bubble>
    </div>
  );
}
