/**
 * Quick CLI helper to simulate QR attendance flow.
 * Usage: node scripts/testScanAttendance.js <userId> <role> <type> [baseUrl]
 * Example: node scripts/testScanAttendance.js abc123 student entry http://localhost:5000
 */

const [, , userId, role, type, baseUrlArg] = process.argv;

async function main() {
  if (!userId || !role || !type) {
    console.error(
      'Usage: node scripts/testScanAttendance.js <userId> <role> <type> [baseUrl]',
    );
    process.exit(1);
  }

  const baseUrl = baseUrlArg || process.env.BASE_URL || 'http://localhost:5000';
  const genUrl = `${baseUrl}/api/admin/generate-qr`;
  const recordUrl = `${baseUrl}/api/admin/record-attendance`;

  console.log(`\n🔐 Generating token for ${userId} (${role}) type=${type} ...`);
  const genRes = await fetch(genUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, role, type }),
  });
  const genData = await genRes.json();
  if (!genData.success) {
    console.error('❌ Failed to generate token:', genData);
    process.exit(1);
  }
  console.log('✅ Token generated');
  const token = genData.token;

  console.log('\n📝 Recording attendance with token ...');
  const recRes = await fetch(recordUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  const recData = await recRes.json();
  if (!recData.success) {
    console.error('❌ Failed to record attendance:', recData);
    process.exit(1);
  }
  console.log('✅ Attendance recorded:', recData);

  console.log('\n🎉 Done');
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
