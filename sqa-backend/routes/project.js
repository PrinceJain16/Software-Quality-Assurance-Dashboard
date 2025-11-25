const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, startDate, endDate, technologies, teamMembers } = req.body;

    const project = new Project({
      name,
      description,
      startDate,
      endDate,
      technologies,
      teamMembers,
      user: req.user.id
    });

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { metrics, ...otherFields } = req.body;
        
        const setFields = { ...otherFields };
        if (metrics) {
            if (metrics.requirement) {
                setFields['metrics.requirement'] = metrics.requirement;
            }
            if (metrics.design) {
                setFields['metrics.design'] = metrics.design;
            }
            if (metrics.implementation) {
                setFields['metrics.implementation'] = metrics.implementation;
            }
            if (metrics.testing) {
                setFields['metrics.testing'] = metrics.testing;
            }
            if (metrics.deployment) {
                setFields['metrics.deployment'] = metrics.deployment;
            }
        }
        
        if (Object.keys(setFields).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update.' });
        }

        const updated = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: setFields },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Project not found or unauthorized' });
        }

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
