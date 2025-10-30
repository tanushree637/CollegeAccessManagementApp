// Test to see the actual response structure
async function testResponseStructure() {
  try {
    const timestamp = Date.now();
    const uniqueEmail = `testuser${timestamp}@example.com`;

    const testUser = {
      fullName: 'Test Response Structure',
      email: uniqueEmail,
      role: 'teacher',
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

    console.log('Response Status:', createResponse.status);
    console.log('Response Headers:', [...createResponse.headers.entries()]);

    const responseText = await createResponse.text();
    console.log('Raw Response:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('Parsed Response:', JSON.stringify(responseJson, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testResponseStructure();
