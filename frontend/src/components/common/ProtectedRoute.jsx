import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
