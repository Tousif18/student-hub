const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { generateCSVReport, generateExcelReport } = require('../utils/reportGenerator');

const router = express.Router();

// Get all students with their activity counts
router.get('/students', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const { department, yearOfStudy, format = 'json' } = req.query;

    let query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.student_id,
        u.department,
        u.year_of_study,
        COUNT(a.id) as total_activities,
        COUNT(CASE WHEN a.status = 'approved' THEN 1 END) as approved_activities,
        COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_activities,
        COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_activities
      FROM users u
      LEFT JOIN activities a ON u.id = a.student_id
      WHERE u.role = 'student'
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (department) {
      paramCount++;
      conditions.push(`u.department = $${paramCount}`);
      params.push(department);
    }

    if (yearOfStudy) {
      paramCount++;
      conditions.push(`u.year_of_study = $${paramCount}`);
      params.push(parseInt(yearOfStudy));
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' GROUP BY u.id, u.first_name, u.last_name, u.student_id, u.department, u.year_of_study ORDER BY u.last_name, u.first_name';

    const result = await pool.query(query, params);

    if (format === 'csv') {
      const csv = generateCSVReport(result.rows, 'students');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="students_report.csv"');
      return res.send(csv);
    } else if (format === 'excel') {
      const excelBuffer = await generateExcelReport(result.rows, 'students');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="students_report.xlsx"');
      return res.send(excelBuffer);
    }

    res.json({ students: result.rows });
  } catch (error) {
    console.error('Get students report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get detailed activity report
router.get('/activities', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const { status, type, department, yearOfStudy, format = 'json' } = req.query;

    let query = `
      SELECT 
        a.id,
        a.title,
        a.type,
        a.description,
        a.status,
        a.faculty_comment,
        a.created_at,
        a.reviewed_at,
        u.first_name,
        u.last_name,
        u.student_id,
        u.department,
        u.year_of_study,
        reviewer.first_name as reviewer_first_name,
        reviewer.last_name as reviewer_last_name
      FROM activities a
      JOIN users u ON a.student_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
      WHERE u.role = 'student'
    `;

    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      conditions.push(`a.status = $${paramCount}`);
      params.push(status);
    }

    if (type) {
      paramCount++;
      conditions.push(`a.type = $${paramCount}`);
      params.push(type);
    }

    if (department) {
      paramCount++;
      conditions.push(`u.department = $${paramCount}`);
      params.push(department);
    }

    if (yearOfStudy) {
      paramCount++;
      conditions.push(`u.year_of_study = $${paramCount}`);
      params.push(parseInt(yearOfStudy));
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.created_at DESC';

    const result = await pool.query(query, params);

    if (format === 'csv') {
      const csv = generateCSVReport(result.rows, 'activities');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="activities_report.csv"');
      return res.send(csv);
    } else if (format === 'excel') {
      const excelBuffer = await generateExcelReport(result.rows, 'activities');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="activities_report.xlsx"');
      return res.send(excelBuffer);
    }

    res.json({ activities: result.rows });
  } catch (error) {
    console.error('Get activities report error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get department-wise statistics
router.get('/department-stats', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.department,
        COUNT(DISTINCT u.id) as total_students,
        COUNT(a.id) as total_activities,
        COUNT(CASE WHEN a.status = 'approved' THEN 1 END) as approved_activities,
        COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_activities,
        COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_activities,
        ROUND(AVG(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) * 100, 2) as approval_rate
      FROM users u
      LEFT JOIN activities a ON u.id = a.student_id
      WHERE u.role = 'student' AND u.department IS NOT NULL
      GROUP BY u.department
      ORDER BY total_activities DESC
    `);

    res.json({ departmentStats: result.rows });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get year-wise statistics
router.get('/year-stats', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.year_of_study,
        COUNT(DISTINCT u.id) as total_students,
        COUNT(a.id) as total_activities,
        COUNT(CASE WHEN a.status = 'approved' THEN 1 END) as approved_activities,
        COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_activities,
        COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_activities
      FROM users u
      LEFT JOIN activities a ON u.id = a.student_id
      WHERE u.role = 'student' AND u.year_of_study IS NOT NULL
      GROUP BY u.year_of_study
      ORDER BY u.year_of_study
    `);

    res.json({ yearStats: result.rows });
  } catch (error) {
    console.error('Get year stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;