const Violation = require('../models/Violation');

// @desc    Log a proctoring violation warning
// @route   POST /api/proctor/log
// @access  Private
exports.logViolation = async (req, res, next) => {
  try {
    const { type, details } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Please specify violation type',
      });
    }

    const violation = await Violation.create({
      student: req.user.id,
      type,
      details: details || '',
    });

    res.status(201).json({
      success: true,
      message: 'Violation warning logged successfully',
      data: violation,
    });
  } catch (error) {
    next(error);
  }
};
