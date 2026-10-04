import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';

// Versi mobile: karakter + balon tampil di bawah panel, di atas latar kamar.
export default function MobileScene() {
  return (
    <div className="mt-6 flex items-end justify-between lg:hidden">
      <div className="flex flex-col items-start gap-1">
        <div className="say" style={{ fontSize: 16, maxWidth: 150 }}>Mau makan aja?</div>
        <img src={girl} alt="" aria-hidden="true" className="ml-3 w-24 select-none" style={{ imageRendering: 'pixelated' }} />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="say say-r" style={{ fontSize: 16, maxWidth: 150 }}>Spin aja, seru~</div>
        <img src={boy} alt="" aria-hidden="true" className="mr-3 w-24 select-none" style={{ imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
}
