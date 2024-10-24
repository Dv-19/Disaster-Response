// src/components/common/ThemeToggle.js

import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme, ThemeProvider } from '@mui/material/styles';

function ThemeToggle({ mode, toggleMode }) {
  const theme = useTheme();

  return (
    <IconButton onClick={toggleMode} color="inherit">
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}

export default ThemeToggle;
