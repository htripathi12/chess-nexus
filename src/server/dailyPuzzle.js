const express = require('express');
var ChessWebAPI = require('chess-web-api');
const router = express.Router();
var chessAPI = new ChessWebAPI();

router.get("/", (req, res) => {
    chessAPI.getDailyPuzzleRandom().then((data) => {
        console.log(data);
        res.json({ puzzle: data });
    }).catch((err) => {
        console.error(err);
    });
});

module.exports = router;