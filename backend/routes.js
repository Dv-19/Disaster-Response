// backend/routes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const { User, DistressSignal, ResourceRequest, Resource } = require('./models');
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

// Authentication Routes

// User Registration
router.post('/api/auth/signup', async (req, res) => {
  const { username, password, email, role, phoneNumber, emergencyContacts, locality, skills } =
    req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Username already exists.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      role,
      phoneNumber,
      emergencyContacts,
      locality,
      skills,
    });

    await user.save();
    res.json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during signup:', error);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ success: false, message: 'Email is already in use.' });
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Server error during signup.' });
    }
  }
});

// User Login
router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ success: false, message: 'User not found.' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: 'Incorrect password.' });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ success: true, token, role: user.role, username: user.username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// SOS Routes

// Activate SOS
router.post('/api/sos', authenticateToken, authorizeRoles('public'), async (req, res) => {
  try {
    const distressSignal = new DistressSignal({
      userId: req.user.id,
      message: req.body.message,
      location: req.body.location,
      status: 'Active',
    });
    await distressSignal.save();

    // Emit SOS event to government users via Socket.IO
    req.io.emit('newSOS', distressSignal);

    res.json({ message: 'SOS activated successfully' });
  } catch (error) {
    console.error('Error activating SOS:', error);
    res.status(500).json({ message: 'Failed to activate SOS' });
  }
});

// Get Active SOS Signals (for government and NGO users)
router.get('/api/sos', authenticateToken, authorizeRoles('government', 'ngo'), async (req, res) => {
  try {
    const signals = await DistressSignal.find({ status: 'Active' }).populate('userId', 'username');
    res.json(signals);
  } catch (error) {
    console.error('Error fetching SOS signals:', error);
    res.status(500).json({ message: 'Failed to fetch SOS signals' });
  }
});

// Weather Routes

router.get('/api/weather', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: 'metric',
      },
    });
    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// News Routes

router.get('/api/news', authenticateToken, async (req, res) => {
  try {
    const { locality } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    const newsResponse = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: `disaster ${locality}`,
        apiKey: apiKey,
      },
    });
    res.json(newsResponse.data.articles);
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ message: 'Failed to fetch news articles' });
  }
});

// Resource Requests Routes

// Submit Resource Request (Public Users)
router.post(
  '/api/resource-requests',
  authenticateToken,
  authorizeRoles('public'),
  async (req, res) => {
    try {
      const resourceRequest = new ResourceRequest({
        userId: req.user.id,
        resourceType: req.body.resourceType,
        quantity: req.body.quantity,
        location: req.body.location,
        status: 'Pending',
      });
      await resourceRequest.save();

      // Notify government/NGO users if needed
      req.io.emit('newResourceRequest', resourceRequest);

      res.json({ message: 'Resource request submitted successfully' });
    } catch (error) {
      console.error('Error submitting resource request:', error);
      res.status(500).json({ message: 'Failed to submit resource request' });
    }
  }
);

// Get Resource Requests (Government and NGO Users)
router.get(
  '/api/resource-requests',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const requests = await ResourceRequest.find()
        .populate('userId', 'username')
        .sort({ timestamp: -1 });
      res.json(requests);
    } catch (error) {
      console.error('Error fetching resource requests:', error);
      res.status(500).json({ message: 'Failed to fetch resource requests' });
    }
  }
);

// Update Resource Request Status
router.put(
  '/api/resource-requests/:id',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const requestId = req.params.id;
      const { status } = req.body;
      await ResourceRequest.findByIdAndUpdate(requestId, { status });
      res.json({ message: 'Resource request updated successfully' });
    } catch (error) {
      console.error('Error updating resource request:', error);
      res.status(500).json({ message: 'Failed to update resource request' });
    }
  }
);

// Resources Routes

// Get All Resources
router.get(
  '/api/resources',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const resources = await Resource.find();
      res.json(resources);
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  }
);

// Add New Resource
router.post(
  '/api/resources',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const resource = new Resource(req.body);
      await resource.save();
      res.json({ message: 'Resource added successfully' });
    } catch (error) {
      console.error('Error adding resource:', error);
      res.status(500).json({ message: 'Failed to add resource' });
    }
  }
);

