// src/components/common/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function PrivateRoute({ children, roles }) {
  const { auth } = useContext(AuthContext);

  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    // Unauthorized access
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default PrivateRoute;
