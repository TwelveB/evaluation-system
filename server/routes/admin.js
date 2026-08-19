const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "1";

// Test Route ดึงข้อมูลเวลาจาก PostgreSQL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM admins');
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

// ===============================================
// API 1: จัดการตัวชี้วัด (Criteria API)
// ===============================================

// ดึงรายการตัวชี้วัดทั้งหมด
router.get('/criteria', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM criteria ORDER BY criterion_id ASC');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลตัวชี้วัด' });
  }
});

// เพิ่มตัวชี้วัดใหม่
router.post('/criteria', async (req, res) => {
  const { title, description, weight, evaluation_type, min_score, max_score } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO criteria (title, description, weight, evaluation_type, min_score, max_score) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, weight || 1, evaluation_type || 'SCALE', min_score || 1, max_score || 5]
    );
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถบันทึกตัวชี้วัดได้' });
  }
});

// ===============================================
// API 2: จัดการรอบการประเมินให้นักเรียน (Evaluations API)
// ===============================================

// สร้างรอบการประเมินใหม่ให้นักเรียน
router.post('/evaluations', async (req, res) => {
  const { title, student_id, assessor_id, evaluation_date } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO evaluations (title, student_id, assessor_id, evaluation_date, status) 
       VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
      [title, student_id, assessor_id, evaluation_date || new Date()]
    );
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถสร้างรอบการประเมินได้' });
  }
});

module.exports = router;