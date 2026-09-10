const express = require('express');
const {
  startTest,
  submitTest,
  getTestResult,
  getTestHistory,
} = require('../controllers/testController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/start', startTest);
router.post('/submit', submitTest);
router.get('/result/:id', getTestResult);
router.get('/history', getTestHistory);

module.exports = router;
