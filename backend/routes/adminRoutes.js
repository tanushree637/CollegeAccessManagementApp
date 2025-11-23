const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  getDashboardWithActivity,
  getAllUsers,
  createUser,
  recordAttendance,
  getRecentAttendance,
  scanAttendanceViaToken,
  getUserAttendanceRecords,
  sendNotification,
  getUserNotifications,
  markNotificationAsRead,
  generateQRToken,
  testEmail,
} = require('../controllers/adminController');

// Admin routes
router.get('/dashboard', getDashboardData);
router.get('/dashboard-with-activity', getDashboardWithActivity); // New optimized endpoint
router.get('/users', getAllUsers);
router.get('/recent-attendance', getRecentAttendance);
router.post('/create-user', createUser);
router.post('/record-attendance', recordAttendance);
router.post('/generate-qr', generateQRToken);
// QR scan (GET) endpoint so a regular phone camera opening the URL records attendance
router.get('/scan-attendance', scanAttendanceViaToken);
// User-specific attendance history
router.get('/attendance/:userId', getUserAttendanceRecords);

// Notification routes
router.post('/send-notification', sendNotification);
router.get('/notifications/:userId', getUserNotifications);
router.patch('/notifications/:notificationId/read', markNotificationAsRead);

// Email testing route
router.post('/test-email', testEmail);

module.exports = router;
