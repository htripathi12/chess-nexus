const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: puzzleRouter, loadPuzzles } = require('./randomPuzzle');
const db = require('./database');
const analyze = require('./analyze');

const app = express();
const PORT = process.env.PORT || 8080;
console.log('PORT:', PORT);

let puzzlesLoaded = false;
let loadPuzzlesPromise = loadPuzzles().then(() => {
    puzzlesLoaded = true;
    console.log('Puzzles loaded successfully.');
}).catch(err => {
    console.error('Failed to load puzzles:', err);
});

// Middleware to wait for puzzles to load
const waitForPuzzlesMiddleware = async (req, res, next) => {
    if (!puzzlesLoaded) {
        console.log('Waiting for puzzles to load');
        await loadPuzzlesPromise;
    }
    next();
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(cors());

// Use the waitForPuzzles middleware before the routes that depend on puzzles being loaded
app.use(waitForPuzzlesMiddleware);

// API routes
app.use("/login", db);
app.use("/puzzles", puzzleRouter);
app.use("/play", analyze);

// Serve the main HTML file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
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
