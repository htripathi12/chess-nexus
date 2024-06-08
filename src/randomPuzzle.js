const fs = require('fs');
const express = require('express');
const csv = require('csv-parser');
const router = express.Router();

let fens = [];
let numFENs = 0;

// Read the CSV file and store FENs in memory when the server starts
fs.createReadStream('src/lichess_db_puzzle.csv')
    .pipe(csv())
    .on('data', (data) => {
        if (fens.length < 200) {
            fens.push(data.FEN);
        }
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

router.get('/', (req, res) => {
    if (fens.length === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }
    const randomFen = fens[Math.floor(Math.random() * fens.length)];
    res.send({ fen: randomFen });
    numFENs++;
    console.log(`FENs served: ${numFENs}`);
});

module.exports = router;