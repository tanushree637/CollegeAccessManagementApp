// controllers/authController.js
const { auth, db } = require('../config/firebaseConfig');

// 🔹 Register new user (by Admin)
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, role, password = 'password123' } = req.body; // Default password for demo

    // Check if user already exists
    const existingUser = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
      fullName,
      email,
      role,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
    };

    await db.collection('users').add(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { fullName, email, role },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
};

// 🔹 Login existing user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if user is active
    if (userData.isActive === false) {
      return res.status(403).json({
        message: 'Account is deactivated. Please contact administration.',
      });
    }

    // Simple password validation (in production, use bcrypt)
    if (userData.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Update last login timestamp
    await userDoc.ref.update({
      lastLogin: new Date().toISOString(),
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        personalEmail: userData.personalEmail,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// 🔹 Change password for existing user
exports.changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({
          message: 'Email, current password, and new password are required',
        });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters long' });
    }

    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Validate current password (in production, use bcrypt and hashed passwords)
    if (userData.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await userDoc.ref.update({
      password: newPassword,
      passwordUpdatedAt: new Date().toISOString(),
    });

    return res
      .status(200)
      .json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res
      .status(500)
      .json({ message: 'Failed to change password', error: error.message });
  }
};
