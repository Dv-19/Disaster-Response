// frontend/src/components/government/DistressSignalsMap.js

import React, { useEffect, useState, useContext } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SocketContext } from '../../contexts/SocketContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import UpdateIcon from '@mui/icons-material/Update';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Fixing Leaflet's default icon paths since Webpack doesn't handle them correctly.
 * We're using online URLs for custom marker icons to avoid local asset issues.
 */
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the shadow
});

function DistressSignalsMap() {
  const [distressSignals, setDistressSignals] = useState([]);
  const socket = useContext(SocketContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  /**
   * Fetch distress signals from the backend API.
   */
  const fetchDistressSignals = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const response = await fetch('http://localhost:5000/api/sos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDistressSignals(data);
      } else {
        throw new Error('Failed to fetch distress signals.');
      }
    } catch (err) {
      console.error('Error fetching distress signals:', err);
      setError(true);
      setSnackbar({
        open: true,
        message: 'Unable to load distress signals.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect hook to fetch distress signals on component mount and listen for new SOS signals.
   */
  useEffect(() => {
    fetchDistressSignals();

    // Listen for new SOS signals via Socket.IO
    socket.on('newSOS', (data) => {
      setDistressSignals((prevSignals) => [...prevSignals, data]);
      setSnackbar({
        open: true,
        message: 'New distress signal received.',
        severity: 'info',
      });
    });

    // Cleanup on component unmount
    return () => socket.off('newSOS');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  /**
   * Handle updating the status of a distress signal.
   * @param {string} signalId - The ID of the distress signal.
   * @param {string} newStatus - The new status to set.
   */
  const handleStatusUpdate = async (signalId, newStatus) => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'));
      const response = await fetch(`http://localhost:5000/api/sos/${signalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedSignal = await response.json();
        setDistressSignals((prevSignals) =>
          prevSignals.map((signal) =>
            signal._id === signalId ? { ...signal, status: newStatus } : signal
          )
        );
        setSnackbar({
          open: true,
          message: 'Distress signal status updated successfully.',
          severity: 'success',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update distress signal status.');
      }
    } catch (err) {
      console.error('Error updating distress signal status:', err);
      setSnackbar({
        open: true,
        message: err.message || 'An error occurred while updating status.',
        severity: 'error',
      });
    }
  };

  /**
   * Open the dialog to update the status of a selected distress signal.
   * @param {object} signal - The distress signal object.
   */
  const openStatusDialog = (signal) => {
    setSelectedSignal(signal);
  };

  /**
   * Close the status update dialog.
   */
  const closeStatusDialog = () => {
    setSelectedSignal(null);
  };

  /**
   * Confirm the status update and trigger the API call.
   * @param {string} newStatus - The new status to set.
   */
  const confirmStatusUpdate = (newStatus) => {
    if (selectedSignal) {
      handleStatusUpdate(selectedSignal._id, newStatus);
      closeStatusDialog();
    }
  };

  /**
   * Calculate the center of the map based on the average latitude and longitude of distress signals.
   * If no signals are present, default to coordinates [20, 0].
   * @returns {array} - An array containing the latitude and longitude.
   */
  const calculateMapCenter = () => {
    if (distressSignals.length === 0) {
      return [20, 0]; // Default center (e.g., Africa)
    }
    const avgLat =
      distressSignals.reduce((sum, signal) => sum + signal.location.latitude, 0) /
      distressSignals.length;
    const avgLng =
      distressSignals.reduce((sum, signal) => sum + signal.location.longitude, 0) /
      distressSignals.length;
    return [avgLat, avgLng];
  };

  return (
    <Card sx={{ maxWidth: '100%', margin: 'auto', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Active Distress Signals
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Unable to load distress signals.</Typography>
        ) : distressSignals.length === 0 ? (
          <Typography>No active distress signals at the moment.</Typography>
        ) : (
          <Box sx={{ height: '500px', width: '100%', mt: 2 }}>
            <MapContainer
              center={calculateMapCenter()}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {distressSignals.map((signal) => (
                <Marker
                  key={signal._id}
                  position={[signal.location.latitude, signal.location.longitude]}
                  icon={customIcon} // Using custom icon with online URLs
                >
                  <Popup>
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {signal.message || 'No message provided'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>User:</strong> {signal.userId.username}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {signal.status}
                      </Typography>
                      <Box mt={2} display="flex" justifyContent="flex-end">
                        {signal.status === 'Active' && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<UpdateIcon />}
                            onClick={() => openStatusDialog(signal)}
                          >
                            Update Status
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        )}
      </CardContent>

      {/* Status Update Dialog */}
      <Dialog
        open={Boolean(selectedSignal)}
        onClose={closeStatusDialog}
        aria-labelledby="status-update-dialog-title"
        aria-describedby="status-update-dialog-description"
      >
        <DialogTitle id="status-update-dialog-title">Update Status</DialogTitle>
        <DialogContent>
          <DialogContentText id="status-update-dialog-description">
            Choose the new status for this distress signal:
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatusDialog} color="secondary" startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={() => confirmStatusUpdate('In Progress')}
            color="primary"
            variant="contained"
            startIcon={<UpdateIcon />}
          >
            In Progress
          </Button>
          <Button
            onClick={() => confirmStatusUpdate('Resolved')}
            color="success"
            variant="contained"
            startIcon={<CheckCircleIcon />}
          >
            Resolved
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default DistressSignalsMap;
