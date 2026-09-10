const mongoose = require('mongoose');

const ViolationSchema = new mongoose.Schema(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      default: null, // Can be null if log happens outside of a completed test submission
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Fullscreen Exit', 'Tab Switch', 'DevTools Detected', 'Camera Disabled', 'Right Click / Copy / Paste Attempt'],
    },
    details: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Violation', ViolationSchema, 'violations');
