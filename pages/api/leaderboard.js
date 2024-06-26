import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { period } = req.query;
    let timeFrame;

    switch (period) {
      case 'daily':
        timeFrame = "NOW() - INTERVAL '1 day'";
        break;
      case 'weekly':
        timeFrame = "NOW() - INTERVAL '7 days'";
        break;
      case 'monthly':
        timeFrame = "NOW() - INTERVAL '30 days'";
        break;
      default:
        timeFrame = "NOW() - INTERVAL '30 days'";
    }

    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT u.username, SUM(p.points) as total_points
        FROM users u
        JOIN points p ON u.id = p.user_id
        WHERE p.timestamp > ${timeFrame}
        GROUP BY u.id, u.username
        ORDER BY total_points DESC
        LIMIT 10
      `);
      client.release();

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
