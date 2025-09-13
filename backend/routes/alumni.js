// backend/routes/alumni.js
const express = require('express');
const router = express.Router();
const Alumni = require('../models/alumni');

// GET /api/alumni?q=searchTerm  - list or search
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q || '').toString().trim();
    if (!q) {
      const all = await Alumni.find().sort({ createdAt: -1 });
      return res.json(all);
    }
    const regex = new RegExp(q, 'i');
    const orClause = [
      { name: regex },
      { email: regex },
      { company: regex },
      { linkedin: regex },
      { jobRole: regex }
    ];
    if (!isNaN(Number(q))) {
      orClause.push({ graduationYear: Number(q) });
    }
    const results = await Alumni.find({ $or: orClause }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/alumni/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Alumni.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/alumni  (create)
router.post('/', async (req, res) => {
  try {
    const { name, email, linkedin, company, graduationYear, jobRole } = req.body;
    if (!name || !email || !graduationYear || !jobRole) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const exists = await Alumni.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already exists' });

    const newAlumni = new Alumni({ name, email, linkedin, company, graduationYear, jobRole });
    await newAlumni.save();
    res.status(201).json(newAlumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/alumni/:id  (update)
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Alumni.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/alumni/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Alumni.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;