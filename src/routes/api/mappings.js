const express = require('express');
const { readData, writeData } = require('../../services/dataService');

const router = express.Router();

// Get mappings for user
router.get('/mappings/:userId', (req, res) => {
  const data = readData();
  const userId = parseInt(req.params.userId, 10);
  const userMappings = data.mappings.filter((m) => m.userId === userId).map((m) => m.connectionId);
  res.json({ mappings: userMappings, allConnections: data.connections });
});

// Modify mapping
router.post('/mappings', (req, res) => {
  const data = readData();
  const { userId, connectionId, action } = req.body;

  const uid = parseInt(userId, 10);
  const cid = parseInt(connectionId, 10);

  if (action === 'add') {
    if (!data.mappings.find((m) => m.userId === uid && m.connectionId === cid)) {
      data.mappings.push({ userId: uid, connectionId: cid });
    }
  } else if (action === 'remove') {
    data.mappings = data.mappings.filter((m) => !(m.userId === uid && m.connectionId === cid));
  }

  writeData(data);
  res.json({ success: true });
});

module.exports = router;
