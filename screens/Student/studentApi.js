// Reusable Student API helper with dynamic base URL resolution.
// Centralizes logic to avoid duplication across student screens.
import { API_CONFIG } from '../../config/config';
import {
  getBaseUrlFast,
  resolveBaseUrl,
  fetchWithTimeout,
} from '../../utils/network';

const resolveBase = async () => {
  let base = API_CONFIG.BASE_URL || (await getBaseUrlFast());
  if (!base) base = await resolveBaseUrl(true);
  return base;
};

export const studentApi = {
  async get(path, { timeout } = {}) {
    const base = await resolveBase();
    if (!base) throw new Error('Base URL unresolved');
    const url = `${base}${path}`;
    const res = await fetchWithTimeout(url, { method: 'GET', timeout });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, url };
  },
  async post(path, body, { timeout } = {}) {
    const base = await resolveBase();
    if (!base) throw new Error('Base URL unresolved');
    const url = `${base}${path}`;
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
      timeout,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, url };
  },
  async patch(path, body, { timeout } = {}) {
    const base = await resolveBase();
    if (!base) throw new Error('Base URL unresolved');
    const url = `${base}${path}`;
    const res = await fetchWithTimeout(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
      timeout,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, url };
  },
};

export default studentApi;
