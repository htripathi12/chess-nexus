const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/login', (req, res) => {
    const { email, password, regState } = req.body;

    console.log(`Received login/signup request with email: ${email} and state: ${regState}`);

    if (regState === 'signup') {
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
    } else if (regState === 'login') {
        db.query('SELECT password FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).send('Error processing request');
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return res.status(500).send('Error processing request');
                    }
                    isMatch ? res.send('Login successful') : res.status(401).send('Invalid password');
                });
            } else {
                res.status(404).send('User not found');
            }
        });
    } else {
        res.status(400).send('Invalid registration state');
    }
});
