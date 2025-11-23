// controllers/adminController.js
const { db } = require('../config/firebaseConfig');
const { sendEmail, testEmailConfig } = require('../utils/emailService');
const crypto = require('crypto');
const { verifyToken } = require('../utils/qrToken');

// 🔹 Dashboard data for Admin (Optimized)
exports.getDashboardData = async (req, res) => {
  try {
    console.time('Dashboard Query');

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Execute both queries in parallel
    const [usersSnapshot, attendanceSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('attendance').where('date', '==', todayString).get(),
    ]);

    // Process user data efficiently
    const totalUsers = usersSnapshot.size;
    const roleCounts = {
      managers: 0,
      employees: 0,
      students: 0,
      teachers: 0,
      guards: 0,
    };

    // Single pass through users for role counting
    usersSnapshot.docs.forEach(doc => {
      const role = doc.data().role?.toLowerCase();
      switch (role) {
        case 'manager':
          roleCounts.managers++;
          break;
        case 'employee':
          roleCounts.employees++;
          break;
        case 'student':
          roleCounts.students++;
          break;
        case 'teacher':
          roleCounts.teachers++;
          break;
        case 'guard':
          roleCounts.guards++;
          break;
      }
    });

    // Process attendance data efficiently
    let totalEntriesToday = 0;
    let totalExitsToday = 0;
    const activeUsers = new Set();

    attendanceSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.type === 'entry') {
        totalEntriesToday++;
        activeUsers.add(data.userId);
      } else if (data.type === 'exit') {
        totalExitsToday++;
        activeUsers.delete(data.userId);
      }
    });

    console.timeEnd('Dashboard Query');

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      stats: {
        totalUsers,
        totalEntriesToday,
        totalExitsToday,
        activeUsers: activeUsers.size,
        ...roleCounts,
      },
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

// 🔹 Generate signed QR token for attendance (entry/exit)
exports.generateQRToken = async (req, res) => {
  try {
    const { userId, role, type } = req.body; // type: 'entry' or 'exit'

    if (!userId || !role || !type) {
      return res.status(400).json({
        success: false,
        message: 'userId, role and type are required',
      });
    }

    // create payload with short expiry (e.g., 5 minutes)
    const now = Date.now();
    const payload = {
      userId,
      role,
      type,
      iat: now,
      exp: now + 1000 * 60 * 5,
    };

    const { signPayload } = require('../utils/qrToken');
    const token = signPayload(payload);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Generate QR Token Error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to generate QR token' });
  }
};

// 🔹 Combined Dashboard and Recent Activity (Single API call)
exports.getDashboardWithActivity = async (req, res) => {
  try {
    console.time('Combined Dashboard Query');

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const limit = parseInt(req.query.limit) || 5;

    // Execute all queries in parallel for maximum performance
    const [usersSnapshot, todayAttendanceSnapshot, recentAttendanceSnapshot] =
      await Promise.all([
        db.collection('users').get(),
        db.collection('attendance').where('date', '==', todayString).get(),
        db
          .collection('attendance')
          .orderBy('createdAt', 'desc')
          .limit(limit)
          .get(),
      ]);

    // Process user data
    const totalUsers = usersSnapshot.size;
    const roleCounts = {
      managers: 0,
      employees: 0,
      students: 0,
      teachers: 0,
      guards: 0,
    };
    const userMap = {};

    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      const role = userData.role?.toLowerCase();

      // Store user data for lookup
      userMap[doc.id] = userData;

      // Count roles
      switch (role) {
        case 'manager':
          roleCounts.managers++;
          break;
        case 'employee':
          roleCounts.employees++;
          break;
        case 'student':
          roleCounts.students++;
          break;
        case 'teacher':
          roleCounts.teachers++;
          break;
        case 'guard':
          roleCounts.guards++;
          break;
      }
    });

    // Process today's attendance
    let totalEntriesToday = 0;
    let totalExitsToday = 0;
    const activeUsers = new Set();

    todayAttendanceSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.type === 'entry') {
        totalEntriesToday++;
        activeUsers.add(data.userId);
      } else if (data.type === 'exit') {
        totalExitsToday++;
        activeUsers.delete(data.userId);
      }
    });

    // Process recent activity
    const recentActivity = recentAttendanceSnapshot.docs.map(doc => {
      const attendanceData = doc.data();
      const userData = userMap[attendanceData.userId] || {
        fullName: 'Unknown User',
        email: '',
      };

      return {
        id: doc.id,
        ...attendanceData,
        userName: userData.fullName,
        userEmail: userData.email,
      };
    });

    console.timeEnd('Combined Dashboard Query');

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      message: 'Dashboard data with activity fetched successfully',
      stats: {
        totalUsers,
        totalEntriesToday,
        totalExitsToday,
        activeUsers: activeUsers.size,
        ...roleCounts,
      },
      recentActivity,
    });
  } catch (error) {
    console.error('Combined Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

// 🔹 Get all users list
exports.getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      message: 'Users fetched successfully',
      users,
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch users', error: error.message });
  }
};

