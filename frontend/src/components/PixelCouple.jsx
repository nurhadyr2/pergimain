import char from '../1_chibi8bit.png';

// Karakter chibi 8-bit (dipakai di dalam app, terutama untuk layar kecil).
export default function PixelCouple() {
  return (
    <div className="flex items-center justify-center py-1">
      <img
        src={char}
        alt="Karakter kita berdua"
        className="w-40 select-none"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
