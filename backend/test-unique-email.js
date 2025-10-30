// Test with a unique email to see if email actually gets sent
async function testWithUniqueEmail() {
  console.log('🧪 Testing User Creation with Unique Email...\n');

  try {
    // Generate a unique email
    const timestamp = Date.now();
    const uniqueEmail = `testuser${timestamp}@example.com`;

    console.log(`📧 Testing with email: ${uniqueEmail}`);

    const testUser = {
      fullName: 'Test User Unique',
      email: uniqueEmail,
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

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ User Created Successfully');
      console.log('📧 Email Sent:', createData.emailSent);
      console.log('👥 Total Users:', createData.totalUsers);
      console.log('👤 User Details:', JSON.stringify(createData.user, null, 2));

      if (createData.emailSent) {
        console.log('\n✅ Email should have been sent successfully!');
        console.log('📮 Check the email inbox for:', uniqueEmail);
      } else {
        console.log('\n❌ Email failed to send');
      }
    } else {
      console.log('❌ User Creation Failed');
      const errorText = await createResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithUniqueEmail();
