require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'siskeudes_db',
  DB_PORT = 3306
} = process.env;

async function cleanupOldUsers() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT)
    });

    console.log('Database connection established');

    // Get old users (not from CSV import)
    const [oldUsers] = await connection.query(
      "SELECT id, username, desa FROM users WHERE username NOT LIKE 'admin_32%'"
    );

    console.log('Old users found:', oldUsers.length);
    oldUsers.forEach(user => {
      console.log(`- ${user.username} (${user.desa || 'no desa'})`);
    });

    if (oldUsers.length > 0) {
      // Delete old users
      const result = await connection.query(
        "DELETE FROM users WHERE username NOT LIKE 'admin_32%'"
      );
      
      console.log(`\nDeleted ${oldUsers.length} old users`);
    }

    // Show current stats
    const [[stats]] = await connection.query('SELECT COUNT(*) as total FROM users');
    console.log(`\nCurrent total users: ${stats.total}`);

  } catch (error) {
    console.error('Cleanup failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

cleanupOldUsers().catch(console.error);