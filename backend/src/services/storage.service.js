const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Tempat simpan foto jurnal.
// - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY terisi -> Supabase Storage (bucket publik, dibuat otomatis).
// - Kalau tidak -> disk server: backend/uploads/, disajikan di /uploads/*.
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const BUCKET = process.env.SUPABASE_BUCKET || 'kenangan';
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  supabase.storage
    .createBucket(BUCKET, { public: true, fileSizeLimit: '8MB', allowedMimeTypes: ['image/*'] })
    .then(({ error }) => {
      if (error && !/already exists/i.test(error.message)) console.error('[storage] bucket:', error.message);
      else console.log(`📷 Foto -> Supabase Storage (bucket "${BUCKET}")`);
    });
} else {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📷 Foto -> disk server (${UPLOAD_DIR})`);
}

exports.UPLOAD_DIR = UPLOAD_DIR;
exports.mode = () => (supabase ? 'supabase' : 'disk');

const extOf = (mime) => ({ 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[mime] || 'jpg');

// Simpan buffer gambar, kembalikan URL yang bisa dipakai <img src>.
exports.savePhoto = async (buffer, mime, prefix = 'h') => {
  const name = `${prefix}-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extOf(mime)}`;

  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET).upload(name, buffer, { contentType: mime, upsert: false });
    if (error) throw new Error(`Upload foto gagal: ${error.message}`);
    return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
  }

  await fs.promises.writeFile(path.join(UPLOAD_DIR, name), buffer);
  return `/uploads/${name}`;
};

// Hapus foto lama (abaikan kalau gagal; bukan hal kritis).
exports.deletePhoto = async (url) => {
  if (!url) return;
  try {
    if (supabase) {
      const name = url.split(`/${BUCKET}/`).pop();
      if (name) await supabase.storage.from(BUCKET).remove([name]);
    } else if (url.startsWith('/uploads/')) {
      await fs.promises.unlink(path.join(UPLOAD_DIR, path.basename(url)));
    }
  } catch { /* abaikan */ }
};
