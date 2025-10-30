// scripts/addTestUsers.js
const { db } = require('../config/firebaseConfig');

const testUsers = [
  {
    fullName: 'Admin User',
    email: 'admin@college.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    fullName: 'John Teacher',
    email: 'teacher@college.com',
    password: 'teacher123',
    role: 'teacher',
    createdAt: new Date().toISOString(),
  },
  {
    fullName: 'Jane Student',
    email: 'student@college.com',
    password: 'student123',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    fullName: 'Guard Smith',
    email: 'guard@college.com',
    password: 'guard123',
    role: 'guard',
    createdAt: new Date().toISOString(),
  },
];

async function addTestUsers() {
  try {
    console.log('Adding test users...');

    for (const user of testUsers) {
      // Check if user already exists
      const existing = await db
        .collection('users')
        .where('email', '==', user.email)
        .get();

      if (existing.empty) {
        await db.collection('users').add(user);
        console.log(
          `✅ Added ${user.role}: ${user.email} (password: ${user.password})`,
        );
      } else {
        console.log(`⚠️  User ${user.email} already exists`);
      }
    }

    console.log('\n🎉 Test users setup complete!');
    console.log('\nYou can now login with:');
    console.log('Admin: admin@college.com / admin123');
    console.log('Teacher: teacher@college.com / teacher123');
    console.log('Student: student@college.com / student123');
    console.log('Guard: guard@college.com / guard123');
  } catch (error) {
    console.error('Error adding test users:', error);
  }
}

addTestUsers();
