import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" replace />;
  if (role) {
    // role may be a string or an array of allowed roles
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.rol)) return <Navigate to="/catalogo" replace />;
  }
  return children;
}
