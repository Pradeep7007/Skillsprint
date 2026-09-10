const Test = require('../models/Test');
const Question = require('../models/Question');
const StudentAnswer = require('../models/StudentAnswer');
const Violation = require('../models/Violation');

// Fisher-Yates Shuffle Utility
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Topic Recommendations Map for the Improvement Engine
const RECOMMENDATIONS = {
  // Aptitude
  'Number System': 'Study divisibility rules, remainder theorems, unit digits, and prime factorization.',
  'LCM': 'Practice finding LCM of fractions, decimal numbers, and application word problems.',
  'HCF': 'Understand HCF applications, finding HCF of fractions, and division methods.',
  'Percentage': 'Review fraction-to-percentage conversions and solve percentage increase/decrease word problems.',
  'Profit and Loss': 'Study cost price, selling price, profit/loss percentage, discount, and marked price relations.',
  'Ratio': 'Practice ratio proportions, partnership distributions, and mixture/allegation problems.',
  'Average': 'Study weighted average, average speed, and consecutive number properties.',
  'SI': 'Understand Simple Interest formulas and practice calculating rate, time, and principal.',
  'CI': 'Study Compound Interest formulas, annual vs half-yearly interest, and SI-CI difference.',
  'Time and Work': 'Practice efficiency-based work problems, pipe & cisterns, and alternate day tasks.',
  'Time and Distance': 'Study relative speed, train crossing problems, and boat & stream upstream/downstream formulas.',
  'Ages': 'Practice linear equations based on past, present, and future age relations.',

  // Logical
  'Blood Relation': 'Draw family trees using standard notation (squares for males, circles for females) to decode relations.',
  'Coding Decoding': 'Practice alphabet-to-number mapping, reverse-order lettering, and shift-based coding patterns.',
  'Seating Arrangement': 'Practice circular arrangements (facing center/outside) and linear layouts with multiple variables.',
  'Direction': 'Use compass direction drawings and practice pythagoras theorem calculations for distance.',
  'Series': 'Analyze number/alphabet differences, squares, cubes, and alternating pattern sequences.',
  'Puzzle': 'Practice floor-based, box-based, and day/month scheduling puzzles systematically using grids.',
  'Syllogism': 'Use Venn diagrams to verify conclusions and understand terms like "some", "all", "only a few", and "none".',
  'Analogy': 'Study relationships between word meanings, country capitals, numbers, and functional associations.',

  // Verbal
  'Synonyms': 'Read editorials, learn roots/prefixes/suffixes, and build a dictionary flashcard habit.',
  'Antonyms': 'Practice contextual antonym matching and vocabulary exercises.',
  'Grammar': 'Focus on subject-verb agreement, active/passive voice, direct/indirect speech, and prepositions.',
  'Reading': 'Practice skim-reading articles, identifying tone, and summarizing paragraphs under time pressure.',
  'Vocabulary': 'Learn 10 new words daily and use them in sentences to reinforce contextual retention.',
  'Error Spotting': 'Identify errors in subject-verb agreement, pronoun cases, double negatives, and modifiers.',
  'Sentence Completion': 'Practice fill-in-the-blank questions focusing on transitions and vocabulary context.',
  'Para Jumbles': 'Identify mandatory pairs, opening/closing sentences, and logical sequence connectors.',

  // Technical
  'Computer Networks': 'Review OSI layers, subnetting, TCP/IP flow control, routing algorithms, and HTTP vs HTTPS protocols.',
  'Operating Systems': 'Study Deadlocks (prevention, avoidance), CPU Scheduling algorithms, Paging, and Memory Management.',
  'DBMS': 'Practice database normalization (1NF-3NF, BCNF), SQL joins, indexes, transactions, and ACID properties.',
  'OOPS': 'Understand encapsulation, inheritance, polymorphism (overloading vs overriding), and abstract classes.',
  'Java': 'Study JVM architecture, garbage collection, multithreading, and collection framework structures.',
  'Data Structures': 'Implement binary tree traversals, stack/queue operations, and hash map collision resolution methods.',
  'Algorithms': 'Analyze sorting/searching time complexities, recursion, divide & conquer, and dynamic programming.',
  'Predict Output': 'Trace execution flow, check variable scopes, operator precedence, and loop edge cases.',
  'Code Debugging': 'Trace compiler errors, logic flaws, null pointer exceptions, and array out of bounds limits.',
  'Pseudocode': 'Understand code execution flow, loop conditions, and recursive function calls.'
};

// Default Recommendation for undefined topics
const DEFAULT_RECOMMENDATION = 'Review basic concepts, practice mock questions, and clarify doubts from online resources.';

