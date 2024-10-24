// frontend/src/components/government/VolunteersList.js

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

function VolunteersList({ setSnackbar }) {
  const [volunteers, setVolunteers] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(false);

  // Fetch volunteers from the backend
  const fetchVolunteers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch('http://localhost:5000/api/volunteers', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVolunteers(data);
        setError(false);
      } else {
        setError(true);
        setSnackbar({
          open: true,
          message: 'Failed to fetch volunteers.',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError(true);
      setSnackbar({
        open: true,
        message: 'An error occurred while fetching volunteers.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();

    // Optionally, set up polling to refresh data periodically
    const interval = setInterval(fetchVolunteers, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle task assignment
  const handleAssignTask = async () => {
    if (!selectedVolunteer || !taskDescription.trim()) {
      setSnackbar({
        open: true,
        message: 'Please select a volunteer and enter a task description.',
        severity: 'warning',
      });
      return;
    }

    setAssigning(true);
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch('http://localhost:5000/api/volunteer-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          volunteerId: selectedVolunteer,
          description: taskDescription,
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Task assigned successfully.',
          severity: 'success',
        });
        setTaskDescription('');
        setSelectedVolunteer('');
        fetchVolunteers(); // Refresh the volunteers list if necessary
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to assign task.',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error assigning task:', err);
      setSnackbar({
        open: true,
        message: 'An error occurred while assigning the task.',
        severity: 'error',
      });
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <Typography variant="h6" color="error">
          Unable to load volunteers.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Volunteers
      </Typography>
      {volunteers.length === 0 ? (
        <Typography variant="body1">No volunteers available at the moment.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="volunteers table">
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Locality</TableCell>
                <TableCell>Skills</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer._id}>
                  <TableCell>
                    <Radio
                      checked={selectedVolunteer === volunteer._id}
                      onChange={() => setSelectedVolunteer(volunteer._id)}
                      value={volunteer._id}
                      name="volunteer-radio-button"
                      inputProps={{ 'aria-label': volunteer.username }}
                    />
                  </TableCell>
                  <TableCell>{volunteer.username}</TableCell>
                  <TableCell>{volunteer.phoneNumber}</TableCell>
                  <TableCell>{volunteer.locality || 'N/A'}</TableCell>
                  <TableCell>
                    {volunteer.skills && volunteer.skills.length > 0
                      ? volunteer.skills.join(', ')
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Assign Task Section */}
      <Box mt={4} component={Paper} p={3}>
        <Typography variant="h6" gutterBottom>
          Assign Task
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Task Description"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignTask}
            disabled={assigning}
          >
            {assigning ? <CircularProgress size={24} color="inherit" /> : 'Assign Task'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default VolunteersList;
