const fs = require('fs');
const readline = require('readline');
const express = require('express');
const csv = require('csv-parser');
const router = express.Router();

let totalLines = 0;
let isIndexReady = false;

// Determine the total number of lines when the server starts
const rl = readline.createInterface({
    input: fs.createReadStream('src/lichess_db_puzzle.csv'),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    totalLines++;
});

rl.on('close', () => {
    isIndexReady = true;
    console.log('CSV file successfully processed, total lines:', totalLines);
});

router.get('/', (req, res) => {
    if (!isIndexReady) {
        return res.status(500).send({ error: 'Indexing in progress, please try again later' });
    }

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
            const { FEN, Moves } = data;

            // Validate that FEN and Moves exist
            if (FEN && Moves) {
                res.send({ fen: FEN, moves: Moves });
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
