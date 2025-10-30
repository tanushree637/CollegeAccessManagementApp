// backend/controllers/studentController.js

const getAllStudents = (req, res) => {
  res.json({ message: 'List of students' });
};

const addStudent = (req, res) => {
  res.json({ message: 'Student added successfully' });
};

module.exports = { getAllStudents, addStudent };
