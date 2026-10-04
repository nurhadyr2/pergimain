import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';
import bubbleL from '../Character dan Layout Kamar/assets/bubbles/bubble-left.png';
import bubbleR from '../Character dan Layout Kamar/assets/bubbles/bubble-right.png';

const pix = { imageRendering: 'pixelated' };

// Balon pixel yang sama dengan versi desktop; teks di tengah badan balon
// (gambar 248x136, badan 108px atas, sisanya ekor).
function Bubble({ src, children }) {
  return (
    <div className="relative w-40 select-none">
      <img src={src} alt="" aria-hidden="true" className="block w-full" style={pix} />
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center text-center"
        style={{
          height: `${(108 / 136) * 100}%`,
          whiteSpace: 'nowrap',
          fontFamily: 'VT323, monospace',
          color: '#463a66',
          lineHeight: 1,
          fontSize: 17,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Versi mobile: karakter + balon berdiri di lantai kamar, di bawah panel.
export default function MobileScene() {
  return (
    <div className="pointer-events-none mt-6 flex items-end justify-between pb-2 lg:hidden">
      <div className="flex flex-col items-start">
        <Bubble src={bubbleL}>Mau makan aja?</Bubble>
        <img src={girl} alt="" aria-hidden="true" className="-mt-1 ml-1 w-24 select-none" style={pix} />
      </div>
      <div className="flex flex-col items-end">
        <Bubble src={bubbleR}>Spin aja, seru~</Bubble>
        <img src={boy} alt="" aria-hidden="true" className="-mt-1 mr-1 w-24 select-none" style={pix} />
      </div>
    </div>
  );
}
