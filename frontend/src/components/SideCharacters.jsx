import char1 from '../1_chibi8bit.png';
import char2 from '../2_chibi8bit.png';

// Karakter di dua sisi kosong + balon ucapan (hanya layar lebar).
export default function SideCharacters() {
  return (
    <>
      <div className="pointer-events-none fixed bottom-[8vh] left-[3vw] z-10 hidden w-52 flex-col items-center gap-2 select-none xl:flex 2xl:w-60">
        <div className="say">Mau makan aja? (•ᴗ•)♡</div>
        <img src={char1} alt="" aria-hidden="true" className="floaty w-full" style={{ imageRendering: 'pixelated' }} />
      </div>
      <div className="pointer-events-none fixed bottom-[8vh] right-[3vw] z-10 hidden w-52 flex-col items-center gap-2 select-none xl:flex 2xl:w-60">
        <div className="say say-r">Spin aja! Pasti seru~</div>
        <img src={char2} alt="" aria-hidden="true" className="w-full" style={{ imageRendering: 'pixelated' }} />
      </div>
    </>
  );
}
