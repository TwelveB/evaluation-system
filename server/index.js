const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');



require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const studentRoutes = require('./routes/student.js');

const SECRET_KEY = process.env.SECRET_KEY || "1";

app.use('/api/students', studentRoutes);

//method post login
app.post('/api/login/students/', async (req, res) => {
  try {
    const { email, password} = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    //ค้นหาแอคเคาท์ที่มีอีเมลเดียวกันกับที่ส่งมา 1$ และหลัง , เอาไว้ป้องกัน SQL injection
    const result = await db.query(
      'SELECT * FROM public."studentTB" WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    };

    const student = result.rows[0];

    const isMatch = await bcrypt.compare(password, student.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    //สร้าง JWT Token ส่งกลับไปฝั่ง Client
    const token = jwt.sign(
      { student_id: student.student_id, email: student.email },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      student: {
        student_id: student.student_id,
        first_name: student.first_name,
        email: student.email
      }
    });

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