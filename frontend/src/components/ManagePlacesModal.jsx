import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../lib/api';
import { ui } from '../lib/icons';

const emptyForm = (categoryId) => ({
  categoryId: categoryId || '',
  name: '',
  description: '',
  address: '',
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
      priceLevel: p.priceLevel,
    });
  };

  const remove = async (id) => {
    if (!confirm('Hapus tempat ini?')) return;
    await api.deletePlace(id);
    await load();
    onChanged?.();
  };

  const inputCls =
    'w-full rounded-xl border-0 bg-ink-800 px-3 py-2 text-sm text-cream-100 placeholder:text-cream-400 ring-1 ring-gold-400/15 focus:ring-2 focus:ring-gold-400 outline-none';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-ink-900 ring-1 ring-gold-400/20 sm:rounded-3xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gold-400/15 px-5 py-4">
            <h3 className="font-display text-lg font-bold text-gold-300">Kelola Tempat</h3>
            <button className="icon-btn h-9 w-9 hover:bg-ink-800 hover:text-cream-100" onClick={onClose} title="Tutup">
              <FontAwesomeIcon icon={ui.close} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Form tambah / edit */}
            <form onSubmit={submit} className="mb-5 flex flex-col gap-2.5 rounded-2xl bg-ink-950/60 p-4 ring-1 ring-gold-400/10">
              <div className="grid grid-cols-2 gap-2.5">
                <select className={inputCls} value={form.categoryId} onChange={set('categoryId')} required>
                  <option value="" disabled>Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <select className={inputCls} value={form.priceLevel} onChange={set('priceLevel')}>
                  <option value={0}>Gratis</option>
                  <option value={1}>Murah</option>
                  <option value={2}>Sedang</option>
                  <option value={3}>Mahal</option>
                </select>
              </div>
              <input className={inputCls} placeholder="Nama tempat" value={form.name} onChange={set('name')} required />
              <input className={inputCls} placeholder="Alamat / area (opsional)" value={form.address} onChange={set('address')} />
              <input className={inputCls} placeholder="Deskripsi (opsional)" value={form.description} onChange={set('description')} />

              {error && <p className="text-sm text-blush-300">{error}</p>}

              <div className="flex gap-2">
                <button className="btn-maroon flex-1 text-sm" disabled={busy}>
                  {editingId ? 'Simpan perubahan' : 'Tambah tempat'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-ghost text-sm"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm(categories[0]?.id));
                    }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            {/* Daftar tempat */}
            <ul className="flex flex-col gap-2">
              {places.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-ink-800 px-4 py-2 ring-1 ring-gold-400/10">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-cream-100">{p.name}</p>
                    <p className="truncate text-xs text-cream-400">{p.category?.name}{p.address ? ` · ${p.address}` : ''}</p>
                  </div>
                  <button className="icon-btn hover:bg-ink-700 hover:text-gold-300" onClick={() => startEdit(p)} title="Ubah">
                    <FontAwesomeIcon icon={ui.pen} />
                  </button>
                  <button className="icon-btn hover:bg-maroon-700 hover:text-blush-300" onClick={() => remove(p.id)} title="Hapus">
                    <FontAwesomeIcon icon={ui.trash} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
