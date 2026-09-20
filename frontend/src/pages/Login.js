import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { login, user } = useContext(AuthContext);
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
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setToastMessage('Logged in successfully!');
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
      <div className="card glass-card p-4 p-md-5 border w-100 my-auto" style={{ maxWidth: '480px', borderColor: 'var(--border-color)' }}>
        
        {/* Toast Toast notification */}
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
            <i className="bi bi-shield-lock fs-3"></i>
          </div>
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Sign in to access your test dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center border-0 p-3 mb-4" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="mb-4 text-start">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label small fw-semibold">Password</label>
              <Link to="/forgot-password" style={{ color: 'var(--accent-primary)', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
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
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2.5 fw-semibold d-flex justify-content-center align-items-center fs-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Authenticating...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login / Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
          <p className="small text-muted mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="fw-bold" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
              Sign Up / Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
