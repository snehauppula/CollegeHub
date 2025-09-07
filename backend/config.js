require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/collegehub',
  PORT: process.env.PORT || 5000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  JWT_SECRET: process.env.JWT_SECRET || 'collegehub-super-secret-jwt-key-2024',
  SESSION_SECRET: process.env.SESSION_SECRET || 'collegehub-session-secret-key-2024',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
