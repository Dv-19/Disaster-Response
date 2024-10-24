// src/components/public/FindShelters.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../common/MapView';

function FindShelters() {
  const [shelters, setShelters] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    fetchShelters();
    getUserLocation();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await axios.get('/api/public/shelters');
      setShelters(response.data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    }
  };

  const getUserLocation = () => {
    // Similar to previous geolocation code
  };

  return (
    <div>
      <h3>Find Nearby Emergency Shelters</h3>
      {location && (
        <MapView location={location} markers={shelters.map(shelter => shelter.location)} />
      )}
      {/* List shelters with details */}
      <ul>
        {shelters.map((shelter) => (
          <li key={shelter._id}>
            <h4>{shelter.name}</h4>
            <p>{shelter.address}</p>
            <p>Contact: {shelter.contact}</p>
            {/* ... other details ... */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FindShelters;
