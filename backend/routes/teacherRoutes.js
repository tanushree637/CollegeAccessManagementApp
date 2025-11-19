const express = require('express');
const router = express.Router();

const {
  addTask,
  getAllTasks,
  getAssignedStudents,
} = require('../controllers/teacherController');

router.post('/tasks/add', addTask);
router.get('/tasks', getAllTasks);
router.get('/students', getAssignedStudents);

module.exports = router;
