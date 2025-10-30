// Test user creation with debug logging
async function testUserCreationWithLogs() {
  console.log('🧪 Testing User Creation with Debug Logs...\n');

  try {
    const timestamp = Date.now();
    const testUser = {
      fullName: 'Debug Test User',
      email: `debug.test.${timestamp}@example.com`,
      role: 'student',
    };

    console.log('📝 Creating user:', JSON.stringify(testUser, null, 2));

    const createResponse = await fetch(
      'http://localhost:5000/api/admin/create-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      },
    );

    console.log('📡 Response Status:', createResponse.status);
    console.log('📡 Response Headers:', [...createResponse.headers.entries()]);

    const responseText = await createResponse.text();
    console.log('📄 Raw Response Text:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('📊 Parsed Response:', JSON.stringify(responseJson, null, 2));

      console.log('\n📧 Email Status Check:');
      console.log('- emailSent field:', responseJson.emailSent);
      console.log('- totalUsers field:', responseJson.totalUsers);
      console.log('- user field present:', !!responseJson.user);
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserCreationWithLogs();
