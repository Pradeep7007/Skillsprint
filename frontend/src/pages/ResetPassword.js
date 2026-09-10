import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Can be used to sync state or just log them out

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await axios.put(`/auth/resetpassword/${token}`, { password });
      
      // Successfully reset. The API returns token/user just like login.
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      
      setSuccess('Password updated successfully! Redirecting to dashboard...');
      
      setTimeout(() => {
        window.location.href = '/'; // Reload state and navigate home
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to reset password. Link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card glass-card p-4 p-md-5 border w-100" style={{ maxWidth: '480px', borderColor: 'var(--border-color)' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-primary)', width: '60px', height: '60px' }}>
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>
          <h2 className="fw-bold">Reset Password</h2>
          <p className="text-muted">Enter and confirm your new password below</p>
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
          <div className="mb-3 text-start">
            <label className="form-label small fw-semibold">New Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label small fw-semibold">Confirm New Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-fill-check"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Updating Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
