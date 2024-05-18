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
    const { email, password } = req.body;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error processing request');
        }

        console.log('Generated hash:', hash);

        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error inserting values');
            }
            res.send('Values Inserted');
        });
    });
});
