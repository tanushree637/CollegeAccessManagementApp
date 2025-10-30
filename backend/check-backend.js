// Quick test to check if backend is running
async function checkBackendStatus() {
  try {
    console.log('🔍 Checking if backend server is running...');

    const response = await fetch('http://localhost:5000');
    const text = await response.text();

    console.log('✅ Backend is running!');
    console.log('Response:', text);

    // Test the create user endpoint with detailed error checking
    console.log('\n🧪 Testing create user endpoint...');

    const testUser = {
      fullName: 'Test User Final',
      email: 'finaltest@example.com',
      role: 'student',
    };

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

    console.log('Create User Status:', createResponse.status);
    console.log('Create User Status Text:', createResponse.statusText);

    const createData = await createResponse.json();
    console.log('Create User Response:', JSON.stringify(createData, null, 2));
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.log('Make sure backend server is running on port 5000');
  }
}

checkBackendStatus();
