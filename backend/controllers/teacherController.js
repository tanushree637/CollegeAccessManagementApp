// controllers/teacherController.js
const { db } = require('../config/firebaseConfig');

// 🔹 Get all tasks assigned by a teacher
exports.getAllTasks = async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').get();

    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// 🔹 Get all students assigned to the teacher
exports.getAssignedStudents = async (req, res) => {
  try {
    const studentsSnapshot = await db
      .collection('users')
      .where('role', '==', 'Student')
      .get();

    const students = studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      message: 'Students fetched successfully',
      students,
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch students', error: error.message });
  }
};
