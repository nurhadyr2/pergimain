const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const qs = (slugs) => (slugs?.length ? `?categories=${slugs.join(',')}` : '');

export const api = {
  categories: () => req('/api/categories'),
  places: (slugs = []) => req(`/api/places${qs(slugs)}`),
  spin: (slugs = []) => req(`/api/spin${qs(slugs)}`),
  addPlace: (body) => req('/api/places', { method: 'POST', body: JSON.stringify(body) }),
  updatePlace: (id, body) => req(`/api/places/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePlace: (id) => req(`/api/places/${id}`, { method: 'DELETE' }),
  history: (limit = 20) => req(`/api/history?limit=${limit}`),
  addHistory: (body) => req('/api/history', { method: 'POST', body: JSON.stringify(body) }),
  deleteHistory: (id) => req(`/api/history/${id}`, { method: 'DELETE' }),
};
