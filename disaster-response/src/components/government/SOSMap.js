// frontend/src/components/government/SOSMap.js

import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { SocketContext } from '../../contexts/SocketContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function SOSMap() {
  const [sosSignals, setSosSignals] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchActiveSOS();

    socket.on('newSOS', (data) => {
      setSosSignals((prevSignals) => [...prevSignals, data]);
    });

    // Cleanup on component unmount
    return () => socket.off('newSOS');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActiveSOS = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sos', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth')?.token}`,
        },
      });
      const data = await response.json();
      setSosSignals(data);
    } catch (error) {
      console.error('Error fetching SOS signals:', error);
    }
  };

  // Fix marker icon issue with Leaflet and React
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  return (
    <div className="sos-map">
      <h3>Active SOS Signals</h3>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {sosSignals.map((signal) => (
          <Marker
            key={signal._id}
            position={[signal.location.latitude, signal.location.longitude]}
          >
            <Popup>
              <b>{signal.message}</b>
              <br />
              User: {signal.userId.username}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default SOSMap;
