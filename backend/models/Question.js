const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Aptitude', 'Logical', 'Verbal', 'Technical'],
    },
    topic: {
      type: String,
      required: [true, 'Please add a topic'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Please add difficulty level'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    question: {
      type: String,
      required: [true, 'Please add a question text'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Please add exactly 4 options'],
      validate: {
        validator: function (val) {
          return val.length === 4;
        },
        message: 'A question must have exactly 4 options',
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Please specify the correct answer'],
      trim: true,
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema, 'questions');
