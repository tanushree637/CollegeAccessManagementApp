// Test email sending to a real email address
async function testEmailToRealAddress() {
  console.log('🧪 Testing Email Sending to Real Address...\n');

  // Test 1: Direct email test
  console.log('📋 Step 1: Testing Direct Email Send');
  const { sendEmail } = require('./utils/emailService');

  const testResult = await sendEmail(
    'tanushreesrivastav7@gmail.com', // TO: Your email (recipient)
    'Test Email from College Management System',
    `Hello!

This is a test email to verify the email system is working.

FROM: tanushreesrivastav7@gmail.com (College System)
TO: tanushreesrivastav7@gmail.com (You as recipient)

Sent at: ${new Date().toLocaleString()}

If you receive this, the email system is working correctly!`,
  );

  console.log('Direct Email Result:', testResult);

  // Test 2: User creation with your email as recipient
  console.log('\n📋 Step 2: Testing User Creation Email');

  try {
    const timestamp = Date.now();
    const testUser = {
      fullName: 'Test User Email Recipient',
      email: 'tanushreesrivastav7@gmail.com', // Your email as recipient
      role: 'student',
    };

    console.log('Attempting to create user with email:', testUser.email);

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
    const responseText = await createResponse.text();
    console.log('Raw Response:', responseText);

    if (createResponse.status === 400) {
      console.log("⚠️ User already exists - that's why email wasn't sent");

      // Try with a different email
      console.log('\n📋 Step 3: Testing with Different Email');
      const newTestUser = {
        fullName: 'New Test User',
        email: `test.recipient.${timestamp}@gmail.com`,
        role: 'teacher',
      };

      const newCreateResponse = await fetch(
        'http://localhost:5000/api/admin/create-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTestUser),
        },
      );

      console.log('New User Creation Status:', newCreateResponse.status);
      const newResponseText = await newCreateResponse.text();
      console.log('New User Response:', newResponseText);

      try {
        const parsedResponse = JSON.parse(newResponseText);
        console.log('Email Sent Status:', parsedResponse.emailSent);
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    }
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

testEmailToRealAddress();
