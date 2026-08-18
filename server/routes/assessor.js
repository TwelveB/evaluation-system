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

// router.get('/showEvaluations', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM evaluations');
//     res.json(result);
//   } catch (err) {
//     console.error('Database Connection Error:', err.message);
//     res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
//   }
// });

// router.get('/showCriteria', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM criteria');
//     res.json(result);
//   } catch (err) {
//     console.error('Database Connection Error:', err.message);
//     res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
//   }
// });

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

// ดึงข้อมูลเกณฑ์การประเมิน (criteria) พร้อมคะแนนประเมิน (evaluation_scores) ของ evaluation_id นั้นๆ
router.get('/evaluation-criteria/:evaluation_id', async (req, res) => {
  try {
    const evaluation_id = parseInt(req.params.evaluation_id);

    // เช็คว่าส่งค่า ID มาเป็นตัวเลขถูกต้องหรือไม่
    if (isNaN(evaluation_id)) {
      return res.status(400).json({ error: 'รหัส evaluation_id ไม่ถูกต้อง' });
    }

    const queryText = `
      SELECT 
        c.criterion_id,
        c.section_id,
        c.title,
        c.description,
        c.weight,
        c.evaluation_type,
        c.requires_evidence,
        c.min_score,
        c.max_score,
        es.score_id,
        es.score,
        es.comment
      FROM criteria c
      LEFT JOIN evaluation_scores es 
        ON c.criterion_id = es.criterion_id 
        AND es.evaluation_id = ?
      ORDER BY c.section_id ASC, c.criterion_id ASC
    `;

    const result = await db.query(queryText, [evaluation_id]);
    
    // ส่งผลลัพธ์กลับไป (หากใช้ mariadb driver บางตัว ตัวแปรอาจจะซ้อนอยู่ใน result หรือ rows)
    res.json(result);
  } catch (err) {
    // 💡 ดูข้อความ Error ที่แท้จริงตรงนี้ใน Terminal
    console.error('Database Query Error:', err); 
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลเกณฑ์การประเมินได้', details: err.message });
  }
});

// บันทึกคะแนนประเมิน (บันทึกใหม่ หรือ อัปเดตหากมีคีย์ซ้ำ)
router.post('/save-scores', async (req, res) => {
  try {
    // scores Expected Format: [{ evaluation_id, criterion_id, score, comment }, ...]
    const { scores } = req.body;

    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({ error: 'กรุณาส่งข้อมูลคะแนนประเมิน' });
    }

    const queryText = `
      INSERT INTO evaluation_scores (evaluation_id, criterion_id, score, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        comment = VALUES(comment)
    `;

    // บันทึกแบบวนลูปทีละรายการ หรือลูปประมวลผลทั้งหมด
    for (const item of scores) {
      await db.query(queryText, [
        item.evaluation_id,
        item.criterion_id,
        item.score ?? null,
        item.comment || null
      ]);
    }

    res.json({ message: 'บันทึกคะแนนเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error saving evaluation scores:', err.message);
    res.status(500).json({ error: 'ไม่สามารถบันทึกคะแนนได้' });
  }
});

module.exports = router;