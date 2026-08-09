const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route ดึงข้อมูลเวลาจาก PostgreSQL
app.get('/api/students', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "studentTB"');
    res.json(result.rows)
    // const result = await db.query('SELECT NOW()');
    // res.json({
    //    message: 'เชื่อมต่อ PostgreSQL สำเร็จ!',
    //    db_time: result.rows[0].now,
    // });
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
  }
});

//method post
app.post('/api/students', async (req, res) => {
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
      INSERT INTO public."studentTB" (email, password_hash, first_name, last_name, "number")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING "student_id", email, first_name, last_name, "number" 
    `;
    //Values ใช้ $ เพราะทำเป็นค่าไว้สำหรับใส่ค่าในอาเรย์ด้านล่าง เพื่อใช้กับ db.query(querytext, values ค่าที่นำไปแทนใน $1,$2)
    //Returining ใช้ให้ Postgres ส่งคืนค่ากลับมาตามค่าที่ระบุไว้
    
    const values = [
      email,
      finalHash,
      first_name || null,
      last_name || null,
      number || null,
    ];
    
    const newStudent = await db.query(queryText, values);
    res.status(201).json(newStudent.rows[0]);

  } catch (err) {
    console.error('Database Connection Error:', err.message);

    if (err.code === '23505') {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/api/check-db', async (req, res) => {
  try {
    const result = await db.query('SELECT version();');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});