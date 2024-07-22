import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('eid');
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

const PublicRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('eid');
  return !isAuthenticated ? <Component {...rest} /> : <Navigate to="/user" />;
};

export { ProtectedRoute, PublicRoute };
