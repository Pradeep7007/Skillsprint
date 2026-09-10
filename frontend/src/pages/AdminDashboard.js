import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsPagination, setStudentsPagination] = useState({});
  const [studentSearch, setStudentSearch] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch stats and students
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await axios.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setRecentTests(statsRes.data.recentTests);
      }

      const studentsRes = await axios.get(`/admin/students?search=${studentSearch}&page=${studentPage}`);
      if (studentsRes.data.success) {
        setStudents(studentsRes.data.students);
        setStudentsPagination(studentsRes.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [studentSearch, studentPage]);

  // Delete student handler
  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"? This will permanently erase their test attempts and violation logs.`)) {
      try {
        const response = await axios.delete(`/admin/students/${id}`);
        if (response.data.success) {
          setToastMessage(`Student "${name}" deleted successfully.`);
          fetchDashboardData();
          setTimeout(() => setToastMessage(''), 3000);
        }
      } catch (err) {
        console.error('Error deleting student:', err);
        alert(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  if (loading && !stats) {
    return (
      <div className="container py-5">
        <SkeletonLoader count={2} />
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
          <div className="toast show align-items-center text-white bg-success border-0" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2"></i>
                {toastMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="card glass-card p-4 p-md-5 border mb-5 shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        <h2 className="fw-bold mb-2">
          <i className="bi bi-speedometer2 text-primary me-2"></i>
          Administration Control Panel
        </h2>
        <p className="text-muted mb-0">Monitor platform metrics, manage student databases, review proctor flags, and seed questionnaire banks.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-6 col-md-3">
            <div className="card glass-card p-4 border text-center h-100" style={{ borderColor: 'var(--border-color)' }}>
              <i className="bi bi-people text-primary fs-2 mb-2"></i>
              <div className="text-muted small fw-semibold text-uppercase mb-1">Students</div>
              <div className="stat-value">{stats.students}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card glass-card p-4 border text-center h-100" style={{ borderColor: 'var(--border-color)' }}>
              <i className="bi bi-journal-text text-secondary fs-2 mb-2"></i>
              <div className="text-muted small fw-semibold text-uppercase mb-1">Questions</div>
              <div className="stat-value" style={{ color: 'var(--accent-secondary)' }}>{stats.questions}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card glass-card p-4 border text-center h-100" style={{ borderColor: 'var(--border-color)' }}>
              <i className="bi bi-shield-check text-success fs-2 mb-2"></i>
              <div className="text-muted small fw-semibold text-uppercase mb-1">Tests Completed</div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>{stats.tests}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card glass-card p-4 border text-center h-100" style={{ borderColor: 'var(--border-color)' }}>
              <i className="bi bi-award text-warning fs-2 mb-2"></i>
              <div className="text-muted small fw-semibold text-uppercase mb-1">Avg Score %</div>
              <div className="stat-value" style={{ color: 'var(--color-warning)' }}>{stats.averagePercentage}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Manage Students */}
        <div className="col-12 col-lg-7">
          <div className="card glass-card border p-4 h-100" style={{ borderColor: 'var(--border-color)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h5 className="fw-bold mb-0">Manage Candidates</h5>
              {/* Search Bar */}
              <div className="input-group" style={{ maxWidth: '250px' }}>
                <span className="input-group-text py-1">
                  <i className="bi bi-search small"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm py-1"
                  placeholder="Search name/email"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setStudentPage(1);
                  }}
                />
              </div>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-5 text-muted small">No students registered yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead>
                    <tr style={{ borderColor: 'var(--border-color)' }}>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id} style={{ borderColor: 'var(--border-color)' }}>
                        <td className="fw-semibold">{student.name}</td>
                        <td>{student.email}</td>
                        <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-danger btn-sm rounded-circle p-1"
                            onClick={() => handleDeleteStudent(student._id, student.name)}
                            style={{ width: '30px', height: '30px' }}
                            title="Delete Student"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {studentsPagination.pages > 1 && (
                  <div className="d-flex justify-content-center mt-4 gap-1">
                    {Array.from({ length: studentsPagination.pages }).map((_, i) => (
                      <button
                        key={i}
                        className={`btn btn-sm px-3 ${studentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setStudentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="col-12 col-lg-5">
          <div className="card glass-card border p-4 h-100" style={{ borderColor: 'var(--border-color)' }}>
            <h5 className="fw-bold mb-4">Recent Test Attempts</h5>
            {recentTests.length === 0 ? (
              <div className="text-center py-5 text-muted small">No test attempts logged yet.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {recentTests.map((test) => (
                  <div
                    key={test._id}
                    className="p-3 border rounded-3 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
                  >
                    <div>
                      <strong className="d-block small text-capitalize text-primary">{test.category} Exam</strong>
                      <span className="d-block text-secondary small fw-semibold">{test.student?.name || 'Deleted Student'}</span>
                      <span className="text-muted small" style={{ fontSize: '10px' }}>
                        {new Date(test.date).toLocaleDateString()} at{' '}
                        {new Date(test.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success-subtle text-success border fw-bold fs-6">{test.percentage}%</span>
                      <Link
                        className="d-block small mt-1 text-decoration-none fw-semibold"
                        to={`/result/${test._id}`}
                        style={{ color: 'var(--accent-primary)', fontSize: '11px' }}
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
