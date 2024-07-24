const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    const { lichessUsername } = req.body;
    const userId = req.userId;

    console.log(`Received Lichess username: ${lichessUsername}`);

    req.db.query('UPDATE users SET lichess = ? WHERE id = ?', [lichessUsername, userId], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json({ message: 'Lichess username updated successfully' });
    });
});

module.exports = router;