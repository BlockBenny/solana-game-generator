import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, title, htmlContent, prompt } = req.body;

    try {
      const client = await pool.connect();

      // Create new game
      const {
        rows: [newGame],
      } = await client.query(
        'INSERT INTO games (user_public_key, title) VALUES ($1, $2) RETURNING id, title',
        [userId, title || 'Untitled Game']
      );

      // Create first version of the game
      await client.query(
        'INSERT INTO game_versions (game_id, version_number, html_content, prompt) VALUES ($1, $2, $3, $4)',
        [newGame.id, 1, htmlContent || '<div>New Game</div>', prompt || '']
      );

      client.release();
      res
        .status(201)
        .json({ message: 'Game created successfully', game: newGame });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const client = await pool.connect();
      const { rows: games } = await client.query(
        'SELECT * FROM games WHERE user_public_key = $1 ORDER BY created_at DESC',
        [userId]
      );
      client.release();
      console.log('Fetched games for user:', userId);
      console.log('Games:', games);

      if (games.length === 0) {
        console.log('No games found for user:', userId);
        // Create a default game if no games exist for the user
        const defaultGame = await createDefaultGame(userId);
        res.status(200).json([defaultGame]);
      } else {
        console.log('Games found for user:', userId);
        // prepare return of games
        res.status(200).json(games);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'PATCH') {
    const { gameId } = req.query;
    const { title } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'Game ID is required' });
    }

    try {
      const client = await pool.connect();
      const {
        rows: [updatedGame],
      } = await client.query(
        'UPDATE games SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title',
        [title, gameId]
      );
      client.release();

      if (updatedGame) {
        res
          .status(200)
          .json({ message: 'Game updated successfully', game: updatedGame });
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (req.method === 'DELETE') {
    const { versionId } = req.query;

    if (!versionId) {
      return res.status(400).json({ error: 'Version ID is required' });
    }

    try {
      const client = await pool.connect();

      // Check if this is the only version for the game
      const {
        rows: [versionCount],
      } = await client.query(
        'SELECT COUNT(*) FROM game_versions WHERE game_id = (SELECT game_id FROM game_versions WHERE id = $1)',
        [versionId]
      );

      if (parseInt(versionCount.count) === 1) {
        client.release();
        return res
          .status(400)
          .json({ error: 'Cannot delete the only version of a game' });
      }

      // Delete the version
      const { rowCount } = await client.query(
        'DELETE FROM game_versions WHERE id = $1',
        [versionId]
      );

      client.release();

      if (rowCount === 0) {
        return res.status(404).json({ error: 'Version not found' });
      }

      res.status(200).json({ message: 'Game version deleted successfully' });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function createDefaultGame(userId) {
  const client = await pool.connect();
  try {
    const {
      rows: [newGame],
    } = await client.query(
      'INSERT INTO games (user_public_key, title) VALUES ($1, $2) RETURNING id, title',
      [userId, 'Untitled Game']
    );

    await client.query(
      'INSERT INTO game_versions (game_id, version_number, html_content, prompt) VALUES ($1, $2, $3, $4)',
      [newGame.id, 1, '<div>New Game</div>', '']
    );

    return newGame;
  } finally {
    client.release();
  }
}
