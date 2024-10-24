// src/components/common/Unauthorized.js

import React from 'react';

function Unauthorized() {
  return (
    <div className="auth-container">
      <h2>Unauthorized Access</h2>
      <p>You do not have permission to view this page.</p>
      <a href="/">Go to Home</a>
    </div>
  );
}

export default Unauthorized;