// Kecilkan foto dari HP sebelum di-upload (foto kamera 3-5MB -> JPEG ~200-400KB).
// Orientasi EXIF ikut dibetulkan oleh createImageBitmap bila didukung.
export async function shrinkImage(file, max = 1280, quality = 0.82) {
  const source = await load(file);
  const scale = Math.min(1, max / Math.max(source.width, source.height));
  const w = Math.round(source.width * scale);
  const h = Math.round(source.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(source, 0, 0, w, h);
  if (source.close) source.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Gagal memproses foto'))), 'image/jpeg', quality)
  );
}

async function load(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* lanjut ke fallback */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('File bukan gambar yang bisa dibaca'));
    };
    img.src = url;
  });
}
