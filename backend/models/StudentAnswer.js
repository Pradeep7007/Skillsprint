const mongoose = require('mongoose');

const StudentAnswerSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedAnswer: {
      type: String,
      default: '', // Empty means skipped
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentAnswer', StudentAnswerSchema, 'studentAnswers');
