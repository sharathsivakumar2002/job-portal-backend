// backend/routes/jobRoutes.js
const express = require('express');
const router = express.Router();

const jobController = require('../controllers/jobController');
const { protect, isRecruiter } = require('../middleware/authMiddleware');

// Create a new job (Recruiter only)
router.post('/', protect, isRecruiter, jobController.createJob);

// Get all jobs (Public)
router.get('/', jobController.getAllJobs);

// Get a job by ID (Public)
router.get('/:jobId', jobController.getJobById);

// Update a job (Recruiter only)
router.put('/:jobId', protect, isRecruiter, jobController.updateJob);

// Delete a job (Recruiter only)
router.delete('/:jobId', protect, isRecruiter, jobController.deleteJob);

module.exports = router;
