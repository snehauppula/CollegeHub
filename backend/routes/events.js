const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const User = require('../models/User');
const config = require('../config');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// GET /api/events - Get all events (public endpoint)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email clubName')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events' 
    });
  }
});

// GET /api/events/my - Get events created by the authenticated user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch your events' 
    });
  }
});

// POST /api/events - Create a new event (organizers only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is an organizer
    if (!req.user.isOrganizer) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only organizers can create events' 
      });
    }

    const {
      eventName,
      eventDate,
      eventVenue,
      fee,
      gmail,
      phone,
      joinLink,
      description
    } = req.body;

    // Validate required fields
    if (!eventName || !eventDate || !eventVenue || !gmail || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const event = new Event({
      clubName: req.user.clubName,
      eventName,
      eventDate,
      eventVenue,
      fee: fee || 'Free',
      gmail,
      phone,
      joinLink: joinLink || '',
      description: description || '',
      createdBy: req.user._id
    });

    await event.save();
    await event.populate('createdBy', 'name email clubName');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event' 
    });
  }
});

// PUT /api/events/:id - Update an event (only by the creator)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user is the creator of the event
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only edit your own events' 
      });
    }

    const {
      eventName,
      eventDate,
      eventVenue,
      fee,
      gmail,
      phone,
      joinLink,
      description
    } = req.body;

    // Update fields
    if (eventName) event.eventName = eventName;
    if (eventDate) event.eventDate = eventDate;
    if (eventVenue) event.eventVenue = eventVenue;
    if (fee !== undefined) event.fee = fee;
    if (gmail) event.gmail = gmail;
    if (phone) event.phone = phone;
    if (joinLink !== undefined) event.joinLink = joinLink;
    if (description !== undefined) event.description = description;

    await event.save();
    await event.populate('createdBy', 'name email clubName');

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event' 
    });
  }
});

// DELETE /api/events/:id - Delete an event (only by the creator)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user is the creator of the event
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own events' 
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
});

module.exports = router;
