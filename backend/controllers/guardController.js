// backend/controllers/guardController.js

const addGuard = (req, res) => {
  res.json({ message: 'Guard added successfully!' });
};

const getAllGuards = (req, res) => {
  res.json({ message: 'All guards list' });
};

module.exports = { addGuard, getAllGuards };
