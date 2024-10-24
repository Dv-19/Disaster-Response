// src/components/common/Navbar.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ThemeToggle from './ThemeToggle';

function Navbar({ mode, toggleMode }) {
  const { auth } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Disaster Response
        </Typography>
        <ThemeToggle mode={mode} toggleMode={toggleMode} />
        {auth.isLoggedIn ? (
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
