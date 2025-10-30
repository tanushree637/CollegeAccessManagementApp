const nodemailer = require('nodemailer');

// Email configuration - use environment variables for security
const EMAIL_USER = process.env.EMAIL_USER || 'tanushreesrivastav7@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'tizq njgr rrsz fpyx'; // Should be App Password
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

// Create transporter with better error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    return null;
  }
};

// Send email (used by admin or notification controller)
async function sendEmail(to, subject, message) {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error('❌ Email transporter not available');
      return { success: false, error: 'Email service not configured' };
    }

    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text: message,
      html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${message}</pre>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    console.log(`📧 Message ID: ${result.messageId}`);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);

    // Provide specific error messages for common issues
    let errorMessage = 'Failed to send email';

    if (error.code === 'EAUTH') {
      errorMessage =
        'Authentication failed. Please check email credentials or use App Password for Gmail.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Please check internet connection.';
    } else if (error.code === 'EMESSAGE') {
      errorMessage = 'Invalid email message format.';
    } else {
      errorMessage = error.message || 'Unknown email error';
    }

    // Always return consistent format
    return { success: false, error: errorMessage };
  }
}

// Test email configuration
async function testEmailConfig() {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return { success: false, error: 'Transporter not created' };
    }

    const verified = await transporter.verify();
    console.log('✅ Email configuration verified');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail, testEmailConfig };
