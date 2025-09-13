const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  linkedin: { type: String },
  company: { type: String },
  graduationYear: { type: Number, required: true },
  jobRole: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alumni', AlumniSchema);