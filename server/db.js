const { Pool } = require('pg');
require('dotenv').config();

// สร้าง Connection Pool เชื่อมต่อไปยัง PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ตรวจสอบการเชื่อมต่อ
pool.on('connect', () => {
  console.log('From db.js: Connected to PostgreSQL Database successfully Yay');
});

module.exports = {
  //ส่งออกให้สามารถใช้คำสั่ง query ได้ //เมื่อไฟล์อื่นเรียกใช้เช่น db.query ก็จะเรียก pool.query
  query: (text, params) => pool.query(text, params),
};