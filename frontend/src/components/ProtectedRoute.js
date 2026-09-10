import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SkeletonLoader from './SkeletonLoader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <SkeletonLoader count={1} />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If page requires Admin but user is Student, redirect to Student Dashboard
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If page is Student-only but user is Admin, redirect to Admin Dashboard
  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
