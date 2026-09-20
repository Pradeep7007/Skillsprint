import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (role === 'admin' && !adminSecretKey) {
      return setError('Admin secret key is required for admin registration');
    }

    setLoading(true);
    const result = await register(name, email, password, role, adminSecretKey);
    setLoading(false);

    if (result.success) {
      setToastMessage('Account created successfully!');
      setTimeout(() => {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container py-4 py-md-5 d-flex justify-content-center flex-grow-1">
      <div className="card glass-card p-4 p-md-5 border w-100 my-auto" style={{ maxWidth: '520px', borderColor: 'var(--border-color)' }}>
        
        {/* Toast notification */}
        {toastMessage && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
            <div className="toast show align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {toastMessage}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)', width: '60px', height: '60px' }}>
            <i className="bi bi-person-plus fs-3"></i>
          </div>
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Register to start taking exam assessments</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center border-0 p-3 mb-4" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label small fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row text-start">
            <div className="col-12 col-sm-6 mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="col-12 col-sm-6 mb-3">
              <label className="form-label small fw-semibold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-shield-fill-check"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold" style={{ color: 'var(--text-secondary)' }}>Account Role</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleStudent"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                />
                <label className="form-check-label text-capitalize small" htmlFor="roleStudent">
                  Student
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleAdmin"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                <label className="form-check-label text-capitalize small" htmlFor="roleAdmin">
                  Admin
                </label>
              </div>
            </div>
          </div>

          {role === 'admin' && (
            <div className="mb-4 animate-pulse text-start">
              <label className="form-label small fw-semibold text-danger">Admin Secret Key</label>
              <div className="input-group">
                <span className="input-group-text border-danger text-danger">
                  <i className="bi bi-key-fill"></i>
                </span>
                <input
                  type="password"
                  className="form-control border-danger text-danger"
                  placeholder="Enter admin secret key"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  required
                />
              </div>
              <div className="form-text text-muted" style={{ fontSize: '11px' }}>
                Default key: <code>superAdminToken123</code> (configured in seeder)
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex justify-content-center align-items-center mt-3 fs-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill me-2"></i>
                Sign Up / Create Account
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
          <p className="small text-muted mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-bold" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
              Login / Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
