import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useProctor } from '../hooks/useProctor';
import Timer from '../components/Timer';
import CameraPreview from '../components/CameraPreview';
import SkeletonLoader from '../components/SkeletonLoader';

const TestPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
        alert('Failed to start test. Please check database configuration or try again.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, navigate]);

  // Handle proctor violation warnings
  const handleViolation = (type, details, count) => {
    setWarningCount(count);
    setWarningMessage(`WARNING: Proctor Violation Detected! Type: ${type}. Reason: ${details}. (Warning ${count}/3)`);

    // Auto clear warning message after 6 seconds
    setTimeout(() => {
      setWarningMessage('');
    }, 6000);
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

  // Callback when proctor hook triggers auto-submit
  const handleAutoSubmit = () => {
    setWarningMessage('CRITICAL: 3 Proctoring violations reached. Submitting test automatically...');
    setTimeout(() => {
      handleTestSubmit();
    }, 1500);
  };

  // Hook activation
  const { violationsCount, enterFullscreen } = useProctor({
    active: proctorActive,
    onViolation: handleViolation,
    onAutoSubmit: handleAutoSubmit,
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
    // Set status of previous index
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
    const qId = questions[idx]._id;
    setQuestionStatuses((prev) => {
      // If it has a saved answer, it must be 'answered'
      if (selectedAnswers[qId]) {
        return { ...prev, [qId]: 'answered' };
      }
      // If it is marked, preserve 'marked'
      if (prev[qId] === 'marked') {
        return prev[qId];
      }
      // Otherwise, it was visited but not answered
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
      // If cleared, remove from answers
      const newAnswers = { ...selectedAnswers };
      delete newAnswers[qId];
      setSelectedAnswers(newAnswers);
      setQuestionStatuses((prev) => ({ ...prev, [qId]: 'visited' }));
    }

    if (currentIdx < questions.length - 1) {
      handleQuestionSelect(currentIdx + 1);
    } else {
      // Last question, trigger submit confirmation modal
      const submitBtn = document.getElementById('confirmSubmitBtn');
      if (submitBtn) submitBtn.click();
    }
  };

  const handleMarkForReview = () => {
    const qId = questions[currentIdx]._id;

    // Save temporary selection even if it was marked
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

  // Initial Fullscreen Mode Request Prompt
  if (showFsPrompt) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
        <div className="card glass-card p-5 border text-center w-100" style={{ maxWidth: '600px', borderColor: 'var(--border-color)' }}>
          <i className="bi bi-shield-fill-check text-success fs-1 mb-3"></i>
          <h2 className="fw-bold mb-3">Ready to Start Test?</h2>
          <p className="text-muted mb-4">
            Clicking the button below will configure proctoring controls, activate camera streams, and launch the mandatory fullscreen test player.
          </p>
          <div className="alert alert-danger border-0 p-3 mb-4 text-start small" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
            Make sure your webcam is plugged in and you have granted browser camera permissions before launching the test.
          </div>
          <button className="btn btn-primary-custom w-100 py-3 fs-5" onClick={handleStartExam}>
            Launch Fullscreen Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercentage = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="container-fluid py-4 px-md-4" style={{ userSelect: 'none' }}>
      
      {/* Proctor Warning Banner */}
      {warningMessage && (
        <div className="alert alert-danger border-0 py-3 px-4 mb-4 d-flex align-items-center animate-pulse" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.95)', color: '#fff', position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, borderRadius: '8px', maxWidth: '90%', width: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <i className="bi bi-exclamation-triangle-fill me-3 fs-3"></i>
          <div>
            <strong>PROCTOR WARNING:</strong> {warningMessage}
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Panel: Examination Engine */}
        <div className="col-12 col-lg-9">
          <div className="card glass-card border h-100 d-flex flex-column" style={{ borderColor: 'var(--border-color)' }}>
            {/* Header: Test details, category and Timer */}
            <div className="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h4 className="fw-bold mb-1 text-capitalize">{category} Practice Test</h4>
                <span className="badge bg-primary-subtle text-primary border">Standard Assessment</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small fw-semibold">Time Remaining:</span>
                <Timer initialSeconds={1800} onTimeUp={handleTestSubmit} />
              </div>
            </div>

            {/* Exam Content Body */}
            <div className="card-body p-4 flex-grow-1">
              {/* Progress Bar */}
              <div className="d-flex justify-content-between align-items-center mb-2 small fw-semibold text-muted">
                <span>Progress: {currentIdx + 1} of {questions.length} Questions</span>
                <span>{progressPercentage}% Completed</span>
              </div>
              <div className="progress mb-4" style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%`, backgroundColor: 'var(--accent-primary)', transition: 'width 0.4s ease' }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              {/* Question Card */}
              <div className="p-4 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                <div className="d-flex align-items-center mb-3">
                  <span className="badge bg-secondary px-3 py-2 fs-6 rounded-3">Question {currentIdx + 1}</span>
                  <span className="badge bg-secondary-subtle text-secondary ms-2 border text-capitalize">{currentQuestion.difficulty}</span>
                  <span className="text-muted small ms-auto fw-bold">{currentQuestion.topic}</span>
                </div>
                <h4 className="fw-semibold mb-0" style={{ lineHeight: '1.5' }}>
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options Radio buttons */}
              <div className="d-flex flex-column gap-3 mb-4">
                {currentQuestion.options.map((option, oIdx) => {
                  const isChecked = tempOption === option;
                  return (
                    <div
                      key={oIdx}
                      className="form-check p-3 border rounded-3 d-flex align-items-center option-wrapper"
                      style={{
                        borderColor: isChecked ? 'var(--accent-primary)' : 'var(--border-color)',
                        backgroundColor: isChecked ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                      onClick={() => handleOptionChange(option)}
                    >
                      <input
                        className="form-check-input ms-0 me-3 mt-0"
                        type="radio"
                        name="examOptions"
                        id={`option-${oIdx}`}
                        value={option}
                        checked={isChecked}
                        onChange={() => handleOptionChange(option)}
                        style={{ width: '1.25em', height: '1.25em', cursor: 'pointer' }}
                      />
                      <label className="form-check-label w-100 fw-semibold text-secondary" htmlFor={`option-${oIdx}`} style={{ cursor: 'pointer' }}>
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation Buttons */}
            <div className="card-footer bg-transparent border-top p-4 d-flex justify-content-between flex-wrap gap-2">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary px-4 py-2"
                  disabled={currentIdx === 0}
                  onClick={() => handleQuestionSelect(currentIdx - 1)}
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Previous
                </button>
                <button className="btn btn-outline-warning px-4 py-2" onClick={handleMarkForReview}>
                  <i className="bi bi-bookmark-fill me-1"></i>
                  Mark for Review
                </button>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-danger px-4 py-2" onClick={handleClearResponse}>
                  Clear Response
                </button>
                <button className="btn btn-primary-custom px-5 py-2" onClick={handleSaveAndNext}>
                  {currentIdx < questions.length - 1 ? 'Save & Next' : 'Save & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Proctoring Camera & Question Palette */}
        <div className="col-12 col-lg-3">
          <div className="d-flex flex-column gap-4 h-100">
            
            {/* 1. Camera Proctoring Component */}
            <CameraPreview onCameraError={handleViolation} />

            {/* 2. Security Violations Counter Card */}
            <div className="card glass-card border shadow-sm p-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small fw-bold text-uppercase text-muted">Violation Warnings:</span>
                <span className={`badge fs-6 rounded-pill ${warningCount > 0 ? 'bg-danger animate-pulse' : 'bg-success'}`}>
                  {warningCount} / 3
                </span>
              </div>
            </div>

            {/* 3. Question Palette Navigation Panel */}
            <div className="card glass-card border shadow-sm p-4 flex-grow-1" style={{ borderColor: 'var(--border-color)' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2">Question Palette</h5>

              {/* Status Indicators */}
              <div className="row g-2 mb-4 small fw-semibold text-muted">
                <div className="col-6 d-flex align-items-center">
                  <span className="palette-btn answered me-2 bg-success text-white" style={{ width: '18px', height: '18px' }}></span>
                  <span>Answered</span>
                </div>
                <div className="col-6 d-flex align-items-center">
                  <span className="palette-btn marked me-2 bg-warning text-white" style={{ width: '18px', height: '18px' }}></span>
                  <span>Review</span>
                </div>
                <div className="col-6 d-flex align-items-center">
                  <span className="palette-btn not-answered me-2 bg-danger text-white" style={{ width: '18px', height: '18px' }}></span>
                  <span>Visited</span>
                </div>
                <div className="col-6 d-flex align-items-center">
                  <span className="palette-btn unvisited me-2 bg-secondary text-white" style={{ width: '18px', height: '18px' }}></span>
                  <span>Unvisited</span>
                </div>
              </div>

              {/* Palette Buttons Grid */}
              <div className="d-flex flex-wrap gap-2 overflow-y-auto mb-4" style={{ maxHeight: '250px' }}>
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
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Final Submit Button */}
              <button
                id="confirmSubmitBtn"
                className="btn btn-danger w-100 py-3 fw-bold mt-auto"
                data-bs-toggle="modal"
                data-bs-target="#submitConfirmModal"
              >
                Submit Exam
              </button>
            </div>

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
                style={{ filter: 'var(--text-primary)' === '#f9fafb' ? 'invert(1)' : 'none' }}
              ></button>
            </div>
            <div className="modal-body p-4 text-center">
              <i className="bi bi-question-circle text-primary fs-1 mb-3"></i>
              <h4 className="fw-bold mb-2">Are you sure you want to submit?</h4>
              <p className="text-secondary mb-4">
                You have answered <strong>{Object.keys(selectedAnswers).length}</strong> out of <strong>{questions.length}</strong> questions. Once submitted, you cannot modify your answers.
              </p>
              <div className="row g-2">
                <div className="col-6">
                  <button type="button" className="btn btn-outline-secondary w-100 py-2.5" data-bs-dismiss="modal">
                    Resume Test
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-primary-custom w-100 py-2.5"
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
