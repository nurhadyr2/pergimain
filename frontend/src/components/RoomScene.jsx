import roomBg from '../Character dan Layout Kamar/assets/layouts/room-sides-bg.png';
import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';

// Posisi dalam persen terhadap artwork 1920x1080 (16:9),
// ditaruh di "cover-box" 16:9 biar selalu sejajar di layar mana pun.
const pix = { imageRendering: 'pixelated' };

const GIRL_BUBBLE = { left: '14%', top: '47%', width: '18%' };
const BOY_BUBBLE = { left: '64%', top: '47%', width: '18%' };

function BubbleText({ box, children }) {
  // Teks satu baris di badan balon, ruang ekor di bawah.
  return (
    <div
      className="absolute hidden items-center justify-center text-center lg:flex"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        aspectRatio: '62 / 34',
        paddingBottom: '16%',
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
      {/* cover-box 16:9 yang selalu menutupi viewport */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
