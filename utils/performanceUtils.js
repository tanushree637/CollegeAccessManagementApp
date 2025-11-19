// utils/performanceUtils.js

class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
  }

  startTimer(label) {
    this.timers.set(label, Date.now());
    console.log(`⏱️  Started timer: ${label}`);
  }

  endTimer(label) {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`✅ ${label}: ${duration}ms`);
      this.timers.delete(label);
      return duration;
    }
    return null;
  }

  logMemoryUsage() {
    if (__DEV__) {
      // Only available in development and with debugging tools
      console.log('📊 Memory usage logging available in debug mode');
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Network timeout wrapper
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

// Fetch with simple retry and exponential backoff
export const fetchWithRetry = async (
  url,
  options = {},
  timeout = 10000,
  retries = 2,
  backoff = 500,
) => {
  let attempt = 0;
  while (true) {
    try {
      attempt += 1;
      return await fetchWithTimeout(url, options, timeout);
    } catch (err) {
      if (attempt > retries) {
        throw err;
      }
      const delay = backoff * Math.pow(2, attempt - 1);
      console.warn(
        `Fetch failed (attempt ${attempt}) - retrying in ${delay}ms:`,
        err.message || err,
      );
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Simple debounce function for search/input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
