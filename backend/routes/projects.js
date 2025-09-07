const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Active' })
      .sort({ createdAt: -1 });
    
    // Convert creatorId to string for consistent comparison
    const projectsWithStringIds = projects.map(project => {
      const projectObj = project.toObject();
      projectObj.creatorId = projectObj.creatorId.toString();
      return projectObj;
    });
    
    res.json({
      success: true,
      projects: projectsWithStringIds
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Convert creatorId to string for consistent comparison
    const projectObj = project.toObject();
    projectObj.creatorId = projectObj.creatorId.toString();

    res.json({
      success: true,
      project: projectObj
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating project with data:', req.body);
    console.log('User creating project:', req.user);
    
    const {
      title,
      description,
      category,
      skills,
      maxMembers,
      currentMembers,
      timeCommitment,
      difficulty
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !maxMembers || !timeCommitment || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const project = new Project({
      title,
      description,
      category,
      skills: skills || [],
      maxMembers: parseInt(maxMembers),
      currentMembers: currentMembers ? parseInt(currentMembers) : 1,
      timeCommitment,
      difficulty,
      creatorId: req.user._id,
      creatorName: req.user.name,
      creatorEmail: req.user.email
    });

    await project.save();

    // Convert creatorId to string for consistent comparison
    const projectObj = project.toObject();
    projectObj.creatorId = projectObj.creatorId.toString();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: projectObj
    });
  } catch (error) {
    console.error('Error creating project:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the creator
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can edit this project'
      });
    }

    const {
      title,
      description,
      category,
      skills,
      maxMembers,
      currentMembers,
      timeCommitment,
      difficulty,
      status
    } = req.body;

    // Update fields
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (skills) project.skills = skills;
    if (maxMembers) project.maxMembers = parseInt(maxMembers);
    if (currentMembers !== undefined) project.currentMembers = parseInt(currentMembers);
    if (timeCommitment) project.timeCommitment = timeCommitment;
    if (difficulty) project.difficulty = difficulty;
    if (status) project.status = status;

    await project.save();

    // Convert creatorId to string for consistent comparison
    const projectObj = project.toObject();
    projectObj.creatorId = projectObj.creatorId.toString();

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: projectObj
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is the creator
    if (project.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project creator can delete this project'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// GET /api/projects/user/:userId - Get projects created by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ creatorId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('creatorId', 'name email profilePicture');
    
    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user projects'
    });
  }
});

module.exports = router;
