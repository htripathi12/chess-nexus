/*  src/server/sendLichess.js  -------------------------------------- */
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

/* Helper: update username + PGNs ---------------------------------- */
async function updateLichessGames(db, lichessUsername, userId) {
  /* 1 · Verify user exists on Lichess ------------------------------ */
  try {
    await axios.get(`https://lichess.org/api/user/${lichessUsername}`);
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, msg: 'Lichess account not found' };
    }
    console.error('Lichess verify error:', err);
    throw { status: 500, msg: 'Error verifying Lichess account' };
  }

  /* 2 · Fetch PGNs for current month ------------------------------ */
  const now      = new Date();
  const since    = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const pgnRes   = await axios.get(
    `https://lichess.org/api/games/user/${lichessUsername}?since=${since}`,
    { headers: { Accept: 'application/x-chess-pgn' } }
  );

  /* 3 · Save username + PGNs -------------------------------------- */
  await db.execute(
    'UPDATE users_db.users SET lichess = ?, lichesspgns = ? WHERE id = ?',
    [lichessUsername, pgnRes.data, userId]
  );
}

/* ------------------------------------------------------------------
   GET /account/lichess?lichessUsername=foo
--------------------------------------------------------------------*/
router.get('/', async (req, res) => {
  const { lichessUsername } = req.query;
  const userId = req.userId;

  if (!lichessUsername) {
    return res.status(400).json({ message: 'lichessUsername query param required' });
  }

  try {
    await updateLichessGames(req.db, lichessUsername, userId);

    const [[row]] = await req.db.execute(
      'SELECT lichesspgns FROM users_db.users WHERE id = ?',
      [userId]
    );
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'Lichess PGNs fetched', pgnArray: row.lichesspgns });

  } catch (err) {
    return res.status(err.status || 500).json({ message: err.msg || 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { lichessUsername } = req.body;
  const userId = req.userId;

  if (!lichessUsername) {
    return res.status(400).json({ message: 'lichessUsername is required' });
  }

  try {
    await updateLichessGames(req.db, lichessUsername, userId);
    return res.json({ message: 'Lichess username updated successfully' });

  } catch (err) {
    return res.status(err.status || 500).json({ message: err.msg || 'Internal server error' });
  }
});

module.exports = router;