// @desc    Start test and get 30 topic-balanced questions
// @route   POST /api/test/start
// @access  Private
exports.startTest = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please specify a test category',
      });
    }

    // Get all questions matching this category
    const allQuestions = await Question.find({ category });

    if (allQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for category: ${category}`,
      });
    }

    // Group questions by topic
    const questionsByTopic = {};
    allQuestions.forEach((q) => {
      if (!questionsByTopic[q.topic]) {
        questionsByTopic[q.topic] = [];
      }
      questionsByTopic[q.topic].push(q);
    });

    const topics = Object.keys(questionsByTopic);

    // Select exactly 30 questions maintaining balanced topic distribution
    const selectedQuestions = [];
    const targetCount = Math.min(30, allQuestions.length);

    // Deep clone and shuffle question pools inside each topic
    const topicPools = {};
    topics.forEach((topic) => {
      topicPools[topic] = shuffleArray(questionsByTopic[topic]);
    });

    let currentTopicIndex = 0;
    // Fisher-Yates shuffle the topics array to pick topics in random order
    let shuffledTopics = shuffleArray(topics);

    while (selectedQuestions.length < targetCount) {
      let addedInThisCycle = false;

      for (let i = 0; i < shuffledTopics.length; i++) {
        const topic = shuffledTopics[i];
        if (topicPools[topic] && topicPools[topic].length > 0) {
          selectedQuestions.push(topicPools[topic].pop());
          addedInThisCycle = true;
        }

        if (selectedQuestions.length === targetCount) {
          break;
        }
      }

      // If we cycled through all topics and added nothing, we must break to avoid infinite loop
      if (!addedInThisCycle) {
        break;
      }
    }

    // Final shuffle of the selected questions
    const finalQuestions = shuffleArray(selectedQuestions);

    // Map questions to response format, shuffling options, and removing correct answer / explanation
    const clientQuestions = finalQuestions.map((q, idx) => {
      // Shuffle options using Fisher-Yates
      const shuffledOptions = shuffleArray(q.options);

      return {
        _id: q._id,
        category: q.category,
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        options: shuffledOptions,
      };
    });

    res.status(200).json({
      success: true,
      category,
      count: clientQuestions.length,
      questions: clientQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit test answers and get immediate results & analytics
// @route   POST /api/test/submit
// @access  Private
exports.submitTest = async (req, res, next) => {
  try {
    const { category, answers, timeTaken, violationsCount } = req.body;

    // answers should be an array: [{ questionId, selectedAnswer }]
    if (!category || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide test category and answers',
      });
    }

    const totalQuestions = answers.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let answeredCount = 0;

    const evaluationResults = [];
    const topicStats = {};

    // Evaluate each answer
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      const question = await Question.findById(ans.questionId);

      if (!question) {
        continue;
      }

      const selected = ans.selectedAnswer ? ans.selectedAnswer.trim() : '';
      const correct = question.correctAnswer.trim();
      const isCorrect = selected === correct;
      const isSkipped = selected === '';

      if (!isSkipped) {
        answeredCount++;
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }

      // Initialize topicStats for topic evaluation
      if (!topicStats[question.topic]) {
        topicStats[question.topic] = {
          topic: question.topic,
          total: 0,
          correct: 0,
          wrong: 0,
        };
      }

      topicStats[question.topic].total++;
      if (!isSkipped) {
        if (isCorrect) {
          topicStats[question.topic].correct++;
        } else {
          topicStats[question.topic].wrong++;
        }
      } else {
        // Skipped counts as wrong in topic accuracy breakdown
        topicStats[question.topic].wrong++;
      }

      evaluationResults.push({
        questionId: question._id,
        selectedAnswer: selected,
        isCorrect: isCorrect && !isSkipped,
      });
    }

    // Calculations
    const score = correctAnswers;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const accuracy = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;

    // Compile Topic Analysis
    const topicAnalysis = Object.values(topicStats).map((t) => {
      const topicAccuracy = Math.round((t.correct / t.total) * 100);
      return {
        topic: t.topic,
        correct: t.correct,
        wrong: t.wrong,
        accuracy: topicAccuracy,
      };
    });

    // Compile Suggestions (Improvement Engine)
    const suggestions = topicAnalysis.map((t) => {
      let status = 'Strong';
      if (t.accuracy < 50) {
        status = 'Weak';
      } else if (t.accuracy >= 50 && t.accuracy < 80) {
        status = 'Average';
      }

      const rec = RECOMMENDATIONS[t.topic] || DEFAULT_RECOMMENDATION;

      return {
        topic: t.topic,
        status,
        recommendation: status === 'Strong' ? 'Excellent work! Keep maintaining your speed.' : rec,
      };
    });

    // Create Test Result Document
    const testResult = await Test.create({
      student: req.user.id,
      category,
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      percentage,
      timeTaken,
      violationsCount: violationsCount || 0,
      topicAnalysis,
      suggestions,
    });

    // Create individual StudentAnswer documents
    const studentAnswerDocs = evaluationResults.map((resItem) => ({
      test: testResult._id,
      student: req.user.id,
      question: resItem.questionId,
      selectedAnswer: resItem.selectedAnswer,
      isCorrect: resItem.isCorrect,
    }));

    await StudentAnswer.insertMany(studentAnswerDocs);

    // Update existing temporary violations logged for this user during this session to point to the saved Test ID
    await Violation.updateMany(
      { student: req.user.id, test: null },
      { $set: { test: testResult._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      testId: testResult._id,
      result: testResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result breakdown, questions & user answers by Test ID
// @route   GET /api/test/result/:id
// @access  Private
exports.getTestResult = async (req, res, next) => {
  try {
    const testResult = await Test.findById(req.params.id).populate('student', 'name email');

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: 'Test result not found',
      });
    }

    // Verify ownership
    if (testResult.student._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this result',
      });
    }

    // Get answers submitted for this test
    const studentAnswers = await StudentAnswer.find({ test: testResult._id })
      .populate('question', 'question options correctAnswer explanation category topic difficulty');

    // Get violation logs for this test
    const violations = await Violation.find({ test: testResult._id });

    res.status(200).json({
      success: true,
      result: testResult,
      answers: studentAnswers,
      violations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student test history
// @route   GET /api/test/history
// @access  Private
exports.getTestHistory = async (req, res, next) => {
  try {
    const history = await Test.find({ student: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};
