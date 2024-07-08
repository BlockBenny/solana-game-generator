import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { gameId, walletAddress } = req.body;

    if (!gameId || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const client = await pool.connect();

      // Remove the game.html file from the user's folder
      const userFolder = path.join(
        process.cwd(),
        'public',
        'games',
        walletAddress
      );
      const gameFilePath = path.join(userFolder, 'game.html');

      try {
        await fs.unlink(gameFilePath);
      } catch (error) {
        console.error('Error deleting game.html:', error);
        // Continue even if file deletion fails
      }

      // Update the game's launch status in the database
      const { rows } = await client.query(
        'UPDATE games SET is_launched = false, launch_link = NULL WHERE id = $1 RETURNING id, is_launched, launch_link',
        [gameId]
      );
      client.release();

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.status(200).json({
        message: 'Game unlaunched successfully',
        game: rows[0],
      });
    } catch (error) {
      console.error('Error unlaunching game:', error);
      res.status(500).json({ error: 'Failed to unlaunch game' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
