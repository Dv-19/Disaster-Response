// backend/routes/incidents.js

const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const upload = require('../middleware/upload');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Report a new incident
router.post(
  '/',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  upload.array('attachments', 5),
  incidentController.reportIncident
);

// Get all incidents with optional filters
router.get(
  '/',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  incidentController.getIncidents
);

// Update incident status
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('government', 'ngo'),
  incidentController.updateIncidentStatus
);

module.exports = router;
