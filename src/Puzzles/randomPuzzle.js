const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('GET /puzzles');
    res.send("Hello from puzzles!");
});

module.exports = router;
