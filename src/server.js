const express = require('express');
const cors = require('cors');
const { router: puzzleRouter, loadPuzzles } = require('./randomPuzzle');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/login", db);
app.use("/puzzles", puzzleRouter);
//
const startServer = async () => {
    try {
        await loadPuzzles();
        const server = app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use`);
                process.exit(1);
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (err) {
        console.error('Failed to load puzzles:', err);
    }
};

startServer();
