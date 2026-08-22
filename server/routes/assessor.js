const SECRET_KEY = process.env.SECRET_KEY || "1";
const express = require('express');
const bcrypt = require('bcrypt'); // ใช้สำหรับเข้ารหัสผ่าน (Hashing)
const jwt = require('jsonwebtoken'); // ใช้สำหรับทำ Token (แม้ในไฟล์นี้จะยังไม่ได้ใช้โดยตรง)
const cors = require('cors');
const db = require('../db'); // เชื่อมต่อฐานข้อมูล
const path = require('path');
const fs = require('fs'); // ใช้จัดการไฟล์/โฟลเดอร์ในระบบ
const multer = require('multer'); // ไลบรารีสำหรับจัดการการอัปโหลดไฟล์ (File Upload)
require('dotenv').config();

const router = express.Router(); // สร้างตัวจัดการเส้นทาง (Router)

// ==========================================
// Test Route: ดึงข้อมูลผู้ประเมินทั้งหมดจากฐานข้อมูล
// ==========================================
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM assessors');
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

// ==========================================
// Method POST: เพิ่มผู้ประเมินคนใหม่เข้าสู่ระบบ
// ==========================================
router.post('/', async (req, res) => {
  try {
    // รับข้อมูลจาก Frontend
    const { username, password, first_name, last_name, phone_number, department } = req.body;
    
    // ตรวจสอบว่ากรอกข้อมูลสำคัญครบหรือไม่
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ทำการเข้ารหัสผ่าน (Hash) ก่อนบันทึกลงฐานข้อมูล เพื่อความปลอดภัย
    let finalHash = null;
    if (password && password.trim() !== '') {
      const saltRounds = 10; // ระดับความซับซ้อนของการเข้ารหัส (มาตรฐานคือ 10)
      finalHash = await bcrypt.hash(password, saltRounds);
    }

    // เตรียมคำสั่ง SQL สำหรับเพิ่มข้อมูล
    const queryText = `
      INSERT INTO assessors (username, password_hash, phone_number, first_name, last_name, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [username, finalHash, phone_number || null, first_name, last_name, department || null];
    
    // สั่งรัน SQL
    const newAssessor = await db.query(queryText, values);
    const newAssessorId = Number(newAssessor.insertId); // รับ ID ของผู้ประเมินที่เพิ่งถูกสร้าง

    // ดึงข้อมูลผู้ประเมินที่เพิ่งสร้างขึ้นมาเพื่อส่งกลับไปให้ Frontend (ไม่ส่งรหัสผ่านกลับไป)
    const selectQuery = `
      SELECT assessor_id, username, first_name, last_name, phone_number 
      FROM assessors 
      WHERE assessor_id = ?
    `;
    const assessorData = await db.query(selectQuery, [newAssessorId]);

    res.status(201).json(assessorData[0]); // ส่งสถานะ 201 (Created) สำเร็จ
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    // ดักจับ Error กรณี Username/Email ซ้ำในฐานข้อมูล
    if (err.code === '1062') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

// ==========================================
// API: ดึงข้อมูลการประเมินของนักศึกษา (พร้อม Join ข้อมูลจากหลายตาราง)
// ==========================================
router.get('/showEvaluationStudent/:id', async (req, res) => {
  try {
    const student_id = parseInt(req.params.id);
    const result = await db.query(`
      SELECT s.student_id, s.first_name AS student_first_name, s.last_name AS student_last_name,
             s.status, e.title AS evaluation_title, e.evaluation_id,
             a.first_name AS assessor_first_name, a.last_name AS assessor_last_name 
      FROM students s 
      JOIN evaluations e ON s.student_id = e.student_id
      LEFT JOIN assessors a ON a.assessor_id = e.assessor_id
      WHERE e.student_id = ?
    `, [student_id]);
    res.json(result);
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

// ==========================================
// API: ดึงข้อมูลการประเมินตาม ID ของนักศึกษา (ดึงแค่ตาราง evaluations)
// ==========================================
router.get('/showEvaluations/:id', async (req, res) => {
  try {
    const student_id = parseInt(req.params.id);
    const result = await db.query(`SELECT e.evaluation_id, e.title, e.start_date, a.first_name, a.last_name FROM evaluations e 
      JOIN assessors a ON e.assessor_id = a.assessor_id
      WHERE e.student_id = ?`, [student_id]);

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
// การตั้งค่า MULTER สำหรับจัดการและเก็บไฟล์ PDF ที่อัปโหลดเข้ามา
// ==========================================
const storage = multer.diskStorage({
  // กำหนดโฟลเดอร์ปลายทางที่จะเก็บไฟล์
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/documents');
    // ถ้าโฟลเดอร์ยังไม่มีอยู่ ให้ระบบสร้างขึ้นมาอัตโนมัติ (recursive: true)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // ส่ง path กลับไปให้ multer
  },
  // กำหนดชื่อไฟล์ใหม่ เพื่อป้องกันชื่อไฟล์ซ้ำกัน
  filename: (req, file, cb) => {
    const evaluationId = req.params.evaluation_id || req.body.evaluation_id;
    const uniqueSuffix = Date.now(); // ใช้เวลาปัจจุบันมาต่อท้ายชื่อไฟล์
    cb(null, `doc_eval_${evaluationId}_${uniqueSuffix}.pdf`);
  }
});

// นำการตั้งค่า storage ไปสร้างเป็น middleware ของ multer
const upload = multer({
  storage: storage,
  // คัดกรองไฟล์: อนุญาตเฉพาะไฟล์นามสกุล .pdf เท่านั้น
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์ PDF เท่านั้น'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาดไฟล์สูงสุดไม่เกิน 10MB
});

// ==========================================
// API: ดึงข้อมูล "เกณฑ์การประเมิน" (Criteria) และคะแนนที่เคยให้ไว้
// ==========================================
router.get('/evaluation-criteria/:evaluation_id', async (req, res) => {
  try {
    const evaluation_id = parseInt(req.params.evaluation_id);
    if (isNaN(evaluation_id)) {
      return res.status(400).json({ error: 'รหัส evaluation_id ไม่ถูกต้อง' });
    }

    // 1. ดึงข้อมูล Path ไฟล์หลักฐาน (PDF) ที่เคยอัปโหลดไว้จากตาราง evaluations
    const evalResult = await db.query(
      'SELECT document_path FROM evaluations WHERE evaluation_id = ?', 
      [evaluation_id]
    );

    // 2. ดึงรายการเกณฑ์การประเมิน (criteria) และนำมา Join กับคะแนน (evaluation_scores) หากเคยมีการให้คะแนนแล้ว
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
    
    // ส่งข้อมูลกลับไปให้ Frontend 2 ส่วน คือ ข้อมูลเกณฑ์+คะแนน และ Path ของไฟล์
    res.json({
      criteria: criteriaResult,
      document_path: evalResult[0]?.document_path || null
    });
  } catch (err) {
    console.error('Database Query Error:', err); 
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลได้', details: err.message });
  }
});

// ==========================================
// API: บันทึกคะแนน และ อัปโหลดไฟล์เอกสารหลักฐาน
// หมายเหตุ: ใช้ middleware `upload.single('document')` เพื่อดักจับไฟล์ที่ส่งมากับ key ชื่อ 'document'
// ==========================================
router.post('/save-scores', upload.single('document'), async (req, res) => {
  try {
    const evaluation_id = parseInt(req.body.evaluation_id);
    // แปลงข้อมูลคะแนนที่ส่งมาเป็น JSON String ให้กลับเป็น Array/Object
    const scores = JSON.parse(req.body.scores || '[]');

    if (!evaluation_id) {
      return res.status(400).json({ error: 'ไม่พบรหัสการประเมิน' });
    }

    // 1. ถ้ามีไฟล์แนบเข้ามา (req.file มีค่า) ให้อัปเดต Path ของไฟล์ใหม่ลงตาราง evaluations
    if (req.file) {
      const documentPath = `/uploads/documents/${req.file.filename}`;
      await db.query(
        'UPDATE evaluations SET document_path = ? WHERE evaluation_id = ?',
        [documentPath, evaluation_id]
      );
    }

    // 2. เตรียมคำสั่ง SQL สำหรับบันทึกคะแนน
    // ใช้ ON DUPLICATE KEY UPDATE: ถ้ายังไม่เคยให้คะแนนจะทำการ INSERT แต่ถ้าเคยให้แล้ว(ซ้ำ)จะทำการ UPDATE
    const queryText = `
      INSERT INTO evaluation_scores (evaluation_id, criterion_id, score, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        comment = VALUES(comment)
    `;

    // 3. วนลูปบันทึกคะแนนและคอมเมนต์ของแต่ละหัวข้อเกณฑ์ประเมิน
    for (const item of scores) {
      await db.query(queryText, [
        evaluation_id,
        item.criterion_id,
        item.score ?? null, // ถ้าไม่มีคะแนนให้ใส่ NULL
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