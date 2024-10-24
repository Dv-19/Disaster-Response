// src/components/admin/ViewDistressSignals.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function ViewDistressSignals() {
  const { auth } = useContext(AuthContext);
  const [signals, setSignals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistressSignals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDistressSignals = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/admin/distress-signals',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 401) {
        // Handle unauthorized access (e.g., token expired)
        setError('Session expired. Please log in again.');
        // You can add logic to redirect to login page if needed
      } else if (response.ok) {
        const data = await response.json();
        setSignals(data);
      } else {
        setError('Failed to fetch distress signals.');
      }
    } catch (error) {
      console.error('Error fetching distress signals:', error);
      setError('An error occurred while fetching distress signals.');
    }
  };

  return (
    <div>
      <h2>Distress Signals</h2>
      {error && <p className="error-message">{error}</p>}
      {signals.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Message</th>
              <th>Location</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={signal._id}>
                <td>{signal.username}</td>
                <td>{signal.message}</td>
                <td>
                  Lat: {signal.location.latitude}, Lng: {signal.location.longitude}
                </td>
                <td>{signal.status}</td>
                <td>{new Date(signal.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No distress signals available.</p>
      )}
    </div>
  );
}

export default ViewDistressSignals;
