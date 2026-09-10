import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminViolations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admin/violations');
        if (response.data.success) {
          setViolations(response.data.violations);
        }
      } catch (err) {
        console.error('Error fetching violations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
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
      {/* Header */}
      <div className="card glass-card p-4 p-md-5 border mb-5 shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="fw-bold mb-2">
          <i className="bi bi-shield-exclamation text-danger me-2"></i>
          Exam Integrity Violation Logs
        </h2>
        <p className="text-muted mb-0">Review real-time proctor flags. Violations log tab switches, exit from fullscreen modes, webcam blocks, and right-clicks.</p>
      </div>

      {violations.length === 0 ? (
        <div className="card glass-card text-center p-5 border" style={{ borderColor: 'var(--border-color)' }}>
          <i className="bi bi-shield-check text-success fs-1 mb-3"></i>
          <h4 className="fw-semibold">No integrity violations recorded</h4>
          <p className="text-muted mb-0">Excellent! All test takers are adhering to the examination guidelines.</p>
        </div>
      ) : (
        <div className="card glass-card border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead>
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="py-3">Candidate</th>
                  <th className="py-3">Email</th>
                  <th className="py-3 text-center">Violation Type</th>
                  <th className="px-4 py-3">Detailed Log Description</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr key={v._id} style={{ borderColor: 'var(--border-color)' }}>
                    <td className="px-4 py-3 text-nowrap">
                      {new Date(v.timestamp).toLocaleDateString()}{' '}
                      <span className="d-block text-muted small">
                        {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 fw-semibold">{v.student?.name || 'Deleted Candidate'}</td>
                    <td className="py-3 text-muted">{v.student?.email || 'N/A'}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`badge border ${
                          v.type === 'Fullscreen Exit'
                            ? 'bg-danger-subtle text-danger'
                            : v.type === 'DevTools Detected'
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-info-subtle text-info'
                        }`}
                      >
                        {v.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-secondary">{v.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViolations;
