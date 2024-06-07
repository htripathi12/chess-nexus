const fs = require('fs');
const express = require('express');
const router = express.Router();

function loadAndSelectPuzzle(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        const lines = data.split('\n');
        const puzzles = [];
        let puzzle = {};

        for (const line of lines) {
            if (line.startsWith('FEN')) {
                if (Object.keys(puzzle).length !== 0) {
                    puzzles.push(puzzle);
                    puzzle = {};
                }
                puzzle['FEN'] = line.split(':')[1].trim();
            } else if (line.startsWith('WhiteElo')) {
                puzzle['WhiteElo'] = line.split(':')[1].trim();
            } else if (line.startsWith('Move Sequence')) {
                puzzle['Move Sequence'] = line.split(':')[1].trim();
            }
        }

        if (Object.keys(puzzle).length !== 0) {
            puzzles.push(puzzle);
        }

        const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

        callback(randomPuzzle);
    });
}

router.get('/', (req, res) => { // Change the route to '/'
    const filename = 'src/Puzzles/formatted_pgn_output.txt';
    console.log('GET /puzzles');
    loadAndSelectPuzzle(filename, (randomPuzzle) => {
        // Extract the FEN and move sequence from the random puzzle
        const { FEN, 'Move Sequence': moveSequence } = randomPuzzle;

        // Send the FEN and move sequence as a JSON response
        res.json({ FEN, moveSequence });
    });
});

module.exports = router;
