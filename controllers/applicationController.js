const db = require('../config/db');

// Candidate applies for job
exports.applyForJob = (req, res) => {
  const userId = req.user.id;
  const { jobId } = req.params;
  const resumePath = req.file ? req.file.path : null;

  if (!resumePath) {
    return res.status(400).json({ message: 'Resume upload is required' });
  }

  db.query(
    'INSERT INTO Applications (user_id, job_id, resume) VALUES (?, ?, ?)',
    [userId, jobId, resumePath],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      res.status(201).json({ message: 'Applied successfully', applicationId: result.insertId });
    }
  );
};

// Candidate views their applications
exports.getMyApplications = (req, res) => {
  const userId = req.user.id;
  db.query(
    'SELECT A.application_id, A.status, J.title, J.location FROM Applications A JOIN Jobs J ON A.job_id = J.job_id WHERE A.user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      res.json(results);
    }
  );
};

// Recruiter views applicants for a job
exports.getApplicantsForJob = (req, res) => {
  const recruiterId = req.user.id;
  const { jobId } = req.params;

  db.query(
    'SELECT U.name, U.email, A.status, A.resume FROM Applications A JOIN Users U ON A.user_id = U.user_id JOIN Jobs J ON A.job_id = J.job_id WHERE J.job_id = ? AND J.recruiter_id = ?',
    [jobId, recruiterId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      res.json(results);
    }
  );
};
