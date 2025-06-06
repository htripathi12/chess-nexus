require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
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

// 1. Add cross-origin isolation headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

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
        //console.log('Authenticated userId:', req.userId);
        next();
      });
    } else {
      console.warn('No Authorization header provided');
      res.status(403).json({ message: 'Token not provided' });
    }
};

const pool = mysql.createPool({
    uri: process.env.MYSQL_PUBLIC_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'false'
      ? undefined
      : { rejectUnauthorized: false },
});

// Middleware to attach db connection to req object
app.use((req, res, next) => {
    req.db = pool;
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