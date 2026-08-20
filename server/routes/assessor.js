const SECRET_KEY = process.env.SECRET_KEY || "1";
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const router = express.Router();


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

// ==========================================
// การตั้งค่า MULTER สำหรับเก็บไฟล์ PDF
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    // สร้างโฟลเดอร์อัตโนมัติหากยังไม่มีอยู่
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // กำหนดชื่อไฟล์เป็น document_evaluation_{id}_{timestamp}.pdf (1 ไฟล์ต่อรอบ)
    const evaluationId = req.params.evaluation_id || req.body.evaluation_id;
    const uniqueSuffix = Date.now();
    cb(null, `doc_eval_${evaluationId}_${uniqueSuffix}.pdf`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์ PDF เท่านั้น'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาดไม่เกิน 10MB
});

// ดึงข้อมูลเกณฑ์การประเมิน (criteria) พร้อมคะแนนประเมิน (evaluation_scores) ของ evaluation_id นั้นๆ
// ดึงข้อมูลเกณฑ์พร้อม Path ไฟล์หลักฐานเดิม
router.get('/evaluation-criteria/:evaluation_id', async (req, res) => {
  try {
    const evaluation_id = parseInt(req.params.evaluation_id);
    if (isNaN(evaluation_id)) {
      return res.status(400).json({ error: 'รหัส evaluation_id ไม่ถูกต้อง' });
    }

    // ดึง document_path จากตาราง evaluations
    const evalResult = await db.query(
      'SELECT document_path FROM evaluations WHERE evaluation_id = ?', 
      [evaluation_id]
    );

    const queryText = `
      SELECT 
        c.criterion_id, c.section_id, c.title, c.description,
        c.weight, c.evaluation_type, c.requires_evidence,
        c.min_score, c.max_score, es.score_id, es.score, es.comment
      FROM criteria c
      LEFT JOIN evaluation_scores es 
        ON c.criterion_id = es.criterion_id AND es.evaluation_id = ?
      ORDER BY c.section_id ASC, c.criterion_id ASC
    `;

    const criteriaResult = await db.query(queryText, [evaluation_id]);
    
    res.json({
      criteria: criteriaResult,
      document_path: evalResult[0]?.document_path || null
    });
  } catch (err) {
    console.error('Database Query Error:', err); 
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้', details: err.message });
  }
});

// บันทึกคะแนน และ/หรือ อัปโหลดไฟล์เอกสารหลักฐาน
router.post('/save-scores', upload.single('document'), async (req, res) => {
  try {
    const evaluation_id = parseInt(req.body.evaluation_id);
    const scores = JSON.parse(req.body.scores || '[]');

    if (!evaluation_id) {
      return res.status(400).json({ error: 'ไม่พบรหัสการประเมิน' });
    }

    // 1. อัปเดต Path ไฟล์ในตาราง evaluations (ถ้ามีการแนบไฟล์ใหม่เข้ามา)
    if (req.file) {
      const documentPath = `/uploads/documents/${req.file.filename}`;
      await db.query(
        'UPDATE evaluations SET document_path = ? WHERE evaluation_id = ?',
        [documentPath, evaluation_id]
      );
    }

    // 2. บันทึกคะแนนลง evaluation_scores
    const queryText = `
      INSERT INTO evaluation_scores (evaluation_id, criterion_id, score, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        comment = VALUES(comment)
    `;

    for (const item of scores) {
      await db.query(queryText, [
        evaluation_id,
        item.criterion_id,
        item.score ?? null,
        item.comment || null
      ]);
    }

    res.json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error saving evaluation:', err.message);
    res.status(500).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' });
  }
});

module.exports = router;