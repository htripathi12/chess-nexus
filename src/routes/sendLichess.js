const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post("/", async (req, res) => {
    const { lichessUsername } = req.body;
    const userId = req.userId;

    console.log(`Received Lichess username: ${lichessUsername}`);

    try {
        const lichessResponse = await axios.get(`https://lichess.org/api/user/${lichessUsername}`);
        
        if (lichessResponse.status === 200) {
            req.db.query('UPDATE users SET lichess = ? WHERE id = ?', [lichessUsername, userId], (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                res.json({ message: 'Lichess username updated successfully' });
            });
        } else {
            res.status(404).json({ message: 'Lichess account not found' });
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'Lichess account not found' });
        } else {
            console.error('Error checking Lichess account:', error);
            res.status(500).json({ message: 'Error verifying Lichess account' });
        }
    }
});

module.exports = router;