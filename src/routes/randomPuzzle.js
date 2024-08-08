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

router.get('/rating', (req, res) => {
    if (puzzles.length === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }

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
    }
    );
});

router.get('/', (req, res) => {
    if (puzzles.length === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }

    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const { FEN, Moves, GameUrl, Rating } = puzzles[randomIndex];

    if (FEN && Moves) {
        res.send({ fen: FEN, moves: Moves, URL: GameUrl, rating: Rating });
    } else {
        res.status(500).send({ error: 'Invalid puzzle format' });
    }
});

module.exports = { router, loadPuzzles };