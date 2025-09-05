const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { generatePortfolioPDF } = require('../utils/pdfGenerator');

const router = express.Router();

// Generate and download portfolio PDF
router.get('/download', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student details
    const studentResult = await pool.query(
      'SELECT first_name, last_name, student_id, department, year_of_study FROM users WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentResult.rows[0];

    // Get approved activities
    const activitiesResult = await pool.query(
      'SELECT * FROM activities WHERE student_id = $1 AND status = $2 ORDER BY created_at DESC',
      [studentId, 'approved']
    );

    const activities = activitiesResult.rows;

    // Generate PDF
    const pdfBuffer = await generatePortfolioPDF(student, activities);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio_${student.student_id || student.first_name}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Portfolio generation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get portfolio data (for preview)
router.get('/data', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student details
    const studentResult = await pool.query(
      'SELECT first_name, last_name, student_id, department, year_of_study FROM users WHERE id = $1',
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentResult.rows[0];

    // Get approved activities
    const activitiesResult = await pool.query(
      'SELECT * FROM activities WHERE student_id = $1 AND status = $2 ORDER BY created_at DESC',
      [studentId, 'approved']
    );

    const activities = activitiesResult.rows;

    res.json({
      student,
      activities,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get portfolio data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;