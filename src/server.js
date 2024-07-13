const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: puzzleRouter, loadPuzzles } = require('./randomPuzzle');
const db = require('./database');
const analyze = require('./analyze');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/login", db);
app.use("/puzzles", puzzleRouter);
app.use("/play", analyze);

// Serve the main HTML file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
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
