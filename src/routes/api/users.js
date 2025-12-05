const express = require('express');
const { readData, writeData } = require('../../services/dataService');
const db = require('../../db');

const router = express.Router();

const useMysql = String(process.env.USE_MYSQL).toLowerCase() === 'true';

// List users
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;
  const search = req.query.search ? req.query.search.trim() : '';

  if (useMysql) {
    try {
      let countQuery = 'SELECT COUNT(*) as cnt FROM users';
      let selectQuery = 'SELECT id, username, role, full_name, desa, status FROM users';
      let queryParams = [];
      
      if (search) {
        const whereClause = ' WHERE username LIKE ? OR desa LIKE ? OR full_name LIKE ?';
        countQuery += whereClause;
        selectQuery += whereClause;
        queryParams = [`%${search}%`, `%${search}%`, `%${search}%`];
      }
      
      const [[countRow]] = await db.pool.query(countQuery, queryParams);
      const total = Number(countRow.cnt || 0);
      const [rows] = await db.pool.query(selectQuery + ' ORDER BY id LIMIT ? OFFSET ?', [...queryParams, limit, offset]);

      if (req.headers['hx-request']) {
        const html = rows
          .map(
            (user) => `
            <tr>
                <td>${user.username}</td>
                <td>${user.desa || '-'}</td>
                <td><span class="badge-${(user.role || '').toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}', '${user.desa || ''}')">Edit</button>
                    <button class="btn-sm btn-delete" data-id="${user.id}" onclick="deleteUser(${user.id})">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${user.id}, '${user.username}')">Manage Conns</button>
                </td>
            </tr>
        `
          )
          .join('');
        // include a pagination header so client can update controls if needed
        res.set('X-Total-Count', String(total));
        return res.send(html);
      }

      return res.json({ data: rows, total, page, limit });
    } catch (e) {
      console.error('Error fetching users from MySQL', e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  const data = readData();
  let filteredUsers = data.users;
  
  if (search) {
    filteredUsers = data.users.filter(user => 
      (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
      (user.desa && user.desa.toLowerCase().includes(search.toLowerCase())) ||
      (user.full_name && user.full_name.toLowerCase().includes(search.toLowerCase()))
    );
  }
  
  const total = filteredUsers.length;
  const pageItems = filteredUsers.slice(offset, offset + limit);

  if (req.headers['hx-request']) {
    const rows = pageItems
      .map(
        (user) => `
            <tr>
                <td>${user.username}</td>
                <td>${user.desa || '-'}</td>
                <td><span class="badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}', '${user.desa || ''}')">Edit</button>
                    <button class="btn-sm btn-delete" hx-delete="/api/users/${user.id}" hx-target="closest tr" hx-swap="outerHTML" data-confirm="Are you sure you want to delete user '${user.username}'?">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${user.id}, '${user.username}')">Manage Conns</button>
                </td>
            </tr>
        `
      )
      .join('');
    res.set('X-Total-Count', String(total));
    return res.send(rows);
  }

  res.json({ data: pageItems, total, page, limit });
});

// Create user
router.post('/', async (req, res) => {
  if (useMysql) {
    try {
      const { username, role = 'viewer', password, full_name = username, desa } = req.body;
      const [result] = await db.pool.query('INSERT INTO users (username, role, password, full_name, desa) VALUES (?, ?, ?, ?, ?)', [username, role, password, full_name, desa]);
      const newUserId = result.insertId;
      const newUser = { id: newUserId, username, role };

      if (req.headers['hx-request']) {
        res.send(`
            <tr>
                <td>${newUser.username}</td>
                <td>${newUser.desa || '-'}</td>
                <td><span class="badge-${newUser.role.toLowerCase()}">${newUser.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${newUser.id}, '${newUser.username}', '${newUser.role}', '${newUser.desa || ''}')">Edit</button>
                    <button class="btn-sm btn-delete" data-id="${newUser.id}" onclick="deleteUser(${newUser.id})">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${newUser.id}, '${newUser.username}')">Manage Conns</button>
                </td>
            </tr>
        `);
      } else {
        res.json(newUser);
      }
    } catch (e) {
      console.error('Error creating user in MySQL', e);
      res.status(500).json({ error: 'DB error' });
    }
    return;
  }

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
                <td>${newUser.desa || '-'}</td>
                <td><span class="badge-${newUser.role.toLowerCase()}">${newUser.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${newUser.id}, '${newUser.username}', '${newUser.role}', '${newUser.desa || ''}')">Edit</button>
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
router.put('/:id', async (req, res) => {
  if (useMysql) {
    try {
      const id = parseInt(req.params.id, 10);
      const fields = [];
      const params = [];
      if (req.body.username) {
        fields.push('username = ?');
        params.push(req.body.username);
      }
      if (req.body.role) {
        fields.push('role = ?');
        params.push(req.body.role);
      }
      if (req.body.full_name) {
        fields.push('full_name = ?');
        params.push(req.body.full_name);
      }
      if (req.body.desa) {
        fields.push('desa = ?');
        params.push(req.body.desa);
      }
      if (req.body.password) {
        fields.push('password = ?');
        params.push(req.body.password);
      }
      if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
      params.push(id);
      const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      await db.pool.query(sql, params);
      const [rows] = await db.pool.query('SELECT id, username, role, full_name, desa FROM users WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ error: 'User not found' });
      const user = rows[0];
      if (req.headers['hx-request']) {
        res.send(`
                <td>${user.username}</td>
                <td>${user.desa || '-'}</td>
                <td><span class="badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}', '${user.desa || ''}')">Edit</button>
                    <button class="btn-sm btn-delete" data-id="${user.id}" onclick="deleteUser(${user.id})">Delete</button>
                    <button class="btn-sm" onclick="manageConnections(${user.id}, '${user.username}')">Manage Conns</button>
                </td>
            `);
      } else {
        res.json(user);
      }
    } catch (e) {
      console.error('Error updating user in MySQL', e);
      res.status(500).json({ error: 'DB error' });
    }
    return;
  }

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
                <td>${user.desa || '-'}</td>
                <td><span class="badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <button class="btn-sm btn-edit" onclick="editUser(${user.id}, '${user.username}', '${user.role}', '${user.desa || ''}')">Edit</button>
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
router.delete('/:id', async (req, res) => {
  if (useMysql) {
    try {
      const id = parseInt(req.params.id, 10);
      await db.pool.query('DELETE FROM user_connections WHERE user_id = ?', [id]);
      await db.pool.query('DELETE FROM users WHERE id = ?', [id]);
      return res.send('');
    } catch (e) {
      console.error('Error deleting user in MySQL', e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  const data = readData();
  const id = parseInt(req.params.id, 10);
  data.users = data.users.filter((u) => u.id !== id);
  data.mappings = data.mappings.filter((m) => m.userId !== id);
  writeData(data);
  res.send('');
});

module.exports = router;
