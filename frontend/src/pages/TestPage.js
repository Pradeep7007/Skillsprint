import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useProctor } from '../hooks/useProctor';
import Timer from '../components/Timer';
import SkeletonLoader from '../components/SkeletonLoader';
import FormattedQuestion from '../components/FormattedQuestion';

const TestPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Exam stats & answer states
  // answers: { questionId: selectedOptionText }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // statuses: { questionId: 'answered' | 'marked' | 'visited' | 'unvisited' }
  const [questionStatuses, setQuestionStatuses] = useState({});
  const [tempOption, setTempOption] = useState(''); // Holds current selection before saving

  // Proctor warnings & proctor active flag
  const [proctorActive, setProctorActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [warningCount, setWarningCount] = useState(0);
  const [showFsPrompt, setShowFsPrompt] = useState(true); // Ask student to launch fullscreen

  const submitInProgress = useRef(false);
  const startTime = useRef(Date.now());

  // Fetch test questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/test/start', { category });
        if (response.data.success) {
          const fetchedQs = response.data.questions;
          setQuestions(fetchedQs);

          // Initialize statuses
          const initialStatuses = {};
          fetchedQs.forEach((q, idx) => {
            initialStatuses[q._id] = idx === 0 ? 'visited' : 'unvisited';
          });
          setQuestionStatuses(initialStatuses);
        }
      } catch (err) {
        console.error('Error starting test:', err);
        const message = err.response?.data?.message || 'Failed to start test. Please check database configuration or try again.';
        alert(message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, navigate]);

  // Handle proctor violation warnings (no auto-submit limit)
  const handleViolation = (type, details, count) => {
    setWarningCount(count);
    setWarningMessage(`Proctor Notice: ${type} - ${details}`);

    // Auto clear warning message after 5 seconds
    setTimeout(() => {
      setWarningMessage('');
    }, 5000);
  };

  // Submit test to API
  const handleTestSubmit = async () => {
    if (submitInProgress.current) return;
    submitInProgress.current = true;

    // Exit fullscreen if active
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn('Fullscreen exit promise rejected:', err));
      }
    } catch (e) {
      console.warn('Fullscreen exit failed:', e);
    }

    const timeTaken = Math.round((Date.now() - startTime.current) / 1000); // in seconds

    // Compile answers array matching backend expectations
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: selectedAnswers[q._id] || '',
    }));

    try {
      const response = await axios.post('/test/submit', {
        category,
        answers: formattedAnswers,
        timeTaken,
        violationsCount: warningCount,
      });

      if (response.data.success) {
        navigate(`/result/${response.data.testId}`);
      }
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Error submitting answers. Attempting emergency redirect...');
      navigate('/');
    }
  };

  // Hook activation without auto-submit constraint
  const { enterFullscreen } = useProctor({
    active: proctorActive,
    onViolation: handleViolation,
  });

  // Launch Fullscreen Exam
  const handleStartExam = () => {
    setShowFsPrompt(false);
    setProctorActive(true);
    enterFullscreen();
    startTime.current = Date.now();
  };

  // Navigation handlers
  const handleQuestionSelect = (idx) => {
    updateStatusForCurrent(currentIdx);
    
    setCurrentIdx(idx);
    const qId = questions[idx]._id;
    setTempOption(selectedAnswers[qId] || '');

    setQuestionStatuses((prev) => ({
      ...prev,
      [qId]: prev[qId] === 'unvisited' ? 'visited' : prev[qId],
    }));
  };

  const updateStatusForCurrent = (idx) => {
    if (!questions[idx]) return;
    const qId = questions[idx]._id;
    setQuestionStatuses((prev) => {
      if (selectedAnswers[qId]) {
        return { ...prev, [qId]: 'answered' };
      }
      if (prev[qId] === 'marked') {
        return prev[qId];
      }
      return { ...prev, [qId]: 'visited' };
    });
  };

  const handleOptionChange = (option) => {
    setTempOption(option);
  };

  const handleSaveAndNext = () => {
    const qId = questions[currentIdx]._id;

    // Save option
    if (tempOption) {
      setSelectedAnswers((prev) => ({ ...prev, [qId]: tempOption }));
      setQuestionStatuses((prev) => ({ ...prev, [qId]: 'answered' }));
    } else {
      const newAnswers = { ...selectedAnswers };
      delete newAnswers[qId];
      setSelectedAnswers(newAnswers);
      setQuestionStatuses((prev) => ({ ...prev, [qId]: 'visited' }));
    }

    if (currentIdx < questions.length - 1) {
      handleQuestionSelect(currentIdx + 1);
    } else {
      const submitBtn = document.getElementById('confirmSubmitBtn');
      if (submitBtn) submitBtn.click();
    }
  };

  const handleMarkForReview = () => {
    const qId = questions[currentIdx]._id;

    if (tempOption) {
      setSelectedAnswers((prev) => ({ ...prev, [qId]: tempOption }));
    }

    setQuestionStatuses((prev) => ({ ...prev, [qId]: 'marked' }));

    if (currentIdx < questions.length - 1) {
      handleQuestionSelect(currentIdx + 1);
    }
  };

  const handleClearResponse = () => {
    setTempOption('');
    const qId = questions[currentIdx]._id;
    const newAnswers = { ...selectedAnswers };
    delete newAnswers[qId];
    setSelectedAnswers(newAnswers);
    setQuestionStatuses((prev) => ({ ...prev, [qId]: 'visited' }));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="card glass-card p-5 border text-center" style={{ borderColor: 'var(--border-color)' }}>
          <h4 className="fw-bold mb-4">Generating secure test environment...</h4>
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  // Initial Fullscreen Mode Request Prompt (no camera check)
  if (showFsPrompt) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
        <div className="card glass-card p-4 p-md-5 border text-center w-100 shadow-sm" style={{ maxWidth: '580px', borderColor: 'var(--border-color)' }}>
          <div className="mb-3">
            <i className="bi bi-shield-check text-primary" style={{ fontSize: '3rem' }}></i>
          </div>
          <h2 className="fw-bold mb-2">Ready to Start Test?</h2>
          <p className="text-secondary mb-4 small">
            Clicking the button below will configure test controls and launch the assessment in secure fullscreen mode.
          </p>

          <div className="p-3 rounded-3 mb-4 text-start small border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <div className="fw-semibold mb-1 text-primary d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-2"></i> Assessment Details:
            </div>
            <ul className="list-unstyled mb-0 ps-3 text-secondary" style={{ fontSize: '0.85rem' }}>
              <li>• <strong>Subject:</strong> <span className="text-capitalize">{category}</span></li>
              <li>• <strong>Total Questions:</strong> {questions.length}</li>
              <li>• <strong>Duration:</strong> 30 Minutes</li>
              <li>• <strong>Policy:</strong> Tab switches and fullscreen exits are strictly logged</li>
            </ul>
          </div>

          <button className="btn btn-primary-custom w-100 py-2.5 fs-6 fw-semibold" onClick={handleStartExam}>
            Launch Fullscreen Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercentage = Math.round(((currentIdx + 1) / questions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="exam-viewport">
      
      {/* Proctor Warning Toast */}
      {warningMessage && (
        <div
          className="alert alert-danger border-0 py-2.5 px-3 mb-0 d-flex align-items-center"
          role="alert"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.96)',
            color: '#fff',
            position: 'fixed',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            borderRadius: '8px',
            maxWidth: '90%',
            width: '540px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            fontSize: '0.875rem'
          }}
        >
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div className="flex-grow-1">
            <strong>SECURITY WARNING:</strong> {warningMessage}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            style={{ fontSize: '0.65rem' }}
            onClick={() => setWarningMessage('')}
          ></button>
        </div>
      )}

      {/* Sleek Top Exam Bar */}
      <header className="exam-topbar">
        {/* Left: Test Category Title & Tag */}
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock-fill text-primary fs-5"></i>
          <span className="fw-bold text-capitalize text-truncate" style={{ maxWidth: '240px' }}>
            {category} Assessment
          </span>
          <span className="badge bg-primary-subtle text-primary border d-none d-sm-inline-block small">
            Standard
          </span>
        </div>

        {/* Center: Question Progress */}
        <div className="d-none d-md-flex align-items-center gap-3">
          <span className="small text-muted fw-semibold">
            Q {currentIdx + 1} of {questions.length} ({progressPercentage}%)
          </span>
          <div className="progress" style={{ width: '130px', height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-tertiary)' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progressPercentage}%`, backgroundColor: 'var(--accent-primary)', transition: 'width 0.3s ease' }}
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Right: Violations, Theme Toggle & Countdown Timer */}
        <div className="d-flex align-items-center gap-2">
          {/* Violations Badge */}
          <span
            className={`badge d-flex align-items-center py-1.5 px-2.5 ${
              warningCount > 0
                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                : 'bg-success-subtle text-success border border-success-subtle'
            }`}
            style={{ fontSize: '0.775rem' }}
            title="Integrity Violations Logged"
          >
            <i className={`bi ${warningCount > 0 ? 'bi-exclamation-octagon-fill' : 'bi-shield-check'} me-1`}></i>
            Violations: {warningCount}
          </span>

          {/* Theme Switcher */}
          <button
            className="btn btn-sm border d-flex align-items-center justify-content-center p-1 rounded-circle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--bg-tertiary)',
            }}
          >
            {theme === 'dark' ? (
              <i className="bi bi-sun-fill text-warning" style={{ fontSize: '0.85rem' }}></i>
            ) : (
              <i className="bi bi-moon-stars-fill text-primary" style={{ fontSize: '0.85rem' }}></i>
            )}
          </button>

          {/* Timer Display */}
          <div className="d-flex align-items-center ms-1">
            <Timer initialSeconds={1800} onTimeUp={handleTestSubmit} />
          </div>
        </div>
      </header>

      {/* Main Examination Viewport Body (Fits 100% into remaining height, no page scroll) */}
      <div className="exam-content-area">
        
        {/* Left Column: Examination Engine */}
        <div className="exam-question-column glass-card border">
          
          {/* Question Metadata Header */}
          <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary px-2.5 py-1 text-white fw-bold" style={{ fontSize: '0.8rem' }}>
                Question {currentIdx + 1}
              </span>
              <span className="badge bg-secondary-subtle text-secondary border text-capitalize" style={{ fontSize: '0.75rem' }}>
                {currentQuestion?.difficulty || 'Standard'}
              </span>
            </div>
            <span className="text-muted small fw-semibold text-truncate ms-2" style={{ maxWidth: '280px' }}>
              <i className="bi bi-tag-fill me-1 text-primary small"></i>
              {currentQuestion?.topic}
            </span>
          </div>

          {/* Scrollable Question & Options Body (Only this container scrolls if content is large) */}
          <div className="exam-question-body">
            
            {/* Question Statement Box */}
            <div className="p-3 rounded-3 border mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <div className="fw-semibold mb-0" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                <FormattedQuestion text={currentQuestion?.question} />
              </div>
            </div>

            {/* Answer Options */}
            <div className="d-flex flex-column">
              {currentQuestion?.options.map((option, oIdx) => {
                const isChecked = tempOption === option;
                return (
                  <div
                    key={oIdx}
                    className={`exam-option-item ${isChecked ? 'selected' : ''}`}
                    onClick={() => handleOptionChange(option)}
                  >
                    <input
                      className="form-check-input ms-0 me-3 mt-0 flex-shrink-0"
                      type="radio"
                      name="examOptions"
                      id={`option-${oIdx}`}
                      value={option}
                      checked={isChecked}
                      onChange={() => handleOptionChange(option)}
                      style={{ width: '1.15em', height: '1.15em', cursor: 'pointer' }}
                    />
                    <label
                      className="form-check-label w-100 fw-medium mb-0"
                      htmlFor={`option-${oIdx}`}
                      style={{ cursor: 'pointer', fontSize: '0.925rem', color: isChecked ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                    >
                      <FormattedQuestion text={option} isOption={true} />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer (Always pinned at the bottom of the question card) */}
          <div className="exam-footer-bar">
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary px-3 py-1.5 fw-medium"
                disabled={currentIdx === 0}
                onClick={() => handleQuestionSelect(currentIdx - 1)}
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-warning px-3 py-1.5 fw-medium"
                onClick={handleMarkForReview}
              >
                <i className="bi bi-bookmark-fill me-1"></i>
                Mark for Review
              </button>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-danger px-3 py-1.5 fw-medium"
                onClick={handleClearResponse}
              >
                Clear Response
              </button>
              <button
                className="btn btn-sm btn-primary-custom px-4 py-1.5 fw-semibold"
                onClick={handleSaveAndNext}
              >
                {currentIdx < questions.length - 1 ? (
                  <>
                    Save & Next <i className="bi bi-chevron-right ms-1"></i>
                  </>
                ) : (
                  'Save & Review'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Submit Action */}
        <div className="exam-sidebar-column glass-card border">
          
          {/* Palette Header */}
          <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <span className="fw-bold small">Question Palette</span>
            <span className="badge bg-secondary-subtle text-secondary small">
              {answeredCount}/{questions.length} Solved
            </span>
          </div>

          {/* Compact Status Legend */}
          <div className="p-2 border-bottom flex-shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)', fontSize: '0.725rem' }}>
            <div className="row g-1 text-muted fw-semibold">
              <div className="col-6 d-flex align-items-center">
                <span className="palette-btn answered me-1.5" style={{ width: '13px', height: '13px', minWidth: '13px' }}></span>
                <span>Answered</span>
              </div>
              <div className="col-6 d-flex align-items-center">
                <span className="palette-btn marked me-1.5" style={{ width: '13px', height: '13px', minWidth: '13px' }}></span>
                <span>Review</span>
              </div>
              <div className="col-6 d-flex align-items-center">
                <span className="palette-btn not-answered me-1.5" style={{ width: '13px', height: '13px', minWidth: '13px' }}></span>
                <span>Visited</span>
              </div>
              <div className="col-6 d-flex align-items-center">
                <span className="palette-btn unvisited me-1.5" style={{ width: '13px', height: '13px', minWidth: '13px' }}></span>
                <span>Unvisited</span>
              </div>
            </div>
          </div>

          {/* Palette Buttons Grid (Scrolls only if questions overflow) */}
          <div className="exam-palette-scroll p-2">
            <div className="exam-palette-grid">
              {questions.map((q, idx) => {
                const qId = q._id;
                let statusClass = 'unvisited';
                
                if (idx === currentIdx) {
                  statusClass = 'current';
                } else {
                  const status = questionStatuses[qId];
                  if (status === 'answered') statusClass = 'answered';
                  else if (status === 'marked') statusClass = 'marked';
                  else if (status === 'visited') statusClass = 'not-answered';
                }

                return (
                  <button
                    key={qId}
                    className={`palette-btn ${statusClass}`}
                    onClick={() => handleQuestionSelect(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Pinned Submit Section (Always visible without scrolling) */}
          <div className="p-2.5 border-top flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <button
              id="confirmSubmitBtn"
              className="btn btn-danger w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              data-bs-toggle="modal"
              data-bs-target="#submitConfirmModal"
              style={{ fontSize: '0.9rem' }}
            >
              <i className="bi bi-send-check-fill"></i>
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal prior to Submit */}
      <div className="modal fade" id="submitConfirmModal" tabIndex="-1" aria-labelledby="submitConfirmModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-card border-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <div className="modal-header border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <h5 className="modal-title fw-bold" id="submitConfirmModalLabel">Confirm Submission</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}
              ></button>
            </div>
            <div className="modal-body p-4 text-center">
              <i className="bi bi-question-circle text-primary fs-1 mb-3"></i>
              <h4 className="fw-bold mb-2">Are you sure you want to submit?</h4>
              <p className="text-secondary mb-4 small">
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions. Once submitted, your score will be computed instantly.
              </p>
              <div className="row g-2">
                <div className="col-6">
                  <button type="button" className="btn btn-outline-secondary w-100 py-2 fw-semibold" data-bs-dismiss="modal">
                    Resume Test
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-primary-custom w-100 py-2 fw-semibold"
                    data-bs-dismiss="modal"
                    onClick={handleTestSubmit}
                  >
                    Yes, Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
