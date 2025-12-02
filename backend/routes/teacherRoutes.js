const express = require('express');
const router = express.Router();

const {
  addTask,
  getAllTasks,
  getAssignedStudents,
  getTeacherTimetable,
} = require('../controllers/teacherController');

router.post('/tasks/add', addTask);
router.get('/tasks', getAllTasks);
router.get('/students', getAssignedStudents);
router.get('/timetable', getTeacherTimetable);

module.exports = router;
