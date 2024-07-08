// utils/dbInit.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Starting database initialization...');
    const sqlPath = path.join(process.cwd(), 'db', 'init.sql');
    console.log('SQL file path:', sqlPath);
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('SQL content:', sqlContent);

    await client.query(sqlContent);
    console.log('Database initialization SQL executed');

    // Verify tables were created
    const tables = ['users', 'games', 'game_versions'];
    for (const table of tables) {
      const result = await client.query(
        `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = $1
        );
      `,
        [table]
      );
      if (result.rows[0].exists) {
        console.log(`Table ${table} exists`);
      } else {
        throw new Error(`Table ${table} does not exist`);
      }
    }
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Re-throw the error to be caught in server.js
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };
