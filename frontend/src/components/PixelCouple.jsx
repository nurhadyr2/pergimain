import girl from '../Character dan Layout Kamar/assets/characters/girl-peace.png';
import boy from '../Character dan Layout Kamar/assets/characters/boy-peace.png';

// Dipakai di dalam app untuk layar kecil (room scene disembunyikan di HP/tablet).
export default function PixelCouple() {
  return (
    <div className="flex items-end justify-center gap-6 py-1">
      <img src={girl} alt="" aria-hidden="true" className="floaty w-20 select-none" style={{ imageRendering: 'pixelated' }} />
      <img src={boy} alt="" aria-hidden="true" className="w-20 select-none" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
}
