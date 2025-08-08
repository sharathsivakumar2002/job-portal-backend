// backend/controllers/jobController.js
const db = require('../config/db');

/**
 * Recruiter posts a new job
 * Route: POST /api/jobs
 * Protected: yes (protect + isRecruiter)
 */
exports.createJob = (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { title, description, skills_required, salary, location } = req.body;

    if (!title || !description || !skills_required || !salary || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    db.query(
      'INSERT INTO Jobs (title, description, skills_required, salary, location, recruiter_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, skills_required, salary, location, recruiterId],
      (err, result) => {
        if (err) {
          console.error('DB Error (createJob):', err);
          return res.status(500).json({ message: 'DB Error', error: err });
        }
        return res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
      }
    );
  } catch (err) {
    console.error('createJob error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get all jobs
 * Route: GET /api/jobs
 * Public
 */
exports.getAllJobs = (req, res) => {
  try {
    db.query('SELECT * FROM Jobs ORDER BY job_id DESC', (err, results) => {
      if (err) {
        console.error('DB Error (getAllJobs):', err);
        return res.status(500).json({ message: 'DB Error', error: err });
      }
      return res.json(results);
    });
  } catch (err) {
    console.error('getAllJobs error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get a single job by ID
 * Route: GET /api/jobs/:jobId
 * Public
 */
exports.getJobById = (req, res) => {
  try {
    const { jobId } = req.params;
    db.query('SELECT * FROM Jobs WHERE job_id = ?', [jobId], (err, results) => {
      if (err) {
        console.error('DB Error (getJobById):', err);
        return res.status(500).json({ message: 'DB Error', error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Job not found' });
      }
      return res.json(results[0]);
    });
  } catch (err) {
    console.error('getJobById error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Recruiter updates a job
 * Route: PUT /api/jobs/:jobId
 * Protected: yes (protect + isRecruiter)
 */
exports.updateJob = (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;
    const { title, description, skills_required, salary, location } = req.body;

    db.query(
      'UPDATE Jobs SET title=?, description=?, skills_required=?, salary=?, location=? WHERE job_id=? AND recruiter_id=?',
      [title, description, skills_required, salary, location, jobId, recruiterId],
      (err, result) => {
        if (err) {
          console.error('DB Error (updateJob):', err);
          return res.status(500).json({ message: 'DB Error', error: err });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        return res.json({ message: 'Job updated successfully' });
      }
    );
  } catch (err) {
    console.error('updateJob error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Recruiter deletes a job
 * Route: DELETE /api/jobs/:jobId
 * Protected: yes (protect + isRecruiter)
 */
exports.deleteJob = (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { jobId } = req.params;

    db.query(
      'DELETE FROM Jobs WHERE job_id=? AND recruiter_id=?',
      [jobId, recruiterId],
      (err, result) => {
        if (err) {
          console.error('DB Error (deleteJob):', err);
          return res.status(500).json({ message: 'DB Error', error: err });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        return res.json({ message: 'Job deleted successfully' });
      }
    );
  } catch (err) {
    console.error('deleteJob error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
