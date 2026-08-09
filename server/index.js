const express = require('express');
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