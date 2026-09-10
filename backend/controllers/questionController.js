const Question = require('../models/Question');

// @desc    Get all questions with filtering, searching, and pagination
// @route   GET /api/questions
// @access  Private/Admin
exports.getQuestions = async (req, res, next) => {
  try {
    const { category, topic, difficulty, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (topic) {
      query.topic = topic;
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Apply search filter (match question text or topic)
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortObj = {};
    sortObj[sortBy] = order === 'asc' ? 1 : -1;

    // Fetch questions and total count
    const questions = await Question.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Question.countDocuments(query);

    // Get unique categories and topics for filter dropdowns
    const categories = await Question.distinct('category');
    const topics = await Question.distinct('topic');

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      categories,
      topics,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single question
// @route   GET /api/questions/:id
// @access  Private/Admin
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: `Question not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new question
// @route   POST /api/questions
// @access  Private/Admin
exports.addQuestion = async (req, res, next) => {
  try {
    const { category, topic, difficulty, question, options, correctAnswer, explanation } = req.body;

    // Validate request body
    if (!category || !topic || !difficulty || !question || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Save to DB
    const newQuestion = await Question.create({
      category,
      topic,
      difficulty,
      question,
      options,
      correctAnswer,
      explanation,
    });

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: newQuestion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
exports.editQuestion = async (req, res, next) => {
  try {
    let questionObj = await Question.findById(req.params.id);

    if (!questionObj) {
      return res.status(404).json({
        success: false,
        message: `Question not found with id of ${req.params.id}`,
      });
    }

    questionObj = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: questionObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const questionObj = await Question.findById(req.params.id);

    if (!questionObj) {
      return res.status(404).json({
        success: false,
        message: `Question not found with id of ${req.params.id}`,
      });
    }

    await questionObj.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload JSON file of questions
// @route   POST /api/questions/upload
// @access  Private/Admin
exports.uploadQuestionsJSON = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a JSON file',
      });
    }

    let questionsArray;
    try {
      const fileContent = req.file.buffer.toString();
      questionsArray = JSON.parse(fileContent);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON file format',
      });
    }

    if (!Array.isArray(questionsArray)) {
      return res.status(400).json({
        success: false,
        message: 'JSON file must contain an array of questions',
      });
    }

    // Validate the questions format
    for (let i = 0; i < questionsArray.length; i++) {
      const q = questionsArray[i];
      if (
        !q.category ||
        !q.topic ||
        !q.difficulty ||
        !q.question ||
        !q.options ||
        !q.correctAnswer
      ) {
        return res.status(400).json({
          success: false,
          message: `Question at index ${i} is missing required fields (category, topic, difficulty, question, options, correctAnswer)`,
        });
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: `Question at index ${i} must have exactly 4 options`,
        });
      }
    }

    // Bulk insert
    const inserted = await Question.insertMany(questionsArray);

    res.status(201).json({
      success: true,
      message: `${inserted.length} questions imported successfully`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
