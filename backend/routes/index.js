// backend/routes/index.js

const express = require('express');
const router = express.Router();

// Import existing routers
const authRouter = require('./auth'); // Assuming you have auth routes
const sosRouter = require('./sos'); // Assuming you have sos routes
const weatherRouter = require('./weather'); // Assuming you have weather routes
const newsRouter = require('./news'); // Assuming you have news routes
const resourceRequestsRouter = require('./resourceRequests'); // Assuming you have resource requests routes
const resourcesRouter = require('./resources'); // Assuming you have resources routes
const volunteerTasksRouter = require('./volunteerTasks'); // Assuming you have volunteer tasks routes
const volunteersRouter = require('./volunteers'); // Assuming you have volunteers routes
const incidentsRouter = require('./incidents'); // New Incident routes

// Use the routers
router.use('/api/auth', authRouter);
router.use('/api/sos', sosRouter);
router.use('/api/weather', weatherRouter);
router.use('/api/news', newsRouter);
router.use('/api/resource-requests', resourceRequestsRouter);
router.use('/api/resources', resourcesRouter);
router.use('/api/volunteer-tasks', volunteerTasksRouter);
router.use('/api/volunteers', volunteersRouter);
router.use('/api/incidents', incidentsRouter); // Mounting Incident routes

module.exports = router;
