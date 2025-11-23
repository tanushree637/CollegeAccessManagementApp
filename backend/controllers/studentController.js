// backend/controllers/studentController.js
const taskModel = require('../models/taskModel');

const getAllStudents = (req, res) => {
  res.json({ message: 'List of students' });
};

const addStudent = (req, res) => {
  res.json({ message: 'Student added successfully' });
};

// Return tasks assigned to a specific student userId
const getTasksForStudent = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Tasks explicitly assigned to this student
    const directTasks = await taskModel.getTasksByUser(userId);

    // Global / class tasks: those with assignedTo null (unassigned)
    const allTasksSnapshot = await require('firebase-admin')
      .firestore()
      .collection('tasks')
      .where('assignedTo', '==', null)
      .get();
    const globalTasks = allTasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      assignedScope: 'global',
    }));

    // Merge (avoid duplicate ids if any) – direct tasks take precedence
    const mergedMap = new Map();
    globalTasks.forEach(t => mergedMap.set(t.id, t));
    directTasks.forEach(t =>
      mergedMap.set(t.id, { ...t, assignedScope: 'direct' }),
    );
    const merged = Array.from(mergedMap.values());

    res.set('Cache-Control', 'no-store');
    return res.status(200).json({
      message: 'Student tasks fetched',
      tasks: merged,
      counts: {
        direct: directTasks.length,
        global: globalTasks.length,
        total: merged.length,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch student tasks',
      error: err.message,
    });
  }
};

module.exports = { getAllStudents, addStudent, getTasksForStudent };
