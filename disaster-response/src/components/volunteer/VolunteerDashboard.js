// frontend/src/components/volunteer/VolunteerDashboard.js

import React, { useEffect, useState } from 'react';
import LogoutButton from '../common/LogoutButton';
import '../../styles/Dashboard.css';

function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchVolunteerTasks();
  }, []);

  const fetchVolunteerTasks = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch('http://localhost:5000/api/volunteer-tasks', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching tasks:', errorData.message);
        setTasks([]); // Ensure tasks is an array
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]); // Ensure tasks is an array
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('auth'))?.token;
      const response = await fetch(`http://localhost:5000/api/volunteer-tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
        );
        alert('Task status updated successfully.');
      } else {
        alert('Failed to update task status.');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Volunteer Dashboard</h2>
      <LogoutButton />
      <h3>Your Tasks</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== 'Completed' && (
                    <button onClick={() => handleStatusUpdate(task._id, 'Completed')}>
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No tasks assigned.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerDashboard;
