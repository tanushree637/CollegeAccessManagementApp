const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addStudent,
  getTasksForStudent,
} = require('../controllers/studentController');

router.get('/students', getAllStudents);
router.post('/students', addStudent);
// Student tasks (assigned tasks)
router.get('/tasks/:userId', getTasksForStudent);

module.exports = router;
