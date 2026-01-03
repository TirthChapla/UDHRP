import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      PATIENT: '/patient/dashboard',
      DOCTOR: '/doctor/dashboard',
      LABORATORY: '/laboratory/dashboard',
      INSURANCE: '/insurance/dashboard',
      RECEPTIONIST: '/receptionist/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
