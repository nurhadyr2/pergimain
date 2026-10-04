import roomBg from '../Character dan Layout Kamar/assets/layouts/room-sides-bg.png';
import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';

// Posisi dalam persen terhadap artwork 1920x1080 (16:9),
// ditaruh di "cover-box" 16:9 biar selalu sejajar di layar mana pun.
const pix = { imageRendering: 'pixelated' };

const WALL_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E" +
  "%3Crect x='7' y='7' width='2' height='2' fill='%23d8c8ee'/%3E%3C/svg%3E";

const GIRL_BUBBLE = { left: '14%', top: '47%', width: '18%' };
const BOY_BUBBLE = { left: '64%', top: '47%', width: '18%' };

// Tinggi badan balon (tanpa ekor) dalam % tinggi cover-box:
// 18% lebar × (16/9) × (136/248 rasio gambar) × (108/136 bagian badan) ≈ 13.9%
const BODY_HEIGHT = '13.9%';

function BubbleText({ box, children }) {
  // Teks satu baris, di tengah badan balon (ekor di bawah tidak dihitung).
  return (
    <div
      className="absolute hidden items-center justify-center text-center lg:flex"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: BODY_HEIGHT,
        whiteSpace: 'nowrap',
        fontFamily: 'VT323, monospace',
        color: '#463a66',
        lineHeight: 1,
        fontSize: 'clamp(13px, 1.15vw, 20px)',
      }}
    >
      {children}
    </div>
  );
}

export default function RoomScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* HP: cuma dinding (titik 2px tiap 16px, skala sama dgn MobileScene) */}
      <div className="absolute inset-0 lg:hidden" style={{ background: `#e8dcf6 url("${WALL_SVG}")` }} />

      {/* cover-box 16:9 yang selalu menutupi viewport */}
      <div
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        style={{ width: '100vw', height: '56.25vw', minWidth: '177.78vh', minHeight: '100vh' }}
      >
        <img src={roomBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" style={pix} />

        {/* Karakter hanya di layar lebar (sprite di sisi kiri/kanan) */}
        <img src={girl} alt="" aria-hidden="true" className="absolute hidden lg:block" style={{ ...pix, left: '13%', top: '71.5%', width: '8.5%' }} />
        <img src={bubbleL} alt="" aria-hidden="true" className="absolute hidden lg:block" style={{ ...pix, ...GIRL_BUBBLE }} />
        <BubbleText box={GIRL_BUBBLE}>Mau makan aja?</BubbleText>

        <img src={boy} alt="" aria-hidden="true" className="absolute hidden lg:block" style={{ ...pix, left: '80.5%', top: '70.5%', width: '9%' }} />
        <img src={bubbleR} alt="" aria-hidden="true" className="absolute hidden lg:block" style={{ ...pix, ...BOY_BUBBLE }} />
        <BubbleText box={BOY_BUBBLE}>Spin aja, seru~</BubbleText>
      </div>
    </div>
  );
}
