import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    try {
      const client = await pool.connect();

      // Check if user exists
      const { rows } = await client.query(
        'SELECT * FROM users WHERE public_key = $1',
        [publicKey]
      );

      if (rows.length === 0) {
        // User doesn't exist, create new user
        await client.query('INSERT INTO users (public_key) VALUES ($1)', [
          publicKey,
        ]);
        client.release();
        return res.status(201).json({ message: 'User created' });
      }

      client.release();
      return res.status(200).json({ message: 'User already exists' });
    } catch (error) {
      console.error('Error in user operation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
