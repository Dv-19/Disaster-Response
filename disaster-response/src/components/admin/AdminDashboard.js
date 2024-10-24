// src/components/admin/AdminDashboard.js

import React from 'react';
import LogoutButton from '../common/LogoutButton';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <LogoutButton />
      <ul>
        <li>
          <Link to="/admin/distress-signals">View Distress Signals</Link>
        </li>
        <li>
          <Link to="/admin/crisis-updates">Manage Crisis Updates</Link>
        </li>
        {/* ... other links */}
      </ul>
    </div>
  );
}

export default AdminDashboard;
