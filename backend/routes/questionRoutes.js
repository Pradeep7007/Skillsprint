const express = require('express');
const multer = require('multer');
const {
  getQuestions,
  getQuestion,
  addQuestion,
  editQuestion,
  deleteQuestion,
  uploadQuestionsJSON,
} = require('../controllers/questionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes under questions and restrict to Admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getQuestions)
  .post(addQuestion);

router.route('/:id')
  .get(getQuestion)
  .put(editQuestion)
  .delete(deleteQuestion);

router.post('/upload', upload.single('file'), uploadQuestionsJSON);

module.exports = router;
