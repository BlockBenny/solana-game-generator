import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new version for an existing game
    const { gameId, htmlContent, prompt } = req.body;

    try {
      const client = await pool.connect();

      // Get the latest version number
      const {
        rows: [latestVersion],
      } = await client.query(
        'SELECT MAX(version_number) as max_version FROM game_versions WHERE game_id = $1',
        [gameId]
      );

      const newVersionNumber = (latestVersion.max_version || 0) + 1;

      // Insert new version
      await client.query(
        'INSERT INTO game_versions (game_id, version_number, html_content, prompt) VALUES ($1, $2, $3, $4)',
        [gameId, newVersionNumber, htmlContent, prompt]
      );

      // Update the game's updated_at timestamp
      await client.query(
        'UPDATE games SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [gameId]
      );

      client.release();
      res.status(201).json({
        message: 'New version created successfully',
        versionNumber: newVersionNumber,
      });
    } catch (error) {
      console.error('Error creating game version:', error);
      res.status(500).json({ error: 'Failed to create game version' });
    }
  } else if (req.method === 'GET') {
    // Retrieve versions for a game
    const { gameId } = req.query;

    try {
      const client = await pool.connect();
      const { rows: versions } = await client.query(
        'SELECT * FROM game_versions WHERE game_id = $1 ORDER BY version_number DESC',
        [gameId]
      );
      client.release();
      res.status(200).json(versions);
    } catch (error) {
      console.error('Error fetching game versions:', error);
      res.status(500).json({ error: 'Failed to fetch game versions' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a specific version of a game
    const { gameId, versionNumber } = req.body;

    try {
      const client = await pool.connect();

      // Check if it's the only version
      const {
        rows: [versionCount],
      } = await client.query(
        'SELECT COUNT(*) FROM game_versions WHERE game_id = $1',
        [gameId]
      );

      if (versionCount.count === 1) {
        client.release();
        return res
          .status(400)
          .json({ error: 'Cannot delete the only version of a game' });
      }

      // Delete the version
      await client.query(
        'DELETE FROM game_versions WHERE game_id = $1 AND version_number = $2',
        [gameId, versionNumber]
      );

      client.release();
      res.status(200).json({ message: 'Version deleted successfully' });
    } catch (error) {
      console.error('Error deleting game version:', error);
      res.status(500).json({ error: 'Failed to delete game version' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
