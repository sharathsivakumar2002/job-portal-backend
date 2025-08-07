const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Middleware for handling resume file uploads

// Candidate: Apply to a job
router.post(
  '/apply',
  authenticate,
  upload.single('resume'),
  applicationController.applyToJob
);

// Candidate: View their own applications
router.get(
  '/my-applications',
  authenticate,
  applicationController.getCandidateApplications
);

// Recruiter: View applicants for a specific job
router.get(
  '/job/:jobId',
  authenticate,
  applicationController.getJobApplicants
);

// Recruiter: Update the status of a job application
router.put(
  '/status/:appId',
  authenticate,
  applicationController.updateStatus
);

module.exports = router;
