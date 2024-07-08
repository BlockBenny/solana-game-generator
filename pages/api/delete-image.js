import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { filepath } = req.body;

    if (!filepath) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    console.log('Deleting file at filepath: ' + filepath);
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        res.status(200).json({ message: 'File deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }

    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const client = await pool.connect();
      await client.query('DELETE FROM uploaded_files WHERE file_path = $1', [
        filepath,
      ]);
      client.release();
    } catch (error) {
      console.error('Error deleting file from database:', error);
      res.status(500).json({ error: 'Failed to delete file from database' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
