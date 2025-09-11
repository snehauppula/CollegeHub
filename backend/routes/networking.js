const express = require('express');
const jwt = require('jsonwebtoken');
const NetworkingProfile = require('../models/NetworkingProfile');
const User = require('../models/User');
const config = require('../config');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// GET /api/networking/profiles - Get all networking profiles with search and filter
router.get('/profiles', async (req, res) => {
  try {
    const { search, skill, page = 1, limit = 12 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { interests: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Skill filter
    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const profiles = await NetworkingProfile.find(query)
      .populate('userId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await NetworkingProfile.countDocuments(query);
    
    res.json({
      success: true,
      data: profiles,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: profiles.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Error fetching networking profiles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching networking profiles' 
    });
  }
});

// GET /api/networking/profiles/:id - Get a specific networking profile
router.get('/profiles/:id', async (req, res) => {
  try {
    const profile = await NetworkingProfile.findById(req.params.id)
      .populate('userId', 'name email profilePicture');
    
    if (!profile || !profile.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching networking profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching networking profile' 
    });
  }
});

// POST /api/networking/profiles - Create a new networking profile
router.post('/profiles', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      major,
      year,
      skills,
      linkedinUrl,
      bio,
      interests,
      location,
      email
    } = req.body;
    
    // Check if user already has an active profile
    const existingProfile = await NetworkingProfile.findOne({ 
      userId: req.user._id, 
      isActive: true 
    });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'You already have a networking profile'
      });
    }
    
    // Validate required fields
    if (!name || !major || !year || !skills || !linkedinUrl || !bio || !interests || !location || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Validate skills and interests arrays
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one skill is required'
      });
    }
    
    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one interest is required'
      });
    }
    
    // Create new profile
    const profile = new NetworkingProfile({
      userId: req.user._id,
      name,
      major,
      year,
      skills,
      linkedinUrl,
      bio,
      interests,
      location,
      email: email.toLowerCase()
    });
    
    await profile.save();
    
    // Populate the user data
    await profile.populate('userId', 'name email profilePicture');
    
    res.status(201).json({
      success: true,
      message: 'Networking profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error creating networking profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error creating networking profile' 
    });
  }
});

// PUT /api/networking/profiles/:id - Update a networking profile
router.put('/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const profile = await NetworkingProfile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    // Check if user owns this profile
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only update your own profile' 
      });
    }
    
    const {
      name,
      major,
      year,
      skills,
      linkedinUrl,
      bio,
      interests,
      location,
      email
    } = req.body;
    
    // Update fields
    if (name) profile.name = name;
    if (major) profile.major = major;
    if (year) profile.year = year;
    if (skills) profile.skills = skills;
    if (linkedinUrl) profile.linkedinUrl = linkedinUrl;
    if (bio) profile.bio = bio;
    if (interests) profile.interests = interests;
    if (location) profile.location = location;
    if (email) profile.email = email.toLowerCase();
    
    profile.updatedAt = Date.now();
    
    await profile.save();
    await profile.populate('userId', 'name email profilePicture');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error updating networking profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error updating networking profile' 
    });
  }
});

// DELETE /api/networking/profiles/:id - Delete a networking profile
router.delete('/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const profile = await NetworkingProfile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    // Check if user owns this profile
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own profile' 
      });
    }
    
    // Soft delete by setting isActive to false
    profile.isActive = false;
    await profile.save();
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting networking profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting networking profile' 
    });
  }
});

// GET /api/networking/my-profile - Get current user's profile
router.get('/my-profile', authenticateToken, async (req, res) => {
  try {
    const profile = await NetworkingProfile.findOne({ 
      userId: req.user._id, 
      isActive: true 
    }).populate('userId', 'name email profilePicture');
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'No profile found' 
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

module.exports = router;
