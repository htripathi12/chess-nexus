const express = require('express');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const router = express.Router();

router.post('/', (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    console.log(`Received signup request with email: ${email}`);
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error processing request');
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).send('Database query error');
            }
            if (result.length > 0) {
                return res.status(400).send('Email already in use');
            } else {
                db.query('INSERT INTO users (email, password, puzzlerating) VALUES (?, ?, ?)', [email, hash, 1800], (insertErr, insertResult) => {
                  if (insertErr) {
                    console.error('Error inserting user:', insertErr);
                    return res.status(500).send('Error inserting values');
                  }
                  return res.send('Values Inserted');
                });
            }
        });
    });
});

module.exports = router;