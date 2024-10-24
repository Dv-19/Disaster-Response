const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['public', 'volunteer', 'government', 'ngo'],
    default: 'public',
  },
  phoneNumber: String,
  emergencyContacts: [String],
  locality: String,
  skills: [String],
});

const User = mongoose.model('User', userSchema);

// DistressSignal Model
const distressSignalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ['Active', 'In Progress', 'Resolved'], // Updated enum
    default: 'Active',
  },
  timestamp: { type: Date, default: Date.now },
});

const DistressSignal = mongoose.model('DistressSignal', distressSignalSchema);

// ResourceRequest Model
const resourceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceType: String,
  quantity: Number,
  location: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined'],
    default: 'Pending',
  },
  timestamp: { type: Date, default: Date.now },
});

const ResourceRequest = mongoose.model('ResourceRequest', resourceRequestSchema);

// Resource Model
const resourceSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
});

const Resource = mongoose.model('Resource', resourceSchema);

// VolunteerTask Model
const volunteerTaskSchema = new mongoose.Schema({
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['Assigned', 'In Progress', 'Completed'],
    default: 'Assigned',
  },
  timestamp: { type: Date, default: Date.now },
});

const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

module.exports = {
  User,
  DistressSignal,
  ResourceRequest,
  Resource,
  VolunteerTask, // Don't forget to export new models
};
