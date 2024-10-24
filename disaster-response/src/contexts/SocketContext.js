// frontend/src/contexts/SocketContext.js

import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socket = io('http://localhost:5000', {
    // Optional configurations
    transports: ['websocket'],
    reconnectionAttempts: 5,
    timeout: 10000,
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
