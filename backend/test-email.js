// Test script for email service
const { sendEmail, testEmailConfig } = require('./utils/emailService');

async function testEmailService() {
  console.log('🧪 Testing Email Service Configuration...\n');

  // Test 1: Check email configuration
  console.log('📋 Test 1: Email Configuration Verification');
  const configResult = await testEmailConfig();

  if (configResult.success) {
    console.log('✅ Email configuration is valid');
  } else {
    console.log('❌ Email configuration failed:', configResult.error);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log(
      '1. Make sure you are using an App Password (not your regular Gmail password)',
    );
    console.log('2. Enable 2-Step Verification in your Google Account');
    console.log('3. Generate an App Password from Google Account settings');
    console.log(
      '4. Update the EMAIL_PASS in your .env file or emailService.js',
    );
    return;
  }

  // Test 2: Send test email
  console.log('\n📋 Test 2: Sending Test Email');
  const testEmail = 'tanushreesrivastav7@gmail.com'; // Change this to test recipient

  const emailResult = await sendEmail(
    testEmail,
    'College Access Management - Email Test',
    `Hello!

This is a test email from the College Access Management System.

✅ Email service is working correctly!
📧 Sent at: ${new Date().toLocaleString()}

If you received this email, the email configuration is working properly.

Best regards,
College Access Management System`,
  );

  if (emailResult.success) {
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${emailResult.messageId}`);
    console.log(`📮 Sent to: ${testEmail}`);
  } else {
    console.log('❌ Test email failed:', emailResult.error);
  }

  console.log('\n🎯 Email Service Test Complete!');
}

// Run the test
testEmailService().catch(console.error);
