const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET is not defined');
}

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  console.log(`Received login request with email: ${email}`);

  try {
    /* 1. Fetch the user row (schema-qualified) */
    const [rows] = await db.execute(
      'SELECT id, email, password, lichess, chesscom \
         FROM users_db.users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      lichessUsername: user.lichess,
      chesscomUsername: user.chesscom
    });

  } catch (err) {
    console.error('Login DB error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;