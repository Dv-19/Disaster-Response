// src/components/admin/ManageCrisisUpdates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageCrisisUpdates() {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({ title: '', content: '', location: '' });

  useEffect(() => {
    fetchCrisisUpdates();
  }, []);

  const fetchCrisisUpdates = async () => {
    try {
      const response = await axios.get('/api/admin/crisis-updates');
      setUpdates(response.data);
    } catch (error) {
      console.error('Error fetching crisis updates:', error);
    }
  };

  const handleCreateUpdate = async () => {
    try {
      await axios.post('/api/admin/crisis-updates', newUpdate);
      setNewUpdate({ title: '', content: '', location: '' });
      fetchCrisisUpdates();
    } catch (error) {
      console.error('Error creating crisis update:', error);
    }
  };

  // Implement update and delete functions similarly.

  return (
    <div>
      <h3>Manage Crisis Updates</h3>
      {/* Form to create a new update */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newUpdate.title}
          onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newUpdate.content}
          onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newUpdate.location}
          onChange={(e) => setNewUpdate({ ...newUpdate, location: e.target.value })}
        />
        <button onClick={handleCreateUpdate}>Post Update</button>
      </div>
      {/* List existing updates */}
      <ul>
        {updates.map((update) => (
          <li key={update._id}>
            <h4>{update.title}</h4>
            <p>{update.content}</p>
            <p>{update.location}</p>
            {/* Add edit and delete buttons */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCrisisUpdates;
