const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const router = express.Router();

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'yashT2002!!',
    database: 'ChessDB',
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        process.exit(1);
    }
    console.log('Connected to the database successfully');
});

router.post('/', (req, res) => {
    const { email, password } = req.body;

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
                // Email does not exist, proceed with insertion
                db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (insertErr, insertResult) => {
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