// frontend/src/components/public/DistressSignalsMap.js

import React, { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CircularProgress, Box, Typography } from '@mui/material';

// Fix for default icon issues in Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DistressSignalsMap() {
  const socket = useContext(SocketContext); // Access socket from context
  const [distressSignals, setDistressSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) {
      console.error('Socket is undefined');
      return;
    }

    // Fetch initial distress signals
    fetchDistressSignals();

    // Listen for new SOS signals
    socket.on('newSOS', (data) => {
      setDistressSignals((prevSignals) => [...prevSignals, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('newSOS');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const fetchDistressSignals = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch('http://localhost:5000/api/sos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDistressSignals(data);
    } catch (error) {
      console.error('Error fetching distress signals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '500px', width: '100%', marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>
        Active Distress Signals
      </Typography>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {distressSignals.map((signal) => (
          <Marker key={signal._id} position={[signal.location.latitude, signal.location.longitude]}>
            <Popup>
              <Typography variant="subtitle1" component="div">
                {signal.message}
              </Typography>
              <Typography variant="body2" component="div">
                User: {signal.userId.username}
              </Typography>
              <Typography variant="body2" component="div">
                Status: {signal.status}
              </Typography>
              {/* Add buttons or actions as needed */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}

export default DistressSignalsMap;
