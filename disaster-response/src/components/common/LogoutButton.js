// frontend/src/components/common/LogoutButton.js

import React, { useContext } from 'react';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../contexts/AuthContext';

function LogoutButton() {
  const { setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setAuth({
      isLoggedIn: false,
      user: null,
      role: '',
      token: '',
    });
  };

  return (
    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
