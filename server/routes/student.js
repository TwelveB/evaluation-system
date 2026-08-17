const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
// const app = express();

// Middleware
// router.use(cors());
// app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "1";

// Test Route ดึงข้อมูลเวลาจาก PostgreSQL
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM studenttb');
    res.json(result);
    // const result = await db.query('SELECT NOW()');
    // res.json({
    //    message: 'เชื่อมต่อ Mariadb สำเร็จ!',
    //    db_time: result[0].now,
    // });
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

//method post เพิ่มนักเรียน
router.post('/', async (req, res) => {
  try {
    const { email, password, first_name, last_name, number } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ทำการ Hash รหัสผ่านก่อนบันทึก (หากมีการส่งรหัสผ่านเข้ามา)
    let finalHash = null;
    if (password && password.trim() !== '') {
      const saltRounds = 10; // ระดับความซับซ้อนของการเข้ารหัส (มาตรฐานคือ 10)
      finalHash = await bcrypt.hash(password, saltRounds);
    }

    const queryText = `
      INSERT INTO studenttb (email, password_hash, first_name, last_name, number)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
      email,
      password,
      first_name || null,
      last_name || null,
      number || null,
    ];
    
    const newStudent = await db.query(queryText, values);

    const newStudentId = Number(newStudent.insertId);

    // 3. SELECT ข้อมูลของแถวนั้นออกมา (เลียนแบบพฤติกรรม RETURNING)
    const selectQuery = `
      SELECT student_id, email, first_name, last_name, number 
      FROM studenttb 
      WHERE student_id = ?
    `;
    const studentData = await db.query(selectQuery, [newStudentId]);

    // 4. ส่งข้อมูลแถวนั้นกลับไปให้ React (studentData[0] คือ Object ข้อมูลแถวนั้น)
    res.status(201).json(studentData[0]);


    // res.status(201).json(newStudent[0]);

  } catch (err) {
    console.error('Database Connection Error:', err.message);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;