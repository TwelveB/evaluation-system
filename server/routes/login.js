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
      'SELECT * FROM students WHERE student_code = ?',
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

//method post assessor login
router.post('/assessor', async (req, res) => {
  try {
    const { username, password} = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    //ค้นหาแอคเคาท์ที่มีอีเมลเดียวกันกับที่ส่งมา 1$ และหลัง , เอาไว้ป้องกัน SQL injection
    const result = await db.query(
      'SELECT * FROM assessors WHERE username = ?',
      [username]
    );
    
    if (result.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    };

    const assessor = result[0];

    const isMatch = await bcrypt.compare(password, assessor.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    //สร้าง JWT Token ส่งกลับไปฝั่ง Client
    const token = jwt.sign(
      { assessor_id: assessor.assessor_id, username: assessor.username },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      assessor: {
        assessor_id: assessor.assessor_id,
        first_name: assessor.first_name,
        username: assessor.username
      }
    });

  } catch (err) {
    console.error('Database Connection Error:', err.message);

    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;