// Test script for user creation API
const fetch = require('node-fetch'); // You might need to install: npm install node-fetch

const API_URL = 'http://localhost:5000/api/admin/create-user';

async function testCreateUser() {
  const testUser = {
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    role: 'student',
  };

  try {
    console.log('Testing user creation...');
    console.log('Test data:', testUser);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const result = await response.json();

    console.log('\n--- Response ---');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ User created successfully!');
      console.log('College Email:', result.user.email);
      console.log('Email Sent:', result.emailSent);
    } else {
      console.log('\n❌ User creation failed:', result.message);
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testCreateUser();
