const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'DB Error', error: err });

        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB Error', error: err });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ message: 'Login successful', token });
  });
};
