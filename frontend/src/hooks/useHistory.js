import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useHistory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const refresh = useCallback(
    () =>
      // Ambil sebanyak mungkin (batas backend 1000): level & kalender dihitung dari seluruh riwayat.
      api
        .history(1000)
        .then((list) => {
          setItems(list);
          setError('');
        })
        .catch((e) => setError(e.message)),
    []
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Sinkron dua HP: muat ulang saat aplikasi dibuka lagi dari background / tab aktif lagi,
  // dan tiap 60 detik selama layar terlihat. Jadi yang disimpan di HP satu muncul di HP lainnya.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    const t = setInterval(onVisible, 60 * 1000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      clearInterval(t);
    };
  }, [refresh]);

  const upsert = (item) =>
    setItems((prev) =>
      prev.some((h) => h.id === item.id) ? prev.map((h) => (h.id === item.id ? item : h)) : [item, ...prev]
    );

  // plannedAt diisi = rencana (📌); kosong = sudah pergi sekarang (♥).
  const add = useCallback(async (place, { plannedAt } = {}) => {
    const created = await api.addHistory({ placeId: place.id, placeName: place.name, plannedAt });
    upsert(created);
    return created;
  }, []);

  const update = useCallback(async (id, patch) => {
    const updated = await api.updateHistory(id, patch);
    upsert(updated);
    return updated;
  }, []);

  const uploadPhoto = useCallback(async (id, blob) => {
    const updated = await api.uploadHistoryPhoto(id, blob);
    upsert(updated);
    return updated;
  }, []);

  const removePhoto = useCallback(async (id) => {
    const updated = await api.deleteHistoryPhoto(id);
    upsert(updated);
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await api.deleteHistory(id);
    setItems((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return { items, error, add, update, uploadPhoto, removePhoto, remove, refresh };
}
