// Token sesi (hasil login PIN) disimpan di HP. PIN-nya sendiri tidak pernah disimpan.
const KEY = 'mk_token';
export const UNAUTH_EVENT = 'mk:unauth';

export const getToken = () => {
  try { return localStorage.getItem(KEY) || ''; } catch { return ''; }
};
export const setToken = (t) => {
  try { localStorage.setItem(KEY, t); } catch { /* private mode: sesi cuma selama tab hidup */ }
};
export const clearToken = () => {
  try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
};

// Dipanggil api.js saat server jawab 401 -> App tampilkan layar PIN lagi.
export const notifyUnauth = () => {
  clearToken();
  window.dispatchEvent(new Event(UNAUTH_EVENT));
};
