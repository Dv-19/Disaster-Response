// backend/models/Incident.js

const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Flood', 'Earthquake', 'Fire', 'Storm', 'Other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  assignTo: [
    {
      type: String,
      enum: [
        'Emergency Services',
        'Public Works',
        'Environmental Agency',
        'Health Department',
        'Law Enforcement',
        // Add more departments/agencies as needed
      ],
      required: true,
    },
  ],
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  attachments: [
    {
      type: String, // File paths or URLs
    },
  ],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Incident', IncidentSchema);
