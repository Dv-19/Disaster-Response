// frontend/src/components/government/ResourceRequestsList.js

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
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

function ResourceRequestsList({ setSnackbar }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch resource requests from the backend
  const fetchResourceRequests = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch('http://localhost:5000/api/resource-requests', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
        setError(false);
      } else {
        setError(true);
        setSnackbar({
          open: true,
          message: 'Failed to fetch resource requests.',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error fetching resource requests:', err);
      setError(true);
      setSnackbar({
        open: true,
        message: 'An error occurred while fetching resource requests.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceRequests();

    // Optionally, set up polling to refresh data periodically
    const interval = setInterval(fetchResourceRequests, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch(`http://localhost:5000/api/resource-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? updatedRequest.updatedRequest : req))
        );
        setSnackbar({
          open: true,
          message: 'Resource request status updated successfully.',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to update resource request status.',
          severity: 'error',
        });
      }
    } catch (err) {
      console.error('Error updating resource request:', err);
      setSnackbar({
        open: true,
        message: 'An error occurred while updating the resource request.',
        severity: 'error',
      });
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
          Unable to load resource requests.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Resource Requests
      </Typography>
      {requests.length === 0 ? (
        <Typography variant="body1">No resource requests at the moment.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="resource requests table">
            <TableHead>
              <TableRow>
                <TableCell>Requester</TableCell>
                <TableCell>Resource Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.userId.username}</TableCell>
                  <TableCell>{request.resourceType}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    Lat: {request.location.latitude.toFixed(4)}, Lon:{' '}
                    {request.location.longitude.toFixed(4)}
                  </TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell align="center">
                    {request.status === 'Pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleStatusUpdate(request._id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleStatusUpdate(request._id, 'Declined')}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {request.status !== 'Pending' && (
                      <Typography variant="body2" color="text.secondary">
                        No actions available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default ResourceRequestsList;
