const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  console.log(`Received signup request with email: ${email}`);

  try {
    /* 1. Hash the password */
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    /* 2. Does the email already exist?  */
    const [exists] = await db.execute(
      'SELECT 1 FROM users_db.users WHERE email = ? LIMIT 1', [email]
    );
    if (exists.length) {
      return res.status(400).send('Email already in use');
    }

    await db.execute(
      'INSERT INTO users_db.users (email, password, puzzlerating) VALUES (?,?,?)', [email, hash, 1800]
    );

    return res.status(201).send('User created');
  } catch (err) {
    console.error('Signup DB error:', err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;