// Update Resource
router.put(
  '/api/resources/:id',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const resourceId = req.params.id;
      await Resource.findByIdAndUpdate(resourceId, req.body);
      res.json({ message: 'Resource updated successfully' });
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ message: 'Failed to update resource' });
    }
  }
);

// Delete Resource
router.delete(
  '/api/resources/:id',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const resourceId = req.params.id;
      await Resource.findByIdAndDelete(resourceId);
      res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ message: 'Failed to delete resource' });
    }
  }
);

module.exports = router;




const { VolunteerTask } = require('./models');

// Activate SOS
router.post('/api/sos', authenticateToken, authorizeRoles('public'), async (req, res) => {
  try {
    const distressSignal = new DistressSignal({
      userId: req.user.id,
      message: req.body.message,
      location: req.body.location,
      status: 'Active',
    });
    await distressSignal.save();

    // Emit SOS event to government users via Socket.IO
    req.io.emit('newSOS', distressSignal);

    res.json({ message: 'SOS activated successfully' });
  } catch (error) {
    console.error('Error activating SOS:', error);
    res.status(500).json({ message: 'Failed to activate SOS' });
  }
});

// Get Active SOS Signals (for government and NGO users)
router.get(
  '/api/sos',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const signals = await DistressSignal.find({ status: { $ne: 'Resolved' } }).populate(
        'userId',
        'username'
      );
      res.json(signals);
    } catch (error) {
      console.error('Error fetching SOS signals:', error);
      res.status(500).json({ message: 'Failed to fetch SOS signals' });
    }
  }
);

// Update SOS Status
router.put(
  '/api/sos/:id',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  async (req, res) => {
    try {
      const signalId = req.params.id;
      const { status } = req.body;
      await DistressSignal.findByIdAndUpdate(signalId, { status });
      res.json({ message: 'Distress signal status updated successfully' });
    } catch (error) {
      console.error('Error updating distress signal:', error);
      res.status(500).json({ message: 'Failed to update distress signal' });
    }
  }
);



// backend/routes.js

// Get Volunteers (for government and NGO users)
router.get(
    '/api/volunteers',
    authenticateToken,
    authorizeRoles('government', 'ngo'),
    async (req, res) => {
      try {
        const volunteers = await User.find({ role: 'volunteer' }).select(
          'username phoneNumber locality skills'
        );
        res.json(volunteers);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Failed to fetch volunteers' });
      }
    }
  );
  
  // Assign Task to Volunteer
  router.post(
    '/api/volunteer-tasks',
    authenticateToken,
    authorizeRoles('government', 'ngo'),
    async (req, res) => {
      try {
        const { volunteerId, description } = req.body;
        const task = new VolunteerTask({
          volunteerId,
          description,
          assignedBy: req.user.id,
          status: 'Assigned',
        });
        await task.save();
        res.json({ message: 'Task assigned to volunteer successfully' });
      } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ message: 'Failed to assign task' });
      }
    }
  );
  
  // Get Tasks for Volunteer (for volunteers)
  router.get(
    '/api/volunteer-tasks',
    authenticateToken,
    authorizeRoles('volunteer'),
    async (req, res) => {
      try {
        const tasks = await VolunteerTask.find({ volunteerId: req.user.id });
        res.json(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
      }
    }
  );
  
  // Update Task Status (for volunteers)
  router.put(
    '/api/volunteer-tasks/:id',
    authenticateToken,
    authorizeRoles('volunteer'),
    async (req, res) => {
      try {
        const taskId = req.params.id;
        const { status } = req.body;
        await VolunteerTask.findByIdAndUpdate(taskId, { status });
        res.json({ message: 'Task status updated successfully' });
      } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Failed to update task status' });
      }
    }
  );
  
// backend/routes.js

// ... other imports ...

// Get Tasks for Volunteer (for volunteers)
router.get(
    '/api/volunteer-tasks',
    authenticateToken,
    authorizeRoles('volunteer'),
    async (req, res) => {
      try {
        const tasks = await VolunteerTask.find({ volunteerId: req.user.id });
        res.json(tasks); // Returns an array, even if empty
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
      }
    }
  );
