const express = require('express');
const router = express.Router();
var ChessWebAPI = require('chess-web-api');
const currentDate = new Date();

var chessAPI = new ChessWebAPI();

// Function to update Chess.com games
const updateChessComGames = (req, chesscomUsername, userId) => {
    return new Promise((resolve, reject) => {
        chessAPI.getPlayer(chesscomUsername).then((data) => {
            req.db.query('UPDATE users SET chesscom = ? WHERE id = ?', [chesscomUsername, userId], (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return reject('Internal server error');
                }
                chessAPI.getPlayerCompleteMonthlyArchives(chesscomUsername, currentDate.getFullYear(), currentDate.getMonth() + 1)
                    .then(data => {
                        const pgnArray = data.body.games.map(game => game.pgn);
                        const pgnString = pgnArray.join('\n');
                        req.db.query('UPDATE users SET chesscompgns = ? WHERE id = ?', [pgnString, userId], (err, result) => {
                            if (err) {
                                console.error('Error updating user:', err);
                                return reject('Internal server error');
                            }
                            resolve();
                        });
                    })
                    .catch(err => {
                        console.error('Error checking Chess.com account:', err);
                        reject('Error checking Chess.com account');
                    });
            });
        }).catch((err) => {
            reject('Invalid Chess.com username');
        });
    });
};

router.get("/", (req, res) => {
    const { chesscomUsername } = req.query;
    const userId = req.userId;

    updateChessComGames(req, chesscomUsername, userId)
        .then(() => {
            req.db.query('SELECT chesscompgns FROM users WHERE chesscom = ?', [chesscomUsername], (err, result) => {
                if (err) {
                    console.error('Error fetching user:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                return res.json({ message: 'Chess.com pgns fetched', pgnArray: result[0].chesscompgns });
            });
        })
        .catch((err) => {
            return res.status(500).json({ message: err });
        });
});

router.post("/", (req, res) => {
    const { chesscomUsername } = req.body;
    const userId = req.userId;

    updateChessComGames(req, chesscomUsername, userId)
        .then(() => {
            return res.json({ message: 'Chess.com username updated successfully' });
        })
        .catch((err) => {
            return res.status(500).json({ message: err });
        });
});

module.exports = router;