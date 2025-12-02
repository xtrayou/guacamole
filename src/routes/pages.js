const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Home page -> serve public/index.html
router.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Admin dashboard -> concatenate header + content HTML
router.get('/admin-dashboard', (req, res) => {
  const headerPath = path.join(process.cwd(), 'views', 'admin_dashboard_header.html');
  const contentPath = path.join(process.cwd(), 'views', 'admin_dashboard.html');

  let header = '';
  let content = '';

  if (fs.existsSync(headerPath)) header = fs.readFileSync(headerPath, 'utf8');
  if (fs.existsSync(contentPath)) content = fs.readFileSync(contentPath, 'utf8');

  res.send(header + content);
});

// Simple mock login
router.post('/login', (req, res) => {
  const { username, password } = req.body; // eslint-disable-line no-unused-vars
  res.json({ success: true, message: 'Login berhasil', redirect: '/admin-dashboard' });
});

module.exports = router;
