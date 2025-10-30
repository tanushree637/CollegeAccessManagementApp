// Test actual user creation API endpoint
async function testCreateUserAPI() {
  console.log('🧪 Testing Create User API Endpoint...\n');

  const testUser = {
    fullName: 'Test User Demo',
    email: 'testuser@example.com',
    role: 'student',
  };

  try {
    console.log('📋 Sending POST request to create user...');
    console.log('User data:', JSON.stringify(testUser, null, 2));

    const response = await fetch(
      'http://localhost:5000/api/admin/create-user',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      },
    );

    console.log('📡 Response status:', response.status);
    console.log('📡 Response status text:', response.statusText);

    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ User creation successful!');
    } else {
      console.log('❌ User creation failed:', data.message);
    }
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    console.error('📋 Make sure the backend server is running on port 5000');
  }
}

testCreateUserAPI();
