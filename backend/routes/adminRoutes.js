const express = require('express');
const {
  getStats,
  getStudents,
  deleteStudent,
  getAllResults,
  getAllViolations,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes here require login and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);
router.get('/results', getAllResults);
router.get('/violations', getAllViolations);

module.exports = router;
