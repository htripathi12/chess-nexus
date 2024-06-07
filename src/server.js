const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

const db = require('./database');
const puzzleRouter = require('./Puzzles/randomPuzzle');

app.use(express.json());
app.use(cors());
app.use("/login", db);
app.use("/puzzles", puzzleRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});