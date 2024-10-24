// frontend/src/components/public/ResourceRequestForm.js

import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

function ResourceRequestForm() {
  const { auth } = useContext(AuthContext);
  const [resourceType, setResourceType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResourceRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/resource-requests`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify({
                resourceType,
                quantity,
                location: {
                  latitude,
                  longitude,
                },
              }),
            }
          );

          const data = await response.json();
          if (response.ok) {
            setMessage('Resource request submitted successfully.');
            setResourceType('');
            setQuantity('');
          } else {
            setMessage(data.message || 'Failed to submit resource request.');
          }
        } catch (error) {
          console.error('Error submitting resource request:', error);
          setMessage('An error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setMessage('Unable to retrieve location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Request Resources
        </Typography>
        <Box component="form" onSubmit={handleResourceRequest} noValidate>
          <TextField
            label="Resource Type"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit Request
            </Button>
          )}
          {message && (
            <Typography
              variant="body2"
              color={message.includes('successfully') ? 'success.main' : 'error'}
              align="center"
              mt={2}
            >
              {message}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ResourceRequestForm;
