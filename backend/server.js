// backend/server.js

require('dotenv').config(); // To manage environment variables
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // To handle Cross-Origin requests

const routes = require('./routes'); // Import the combined routes
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
//const incidentsRouter = require('./routes/incidents');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust to your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust to match your frontend's origin
    credentials: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Use the combined routes
app.use('/', routes);

// Start Server
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// backend/server.js

// ... existing code ...

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// ... existing code ...

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// ... existing code ...

// app.use('/api/incidents', incidentsRouter);


// // Routes
// const incidentRoutes = require('./routes/incidents');
// app.use('/api/incidents', incidentRoutes);

// Connect to MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/disaster-response';

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false, // No longer necessary in Mongoose 6+
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

