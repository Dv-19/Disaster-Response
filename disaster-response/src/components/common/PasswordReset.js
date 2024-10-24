// disaster-response/src/components/PasswordReset.js
import React, { useState } from 'react';
import './PasswordReset.css';

function PasswordReset({ onReset }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (email) {
      // Here you would send a password reset email
      setMessage('If this email is registered, a reset link has been sent.');
      setEmail('');
      onReset();
    } else {
      setMessage('Please enter your registered email address.');
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleReset}>
        <h2>Password Reset</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default PasswordReset;
