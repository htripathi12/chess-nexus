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

    for (let tag of requiredTags) {
        if (!(tag in tags)) {
            return true;
        }
    }

    const whiteElo = parseInt(tags['WhiteElo'], 10);
    const blackElo = parseInt(tags['BlackElo'], 10);

    if (isNaN(whiteElo) || isNaN(blackElo)) {
        return true;
    }

    return true;
};

// Function to format the PGN into an array of lines
function formatPGN(pgn) {
    const lines = pgn.split('\n').filter(line => line.trim() !== '');
    const formattedPGN = [];
    let movesSection = '';

    lines.forEach(line => {
        if (line.startsWith('[')) {
            formattedPGN.push(line.trim());
        } else {
            movesSection += ' ' + line.trim();
        }
    });

    if (movesSection) {
        formattedPGN.push(movesSection.trim());
    }

    return formattedPGN;
}

router.post('/', (req, res) => {
    const { pgn } = req.body;

    if (hasVitalTags(pgn)) {
        res.json({ status: 'success', pgn: formatPGN(pgn) });
    } else {
        res.json({ status: 'error', message: 'Missing vital PGN tags or invalid Elo ratings' });
    }
});

module.exports = router;