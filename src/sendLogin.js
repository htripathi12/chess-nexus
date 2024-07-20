const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find a user with the provided email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Error querying database' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error during authentication' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;