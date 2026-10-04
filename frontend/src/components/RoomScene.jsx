import roomBg from '../Character dan Layout Kamar/assets/layouts/room-sides-bg.png';
import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';

// Semua posisi dalam persen terhadap artwork 1920x1080 (16:9),
// ditaruh di dalam "cover-box" 16:9 biar selalu sejajar di layar mana pun.
const pix = { imageRendering: 'pixelated' };

// Balon = teks (dipakai bareng biar pas).
const GIRL_BUBBLE = { left: '15.5%', top: '49%', width: '17%' };
const BOY_BUBBLE = { left: '65%', top: '49%', width: '17%' };

function BubbleText({ box, children }) {
  // Teks di badan balon, sisakan ruang buat ekor di bawah.
  return (
    <div
      className="absolute flex items-center justify-center text-center"
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        aspectRatio: '62 / 34',
        paddingLeft: '9%',
        paddingRight: '9%',
        paddingBottom: '22%',
        fontFamily: 'VT323, monospace',
        color: '#463a66',
        lineHeight: 1.05,
        fontSize: 'clamp(10px, 0.8vw, 15px)',
      }}
    >
      {children}
    </div>
  );
}

export default function RoomScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden lg:block">
      {/* cover-box 16:9 yang selalu menutupi viewport */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: '100vw', height: '56.25vw', minWidth: '177.78vh', minHeight: '100vh' }}
      >
        <img src={roomBg} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" style={pix} />

        {/* Karakter cewek, berdiri di karpet (kiri) */}
        <img src={girl} alt="" aria-hidden="true" className="absolute" style={{ ...pix, left: '13%', top: '71.5%', width: '8.5%' }} />
        <img src={bubbleL} alt="" aria-hidden="true" className="absolute" style={{ ...pix, ...GIRL_BUBBLE }} />
        <BubbleText box={GIRL_BUBBLE}>Mau makan aja?</BubbleText>

        {/* Karakter cowok, berdiri di pojok sofa (kanan) */}
        <img src={boy} alt="" aria-hidden="true" className="absolute" style={{ ...pix, left: '80.5%', top: '70.5%', width: '9%' }} />
        <img src={bubbleR} alt="" aria-hidden="true" className="absolute" style={{ ...pix, ...BOY_BUBBLE }} />
        <BubbleText box={BOY_BUBBLE}>Spin aja, seru~</BubbleText>
      </div>
    </div>
  );
}
