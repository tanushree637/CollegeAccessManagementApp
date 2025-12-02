// controllers/teacherController.js
const taskModel = require('../models/taskModel');
const { db } = require('../config/firebaseConfig');
// Add timetable sample (could later be stored in Firestore)

// Sample static timetable entries; in production fetch from a `timetables` collection
const SAMPLE_TIMETABLE = [
  {
    day: 'Monday',
    time: '09:00 - 09:45',
    subject: 'Mathematics',
    className: '10-A',
    room: '101',
  },
  {
    day: 'Monday',
    time: '10:00 - 10:45',
    subject: 'Physics',
    className: '11-B',
    room: 'Lab-2',
  },
  {
    day: 'Tuesday',
    time: '09:00 - 09:45',
    subject: 'Chemistry',
    className: '12-A',
    room: 'Lab-1',
  },
  {
    day: 'Wednesday',
    time: '11:00 - 11:45',
    subject: 'Free Period',
    className: '-',
    room: '-',
  },
];

// 🔹 CREATE TASK
exports.addTask = async (req, res) => {
  try {
    const { title, description, className, assignedTo, teacherId } = req.body;

    if (!title || !description || !className) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTask = {
      title,
      description,
      className,
      assignedTo: assignedTo || null,
      teacherId: teacherId || null,
      createdAt: new Date().toISOString(),
    };

    const task = await taskModel.createTask(newTask);

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      message: 'Task assigned successfully',
      task,
    });
  } catch (err) {
    console.log('Add Task Error:', err);
    res
      .status(500)
      .json({ message: 'Failed to assign task', error: err.message });
  }
};

// 🔹 GET TASKS (optionally filtered by teacherId)
exports.getAllTasks = async (req, res) => {
  try {
    const { teacherId } = req.query;
    let tasks;
    if (teacherId) {
      tasks = await taskModel.getTasksByTeacher(teacherId);
    } else {
      tasks = await taskModel.getAllTasks();
    }

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      message: 'Tasks fetched successfully',
      tasks,
      filtered: Boolean(teacherId),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

// 🔹 GET ALL STUDENTS
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

    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      message: 'Students fetched successfully',
      students,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch students',
      error: err.message,
    });
  }
};

// 🔹 GET TEACHER TIMETABLE (placeholder implementation)
exports.getTeacherTimetable = async (req, res) => {
  try {
    const { teacherId } = req.query; // optional filter
    // If Firestore implementation exists, fetch by teacherId; else return sample.
    // Example Firestore schema suggestion: collection('timetables').where('teacherId','==',teacherId)
    const data = SAMPLE_TIMETABLE; // static fallback
    res.set('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (err) {
    console.error('Get Teacher Timetable Error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to fetch timetable', error: err.message });
  }
};
