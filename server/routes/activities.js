const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all activities (for faculty/admin)
router.get('/', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.first_name, u.last_name, u.student_id, u.department, u.year_of_study,
             reviewer.first_name as reviewer_first_name, reviewer.last_name as reviewer_last_name
      FROM activities a
      JOIN users u ON a.student_id = u.id
      LEFT JOIN users reviewer ON a.reviewed_by = reviewer.id
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

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM activities a JOIN users u ON a.student_id = u.id';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, params.slice(0, -2));

    res.json({
      activities: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].count / limit),
        totalItems: parseInt(countResult.rows[0].count),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get student's own activities
router.get('/my-activities', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const { status, type } = req.query;
    const studentId = req.user.id;

    let query = 'SELECT * FROM activities WHERE student_id = $1';
    const params = [studentId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ activities: result.rows });
  } catch (error) {
    console.error('Get my activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit new activity
router.post('/', authenticateToken, requireRole(['student']), upload.single('proof'), async (req, res) => {
  try {
    const { title, type, description } = req.body;
    const studentId = req.user.id;
    const proofFilePath = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO activities (student_id, title, type, description, proof_file_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [studentId, title, type, description, proofFilePath]
    );

    res.status(201).json({
      message: 'Activity submitted successfully',
      activity: result.rows[0]
    });
  } catch (error) {
    console.error('Submit activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update activity (student can only update pending activities)
router.put('/:id', authenticateToken, requireRole(['student']), upload.single('proof'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description } = req.body;
    const studentId = req.user.id;

    // Check if activity exists and belongs to student
    const existingActivity = await pool.query(
      'SELECT * FROM activities WHERE id = $1 AND student_id = $2',
      [id, studentId]
    );

    if (existingActivity.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (existingActivity.rows[0].status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update non-pending activity' });
    }

    const updateFields = [];
    const params = [];
    let paramCount = 0;

    if (title) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      params.push(title);
    }

    if (type) {
      paramCount++;
      updateFields.push(`type = $${paramCount}`);
      params.push(type);
    }

    if (description) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      params.push(description);
    }

    if (req.file) {
      paramCount++;
      updateFields.push(`proof_file_path = $${paramCount}`);
      params.push(req.file.path);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const result = await pool.query(
      `UPDATE activities SET ${updateFields.join(', ')} WHERE id = $${paramCount} AND student_id = $${paramCount + 1} RETURNING *`,
      [...params, studentId]
    );

    res.json({
      message: 'Activity updated successfully',
      activity: result.rows[0]
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Review activity (faculty/admin)
router.put('/:id/review', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const reviewerId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }

    const result = await pool.query(
      `UPDATE activities SET status = $1, faculty_comment = $2, reviewed_by = $3, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [status, comment, reviewerId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      message: 'Activity reviewed successfully',
      activity: result.rows[0]
    });
  } catch (error) {
    console.error('Review activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get activity types
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activity_types WHERE is_active = true ORDER BY name');
    res.json({ types: result.rows });
  } catch (error) {
    console.error('Get activity types error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get activity statistics
router.get('/stats', authenticateToken, requireRole(['faculty', 'admin']), async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM activities 
      GROUP BY status
    `);

    const typeStats = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count
      FROM activities 
      GROUP BY type
      ORDER BY count DESC
    `);

    const monthlyStats = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM activities 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    res.json({
      statusStats: stats.rows,
      typeStats: typeStats.rows,
      monthlyStats: monthlyStats.rows
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;