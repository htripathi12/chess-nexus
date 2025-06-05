require('dotenv-flow').config();
const express = require('express');
const router = express.Router();


router.get('/rating', async (req, res) => {
  const userId = req.userId;
  const db = req.db;

  try {
    const [[row]] = await db.execute(
      'SELECT puzzlerating FROM users_db.users WHERE id = ?',
      [userId]
    );
    if (!row) {
      return res.status(404).json({ error: 'No account found for the given user ID' });
    }
    return res.json({ rating: row.puzzlerating });

  } catch (err) {
    console.error('rating query error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  const userRating = Number(req.query.userRating);
  if (Number.isNaN(userRating)) {
    return res.status(400).json({ error: 'userRating query param is required and must be a number' });
  }

  const lower = Math.max(userRating - 25, 0);
  const upper = userRating + 25;
  const db = req.db;

  try {
    /* Count puzzles in range */
    const [[{ cnt }]] = await db.execute(
      `SELECT COUNT(*) AS cnt
         FROM railway.lichess_db_puzzle
        WHERE Rating BETWEEN ? AND ?`,
      [lower, upper]
    );
    console.log(`Found ${cnt} puzzles in range ${lower}-${upper}`);
    if (cnt === 0) {
      return res.status(404).json({ error: 'No puzzles found within your rating range.' });
    }

    const offset = Math.floor(Math.random() * cnt);
    const [[p]] = await db.execute(
    `SELECT FEN, Moves, Rating
        FROM railway.lichess_db_puzzle
        WHERE Rating BETWEEN ? AND ?
        LIMIT 1 OFFSET ${offset}`,
    [lower, upper]
    );


    return res.json({ fen: p.FEN, moves: p.Moves, rating: p.Rating });

  } catch (err) {
    console.error('random puzzle query error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/updateRating', async (req, res) => {
  const userId = req.userId;
  const { rating } = req.body;
  const db = req.db;

  try {
    const [result] = await db.execute(
      'UPDATE users_db.users SET puzzlerating = ? WHERE id = ?',
      [rating, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No account found for the given user ID' });
    }
    return res.json({ success: true });

  } catch (err) {
    console.error('update rating error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;