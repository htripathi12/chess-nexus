const fs = require('fs');
const express = require('express');
const csv = require('csv-parser');
const router = express.Router();

let puzzles = [];

const loadPuzzles = async () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('src/lichess_db_puzzle.csv')
            .pipe(csv())
            .on('data', (data) => {
                puzzles.push(data);
            })
            .on('end', () => {
                console.log(`Loaded ${puzzles.length} puzzles`);
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

// Middleware to ensure puzzles are loaded before handling requests
router.use(async (req, res, next) => {
    if (puzzles.length === 0) {
        await loadPuzzles().catch(next);
    }
    next();
});

router.get('/rating', (req, res) => {
    const userId = req.userId;
    req.db.query('SELECT puzzlerating FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.send({ rating: 0 });
        }

        res.send({ rating: result[0].puzzlerating });
    });
});

router.get('/', (req, res) => {
    const userRating = parseInt(req.query.userRating, 10);
    const lowerBound = userRating - 200;
    const upperBound = userRating + 200;

    const filteredPuzzles = puzzles.filter(puzzle => {
        const puzzleRating = parseInt(puzzle.Rating, 10);
        return puzzleRating >= lowerBound && puzzleRating <= upperBound;
    });

    if (filteredPuzzles.length === 0) {
        return res.status(404).send({ error: 'No puzzles found within your rating range.' });
    }

    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    const { FEN, Moves, GameUrl, Rating } = filteredPuzzles[randomIndex];

    if (FEN && Moves) {
        res.send({ fen: FEN, moves: Moves, URL: GameUrl, rating: Rating });
    } else {
        res.status(500).send({ error: 'Invalid puzzle format' });
    }
});

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

module.exports = { router, loadPuzzles };