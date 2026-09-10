const mongoose = require('mongoose');

const TopicAnalysisSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  correct: {
    type: Number,
    required: true,
    default: 0
  },
  wrong: {
    type: Number,
    required: true,
    default: 0
  },
  accuracy: {
    type: Number,
    required: true,
    default: 0
  }
});

const SuggestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true
  },
  status: {
    type: String, // 'Weak', 'Average', 'Strong'
    required: true
  },
  recommendation: {
    type: String,
    required: true
  }
});

const TestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify the test category'],
      enum: ['Aptitude', 'Logical', 'Verbal', 'Technical'],
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 30,
    },
    correctAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    accuracy: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
    violationsCount: {
      type: Number,
      default: 0,
    },
    topicAnalysis: [TopicAnalysisSchema],
    suggestions: [SuggestionSchema],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Test', TestSchema, 'tests');
