const QRCode = require('qrcode');

// Generate QR Code for given data (e.g., UID or userId)
async function generateQRCode(data) {
  try {
    const qrDataURL = await QRCode.toDataURL(JSON.stringify(data));
    return qrDataURL; // returns Base64 encoded image
  } catch (error) {
    console.error('❌ QR generation failed:', error);
    throw new Error('QR generation failed');
  }
}

module.exports = generateQRCode;
