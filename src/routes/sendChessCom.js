const express = require('express');
const router = express.Router();
var ChessWebAPI = require('chess-web-api');

var chessAPI = new ChessWebAPI();

router.get("/", (req, res) => {
    const { chesscomUsername } = req.query;
    req.db.query('SELECT chesscompgns FROM users WHERE chesscom = ?', [chesscomUsername], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.json({ message: 'Chess.com pgns fetched', pgnArray: result[0].chesscompgns });
    });
});


router.post("/", (req, res) => {
    const { chesscomUsername } = req.body;
    const userId = req.userId;

    chessAPI.getPlayer(chesscomUsername).then((data) => {
        req.db.query('UPDATE users SET chesscom = ? WHERE id = ?', [chesscomUsername, userId], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            chessAPI.getPlayerCompleteMonthlyArchives(chesscomUsername, 2024, 7)
                .then(data => {
                    const pgnArray = data.body.games.map(game => game.pgn);
                    const pgnString = pgnArray.join('\n');
                    req.db.query('UPDATE users SET chesscompgns = ? WHERE id = ?', [pgnString, userId], (err, result) => {
                        if (err) {
                            console.error('Error updating user:', err);
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    });
                })
                .catch(err => {
                    console.error('Error checking Chess.com account:', err);
                });
            return res.json({ message: 'Chess.com username updated successfully' });
        });
    }).catch((err) => {
        return res.status(500).json({ message: 'Invalid Chess.com username' });
    });
});

module.exports = router;