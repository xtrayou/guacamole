const express = require('express');
const { readData, writeData } = require('../../services/dataService');

const router = express.Router();

// List connections
router.get('/', (req, res) => {
  const data = readData();
  if (req.headers['hx-request']) {
    const rows = data.connections
      .map(
        (conn) => `
            <tr>
                <td>${conn.name}</td>
                <td>${conn.host}</td>
                <td>${conn.port}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editConnection(${conn.id}, '${conn.name}', '${conn.host}', ${conn.port}, '${conn.type}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/connections/${conn.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete connection '${conn.name}'?">Delete</button>
                </td>
            </tr>
        `
      )
      .join('');
    return res.send(rows);
  }
  res.json(data.connections);
});

// Create connection
router.post('/', (req, res) => {
  const data = readData();
  const newConn = {
    id: Date.now(),
    name: req.body.name,
    host: req.body.host,
    port: req.body.port,
    type: req.body.type || 'rdp'
  };
  data.connections.push(newConn);
  writeData(data);

  if (req.headers['hx-request']) {
    res.send(`
            <tr>
                <td>${newConn.name}</td>
                <td>${newConn.host}</td>
                <td>${newConn.port}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editConnection(${newConn.id}, '${newConn.name}', '${newConn.host}', ${newConn.port}, '${newConn.type}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/connections/${newConn.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete connection '${newConn.name}'?">Delete</button>
                </td>
            </tr>
        `);
  } else {
    res.json(newConn);
  }
});

// Update connection
router.put('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  const index = data.connections.findIndex((c) => c.id === id);

  if (index !== -1) {
    data.connections[index] = { ...data.connections[index], ...req.body };
    writeData(data);
    const conn = data.connections[index];

    if (req.headers['hx-request']) {
      res.send(`
                <td>${conn.name}</td>
                <td>${conn.host}</td>
                <td>${conn.port}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editConnection(${conn.id}, '${conn.name}', '${conn.host}', ${conn.port}, '${conn.type}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/connections/${conn.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete connection '${conn.name}'?">Delete</button>
                </td>
            `);
    } else {
      res.json(conn);
    }
  } else {
    res.status(404).json({ error: 'Connection not found' });
  }
});

// Delete connection
router.delete('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  data.connections = data.connections.filter((c) => c.id !== id);
  data.mappings = data.mappings.filter((m) => m.connectionId !== id);
  writeData(data);
  res.send('');
});

module.exports = router;
