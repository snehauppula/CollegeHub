const mongoose = require('mongoose');

const networkingProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
  },
  skills: [{
    type: String,
    required: true
  }],
  linkedinUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v);
      },
      message: 'Please provide a valid LinkedIn URL'
    }
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  interests: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
networkingProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
networkingProfileSchema.index({ skills: 1 });
networkingProfileSchema.index({ major: 1 });
networkingProfileSchema.index({ location: 1 });
networkingProfileSchema.index({ isActive: 1 });

module.exports = mongoose.model('NetworkingProfile', networkingProfileSchema);
