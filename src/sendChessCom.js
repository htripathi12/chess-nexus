const express = require('express');
const router = express.Router();


router.post("/", (req, res) => {
    const { chesscomUsername } = req.body;
    console.log(`Received Chess.com username: ${chesscomUsername}`);
    req.db.query('UPDATE users SET chesscom = ? WHERE id = ?', [chesscomUsername, 1], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send('Error updating user');
        }
    });
    res.json({ message: 'Received Chess.com username' });
});


module.exports = router;