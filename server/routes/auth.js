const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, studentId, department, yearOfStudy, phone } = req.body;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if student ID already exists (for students)
    if (role === 'student' && studentId) {
      const existingStudent = await pool.query('SELECT id FROM users WHERE student_id = $1', [studentId]);
      if (existingStudent.rows.length > 0) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, student_id, department, year_of_study, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, role, first_name, last_name, student_id, department, year_of_study`,
      [email, passwordHash, role, firstName, lastName, studentId || null, department || null, yearOfStudy || null, phone || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        studentId: user.student_id,
        department: user.department,
        yearOfStudy: user.year_of_study
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, role, first_name, last_name, student_id, department, year_of_study FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        studentId: user.student_id,
        department: user.department,
        yearOfStudy: user.year_of_study
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        studentId: req.user.student_id,
        department: req.user.department,
        yearOfStudy: req.user.year_of_study
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, department, yearOfStudy, phone } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, department = $3, year_of_study = $4, phone = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING id, email, role, first_name, last_name, student_id, department, year_of_study, phone`,
      [firstName, lastName, department, yearOfStudy, phone, userId]
    );

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        studentId: user.student_id,
        department: user.department,
        yearOfStudy: user.year_of_study,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;