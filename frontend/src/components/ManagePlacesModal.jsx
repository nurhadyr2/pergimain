import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

const emptyForm = (categoryId) => ({
  categoryId: categoryId || '',
  name: '',
  description: '',
  address: '',
  mapUrl: '',
  priceLevel: 1,
});

export default function ManagePlacesModal({ open, onClose, categories, onChanged }) {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.places().then(setPlaces).catch((e) => setError(e.message));

  useEffect(() => {
    if (open) {
      load();
      setForm(emptyForm(categories[0]?.id));
      setEditingId(null);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = { ...form, categoryId: Number(form.categoryId), priceLevel: Number(form.priceLevel) };
      if (editingId) await api.updatePlace(editingId, payload);
      else await api.addPlace(payload);
      setForm(emptyForm(categories[0]?.id));
      setEditingId(null);
      await load();
      onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      categoryId: p.categoryId,
      name: p.name,
      description: p.description || '',
      address: p.address || '',
      mapUrl: p.mapUrl || '',
      priceLevel: p.priceLevel,
    });
  };

  const remove = async (id) => {
    if (!confirm('Hapus tempat ini?')) return;
    await api.deletePlace(id);
    await load();
    onChanged?.();
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
            <h3 className="pix-title" style={{ fontSize: 11 }}>⚙ KELOLA TEMPAT</h3>
            <button className="pix-chip" onClick={onClose} title="Tutup">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Form tambah / edit */}
            <form onSubmit={submit} className="mb-4 flex flex-col gap-2 pb-4" style={{ borderBottom: '2px dotted #cdbdec' }}>
              <div className="grid grid-cols-2 gap-2">
                <select className="pix-input" value={form.categoryId} onChange={set('categoryId')} required>
                  <option value="" disabled>Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select className="pix-input" value={form.priceLevel} onChange={set('priceLevel')}>
                  <option value={0}>Gratis</option>
                  <option value={1}>Murah</option>
                  <option value={2}>Sedang</option>
                  <option value={3}>Mahal</option>
                </select>
              </div>
              <input className="pix-input" placeholder="Nama tempat" value={form.name} onChange={set('name')} required />
              <input className="pix-input" placeholder="Alamat / area (opsional)" value={form.address} onChange={set('address')} />
              <input className="pix-input" placeholder="Link Google Maps (opsional)" value={form.mapUrl} onChange={set('mapUrl')} />
              <input className="pix-input" placeholder="Deskripsi (opsional)" value={form.description} onChange={set('description')} />

              {error && <p className="font-body" style={{ fontSize: 17, color: '#e45f97' }}>{error}</p>}

              <div className="flex gap-2">
                <button className="pix-btn pix-pink flex-1" disabled={busy}>
                  {editingId ? 'SIMPAN' : 'TAMBAH'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="pix-btn pix-white"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm(categories[0]?.id));
                    }}
                  >
                    BATAL
                  </button>
                )}
              </div>
            </form>

            {/* Daftar tempat */}
            <ul className="flex flex-col">
              {places.map((p) => (
                <li key={p.id} className="flex items-center gap-2 py-2" style={{ borderBottom: '2px dotted #cdbdec' }}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body leading-tight" style={{ fontSize: 19, color: '#463a66' }}>{p.name}</p>
                    <p className="truncate font-body" style={{ fontSize: 15, color: '#9f86d9' }}>
                      {p.category?.name}{p.address ? ` · ${p.address}` : ''}
                    </p>
                  </div>
                  <button className="pix-chip" onClick={() => startEdit(p)} title="Ubah">✎</button>
                  <button className="pix-chip" onClick={() => remove(p.id)} title="Hapus">✕</button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
