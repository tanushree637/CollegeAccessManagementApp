import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/config';

// Bump storage key to invalidate stale cached IPs when network changes
const STORAGE_KEY = 'network:baseUrl:v2';
const STORAGE_TS_KEY = 'network:baseUrl:ts:v2';
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = API_CONFIG.TIMEOUT_MS || 8000, ...rest } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(resource, { ...rest, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

const unique = arr => Array.from(new Set(arr.filter(Boolean)));

const buildCandidates = () => {
  const configured = API_CONFIG?.BASE_URL || '';
  const lanFromConfig =
    configured && configured.startsWith('http') ? configured : '';

  return unique([
    // Prefer a previously saved good base URL from storage (handled before building)
    lanFromConfig,
    Platform.OS === 'android'
      ? 'http://10.0.2.2:5000'
      : 'http://localhost:5000',
    // Fallback candidates commonly used in dev
    'http://192.168.1.7:5000', // prior LAN default
    'http://192.168.137.1:5000', // Windows hotspot host IP
    'http://192.168.43.1:5000', // Android hotspot gateway (sometimes host)
    'http://172.20.10.2:5000', // iOS hotspot common client IP
    'http://192.168.1.4:5000',
    'http://127.0.0.1:5000',
  ]);
};

export const resolveBaseUrl = async (forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      const [cached, tsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(STORAGE_TS_KEY),
      ]);
      const ts = tsStr ? parseInt(tsStr, 10) : 0;
      if (cached && ts && Date.now() - ts < TTL_MS) {
        return cached;
      }
    }
  } catch {}

  const candidates = buildCandidates();

  for (const base of candidates) {
    try {
      const res = await fetchWithTimeout(`${base}/`, {
        method: 'GET',
        timeout: 2000,
      });
      if (res.ok) {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, base);
          await AsyncStorage.setItem(STORAGE_TS_KEY, String(Date.now()));
        } catch {}
        return base;
      }
    } catch (e) {
      // ignore and try next
    }
  }

  // As a last resort, return configured BASE_URL
  return API_CONFIG.BASE_URL;
};

export const getBaseUrlFast = async () => resolveBaseUrl(false);

// Generic JSON POST helper with dynamic base resolution + one retry
export const apiPostJson = async (endpoint, body, options = {}) => {
  const start = Date.now();
  let base = await getBaseUrlFast();
  let attempt = 0;
  const maxAttempts = 2;
  let lastErr;

  while (attempt < maxAttempts) {
    const url = `${base}${endpoint}`;
    try {
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        body: JSON.stringify(body),
        timeout: options.timeout || API_CONFIG.TIMEOUT_MS,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        return {
          success: true,
          data,
          status: res.status,
          url,
          duration: Date.now() - start,
        };
      }
      return {
        success: false,
        data,
        status: res.status,
        url,
        duration: Date.now() - start,
      };
    } catch (e) {
      lastErr = e;
      if (attempt === 0) {
        // force re-resolve and retry
        base = await resolveBaseUrl(true);
      }
    }
    attempt++;
  }
  return {
    success: false,
    error: lastErr?.message || 'network',
    duration: Date.now() - start,
  };
};
