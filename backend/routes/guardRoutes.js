const express = require('express');
const router = express.Router();
const { addGuard, getAllGuards } = require('../controllers/guardController');

router.post('/add', addGuard);
router.get('/all', getAllGuards);

module.exports = router;
