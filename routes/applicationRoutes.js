// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const { protect, isRecruiter } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // multer instance

// Candidate: Apply to a job (upload resume)
// POST /api/applications/apply/:jobId
router.post(
  '/apply/:jobId',
  protect,
  upload.single('resume'),        // form-data key: 'resume' (file)
  applicationController.applyForJob
);

// Candidate: View own applications
// GET /api/applications/my-applications
router.get('/my-applications', protect, applicationController.getMyApplications);

// Recruiter: View applicants for a job
// GET /api/applications/job/:jobId/applicants
router.get(
  '/job/:jobId/applicants',
  protect,
  isRecruiter,
  applicationController.getApplicantsForJob
);

// Recruiter: Update application status
// PUT /api/applications/:applicationId/status
router.put(
  '/:applicationId/status',
  protect,
  isRecruiter,
  applicationController.updateApplicationStatus
);

module.exports = router;
