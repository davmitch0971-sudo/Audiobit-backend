const express = require('express');
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');

const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token provided' });

  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};

// GET all projects
router.get('/', auth, async (req, res) => {
  const projects = await Project.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(projects);
});

// CREATE project
router.post('/', auth, async (req, res) => {
  const { title, lyrics, musicUrl, videoUrl } = req.body;

  const project = new Project({
    user: req.userId,
    title,
    lyrics,
    musicUrl,
    videoUrl
  });

  await project.save();
  res.json(project);
});

module.exports = router;
