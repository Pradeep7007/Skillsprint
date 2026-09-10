import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg nav-blur sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/" style={{ color: 'var(--accent-primary)' }}>
          <i className="bi bi-shield-lock-fill me-2"></i>
          <span>SecureTest</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    Dashboard
                  </Link>
                </li>
                {!isAdmin() && (
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/history" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      Test History
                    </Link>
                  </li>
                )}
                {isAdmin() && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link px-3" to="/admin/questions" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        Questions Database
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link px-3" to="/admin/violations" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        Violations Log
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}



            <li className="nav-item ms-lg-3 me-2 mt-3 mt-lg-0">
              <button
                className="btn btn-sm border d-flex align-items-center p-2 rounded-circle"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', width: '38px', height: '38px', justifyContent: 'center', backgroundColor: 'var(--bg-tertiary)' }}
              >
                {theme === 'dark' ? <i className="bi bi-sun-fill text-warning"></i> : <i className="bi bi-moon-stars-fill text-primary"></i>}
              </button>
            </li>

            {user ? (
              <li className="nav-item dropdown ms-lg-2 mt-2 mt-lg-0">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center px-3 py-2 rounded-3 border"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
                >
                  <i className="bi bi-person-circle me-2 fs-5" style={{ color: 'var(--accent-primary)' }}></i>
                  <span className="fw-semibold">{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  <li className="px-3 py-2 border-bottom mb-2">
                    <span className="d-block text-muted small">Logged in as</span>
                    <strong className="text-capitalize">{user.role}</strong>
                  </li>
                  <li>
                    <button className="dropdown-item rounded text-danger d-flex align-items-center py-2" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-2 mt-3 mt-lg-0">
                  <Link className="btn me-2 px-4 fw-semibold" to="/login" style={{ border: '1.5px solid var(--accent-primary)', color: 'var(--accent-primary)', backgroundColor: 'transparent' }}>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <Link className="btn btn-primary-custom px-4 fw-semibold" to="/register">
                    <i className="bi bi-person-plus-fill me-1"></i> Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
