import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/forgotpassword', { email });
      setSuccess(response.data.message || 'Password reset email sent successfully! Please check your inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Email could not be sent. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card glass-card p-4 p-md-5 border w-100" style={{ maxWidth: '480px', borderColor: 'var(--border-color)' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)', width: '60px', height: '60px' }}>
            <i className="bi bi-key fs-3"></i>
          </div>
          <h2 className="fw-bold">Forgot Password?</h2>
          <p className="text-muted">Enter your email and we'll send a password recovery link</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center border-0 p-3 mb-4" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center border-0 p-3 mb-4" role="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-start">
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

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            Remembered your password?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
