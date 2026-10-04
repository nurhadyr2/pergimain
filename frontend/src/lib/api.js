import { getToken, notifyUnauth } from './auth';

// Kosong = same-origin (frontend disajikan oleh backend). Isi VITE_API_URL bila backend beda host.
const BASE = import.meta.env.VITE_API_URL || '';

async function req(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Token kadaluarsa / PIN diganti -> kunci lagi (kecuali saat lagi coba login).
    if (res.status === 401 && !path.startsWith('/api/auth/login')) notifyUnauth();
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const qs = (slugs) => (slugs?.length ? `?categories=${slugs.join(',')}` : '');

export const api = {
  login: (pin) => req('/api/auth/login', { method: 'POST', body: JSON.stringify({ pin }) }),
  me: () => req('/api/auth/me'),
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
