// src/App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/common/Navbar';
// import Footer from './components/common/Footer';
import Login from './components/common/Login';
import Signup from './components/common/Signup';
import PublicDashboard from './components/public/PublicDashboard';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import GovernmentDashboard from './components/government/GovernmentDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import Unauthorized from './components/common/Unauthorized';

function App() {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme(mode)}>
        <CssBaseline />
        <Router>
          <Navbar mode={mode} toggleMode={toggleMode} />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/public/*"
              element={
                <PrivateRoute roles={['public']}>
                  <PublicDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/volunteer/*"
              element={
                <PrivateRoute roles={['volunteer']}>
                  <VolunteerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/government/*"
              element={
                <PrivateRoute roles={['government', 'ngo']}>
                  <GovernmentDashboard />
                </PrivateRoute>
              }
            />

            {/* Unauthorized Access */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Redirect to login by default */}
            <Route path="*" element={<Login />} />
          </Routes>
          
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
