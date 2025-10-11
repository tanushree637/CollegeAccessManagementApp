// utils/generateQR.js
// 🔹 Generates a QR value (string) — can later be used with QRCode library

import { ROLES } from './roles';

// This just generates a text-based QR data string (not the image itself)
export const generateQRData = user => {
  if (!user || !user.id || !user.role) return null;

  return JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
    timestamp: new Date().toISOString(),
  });
};

// Example usage:
// const qrData = generateQRData({ id: "S123", name: "John", role: ROLES.STUDENT });
