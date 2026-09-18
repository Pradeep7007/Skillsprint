import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import SkeletonLoader from '../components/SkeletonLoader';
import FormattedQuestion from '../components/FormattedQuestion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ResultPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/test/result/${id}`);
        if (response.data.success) {
          setData(response.data);
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        alert('Failed to load result. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <SkeletonLoader type="list" count={3} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Result not found.</h3>
        <Link className="btn btn-primary mt-3" to="/">Return to Dashboard</Link>
      </div>
    );
  }

  const { result, answers, violations } = data;

  // Chart Data: Correct vs Wrong
  const pieData = {
    labels: ['Correct', 'Incorrect / Skipped'],
    datasets: [
      {
        data: [result.correctAnswers, result.totalQuestions - result.correctAnswers],
        backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.85)'],
        borderColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data: Topic Accuracy
  const barData = {
    labels: result.topicAnalysis.map((t) => t.topic),
    datasets: [
      {
        label: 'Accuracy %',
        data: result.topicAnalysis.map((t) => t.accuracy),
        backgroundColor: result.topicAnalysis.map((t) => {
          if (t.accuracy < 50) return 'rgba(239, 68, 68, 0.8)';
          if (t.accuracy >= 50 && t.accuracy < 80) return 'rgba(245, 158, 11, 0.8)';
          return 'rgba(16, 185, 129, 0.8)';
        }),
        borderColor: result.topicAnalysis.map((t) => {
          if (t.accuracy < 50) return '#ef4444';
          if (t.accuracy >= 50 && t.accuracy < 80) return '#f59e0b';
          return '#10b981';
        }),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(128, 128, 128, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Categorize Topics for Suggestions Panel
  const weakTopics = result.suggestions.filter((s) => s.status === 'Weak');
  const averageTopics = result.suggestions.filter((s) => s.status === 'Average');
  const strongTopics = result.suggestions.filter((s) => s.status === 'Strong');

  return (
    <div className="container py-5">
      
      {/* 1. Header Banner */}
      <div className="card glass-card border p-4 p-md-5 mb-5 shadow-sm text-center" style={{ borderColor: 'var(--border-color)' }}>
        <h1 className="fw-extrabold mb-2" style={{ color: 'var(--accent-primary)' }}>Performance Summary</h1>
        <p className="text-muted fs-5 mb-4">Category: {result.category} Practice Test | Date: {new Date(result.date).toLocaleDateString()}</p>
        
        {/* Core Stats Row */}
        <div className="row g-4 justify-content-center">
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 bg-opacity-10 bg-primary" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-muted small fw-semibold text-uppercase">Score</div>
              <div className="stat-value">{result.score} / {result.totalQuestions}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 bg-opacity-10 bg-success" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-muted small fw-semibold text-uppercase">Percentage</div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>{result.percentage}%</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 bg-opacity-10 bg-info" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-muted small fw-semibold text-uppercase">Accuracy</div>
              <div className="stat-value text-info">{result.accuracy}%</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 border rounded-3 bg-opacity-10 bg-secondary" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-muted small fw-semibold text-uppercase">Time Taken</div>
              <div className="stat-value text-secondary" style={{ fontSize: '1.75rem', marginTop: '6px' }}>{formatTime(result.timeTaken)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card glass-card border p-4 h-100" style={{ borderColor: 'var(--border-color)' }}>
            <h5 className="fw-bold mb-4 text-center">Correct vs Wrong</h5>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '240px' }}>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="card glass-card border p-4 h-100" style={{ borderColor: 'var(--border-color)' }}>
            <h5 className="fw-bold mb-4">Topic Accuracy Breakdown</h5>
            <div style={{ height: '240px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Improvement Engine & Suggestions */}
      <div className="card glass-card border p-4 p-md-5 mb-5" style={{ borderColor: 'var(--border-color)' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-cpu text-primary me-2"></i>
          AI-Powered Improvement Engine
        </h4>

        <div className="row g-4">
          {/* Weak Topics */}
          {weakTopics.length > 0 && (
            <div className="col-12 col-md-4">
              <div className="card h-100 border-danger bg-danger-subtle bg-opacity-10 p-3 rounded-4">
                <h5 className="fw-bold text-danger d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  Weak Areas (&lt;50%)
                </h5>
                <div className="d-flex flex-column gap-3">
                  {weakTopics.map((item, idx) => (
                    <div key={idx} className="border-bottom border-danger border-opacity-10 pb-2">
                      <strong className="d-block text-danger">{item.topic}</strong>
                      <p className="text-secondary small mb-0">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Average Topics */}
          {averageTopics.length > 0 && (
            <div className="col-12 col-md-4">
              <div className="card h-100 border-warning bg-warning-subtle bg-opacity-10 p-3 rounded-4">
                <h5 className="fw-bold text-warning d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Average Areas (50%-80%)
                </h5>
                <div className="d-flex flex-column gap-3">
                  {averageTopics.map((item, idx) => (
                    <div key={idx} className="border-bottom border-warning border-opacity-10 pb-2">
                      <strong className="d-block text-warning">{item.topic}</strong>
                      <p className="text-secondary small mb-0">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Strong Topics */}
          {strongTopics.length > 0 && (
            <div className="col-12 col-md-4">
              <div className="card h-100 border-success bg-success-subtle bg-opacity-10 p-3 rounded-4">
                <h5 className="fw-bold text-success d-flex align-items-center mb-3">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Strong Areas (&gt;80%)
                </h5>
                <div className="d-flex flex-column gap-3">
                  {strongTopics.map((item, idx) => (
                    <div key={idx} className="border-bottom border-success border-opacity-10 pb-2">
                      <strong className="d-block text-success">{item.topic}</strong>
                      <p className="text-secondary small mb-0">{item.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Proctor Logs / Security Violations Section */}
      <div className="card glass-card border p-4 mb-5" style={{ borderColor: 'var(--border-color)' }}>
        <h5 className="fw-bold mb-3 d-flex align-items-center">
          <i className="bi bi-shield-shaded text-primary me-2"></i>
          Exam Security & Proctor Log
        </h5>
        {violations.length === 0 ? (
          <div className="text-success small fw-semibold">
            <i className="bi bi-shield-check me-2"></i>
            No security violations recorded. Excellent discipline!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm border align-middle small text-muted">
              <thead>
                <tr>
                  <th>Violation Type</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((violation, idx) => (
                  <tr key={idx}>
                    <td className="text-danger fw-semibold">{violation.type}</td>
                    <td>{violation.details}</td>
                    <td>{new Date(violation.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Detailed Review Toggle and Questionnaire */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <button className="btn btn-outline-secondary px-4" onClick={() => setShowReview(!showReview)}>
          <i className={`bi ${showReview ? 'bi-eye-slash-fill' : 'bi-eye-fill'} me-2`}></i>
          {showReview ? 'Hide Answers Review' : 'Review Questions and Answers'}
        </button>
        <div className="d-flex gap-2">
          <Link className="btn btn-success-custom px-4 fw-semibold" to={`/test/${result.category}`} style={{ backgroundColor: 'var(--color-success)', color: '#fff' }}>
            <i className="bi bi-arrow-repeat me-2"></i>
            Practice & Retake Test
          </Link>
          <Link className="btn btn-primary-custom px-4" to="/">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {showReview && (
        <div className="mt-4">
          <h4 className="fw-bold mb-4">Questions Answer Key Review</h4>
          <div className="d-flex flex-column gap-4">
            {answers.map((ans, idx) => {
              const q = ans.question;
              const isCorrect = ans.isCorrect;
              const isSkipped = ans.selectedAnswer === '';

              return (
                <div
                  key={idx}
                  className={`card glass-card p-4 border rounded-4 ${
                    isSkipped ? 'border-secondary' : isCorrect ? 'border-success bg-success-subtle bg-opacity-5' : 'border-danger bg-danger-subtle bg-opacity-5'
                  }`}
                  style={{ transition: 'none' }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <span className="badge bg-secondary me-2">Q. {idx + 1}</span>
                    <span className="badge bg-secondary-subtle text-secondary border me-2 text-capitalize">{q.difficulty}</span>
                    <span className="text-muted small ms-auto fw-bold">{q.topic}</span>
                  </div>

                  <div className="fw-semibold mb-3">
                    <FormattedQuestion text={q.question} />
                  </div>

                  {/* Options List */}
                  <div className="row g-2 mb-3">
                    {q.options.map((opt, oIdx) => {
                      const isCorrectOption = opt === q.correctAnswer;
                      const isSelectedOption = opt === ans.selectedAnswer;
                      
                      let optClass = 'border';
                      let badge = null;

                      if (isCorrectOption) {
                        optClass = 'border-success text-success bg-success bg-opacity-10 fw-bold';
                        badge = <span className="badge bg-success ms-auto">Correct Answer</span>;
                      } else if (isSelectedOption) {
                        optClass = 'border-danger text-danger bg-danger bg-opacity-10 fw-bold';
                        badge = <span className="badge bg-danger ms-auto">Your Answer</span>;
                      }

                      return (
                        <div key={oIdx} className="col-12">
                          <div className={`p-2.5 px-3 rounded d-flex align-items-center ${optClass}`}>
                            <span className="small">
                              <FormattedQuestion text={opt} isOption={true} />
                            </span>
                            {badge}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Indicator */}
                  <div className="mb-3">
                    {isSkipped ? (
                      <span className="text-secondary small fw-bold">
                        <i className="bi bi-dash-circle me-1"></i>
                        Skipped / Unanswered
                      </span>
                    ) : isCorrect ? (
                      <span className="text-success small fw-bold">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Correctly Answered
                      </span>
                    ) : (
                      <span className="text-danger small fw-bold">
                        <i className="bi bi-x-circle-fill me-1"></i>
                        Incorrectly Answered
                      </span>
                    )}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="p-3 rounded-3 mt-2" style={{ background: 'var(--bg-tertiary)', borderLeft: '3px solid var(--accent-primary)' }}>
                      <strong className="d-block small text-uppercase text-muted mb-1">Explanation:</strong>
                      <p className="small text-secondary mb-0">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
