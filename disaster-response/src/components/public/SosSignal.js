// src/components/public/SosSignal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SosSignal.css';

function SosSignal({ username }) {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error fetching location:', error);
          setStatus('Unable to retrieve location.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setStatus('Geolocation not supported.');
    }
  };

  const handleSendSos = async () => {
    if (!location) {
      setStatus('Location not available.');
      return;
    }

    try {
      const response = await axios.post('/api/public/sos', {
        username,
        message,
        location,
      });

      if (response.data.success) {
        setStatus('SOS signal sent successfully!');
        setMessage('');
      } else {
        setStatus('Failed to send SOS signal.');
      }
    } catch (error) {
      console.error('Error sending SOS signal:', error);
      setStatus('Error sending SOS signal.');
    }
  };

  return (
    <div className="sos-signal">
      <h3>Activate SOS Signal</h3>
      <p>Your current location will be sent along with your message.</p>
      <textarea
        placeholder="Enter your message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={handleSendSos}>Send SOS</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default SosSignal;
