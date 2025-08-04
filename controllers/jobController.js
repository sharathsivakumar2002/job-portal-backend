const db = require('../config/db');

// Add Job (Recruiter only)
exports.addJob = (req, res) => {
  const { title, description, skills_required, salary, location } = req.body;

  if (!title || !description || !skills_required || !salary || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const recruiterId = req.user.id; // From JWT

  db.query(
    'INSERT INTO Jobs (title, description, skills_required, salary, location, recruiter_id) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, skills_required, salary, location, recruiterId],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      return res.status(201).json({ message: 'Job posted successfully', jobId: result.insertId });
    }
  );
};

// Get All Jobs
exports.getAllJobs = (req, res) => {
    db.query('SELECT * FROM Jobs', (err, results) => {
      if (err) {
        console.error('DB Error:', err); // log actual error
        return res.status(500).json({ message: 'DB Error', error: err });
      }
      return res.json(results);
    });
  };
  
// Get Job by ID
exports.getJobById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Jobs WHERE job_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Job not found' });
    return res.json(results[0]);
  });
};
