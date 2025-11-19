const crypto = require('crypto');

const SECRET = process.env.QR_SECRET || 'default_dev_secret_change_me';

// Simple signed token: base64(payload).hexSignature
function signPayload(payload) {
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadJson).toString('base64');
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payloadB64);
  const sig = hmac.digest('hex');
  return `${payloadB64}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payloadB64);
  const expected = hmac.digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return null;
  }
  try {
    const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadJson);
    return payload;
  } catch (err) {
    return null;
  }
}

module.exports = { signPayload, verifyToken };
