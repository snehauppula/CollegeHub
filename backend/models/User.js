const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Only required if not using Google OAuth
    }
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isOrganizer: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: function() {
      return !this.isOrganizer && !this.googleId; // Not required for Google OAuth users
    }
  },
  clubName: {
    type: String,
    required: function() {
      return this.isOrganizer;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
