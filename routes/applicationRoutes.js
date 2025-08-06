const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getApplicantsForJob } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Candidate applies for a job
router.post('/apply/:jobId', protect, upload.single('resume'), applyForJob);

// Candidate views own applications
router.get('/my-applications', protect, getMyApplications);

// Recruiter views applicants for a job
router.get('/job/:jobId/applicants', protect, getApplicantsForJob);

module.exports = router;
