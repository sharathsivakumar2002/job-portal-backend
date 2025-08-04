const express = require('express');
const router = express.Router();
const { addJob, getAllJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Recruiter creates job
router.post('/add', protect, addJob);

// Get all jobs
router.get('/', getAllJobs);

// Get single job by ID
router.get('/:id', getJobById);

module.exports = router;
