const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "1";

//method post student login
router.post('/student', async (req, res) => {
  try {
    const { student_code, password} = req.body;
    
    if (!student_code || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    //ค้นหาแอคเคาท์ที่มีอีเมลเดียวกันกับที่ส่งมา 1$ และหลัง , เอาไว้ป้องกัน SQL injection
    const result = await db.query(
      'SELECT * FROM studenttb WHERE student_code = ?',
      [student_code]
    );
    
    if (result.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    };

    const student = result[0];

    const isMatch = await bcrypt.compare(password, student.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    //สร้าง JWT Token ส่งกลับไปฝั่ง Client
    const token = jwt.sign(
      { student_id: student.student_id, student_code: student.student_code },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      student: {
        student_id: student.student_id,
        first_name: student.first_name,
        last_name: student.last_name,
        student_code: student.student_code
      }
    });

  } catch (err) {
    console.error('Database Connection Error:', err.message);

    res.status(500).json({ error: 'Server Error' });
  }
});

//method post admin login
router.post('/admin', async (req, res) => {
  try {
    const { username, password} = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    //ค้นหาแอคเคาท์ที่มีอีเมลเดียวกันกับที่ส่งมา 1$ และหลัง , เอาไว้ป้องกัน SQL injection
    const result = await db.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    
    if (result.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    };

    const admin = result[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    //สร้าง JWT Token ส่งกลับไปฝั่ง Client
    const token = jwt.sign(
      { admin_id: admin.admin_id, username: admin.username },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      admin: {
        admin_id: admin.admin_id,
        first_name: admin.first_name,
        username: admin.username
      }
    });

  } catch (err) {
    console.error('Database Connection Error:', err.message);

    res.status(500).json({ error: 'Server Error' });
  }
});

//method post เพิ่มนักเรียน
router.post('/', async (req, res) => {
  try {
    const { student_code, password, first_name, last_name, phone_number, group } = req.body;
    
    if (!student_code || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // ทำการ Hash รหัสผ่านก่อนบันทึก (หากมีการส่งรหัสผ่านเข้ามา)
    let finalHash = null;
    if (password && password.trim() !== '') {
      const saltRounds = 10; // ระดับความซับซ้อนของการเข้ารหัส (มาตรฐานคือ 10)
      finalHash = await bcrypt.hash(password, saltRounds);
    }

    const queryText = `
      INSERT INTO students (
        student_code, 
        password_hash, 
        phone_number,
        first_name, 
        last_name,
        student_group
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      student_code,
      finalHash,
      phone_number || null,
      first_name,
      last_name,
      group || null,
    ];
    
    const newStudent = await db.query(queryText, values);

    const newStudentId = Number(newStudent.insertId);

    // 3. SELECT ข้อมูลของแถวนั้นออกมา (เลียนแบบพฤติกรรม RETURNING)
    const selectQuery = `
      SELECT student_id, student_code, first_name, last_name, phone_number 
      FROM students 
      WHERE student_id = ?
    `;
    const studentData = await db.query(selectQuery, [newStudentId]);

    // 4. ส่งข้อมูลแถวนั้นกลับไปให้ React (studentData[0] คือ Object ข้อมูลแถวนั้น)
    res.status(201).json(studentData[0]);
  } catch (err) {
    console.error('Database Connection Error:', err.message);

    if (err.code === '1062') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});


module.exports = router;