const fs = require('fs');

let FEN = '';
let WhiteElo = '';
let MoveSequence = '';

function loadAndSelectPuzzle(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
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

// Usage
const filename = 'src/Puzzles/formatted_pgn_output.txt';
loadAndSelectPuzzle(filename, (randomPuzzle) => {
    FEN = randomPuzzle['FEN'];
    WhiteElo = randomPuzzle['WhiteElo'];
    MoveSequence = randomPuzzle['Move Sequence'];

    console.log(`FEN: ${FEN}`);
    console.log(`White Elo: ${WhiteElo}`);
    console.log(`Move Sequence: ${MoveSequence}`);
});