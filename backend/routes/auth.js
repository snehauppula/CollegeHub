const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ORGANIZER_EMAILS } = require('../config/organizers');
const passport = require('../config/googleOAuth');
const config = require('../config');
const router = express.Router();

// Traditional login endpoint removed - Google OAuth only
// Register endpoint (for both users and organizers)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, userId, clubName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Check if email is in organizer list
    const isOrganizer = ORGANIZER_EMAILS.includes(email.toLowerCase());

    // Validate required fields based on user type
    if (isOrganizer && !clubName) {
      return res.status(400).json({
        success: false,
        message: 'Club name is required for organizers'
      });
    }

    if (!isOrganizer && !userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required for regular users'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      isOrganizer,
      userId: isOrganizer ? undefined : userId,
      clubName: isOrganizer ? clubName : undefined
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: `${isOrganizer ? 'Organizer' : 'User'} account created successfully`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isOrganizer: user.isOrganizer,
        userId: user.userId,
        clubName: user.clubName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: req.user._id,
          email: req.user.email,
          isOrganizer: req.user.isOrganizer
        },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      res.redirect(`${config.FRONTEND_URL}/login?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        isOrganizer: req.user.isOrganizer,
        userId: req.user.userId,
        clubName: req.user.clubName,
        profilePicture: req.user.profilePicture
      }))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${config.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// Verify JWT token endpoint
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isOrganizer: user.isOrganizer,
        userId: user.userId,
        clubName: user.clubName,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

module.exports = router;
