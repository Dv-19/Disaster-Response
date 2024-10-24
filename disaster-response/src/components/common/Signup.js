// frontend/src/components/common/Signup.js

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'public',
    phoneNumber: '',
    emergencyContacts: '',
    locality: '',
    skills: '',
  });
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    // Add client-side validation if necessary

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          emergencyContacts: formData.emergencyContacts
            ? formData.emergencyContacts.split(',').map((contact) => contact.trim())
            : [],
          skills: formData.skills ? formData.skills.split(',').map((skill) => skill.trim()) : [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Signup successful! You can now log in.');
        navigate('/login');
      } else {
        setSignupError(data.message || 'An error occurred during signup. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError('An error occurred during signup. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Signup
        </Typography>
        {signupError && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{signupError}</Alert>}
        <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            {/* Password */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password (min 6 characters)"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                inputProps={{ minLength: 6 }}
              />
            </Grid>
            {/* Role Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="public">Public User</MenuItem>
                  <MenuItem value="volunteer">Volunteer</MenuItem>
                  <MenuItem value="government">Government</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Phone Number */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            {/* Emergency Contacts */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="emergencyContacts"
                label="Emergency Contacts (comma-separated)"
                name="emergencyContacts"
                value={formData.emergencyContacts}
                onChange={handleChange}
              />
            </Grid>
            {/* Locality */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="locality"
                label="Locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                disabled={!(formData.role === 'public' || formData.role === 'volunteer')}
              />
            </Grid>
            {/* Skills */}
            {formData.role === 'volunteer' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="skills"
                  label="Skills (comma-separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Signup
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
