// config/config.js
export const API_CONFIG = {
  // Change this to your backend IP/URL
  BASE_URL: __DEV__
    ? 'http://10.176.117.53:5000' // Updated to use actual IP address
    : 'https://your-production-api.com',
  // Alternative for Android emulator: 'http://10.0.2.2:5000'
  // For localhost testing: 'http://localhost:5000'
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ADMIN: '/api/admin',
    TEACHER: '/api/teacher',
    STUDENT: '/api/student',
    GUARD: '/api/guard',
  },
};
