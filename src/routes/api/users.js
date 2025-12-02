const express = require('express');
const { readData, writeData } = require('../../services/dataService');

const router = express.Router();

// List users
router.get('/', (req, res) => {
  const data = readData();
  if (req.headers['hx-request']) {
    const rows = data.users
      .map(
        (user) => `
            <tr>
                <td>${user.username}</td>
                <td><span class="badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/users/${user.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete user '${user.username}'?">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${user.id}, '${user.username}')">Manage Conns</button>
                </td>
            </tr>
        `
      )
      .join('');
    return res.send(rows);
  }
  res.json(data.users);
});

// Create user
router.post('/', (req, res) => {
  const data = readData();
  const newUser = {
    id: Date.now(),
    username: req.body.username,
    role: req.body.role || 'USER',
    password: req.body.password
  };
  data.users.push(newUser);
  writeData(data);

  if (req.headers['hx-request']) {
    res.send(`
            <tr>
                <td>${newUser.username}</td>
                <td><span class="badge-${newUser.role.toLowerCase()}">${newUser.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${newUser.id}, '${newUser.username}', '${newUser.role}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/users/${newUser.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete user '${newUser.username}'?">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${newUser.id}, '${newUser.username}')">Manage Conns</button>
                </td>
            </tr>
        `);
  } else {
    res.json(newUser);
  }
});

// Update user
router.put('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  const index = data.users.findIndex((u) => u.id === id);

  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...req.body };
    writeData(data);
    const user = data.users[index];

    if (req.headers['hx-request']) {
      res.send(`
                <td>${user.username}</td>
                <td><span class="badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/users/${user.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete user '${user.username}'?">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${user.id}, '${user.username}')">Manage Conns</button>
                </td>
            `);
    } else {
      res.json(user);
    }
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete user
router.delete('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  data.users = data.users.filter((u) => u.id !== id);
  data.mappings = data.mappings.filter((m) => m.userId !== id);
  writeData(data);
  res.send('');
});

module.exports = router;
