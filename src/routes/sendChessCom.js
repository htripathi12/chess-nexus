const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    const { chesscomUsername } = req.body;
    const userId = req.userId;

    console.log(`Received Chess.com username: ${chesscomUsername}`);

    req.db.query('UPDATE users SET chesscom = ? WHERE id = ?', [chesscomUsername, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Chess.com username updated successfully' });
    });
});

module.exports = router;