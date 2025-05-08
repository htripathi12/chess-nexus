require('dotenv-flow').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const url = require('url');

// Parse the MYSQL_PUBLIC_URL environment variable
const dbUrl = process.env.MYSQL_PUBLIC_URL;
const parsedUrl = new url.URL(dbUrl);

const db = mysql.createConnection({
    user: parsedUrl.username,
    host: parsedUrl.hostname,
    password: parsedUrl.password,
    database: parsedUrl.pathname.substring(1),
    port: parsedUrl.port,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Route to get the user's puzzle rating
router.get('/rating', (req, res) => {
    const userId = req.userId;
    req.db.query('SELECT puzzlerating FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).send({ error: 'No account found for the given user ID' });
        }

        res.send({ rating: result[0].puzzlerating });
    });
});

// Route to get a random puzzle within the user's rating range
router.get('/', (req, res) => {
    // Validate and parse the userRating from query parameter
    let userRating = parseInt(req.query.userRating, 10);

    const lowerBound = Math.max(userRating - 20, 0);
    const upperBound = userRating + 20;

    // Query a single random puzzle directly from the database
    const query = `
        SELECT * FROM lichess_db_puzzle 
        WHERE Rating BETWEEN ? AND ? 
        ORDER BY RAND() 
        LIMIT 1
    `;

    db.query(query, [lowerBound, upperBound], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }

        if (results.length === 0) {
          return res.status(404).send({ error: 'No puzzles found within your rating range.' });
        }
        const { FEN, Moves, GameUrl, Rating } = results[0];

        if (FEN && Moves) {
            res.send({ fen: FEN, moves: Moves, URL: GameUrl, rating: Rating });
        } else {
            res.status(500).send({ error: 'Invalid puzzle format' });
        }
    });
});

// Route to update the user's puzzle rating
router.post('/updateRating', (req, res) => {
    const userId = req.userId;
    const { rating } = req.body;

    req.db.query('UPDATE users SET puzzlerating = ? WHERE id = ?', [rating, userId], (err) => {
        if (err) {
            console.error('Error updating user rating:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }

        res.send({ success: true });
    });
});

module.exports = router;