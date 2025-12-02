const express = require('express');
const { readData } = require('../../services/dataService');

const router = express.Router();

router.get('/stats', (req, res) => {
  const data = readData();
  res.json({
    totalUsers: data.users.length,
    totalConnections: data.connections.length,
    activeUsers: Math.floor(Math.random() * (data.users.length || 1))
  });
});

module.exports = router;
