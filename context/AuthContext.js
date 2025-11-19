// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, AUTH_CONFIG } from '../config/config';
import {
  getBaseUrlFast,
  resolveBaseUrl,
  fetchWithTimeout,
} from '../utils/network';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (AUTH_CONFIG && AUTH_CONFIG.AUTO_LOGIN_ON_START) {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) setUser(JSON.parse(storedUser));
        } else {
          // Ensure we don't auto-sign-in. Clear any stored user so
          // the app always shows the Login screen first on cold start.
          try {
            await AsyncStorage.removeItem('user');
          } catch (e) {
            console.log('AuthContext: failed to clear stored user', e);
          }
          setUser(null);
        }
      } catch (error) {
        console.log('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const startTime = Date.now();
    const timeoutMs = API_CONFIG.TIMEOUT_MS || 10000;

    const tryLogin = async base => {
      const url = `${base}${API_CONFIG.ENDPOINTS.LOGIN}`;
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          timeout: timeoutMs,
        });

        const data = await response.json().catch(() => ({}));
        const apiDuration = Date.now() - startTime;
        console.log(`Login API call took ${apiDuration} ms -> ${url}`);

        if (response.ok) {
          if (!data || !data.user || !data.user.role) {
            console.error('AuthContext.login: invalid login payload', data);
            return { success: false, message: 'Invalid server response.' };
          }
          try {
            setUser(data.user);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
          } catch (storageErr) {
            console.error('AuthContext: failed to persist user', storageErr);
          }
          return { success: true, role: data.user.role };
        }

        return {
          success: false,
          message: data?.message || `Login failed (${response.status})`,
        };
      } catch (err) {
        const msg = err?.name === 'AbortError' ? 'timeout' : 'network';
        console.warn(`Login to ${base} failed:`, err?.message || err);
        return { success: false, message: msg };
      }
    };

    // First try with cached/fast base URL
    let base = await getBaseUrlFast();
    let result = await tryLogin(base);
    if (result.success) {
      const total = Date.now() - startTime;
      console.log(`Total login took ${total} ms (via ${base})`);
      return result;
    }

    // If network/timeout, force re-resolve base and retry once
    if (['network', 'timeout'].includes(result.message)) {
      base = await resolveBaseUrl(true);
      result = await tryLogin(base);
      if (result.success) {
        const total = Date.now() - startTime;
        console.log(
          `Total login took ${total} ms after re-resolve (via ${base})`,
        );
        return result;
      }
    }

    const totalDuration = Date.now() - startTime;
    console.log(`Total login function took ${totalDuration} ms (failed)`);
    Alert.alert(
      'Network Error',
      'Cannot reach the server. Ensure your device/emulator and PC are on the same Wi‑Fi and the firewall allows port 5000.',
    );
    return { success: false, message: result.message || 'network' };
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      console.log('AuthContext: User logged out successfully');
    } catch (err) {
      console.error('AuthContext: logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
