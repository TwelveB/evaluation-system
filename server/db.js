const mariadb = require('mariadb');
require('dotenv').config();

// สร้าง Connection Pool เชื่อมต่อไปยัง mariadb
const pool = mariadb.createPool({
     host: process.env.DB_HOST, 
     user: process.env.DB_USER, 
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     //ฟังก์ชั่นเสริม
     connectionLimit: 5,
     insertIdAsNumber: true,
     bigIntAsNumber: true // 👈 เพิ่มบรรทัดนี้เพื่อให้แปลง BIGINT เป็น Number ใน JS
});

// ตรวจสอบการเชื่อมต่อ
pool.getConnection()
  .then(conn => {
    console.log('From db.js: Connected to MariaDB Database successfully Yay!');
    conn.release(); // อย่าลืมคืน connection เข้า pool
  })
  .catch(err => {
    console.error('From db.js: Error connecting to MariaDB:', err);
  });

module.exports = pool;