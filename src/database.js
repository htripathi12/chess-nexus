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

router.post('/signup', (req, res) => {
    const { email, password, regState } = req.body;

    console.log(`Received login/signup request with email: ${email} and state: ${regState}`);
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error processing request');
        }
        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).send('Error inserting values');
            }
            res.send('Values Inserted');
        });
    });
});

module.exports = router;