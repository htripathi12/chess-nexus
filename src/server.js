require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const puzzleRouter = require('./server/randomPuzzle');
const sendLogin = require('./server/sendLogin');
const sendSignup = require('./server/sendSignup');
const analyze = require('./server/analyze');
const chesscom = require('./server/sendChessCom');
const lichess = require('./server/sendLichess');
const deleteAccount = require('./server/deleteAccount');
const dailyPuzzle = require('./server/dailyPuzzle');

const app = express();

const PORT = process.env.PORT || 8080;
console.log('PORT:', PORT);

app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:', err.message);
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.userId = decoded.userId;
        console.log('Authenticated userId:', req.userId);
        next();
      });
    } else {
      console.warn('No Authorization header provided');
      res.status(403).json({ message: 'Token not provided' });
    }
};

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Middleware to attach db connection to req object
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use("/login", sendLogin);
app.use("/signup", sendSignup);
app.use("/puzzles", verifyToken, puzzleRouter);
app.use("/play", analyze);
app.use("/account/chesscom", verifyToken, chesscom);
app.use("/account/lichess", verifyToken, lichess);
app.use("/account", verifyToken, deleteAccount);
app.use("/puzzle", dailyPuzzle);

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const server = app.listen(PORT, "0.0.0.0",  () => {
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