const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/googleOAuth');
const config = require('./config');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const projectRoutes = require('./routes/projects');
const networkingRoutes = require('./routes/networking');

const app = express();

// Middleware
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/networking', networkingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'College Hub API is running!' });
});

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 To fix this:');
    console.log('   1. Install MongoDB locally, OR');
    console.log('   2. Use MongoDB Atlas (cloud) - https://www.mongodb.com/atlas');
    console.log('   3. Update MONGODB_URI in your .env file');
    process.exit(1);
  });

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
