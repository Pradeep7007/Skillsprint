const express = require('express');
const { logViolation } = require('../controllers/proctorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/log', protect, logViolation);

module.exports = router;
