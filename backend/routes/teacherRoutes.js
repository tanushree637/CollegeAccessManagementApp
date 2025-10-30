const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getAssignedStudents,
} = require('../controllers/teacherController');

router.get('/tasks', getAllTasks);
router.get('/students', getAssignedStudents);

module.exports = router;
