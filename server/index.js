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
const adminRoutes = require('./routes/admin.js');
const loginRoutes = require('./routes/login.js');

const SECRET_KEY = process.env.SECRET_KEY || "1";

app.use('/api/students', studentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/login', loginRoutes);

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