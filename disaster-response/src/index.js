// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider theme={theme('light')}> {/* Initialize with 'light' mode */}
          <CssBaseline /> {/* Resets CSS for consistent styling */}
          <App />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
