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

router.get('/', (req, res) => {
    if (puzzles.length === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }

    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const { FEN, Moves, GameUrl } = puzzles[randomIndex];

    // Validate that FEN and Moves exist
    if (FEN && Moves) {
        res.send({ fen: FEN, moves: Moves, URL: GameUrl });
    } else {
        res.status(500).send({ error: 'Invalid puzzle format' });
    }
});

module.exports = { router, loadPuzzles };