const User = require('../models/User');
const Question = require('../models/Question');
const Test = require('../models/Test');
const Violation = require('../models/Violation');

// @desc    Get Admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const questionCount = await Question.countDocuments();
    const testCount = await Test.countDocuments();

    // Calculate Average Score
    const scoreStats = await Test.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$score' },
          avgPercentage: { $avg: '$percentage' },
        },
      },
    ]);

    const averagePercentage = scoreStats.length > 0 ? Math.round(scoreStats[0].avgPercentage) : 0;
    const averageScore = scoreStats.length > 0 ? Math.round(scoreStats[0].avgScore * 10) / 10 : 0;

    // Get Recent Test Attempts
    const recentTests = await Test.find()
      .populate('student', 'name email')
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        students: studentCount,
        questions: questionCount,
        tests: testCount,
        averagePercentage,
        averageScore,
      },
      recentTests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = { role: 'student' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student user & their related test history
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    if (student.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user',
      });
    }

    // Delete student
    await student.deleteOne();

    // Delete student's test records
    await Test.deleteMany({ student: req.params.id });

    // Delete student's violations
    await Violation.deleteMany({ student: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Student and related records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all test results (for admin view)
// @route   GET /api/admin/results
// @access  Private/Admin
exports.getAllResults = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const results = await Test.find(query)
      .populate('student', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Test.countDocuments(query);

    res.status(200).json({
      success: true,
      count: results.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proctoring violations
// @route   GET /api/admin/violations
// @access  Private/Admin
exports.getAllViolations = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const violations = await Violation.find()
      .populate('student', 'name email')
      .populate('test', 'category date score')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Violation.countDocuments();

    res.status(200).json({
      success: true,
      count: violations.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      violations,
    });
  } catch (error) {
    next(error);
  }
};
