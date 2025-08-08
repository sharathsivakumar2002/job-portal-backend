// backend/controllers/applicationController.js
const db = require('../config/db');

/**
 * Candidate applies for a job (with resume upload)
 * Route: POST /api/applications/apply/:jobId
 * Protected: yes (protect)
 * Body: form-data with key 'resume' (file)
 */
exports.applyForJob = (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware
    const jobId = req.params.jobId;
    const resumeFilename = req.file ? req.file.filename : null;

    if (!resumeFilename) {
      return res.status(400).json({ message: 'Resume upload is required (PDF).' });
    }

    // Prevent duplicate application
    db.query(
      'SELECT * FROM Applications WHERE user_id = ? AND job_id = ?',
      [userId, jobId],
      (selectErr, selectResults) => {
        if (selectErr) {
          console.error('DB Error (select):', selectErr);
          return res.status(500).json({ message: 'DB Error', error: selectErr });
        }

        if (selectResults.length > 0) {
          return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        // Insert application
        db.query(
          'INSERT INTO Applications (user_id, job_id, resume) VALUES (?, ?, ?)',
          [userId, jobId, resumeFilename],
          (insertErr, insertResult) => {
            if (insertErr) {
              console.error('DB Error (insert):', insertErr);
              return res.status(500).json({ message: 'DB Error', error: insertErr });
            }
            return res.status(201).json({
              message: 'Applied successfully',
              applicationId: insertResult.insertId
            });
          }
        );
      }
    );
  } catch (err) {
    console.error('applyForJob error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Candidate views their applications
 * Route: GET /api/applications/my-applications
 * Protected: yes (protect)
 */
exports.getMyApplications = (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        A.application_id,
        A.status,
        A.resume,
        J.job_id,
        J.title,
        J.location,
        J.salary
      FROM Applications A
      JOIN Jobs J ON A.job_id = J.job_id
      WHERE A.user_id = ?
      ORDER BY A.application_id DESC
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('DB Error (getMyApplications):', err);
        return res.status(500).json({ message: 'DB Error', error: err });
      }
      return res.json(results);
    });
  } catch (err) {
    console.error('getMyApplications error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Recruiter views applicants for a specific job
 * Route: GET /api/applications/job/:jobId/applicants
 * Protected: yes (protect + isRecruiter)
 */
exports.getApplicantsForJob = (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobId = req.params.jobId;

    const sql = `
      SELECT 
        A.application_id,
        A.status,
        A.resume,
        U.user_id,
        U.name,
        U.email
      FROM Applications A
      JOIN Users U ON A.user_id = U.user_id
      JOIN Jobs J ON A.job_id = J.job_id
      WHERE J.job_id = ? AND J.recruiter_id = ?
      ORDER BY A.application_id DESC
    `;

    db.query(sql, [jobId, recruiterId], (err, results) => {
      if (err) {
        console.error('DB Error (getApplicantsForJob):', err);
        return res.status(500).json({ message: 'DB Error', error: err });
      }
      return res.json(results);
    });
  } catch (err) {
    console.error('getApplicantsForJob error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Recruiter updates application status (e.g., Reviewed, Selected, Rejected)
 * Route: PUT /api/applications/:applicationId/status
 * Protected: yes (protect + isRecruiter)
 * Body: { status: "Shortlisted" }
 */
exports.updateApplicationStatus = (req, res) => {
  try {
    const recruiterId = req.user.id;
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required in request body.' });
    }

    const sql = `
      UPDATE Applications A
      JOIN Jobs J ON A.job_id = J.job_id
      SET A.status = ?
      WHERE A.application_id = ? AND J.recruiter_id = ?
    `;

    db.query(sql, [status, applicationId, recruiterId], (err, result) => {
      if (err) {
        console.error('DB Error (updateApplicationStatus):', err);
        return res.status(500).json({ message: 'DB Error', error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Application not found or unauthorized' });
      }

      return res.json({ message: 'Application status updated successfully' });
    });
  } catch (err) {
    console.error('updateApplicationStatus error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
