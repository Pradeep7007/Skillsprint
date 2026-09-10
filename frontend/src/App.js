import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import TestHistory from './pages/TestHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestions from './pages/AdminQuestions';
import AdminViolations from './pages/AdminViolations';

function AppContent() {
  const location = useLocation();
  const isTestRoute = location.pathname.startsWith('/test/');

  return (
    <div
      className={`d-flex flex-column ${isTestRoute ? 'vh-100 overflow-hidden' : 'min-vh-100'}`}
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {!isTestRoute && <Navbar />}
      <main className={`flex-grow-1 ${isTestRoute ? 'overflow-hidden d-flex flex-column' : ''}`}>
        <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/resetpassword/:token" element={<ResetPassword />} />

                {/* Protected Student Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute adminOnly={false}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test/:category"
                  element={
                    <ProtectedRoute adminOnly={false}>
                      <TestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute adminOnly={false}>
                      <TestHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Common Protected Routes (Both student and admin can view results) */}
                <Route
                  path="/result/:id"
                  element={
                    <ProtectedRoute>
                      <ResultPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminQuestions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/violations"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminViolations />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all redirect to home */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>
            {!isTestRoute && <Footer />}
          </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
