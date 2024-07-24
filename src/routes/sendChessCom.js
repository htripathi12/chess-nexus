const express = require('express');
const router = express.Router();
var ChessWebAPI = require('chess-web-api');

var chessAPI = new ChessWebAPI();

router.post("/", (req, res) => {
    const { chesscomUsername } = req.body;
    const userId = req.userId;
    console.log(`Received Chess.com username: ${chesscomUsername}`);

    // Check if the username is valid
    chessAPI.getPlayer(chesscomUsername).then((data) => {
        req.db.query('UPDATE users SET chesscom = ? WHERE id = ?', [chesscomUsername, userId], (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json({ message: 'Chess.com username updated successfully' });
        });
    }).catch((err) => {
        return res.status(500).json({ message: 'Invalid Chess.com username' });
    });
});

module.exports = router;