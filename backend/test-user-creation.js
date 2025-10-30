// Test user creation without email dependency
const { sendEmail } = require('./utils/emailService');

async function testUserCreation() {
  console.log('🧪 Testing User Creation Process...\n');

  // Test the email service first
  console.log('📋 Step 1: Testing Email Service');
  const emailResult = await sendEmail(
    'test@example.com',
    'Test Subject',
    'Test message',
  );

  console.log('Email Result:', emailResult);
  console.log('Email Success:', emailResult.success);
  console.log('Email Error:', emailResult.error);

  // Test what happens when we check emailResult.success
  if (!emailResult.success) {
    console.log('✅ Email failed but we continue with user creation');
    console.log(
      `📝 Warning message: User created but email failed: ${emailResult.error}`,
    );
  } else {
    console.log('✅ Email sent successfully');
  }

  // Simulate the response format
  const response = {
    success: true,
    message: 'User created successfully and credentials sent to email!',
    user: {
      id: 'test-id',
      fullName: 'Test User',
      email: 'test.college@college.edu',
      role: 'student',
      personalEmail: 'test@example.com',
    },
    totalUsers: 10,
    emailSent: emailResult.success,
  };

  console.log('\n📊 Final Response:');
  console.log(JSON.stringify(response, null, 2));
}

testUserCreation().catch(console.error);
