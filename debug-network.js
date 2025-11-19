// Debug network connectivity
const testUrls = [
  'http://192.168.1.7:5000',
  'http://10.0.2.2:5000',
  'http://localhost:5000',
];

async function testConnectivity() {
  console.log('Testing network connectivity to backend...');

  for (const url of testUrls) {
    try {
      console.log(`\n🔍 Testing: ${url}`);
      const response = await fetch(`${url}/`);
      const text = await response.text();
      console.log(`✅ SUCCESS: ${url}`);
      console.log(`Response: ${text}`);

      // Test QR endpoint
      try {
        const qrResponse = await fetch(`${url}/api/admin/generate-qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'test123',
            role: 'teacher',
            type: 'entry',
          }),
        });
        const qrData = await qrResponse.json();
        console.log(`✅ QR Endpoint working: ${qrData.success ? 'YES' : 'NO'}`);
      } catch (qrError) {
        console.log(`❌ QR Endpoint failed: ${qrError.message}`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${url}`);
      console.log(`Error: ${error.message}`);
    }
  }
}

testConnectivity();
