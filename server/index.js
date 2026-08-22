const express = require('express'); // นำเข้า Express.js สำหรับสร้าง Web Server
const cors = require('cors'); // นำเข้า CORS เพื่ออนุญาตให้ Frontend (ที่อยู่คนละ Port) เรียกใช้งาน API ได้
const path = require('path'); // นำเข้า path สำหรับจัดการเส้นทางของไฟล์และโฟลเดอร์
const db = require('./db'); // นำเข้าการตั้งค่าเชื่อมต่อฐานข้อมูล

require('dotenv').config(); // โหลดตัวแปรระบบจากไฟล์ .env

const app = express();

// ==========================================
// Middleware (ตัวกลางสำหรับจัดการ Request ก่อนไปถึง Route)
// ==========================================
app.use(cors()); // อนุญาตการร้องขอข้ามโดเมน (Cross-Origin Resource Sharing)
app.use(express.json()); // อนุญาตให้เซิร์ฟเวอร์รับส่งข้อมูลในรูปแบบ JSON ได้

// **ส่วนสำคัญสำหรับการเข้าถึงไฟล์**: เปิดให้โฟลเดอร์ 'uploads' เป็นแบบ Public 
// ทำให้ Frontend สามารถเข้าถึงไฟล์ (เช่น PDF) ผ่าน URL (เช่น http://localhost:5000/uploads/...) ได้โดยตรง
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// นำเข้า Routes (กลุ่มของ API ต่างๆ)
// ==========================================
const studentRoutes = require('./routes/student.js');
const adminRoutes = require('./routes/admin.js');
const assessorRoutes = require('./routes/assessor.js');
const loginRoutes = require('./routes/login.js');

const SECRET_KEY = process.env.SECRET_KEY || "1";

// ==========================================
// กำหนด Endpoint พื้นฐานให้กับ Routes แต่ละหมวดหมู่
// ==========================================
app.use('/api/students', studentRoutes); // API สำหรับนักศึกษาจะขึ้นต้นด้วย /api/students
app.use('/api/admins', adminRoutes);     // API สำหรับแอดมิน
app.use('/api/assessor', assessorRoutes); // API สำหรับผู้ประเมิน
app.use('/api/login', loginRoutes);      // API สำหรับระบบล็อกอิน

// ==========================================
// Route พิเศษสำหรับทดสอบว่าฐานข้อมูลเชื่อมต่อได้ปกติหรือไม่
// ==========================================
app.get('/api/check-db', async (req, res) => {
  try {
    const result = await db.query('SELECT version();');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Start Server (สั่งให้เซิร์ฟเวอร์เริ่มทำงาน)
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});