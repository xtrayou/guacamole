const express = require('express');
const { readData } = require('../../services/dataService');
let db;
try {
  db = require('../../db');
} catch (e) {
  db = null;
}

const router = express.Router();

router.get('/stats', async (req, res) => {
  const useMysql = String(process.env.USE_MYSQL).toLowerCase() === 'true' && db && db.pool;

  if (useMysql) {
    try {
      const [[uRow]] = await db.pool.query('SELECT COUNT(*) as cnt FROM users');
      const [[cRow]] = await db.pool.query('SELECT COUNT(*) as cnt FROM connections');
      const [[dRow]] = await db.pool.query('SELECT COUNT(DISTINCT desa) as cnt FROM users WHERE desa IS NOT NULL AND desa != ""');
      const totalUsers = Number(uRow.cnt || 0);
      const totalConnections = Number(cRow.cnt || 0);
      const totalDesa = Number(dRow.cnt || 0);
      // activeUsers: users with recent activity or random for demo
      const activeUsers = Math.floor(totalUsers * 0.7); // Assume 70% active
      return res.json({ totalUsers, totalConnections, activeUsers, totalDesa });
    } catch (e) {
      console.error('Error fetching stats from MySQL', e);
      // fall through to file-based
    }
  }

  const data = readData();
  const totalUsers = data.users.length;
  const totalConnections = data.connections.length;
  const uniqueDesa = [...new Set(data.users.map(u => u.desa).filter(d => d))].length;
  const activeUsers = Math.floor(totalUsers * 0.7); // Assume 70% active
  
  res.json({
    totalUsers,
    totalConnections,
    activeUsers,
    totalDesa: uniqueDesa
  });
});

module.exports = router;
