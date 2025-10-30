// scripts/addTestAttendance.js
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = admin.firestore();

async function addTestAttendance() {
  try {
    console.log('🔄 Adding test attendance data...');

    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Sample test data for different times today
    const testAttendanceData = [
      {
        userId: 'test-student-1',
        type: 'entry',
        date: todayString,
        timestamp: new Date(today.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        location: 'Main Gate',
        createdAt: new Date(today.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: 'test-student-2',
        type: 'entry',
        date: todayString,
        timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        location: 'Main Gate',
        createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: 'test-student-3',
        type: 'entry',
        date: todayString,
        timestamp: new Date(today.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        location: 'Side Gate',
        createdAt: new Date(today.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        userId: 'test-student-1',
        type: 'exit',
        date: todayString,
        timestamp: new Date(today.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        location: 'Main Gate',
        createdAt: new Date(today.getTime() - 30 * 60 * 1000).toISOString(),
      },
      {
        userId: 'test-teacher-1',
        type: 'entry',
        date: todayString,
        timestamp: new Date(today.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        location: 'Staff Entrance',
        createdAt: new Date(today.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Add sample users first if they don't exist
    const sampleUsers = [
      {
        id: 'test-student-1',
        fullName: 'John Doe',
        email: 'john.doe@student.college.edu',
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'test-student-2',
        fullName: 'Jane Smith',
        email: 'jane.smith@student.college.edu',
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'test-student-3',
        fullName: 'Mike Johnson',
        email: 'mike.johnson@student.college.edu',
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'test-teacher-1',
        fullName: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@college.edu',
        role: 'teacher',
        createdAt: new Date().toISOString(),
      },
    ];

    // Add users
    for (const user of sampleUsers) {
      const userRef = db.collection('users').doc(user.id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set(user);
        console.log(`✅ Added user: ${user.fullName}`);
      } else {
        console.log(`ℹ️  User already exists: ${user.fullName}`);
      }
    }

    // Add attendance records
    for (const attendance of testAttendanceData) {
      await db.collection('attendance').add(attendance);
      console.log(
        `✅ Added ${attendance.type} record for ${attendance.userId} at ${attendance.timestamp}`,
      );
    }

    console.log('🎉 Test attendance data added successfully!');
    console.log('\n📊 Summary:');
    console.log('- 5 attendance records added');
    console.log('- 3 entries, 1 exit (2 students still inside)');
    console.log('- 1 teacher entry');
    console.log('\n🔄 You can now test the admin dashboard!');
  } catch (error) {
    console.error('❌ Error adding test attendance data:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

addTestAttendance();
