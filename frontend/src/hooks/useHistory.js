import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useHistory() {
  const [items, setItems] = useState([]);

  const refresh = useCallback(() => {
    api.history().then(setItems).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (place) => {
    const created = await api.addHistory({
      placeId: place.id,
      placeName: place.name,
    });
    setItems((prev) => [created, ...prev]);
  }, []);

  const remove = useCallback(async (id) => {
    await api.deleteHistory(id);
    setItems((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return { items, add, remove, refresh };
}
