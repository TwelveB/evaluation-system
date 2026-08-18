const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "1";

// Test Route ดึงข้อมูลเวลาจาก Mariadb
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM assessors');
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

//method post เพิ่มผู้ประเมิน
router.post('/', async (req, res) => {
  try {
    const { username, password, first_name, last_name, phone_number, department } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ทำการ Hash รหัสผ่านก่อนบันทึก (หากมีการส่งรหัสผ่านเข้ามา)
    let finalHash = null;
    if (password && password.trim() !== '') {
      const saltRounds = 10; // ระดับความซับซ้อนของการเข้ารหัส (มาตรฐานคือ 10)
      finalHash = await bcrypt.hash(password, saltRounds);
    }

    const queryText = `
      INSERT INTO assessors (
        username, 
        password_hash, 
        phone_number,
        first_name, 
        last_name,
        department
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      username,
      finalHash,
      phone_number || null,
      first_name,
      last_name,
      department || null,
    ];
    
    const newAssessor = await db.query(queryText, values);

    const newAssessorId = Number(newAssessor.insertId);

    // 3. SELECT ข้อมูลของแถวนั้นออกมา (เลียนแบบพฤติกรรม RETURNING)
    const selectQuery = `
      SELECT assessor_id, username, first_name, last_name, phone_number 
      FROM assessors 
      WHERE assessor_id = ?
    `;
    const assessorData = await db.query(selectQuery, [newAssessorId]);

    res.status(201).json(assessorData[0]);
  } catch (err) {
    console.error('Database Connection Error:', err.message);

    if (err.code === '1062') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/showEvaluationStudent/:id', async (req, res) => {
  try {
    const student_id = parseInt(req.params.id);
    const result = await db.query(`SELECT s.student_id , s.first_name AS student_first_name, s.last_name AS student_last_name,
       s.status, e.title AS evaluation_title, e.evaluation_id,
      a.first_name AS assessor_first_name, a.last_name AS assessor_last_name FROM students s 
      JOIN evaluations e ON s.student_id = e.student_id
      LEFT JOIN assessors a ON a.assessor_id = e.assessor_id
      WHERE ? = e.student_id`, [student_id]);
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

router.get('/showEvaluations', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM evaluations');
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

router.get('/showCriteria', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM criteria');
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

router.get('/showEvaluations:id=:id', async (req, res) => {
  try {
    const student_id = parseInt(req.params.id);
    const result = await db.query('SELECT * FROM evaluations WHERE student_id = ?', [student_id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการประเมินสำหรับ student_id ที่ระบุ' });
    }

    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

module.exports = router;