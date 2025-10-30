# 📧 Email Service Setup Guide

## 🚨 Current Status: Email Service Needs Configuration

The email service in your College Access Management system **requires proper setup** to work correctly. Here's what you need to do:

## 🔧 Setup Steps

### 1. **Gmail App Password Setup** (CRITICAL)

The current configuration uses a regular Gmail password, which **won't work** with modern Gmail security. You need an **App Password**.

#### Steps to get Gmail App Password:

1. **Go to Google Account Settings**: https://myaccount.google.com/
2. **Security** → **2-Step Verification** (must be enabled first)
3. **App passwords** → **Generate app password**
4. **Select app**: Mail
5. **Select device**: Other (Custom name) → "College Management System"
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 2. **Update Email Configuration**

Replace the password in `backend/utils/emailService.js`:

```javascript
const EMAIL_PASS = 'abcd efgh ijkl mnop'; // Your 16-character App Password
```

### 3. **Environment Variables (Recommended)**

Create `backend/.env` file:

```env
EMAIL_USER=tanushreesrivastav7@gmail.com
EMAIL_PASS=your_16_character_app_password_here
EMAIL_SERVICE=gmail
```

Then update `emailService.js` to use environment variables (already implemented).

## 🧪 Testing Email Service

### Method 1: Using Test Script

```bash
cd backend
node test-email.js
```

### Method 2: Using API Endpoint

```bash
# Test via API
POST http://localhost:5000/api/admin/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

## 🔍 Common Issues & Solutions

### Issue 1: "Authentication failed"

- **Solution**: Use App Password instead of regular password
- **Check**: 2-Step Verification is enabled on Google Account

### Issue 2: "Invalid login"

- **Solution**: Make sure email address is correct
- **Check**: App Password is exactly 16 characters (no spaces)

### Issue 3: "Connection failed"

- **Solution**: Check internet connection
- **Check**: Gmail service is not blocked by firewall

### Issue 4: "App Password not available"

- **Solution**: Enable 2-Step Verification first
- **Wait**: May take a few minutes to activate

## 📋 Verification Checklist

- [ ] 2-Step Verification enabled on Google Account
- [ ] App Password generated (16 characters)
- [ ] Email configuration updated with App Password
- [ ] Test script runs successfully
- [ ] Test email received in inbox

## 🎯 Current Email Features

Once configured, the system will:

1. **Send welcome emails** when admin creates new users
2. **Include login credentials** for new users
3. **Send notifications** to users
4. **Provide detailed error handling** for failed emails

## 🔧 Updated Email Service Features

The email service has been enhanced with:

- ✅ **Better Error Handling**: Specific error messages for different issues
- ✅ **HTML Email Support**: Better formatted emails
- ✅ **Configuration Testing**: Verify setup before sending
- ✅ **Environment Variables**: Secure credential storage
- ✅ **Detailed Logging**: Track email sending status

## 🚀 Testing User Creation with Email

After email setup:

1. Go to Admin → Create User
2. Fill in user details
3. Submit form
4. Check if email is sent to the provided address
5. Email should contain:
   - Welcome message
   - Auto-generated college email
   - Temporary password
   - Login instructions

## 📞 Support

If you continue to have email issues:

1. **Check Gmail Account**: Ensure 2-Step Verification is active
2. **Verify App Password**: Generate a new one if needed
3. **Test Configuration**: Run the test script
4. **Check Logs**: Look for specific error messages in console

The email service is **critical** for user management as it's how new users receive their login credentials!
