import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userPublicKey, gameId } = req.query;

    if (!userPublicKey || !gameId) {
      return res
        .status(400)
        .json({ error: 'User public key and game ID are required' });
    }

    try {
      console.log('Fetching user files:', userPublicKey, 'for game:', gameId);
      const client = await pool.connect();
      const { rows } = await client.query(
        'SELECT id, filename, file_path FROM uploaded_files WHERE user_public_key = $1 AND game_id = $2 ORDER BY created_at DESC',
        [userPublicKey, gameId]
      );
      console.log('Fetched user files:', rows);
      client.release();

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching user files:', error);
      res.status(500).json({ error: 'Failed to fetch user files' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
