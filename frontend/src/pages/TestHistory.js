import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';

const TestHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/test/history');
        if (response.data.success) {
          setHistory(response.data.history);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <SkeletonLoader type="list" count={4} />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card glass-card p-4 p-md-5 border mb-5 shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="fw-bold mb-2">
          <i className="bi bi-clock-history text-primary me-2"></i>
          Test Attempt History
        </h2>
        <p className="text-muted mb-0">Track all your past quantitative, reasoning, verbal, and technical MCQs test performances.</p>
      </div>

      {history.length === 0 ? (
        <div className="card glass-card text-center p-5 border" style={{ borderColor: 'var(--border-color)' }}>
          <i className="bi bi-folder-x text-muted fs-1 mb-3"></i>
          <h4 className="fw-semibold">No tests attempted yet</h4>
          <p className="text-muted mb-4">Go to the dashboard and take a practice test to see your score analysis here.</p>
          <Link className="btn btn-primary-custom px-4 py-2" to="/">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="card glass-card border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-primary)' }}>
              <thead>
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="py-3">Category</th>
                  <th className="py-3 text-center">Score</th>
                  <th className="py-3 text-center">Percentage</th>
                  <th className="py-3 text-center">Accuracy</th>
                  <th className="py-3">Weak Topics</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((test) => {
                  // Get weak topics (accuracy < 50%)
                  const weakTopics = test.topicAnalysis
                    .filter((t) => t.accuracy < 50)
                    .map((t) => t.topic);

                  return (
                    <tr key={test._id} style={{ borderColor: 'var(--border-color)', borderBottomWidth: '1px' }}>
                      <td className="px-4 py-3 text-nowrap">
                        {new Date(test.date).toLocaleDateString()}
                        <span className="d-block small text-muted">
                          {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3 fw-semibold text-capitalize">{test.category}</td>
                      <td className="py-3 text-center fw-bold">
                        {test.score} / {test.totalQuestions}
                      </td>
                      <td className="py-3 text-center text-success fw-bold">{test.percentage}%</td>
                      <td className="py-3 text-center text-info fw-bold">{test.accuracy}%</td>
                      <td className="py-3">
                        {weakTopics.length === 0 ? (
                          <span className="badge bg-success-subtle text-success border">None! Great job</span>
                        ) : (
                          <div className="d-flex flex-wrap gap-1">
                            {weakTopics.map((t, idx) => (
                              <span key={idx} className="badge bg-danger-subtle text-danger border small">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Link className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold" to={`/result/${test._id}`}>
                          Review
                          <i className="bi bi-chevron-right ms-1"></i>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;
