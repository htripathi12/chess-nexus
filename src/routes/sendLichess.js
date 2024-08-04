const express = require('express');
const router = express.Router();
const axios = require('axios');

// Function to update Lichess games
const updateLichessGames = async (req, lichessUsername, userId) => {
    try {
        const lichessResponse = await axios.get(`https://lichess.org/api/user/${lichessUsername}`);
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const sinceTimestamp = firstDayOfCurrentMonth.getTime();

        const userPGNs = await axios.get(`https://lichess.org/api/games/user/${lichessUsername}?since=${sinceTimestamp}`);

        if (lichessResponse.status === 200) {
            await new Promise((resolve, reject) => {
                req.db.query('UPDATE users SET lichess = ? WHERE id = ?', [lichessUsername, userId], (err, result) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return reject('Internal server error');
                    }
                    req.db.query('UPDATE users SET lichesspgns = ? WHERE id = ?', [userPGNs.data, userId], (err, result) => {
                        if (err) {
                            console.error('Error updating user:', err);
                            return reject('Internal server error');
                        }
                        resolve();
                    });
                });
            });
        } else {
            throw new Error('Lichess account not found');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('Lichess account not found');
        } else {
            console.error('Error checking Lichess account:', error);
            throw new Error('Error verifying Lichess account');
        }
    }
};

router.get("/", async (req, res) => {
    const { lichessUsername } = req.query;
    const userId = req.userId;

    try {
        await updateLichessGames(req, lichessUsername, userId);
        req.db.query('SELECT lichesspgns FROM users WHERE lichess = ?', [lichessUsername], (err, result) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            return res.json({ message: 'Lichess pgns fetched', pgnArray: result[0].lichesspgns });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const { lichessUsername } = req.body;
    const userId = req.userId;

    try {
        await updateLichessGames(req, lichessUsername, userId);
        res.json({ message: 'Lichess username updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;