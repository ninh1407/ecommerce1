import React from 'react';
import { useAuth } from '../state/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}