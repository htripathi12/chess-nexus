const fs = require('fs');
const express = require('express');
const csv = require('csv-parser');
const axios = require('axios');
const router = express.Router();

let puzzles = [];

const loadPuzzles = async () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream('src/lichess_db_puzzle.csv')
            .pipe(csv())
            .on('data', (data) => {
                puzzles.push(data);
            })
            .on('end', () => {
                console.log(`Loaded ${puzzles.length} puzzles`);
                resolve();
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

const averageRatings = async (chesscomUsername, lichessUsername) => {
    try {
        const ccTacticsRating = await axios.get(`https://www.chess.com/callback/member/stats/${chesscomUsername}`);
        let ccRating = ccTacticsRating.data.stats[2]['stats'].rating;

        const lcTacticsRating = await axios.get(`https://lichess.org/api/user/${lichessUsername}`);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return { ccRating: 1500, lcRating: 1500 };
    }
};

router.get("/averageRating", (req, res) => {
    const { chesscomUsername, lichessUsername } = req.query;
    console.log('Usernames:', chesscomUsername, lichessUsername);
    if (!chesscomUsername && !lichessUsername) {
        return res.status(400).send({ error: 'User not logged in' });
    }

    res.send({ rating: averageRatings(chesscomUsername, lichessUsername) });
});

router.get('/', (req, res) => {
    if (puzzles.length === 0) {
        return res.status(500).send({ error: 'No FENs loaded' });
    }

    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const { FEN, Moves, GameUrl, Rating } = puzzles[randomIndex];

    if (FEN && Moves) {
        res.send({ fen: FEN, moves: Moves, URL: GameUrl, rating: Rating });
    } else {
        res.status(500).send({ error: 'Invalid puzzle format' });
    }
});

module.exports = { router, loadPuzzles };