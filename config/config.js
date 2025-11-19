// config/config.js
import { Platform } from 'react-native';

export const API_CONFIG = {
  // Base URL for API calls in development.
  // Tip: If login keeps spinning, ensure this matches your PC's LAN IP.
  BASE_URL: __DEV__
    ? // Updated to current Wi‑Fi/hotspot IP discovered via ipconfig
      'http://10.154.139.53:5000'
    : 'https://your-production-api.com',
  // If you're strictly on Android emulator and prefer emulator alias, you can switch to:
  // Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://192.168.1.7:5000'
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ADMIN: '/api/admin',
    TEACHER: '/api/teacher',
    STUDENT: '/api/student',
    GUARD: '/api/guard',
  },
  // Default network timeout for API calls (ms)
  TIMEOUT_MS: 10000,
};

// Authentication-related configuration
export const AUTH_CONFIG = {
  // If true, app will auto-sign-in a stored user on startup.
  // Set to false to force the Login screen to appear first every time.
  AUTO_LOGIN_ON_START: false,
};
