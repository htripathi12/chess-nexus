const fs = require('fs');
const express = require('express');
const csv = require('csv-parser');
const router = express.Router();

const totalLines = 3954054;

router.get('/', (req, res) => {
    if (totalLines === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }

    const randomLine = Math.floor(Math.random() * totalLines) + 1;
    let currentLine = 0;
    const stream = fs.createReadStream('src/lichess_db_puzzle.csv').pipe(csv());

    stream.on('data', (data) => {
        currentLine++;
        if (currentLine === randomLine) {
            stream.destroy(); // Stop reading the file
            const { FEN, Moves, GameUrl } = data;

            // Validate that FEN and Moves exist
            if (FEN && Moves) {
                res.send({ fen: FEN, moves: Moves, URL: GameUrl });
            } else {
                res.status(500).send({ error: 'Invalid puzzle format' });
            }
        }
    });

    stream.on('error', (err) => {
        console.error('Error reading the CSV file:', err);
        res.status(500).send({ error: 'Error processing request' });
    });
});

module.exports = router;