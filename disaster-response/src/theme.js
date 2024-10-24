// src/theme.js

import { createTheme } from '@mui/material/styles';

// Define a function that returns a theme based on the mode (light/dark)
const theme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2', // Primary color (e.g., blue)
      },
      secondary: {
        main: '#e43f5a', // Secondary color (e.g., red)
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: mode === 'light' ? '#555555' : '#bbbbbb',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      // Define other typography variants as needed
    },
    components: {
      // Customize MUI components here
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: '16px',
          },
        },
      },
      // Add more component customizations
    },
  });

export default theme;
