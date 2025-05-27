const express = require('express');
const ChessWebAPI = require('chess-web-api');
const router = express.Router();

const chessAPI = new ChessWebAPI({
  requestTimeout: 30000
});


async function updateChessComGames(db, chesscomUsername, userId) {
  try { 
    await chessAPI.getPlayer(chesscomUsername); 
  } catch (error) { 
    throw { status: 400, msg: 'Invalid Chess.com username' }; 
  }

  await db.query(
    'UPDATE users SET chesscom = ? WHERE id = ?',
    [chesscomUsername, userId]
  );

  const archivesResponse = await chessAPI.getPlayerMonthlyArchives(chesscomUsername);
  if (!archivesResponse.body.archives || archivesResponse.body.archives.length === 0) {
    console.log(`No game archives found for ${chesscomUsername}`);
    await db.query(
      'UPDATE users SET chesscompgns = ? WHERE id = ?',
      ['', userId]
    );
    return;
  }

  const allArchives = archivesResponse.body.archives.slice().reverse();
  let allGames = [];
  const MAX_GAMES = 1000;
  
  for (const archiveUrl of allArchives) {
    if (allGames.length >= MAX_GAMES) {
      console.log(`Reached ${MAX_GAMES} game limit. Stopping fetch.`);
      break;
    }
    
    // URL format: https://api.chess.com/pub/player/{username}/games/{year}/{month}
    const urlParts = archiveUrl.split('/');
    const year = urlParts[urlParts.length - 2];
    const month = urlParts[urlParts.length - 1];
    
    console.log(`Fetching games for ${chesscomUsername} - ${year}/${month}`);
    
    try {
      const monthlyGames = await chessAPI.getPlayerCompleteMonthlyArchives(
        chesscomUsername,
        parseInt(year),
        parseInt(month)
      );
      
      if (monthlyGames.body.games && monthlyGames.body.games.length > 0) {
        const remainingCapacity = MAX_GAMES - allGames.length;
        const gamesToAdd = monthlyGames.body.games.slice(0, remainingCapacity);
        allGames = allGames.concat(gamesToAdd);
        
        console.log(`Added ${gamesToAdd.length} games from ${year}/${month}. Total: ${allGames.length}`);
      }
    } catch (error) {
      console.error(`Error fetching games for ${year}/${month}:`, error);
    }
  }

  /* Convert all games to PGN format */
  const pgnString = allGames.map(g => g.pgn).join('\n\n');
  await db.query(
    'UPDATE users SET chesscompgns = ? WHERE id = ?',
    [pgnString, userId]
  );
  
  console.log(`Stored ${allGames.length} games for ${chesscomUsername} (max: ${MAX_GAMES})`);
}

router.get('/', async (req, res) => {
  const { chesscomUsername } = req.query;
  const userId = req.userId;
  
  if (!chesscomUsername) {
    return res.status(400).json({ message: 'chesscomUsername query param required' });
  }

  try {
    await updateChessComGames(req.db, chesscomUsername, userId);

    const [rows] = await req.db.query(
      'SELECT chesscompgns FROM users WHERE id = ?',
      [userId]
    );
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json({ 
      message: 'Chess.com PGNs fetched', 
      pgnArray: rows[0].chesscompgns 
    });

  } catch (err) {
    console.error('Chess.com GET error:', err);
    return res.status(err.status || 500).json({ 
      message: err.msg || 'Internal server error' 
    });
  }
});

router.post('/', async (req, res) => {
  const { chesscomUsername } = req.body;
  const userId = req.userId;
  
  if (!chesscomUsername) {
    return res.status(400).json({ message: 'chesscomUsername is required' });
  }

  try {
    await updateChessComGames(req.db, chesscomUsername, userId);
    return res.json({ message: 'Chess.com username updated successfully' });

  } catch (err) {
    console.error('Chess.com POST error:', err);
    return res.status(err.status || 500).json({ 
      message: err.msg || 'Internal server error' 
    });
  }
});

module.exports = router;