// 🔹 Record attendance (entry/exit)
exports.recordAttendance = async (req, res) => {
  try {
    const { userId, type, location, token } = req.body; // token is signed QR token

    let finalUserId = userId;
    let finalType = type;

    // If token is provided, verify and extract userId and type
    if (token) {
      const { verifyToken } = require('../utils/qrToken');
      const payload = verifyToken(token);
      if (!payload) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid or expired token' });
      }

      // check expiry
      if (payload.exp && Date.now() > payload.exp) {
        return res
          .status(400)
          .json({ success: false, message: 'Token expired' });
      }

      finalUserId = payload.userId;
      finalType = payload.type;
    }

    if (!finalUserId || !finalType) {
      return res.status(400).json({
        success: false,
        message: 'User ID and type are required',
      });
    }

    // Get today's date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const timestamp = today.toISOString();

    // Create attendance record
    const attendanceRecord = {
      userId: finalUserId,
      type: finalType, // 'entry' or 'exit'
      date: dateString,
      timestamp,
      location: location || 'Main Gate',
      createdAt: timestamp,
    };

    const docRef = await db.collection('attendance').add(attendanceRecord);

    res.status(201).json({
      success: true,
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } recorded successfully`,
      attendanceId: docRef.id,
    });
  } catch (error) {
    console.error('Record Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record attendance',
      error: error.message,
    });
  }
};

// 🔹 Scan attendance via GET token (for regular phone camera opening URL)
exports.scanAttendanceViaToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('<h3>Missing token</h3>');
    }
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(400).send('<h3>Invalid or expired token</h3>');
    }
    if (payload.exp && Date.now() > payload.exp) {
      return res.status(400).send('<h3>Token expired</h3>');
    }
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const timestamp = today.toISOString();
    // Fetch user name for friendly response (optional)
    let userName = 'User';
    try {
      const userDoc = await db.collection('users').doc(payload.userId).get();
      if (userDoc.exists) userName = userDoc.data().fullName || userName;
    } catch {}
    const attendanceRecord = {
      userId: payload.userId,
      type: payload.type,
      date: dateString,
      timestamp,
      location: 'QR Scan',
      createdAt: timestamp,
    };
    await db.collection('attendance').add(attendanceRecord);
    res.set('Cache-Control', 'no-store');
    return res.status(200).send(
      `<html><body style="font-family:Arial;padding:20px;">
        <h2>Attendance Recorded</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Type:</strong> ${payload.type}</p>
        <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <p style="color:green;font-weight:bold;">Success!</p>
      </body></html>`,
    );
  } catch (error) {
    console.error('Scan Attendance Error:', error);
    return res.status(500).send('<h3>Server error recording attendance</h3>');
  }
};

// 🔹 Get attendance records for a specific user
exports.getUserAttendanceRecords = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: 'User ID required' });
    }
    let snapshot = await db
      .collection('attendance')
      .where('userId', '==', userId)
      .get();
    let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt desc
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.set('Cache-Control', 'no-store');
    return res
      .status(200)
      .json({ success: true, attendance: records, count: records.length });
  } catch (error) {
    console.error('Get User Attendance Error:', error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Failed to fetch attendance',
        error: error.message,
      });
  }
};

// 🔹 Get recent attendance records (Optimized)
exports.getRecentAttendance = async (req, res) => {
  try {
    console.time('Recent Attendance Query');
    const limit = parseInt(req.query.limit) || 10;

    const attendanceSnapshot = await db
      .collection('attendance')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    if (attendanceSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'No recent attendance found',
        attendance: [],
      });
    }

    // Extract unique user IDs
    const userIds = [
      ...new Set(attendanceSnapshot.docs.map(doc => doc.data().userId)),
    ];

    // Batch fetch user data
    const userPromises = userIds.map(userId =>
      db.collection('users').doc(userId).get(),
    );
    const userDocs = await Promise.all(userPromises);

    // Create user lookup map
    const userMap = {};
    userDocs.forEach((doc, index) => {
      const userId = userIds[index];
      userMap[userId] = doc.exists
        ? doc.data()
        : { fullName: 'Unknown User', email: '' };
    });

    // Process attendance data with user info
    const recentAttendance = attendanceSnapshot.docs.map(doc => {
      const attendanceData = doc.data();
      const userData = userMap[attendanceData.userId];

      return {
        id: doc.id,
        ...attendanceData,
        userName: userData.fullName,
        userEmail: userData.email,
      };
    });

    console.timeEnd('Recent Attendance Query');

    res.status(200).json({
      success: true,
      message: 'Recent attendance fetched successfully',
      attendance: recentAttendance,
    });
  } catch (error) {
    console.error('Get Recent Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent attendance',
      error: error.message,
    });
  }
};
// 🔹 Create a new user
exports.createUser = async (req, res) => {
  try {
    console.log('🔍 Starting createUser function');
    const { fullName, email, role } = req.body;
    console.log('📝 Request data:', { fullName, email, role });

    if (!fullName || !email || !role) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Validate role
    const validRoles = ['teacher', 'student', 'guard'];
    if (!validRoles.includes(role.toLowerCase())) {
      console.log('❌ Invalid role:', role);
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be teacher, student, or guard.',
      });
    }

    console.log('✅ Validation passed');

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      console.log('❌ User already exists');
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    console.log('✅ User does not exist, proceeding...');

    // Generate login credentials
    console.log('🔑 Generating credentials...');
    const loginEmail = generateLoginEmail(fullName, role);
    const password = generateRandomPassword();
    console.log('📧 Generated college email:', loginEmail);

    // Create college email based on name and role
    const collegeEmail = loginEmail;

    // Create new user in Firestore
    console.log('💾 Creating user in database...');
    const newUser = {
      fullName,
      personalEmail: email, // Original email provided by admin
      email: collegeEmail, // College email for login
      role: role.toLowerCase(),
      password, // In production, this should be hashed
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: 'admin', // You can get this from auth context
    };

    const docRef = await db.collection('users').add(newUser);
    console.log('✅ User created in database with ID:', docRef.id);

    // Get updated total users count
    console.log('📊 Getting updated user count...');
    const updatedUsersSnapshot = await db.collection('users').get();
    const totalUsers = updatedUsersSnapshot.size;
    console.log('👥 Total users now:', totalUsers);

    // Send email with credentials
    console.log('📧 Preparing to send email...');
    const emailSubject = `Welcome to College Access Management System`;
    const emailMessage = `
Dear ${fullName},

Welcome to the College Access Management System!

Your account has been created with the following details:

🔑 Login Credentials:
Email: ${collegeEmail}
Password: ${password}
Role: ${role.charAt(0).toUpperCase() + role.slice(1)}

🏫 System Information:
- Use these credentials to log into the College Access Management app
- Keep your password secure and do not share it with others
- You can change your password after your first login

📱 Next Steps:
1. Download the College Access Management app
2. Login using the credentials above
3. Complete your profile setup

If you have any questions or need assistance, please contact the administration.

Best regards,
College Administration Team
    `;

    // Send email to personal email
    console.log(`📧 Attempting to send email to: ${email}`);
    const emailResult = await sendEmail(email, emailSubject, emailMessage);
    console.log(`📧 Email result:`, emailResult);

    if (!emailResult.success) {
      // If email fails, we might want to delete the user or mark as pending
      console.warn(
        `User created but email failed for ${email}: ${emailResult.error}`,
      );
    } else {
      console.log(`✅ Email sent successfully to ${email}`);
    }

    const responseData = {
      success: true,
      message: 'User created successfully and credentials sent to email!',
      user: {
        id: docRef.id,
        fullName,
        email: collegeEmail,
        role,
        personalEmail: email,
      },
      totalUsers,
      emailSent: emailResult.success,
    };

    console.log('📊 Sending response:', JSON.stringify(responseData, null, 2));
    return res.status(201).json(responseData);
  } catch (error) {
    console.error('💥 Create User Error:', error);
    console.error('💥 Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating user',
      error: error.message,
    });
  }
};

// Helper function to generate login email
function generateLoginEmail(fullName, role) {
  // Clean and format the name
  const cleanName = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '.'); // Replace spaces with dots

  // Generate a random number to make email unique
  const randomNum = Math.floor(Math.random() * 1000);

  // Create role-based email
  const rolePrefix = role.charAt(0); // t for teacher, s for student, g for guard

  return `${rolePrefix}.${cleanName}.${randomNum}@college.edu`;
}

// 🔹 Send notification to users
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;

    if (!title || !message || !targetRole) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and target role are required',
      });
    }

    // Validate target role
    const validTargets = ['all', 'teacher', 'student', 'guard'];
    if (!validTargets.includes(targetRole.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid target role. Must be all, teacher, student, or guard.',
      });
    }

    // Get users based on target role
    let usersQuery = db.collection('users');

    if (targetRole.toLowerCase() !== 'all') {
      usersQuery = usersQuery.where('role', '==', targetRole.toLowerCase());
    }

    const usersSnapshot = await usersQuery.get();

    if (usersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: `No users found for role: ${targetRole}`,
      });
    }

    // Create notification document
    const notificationData = {
      title,
      message,
      targetRole: targetRole.toLowerCase(),
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
      isActive: true,
    };

    // Add notification to notifications collection
    const notificationRef = await db
      .collection('notifications')
      .add(notificationData);

    // Create individual notification records for each user
    const batch = db.batch();
    const userNotifications = [];

    usersSnapshot.docs.forEach(userDoc => {
      const userData = userDoc.data();
      const userNotificationRef = db.collection('userNotifications').doc();

      const userNotificationData = {
        notificationId: notificationRef.id,
        userId: userDoc.id,
        userEmail: userData.email,
        title,
        message,
        targetRole: targetRole.toLowerCase(),
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      batch.set(userNotificationRef, userNotificationData);
      userNotifications.push({
        id: userNotificationRef.id,
        ...userNotificationData,
        userName: userData.fullName,
      });
    });

    await batch.commit();

    res.set('Cache-Control', 'no-store');
    res.status(201).json({
      success: true,
      message: `Notification sent successfully to ${usersSnapshot.size} users`,
      notification: {
        id: notificationRef.id,
        ...notificationData,
        recipientCount: usersSnapshot.size,
      },
    });
  } catch (error) {
    console.error('Send Notification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message,
    });
  }
};

// 🔹 Get notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    let notificationsSnapshot;
    try {
      // Prefer ordered query (requires composite index in Firestore)
      notificationsSnapshot = await db
        .collection('userNotifications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
    } catch (indexedQueryErr) {
      // Fallback when composite index is missing; fetch and sort in memory
      console.warn(
        'Firestore index missing for userNotifications, falling back to un-ordered query:',
        indexedQueryErr.message,
      );
      notificationsSnapshot = await db
        .collection('userNotifications')
        .where('userId', '==', userId)
        .limit(limit)
        .get();
    }

    let notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Ensure results are sorted by createdAt desc for consistent UX
    notifications.sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      notifications,
      count: notifications.length,
    });
  } catch (error) {
    console.error('Get User Notifications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// 🔹 Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: 'Notification ID is required',
      });
    }

    await db.collection('userNotifications').doc(notificationId).update({
      isRead: true,
      readAt: new Date().toISOString(),
    });

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Mark Notification as Read Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

// Helper function to generate login email
function generateLoginEmail(fullName, role) {
  // Clean and format the name
  const cleanName = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '.'); // Replace spaces with dots

  // Generate a random number to make email unique
  const randomNum = Math.floor(Math.random() * 1000);

  // Create role-based email
  const rolePrefix = role.charAt(0); // t for teacher, s for student, g for guard

  return `${rolePrefix}.${cleanName}.${randomNum}@college.edu`;
}

// Helper function to generate random password
function generateRandomPassword(length = 8) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
  let password = '';

  // Ensure at least one uppercase, one lowercase, one number, and one special char
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '@#$'[Math.floor(Math.random() * 3)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

// 🔹 Test email configuration
exports.testEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required for testing',
      });
    }

    // First test the configuration
    const configTest = await testEmailConfig();
    if (!configTest.success) {
      return res.status(500).json({
        success: false,
        message: 'Email configuration test failed',
        error: configTest.error,
      });
    }

    // Send test email
    const testSubject = 'College Access Management - Email Test';
    const testMessage = `
Hello!

This is a test email from the College Access Management System.

✅ Email service is working correctly!
📧 Sent at: ${new Date().toLocaleString()}

If you received this email, the email configuration is working properly.

Best regards,
College Access Management System
    `;

    const result = await sendEmail(email, testSubject, testMessage);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Test Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email test',
      error: error.message,
    });
  }
};
