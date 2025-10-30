const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addStudent,
} = require('../controllers/studentController');

router.get('/students', getAllStudents);
router.post('/students', addStudent);

module.exports = router;
