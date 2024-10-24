// src/components/volunteer/ViewAssignedTasks.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAssignedTasks({ volunteerId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(`/api/volunteer/tasks/${volunteerId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskResponse = async (taskId, action) => {
    try {
      await axios.post(`/api/volunteer/tasks/${taskId}/${action}`);
      fetchAssignedTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div>
      <h3>Your Assigned Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            {task.status === 'Pending' && (
              <>
                <button onClick={() => handleTaskResponse(task._id, 'accept')}>Accept</button>
                <button onClick={() => handleTaskResponse(task._id, 'decline')}>Decline</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewAssignedTasks;
