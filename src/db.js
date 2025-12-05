const mysql = require('mysql2/promise');

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'guacamole',
  DB_PORT = 3306,
  DB_CONNECTION_LIMIT = 10
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
  queueLimit: 0
});

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows && rows.length ? true : false;
  } catch (e) {
    console.error('MySQL test connection failed:', e.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
