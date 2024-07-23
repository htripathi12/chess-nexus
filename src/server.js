const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const { router: puzzleRouter, loadPuzzles } = require('./routes/randomPuzzle');
const sendLogin = require('./routes/sendLogin');
const sendSignup = require('./routes/sendSignup');
const analyze = require('./routes/analyze');
const chesscom = require('./routes/sendChessCom');
const lichess = require('./routes/sendLichess');

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

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.userId;
        next();
      });
    } else {
      res.status(403).json({ message: 'Token not provided' });
    }
};

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'yashT2002!!',
    database: 'ChessDB',
    port: '3306'
});

// Middleware to attach db connection to req object
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(cors());
app.use(waitForPuzzlesMiddleware);

app.use("/login", sendLogin);
app.use("/signup", sendSignup);
app.use("/puzzles", puzzleRouter);
app.use("/play", analyze);
app.use("/account/chesscom", verifyToken, chesscom);
app.use("/account/lichess", verifyToken, lichess);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

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
