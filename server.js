const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route utama untuk halaman login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk admin dashboard
app.get('/admin-dashboard', (req, res) => {
    const headerPath = path.join(__dirname, 'views', 'admin_dashboard_header.html');
    const contentPath = path.join(__dirname, 'views', 'admin_dashboard.html');
    
    const header = fs.readFileSync(headerPath, 'utf8');
    const content = fs.readFileSync(contentPath, 'utf8');
    
    res.send(header + content);
});

// Route untuk login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Untuk demo, terima semua login
    // Nanti bisa ditambahkan validasi username/password yang sebenarnya
    res.json({ 
        success: true, 
        message: 'Login berhasil',
        redirect: '/admin-dashboard'
    });
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`SISKEUDES Server Berjalan`);
    console.log(`Buka browser di: http://localhost:${PORT}`);
    console.log(`=============================================`);
});