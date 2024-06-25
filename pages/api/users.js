import { Connection, PublicKey } from '@solana/web3.js';

// This is a mock database. In a real application, you'd use a proper database.
const users = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }

    if (!users.has(publicKey)) {
      users.set(publicKey, { publicKey });
      return res.status(201).json({ message: 'User created' });
    }

    return res.status(200).json({ message: 'User already exists' });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
