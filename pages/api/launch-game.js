import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { gameId, versionId, walletAddress } = req.body;

    if (!gameId || !versionId || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const client = await pool.connect();

      // Fetch the current version's HTML content
      const { rows: versionRows } = await client.query(
        'SELECT html_content FROM game_versions WHERE id = $1 AND game_id = $2',
        [versionId, gameId]
      );

      if (versionRows.length === 0) {
        client.release();
        return res.status(404).json({ error: 'Game version not found' });
      }

      const htmlContent = versionRows[0].html_content;

      // Create game.html file in the user's folder
      const userFolder = path.join(
        process.cwd(),
        'public',
        'uploads',
        walletAddress
      );
      const gameFilePath = path.join(userFolder, 'game.html');

      // Ensure the user folder exists
      await fs.mkdir(userFolder, { recursive: true });

      await fs.writeFile(gameFilePath, htmlContent);

      // Generate the new launch link
      const launchLink = `https://gamecraft.rocks/uploads/${walletAddress}/game.html`;

      // Update the game's launch status in the database
      const { rows } = await client.query(
        'UPDATE games SET is_launched = true, launch_link = $1 WHERE id = $2 RETURNING id, is_launched, launch_link',
        [launchLink, gameId]
      );

      client.release();

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.status(200).json({
        message: 'Game launched successfully',
        gameUrl: rows[0].launch_link,
      });
    } catch (error) {
      console.error('Error launching game:', error);
      res.status(500).json({ error: 'Failed to launch game' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
