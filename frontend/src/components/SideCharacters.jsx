import char1 from '../1_chibi8bit.png';
import char2 from '../2_chibi8bit.png';

// Karakter di dua sisi kosong (hanya layar lebar; disembunyikan di HP/tablet).
export default function SideCharacters() {
  return (
    <>
      <img
        src={char1}
        alt=""
        aria-hidden="true"
        className="floaty pointer-events-none fixed top-1/2 left-[3vw] hidden w-52 -translate-y-1/2 select-none xl:block 2xl:w-64"
        style={{ imageRendering: 'pixelated' }}
      />
      <img
        src={char2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 right-[3vw] hidden w-52 -translate-y-1/2 select-none xl:block 2xl:w-64"
        style={{ imageRendering: 'pixelated' }}
      />
    </>
  );
}
