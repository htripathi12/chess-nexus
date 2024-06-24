const express = require('express');
const router = express.Router();

// Function to validate the vital PGN tags
const hasVitalTags = (pgn) => {
    const requiredTags = ['Event', 'Site', 'White', 'Black', 'Result', 'WhiteElo', 'BlackElo'];
    const tagPattern = /\[(\w+)\s+"([^"]+)"\]/g;
    const tags = {};
    let match;

    while ((match = tagPattern.exec(pgn)) !== null) {
        tags[match[1]] = match[2];
    }

    // Check if all required tags are present
    for (let tag of requiredTags) {
        if (!(tag in tags)) {
            return false;
        }
    }

    // Check if WhiteElo and BlackElo are valid integers
    const whiteElo = parseInt(tags['WhiteElo'], 10);
    const blackElo = parseInt(tags['BlackElo'], 10);

    if (isNaN(whiteElo) || isNaN(blackElo)) {
        return false;
    }

    return true;
};

router.post('/', (req, res) => {
    const { pgn } = req.body;

    if (hasVitalTags(pgn)) {
        res.json({ status: 'success', message: 'PGN has all vital tags and valid Elo ratings' });
    } else {
        res.json({ status: 'error', message: 'Missing vital PGN tags or invalid Elo ratings' });
    }
});

module.exports = router;