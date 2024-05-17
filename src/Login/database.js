const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'yashT2002!!',
    database: 'ChessDB'
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query('INSERT INTO Users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error inserting values');
        } else {
            res.send('Values Inserted');
        }
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
