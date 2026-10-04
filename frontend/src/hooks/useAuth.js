import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { UNAUTH_EVENT, clearToken, getToken, setToken } from '../lib/auth';

// status: 'checking' (cek token tersimpan) | 'locked' (minta PIN) | 'ok'
export function useAuth() {
  const [status, setStatus] = useState(getToken() ? 'checking' : 'locked');

  useEffect(() => {
    if (status !== 'checking') return;
    api.me()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('locked'));
  }, [status]);

  useEffect(() => {
    const onUnauth = () => setStatus('locked');
    window.addEventListener(UNAUTH_EVENT, onUnauth);
    return () => window.removeEventListener(UNAUTH_EVENT, onUnauth);
  }, []);

  const login = useCallback(async (pin) => {
    const { token } = await api.login(pin);
    setToken(token);
    setStatus('ok');
  }, []);

  const lock = useCallback(() => {
    clearToken();
    setStatus('locked');
  }, []);

  return { status, login, lock };
}
