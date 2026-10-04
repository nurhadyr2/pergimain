import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ui } from '../lib/icons';
import { shrinkImage } from '../lib/image';

const fmtFull = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Jurnal satu kunjungan: rating 1-5 hati, cerita singkat, satu foto.
export default function JournalModal({ item, onClose, onSave, onPhoto, onRemovePhoto }) {
  const [rating, setRating] = useState(item?.rating || 0);
  const [note, setNote] = useState(item?.note || '');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  // Ganti item (buka jurnal lain) -> reset form
  useEffect(() => {
    setRating(item?.rating || 0);
    setNote(item?.note || '');
    setError('');
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return null;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSave(item.id, { rating: rating || null, note });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const blob = await shrinkImage(file);
      await onPhoto(item.id, blob);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    if (!confirm('Hapus foto ini?')) return;
    setUploading(true);
    try {
      await onRemovePhoto(item.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
        style={{ background: 'rgba(53,43,77,0.55)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="pix-panel flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '3px solid #463a66' }}>
            <h3 className="pix-title" style={{ fontSize: 11 }}>CERITA HARI ITU</h3>
            <button className="pix-chip" onClick={onClose} title="Tutup">
              <FontAwesomeIcon icon={ui.close} />
            </button>
          </div>

          <form onSubmit={save} className="flex-1 overflow-y-auto px-4 py-4">
            <p className="font-body leading-none" style={{ fontSize: 26, color: '#463a66' }}>{item.placeName}</p>
            <p className="font-body" style={{ fontSize: 16, color: '#9f86d9' }}>{fmtFull(item.spunAt)}</p>

            {/* Rating */}
            <p className="pix-title mt-4" style={{ fontSize: 8 }}>SERU NGGAK?</p>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`rate-heart ${n <= rating ? 'on' : ''}`}
                  onClick={() => setRating(n === rating ? 0 : n)}
                  aria-label={`${n} hati`}
                >
                  <FontAwesomeIcon icon={ui.heart} />
                </button>
              ))}
            </div>

            {/* Cerita */}
            <p className="pix-title mt-4" style={{ fontSize: 8 }}>CERITANYA</p>
            <textarea
              className="pix-input mt-2"
              placeholder="gimana tadi? makanannya, momen lucunya, apa aja..."
              value={note}
              maxLength={2000}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* Foto */}
            <p className="pix-title mt-4" style={{ fontSize: 8 }}>FOTO</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
            {item.photoUrl ? (
              <div className="mt-2">
                <img src={item.photoUrl} alt="" className="jr-photo" />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" className="pix-btn pix-white" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <FontAwesomeIcon icon={ui.camera} />&nbsp; {uploading ? '...' : 'GANTI'}
                  </button>
                  <button type="button" className="pix-btn pix-white" onClick={removePhoto} disabled={uploading}>
                    <FontAwesomeIcon icon={ui.trash} />&nbsp; HAPUS
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="pix-btn pix-mint mt-2 w-full"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                <FontAwesomeIcon icon={ui.camera} />&nbsp; {uploading ? 'MENGUNGGAH...' : 'TAMBAH FOTO'}
              </button>
            )}

            {error && <p className="font-body mt-3" style={{ fontSize: 17, color: '#e45f97' }}>{error}</p>}

            <button className="pix-btn pix-pink mt-4 w-full" disabled={busy || uploading}>
              {busy ? '...' : 'SIMPAN CERITA'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
